import { useState } from 'react';
import SeatDetails from "./SeatDetails"

interface Seat {
  state: string;
  cost: number;
  row: number;
  seat: number;
  isHovered: boolean
}

interface SeatGridProps {
  numOfRows: number;
  numOfSeats: number;
  prices: string;
}

interface Price {
  numOfSeats: number;
  totalPrice: number;
}

const SeatGrid = ({ numOfRows, numOfSeats, prices }: SeatGridProps) => {
  const [seatStatuses, setSeatStatuses] = useState<Seat[]>(() => {
    const initialSeatStatuses: Seat[] = [];

    const priceArray = prices.split(',').map(price => parseFloat(price));
    for (let i = 0; i < numOfRows * numOfSeats; i++) {
      const randomPriceIndex = Math.floor(Math.random() * priceArray.length);
      const randomPrice = priceArray[randomPriceIndex];
      const randomState = Math.random() < 0.5 ? 'sold' : 'free';
      initialSeatStatuses.push({ state: randomState, cost: randomPrice, row: Math.floor(i / numOfSeats) + 1, seat: (i % numOfSeats) + 1, isHovered: false });
    }

    return initialSeatStatuses;
  });

  const [selectedSeats, setSelectedSeats] = useState<Price>({ numOfSeats: 0, totalPrice: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleSelectSeat = (index: number) => {
    const newSeatStatuses = [...seatStatuses];

    if (newSeatStatuses[index].state === 'sold') {
      return;
    }

    newSeatStatuses[index].state = newSeatStatuses[index].state === 'free' ? 'selected' : 'free';
    setSeatStatuses(newSeatStatuses);

    const newTotalSeatPrice = newSeatStatuses.reduce((total, seat) => {
      return seat.state === 'selected' ? total + seat.cost : total;
    }, 0);
    setSelectedSeats({ numOfSeats: newSeatStatuses.filter(seat => seat.state === 'selected').length, totalPrice: newTotalSeatPrice });
  };

  const handleSeatHover = (index: number) => {
    const newSeatStatuses = [...seatStatuses];
    newSeatStatuses[index].isHovered = true;
    setSeatStatuses(newSeatStatuses);
  };
  
  const handleSeatLeave = (index: number) => {
    const newSeatStatuses = [...seatStatuses];
    newSeatStatuses[index].isHovered = false;
    setSeatStatuses(newSeatStatuses);
  };

  const generateSeatChunk = (startRow: number, endRow: number, startSeat: number, endSeat: number) => {
    const seats = [];
    const headerRow = [];
    headerRow.push(<div key="empty" className="seat"></div>); // Empty space for row numbers
    for (let seat = startSeat; seat < endSeat; seat++) {
      headerRow.push(<div key={`seat-${seat}`} className="seat seat-number">{seat + 1}</div>);
    }
    seats.push(<div key="header" className="seat-row header">{headerRow}</div>);
    for (let row = startRow; row < endRow; row++) {
      const rowSeats = [];
      rowSeats.push(<div key={`row-${row}`} className="seat row-number">{row + 1}</div>);
      for (let seat = startSeat; seat < endSeat; seat++) {
        const index = row * numOfSeats + seat;
        rowSeats.push(
          <div
            key={index}
            className={`seat ${seatStatuses[index].state}`}
            onMouseEnter={() => handleSeatHover(index)}
            onMouseLeave={() => handleSeatLeave(index)}
            onMouseMove={handleMouseMove}
            onClick={() => handleSelectSeat(index)}
            style={{ cursor: seatStatuses[index].isHovered ? 'pointer' : 'auto' }}
          >
            {seatStatuses[index].isHovered && (
              <SeatDetails
                row={seatStatuses[index].row}
                seat={seatStatuses[index].seat}
                price={seatStatuses[index].cost}
                state={seatStatuses[index].state}
                x={mousePosition.x}
                y={mousePosition.y}
              />        
            )}
            <div className="seat-price">{index + 1}</div>
          </div>
        );
      }
      seats.push(
        <div key={`seat-row-${row}`} className="seat-row">
          {rowSeats}
        </div>
      );
    }

    return seats;
  };

  const generateSeats = (rowSize : number, seatSize: number) => {
    const seatChunks = [];

    for (let i = 0; i < numOfRows; i += rowSize) {
      for (let j = 0; j < numOfSeats; j+= seatSize){
      seatChunks.push(
        <div key={`chunk-${i}-${j}`} className="seat-chunk">
          {generateSeatChunk(i, Math.min(i + rowSize, numOfRows), j, Math.min(j + seatSize, numOfSeats))}
        </div>
      );
      }
    }

    return seatChunks;
  };

  return (
    <div className="seat-container">
      <h3 className="text-center font-bold mb-4">Hladisko</h3>
      <div className="seat-flex-container">{generateSeats(8, 8)}</div>
      <div className="selected-info-container border-gray-400 border-solid border rounded-lg p-4 mt-4">
        <h2 className="text-xl font-bold">Vybrané sedadlá: {selectedSeats.numOfSeats}</h2>
        <h2 className="text-xl font-bold ml-4">Cena spolu: {selectedSeats.totalPrice}</h2>
      </div>
    </div>
  );
};

export default SeatGrid;
