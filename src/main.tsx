import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Webinar from './pages/Webinar.tsx'
import CurriculumBook, { CurriculumBookProvider } from './pages/CurriculumBook.tsx'
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
  if (path.startsWith('/curriculum')) return <CurriculumBook />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InquiryProvider>
      <CurriculumBookProvider>
        <Router />
      </CurriculumBookProvider>
    </InquiryProvider>
  </StrictMode>,
)
