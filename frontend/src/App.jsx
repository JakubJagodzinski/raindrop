import {useEffect, useState} from 'react';
import ForecastCarousel from './components/ForecastCarousel.jsx';
import SearchBar from './components/SearchBar.jsx';
import SavedForecasts from './components/SavedForecasts.jsx';

function App() {
    const [city, setCity] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

    useEffect(() => {
        if (city) {
            fetch(`/api/v1/forecast?lat=${city.lat}&lon=${city.lon}`)
                .then(res => res.json())
                .then(data => {
                    setForecast(data.forecast);
                    setSelectedDayIndex(0);
                });
        }
    }, [city]);

    const handleSaveForecast = () => {
        if (!city || forecast.length === 0) return;

        fetch("/api/v1/forecast", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                city: city.name,
                lat: city.lat,
                lon: city.lon,
                forecast: forecast
            })
        })
            .then(res => {
                if (res.ok) {
                    alert("Forecast saved successfully.");
                    setHistoryRefreshTrigger(prev => prev + 1);
                } else if (res.status === 409) {
                    alert("Forecast already saved.");
                } else {
                    alert("Failed to save forecast.");
                }
            })
            .catch(() => alert("Server connection error."));
    };

    return (
        <div className="w-full max-w-screen-lg mx-auto p-4 min-h-screen flex flex-col">

            <div className="flex-none">
                <SearchBar onCitySelected={setCity}/>
            </div>

            <div className="flex-grow flex items-start justify-center">
                {forecast.length > 0 && (
                    <div className="text-center mb-6">
                        <ForecastCarousel
                            forecast={forecast}
                            city={city.name}
                            selectedDayIndex={selectedDayIndex}
                            onDayChange={setSelectedDayIndex}
                        />
                    </div>
                )}
            </div>

            <div className="flex-none p-4 flex flex-col items-center gap-4">
                <div className="flex justify-center gap-4 flex-wrap">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 shadow"
                        onClick={handleSaveForecast}
                    >
                        Save forecast
                    </button>

                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 shadow"
                        onClick={() => setShowHistory(prev => !prev)}
                    >
                        {showHistory ? "Hide history" : "Show history"}
                    </button>
                </div>

                {showHistory &&
                    <SavedForecasts refreshTrigger={historyRefreshTrigger}/>
                }
            </div>
        </div>
    );
}

export default App;
