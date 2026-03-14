import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useCart } from "./cartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  // Inject Google Fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        setProduct(data);
        setSelectedImage(data.image?.replace(/"/g, "") || "");
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const getMoreImages = () => {
    if (!product?.more_images) return [];
    try {
      const imgs = typeof product.more_images === "string"
        ? JSON.parse(product.more_images)
        : product.more_images;
      return Array.isArray(imgs) ? imgs.map(i => i.replace(/"/g, "")) : [];
    } catch { return []; }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} className={`w-3.5 h-3.5 ${i < full ? "text-amber-400" : i === full && half ? "text-amber-300" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] text-center px-4">
        <div>
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-gray-400 text-sm mb-2">Product not found</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-3xl font-bold text-gray-900 mb-6">Oops, this item doesn't exist</h2>
          <button onClick={() => navigate("/homepage")} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const moreImages = getMoreImages();
  const allImages = [product.image?.replace(/"/g, ""), ...moreImages].filter(Boolean);
  const shortDesc = product.description?.slice(0, 180);
  const hasLongDesc = product.description?.length > 180;

  return (
    <>
      <style>{`
        .product-detail * { font-family: 'DM Sans', sans-serif; }
        .product-title { font-family: 'Cormorant Garamond', serif; }
        .thumb-btn { transition: all 0.2s ease; }
        .thumb-btn:hover { transform: scale(1.05); }
        .main-img { transition: opacity 0.25s ease; }
        .add-btn { transition: all 0.2s ease; }
        .add-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .add-btn:active { transform: translateY(0); }
      `}</style>

      <div className="product-detail bg-[#fafaf9] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Back */}
          <button
            onClick={() => navigate("/homepage")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-900 mb-8 transition-colors uppercase tracking-widest"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

            {/* ── LEFT: Images ── */}
            <div className="space-y-3">
              {/* Main image */}
              <div className="aspect-square w-full rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="main-img w-full h-full object-cover object-center"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600")}
                />
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`thumb-btn flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 ${
                        selectedImage === img
                          ? "border-gray-900 shadow-sm"
                          : "border-transparent opacity-50 hover:opacity-80"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/56")} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="flex flex-col gap-5">

              {/* Tags row */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.category && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[11px] font-semibold rounded-full uppercase tracking-widest">
                    {product.category}
                  </span>
                )}
                {product.brand && (
                  <span className="px-3 py-1 bg-gray-900 text-white text-[11px] font-semibold rounded-full uppercase tracking-widest">
                    {product.brand}
                  </span>
                )}
                {product.available !== null && (
                  <span className={`px-3 py-1 text-[11px] font-semibold rounded-full uppercase tracking-widest ${product.available ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                    {product.available ? "In Stock" : "Out of Stock"}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="product-title text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  {renderStars(product.rating)}
                  <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                  {product.review_count && (
                    <span className="text-xs text-gray-400">· {product.review_count.toLocaleString()} reviews</span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900 tracking-tight">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Description — truncated */}
              <div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {descExpanded ? product.description : shortDesc}
                  {hasLongDesc && !descExpanded && "..."}
                </p>
                {hasLongDesc && (
                  <button
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="mt-1.5 text-xs font-semibold text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors"
                  >
                    {descExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </div>

              {/* Seller */}
              {product.seller && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-gray-100">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Sold by</p>
                    <p className="text-xs font-semibold text-gray-800">{product.seller}</p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={product.available === false}
                  className="add-btn flex-1 py-3.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-2xl text-sm"
                >
                  {product.available === false ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="add-btn px-5 py-3.5 border border-gray-200 bg-white text-gray-800 font-semibold rounded-2xl hover:border-gray-400 text-sm"
                >
                  View Cart
                </button>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: "Brand", value: product.brand },
                  { label: "Category", value: product.category },
                  { label: "Reviews", value: product.review_count?.toLocaleString() },
                  { label: "Listed", value: product.created_at ? new Date(product.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : null },
                ].filter(m => m.value).map((meta) => (
                  <div key={meta.label} className="bg-white rounded-xl px-4 py-3 border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">{meta.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{meta.value}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out ${toast ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"}`}>
        <div className="bg-gray-900 text-white rounded-2xl shadow-2xl px-5 py-3.5 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold">Added to cart</p>
            <p className="text-xs text-gray-400">{product.name?.slice(0, 28)}{product.name?.length > 28 ? "..." : ""}</p>
          </div>
        </div>
      </div>
    </>
  );
}