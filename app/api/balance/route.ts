import { NextResponse } from "next/server"

import { getServerAuthSession } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
  const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get active partner
    const partnerLink = await prisma.partnerLink.findFirst({
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

    if (!partnerLink) {
      return NextResponse.json(
        { error: "No active partner found" },
        { status: 404 }
      )
    }

    const partnerId =
      partnerLink.user1Id === session.user.id
        ? partnerLink.user2Id
        : partnerLink.user1Id

    // Get all shared transactions for both users that are not settled
    const sharedTransactions = await prisma.transaction.findMany({
      where: {
        isShared: true,
        settlementId: null,
        OR: [{ userId: session.user.id }, { userId: partnerId }],
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    // Calculate balances
    let myPaid = 0
    let partnerPaid = 0
    let splitAmount = 0

    sharedTransactions.forEach((tx: typeof sharedTransactions[0]) => {
      const amount = tx.amount

      if (tx.paidBy === "split") {
        splitAmount += amount / 2
      } else if (tx.paidBy === session.user.id) {
        myPaid += amount
      } else if (tx.paidBy === partnerId) {
        partnerPaid += amount
      } else if (tx.paidBy === "partner") {
        // Legacy entries may still store "partner" instead of ids
        if (tx.userId === session.user.id) {
          partnerPaid += amount
        } else {
          myPaid += amount
        }
      }
    })

    // Total shared expenses
    const totalShared = myPaid + partnerPaid + splitAmount

    // Each person should pay half
    const shouldPayEach = totalShared / 2

    // How much I actually paid (my payments + half of splits)
    const iActuallyPaid = myPaid + splitAmount / 2

    // Balance: positive means partner owes me, negative means I owe partner
    const balance = iActuallyPaid - shouldPayEach

    const partnerInfo =
      partnerLink.user1Id === partnerId
        ? partnerLink.user1
        : partnerLink.user2

    const recentSettlements = await prisma.settlement.findMany({
      where: { partnerLinkId: partnerLink.id },
      include: {
        settledBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    return NextResponse.json({
      totalShared,
      myPaid,
      partnerPaid,
      splitAmount,
      balance,
      partnerInfo,
      transactionCount: sharedTransactions.length,
      partnerLinkId: partnerLink.id,
      recentSettlements: recentSettlements.map((settlement) => ({
        id: settlement.id,
        balanceSnapshot: settlement.balanceSnapshot,
        createdAt: settlement.createdAt,
        settledBy: settlement.settledBy,
      })),
    })
  } catch (error) {
    console.error("Error calculating balance:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
