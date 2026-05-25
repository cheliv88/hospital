// src/pages/AdmisionHome.jsx
import { TopBar } from '../components/TopBar';

export const AdmisionHome = () => {
  return (
    <div className="h-full flex flex-col">
      <TopBar title="Gestión de Admisión" showButtons={false} />
      
      <div className="flex-1 bg-gradient-to-br from-[#e8dceb] to-[#efe6f2] rounded-2xl shadow-sm border border-white/60 p-5 overflow-y-auto flex items-center justify-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm p-8 text-center max-w-md">
           <p className="text-[#6b4c6b] font-bold text-lg">
             Seleccione una opción del menú de la izquierda para cargar el módulo correspondiente.
           </p>
        </div>
      </div>
    </div>
  );
};