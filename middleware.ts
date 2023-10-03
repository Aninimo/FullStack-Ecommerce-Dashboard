import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withClerkMiddleware } from '@clerk/nextjs/server'
 
export default withClerkMiddleware((req: NextRequest) => {
  return NextResponse.next();
});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
