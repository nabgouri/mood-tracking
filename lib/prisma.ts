import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit during hot reload in Next.js

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create SQLite adapter with URL (Prisma 7 syntax)
const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' })

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'], // Logs all queries in development
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
