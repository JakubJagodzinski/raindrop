import {useEffect, useState} from "react";
import ForecastCarousel from "./ForecastCarousel.jsx";

function SavedForecasts({refreshTrigger}) {
    const [saved, setSaved] = useState([]);
    const [selectedDayIndexes, setSelectedDayIndexes] = useState({});

    useEffect(() => {
        fetch("/api/v1/saved-forecasts")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSaved(data);

                    const initIndexes = {};
                    data.forEach((_, idx) => {
                        initIndexes[idx] = 0;
                    });
                    setSelectedDayIndexes(initIndexes);
                } else {
                    setSaved([]);
                }
            });
    }, [refreshTrigger]);

    const handleDayChange = (idx, newIndex) => {
        setSelectedDayIndexes(prev => ({
            ...prev,
            [idx]: newIndex
        }));
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this forecast from history?");
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/v1/saved-forecasts/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setSaved(prev => prev.filter(entry => entry._id !== id));
            } else {
                const data = await res.json();
                alert(`Failed to delete: ${data.detail || "Unknown error"}`);
            }
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            alert("Error connecting to server.");
        }
    };


    if (saved.length === 0) {
        return <p className="text-gray-500 mt-2 text-center">No forecasts saved.</p>;
    }

    return (
        <div className="mt-4 w-full flex justify-center">
            <div className="w-full max-w-screen-md">
                <hr className="my-4 border-gray-400"/>
                <h2 className="text-lg font-semibold mb-4 text-center">Forecasts history</h2>
                <hr className="my-4 border-gray-400"/>
                <ul className="space-y-8 list-none pl-0">
                    {saved.map((entry, idx) => (
                        <li key={idx} className="bg-white rounded shadow p-4">
                            <div className="text-center mb-4">
                                <strong>{entry.city}</strong> — Saved: {new Date(entry.saved_at).toLocaleString()}
                                <br/>
                                Forecasts: {entry.forecast.length}
                            </div>

                            <button
                                onClick={() => handleDelete(entry._id)}
                                className="text-red-500 hover:text-red-700 text-sm mt-2"
                            >
                                🗑️ Delete
                            </button>

                            <ForecastCarousel
                                forecast={entry.forecast}
                                city={entry.city}
                                selectedDayIndex={selectedDayIndexes[idx] || 0}
                                onDayChange={newIndex => handleDayChange(idx, newIndex)}
                            />
                            <hr className="my-4 border-gray-400"/>
                        </li>

                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SavedForecasts;
