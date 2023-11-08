-- CreateEnum
CREATE TYPE "IdentityType" AS ENUM ('password', 'zoom');

-- CreateTable
CREATE TABLE "Identity" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "IdentityType" NOT NULL DEFAULT 'password',

    CONSTRAINT "Identity_pkey" PRIMARY KEY ("userId","type")
);

-- AddForeignKey
ALTER TABLE "Identity" ADD CONSTRAINT "Identity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "Identity" ("userId", "token")
SELECT id as "userId", "credentials" as "token" FROM "User";

ALTER TABLE "Identity" ALTER "type" DROP DEFAULT;