import './App.css';
import {useEffect, useState} from "react";


function App() {
    const [cityName, setCityName] = useState("Antwerp");
    const [weather, setWeather] = useState({
        temperature: "",
        feelsLike: "",
        conditionText: "",
        locationText: "",
        localtime: "",
        dayOfWeek: "",
        humidity: "",
        wind_kph: "",
        icon: "",
        forecast: [],
    });

    useEffect(() => {
        fetchData(cityName);
    }, []);

    const fetchData = async (cityName) => {
        const options = {
            method: 'GET',
            params: {q: cityName},
            headers: {
                'X-RapidAPI-Key': '734bc29f81msh85bd8e1dea8c988p1bb9c2jsn3133e9a810a3',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
            },
        };

        try {
            const response = await fetch(
                `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${cityName}&days=3`,
                options
            );
            const data = await response.json();
            const {current, location, forecast} = data;
            const {temp_c: tempC, feelslike_c: feelsLikeC, humidity, wind_kph} = current;
            const {name, country, localtime: localtimeText} = location;
            const date = new Date(localtimeText);
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {day: 'numeric', month: 'short'});
            };
            const formatDayOfWeek = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {weekday: 'long'});
            };
            const formatForecast = (forecast) => {
                const forecastDays = forecast.forecastday;
                return forecastDays.map((day) => {
                    const date = new Date(day.date);
                    const dayOfWeek = date.toLocaleDateString('en-US', {weekday: 'short'});
                    const maxTemp = day.day.maxtemp_c;
                    const minTemp = day.day.mintemp_c;
                    const icon = day.day.condition.icon;
                    return {dayOfWeek, icon, maxTemp: `${maxTemp}C`, minTemp: `${minTemp}C`};
                });
            };

            const formattedDateTime = formatDate(date);
            const dayOfWeek = formatDayOfWeek(date);
            const conditionText = current.condition.text;
            const icon = current.condition.icon;
            const formattedForecast = formatForecast(forecast);
            setWeather({
                cityName,
                temperature: `${tempC}°C`,
                feelsLike: `${feelsLikeC}°C`,
                humidity: `${humidity}%`,
                wind_kph: `${wind_kph} km/h`,
                conditionText,
                icon,
                name,
                country,
                locationText: formattedDateTime,
                localtime: formattedDateTime,
                dayOfWeek,
                forecast: formattedForecast,
            });
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    };
    const handleCityChange = (event) => {
        setCityName(event.target.value);
    };

    const handleSearchClick = () => {
        console.log(cityName)
        fetchData(cityName);
    };
    return (
        <div className="container">
            <div className="weather-side">
                <div className="weather-gradient"><img src={weather.icon} alt=""/></div>
                <div className="date-container">
                    <p className="location">{weather.name} - {weather.country}</p>

                    <h2 className="date-dayname">{weather.dayOfWeek}</h2>
                    <i className="location-icon" data-feather="map-pin"></i>
                    <span className="location">{weather.locationText}</span>
                </div>
                <div className="weather-container"><i className="weather-icon" data-feather="sun"></i>
                    <h1 className="weather-temp">{weather.temperature}</h1>
                    <h3 className="weather-desc">{weather.conditionText}</h3>
                </div>
            </div>
            <div className="info-side">
                <div className="today-info-container">
                    <div className="today-info">
                        <div className="precipitation"><span className="title">WIND</span><span
                            className="value">{weather.wind_kph}</span>
                            <div className="clear"></div>
                        </div>
                        <div className="humidity"><span className="title">HUMIDITY</span><span
                            className="value">{weather.humidity}</span>
                            <div className="clear"></div>
                        </div>
                        <div className="wind"><span className="title">FELLING LIKE</span><span
                            className="value">{weather.feelsLike}</span>
                            <div className="clear"></div>
                        </div>
                    </div>
                </div>
                <div className="week-container today-info">
                    <span className="title">NEXT THREE DAYS</span>
                    <ul className="week-list">
                        {weather.forecast && weather.forecast.map((day) => (
                            <li key={day.dayOfWeek}>
                                <i className="day-icon" data-feather="cloud"><img src={day.icon} alt=""/></i>
                                <span className="day-name">{day.dayOfWeek}</span>
                                <span className="day-temp">{day.maxTemp}</span>
                            </li>
                        ))}

                    </ul>
                </div>
                <div className="location-container">
                    <input
                        type="text"
                        placeholder="Enter a city name"
                        id="search-btn"
                        className="searchTerm"
                        value={cityName}
                        onChange={handleCityChange}
                    />
                    <button className="location-button" onClick={()=>handleSearchClick()}><span>Change location</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;