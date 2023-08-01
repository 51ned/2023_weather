import type { ItemProps } from '../lib/interfaces'


const dataChannel = new BroadcastChannel('dataChannel')
const funcChannel = new BroadcastChannel('funcChannel')


let chartName: string | null
let data: number[] | null
let verDB: number


self.addEventListener('install', async () => {
  const url = new URL(self.location.href)
  const urlParams = new URLSearchParams(url.search)

  chartName = urlParams.get('chartname')
  verDB = Number(urlParams.get('verdb'))

  const res = await getData<ItemProps>(`/data/${chartName}.json`)
  data = res.map(item => item.v)

  dataChannel.postMessage(data)
  funcChannel.postMessage(`${chartName}StoreExist`)
  createStore(data)
})


funcChannel.onmessage = e => {
  chartName = e.data.chartName
  verDB = e.data.verDB

  extractStore()
}


async function getData<T>(url: string): Promise<T[]> {
  const res = await fetch(url)

  if (res.ok) {
    return await res.json()
  }

  throw new Error()
}


async function createStore(data: number[]) {
  const reqDB = indexedDB.open('WeatherDB', verDB)

  reqDB.onupgradeneeded = () => {
    reqDB.result.createObjectStore(`${chartName}`, { autoIncrement: true })
    reqDB.result.onerror = (e: Event) => console.error((e.target as IDBRequest).error)
  }

  reqDB.onerror = (e: Event) => console.error((e.target as IDBRequest).error)

  reqDB.onsuccess = () => {
    const tx = reqDB.result.transaction(`${chartName}`, 'readwrite')
    const store = tx.objectStore(`${chartName}`)

    data.forEach(item => store.add(item))

    tx.oncomplete = () => reqDB.result.close()
    tx.onerror = (e: Event) => console.error((e.target as IDBTransaction).error)
  }
}


async function extractStore() {
  const reqDB = indexedDB.open('WeatherDB')

  reqDB.onsuccess = () => {
    const tx = reqDB.result.transaction(`${chartName}`, 'readonly')
    const store = tx.objectStore(`${chartName}`)

    const storeReq = store.getAll()

    storeReq.onsuccess = () => dataChannel.postMessage(storeReq.result)
    storeReq.onerror = (e: Event) => console.error((e.target as IDBRequest).error)

    tx.oncomplete = () => reqDB.result.close()
    tx.onerror = (e: any) => console.error((e.target as IDBTransaction).error)
  }
}
