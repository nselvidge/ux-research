-- CreateEnum
CREATE TYPE "TagColor" AS ENUM ('red', 'orange', 'yellow', 'green', 'indigo', 'sky', 'purple');

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "color" "TagColor" NOT NULL DEFAULT 'red';
