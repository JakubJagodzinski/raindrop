import requests


def fetch_country_list():
    url = "https://restcountries.com/v3.1/all"
    params = {"fields": "cca2,name"}

    response = requests.get(url, params=params)
    response.raise_for_status()

    data = response.json()

    countries = []

    for country in data:
        code = country.get("cca2")
        name = country.get("name", {}).get("common")

        if code and name:
            countries.append({
                "code": code,
                "name": name
            })

    return sorted(countries, key=lambda x: x["name"])
