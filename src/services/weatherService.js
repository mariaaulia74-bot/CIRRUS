// 1. Data koordinat stasiun cuaca wilayah pulau Kalimantan
const lokasiKalimantan = {
  Banjarmasin: { lat: -3.3194, lon: 114.5908 },
  Pontianak: { lat: -0.0263, lon: 109.3425 },
  Samarinda: { lat: -0.4948, lon: 117.1436 },
  Palangkaraya: { lat: -2.2084, lon: 113.9181 },
  TanjungSelor: { lat: 2.8375, lon: 117.3653 }
};

/**
 * Fungsi untuk mengambil data cuaca asli stasiun BMKG/Open-Meteo
 * berdasarkan nama kota di pulau Kalimantan.
 */
export async function fetchWeatherByCity(city) {
  try {
    const titikKoordinat = lokasiKalimantan[city] || lokasiKalimantan['Banjarmasin'];
    const urlAPI = `https://api.open-meteo.com/v1/forecast?latitude=${titikKoordinat.lat}&longitude=${titikKoordinat.lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`;
    
    const response = await fetch(urlAPI);
    if (!response.ok) {
      throw new Error(`Koneksi API stasiun cuaca terputus (Status: ${response.status})`);
    }

    const dataJSON = await response.json();
    const current = dataJSON.current_weather;

    return {
      suhu: `${Math.round(current.temperature)}°`,
      kodeCuaca: current.weathercode,
      kecepatanAngin: `${current.windspeed} km/h`,
      kelembapan: dataJSON.hourly?.relative_humidity_2m?.[0] ? `${dataJSON.hourly.relative_humidity_2m[0]}%` : '85%'
    };

  } catch (error) {
    console.warn("API Cuaca Bermasalah, Mengaktifkan Data Cadangan Offline:", error);
    
    // AMANKAN DENGAN DATA CADANGAN JIKA API OPEN-METEO JATUH/OFFLINE
    return {
      suhu: "30°",
      kodeCuaca: 1, // Cerah Berawan
      kecepatanAngin: "10 km/h",
      kelembapan: "80%"
    };
  }
}