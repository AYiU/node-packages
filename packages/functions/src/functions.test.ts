import { expect, test } from "vitest";
import { sha1, sha512 } from "./functions.js";

test("sha1", async () => {
  expect(await sha1("hello")).toBe("aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d");
});

test("sha512", async () => {
  expect(await sha512("The quick brown fox jumps over the lazy dog")).toBe(
    "07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6",
  );
});
