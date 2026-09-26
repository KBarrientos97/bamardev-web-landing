import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Encuesta from './Encuesta'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Encuesta />
  </StrictMode>,
)
