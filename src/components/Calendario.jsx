// frontend/src/components/Calendario.jsx
import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

export default function Calendario() {
  const [eventos, setEventos] = useState([]);

  // Função pra buscar todas as consultas do backend e transformar em "eventos"
  const fetchConsultas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/consultas');
      // O backend retorna array de consultas, cada uma tem .data (Date) e .horario (string)
      const eventosFormatados = res.data.map((consulta) => {
        // Monta uma string de data completa: por ex. "2025-06-10T14:00:00"
        // Se o campo consulta.horario for "14:00", e consulta.data for Object Date
        const dataISO = new Date(consulta.data).toISOString().split('T')[0];
        const dataHora = `${dataISO}T${consulta.horario}:00`;
        return {
          id: consulta._id,
          title: consulta.paciente.nome + ' - ' + consulta.profissional.nome,
          start: dataHora,
          allDay: false,
        };
      });
      setEventos(eventosFormatados);
    } catch (err) {
      console.error('↪️ [Calendario] Erro ao buscar consultas:', err);
    }
  };

  // Puxa as consultas assim que o componente monta
  useEffect(() => {
    fetchConsultas();
  }, []);

  // (Opcional) lidar com clique em célula para criar nova consulta
  const handleDateClick = (arg) => {
    // arg.dateStr = "2025-06-15"
    console.log('Clicou na data:', arg.dateStr);
    // Você pode, por exemplo, abrir um modal para agendar nesse dia
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        events={eventos}
        dateClick={handleDateClick}
        height="auto"
      />
    </div>
  );
}
