import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Mic, Bell, MapPin, ChevronRight, ChevronLeft,
  Heart, ShoppingCart, Star, Plus, Minus, X, User,
  SlidersHorizontal, Volume2, Trash2, Check, Package,
  Tag, Filter, Sun, Moon, Facebook, Twitter, Linkedin, Instagram,
  Mail, Phone, MapPin as LocationIcon, ArrowRight, Truck, Shield, RotateCcw,
} from "lucide-react";
import { create } from "zustand";

// ─── Dark Mode Context ────────────────────────────────────────────────────────

const DarkCtx = createContext(false);
const useDark = () => useContext(DarkCtx);

// Theme helper — returns light or dark value
const th = (light: string, dark: string) => ({ light, dark });

// ─── Palette ──────────────────────────────────────────────────────────────────
// Cream #FFFCF2 | Linen #CCC5B9 | Charcoal #403D39
// Near Black #252422 | Vivid Orange #EB5E28

const P = {
  forest:   "#252422",
  teal:     "#EB5E28",
  emerald:  "#CCC5B9",
  sage:     "#CCC5B9",
  frost:    "#FFFCF2",
};

// Semantic tokens
const T = {
  pageBg:      th(P.frost,                      "#252422"),
  navBg:       th("#FFFFFF",                    "#2E2B28"),
  navBorder:   th("#E8E3DA",                    "#3A3733"),
  cardBg:      th("#FFFFFF",                    "#302D2A"),
  cardBorder:  th("#EAE5DC",                    "#3A3733"),
  mutedBg:     th("#FAF8F2",                    "#2A2724"),
  inputBg:     th("#F0EDE5",                    "#333028"),
  inputBorder: th("#DDD8CF",                    "#4A4742"),
  hoverBg:     th("#EDE8DE",                    "#3A3733"),
  textPrimary: th(P.forest,                     P.frost),
  textSecond:  th("#403D39",                    P.emerald),
  textMuted:   th(P.emerald,                    "#7A7268"),
  border:      th("#DDD8CF",                    "#3A3733"),
  accent:      th(P.teal,                       "#F06B30"),
  accentText:  th("#FFFFFF",                    "#FFFFFF"),
  emerald:     th(P.emerald,                    "#A09888"),
  btnBg:       th(P.forest,                     P.frost),
  btnText:     th("#FFFFFF",                    P.forest),
  greenBtn:    th(P.teal,                       "#F06B30"),
  greenText:   th("#FFFFFF",                    "#FFFFFF"),
  dockBg:      th("rgba(255,252,242,0.97)",     "rgba(37,36,34,0.97)"),
  dockBorder:  th("#DDD8CF",                    "#3A3733"),
};

function tv(token: { light: string; dark: string }, dark: boolean) {
  return dark ? token.dark : token.light;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string; name: string; brand: string; price: number;
  originalPrice?: number; image: string; rating: number;
  reviews: number; category: string; description: string;
  badge?: string;
}
interface CartItem extends Product { quantity: number; }
interface CartStore {
  items: CartItem[]; wishlist: string[];
  addItem: (p: Product) => void; removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void; toggleWishlist: (id: string) => void;
  total: () => number; count: () => number;
}

// ─── Zustand Store ────────────────────────────────────────────────────────────

const useCart = create<CartStore>((set, get) => ({
  items: [], wishlist: [],
  addItem: (product) => set((s) => {
    const ex = s.items.find((i) => i.id === product.id);
    return ex
      ? { items: s.items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) }
      : { items: [...s.items, { ...product, quantity: 1 }] };
  }),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  updateQty: (id, qty) => set((s) => ({
    items: qty === 0 ? s.items.filter((i) => i.id !== id)
      : s.items.map((i) => i.id === id ? { ...i, quantity: qty } : i),
  })),
  toggleWishlist: (id) => set((s) => ({
    wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id],
  })),
  total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
  count: () => get().items.reduce((s, i) => s + i.quantity, 0),
}));

// ─── Mock Data ────────────────────────────────────────────────────────────────

const heroProducts: Product[] = [
  { id: "h1", name: "Premium Headphones", brand: "Sony", price: 2499, originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8, reviews: 2341, category: "Electronics", description: "Block out the noise. Enjoy the music.", badge: "Best Seller" },
  { id: "h2", name: "Nike Air Max Excee", brand: "Nike", price: 1999, originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6, reviews: 1892, category: "Footwear", description: "Comfort you with everyday wear.", badge: "New Arrival" },
  { id: "h3", name: "Fossil Chronograph", brand: "Fossil", price: 7495, originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9, reviews: 876, category: "Watches", description: "Ceramic design. Precision timekeeping.", badge: "Premium" },
];

