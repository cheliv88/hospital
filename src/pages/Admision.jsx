// src/layouts/MainLayout.jsx
import { Sidebar } from '../components/Sidebar';
import { FaUsers, FaCalendarAlt, FaBuilding, FaNotesMedical, FaCogs } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  const menusAdmision = [
    { title: 'ABM Personas', icon: <FaUsers />, path: '/admision/personas' }, // <-- Navega a esta ruta
    { 
      title: 'Turnos', 
      icon: <FaCalendarAlt />,
      subItems: [
        { title: 'Dar Turnos' },
        { title: 'ABM Feriados' },
        { title: 'ABM Días Excepcionales' },
        { title: 'ABM Horarios Consultorio' },
        { title: 'ABM Motivos Anulación' },
        { title: 'Imprimir Turnos' },
        { title: 'Imprimir Listado Cabos' },
      ]
    },
    { title: 'ABM Empresas', icon: <FaBuilding /> },
    { title: 'Consultas', icon: <FaNotesMedical />, path: '/admision/consultas' },
    { title: 'Configuraciones', icon: <FaCogs /> },
  ];

  return (
    <div className="flex h-screen bg-[#f5f1f7] font-sans overflow-hidden">
      <Sidebar 
        moduleName="Admisión" 
        moduleIcon={<FaNotesMedical />} 
        menuItems={menusAdmision} 
        baseColor="#a370a3" 
      />

      <main className="flex-1 p-6 lg:p-8 overflow-hidden flex flex-col gap-6 relative">
        <div className="bg-[#d4c3d9] rounded-3xl p-6 lg:p-8 shadow-sm border border-white/50 flex justify-between items-center relative z-10 shrink-0">
          <h1 className="text-3xl font-black text-[#4a2b4a] tracking-tighter">Gestión de Admisión</h1>
          <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-purple-200/50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-[#4a2b4a] uppercase tracking-widest">Base de Datos OK</span>
          </div>
        </div>

        <div className="flex-1 bg-gradient-to-br from-[#e8dceb] to-[#efe6f2] rounded-[3rem] shadow-sm border border-white/60 relative overflow-hidden flex flex-col p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};