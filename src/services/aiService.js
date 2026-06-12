import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Fungsi untuk meminta rekomendasi aktivitas ke gemini berdasarkan data cuaca CIRRUS
 * @param {Object} dataCuaca - Objek data cuaca dari weatherService
 */
export const getAIOpinion = async (dataCuaca) => {
    // API Key utuh dari Google AI Studio milik maria
    const apiKeyGemini = "AQ.Ab8RN6IL6apUEC3c0XAbgot4s3YZnW_T8LROEH5Q0Yt-JoXqNg"; 
    
    if (!apiKeyGemini) {
        console.warn("VITE_GEMINI_API_KEY tidak ditemukan");
        return null; 
    }

    try {
        // Menggunakan SDK @google/generative-ai yang cocok dengan endpoint generativelanguage
        const genAI = new GoogleGenerativeAI(apiKeyGemini);
        
        // Memanggil model gemini-2.0-flash
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const promptText = `
        Kamu adalah asisten cuaca pintar untuk aplikasi CIRRUS di Kalimantan.
        Berikan rekomendasi aktivitas singkat (maksimal 3 kalimat) berbentuk notifikasi/saran yang santai, logis, dan ramah untuk user berdasarkan data berikut:
        - Kota : ${dataCuaca?.kota || 'Banjarmasin'}
        - Suhu : ${dataCuaca?.suhu || '29°'}
        - Kelembapan : ${dataCuaca?.kelembapan || '95%'}
        - Kecepatan Angin : ${dataCuaca?.kecepatanAngin || '5 km/h'}
        `;
        
        // Proses request ke API Gemini
        const result = await model.generateContent(promptText);
        const response = await result.response;
        
        return response.text();

    } catch (error) {
        // Memunculkan error asli di konsol jika terjadi masalah lain (misal: kuota habis)
        console.error("Detail Error Gemini:", error);
        console.warn('Gemini AI sedang membatasi limit kuota (429) atau error parameter. Sistem beralih ke teks alternatif.');
        return null; 
    }
};