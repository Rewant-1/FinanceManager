import { NextResponse } from "next/server"

import { getServerAuthSession } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { action } = await req.json() // "accept" or "reject"

    const invite = await prisma.partnerLink.findUnique({
      where: { id },
    })

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 })
    }

    // Verify this user is the recipient
    if (invite.user2Id !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (invite.status !== "pending") {
      return NextResponse.json(
        { error: "Invite already processed" },
        { status: 400 }
      )
    }

    if (action === "accept") {
      const updated = await prisma.partnerLink.update({
        where: { id },
        data: {
          status: "accepted",
          acceptedAt: new Date(),
        },
        include: {
          user1: { select: { id: true, name: true, email: true } },
          user2: { select: { id: true, name: true, email: true } },
        },
      })

      return NextResponse.json(updated)
    } else if (action === "reject") {
      const updated = await prisma.partnerLink.update({
        where: { id },
        data: { status: "rejected" },
      })

      return NextResponse.json(updated)
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error responding to invite:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
