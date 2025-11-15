import { NextResponse } from "next/server"
import type { Prisma } from "@prisma/client"

import { getServerAuthSession } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")
    const isShared = searchParams.get("isShared")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const viewModeParam = searchParams.get("viewMode")
    const derivedViewMode = viewModeParam
      ? viewModeParam
      : isShared === "true"
        ? "shared"
        : isShared === "false"
          ? "personal"
          : "all"

    const activeLink = await prisma.partnerLink.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, status: "accepted" },
          { user2Id: session.user.id, status: "accepted" },
        ],
      },
      select: {
        id: true,
        user1Id: true,
        user2Id: true,
      },
    })

    const partnerId = activeLink
      ? activeLink.user1Id === session.user.id
        ? activeLink.user2Id
        : activeLink.user1Id
      : null

    let visibilityFilter: Prisma.TransactionWhereInput = {
      userId: session.user.id,
    }

    if (derivedViewMode === "personal") {
      visibilityFilter = {
        userId: session.user.id,
        isShared: false,
      }
    } else if (derivedViewMode === "shared") {
      visibilityFilter = partnerId
        ? {
            isShared: true,
            OR: [
              { userId: session.user.id },
              { userId: partnerId },
            ],
          }
        : {
            userId: session.user.id,
            isShared: true,
          }
    } else if (partnerId) {
      visibilityFilter = {
        OR: [
          { userId: session.user.id },
          { userId: partnerId, isShared: true },
        ],
      }
    }

    const filters: Prisma.TransactionWhereInput[] = [visibilityFilter]

    if (categoryId) {
      filters.push({ categoryId })
    }

    if (startDate || endDate) {
      filters.push({
        date: {
          ...(startDate ? { gte: new Date(startDate) } : {}),
          ...(endDate ? { lte: new Date(endDate) } : {}),
        },
      })
    }

    const where: Prisma.TransactionWhereInput =
      filters.length > 1 ? { AND: filters } : filters[0]

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, description, date, categoryId, isShared, paidBy } =
      await req.json()

    if (!amount || !description || !date || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify category belongs to user
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category || category.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      )
    }

    const activeLink = await prisma.partnerLink.findFirst({
      where: {
        OR: [
          { user1Id: session.user.id, status: "accepted" },
          { user2Id: session.user.id, status: "accepted" },
        ],
      },
      select: { user1Id: true, user2Id: true },
    })

    const normalizedPaidBy = (() => {
      if (!isShared) return null
      if (paidBy === "split") return "split"
      if (paidBy === session.user.id) return session.user.id
      if (paidBy && paidBy !== "partner") return paidBy
      if (activeLink) {
        return activeLink.user1Id === session.user.id
          ? activeLink.user2Id
          : activeLink.user1Id
      }
      return null
    })()

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        categoryId,
        userId: session.user.id,
        isShared: isShared || false,
        paidBy: normalizedPaidBy,
      },
      include: {
        category: true,
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Error creating transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
