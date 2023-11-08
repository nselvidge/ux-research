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

createContainer();
const prisma = container.resolve<PrismaClient>("PrismaClient");

// get interviews that don't have a recording
const getInterviewsWithoutRecording = async () => {
  console.log("getting interviews without recording");
  const interviews = await prisma.interview.findMany({
    where: {
      recordingId: null,
      archived: false,
      date: {
        lte: new Date(new Date().getTime() - 1000 * 60 * 60 * 2),
      },
      source: {
        platform: "zoom",
      },
    },
    take: 300,
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
  console.log(interviews);
  return interviews;
};

const coordinator = container.resolve(CoordinatorInteractor);

const retryZoomImport = async () => {
  const interviews = await getInterviewsWithoutRecording();
  console.log("got interviews", interviews.length);
  for (const interview of interviews) {
    console.log("retrying interview", interview.id);
    if (!interview.source?.sourceId) {
      console.log("no source id");
      return;
    }
    await coordinator.handleInterviewReady(interview.source?.sourceId, "zoom");
  }
  console.log("done");
};

retryZoomImport();
