import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlusCircle, FaUpload } from 'react-icons/fa';
import { TopBar } from '../components/TopBar';
import { SearchModal } from '../components/SearchModal';

const labelClass = "block text-[12px] font-extrabold text-[#5c3c5c] uppercase tracking-wider mb-1.5 ml-1 opacity-90";
const inputClass = "w-full px-4 py-2.5 text-[14px] rounded-xl border-2 border-[#e0d4e3] bg-white text-[#2d1b2d] font-semibold placeholder-[#a391a3] hover:border-[#c2abc5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#a370a3]/20 focus:border-[#a370a3] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
const selectClass = `${inputClass} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%222.5%22%20stroke%3D%22%238e5c8e%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-no-repeat bg-[position:right_1rem_center] pr-10`;

const AccordionSection = ({ title, isOpen, onToggle, children }) => (
  <div className="mb-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm overflow-hidden transition-all duration-300">
    <button type="button" onClick={onToggle} className="w-full flex justify-between items-center p-4 lg:p-5 hover:bg-white/50 transition-colors">
      <h3 className="text-[16px] font-black text-[#c0392b] flex items-center gap-3 tracking-wide">
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-0' : '-rotate-90'}`}><FaChevronDown className="text-sm opacity-70" /></span>
        {title}
      </h3>
    </button>
    <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 p-5 pt-0 border-t border-gray-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
      {children}
    </div>
  </div>
);

const formularioEnBlanco = {
  apellidoPaterno: '', apellidoMaterno: '', primerNombre: '', segundoNombre: '',
  fechaNacimiento: '', horaNacimiento: '', tipoDocumento: '1', numeroDocumento: '',
  numeroHistoriaClinica: 'Automático', numeroHistoriaClinicaAnterior: '', estadoCivil: '1',
  sexo: 'M', nacionalidad: '1', estadoSocial: '-1', vigenciaEstadoSocial: '',
  nivelInstruccion: '-1', activa: true, grupoSanguineo: '',
  domicilio: '', telefono: '', email: '',
  obraSocial: '', numeroAfiliado: '', fechaAfiliacion: '',
  situacionLaboral: '', ocupacion: '', empresa: '', fechaIngreso: '', fechaEgreso: '',
  padre: '', madre: '', conyuge: '',
  fechaDeceso: '', horaDeceso: '', fallecioHospitalizada: false
};

