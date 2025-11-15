"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Spotlight } from "@/components/ui/spotlight"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowRight, Heart, TrendingUp, Users, Sparkles, Shield, Zap, DollarSign, BarChart3, Lock } from "lucide-react"

export default function Home() {

  const features = [
    {
      title: "Personal workspace",
      description:
        "Keep your own categories, notes, and filters without sharing every detail.",
      icon: <Sparkles className="h-6 w-6" />,
    },
    {
      title: "Effortless couple mode",
      description:
        "Invite your partner with one link, toggle shared spending, and stay on the same page.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Balanced settlements",
      description:
        "Automatic insights show who covered what, so settling up is never awkward.",
      icon: <Shield className="h-6 w-6" />,
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="hsl(var(--primary))" />
        <motion.div 
          className="absolute left-1/2 -top-72 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-emerald-500/10 to-teal-500/10 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-gradient-to-tr from-cyan-500/20 via-teal-500/10 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">OurStory</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:flex">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8">\n        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium border border-primary/20 mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              Built for couples who value transparency
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="block">Track expenses.</span>
              <span className="block bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Share your story.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <TextGenerateEffect
                className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl"
                words="The beautiful way for couples to manage personal and shared expenses. No awkward money talks, just clarity and balance."
                duration={0.7}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <Button asChild size="lg" className="w-full sm:w-auto group">
                <Link href="/auth/signup">
                  Start Your Story
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-4 text-sm text-muted-foreground"
            >
              Free to start. No credit card required.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for real couples managing real expenses
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <HoverEffect items={features} />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
              icon={<Users className="h-6 w-6" />} 
              value="2,500+" 
              label="Happy Couples"
            />
            <StatsCard 
              icon={<TrendingUp className="h-6 w-6" />} 
              value="$2M+" 
              label="Tracked Together"
            />
            <StatsCard 
              icon={<BarChart3 className="h-6 w-6" />} 
              value="50K+" 
              label="Transactions"
            />
            <StatsCard 
              icon={<Zap className="h-6 w-6" />} 
              value="99%" 
              label="Satisfaction"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in minutes
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <ProcessStep
              step="1"
              title="Create Your Account"
              description="Sign up in seconds. Start tracking your personal expenses immediately."
              icon={<DollarSign className="h-6 w-6" />}
            />
            <ProcessStep
              step="2"
              title="Invite Your Partner"
              description="Share a simple invite link. They join with one click and you&rsquo;re connected."
              icon={<Users className="h-6 w-6" />}
            />
            <ProcessStep
              step="3"
              title="Track Together"
              description="Log expenses, mark what&rsquo;s shared, and see who owes what—automatically."
              icon={<BarChart3 className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-linear-to-br from-primary/10 via-emerald-500/10 to-teal-500/10 border border-primary/20 p-8 sm:p-12 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to start your story?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of couples who&rsquo;ve found financial clarity together.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto group">
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Free to Start</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">OurStory</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 OurStory. Built with ❤️ for couples.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProcessStep({ 
  step, 
  title, 
  description, 
  icon 
}: { 
  step: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <div className="absolute -top-2 -left-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {step}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  )
}

function StatsCard({ 
  icon, 
  value, 
  label
}: { 
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-border/50 bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="flex justify-center text-primary mb-3">
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}
