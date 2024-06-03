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
      const now = new Date();
      const formattedDate = format(now, "EEEE, d 'de' MMMM 'de' yyyy, p", {
        locale: es,
      });
      setFechaHora(formattedDate);

      const response = await fetch(`${urlBase}?q=${ciudad}&appid=${API_KEY}&lang=es`);
      const data = await response.json();
      setdataClima(data);
    } catch (error) {
      console.error("Ocurrió el siguiente problema: ", error);
    }
  };

  const convertWindSpeed = (speed, unit) => {
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

  const getUnitType = () => {
    // This function can be extended to determine the unit type (metric/imperial) based on user settings or API response
    return "metric"; // Assuming metric for now, adjust based on actual usage
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
            <span className="mr-2">°C</span>
            <span>°F</span>
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
              <div className="mb-2">{dataClima.weather[0].description}</div>
              <div className="mb-2 flex justify-center">
                <WeatherIcon iconCode={dataClima?.weather[0]?.icon} />
              </div>
              <p className="text-2xl mb-2">Temperatura: {Math.round(dataClima.main.temp - difKelvin)}°C</p>
              <div className="mb-2">
                <p>Min: {Math.round(dataClima.main.temp_min - difKelvin)}°</p>
                <p>Max: {Math.round(dataClima.main.temp_max - difKelvin)}°</p>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <WeatherCard title="Real Feel" value={`${Math.round(dataClima?.main?.feels_like - difKelvin)}`} unit="°C" />
          <WeatherCard title="Humidity" value={`${dataClima?.main?.humidity}`} unit="%" />
          <WeatherCard 
            title="Wind" 
            value={`${convertWindSpeed(dataClima?.wind?.speed, getUnitType())}`} 
            unit={getWindUnit(getUnitType())} 
          />
          <WeatherCard title="Pressure" value={`${dataClima?.main?.pressure}`} unit="hPa" />
        </div>
      </div>
    </div>
  );
};


// import { useState } from "react";
// import WeatherIcon from "./components/WeatherIcon";
// import WeatherCard from "./components/WeatherCard";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { getName } from "country-list";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";

// export const WeatherApp = () => {
//   const urlBase = "https://api.openweathermap.org/data/2.5/weather";
//   const API_KEY = import.meta.env.VITE_API_KEY;
//   const difKelvin = 273.15;

//   const [ciudad, setCiudad] = useState("");
//   const [dataClima, setdataClima] = useState(null);
//   const [fechaHora, setFechaHora] = useState("");

//   const handleCambioCiudad = (e) => {
//     setCiudad(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (ciudad.length > 0) {
//       await fetchClima();
//       setCiudad("");
//     }
//   };

//   const fetchClima = async () => {
//     try {
//       const now = new Date();
//       const formattedDate = format(now, "EEEE, d 'de' MMMM 'de' yyyy, p", {
//         locale: es,
//       });
//       setFechaHora(formattedDate);

//       const response = await fetch(`${urlBase}?q=${ciudad}&appid=${API_KEY}`);
//       const data = await response.json();
//       setdataClima(data);
//     } catch (error) {
//       console.error("Ocurrió el siguiente problema: ", error);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-white">
//       <div className="bg-customGray text-white p-8 w-full sm:w-11/12 md:w-4/5 lg:w-2/5 my-16 mx-auto rounded-lg">
//         <div className="weather__header flex flex-col md:flex-row justify-between items-center">
//           <form
//             onSubmit={handleSubmit}
//             className="relative w-full md:w-auto mb-4 md:mb-0"
//           >
//             <input
//               type="text"
//               placeholder="Buscar por ciudad"
//               className="w-full md:w-auto pl-10 pr-5 py-2 bg-customGray border-none outline-none text-white rounded"
//               value={ciudad}
//               onChange={handleCambioCiudad}
//             />
//             <FontAwesomeIcon
//               icon={faMagnifyingGlass}
//               className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-300"
//             />
//           </form>
//           <div className="text-lg sm:text-xl lg:text-2xl flex items-center">
//             <span className="mr-2">°C</span>
//             <span>°F</span>
//           </div>
//         </div>
//         <div className="weather__body flex flex-col items-center justify-center">
//           {dataClima && (
//             <div className="text-center mb-4">
//               <p className="text-4xl mb-2">
//                 {dataClima.name}, {getName(dataClima.sys.country)}
//               </p>
//               <div className="mb-2">
//                 <p>Fecha y Hora: {fechaHora}</p>
//               </div>
//               <div className="mb-2">{dataClima.weather[0].main}</div>
//               <div className="flex justify-center mb-2">
//                 <WeatherIcon iconCode={dataClima?.weather[0]?.icon} />
//               </div>
//               <p className="text-2xl mb-2">
//                 Temperatura: {Math.round(dataClima.main.temp - difKelvin)}°C
//               </p>
//               <div className="mb-2">
//                 <p>Min: {Math.round(dataClima.main.temp_min - difKelvin)}°</p>
//                 <p>Max: {Math.round(dataClima.main.temp_max - difKelvin)}°</p>
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
//           <WeatherCard title="Real Feel" value={dataClima?.main?.feels_like} />
//           <WeatherCard title="Humidity" value={dataClima?.main?.humidity} />
//           <WeatherCard title="Wind" value={dataClima?.wind?.speed} />
//           <WeatherCard title="Pressure" value={dataClima?.main?.pressure} />
//         </div>
//       </div>
//     </div>
//   );
// };
