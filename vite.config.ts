import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Derive the repo name when running in GitHub Actions so the base becomes '/<repo>/'
// Locally and in development we keep base = '/'
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "election-central";
const isCI = process.env.GITHUB_ACTIONS === "true";

export default defineConfig(({ mode }) => ({
  // Use repo base on CI/production so asset URLs become "/election-central/..."
  base: isCI || mode === "production" ? `/${repoName}/` : "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
