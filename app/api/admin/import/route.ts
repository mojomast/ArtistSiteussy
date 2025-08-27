import { NextRequest, NextResponse } from 'next/server'
import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const mkdir = promisify(fs.mkdir)
const rm = promisify(fs.rm)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check if it's a zip file
    if (!file.name.endsWith('.zip')) {
      return NextResponse.json(
        { error: 'File must be a zip file' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Create AdmZip instance
    const zip = new AdmZip(buffer)

    // Get zip entries
    const zipEntries = zip.getEntries()

    // Check if zip contains data and public folders
    const hasDataFolder = zipEntries.some(entry => entry.entryName.startsWith('data/'))
    const hasPublicFolder = zipEntries.some(entry => entry.entryName.startsWith('public/'))

    if (!hasDataFolder && !hasPublicFolder) {
      return NextResponse.json(
        { error: 'Zip file must contain data/ or public/ folders' },
        { status: 400 }
      )
    }

    const cwd = process.cwd()

    // Backup current folders (optional - could be removed if not needed)
    const backupData = path.join(cwd, 'data_backup')
    const backupPublic = path.join(cwd, 'public_backup')

    try {
      // Remove existing backup folders if they exist
      if (fs.existsSync(backupData)) {
        await rm(backupData, { recursive: true, force: true })
      }
      if (fs.existsSync(backupPublic)) {
        await rm(backupPublic, { recursive: true, force: true })
      }

      // Rename current folders to backup
      if (fs.existsSync(path.join(cwd, 'data'))) {
        fs.renameSync(path.join(cwd, 'data'), backupData)
      }
      if (fs.existsSync(path.join(cwd, 'public'))) {
        fs.renameSync(path.join(cwd, 'public'), backupPublic)
      }

      // Extract the zip file
      zip.extractAllTo(cwd, true)

      // Move JSON files from extracted data folder to public folder (for backward compatibility)
      const extractedDataPath = path.join(cwd, 'data')
      const extractedPublicPath = path.join(cwd, 'public')
      if (fs.existsSync(extractedDataPath)) {
        const jsonFiles = ['siteMeta.json', 'events.json', 'commissions.json', 'portfolio.json', 'store.json']
        jsonFiles.forEach(fileName => {
          const srcPath = path.join(extractedDataPath, fileName)
          const destPath = path.join(extractedPublicPath, fileName)
          if (fs.existsSync(srcPath)) {
            // Ensure public directory exists
            if (!fs.existsSync(extractedPublicPath)) {
              fs.mkdirSync(extractedPublicPath, { recursive: true })
            }
            // Move the file
            fs.renameSync(srcPath, destPath)
          }
        })
        // Remove the data folder if it's now empty or only contains non-JSON files
        try {
          await rm(extractedDataPath, { recursive: true, force: true })
        } catch (error) {
          // Ignore error if data folder still has files
        }
      }

      // Remove backup folders after successful extraction
      if (fs.existsSync(backupData)) {
        await rm(backupData, { recursive: true, force: true })
      }
      if (fs.existsSync(backupPublic)) {
        await rm(backupPublic, { recursive: true, force: true })
      }

      return NextResponse.json({
        message: 'Import successful',
        imported: {
          data: hasDataFolder,
          public: hasPublicFolder,
          jsonFilesMoved: hasDataFolder
        }
      })

    } catch (extractError) {
      // Restore from backup if extraction failed
      try {
        if (fs.existsSync(backupData)) {
          if (fs.existsSync(path.join(cwd, 'data'))) {
            await rm(path.join(cwd, 'data'), { recursive: true, force: true })
          }
          fs.renameSync(backupData, path.join(cwd, 'data'))
        }
        if (fs.existsSync(backupPublic)) {
          if (fs.existsSync(path.join(cwd, 'public'))) {
            await rm(path.join(cwd, 'public'), { recursive: true, force: true })
          }
          fs.renameSync(backupPublic, path.join(cwd, 'public'))
        }
      } catch (restoreError) {
        console.error('Failed to restore from backup:', restoreError)
      }

      throw extractError
    }

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to import data' },
      { status: 500 }
    )
  }
}