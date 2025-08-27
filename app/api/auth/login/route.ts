import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Check credentials
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
      // Create auth cookie
      const authValue = Buffer.from(`${username}:${password}`).toString('base64')

      const response = NextResponse.json({ success: true })

      // Set cookie with 24 hour expiration
      response.cookies.set('admin-auth', authValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      })

      return response
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )
  }
}