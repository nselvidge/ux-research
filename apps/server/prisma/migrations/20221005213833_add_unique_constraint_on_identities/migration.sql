/*
  Warnings:

  - A unique constraint covering the columns `[type,token]` on the table `Identity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Identity_type_token_key" ON "Identity"("type", "token");
