import { globby } from "globby";
import path from "path";
import fs from "fs/promises";

const packages = await globby("../../packages/*", { onlyDirectories: true });

const copyList = [
  {
    src: "../../plop-templates/package/.npmignore",
    to: ".npmignore",
  },
];
for (const c of copyList) {
  const src = path.resolve(c.src);

  const srcContent = await fs.readFile(src, "utf-8");

  packages.forEach(async (p) => {
    const to = path.resolve(p, c.to);
    console.log(`copy ${src} to ${to}`);

    await fs.writeFile(to, srcContent);
  });
}
