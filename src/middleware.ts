import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/login',
  // Pages this app serves unauthenticated. API routes enforce their own
  // auth (401 JSON) so external clients/agents are never redirected to HTML.
  publicRoutes: ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/test', '/api'],
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|\\.well-known).*)'],
};
