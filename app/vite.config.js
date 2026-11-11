import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'

// `vite build --mode share` produces one self-contained HTML file (fonts, styles and scripts inlined)
// for publishing the prototype as a shareable link.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'share' ? [viteSingleFile()] : [])],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  build: mode === 'share' ? { outDir: 'dist-share', assetsInlineLimit: 100_000_000, cssCodeSplit: false } : {},
}))
