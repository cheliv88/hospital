import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FaPlus } from 'react-icons/fa'; // Limpiamos los íconos que no usabas
import { useAuthStore } from '../store/authStore'; 
import { SearchModal } from '../components/SearchModal'; 
import { SuccessModal } from '../components/SuccessModal'; 
import { ErrorModal } from '../components/ErrorModal'; 

export const DarTurnos = () => {
  const token = useAuthStore((state) => state.token);
  const API_BASE_URL = 'http://localhost:8080/api/v1';

  const [selectedServicio, setSelectedServicio] = useState('');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const [selectedProfesional, setSelectedProfesional] = useState('');
  const [rangoFechas, setRangoFechas] = useState({ desde: '', hasta: '' });

  const [serviciosBD, setServiciosBD] = useState([]);
  const [especialidadesBD, setEspecialidadesBD] = useState([]);
  const [profesionalesBD, setProfesionalesBD] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const [modalAnular, setModalAnular] = useState({ isOpen: false, turnoId: null, title: '' });
  const [motivoAnulacion, setMotivoAnulacion] = useState('1');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [turnoPendiente, setTurnoPendiente] = useState(null);
  
  const [successData, setSuccessModal] = useState({ isOpen: false, data: null });
  const [errorData, setErrorModal] = useState({ isOpen: false, message: '' });

  
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/servicios`, { headers: { 'Authorization': `Bearer ${token}` }});
        if (res.ok) setServiciosBD(await res.json());
      } catch (e) { console.error(e); }
    };
    if (token) fetchServicios();
  }, [token]);

  useEffect(() => {
    if (!selectedServicio) { setEspecialidadesBD([]); setProfesionalesBD([]); return; }
    const fetchEspecialidades = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/especialidades?idServicio=${selectedServicio}`, { headers: { 'Authorization': `Bearer ${token}` }});
        if (res.ok) setEspecialidadesBD(await res.json());
      } catch (e) { console.error(e); }
    };
    if (token) fetchEspecialidades();
  }, [selectedServicio, token]);

  useEffect(() => {
    if (!selectedEspecialidad) { setProfesionalesBD([]); return; }
    const fetchProfesionales = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/profesionales?idEspecialidad=${selectedEspecialidad}&idServicio=${selectedServicio}`, { headers: { 'Authorization': `Bearer ${token}` }});
        if (res.ok) setProfesionalesBD(await res.json());
      } catch (e) { console.error(e); }
    };
    if (token) fetchProfesionales();
  }, [selectedEspecialidad, selectedServicio, token]);


  useEffect(() => {
    if (!selectedProfesional || !rangoFechas.desde || !rangoFechas.hasta) { setEventos([]); return; }
    
    const fetchTurnos = async () => {
      setCargando(true);
      try {
        const res = await fetch(`${API_BASE_URL}/agenda?idProfesional=${selectedProfesional}&fechaDesde=${rangoFechas.desde}&fechaHasta=${rangoFechas.hasta}`, { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          
          const mapaGrupos = {};
          data.forEach(turno => {
            if (turno.display === 'background') {
              mapaGrupos[`bg-${turno.id}`] = [turno];
              return;
            }
            const key = `${turno.start}`;
            if (!mapaGrupos[key]) mapaGrupos[key] = [];
            mapaGrupos[key].push(turno);
          });

          const eventosAgrupados = Object.entries(mapaGrupos).map(([key, lista]) => {
            const base = lista[0];
            if (base.display === 'background') return base;

            return {
              id: `grupo-${key}`,
              start: base.start,
              end: base.end,
              extendedProps: { 
                esGrupo: true, 
                pacientes: lista 
              }
            };
          });

          setEventos(eventosAgrupados);
        }
      } catch (e) { console.error(e); } finally { setCargando(false); }
    };
    if (token) fetchTurnos();
  }, [selectedProfesional, rangoFechas, token]);

  const handleDatesSet = (arg) => {
    setRangoFechas({ desde: arg.startStr.split('T')[0], hasta: arg.endStr.split('T')[0] });
  };

  const handleDateClick = (arg) => {
    const partesFecha = arg.dateStr.split('T');
    setTurnoPendiente({ fecha: partesFecha[0], hora: partesFecha[1].substring(0, 5) });
    setIsSearchModalOpen(true);
  };

  const buscarPacientes = async (tipoBusqueda, valorBuscado) => {
    const valorLimpio = valorBuscado.trim();
    const url = `http://localhost:8080/api/personas/buscar-avanzado?termino=${valorLimpio}`;
    try {
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` }});
      if (res.ok) return await res.json();
      return [];
    } catch (error) { return []; }
  };

  const asignarTurno = async (persona) => {
    setIsSearchModalOpen(false);
    const idPaciente = persona.idEntidad || persona.numeroHistoriaClinica;

    const payload = {
      idPaciente: parseInt(idPaciente, 10),
      idProfesional: parseInt(selectedProfesional, 10),
      idServicio: parseInt(selectedServicio, 10),
      fecha: turnoPendiente.fecha,
      hora: turnoPendiente.hora
    };

    try {
      setCargando(true);
      const res = await fetch(`${API_BASE_URL}/agenda`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const turnoAsignado = await res.json();
        setSuccessModal({ isOpen: true, data: turnoAsignado });
        setRangoFechas({...rangoFechas}); 
      } else {
        const errorMsg = await res.text();
        throw new Error(errorMsg || "Error al asignar el turno.");
      }
    } catch (error) { 
      setErrorModal({ isOpen: true, message: error.message });
    } finally { 
      setCargando(false); 
      setTurnoPendiente(null); 
    }
  };

  const confirmarAnulacion = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${API_BASE_URL}/agenda/${modalAnular.turnoId}?idMotivo=${motivoAnulacion}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setRangoFechas({...rangoFechas}); 
        setModalAnular({ isOpen: false, turnoId: null, title: '' });
      } else {
        const errorMsg = await res.text();
        throw new Error(errorMsg || "No se pudo anular el turno.");
      }
    } catch (error) { 
      setErrorModal({ isOpen: true, message: error.message });
    } finally { 
      setCargando(false); 
    }
  };

  const getEstiloPacientePorDia = (fecha) => {
    const dia = new Date(fecha).getDay();
    const estilos = {
      0: 'bg-[#0ea5e9]', 1: 'bg-[#8b5cf6]', 2: 'bg-[#f43f5e]', 
      3: 'bg-[#10b981]', 4: 'bg-[#f59e0b]', 5: 'bg-[#06b6d4]', 6: 'bg-[#6366f1]'
    };
    return estilos[dia] || 'bg-slate-500';
  };

  const renderizarEvento = (info) => {
    const { esGrupo, pacientes, tipo, mensaje } = info.event.extendedProps;

    if (tipo === 'fondo') return <div className="w-full h-full bg-gray-100 flex items-center justify-center opacity-50 font-bold text-[10px] uppercase">{mensaje}</div>;

    if (esGrupo) {
      const colorClase = getEstiloPacientePorDia(info.event.start);
      return (
        <div className="w-full flex flex-col gap-1 p-0.5 overflow-visible">
          {pacientes.map(p => (
            <div 
              key={p.id}
              onClick={(e) => {
                e.stopPropagation();
                setModalAnular({ isOpen: true, turnoId: p.id, title: p.title });
              }}
              className={`${colorClase} text-white text-[10px] font-bold p-1 rounded border-l-4 border-black/20 shadow-sm hover:brightness-110 cursor-pointer whitespace-nowrap overflow-hidden transition-all`}
            >
              {p.title}
            </div>
          ))}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDateClick({ dateStr: info.event.startStr });
            }}
            className="w-full py-0.5 bg-white/40 hover:bg-white/60 border border-dashed border-white rounded text-[10px] text-[#4a2b4a] font-bold flex items-center justify-center gap-1 transition-colors"
          >
            <FaPlus size={8} /> SOBRETURNO
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/80 p-5 md:p-6 overflow-hidden">
      {cargando && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
          <div className="w-10 h-10 border-4 border-[#a370a3] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-4 shrink-0">
        <h1 className="text-2xl md:text-3xl font-black text-[#4a2b4a] tracking-tighter">Gestión de Turnos</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full xl:w-auto xl:flex-1 xl:max-w-4xl">
          <select className="rounded-xl border-2 border-white/50 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 outline-none" value={selectedServicio} onChange={(e) => { setSelectedServicio(e.target.value); setSelectedEspecialidad(''); setSelectedProfesional(''); }}>
            <option value="">Servicio...</option>
            {serviciosBD.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
          <select className="rounded-xl border-2 border-white/50 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 outline-none" value={selectedEspecialidad} onChange={(e) => { setSelectedEspecialidad(e.target.value); setSelectedProfesional(''); }} disabled={!selectedServicio}>
            <option value="">Especialidad...</option>
            {especialidadesBD.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
          <select className="rounded-xl border-2 border-white/50 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-700 outline-none" value={selectedProfesional} onChange={(e) => setSelectedProfesional(e.target.value)} disabled={!selectedEspecialidad}>
            <option value="">Profesional...</option>
            {profesionalesBD.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative rounded-2xl bg-white/40 border border-white/50">
        <style>{`
          .fc-timegrid-slot { height: 4.5rem !important; }
          .fc-timegrid-event-harness { height: auto !important; min-height: 20px; }
          .fc-timegrid-event { 
            background: transparent !important; 
            border: none !important; 
            box-shadow: none !important; 
            overflow: visible !important;
          }
          .fc-event-main-frame { height: auto !important; }
          .fc-timegrid-col-events { margin-right: 30px !important; } 
          .fc-v-event { position: relative !important; display: block !important; }
        `}</style>
        
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale="es"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          slotDuration="00:15:00"
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          allDaySlot={false}
          events={eventos}
          eventContent={renderizarEvento}
          datesSet={handleDatesSet}
          dateClick={handleDateClick}
          height="100%"
          expandRows={true}
        />
      </div>

      {modalAnular.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="text-2xl font-black text-[#4a2b4a] mb-2 tracking-tighter">Anular Turno</h3>
            <p className="text-sm text-gray-600 mb-6 font-bold">{modalAnular.title}</p>
            <select className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2.5 mb-6 font-semibold" value={motivoAnulacion} onChange={(e) => setMotivoAnulacion(e.target.value)}>
              <option value="1">Paciente no asistió</option>
              <option value="2">Cancelado por profesional</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModalAnular({ isOpen: false, turnoId: null, title: '' })} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100">Cerrar</button>
              <button onClick={confirmarAnulacion} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#f43f5e] shadow-lg">Confirmar Anulación</button>
            </div>
          </div>
        </div>
      )}

      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => { setIsSearchModalOpen(false); setTurnoPendiente(null); }}
        onSearchData={buscarPacientes} 
        onSelectRecord={asignarTurno} 
        columns={[{ header: 'Doc.', key: 'numeroDocumento' }, { header: 'Apellido', key: 'apellidoPaterno' }, { header: 'Nombre', key: 'primerNombre' }]} 
        title="Buscar Paciente para Turno"
      />

      <SuccessModal 
        isOpen={successData.isOpen} 
        data={successData.data} 
        onClose={() => setSuccessModal({ isOpen: false, data: null })}
      />

      <ErrorModal 
        isOpen={errorData.isOpen} 
        errorMessage={errorData.message} 
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />

    </div>
  );
};