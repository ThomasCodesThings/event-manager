import React, { useState, useEffect } from 'react';
import { RootState } from '../store/eventStore';
import { removeEvent } from '../reducers/eventSlice';
import { Link } from 'react-router-dom';
import { IEvent } from '../interfaces/interfaces';
import EventForm from './EventForm';
import EventFilter from './EventFilter';
import Spinner from './Spinner';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';

const EventList = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state: RootState) => state);

  useEffect(() => {
    if (data.event.data) {
      setEvents(data.event.data);
      setFetchedEvents(data.event.data);
    }
  }, [data.event.data]);

  const [event, setEvent] = useState<IEvent | null>(null);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [fetchedEvents, setFetchedEvents] = useState<IEvent[]>([]);

  const [showEventForm, setShowEventForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  if (data.event.isLoading){
    return <Spinner />;
  }

  if (data.event.error){
    return <div>Error: {data.event.error}</div>;
  }

  const handleAddEvent = () => {
    setEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: IEvent) => {
    setEvent(event);
    setShowEventForm(true);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilterCLose = () => {
    setEvents(fetchedEvents);
    setShowFilter(false);
  };

  const handleFilterReset = () => {
    setEvents(fetchedEvents);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    if (value === '') {
      setEvents(fetchedEvents);
      return;
    }
    const filteredEvents = fetchedEvents.filter(event =>
      event.title.toLowerCase().includes(value)
    );
    setEvents(filteredEvents);
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Eventy</h2>
      <input type="text" placeholder="Vyhľadávanie" className="px-4 py-2 border border-gray-300 rounded-md" onChange={handleSearch} />
      <div className="flex justify-between items-center mt-2 mb-2">
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md" onClick={handleAddEvent}>Vytvorenie eventu</button>
        <EventForm event={event} visible={showEventForm} onClose={() => setShowEventForm(false)} />
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md" onClick={toggleFilter}>Filter</button>
      </div>
      <EventFilter events={events} visible={showFilter} setEvents={setEvents} onClose={handleFilterCLose} onReset={handleFilterReset} />
      <div className="overflow-x-auto shadow hidden xl:block">
        <div className="inline-block rounded-xl min-w-full">
          <div className="overflow-hidden">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Názov</th>
                  <th scope="col" className="px-6 py-3">Hladisko</th>
                  <th scope="col" className="px-6 py-3">Adresa</th>
                  <th scope="col" className="px-6 py-3">Začiatok</th>
                  <th scope="col" className="px-6 py-3">Operácie</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event: IEvent, index: number) => (
                  <tr key={index}>
                    <td className="text-black-500 hover:font-bold px-6 py-4 whitespace-nowrap">
                      <Link to={`/${event.id}`}>{event.title}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.lobby}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{event.beginDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-500 hover:text-blue-900 mr-2" onClick={()=> handleEditEvent(event)}>Upraviť</button>
                      <button className="text-red-500 hover:text-red-900" onClick={() => dispatch(removeEvent(event))}>Vymazať</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:hidden">
  {events.map((event: IEvent, index: number) => (
    <div key={index} className="border border-gray-200 rounded shadow p-4">
      <h3 className="text-black-500 hover:font-bold truncate"> <Link to={`/${event.id}`}>{event.title}</Link></h3>
      <p className="truncate">{event.lobby}</p>
      <p className="truncate">{event.address}</p>
      <p className="truncate">{event.beginDate}</p>
      <div>
        <button className="text-blue-500 hover:text-blue-900 mr-2" onClick={()=> handleEditEvent(event)}>Upraviť</button>
        <button className="text-red-500 hover:text-red-900" onClick={() => dispatch(removeEvent(event))}>Vymazať</button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default EventList;
