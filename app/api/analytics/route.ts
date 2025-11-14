import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    // Group by month
    const monthlyData: Record<string, { month: string; total: number; count: number }> = {}
    
    // Group by category
    const categoryData: Record<string, { category: string; total: number; count: number; color: string }> = {}
    
    // Predefined colors for categories
    const categoryColors = [
      'hsl(173, 80%, 40%)', // teal
      'hsl(160, 84%, 39%)', // emerald
      'hsl(43, 74%, 66%)',  // amber
      'hsl(27, 87%, 67%)',  // coral
      'hsl(10, 79%, 63%)',  // salmon
      'hsl(200, 80%, 50%)', // cyan
      'hsl(142, 71%, 45%)', // green
      'hsl(24, 70%, 60%)',  // orange
    ]
    
    let colorIndex = 0

    transactions.forEach((tx: {
      amount: number
      date: Date
      category: { name: string }
    }) => {
      // Monthly aggregation
      const monthKey = new Date(tx.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      })
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, total: 0, count: 0 }
      }
      monthlyData[monthKey].total += tx.amount
      monthlyData[monthKey].count += 1

      // Category aggregation
      const categoryName = tx.category.name
      if (!categoryData[categoryName]) {
        categoryData[categoryName] = {
          category: categoryName,
          total: 0,
          count: 0,
          color: categoryColors[colorIndex % categoryColors.length]
        }
        colorIndex++
      }
      categoryData[categoryName].total += tx.amount
      categoryData[categoryName].count += 1
    })

    // Convert to arrays and sort
    const monthlyTrends = Object.values(monthlyData)
    const topCategories = Object.values(categoryData)
      .sort((a, b) => b.total - a.total)
      .slice(0, 8) // Top 8 categories

    // Calculate summary stats
    const totalSpent = transactions.reduce((sum: number, tx: { amount: number }) => sum + tx.amount, 0)
    const avgTransactionAmount = transactions.length > 0 
      ? totalSpent / transactions.length 
      : 0
    
    const currentMonth = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
    const currentMonthSpent = monthlyData[currentMonth]?.total || 0

    // Calculate month-over-month change
    const months = Object.keys(monthlyData).sort()
    const lastMonth = months.length > 1 ? months[months.length - 2] : null
    const lastMonthSpent = lastMonth ? monthlyData[lastMonth].total : 0
    const monthOverMonthChange = lastMonthSpent > 0 
      ? ((currentMonthSpent - lastMonthSpent) / lastMonthSpent) * 100 
      : 0

    return NextResponse.json({
      monthlyTrends,
      topCategories,
      summary: {
        totalSpent,
        avgTransactionAmount,
        currentMonthSpent,
        monthOverMonthChange,
        totalTransactions: transactions.length,
      },
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    )
  }
}
