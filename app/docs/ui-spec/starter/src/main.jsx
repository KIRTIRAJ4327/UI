import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from '@/components/friendly'
import { PrototypeProvider } from '@/v3/store'
import { ThemeProvider } from '@/v3/theme'
import { DocProvider } from '@/v3/docs'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider><PrototypeProvider><ToastProvider><DocProvider><App /></DocProvider></ToastProvider></PrototypeProvider></ThemeProvider>
  </StrictMode>,
)