export const AbmPersonas = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [openSections, setOpenSections] = useState({
    personales: true, contacto: false, obraSocial: false,
    laborales: false, parentesco: false, citas: false,
    deceso: false, informes: false
  });

  const [formData, setFormData] = useState({
    apellidoPaterno: '', apellidoMaterno: '', primerNombre: '', segundoNombre: '',
    fechaNacimiento: '', horaNacimiento: '', tipoDocumento: '1', numeroDocumento: '',
    numeroHistoriaClinica: 'Automático', numeroHistoriaClinicaAnterior: '', estadoCivil: '1',
    sexo: 'M', nacionalidad: '1', estadoSocial: '-1', vigenciaEstadoSocial: '',
    nivelInstruccion: '-1', activa: true, grupoSanguineo: '',
    domicilio: '', telefono: '', email: '',
    obraSocial: '', numeroAfiliado: '', fechaAfiliacion: '',
    situacionLaboral: '', ocupacion: '', empresa: '', fechaIngreso: '', fechaEgreso: '',
    padre: '', madre: '', conyuge: '',
    fechaDeceso: '', horaDeceso: '', fallecioHospitalizada: false
  });

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNuevo = () => {
    if(window.confirm('¿Desea limpiar el formulario?')) {
      setFormData(formularioEnBlanco); 
    }
  };

  const handleGuardar = async () => {
    if (!formData.numeroDocumento || !formData.primerNombre || !formData.apellidoPaterno) {
      alert("Complete Documento, Nombre y Apellido."); return;
    }
    setIsLoading(true);
    try {
      const isModificacion = formData.numeroHistoriaClinica !== 'Automático';
      const url = isModificacion ? `http://localhost:8080/api/personas/${formData.numeroHistoriaClinica}` : `http://localhost:8080/api/personas`;
      if (isModificacion && !formData.numeroHistoriaClinica) { alert("Error de ID."); return; }
      
      const payloadLimpio = { ...formData };
      payloadLimpio.activa = payloadLimpio.activa ? 1 : 0;
      payloadLimpio.fallecioHospitalizada = payloadLimpio.fallecioHospitalizada ? 1 : 0;
      if (!isModificacion) payloadLimpio.numeroHistoriaClinica = 0; 
      else payloadLimpio.numeroHistoriaClinica = parseInt(payloadLimpio.numeroHistoriaClinica, 10);
      
      if (payloadLimpio.estadoCivil) payloadLimpio.estadoCivil = parseInt(payloadLimpio.estadoCivil, 10);
      if (payloadLimpio.nacionalidad) payloadLimpio.nacionalidad = parseInt(payloadLimpio.nacionalidad, 10);
      if (payloadLimpio.estadoSocial === "-1" || payloadLimpio.estadoSocial === -1) payloadLimpio.estadoSocial = null;
      else if (payloadLimpio.estadoSocial) payloadLimpio.estadoSocial = parseInt(payloadLimpio.estadoSocial, 10);
      if (payloadLimpio.nivelInstruccion === "-1" || payloadLimpio.nivelInstruccion === -1) payloadLimpio.nivelInstruccion = null;
      else if (payloadLimpio.nivelInstruccion) payloadLimpio.nivelInstruccion = parseInt(payloadLimpio.nivelInstruccion, 10);

      Object.keys(payloadLimpio).forEach(key => { if (payloadLimpio[key] === "") payloadLimpio[key] = null; });

      const respuesta = await fetch(url, { method: isModificacion ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payloadLimpio) });
      if (respuesta.ok) {
        const datosServidor = await respuesta.json();
        alert('¡Guardado exitoso!');
        if (!isModificacion && datosServidor.numeroHistoriaClinica) setFormData(prev => ({ ...prev, numeroHistoriaClinica: datosServidor.numeroHistoriaClinica }));
      } else {
        alert(`Error al guardar: ${respuesta.status}`);
      }
    } catch (error) { alert('Error de conexión.'); } finally { setIsLoading(false); }
  };

  const handleEliminar = async () => {
    if (formData.numeroHistoriaClinica === 'Automático' || !formData.numeroHistoriaClinica) return alert('Busque una persona primero.');
    if(window.confirm('¿Dar de baja a esta persona?')) {
      setIsLoading(true);
      try {
        const respuesta = await fetch(`http://localhost:8080/api/personas/${formData.numeroHistoriaClinica}`, { method: 'DELETE' });
        if (respuesta.ok) { alert('Persona dada de baja.'); handleNuevo(); } 
        else alert(`Error: ${respuesta.status}`);
      } catch (error) { alert('Error de conexión.'); } finally { setIsLoading(false); }
    }
  };


  const columnasPersonas = [
    { header: 'Nro. Documento', key: 'numeroDocumento' },
    { header: 'Apellido Paterno', key: 'apellidoPaterno' },
    { header: 'Primer Nombre', key: 'primerNombre' },
    { header: 'H. Clínica', key: 'numeroHistoriaClinica' },
    { header: 'Fecha Nac.', key: 'fechaNacimiento' }
  ];

  const fetchResultadosPersona = async (tipoBusqueda, valorBuscado) => {
    
    const url = `http://localhost:8080/api/personas/buscar-avanzado?termino=${valorBuscado}`;
    
    console.log("Haciendo GET a:", url); // Para que lo veas en la consola (F12)

    try {
      const respuesta = await fetch(url);
      
      if (respuesta.ok) {
        return await respuesta.json(); 
      } else if (respuesta.status === 404) {
        return [];
      } else {
        const errorText = await respuesta.text();
        console.error("Error del Backend en el GET:", errorText);
        return [];
      }
    } catch (error) {
      console.error("Error de red en búsqueda:", error);
      throw error;
    }
  };
  const handleSeleccionarDesdeTabla = (personaSeleccionada) => {
    
    const personaLimpia = {};
    Object.keys(personaSeleccionada).forEach(key => {
      personaLimpia[key] = personaSeleccionada[key] === null ? "" : personaSeleccionada[key];
    });

    setFormData({ ...formularioEnBlanco, ...personaLimpia }); 
    
    setIsSearchOpen(false);
  };

  return (
    <div className="h-full flex flex-col relative">
      
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-[#e8dceb] z-50 overflow-hidden rounded-t-3xl">
          <div className="w-1/3 h-full bg-[#a370a3] animate-pulse rounded-full"></div>
        </div>
      )}

      <TopBar 
        title="ABM Personas" 
        showButtons={true} 
        onSearch={() => setIsSearchOpen(true)}
        onNew={handleNuevo}
        onSave={handleGuardar}
        onDelete={handleEliminar}
      />

      <div className={`flex-1 bg-gradient-to-br from-[#e8dceb] to-[#efe6f2] rounded-3xl shadow-inner border border-white/60 p-4 lg:p-6 overflow-y-auto transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        
        <AccordionSection title="Datos Personales" isOpen={openSections.personales} onToggle={() => toggleSection('personales')}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 pt-4">
             <div className="flex flex-col"><label className={labelClass}>Apellido Paterno</label><input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleInputChange} className={inputClass} /></div>
             <div className="flex flex-col"><label className={labelClass}>Apellido Materno</label><input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleInputChange} className={inputClass} /></div>
             <div className="flex flex-col"><label className={labelClass}>Primer Nombre</label><input type="text" name="primerNombre" value={formData.primerNombre} onChange={handleInputChange} className={inputClass} /></div>
             <div className="flex flex-col"><label className={labelClass}>Segundo Nombre</label><input type="text" name="segundoNombre" value={formData.segundoNombre} onChange={handleInputChange} className={inputClass} /></div>
             
             <div className="flex flex-col"><label className={labelClass}>Tipo Documento</label><select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleInputChange} className={selectClass}><option value="1">DNI</option><option value="2">Pasaporte</option></select></div>
             <div className="flex flex-col"><label className={labelClass}>Nro. Documento</label><input type="text" name="numeroDocumento" value={formData.numeroDocumento} onChange={handleInputChange} className={inputClass} /></div>
             <div className="flex flex-col"><label className={labelClass}>Fecha de Nac.</label><input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} className={inputClass} /></div>
             <div className="flex flex-col"><label className={labelClass}>Hora de Nac.</label><input type="time" name="horaNacimiento" value={formData.horaNacimiento} onChange={handleInputChange} className={inputClass} /></div>
             
             <div className="flex flex-col"><label className={labelClass}>Nro. Historia Clínica</label><input type="text" disabled value={formData.numeroHistoriaClinica} className={`${inputClass} bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed`} /></div>
             <div className="flex flex-col"><label className={labelClass}>Nro. H.C. Anterior</label><input type="text" name="numeroHistoriaClinicaAnterior" value={formData.numeroHistoriaClinicaAnterior} onChange={handleInputChange} className={inputClass} /></div>
             <div className="flex flex-col"><label className={labelClass}>Estado Civil</label><select name="estadoCivil" value={formData.estadoCivil} onChange={handleInputChange} className={selectClass}><option value="1">Soltero/a</option><option value="2">Casado/a</option></select></div>
             
             <div className="flex flex-col"><label className={labelClass}>Sexo</label>
               <div className="flex items-center gap-6 h-[46px] px-4 bg-white rounded-xl border-2 border-[#e0d4e3]">
                 <label className="flex items-center gap-2 text-[14px] text-[#2d1b2d] font-semibold cursor-pointer"><input type="radio" name="sexo" value="M" checked={formData.sexo === 'M'} onChange={handleInputChange} className="accent-[#a370a3] w-4 h-4 scale-110" /> Masculino</label>
                 <label className="flex items-center gap-2 text-[14px] text-[#2d1b2d] font-semibold cursor-pointer"><input type="radio" name="sexo" value="F" checked={formData.sexo === 'F'} onChange={handleInputChange} className="accent-[#a370a3] w-4 h-4 scale-110" /> Femenino</label>
               </div>
             </div>

             <div className="flex flex-col"><label className={labelClass}>Nacionalidad</label><select name="nacionalidad" value={formData.nacionalidad} onChange={handleInputChange} className={selectClass}><option value="1">Argentina</option><option value="2">Extranjero</option></select></div>
             <div className="flex flex-col"><label className={labelClass}>Estado Social</label><select name="estadoSocial" value={formData.estadoSocial} onChange={handleInputChange} className={selectClass}><option value="-1">Sin definir...</option><option value="1">Activo</option></select></div>
             <div className="flex flex-col"><label className={labelClass}>Vigencia Estado Soc.</label><input type="date" name="vigenciaEstadoSocial" value={formData.vigenciaEstadoSocial} onChange={handleInputChange} className={inputClass} /></div>
             <div className="flex flex-col"><label className={labelClass}>Nivel Instrucción</label><select name="nivelInstruccion" value={formData.nivelInstruccion} onChange={handleInputChange} className={selectClass}><option value="-1">Seleccionar...</option><option value="1">Primario</option><option value="2">Secundario</option></select></div>
             
             <div className="flex flex-col"><label className={labelClass}>Grupo Sanguíneo</label><select name="grupoSanguineo" value={formData.grupoSanguineo} onChange={handleInputChange} className={selectClass}><option value="">Indique...</option><option value="A|+">A+</option><option value="A|-">A-</option><option value="B|+">B+</option><option value="O|+">O+</option></select></div>
             
             <div className="flex flex-col justify-end pb-1.5"><label className="flex items-center gap-3 text-[14px] text-green-700 font-bold cursor-pointer bg-green-500/10 h-[46px] px-4 rounded-xl border-2 border-green-500/30 w-max hover:bg-green-500/20 transition-colors"><input type="checkbox" name="activa" checked={formData.activa} onChange={handleInputChange} className="w-5 h-5 accent-green-600 rounded" /> Persona Activa</label></div>
          </div>
        </AccordionSection>

        <AccordionSection title="Datos de contacto" isOpen={openSections.contacto} onToggle={() => toggleSection('contacto')}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="flex flex-col">
              <label className={labelClass}>Domicilio</label>
              <div className="flex gap-2">
                <input type="text" name="domicilio" value={formData.domicilio} onChange={handleInputChange} className={inputClass} />
                <button title="Añadir" className="bg-[#a370a3]/10 text-[#a370a3] px-3 rounded-xl border-2 border-[#a370a3]/20 hover:bg-[#a370a3] hover:text-white transition-colors"><FaPlusCircle size={18}/></button>
              </div>
            </div>
            <div className="flex flex-col">
              <label className={labelClass}>Teléfono</label>
              <div className="flex gap-2">
                <input type="text" name="telefono" value={formData.telefono} onChange={handleInputChange} className={inputClass} />
                <button title="Añadir" className="bg-[#a370a3]/10 text-[#a370a3] px-3 rounded-xl border-2 border-[#a370a3]/20 hover:bg-[#a370a3] hover:text-white transition-colors"><FaPlusCircle size={18}/></button>
              </div>
            </div>
            <div className="flex flex-col"><label className={labelClass}>Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} /></div>
          </div>
        </AccordionSection>

        <AccordionSection title="Datos de Obra Social" isOpen={openSections.obraSocial} onToggle={() => toggleSection('obraSocial')}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="flex flex-col"><label className={labelClass}>Obra Social</label>
              <select name="obraSocial" value={formData.obraSocial} onChange={handleInputChange} className={selectClass}>
                <option value="">Seleccionar...</option>
                <option value="IOMA">IOMA</option>
                <option value="PAMI">INSSJYP (PAMI)</option>
                <option value="OSDE">OSDE</option>
                <option value="GALENO">GALENO</option>
              </select>
            </div>
            <div className="flex flex-col"><label className={labelClass}>Número afiliado</label><input type="text" name="numeroAfiliado" value={formData.numeroAfiliado} onChange={handleInputChange} className={inputClass} /></div>
            <div className="flex flex-col"><label className={labelClass}>Fecha afiliación</label><input type="date" name="fechaAfiliacion" value={formData.fechaAfiliacion} onChange={handleInputChange} className={inputClass} /></div>
          </div>
        </AccordionSection>

        <AccordionSection title="Datos Laborales" isOpen={openSections.laborales} onToggle={() => toggleSection('laborales')}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="flex flex-col"><label className={labelClass}>Situación laboral</label>
              <select name="situacionLaboral" value={formData.situacionLaboral} onChange={handleInputChange} className={selectClass}>
                <option value="">Sin definir...</option>
                <option value="1">Trabaja o está de licencia</option>
                <option value="2">No trabaja y busca trabajo</option>
                <option value="3">No trabaja y no busca trabajo</option>
              </select>
            </div>
            <div className="flex flex-col"><label className={labelClass}>Ocupación habitual</label><input type="text" name="ocupacion" value={formData.ocupacion} onChange={handleInputChange} className={inputClass} /></div>
            <div className="flex flex-col"><label className={labelClass}>Empresa</label><input type="text" name="empresa" value={formData.empresa} onChange={handleInputChange} className={inputClass} /></div>
            <div className="flex flex-col"><label className={labelClass}>Fecha Ingreso</label><input type="date" name="fechaIngreso" value={formData.fechaIngreso} onChange={handleInputChange} className={inputClass} /></div>
            <div className="flex flex-col"><label className={labelClass}>Fecha Egreso</label><input type="date" name="fechaEgreso" value={formData.fechaEgreso} onChange={handleInputChange} className={inputClass} /></div>
          </div>
        </AccordionSection>

        <AccordionSection title="Parentesco" isOpen={openSections.parentesco} onToggle={() => toggleSection('parentesco')}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="flex flex-col"><label className={labelClass}>Padre</label><input type="text" name="padre" placeholder="Buscar..." value={formData.padre} onChange={handleInputChange} className={inputClass} /></div>
            <div className="flex flex-col"><label className={labelClass}>Madre</label><input type="text" name="madre" placeholder="Buscar..." value={formData.madre} onChange={handleInputChange} className={inputClass} /></div>
            <div className="flex flex-col"><label className={labelClass}>Cónyuge</label><input type="text" name="conyuge" placeholder="Buscar..." value={formData.conyuge} onChange={handleInputChange} className={inputClass} /></div>
          </div>
        </AccordionSection>

        <AccordionSection title="Citas/Internaciones" isOpen={openSections.citas} onToggle={() => toggleSection('citas')}>
          <div className="pt-4">
            <button className="flex items-center gap-2 bg-[#a370a3]/10 text-[#a370a3] border-2 border-[#a370a3]/30 px-6 py-3 rounded-xl font-bold hover:bg-[#a370a3] hover:text-white transition-all">
              <FaPlusCircle /> Agregar nueva cita
            </button>
          </div>
        </AccordionSection>

        <AccordionSection title="Datos de Deceso" isOpen={openSections.deceso} onToggle={() => toggleSection('deceso')}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-center">
            <div className="flex flex-col"><label className={labelClass}>Fecha deceso</label><input type="date" name="fechaDeceso" value={formData.fechaDeceso} onChange={handleInputChange} className={inputClass} /></div>
            <div className="flex flex-col"><label className={labelClass}>Hora</label><input type="time" name="horaDeceso" value={formData.horaDeceso} onChange={handleInputChange} className={inputClass} /></div>
            <div className="flex flex-col justify-end pt-5">
              <label className="flex items-center gap-3 text-[14px] text-[#4a2b4a] font-bold cursor-pointer bg-white p-3 rounded-xl border-2 border-[#e0d4e3]">
                <input type="checkbox" name="fallecioHospitalizada" checked={formData.fallecioHospitalizada} onChange={handleInputChange} className="w-5 h-5 accent-[#a370a3] rounded" /> 
                Falleció Hospitalizada
              </label>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Otros informes" isOpen={openSections.informes} onToggle={() => toggleSection('informes')}>
          <div className="pt-4">
            <label className={labelClass}>Archivo PDF</label>
            <div className="mt-2 flex items-center justify-center w-full md:w-1/2">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#a370a3]/30 border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-white/80 hover:border-[#a370a3]/60 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="text-[#a370a3] mb-3" size={28} />
                  <p className="text-[14px] text-[#6b4c6b] font-bold">Haz clic para subir un PDF</p>
                </div>
                <input type="file" className="hidden" accept=".pdf" />
              </label>
            </div>
          </div>
        </AccordionSection>

      </div>

      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        title="Buscar Personas"
        columns={columnasPersonas} 
        onSearchData={fetchResultadosPersona} 
        onSelectRecord={handleSeleccionarDesdeTabla} 
      />

    </div>
  );
};