
CREATE TYPE "InterviewSourcePlatforms" AS ENUM ('zoom');

ALTER TABLE "Interview" ADD COLUMN   "creatorId" TEXT;

UPDATE "Interview" SET "creatorId" = (
  SELECT "userId"
  FROM "WorkspaceRole"
  WHERE "WorkspaceRole"."workspaceId" = "Interview"."workspaceId"
  LIMIT 1
);

ALTER TABLE "Interview" ALTER COLUMN "creatorId" SET NOT NULL;

CREATE TABLE "InterviewSource" (
    "id" SERIAL NOT NULL,
    "sourceId" TEXT NOT NULL,
    "platformId" "InterviewSourcePlatforms" NOT NULL,
    "interviewId" TEXT NOT NULL,

    CONSTRAINT "InterviewSource_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InterviewSource_sourceId_key" ON "InterviewSource"("sourceId");

CREATE UNIQUE INDEX "InterviewSource_interviewId_key" ON "InterviewSource"("interviewId");

ALTER TABLE "InterviewSource" ADD CONSTRAINT "InterviewSource_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Interview" ADD CONSTRAINT "Interview_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "InterviewSource" ("sourceId", "platformId", "interviewId")
SELECT "PendingVideo"."externalId", 'zoom', "PendingVideo"."interviewId"
FROM "PendingVideo"
