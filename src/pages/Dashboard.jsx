import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ModuleCard } from '../components/ModuleCard';
import { LoginModal } from '../components/LoginModal';
import { useAuthStore } from '../store/authStore';
import { 
  FaPlusCircle, FaUserNurse, FaBed, FaVial, FaSyringe, FaNotesMedical,
  FaFileImage, FaTint, FaPills, FaHandHoldingHeart, FaCut, FaUsers,
  FaHeartbeat, FaMoneyBillWave, FaChartBar, FaDesktop
} from 'react-icons/fa';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { checkSession } = useAuthStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState({ name: '', color: '' });

  const handleModuleClick = (name, color) => {
    if (checkSession()) {
      const path = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
      navigate(`/${path}`);
    } else {
      setSelectedModule({ name, color });
      setIsModalOpen(true);
    }
  };

  const modules = [
    { title: 'Guardia', icon: <FaPlusCircle />, color: '#b30000' },
    { title: 'Admisión', icon: <FaUserNurse />, color: '#a370a3' },
    { title: 'Internación', icon: <FaBed />, color: '#cc4400' },
    { title: 'Ayuda', icon: <FaHandHoldingHeart />, color: '#d35400' },
    { title: 'Historia Clinica', icon: <FaNotesMedical />, color: '#e67300' },
    { title: 'Laboratorio', icon: <FaVial />, color: '#b8860b' },
    { title: 'Vacunación', icon: <FaSyringe />, color: '#d1477a' },
    { title: 'Reclamos', icon: <FaUsers />, color: '#cc6666' },
    { title: 'Diagnóstico por Imág.', icon: <FaFileImage />, color: '#d2b48c' },
    { title: 'Hemoterapia', icon: <FaTint />, color: '#c0392b' },
    { title: 'Enfermería', icon: <FaHeartbeat />, color: '#d35400' },
    { title: 'Farmacia', icon: <FaPills />, color: '#c71585' },
    { title: 'Cirugía', icon: <FaCut />, color: '#e6004c' },
    { title: 'Facturación', icon: <FaMoneyBillWave />, color: '#800000' },
    { title: 'Estadísticas', icon: <FaChartBar />, color: '#8b4513' },
    { title: 'Sistemas', icon: <FaDesktop />, color: '#4b5563' },
  ];

  return (

    <div className="min-h-screen lg:h-screen flex flex-col font-sans bg-[#0b0f19] relative z-0 overflow-y-auto lg:overflow-hidden">
      
      {/* Fondo Animado (Sin cambios) */}
      <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[120px] animate-[blob_12s_infinite]"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-pink-600/20 rounded-full blur-[130px] animate-[blob_18s_infinite_4s]"></div>
      </div>

      <div className="flex-none w-full">
        <Header />
      </div>


      <main className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto flex flex-col z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:h-full pb-6 lg:pb-2">
          {modules.map((mod, index) => (
            <ModuleCard 
              key={index} title={mod.title} icon={mod.icon} color={mod.color}
              onClick={() => handleModuleClick(mod.title, mod.color)}
            />
          ))}
        </div>
      </main>

      <LoginModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        moduleName={selectedModule.name}
        themeColor={selectedModule.color}
      />
    </div>
  );
};