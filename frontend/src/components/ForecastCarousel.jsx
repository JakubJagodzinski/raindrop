import {useMemo} from "react";
import ForecastCard from "./ForecastCard.jsx";

export default function ForecastCarousel({forecast, city, selectedDayIndex, onDayChange}) {
    const groupedByDay = useMemo(() => {
        const groups = {};
        forecast.forEach(entry => {
            const date = entry.datetime.split(" ")[0];
            if (!groups[date]) groups[date] = [];
            groups[date].push(entry);
        });
        return Object.values(groups);
    }, [forecast]);

    const dayForecast = groupedByDay[selectedDayIndex] || [];

    const formattedDate = dayForecast.length > 0
        ? new Date(dayForecast[0].datetime).toLocaleDateString("en-EN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        : "";

    return (
        <div className="flex flex-col justify-between items-center min-h-[80vh] max-w-6xl mx-auto px-4 py-6 space-y-6">

            {/* city and date */}
            {city && (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">{city}</h2>
                    <p className="text-xl font-bold text-gray-300">{formattedDate}</p>
                </div>
            )}

            {/* forecast cards */}
            <div className="flex-grow flex justify-center items-start w-full">
                <div className="w-full overflow-x-auto">
                    <div className="flex gap-4 py-4 w-max mx-auto">
                        {dayForecast.map(entry => (
                            <div key={entry.timestamp} className="flex-shrink-0">
                                <ForecastCard data={entry}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* buttons */}
            <div className="flex justify-center gap-4 pt-4">
                <button
                    className={`px-4 py-2 rounded-lg transition duration-200 shadow 
                ${selectedDayIndex === 0
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    onClick={() => onDayChange(selectedDayIndex - 1)}
                    disabled={selectedDayIndex === 0}
                >
                    ⬅️ Previous day
                </button>

                <button
                    className={`px-4 py-2 rounded-lg transition duration-200 shadow 
                ${selectedDayIndex === groupedByDay.length - 1
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    onClick={() => onDayChange(selectedDayIndex + 1)}
                    disabled={selectedDayIndex === groupedByDay.length - 1}
                >
                    Next day ➡️
                </button>
            </div>

        </div>
    );
}
