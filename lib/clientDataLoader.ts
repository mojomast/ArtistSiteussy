// Note: loadSiteMeta has been moved to ClientWrapper as loadSiteMetaStatic for static compatibility

export async function loadPortfolio(): Promise<any> {
  const response = await fetch('/portfolio.json')
  if (!response.ok) {
    throw new Error('Failed to load portfolio')
  }
  return response.json()
}

export async function loadEvents(): Promise<any> {
  const response = await fetch('/events.json')
  if (!response.ok) {
    throw new Error('Failed to load events')
  }
  return response.json()
}

export async function loadCommissions(): Promise<any> {
  const response = await fetch('/commissions.json')
  if (!response.ok) {
    throw new Error('Failed to load commissions')
  }
  return response.json()
}

export async function loadStore(): Promise<any> {
  const response = await fetch('/store.json')
  if (!response.ok) {
    throw new Error('Failed to load store')
  }
  return response.json()
}