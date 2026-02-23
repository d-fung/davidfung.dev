import Intro from './components/Intro'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import NavBar from './NavBar'
import Footer from './Footer'

function App() {
  return (
    <div className="background min-h-screen w-full">
      <NavBar />
      <div className="max-w-5xl mx-auto">
        <Intro />
        <About />
        <Experience />
        <Projects />
        <Footer />
      </div>
    </div>
  )
}

export default App
