import React from "react";

const WeatherIcon = ({ iconCode }) => {
    
  const getIconUrl = (code) => {
    return `https://openweathermap.org/img/wn/${code}.png`;
  };

  return <img src={getIconUrl(iconCode)} alt="Weather Icon" />;
};

export default WeatherIcon;
