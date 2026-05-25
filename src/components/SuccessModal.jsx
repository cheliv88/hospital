import { FaCheckCircle, FaPrint, FaCalendarAlt, FaUserMd, FaClock } from 'react-icons/fa';

export const SuccessModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 transform animate-in zoom-in-95 duration-300">
        
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 flex flex-col items-center text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce">
            <FaCheckCircle className="text-5xl text-white" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-center">¡Turno Agendado!</h2>
          <p className="text-emerald-50 text-sm font-bold uppercase tracking-widest mt-1">Operación Exitosa</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                <FaCalendarAlt size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Paciente</p>
                <p className="text-sm font-bold text-gray-700">{data.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                <FaUserMd size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Fecha y Hora</p>
                <p className="text-sm font-bold text-gray-700">
                  {new Date(data.start).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-xs text-gray-500 font-semibold italic">A las {data.start.split('T')[1].substring(0,5)} hs</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white font-black py-4 rounded-2xl hover:bg-gray-700 transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              <FaPrint /> IMPRIMIR COMPROBANTE
            </button>
            
            <button 
              onClick={onClose}
              className="w-full text-emerald-600 font-black py-3 rounded-2xl hover:bg-emerald-50 transition-all"
            >
              LISTO, CONTINUAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};