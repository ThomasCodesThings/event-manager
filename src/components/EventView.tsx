import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/eventStore';
import SeatGrid from './SeatGrid';

const EventView = () => {
  const { eventId } = useParams<{ eventId?: string }>();
  const navigate = useNavigate();
  const events = useSelector((state: RootState) => state.event.data);

  if (!eventId) {
    return <div>Chýba ID eventu</div>;
  }

  const event = events.find((event) => event.id === parseInt(eventId));

  if (!event) {
    return <div>Event nenájdený!</div>;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
    <div className="flex flex-col items-start">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleBack}>
        Späť
      </button>
      <h1 className="text-2xl font-bold mb-4 break-all">
        Event ID: {eventId} - {event.title}
      </h1>
    </div>
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap w-full">
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <p className="font-bold">Hladisko:</p>
          <p className="break-all">{event.lobby}</p>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <p className="font-bold">Adresa:</p>
          <p className="break-all">{event.address}</p>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <p className="font-bold">Začiatok:</p>
          <p className="break-all">{event.beginDate}</p>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <p className="font-bold">Ceny:</p>
          <p className="break-all">{event.prices}</p>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <p className="font-bold">Počet radov:</p>
          <p className="break-all">{event.numOfRows}</p>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 p-4">
          <p className="font-bold">Počet sedadiel:</p>
          <p className="break-all">{event.numOfSeats}</p>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <SeatGrid numOfRows={event.numOfRows} numOfSeats={event.numOfSeats} prices={event.prices} />
      </div>
    </div>
    </div>
  );
};

export default EventView;
