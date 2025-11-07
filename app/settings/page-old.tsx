"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

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

export default function SettingsPage() {
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
    } finally {
      setLoading(false)
    }
  }

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!inviteEmail.trim()) {
      setError("Please enter an email address")
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
        setError(data.error || "Failed to send invite")
        return
      }

      setSuccess("Invite sent successfully!")
      setInviteEmail("")
      fetchPartnerStatus()
    } catch (err) {
      console.error("Error sending invite:", err)
      setError("Something went wrong")
    }
  }

  async function handleInviteResponse(inviteId: string, action: string) {
    setError("")
    setSuccess("")

    try {
      const res = await fetch(`/api/partner/${inviteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to process invite")
        return
      }

      setSuccess(
        action === "accept"
          ? "Partner invite accepted! You are now in Couple Mode."
          : "Invite rejected"
      )
      fetchPartnerStatus()
    } catch (err) {
      console.error("Error handling invite response:", err)
      setError("Something went wrong")
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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="hero-blob-lg absolute -left-28 top-32 rounded-full bg-linear-to-br from-indigo-200/35 via-white/35 to-transparent blur-3xl" />
          <div className="hero-blob-md absolute right-[-140px] bottom-0 rounded-full bg-linear-to-br from-purple-200/35 via-rose-100/35 to-transparent blur-3xl" />
        </div>
        <div className="glass-card w-full max-w-md px-7 py-6 text-center text-sm text-slate-500">
          Gathering your shared settings...
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

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="glass-card flex flex-wrap items-center justify-between gap-4 px-8 py-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Settings
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">Shape your shared journey</h1>
            <p className="text-sm text-slate-500">
              Manage who you connect with and keep your couple ledger beautifully in sync.
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

        {success && (
          <div className="glass-card border border-emerald-100/70 bg-emerald-50/80 px-6 py-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <section className="glass-card px-8 py-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Account mode</h2>
              <p className="text-sm text-slate-500">
                Choose whether you&apos;re tracking solo or gliding through finances together.
              </p>
            </div>
            <span className="badge-soft" data-variant={inCoupleMode ? "plum" : "slate"}>
              {inCoupleMode ? "Couple mode active" : "Personal mode"}
            </span>
          </div>

          {inCoupleMode ? (
            <div className="mt-6 rounded-2xl bg-white/78 px-6 py-5 text-sm text-slate-600">
              <p>
                You&apos;re currently linked with
                <span className="ml-2 font-semibold text-slate-800">{activePartnerEmail}</span>.
                Every shared expense keeps both views perfectly aligned.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-white/78 px-6 py-5 text-sm text-slate-600">
              <p>
                Switch into couple mode by inviting your partner. Once they accept, shared expenses become effortless.
              </p>
            </div>
          )}
        </section>

        {!inCoupleMode && (
          <section className="glass-card px-8 py-7">
            <h2 className="text-lg font-semibold text-slate-900">Invite your partner</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add their email below. They&apos;ll need an account before they can accept the invite.
            </p>
            <form onSubmit={handleSendInvite} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="invite-email" className="sr-only">
                Partner email
              </label>
              <input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="partner@example.com"
                className="input-soft"
                required
              />
              <button type="submit" className="btn-primary">
                Send invite
              </button>
            </form>
          </section>
        )}

        {pendingInvites.length > 0 && (
          <section className="glass-card px-8 py-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Pending invites</h2>
                <p className="text-sm text-slate-500">
                  Finalise these invites to start sharing the ledger together.
                </p>
              </div>
              <span className="badge-soft" data-variant="slate">
                {pendingInvites.length} awaiting
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {pendingInvites.map((invite) => {
                const isSender = invite.invitedBy === invite.user1.id
                const otherUser = isSender ? invite.user2 : invite.user1
                const amIReceiver = invite.user2.id !== invite.invitedBy

                return (
                  <div
                    key={invite.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/78 px-5 py-4 shadow-sm shadow-slate-200/70"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {amIReceiver ? "Invite from" : "Invite sent to"}
                        <span className="ml-2 text-indigo-600">{otherUser.email}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(invite.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {amIReceiver && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleInviteResponse(invite.id, "accept")}
                          className="btn-primary"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInviteResponse(invite.id, "reject")}
                          className="btn-ghost border border-rose-200/60 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-100/40"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
