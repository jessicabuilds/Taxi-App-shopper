import { Routes, Route } from 'react-router-dom';
import { RideRequest } from './pages/RideRequest';
import { RideConfirm } from './pages/RideConfirm';
import { RideHistory } from './pages/RideHistory';
import { RideProvider } from './context/rideContext';

function App() {
  return (
    <RideProvider>
      <Routes>
        <Route path="/" element={<RideRequest />} />
        <Route path="/confirm" element={<RideConfirm />} />
        <Route path="/history" element={<RideHistory />} />
      </Routes>
    </RideProvider>
  );
}

export default App;
