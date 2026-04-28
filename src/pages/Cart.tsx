import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Trash2, ArrowRight, ShieldCheck, Download, CreditCard, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
import { getOptimizedImageUrl } from "../lib/images";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Cart() {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();
  const { user, signInWithGoogle } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please sign in to complete your purchase.");
      signInWithGoogle();
      return;
    }

    setCheckingOut(true);

    try {
      // 1. Create order on the backend
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // If it's an auth error, we offer a simulation mode
        if (errorData.details?.includes("authentication failed")) {
           if (window.confirm("Razorpay keys are missing. Would you like to simulate a successful payment to see the full flow?")) {
             // Simulate Success
             const simulationId = "sim_" + Math.random().toString(36).substr(2, 9);
             const orderPath = "orders";
             await addDoc(collection(db, orderPath), {
               userId: user.uid,
               razorpayOrderId: simulationId,
               razorpayPaymentId: "pay_simulated",
               razorpaySignature: "sig_simulated",
               amount: totalPrice,
               items: cart.map(item => ({ id: item.id, name: item.name, price: item.price })),
               status: "completed",
               createdAt: serverTimestamp(),
               simulated: true,
             });
             setCompleted(true);
             clearCart();
             return;
           }
        }
        
        throw new Error(errorData.details || errorData.error || "Order creation failed");
      }
      
      const order = await response.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "DigiStore",
        description: "Digital Asset Purchase",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Record order in Firestore on success
          const orderPath = "orders";
          try {
            await addDoc(collection(db, orderPath), {
              userId: user.uid,
              razorpayOrderId: order.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              amount: totalPrice,
              items: cart.map(item => ({ id: item.id, name: item.name, price: item.price })),
              status: "completed",
              createdAt: serverTimestamp(),
            });

            setCompleted(true);
            clearCart();
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, orderPath);
          }
        },
        prefill: {
          name: user.displayName,
          email: user.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Payment failed or was cancelled.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (completed) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            <Download size={48} />
          </div>
        </motion.div>
        <h2 className="text-5xl font-display font-black uppercase tracking-tighter mb-4">Payment Successful</h2>
        <p className="text-white/40 mb-12 uppercase tracking-widest font-bold text-xs">Your assets are ready for download in your account dashboard.</p>
        <Link to="/" className="px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-extrawide rounded-full hover:bg-white/90 transition-all">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-6xl font-display font-black uppercase tracking-tighter mb-20">Your Registry</h1>

      {cart.length === 0 ? (
        <div className="py-20 text-center border border-white/5 bg-white/5 rounded-3xl">
          <p className="text-white/20 uppercase tracking-[0.3em] font-black text-sm mb-8">System is empty</p>
          <Link to="/" className="text-white hover:opacity-50 transition-all font-bold uppercase tracking-widest text-xs border-b border-white/20 pb-1">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-8 py-8 border-b border-white/10 group"
                >
                  <div className="w-32 aspect-square bg-white/5 border border-white/10 overflow-hidden shrink-0">
                    <img src={getOptimizedImageUrl(item.image, 300)} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1">{item.name}</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/30">{item.category} — License Type A</p>
                  </div>
                  <div className="flex items-center gap-8 w-full sm:w-auto justify-between">
                    <span className="text-xl font-black">₹{item.price}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 text-white/30 transition-all rounded-xl"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="lg:sticky lg:top-32 h-fit space-y-8"
          >
            <div className="bg-white/5 border border-white/10 p-10 rounded-3xl space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Financial Summary</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-white/40">
                  <span>Subtotal</span>
                  <span className="text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-white/40">
                  <span>Tax (0%)</span>
                  <span className="text-white">₹0.00</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-black uppercase">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full py-6 bg-white text-black text-xs font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {checkingOut ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard size={18} />
                    Complete Purchase
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-white/20">
                <ShieldCheck size={14} className="text-emerald-500" />
                Secure check-out powered by DigiVault™
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
