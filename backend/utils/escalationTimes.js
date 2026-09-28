export const escalationTimes = {
  low: {
    1: { next: 2, delay: 24 * 3600 * 1000 },     // 1 → 2
    2: { next: 3, delay: 24 * 3600 * 1000 },     // 2 → 3
    3: { next: "close", delay: 24 * 3600 * 1000 }
  },

  medium: {
    1: { next: 2, delay: 12 * 3600 * 1000 },     // 1 → 2
    2: { next: 3, delay: 24 * 3600 * 1000 },     // 2 → 3
    3: { next: 4, delay: 36 * 3600 * 1000 },     // 3 → 4
    4: { next: "close", delay: 48 * 3600 * 1000 }
  },

  high: {
    1: { next: 2, delay: 2 * 3600 * 1000 },      // 1 → 2
    2: { next: 3, delay: 12 * 3600 * 1000 },     // 2 → 3
    3: { next: 4, delay: 20 * 3600 * 1000 },     // 3 → 4
    4: { next: 5, delay: 24 * 3600 * 1000 },     // 4 → 5
    5: { next: "close", delay: 30 * 3600 * 1000 }
  }
};

export const categorySLAHours = {
  "Street Light": 48,
  "Water": 24,
  "Road": 72,
  "Garbage": 24,
  "Traffic Signal": 24,
  "Drainage": 24,
  "Electricity": 48,
  "CCTV": 48,
  "Public Building": 72,
  "Railway": 24,
  "Bridge": 72,
  "Other": 48
};

export const getCategorySLAHours = (category) => {
  if (!category) return 48;
  const match = Object.keys(categorySLAHours).find(
    (key) => key.toLowerCase() === category.toLowerCase()
  );
  return match ? categorySLAHours[match] : 48;
};