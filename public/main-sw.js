const dataChannel = new BroadcastChannel('dataChannel')
const extractChannel = new BroadcastChannel('extractChannel')
const funcChannel = new BroadcastChannel('funcChannel')


let chartName
let data
let verDB


self.addEventListener('install', async () => {
  const url = new URL(self.location.href)
  const urlParams = new URLSearchParams(url.search)
  
  chartName = urlParams.get('chartname')
  verDB = Number(urlParams.get('verdb'))

  const res = await getData<ItemProps>(`/data/${chartName}.json`)

  data = res.map(item => item.v)
  
  dataChannel.postMessage(data)
  funcChannel.postMessage(`${chartName}StoreExist`)
})


self.addEventListener('activate', e => createStore())


extractChannel.onmessage = e => extractStore(e.data)


async function getData(url) {
  const res = await fetch(url)

  if (res.ok) {
    return await res.json()
  }

  throw new Error()
}


async function extractStore(chartName) {
  const reqDB = indexedDB.open('WeatherDB')

  reqDB.onsuccess = () => {
    const tx = reqDB.result.transaction(`${chartName}`, 'readonly')
    const store = tx.objectStore(`${chartName}`)

    const storeReq = store.getAll()

    storeReq.onsuccess = () => dataChannel.postMessage(storeReq.result)
    storeReq.onerror = e => console.error(e.target.error)

    tx.oncomplete = () => reqDB.result.close()
    tx.onerror = e => console.error(e.target.error)
  }
}


async function createStore() {
  const reqDB = indexedDB.open('WeatherDB', verDB)

  reqDB.onupgradeneeded = () => {
    reqDB.result.createObjectStore(`${chartName}`, { autoIncrement: true })
    reqDB.result.onerror = e => console.error(e.target.error)
  }

  reqDB.onerror = e => console.error(e.target.error)

  reqDB.onsuccess = () => {
    const tx = reqDB.result.transaction(`${chartName}`, 'readwrite')
    const store = tx.objectStore(`${chartName}`)

    data?.forEach(item => store.add(item))

    tx.oncomplete = () => reqDB.result.close()
    tx.onerror = e => console.error(e.target.error)
  }
}