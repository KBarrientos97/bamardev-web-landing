import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Descargas from './Descargas'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Descargas />
  </StrictMode>,
)
