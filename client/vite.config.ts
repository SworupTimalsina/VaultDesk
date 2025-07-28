import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../sslcert/server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../sslcert/server.crt')),
    },
  },
});
