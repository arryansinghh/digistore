import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Product } from "../types";
import { Star, CheckCircle2, Download, Shield, Clock, ArrowLeft, Heart, Share2, MessageSquare, Send, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../context/CartContext";
import { getOptimizedImageUrl } from "../lib/images";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setActiveImage(data.image);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching product:", err));

    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    if (!id) return;
    const reviewPath = "reviews";
    try {
      const q = query(
        collection(db, reviewPath),
        where("productId", "==", id),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || comment.trim().length < 3) return;

    setSubmitting(true);
    const reviewPath = "reviews";
    try {
      const newReview = {
        productId: id,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userImage: user.photoURL || "",
        rating,
        comment,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, reviewPath), newReview);
      
      // Optimistic update for UI
      setReviews([{ 
        id: docRef.id, 
        ...newReview, 
        createdAt: { seconds: Date.now() / 1000 } 
      } as any, ...reviews]);
      
      setComment("");
      setRating(5);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, reviewPath);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Delete this review?")) return;
    const reviewPath = "reviews";
    try {
      await deleteDoc(doc(db, reviewPath, reviewId));
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, reviewPath);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      navigate("/cart");
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-pulse bg-[#0A0A0A]">
      <div className="h-[60vh] bg-white/5 rounded-3xl mb-8" />
    </div>
  );

  if (!product) return (
    <div className="text-center py-40 uppercase tracking-widest font-black opacity-30">
      Product not found
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 md:py-20">
      <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-opacity mb-12 sm:mb-20">
        <ArrowLeft size={14} />
        Back to Nexus
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        {/* Left: Product Media */}
        <div className="space-y-6 md:space-y-10">
          <motion.div 
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-white/5 border border-white/10 overflow-hidden"
          >
            <img 
              src={getOptimizedImageUrl(activeImage, 1200)} 
              alt={product.name} 
              className="w-full h-full object-cover aspect-[4/5] opacity-80 font-display font-black text-white/10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex gap-3">
              <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-white text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                {product.category}
              </span>
            </div>
          </motion.div>
          
          {product.gallery && product.gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-4 sm:gap-6">
              {[product.image, ...product.gallery].map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square overflow-hidden border transition-all ${
                    activeImage === img ? "border-white opacity-100" : "border-white/10 opacity-40 hover:opacity-100"
                  }`}
                >
                  <img src={getOptimizedImageUrl(img, 400)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-white/10 pt-8">
             <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-white/30">
               <span>Resolution</span>
               <span className="text-white">4K UHD / 300DPI</span>
             </div>
             <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-white/30">
               <span>License</span>
               <span className="text-white">Commercial Rev. 02</span>
             </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:sticky lg:top-32">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white mb-8 leading-[0.85] tracking-tighter uppercase">
            {product.name}
          </h1>

          <div className="flex items-center gap-6 mb-12 py-6 border-y border-white/10">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Price: <span className="text-white ml-2">₹{product.price}</span>
            </div>
            <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Rev: <span className="text-white ml-2">1.0.4</span>
            </div>
          </div>

          <p className="text-base lg:text-lg text-white/50 mb-12 leading-relaxed font-bold uppercase tracking-tight">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <button 
              onClick={handleAddToCart}
              className="flex-grow py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/90 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
            >
              <Download size={18} />
              Acquire License
            </button>
            <button 
              onClick={() => alert("Asset saved to your private catalog.")}
              className="px-8 py-6 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/5 transition-all active:scale-[0.98]"
            >
              <Heart size={18} />
            </button>
          </div>

          <div className="space-y-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">System Inventory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-white/60"
                >
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-40 border-t border-white/5 pt-20">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3">
            <h2 className="text-4xl font-display font-black uppercase tracking-tighter mb-8 italic">User Consensus</h2>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className={s <= Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? "fill-white text-white" : "text-white/10"} />
                ))}
              </div>
              <span className="text-xl font-black font-mono">
                {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">
              Validated Feedback based on {reviews.length} transmissions
            </p>

            {user ? (
              <motion.form 
                onSubmit={handleSubmitReview}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6"
              >
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/20 block mb-3">Transmission Quality</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-all ${
                          rating >= num ? "bg-white border-white text-black" : "border-white/10 text-white/40 hover:border-white/40"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/20 block mb-3">Feedback Terminal</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="ENTER DATA TRANSCRIPT..."
                    required
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || comment.trim().length < 3}
                  className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  Transmit Review
                </button>
              </motion.form>
            ) : (
              <div className="mt-12 p-8 border border-dashed border-white/5 rounded-3xl text-center">
                <Shield size={24} className="mx-auto text-white/10 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-6">Security Clearance Required to Review</p>
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Authenticate Now
                </button>
              </div>
            )}
          </div>

          <div className="lg:w-2/3">
            <div className="space-y-12">
              <AnimatePresence>
                {reviewsLoading ? (
                  <div className="text-[10px] uppercase font-black tracking-widest text-white/10">Loading Consensus Data...</div>
                ) : reviews.length === 0 ? (
                  <div className="py-20 text-center border border-white/5 rounded-3xl">
                    <MessageSquare size={32} className="mx-auto text-white/5 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">No feedback protocols recorded for this asset</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="group relative"
                    >
                      <div className="flex gap-6">
                        <div className="shrink-0">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
                            <img 
                              src={getOptimizedImageUrl(review.userImage || `https://ui-avatars.com/api/?name=${review.userName}`, 100)} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between gap-4 mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black uppercase tracking-widest">{review.userName}</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} size={10} className={s <= review.rating ? "fill-white text-white" : "text-white/10"} />
                                ))}
                              </div>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20">
                              {new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-white/60 leading-relaxed font-medium uppercase tracking-wide">
                            {review.comment}
                          </p>
                        </div>
                        
                        {user?.uid === review.userId && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 p-2 text-rose-500/40 hover:text-rose-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
