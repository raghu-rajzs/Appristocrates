from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# CORS config for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or "*" during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
class HotelRequest(BaseModel):
    location: str
    roomType: str
    checkIn: int
    checkOut: int
    amenities: List[str]

@app.post("/estimate")
async def estimate_price(data: HotelRequest):
    # Simulate backend logic here
    return {
        "price_range": (120, 170),
        "trends": [
            {"date": "2025-04-27", "price": 120},
            {"date": "2025-04-28", "price": 130},
            {"date": "2025-04-29", "price": 145},
        ]
    }
