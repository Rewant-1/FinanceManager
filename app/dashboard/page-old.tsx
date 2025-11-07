"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"

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
  const [viewFilter, setViewFilter] = useState<string>("all") // all, shared, personal

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
        
        // If in couple mode, fetch balance
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
      
      // Refresh balance if it was a shared transaction
      if (data.isShared && isCoupleMode) {
        fetchBalance()
      }
    } catch (err) {
      setError("Something went wrong")
      console.error(err)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this transaction?")) return

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setTransactions(transactions.filter((t) => t.id !== id))
      }
    } catch (err) {
      console.error("Error deleting transaction:", err)
    }
  }

  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const totalAmountDisplay = currencyFormatter.format(totalAmount)
  const partnerName = balanceInfo?.partnerInfo
    ? balanceInfo.partnerInfo.name || balanceInfo.partnerInfo.email
    : "Partner"

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="hero-blob-lg absolute -left-24 top-24 rounded-full bg-linear-to-br from-indigo-200/45 via-slate-200/35 to-transparent blur-3xl" />
          <div className="hero-blob-md absolute right-[-120px] bottom-0 rounded-full bg-linear-to-br from-purple-200/40 via-pink-100/35 to-transparent blur-3xl" />
        </div>
        <div className="glass-card w-full max-w-md px-8 py-6 text-center text-sm text-slate-500">
          Warming up your shared finance hub...
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-24 pt-24 sm:px-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-blob-lg absolute -left-24 top-20 rounded-full bg-linear-to-br from-slate-200/40 via-purple-100/35 to-transparent blur-3xl" />
        <div className="hero-blob-md absolute right-[-140px] bottom-0 rounded-full bg-linear-to-br from-fuchsia-200/35 via-sky-100/35 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="glass-card flex flex-wrap items-center justify-between gap-6 px-8 py-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Couple&apos;s expense hub
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Keep your personal and shared spending beautifully organised.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge-soft" data-variant={isCoupleMode ? "plum" : "slate"}>
              {isCoupleMode ? "Couple mode" : "Personal mode"}
            </span>
            <Link href="/categories" className="btn-secondary">
              Categories
            </Link>
            <Link href="/settings" className="btn-secondary">
              Settings
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn-ghost"
            >
              Sign out
            </button>
          </div>
        </header>

        {isCoupleMode && balanceInfo && (
          <section className="glass-card border border-white/50 bg-linear-to-br from-purple-50/80 via-white/65 to-blue-50/75 px-8 py-8 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Shared overview
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Where you stand together
                </h2>
                <p className="text-sm text-slate-500">
                  Balancing every coffee run, grocery top-up, and dreamy getaway.
                </p>
              </div>
              <span className="badge-soft" data-variant="plum">
                Linked with {partnerName}
              </span>
            </div>
            <div className="card-divider mt-6" />
            <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-white/80 px-5 py-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total shared
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {currencyFormatter.format(balanceInfo.totalShared)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 px-5 py-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  You covered
                </p>
                <p className="mt-3 text-2xl font-semibold text-indigo-600">
                  {currencyFormatter.format(balanceInfo.myPaid)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 px-5 py-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Partner covered
                </p>
                <p className="mt-3 text-2xl font-semibold text-emerald-600">
                  {currencyFormatter.format(balanceInfo.partnerPaid)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/80 px-5 py-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Shared entries
                </p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {balanceInfo.transactionCount}
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl bg-white/70 px-5 py-4 text-sm text-slate-600">
              {balanceInfo.balance > 0 ? (
                <span>
                  <span className="font-semibold text-emerald-700">{partnerName}</span> owes you
                  <span className="ml-2 font-semibold text-emerald-700">
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
                <span className="font-semibold text-slate-600">All settled - keep gliding together!</span>
              )}
            </div>
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.7fr_1fr]">
          <section className="glass-card overflow-hidden px-0 pb-0">
            <div className="flex w-full flex-wrap items-start justify-between gap-4 border-b border-white/60 px-8 py-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
                <p className="text-sm text-slate-500">
                  Every moment you logged, from shared brunches to solo treats.
                </p>
              </div>
              <div className="flex flex-col items-end gap-3 text-right">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total tracked
                  </p>
                  <p className="text-3xl font-semibold text-slate-900">
                    {totalAmountDisplay}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm((prev) => !prev)}
                  className="btn-primary"
                >
                  {showAddForm ? "Close form" : "Log a transaction"}
                </button>
              </div>
            </div>

            <div className="px-3 py-6 sm:px-8">
              {transactions.length === 0 ? (
                <div className="rounded-2xl bg-white/75 px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
                  Nothing logged yet. Add your first moment from the panel on the right.
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => {
                    const dateLabel = new Date(tx.date).toLocaleDateString()
                    const amountLabel = currencyFormatter.format(tx.amount)
                    const loggedBy = tx.user?.name || tx.user?.email || "You"

                    return (
                      <article
                        key={tx.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/78 px-5 py-4 shadow-sm shadow-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <div className="min-w-56 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-base font-semibold text-slate-900">
                              {tx.description}
                            </h3>
                            {tx.isShared ? (
                              <span className="badge-soft" data-variant="plum">
                                Shared
                              </span>
                            ) : (
                              <span className="badge-soft" data-variant="slate">
                                Personal
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                              {tx.category.name}
                            </span>
                            <span>{dateLabel}</span>
                            <span>Logged by {loggedBy}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <span className="text-lg font-semibold text-slate-900">
                            {amountLabel}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDelete(tx.id)}
                            className="btn-ghost border border-rose-200/60 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100/40"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </section>

          <aside className="flex w-full flex-col gap-6">
            <div className="glass-card px-6 py-6">
              <h3 className="text-lg font-semibold text-slate-900">Quick filters</h3>
              <p className="mt-1 text-sm text-slate-500">
                Tune your view between personal and shared memories.
              </p>
              <div className="card-divider mt-4" />
              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="category-filter"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Category
                  </label>
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
                  <label
                    htmlFor="view-filter"
                    className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    View mode
                  </label>
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
              </div>
            </div>

            <div className="glass-card px-6 py-6">
              <h3 className="text-lg font-semibold text-slate-900">Log an expense</h3>
              <p className="mt-1 text-sm text-slate-500">
                Capture the moment while it&apos;s still warm.
              </p>
              {error && (
                <div className="mt-4 rounded-xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              )}

              {showAddForm ? (
                <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                  <div>
                    <label
                      htmlFor="amount"
                      className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Amount
                    </label>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="input-soft mt-2"
                      placeholder="Eg. 42.50"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="date"
                      className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Date
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="input-soft mt-2"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Description
                    </label>
                    <input
                      id="description"
                      name="description"
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input-soft mt-2"
                      placeholder="Dinner at Amara, groceries..."
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Category
                    </label>
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
                    <div className="rounded-2xl border border-indigo-100/70 bg-indigo-50/40 px-4 py-4">
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
                          className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-400"
                        />
                        <label htmlFor="shared" className="text-sm font-medium text-slate-600">
                          This one is for both of us
                        </label>
                      </div>

                      {formData.isShared && (
                        <div className="mt-4">
                          <label
                            htmlFor="paid-by"
                            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                          >
                            Who picked up the bill?
                          </label>
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
                    <button type="submit" className="btn-primary">
                      Save expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="btn-ghost"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-6 space-y-4 text-sm text-slate-500">
                  <p>
                    Ready to capture something new? Keep your shared ledger as thoughtful as the way you care for each other.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="btn-primary w-full"
                  >
                    Start adding
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
