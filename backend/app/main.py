from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from playwright.async_api import async_playwright
import asyncio
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
import requests
from pytrends.request import TrendReq
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
        "price_range": (120, 170),
        "trends": [
            {"date": "2025-04-27", "price": 120},
            {"date": "2025-04-28", "price": 130},
            {"date": "2025-04-29", "price": 145},
        ]
    }
#########################################################################################
# Global variables for dataset, model, label_encoders
df = None
model = None
label_encoders = {}

class HotelFeatures(BaseModel):
    hotel_name: str
    location: str
    amenities: str
    distance_from_city_center: float
    type_of_room: str
    check_in_time: str
    check_out_time: str

@app.on_event("startup")
async def load_model_and_data():
    global df, model, label_encoders

    # Load dataset
    df = pd.read_csv('hotel_price_dataset_with_name.csv')

    # Preprocess categorical columns
    categorical_cols = ['Hotel Name', 'Location', 'Amenities', 'Type of Room', 'Day of the Week', 'Check-in Time', 'Check-out Time']
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le

    # Features and target
    X = df.drop('Hotel Price (INR)', axis=1)
    y = df['Hotel Price (INR)']

    # Train XGBoost model
    model = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, random_state=42)
    model.fit(X, y)

def safe_label_encode(le, value):
    if value in le.classes_:
        return le.transform([value])[0]
    else:
        le.classes_ = np.append(le.classes_, value)
        return le.transform([value])[0]

@app.post("/predict-today")
async def predict_today(features: HotelFeatures):
    global model, label_encoders

    today = datetime.now()
    day_of_week = today.strftime('%A')

    input_data = pd.DataFrame({
        'Hotel Name': [features.hotel_name],
        'Location': [features.location],
        'Amenities': [features.amenities],
        'Distance from City Center (km)': [features.distance_from_city_center],
        'Type of Room': [features.type_of_room],
        'Hotel Star Rating': [get_hotel_star_rating(features.hotel_name)],
        'Customer Rating': [get_customer_rating(features.hotel_name)],
        'Check-in Time': [features.check_in_time],
        'Check-out Time': [features.check_out_time],
        'Day of the Week': [day_of_week],
        'Is Public Holiday': [is_public_holiday()],
        'Is Tourism Zone': [is_tourism_zone(features.hotel_name)],
        'Google Trends Score': [get_google_trends_score(features.hotel_name)]
    })

    # Encode categorical fields safely
    for col in ['Hotel Name', 'Location', 'Amenities', 'Type of Room', 'Day of the Week', 'Check-in Time', 'Check-out Time']:
        if col in label_encoders:
            input_data[col] = input_data[col].apply(lambda x: safe_label_encode(label_encoders[col], x))

    # Predict
    prediction = model.predict(input_data)

    predicted_price = int(prediction[0])
    price_range_min = int(predicted_price * 0.9)
    price_range_max = int(predicted_price * 1.1)

    return {
        "date": today.strftime('%Y-%m-%d'),
        "day": day_of_week,
        "predicted_price_range_in_inr": {
            "min": price_range_min,
            "max": price_range_max
        }
    }

# Real-time utilities

def get_hotel_star_rating(hotel_name):
    return 4  # Mocked, can integrate APIs like TripAdvisor

def get_customer_rating(hotel_name):
    return 4.3  # Mocked

def is_public_holiday():
    today = datetime.now()
    api_key = "YOUR_CALENDARIFIC_API_KEY"  # Replace with your real API key
    url = f"https://calendarific.com/api/v2/holidays?&api_key={api_key}&country=IN&year={today.year}&month={today.month}&day={today.day}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            holidays = response.json().get('response', {}).get('holidays', [])
            return 1 if holidays else 0
        else:
            return 0
    except:
        return 0

def is_tourism_zone(hotel_name):
    return 1 if "beach" in hotel_name.lower() or "resort" in hotel_name.lower() else 0

def get_google_trends_score(hotel_name):
    try:
        pytrends = TrendReq(hl='en-IN', tz=330)
        pytrends.build_payload([hotel_name], cat=0, timeframe='now 7-d', geo='IN', gprop='')
        interest = pytrends.interest_over_time()
        if not interest.empty:
            score = interest[hotel_name].mean()
            return int(score)
        else:
            return 50
    except:
        return 50

@app.post("/predict-price")
async def predict_price(features: HotelFeatures):
    global model, label_encoders

    today = datetime.now()
    day_of_week = today.strftime('%A')

    input_data = pd.DataFrame({
        'Hotel Name': [features.hotel_name],
        'Location': [features.location],
        'Amenities': [features.amenities],
        'Distance from City Center (km)': [features.distance_from_city_center],
        'Type of Room': [features.type_of_room],
        'Hotel Star Rating': [get_hotel_star_rating(features.hotel_name)],
        'Customer Rating': [get_customer_rating(features.hotel_name)],
        'Check-in Time': [features.check_in_time],
        'Check-out Time': [features.check_out_time],
        'Day of the Week': [day_of_week],
        'Is Public Holiday': [is_public_holiday()],
        'Is Tourism Zone': [is_tourism_zone(features.hotel_name)],
        'Google Trends Score': [get_google_trends_score(features.hotel_name)]
    })

    # Encode categorical fields safely
    for col in ['Hotel Name', 'Location', 'Amenities', 'Type of Room', 'Day of the Week', 'Check-in Time', 'Check-out Time']:
        if col in label_encoders:
            input_data[col] = input_data[col].apply(lambda x: safe_label_encode(label_encoders[col], x))

    # Predict
    prediction = model.predict(input_data)

    predicted_price = int(prediction[0])
    price_range_min = int(predicted_price * 0.9)
    price_range_max = int(predicted_price * 1.1)

    return {
        "predicted_price_range_in_inr": {
            "min": price_range_min,
            "max": price_range_max
        }
    }
#########################################################################################

@app.get("/scrape-flights")
async def scrape_flights():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        await page.goto("https://www.skyscanner.co.in/flights/arrivals-departures/pnq/pune-arrivals-departures", timeout=60000)

        # Wait for flight table to load
        await page.wait_for_selector('div[class*="FlightsGrid"]', timeout=30000)

        # Scrape flight information
        flights_data = []

        flights = await page.query_selector_all('div[class*="FlightsGrid_flightRow"]')
        for flight in flights:
            try:
                flight_number = await flight.query_selector_eval('div[class*="FlightRow_flightNumber"]', "el => el.textContent")
                departure_time = await flight.query_selector_eval('div[class*="FlightRow_departureTime"]', "el => el.textContent")
                arrival_time = await flight.query_selector_eval('div[class*="FlightRow_arrivalTime"]', "el => el.textContent")
                airline_name = await flight.query_selector_eval('div[class*="FlightRow_airlineName"]', "el => el.textContent")

                flights_data.append({
                    "flight_number": flight_number.strip() if flight_number else "",
                    "departure_time": departure_time.strip() if departure_time else "",
                    "arrival_time": arrival_time.strip() if arrival_time else "",
                    "airline_name": airline_name.strip() if airline_name else ""
                })
            except Exception as e:
                print(f"Error scraping flight: {e}")
        
        await browser.close()

        return {"flights": flights_data}
