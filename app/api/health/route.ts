import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

import { env } from "@/lib/env"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    await prisma.$queryRaw(Prisma.sql`SELECT 1`)

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      database: "reachable",
      nextAuthSecret: Boolean(env.NEXTAUTH_SECRET),
    })
  } catch (error) {
    console.error("Health check failed", error)
    return NextResponse.json(
      {
        ok: false,
        error: "Health check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
