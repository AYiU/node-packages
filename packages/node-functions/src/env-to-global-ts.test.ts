import { describe, expect, it } from "vitest";
import { envToTsDefinition } from "./env-to-global-ts.js";

describe("envToTsDefinition", () => {
  it("generates TypeScript definition for single key", () => {
    const env = "FOO=bar";
    const result = envToTsDefinition(env);
    expect(result).toBe(
      "namespace NodeJS {\n" +
        "  interface ProcessEnv {\n" +
        "    FOO: string;\n" +
        "  }\n" +
        "}\n",
    );
  });

  it("handles multiple keys", () => {
    const env = "A=1\nB=2\nC=3";
    const result = envToTsDefinition(env);
    expect(result).toBe(
      "namespace NodeJS {\n" +
        "  interface ProcessEnv {\n" +
        "    A: string;\n" +
        "    B: string;\n" +
        "    C: string;\n" +
        "  }\n" +
        "}\n",
    );
  });
});
