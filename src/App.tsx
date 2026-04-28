import React, { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Categories from "./pages/Categories";
import Sell from "./pages/Sell";
import Dashboard from "./pages/Dashboard";
import { Twitter, Instagram, Github, Chrome } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-3xl font-display font-black tracking-tighter uppercase">
                Digi<span className="opacity-30">Store™</span>
              </span>
            </div>
            <p className="text-sm text-white/40 max-w-sm leading-relaxed mb-10 font-medium uppercase tracking-wide">
              The premium repository for high-fidelity digital resources. Engineered for professional craftsmen and creative studios worldwide.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                <Twitter size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                <Instagram size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                <Github size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                <Chrome size={18} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Navigation</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
              <li><Link to="/categories" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/categories?cat=Bundles" className="hover:text-white transition-colors">Bundles</Link></li>
              <li><Link to="/sell" className="hover:text-white transition-colors">License</Link></li>
              <li><Link to="/sell" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8">Follow</h4>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Dribbble</a></li>
              <li><a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Behance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] uppercase tracking-[0.4em] font-black opacity-20">Est. 2026 &copy; DigiStore Digital / all rights reserved — aryans-side-project-2</p>
          <div className="flex items-center gap-12 text-[9px] uppercase tracking-[0.4em] font-black opacity-20">
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Bangalore</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity">Mumbai</span>
            <span className="hover:opacity-100 cursor-pointer transition-opacity">New Delhi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
