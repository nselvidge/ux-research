import { PrismaClient } from "@root/global/generated/prisma";
import { inject, injectable } from "tsyringe";

@injectable()
export class SessionRepository {
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}
  set = async (
    id: string,
    session: any,
    callback: (error: Error | undefined) => void
  ) => {
    try {
      await this.prisma.session.upsert({
        where: { id },
        create: { id, session: JSON.stringify(session) },
        update: { session: JSON.stringify(session) },
      });
      return callback(undefined);
    } catch (err: any) {
      return callback(err);
    }
  };

  get = async (
    id: string,
    callback: (error: Error | null, session: any) => void
  ) => {
    try {
      const session = await this.prisma.session.findUnique({
        where: { id },
      });
      callback(null, session ? JSON.parse(session.session) : null);
    } catch (err: any) {
      return callback(err, {});
    }
  };

  destroy = async (
    id: string,
    callback: (error: Error | undefined) => void
  ) => {
    try {
      await this.prisma.session.delete({ where: { id } });
      callback(undefined);
    } catch (err: any) {
      return callback(err);
    }
  };
}
