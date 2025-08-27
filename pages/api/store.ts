import { NextApiRequest, NextApiResponse } from 'next'
import { loadStore } from '../../lib/dataLoader'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await loadStore()
      res.status(200).json(data)
    } catch (error) {
      console.error('Error loading store:', error)
      res.status(500).json({ error: 'Failed to load store data' })
    }
  } else if (req.method === 'POST') {
    try {
      // TODO: Implement saving functionality
      res.status(501).json({ error: 'Saving not yet implemented' })
    } catch (error) {
      console.error('Error saving store:', error)
      res.status(500).json({ error: 'Failed to save store data' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
