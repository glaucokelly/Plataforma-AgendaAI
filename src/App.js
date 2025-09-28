import { useState } from 'react';
import Chatbot from './components/Chatbot';
import Calendario from './components/Calendario';

export default function App() {
  const [reloadCalendar, setReloadCalendar] = useState(false);

  const handleAgendamento = () => {
    setReloadCalendar((prev) => !prev); 
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">OdontoBot + Calendário</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/5 bg-white shadow-lg rounded-lg p-4 h-[600px] flex flex-col">
          <Chatbot onAgendamentoConcluido={handleAgendamento} />
        </div>
        <div className="md:w-3/5 bg-white shadow-lg rounded-lg p-4 h-[600px] overflow-auto">
          <Calendario key={reloadCalendar} />
        </div>
      </div>
    </div>
  );
}
