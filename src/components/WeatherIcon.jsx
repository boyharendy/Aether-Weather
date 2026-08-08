import { CloudSun, Sun, CloudRain, Cloud, Moon, CloudLightning, CloudFog, CloudSnow } from 'lucide-react';

export function WeatherIcon({ name, className = "" }) {
  switch (name) {
    case 'cloud-sun': return <CloudSun className={className} />;
    case 'sun': return <Sun className={className} />;
    case 'cloud-rain': return <CloudRain className={className} />;
    case 'cloud': return <Cloud className={className} />;
    case 'moon': return <Moon className={className} />;
    case 'cloud-lightning': return <CloudLightning className={className} />;
    case 'cloud-fog': return <CloudFog className={className} />;
    case 'cloud-snow': return <CloudSnow className={className} />;
    default: return <Sun className={className} />;
  }
}
