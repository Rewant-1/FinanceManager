import { NextResponse } from "next/server"

import { getServerAuthSession } from "@/auth"
import prisma from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { name } = await req.json()

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      )
    }

    // Verify ownership
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category || category.userId !== session.user.id) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Check if new name conflicts
    const existing = await prisma.category.findFirst({
      where: {
        userId: session.user.id,
        name: name.trim(),
        NOT: { id },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      )
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name: name.trim() },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const session = await getServerAuthSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { transactions: true } } },
    })

    if (!category || category.userId !== session.user.id) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    if (category._count.transactions > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing transactions" },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Category deleted" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
