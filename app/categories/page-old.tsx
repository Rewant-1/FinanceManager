"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

type Category = {
  id: string
  name: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (err) {
      console.error("Error fetching categories:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!newCategoryName.trim()) return

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create category")
        return
      }

      setCategories([...categories, data])
      setNewCategoryName("")
    } catch (err) {
      console.error("Error creating category:", err)
      setError("Something went wrong")
    }
  }

  async function handleUpdate(id: string) {
    setError("")

    if (!editingName.trim()) return

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to update category")
        return
      }

      setCategories(categories.map((c) => (c.id === id ? data : c)))
      setEditingId(null)
      setEditingName("")
    } catch (err) {
      console.error("Error updating category:", err)
      setError("Something went wrong")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return

    setError("")

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to delete category")
        return
      }

      setCategories(categories.filter((c) => c.id !== id))
    } catch (err) {
      console.error("Error deleting category:", err)
      setError("Something went wrong")
    }
  }

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="hero-blob-lg absolute -left-28 top-32 rounded-full bg-linear-to-br from-slate-200/40 via-indigo-200/35 to-transparent blur-3xl" />
          <div className="hero-blob-md absolute right-[-120px] bottom-0 rounded-full bg-linear-to-br from-purple-200/35 via-rose-100/35 to-transparent blur-3xl" />
        </div>
        <div className="glass-card w-full max-w-sm px-6 py-5 text-center text-sm text-slate-500">
          Fetching your categories...
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-24 pt-24 sm:px-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-blob-lg absolute -left-32 top-24 rounded-full bg-linear-to-br from-indigo-100/45 via-white/40 to-transparent blur-3xl" />
        <div className="hero-blob-md absolute right-[-140px] bottom-0 rounded-full bg-linear-to-br from-pink-200/35 via-blue-100/40 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="glass-card flex flex-wrap items-center justify-between gap-4 px-8 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Your categories</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Tailor the way you track</h1>
            <p className="mt-2 text-sm text-slate-500">
              Create gentle buckets for the moments you spend, together and apart.
            </p>
          </div>
          <Link href="/dashboard" className="btn-secondary">
            Back to dashboard
          </Link>
        </header>

        {error && (
          <div className="glass-card border border-rose-100/70 bg-rose-50/80 px-6 py-4 text-sm text-rose-600">
            {error}
          </div>
        )}

        <section className="glass-card px-8 py-7">
          <h2 className="text-lg font-semibold text-slate-900">Add new category</h2>
          <p className="mt-1 text-sm text-slate-500">
            Think occasions, moods, or rituals that feel right for both of you.
          </p>
          <form onSubmit={handleAdd} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="new-category" className="sr-only">
              Category name
            </label>
            <input
              id="new-category"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Spa day, date night, groceries..."
              className="input-soft"
              required
            />
            <button type="submit" className="btn-primary">
              Add
            </button>
          </form>
        </section>

        <section className="glass-card px-8 py-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Your collection</h2>
              <p className="text-sm text-slate-500">Shape your ledger to mirror the life you&apos;re building.</p>
            </div>
            <span className="badge-soft" data-variant="slate">
              {categories.length} saved
            </span>
          </div>

          {categories.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white/75 px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
              No categories yet. Add your first one above to personalise your flow.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/78 px-5 py-4 shadow-sm shadow-slate-200/70"
                >
                  {editingId === category.id ? (
                    <div className="flex w-full flex-col gap-3 sm:flex-row">
                      <label htmlFor="edit-category" className="sr-only">
                        Edit category name
                      </label>
                      <input
                        id="edit-category"
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="input-soft sm:flex-1"
                        autoFocus
                        required
                      />
                      <div className="flex gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => handleUpdate(category.id)}
                          className="btn-primary"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null)
                            setEditingName("")
                          }}
                          className="btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="text-base font-semibold text-slate-800">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(category.id)
                            setEditingName(category.name)
                          }}
                          className="btn-ghost border border-indigo-200/60 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="btn-ghost border border-rose-200/60 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100/40"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
