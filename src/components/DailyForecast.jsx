import { WeatherIcon } from './WeatherIcon';

export function DailyForecast({ data, isCelsius, t }) {
  return (
    <div className="w-full">
      <div className="flex items-center border-b border-white/20 mb-8 pb-4">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b-2 border-amber-400 pb-4 -mb-[18px]">
          {t.daily.forecast}
        </h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 w-full">
        {data.map((day, index) => {
          const max = isCelsius ? day.maxC : day.maxF;
          const min = isCelsius ? day.minC : day.minF;
          
          return (
            <div key={index} className="flex flex-col items-start gap-3 w-full group cursor-default">
              <span className="text-sm font-bold text-white uppercase tracking-widest group-hover:text-amber-400 transition-colors">{day.day}</span>
              <div className="text-xs text-white/70 space-y-1">
                <p>{t.daily.min} +{min}°</p>
                <p>{t.daily.max} +{max}°</p>
              </div>
              <WeatherIcon name={day.icon} className="w-10 h-10 text-white drop-shadow-md my-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs text-white/70 leading-snug">{day.condition}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
