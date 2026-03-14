import { useNavigate } from "react-router-dom";

export default function WishList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4">
      <div className="text-center max-w-md w-full">

        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full mb-5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-600"></span>
          </span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">In Progress</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
          Coming Soon 
        </h1>

        {/* Subtext */}
        <p className="text-sm text-gray-400 leading-relaxed mb-8">
          We're working hard on this feature. <br />
          Check back soon!
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-8" />

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150"
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate("/homepage")}
            className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-all duration-150 shadow-sm"
          >
            Back to Shop
          </button>
        </div>

      </div>
    </div>
  );
}