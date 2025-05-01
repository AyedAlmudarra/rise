import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'; // Import the React plugin
import path from 'path'; // Import path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Include the React plugin for JSX/TSX support
  test: {
    globals: true, // Enable global APIs (describe, test, expect, etc.)
    environment: 'jsdom', // Set the test environment to jsdom
    setupFiles: './src/setupTests.ts', // Specify the setup file
    // Add path alias configuration
    alias: {
      '@': path.resolve(__dirname, './src'), // Resolve @ to the src directory
    },
  },
  // Also add alias resolve for general Vite usage (might be needed)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}); 