import { useState } from "react";
import WeatherIcon from "./components/WeatherIcon";

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
    <div className="container">
      <h1>Aplicación del Clima</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={ciudad} onChange={handleCambioCiudad} />
        <button type="submit">Buscar</button>
      </form>
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
