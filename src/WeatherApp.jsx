import { useState } from "react";
import WeatherIcon from "./components/WeatherIcon";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export const WeatherApp = () => {
  const urlBase = "https://api.openweathermap.org/data/2.5/weather";
  const API_KEY = import.meta.env.VITE_API_KEY;
  const difKelvin = 273.15;

  const [ciudad, setCiudad] = useState("");
  const [dataClima, setdataClima] = useState(null);

  const handleCambioCiudad = (e) => {
    setCiudad(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (ciudad.length > 0) {
      await fetchClima();
      setCiudad("");
    }
  };

  const fetchClima = async () => {
    try {
      const response = await fetch(`${urlBase}?q=${ciudad}&appid=${API_KEY}`);
      const data = await response.json();
      setdataClima(data);
    } catch (error) {
      console.error("Ocurrió el siguiente problema: ", error);
    }
  };

  return (
    <div className="min-h-screen  bg-customGray text-white p-8 w-full sm:w-11/12 md:w-4/5 lg:w-2/5 my-16 mx-auto rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <form onSubmit={handleSubmit} className="relative w-full md:w-auto mb-4 md:mb-0">
          <input 
            type="text" 
            placeholder="Buscar por ciudad" 
            className="w-full md:w-auto pl-10 pr-5 py-2 bg-customGray border-none outline-none text-white rounded" 
            value={ciudad} 
            onChange={handleCambioCiudad} />
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-300" />
        </form>
        <div className="text-lg sm:text-xl lg:text-2xl flex items-center">
          <span className="mr-2">°C</span>
          <span >°F</span>
        </div>
      </div>
      <h1>Aplicación del Clima</h1>
      {dataClima && (
        <div>
          <h2>{dataClima.name}</h2>
          <p>Temperatura: {Math.round(dataClima.main.temp - difKelvin)}°C</p>
          <p>Condición metereológica: {dataClima.weather[0].description}</p>
          <WeatherIcon iconCode={dataClima?.weather[0]?.icon} />
        </div>
      )}
    </div>
  );
};
