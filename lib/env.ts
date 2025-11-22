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

function ensureDatabaseUrl() {
  const url = ensureEnv("DATABASE_URL")
  const isPostgres = /^postgres(ql)?:\/\//i.test(url)

  if (!isPostgres) {
    throw new Error(
      "DATABASE_URL must start with 'postgresql://' or 'postgres://'. Check your .env and deployment settings."
    )
  }

  return url
}

const databaseUrl = ensureDatabaseUrl()
const directDatabaseUrl = process.env.DIRECT_DATABASE_URL ?? databaseUrl

export const env = {
  NODE_ENV,
  isProduction,
  DATABASE_URL: databaseUrl,
  DIRECT_DATABASE_URL: directDatabaseUrl,
  NEXTAUTH_SECRET: ensureEnv("NEXTAUTH_SECRET", randomBytes(32).toString("hex")),
}
