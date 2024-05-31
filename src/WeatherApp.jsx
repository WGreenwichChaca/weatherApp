import { useState } from "react";

export const WeatherApp = () => {

    const urlBase = 'https://api.openweathermap.org/data/2.5/weather'
    const API_KEY = '838aeffa33b5efffbf51fb7bc6f6a01e'

    const [ciudad, setCiudad] = useState('')
    const [dataClima, setdataClima] = useState(null)

    const handleCambioCiudad = (e) => {
        setCiudad(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(ciudad.length > 0) fetchClima()
    }

    const fetchClima = async () => {
        try {
            const response = await fetch(`${urlBase}?q=${ciudad}&appid=${API_KEY}`)
            const data = await response.json
            setdataClima(data)
        } catch (error) {
            console.error('Ocurrio el siguiente problema: ', error)
        }
    }


  return (
    <div className="container">
      <h1>Aplicación del Clima</h1>

      <form onSubmit={handleSubmit}>
        <input 
        type="text"
        value={ciudad}
        onChange={handleCambioCiudad}
        />
        <button type="submit">Buscar</button>
      </form>

        

    </div>
  );
};
