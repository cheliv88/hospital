import { FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

export const ErrorModal = ({ isOpen, onClose, errorMessage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 transform animate-in zoom-in-95 duration-300">
        
        <div className="bg-gradient-to-br from-rose-500 to-red-600 p-8 flex flex-col items-center text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="bg-white/20 p-4 rounded-full mb-4 animate-pulse">
            <FaTimesCircle className="text-5xl text-white" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-center">¡Atención!</h2>
          <p className="text-rose-100 text-sm font-bold uppercase tracking-widest mt-1">No se pudo agendar</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100 flex items-start gap-4">
            <div className="bg-rose-100 p-2.5 rounded-xl text-rose-600 shrink-0 mt-1">
              <FaExclamationTriangle size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-wider mb-1">Motivo del rechazo</p>
              <p className="text-sm font-bold text-gray-700 leading-snug">
                {errorMessage || "Ocurrió un error inesperado al intentar comunicarse con el servidor."}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={onClose}
              className="w-full text-white bg-gray-800 font-black py-4 rounded-2xl hover:bg-gray-700 transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              ENTENDIDO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};