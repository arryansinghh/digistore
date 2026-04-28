import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems } = useCart();
  const { user, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categories?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-display font-black tracking-tighter text-white uppercase">
                Digi<span className="opacity-40">Store™</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-10">
              <Link to="/categories" className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 hover:text-white transition-opacity">Marketplace</Link>
              <Link to="/categories" className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 hover:text-white transition-opacity">Categories</Link>
              <Link to="/sell" className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 hover:text-white transition-opacity">Sell Assets</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="SEARCH" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 rounded-full text-[10px] font-bold tracking-widest w-48 transition-all outline-none text-white uppercase placeholder:text-white/20"
              />
            </form>
            <div className="flex items-center gap-6">
              {user && (
                <Link to="/dashboard" className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 hover:text-white transition-opacity flex items-center gap-2">
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
              )}
              <Link to="/cart" className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/50 hover:text-white transition-opacity flex items-center gap-2">
                Cart ({totalItems})
              </Link>
            </div>
            <div className="flex items-center min-w-[120px] justify-end">
              <AnimatePresence mode="wait">
                {user ? (
                  <motion.div 
                    key="user"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="flex items-center gap-4"
                  >
                    <Link to="/dashboard" className="flex items-center gap-2 group">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-white/40 transition-colors">
                        <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt={user.displayName || ""} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity hidden lg:block">{user.displayName?.split(" ")[0]}</span>
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className="p-2 text-white/30 hover:text-rose-500 transition-colors"
                    >
                      <LogOut size={16} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button 
                    key="signin"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => signInWithGoogle()}
                    className="px-5 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white/90 transition-all active:scale-95"
                  >
                    Sign In
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            {user && (
              <Link to="/dashboard" className="text-white/50 hover:text-white transition-opacity">
                <LayoutDashboard size={18} />
              </Link>
            )}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white/50 hover:text-white transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[999] md:hidden bg-black flex flex-col"
          >
            <div className="flex justify-between items-center h-20 px-6 border-b border-white/5">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <span className="text-xl font-display font-black tracking-tighter text-white uppercase">
                  Digi<span className="opacity-40">Store™</span>
                </span>
              </Link>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto px-8 py-12">
              <nav className="flex flex-col gap-4">
                {[
                  { name: "Marketplace", path: "/categories" },
                  { name: "Categories", path: "/categories" },
                  { name: "Sell Assets", path: "/sell" },
                  { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
                  { name: "Shopping Cart", path: "/cart", icon: <ShoppingBag size={18} /> }
                ].map((item, idx) => (
                  (item.name !== "Dashboard" || user) && (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link 
                        to={item.path} 
                        onClick={() => setIsOpen(false)} 
                        className="flex items-center gap-4 text-xl font-black uppercase tracking-tighter text-white/60 hover:text-white transition-all py-3 border-b border-white/[0.03]"
                      >
                        {item.icon && <span className="text-white/20">{item.icon}</span>}
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                ))}
              </nav>

              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.4 }}
                className="mt-16 pb-20 space-y-8"
              >
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                        <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Authorized as</p>
                        <p className="text-xs font-bold uppercase tracking-tight">{user.displayName}</p>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { signInWithGoogle(); setIsOpen(false); }}
                      className="flex-grow py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] font-sans"
                    >
                      Initialize Auth
                    </button>
                  )}
                  {user && (
                    <button 
                      onClick={() => { signOut(); setIsOpen(false); }}
                      className="p-3 bg-white/5 border border-white/10 rounded-xl text-rose-500/50 hover:text-rose-500 transition-colors"
                    >
                      <LogOut size={18} />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
