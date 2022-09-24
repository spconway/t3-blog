/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_key" ON "VerificationToken"("identifier");
