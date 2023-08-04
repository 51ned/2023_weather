import type { ItemProps } from '../lib/interfaces'


self.onmessage = async (e: MessageEvent) => {
  if (e.data.type === 'initReq') {
    const res = await getData<ItemProps>(`/data/${e.data.chartName}.json`)
    const chartData = res.map(item => item.v)

    self.postMessage({type: 'initRes', chartData: chartData})
  }

  if (e.data.type === 'extractReq') {
    await extractStore(e.data.chartName)
  }
}


async function getData<T>(url: string): Promise<T[]> {
  const res = await fetch(url)

  if (res.ok) {
    return await res.json()
  }

  throw new Error()
}


async function extractStore(chartName: string) {
  const reqDB = indexedDB.open('WeatherDB')

  reqDB.onsuccess = () => {
    const tx = reqDB.result.transaction(`${chartName}`, 'readonly')
    const store = tx.objectStore(`${chartName}`)

    const storeReq = store.getAll()

    storeReq.onsuccess = () => self.postMessage({type: 'extractRes', chartData: storeReq.result})
    storeReq.onerror = (e: Event) => console.error((e.target as IDBRequest).error)

    tx.oncomplete = () => reqDB.result.close()
    tx.onerror = (e: any) => console.error((e.target as IDBTransaction).error)
  }
}
