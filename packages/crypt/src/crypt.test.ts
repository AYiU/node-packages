import { expect, test } from "vitest";
import { Crypt } from "./crypt.js";

test("Encrypt and decrypt text", () => {
  const crypt = new Crypt("testing-testing-testing-testing-");

  const text = "text✌🏽";

  const encrypted = crypt.encrypt(text);
  const decrypted = crypt.decrypt(encrypted);

  expect(decrypted).toBe(text);
});
