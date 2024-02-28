import { useEffect } from 'react';
import './App.css'
import EventList  from "../src/components/EventList"
import EventView from "../src/components/EventView"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store/eventStore'
import { fetchEvents } from './reducers/eventSlice';

function App() {

  useEffect(() => {
    store.dispatch(fetchEvents());
    console.log("fetching events")
  }, []); //fetch dat z api na začiatku
  return (
    <Provider store={store}>
      <Router>
        <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/:eventId" element={<EventView />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
