export function registerSW(chartName: string, verDB: number) {
  const queryParams = new URLSearchParams({ chartname: chartName, verdb: String(verDB) })
  const swURL = `src/workers/main-sw.ts?${queryParams}`

  navigator.serviceWorker.register(swURL)
}