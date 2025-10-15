import fs from "node:fs/promises";

export async function envToGlobalTs(
  envFiles: string | string[],
  dTsFile: string,
  prefix = "",
) {
  const bodies = await Promise.all(
    (Array.isArray(envFiles) ? envFiles : [envFiles]).map((file) =>
      fs.readFile(file, "utf-8"),
    ),
  );

  let buffer = envToTsDefinition(bodies.join("\n"));

  if (prefix) {
    buffer = `${prefix}\n${buffer}`;
  }

  await fs.writeFile(dTsFile, buffer, "utf-8");
}

export function envToTsDefinition(file: string) {
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

  if (!buffer.endsWith("\n")) {
    buffer += "\n";
  }

  buffer += "  }\n";
  buffer += "}\n";

  return buffer;
}
