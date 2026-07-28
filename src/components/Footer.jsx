import { Link } from 'react-router-dom'
import { FaBrain, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Pitch */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                <FaBrain className="text-lg" />
              </div>
              <span className="font-poppins text-lg font-bold tracking-tight text-white">
                Mind<span className="text-primary">Connect</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering students to take control of their mental health and wellness through confidential logs, resource centers, and professional counseling.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Portal Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="hover:text-primary transition-colors">Core Features</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-colors">About Us</a>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">Student Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-primary transition-colors">Register Account</Link>
              </li>
            </ul>
          </div>

          {/* Emergency support summary */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Emergency Contacts</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center space-x-2 text-red-400 font-semibold">
                <FaPhoneAlt size={12} />
                <span>Crisis Hotline: 988</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhoneAlt size={12} />
                <span>Campus Clinic: (555) 019-2834</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhoneAlt size={12} />
                <span>Campus Security: (555) 019-9999</span>
              </li>
            </ul>
          </div>

          {/* Uni detail */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Campus Location</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start space-x-2">
                <FaMapMarkerAlt className="mt-1 text-primary shrink-0" />
                <span>Student Wellness Center, Block C, University Campus</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-primary shrink-0" />
                <span>wellness@university.edu</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer warning banner */}
        <div className="mt-8 pt-8 border-t border-slate-800 text-center space-y-4">
          <div className="rounded-xl bg-red-950/40 border border-red-900/30 p-4 max-w-3xl mx-auto">
            <p className="text-xs text-red-400 font-medium leading-relaxed">
              <strong>CRITICAL DISCLAIMER:</strong> MindConnect is a mock mental health portal built for demonstration purposes (HCI Project). It does not provide real-time medical diagnostic or emergency dispatch services. If you are experiencing a severe mental health crisis or require immediate medical assistance, please contact your local emergency services (like 911/999/112) or call a crisis hotline immediately.
            </p>
          </div>
          <p className="text-xs text-slate-500 flex items-center justify-center space-x-1">
            <span>&copy; {new Date().getFullYear()} MindConnect. Built with</span>
            <FaHeart className="text-red-500 animate-pulse" size={10} />
            <span>for human-computer interaction showcase.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
