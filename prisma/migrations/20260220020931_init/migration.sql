-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "qty" INTEGER NOT NULL DEFAULT 1,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_code_key" ON "Guest"("code");
