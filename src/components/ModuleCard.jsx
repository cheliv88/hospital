export const ModuleCard = ({ title, icon, color, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-5 border border-white/30 group relative overflow-hidden min-h-[120px] lg:h-full"
      style={{
        background: `radial-gradient(circle at top left, rgba(255,255,255,0.25) 0%, ${color} 60%, ${color}dd 100%)`,
        boxShadow: `0 8px 25px -5px ${color}60`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 25px 3px ${color}80, inset 0 0 15px rgba(255,255,255,0.2)`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 25px -5px ${color}60`;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div 
        className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
          animation: 'shimmer 12s infinite linear',
        }}
      ></div>

      <div className="relative z-10 flex flex-col items-center gap-2 w-full h-full">
        {/* Ícono con resplandor suavizado */}
        <div className="text-3xl sm:text-4xl lg:text-5xl text-white transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] flex-shrink-0">
          {icon} 
        </div>

        <span className="text-white font-black text-sm lg:text-base text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] mt-auto w-full break-words whitespace-normal">
          {title}
        </span>
      </div>

      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>
    </div>
  );
};