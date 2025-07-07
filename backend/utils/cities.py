import requests

from config import OPENWEATHER_API_KEY


def search_cities(query, limit=5, country=None):
    url = "https://api.openweathermap.org/geo/1.0/direct"
    params = {
        "q": f"{query},{country.upper()}" if country else query,
        "limit": 10,
        "appid": OPENWEATHER_API_KEY
    }

    response = requests.get(url, params=params)
    response.raise_for_status()

    data = response.json()

    return remove_duplicates(data)[:limit]


def remove_duplicates(cities):
    seen = set()
    unique_cities = []

    for city in cities:
        key = (
            city.get("name", "").lower().strip(),
            city.get("country", "").upper().strip(),
            (city.get("state") or "").lower().strip()
        )
        if key not in seen:
            seen.add(key)
            unique_cities.append(city)

    return unique_cities
