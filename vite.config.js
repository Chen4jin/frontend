import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    
    // Resolve aliases for cleaner imports
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    
    // Dev server configuration
    server: {
        port: 3000,
        open: true,
    },
    
    // Build configuration
    build: {
        outDir: 'build',
        sourcemap: true,
    },
    
    // Handle JSX in .js files (CRA compatibility)
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.jsx?$/,
        exclude: [],
    },
    
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
});
