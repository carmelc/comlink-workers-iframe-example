// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import IframeApp from './IframeApp'

createRoot(document.getElementById('iframe-root')!).render(
  // <StrictMode>
    <IframeApp />
  // </StrictMode>,
)
