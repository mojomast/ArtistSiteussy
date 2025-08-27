import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const { file, data } = await request.json()

    if (!file || !data) {
      return NextResponse.json(
        { success: false, error: 'File and data are required' },
        { status: 400 }
      )
    }

    // Validate file path to prevent directory traversal
    const allowedFiles = [
      'siteMeta.json',
      'portfolio.json',
      'events.json',
      'commissions.json',
      'store.json'
    ]

    if (!allowedFiles.includes(file)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file' },
        { status: 400 }
      )
    }

    // Write to file atomically
    const filePath = join(process.cwd(), 'public', file)
    const jsonData = JSON.stringify(data, null, 2)

    await writeFile(filePath, jsonData, 'utf8')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save file' },
      { status: 500 }
    )
  }
}