import { init, track } from "@amplitude/analytics-node";
import { inject, injectable } from "tsyringe";
import { Logger } from "./logger";
import { Settings } from "./Settings";

@injectable()
export class Tracker {
  private shouldTrack: boolean;
  constructor(settings: Settings, @inject("Logger") private logger: Logger) {
    this.shouldTrack = settings.getSetting("shouldTrackAnalytics");
    if (this.shouldTrack) {
      init(settings.getSetting("analyticsApiKey"));
    }
  }
  trackEvent = (event: string, properties: any, userId: string) => {
    if (this.shouldTrack) {
      track(event, properties, { user_id: userId });
    } else {
      this.logger.info(event, { properties, userId });
    }
  };
}
