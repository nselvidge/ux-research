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
import { AMQPPubSub } from "@root/domains/messages/services/AMQPPubSub";

createContainer();
const prisma = container.resolve<PrismaClient>("PrismaClient");

const amqp = container.resolve(AMQPPubSub);

const getInterviewWithoutSummary = async (lastId = "") => {
  const id = process.argv[2];
  console.log("getting interviews without summary");
  const interviews = await prisma.interview.findMany({
    where: {
      summary: null,
      transcript: {
        isNot: null,
      },
      archived: false,
      id: id
        ? id
        : {
            gt: lastId,
          },
    },
    take: 30,
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
    orderBy: {
      id: "asc",
    },
  });

  return interviews;
};

const interviewPubSub =
  container.resolve<InterviewPubSub>("InterviewPublisher");

const publishGenerateSummary = async () => {
  const totalInterviewCount = await prisma.interview.count({
    where: {
      summary: null,
      transcript: {
        isNot: null,
      },
      archived: false,
    },
  });
  console.log("total interviews without summary: " + totalInterviewCount);
  let lastId = "";
  // pull 50 interviews at a time, and publish them to the queue
  for (let i = 0; i < totalInterviewCount; i += 30) {
    const interviews = await getInterviewWithoutSummary(lastId);
    console.log(
      "publishing generate summary for interviews. count: " + interviews.length
    );
    for (const interview of interviews) {
      console.log(`processing interview ${interview.id}`);
      const transcript = interview.transcript;
      assert(transcript !== null);

      await interviewPubSub.publishGenerateSummary({
        interviewId: interview.id,
        transcript: transcript as any,
        speakers: (transcript as any).groups.map((group: any) => group.speaker),
      });
      lastId = interview.id;
    }
    console.log(
      `finished publishing generate summary for interview $ ${i} - ${i + 30}`
    );
  }
  console.log("done publishing generate summary");
};

publishGenerateSummary();
