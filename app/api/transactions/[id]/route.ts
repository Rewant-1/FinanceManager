import { NextResponse } from "next/server"

import { getServerAuthSession } from "@/auth"
import prisma from "@/lib/prisma"

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

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    })

    if (!transaction || transaction.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      )
    }

    await prisma.transaction.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Transaction deleted" })
  } catch (error) {
    console.error("Error deleting transaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
