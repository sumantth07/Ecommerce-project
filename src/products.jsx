import { supabase } from "./supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./misc";
import { useCart } from "./cartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setloading] = useState(false);
  const [toast, setToast] = useState({ show: false, product: null });
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setloading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .range(0, 500);
        if (error) throw error;
        setProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };
    fetchProducts();
  }, []);

  const uniqueCategories = ["All", ...new Set(products.map((item) => item.category))];

  const filteredProducts = products.filter((item) => {
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
    const searchMatch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleSearchSubmit = () => { setSearchQuery(inputValue); setCurrentPage(1); };
  const handleClearSearch = () => { setInputValue(""); setSearchQuery(""); setCurrentPage(1); };
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearchSubmit(); };
  const handleCategoryChange = (category) => { setSelectedCategory(category); setCurrentPage(1); };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // prevent navigating to detail page
    addToCart(product);
    setToast({ show: true, product: product.name });
    setTimeout(() => setToast({ show: false, product: null }), 2500);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Our Products</h2>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-grow md:w-72">
              <input
                type="text"
                placeholder="Search products..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
              />
              {inputValue && (
                <button onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold">✕</button>
              )}
            </div>
            <button onClick={handleSearchSubmit} className="bg-black text-white px-5 py-2 rounded-md text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm">
              Search
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {uniqueCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                selectedCategory === category
                  ? "bg-gray-900 text-white border-gray-900 shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="min-h-[50vh]">
          {loading ? (
            <div className="flex justify-center py-20"><Loader /></div>
          ) : currentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500 max-w-sm mt-1 mb-6">We couldn't find anything matching "{searchQuery}".</p>
              <button
                onClick={() => { handleClearSearch(); setSelectedCategory("All"); }}
                className="text-sm font-semibold text-black underline hover:text-gray-600"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {currentProducts.map((product) => (
                // ✅ Whole card is now clickable — navigates to detail page
                <div
                  key={product.id}
                  className="group relative cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {/* Image */}
                  <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-auto lg:h-80">
                    <img
                      alt={product.name}
                      src={product.image ? product.image.replace(/"/g, "") : ""}
                      className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-200"
                    />
                  </div>

                  {/* Details */}
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">{product.name.slice(0, 20)}</h3>
                      <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                      {product.rating && (
                        <p className="mt-1 text-xs text-amber-500 font-semibold">⭐ {product.rating}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${product.price}</p>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="relative z-10 mt-1 bg-white hover:bg-gray-100 text-black text-xs font-bold tracking-wide px-2 py-2 rounded-md transition-colors duration-200 shadow-sm cursor-pointer border border-gray-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredProducts.length > itemsPerPage && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >← Prev</button>

            <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-md font-medium text-sm transition-all duration-200 flex-shrink-0 ${currentPage === page ? "bg-gray-900 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >{page}</button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >Next →</button>
          </div>
        )}

        {/* Page Info */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
          </div>
        )}
      </div>

      {/* Toast */}
      <div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ease-out ${toast.show ? "translate-y-0 opacity-100 scale-100" : "translate-y-full opacity-0 scale-95 pointer-events-none"}`}>
        <div className="bg-green-600 text-white rounded-lg shadow-xl p-4 flex items-center gap-3 min-w-72">
          <svg className="h-6 w-6 text-white animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="font-bold text-sm">Added to cart! ✨</p>
            <p className="text-xs text-green-100">{toast.product?.slice(0, 30)}{toast.product?.length > 30 ? "..." : ""}</p>
          </div>
          <button onClick={() => setToast({ show: false, product: null })} className="text-white hover:text-green-100">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}