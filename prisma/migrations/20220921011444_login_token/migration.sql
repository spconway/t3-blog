/*
  Warnings:

  - You are about to drop the column `expires` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `VerificationToken` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "VerificationToken_token_key";

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "expires",
DROP COLUMN "token";
