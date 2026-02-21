import Intro from './components/Intro'
import About from './components/About'
import Experience from './components/Experience'
import NavBar from './NavBar'

function App() {
  return (
    <div className="background min-h-screen w-full">
      <NavBar />
      <div className="max-w-5xl mx-auto">
        <Intro />
        <About />
        <Experience />
      </div>
    </div>
  )
}

export default App