const recommendedProducts: Product[] = [
  { id: "r1", name: "Hoodie Sweatshirt", brand: "Zara", price: 1750, originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.3, reviews: 542, category: "Clothing", description: "Soft-touch fleece hoodie" },
  { id: "r2", name: "Laptop Backpack", brand: "Samsonite", price: 1299, originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5, reviews: 1230, category: "Bags", description: "15.6\" slim fit carry" },
  { id: "r3", name: "Canvas Sneakers", brand: "Converse", price: 1299, originalPrice: 1799,
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4, reviews: 3201, category: "Footwear", description: "Classic low-top streetwear" },
  { id: "r4", name: "Slim Fit Jeans", brand: "Levi's", price: 1499, originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1631112230741-446762ee05ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.2, reviews: 4572, category: "Clothing", description: "511 slim tapered fit denim" },
  { id: "r5", name: "Oversize T-Shirt", brand: "H&M", price: 699, originalPrice: 999,
    image: "https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.1, reviews: 2890, category: "Clothing", description: "100% cotton relaxed fit" },
  { id: "r6", name: "Smart Watch", brand: "Apple", price: 32999, originalPrice: 41900,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9, reviews: 18430, category: "Electronics", description: "Health, fitness & connectivity" },
];

const recentlyViewed: Product[] = [
  { ...heroProducts[0], id: "rv1" },
  { ...recommendedProducts[2], id: "rv2" },
  { ...heroProducts[2], id: "rv3" },
  { ...recommendedProducts[4], id: "rv4" },
  { ...recommendedProducts[1], id: "rv5" },
  { ...heroProducts[1], id: "rv6" },
];

// ─── Category Geometric Icons ─────────────────────────────────────────────────

const CatIcon = ({ id, color }: { id: string; color: string }) => {
  const s = { stroke: color, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const icons: Record<string, JSX.Element> = {
    c1: ( // Electronics — concentric arcs + dot (signal/chip)
      <svg viewBox="0 0 32 32" width="28" height="28">
        <circle cx="16" cy="16" r="3" fill={color} />
        <path d="M10 16 a6 6 0 0 1 12 0" {...s} strokeWidth="2" />
        <path d="M6 16 a10 10 0 0 1 20 0" {...s} strokeWidth="1.5" />
        <line x1="16" y1="5" x2="16" y2="8" {...s} strokeWidth="2" />
        <line x1="16" y1="24" x2="16" y2="27" {...s} strokeWidth="2" />
      </svg>
    ),
    c2: ( // Fashion — diamond with inner lines (fabric/crystal)
      <svg viewBox="0 0 32 32" width="28" height="28">
        <polygon points="16,4 28,16 16,28 4,16" {...s} strokeWidth="1.8" />
        <polygon points="16,9 23,16 16,23 9,16" {...s} strokeWidth="1.4" />
        <line x1="16" y1="4" x2="16" y2="28" {...s} strokeWidth="1" strokeOpacity="0.4" />
        <line x1="4" y1="16" x2="28" y2="16" {...s} strokeWidth="1" strokeOpacity="0.4" />
      </svg>
    ),
    c3: ( // Footwear — angled parallel lines + curve (motion/sole)
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M4 22 Q10 10 20 10 L28 14" {...s} strokeWidth="2.2" />
        <line x1="7" y1="25" x2="25" y2="25" {...s} strokeWidth="2" />
        <line x1="12" y1="14" x2="9" y2="22" {...s} strokeWidth="1.4" strokeOpacity="0.5" />
        <line x1="17" y1="12" x2="14" y2="22" {...s} strokeWidth="1.4" strokeOpacity="0.5" />
        <line x1="22" y1="12" x2="19" y2="22" {...s} strokeWidth="1.4" strokeOpacity="0.5" />
      </svg>
    ),
    c4: ( // Watches — circle + tick marks + hands
      <svg viewBox="0 0 32 32" width="28" height="28">
        <circle cx="16" cy="16" r="10" {...s} strokeWidth="1.8" />
        <rect x="13" y="4" width="6" height="3" rx="1" {...s} strokeWidth="1.4" />
        <rect x="13" y="25" width="6" height="3" rx="1" {...s} strokeWidth="1.4" />
        <line x1="16" y1="16" x2="16" y2="10" {...s} strokeWidth="2" />
        <line x1="16" y1="16" x2="21" y2="18" {...s} strokeWidth="1.6" />
        <circle cx="16" cy="16" r="1.2" fill={color} />
      </svg>
    ),
    c5: ( // Bags — trapezoid body + handle arc
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M10 13 L8 26 L24 26 L22 13 Z" {...s} strokeWidth="1.8" />
        <path d="M12 13 Q12 7 20 7 Q20 7 20 13" {...s} strokeWidth="1.8" />
        <line x1="8" y1="18" x2="24" y2="18" {...s} strokeWidth="1.2" strokeOpacity="0.5" />
      </svg>
    ),
    c6: ( // Sports — hexagon + inner triangle (energy/motion)
      <svg viewBox="0 0 32 32" width="28" height="28">
        <polygon points="16,4 27,10 27,22 16,28 5,22 5,10" {...s} strokeWidth="1.8" />
        <polygon points="16,11 22,19 10,19" {...s} strokeWidth="1.5" />
      </svg>
    ),
    c7: ( // Beauty — nested circles + cross lines (symmetry/bloom)
      <svg viewBox="0 0 32 32" width="28" height="28">
        <circle cx="16" cy="16" r="10" {...s} strokeWidth="1.8" />
        <circle cx="16" cy="16" r="4" {...s} strokeWidth="1.4" />
        <line x1="16" y1="6" x2="16" y2="12" {...s} strokeWidth="1.4" strokeOpacity="0.6" />
        <line x1="16" y1="20" x2="16" y2="26" {...s} strokeWidth="1.4" strokeOpacity="0.6" />
        <line x1="6" y1="16" x2="12" y2="16" {...s} strokeWidth="1.4" strokeOpacity="0.6" />
        <line x1="20" y1="16" x2="26" y2="16" {...s} strokeWidth="1.4" strokeOpacity="0.6" />
      </svg>
    ),
    c8: ( // Books — stacked rectangles offset (pages)
      <svg viewBox="0 0 32 32" width="28" height="28">
        <rect x="7" y="8" width="16" height="20" rx="2" {...s} strokeWidth="1.8" />
        <rect x="10" y="5" width="16" height="20" rx="2" {...s} strokeWidth="1.4" strokeOpacity="0.5" />
        <line x1="10" y1="14" x2="20" y2="14" {...s} strokeWidth="1.3" strokeOpacity="0.6" />
        <line x1="10" y1="18" x2="20" y2="18" {...s} strokeWidth="1.3" strokeOpacity="0.6" />
        <line x1="10" y1="22" x2="16" y2="22" {...s} strokeWidth="1.3" strokeOpacity="0.6" />
      </svg>
    ),
    c9: ( // Home — triangle roof + square body + door rect
      <svg viewBox="0 0 32 32" width="28" height="28">
        <polygon points="16,5 28,16 4,16" {...s} strokeWidth="1.8" />
        <rect x="8" y="16" width="16" height="12" rx="1" {...s} strokeWidth="1.8" />
        <rect x="13" y="21" width="6" height="7" rx="1" {...s} strokeWidth="1.4" />
      </svg>
    ),
    c10: ( // Gaming — plus/cross shape with circles at ends
      <svg viewBox="0 0 32 32" width="28" height="28">
        <rect x="12" y="6" width="8" height="20" rx="4" {...s} strokeWidth="1.8" />
        <rect x="6" y="12" width="20" height="8" rx="4" {...s} strokeWidth="1.8" />
        <circle cx="22" cy="14" r="1.5" fill={color} />
        <circle cx="22" cy="18" r="1.5" fill={color} />
        <circle cx="10" cy="16" r="1.5" fill={color} />
        <circle cx="16" cy="8" r="1.5" fill={color} />
      </svg>
    ),
  };
  return icons[id] ?? null;
};

// ─── Categories Data ──────────────────────────────────────────────────────────

const categories = [
  { id: "c1",  label: "Electronics", color: "#FDF0E8", darkColor: "#2E2520", iconColor: "#EB5E28" },
  { id: "c2",  label: "Fashion",     color: "#FBF2EC", darkColor: "#2A2420", iconColor: "#C4501F" },
  { id: "c3",  label: "Footwear",    color: "#FDF0E8", darkColor: "#2E2520", iconColor: "#EB5E28" },
  { id: "c4",  label: "Watches",     color: "#F5EFE6", darkColor: "#282520", iconColor: "#9A8070" },
  { id: "c5",  label: "Bags",        color: "#FDF0E8", darkColor: "#2E2520", iconColor: "#EB5E28" },
  { id: "c6",  label: "Sports",      color: "#FBF2EC", darkColor: "#2A2420", iconColor: "#C4501F" },
  { id: "c7",  label: "Beauty",      color: "#FDF0E8", darkColor: "#2E2520", iconColor: "#9A8878" },
  { id: "c8",  label: "Books",       color: "#F5EFE6", darkColor: "#282520", iconColor: "#403D39" },
  { id: "c9",  label: "Home",        color: "#FBF2EC", darkColor: "#2A2420", iconColor: "#7A7068" },
  { id: "c10", label: "Gaming",      color: "#FDF0E8", darkColor: "#2E2520", iconColor: "#EB5E28" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={11}
        style={s <= Math.round(rating)
          ? { fill: "#EB5E28", color: "#EB5E28" }
          : { fill: "#DDD8CF", color: "#DDD8CF" }} />
    ))}
  </div>
);

