import { FaSearch, FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export const TopBar = ({ 
  title, 
  showButtons = true, 
  onSearch, 
  onNew, 
  onSave, 
  onDelete 
}) => {
  const location = useLocation();
  
  let bgBarra = '#b882b8'; 
  let colorBoton = '#7a4b7a'; 

  if (location.pathname.includes('/historia-clinica')) {
    bgBarra = '#ff8c1a'; 
    colorBoton = '#cc6600'; 
  }

  return (
    <div 
      className="rounded-3xl p-4 shadow-sm flex flex-wrap justify-between items-center shrink-0 gap-4 mb-4 transition-colors duration-300 border border-white/40"
      style={{ backgroundColor: bgBarra }}
    >
      <div className="flex items-center gap-4 pl-2">
        <h1 className="text-2xl font-black tracking-tighter text-white drop-shadow-md">
          {title}
        </h1>
      </div>

      {showButtons && (
        <div className="flex flex-wrap items-center gap-3">
          
          <button 
            onClick={onSearch} 
            className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            style={{ backgroundColor: colorBoton }}
          >
            <FaSearch /> Buscar Persona
          </button>
          
          <div className="w-px h-6 mx-1 bg-white/40 rounded-full"></div>
          
          <button 
            onClick={onNew} 
            className="flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            style={{ color: colorBoton }}
          >
            <FaPlus /> Nuevo
          </button>
          
          <button 
            onClick={onSave} 
            className="flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            style={{ color: colorBoton }}
          >
            <FaSave /> Guardar
          </button>
          
          <button 
            onClick={onDelete} 
            className="flex items-center gap-2 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 ml-1"
            style={{ color: colorBoton }}
          >
            <FaTrash /> Eliminar
          </button>
          
        </div>
      )}
    </div>
  );
};