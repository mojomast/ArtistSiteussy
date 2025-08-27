import { NextApiRequest, NextApiResponse } from 'next'
import { loadPortfolio } from '../../lib/dataLoader'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await loadPortfolio()
      res.status(200).json(data)
    } catch (error) {
      console.error('Error loading portfolio:', error)
      res.status(500).json({ error: 'Failed to load portfolio data' })
    }
  } else if (req.method === 'POST') {
    try {
      // TODO: Implement saving functionality
      res.status(501).json({ error: 'Saving not yet implemented' })
    } catch (error) {
      console.error('Error saving portfolio:', error)
      res.status(500).json({ error: 'Failed to save portfolio data' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
