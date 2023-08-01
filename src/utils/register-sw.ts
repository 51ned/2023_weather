export function registerSW(chartName: string, verDB: number) {
  const queryParams = new URLSearchParams({ chartname: chartName, verdb: String(verDB) })
  const swURL = `/main-sw.js?${queryParams}`

  navigator.serviceWorker.register(swURL)
}