import React from 'react';

interface SeatDetailsProps {
  row: number;
  seat: number;
  price: number;
  state: string;
  x: number;
  y: number;
}

const SeatDetails: React.FC<SeatDetailsProps> = ({ row, seat, price, state, x, y }) => {
  let stateText = state;
  let stateColor = '';
  let borderColor = '';

  //nastavenie farby podľa stavu + predkad zo eng do sk
  switch (state) {
    case 'selected':
      stateText = 'zvolené';
      stateColor = 'text-orange-300 font-bold'
      borderColor = 'border-orange-300';
      break;
    case 'sold':
      stateText = 'predané';
      stateColor = 'text-red-600 font-bold';
      borderColor = 'border-red-600';
      break;
    case 'free':
      stateText = 'voľné';
      stateColor = 'text-green-600 font-bold';
      borderColor = 'border-green-600';
      break;
    default:
      break;
  }

  return (
    <div className="absolute" style={{ left: x, top: y }}>
        <div className={`bg-white text-black p-2 rounded shadow ${borderColor}`} style={{ borderWidth: '2px' }}>
        <p>Rad: {row}</p>
        <p>Sedadlo: {seat}</p>
        <p>Cena: {price}</p>
        <p>Stav: <span className={stateColor}>{stateText}</span></p>
      </div>
    </div>
  );
};

export default SeatDetails;
