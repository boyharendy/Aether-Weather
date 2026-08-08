import { MapPin, X } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';

export function FavoritesSidebar({ favorites, isOpen, onClose, onSelect, onAddFavorite, isCelsius, t }) {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-[1px] z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-[#09090b] border-l border-zinc-800 z-50 transform transition-transform duration-300 ease-out shadow-2xl p-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <MapPin size={16} />
            {t.sidebar.savedLocations}
          </h2>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100vh-100px)] hide-scrollbar">
          {favorites.map((fav) => {
            const temp = isCelsius ? fav.temp : Math.round((fav.temp * 9/5) + 32);
            return (
              <div 
                key={fav.id}
                onClick={() => {
                  onSelect(fav);
                  onClose();
                }}
                className="group flex items-center justify-between p-4 bg-zinc-900/50 hover:bg-zinc-800/80 rounded-2xl cursor-pointer transition-colors"
              >
                <div>
                  <h4 className="text-base font-medium text-zinc-200 group-hover:text-zinc-50 transition-colors">{fav.city}</h4>
                  <span className="text-xs font-light text-zinc-500">{fav.country}</span>
                </div>
                <div className="flex items-center gap-4">
                  <WeatherIcon name={fav.icon} className="w-6 h-6 text-zinc-400 stroke-[1.5]" />
                  <span className="text-xl font-light text-zinc-100">{temp}°</span>
                </div>
              </div>
            );
          })}
          
          <button 
            onClick={onAddFavorite}
            className="mt-4 py-4 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-2"
          >
            <span>+</span> {t.sidebar.addLocation}
          </button>
        </div>
      </div>
    </>
  );
}
