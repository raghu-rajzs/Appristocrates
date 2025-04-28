import { useState } from 'react';
import HotelForm from './components/HotelForm';
import Dashboard from './components/Dashboard';

function App() {
  const [formData, setFormData] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleFormSubmit = async (data) => {
    setFormData(data);

    const modAmenities = data.amenities ? data.amenities?.join() : '';
    const modCheckIn = data?.checkIn ? `${data?.checkIn}:00` : '';
    const modCheckOut = data?.checkOut ? `${data?.checkOut}:00` : '';

    const testPayload = {
      hotel_name: data?.hotelName || '',
      distance_from_city_center: data?.distanceFromCityCenter || 0,
      amenities: modAmenities,
      location: data?.location || '',
      type_of_room: data?.roomType || '',
      check_in_time: modCheckIn,
      check_out_time: modCheckOut
    }

    try {
      const response = await fetch('http://localhost:8000/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responsePredictPrice = await fetch('http://localhost:8000/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });

      const responsePredictToday = await fetch('http://localhost:8000/predict-today', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });

      const result = await response.json();
      const resultPredictPrice = await responsePredictPrice?.json()
      const resultPredictToday = await responsePredictToday?.json()
      setResultData({
        ...result,
        predictPrice: resultPredictPrice,
        predictToday: resultPredictToday
      });
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
