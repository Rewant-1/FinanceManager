import Link from "next/link"

const sections = [
  {
    title: "What we collect",
    body:
      "We store only the data required to run your account: your email, hashed password, and the financial records you add inside the dashboard.",
  },
  {
    title: "How we use it",
    body:
      "Data stays within your workspace and is used strictly to show balances, categories, and partner insights. We never sell or share your information with third parties.",
  },
  {
    title: "Your control",
    body:
      "You can request an export or deletion at any time by reaching out to support. Removing your account deletes all personal and transactional data from our database.",
  },
]

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Updated November 2025</p>
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">
            Finance Tracker was created for personal budgeting. Everything below summarizes how we
            handle your information, but reach out if you need anything clarified.
          </p>
        </div>

        <div className="space-y-5">
          {sections.map((section) => (
            <section key={section.title} className="rounded-lg border bg-background p-5">
              <h2 className="text-lg font-medium">{section.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="rounded-lg border bg-muted/40 p-5 text-sm text-muted-foreground">
          <p>
            Need to update or delete your data? Email us at
            <Link href="mailto:support@example.com" className="font-medium text-foreground">
              {" "}support@example.com
            </Link>
            , and we will respond within two business days.
          </p>
        </div>
      </div>
    </main>
  )
}
