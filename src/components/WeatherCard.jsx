import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faTint, faWind, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

const icons = {
  "Real Feel": faThermometerHalf,
  "Humidity": faTint,
  "Wind": faWind,
  "Pressure": faTachometerAlt
};

export const WeatherCard = ({ title, value, unit }) => {
  const displayValue = isNaN(value) ? "N/A" : value;
  return (
    <div className="bg-neutral-800 rounded-lg p-4 shadow-md w-full mb-4 mx-auto">
      <div className="text-center flex items-center justify-center">
        <FontAwesomeIcon icon={icons[title]} className="mr-2" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
      </div>
      <p className="text-xl text-center">{displayValue} {unit}</p>
    </div>
  );
};

export default WeatherCard;
