import { NextResponse } from 'next/server';
import { withClerkMiddleware } from '@clerk/nextjs/server';

const publicRoutes = ["/api/:path*"];

export default withClerkMiddleware((req) => {
  if (publicRoutes.includes(req.url)) {
    return NextResponse.next();
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
