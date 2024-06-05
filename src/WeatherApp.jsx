import React, { useState } from "react";
import WeatherIcon from "./components/WeatherIcon";
import WeatherCard from "./components/WeatherCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getName } from "country-list";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const WeatherApp = () => {
  const urlBase = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = import.meta.env.VITE_API_KEY;
  const difKelvin = 273.15;

  const [ciudad, setCiudad] = useState("");
  const [dataClima, setdataClima] = useState(null);
  const [fechaHora, setFechaHora] = useState("");
  const [unidad, setUnidad] = useState("metric");

  const handleCambioCiudad = (e) => {
    setCiudad(e.target.value);
  };

  const handleUnidadCambio = (unidadSeleccionada) => {
    setUnidad(unidadSeleccionada);
    if (ciudad.length > 0) {
      fetchClima(unidadSeleccionada); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ciudad.length > 0) {
      await fetchClima(unidad);
      setCiudad("");
    }
  };

  const fetchClima = async (unidad) => {
    try {
      const now = new Date();
      const formattedDate = format(now, "EEEE, d 'de' MMMM 'de' yyyy, p", {
        locale: es,
      });
      setFechaHora(formattedDate);

      const response = await fetch(`${urlBase}?q=${ciudad}&appid=${API_KEY}&units=${unidad}&lang=es`);

      const data = await response.json();

      const countryName = getName(data.sys.country, "es");
      setdataClima({ ...data, countryName });
    } catch (error) {
      console.error("Ocurrió el siguiente problema: ", error);
    }
  };

  const convertWindSpeed = (speed, unit) => {
    if (speed === undefined || speed === null) return "N/A";
    if (unit === "metric") {
      // Convert from m/s to km/h
      return (speed * 3.6).toFixed(2);
    } else if (unit === "imperial") {
      // Speed is already in mph
      return speed.toFixed(2);
    }
    return speed.toFixed(2);
  };

  const getWindUnit = (unit) => {
    if (unit === "metric") {
      return "km/h";
    } else if (unit === "imperial") {
      return "mph";
    }
    return "m/s";
  };

  const getTemperatureUnit = () => (unidad === "metric" ? "°C" : "°F");

  const displayTemperature = (temp) => {
    if (temp === undefined || temp === null || isNaN(temp)) {
      return "N/A";
    }
    return unidad === "metric"
      ? `${Math.round(temp)}`
      : `${Math.round((temp * 9/5) + 32)}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-customGray text-white p-8 w-full sm:w-11/12 md:w-4/5 lg:w-2/5 my-16 mx-auto rounded-lg">
        <div className="weather__header flex flex-col md:flex-row justify-between items-center mb-2">
          <form
            onSubmit={handleSubmit}
            className="relative w-full md:w-auto mb-4 md:mb-0"
          >
            <input
              type="text"
              placeholder="Buscar por ciudad"
              className="w-full md:w-auto pl-10 pr-5 py-2 bg-neutral-800 border-none outline-none text-white rounded"
              value={ciudad}
              onChange={handleCambioCiudad}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-300"
            />
          </form>
          <div className="text-lg sm:text-xl lg:text-2xl flex items-center">
            <button onClick={() => handleUnidadCambio("metric")} className={`mr-2 ${unidad === "metric" ? "font-bold" : ""}`}>
              °C
            </button>
            <button onClick={() => handleUnidadCambio("imperial")} className={`${unidad === "imperial" ? "font-bold" : ""}`}>
              °F
            </button>
          </div>
        </div>
        <div className="weather__body flex flex-col items-center justify-center">
          {dataClima && (
            <div className="text-center mb-4">
              <p className="text-4xl mb-2">
                {dataClima.name}, {getName(dataClima.sys.country)}
              </p>
              <div className="mb-5">
                <p>{fechaHora}</p>
              </div>
              <div className="rounded-full bg-neutral-800 mb-2 py-2 px-4 mx-auto">{dataClima.weather[0].description}</div>
              <div className="mb-2 flex justify-center">
                <WeatherIcon iconCode={dataClima?.weather[0]?.icon} />
              </div>
              <p className="text-3xl mb-2">{displayTemperature(dataClima.main.temp)}{getTemperatureUnit()}</p>
              <div className="mb-2">
                <p>Min: {displayTemperature(dataClima.main.temp_min)}{getTemperatureUnit()}</p>
                <p>Max: {displayTemperature(dataClima.main.temp_max)}{getTemperatureUnit()}</p>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <WeatherCard
            title="Sensación Térmica"
            value={displayTemperature(dataClima?.main?.feels_like)}
            unit={getTemperatureUnit()}
          />
          <WeatherCard
            title="Humedad"
            value={`${dataClima?.main?.humidity}`}
            unit="%"
          />
          <WeatherCard
            title="Viento"
            value={`${convertWindSpeed(dataClima?.wind?.speed, unidad)}`}
            unit={getWindUnit(unidad)}
          />
          <WeatherCard
            title="Presión"
            value={`${dataClima?.main?.pressure}`}
            unit="hPa"
          />
        </div>
      </div>
    </div>
  );
};
