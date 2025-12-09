import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ensure the function is called and exported as default
export default defineConfig({
  plugins: [react()],
  // Add other configuration here if necessary
  // For example, if you need a base URL:
  // base: '/', 
});