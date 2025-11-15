import { randomBytes } from "crypto"

const NODE_ENV = process.env.NODE_ENV ?? "development"
const isProduction = NODE_ENV === "production"

function ensureEnv(key: string, devFallback?: string) {
  const value = process.env[key] ?? (!isProduction ? devFallback : undefined)

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Add it to your environment or .env file before running the app.`
    )
  }

  return value
}

export const env = {
  NODE_ENV,
  isProduction,
  DATABASE_URL: ensureEnv("DATABASE_URL", "file:./dev.db"),
  NEXTAUTH_SECRET: ensureEnv("NEXTAUTH_SECRET", randomBytes(32).toString("hex")),
}
