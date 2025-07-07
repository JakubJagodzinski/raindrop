from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException

from database.mongo import forecast_collection


async def save_forecast_to_db(city, lat, lon, forecast):
    today_str = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    existing = await forecast_collection.find_one({
        "city": city,
        "date_saved": today_str
    })

    if existing:
        return False

    doc = {
        "city": city,
        "lat": lat,
        "lon": lon,
        "forecast": forecast,
        "date_saved": today_str,
        "saved_at": datetime.now(timezone.utc)
    }

    await forecast_collection.insert_one(doc)
    return True


async def get_saved_forecasts(limit: int = 10):
    forecasts = []
    cursor = forecast_collection.find().sort("saved_at", -1).limit(limit)
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        forecasts.append(doc)
    return forecasts


async def delete_forecast_by_id(forecast_id: str):
    try:
        obj_id = ObjectId(forecast_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid forecast ID.")

    result = await forecast_collection.delete_one({"_id": obj_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Forecast not found.")

    return {"message": "Forecast deleted successfully."}
