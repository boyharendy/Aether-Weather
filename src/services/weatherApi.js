// src/services/weatherApi.js

const wmoToIcon = (code, isDay, lang = 'id') => {
  const isId = lang === 'id';
  if (code === 0) return { condition: isId ? "Cerah" : "Clear", icon: isDay ? "sun" : "moon" };
  if (code === 1 || code === 2) return { condition: isId ? "Cerah Berawan" : "Partly Cloudy", icon: isDay ? "cloud-sun" : "moon" };
  if (code === 3) return { condition: isId ? "Mendung" : "Overcast", icon: "cloud" };
  if (code === 45 || code === 48) return { condition: isId ? "Berkabut" : "Fog", icon: "cloud-fog" };
  if (code >= 51 && code <= 67) return { condition: isId ? "Hujan" : "Rain", icon: "cloud-rain" };
  if (code >= 71 && code <= 77) return { condition: isId ? "Salju" : "Snow", icon: "cloud" }; // Fallback ke cloud karena belum ada ikon salju
  if (code >= 80 && code <= 82) return { condition: isId ? "Hujan Lebat" : "Heavy Rain", icon: "cloud-rain" };
  if (code >= 95 && code <= 99) return { condition: isId ? "Badai Petir" : "Thunderstorm", icon: "cloud-lightning" };
  
  return { condition: isId ? "Tidak Diketahui" : "Unknown", icon: "cloud" };
};

// Fungsi pembantu untuk memformat waktu dari string ISO
const formatTime = (isoString) => {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

// Format tanggal
const formatDate = (isoString, lang = 'id') => {
  const date = new Date(isoString);
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  return date.toLocaleDateString(locale, options);
};

const getDayName = (isoString, lang = 'id') => {
  const date = new Date(isoString);
  const options = { weekday: 'long' };
  const locale = lang === 'id' ? 'id-ID' : 'en-US';
  return date.toLocaleDateString(locale, options);
}


const getWeatherFromCoords = async (latitude, longitude, name, country, lang = 'id') => {
  // 2. Dapatkan data cuaca (Weather API)
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure,visibility` +
    `&hourly=temperature_2m,weather_code,is_day` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto`
  );
  const weatherData = await weatherResponse.json();

  const current = weatherData.current;
  const { condition, icon } = wmoToIcon(current.weather_code, current.is_day, lang);

  // Format current data
  const formattedCurrent = {
    tempC: Math.round(current.temperature_2m),
    tempF: Math.round((current.temperature_2m * 9/5) + 32),
    condition: condition,
    icon: icon,
    location: `${name}, ${country}`,
    time: formatTime(current.time),
    date: formatDate(current.time, lang),
    humidity: current.relative_humidity_2m,
    pressure: current.surface_pressure,
    visibility: Math.round(current.visibility / 1000), // convert meters to km
    windSpeed: Math.round(current.wind_speed_10m),
    uvIndex: 0,
    dewPoint: 0,
    timezone: weatherData.timezone,
  };

  // Format hourly data (ambil 8 jam ke depan dari waktu sekarang)
  const currentHourString = current.time.substring(0, 14) + "00"; // Normalize to top of the hour
  const startIndex = weatherData.hourly.time.indexOf(currentHourString) !== -1 
                     ? weatherData.hourly.time.indexOf(currentHourString) + 1 
                     : 1;

  const formattedHourly = [];
  for (let i = 0; i < 8; i++) {
    const idx = startIndex + i;
    const hTimeStr = weatherData.hourly.time[idx];
    const hTempC = weatherData.hourly.temperature_2m[idx];
    const hCode = weatherData.hourly.weather_code[idx];
    const hIsDay = weatherData.hourly.is_day[idx];
    
    const timeObj = new Date(hTimeStr);
    const hours = timeObj.getHours().toString().padStart(2, '0');

    formattedHourly.push({
      time: `${hours}:00`,
      tempC: Math.round(hTempC),
      tempF: Math.round((hTempC * 9/5) + 32),
      icon: wmoToIcon(hCode, hIsDay, lang).icon
    });
  }

  // Format daily data (ambil 5 hari)
  const formattedDaily = [];
  for (let i = 0; i < 5; i++) {
    const dTimeStr = weatherData.daily.time[i];
    const dMaxC = weatherData.daily.temperature_2m_max[i];
    const dMinC = weatherData.daily.temperature_2m_min[i];
    const dCode = weatherData.daily.weather_code[i];

    formattedDaily.push({
      day: i === 0 ? (lang === 'id' ? "Hari Ini" : "Today") : getDayName(dTimeStr, lang),
      maxC: Math.round(dMaxC),
      minC: Math.round(dMinC),
      maxF: Math.round((dMaxC * 9/5) + 32),
      minF: Math.round((dMinC * 9/5) + 32),
      condition: wmoToIcon(dCode, 1, lang).condition,
      icon: wmoToIcon(dCode, 1, lang).icon,
      morningC: Math.round(dMinC + 1),
      afternoonC: Math.round(dMaxC),
      eveningC: Math.round(dMinC + 2)
    });
  }

  return {
    current: formattedCurrent,
    hourly: formattedHourly,
    daily: formattedDaily
  };
};

export const fetchWeatherData = async (cityName, lang = 'id') => {
  try {
    // 1. Dapatkan koordinat (Geocoding API)
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`);
    const geoData = await geoResponse.json();
    
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(lang === 'id' ? "Kota tidak ditemukan" : "City not found");
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    
    return await getWeatherFromCoords(latitude, longitude, name, country, lang);
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
};

export const fetchWeatherByCoords = async (latitude, longitude, lang = 'id') => {
  try {
    // Reverse Geocoding gratis menggunakan BigDataCloud
    const revGeoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    const revGeoData = await revGeoResponse.json();
    
    const name = revGeoData.city || revGeoData.locality || (lang === 'id' ? "Lokasi Saat Ini" : "Current Location");
    const country = revGeoData.countryName || "";
    
    return await getWeatherFromCoords(latitude, longitude, name, country, lang);
  } catch (error) {
    console.error("Error fetching weather by coords:", error);
    throw error;
  }
};
