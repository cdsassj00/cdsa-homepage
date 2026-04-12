import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { InquiryProvider } from './sections/InquiryModal.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InquiryProvider>
      <App />
    </InquiryProvider>
  </StrictMode>,
)
