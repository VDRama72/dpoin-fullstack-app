// ✅ FILE: backend/utils/distanceCalculator.js (Baru)

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

exports.calculateDistance = (loc1, loc2) => {
  const R = 6371; // Radius Bumi dalam kilometer
  const lat1 = toRadians(loc1.lat);
  const lat2 = toRadians(loc2.lat);
  const deltaLat = toRadians(loc2.lat - loc1.lat);
  const deltaLon = toRadians(loc2.lon - loc1.lon);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};