import { FaGithub, FaLinkedin} from 'react-icons/fa'
import { IoMail } from 'react-icons/io5'

function NavBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-12 py-5 z-50">
            <span className="text-white/60 text-sm font-mono">df.</span>
            <div className="flex items-center gap-6">
                <a href="https://github.com/d-fung" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-orange-500 transition-colors">
                    <FaGithub size={18} />
                </a>
                <a href="https://linkedin.com/in/davidfung98" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-orange-500 transition-colors">
                    <FaLinkedin size={18} />
                </a>
                <a href="mailto:davidfung998@gmail.com" className="text-white/50 hover:text-orange-500 transition-colors">
                    <IoMail size={18} />
                </a>
            </div>
        </nav>
    )
}

export default NavBar
