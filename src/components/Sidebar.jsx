// src/components/Sidebar.jsx
import { useEffect } from 'react';
import { FaTh, FaPowerOff, FaChevronRight, FaCircle, FaUserNurse, FaNotesMedical, FaClipboardList, FaUsers, FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, checkSession } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!checkSession()) {
        navigate('/');
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [checkSession, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  let moduleName = 'Módulo';
  let baseColor = '#4b5563'; 
  let moduleIcon = <FaTh />;
  let menuItems = [];

  if (location.pathname.startsWith('/historia-clinica')) {
    moduleName = 'Consultorios';
    baseColor = '#e67300';
    moduleIcon = <FaNotesMedical />;
    menuItems = [
      { title: 'Historia Clinica', path: '/historia-clinica', icon: <FaNotesMedical /> },
      { title: 'Protocolos', path: '/historia-clinica/protocolos', icon: <FaClipboardList /> },
      { title: 'Listado Pacientes', path: '/historia-clinica/pacientes', icon: <FaUsers /> },
    ];
  } 
  else if (location.pathname.startsWith('/admision')) {
    moduleName = 'Admisión';
    baseColor = '#a370a3'; // Violeta
    moduleIcon = <FaUserNurse />;
    menuItems = [
      { title: 'Inicio', path: '/admision', icon: <FaUserNurse /> },
      { title: 'Personas', path: '/admision/personas', icon: <FaUsers /> },
      { title: 'Consultas', path: '/admision/consultas', icon: <FaClipboardList /> },
      { 
        title: 'Turnos', 
        icon: <FaCalendarAlt />,
        subItems: [
          { title: 'Gestión de Turnos', path: '/admision/turnos' },
          { title: 'Agenda', path: '/admision/agenda' }
        ]
      },
      { title: 'ABM Empresa', path: '/admision/empresas', icon: <FaBuilding /> },
    ];
  }

  return (
    <aside 
      className="w-72 flex flex-col h-screen shadow-[10px_0_30px_rgba(0,0,0,0.3)] flex-none relative text-white z-50 transition-colors duration-500"
      style={{
        background: `linear-gradient(135deg, ${baseColor}dd, ${baseColor}, #1a0d1a)`
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
      </div>
      
      <div className="p-6 relative z-10 border-b border-white/10">
        <h2 className="text-2xl font-black tracking-tighter mb-4 flex items-center gap-2 drop-shadow-md text-white">
          <span className="bg-white p-2 rounded-xl shadow-lg transition-colors duration-500" style={{ color: baseColor }}>
            {moduleIcon}
          </span>
          {moduleName}
        </h2>
        <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/20 shadow-inner">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-lg shadow-md transition-colors duration-500" style={{ color: baseColor }}>
            E
          </div>
          <div>
            <p className="text-xs font-extrabold tracking-wide">ECHELI</p>
            <p className="text-[10px] text-white/70 font-medium">Atención: Hospital</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 relative z-10">
        <ul className="space-y-2 px-4">
          {menuItems.map((item, index) => {
            const hasSubmenu = item.subItems && item.subItems.length > 0;
            const isParentActive = location.pathname === item.path || 
                                  (hasSubmenu && item.subItems.some(sub => location.pathname === sub.path));

            return (
              <li key={index} className="flex flex-col relative group">
                <button 
                  onClick={() => {
                    if (!hasSubmenu && item.path) {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 border-l-4
                    ${isParentActive ? 'bg-white/20 shadow-md' : 'hover:bg-white/10'}
                  `}
                  style={{ borderLeftColor: isParentActive ? '#ffffff' : 'transparent' }}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg transition-colors ${isParentActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                      {item.icon}
                    </span>
                    <span className={`text-sm font-bold tracking-wide ${isParentActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                      {item.title}
                    </span>
                  </div>
                  
                  {hasSubmenu && (
                    <span className="text-xs opacity-70 group-hover:translate-x-1 group-hover:opacity-100 transition-transform duration-300">
                      <FaChevronRight />
                    </span>
                  )}
                </button>

                {hasSubmenu && (
                  <div className="absolute left-[102%] top-0 w-64 invisible opacity-0 -translate-x-4 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-[100] pl-2">
                    <div 
                      className="backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 relative"
                      style={{ background: `linear-gradient(135deg, ${baseColor}f0, #1a0d1af0)` }}
                    >
                      <div 
                        className="absolute top-5 -left-2 w-4 h-4 border-l border-b border-white/20 rotate-45"
                        style={{ backgroundColor: baseColor }}
                      ></div>

                      <ul className="space-y-1 relative z-10">
                        {item.subItems.map((sub, subIndex) => {
                          const isSubActive = location.pathname === sub.path;
                          return (
                            <li key={subIndex}>
                              <button
                                onClick={() => {
                                  if (sub.path) navigate(sub.path);
                                }}
                                className={`w-full flex items-center gap-3 text-left px-4 py-3 text-xs font-bold rounded-xl transition-all duration-300 transform-gpu
                                  ${isSubActive 
                                    ? 'text-white bg-white/25 shadow-sm' 
                                    : 'text-white/70 hover:text-white hover:bg-white/30 hover:translate-x-1.5 hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)]'
                                  }
                                `}
                              >
                                <FaCircle className={`text-[6px] transition-all ${isSubActive ? 'opacity-100 scale-125' : 'opacity-40'}`} />
                                {sub.title}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 relative z-10 border-t border-white/10">
        <div className="bg-black/10 rounded-xl p-1.5 backdrop-blur-sm border border-white/10 space-y-1">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all font-bold text-xs">
            <FaTh className="text-base opacity-70" /> Volver al Menu
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-[#ff9999] hover:text-white hover:bg-red-500/30 rounded-lg transition-all font-bold text-xs">
            <FaPowerOff className="text-base opacity-70" /> Cerrar Sesion
          </button>
        </div>
      </div>
    </aside>
  );
};