// ─── Search Suggestions Dropdown ──────────────────────────────────────────────

function SearchSuggestions({ 
  query, suggestions, dark, onSuggestionClick, onAddToCart, allProducts 
}: {
  query: string; suggestions: Product[]; dark: boolean; 
  onSuggestionClick: (p: Product) => void; onAddToCart: (p: Product) => void; allProducts: Product[];
}) {
  if (query.trim() === "" || suggestions.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
      className="absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl z-50 overflow-hidden transition-colors duration-300"
      style={{ background: tv(T.navBg, dark), border: `1px solid ${tv(T.cardBorder, dark)}` }}>
      
      <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
        {suggestions.map((p) => (
          <div key={p.id}
            onClick={() => onSuggestionClick(p)}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors duration-200 text-left cursor-pointer hover:opacity-80"
            style={{ background: tv(T.hoverBg, dark) }}>
            
            <img src={p.image} alt={p.name} 
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold transition-colors duration-300"
                style={{ color: tv(T.textPrimary, dark) }}>{p.name}</div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] transition-colors duration-300"
                  style={{ color: tv(T.textSecond, dark) }}>{p.brand}</span>
                <span className="text-[10px] transition-colors duration-300"
                  style={{ color: tv(T.textMuted, dark) }}>{p.category}</span>
              </div>
              <div className="text-xs font-bold mt-0.5 transition-colors duration-300"
                style={{ color: P.teal }}>{fmt(p.price)}</div>
            </div>

            <button onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0"
              style={{ background: tv(T.btnBg, dark), color: tv(T.btnText, dark) }}>
              <Plus size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="px-3 py-2.5 text-[11px] font-medium transition-colors duration-300 text-center"
        style={{ borderTop: `1px solid ${tv(T.border, dark)}`, color: tv(T.textMuted, dark) }}>
        Press <span className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-[10px]">Enter</span> to see all results
      </div>
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ 
  onLocationOpen, onNotifOpen, onVoiceClick, onToggleDark, 
  search, onSearchChange, onSearchSubmit, suggestions 
}: {
  onLocationOpen: () => void; onNotifOpen: () => void;
  onVoiceClick: () => void; onToggleDark: () => void;
  search: string; onSearchChange: (val: string) => void; 
  onSearchSubmit: () => void; suggestions: Product[];
}) {
  const dark = useDark();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  return (
    <header
      className="sticky top-0 z-40 transition-colors duration-300"
      style={{ background: tv(T.navBg, dark), borderBottom: `1px solid ${tv(T.navBorder, dark)}`, height: 72 }}
    >
      <div className="max-w-[1400px] mx-auto h-full flex items-center gap-6 px-6">
        {/* Logo */}
        <div className="flex-shrink-0 flex flex-col leading-none">
         <span
  className="text-[30px] font-medium tracking-[-0.06em]"
  style={{
    fontFamily: "'General Sans', sans-serif",
    color: tv(T.textPrimary, dark),
  }}
>
  V A N I
</span>
          
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-auto relative">
          <div className="relative flex items-center rounded-full border transition-colors duration-300"
            style={{ background: tv(T.inputBg, dark), borderColor: tv(T.inputBorder, dark) }}>
            <Search size={16} className="absolute left-4" style={{ color: tv(T.textSecond, dark) }} />
            <input value={search} onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products, categories..."
              className="w-full bg-transparent py-2.5 pl-10 pr-10 text-sm outline-none transition-colors duration-300"
              style={{ color: tv(T.textPrimary, dark) }} />
            <button onClick={onVoiceClick} className="absolute right-3 transition-colors duration-300"
              style={{ color: tv(T.textSecond, dark) }}>
              <Mic size={16} />
            </button>
          </div>
          
          {/* Suggestions Dropdown */}
          <AnimatePresence>
            <SearchSuggestions 
              query={search} 
              suggestions={suggestions} 
              dark={dark}
              onSuggestionClick={(p) => onSearchChange("")}
              onAddToCart={() => {}}
              allProducts={suggestions}
            />
          </AnimatePresence>
        </div>

        {/* Right */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <button onClick={onNotifOpen} className="relative p-2 transition-colors duration-300"
            style={{ color: tv(T.textSecond, dark) }}>
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#EB5E28" }} />
          </button>

          <button onClick={onLocationOpen}
            className="flex items-center gap-1.5 text-xs transition-colors duration-300 hidden sm:flex"
            style={{ color: tv(T.textPrimary, dark) }}>
            <MapPin size={14} style={{ color: P.teal }} />
            <div className="text-left">
              <div className="text-[10px] font-medium" style={{ color: tv(T.textSecond, dark) }}>Deliver to</div>
              <div className="text-xs font-semibold leading-tight">New Delhi, 110001</div>
            </div>
          </button>

          <motion.button whileTap={{ scale: 0.88, rotate: 20 }} onClick={onToggleDark}
            className="p-2 transition-colors duration-300 rounded-full"
            style={{ color: tv(T.textSecond, dark) }}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <button className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{ background: tv(T.btnBg, dark), color: tv(T.btnText, dark) }}>
            <User size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, action }: { title: string; action?: string }) {
  const dark = useDark();
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full transition-colors duration-300"
          style={{ background: tv(T.textPrimary, dark) }} />
        <h2 className="text-base font-semibold transition-colors duration-300"
          style={{ color: tv(T.textPrimary, dark) }}>{title}</h2>
      </div>
      {action && (
        <button className="text-xs font-medium flex items-center gap-1 transition-colors duration-300"
          style={{ color: tv(T.textSecond, dark) }}>
          {action} <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Categories Section ───────────────────────────────────────────────────────

function CategoriesSection() {
  const dark = useDark();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="max-w-[1400px] mx-auto px-6 pb-6">
      <SectionHeader title="Shop by Category" />
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {categories.map((cat, i) => {
          const isActive = active === cat.id;
          const pillBg = dark ? cat.darkColor : cat.color;
          const activeIconColor = isActive ? (dark ? cat.iconColor : "#FFFFFF") : cat.iconColor;

          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3, scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(isActive ? null : cat.id)}
              className="flex-shrink-0 flex flex-col items-center gap-2.5 px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer"
              style={{
                background: isActive ? (dark ? "#F5F5F7" : "#111111") : tv(T.cardBg, dark),
                border: `1.5px solid ${isActive ? "transparent" : tv(T.cardBorder, dark)}`,
                boxShadow: isActive
                  ? `0 6px 20px ${cat.iconColor}55`
                  : `0 2px 8px rgba(0,0,0,0.04)`,
                minWidth: 88,
              }}
            >
              {/* Geometric icon inside tinted pill */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
                style={{ background: isActive ? (dark ? "#2C2C2E" : "rgba(255,255,255,0.15)") : pillBg }}
              >
                <CatIcon id={cat.id} color={activeIconColor} />
              </div>
              <span
                className="text-[11px] font-semibold whitespace-nowrap transition-colors duration-200"
                style={{ color: isActive ? (dark ? "#0D0D0D" : "#FFFFFF") : tv(T.textPrimary, dark) }}
              >
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

// ─── Hero Carousel ────────────────────────────────────────────────────────────

function HeroCarousel({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const dark = useDark();
  const [current, setCurrent] = useState(0);
  const total = heroProducts.length;
  const paused = useRef(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);

  useEffect(() => {
    const id = setInterval(() => { if (!paused.current) next(); }, 5500);
    return () => clearInterval(id);
  }, [next]);

  const bgColors = dark
    ? ["#2E2520", "#282520", "#2A2420"]
    : ["#FDF0E8", "#FBF5EC", "#F5EFE6"];

  return (
    <section className="max-w-[1400px] mx-auto px-6 pt-6 pb-4">
      

      <div
        className="relative flex items-center justify-center"
        style={{ height: 380 }}
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; }}
      >
        {heroProducts.map((product, idx) => {
          const offset = ((idx - current + total) % total + total) % total;
          const pos = offset === 0 ? 0 : offset === 1 ? 1 : -1;
          const isCenter = pos === 0;

          return (
            <motion.div
              key={product.id}
              className="absolute cursor-pointer"
              style={{ width: isCenter ? 572 : 400, originY: 0.5 }}
              animate={{
                x: pos * 390, y: 0,
                scale: isCenter ? 1 : 0.78,
                zIndex: isCenter ? 20 : 10,
                opacity: isCenter ? 1 : 0.72,
                filter: isCenter
                  ? "blur(0px) brightness(1) drop-shadow(0 20px 48px rgba(0,0,0,0.18))"
                  : `blur(0.6px) brightness(${dark ? "0.6" : "0.88"})`,
              }}
              transition={{
                x: { type: "spring", stiffness: 220, damping: 28, mass: 1.1 },
                scale: { type: "spring", stiffness: 260, damping: 30 },
                opacity: { duration: 0.38, ease: "easeOut" },
                filter: { duration: 0.38, ease: "easeOut" },
              }}
              onClick={() => !isCenter && setCurrent(idx)}
            >
              <HeroCard
                product={product}
                bg={bgColors[idx % bgColors.length]}
                onAdd={() => onAddToCart(product)}
                active={isCenter}
              />
            </motion.div>
          );
        })}

        <button onClick={prev}
          className="absolute left-0 w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all z-30"
          style={{ background: tv(T.cardBg, dark), color: tv(T.textSecond, dark) }}>
          <ChevronLeft size={16} />
        </button>
        <button onClick={next}
          className="absolute right-0 w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-all z-30"
          style={{ background: tv(T.cardBg, dark), color: tv(T.textSecond, dark) }}>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {heroProducts.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className="h-1.5 rounded-full transition-all"
            style={{ width: i === current ? 20 : 6, background: i === current ? P.teal : tv(T.border, dark) }} />
        ))}
      </div>
    </section>
  );
}

// ─── Hero Card ────────────────────────────────────────────────────────────────

function HeroCard({ product, bg, onAdd, active }: { product: Product; bg: string; onAdd: () => void; active: boolean }) {
  const dark = useDark();
  const [added, setAdded] = useState(false);

  const handleAdd = () => { onAdd(); setAdded(true); setTimeout(() => setAdded(false), 1500); };

  return (
    <motion.div
      whileHover={active ? { y: -4 } : {}}
      transition={{ duration: 0.25 }}
      className="rounded-2xl overflow-hidden transition-colors duration-300"
      style={{ background: tv(T.cardBg, dark) }}
    >
      <div className="relative flex items-center justify-center overflow-hidden" style={{ background: bg, height: 260 }}>
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold px-2 py-1 rounded-full shadow-sm"
            style={{ background: tv(T.cardBg, dark), color: tv(T.textPrimary, dark) }}>
            {product.badge}
          </span>
        )}
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="text-[10px] font-medium uppercase tracking-wider mb-0.5 transition-colors duration-300"
          style={{ color: tv(T.textSecond, dark) }}>{product.brand}</div>
        <h3 className="text-sm font-semibold mb-1 transition-colors duration-300"
          style={{ color: tv(T.textPrimary, dark) }}>{product.name}</h3>
        <p className="text-[11px] mb-3 transition-colors duration-300"
          style={{ color: tv(T.textSecond, dark) }}>{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-bold transition-colors duration-300"
              style={{ color: tv(T.textPrimary, dark) }}>{fmt(product.price)}</div>
            {product.originalPrice && (
              <div className="text-[11px] line-through transition-colors duration-300"
                style={{ color: tv(T.textMuted, dark) }}>{fmt(product.originalPrice)}</div>
            )}
          </div>
          <motion.button whileTap={{ scale: 0.93 }} onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
            style={{ background: added ? P.teal : tv(T.btnBg, dark), color: added ? "#fff" : tv(T.btnText, dark) }}>
            {added ? <><Check size={12} /> Added</> : "Shop Now"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  const dark = useDark();
  const { wishlist, toggleWishlist } = useCart();
  const isWishlisted = wishlist.includes(product.id);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); onAdd(); setAdded(true); setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: dark ? "0 12px 32px rgba(0,0,0,0.5)" : "0 12px 32px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.2 }}
      className="rounded-xl overflow-hidden cursor-pointer group transition-colors duration-300"
      style={{ background: tv(T.cardBg, dark), border: `1px solid ${tv(T.cardBorder, dark)}` }}
    >
      <div className="relative aspect-square overflow-hidden transition-colors duration-300"
        style={{ background: tv(T.mutedBg, dark) }}>
        <img src={product.image} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {discount > 0 && (
          <span className="absolute top-2 left-2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#EB5E28" }}>
            -{discount}%
          </span>
        )}
        <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full shadow-sm flex items-center justify-center transition-colors duration-300"
          style={{ background: tv(T.cardBg, dark) }}>
          <Heart size={13} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <div className="p-3">
        <div className="text-[9px] font-semibold uppercase tracking-wider mb-0.5 transition-colors duration-300"
          style={{ color: tv(T.textSecond, dark) }}>{product.brand}</div>
        <h4 className="text-[12px] font-semibold leading-tight mb-1 line-clamp-1 transition-colors duration-300"
          style={{ color: tv(T.textPrimary, dark) }}>{product.name}</h4>
        <div className="flex items-center gap-1 mb-2">
          <Stars rating={product.rating} />
          <span className="text-[9px] transition-colors duration-300"
            style={{ color: tv(T.textSecond, dark) }}>({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold transition-colors duration-300"
              style={{ color: tv(T.textPrimary, dark) }}>{fmt(product.price)}</div>
            {product.originalPrice && (
              <div className="text-[10px] line-through transition-colors duration-300"
                style={{ color: tv(T.textMuted, dark) }}>{fmt(product.originalPrice)}</div>
            )}
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleAdd}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: added ? P.teal : tv(T.btnBg, dark), color: added ? "#fff" : tv(T.btnText, dark) }}>
            {added ? <Check size={12} /> : <Plus size={13} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Recommended Section ──────────────────────────────────────────────────────

function RecommendedSection({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  return (
    <section className="max-w-[1400px] mx-auto px-6 pb-8">
      <SectionHeader title="Recommended For You" action="View all" />
      <div className="grid grid-cols-6 gap-4">
        {recommendedProducts.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => onAddToCart(p)} />
        ))}
      </div>
    </section>
  );
}

// ─── Recently Viewed ──────────────────────────────────────────────────────────

function RecentlyViewedSection({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const dark = useDark();

  return (
    <section className="max-w-[1400px] mx-auto px-6 pb-8">
      <SectionHeader title="Recently Viewed" action="Clear" />
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {recentlyViewed.map((product, i) => (
          <motion.div key={product.id}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex-shrink-0 w-[180px] rounded-xl overflow-hidden cursor-pointer group transition-colors duration-300"
            style={{ background: tv(T.cardBg, dark), boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)" }}
            whileHover={{ y: -3, boxShadow: dark ? "0 10px 28px rgba(0,0,0,0.5)" : "0 10px 28px rgba(0,0,0,0.11)" }}
          >
            <div className="relative h-[140px] overflow-hidden">
              <img src={product.image} alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="p-3">
              <div className="text-[9px] font-semibold uppercase tracking-wider mb-0.5 transition-colors duration-300"
                style={{ color: tv(T.textSecond, dark) }}>{product.brand}</div>
              <div className="text-xs font-semibold line-clamp-1 mb-1 transition-colors duration-300"
                style={{ color: tv(T.textPrimary, dark) }}>{product.name}</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold transition-colors duration-300"
                  style={{ color: tv(T.textPrimary, dark) }}>{fmt(product.price)}</span>
                <motion.button whileTap={{ scale: 0.88 }} onClick={() => onAddToCart(product)}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ background: tv(T.btnBg, dark), color: tv(T.btnText, dark) }}>
                  <Plus size={11} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dark = useDark();
  const { items, removeItem, updateQty, total } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[380px] z-50 shadow-2xl flex flex-col transition-colors duration-300"
            style={{ background: tv(T.navBg, dark) }}
          >
            <div className="flex items-center justify-between p-5 transition-colors duration-300"
              style={{ borderBottom: `1px solid ${tv(T.border, dark)}` }}>
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} style={{ color: tv(T.textPrimary, dark) }} />
                <h3 className="font-semibold transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
                  Your Cart
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: tv(T.btnBg, dark), color: tv(T.btnText, dark) }}>
                  {items.length}
                </span>
              </div>
              <button onClick={onClose} style={{ color: tv(T.textSecond, dark) }}><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <Package size={40} style={{ color: tv(T.border, dark) }} />
                  <p className="text-sm" style={{ color: tv(T.textSecond, dark) }}>Your cart is empty</p>
                  <button onClick={onClose} className="text-xs font-semibold" style={{ color: P.teal }}>Continue Shopping</button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-3 rounded-xl transition-colors duration-300"
                    style={{ background: tv(T.mutedBg, dark) }}>
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300"
                        style={{ color: tv(T.textSecond, dark) }}>{item.brand}</div>
                      <div className="text-xs font-semibold line-clamp-1 transition-colors duration-300"
                        style={{ color: tv(T.textPrimary, dark) }}>{item.name}</div>
                      <div className="text-sm font-bold mt-0.5 transition-colors duration-300"
                        style={{ color: tv(T.textPrimary, dark) }}>{fmt(item.price)}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300"
                          style={{ background: tv(T.cardBg, dark), border: `1px solid ${tv(T.border, dark)}`, color: tv(T.textPrimary, dark) }}>
                          <Minus size={10} />
                        </button>
                        <span className="text-xs font-semibold w-4 text-center transition-colors duration-300"
                          style={{ color: tv(T.textPrimary, dark) }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200"
                          style={{ background: tv(T.btnBg, dark), color: tv(T.btnText, dark) }}>
                          <Plus size={10} />
                        </button>
                        <button onClick={() => removeItem(item.id)}
                          className="ml-auto text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 transition-colors duration-300" style={{ borderTop: `1px solid ${tv(T.border, dark)}` }}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: tv(T.textSecond, dark) }}>Subtotal</span>
                  <span className="font-bold" style={{ color: tv(T.textPrimary, dark) }}>{fmt(total())}</span>
                </div>
                <div className="flex justify-between text-xs mb-4">
                  <span style={{ color: tv(T.textMuted, dark) }}>Delivery</span>
                  <span className="font-semibold" style={{ color: P.teal }}>FREE</span>
                </div>
                <motion.button whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                  style={{ background: tv(T.btnBg, dark), color: tv(T.btnText, dark) }}>
                  Checkout — {fmt(total())}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Filters Panel ────────────────────────────────────────────────────────────

function FiltersPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dark = useDark();
  const [priceRange, setPriceRange] = useState(50000);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const cats = ["Electronics", "Clothing", "Footwear", "Watches", "Bags"];
  const toggleCat = (c: string) => setSelectedCats((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-[320px] z-50 shadow-2xl flex flex-col transition-colors duration-300"
            style={{ background: tv(T.navBg, dark) }}>
            <div className="flex items-center justify-between p-5 transition-colors duration-300"
              style={{ borderBottom: `1px solid ${tv(T.border, dark)}` }}>
              <div className="flex items-center gap-2">
                <Filter size={16} style={{ color: tv(T.textPrimary, dark) }} />
                <h3 className="font-semibold transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>Filters</h3>
              </div>
              <button onClick={onClose} style={{ color: tv(T.textSecond, dark) }}><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 transition-colors duration-300"
                  style={{ color: tv(T.textPrimary, dark) }}>Category</h4>
                <div className="space-y-2">
                  {cats.map((c) => (
                    <label key={c} className="flex items-center gap-2.5 cursor-pointer">
                      <div onClick={() => toggleCat(c)}
                        className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                        style={{ background: selectedCats.includes(c) ? tv(T.btnBg, dark) : "transparent",
                          borderColor: selectedCats.includes(c) ? tv(T.btnBg, dark) : tv(T.border, dark) }}>
                        {selectedCats.includes(c) && <Check size={10} style={{ color: tv(T.btnText, dark) }} />}
                      </div>
                      <span className="text-sm transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 transition-colors duration-300"
                  style={{ color: tv(T.textPrimary, dark) }}>Price Range</h4>
                <input type="range" min={0} max={50000} value={priceRange}
                  onChange={(e) => setPriceRange(+e.target.value)}
                  className="w-full" style={{ accentColor: P.teal }} />
                <div className="flex justify-between text-xs mt-1 transition-colors duration-300"
                  style={{ color: tv(T.textSecond, dark) }}>
                  <span>₹0</span><span>{fmt(priceRange)}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 transition-colors duration-300"
                  style={{ color: tv(T.textPrimary, dark) }}>Minimum Rating</h4>
                <div className="space-y-1.5">
                  {[4, 3, 2, 1].map((r) => (
                    <button key={r} onClick={() => setSelectedRating(r)}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                      style={{ background: selectedRating === r ? tv(T.hoverBg, dark) : "transparent", color: tv(T.textSecond, dark) }}>
                      <Stars rating={r} /> <span>& above</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 transition-colors duration-300"
                  style={{ color: tv(T.textPrimary, dark) }}>Brands</h4>
                <div className="flex flex-wrap gap-2">
                  {["Nike", "Apple", "Sony", "Zara", "Levi's", "H&M", "Fossil", "Converse"].map((b) => (
                    <button key={b}
                      className="px-3 py-1 text-xs font-medium rounded-full border transition-colors duration-200"
                      style={{ borderColor: tv(T.border, dark), color: tv(T.textSecond, dark), background: "transparent" }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 flex gap-3 transition-colors duration-300"
              style={{ borderTop: `1px solid ${tv(T.border, dark)}` }}>
              <button onClick={() => { setSelectedCats([]); setSelectedRating(0); setPriceRange(50000); }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors duration-200"
                style={{ border: `1px solid ${tv(T.border, dark)}`, color: tv(T.textSecond, dark) }}>
                Clear All
              </button>
              <button onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{ background: tv(T.btnBg, dark), color: tv(T.btnText, dark) }}>
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Location Modal ───────────────────────────────────────────────────────────

function LocationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dark = useDark();
  const [city, setCity] = useState("New Delhi");
  const [pincode, setPincode] = useState("110001");

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div initial={{ scale: 0.94, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 24, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl w-[360px] p-6 shadow-2xl transition-colors duration-300"
            style={{ background: tv(T.navBg, dark) }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MapPin size={18} style={{ color: P.teal }} />
                <h3 className="font-semibold transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
                  Delivery Location
                </h3>
              </div>
              <button onClick={onClose} style={{ color: tv(T.textSecond, dark) }}><X size={18} /></button>
            </div>
            {[{ label: "City", val: city, set: setCity }, { label: "PIN Code", val: pincode, set: setPincode }].map(({ label, val, set }) => (
              <div key={label} className="mb-3">
                <label className="text-xs font-medium mb-1 block transition-colors duration-300"
                  style={{ color: tv(T.textSecond, dark) }}>{label}</label>
                <input value={val} onChange={(e) => set(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-300"
                  style={{ border: `1px solid ${tv(T.border, dark)}`, background: tv(T.inputBg, dark), color: tv(T.textPrimary, dark) }} />
              </div>
            ))}
            <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
              className="w-full mt-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{ background: tv(T.btnBg, dark), color: tv(T.btnText, dark) }}>
              Save Address
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Notification Panel ───────────────────────────────────────────────────────

const notifications = [
  { id: 1, title: "Order Shipped!", body: "Your Sony Headphones are on the way.", time: "2m ago", icon: Package },
  { id: 2, title: "Flash Sale — 40% Off", body: "Premium watches for next 2 hours only.", time: "15m ago", icon: Tag },
  { id: 3, title: "Abandoned Cart", body: "You left Nike Air Max in your cart.", time: "1h ago", icon: ShoppingCart },
];

function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dark = useDark();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-50" />
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.18 }}
            className="fixed top-16 right-6 w-[340px] rounded-2xl shadow-2xl z-50 overflow-hidden transition-colors duration-300"
            style={{ background: tv(T.navBg, dark), border: `1px solid ${tv(T.border, dark)}` }}>
            <div className="flex items-center justify-between px-4 py-3 transition-colors duration-300"
              style={{ borderBottom: `1px solid ${tv(T.border, dark)}` }}>
              <h4 className="font-semibold text-sm transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
                Notifications
              </h4>
              <button className="text-[10px] font-semibold" style={{ color: P.teal }}>Mark all read</button>
            </div>
            <div className="transition-colors duration-300" style={{ borderTop: `1px solid ${tv(T.border, dark)}` }}>
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div key={n.id} className="flex gap-3 p-4 cursor-pointer transition-colors duration-200"
                    style={{ borderBottom: `1px solid ${tv(T.border, dark)}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = tv(T.hoverBg, dark))}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                      style={{ background: tv(T.hoverBg, dark) }}>
                      <Icon size={15} style={{ color: tv(T.textPrimary, dark) }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>{n.title}</div>
                      <div className="text-[11px] mt-0.5 line-clamp-1 transition-colors duration-300" style={{ color: tv(T.textSecond, dark) }}>{n.body}</div>
                      <div className="text-[10px] mt-0.5 transition-colors duration-300" style={{ color: tv(T.textMuted, dark) }}>{n.time}</div>
                    </div>
                    <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: "#EB5E28" }} />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Voice Popup ──────────────────────────────────────────────────────────────

function VoicePopup({ open, transcript, listening, onClose }: {
  open: boolean; transcript: string; listening: boolean; onClose: () => void;
}) {
  const dark = useDark();

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: "spring", damping: 24, stiffness: 350 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[400px] rounded-2xl shadow-2xl z-40 p-5 transition-colors duration-300"
          style={{ background: tv(T.navBg, dark), border: `1px solid ${tv(T.border, dark)}` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${listening ? "animate-pulse" : ""}`}
                style={{ background: listening ? "#EB5E28" : "#CCC5B9" }} />
              <span className="text-xs font-semibold transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
                {listening ? "Listening..." : "Voice Command"}
              </span>
            </div>
            <button onClick={onClose} style={{ color: tv(T.textMuted, dark) }}><X size={16} /></button>
          </div>
          <div className="min-h-[48px] rounded-xl px-4 py-3 text-sm transition-colors duration-300"
            style={{ background: tv(T.inputBg, dark), color: tv(T.textPrimary, dark) }}>
            {transcript || (
              <span style={{ color: tv(T.textMuted, dark) }} className="italic">
                Say something like "Show shoes under 2000"
              </span>
            )}
          </div>
          {!listening && transcript && (
            <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: P.teal }}>
              <Check size={13} /> Command processed
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Bottom Dock ──────────────────────────────────────────────────────────────

function BottomDock({ onFilters, onCart, onWishlist, onVoiceTrain, cartCount, wishlistCount, listening, onMicClick }: {
  onFilters: () => void; onCart: () => void; onWishlist: () => void; onVoiceTrain: () => void;
  cartCount: number; wishlistCount: number; listening: boolean; onMicClick: () => void;
}) {
  const dark = useDark();

  const items = [
    { label: "Voice Train", icon: <Volume2 size={15} />, onClick: onVoiceTrain },
    { label: "Filters",     icon: <SlidersHorizontal size={15} />, onClick: onFilters },
    { label: "Cart",        icon: <ShoppingCart size={15} />, onClick: onCart,     badge: cartCount },
    { label: "Wishlist",    icon: <Heart size={15} />,        onClick: onWishlist, badge: wishlistCount },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 22, stiffness: 250, delay: 0.3 }}
        className="backdrop-blur-xl rounded-full shadow-2xl px-6 py-3 flex items-center gap-2 transition-colors duration-300"
        style={{ background: tv(T.dockBg, dark), border: `1px solid ${tv(T.dockBorder, dark)}` }}
      >
        {/* Left items */}
        {items.slice(0, 2).map((item, idx) => (
          <motion.button key={idx} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
            onClick={item.onClick}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors duration-200"
            style={{ color: tv(T.textSecond, dark) }}
            onMouseEnter={(e) => (e.currentTarget.style.background = tv(T.hoverBg, dark))}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            {item.icon}
            <span className="text-[10px] font-semibold tracking-wide whitespace-nowrap">{item.label}</span>
          </motion.button>
        ))}

        {/* Center MIC / ORB */}
        <div className="mx-3 relative flex items-center justify-center" style={{ width: 56, height: 56 }}>

          {/* Floating orb — rises above dock when listening */}
          <AnimatePresence>
            {listening && (
              <motion.button
                key="orb"
                onClick={onMicClick}
                initial={{ scale: 0, opacity: 0, y: 0 }}
                animate={{ scale: 1, opacity: 1, y: -90 }}
                exit={{ scale: 0, opacity: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                style={{
                  position: "absolute",
                  width: 110, height: 110,
                  borderRadius: "50%",
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "#060606",
                  filter: "drop-shadow(0 0 12px #ff3e1caa) drop-shadow(0 0 12px #1c8cffaa)",
                  zIndex: 50,
                }}
              >
                {/* Red star blob */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, ease: "linear", repeat: Infinity }}
                  style={{
                    position: "absolute",
                    left: "-120%", top: "-25%",
                    width: "160%", aspectRatio: "1",
                    borderRadius: "50%",
                    background: "#ff3e1c",
                    clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                  }}
                />
                {/* Blue cross blob */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                  style={{
                    position: "absolute",
                    right: "-120%", bottom: "-25%",
                    width: "160%", aspectRatio: "1",
                    borderRadius: "50%",
                    background: "#1c8cff",
                    clipPath: "polygon(20% 0%,0% 20%,30% 50%,0% 80%,20% 100%,50% 70%,80% 100%,100% 80%,70% 50%,100% 20%,80% 0%,50% 30%)",
                  }}
                />
                {/* Dark blurred core overlay */}
                <div style={{
                  position: "absolute", inset: "15%",
                  borderRadius: "50%",
                  background: "#060606",
                  filter: "blur(14px)",
                }} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Mic button — always in dock */}
          <motion.button
            onClick={onMicClick}
            whileTap={{ scale: 0.88 }}
            animate={{
              scale: listening ? 0.82 : 1,
              boxShadow: listening
                ? "0 0 0 3px #ff3e1c66, 0 0 16px #ff3e1c44"
                : "0 4px 20px rgba(0,0,0,0.25)",
            }}
            transition={{ duration: 0.3 }}
            className="rounded-full flex items-center justify-center"
            style={{
              width: 52, height: 52,
              background: listening ? "#0a0a0a" : tv(T.btnBg, dark),
              flexShrink: 0,
            }}
          >
            <Mic size={20} style={{ color: listening ? "#ff3e1c" : tv(T.btnText, dark) }} />
          </motion.button>
        </div>

        {/* Right items */}
        {items.slice(2).map((item, idx) => (
          <motion.button key={idx} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
            onClick={item.onClick}
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-colors duration-200"
            style={{ color: tv(T.textSecond, dark) }}
            onMouseEnter={(e) => (e.currentTarget.style.background = tv(T.hoverBg, dark))}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            {item.icon}
            {"badge" in item && item.badge! > 0 && (
              <span className="absolute top-1 left-6 w-3.5 h-3.5 text-white text-[8px] font-bold rounded-full flex items-center justify-center" style={{ background: "#EB5E28" }}>
                {item.badge}
              </span>
            )}
            <span className="text-[10px] font-semibold tracking-wide whitespace-nowrap">{item.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Search Results Panel ────────────────────────────────────────────────────

function SearchResults({ 
  open, query, onClose, onAddToCart, allProducts 
}: {
  open: boolean; query: string; onClose: () => void; onAddToCart: (p: Product) => void; allProducts: Product[];
}) {
  const dark = useDark();
  
  const filtered = query.trim() === "" 
    ? [] 
    : allProducts.filter((p) => {
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) 
          || p.brand.toLowerCase().includes(q)
          || p.category.toLowerCase().includes(q)
          || p.description.toLowerCase().includes(q);
      });

  return (
    <AnimatePresence>
      {open && query.trim() !== "" && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-45" />
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-[min(90vw,800px)] max-h-[60vh] rounded-2xl shadow-2xl z-50 overflow-hidden transition-colors duration-300 flex flex-col"
            style={{ background: tv(T.navBg, dark), border: `1px solid ${tv(T.cardBorder, dark)}` }}>
            
            {/* Header */}
            <div className="p-5 transition-colors duration-300"
              style={{ borderBottom: `1px solid ${tv(T.border, dark)}` }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
                    Search Results
                  </h3>
                  <p className="text-xs transition-colors duration-300" style={{ color: tv(T.textSecond, dark) }}>
                    Found {filtered.length} {filtered.length === 1 ? "product" : "products"}
                  </p>
                </div>
                <button onClick={onClose} style={{ color: tv(T.textSecond, dark) }}><X size={18} /></button>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-5">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <Search size={40} style={{ color: tv(T.border, dark) }} />
                  <p className="text-sm transition-colors duration-300" style={{ color: tv(T.textSecond, dark) }}>
                    No products match "{query}"
                  </p>
                  <p className="text-xs transition-colors duration-300" style={{ color: tv(T.textMuted, dark) }}>
                    Try searching for a different product or category
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={() => { onAddToCart(p); onClose(); }} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Footer Component ─────────────────────────────────────────────────────────

function Footer() {
  const dark = useDark();
  
  const footerSections = [
    {
      title: "Shop",
      links: ["Electronics", "Fashion", "Footwear", "Watches", "Bags", "Sports"]
    },
    {
      title: "Support",
      links: ["Contact Us", "FAQ", "Shipping Info", "Returns", "Track Order", "Warranty"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Press", "Sustainability", "Investors"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility", "Contact", "Sitemap"]
    }
  ];

  const socialLinks = [
    { icon: Facebook, link: "#", label: "Facebook" },
    { icon: Twitter, link: "#", label: "Twitter" },
    { icon: Instagram, link: "#", label: "Instagram" },
    { icon: Linkedin, link: "#", label: "LinkedIn" },
  ];

  const trustBadges = [
    { icon: Truck, label: "Free Shipping", desc: "On orders over ₹999" },
    { icon: Shield, label: "Secure Payment", desc: "100% protected transactions" },
    { icon: RotateCcw, label: "Easy Returns", desc: "30-day return policy" },
    { icon: Package, label: "Fast Delivery", desc: "2-3 days nationwide" },
  ];

  return (
    <footer className="transition-colors duration-300" style={{ background: tv(T.navBg, dark) }}>
      {/* Trust Badges Section */}
      <div className="border-b transition-colors duration-300" style={{ borderColor: tv(T.navBorder, dark) }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-4 p-4 rounded-lg transition-colors duration-300" 
                style={{ background: tv(T.mutedBg, dark) }}>
                <div style={{ color: tv(T.accent, dark) }}>
                  <badge.icon size={28} />
                </div>
                <div>
                  <div className="font-semibold text-sm transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
                    {badge.label}
                  </div>
                  <div className="text-xs transition-colors duration-300" style={{ color: tv(T.textMuted, dark) }}>
                    {badge.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b transition-colors duration-300" style={{ borderColor: tv(T.navBorder, dark) }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2 transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
                Subscribe to Our Newsletter
              </h3>
              <p className="text-sm transition-colors duration-300" style={{ color: tv(T.textMuted, dark) }}>
                Get exclusive deals, new arrivals & special offers directly to your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input type="email" placeholder="Enter your email"
                className="flex-1 md:flex-none px-4 py-2.5 rounded-lg transition-colors duration-300 outline-none"
                style={{
                  background: tv(T.inputBg, dark),
                  color: tv(T.textPrimary, dark),
                  borderColor: tv(T.inputBorder, dark),
                  border: `1px solid ${tv(T.inputBorder, dark)}`
                }}
              />
              <button className="px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 hover:shadow-lg"
                style={{ background: tv(T.accent, dark), color: tv(T.accentText, dark) }}>
                Subscribe
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
              <span style={{ color: tv(T.accent, dark) }}>V</span>ANI
            </h2>
            <p className="text-sm mb-6 transition-colors duration-300" style={{ color: tv(T.textMuted, dark) }}>
              Your ultimate destination for premium products, fast delivery, and exceptional customer service.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, link, label }) => (
                <a key={label} href={link}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: tv(T.mutedBg, dark),
                    color: tv(T.accent, dark)
                  }}
                  aria-label={label}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-all duration-200 hover:translate-x-1 inline-block"
                      style={{ color: tv(T.textMuted, dark) }}
                      onMouseEnter={(e) => e.currentTarget.style.color = tv(T.accent, dark)}
                      onMouseLeave={(e) => e.currentTarget.style.color = tv(T.textMuted, dark)}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="border-t transition-colors duration-300 pt-8 mb-8" style={{ borderColor: tv(T.navBorder, dark) }}>
          <h4 className="font-semibold mb-4 transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
            Get In Touch
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="tel:+91-1234567890" className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:opacity-80"
              style={{ background: tv(T.mutedBg, dark) }}>
              <Phone size={20} style={{ color: tv(T.accent, dark) }} />
              <div>
                <div className="text-xs transition-colors duration-300" style={{ color: tv(T.textMuted, dark) }}>
                  Call Us
                </div>
                <div className="font-semibold text-sm transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
                  +91-1234567890
                </div>
              </div>
            </a>
            <a href="mailto:support@vani.com" className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:opacity-80"
              style={{ background: tv(T.mutedBg, dark) }}>
              <Mail size={20} style={{ color: tv(T.accent, dark) }} />
              <div>
                <div className="text-xs transition-colors duration-300" style={{ color: tv(T.textMuted, dark) }}>
                  Email Us
                </div>
                <div className="font-semibold text-sm transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
                  support@vani.com
                </div>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:opacity-80"
              style={{ background: tv(T.mutedBg, dark) }}>
              <LocationIcon size={20} style={{ color: tv(T.accent, dark) }} />
              <div>
                <div className="text-xs transition-colors duration-300" style={{ color: tv(T.textMuted, dark) }}>
                  Visit Us
                </div>
                <div className="font-semibold text-sm transition-colors duration-300" style={{ color: tv(T.textPrimary, dark) }}>
                  123 Market St, City
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t transition-colors duration-300 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: tv(T.navBorder, dark) }}>
          <p className="text-sm transition-colors duration-300" style={{ color: tv(T.textMuted, dark) }}>
          
          </p>
          <div className="flex gap-4">
            
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const recognitionRef = useRef<any>(null);
  const { addItem, count, wishlist } = useCart();

  // Combine all products for searching
  const allProducts = [...heroProducts, ...recommendedProducts, ...recentlyViewed];

  // Get suggestions - top 6 matching products while typing
  const suggestions = search.trim() === ""
    ? []
    : allProducts.filter((p) => {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) 
          || p.brand.toLowerCase().includes(q)
          || p.category.toLowerCase().includes(q)
          || p.description.toLowerCase().includes(q);
      }).slice(0, 6);

  const handleSearchSubmit = () => {
    if (search.trim()) {
      setSubmittedSearch(search);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setTranscript("Voice recognition not supported."); setVoiceOpen(true); return; }
    const r = new SR();
    r.lang = "en-IN"; r.continuous = false; r.interimResults = true;
    r.onstart = () => { setListening(true); setVoiceOpen(true); setTranscript(""); };
    r.onresult = (e: any) => setTranscript(Array.from(e.results).map((x: any) => x[0].transcript).join(""));
    r.onend = () => setListening(false);
    r.onerror = () => { setListening(false); setTranscript("Could not understand. Please try again."); };
    recognitionRef.current = r;
    r.start();
  }, []);

  const stopListening = useCallback(() => { recognitionRef.current?.stop(); setListening(false); }, []);
  const handleMicClick = () => listening ? stopListening() : startListening();

  return (
    <DarkCtx.Provider value={dark}>
      <div className="min-h-screen transition-colors duration-300"
        style={{ background: tv(T.pageBg, dark), fontFamily: "Inter, sans-serif" }}>
        <Navbar
          onLocationOpen={() => setLocationOpen(true)}
          onNotifOpen={() => setNotifOpen(!notifOpen)}
          onVoiceClick={handleMicClick}
          onToggleDark={() => setDark((d) => !d)}
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
          suggestions={suggestions}
        />

        <main className="pb-32">
          <HeroCarousel onAddToCart={addItem} />
          <RecommendedSection onAddToCart={addItem} />
          <RecentlyViewedSection onAddToCart={addItem} />
        </main>

        <Footer />

        <BottomDock
          onFilters={() => setFiltersOpen(true)}
          onCart={() => setCartOpen(true)}
          onWishlist={() => {}}
          onVoiceTrain={() => setVoiceOpen(true)}
          cartCount={count()}
          wishlistCount={wishlist.length}
          listening={listening}
          onMicClick={handleMicClick}
        />

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        <FiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} />
        <LocationModal open={locationOpen} onClose={() => setLocationOpen(false)} />
        <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        <VoicePopup open={voiceOpen} transcript={transcript} listening={listening} onClose={() => setVoiceOpen(false)} />
        <SearchResults 
          open={submittedSearch.trim() !== ""} 
          query={submittedSearch} 
          onClose={() => setSubmittedSearch("")} 
          onAddToCart={addItem}
          allProducts={allProducts}
        />
      </div>
    </DarkCtx.Provider>
  );
}
