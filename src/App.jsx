import { useState, useEffect } from "react";
import bgImage from "./assets/bg.jpg";
import cardImage from "./assets/card.jpg";

export default function App() {
  const [inputCity, setInputCity] = useState("");
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const indianCities = [
    "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata",
    "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
    "Indore", "Bhopal", "Nagpur", "Surat", "Kanpur", "Patna"
  ];

  const filteredCities = indianCities.filter(city =>
    city.toLowerCase().startsWith(inputCity.toLowerCase()) && inputCity !== ""
  );

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const apiKey = "bf5853b17c6b7817927a58ff572bf96d";
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();

        if (data.cod === 200) {
          setWeather(data);
        } else {
          setWeather(null);
        }
      } catch (err) {
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const handleGetWeather = () => {
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setInputCity("");
    setCity("");
    setWeather(null);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputCity(suggestion);
    setCity(suggestion);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredCities.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? filteredCities.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && filteredCities[activeIndex]) {
        handleSuggestionClick(filteredCities[activeIndex]);
      } else {
        handleGetWeather();
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div
        className="w-[350px] p-6 rounded-3xl shadow-inner relative space-y-5 text-white"
        style={{
          backgroundImage: `url(${cardImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(5px)"
        }}
      >
        <h2 className="font-bold text-2xl text-blue-900">
          🌤️ Weather Forecast
        </h2>


        <div className="relative">
          <input
            type="text"
            placeholder="🏙️ Enter city"
            className="w-full p-4 pr-12 rounded-2xl bg-white text-gray-800 font-semibold shadow-md focus:outline-none"
            value={inputCity}
            onChange={(e) => {
              setInputCity(e.target.value);
              setShowSuggestions(true);
              setActiveIndex(-1);
            }}
            onFocus={() => {
              if (filteredCities.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleGetWeather}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full shadow-md hover:bg-blue-600 transition"
            title="Get Weather"
          />

          {showSuggestions && filteredCities.length > 0 && (
            <ul className="absolute z-10 left-0 right-0 mt-1 bg-white text-gray-800 rounded-xl shadow-lg max-h-40 overflow-auto">
              {filteredCities.map((suggestion, index) => (
                <li
                  key={suggestion}
                  className={`px-4 py-2 cursor-pointer ${
                    index === activeIndex ? "bg-blue-100" : "hover:bg-blue-50"
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {loading && (
          <p className="text-center text-blue-800 font-medium animate-pulse">⏳ Loading...</p>
        )}

        {weather && weather.main && (
          <div className="bg-white bg-opacity-80 p-4 rounded-xl shadow text-center space-y-2 text-gray-800">
            <h3 className="text-xl font-bold text-blue-700">📍 {weather.name}</h3>
            <p className="text-3xl font-extrabold text-blue-500">
              🌡️ {weather.main.temp}°C
            </p>
            <p className="capitalize text-gray-600 italic">
              {weather.weather[0].description}
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p>💧 Humidity: <span className="font-semibold text-black">{weather.main.humidity}%</span></p>
              <p>🌬️ Wind: <span className="font-semibold text-black">{weather.wind.speed} m/s</span></p>
              <p>🧥 Feels like: <span className="font-semibold text-black">{weather.main.feels_like}°C</span></p>
            </div>
            <button
              onClick={handleClear}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              🔄 Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
