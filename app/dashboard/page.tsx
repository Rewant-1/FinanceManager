"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { 
  LogOut, Settings, Tags, Plus, Trash2, 
  Filter, TrendingUp, DollarSign, Users,
  Calendar, User, CreditCard
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"

type Category = {
  id: string
  name: string
}

type Transaction = {
  id: string
  amount: number
  description: string
  date: string
  isShared: boolean
  paidBy: string | null
  category: Category
  user: {
    id: string
    name: string | null
    email: string
  }
}

type BalanceInfo = {
  totalShared: number
  myPaid: number
  partnerPaid: number
  balance: number
  partnerInfo: {
    id: string
    name: string | null
    email: string
  }
  transactionCount: number
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
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [error, setError] = useState("")
  const [isCoupleMode, setIsCoupleMode] = useState(false)
  const [currentUserId, setCurrentUserId] = useState("")
  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo | null>(null)

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [viewFilter, setViewFilter] = useState<string>("all")

  // Form states
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    isShared: false,
    paidBy: "",
  })

  useEffect(() => {
    fetchData()
    fetchPartnerStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, viewFilter])

  async function fetchPartnerStatus() {
    try {
      const res = await fetch("/api/partner")
      if (res.ok) {
        const data = await res.json()
        setIsCoupleMode(data.isCoupleMode)
        
        if (data.isCoupleMode) {
          fetchBalance()
        }
      }
    } catch (err) {
      console.error("Error fetching partner status:", err)
    }
  }

  async function fetchBalance() {
    try {
      const res = await fetch("/api/balance")
      if (res.ok) {
        const data = await res.json()
        setBalanceInfo(data)
      }
    } catch (err) {
      console.error("Error fetching balance:", err)
    }
  }

  async function fetchData() {
    try {
      const [txRes, catRes, sessionRes] = await Promise.all([
        fetch(buildTransactionUrl()),
        fetch("/api/categories"),
        fetch("/api/auth/session"),
      ])

      if (txRes.ok) {
        const txData = await txRes.json()
        setTransactions(txData)
      }

      if (catRes.ok) {
        const catData = await catRes.json()
        setCategories(catData)
      }

      if (sessionRes.ok) {
        const sessionData = await sessionRes.json()
        if (sessionData?.user?.id) {
          setCurrentUserId(sessionData.user.id)
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  function buildTransactionUrl() {
    const params = new URLSearchParams()
    if (selectedCategory) params.append("categoryId", selectedCategory)
    if (viewFilter === "shared") params.append("isShared", "true")
    if (viewFilter === "personal") params.append("isShared", "false")

    return `/api/transactions?${params.toString()}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!formData.amount || !formData.description || !formData.categoryId) {
      setError("Please fill in all required fields")
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create transaction")
        toast.error(data.error || "Failed to create transaction")
        return
      }

      setTransactions([data, ...transactions])
      setFormData({
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        categoryId: "",
        isShared: false,
        paidBy: "",
      })
      setShowAddForm(false)
      toast.success("Transaction added successfully!")
      
      if (data.isShared && isCoupleMode) {
        fetchBalance()
      }
    } catch (err) {
      setError("Something went wrong")
      toast.error("Something went wrong")
      console.error(err)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setTransactions(transactions.filter((t) => t.id !== id))
        toast.success("Transaction deleted")
        if (isCoupleMode) fetchBalance()
      } else {
        toast.error("Failed to delete transaction")
      }
    } catch (err) {
      console.error("Error deleting transaction:", err)
      toast.error("Failed to delete transaction")
    }
  }

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const partnerName = balanceInfo?.partnerInfo
    ? balanceInfo.partnerInfo.name || balanceInfo.partnerInfo.email
    : "Partner"

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="h-12 w-12 mx-auto mb-4 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen px-6 pb-24 pt-24 sm:px-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-blob-lg absolute -left-24 top-20 rounded-full bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent blur-3xl" />
        <div className="hero-blob-md absolute right-[-140px] bottom-0 rounded-full bg-gradient-to-br from-pink-500/15 via-blue-500/15 to-transparent blur-3xl" />
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
                    <CreditCard className="h-5 w-5 text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Couple&apos;s expense hub
                    </p>
                  </div>
                  <CardTitle className="text-3xl">Dashboard</CardTitle>
                  <CardDescription>
                    Keep your personal and shared spending beautifully organised.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`badge-soft ${isCoupleMode ? 'data-[variant="plum"]' : 'data-[variant="slate"]'}`} data-variant={isCoupleMode ? "plum" : "slate"}>
                    {isCoupleMode ? "Couple mode" : "Personal mode"}
                  </span>
                  <Button variant="secondary" asChild>
                    <Link href="/categories">
                      <Tags className="mr-2 h-4 w-4" />
                      Categories
                    </Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                  <ModeToggle />
                  <Button
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.header>

        {/* Balance Overview for Couple Mode */}
        <AnimatePresence>
          {isCoupleMode && balanceInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              variants={itemVariants}
            >
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Shared overview
                        </p>
                      </div>
                      <CardTitle className="text-2xl">Where you stand together</CardTitle>
                      <CardDescription>
                        Balancing every coffee run, grocery top-up, and dreamy getaway.
                      </CardDescription>
                    </div>
                    <span className="badge-soft" data-variant="plum">
                      Linked with {partnerName}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                      icon={<TrendingUp className="h-5 w-5" />}
                      label="Total shared"
                      value={currencyFormatter.format(balanceInfo.totalShared)}
                      color="default"
                    />
                    <StatsCard
                      icon={<DollarSign className="h-5 w-5" />}
                      label="You covered"
                      value={currencyFormatter.format(balanceInfo.myPaid)}
                      color="indigo"
                    />
                    <StatsCard
                      icon={<DollarSign className="h-5 w-5" />}
                      label="Partner covered"
                      value={currencyFormatter.format(balanceInfo.partnerPaid)}
                      color="emerald"
                    />
                    <StatsCard
                      icon={<CreditCard className="h-5 w-5" />}
                      label="Shared entries"
                      value={balanceInfo.transactionCount.toString()}
                      color="default"
                    />
                  </div>
                  <div className="mt-6 rounded-2xl bg-card/70 px-5 py-4 text-sm">
                    {balanceInfo.balance > 0 ? (
                      <span>
                        <span className="font-semibold text-emerald-600">{partnerName}</span> owes you
                        <span className="ml-2 font-semibold text-emerald-600">
                          {currencyFormatter.format(Math.abs(balanceInfo.balance))}
                        </span>
                      </span>
                    ) : balanceInfo.balance < 0 ? (
                      <span>
                        You owe
                        <span className="mx-2 font-semibold text-rose-600">{partnerName}</span>
                        <span className="font-semibold text-rose-600">
                          {currencyFormatter.format(Math.abs(balanceInfo.balance))}
                        </span>
                      </span>
                    ) : (
                      <span className="font-semibold">All settled - keep gliding together!</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          {/* Transactions List */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">Recent activity</CardTitle>
                    <CardDescription>
                      Every moment you logged, from shared brunches to solo treats.
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Total tracked
                      </p>
                      <p className="text-3xl font-semibold bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent">
                        {currencyFormatter.format(totalAmount)}
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowAddForm((prev) => !prev)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {showAddForm ? "Close form" : "Log transaction"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="rounded-2xl bg-muted/50 px-6 py-10 text-center text-sm text-muted-foreground">
                    Nothing logged yet. Add your first transaction using the panel on the right.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {transactions.map((tx) => (
                        <TransactionCard
                          key={tx.id}
                          transaction={tx}
                          onDelete={handleDelete}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <aside className="flex w-full flex-col gap-6">
            {/* Filters */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Quick filters</CardTitle>
                  </div>
                  <CardDescription>
                    Tune your view between personal and shared memories.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category-filter" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Category
                    </Label>
                    <select
                      id="category-filter"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input-soft mt-2"
                    >
                      <option value="">All categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="view-filter" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      View mode
                    </Label>
                    <select
                      id="view-filter"
                      value={viewFilter}
                      onChange={(e) => setViewFilter(e.target.value)}
                      className="input-soft mt-2"
                    >
                      <option value="all">All expenses</option>
                      <option value="personal">Personal only</option>
                      <option value="shared">Shared only</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Add Transaction Form */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Log an expense</CardTitle>
                  <CardDescription>
                    Capture the moment while it&apos;s still warm.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {showAddForm ? (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                      >
                        <div>
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="Eg. 42.50"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            name="description"
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Dinner at Amara, groceries..."
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <select
                            id="category"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="input-soft mt-2"
                            required
                          >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {isCoupleMode && (
                          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4">
                            <div className="flex items-center gap-3">
                              <input
                                id="shared"
                                type="checkbox"
                                checked={formData.isShared}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    isShared: e.target.checked,
                                    paidBy: e.target.checked ? currentUserId : "",
                                  })
                                }
                                className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary"
                              />
                              <Label htmlFor="shared" className="text-sm font-medium">
                                This one is for both of us
                              </Label>
                            </div>

                            {formData.isShared && (
                              <div className="mt-4">
                                <Label htmlFor="paid-by" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Who picked up the bill?
                                </Label>
                                <select
                                  id="paid-by"
                                  value={formData.paidBy}
                                  onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                                  className="input-soft mt-2"
                                  required
                                >
                                  <option value="">Select who paid</option>
                                  <option value={currentUserId}>I did</option>
                                  <option value="partner">My partner</option>
                                  <option value="split">We split it 50/50</option>
                                </select>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex flex-col gap-3 pt-2">
                          <Button type="submit">
                            Save expense
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setShowAddForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 text-sm text-muted-foreground"
                      >
                        <p>
                          Ready to capture something new? Keep your shared ledger as thoughtful as the way you care for each other.
                        </p>
                        <Button
                          onClick={() => setShowAddForm(true)}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Start adding
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </aside>
        </div>
      </motion.div>
    </div>
  )
}

// Helper Components
function StatsCard({ icon, label, value, color = "default" }: { 
  icon: React.ReactNode
  label: string
  value: string
  color?: "default" | "indigo" | "emerald"
}) {
  const colorClasses = {
    default: "text-foreground",
    indigo: "text-indigo-600 dark:text-indigo-400",
    emerald: "text-emerald-600 dark:text-emerald-400"
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-2xl bg-card/80 backdrop-blur-sm px-5 py-5 shadow-sm border border-border/50"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </p>
      </div>
      <p className={`mt-3 text-2xl font-semibold ${colorClasses[color]}`}>
        {value}
      </p>
    </motion.div>
  )
}

function TransactionCard({ transaction, onDelete }: { 
  transaction: Transaction
  onDelete: (id: string) => void 
}) {
  const dateLabel = new Date(transaction.date).toLocaleDateString()
  const amountLabel = currencyFormatter.format(transaction.amount)
  const loggedBy = transaction.user?.name || transaction.user?.email || "You"

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card/80 backdrop-blur-sm px-5 py-4 shadow-sm border border-border/50 transition-all"
    >
      <div className="min-w-56 flex-1">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold">
            {transaction.description}
          </h3>
          {transaction.isShared ? (
            <span className="badge-soft" data-variant="plum">
              Shared
            </span>
          ) : (
            <span className="badge-soft" data-variant="slate">
              Personal
            </span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
          <span className="rounded-full bg-muted px-3 py-1">
            {transaction.category.name}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dateLabel}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {loggedBy}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-right">
        <span className="text-lg font-semibold">
          {amountLabel}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (confirm("Delete this transaction?")) {
              onDelete(transaction.id)
            }
          }}
          className="border border-destructive/20 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </motion.article>
  )
}
