import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  CreditCard, 
  UserPlus, 
  Menu, 
  X,
  LogOut,
  ArrowRight,
  MessageCircle,
  Zap
} from 'lucide-react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import PaymentBooking from './pages/PaymentBooking';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Courses from './pages/Courses';
import Contact from './pages/Contact';
import Login from './pages/Login';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Register', path: '/register' },
    { name: 'Payment', path: '/payment' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-600/20 via-black to-fuchsia-600/20 border border-white/10 group-hover:border-violet-500/50 transition-all shadow-lg shadow-violet-500/10">
            <img 
              src="/logo.png" 
              alt="SRUSTHI Technologies" 
              className="w-full h-full object-contain relative z-10 p-1"
              onError={(e) => {
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  e.currentTarget.style.display = 'none';
                  const placeholder = document.createElement('div');
                  placeholder.className = 'text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 via-violet-400 to-cyan-400 font-serif italic text-3xl font-bold tracking-tighter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]';
                  placeholder.innerText = 'S';
                  parent.appendChild(placeholder);
                }
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-xl tracking-tighter leading-none text-white">SRUSTHI</span>
            <span className="text-[9px] font-sans font-light uppercase tracking-[0.3em] text-cyan-400 mt-0.5">TECHNOLOGIES</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs font-mono uppercase tracking-widest transition-colors ${
                location.pathname === item.path ? 'text-violet-400' : 'text-gray-500 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
          <Link 
            to="/login"
            className="px-6 py-2 bg-white/5 border border-white/10 text-white text-[10px] font-mono uppercase tracking-widest rounded-full hover:bg-white/10 transition-all"
          >
            Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-20 left-0 w-full bg-black border-b border-white/5 p-8 flex flex-col gap-6"
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-mono uppercase tracking-widest ${
                  location.pathname === item.path ? 'text-violet-400' : 'text-gray-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link 
              to="/login"
              onClick={() => setIsOpen(false)}
              className="text-sm font-mono uppercase tracking-widest text-violet-400"
            >
              Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<PaymentBooking />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
      <footer className="py-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="" 
                  className="w-full h-full object-cover opacity-50" 
                  onError={(e) => {
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      e.currentTarget.style.display = 'none';
                      const placeholder = document.createElement('div');
                      placeholder.className = 'text-violet-500/50 font-serif italic text-lg font-bold';
                      placeholder.innerText = 'S';
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
              <h3 className="font-sans font-bold text-xl tracking-tight text-white group">
                SRUSTHI <span className="font-light text-gray-500 tracking-[0.2em] ml-1">TECHNOLOGIES</span>
              </h3>
            </div>
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-6">
              Empowering students through project-based execution.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://wa.me/917032313051" className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-[#25D366] transition-colors"><MessageCircle size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"><Zap size={18} /></a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-16 text-[10px] font-mono uppercase tracking-widest">
            <div className="flex flex-col gap-4">
               <span className="text-white font-bold mb-2">Platform</span>
               <Link to="/courses" className="text-gray-500 hover:text-white">Tracks</Link>
               <Link to="/register" className="text-gray-500 hover:text-white">Registration</Link>
               <Link to="/payment" className="text-gray-500 hover:text-white">Payment</Link>
               <Link to="/about" className="text-gray-500 hover:text-white">Story</Link>
               <Link to="/login" className="text-gray-500 hover:text-white">LMS Login</Link>
            </div>
            <div className="flex flex-col gap-4">
               <span className="text-white font-bold mb-2">Legal</span>
               <Link to="/contact" className="text-gray-500 hover:text-white">Contact</Link>
               <Link to="#" className="text-gray-500 hover:text-white">Terms</Link>
               <Link to="#" className="text-gray-500 hover:text-white">Privacy</Link>
            </div>
          </div>
          <div className="text-gray-600 text-sm font-mono tracking-widest self-end">
            © 2026 SRUSTHI TECHNOLOGIES
          </div>
        </div>
      </footer>
    </Router>
  );
}
