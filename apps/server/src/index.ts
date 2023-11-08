import "reflect-metadata";
import "./global/moduleAlias";
import { App } from "@root/App";
import { container } from "tsyringe";
import { Settings } from "./global/Settings";
import { createContainer } from "./global/defaultContainer";
import { Logger } from "./global/logger";

createContainer();

const app = container.resolve(App);
const settings = container.resolve(Settings);

app.createServer().then((server) =>
  server
    .listen({
      port: parseInt(settings.getSetting("port"), 10),
    })
    .then(() =>
      container
        .resolve<Logger>("Logger")
        .info(`listening on port ${settings.getSetting("port")}`)
    )
);
