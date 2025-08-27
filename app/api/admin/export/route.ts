import { NextRequest, NextResponse } from 'next/server'
import archiver from 'archiver'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level
    })

    // Set the archive name
    const fileName = `cedric-site-backup-${new Date().toISOString().split('T')[0]}.zip`

    // Collect archive data in a buffer
    const buffers: Buffer[] = []
    archive.on('data', (chunk: Buffer) => {
      buffers.push(chunk)
    })

    // Add public folder contents (images and assets)
    const publicPath = path.join(process.cwd(), 'public')
    if (fs.existsSync(publicPath)) {
      archive.directory(publicPath, 'public')
    }

    // Add JSON files from public folder to a data folder in the archive for backward compatibility
    if (fs.existsSync(publicPath)) {
      const jsonFiles = ['siteMeta.json', 'events.json', 'commissions.json', 'portfolio.json', 'store.json']
      jsonFiles.forEach(fileName => {
        const filePath = path.join(publicPath, fileName)
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: `data/${fileName}` })
        }
      })
    }

    // Handle archive errors
    archive.on('error', (err) => {
      throw err
    })

    // Finalize the archive
    archive.finalize()

    // Wait for archive to complete
    await new Promise<void>((resolve, reject) => {
      archive.on('end', () => resolve())
      archive.on('error', reject)
    })

    // Combine all buffers
    const zipBuffer = Buffer.concat(buffers)

    // Return response with zip data
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to create export' },
      { status: 500 }
    )
  }
}