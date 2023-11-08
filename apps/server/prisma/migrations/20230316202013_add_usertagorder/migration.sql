-- CreateTable
CREATE TABLE "UserTagOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "UserTagOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserTagOrder_userId_key" ON "UserTagOrder"("userId");

-- AddForeignKey
ALTER TABLE "UserTagOrder" ADD CONSTRAINT "UserTagOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTagOrder" ADD CONSTRAINT "UserTagOrder_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
