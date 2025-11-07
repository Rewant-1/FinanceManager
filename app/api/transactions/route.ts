import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"

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

    const where: Prisma.TransactionWhereInput = {
      userId: session.user.id,
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (isShared === "true") {
      where.isShared = true
    } else if (isShared === "false") {
      where.isShared = false
    }

    if (startDate || endDate) {
      where.date = {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lte: new Date(endDate) } : {}),
      }
    }

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

    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        categoryId,
        userId: session.user.id,
        isShared: isShared || false,
        paidBy: paidBy || null,
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
