import { useState, useEffect } from 'react';
import { WeatherIcon } from './WeatherIcon';

export function CurrentWeather({ data, isCelsius, setIsCelsius, t }) {
  const temp = isCelsius ? data.tempC : data.tempF;

  // Real-time clock for the target timezone
  const [liveTime, setLiveTime] = useState('');
  const [liveDate, setLiveDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      if (!data || !data.timezone) return;
      
      const now = new Date();
      
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: data.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      // Use standard locale string for the UI based on whether t is ID or EN
      const locale = t.app.menu === 'Menu' && t.current.sunrise === 'Sunrise' ? 'en-US' : 'id-ID';
      
      const dateFormatter = new Intl.DateTimeFormat(locale, {
        timeZone: data.timezone,
        weekday: 'long', 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric'
      });
      
      setLiveTime(timeFormatter.format(now));
      setLiveDate(dateFormatter.format(now));
    };

    updateTime(); // Initial set
    const intervalId = setInterval(updateTime, 1000); // Update every second
    
    return () => clearInterval(intervalId);
  }, [data?.timezone, t]);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-10 w-full bg-transparent border-transparent">
      {/* Icon and Sunrise/Sunset */}
      <div className="flex flex-col items-center">
        <WeatherIcon name={data.icon} className="w-28 h-28 text-white drop-shadow-md mb-6" />
        <div className="text-xs text-white/80 space-y-1 tracking-wider">
          <p>{t.current.sunrise}: 05:30</p>
          <p>{t.current.sunset}: 17:45</p>
        </div>
      </div>
      
      {/* Main Temperature and Info */}
      <div className="flex flex-col items-start drop-shadow-md">
        <h2 className="text-lg md:text-xl font-medium text-white mb-2">
          {liveDate || data.date} {liveTime || data.time}
        </h2>
        
        <div className="flex items-start">
          <span className="text-[5rem] xl:text-[7rem] leading-none font-bold text-white mb-4">
            +{temp}°{isCelsius ? 'C' : 'F'}
          </span>
        </div>
        
        <p className="text-xl md:text-2xl text-white font-medium mb-1">
          {t.current.feelsLike} {temp + (isCelsius ? 1 : 2)}°
        </p>
        <p className="text-sm md:text-base text-white/80 font-light">
          {t.current.condition.replace('{condition}', data.condition)}
        </p>
      </div>
    </div>
  );
}
