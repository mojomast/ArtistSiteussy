import fs from 'fs/promises'
import path from 'path'
import type { SiteMeta, PortfolioData, EventsData, CommissionsData, StoreData } from './types'

const dataFolder = path.join(process.cwd(), 'public')

export async function loadSiteMeta(): Promise<SiteMeta> {
  const filePath = path.join(dataFolder, 'siteMeta.json')
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

export async function loadPortfolio(): Promise<PortfolioData> {
  const filePath = path.join(dataFolder, 'portfolio.json')
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

export async function loadEvents(): Promise<EventsData> {
  const filePath = path.join(dataFolder, 'events.json')
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

export async function loadCommissions(): Promise<CommissionsData> {
  const filePath = path.join(dataFolder, 'commissions.json')
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}

export async function loadStore(): Promise<StoreData> {
  const filePath = path.join(dataFolder, 'store.json')
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data)
}