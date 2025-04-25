from fastapi import FastAPI
from app.api.v1.routes import router as api_router

app = FastAPI(title="My FastAPI App")

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI app with PostgreSQL!"}
