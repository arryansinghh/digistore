import React from "react";
import { ArrowRight, Upload, Zap, Globe, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Sell() {
  return (
    <div className="pb-40">
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-7xl lg:text-9xl font-display font-black uppercase tracking-tighter mb-8"
        >
          Creator <br />
          <span className="opacity-20 italic">Portal™</span>
        </motion.h1>
        <p className="text-white/40 max-w-xl mx-auto leading-relaxed uppercase tracking-widest font-bold mb-12">
          Monetize your professional assets on the world's most premium digital repository.
        </p>
        <button 
          onClick={() => alert("Vendor application system is under development. Please check back soon!")}
          className="px-12 py-6 bg-white text-black text-xs font-black uppercase tracking-extrawide rounded-full hover:bg-white/90 transition-all flex items-center gap-3 mx-auto group"
        >
          Apply as Vendor
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Upload, title: "0% Commission", desc: "Keep 100% of your earnings for the first 3 months." },
          { icon: Zap, title: "Global CDN", desc: "Your assets served at light-speed to users worldwide." },
          { icon: Globe, title: "Crypto Ready", desc: "Receive payments in fiat or major cryptocurrencies." },
          { icon: ShieldCheck, title: "IP Protection", desc: "Advanced watermarking and license management." }
        ].map((feature, i) => (
          <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-3xl space-y-6">
            <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-2xl">
              <feature.icon size={24} />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-tight">{feature.title}</h3>
            <p className="text-[11px] uppercase tracking-widest text-white/40 leading-relaxed font-bold">{feature.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-40 max-w-5xl mx-auto px-6 bg-white py-24 rounded-[40px] text-black text-center">
        <h2 className="text-4xl lg:text-6xl font-display font-black uppercase tracking-tighter mb-8 leading-[0.9]">Ready to join the ecosystem?</h2>
        <p className="text-black/40 font-bold uppercase tracking-widest text-sm mb-12">Join 12,000+ top-tier digital creators globally.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
           <a 
             href="https://docs.digistore.com" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="px-8 py-4 border-2 border-black/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-all text-center"
           >
             Read Documentation
           </a>
           <button 
             onClick={() => alert("Web3 Wallet integration is coming soon in Rev. 2.0")}
             className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black/90 transition-all"
           >
             Connect Wallet
           </button>
        </div>
      </section>
    </div>
  );
}
