import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Necesidades from './Necesidades'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Necesidades />
  </StrictMode>,
)
