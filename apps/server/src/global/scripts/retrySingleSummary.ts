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
import { assert } from "console";
import { InterviewPubSub } from "@root/domains/interview/services/InterviewPubSub";

createContainer();
const prisma = container.resolve<PrismaClient>("PrismaClient");

const getInterviewWithoutSummary = async (id: string) => {
  console.log("getting interviews without summary");
  const interviews = await prisma.interview.findUniqueOrThrow({
    where: {
      id,
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
              speaker: true,
              words: true,
            },
          },
        },
      },
    },
  });

  return interviews;
};

const interviewPubSub =
  container.resolve<InterviewPubSub>("InterviewPublisher");

const publishGenerateSummary = async () => {
  // get interview id from cli args
  const interviewId = process.argv[2];
  console.log(interviewId);

  const interview = await getInterviewWithoutSummary(interviewId);
  const transcript = interview.transcript;
  assert(transcript !== null);

  await interviewPubSub.publishGenerateSummary({
    interviewId: interview.id,
    transcript: transcript as any,
    speakers: (transcript as any).groups.map((group: any) => group.speaker),
  });

  console.log("done publishing generate summary");
};

publishGenerateSummary();
