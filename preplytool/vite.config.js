import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    },
    include: [
      "quill",
      "quill-image-resize-module-react",
      "quill-better-table"
    ]
  }
});