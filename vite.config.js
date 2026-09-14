import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// 相对 base：同时兼容 GitHub Pages 项目站点（/repo-name/）、子目录托管与根域名部署
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
      },
    },
  },
});
