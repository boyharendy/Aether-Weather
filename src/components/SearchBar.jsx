import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';

export function SearchBar({ onSearch, onLocationClick, t }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" size={18} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t.search.placeholder}
        className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 backdrop-blur-md rounded-full py-2.5 pl-12 pr-12 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all text-sm font-medium shadow-sm"
      />
      <button 
        type="button" 
        onClick={onLocationClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors group"
        title={t.search.currentLocation}
      >
        <MapPin size={18} className="group-hover:scale-110 transition-transform" />
      </button>
    </form>
  );
}
