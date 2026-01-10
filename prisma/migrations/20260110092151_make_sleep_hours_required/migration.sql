/*
  Warnings:

  - Made the column `sleepHours` on table `MoodEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MoodEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "mood" INTEGER NOT NULL DEFAULT 0,
    "feelings" TEXT NOT NULL,
    "journalEntry" TEXT NOT NULL,
    "sleepHours" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MoodEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MoodEntry" ("createdAt", "feelings", "id", "journalEntry", "mood", "sleepHours", "updatedAt", "userId") SELECT "createdAt", "feelings", "id", "journalEntry", "mood", "sleepHours", "updatedAt", "userId" FROM "MoodEntry";
DROP TABLE "MoodEntry";
ALTER TABLE "new_MoodEntry" RENAME TO "MoodEntry";
CREATE INDEX "MoodEntry_userId_idx" ON "MoodEntry"("userId");
CREATE INDEX "MoodEntry_createdAt_idx" ON "MoodEntry"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
