self.onmessage = async e => {
  if (e.data.type === 'initReq') {
    const res = await getData(`/data/${e.data.chartName}.json`)
    const chartData = res.map(item => item.v)

    self.postMessage({type: 'initRes', chartData: chartData})
  }

  if (e.data.type === 'extractReq') {
    await extractStore(e.data.chartName)
  }
}


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

    storeReq.onsuccess = () => self.postMessage({type: 'extractRes', chartData: storeReq.result})
    storeReq.onerror = e => console.error(e.target.error)

    tx.oncomplete = () => reqDB.result.close()
    tx.onerror = e => console.error(e.target.error)
  }
}
