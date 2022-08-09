export default function (plop) {
  // create your generators here
  plop.setGenerator("controller", {
    description: "application controller logic",
    prompts: [
      {
        type: "input",
        name: "packageName",
        message: "Package name please (file-name)",
      },
    ],
    actions: [
      {
        type: "add",
        path: "packages/{{packageName}}/{{packageName}}.ts",
        templateFile: "plop-templates/package/package-name.ts",
      },
      {
        type: "add",
        path: "packages/{{packageName}}/package.json",
        templateFile: "plop-templates/package/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{packageName}}/tsconfig.json",
        templateFile: "plop-templates/package/tsconfig.json",
      },
      {
        type: "add",
        path: "packages/{{packageName}}/.npmignore",
        templateFile: "plop-templates/package/npmignore",
      },
    ],
  });
}
