import dayjs, { type PluginFunc } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(relativeTime);

declare module "dayjs" {
  interface Dayjs {
    // Copy from timezone plugin
    tz(timezone?: string, keepLocalTime?: boolean): dayjs.Dayjs;
    offsetName(type?: "short" | "long"): string | undefined;

    formatDate(defaultValue?: string): string;
    fromNowX(defaultValue?: string): string;
    displayDateOrTime(): string;
  }

  // Copy from timezone plugin
  interface DayjsTimezone {
    (date?: dayjs.ConfigType, timezone?: string): dayjs.Dayjs;
    (date: dayjs.ConfigType, format: string, timezone?: string): dayjs.Dayjs;
    guess(): string;
    setDefault(timezone?: string): void;
  }

  // const tz: DayjsTimezone;
}

const plugin: PluginFunc = (_option, dayjsClass, _dayjsFactory) => {
  dayjsClass.prototype.formatDate = function (defaultValue = "-") {
    if (this.isValid()) {
      return this.format("YYYY-MM-DD HH:mm");
    }
    return defaultValue;
  };

  dayjsClass.prototype.fromNowX = function (defaultValue = "-") {
    if (this.isValid()) {
      return this.fromNow();
    }
    return defaultValue;
  };

  dayjsClass.prototype.displayDateOrTime = function (defaultValue = "") {
    if (!this.isValid()) {
      return defaultValue;
    }

    const now = dayjs();

    if (now.diff(this, "hour") > 24) {
      return this.format("YYYY-MM-DD");
    }
    return this.format("HH:mm");
  };
};

export default plugin;
