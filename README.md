# raindrop
Simple application that allows users to search for 5-day weather forecasts by city, view hourly predictions, and save forecasts for future reference.

---

## Table of Contents
1. [Application Functionalities](#application-functionalities)
2. [Tech Stack](#tech-stack)
3. [How To Run](#how-to-run)
4. [License](#license)
5. [Author](#author)

---

# Application Functionalities
- Search for 5-day weather forecasts (hourly data)
- City autocomplete via OpenWeather Geocoding API
- Save weather forecasts to history
- Remove specific saved forecasts
- View forecast history with day-by-day navigation

---

# Tech Stack
### Frontend:
  - React + Vite
  - Tailwind CSS
### Backend:
  - FastAPI
### Database:
  - MongoDB
### DevOps:
  - Docker
  - Docker Compose
### External API:
  - OpenWeatherMap
  - REST Countries

---

# How To Run
1. Create a .env file in the root and backend directories basing on .env.example

2. Build and run the containers:
```bash
docker compose up
```

3. Access the app:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

---

## License

This project is licensed under the MIT License.

---

## Author

Jakub Jagodziński
