// * Dedicated BFF route for registration
// * Intentionally DOES NOT attach Authorization header from session cookie
// * This avoids 401/404 behaviors when backend expects anonymous register

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiBaseUrl) {
    return NextResponse.json({ success: false, message: 'API base URL not configured' }, { status: 500 })
  }

  const baseUrlRaw = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl
  const baseUrl = /\/api$/i.test(baseUrlRaw) ? baseUrlRaw : `${baseUrlRaw}/api`
  const targetUrl = `${baseUrl}/v1/users/auth/register`

  let body: any = null
  try {
    body = await request.json()
  } catch (_) {
    // ignore, backend may accept empty body but here we expect JSON
  }

  const headers = new Headers()
  headers.set('Accept', 'application/json')
  headers.set('Content-Type', 'application/json')
  // * Do NOT set Authorization here

  const upstream = await fetch(targetUrl, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
    // Do not forward cookies upstream
    credentials: 'omit',
  })

  const text = await upstream.text()
  // passthrough status and body
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
    }
  })
}


