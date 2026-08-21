import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Rubros } from './components/Rubros'
import { Funciones } from './components/Funciones'
import { Planes } from './components/Planes'
import { Comparativa } from './components/Comparativa'
import { Cierre, Footer } from './components/Cierre'

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Rubros />
        <Funciones />
        <Planes />
        <Comparativa />
        <Cierre />
      </main>
      <Footer />
    </>
  )
}

export default App
