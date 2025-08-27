import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes (excluding login page)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    // Check for authentication cookie
    const authCookie = request.cookies.get('admin-auth')

    if (!authCookie) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify the cookie (simple check)
    const expectedAuth = Buffer.from(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`).toString('base64')
    if (authCookie.value !== expectedAuth) {
      // Invalid cookie, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}