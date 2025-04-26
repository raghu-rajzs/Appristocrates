import { useState } from 'react';
import HotelForm from './components/HotelForm';
import Dashboard from './components/Dashboard';

function App() {
  const [formData, setFormData] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleFormSubmit = async (data) => {
    setFormData(data);

    try {
      const response = await fetch('http://localhost:8000/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setResultData(result);
    } catch (err) {
      console.error('Backend error:', err);
    }
  };

  const handleBack = () => {
    setResultData(null);
    setFormData(null);
  };
  

  return (
    <>
      {!resultData ? (
        <HotelForm onResult={handleFormSubmit} />
      ) : (
        <Dashboard formData={formData} resultData={resultData} onBack={handleBack} />
      )}
    </>
  );
}

export default App;
