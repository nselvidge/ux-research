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
import { AMQPPubSub } from "@root/domains/messages/services/AMQPPubSub";

createContainer();
const prisma = container.resolve<PrismaClient>("PrismaClient");

const amqp = container.resolve(AMQPPubSub);

const getQueueLength = async () => {
  const queue = await amqp.getSubscribeChannel("GENERATE_SUMMARY");

  const res = await queue.checkQueue("GENERATE_SUMMARY");
  console.log(res);
};

getQueueLength();
