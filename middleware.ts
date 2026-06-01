import { NextRequest, NextResponse } from 'next/server';

// Routes that require a Pro subscription
const PRO_ONLY_PATHS = [
  '/api/plan/multicity',
  '/api/plan/optimize',
  '/api/trips/export',
];

// Feature label returned in the error body, keyed by path prefix
const FEATURE_LABELS: Record<string, string> = {
  '/api/plan/multicity': 'multi_city',
  '/api/plan/optimize': 'budget_optimizer',
  '/api/trips/export': 'pdf_export',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a Pro-only route
  const proPath = PRO_ONLY_PATHS.find((p) => pathname.startsWith(p));
  if (!proPath) return NextResponse.next();

  // Require an authenticated session for Pro routes.
  // Full subscription-tier check happens inside each API route via checkLimit().
  // Here we only gate unauthenticated callers to return the standard error shape.
  const hasSession =
    request.cookies.has('sb-access-token') ||
    request.cookies.has(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`);

  if (!hasSession) {
    return NextResponse.json(
      { error: 'pro_required', feature: FEATURE_LABELS[proPath] ?? 'pro_feature' },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/plan/multicity', '/api/plan/optimize', '/api/trips/export'],
};
