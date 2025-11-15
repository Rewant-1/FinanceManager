import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

async function main() {
  const prisma = new PrismaClient()
  try {
    const email = `cli-test+${Date.now()}@example.com`
    const passwordHash = await hash("VerySecure123!", 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        name: "CLI Test",
      },
    })

    const defaults = [
      "Groceries",
      "Rent",
      "Transportation",
      "Entertainment",
      "Utilities",
      "Healthcare",
      "Food & Dining",
      "Shopping",
    ]

    await prisma.category.createMany({
      data: defaults.map((name) => ({
        name,
        userId: user.id,
      })),
    })

    console.log(`Created user ${email} with ${defaults.length} categories`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((err) => {
  console.error("Signup simulation failed", err)
  process.exitCode = 1
})
