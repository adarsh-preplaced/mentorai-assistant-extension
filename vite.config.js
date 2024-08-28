import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// // Define separate configurations for popup and content script builds
// export default defineConfig(({ mode }) => {
//   console.log("mode", mode);
//   console.log("resolve(__dirname", resolve(__dirname, "index.html"));
//   if (mode === "content") {
//     return {
//       build: {
//         rollupOptions: {
//           input: resolve(__dirname, "src/content.jsx"),
//           output: {
//             entryFileNames: "assets/content.js",
//             format: "iife", // IIFE format for content script
//           },
//         },
//       },
//       plugins: [react()],
//     };
//   }

//   return {
//     build: {
//       rollupOptions: {
//         input: {
//           main: resolve(__dirname, "index.html"), // Main popup entry
//         },
//         output: {
//           entryFileNames: "assets/[name].js",
//           chunkFileNames: "assets/[name].js",
//           assetFileNames: "assets/[name].[ext]",
//           format: "esm", // Use ES modules for the main app to support Vite's default setup
//         },
//       },
//       plugins: [react()],
//     },
//   };
// });

// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react";
// // import { resolve } from "path";

// // export default defineConfig(({ command, mode }) => {
// //   if (mode === "content") {
// //     return {
// //       build: {
// //         rollupOptions: {
// //           input: resolve(__dirname, "src/content.jsx"),
// //           output: {
// //             entryFileNames: "assets/content.js",
// //             format: "iife", // IIFE format for content script
// //           },
// //         },
// //       },
// //       plugins: [react()],
// //     };
// //   }

// //   return {
// //     build: {
// //       rollupOptions: {
// //         input: resolve(__dirname, "index.html"), // Main popup entry
// //         output: {
// //           entryFileNames: "assets/[name].js",
// //           chunkFileNames: "assets/[name].js",
// //           assetFileNames: "assets/[name].[ext]",
// //           format: "es", // ES module format for main app
// //         },
// //       },
// //       plugins: [react()],
// //     },
// //   };
// // });

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: resolve(__dirname, "src/content.jsx"),
      output: {
        entryFileNames: "assets/content.js",
        format: "iife", // IIFE format for content script
      },
    },
  },
  plugins: [react()],
});
