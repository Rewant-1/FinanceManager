import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function proxy(request: NextRequest) {
  const session = await getToken({ req: request })

  if (!session) {
    const signInUrl = new URL("/auth/signin", request.url)
    if (request.nextUrl.pathname !== "/auth/signin") {
      signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search)
    }
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/categories/:path*", "/settings/:path*"],
}
