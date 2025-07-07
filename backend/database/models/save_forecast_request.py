from typing import List

from pydantic import BaseModel

from database.models.forecast_entry import ForecastEntry


class SaveForecastRequest(BaseModel):
    city: str
    lat: float
    lon: float
    forecast: List[ForecastEntry]
