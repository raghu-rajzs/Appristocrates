from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import date, timedelta
import random
import statistics

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data model for incoming hotel room request
class HotelRequest(BaseModel):
    location: str
    roomType: str
    checkIn: int
    checkOut: int
    amenities: List[str]

# Base price logic
def get_base_price(room_type: str) -> int:
    base_prices = {
        "Standard": 2200,
        "Deluxe": 3000,
        "Suite": 4500
    }
    return base_prices.get(room_type, 2800)

# Adjust price based on number of amenities (with more impact)
def apply_amenities(price: int, amenities: List[str]) -> int:
    # For example, each amenity now adds ₹150 to the price
    return price + len(amenities) * 150  # Increased the value per amenity

# Simulated historical pricing data
def generate_historical_prices(base_price: int, days: int = 7):
    today = date.today()
    return [
        {
            "date": (today - timedelta(days=i)).isoformat(),
            "price": base_price + random.randint(-250, 250)
        }
        for i in reversed(range(1, days + 1))
    ]

# Simple trend-based forecast (adjusted to ensure price is within range)
def forecast_today(trends: List[dict], demand_level: int, price_range: tuple) -> int:
    prices = [t["price"] for t in trends]
    trend_factor = (prices[-1] - prices[0]) / len(prices)
    
    # Calculate forecasted price
    forecast = int(prices[-1] + trend_factor)
    
    # Ensure forecasted price is within the historical price range
    forecast = max(min(forecast, price_range[1]), price_range[0])
    
    # Adjust forecast based on demand level (e.g., higher demand -> higher price)
    demand_factor = (demand_level - 50) / 100  # Normalize demand between -0.5 and 0.45
    adjusted_forecast = int(forecast * (1 + demand_factor))
    
    # Ensure the adjusted forecast is still within the price range
    adjusted_forecast = max(min(adjusted_forecast, price_range[1]), price_range[0])
    
    return adjusted_forecast

# Generate varied AI-style recommendations
def generate_ai_recommendation(location: str, forecast_price: int, room_type: str) -> str:
    templates = [
        f"📊 Based on current pricing dynamics in {location}, the estimated rate for your {room_type} room today is ₹{forecast_price}. You may consider adjusting slightly based on local competition and room availability.",
        f"🤖 The AI model suggests a forecasted price of ₹{forecast_price} for a {room_type} room in {location}. Consider monitoring demand and nearby hotel rates before finalizing.",
        f"💡 Given the trends in {location}, a smart pricing strategy for your {room_type} room would set today's rate at approximately ₹{forecast_price}. Adjustments may be necessary depending on occupancy levels.",
        f"📈 Our analysis recommends a price of ₹{forecast_price} for your {room_type} room in {location}. Fine-tuning it based on real-time booking trends can help optimize your revenue.",
        f"🧠 Today’s forecast for {room_type} rooms in {location} is ₹{forecast_price}. For best results, consider this as a baseline and tweak based on seasonality or local events."
    ]
    return random.choice(templates)

# API route
@app.post("/estimate")
async def estimate_price(data: HotelRequest):
    base = get_base_price(data.roomType)
    adjusted = apply_amenities(base, data.amenities)  # Now with a higher impact of amenities

    historical = generate_historical_prices(adjusted)
    price_range = (
        min([p["price"] for p in historical]),
        max([p["price"] for p in historical])
    )
    
    demand_level = random.randint(30, 95)  # Simulated demand % (30% - 95%)

    # Forecast the price considering the demand level and price range
    today_forecast = forecast_today(historical, demand_level, price_range)

    return {
        "price_range": price_range,
        "trends": historical,
        "forecast_price": today_forecast,
        "demand_level": demand_level,  # Include demand level for transparency
        "recommendation": generate_ai_recommendation(
            data.location, today_forecast, data.roomType
        )
    }
