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
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<IEvent>({
    defaultValues: { id: 0, title: '', lobby: '', address: '', beginDate: '', prices: '', numOfRows: 0, numOfSeats: 0 }, //defaultne hodnoty
    mode: 'onSubmit'
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (event) { //prednastavenie hodnôt
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
  }, [event, setValue, reset]);

  const handleOnClose = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>) => {
    if ((e.target as HTMLElement).id === 'bg' || (e.target as HTMLElement).id === 'x-btn') { //ak stlacim rozmazane pozadie alebo tlačidlo X tak sa okno zavrie
      reset(); //reset hodnot
      onClose(); //zatvorenie formulara
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
    if (data.id === 0) { //nove udaje maju setnnute id na o preto vieme rozpoznať či ideme vytvoriť novy objekt alebo upraviť existujúci
      dispatch(addEvent(data));
    } else {
      dispatch(editEvent(data));
    }
    reset(); //reset hodnôt na defaultné
    onClose(); //zatvorenie formulára
  };

  if (!visible) {
    return null;
  }

  return (
    <div id="bg" className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center" onClick={handleOnClose}>
      <div className="bg-white p-4 rounded w-72 relative">
        <button id="x-btn" className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800 font-bold mr-2 mt-2" onClick={handleOnClose}>X</button>
        <h1 className="text-center font-bold mb-4">Formulár</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="title" className="block">Title</label>
            <input
              type="text"
              id="title"
              {...register('title', { required: true, validate: validateTitle })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500}`}
            />
            {errors.title && <span className="text-red-500">{errors.title.message}</span>}
            {errors.root?.type === 'required' && <span className="text-red-500">Toto pole je povinné!</span>}
            {!errors.title && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="lobby" className="block">Hladisko</label>
            <input
              type="text"
              id="lobby"
              {...register('lobby', { required: true, validate: validateLobby })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 `}
            />
            {errors.lobby && <span className="text-red-500">{errors.lobby.message}</span>}
            {errors.root?.type === 'required' && <span className="text-red-500">Toto pole je povinné</span>}
            {!errors.lobby && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block">Adresa</label>
            <input
              type="text"
              id="address"
              {...register('address', { required: true, validate: validateAddress })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 `}
            />
            {errors.address && <span className="text-red-500">{errors.address.message}</span>}
            {errors.root?.type === 'required' && <span className="text-red-500">Toto pole je povinné</span>}
            {!errors.address && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="beginDate" className="block">Začiatok</label>
            <input
              type="datetime-local"
              id="beginDate"
              {...register('beginDate', { required: true, validate: validateBeginDate })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500`}
            />
            {errors.beginDate && <span className="text-red-500">{errors.beginDate.message}</span>}
            {errors.root?.type === 'required' && <span className="text-red-500">Toto pole je povinné</span>}
            {!errors.beginDate && <span className="text-green-500">✓ V poriadku</span>}
          </div>
         <div className="mb-4">
            <label htmlFor="prices" className="block">Ceny</label>
            <input
              type="text"
              id="prices"
              {...register('prices', { required: true, validate: validatePrices})}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 `}
            />
            {errors.prices && <span className="text-red-500">{errors.prices.message}</span>}
            {errors.root?.type === 'required' && <span className="text-red-500">Toto pole je povinné</span>}
            {!errors.prices && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="numOfRows" className="block">Počet radov</label>
            <input
              type="number"
              id="numOfRows"
              {...register('numOfRows', { required: true, validate: validateRows })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 `}
            />
            {errors.numOfRows && <span className="text-red-500">{errors.numOfRows.message}</span>}
            {errors.root?.type === 'required' && <span className="text-red-500">Toto pole je povinné</span>}
            {!errors.numOfRows && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="numOfSeats" className="block">Počet sediadiel (v rade)</label>
            <input
              type="number"
              id="numOfSeats"
              {...register('numOfSeats', { required: true, validate: validateSeats })}
              className={`w-full border rounded py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500 `}
            />
            {errors.numOfSeats && <span className="text-red-500">{errors.numOfSeats.message}</span>}
            {errors.root?.type === 'required' && <span className="text-red-500">Toto pole je povinné</span>}
            {!errors.numOfSeats && <span className="text-green-500">✓ V poriadku</span>}
          </div>
          <div className="text-center">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Uložiť</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
