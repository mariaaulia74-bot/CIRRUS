import { GoogleGenAI } from "@google/genai";

/**
 * Fungsi untuk meminta rekomendasi aktivitas ke gemini berdasarkan data cuaca CIRRUS
 * @param {Object} dataCuaca - Objek data cuaca dari weatherService
 */
export const getAIOpinion = async (dataCuaca) => {
    // KUNCI KEAMANAN 1: Ambil API Key di dalam fungsi agar tidak crash saat rendering awal
    const apiKeyGemini = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKeyGemini) {
        console.warn("VITE_GEMINI_API_KEY tidak ditemukan di .env");
        return null; // Kembalikan null agar App.jsx tahu harus memakai teks cadangan lokal
    }

    try {
        const ai = new GoogleGenAI({ apiKey: apiKeyGemini });
        
        // Menyusun teks perintah (prompt) otomatis berdasarkan data cuaca asli
        const promptText = `
        Kamu adalah asisten cuaca pintar untuk aplikasi CIRRUS di Kalimantan.
        Berikan rekomendasi aktivitas singkat (maksimal 3 kalimat) berbentuk notifikasi/saran yang santai, logis, dan ramah untuk user berdasarkan data berikut:
        - Kota : ${dataCuaca.kota}
        - Suhu : ${dataCuaca.suhu}
        - Kelembapan : ${dataCuaca.kelembapan}
        - Kecepatan Angin : ${dataCuaca.kecepatanAngin}
        `;
        
        // Menggunakan Gemini 2.0 Flash
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash', 
            contents: promptText,
        });
            
        return response.text();

    } catch (error) {
        // KUNCI KEAMANAN 2: Tangkap error 429 secara damai tanpa merusak alur data cuaca utama
        console.warn('Gemini AI sedang membatasi limit kuota (429). Sistem beralih ke teks alternatif.');
        return null; 
    }
};