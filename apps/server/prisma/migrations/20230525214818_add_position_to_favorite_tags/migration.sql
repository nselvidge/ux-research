/*
  Warnings:

  - Added the required column `position` to the `FavoriteTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FavoriteTag" ADD COLUMN     "position" INTEGER NOT NULL;
