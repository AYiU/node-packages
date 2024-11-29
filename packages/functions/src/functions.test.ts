import { test, expect } from "vitest";
import { md5, sha1 } from "./functions.js";

test("sha1", () => {
  expect(sha1("hello")).toBe("aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d");
});

test("md5", () => {
  expect(md5("hello")).toBe("5d41402abc4b2a76b9719d911017c592");
});
