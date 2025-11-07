"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Spotlight } from "@/components/ui/spotlight"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowRight, Heart, TrendingUp, Users } from "lucide-react"

export default function Home() {
  const features = [
    {
      title: "Personal workspace",
      description:
        "Keep your own categories, notes, and filters without sharing every detail.",
    },
    {
      title: "Effortless couple mode",
      description:
        "Invite your partner with one link, toggle shared spending, and stay on the same page.",
    },
    {
      title: "Balanced settlements",
      description:
        "Automatic insights show who covered what, so settling up is never awkward.",
    },
  ]

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden px-6 pb-24 pt-20 sm:pt-32">
      <div className="absolute inset-0 -z-10">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="hsl(var(--primary))" />
        <div className="hero-blob-lg absolute left-1/2 -top-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10 blur-3xl" />
        <div className="hero-blob-md absolute -right-40 top-1/3 rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-transparent blur-3xl" />
      </div>

      <div className="absolute top-6 right-6 z-50">
        <ModeToggle />
      </div>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-16 sm:px-12"
      >
        <motion.header
          className="max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium shadow-lg backdrop-blur-sm border border-primary/20"
          >
            <Heart className="h-4 w-4 text-primary" />
            Designed for real-life budgeting
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="section-title mt-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Couples&rsquo; Expense Hub
            </h1>
          </motion.div>

          <TextGenerateEffect
            words="A serene space to capture your personal spending, share costs effortlessly, and keep the money talk calm, clear, and balanced."
            className="mt-6 text-lg text-muted-foreground"
            duration={0.8}
          />
        </motion.header>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Button asChild size="lg" className="group">
            <Link href="/auth/signup">
              Create your account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/auth/signin">Sign in</Link>
          </Button>
        </motion.div>

        <motion.section
          className="w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <HoverEffect items={features} className="mt-8" />
        </motion.section>

        <motion.div
          className="mt-12 grid w-full gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <StatsCard icon={<Users className="h-8 w-8" />} value="2,500+" label="Happy Couples" />
          <StatsCard icon={<TrendingUp className="h-8 w-8" />} value="$2M+" label="Tracked Together" />
          <StatsCard icon={<Heart className="h-8 w-8" />} value="99%" label="Satisfaction Rate" />
        </motion.div>
      </motion.main>
    </div>
  )
}

function StatsCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 text-center shadow-lg transition-all"
    >
      <div className="text-primary">{icon}</div>
      <div className="text-3xl font-bold bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}
