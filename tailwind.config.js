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
    },
  },
  plugins: [],
}