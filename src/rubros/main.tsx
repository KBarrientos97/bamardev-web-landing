import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import PaginaRubros from './PaginaRubros'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PaginaRubros />
  </StrictMode>,
)
