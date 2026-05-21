import { GoogleGenAI } from "@google/genai";

// Pastikan tulisannya 'import.meta.env.VITE_GEMINI_API_KEY'
const apiKeyGemini = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKeyGemini });

/**
 * Fungsi untuk meminta rekomendasi aktivitas ke gemini berdasarkan data cuaca CIRRUS
 * @param {Object} dataCuaca - Objek data cuaca dari weatherService
 */
export const getAIOpinion = async (dataCuaca) => {
    try {
        // Menyusun teks perintah (prompt) otomatis berdasarkan data cuaca asli [cite: 1, 24]
        const promptText = `
        Kamu adalah asisten cuaca pintar untuk aplikasi CIRRUS di Kalimantan[cite: 1, 24].
        Berikan rekomendasi aktivitas singkat (maksimal 3 kalimat) yang santai, logis, dan ramah untuk user berdasarkan data berikut:
        - Kota : ${dataCuaca.kota}
        - Suhu : ${dataCuaca.suhu}
        - Kelembapan : ${dataCuaca.kelembapan}
        - Kecepatan Angin : ${dataCuaca.kecepatanAngin}
        `;
        
        // MENEMBAK API GEMINI MENGGUNAKAN MODEL TERBARU DEFAULT SDK (gemini-2.5-flash) 
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // <-- Sudah diganti ke 2.5 biar tidak eror 404 lagi
            contents: promptText,
        });
            
        // Mengembalikan teks hasil analisis dari Gemini AI
        return response.text;

    } catch (error) {
        console.error('Gagal mendapatkan rekomendasi aktivitas dari Gemini AI:', error);
        return "Gagal memuat saran aktivitas otomatis untuk saat ini.";
    }
};