from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from requests import RequestException

from database.database_operations import save_forecast_to_db, get_saved_forecasts, delete_forecast_by_id
from database.models.save_forecast_request import SaveForecastRequest
from utils.cities import search_cities
from utils.countries import fetch_country_list
from utils.weather import get_current_weather, get_forecast_weather

load_dotenv()

app = FastAPI(
    title="Raindrop Weather API",
    version="1.0",
    docs_url="/docs",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/v1/countries")
def get_countries():
    try:
        return fetch_country_list()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/cities")
def get_cities(
        q: str = Query(..., description="City name"),
        limit: int = Query(5, description="Maximum results"),
        country: Optional[str] = Query(None, description="2-letter country code (optional)")
):
    try:
        return search_cities(q, limit=limit, country=country)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/weather")
def get_weather(lat: float, lon: float):
    try:
        return get_current_weather(lat, lon)
    except RequestException:
        raise HTTPException(status_code=502, detail="External API error")
    except (KeyError, ValueError):
        raise HTTPException(status_code=500, detail="Data parsing error")


@app.get("/api/v1/forecast")
def get_forecast(lat: float, lon: float):
    try:
        return get_forecast_weather(lat, lon)
    except RequestException:
        raise HTTPException(status_code=502, detail="External API error")
    except (KeyError, ValueError):
        raise HTTPException(status_code=500, detail="Data parsing error")


@app.post("/api/v1/forecast")
async def save_forecast(payload: SaveForecastRequest):
    saved = await save_forecast_to_db(
        city=payload.city,
        lat=payload.lat,
        lon=payload.lon,
        forecast=[entry.dict() for entry in payload.forecast]
    )

    if not saved:
        raise HTTPException(status_code=409, detail="Forecast already saved today")

    return {"message": "Forecast saved successfully"}


@app.get("/api/v1/saved-forecasts")
async def fetch_saved_forecasts():
    try:
        return await get_saved_forecasts()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/v1/saved-forecasts/{forecast_id}")
async def delete_forecast(forecast_id: str):
    return await delete_forecast_by_id(forecast_id)
