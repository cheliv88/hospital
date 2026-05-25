// src/components/SearchModal.jsx
import { useState } from 'react';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export const SearchModal = ({ 
  isOpen, 
  onClose, 
  onSearchData, 
  onSelectRecord, 
  columns, 
  title = "Buscar" 
}) => {
  const [searchType, setSearchType] = useState('cualquiera');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const location = useLocation();

  if (!isOpen) return null;

  const isHistoriaClinica = location.pathname.includes('/historia-clinica');

  const headerColor = isHistoriaClinica 
    ? 'bg-gradient-to-r from-[#e67300] to-[#cc6600]' 
    : 'bg-gradient-to-r from-[#a370a3] to-[#7a4b7a]';

  const btnColor = isHistoriaClinica
    ? 'from-[#e67300] to-[#cc6600] hover:from-[#cc6600] hover:to-[#b35900]'
    : 'from-[#a370a3] to-[#8e5c8e] hover:from-[#8e5c8e] hover:to-[#7a4b7a]';

  const textColor = isHistoriaClinica ? 'text-[#e67300]' : 'text-[#a370a3]';
  const hoverRowColor = isHistoriaClinica ? 'hover:bg-[#e67300]/10' : 'hover:bg-[#a370a3]/10';
  const hoverTextColor = isHistoriaClinica ? 'group-hover:text-[#e67300]' : 'group-hover:text-[#a370a3]';

  const focusInputClass = isHistoriaClinica
    ? 'focus:ring-[#e67300]/20 focus:border-[#e67300]'
    : 'focus:ring-[#a370a3]/20 focus:border-[#a370a3]';

  const inputClass = `w-full px-4 py-2.5 text-[14px] rounded-xl border-2 border-[#e0d4e3] bg-white text-[#2d1b2d] font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${focusInputClass}`;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const data = await onSearchData(searchType, searchValue);
      setResults(data || []);
    } catch (error) {
      console.error(error);
      alert("Error al buscar datos.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    setSearchValue('');
    setResults([]);
    setHasSearched(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/20 animate-fade-in-up">
        
        <div className={`${headerColor} p-5 flex justify-between items-center text-white shrink-0 shadow-md relative z-10`}>
          <h3 className="text-lg font-black flex items-center gap-2 tracking-wide drop-shadow-sm">
            <FaSearch /> {title}
          </h3>
          <button onClick={handleClose} className="hover:text-white/70 hover:rotate-90 transition-all duration-300">
            <FaTimes size={20}/>
          </button>
        </div>

        <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 shrink-0">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end max-w-3xl mx-auto">
            
            <div className="flex flex-col w-full md:w-1/3">
              <label className="text-[12px] font-extrabold text-[#5c3c5c] uppercase tracking-wider mb-1.5 ml-1">Buscar por</label>
              <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className={inputClass}>
                <option value="cualquiera">Cualquiera</option>
                <option value="documento">Documento</option>
                <option value="nombre">Nombre / Apellido</option>
                <option value="historiaClinica">Historia Clínica</option>
              </select>
            </div>

            <div className="flex flex-col w-full md:w-2/3">
              <label className="text-[12px] font-extrabold text-[#5c3c5c] uppercase tracking-wider mb-1.5 ml-1">Dato a buscar</label>
              <input autoFocus type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className={inputClass} placeholder="Ej: 33514121 o Perez..." />
            </div>

            <button type="submit" disabled={isSearching} className={`w-full md:w-auto bg-gradient-to-r ${btnColor} text-white font-bold py-2.5 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 h-[46px]`}>
              {isSearching ? <FaSpinner className="animate-spin" /> : "Buscar"}
            </button>
            
          </form>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-gray-50/50">
          {isSearching ? (
            <div className={`flex flex-col justify-center items-center h-40 ${textColor} gap-3`}>
              <FaSpinner className="animate-spin text-3xl" />
              <span className="font-bold text-sm uppercase tracking-widest">Buscando...</span>
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className="flex justify-center items-center h-40 text-gray-500 font-medium bg-white rounded-2xl border border-dashed border-gray-300">
              No se encontraron resultados para "{searchValue}".
            </div>
          ) : results.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-50 text-[#5c3c5c]">
                  <tr>
                    {columns.map((col, index) => (
                      <th key={index} className="p-3.5 font-black uppercase tracking-wider text-[11px] border-b border-gray-200">{col.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((row, rowIndex) => (
                    <tr 
                      key={rowIndex} 
                      onClick={() => onSelectRecord(row)} 
                      className={`${hoverRowColor} cursor-pointer transition-colors group`}
                    >
                      {columns.map((col, colIndex) => (
                        <td key={colIndex} className={`p-3.5 text-[#2d1b2d] font-medium ${hoverTextColor} transition-colors`}>
                          {row[col.key] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40 text-gray-400 font-medium text-sm bg-white rounded-2xl border border-dashed border-gray-200">
              Ingrese un dato y presione Buscar para ver los resultados.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};