import { useState } from 'react';
import { FaTimes, FaLock, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const LoginModal = ({ isOpen, onClose, moduleName, themeColor }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();

  if (!isOpen) return null;

 const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(username, password);

    if (success) {
      const path = moduleName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
      navigate(`/${path}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
        
        <div 
          className="p-8 text-white relative overflow-hidden"
          style={{ backgroundColor: themeColor }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 text-white/80 hover:text-white transition-transform hover:rotate-90"
          >
            <FaTimes className="text-xl" />
          </button>
          
          <h2 className="text-3xl font-black tracking-tighter mb-1">Acceso</h2>
          <p className="text-white/90 text-sm font-bold uppercase tracking-widest">
            Módulo: {moduleName}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-black uppercase tracking-wider rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Usuario</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all font-bold text-gray-700"
                  style={{ '--tw-ring-color': themeColor }}
                  placeholder="USUARIO"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Contraseña</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-opacity-50 outline-none transition-all font-bold text-gray-700"
                  style={{ '--tw-ring-color': themeColor }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full text-white font-black py-4 rounded-2xl shadow-lg transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0"
              style={{ 
                backgroundColor: themeColor,
                boxShadow: `0 10px 20px -5px ${themeColor}66`
              }}
            >
              {isLoading ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};