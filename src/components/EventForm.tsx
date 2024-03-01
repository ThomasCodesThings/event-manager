import React, { useEffect } from 'react';
import { addEvent, editEvent } from '../reducers/eventSlice';
import { IEvent } from '../interfaces/interfaces';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../hooks/hooks';

interface EventFormProps {
  event: IEvent | null;
  visible: boolean;
  onClose: () => void;
}

const EventForm = ({ event, visible, onClose }: EventFormProps) => {
  const { register, handleSubmit, setValue, formState: { dirtyFields, errors }, reset } = useForm<IEvent>({
    defaultValues: { id: 0, title: '', lobby: '', address: '', beginDate: '', prices: '', numOfRows: 0, numOfSeats: 0 },
    mode: 'onBlur'
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (event) {
      setValue('id', event.id);
      setValue('title', event.title);
      setValue('lobby', event.lobby);
      setValue('address', event.address);
      setValue('beginDate', event.beginDate);
      setValue('prices', event.prices);
      setValue('numOfRows', event.numOfRows);
      setValue('numOfSeats', event.numOfSeats);
    } else {
      reset();
    }
  }, [event]);

  const handleOnClose = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>) => {
    if ((e.target as HTMLElement).id === 'bg' || (e.target as HTMLElement).id === 'x-btn') {
      reset();
      onClose();
    }
  };
  
  const validateTitle = (value: string) => {
    if (value.trim() === '') {
      return 'Názov nesmie byť prázdny';
    }
    return true;
  };

  const validateLobby = (value: string) => {
    if (value.trim() === '') {
      return 'Hladisko nesmie byť prázdne';
    }
    return true;
  };

  const validateAddress = (value: string) => {
    if (value.trim() === '') {
      return 'Adresa nesmie byť prázdna';
    }
    return true;
  };

  const validateBeginDate = (value: string) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Neexistujúci dátum';
    }
    return true;
  }

  const validatePrices = (value: string) => {
    const prices = value.split(',').map(price => parseFloat(price));
    if (prices.some(price => isNaN(price))) {
      return 'Nesprávny znak';
    }

    if (prices.some(price => price <= 0)) {
      return 'Cena musí byť viac ako 0';
    }
    
    return true;
  };

  const validateRows = (value: number) => {
    return value > 0 ? true : 'Počet radov musí byť väčší ako 0';
  }
  
  const validateSeats = (value: number) => {
    return value > 0 ? true : 'Počet sedadiel musí byť väčší 0';
  }

  const onSubmit = (data: IEvent) => {
    data.beginDate = new Date(data.beginDate).toISOString().replace(/T/, ' ').replace(/\..+/, '');
    if (data.id === 0) {
      dispatch(addEvent(data));
    } else {
      dispatch(editEvent(data));
    }
    reset();
    onClose();
  };

  if (!visible) {
    return null;
  }

  return (
    <div id="bg" className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-10" onClick={handleOnClose}>
      <div className="bg-white p-6 rounded-md w-11/12 sm:w-11/12 md:w-11/12 lg:w-10/12 xl:w-10/12 2xl:w-10/12 h-auto sm:h-auto md:h-auto lg:h-auto xl:h-auto 2xl:h-auto relative max-h-screen overflow-y-scroll">
        <button id="x-btn" className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800 font-bold mr-2 mt-2" onClick={handleOnClose}>X</button>
        <h1 className="text-center font-bold mb-4">{event ? 'Úprava eventu ' + event.id.toString(): 'Pridanie nového eventu'}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="mb-4 sm:col-span-1 md:col-span-1">
            <label htmlFor="title" className="block">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Najlepsi event"
              {...register('title', { required: "Toto pole je povinné!", validate: validateTitle })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500}`}
            />
             <span className="text-red-500">{errors.title?.message}</span>
             {(dirtyFields.title && !errors.title) && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="mb-4 sm:col-span-1 md:col-span-1">
            <label htmlFor="lobby" className="block">Hladisko</label>
            <input
              type="text"
              id="lobby"
              placeholder="A"
              {...register('lobby', { required: "Toto pole je povinné!", validate: validateLobby })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 `}
            />
            {errors.lobby && <span className="text-red-500">{errors.lobby?.message}</span>}
            {(dirtyFields.lobby && !errors.lobby) && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="mb-4 sm:col-span-1 md:col-span-1">
            <label htmlFor="address" className="block">Adresa</label>
            <input
              type="text"
              id="address"
              placeholder="Bajkalska 10, Bratislava"
              {...register('address', { required: "Toto pole je povinné!", validate: validateAddress })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 `}
            />
            {errors.address && <span className="text-red-500">{errors.address?.message}</span>}
             {(dirtyFields.address && !errors.address) && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="mb-4 sm:col-span-1 md:col-span-1">
            <label htmlFor="beginDate" className="block">Začiatok</label>
            <input
              type="datetime-local"
              id="beginDate"
              placeholder={new Date().toISOString().slice(0, 16)}
              {...register('beginDate', { required: "Toto pole je povinné!", validate: validateBeginDate })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500`}
            />
            {errors.beginDate && <span className="text-red-500">{errors.beginDate?.message}</span>}
             {(dirtyFields.beginDate && errors.beginDate) && <span className="text-red-500">{errors.beginDate.message}</span>}
             {(dirtyFields.beginDate && !errors.beginDate) && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="mb-4 sm:col-span-1 md:col-span-1">
            <label htmlFor="prices" className="block">Ceny</label>
            <input
              type="text"
              id="prices"
              placeholder="10, 20, 50"
              {...register('prices', { required: "Toto pole je povinné!", validate: validatePrices})}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 `}
            />
            {errors.numOfRows && <span className="text-red-500">{errors.numOfRows.message}</span>}
              {(dirtyFields.prices && errors.prices) && <span className="text-red-500">{errors.prices.message}</span>}
              {(dirtyFields.prices && !errors.prices) && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="mb-4 sm:col-span-1 md:col-span-1">
            <label htmlFor="numOfRows" className="block">Počet radov</label>
            <input
              type="number"
              id="numOfRows"
              placeholder="10"
              {...register('numOfRows', { required: "Toto pole je povinné!", validate: validateRows })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 `}
              />
              {errors.numOfRows && <span className="text-red-500">{errors.numOfRows.message}</span>}
              {(dirtyFields.numOfRows && errors.numOfRows) && <span className="text-red-500">{errors.numOfRows.message}</span>}
               {(dirtyFields.numOfRows && !errors.numOfRows) && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="mb-4 sm:col-span-1 md:col-span-1">
            <label htmlFor="numOfSeats" className="block">Počet sediadiel (v rade)</label>
            <input
              type="number"
              id="numOfSeats"
              placeholder="20"
              {...register('numOfSeats', { required: "Toto pole je povinné!", validate: validateSeats })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 `}
              />
              {errors.numOfSeats && <span className="text-red-500">{errors.numOfSeats.message}</span>}
            {(dirtyFields.numOfSeats && errors.numOfSeats) && <span className="text-red-500">{errors.numOfSeats.message}</span>}
               {(dirtyFields.numOfSeats && !errors.numOfRows) && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="text-center sm:col-span-1 md:col-span-3">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Uložiť</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
