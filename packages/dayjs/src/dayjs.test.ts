import dayjs from "dayjs";
import plugins from "./dayjs";
import { test, expect } from "vitest";

dayjs.extend(plugins);

const errorDay = dayjs("20222-40-44");

test("Dayjs.formatDate()", () => {
  const defaultDay = dayjs("2021-01-01");

  expect(defaultDay.formatDate()).toBe("2021-01-01 00:00");
  expect(errorDay.formatDate()).toBe("-");
});

test("Dayjs.fromNowX()", () => {
  const now = dayjs();
  const before = now.subtract(1, "day");

  expect(now.fromNowX()).toBe("a few seconds ago");
  expect(before.fromNowX()).toBe("a day ago");

  expect(errorDay.fromNowX()).toBe("-");
});

test("Dayjs.displayDateOrTime()", () => {
  const now = dayjs();
  const before = now.subtract(2, "day");

  expect(now.displayDateOrTime()).toBe(now.format("HH:mm"));
  expect(before.displayDateOrTime()).toBe(before.format("YYYY-MM-DD"));

  expect(errorDay.displayDateOrTime()).toBe("");
});
