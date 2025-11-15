import { NextResponse } from "next/server"

import { getServerAuthSession } from "@/auth"
import prisma from "@/lib/prisma"

function calculateSplit(
  transactions: Array<{ amount: number; paidBy: string | null; userId: string }>,
  currentUserId: string,
  partnerId: string
) {
  let myPaid = 0
  let partnerPaid = 0
  let splitAmount = 0

  transactions.forEach((tx) => {
    if (tx.paidBy === "split") {
      splitAmount += tx.amount / 2
    } else if (tx.paidBy === currentUserId) {
      myPaid += tx.amount
    } else if (tx.paidBy === partnerId) {
      partnerPaid += tx.amount
    } else if (tx.paidBy === "partner") {
      if (tx.userId === currentUserId) {
        partnerPaid += tx.amount
      } else {
        myPaid += tx.amount
      }
    }
  })

  const totalShared = myPaid + partnerPaid + splitAmount
  const shouldPayEach = totalShared / 2
  const iActuallyPaid = myPaid + splitAmount / 2
  const balance = iActuallyPaid - shouldPayEach

  return { balance, totalShared }
}

export async function GET() {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const partnerLink = await prisma.partnerLink.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, status: "accepted" },
          { user2Id: session.user.id, status: "accepted" },
        ],
      },
    })

    if (!partnerLink) {
      return NextResponse.json({ error: "No active partner" }, { status: 404 })
    }

    const settlements = await prisma.settlement.findMany({
      where: { partnerLinkId: partnerLink.id },
      include: {
        settledBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return NextResponse.json({ settlements })
  } catch (error) {
    console.error("Error fetching settlements:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const partnerLink = await prisma.partnerLink.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, status: "accepted" },
          { user2Id: session.user.id, status: "accepted" },
        ],
      },
    })

    if (!partnerLink) {
      return NextResponse.json({ error: "No active partner" }, { status: 404 })
    }

    const partnerId =
      partnerLink.user1Id === session.user.id
        ? partnerLink.user2Id
        : partnerLink.user1Id

    const unsettled = await prisma.transaction.findMany({
      where: {
        isShared: true,
        settlementId: null,
        OR: [{ userId: session.user.id }, { userId: partnerId }],
      },
      select: {
        id: true,
        amount: true,
        paidBy: true,
        userId: true,
      },
    })

    if (unsettled.length === 0) {
      return NextResponse.json({ error: "Nothing to settle" }, { status: 400 })
    }

    const { balance, totalShared } = calculateSplit(unsettled, session.user.id, partnerId)

    const settlement = await prisma.settlement.create({
      data: {
        partnerLinkId: partnerLink.id,
        settledById: session.user.id,
        balanceSnapshot: balance,
        transactions: {
          connect: unsettled.map((tx) => ({ id: tx.id })),
        },
      },
      include: {
        settledBy: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json({
      settlement: {
        id: settlement.id,
        balanceSnapshot: settlement.balanceSnapshot,
        createdAt: settlement.createdAt,
        settledBy: settlement.settledBy,
      },
      clearedTransactions: unsettled.length,
      totalShared,
    })
  } catch (error) {
    console.error("Error settling balance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
