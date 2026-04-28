import React, { useState, useEffect } from "react";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Download } from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-32 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(50px,12vw,160px)] leading-[0.85] font-display font-black tracking-tighter uppercase mb-12 sm:mb-20"
          >
            Digital<br/>
            <span className="opacity-20 italic">Assets™</span>
          </motion.h1>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-t border-white/10 pt-10 gap-10">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-xl text-base lg:text-lg opacity-40 leading-tight font-bold uppercase tracking-tight"
            >
              High-fidelity resources for digital craftsmen. A curated selection of UI kits, design systems, and creative tools built to accelerate your professional workflow.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button 
                onClick={() => products.length > 0 && navigate(`/product/${products[0].id}`)}
                className="px-6 py-4 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-colors text-center"
              >
                LATEST RELEASE
              </button>
              <Link 
                to="/categories"
                className="px-6 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex items-center justify-center gap-2 group"
              >
                SHOP ALL
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories / Minimal Listing */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-8 mb-12">
          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">
            {["All", "Design", "E-books", "Icons", "Audio"].map((cat) => (
              <Link 
                key={cat} 
                to={cat === "All" ? "/categories" : `/categories?cat=${cat}`}
                className="hover:opacity-100 transition-opacity"
              >
                {cat}
              </Link>
            ))}
          </div>
          <div className="text-[10px] uppercase font-bold tracking-widest bg-white/5 px-4 py-1 rounded border border-white/10">
            SORT BY: POPULAR
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/5 rounded-2xl border border-white/5 h-64 md:h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          >
            {products.map(product => (
              <motion.div key={product.id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
