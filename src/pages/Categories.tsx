import React, { useState, useEffect } from "react";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const filter = searchParams.get("cat") || "All";
  const searchQuery = searchParams.get("q") || "";

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const setFilter = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === "All") {
      params.delete("cat");
    } else {
      params.set("cat", cat);
    }
    setSearchParams(params);
  };

  const setQuery = (q: string) => {
    const params = new URLSearchParams(searchParams);
    if (!q) {
      params.delete("q");
    } else {
      params.set("q", q);
    }
    setSearchParams(params);
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = filter === "All" || p.category === filter;
    const matchesSearch = searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-opacity mb-16">
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20">
        <div>
          <h1 className="text-6xl font-display font-black uppercase tracking-tighter mb-4">Discovery</h1>
          <p className="text-white/40 uppercase tracking-widest font-bold text-xs">Search and filter across {products.length} verified system assets</p>
        </div>
        
        <div className="w-full lg:w-96 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="SEARCH ASSETS..."
            value={searchQuery}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold tracking-widest uppercase focus:outline-none focus:border-white/30 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
        {/* Sidebar Filters */}
        <aside className="space-y-8 lg:space-y-12">
          <div className="overflow-x-auto lg:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0">
            <div className="flex items-center gap-2 mb-6 lg:mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 shrink-0">
              <SlidersHorizontal size={14} />
              Taxonomy
            </div>
            <div className="flex lg:flex-col gap-4 lg:gap-4 pb-4 lg:pb-0">
              {["All", "Design", "E-books", "Icons", "Audio", "Education", "Video"].map(cat => (
                <motion.button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  animate={{ x: (filter === cat && window.innerWidth >= 1024) ? 8 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap lg:text-left ${
                    filter === cat ? "text-white lg:text-white" : "text-white/30 hover:text-white/60"
                  } ${filter === cat ? "border-b-2 border-white lg:border-none pb-1 lg:pb-0" : ""}`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-white/5 border border-white/5 rounded-3xl hidden lg:block">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Market Status</h4>
             <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               LIVE UPDATE: 32 ACTIVE
             </div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="lg:col-span-3">
          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-10">
               {[1, 2, 4].map(i => <div key={i} className="bg-white/5 aspect-[4/5] rounded-3xl animate-pulse" />)}
             </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-40 text-center border border-dashed border-white/5 rounded-3xl opacity-20 uppercase tracking-[0.5em] font-black text-xs italic">
              No assets matching query
            </div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-10"
            >
              {filteredProducts.map((product: Product) => (
                <motion.div key={product.id} variants={item}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
