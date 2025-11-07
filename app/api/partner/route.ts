import { NextResponse } from "next/server"

import { getServerAuthSession } from "@/auth"
import prisma from "@/lib/prisma"

// Get user's partner status
export async function GET() {
  try {
  const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check for active partnership
    const activePartner = await prisma.partnerLink.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, status: "accepted" },
          { user2Id: session.user.id, status: "accepted" },
        ],
      },
      include: {
        user1: { select: { id: true, name: true, email: true } },
        user2: { select: { id: true, name: true, email: true } },
      },
    })

    // Check for pending invites (sent or received)
    const pendingInvites = await prisma.partnerLink.findMany({
      where: {
        OR: [
          { user1Id: session.user.id, status: "pending" },
          { user2Id: session.user.id, status: "pending" },
        ],
      },
      include: {
        user1: { select: { id: true, name: true, email: true } },
        user2: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({
      activePartner,
      pendingInvites,
      isCoupleMode: !!activePartner,
    })
  } catch (error) {
    console.error("Error fetching partner status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Send partner invite
export async function POST(req: Request) {
  try {
  const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { partnerEmail } = await req.json()

    if (!partnerEmail) {
      return NextResponse.json(
        { error: "Partner email is required" },
        { status: 400 }
      )
    }

    // Check if user already has an active partner
    const existingActive = await prisma.partnerLink.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, status: "accepted" },
          { user2Id: session.user.id, status: "accepted" },
        ],
      },
    })

    if (existingActive) {
      return NextResponse.json(
        { error: "You already have an active partner" },
        { status: 400 }
      )
    }

    // Find partner user
    const partnerUser = await prisma.user.findUnique({
      where: { email: partnerEmail },
    })

    if (!partnerUser) {
      return NextResponse.json(
        { error: "User with this email not found" },
        { status: 404 }
      )
    }

    if (partnerUser.id === session.user.id) {
      return NextResponse.json(
        { error: "You cannot invite yourself" },
        { status: 400 }
      )
    }

    // Check if partner already has an active partner
    const partnerHasActive = await prisma.partnerLink.findFirst({
      where: {
        OR: [
          { user1Id: partnerUser.id, status: "accepted" },
          { user2Id: partnerUser.id, status: "accepted" },
        ],
      },
    })

    if (partnerHasActive) {
      return NextResponse.json(
        { error: "This user already has an active partner" },
        { status: 400 }
      )
    }

    // Check if invite already exists
    const existingInvite = await prisma.partnerLink.findFirst({
      where: {
        OR: [
          {
            user1Id: session.user.id,
            user2Id: partnerUser.id,
            status: "pending",
          },
          {
            user1Id: partnerUser.id,
            user2Id: session.user.id,
            status: "pending",
          },
        ],
      },
    })

    if (existingInvite) {
      return NextResponse.json(
        { error: "Invite already sent" },
        { status: 400 }
      )
    }

    // Create partner link
    const partnerLink = await prisma.partnerLink.create({
      data: {
        user1Id: session.user.id,
        user2Id: partnerUser.id,
        invitedBy: session.user.id,
        status: "pending",
      },
      include: {
        user1: { select: { id: true, name: true, email: true } },
        user2: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(partnerLink, { status: 201 })
  } catch (error) {
    console.error("Error sending invite:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
