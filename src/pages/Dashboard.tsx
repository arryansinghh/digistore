import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { motion } from "motion/react";
import { Package, User as UserIcon, Calendar, CreditCard, ChevronRight, ExternalLink } from "lucide-react";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

interface OrderItem {
  id: string;
  name: string;
  price: number;
}

interface Order {
  id: string;
  amount: number;
  items: OrderItem[];
  status: string;
  createdAt: any;
  razorpayPaymentId?: string;
  simulated?: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const orderPath = "orders";
      try {
        const q = query(
          collection(db, orderPath),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(ordersData);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, orderPath);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-white/40 uppercase tracking-widest font-black text-xs">Access Restricted. Please Sign In.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <header className="mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded mb-4">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">Authorized Node</span>
            </div>
            <h1 className="text-4xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-none">
              Control Center
            </h1>
          </div>
          
          <div className="flex gap-4 border-b border-white/5">
            <button 
              onClick={() => setActiveTab("orders")}
              className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                activeTab === "orders" ? "text-white" : "text-white/20 hover:text-white/40"
              }`}
            >
              Order Registry
              {activeTab === "orders" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
            </button>
            <button 
              onClick={() => setActiveTab("profile")}
              className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                activeTab === "profile" ? "text-white" : "text-white/20 hover:text-white/40"
              }`}
            >
              Identity Info
              {activeTab === "profile" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />}
            </button>
          </div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {activeTab === "orders" ? (
          <section>
            {loading ? (
              <div className="py-20 text-center text-white/20 uppercase tracking-widest text-[10px] font-black">Syncing blockchain...</div>
            ) : orders.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl">
                <Package className="mx-auto text-white/5 mb-4" size={40} />
                <p className="text-white/20 uppercase tracking-widest text-[10px] font-black">No acquisitions found in local cache</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all"
                  >
                    <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                          <CreditCard size={20} className="text-white/40" />
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1 flex items-center gap-2">
                             System ID: {order.id.slice(0, 8)}...
                             {order.simulated && (
                               <span className="px-1.5 py-0.5 bg-white/10 rounded text-sky-400">Simulation</span>
                             )}
                          </div>
                          <h3 className="font-bold uppercase tracking-wider text-sm">
                            {order.items.length} Asset{order.items.length !== 1 ? 's' : ''} Licensed
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-12">
                        <div className="text-right">
                          <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Status</div>
                          <div className={`text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            {order.status}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Total Fee</div>
                          <div className="font-black text-lg font-mono">₹{order.amount.toFixed(2)}</div>
                        </div>
                        <div className="md:block hidden">
                           <ChevronRight size={20} className="text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-8 pb-8 flex flex-wrap gap-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-white/60">
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-16 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <UserIcon size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/10 mb-10 group relative">
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] font-black uppercase tracking-widest cursor-pointer">Update Identity</span>
                    </div>
                </div>

                <div className="space-y-10">
                   <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 block mb-3">Master Username</label>
                      <div className="text-2xl font-black uppercase tracking-tighter border-b border-white/10 pb-4 flex justify-between items-center group">
                        {user.displayName}
                        <ChevronRight size={16} className="text-white/5 group-hover:text-white/20 transition-all" />
                      </div>
                   </div>

                   <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 block mb-3">Encrypted Index(Email)</label>
                      <div className="text-xl font-bold border-b border-white/10 pb-4 flex justify-between items-center group text-white/60">
                        {user.email}
                        <ExternalLink size={14} className="text-white/5 group-hover:text-white/20 transition-all" />
                      </div>
                   </div>

                   <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 block mb-3">Security Clearances</label>
                      <div className="flex gap-3">
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded">Email Verified</span>
                        <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest rounded">Pro Member</span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}
