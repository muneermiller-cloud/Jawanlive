import { StremioManifest, StreamItemMeta, StreamResponse, StreamSource } from '../types';

export const DEFAULT_MANIFEST_URL =
  'https://premium.highfly.to/7d266189-d723-4469-b111-8c3b48b79abe/eyJpbmNsdWRlU3BvcnRzIjpbImZvb3RiYWxsIl0sInRpbWV6b25lIjoiR1NUIn0/manifest.json';

const MANIFEST_STORAGE_KEY = 'live_streaming_manifest_url';

export function getSavedManifestUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_MANIFEST_URL;
  const saved = localStorage.getItem(MANIFEST_STORAGE_KEY);
  return saved?.trim() ? saved : DEFAULT_MANIFEST_URL;
}

export function saveManifestUrl(url: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MANIFEST_STORAGE_KEY, url.trim());
}

export function getBaseUrl(manifestUrl: string): string {
  return manifestUrl.replace(/\/manifest\.json\/?$/, '');
}

async function fetchJsonViaProxy<T>(url: string): Promise<T> {
  const proxyUrl = `/api/streamed/fetch?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url} (${response.status})`);
  }
  return response.json();
}

export async function fetchManifest(manifestUrl: string = getSavedManifestUrl()): Promise<StremioManifest> {
  return fetchJsonViaProxy<StremioManifest>(manifestUrl);
}

export async function fetchCatalog(
  manifestUrl: string,
  type: string,
  catalogId: string
): Promise<StreamItemMeta[]> {
  const base = getBaseUrl(manifestUrl);
  const catalogUrl = `${base}/catalog/${type}/${catalogId}.json`;
  const result = await fetchJsonViaProxy<{ metas?: StreamItemMeta[] }>(catalogUrl);
  return result.metas || [];
}

export async function fetchItemStreams(
  manifestUrl: string,
  type: string,
  itemId: string
): Promise<StreamSource[]> {
  const base = getBaseUrl(manifestUrl);
  const streamUrl = `${base}/stream/${type}/${encodeURIComponent(itemId)}.json`;
  const result = await fetchJsonViaProxy<StreamResponse>(streamUrl);
  return result.streams || [];
}

export function parseKickoffDate(releaseInfo?: string): Date | null {
  if (!releaseInfo) return null;
  // Format examples: "27 Sep 2026 · 03:30", "20 Sep 2026 · 2h 25m"
  const parts = releaseInfo.split('·').map((s) => s.trim());
  if (parts.length < 2) return null;
  const dateStr = parts[0];
  const timeStr = parts[1];

  // If timeStr is duration (e.g. "2h 25m"), it's a recap
  if (timeStr.includes('h') || timeStr.includes('m')) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  const combined = `${dateStr} ${timeStr} GST`;
  const d = new Date(combined);
  if (!isNaN(d.getTime())) return d;

  const fallback = new Date(`${dateStr} ${timeStr}`);
  return isNaN(fallback.getTime()) ? null : fallback;
}
