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
        type: "addMany",
        templateFiles: "plop-templates/package/(.|)*",
        destination: "packages/{{packageName}}",
        base: "plop-templates/package",
      },
      {
        type: "add",
        path: "packages/{{packageName}}/src/{{packageName}}.ts",
        templateFile: "plop-templates/packageT/package-name.ts.hbs",
      },
    ],
  });
}
