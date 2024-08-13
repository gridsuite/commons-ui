// vite.config.mts
import react from "file:///home/yenguised/Projects/gridSuite/aggregator/commons-ui/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///home/yenguised/Projects/gridSuite/aggregator/commons-ui/node_modules/vite/dist/node/index.js";
import eslint from "file:///home/yenguised/Projects/gridSuite/aggregator/commons-ui/node_modules/vite-plugin-eslint/dist/index.mjs";
import svgr from "file:///home/yenguised/Projects/gridSuite/aggregator/commons-ui/node_modules/vite-plugin-svgr/dist/index.js";
import { libInjectCss } from "file:///home/yenguised/Projects/gridSuite/aggregator/commons-ui/node_modules/vite-plugin-lib-inject-css/dist/index.js";
import dts from "file:///home/yenguised/Projects/gridSuite/aggregator/commons-ui/node_modules/vite-plugin-dts/dist/index.mjs";
import { globSync } from "file:///home/yenguised/Projects/gridSuite/aggregator/commons-ui/node_modules/glob/dist/esm/index.js";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import * as url from "node:url";
import { createRequire } from "node:module";
var __vite_injected_original_dirname = "/home/yenguised/Projects/gridSuite/aggregator/commons-ui";
var __vite_injected_original_import_meta_url = "file:///home/yenguised/Projects/gridSuite/aggregator/commons-ui/vite.config.mts";
var vite_config_default = defineConfig((config) => ({
  plugins: [
    react(),
    eslint({
      failOnWarning: config.mode !== "development",
      lintOnStart: true
    }),
    svgr(),
    // works on every import with the pattern "**/*.svg?react"
    reactVirtualized(),
    libInjectCss(),
    dts({
      include: ["src"]
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      formats: ["es"]
    },
    rollupOptions: {
      external: (id) => !id.startsWith(".") && !path.isAbsolute(id),
      // We do this to keep the same folder structure
      // from https://rollupjs.org/configuration-options/#input
      input: Object.fromEntries(
        globSync("src/**/*.{js,jsx,ts,tsx}", {
          ignore: ["src/vite-env.d.ts", "src/**/*.test.{js,jsx,ts,tsx}"]
        }).map((file) => [
          // This remove `src/` as well as the file extension from each
          // file, so e.g. src/nested/foo.js becomes nested/foo
          path.relative("src", file.slice(0, file.length - path.extname(file).length)),
          // This expands the relative paths to absolute paths, so e.g.
          // src/nested/foo becomes /project/src/nested/foo.js
          url.fileURLToPath(new URL(file, __vite_injected_original_import_meta_url))
        ])
      ),
      output: {
        chunkFileNames: "chunks/[name].[hash].js",
        // in case some chunks are created, but it should not because every file is supposed to be an entry point
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js"
        // override vite and allow to keep .js extension even in ESM
      }
    },
    minify: false
    // easier to debug on the apps using this lib
  }
}));
function reactVirtualized() {
  const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;
  return {
    name: "flat:react-virtualized",
    // Note: we cannot use the `transform` hook here
    //       because libraries are pre-bundled in vite directly,
    //       plugins aren't able to hack that step currently.
    //       so instead we manually edit the file in node_modules.
    //       all we need is to find the timing before pre-bundling.
    configResolved: async () => {
      const require2 = createRequire(__vite_injected_original_import_meta_url);
      const reactVirtualizedPath = require2.resolve("react-virtualized");
      const { pathname: reactVirtualizedFilePath } = new url.URL(reactVirtualizedPath, __vite_injected_original_import_meta_url);
      const file = reactVirtualizedFilePath.replace(
        path.join("dist", "commonjs", "index.js"),
        path.join("dist", "es", "WindowScroller", "utils", "onScroll.js")
      );
      const code = await fs.readFile(file, "utf-8");
      const modified = code.replace(WRONG_CODE, "");
      await fs.writeFile(file, modified);
    }
  };
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUveWVuZ3Vpc2VkL1Byb2plY3RzL2dyaWRTdWl0ZS9hZ2dyZWdhdG9yL2NvbW1vbnMtdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3llbmd1aXNlZC9Qcm9qZWN0cy9ncmlkU3VpdGUvYWdncmVnYXRvci9jb21tb25zLXVpL3ZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS95ZW5ndWlzZWQvUHJvamVjdHMvZ3JpZFN1aXRlL2FnZ3JlZ2F0b3IvY29tbW9ucy11aS92aXRlLmNvbmZpZy5tdHNcIjsvKipcbiAqIENvcHlyaWdodCAoYykgMjAyNCwgUlRFIChodHRwOi8vd3d3LnJ0ZS1mcmFuY2UuY29tKVxuICogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICogTGljZW5zZSwgdi4gMi4wLiBJZiBhIGNvcHkgb2YgdGhlIE1QTCB3YXMgbm90IGRpc3RyaWJ1dGVkIHdpdGggdGhpc1xuICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHA6Ly9tb3ppbGxhLm9yZy9NUEwvMi4wLy5cbiAqL1xuXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbk9wdGlvbiB9IGZyb20gJ3ZpdGUnOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG5pbXBvcnQgZXNsaW50IGZyb20gJ3ZpdGUtcGx1Z2luLWVzbGludCc7XG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJztcbmltcG9ydCB7IGxpYkluamVjdENzcyB9IGZyb20gJ3ZpdGUtcGx1Z2luLWxpYi1pbmplY3QtY3NzJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCB7IGdsb2JTeW5jIH0gZnJvbSAnZ2xvYic7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdub2RlOmZzL3Byb21pc2VzJztcbmltcG9ydCAqIGFzIHVybCBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbm9kZTptb2R1bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKGNvbmZpZykgPT4gKHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIHJlYWN0KCksXG4gICAgICAgIGVzbGludCh7XG4gICAgICAgICAgICBmYWlsT25XYXJuaW5nOiBjb25maWcubW9kZSAhPT0gJ2RldmVsb3BtZW50JyxcbiAgICAgICAgICAgIGxpbnRPblN0YXJ0OiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgc3ZncigpLCAvLyB3b3JrcyBvbiBldmVyeSBpbXBvcnQgd2l0aCB0aGUgcGF0dGVybiBcIioqLyouc3ZnP3JlYWN0XCJcbiAgICAgICAgcmVhY3RWaXJ0dWFsaXplZCgpLFxuICAgICAgICBsaWJJbmplY3RDc3MoKSxcbiAgICAgICAgZHRzKHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFsnc3JjJ10sXG4gICAgICAgIH0pLFxuICAgIF0sXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgbGliOiB7XG4gICAgICAgICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgICAgICAgZm9ybWF0czogWydlcyddLFxuICAgICAgICB9LFxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICBleHRlcm5hbDogKGlkOiBzdHJpbmcpID0+ICFpZC5zdGFydHNXaXRoKCcuJykgJiYgIXBhdGguaXNBYnNvbHV0ZShpZCksXG4gICAgICAgICAgICAvLyBXZSBkbyB0aGlzIHRvIGtlZXAgdGhlIHNhbWUgZm9sZGVyIHN0cnVjdHVyZVxuICAgICAgICAgICAgLy8gZnJvbSBodHRwczovL3JvbGx1cGpzLm9yZy9jb25maWd1cmF0aW9uLW9wdGlvbnMvI2lucHV0XG4gICAgICAgICAgICBpbnB1dDogT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICAgICAgICAgIGdsb2JTeW5jKCdzcmMvKiovKi57anMsanN4LHRzLHRzeH0nLCB7XG4gICAgICAgICAgICAgICAgICAgIGlnbm9yZTogWydzcmMvdml0ZS1lbnYuZC50cycsICdzcmMvKiovKi50ZXN0Lntqcyxqc3gsdHMsdHN4fSddLFxuICAgICAgICAgICAgICAgIH0pLm1hcCgoZmlsZSkgPT4gW1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIHJlbW92ZSBgc3JjL2AgYXMgd2VsbCBhcyB0aGUgZmlsZSBleHRlbnNpb24gZnJvbSBlYWNoXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpbGUsIHNvIGUuZy4gc3JjL25lc3RlZC9mb28uanMgYmVjb21lcyBuZXN0ZWQvZm9vXG4gICAgICAgICAgICAgICAgICAgIHBhdGgucmVsYXRpdmUoJ3NyYycsIGZpbGUuc2xpY2UoMCwgZmlsZS5sZW5ndGggLSBwYXRoLmV4dG5hbWUoZmlsZSkubGVuZ3RoKSksXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgZXhwYW5kcyB0aGUgcmVsYXRpdmUgcGF0aHMgdG8gYWJzb2x1dGUgcGF0aHMsIHNvIGUuZy5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3JjL25lc3RlZC9mb28gYmVjb21lcyAvcHJvamVjdC9zcmMvbmVzdGVkL2Zvby5qc1xuICAgICAgICAgICAgICAgICAgICB1cmwuZmlsZVVSTFRvUGF0aChuZXcgVVJMKGZpbGUsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdjaHVua3MvW25hbWVdLltoYXNoXS5qcycsIC8vIGluIGNhc2Ugc29tZSBjaHVua3MgYXJlIGNyZWF0ZWQsIGJ1dCBpdCBzaG91bGQgbm90IGJlY2F1c2UgZXZlcnkgZmlsZSBpcyBzdXBwb3NlZCB0byBiZSBhbiBlbnRyeSBwb2ludFxuICAgICAgICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXVtleHRuYW1lXScsXG4gICAgICAgICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdbbmFtZV0uanMnLCAvLyBvdmVycmlkZSB2aXRlIGFuZCBhbGxvdyB0byBrZWVwIC5qcyBleHRlbnNpb24gZXZlbiBpbiBFU01cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG1pbmlmeTogZmFsc2UsIC8vIGVhc2llciB0byBkZWJ1ZyBvbiB0aGUgYXBwcyB1c2luZyB0aGlzIGxpYlxuICAgIH0sXG59KSk7XG5cbi8vIFdvcmthcm91bmQgZm9yIHJlYWN0LXZpcnR1YWxpemVkIHdpdGggdml0ZVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2J2YXVnaG4vcmVhY3QtdmlydHVhbGl6ZWQvaXNzdWVzLzE2MzIjaXNzdWVjb21tZW50LTE0ODM5NjYwNjNcbmZ1bmN0aW9uIHJlYWN0VmlydHVhbGl6ZWQoKTogUGx1Z2luT3B0aW9uIHtcbiAgICBjb25zdCBXUk9OR19DT0RFID0gYGltcG9ydCB7IGJwZnJwdF9wcm9wdHlwZV9XaW5kb3dTY3JvbGxlciB9IGZyb20gXCIuLi9XaW5kb3dTY3JvbGxlci5qc1wiO2A7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogJ2ZsYXQ6cmVhY3QtdmlydHVhbGl6ZWQnLFxuICAgICAgICAvLyBOb3RlOiB3ZSBjYW5ub3QgdXNlIHRoZSBgdHJhbnNmb3JtYCBob29rIGhlcmVcbiAgICAgICAgLy8gICAgICAgYmVjYXVzZSBsaWJyYXJpZXMgYXJlIHByZS1idW5kbGVkIGluIHZpdGUgZGlyZWN0bHksXG4gICAgICAgIC8vICAgICAgIHBsdWdpbnMgYXJlbid0IGFibGUgdG8gaGFjayB0aGF0IHN0ZXAgY3VycmVudGx5LlxuICAgICAgICAvLyAgICAgICBzbyBpbnN0ZWFkIHdlIG1hbnVhbGx5IGVkaXQgdGhlIGZpbGUgaW4gbm9kZV9tb2R1bGVzLlxuICAgICAgICAvLyAgICAgICBhbGwgd2UgbmVlZCBpcyB0byBmaW5kIHRoZSB0aW1pbmcgYmVmb3JlIHByZS1idW5kbGluZy5cbiAgICAgICAgY29uZmlnUmVzb2x2ZWQ6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XG4gICAgICAgICAgICBjb25zdCByZWFjdFZpcnR1YWxpemVkUGF0aCA9IHJlcXVpcmUucmVzb2x2ZSgncmVhY3QtdmlydHVhbGl6ZWQnKTtcbiAgICAgICAgICAgIGNvbnN0IHsgcGF0aG5hbWU6IHJlYWN0VmlydHVhbGl6ZWRGaWxlUGF0aCB9ID0gbmV3IHVybC5VUkwocmVhY3RWaXJ0dWFsaXplZFBhdGgsIGltcG9ydC5tZXRhLnVybCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlID0gcmVhY3RWaXJ0dWFsaXplZEZpbGVQYXRoLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgcGF0aC5qb2luKCdkaXN0JywgJ2NvbW1vbmpzJywgJ2luZGV4LmpzJyksXG4gICAgICAgICAgICAgICAgcGF0aC5qb2luKCdkaXN0JywgJ2VzJywgJ1dpbmRvd1Njcm9sbGVyJywgJ3V0aWxzJywgJ29uU2Nyb2xsLmpzJylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBjb2RlID0gYXdhaXQgZnMucmVhZEZpbGUoZmlsZSwgJ3V0Zi04Jyk7XG4gICAgICAgICAgICBjb25zdCBtb2RpZmllZCA9IGNvZGUucmVwbGFjZShXUk9OR19DT0RFLCAnJyk7XG4gICAgICAgICAgICBhd2FpdCBmcy53cml0ZUZpbGUoZmlsZSwgbW9kaWZpZWQpO1xuICAgICAgICB9LFxuICAgIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBT0EsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBRTdCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZ0JBQWdCO0FBQ3pCLFlBQVksVUFBVTtBQUN0QixZQUFZLFFBQVE7QUFDcEIsWUFBWSxTQUFTO0FBQ3JCLFNBQVMscUJBQXFCO0FBbEI5QixJQUFNLG1DQUFtQztBQUFnTCxJQUFNLDJDQUEyQztBQW9CMVEsSUFBTyxzQkFBUSxhQUFhLENBQUMsWUFBWTtBQUFBLEVBQ3JDLFNBQVM7QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNILGVBQWUsT0FBTyxTQUFTO0FBQUEsTUFDL0IsYUFBYTtBQUFBLElBQ2pCLENBQUM7QUFBQSxJQUNELEtBQUs7QUFBQTtBQUFBLElBQ0wsaUJBQWlCO0FBQUEsSUFDakIsYUFBYTtBQUFBLElBQ2IsSUFBSTtBQUFBLE1BQ0EsU0FBUyxDQUFDLEtBQUs7QUFBQSxJQUNuQixDQUFDO0FBQUEsRUFDTDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0gsS0FBSztBQUFBLE1BQ0QsT0FBWSxhQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUM3QyxTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2xCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDWCxVQUFVLENBQUMsT0FBZSxDQUFDLEdBQUcsV0FBVyxHQUFHLEtBQUssQ0FBTSxnQkFBVyxFQUFFO0FBQUE7QUFBQTtBQUFBLE1BR3BFLE9BQU8sT0FBTztBQUFBLFFBQ1YsU0FBUyw0QkFBNEI7QUFBQSxVQUNqQyxRQUFRLENBQUMscUJBQXFCLCtCQUErQjtBQUFBLFFBQ2pFLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUztBQUFBO0FBQUE7QUFBQSxVQUdSLGNBQVMsT0FBTyxLQUFLLE1BQU0sR0FBRyxLQUFLLFNBQWMsYUFBUSxJQUFJLEVBQUUsTUFBTSxDQUFDO0FBQUE7QUFBQTtBQUFBLFVBR3ZFLGtCQUFjLElBQUksSUFBSSxNQUFNLHdDQUFlLENBQUM7QUFBQSxRQUNwRCxDQUFDO0FBQUEsTUFDTDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ0osZ0JBQWdCO0FBQUE7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQTtBQUFBLE1BQ3BCO0FBQUEsSUFDSjtBQUFBLElBQ0EsUUFBUTtBQUFBO0FBQUEsRUFDWjtBQUNKLEVBQUU7QUFJRixTQUFTLG1CQUFpQztBQUN0QyxRQUFNLGFBQWE7QUFDbkIsU0FBTztBQUFBLElBQ0gsTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1OLGdCQUFnQixZQUFZO0FBQ3hCLFlBQU1BLFdBQVUsY0FBYyx3Q0FBZTtBQUM3QyxZQUFNLHVCQUF1QkEsU0FBUSxRQUFRLG1CQUFtQjtBQUNoRSxZQUFNLEVBQUUsVUFBVSx5QkFBeUIsSUFBSSxJQUFRLFFBQUksc0JBQXNCLHdDQUFlO0FBQ2hHLFlBQU0sT0FBTyx5QkFBeUI7QUFBQSxRQUM3QixVQUFLLFFBQVEsWUFBWSxVQUFVO0FBQUEsUUFDbkMsVUFBSyxRQUFRLE1BQU0sa0JBQWtCLFNBQVMsYUFBYTtBQUFBLE1BQ3BFO0FBQ0EsWUFBTSxPQUFPLE1BQVMsWUFBUyxNQUFNLE9BQU87QUFDNUMsWUFBTSxXQUFXLEtBQUssUUFBUSxZQUFZLEVBQUU7QUFDNUMsWUFBUyxhQUFVLE1BQU0sUUFBUTtBQUFBLElBQ3JDO0FBQUEsRUFDSjtBQUNKOyIsCiAgIm5hbWVzIjogWyJyZXF1aXJlIl0KfQo=
