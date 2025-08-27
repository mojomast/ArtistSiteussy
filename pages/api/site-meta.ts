import { NextApiRequest, NextApiResponse } from 'next'
import { loadSiteMeta } from '../../lib/dataLoader'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await loadSiteMeta()
      res.status(200).json(data)
    } catch (error) {
      console.error('Error loading site meta:', error)
      res.status(500).json({ error: 'Failed to load site meta data' })
    }
  } else if (req.method === 'POST') {
    try {
      // TODO: Implement saving functionality
      res.status(501).json({ error: 'Saving not yet implemented' })
    } catch (error) {
      console.error('Error saving site meta:', error)
      res.status(500).json({ error: 'Failed to save site meta data' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
