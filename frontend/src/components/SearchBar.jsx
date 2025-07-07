import {useState, useRef} from "react";

export default function SearchBar({onCitySelected}) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const inputRef = useRef(null);

    const handleChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length >= 2) {
            const response = await fetch(`/api/v1/cities?q=${value}`);
            const cities = await response.json();
            setSuggestions(cities);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelect = (city) => {
        onCitySelected(city);
        setQuery("");
        setSuggestions([]);
        inputRef.current?.blur();
    };

    return (
        <div className="relative w-full max-w-md mx-auto">
            <input
                type="text"
                className="w-full border border-gray-300 rounded px-4 py-2 shadow"
                placeholder="Enter city..."
                value={query}
                onChange={handleChange}
                ref={inputRef}
            />

            {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-y-auto shadow">
                    {suggestions.map((city, idx) => (
                        <li
                            key={idx}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(city)}
                        >
                            {city.name}, {city.country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
