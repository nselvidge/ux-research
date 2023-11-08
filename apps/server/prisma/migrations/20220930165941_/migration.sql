/*
  Warnings:

  - The `timestamp` column on the `Highlight` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Highlight" DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" TIMESTAMP(3);
