/*
  Warnings:

  - You are about to drop the column `authType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `credentials` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "authType",
DROP COLUMN "credentials";
