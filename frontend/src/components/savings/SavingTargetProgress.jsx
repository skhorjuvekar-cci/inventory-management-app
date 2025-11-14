export default function SavingTargetProgress({ title, saved, target }) {
  const progressPercent = Math.min((saved / target) * 100, 100);
  const isComplete = saved >= target;

  return (
    <div className="mb-6 group">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-white font-semibold text-lg">{title}</h4>
        <span className={`text-sm font-bold px-3 py-1 rounded-full transition-colors duration-300 ${
          isComplete 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-blue-500/20 text-blue-400'
        }`}>
          {progressPercent.toFixed(1)}%
        </span>
      </div>
      
      <div className="relative bg-gray-700/50 rounded-full h-8 w-full overflow-hidden shadow-inner">
        <div
          className={`h-8 rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
            isComplete 
              ? 'bg-gradient-to-r from-green-500 to-green-400' 
              : 'bg-gradient-to-r from-blue-500 to-cyan-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
        
        {/* Shimmer effect */}
        <div 
          className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
          style={{ 
            width: `${progressPercent}%`,
            animation: 'shimmer 2s infinite'
          }}
        ></div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <p className="text-gray-300 text-sm">
          <span className="font-semibold text-white">Rs. {saved.toLocaleString()}</span>
          <span className="text-gray-500 mx-1">/</span>
          <span className="text-gray-400">Rs. {target.toLocaleString()}</span>
        </p>
        {isComplete && (
          <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
            ✓ Completed
          </span>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}