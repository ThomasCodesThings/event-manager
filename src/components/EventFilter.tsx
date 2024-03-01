import React, { useState, Dispatch, SetStateAction } from 'react';
import { IEvent } from '../interfaces/interfaces';

interface EventFilterProps {
    events: IEvent[];
    visible: boolean;
    setEvents: Dispatch<SetStateAction<IEvent[]>>;
    onClose: () => void;
    onReset: () => void;
}

const EventFilter: React.FC<EventFilterProps> = ({ events, visible, setEvents, onClose, onReset }) => {
    const [filterTitle, setFilterTitle] = useState('');
    const [filterLobby, setFilterLobby] = useState('');
    const [filterAddress, setFilterAddress] = useState('');
    const [filterBeginDate, setFilterBeginDate] = useState('');

    const [isFiletered, setIsFiltered] = useState(false); //uložene stavu či som filtroval už alebo nie

    const handleFilter = () => {
      let filteredEvents = [...events];

      if (filterTitle) {
          filteredEvents = filteredEvents.filter(event => event.title.toLowerCase().includes(filterTitle.toLowerCase()));
      }

      if (filterLobby) {
          filteredEvents = filteredEvents.filter(event => event.lobby.toLowerCase().includes(filterLobby.toLowerCase()));
      }

      if (filterAddress) {
        filteredEvents = filteredEvents.filter(event => event.address.toLowerCase().includes(filterAddress.toLowerCase()));
      }

      if (filterBeginDate) {
          filteredEvents = filteredEvents.filter(event => new Date(event.beginDate) >= new Date(filterBeginDate));
      }
      setEvents(filteredEvents);
      setIsFiltered(true);
  };
  
      
    const resetFilters = () => {
        setFilterTitle('');
        setFilterLobby('');
        const currentDate = new Date(); //nastavnie datumu na súčasný
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hour = String(currentDate.getHours()).padStart(2, '0');
        const minute = String(currentDate.getMinutes()).padStart(2, '0');
        const second = String(currentDate.getSeconds()).padStart(2, '0');
        setFilterBeginDate(`${year}-${month}-${day} ${hour}:${minute}:${second}`);
    }

    const handleClose = () => {
        resetFilters();
        onClose();
    }

    const handleReset = () => {
        resetFilters();
        setIsFiltered(false);
        onReset();
    }

    return (
      <div>
        <div style={{ display: visible ? 'grid' : 'none' }} className="grid grid-cols-[min-content_1fr] gap-2 p-1 border rounded mb-3 relative">
          <div className="col-span-2 p-3 flex justify-between">
            <h1 className="inline-block font-bold">Filter</h1>
            <button onClick={handleClose} className="text-gray-600 hover:text-gray-800 font-bold">X</button>
          </div>
          <label className="p-3 whitespace-nowrap text-right">Názov</label>
          <input type="text" placeholder="Najlepsi event" value={filterTitle} onChange={e => setFilterTitle(e.target.value)} className="px-3 bg-stone-100 border border-stone-300 rounded" />
        
          <label className="p-3 whitespace-nowrap text-right">Hladisko</label>
          <input type="text" placeholder="A" value={filterLobby} onChange={e => setFilterLobby(e.target.value)} className="px-3 bg-stone-100 border border-stone-300 rounded" />
      
          <label className="p-3 whitespace-nowrap text-right">Adresa</label>
          <input type="text" placeholder="Hladikova 25, Bratislava" value={filterAddress} onChange={e => setFilterAddress(e.target.value)} className="px-3 bg-stone-100 border border-stone-300 rounded" />
      
          <label className="p-3 whitespace-nowrap text-right">Začiatok</label>
          <input type="datetime-local" placeholder="Začiatok" value={filterBeginDate} onChange={e => setFilterBeginDate(e.target.value)} className="px-3 bg-stone-100 border border-stone-300 rounded" />
          
          <div className="col-span-2 flex justify-end">
            <button onClick={handleFilter} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Filtrovať</button>
          </div>
        </div>
        <div className="text-left">
        {isFiletered && <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Reset filtra</button>}
        </div>
      </div>
    );
    
    
};

export default EventFilter;
