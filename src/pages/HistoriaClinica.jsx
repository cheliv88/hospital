import { useState } from 'react';
import { FaUserCircle, FaHospitalAlt, FaXRay, FaTimes, FaIdCard } from 'react-icons/fa';
import { TopBar } from '../components/TopBar';
import { SearchModal } from '../components/SearchModal';

const labelClass = "block text-[12px] font-extrabold text-[#5c3c5c] uppercase tracking-wider mb-1.5 ml-1 opacity-90";
const inputClass = "w-full px-4 py-2 text-[14px] rounded-xl border-2 border-[#e0d4e3] bg-white text-[#2d1b2d] font-semibold focus:ring-4 focus:ring-[#e67300]/20 transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

export const HistoriaClinica = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isModalDatosOpen, setIsModalDatosOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('historia');

  const [paciente, setPaciente] = useState({
    nombreCompleto: '', fechaNacimiento: '', sexo: '', tipoDocumento: 'DNI',
    numeroDocumento: '', numeroHistoriaClinica: '', numeroHistoriaClinicaAnterior: '', fotoUrl: null
  });

  const [eventosClinicos, setEventosClinicos] = useState([]);

  const columnasPersonas = [
    { header: 'Nro. Documento', key: 'numeroDocumento' },
    { header: 'Apellido Paterno', key: 'apellidoPaterno' },
    { header: 'Primer Nombre', key: 'primerNombre' },
    { header: 'H. Clínica', key: 'numeroHistoriaClinica' },
    { header: 'Fecha Nac.', key: 'fechaNacimiento' }
  ];

  const fetchResultadosPersona = async (tipoBusqueda, valorBuscado) => {
    const url = `http://localhost:8080/api/personas/buscar-avanzado?termino=${valorBuscado}`;
    try {
      const respuesta = await fetch(url);
      if (respuesta.ok) return await respuesta.json();
      if (respuesta.status === 404) return [];
      return [];
    } catch (error) {
      console.error("Error buscando:", error);
      throw error;
    }
  };

  const handleSeleccionarDesdeTabla = async (personaSeleccionada) => {
    setIsSearchOpen(false);
    setIsLoading(true);

    try {
      setPaciente({
        nombreCompleto: `${personaSeleccionada.apellidoPaterno || ''} ${personaSeleccionada.primerNombre || ''}`.trim(),
        fechaNacimiento: personaSeleccionada.fechaNacimiento || '',
        sexo: personaSeleccionada.sexo || 'M',
        tipoDocumento: personaSeleccionada.tipoDocumento === 1 ? 'DNI' : 'Pasaporte',
        numeroDocumento: personaSeleccionada.numeroDocumento || '',
        numeroHistoriaClinica: personaSeleccionada.numeroHistoriaClinica || '',
        numeroHistoriaClinicaAnterior: personaSeleccionada.numeroHistoriaClinicaAnterior || '',
        fotoUrl: personaSeleccionada.fotoUrl || null
      });

      setEventosClinicos([
        { id: 1, fecha: '04/03/2026', hora: '01:00', tipo: 'imagen', titulo: 'Diag. por Imagenes', descripcion: 'Ecografía, solicitada por: AGUIRRE DAVID.', estado: '(Sin Imagen disponible)(Sin informar)' },
        { id: 2, fecha: '06/02/2026', hora: '21:22', tipo: 'imagen', titulo: 'Diag. por Imagenes', descripcion: 'Ecografía, solicitada por: .', estado: '(Sin Imagen disponible)(Sin informar)' },
        { id: 3, fecha: '04/02/2026', hora: '14:35', tipo: 'guardia', titulo: 'Guardia Activa', descripcion: '04/02/2026 - 06/02/2026 (2 días)', estado: '' },
      ]);

    } catch (error) {
      console.error(error);
      alert("Error al cargar la historia clínica.");
    } finally {
      setIsLoading(false);
    }
  };

  const eventosPorFecha = eventosClinicos.reduce((acc, evento) => {
    if (!acc[evento.fecha]) acc[evento.fecha] = [];
    acc[evento.fecha].push(evento);
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col relative">
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-[#fbe7d5] z-50 overflow-hidden rounded-t-3xl">
          <div className="w-1/3 h-full bg-[#e67300] animate-pulse rounded-full"></div>
        </div>
      )}

      <TopBar 
        title="Historia Clínica" 
        showButtons={true} 
        onSearch={() => setIsSearchOpen(true)}
      />

      <div className={`flex-1 flex flex-col gap-4 overflow-hidden transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        

        {paciente.numeroHistoriaClinica && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e0d4e3] p-4 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e67300]/10 text-[#e67300] rounded-full flex items-center justify-center text-xl shrink-0">
                <FaUserCircle />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#2d1b2d] uppercase tracking-wide">{paciente.nombreCompleto}</h2>
                <p className="text-sm text-gray-500 font-semibold flex gap-3">
                  <span>DNI: {paciente.numeroDocumento}</span>
                  <span className="text-[#e67300] bg-[#e67300]/10 px-2 py-0.5 rounded-md">HC: {paciente.numeroHistoriaClinica}</span>
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsModalDatosOpen(true)}
              className="bg-[#e67300] hover:bg-[#cc6600] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2"
            >
              <FaIdCard /> Ver Datos Personales
            </button>
          </div>
        )}


        <div className="flex-1 flex flex-col min-h-0 bg-transparent mt-2">
          
          <div className="flex items-center justify-center mb-4 shrink-0">
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-white/60 backdrop-blur-md border border-white rounded-2xl shadow-sm">
              {[
                { id: 'historia', label: 'Historia Clínica', icon: '🩺' }, // <-- CAMBIO: Ícono y texto actualizados
                { id: 'antecedentes', label: 'Antecedentes', icon: '📋' },
                { id: 'laboratorio', label: 'Laboratorios', icon: '🔬' },
                { id: 'otros', label: 'Otros Informes', icon: '📁' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 font-bold text-[13px] rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-[#e67300] text-white shadow-md scale-105' 
                      : 'bg-transparent text-gray-500 hover:bg-white hover:text-gray-800'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-white rounded-3xl shadow-sm border border-[#e0d4e3] p-6 lg:p-8">
            
            {activeTab === 'historia' && (
              <div className="max-w-4xl mx-auto">
                {Object.keys(eventosPorFecha).length === 0 ? (
                  <div className="text-center text-gray-400 mt-10 font-medium bg-gray-50 p-10 rounded-3xl border border-dashed">
                    Haga clic en el botón "Buscar Persona" en la barra superior para comenzar.
                  </div>
                ) : (
                  <div className="relative border-l-2 border-[#e67300]/30 ml-3">
                    {Object.keys(eventosPorFecha).map((fecha, index) => (
                      <div key={index} className="mb-8 relative">
                        
                        <div className="font-black text-gray-800 text-[13px] mb-4 -ml-[7px] flex items-center gap-3">
                          <div className="w-3 h-3 bg-[#e67300] rounded-full shadow-[0_0_0_4px_white]"></div>
                          <span className="bg-[#e67300]/10 text-[#cc6600] border border-[#e67300]/20 px-3 py-1.5 rounded-lg shadow-sm">
                            {fecha}
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-3 pl-8">
                          {eventosPorFecha[fecha].map(evento => {
                            const isImagen = evento.tipo === 'imagen';
                            const bgColor = isImagen ? 'bg-orange-50/70' : 'bg-blue-50/50';
                            const borderColor = isImagen ? 'border-orange-200' : 'border-blue-100';
                            const iconColor = isImagen ? 'text-orange-500' : 'text-blue-500';

                            return (
                              <div key={evento.id} className={`p-4 rounded-2xl border ${bgColor} ${borderColor} hover:shadow-md transition-all group`}>
                                <div className="font-bold text-[13px] flex items-center gap-2 text-gray-800">
                                  <span className="text-gray-500 font-black bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">{evento.hora}</span>
                                  {isImagen ? <FaXRay className={iconColor} /> : <FaHospitalAlt className={iconColor} />}
                                  <span className={iconColor}>{evento.titulo}:</span> 
                                  <span className="font-medium text-gray-700">{evento.descripcion}</span>
                                </div>
                                {evento.estado && (
                                  <div className="text-[12px] mt-2 text-gray-500 font-medium pl-[68px]">
                                    {evento.estado}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'antecedentes' && (
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                  <span className="text-[#e67300]">📋</span> Historial de Antecedentes
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    { fecha: '25/08/2025', medico: 'MUSCIATTI HERNAN', desc: '154.5' },
                    { fecha: '09/06/2025', medico: 'MUSCIATTI HERNAN', desc: 'RX CONMGESTIVA ECO VI DIL 31% DERR PERIC' },
                    { fecha: '26/05/2025', medico: 'MUSCIATTI HERNAN', desc: 'fey 31% rx muy congestiva +150k' },
                    { fecha: '31/03/2025', medico: 'MUSCIATTI HERNAN', desc: '148k' },
                    { fecha: '25/11/2024', medico: 'MUSCIATTI HERNAN', desc: '158.7 COME CON SAL' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#e67300]/30 transition-colors bg-white shadow-sm">
                      <div className="flex flex-col sm:w-32 shrink-0">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Fecha</span>
                        <span className="font-bold text-[#e67300]">{item.fecha}</span>
                      </div>
                      <div className="flex flex-col sm:w-48 shrink-0">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Médico</span>
                        <span className="font-semibold text-gray-700">{item.medico}</span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Antecedente</span>
                        <span className="font-medium text-gray-600">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'laboratorio' && (
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                  <span className="text-[#e67300]">🔬</span> Informes de Laboratorio
                </h3>
                <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase text-[11px] tracking-wider border-b border-gray-100">
                      <tr>
                        <th className="p-4 w-1/4">Fecha</th>
                        <th className="p-4 w-1/2">Médico Solicitante</th>
                        <th className="p-4 w-1/4 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { fecha: '04/11/2025', medico: 'PEREZ FERNANDO' },
                        { fecha: '02/11/2025', medico: 'PEREZ FERNANDO' },
                        { fecha: '31/10/2025', medico: 'PEREZ FERNANDO' },
                        { fecha: '30/10/2025', medico: 'PEREZ FERNANDO' },
                        { fecha: '23/06/2025', medico: 'MUSCIATTI HERNAN' },
                      ].map((lab, i) => (
                        <tr key={i} className="hover:bg-[#e67300]/5 transition-colors group bg-white">
                          <td className="p-4 font-bold text-gray-700">{lab.fecha}</td>
                          <td className="p-4 font-medium text-gray-600">{lab.medico}</td>
                          <td className="p-4 flex justify-center">
                            <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#e67300]/10 text-[#e67300] group-hover:bg-[#e67300] group-hover:text-white transition-all shadow-sm" title="Ver Informe PDF">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'otros' && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <span className="text-4xl mb-4 opacity-50">📁</span>
                <p className="font-bold uppercase tracking-widest text-sm">No hay otros informes registrados</p>
              </div>
            )}

          </div>
        </div>
      </div>


      {isModalDatosOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in-up">
            
            <div className="bg-gradient-to-r from-[#e67300] to-[#cc6600] p-5 flex justify-between items-center text-white shrink-0">
              <h3 className="text-lg font-black flex items-center gap-2 tracking-wide">
                <FaIdCard /> Ficha Personal del Paciente
              </h3>
              <button onClick={() => setIsModalDatosOpen(false)} className="hover:rotate-90 transition-all duration-300">
                <FaTimes size={20}/>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col lg:flex-row gap-8 bg-gray-50/50">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="col-span-1 md:col-span-2">
                  <label className={labelClass}>Nombre Completo</label>
                  <input type="text" value={paciente.nombreCompleto} readOnly className={inputClass} />
                </div>
                
                <div><label className={labelClass}>Fecha nacimiento</label><input type="text" value={paciente.fechaNacimiento} readOnly className={inputClass} /></div>
                <div>
                  <label className={labelClass}>Sexo</label>
                  <div className="flex items-center gap-6 h-[42px] px-4 bg-white rounded-xl border-2 border-[#e0d4e3]">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><input type="radio" checked={paciente.sexo === 'M'} readOnly className="accent-[#e67300]" /> Masculino</label>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><input type="radio" checked={paciente.sexo === 'F'} readOnly className="accent-[#e67300]" /> Femenino</label>
                  </div>
                </div>

                <div><label className={labelClass}>Tipo Documento</label><input type="text" value={paciente.tipoDocumento} readOnly className={inputClass} /></div>
                <div><label className={labelClass}>Número Doc.</label><input type="text" value={paciente.numeroDocumento} readOnly className={inputClass} /></div>
                
                <div><label className={labelClass}>Nro. Historia Clínica</label><input type="text" value={paciente.numeroHistoriaClinica} readOnly className={inputClass} /></div>
                <div><label className={labelClass}>Nro. H.C. Anterior</label><input type="text" value={paciente.numeroHistoriaClinicaAnterior} readOnly className={inputClass} /></div>
              </div>

              <div className="w-48 h-48 border-2 border-dashed border-[#e67300]/40 bg-white flex items-center justify-center relative rounded-2xl shrink-0 mx-auto lg:mx-0 shadow-sm">
                {paciente.fotoUrl ? (
                  <img src={paciente.fotoUrl} alt="Paciente" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-center p-4 text-[#e67300]/70 font-bold text-sm leading-relaxed">
                    Seleccione una foto de la persona
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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