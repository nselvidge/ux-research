import { singleton } from "tsyringe";
import { EnvironmentSettings } from "./environments/base.settings";
import { development } from "./environments/development.settings";
import { production } from "./environments/production.settings";
import { staging } from "./environments/staging.settings";

const settingsMap = {
  development,
  production,
  staging,
};

@singleton()
export class Settings {
  private settings: EnvironmentSettings;
  constructor(env: keyof typeof settingsMap) {
    this.settings = settingsMap[env];
  }

  getSetting = <T extends keyof EnvironmentSettings>(
    key: T
  ): EnvironmentSettings[T] => this.settings[key];
}
