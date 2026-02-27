import type { Message, TasteProfile, WineEntry } from "./types";
import { STORAGE_KEY, TASTE_PROFILE_KEY, CELLAR_KEY } from "./types";

const EMPTY_TASTE: TasteProfile = {
  regions: [],
  grapes: [],
  styles: [],
  priceRange: "",
  occasions: [],
};

/* ─── Messages ─── */
export function loadMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMessages(msgs: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn("Storage quota exceeded when saving messages, stripping images");
    }
    try {
      const lightweight = msgs.map((m) => ({
        ...m,
        image: m.image ? "[img_omitted]" : undefined,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    } catch {
      console.warn("Storage quota exceeded even after stripping images");
    }
  }
}

/* ─── Taste Profile ─── */
export function loadTasteProfile(): TasteProfile {
  if (typeof window === "undefined") return { ...EMPTY_TASTE };
  try {
    const raw = localStorage.getItem(TASTE_PROFILE_KEY);
    if (!raw) return { ...EMPTY_TASTE };
    return JSON.parse(raw);
  } catch {
    return { ...EMPTY_TASTE };
  }
}

export function saveTasteProfile(profile: TasteProfile) {
  try {
    localStorage.setItem(TASTE_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // silently ignore
  }
}

/* ─── Cellar ─── */
export function loadCellar(): WineEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CELLAR_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCellar(entries: WineEntry[]): boolean {
  try {
    localStorage.setItem(CELLAR_KEY, JSON.stringify(entries));
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      console.warn("Storage quota exceeded when saving cellar");
      try {
        const lightweight = entries.map((entry) => ({
          ...entry,
          image: entry.image ? undefined : undefined,
        }));
        localStorage.setItem(CELLAR_KEY, JSON.stringify(lightweight));
        return true;
      } catch {
        // truly full
      }
    }
    return false;
  }
}
