import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Return the request as-is. No logic, no checks, no redirects.
  return NextResponse.next();
}

export const config = {
  // Skip all static files and images, but process everything else with zero logic
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};