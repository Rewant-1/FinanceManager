"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { toast } from "sonner"
import {
  LogOut,
  Settings,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"

type MonthlyTrend = {
  month: string
  total: number
  count: number
}

type CategoryData = {
  category: string
  total: number
  count: number
  color: string
}

type AnalyticsData = {
  monthlyTrends: MonthlyTrend[]
  topCategories: CategoryData[]
  summary: {
    totalSpent: number
    avgTransactionAmount: number
    currentMonthSpent: number
    monthOverMonthChange: number
    totalTransactions: number
  }
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
})

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const res = await fetch("/api/analytics")
      if (res.ok) {
        const analyticsData = await res.json()
        setData(analyticsData)
      } else {
        toast.error("Failed to load analytics")
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast.error("Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="h-12 w-12 mx-auto mb-4 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading your insights...</p>
        </motion.div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <Card>
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>Start tracking expenses to see analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { monthlyTrends, topCategories, summary } = data

  return (
    <div className="relative min-h-screen px-6 pb-24 pt-24 sm:px-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-blob-lg absolute -left-24 top-20 rounded-full bg-gradient-to-br from-primary/20 via-emerald-500/10 to-transparent blur-3xl" />
        <div className="hero-blob-md absolute right-[-140px] bottom-0 rounded-full bg-gradient-to-br from-teal-500/15 via-cyan-500/15 to-transparent blur-3xl" />
      </div>

      <motion.div
        className="relative mx-auto flex w-full max-w-7xl flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.header variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Analytics & Insights
                    </p>
                  </div>
                  <CardTitle className="text-3xl">Your Spending Story</CardTitle>
                  <CardDescription>
                    Visualize trends, discover patterns, and make informed financial decisions.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="secondary" asChild>
                    <Link href="/dashboard">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                  <ModeToggle />
                  <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.header>

        {/* Summary Stats */}
        <motion.div variants={itemVariants}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              icon={<DollarSign className="h-5 w-5" />}
              label="Total Spent"
              value={currencyFormatter.format(summary.totalSpent)}
              color="default"
            />
            <StatsCard
              icon={<Receipt className="h-5 w-5" />}
              label="Avg Transaction"
              value={currencyFormatter.format(summary.avgTransactionAmount)}
              color="emerald"
            />
            <StatsCard
              icon={<Calendar className="h-5 w-5" />}
              label="This Month"
              value={currencyFormatter.format(summary.currentMonthSpent)}
              color="teal"
            />
            <StatsCard
              icon={
                summary.monthOverMonthChange >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )
              }
              label="Month Change"
              value={`${summary.monthOverMonthChange >= 0 ? "+" : ""}${summary.monthOverMonthChange.toFixed(1)}%`}
              color={summary.monthOverMonthChange >= 0 ? "coral" : "emerald"}
            />
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Monthly Trends Line Chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Monthly Spending Trends</CardTitle>
                <CardDescription>
                  Track how your expenses evolve over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                      }}
                      formatter={(value) => [currencyFormatter.format(value as number), "Spent"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--chart-1))", r: 5 }}
                      name="Monthly Total"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Trends Bar Chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Transaction Volume</CardTitle>
                <CardDescription>
                  Number of transactions per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                      }}
                      formatter={(value) => [value, "Transactions"]}
                    />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-2))"
                      radius={[8, 8, 0, 0]}
                      name="Transaction Count"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Categories Pie Chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Spending by Category</CardTitle>
                <CardDescription>
                  Where your money goes - visualized
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topCategories}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                      }}
                      formatter={(value) => currencyFormatter.format(value as number)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Categories Bar Chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Top Spending Categories</CardTitle>
                <CardDescription>
                  Your biggest expense buckets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topCategories} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="category"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                      }}
                      formatter={(value) => [currencyFormatter.format(value as number), "Total"]}
                    />
                    <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                      {topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Category Breakdown Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Category Breakdown</CardTitle>
              </div>
              <CardDescription>
                Detailed view of spending across all categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topCategories.map((cat, index) => (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between rounded-2xl bg-card/80 backdrop-blur-sm px-5 py-4 border border-border/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-4 w-4 rounded-full"
                        data-color={cat.color}
                      />
                      <div>
                        <p className="font-semibold">{cat.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {cat.count} transaction{cat.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {currencyFormatter.format(cat.total)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {currencyFormatter.format(cat.total / cat.count)} avg
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

function StatsCard({
  icon,
  label,
  value,
  color = "default",
}: {
  icon: React.ReactNode
  label: string
  value: string
  color?: "default" | "emerald" | "teal" | "coral"
}) {
  const colorClasses = {
    default: "text-foreground",
    emerald: "text-emerald-600 dark:text-emerald-400",
    teal: "text-teal-600 dark:text-teal-400",
    coral: "text-orange-600 dark:text-orange-400",
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-2xl bg-card/80 backdrop-blur-sm px-5 py-5 shadow-sm border border-border/50"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className={`mt-3 text-2xl font-semibold ${colorClasses[color]}`}>{value}</p>
    </motion.div>
  )
}
