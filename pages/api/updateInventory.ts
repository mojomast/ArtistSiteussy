import { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

interface InventoryUpdateRequest {
  id: string
  stripe_event_id?: string
}

interface Product {
  id: string
  sold: boolean
  inventory_quantity: number
  sales?: string[]
  [key: string]: any
}

interface StoreData {
  products_en: Product[]
  products_fr: Product[]
  [key: string]: any
}

const STORE_DATA_PATH = path.join(process.cwd(), 'data', 'store.json')

// In-process mutex for serializing concurrent calls per file path
const locks = new Map<string, (() => void)[]>()

function acquireLock(path: string): Promise<void> {
  if (!locks.has(path)) {
    locks.set(path, [])
    return Promise.resolve()
  }
  return new Promise(resolve => {
    locks.get(path)!.push(resolve)
  })
}

function releaseLock(path: string) {
  const queue = locks.get(path)
  if (queue && queue.length > 0) {
    const resolve = queue.shift()!
    resolve()
  } else {
    locks.delete(path)
  }
}

// Cache for store data to handle mocked fs in tests
const storeCache = new Map<string, StoreData>()

export function resetStoreData(initialData: StoreData) {
  storeCache.set(STORE_DATA_PATH, initialData)
}

export function clearStoreCache() {
  storeCache.clear()
}

// Exported function for unit testing
export async function updateInventoryItem(
  id: string,
  stripeEventId?: string
): Promise<{
  success: boolean
  message?: string
  product?: Product
  error?: string
}> {
  await acquireLock(STORE_DATA_PATH)
  try {
    let storeData: StoreData
    if (storeCache.has(STORE_DATA_PATH)) {
      storeData = storeCache.get(STORE_DATA_PATH)!
    } else {
      storeData = JSON.parse(await fs.readFile(STORE_DATA_PATH, 'utf-8'))
      storeCache.set(STORE_DATA_PATH, storeData)
    }

    let product: Product | undefined

    // Update English products
    for (const p of storeData.products_en) {
      if (p.id === id) {
        if (p.sold || p.inventory_quantity <= 0) {
          return { success: false, message: 'Product already sold', product: p }
        }
        p.inventory_quantity -= 1
        if (p.inventory_quantity === 0) p.sold = true
        p.sales = p.sales || []
        if (stripeEventId) p.sales.push(stripeEventId)
        product = p
        break
      }
    }

    // Update French products if not found in English
    if (!product) {
      for (const p of storeData.products_fr) {
        if (p.id === id) {
          if (p.sold || p.inventory_quantity <= 0) {
            return { success: false, message: 'Product already sold', product: p }
          }
          p.inventory_quantity -= 1
          if (p.inventory_quantity === 0) p.sold = true
          p.sales = p.sales || []
          if (stripeEventId) p.sales.push(stripeEventId)
          product = p
          break
        }
      }
    }

    if (!product) {
      return {
        success: false,
        message: 'Product not found',
        error: `No product found with ID: ${id}`
      }
    }

    // Update cache
    storeCache.set(STORE_DATA_PATH, storeData)

    // Atomic write: write to temp file then rename
    const tempPath = `${STORE_DATA_PATH}.tmp`
    await fs.writeFile(tempPath, JSON.stringify(storeData, null, 2))
    await fs.rename(tempPath, STORE_DATA_PATH)

    return { success: true, message: 'Inventory updated successfully', product }
  } catch (error) {
    console.error('Error updating inventory:', error)
    return {
      success: false,
      message: 'Failed to update inventory',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  } finally {
    releaseLock(STORE_DATA_PATH)
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const body: InventoryUpdateRequest = req.body

    if (!body.id) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['id']
      })
    }

    const result = await updateInventoryItem(body.id, body.stripe_event_id)

    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(400).json(result)
    }

  } catch (error) {
    console.error('Inventory update handler error:', error)
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
}