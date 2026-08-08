export function WeatherMetrics({ data, t }) {
  const MetricRow = ({ label, value, unit }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
      <span className="text-white/70 text-sm font-light">{label}:</span>
      <span className="text-white text-sm font-medium">{value} {unit}</span>
    </div>
  );

  return (
    <div className="flex flex-col text-white drop-shadow-md">
      <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-white">More Details:</h3>
      <div className="flex flex-col">
        <MetricRow label={t.metrics.wind} value={data.windSpeed} unit={t.metrics.units.wind} />
        <MetricRow label={t.metrics.humidity} value={data.humidity} unit="%" />
        <MetricRow label={t.metrics.pressure} value={data.pressure} unit="hPa" />
        <MetricRow label={t.metrics.uvIndex} value={data.uvIndex} unit="" />
        <MetricRow label={t.metrics.visibility} value={data.visibility} unit={t.metrics.units.distance} />
        <MetricRow label={t.metrics.dewPoint} value={data.dewPoint} unit="°C" />
      </div>
    </div>
  );
}
