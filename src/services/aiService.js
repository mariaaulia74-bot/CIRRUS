import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Fungsi untuk meminta rekomendasi aktivitas ke gemini berdasarkan data cuaca CIRRUS
 * @param {Object} dataCuaca - Objek data cuaca dari weatherService
 */
export const getAIOpinion = async (dataCuaca) => {
    // Membaca API Key format AQ. secara aman dari file .env
    const apiKeyGemini = import.meta.env.VITE_GEMINI_API_KEY; 
    
    if (!apiKeyGemini) {
        console.warn("VITE_GEMINI_API_KEY tidak ditemukan");
        return null; 
    }

    try {
        // Konfigurasi khusus Header agar Google mengenali kunci format AQ. di browser
        const genAI = new GoogleGenerativeAI(apiKeyGemini, {
            apiHeader: {
                "Authorization": `Bearer ${apiKeyGemini}`,
                "x-goog-api-key": apiKeyGemini
            }
        });
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const promptText = `
        Kamu adalah asisten cuaca pintar untuk aplikasi CIRRUS di Kalimantan.
        Berikan rekomendasi aktivitas singkat (maksimal 3 kalimat) berbentuk notifikasi/saran yang santai, logis, dan ramah untuk user berdasarkan data berikut:
        - Kota : ${dataCuaca?.kota || 'Banjarmasin'}
        - Suhu : ${dataCuaca?.suhu || '29°'}
        - Kelembapan : ${dataCuaca?.kelembapan || '95%'}
        - Kecepatan Angin : ${dataCuaca?.kecepatanAngin || '5 km/h'}
        `;
        
        const result = await model.generateContent(promptText);
        const response = await result.response;
        
        return response.text();

    } catch (error) {
        console.error("Detail Error Gemini Terbaru:", error);
        console.warn('Gemini AI sedang membatasi limit kuota (429) atau error parameter. Sistem beralih ke teks alternatif.');
        return null; 
    }
};