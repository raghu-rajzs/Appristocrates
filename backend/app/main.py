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

# import openai
# import numpy as np
# import pandas as pd
# from sklearn.linear_model import LinearRegression
# from sklearn.model_selection import train_test_split
# import os

# # Retrieve the API key from the environment variable
# openai.api_key = os.getenv("OPENAI_API_KEY")

# # Sample historical data (replace with actual data)
# data = {
#     'demand_level': [60, 75, 50, 80, 65],
#     'season': ['low', 'high', 'low', 'high', 'medium'],
#     'competitor_price': [2000, 2500, 1800, 2700, 2200],
#     'forecast_price': [2100, 2600, 1900, 2800, 2300],
#     'actual_price': [2150, 2650, 1950, 2750, 2350]
# }

# df = pd.DataFrame(data)

# # Feature engineering
# df['season_high'] = df['season'].apply(lambda x: 1 if x == 'high' else 0)
# X = df[['demand_level', 'season_high', 'competitor_price', 'forecast_price']]
# y = df['actual_price']

# # Train a simple linear regression model
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
# model = LinearRegression()
# model.fit(X_train, y_train)

# # Function to generate AI-based recommendation
# def generate_pricing_recommendation(input_data):
#     # Predict the price using the trained model
#     predicted_price = model.predict([input_data])[0]
    
#     # Generate a detailed explanation using OpenAI's GPT model
#     explanation_prompt = f"Given the following hotel pricing factors: Demand Level: {input_data[0]}, Season: {'high' if input_data[1] == 1 else 'low'}, Competitor Price: ₹{input_data[2]}, Forecast Price: ₹{input_data[3]}, provide a detailed explanation for the recommended price of ₹{predicted_price:.2f}."
    
#     response = openai.Completion.create(
#         engine="text-davinci-003",
#         prompt=explanation_prompt,
#         max_tokens=150
#     )
    
#     explanation = response.choices[0].text.strip()
#     return predicted_price, explanation

# # Example input data: [demand_level, season_high, competitor_price, forecast_price]
# input_data = [70, 1, 2400, 2500]
# recommended_price, explanation = generate_pricing_recommendation(input_data)

# print(f"Recommended Price: ₹{recommended_price:.2f}")
# print(f"Explanation: {explanation}")
