const STORAGE_KEY = "insuregenius_history";

export function getInsights() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("Failed to read insights from localStorage", e);
    return [];
  }
}

export function addInsight(insight) {
  try {
    const existing = getInsights();
    const withMeta = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      ...insight,
    };
    const updated = [withMeta, ...existing]; // newest first
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return withMeta;
  } catch (e) {
    console.error("Failed to save insight", e);
  }
}
