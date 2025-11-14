import Link from "next/link"

const terms = [
  {
    title: "Account",
    body:
      "Use Finance Tracker for your own budgeting needs. You are responsible for keeping your login credentials secure and for the activity performed through your account.",
  },
  {
    title: "Data",
    body:
      "You own the data you add. We provide the tools to manage it and may remove content that violates applicable laws or our acceptable use policy.",
  },
  {
    title: "Availability",
    body:
      "We aim for near-continuous uptime, but this software is provided on an as-is basis. We cannot be liable for any loss that results from downtime or bugs.",
  },
  {
    title: "Billing",
    body:
      "If paid tiers launch in the future, pricing changes will be announced in advance and you may cancel at any time.",
  },
]

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Updated November 2025</p>
          <h1 className="text-3xl font-semibold">Terms of Service</h1>
          <p className="mt-4 text-muted-foreground">
            By using Finance Tracker you agree to the expectations below. The summary is intentionally
            simple so you always know what to expect from us.
          </p>
        </div>

        <div className="space-y-5">
          {terms.map((term) => (
            <section key={term.title} className="rounded-lg border bg-background p-5">
              <h2 className="text-lg font-medium">{term.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{term.body}</p>
            </section>
          ))}
        </div>

        <div className="rounded-lg border bg-muted/40 p-5 text-sm text-muted-foreground">
          <p>
            Questions about these terms? Drop us a note at
            <Link href="mailto:support@example.com" className="font-medium text-foreground">
              {" "}support@example.com
            </Link>
            . We are happy to walk through the details before you continue using the product.
          </p>
        </div>
      </div>
    </main>
  )
}
