import {fileURLToPath} from 'node:url';
import swc from 'unplugin-swc';
import {defineConfig} from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [
    tsconfigPaths({projects: ['../../tsconfig.base.json']}),
    swc.vite({tsconfigFile: './apps/backend/tsconfig.spec.json'}),
  ],
  test: {
    name: 'backend',
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    globalSetup: ['./test/globalSetup.ts'],
  },
});
