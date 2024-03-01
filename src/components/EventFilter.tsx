import React, { useState, Dispatch, SetStateAction } from 'react';
import { IEvent } from '../interfaces/interfaces';

interface EventFilterProps {
    events: IEvent[];
    visible: boolean;
    setEvents: Dispatch<SetStateAction<IEvent[]>>;
    onClose: () => void;
}

const EventFilter: React.FC<EventFilterProps> = ({ events, visible, setEvents, onClose }) => {
    const [filterTitle, setFilterTitle] = useState('');
    const [filterLobby, setFilterLobby] = useState('');
    const [filterAddress, setFilterAddress] = useState('');
    const [filterBeginDate, setFilterBeginDate] = useState(() => { //default hodnota zobrazenia času ako string
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hour = String(currentDate.getHours()).padStart(2, '0');
        const minute = String(currentDate.getMinutes()).padStart(2, '0');
        const second = String(currentDate.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    });

    const [isFiletered, setIsFiltered] = useState(false); //uložene stavu či som filtroval už alebo nie

    const handleFilter = () => {
      let filteredEvents: any[] = [...events]; // Assume events is an array of objects
  
      const filters = [
          { key: 'title', value: filterTitle },
          { key: 'lobby', value: filterLobby },
          { key: 'beginDate', value: filterBeginDate }
      ];
  
      filteredEvents = filteredEvents.filter((event: any) => {
          return filters.every(filter => {
              if (!filter.value) return true; // Skip if filter value is empty
              if (filter.key === 'beginDate') {
                  return new Date(event[filter.key]) >= new Date(filter.value);
              } else {
                  return event[filter.key]?.toLowerCase().includes(filter.value.toLowerCase());
              }
          });
      });
  
      setEvents(filteredEvents);
      setIsFiltered(true);
  };
      
    const resetFilters = () => {
        setFilterTitle('');
        setFilterLobby('');
        const currentDate = new Date(); //set datumu na súčasny
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
        onClose();
    }

    return (
      <div style={{ display: visible ? 'block' : 'none' }} className="p-4 border rounded relative grid grid-cols-5 gap-4">
      <button onClick={handleClose} className="absolute top-0 right-0 text-gray-600 hover:text-gray-800 font-bold mr-2 mt-2">X</button>
      
      <div className="flex flex-row mb-4">
        <label className="mr-2">Názov</label>
        <input type="text" placeholder="Názov" value={filterTitle} onChange={e => setFilterTitle(e.target.value)} />
      </div>
      
      <div className="flex flex-row mb-4">
        <label className="mr-2">Hladisko</label>
        <input type="text" placeholder="Hladisko" value={filterLobby} onChange={e => setFilterLobby(e.target.value)} className="flex-1" />
      </div>
      
      <div className="flex flex-row mb-4">
        <label className="mr-2">Adresa</label>
        <input type="text" placeholder="Adresa" value={filterAddress} onChange={e => setFilterAddress(e.target.value)} className="flex-1" />
      </div>
      
      <div className="flex flex-row mb-4">
        <label className="mr-2">Začiatok</label>
        <input type="datetime-local" placeholder="Začiatok" value={filterBeginDate} onChange={e => setFilterBeginDate(e.target.value)} className="flex-1" />
      </div>
      
      <div className="flex justify-between col-span-2">
        <button onClick={handleFilter} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Filtrovať</button>
        {isFiletered && <button onClick={handleReset} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Reset filtra</button>}
      </div>
    </div>
    
      );
};

export default EventFilter;
