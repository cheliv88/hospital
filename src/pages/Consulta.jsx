import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { TopBar } from '../components/TopBar';
import { SearchModal } from '../components/SearchModal';

const FormCard = ({ title, children }) => (
  <div className="mb-5 bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm overflow-hidden">
    <div className="px-5 py-3.5 border-b border-[#a370a3]/10">
      <h3 className="text-[16px] font-black text-[#c0392b] tracking-wide">{title}</h3>
    </div>
    <div className="p-5 flex flex-col gap-4">
      {children}
    </div>
  </div>
);

export const Consulta = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Guardamos el estado inicial en una constante para poder reutilizarlo
  const estadoInicial = {
    nombreCompleto: '',
    fechaNacimiento: '',
    sexo: 'M',
    tipoDocumento: 'CEDULA',
    numeroDocumento: '',
    numeroHistoriaClinica: '',
    numeroHistoriaClinicaAnterior: '',
    empresa: '',
    obraSocial: '',
    numeroAfiliado: '',
    fecha: '2026-04-18',
    servicio: '',
    especialidad: '',
    profesional: '',
    motivoConsulta: 'Particular',
    prioridad: 'Sin prioridad'
  };

  const [formData, setFormData] = useState(estadoInicial);

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleNuevo = () => {
    if(window.confirm('¿Limpiar formulario para una nueva consulta?')) {
      // Reemplazamos el comentario "TODO" por la lógica real que limpia el formulario
      setFormData(estadoInicial);
    }
  };

  const handleGuardar = () => {
    alert('Consulta registrada exitosamente');
  };

  const handleEliminar = () => {
    if(window.confirm('¿Anular esta consulta?')) {
      alert('Anulada');
    }
  };

  const handleBuscarPaciente = (valorBuscado) => {
    setFormData({ 
      ...formData, 
      nombreCompleto: 'Pérez, Juan Carlos',
      numeroDocumento: valorBuscado,
      fechaNacimiento: '1985-05-15',
      empresa: 'Ministerio de Salud',
      obraSocial: 'IOMA',
      numeroAfiliado: '123456789'
    });
    setIsSearchOpen(false);
  };

  const labelClass = "text-[13px] font-extrabold text-[#2d1b2d] md:w-44 shrink-0 flex items-center";
  const labelSecondaryClass = "text-[13px] font-extrabold text-[#2d1b2d] md:ml-4 shrink-0 flex items-center";
  
  const inputClass = "w-full px-3.5 py-2 text-[14px] rounded-xl border-2 border-[#e0d4e3] bg-white text-[#2d1b2d] font-semibold placeholder-[#a391a3] hover:border-[#c2abc5] focus:outline-none focus:ring-4 focus:ring-[#a370a3]/20 focus:border-[#a370a3] transition-all shadow-sm";
  const selectClass = `${inputClass} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%222.5%22%20stroke%3D%22%238e5c8e%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-no-repeat bg-[position:right_1rem_center] pr-10`;

  return (
    <div className="h-full flex flex-col relative">
      
      <TopBar 
        title="Consulta / Guardia" 
        showButtons={true} 
        onSearch={() => setIsSearchOpen(true)}
        onNew={handleNuevo}
        onSave={handleGuardar}
        onDelete={handleEliminar}
      />

      <div className="flex-1 bg-gradient-to-br from-[#e8dceb] to-[#efe6f2] rounded-3xl shadow-inner border border-white/60 p-4 lg:p-6 overflow-y-auto">
        
        <FormCard title="Datos Personales">
          
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className={labelClass}>Nombre Completo</label>
            <div className="flex-1 flex gap-2">
              <input type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleInputChange} className={`${inputClass} bg-gray-50/50`} readOnly placeholder="Busque un paciente..." />
              <button onClick={() => setIsSearchOpen(true)} className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl shadow-md hover:scale-105 transition-transform flex items-center justify-center">
                <FaEdit size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className={labelClass}>Fecha nacimiento</label>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} className={`${inputClass} md:w-48`} />
            
            <label className={labelSecondaryClass}>Sexo</label>
            <div className="flex items-center gap-4 pl-2">
              <label className="flex items-center gap-2 text-[14px] text-[#2d1b2d] font-semibold cursor-pointer">
                <input type="radio" name="sexo" value="M" checked={formData.sexo === 'M'} onChange={handleInputChange} className="accent-[#007bff] w-4 h-4 scale-110" /> Masculino
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[#2d1b2d] font-semibold cursor-pointer">
                <input type="radio" name="sexo" value="F" checked={formData.sexo === 'F'} onChange={handleInputChange} className="accent-[#007bff] w-4 h-4 scale-110" /> Femenina
              </label>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className={labelClass}>Tipo Documento</label>
            <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleInputChange} className={`${selectClass} md:w-48`}>
              <option value="CEDULA">CEDULA</option>
              <option value="DNI">DNI</option>
            </select>
            
            <label className={labelSecondaryClass}>Número Doc.</label>
            <input type="text" name="numeroDocumento" value