import { useState } from 'react';
import HotelForm from './components/HotelForm';
import Dashboard from './components/Dashboard';
import { getPricingPrediction } from './api/pricingAPI';

function App() {
  const [formData, setFormData] = useState(null);
  const [backendData, setBackendData] = useState(null);

  const handleResult = async (form) => {
    setFormData(form);
    const result = await getPricingPrediction(form);
    setBackendData(result);
  };

  return (
    <div>
      {!formData || !backendData ? (
        <HotelForm onResult={handleResult} />
      ) : (
        <Dashboard formData={formData} backendData={backendData} />
      )}
    </div>
  );
}

export default App;
