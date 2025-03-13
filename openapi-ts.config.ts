import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";
export default defineConfig({
  input: "./api/templates/docs.json",
  output: "./api/out",
  plugins: [
    ...defaultPlugins,
    "@hey-api/client-axios",
    "@tanstack/react-query",
    "zod",
    {
      name: "@hey-api/sdk",
      validator: true,
    },
    {
      dates: true,
      name: "@hey-api/transformers",
    },
    {
      enums: "typescript",
      name: "@hey-api/typescript",
    },
  ],
});
