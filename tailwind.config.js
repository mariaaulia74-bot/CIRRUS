/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Daftarkan warna asli dari Figma di sini
        'figma-light-blue': '#BEE6FF', // <--- SAMAKAN KODE INI DENGAN FIGMA
        'figma-dark-blue': '#1E40AF',  // <--- Warna teks/tombol asli Figma
      },
      // 👇 UPDATE ANIMASI UNTUK DUA ARAH (KIRI DAN KANAN)
      animation: {
        'awan-kiri': 'marqueeKiri 25s linear infinite',
        'awan-kanan': 'marqueeKanan 30s linear infinite',
      },
      // 👇 UPDATE KEYFRAMES NYA JUGA DI SINI
      keyframes: {
        marqueeKiri: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeKanan: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}