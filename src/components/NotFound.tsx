import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#040d1e] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-xl">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <SearchX className="w-10 h-10 text-cyan-400" />
        </div>

        {/* 404 */}
        <h1 className="text-[110px] sm:text-[140px] leading-none font-black tracking-tighter">
          <span className="bg-linear-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent">
            404
          </span>
        </h1>

        <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
          Page Not Found
        </h2>

        <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
          Oops! The page you're looking for doesn't exist, has been moved, or
          might have been removed.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] hover:shadow-cyan-500/30 transition-all duration-300"
          >
            <Home size={18} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
