const DEMO_KEY = "pdf-filler-demo-gemini-key";

export function setDemoApiKey(key: string): void {
  sessionStorage.setItem(DEMO_KEY, key.trim());
}

export function getDemoApiKey(): string | null {
  return sessionStorage.getItem(DEMO_KEY);
}

export function clearDemoApiKey(): void {
  sessionStorage.removeItem(DEMO_KEY);
}
