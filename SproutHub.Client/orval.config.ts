import { defineConfig } from "orval";

export default defineConfig({
  checkmate: {
    input: "http://localhost:5239/swagger/v1/swagger.json",
    output: {
      target: "src/api/generated/api.ts",
      schemas: "src/api/generated/model",
      client: "axios-functions",
      mode: "split",
      override: {
        mutator: {
          path: "src/api/http.ts",
          name: "httpClientMutator",
        },
        // query: {
        //   useQuery: true,
        //   useInfinite: false,
        //   useMutation: false,
        // },
      },
    },
  },
});
