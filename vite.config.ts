import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [tanstackRouter({
      routesDirectory: "./src/pages",
      generatedRouteTree: "./src/app/@generated/routeTree.gen.ts",
      target: 'react',
      autoCodeSplitting: true,
    }),react(), tailwindcss(),],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }

});
