import { LogLevel } from "fastify";
import winston from "winston";
import LogzioWinstonTransport from "winston-logzio";

export interface Logger {
  fatal: winston.LeveledLogMethod;
  error: winston.LeveledLogMethod;
  debug: winston.LeveledLogMethod;
  trace: winston.LeveledLogMethod;
  warn: winston.LeveledLogMethod;
  info: winston.LeveledLogMethod;
  child: (options: Object) => Logger;
}

export const makeLogger = (prettyPrint: boolean, level: LogLevel): Logger => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      level,
      format: prettyPrint
        ? winston.format.combine(winston.format.json({ space: 2 }))
        : winston.format.json(),
    }),
  ];

  if (!prettyPrint) {
    const logzio = new LogzioWinstonTransport({
      level,
      name: "winston_logzio",
      token: "wYAtbPzInsvLswUhoPMJxMmgLeZwnvMu",
      host: "listener.logz.io",
      extraFields: { environment: process.env.NODE_ENV },
    });
    transports.push(logzio);
  }

  winston.loggers.add("default", {
    level,
    format: winston.format.json(),
    defaultMeta: { service: "resonate" },
    levels: {
      fatal: 0,
      error: 1,
      warn: 2,
      info: 3,
      debug: 4,
      trace: 5,
    },
    transports,
  });

  return winston.loggers.get("default") as any as Logger;
};
