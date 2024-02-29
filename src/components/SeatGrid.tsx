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

    const priceArray = prices.split(',').map(price => parseFloat(price)); //premapovanie cien z ulozeneho stringu na pole floatov
    for (let i = 0; i < numOfRows * numOfSeats; i++) {
      const randomPriceIndex = Math.floor(Math.random() * priceArray.length);
      const randomPrice = priceArray[randomPriceIndex]; //nastavenie random ceny
      const randomState = Math.random() < 0.5 ? 'sold' : 'free'; //nastavenie random stateu
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

    if (newSeatStatuses[index].state === 'sold') { //ak je miesto predane nemôžeme robiť nič
      return;
    }

    //prenastavenie sedadiel z volnych na selectnutych a naopak
    newSeatStatuses[index].state = newSeatStatuses[index].state === 'free' ? 'selected' : 'free';
    setSeatStatuses(newSeatStatuses);

    //vypocet ceny
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

  //generovanie 
  const generateSeats = () => {
    const seats = [];
    let seatIndex = 0;
    
    //generovanie proradových čísel radov
    const rowNumbers = Array.from({ length: numOfRows }, (_, index) => index + 1);
  
    //generovanie poradových čísel sedadiel
    const headerRow = [];
    headerRow.push(<div key="empty" className="seat"></div>); //prazdny priestor
    for (let seat = 0; seat < numOfSeats; seat++) {
      headerRow.push(<div key={`seat-${seat}`} className="seat seat-number">{seat + 1}</div>);
    }
    seats.push(<div key="header" className="seat-row header">{headerRow}</div>);
  
    //generovane rozloženia sedadiel
    for (let row = 0; row < numOfRows; row++) {
      const rowSeats = [];
      // generovanie poradových čísel sedadiel
      rowSeats.push(<div key={`row-${row}`} className="seat row-number">{rowNumbers[row]}</div>);
      for (let seat = 0; seat < numOfSeats; seat++) {
        const index = seatIndex++;
        rowSeats.push(
          <div
          key={index}
          className={`seat ${seatStatuses[index].state}`} //farba podla stateu
          onMouseEnter={() => handleSeatHover(index)}
          onMouseLeave={() => handleSeatLeave(index)}
          onMouseMove={handleMouseMove}
          onClick={() => handleSelectSeat(index)}
          style={{ cursor: seatStatuses[index].isHovered ? 'pointer' : 'auto' }} //nastavenie kurzora
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
          <div className="seat-price">{(row * numOfSeats) + seat + 1}</div>
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
  

  return (
    <div className="seat-container">
  <h3 className="text-center font-bold mb-4">Hladisko</h3>
  <div className="seat-grid">{generateSeats()}</div>
  <div className="selected-info-container border-gray-400 border-solid border rounded-lg p-4 mt-4">
<h2 className="text-xl font-bold">Vybrané sedadlá: {selectedSeats.numOfSeats}</h2>
<h2 className="text-xl font-bold ml-4">Cena spolu: {selectedSeats.totalPrice}</h2>
</div>
</div>

  );
};

export default SeatGrid;
