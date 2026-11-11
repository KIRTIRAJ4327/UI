import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from '@/components/friendly'
import { PrototypeProvider } from '@/v3/store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrototypeProvider><ToastProvider><App /></ToastProvider></PrototypeProvider>
  </StrictMode>,
)
