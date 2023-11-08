import "reflect-metadata";
import "../moduleAlias";

import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../../", `.env.${process.env.NODE_ENV}`),
  override: true,
});

import { createContainer } from "../defaultContainer";
import { PrismaClient } from "../generated/prisma";
import { container } from "tsyringe";

createContainer();

export const prisma = container.resolve<PrismaClient>("PrismaClient");
