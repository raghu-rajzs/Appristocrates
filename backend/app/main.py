from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import date, timedelta
import random
import statistics

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class HotelRequest(BaseModel):
    location: str
    roomType: str
    checkIn: int
    checkOut: int
    amenities: List[str]

# Utils
def get_base_price(room_type: str) -> int:
    base_prices = {
        "Standard": 2200,
        "Deluxe": 3000,
        "Suite": 4500
    }
    return base_prices.get(room_type, 2800)

def apply_amenities(price: int, amenities: List[str]) -> int:
    return price + len(amenities) * 100

def generate_historical_prices(base_price: int, days: int = 7):
    today = date.today()
    return [
        {
            "date": (today - timedelta(days=i)).isoformat(),
            "price": base_price + random.randint(-250, 250)
        }
        for i in reversed(range(1, days + 1))
    ]

def forecast_today(trends: List[dict]) -> int:
    prices = [t["price"] for t in trends]
    trend_factor = (prices[-1] - prices[0]) / len(prices)  # simple linear trend
    forecast = int(prices[-1] + trend_factor)
    return forecast

# Routes
@app.post("/estimate")
async def estimate_price(data: HotelRequest):
    base = get_base_price(data.roomType)
    adjusted = apply_amenities(base, data.amenities)

    historical = generate_historical_prices(adjusted)
    today_forecast = forecast_today(historical)

    price_range = (min([p["price"] for p in historical]), max([p["price"] for p in historical]))

    return {
    "price_range": price_range,
    "trends": historical,
    "forecast_price": today_forecast,
    "demand_level": random.randint(30, 95),  # Simulated % demand
    "recommendation": f"Forecasted price for today in {data.location} is ₹{today_forecast}. Adjust based on occupancy and competitor rates."
}
