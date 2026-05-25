import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const MainLayout = () => {
  const location = useLocation();
  
  let bgPagina = '#f5ebf5'; 

  if (location.pathname.includes('/historia-clinica')) {
    bgPagina = '#fff2e6'; 
  }

  return (
    <div 
      className="flex h-screen overflow-hidden transition-colors duration-300" 
      style={{ backgroundColor: bgPagina }}
    >
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};