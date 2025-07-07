from pydantic import BaseModel


class ForecastEntry(BaseModel):
    timestamp: int
    datetime: str
    temperature: float
    description: str
    icon: str
    humidity: int
    wind_speed: float
