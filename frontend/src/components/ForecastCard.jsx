export default function ForecastCard({data}) {
    return (
        <div
            className="min-w-[160px] w-[160px] min-h-[240px] p-4 bg-white shadow rounded text-center flex flex-col justify-between"
        >
            <div>
                <p className="text-sm text-gray-500">
                    {new Date(data.datetime).toLocaleTimeString("pl-PL", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
                <img
                    src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                    alt={data.description}
                    className="mx-auto"
                />
                <p className="text-xl font-semibold">{data.temperature}°C</p>
                <p className="capitalize text-sm text-gray-600">{data.description}</p>
            </div>
            <div className="text-sm text-gray-500 mt-2">
                <p>💨 {data.wind_speed} m/s</p>
                <p>💧 {data.humidity}%</p>
            </div>
        </div>
    );
}
