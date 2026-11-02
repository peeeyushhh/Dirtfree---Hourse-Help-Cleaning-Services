import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/security/rate-limiter';
import { AuthGuard } from '@/lib/security/auth-guard';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = AuthGuard.getClientIp(request);

  // 1. CORS Preflight Handling for API
  if (request.method === 'OPTIONS') {
    const preflight = new NextResponse(null, { status: 204 });
    applySecurityHeaders(preflight);
    applyCorsHeaders(preflight, request);
    return preflight;
  }

  // 2. Protect /api/v1 endpoints with Rate Limiting
  if (pathname.startsWith('/api/v1')) {
    const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
    const endpointType = isWrite ? 'WRITE' : pathname.includes('/bookings') ? 'QUERY' : 'READ';

    const rateResult = rateLimiter.check(ip, endpointType);

    if (!rateResult.allowed) {
      const rateResponse = NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Too many requests. Please slow down.',
          retryAfter: rateResult.resetSeconds,
        },
        { status: 429 }
      );
      rateResponse.headers.set('Retry-After', rateResult.resetSeconds.toString());
      rateResponse.headers.set('X-RateLimit-Limit', rateResult.limit.toString());
      rateResponse.headers.set('X-RateLimit-Remaining', '0');
      rateResponse.headers.set('X-RateLimit-Reset', rateResult.resetSeconds.toString());
      applySecurityHeaders(rateResponse);
      applyCorsHeaders(rateResponse, request);
      return rateResponse;
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', rateResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateResult.resetSeconds.toString());
    applySecurityHeaders(response);
    applyCorsHeaders(response, request);
    return response;
  }

  // 3. Standard Web Route Security
  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

function applySecurityHeaders(response: NextResponse) {
  // OWASP Recommended Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self)'
  );
}

function applyCorsHeaders(response: NextResponse, request: NextRequest) {
  const origin = request.headers.get('origin') || '*';
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-DirtFree-App-Key, X-Api-Key, X-Admin-Secret, X-Client-Platform, X-Client-Version, Accept'
  );
}

