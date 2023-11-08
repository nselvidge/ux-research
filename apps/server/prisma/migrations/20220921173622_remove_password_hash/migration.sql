/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - Added the required column `authType` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `credentials` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('local');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordHash",
ADD COLUMN     "authType" "AuthType" NOT NULL,
ADD COLUMN     "credentials" TEXT NOT NULL;
