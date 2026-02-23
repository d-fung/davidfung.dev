import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { IoMail } from 'react-icons/io5'

function Footer() {
    return (
        <footer className="flex flex-col items-center gap-2 px-12 py-5 border-t border-white/10">
            <span className="text-white/60 text-sm font-mono">Built by David Fung.</span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-orange-400 text-sm font-mono hover:text-orange-300 transition-colors cursor-pointer">
                · Back to top ·
            </button>
        </footer>
    )
}

export default Footer
