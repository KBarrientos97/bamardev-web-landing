import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { PaginaLegal } from './PaginaLegal'
import texto from './TERMINOS-DE-SERVICIO.md?raw'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PaginaLegal texto={texto} preliminar />
  </StrictMode>,
)
