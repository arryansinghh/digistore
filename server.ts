import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Lazy Razorpay initialization
  const getRazorpay = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret || key_id === "rzp_test_placeholder") {
      throw new Error("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Please set them in the environment variables.");
    }

    return new Razorpay({
      key_id,
      key_secret,
    });
  };

  // Middleware
  app.use(express.json());

  // Mock Products Database
  const products = [
    {
      id: "1",
      name: "Neo-Modern UI Kit",
      description: "A comprehensive design system for high-conversion SaaS landing pages. Includes 100+ components, responsive layouts, and light/dark modes.",
      price: 3999,
      category: "Design",
      image: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800&q=80",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80"
      ],
      features: ["Figma File Included", "Lifetime Updates", "Commercial License"],
      rating: 4.8,
      reviews: 124
    },
    {
      id: "2",
      name: "The SaaS Founder's Guide",
      description: "Master the art of building, scaling, and selling your first software product. 200+ pages of battle-tested strategies.",
      price: 1499,
      category: "E-books",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
        "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80"
      ],
      features: ["PDF & EPUB", "Bonus Checklist", "Expert Interviews"],
      rating: 4.9,
      reviews: 89
    },
    {
      id: "3",
      name: "Minimalist Icon Pack",
      description: "2,000+ vector icons crafted with precision. Perfect for apps, websites, and print materials.",
      price: 999,
      category: "Icons",
      image: "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=800&q=80",
        "https://images.unsplash.com/photo-1620674156044-52b714665d46?w=800&q=80"
      ],
      features: ["SVG & PNG", "Multiple Weights", "Webfont Included"],
      rating: 4.7,
      reviews: 56
    },
    {
      id: "4",
      name: "Motion Presets for Video",
      description: "Professional transition presets for Premiere Pro and After Effects. Drastically speed up your editing workflow.",
      price: 2499,
      category: "Video",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
        "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&q=80"
      ],
      features: ["25+ Presets", "Tutorial Videos", "Drag & Drop"],
      rating: 4.6,
      reviews: 42
    },
    {
      id: "5",
      name: "Advanced React Patterns",
      description: "Learn high-level React concepts like Compound Components, Render Props, and custom Hooks from industry experts.",
      price: 5999,
      category: "Education",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"
      ],
      features: ["10+ Modules", "Source Code Access", "Certification"],
      rating: 5.0,
      reviews: 312
    },
    {
      id: "6",
      name: "Lofi Beats Asset Pack",
      description: "Royal-free background tracks for focus, streaming, and content creation. High-quality 320kbps MP3s.",
      price: 799,
      category: "Audio",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
      ],
      features: ["20 Original Tracks", "Commercial Rights", "HQ Audio"],
      rating: 4.5,
      reviews: 78
    },
    {
      id: "7",
      name: "Cyberpunk Lightroom Presets",
      description: "Transform your photos with gritty, neon-infused palettes. Perfect for street photography and night shots.",
      price: 1999,
      category: "Design",
      image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80",
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80"
      ],
      features: ["15 Desktop Presets", "15 Mobile Presets", "Installation Guide"],
      rating: 4.7,
      reviews: 64
    },
    {
      id: "8",
      name: "Startup Pitch Deck Template",
      description: "Professional Keynote and PowerPoint templates designed to help you secure funding.",
      price: 2999,
      category: "Templates",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80"
      ],
      features: ["50+ Slides", "Custom Charts", "Vector Graphics"],
      rating: 4.9,
      reviews: 142
    }
  ];

  // API Routes
  app.get("/api/products", (req, res) => {
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  // Razorpay Order Creation
  app.post("/api/create-order", async (req, res) => {
    const { amount, currency = "INR" } = req.body;
    
    try {
      const rzp = getRazorpay();
      const options = {
        amount: Math.round(amount * 100), // amount in the smallest currency unit
        currency,
        receipt: `receipt_${Date.now()}`,
      };
      
      const order = await rzp.orders.create(options);
      res.json(order);
    } catch (error: any) {
      console.error("Razorpay Order Error:", error.message || error);
      
      const isAuthError = error.code === 'BAD_REQUEST_ERROR' && error.description?.includes('Authentication');
      
      res.status(500).json({ 
        error: error.message || "Failed to create order",
        details: isAuthError 
          ? "Razorpay authentication failed. Please ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correctly set in the 'Settings' tab."
          : (error.description || "An unexpected error occurred during order creation.")
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
