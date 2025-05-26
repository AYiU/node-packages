import fs from "node:fs/promises";

export async function envToGlobalTs(envFile: string, dTsFile: string) {
  const body = await fs.readFile(envFile, "utf-8");

  const buffer = envToTsDefinition(body);

  await fs.writeFile(dTsFile, buffer, "utf-8");
}

function envToTsDefinition(file: string) {
  const lines = file.split("\n");
  let buffer = "";
  buffer += "namespace NodeJS {\n";
  buffer += "  interface ProcessEnv {\n";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line && !line.startsWith("#")) {
      const b = line.split("=");

      if (b.length >= 2) {
        const [key] = b;
        buffer += `    ${key}: string;`;
      }
    }

    if (!buffer.endsWith("\n\n") && i < lines.length - 1) {
      buffer += "\n";
    }
  }

  buffer += "  }\n";
  buffer += "}\n";

  return buffer;
}
