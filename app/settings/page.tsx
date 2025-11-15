"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { ArrowLeft, Settings2, Users, Mail, Send, Check, X, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { PatternBackdrop } from "@/components/ui/pattern-backdrop"

type User = {
  id: string
  name: string | null
  email: string
}

type PartnerLink = {
  id: string
  status: string
  invitedBy: string
  user1: User
  user2: User
  createdAt: string
  acceptedAt: string | null
}

type PartnerStatus = {
  activePartner: PartnerLink | null
  pendingInvites: PartnerLink[]
  isCoupleMode: boolean
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

export default function SettingsPage() {
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")

  useEffect(() => {
    fetchPartnerStatus()
  }, [])

  async function fetchPartnerStatus() {
    try {
      const res = await fetch("/api/partner")
      if (res.ok) {
        const data = await res.json()
        setPartnerStatus(data)
      }
    } catch (error) {
      console.error("Error fetching partner status:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault()

    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address")
      return
    }

    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerEmail: inviteEmail }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to send invite")
        return
      }

      toast.success("Invite sent successfully!")
      setInviteEmail("")
      fetchPartnerStatus()
    } catch (err) {
      console.error("Error sending invite:", err)
      toast.error("Something went wrong")
    }
  }

  async function handleInviteResponse(inviteId: string, action: string) {
    try {
      const res = await fetch(`/api/partner/${inviteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to process invite")
        return
      }

      toast.success(
        action === "accept"
          ? "Partner invite accepted! You are now in Couple Mode."
          : "Invite rejected"
      )
      fetchPartnerStatus()
    } catch (err) {
      console.error("Error handling invite response:", err)
      toast.error("Something went wrong")
    }
  }

  const inCoupleMode = Boolean(partnerStatus?.isCoupleMode)
  const activePartnerEmail = partnerStatus?.activePartner
    ? partnerStatus.activePartner.user1.id === partnerStatus.activePartner.invitedBy
      ? partnerStatus.activePartner.user2.email
      : partnerStatus.activePartner.user1.email
    : null
  const pendingInvites = partnerStatus?.pendingInvites ?? []

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="h-12 w-12 mx-auto mb-4 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground">Loading settings...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen px-6 pb-24 pt-24 sm:px-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-blob-lg absolute -left-32 top-24 rounded-full bg-linear-to-br from-emerald-500/25 via-teal-500/15 to-transparent blur-3xl" />
        <div className="hero-blob-md absolute right-[-140px] bottom-0 rounded-full bg-linear-to-br from-cyan-500/20 via-sky-500/15 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsla(173,85%,38%,0.18),transparent_60%)]" />
      </div>
      <PatternBackdrop
        rounded={false}
        className="hidden lg:block opacity-60"
        overlayClassName="from-emerald-500/15 via-transparent to-[#031b16]/80"
      />

      <motion.div
        className="relative mx-auto flex w-full max-w-5xl flex-col gap-8"
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
                    <Settings2 className="h-5 w-5 text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Settings
                    </p>
                  </div>
                  <CardTitle className="text-3xl">Shape your shared journey</CardTitle>
                  <CardDescription>
                    Manage who you connect with and keep your couple ledger beautifully in sync.
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
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">Account mode</CardTitle>
                  <CardDescription>
                    Choose whether you&apos;re tracking solo or gliding through finances together.
                  </CardDescription>
                </div>
                <span className={`badge-soft`} data-variant={inCoupleMode ? "plum" : "slate"}>
                  {inCoupleMode ? (
                    <>
                      <Heart className="h-3 w-3" />
                      Couple mode active
                    </>
                  ) : (
                    "Personal mode"
                  )}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">
                {inCoupleMode ? (
                  <motion.div
                    key="couple"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-2xl bg-linear-to-br from-primary/5 via-emerald-500/10 to-cyan-500/5 border border-primary/10 px-6 py-5 text-sm"
                  >
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      You&apos;re currently linked with
                      <span className="font-semibold text-primary">{activePartnerEmail}</span>.
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      Every shared expense keeps both views perfectly aligned.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-2xl bg-muted/50 px-6 py-5 text-sm text-muted-foreground"
                  >
                    <p>
                      Switch into couple mode by inviting your partner. Once they accept, shared expenses become effortless.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.section>

        {!inCoupleMode && (
          <motion.section variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invite your partner</CardTitle>
                <CardDescription>
                  Add their email below. They&apos;ll need an account before they can accept the invite.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendInvite} className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <Label htmlFor="invite-email" className="sr-only">
                      Partner email
                    </Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="partner@example.com"
                      required
                    />
                  </div>
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    Send invite
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.section>
        )}

        <AnimatePresence>
          {pendingInvites.length > 0 && (
            <motion.section
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">Pending invites</CardTitle>
                      <CardDescription>
                        Finalise these invites to start sharing the ledger together.
                      </CardDescription>
                    </div>
                    <span className="badge-soft" data-variant="slate">
                      {pendingInvites.length} awaiting
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {pendingInvites.map((invite) => {
                        const isSender = invite.invitedBy === invite.user1.id
                        const otherUser = isSender ? invite.user2 : invite.user1
                        const amIReceiver = invite.user2.id !== invite.invitedBy

                        return (
                          <motion.div
                            key={invite.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-card/80 backdrop-blur-sm px-5 py-4 shadow-sm border border-border/50"
                          >
                            <div>
                              <p className="text-sm font-semibold flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                {amIReceiver ? "Invite from" : "Invite sent to"}
                                <span className="text-primary">{otherUser.email}</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(invite.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {amIReceiver && (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleInviteResponse(invite.id, "accept")}
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Accept
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleInviteResponse(invite.id, "reject")}
                                  className="border border-destructive/20 text-destructive hover:bg-destructive/10"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
