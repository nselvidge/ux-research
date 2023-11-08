import "reflect-metadata";
import "../moduleAlias";
import { container } from "tsyringe";

import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../", `.env.${process.env.NODE_ENV}`),
  override: true,
});

import { createContainer } from "../defaultContainer";
import { PrismaClient } from "../generated/prisma";
import { CoordinatorInteractor } from "@root/domains/interview/interactors/CoordinatorInteractor";
import { CreatorInteractor } from "@root/domains/video/interactors/CreatorInteractor";

createContainer();
const prisma = container.resolve<PrismaClient>("PrismaClient");

const interviewId = process.argv[2];

// get interviews that don't have a recording
const getInterview = async () => {
  console.log("getting interview:", interviewId);
  return await prisma.interview.findUniqueOrThrow({
    where: {
      id: interviewId,
    },
    include: {
      source: true,
      highlights: {
        include: {
          tags: true,
          transcript: {
            include: {
              groups: {
                include: {
                  words: true,
                },
              },
            },
          },
          highlightedRange: {
            include: {
              startWord: true,
              endWord: true,
            },
          },
        },
      },
      transcript: {
        include: {
          groups: {
            include: {
              words: true,
            },
          },
        },
      },
    },
  });
};

const coordinator = container.resolve(CoordinatorInteractor);
const creator = container.resolve(CreatorInteractor);

const retryZoomImport = async () => {
  const interview = await getInterview();
  console.log("retrying interview", interview.name);

  if (!interview.source?.sourceId) {
    console.log("no source id");
    return;
  }

  await creator.checkRecordingStatus({
    sourceId: interview.source?.sourceId,
    userId: interview.creatorId,
    source: interview.source?.platform,
    interviewId: interview.id,
  });

  console.log("done");
};

retryZoomImport();
