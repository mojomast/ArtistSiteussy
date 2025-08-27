import { NextApiRequest, NextApiResponse } from 'next'

interface CommissionRequest {
  name: string
  email: string
  phone?: string
  commissionType: string
  description: string
  budget?: string
  timeline?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const body: CommissionRequest = req.body

    // Basic validation
    if (!body.name || !body.email || !body.commissionType || !body.description) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['name', 'email', 'commissionType', 'description']
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    // Validate commission type
    const validTypes = ['portrait', 'live-event', 'custom', 'mural']
    if (!validTypes.includes(body.commissionType)) {
      return res.status(400).json({
        message: 'Invalid commission type',
        validTypes
      })
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Create calendar event
    // 4. Send notification to artist

    console.log('Commission request received:', {
      ...body,
      timestamp: new Date().toISOString()
    })

    return res.status(200).json({
      message: 'Commission request submitted successfully',
      requestId: `commission_${Date.now()}`,
      status: 'pending'
    })

  } catch (error) {
    console.error('Commission submission error:', error)
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
}