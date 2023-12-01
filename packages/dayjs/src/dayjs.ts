import dayjs, { PluginFunc, ConfigType, Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";

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

const plugin: PluginFunc = (option, dayjsClass, dayjsFactory) => {
  dayjsClass.prototype.formatDate = function (defaultValue = "-") {
    if (this.isValid()) {
      return this.format("YYYY-MM-DD HH:mm");
    } else {
      return defaultValue;
    }
  };

  dayjsClass.prototype.fromNowX = function (defaultValue = "-") {
    if (this.isValid()) {
      return this.fromNow();
    } else {
      return defaultValue;
    }
  };

  dayjsClass.prototype.displayDateOrTime = function () {
    if (!this.isValid()) {
      return "";
    }

    const now = dayjs();

    if (now.diff(this, "hour") > 24) {
      return this.format("YYYY-MM-DD");
    } else {
      return this.format("HH:mm");
    }
  };
};

export default plugin;
