import { test, expect } from "vitest";
import { sha1 } from "./functions.js";

test("sha1", async () => {
  expect(await sha1("hello")).toBe("aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d");
});
