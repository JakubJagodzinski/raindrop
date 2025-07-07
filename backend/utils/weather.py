import os

import requests

from config import OPENWEATHER_API_KEY

LANG = os.getenv("LANG")

def get_current_weather(lat, lon):
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
        "lang": "en"
    }

    response = requests.get(url, params=params)
    response.raise_for_status()

    data = response.json()

    weather = data.get("weather", [{}])[0]
    main = data.get("main", {})
    wind = data.get("wind", {})

    return {
        "city": data.get("name"),
        "temperature": main.get("temp"),
        "description": weather.get("description"),
        "icon": weather.get("icon"),
        "humidity": main.get("humidity"),
        "wind_speed": wind.get("speed")
    }


def get_forecast_weather(lat, lon):
    url = "https://api.openweathermap.org/data/2.5/forecast"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric",
        "lang": "en"
    }

    response = requests.get(url, params=params)
    response.raise_for_status()

    data = response.json()

    city = data.get("city", {}).get("name")
    forecast_entries = []

    for entry in data.get("list", []):
        main = entry.get("main", {})
        weather = entry.get("weather", [{}])[0]
        wind = entry.get("wind", {})

        forecast_entries.append({
            "timestamp": entry.get("dt"),
            "datetime": entry.get("dt_txt"),
            "temperature": main.get("temp"),
            "description": weather.get("description"),
            "icon": weather.get("icon"),
            "humidity": main.get("humidity"),
            "wind_speed": wind.get("speed")
        })

    return {
        "city": city,
        "forecast": forecast_entries
    }
