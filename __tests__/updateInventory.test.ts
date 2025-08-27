import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { promises as fs } from 'fs'
import { updateInventoryItem, clearStoreCache } from '../pages/api/updateInventory'

// Mock fs module
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
    rename: vi.fn(),
  },
}))

const mockFs = fs as any

describe('updateInventoryItem', () => {
  const mockStoreData = {
    products_en: [
      {
        id: 'urban-portrait-7',
        title: 'Urban Portrait #7',
        sold: false,
        inventory_quantity: 1,
        price: 1800,
        currency: 'CAD'
      },
      {
        id: 'abstract-rhythm-series-3',
        title: 'Abstract Rhythm Series - Piece 3',
        sold: false,
        inventory_quantity: 2,
        price: 1200,
        currency: 'CAD'
      }
    ],
    products_fr: [
      {
        id: 'urban-portrait-7',
        title: 'Portrait urbain #7',
        sold: false,
        inventory_quantity: 1,
        price: 1800,
        currency: 'CAD'
      },
      {
        id: 'abstract-rhythm-series-3',
        title: 'Série Rythme abstrait - Pièce 3',
        sold: false,
        inventory_quantity: 2,
        price: 1200,
        currency: 'CAD'
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockFs.readFile.mockResolvedValue(JSON.stringify(mockStoreData))
    mockFs.writeFile.mockResolvedValue(undefined)
    mockFs.rename.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should handle normal sale (inventory 1 → sold true, quantity 0)', async () => {
    const result = await updateInventoryItem('urban-portrait-7', 'stripe_event_123')

    expect(result.success).toBe(true)
    expect(result.message).toBe('Inventory updated successfully')
    expect(result.product).toBeDefined()
    expect(result.product.sold).toBe(true)
    expect(result.product.inventory_quantity).toBe(0)

    // Verify file operations were called
    expect(mockFs.readFile).toHaveBeenCalledTimes(1)
    expect(mockFs.writeFile).toHaveBeenCalledTimes(1)
    expect(mockFs.rename).toHaveBeenCalledTimes(1)
  })

  it('should handle id not found error', async () => {
    const result = await updateInventoryItem('non-existent-id', 'stripe_event_123')

    expect(result.success).toBe(false)
    expect(result.message).toBe('Product not found')
    expect(result.error).toContain('No product found with ID: non-existent-id')

    // File operations should not be called for writing
    expect(mockFs.writeFile).not.toHaveBeenCalled()
    expect(mockFs.rename).not.toHaveBeenCalled()
  })

  it('should handle concurrent-like update simulation (second update fails)', async () => {
    // First update - should succeed
    const firstResult = await updateInventoryItem('abstract-rhythm-series-3', 'stripe_event_1')
    expect(firstResult.success).toBe(true)
    expect(firstResult.product.inventory_quantity).toBe(1) // 2 - 1 = 1

    // Second update - should succeed (inventory still available)
    const secondResult = await updateInventoryItem('abstract-rhythm-series-3', 'stripe_event_2')
    expect(secondResult.success).toBe(true)
    expect(secondResult.product.inventory_quantity).toBe(0) // 1 - 1 = 0

    // Third update - should fail (already sold/no inventory)
    const thirdResult = await updateInventoryItem('abstract-rhythm-series-3', 'stripe_event_3')
    expect(thirdResult.success).toBe(false)
    expect(thirdResult.message).toBe('Product already sold')
  })

  it('should handle file system errors', async () => {
    clearStoreCache() // Clear cache to force file system read
    mockFs.readFile.mockRejectedValue(new Error('File system error'))

    const result = await updateInventoryItem('urban-portrait-7', 'stripe_event_123')

    expect(result.success).toBe(false)
    expect(result.message).toBe('Failed to update inventory')
    expect(result.error).toBe('File system error')
  })

  it('should handle invalid JSON in store file', async () => {
    clearStoreCache() // Clear cache to force file system read
    mockFs.readFile.mockResolvedValue('invalid json')

    const result = await updateInventoryItem('urban-portrait-7', 'stripe_event_123')

    expect(result.success).toBe(false)
    expect(result.message).toBe('Failed to update inventory')
    expect(result.error).toContain('Unexpected token')
  })
})