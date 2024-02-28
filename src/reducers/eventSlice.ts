import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IEvent } from "../interfaces/interfaces";

//async trunk na fetchovanie eventov
export const fetchEvents = createAsyncThunk(
  'fetchEvents',
  async () => {
    try {
      const response = await fetch('https://www.ticketportal.sk/xml/out/partnerall.xml?ID_partner=37');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlText, 'text/xml');
      const events = xml.getElementsByTagName('event');
      let eventsArray: IEvent[] = [];

      const regex = /\b\d+\.\d+\b/g; //regex na ceny zo stringov vo formate "X.XX"
      for (let i = 0; i < events.length; i++) {
        const titleElement = events[i].getElementsByTagName('nazov')[0];
        const lobbyElement = events[i].getElementsByTagName('hladisko')[0];
        const streetElement = events[i].getElementsByTagName('adresa')[0];
        const cityElement = events[i].getElementsByTagName('mesto')[0];
        const beginDateElement = events[i].getElementsByTagName('zaciatok')[0];
        const pricesElement = events[i].getElementsByTagName('ceny')[0];

        //extrahovanie
        const title = titleElement.textContent || '';
        const lobby = lobbyElement.textContent || '';
        const street = streetElement.textContent || '';
        const city = cityElement.textContent || '';
        let address = '';

        if (street && city) {
          address = `${street}, ${city}`;
        } else if (street) {
          address = street;
        } else if (city) {
          address = city;
        }

        const date = new Date(beginDateElement.textContent || '');
        const beginDate = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        const pricesMatch = pricesElement.textContent ? pricesElement.textContent.match(regex) : null;
        const prices = pricesMatch ? pricesMatch.map(price => parseFloat(price)) : [];

        eventsArray.push({
          id: i + 1,
          title: title,
          lobby: lobby,
          address: address,
          beginDate: beginDate,
          prices: prices.join(', '),
          numOfRows: 10,
          numOfSeats: 20,
        });
      }

      return eventsArray;

    } catch (error) {
      console.error('Error fetching XML:', error);
      throw error;
    }
  }
);

interface EventState {
  data: IEvent[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EventState = {
  data: [],
  isLoading: false,
  error: null
};

export const eventReducer = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<IEvent[]>) { //prenastavenie pola eventov v store
      state.data = action.payload;
    },
    addEvent(state, action: PayloadAction<IEvent>) { //pridanie eventu do store
      action.payload.id = state.data.length + 1;
      state.data.push(action.payload);
    },
    editEvent(state, action: PayloadAction<IEvent>) { //editacia eventu v store
      const index = state.data.findIndex(
        (event: IEvent) => event.id === action.payload.id
      );

      if (index){
        state.data[index] = action.payload;
      }
    },
    removeEvent(state, action: PayloadAction<{ id: number }>) { //vymazanie eventu
      const index = state.data.findIndex(
        (event: IEvent) => event.id === action.payload.id
      );
      if (index) {
        state.data.splice(index, 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null; 
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;    
        state.data = action.payload; //nastavenie fetchnutych dat
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || null;
      });
  },
});

export const { addEvent, editEvent, removeEvent } = eventReducer.actions;
export default eventReducer.reducer;
