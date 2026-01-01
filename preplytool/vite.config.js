import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "quill",
      "quill-image-resize-module-react",
      "quill-better-table"
    ]
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});