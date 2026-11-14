/* Deutsch-Trener: service worker wersji na telefon (PWA). Trzyma aplikację w pamięci telefonu, więc działa bez internetu.
   Wersję (skrót index.html) wstawia src/narzedzia/zbuduj.py, więc każda nowa paczka pobiera się sama
   przy następnym uruchomieniu z internetem. */
const WERSJA = "deutsch-trener-625a46f86073";
const PLIKI = ["./", "index.html", "manifest.webmanifest", "ikona-180.png", "ikona-192.png", "ikona-512.png", "ikona-maskowalna-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(WERSJA)
    .then((c) => c.addAll(PLIKI.map((u) => new Request(u, { cache: "reload" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((klucze) => Promise.all(klucze.filter((k) => k.startsWith("deutsch-trener-") && k !== WERSJA).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== self.location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(caches.match("index.html").then((odp) => odp || fetch(r)));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then((odp) => odp || fetch(r)));
});
