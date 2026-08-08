import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { WeatherMetrics } from './components/WeatherMetrics';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { FavoritesSidebar } from './components/FavoritesSidebar';
import { WeatherBackground } from './components/WeatherBackground';
import { mockFavorites } from './mockData';
import { Menu, MapPin, Loader2, AlertCircle, Globe } from 'lucide-react';
import { fetchWeatherData, fetchWeatherByCoords } from './services/weatherApi';
import { translations } from './translations';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState({ type: 'city', value: 'Jakarta' });
  const [isCelsius, setIsCelsius] = useState(true);
  
  // Ambil favorites dari localStorage atau gunakan mockFavorites sebagai awalan
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('aether-favorites');
    if (saved) return JSON.parse(saved);
    return mockFavorites;
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('aether-lang') || 'id';
  });

  const [isLangMenuOpen, setLangMenuOpen] = useState(false);
  const t = translations[lang];

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('aether-lang', newLang);
    setLangMenuOpen(false);
  };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        let weatherData;
        if (locationQuery.type === 'city') {
          weatherData = await fetchWeatherData(locationQuery.value, lang);
        } else if (locationQuery.type === 'coords') {
          weatherData = await fetchWeatherByCoords(locationQuery.lat, locationQuery.lon, lang);
        }
        setData(weatherData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadWeather();
  }, [locationQuery, lang]);

  const handleSearch = (val) => {
    if (val.trim() !== '') {
      setLocationQuery({ type: 'city', value: val.trim() });
    }
  };

  const handleLocationClick = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationQuery({
            type: 'coords',
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (err) => {
          setError(t.geo.failed);
          setLoading(false);
        }
      );
    } else {
      alert(t.geo.notSupported);
    }
  };

  const handleAddFavorite = () => {
    if (data && data.current) {
      const cityId = locationQuery.type === 'city' ? locationQuery.value : data.current.location;
      const newFav = {
        id: cityId,
        city: data.current.location.split(',')[0].trim(),
        country: data.current.location.split(',')[1]?.trim() || '',
        icon: data.current.icon,
        temp: data.current.tempC
      };

      if (!favorites.some(f => f.city.toLowerCase() === newFav.city.toLowerCase())) {
        const updated = [...favorites, newFav];
        setFavorites(updated);
        localStorage.setItem('aether-favorites', JSON.stringify(updated));
      } else {
        alert(t.sidebar.locationExists);
      }
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans">
        <Loader2 className="animate-spin w-12 h-12 mb-4 text-white/80" />
        <p className="tracking-widest uppercase font-medium text-white/80 text-sm">{t.app.connecting}</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans">
        <AlertCircle className="w-16 h-16 mb-4 text-red-400" />
        <h2 className="text-2xl font-bold mb-2">{t.app.errorTitle}</h2>
        <p className="text-zinc-400 mb-8">{error}</p>
        <button 
          onClick={() => setLocationQuery({ type: 'city', value: 'Jakarta' })} 
          className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all text-sm font-bold tracking-widest uppercase"
        >
          {t.app.backToJakarta}
        </button>
      </div>
    );
  }

  return (
    <WeatherBackground icon={data.current.icon} time={data.current.time}>
      <div className="text-zinc-100 selection:bg-zinc-700/50 font-sans">
      <FavoritesSidebar 
        favorites={favorites} 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onSelect={(fav) => setLocationQuery({ type: 'city', value: fav.id })}
        onAddFavorite={handleAddFavorite}
        isCelsius={isCelsius}
        t={t}
      />

      <div className="w-full min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-16 xl:px-24 py-8 lg:py-12 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 text-white text-sm font-medium">
          {/* Left: Logo and Location */}
          <div className="flex items-center gap-4 lg:gap-6">
            <h1 className="text-xl font-bold tracking-widest uppercase text-white drop-shadow-md">
              Aether
            </h1>
            <div className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
              <MapPin size={16} className="text-white/80" />
              <p className="text-white/80">{t.header.weatherIn} <strong className="text-white font-medium">{data.current.location}</strong></p>
            </div>
          </div>
          
          {/* Middle: Unit Toggle */}
          <div className="flex items-center bg-white/10 border border-white/20 backdrop-blur-md p-1 rounded-full text-white/70 shadow-sm">
            <button 
              onClick={() => setIsCelsius(true)}
              className={`px-3 py-1.5 rounded-full transition-all text-xs font-bold ${isCelsius ? 'bg-white/20 text-white shadow-sm' : 'hover:text-white'}`}
            >
              °C
            </button>
            <button 
              onClick={() => setIsCelsius(false)}
              className={`px-3 py-1.5 rounded-full transition-all text-xs font-bold ${!isCelsius ? 'bg-white/20 text-white shadow-sm' : 'hover:text-white'}`}
            >
              °F
            </button>
          </div>

          {/* Right: Search & Menu */}
          <div className="flex items-center gap-3 lg:gap-4 relative">
            <div className="w-48 lg:w-60">
              <SearchBar 
                onSearch={handleSearch} 
                onLocationClick={handleLocationClick} 
                t={t}
              />
            </div>
            
            {/* Loading Indicator for subsequent requests */}
            {loading && data && (
              <div className="absolute -left-8">
                <Loader2 className="w-5 h-5 animate-spin text-white/70" />
              </div>
            )}
            
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center justify-center w-10 h-10 bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all shadow-sm"
                title="Change Language"
              >
                <Globe size={18} />
              </button>
              
              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)}></div>
                  <div className="absolute top-14 right-0 w-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg z-50 flex flex-col overflow-hidden p-1">
                    <button 
                      onClick={() => changeLanguage('id')}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors rounded-xl ${lang === 'id' ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/15 hover:text-white'}`}
                    >
                      Indonesia (ID)
                    </button>
                    <button 
                      onClick={() => changeLanguage('en')}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors rounded-xl ${lang === 'en' ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/15 hover:text-white'}`}
                    >
                      English (EN)
                    </button>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full text-white transition-all uppercase tracking-widest text-xs font-bold shadow-sm"
            >
              <Menu size={16} />
              {t.app.menu}
            </button>
          </div>
        </header>

        {/* Main Content Grid (Pushed to bottom) */}
        <main className="flex flex-col w-full mt-auto pt-12">
          
          {/* Top Row: Current, Metrics, Hourly */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 xl:gap-12 mb-12">
            
            {/* Left: Current Weather */}
            <div className="flex-none xl:w-2/5 flex items-center justify-center xl:justify-start">
              <CurrentWeather 
                data={data.current} 
                isCelsius={isCelsius} 
                t={t}
              />
            </div>
            
            {/* Middle: Metrics */}
            <div className="flex-none xl:w-1/5 flex items-center justify-center xl:justify-start">
              <WeatherMetrics data={data.current} t={t} />
            </div>

            {/* Right: Hourly Forecast */}
            <div className="flex-1 w-full xl:max-w-xl flex items-center justify-end">
              <div className="w-full">
                <HourlyForecast data={data.hourly} isCelsius={isCelsius} />
              </div>
            </div>
          </div>

          {/* Bottom Row: Daily Forecast */}
          <div className="w-full">
            <DailyForecast data={data.daily} isCelsius={isCelsius} t={t} />
          </div>

        </main>
      </div>
      </div>
    </WeatherBackground>
  );
}

export default App;
