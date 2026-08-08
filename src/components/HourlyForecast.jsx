import { WeatherIcon } from './WeatherIcon';

export function HourlyForecast({ data, isCelsius }) {
  // Batasi hanya 7 jam agar muat sempurna tanpa terpotong di desktop
  const displayData = data.slice(0, 7);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/20 shadow-xl">
      <div className="flex justify-between items-center w-full">
        {displayData.map((hour, index) => {
          const temp = isCelsius ? hour.tempC : hour.tempF;
          return (
            <div 
              key={index} 
              className="flex flex-col items-center gap-4"
            >
              <span className="text-xs text-white/70 font-medium">{hour.time}</span>
              <WeatherIcon name={hour.icon} className="w-8 h-8 text-white drop-shadow-sm" />
              <span className="text-xl font-medium text-white">+{temp}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
