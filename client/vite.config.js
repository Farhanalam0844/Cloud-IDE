// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
  
// })

// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // Set to the correct root path if different
  server: {
    port: 5173, // Development server port
    host: true,  // Allow network access
  },
  build: {
    outDir: 'dist', // Specify the output directory for builds
  },
});
