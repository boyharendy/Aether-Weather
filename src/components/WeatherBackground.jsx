import React from 'react';

export const WeatherBackground = ({ icon, time, children }) => {
  // Fungsi untuk mendapatkan jam dari string waktu (misal: "10:30 AM")
  const parseHour = (timeStr) => {
    if (!timeStr) return 12; // Default ke siang jika tidak ada waktu
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let hour = parseInt(match[1]);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hour < 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      return hour;
    }
    return 12;
  };

  // Fungsi untuk menentukan rentang waktu
  const getTimeOfDay = (hour) => {
    if (hour >= 6 && hour < 17) return 'day';
    if (hour >= 17 && hour <= 18) return 'sunset';
    return 'night';
  };

  // Tentukan sumber video berdasarkan icon cuaca dan waktu
  const getVideoSource = (iconName, timeOfDay) => {
    // 1. Kondisi ekstrem (badai & kabut)
    if (iconName === 'cloud-lightning') return '/videos/weather/thunderstorm.mp4';
    if (iconName === 'cloud-fog') return '/videos/weather/fog.mp4';

    // 2. Hujan
    if (iconName === 'cloud-rain') {
      return timeOfDay === 'night' ? '/videos/weather/rain-night.mp4' : '/videos/weather/rain-day.mp4';
    }

    // 3. Berawan
    if (iconName === 'cloud' || iconName === 'cloud-sun') {
      return `/videos/weather/cloudy-${timeOfDay}.mp4`;
    }

    // 4. Cerah (sun / moon)
    return `/videos/weather/clear-${timeOfDay}.mp4`;
  };

  const hour = parseHour(time);
  const timeOfDay = getTimeOfDay(hour);
  const videoSrc = getVideoSource(icon, timeOfDay);

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden transition-all duration-1000">
      {/* HTML5 Video Background */}
      <video
        key={videoSrc} // Memaksa re-render video saat sumber berubah
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Overlay untuk memastikan teks selalu terbaca dengan baik di atas video */}
      <div className="absolute inset-0 bg-black/30 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
      
      {/* Konten Utama */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
