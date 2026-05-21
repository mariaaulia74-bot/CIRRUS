import axios from 'axios';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const KOTA_KALIMANTAN = {
    Banjarmasin: { lat: -3.3167, lon: 114.5917 },
    Banjarbaru: { lat: -3.4500, lon: 114.7500 },
    Martapura: { lat: -3.4500, lon: 114.8500 },
    Barabai: { lat: -2.9833, lon: 115.2667 },
    Rantau: { lat: -2.9833, lon: 115.3500 },
};

/**
 * Fungsi untuk mengambil data cuaca berdasakan nama kota
 * @param {string} namaKota
 * 
 */
export const fetchWeatherByCity = async (namaKota) => {
    try {
        const kota = KOTA_KALIMANTAN[namaKota];

        if (!kooridnat) {
            throw new Error('Kota ${namaKota} belum terdaftar di sistem CIRRUS.');
        }

        //Menembak API menggunnakan Axios
        const response = await axios.get(BASE_URL, {
            params: {
                latitude: koordinat.lat,
                longitude: koordinat.lon,
                current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
                timezone: 'Asia/Makassar',
            },
        });

        const currentData = response.data.current;
        return {
            kota: namaKota,
            suhu:'${currentData.temperature_2m}°C',
            kelembapan:'${currentData.relative_humidity_2m}%',
            kecepatanAnginn:'${currentData.wind_speed_10m} km/h',
            kodeCuaca: currentData.weather_code,
        };

    } catch (error) {
        console.error('Gagal mengambil data cuaca CIRRUS:', error);
        throw error;
    }
};