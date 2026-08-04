import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Webinar from './pages/Webinar.tsx'
import { InquiryProvider } from './sections/InquiryModal.tsx'

function Router() {
  const [path, setPath] = useState(
    () => (typeof window !== 'undefined' ? window.location.pathname : '/'),
  )
  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])
  if (path.startsWith('/webinar')) return <Webinar />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InquiryProvider>
      <Router />
    </InquiryProvider>
  </StrictMode>,
)
