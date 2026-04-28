import React, { useState } from "react";
import { Product } from "../types";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { getOptimizedImageUrl } from "../lib/images";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="group bg-[#0E0E0E] border border-white/5 overflow-hidden"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[4/5] bg-white/5 overflow-hidden flex items-center justify-center border-b border-white/5">
          {imageError ? (
            <div className="flex flex-col items-center gap-4 text-white/10 uppercase font-black tracking-tighter">
              <span className="text-4xl opacity-20">DigiStore</span>
              <span className="text-[10px] tracking-widest opacity-40">System Asset Preview</span>
            </div>
          ) : (
            <img 
              src={getOptimizedImageUrl(product.image, 600)} 
              alt={product.name} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 pointer-events-none" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-black/80 backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase tracking-widest">
              {product.category}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-2 sm:mb-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm md:text-lg font-bold uppercase tracking-tight text-white group-hover:text-white/70 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <span className="text-xs md:text-lg font-black text-white sm:ml-4">₹{product.price}</span>
        </div>
        
        <p className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest md:tracking-extrawide text-white/30 mt-1 mb-4 md:mb-6">
          {product.category} — {product.reviews} SOLD
        </p>

        <Link 
          to={`/product/${product.id}`}
          className="flex items-center justify-between py-2 md:py-3 border-t border-white/5 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/40 group-hover:text-white transition-all"
        >
          VIEW ASSET
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
