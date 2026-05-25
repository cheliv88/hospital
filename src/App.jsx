// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { MainLayout } from './layouts/MainLayout'; 
import { AdmisionHome } from './pages/AdmisionHome'; 
import { AbmPersonas } from './pages/AbmPersonas'; 
import { Consulta } from './pages/Consulta'; 
import { HistoriaClinica } from './pages/HistoriaClinica'; 
import { DarTurnos } from './pages/DarTurnos'; 

import { FaUserNurse, FaNotesMedical, FaClipboardList, FaUsers, FaCalendarAlt } from 'react-icons/fa';

function App() {

  const menuAdmision = [
    { title: 'Historia Clinica', path: '/admision/personas', icon: <FaNotesMedical /> }, 
    { title: 'Protocolos', path: '/admision/protocolos', icon: <FaClipboardList /> },
    { title: 'Listado Pacientes', path: '/admision/consultas', icon: <FaUsers /> },
    { title: 'Gestión de Turnos', path: '/admision/turnos', icon: <FaCalendarAlt /> },
  ];

  const menuHistoriaClinica = [
    { title: 'Historia Clinica', path: '/historia-clinica', icon: <FaNotesMedical /> },
    { title: 'Protocolos', path: '/historia-clinica/protocolos', icon: <FaClipboardList /> },
    { title: 'Listado Pacientes', path: '/historia-clinica/pacientes', icon: <FaUsers /> },
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        
        <Route path="/admision" element={<MainLayout moduleName="Consultorios" baseColor="#a370a3" menuItems={menuAdmision} />}>
          <Route index element={<AdmisionHome />} />
          <Route path="personas" element={<AbmPersonas />} />
          <Route path="consultas" element={<Consulta />} />
          <Route path="turnos" element={<DarTurnos />} /> 
        </Route>

        <Route path="/historia-clinica" element={<MainLayout moduleName="Consultorios" baseColor="#e67300" menuItems={menuHistoriaClinica} />}>
           <Route index element={<HistoriaClinica />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;