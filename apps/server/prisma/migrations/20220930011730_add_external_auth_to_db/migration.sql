-- CreateEnum
CREATE TYPE "ExternalAuthTypes" AS ENUM ('zoom');

-- CreateTable
CREATE TABLE "ExternalAuth" (
    "userId" TEXT NOT NULL,
    "type" "ExternalAuthTypes" NOT NULL,
    "authToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" INTEGER NOT NULL,

    CONSTRAINT "ExternalAuth_pkey" PRIMARY KEY ("userId","type")
);

-- AddForeignKey
ALTER TABLE "ExternalAuth" ADD CONSTRAINT "ExternalAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
