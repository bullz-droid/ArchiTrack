import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  envPrefix: ['VITE_', 'NEXT_PUBLIC_', 'nnzbiipgxkgjspesxvva_'],
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  server: {
    port: 5353,
    host: true,
  },
})
