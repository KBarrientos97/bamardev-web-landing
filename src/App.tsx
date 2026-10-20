import { LazyMotion, MotionConfig, domMax, m, useScroll, useSpring } from 'motion/react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Rubros } from './components/Rubros'
import { Funciones } from './components/Funciones'
import { Planes } from './components/Planes'
import { PaquetesCreditos } from './components/PaquetesCreditos'
import { Comparativa } from './components/Comparativa'
import { Cierre, Footer } from './components/Cierre'
import { AltaProvider } from './components/Alta'

/** Barrita verde arriba que muestra cuánto de la página se recorrió. */
function Progreso() {
  const { scrollYProgress } = useScroll()
  const ancho = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 })
  return (
    <m.div
      aria-hidden
      style={{ scaleX: ancho }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-brand-400 to-brand-300"
    />
  )
}

function App() {
  // LazyMotion + `m` en vez de `motion`: carga sólo lo que se usa. domMax
  // porque las pestañas deslizan su indicador con layoutId.
  // reducedMotion="user": si el sistema pide menos movimiento, se apagan los
  // desplazamientos y queda el fundido.
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        {/* El alta de prueba la abren el hero y la tarjeta del Emprendedor. */}
        <AltaProvider>
          <Progreso />
          <Nav />
          <main>
            <Hero />
            <Rubros />
            <Funciones />
            <Planes />
            <PaquetesCreditos />
            <Comparativa />
            <Cierre />
          </main>
          <Footer />
        </AltaProvider>
      </MotionConfig>
    </LazyMotion>
  )
}

export default App
