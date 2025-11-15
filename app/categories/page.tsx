"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { ArrowLeft, Plus, Edit, Trash2, Tags, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { PatternBackdrop } from "@/components/ui/pattern-backdrop"

type Category = {
  id: string
  name: string
}

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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

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
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()

    if (!newCategoryName.trim()) return

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to create category")
        return
      }

      setCategories([...categories, data])
      setNewCategoryName("")
      toast.success("Category created successfully!")
    } catch (err) {
      console.error("Error creating category:", err)
      toast.error("Something went wrong")
    }
  }

  async function handleUpdate(id: string) {
    if (!editingName.trim()) return

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to update category")
        return
      }

      setCategories(categories.map((c) => (c.id === id ? data : c)))
      setEditingId(null)
      setEditingName("")
      toast.success("Category updated successfully!")
    } catch (err) {
      console.error("Error updating category:", err)
      toast.error("Something went wrong")
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to delete category")
        return
      }

      setCategories(categories.filter((c) => c.id !== id))
      toast.success("Category deleted successfully!")
    } catch (err) {
      console.error("Error deleting category:", err)
      toast.error("Something went wrong")
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
          <p className="text-muted-foreground">Loading categories...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen px-6 pb-24 pt-24 sm:px-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-blob-lg absolute -left-32 top-24 rounded-full bg-linear-to-br from-emerald-500/20 via-teal-500/15 to-transparent blur-3xl" />
        <div className="hero-blob-md absolute right-[-140px] bottom-0 rounded-full bg-linear-to-br from-cyan-500/20 via-sky-500/15 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(173,80%,38%,0.18),transparent_65%)]" />
      </div>
      <PatternBackdrop
        rounded={false}
        className="hidden lg:block opacity-60"
        overlayClassName="from-emerald-500/15 via-transparent to-[#031d17]/80"
      />

      <motion.div
        className="relative mx-auto flex w-full max-w-4xl flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tags className="h-5 w-5 text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Your categories
                    </p>
                  </div>
                  <CardTitle className="text-3xl">Tailor the way you track</CardTitle>
                  <CardDescription>
                    Create gentle buckets for the moments you spend, together and apart.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <ModeToggle />
                  <Button variant="secondary" asChild>
                    <Link href="/dashboard">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to dashboard
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.header>

        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add new category</CardTitle>
              <CardDescription>
                Think occasions, moods, or rituals that feel right for both of you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <Label htmlFor="new-category" className="sr-only">
                    Category name
                  </Label>
                  <Input
                    id="new-category"
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Spa day, date night, groceries..."
                    required
                  />
                </div>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">Your collection</CardTitle>
                  <CardDescription>
                    Shape your ledger to mirror the life you&apos;re building.
                  </CardDescription>
                </div>
                <span className="badge-soft" data-variant="slate">
                  {categories.length} saved
                </span>
              </div>
            </CardHeader>

            <CardContent>
              {categories.length === 0 ? (
                <div className="rounded-2xl bg-muted/50 px-6 py-10 text-center text-sm text-muted-foreground">
                  No categories yet. Add your first one above to personalise your flow.
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {categories.map((category) => (
                      <motion.div
                        key={category.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card/80 backdrop-blur-sm px-5 py-4 shadow-sm border border-border/50"
                      >
                        {editingId === category.id ? (
                          <div className="flex w-full flex-col gap-3 sm:flex-row">
                            <Input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="sm:flex-1"
                              autoFocus
                              required
                            />
                            <div className="flex gap-2 sm:justify-end">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleUpdate(category.id)}
                              >
                                <Save className="mr-2 h-4 w-4" />
                                Save
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingId(null)
                                  setEditingName("")
                                }}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-base font-semibold">{category.name}</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingId(category.id)
                                  setEditingName(category.name)
                                }}
                                className="border border-primary/20 text-primary hover:bg-primary/10"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this category?")) {
                                    handleDelete(category.id)
                                  }
                                }}
                                className="border border-destructive/20 text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
    </div>
  )
}
