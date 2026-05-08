import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT = 10; // 10 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/video')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    const now = Date.now();
    
    const rateData = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    
    if (now - rateData.lastReset > RATE_LIMIT_WINDOW) {
      rateData.count = 1;
      rateData.lastReset = now;
    } else {
      rateData.count++;
    }
    
    rateLimitMap.set(ip, rateData);
    
    if (rateData.count > RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Demasiadas peticiones. Por favor, inténtalo de nuevo en un minuto.' },
        { status: 429 }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
