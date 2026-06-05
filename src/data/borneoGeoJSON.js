// src/data/borneoGeoJSON.js
export const borneoData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "nama": "KALBAR", "warna": "#10B981" }, // Hijau
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [108.9, -2.4], [110.5, -3.1], [111.4, -2.4], [112.5, -1.0], [114.1, -1.2],
          [114.2, -0.6], [113.8, 0.7], [112.6, 1.4], [110.8, 1.6], [109.6, 2.1],
          [108.9, 0.8], [109.3, -0.9], [108.9, -2.4]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "nama": "KALTENG", "warna": "#EF4444" }, // Merah
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [110.5, -3.1], [112.5, -3.4], [114.5, -3.6], [114.8, -3.2], [114.3, -2.5],
          [115.3, -1.9], [115.1, -0.7], [114.1, -1.2], [112.5, -1.0], [111.4, -2.4],
          [110.5, -3.1]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "nama": "KALSEL", "warna": "#3B82F6" }, // Biru
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [114.5, -3.6], [115.0, -4.1], [116.1, -4.0], [116.3, -3.5], [116.7, -2.5],
          [116.2, -1.9], [115.3, -1.9], [114.3, -2.5], [114.5, -3.6]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "nama": "KALTIM", "warna": "#F59E0B" }, // Oranye
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [116.2, -1.9], [116.7, -2.5], [117.2, -1.2], [117.2, -0.5], [118.4, 1.2],
          [118.9, 2.3], [117.4, 2.1], [116.3, 1.9], [115.1, -0.7], [115.3, -1.9],
          [116.2, -1.9]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "nama": "KALTARA", "warna": "#8B5CF6" }, // Ungu
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [115.1, -0.7], [116.3, 1.9], [117.4, 2.1], [118.9, 2.3], [118.0, 3.5],
          [117.5, 4.3], [116.0, 4.8], [114.5, 4.2], [115.2, 2.8], [115.1, -0.7]
        ]]
      }
    }
  ]
};