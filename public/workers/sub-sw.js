self.onmessage = async e => {
  await createStore(e.data.chartName, e.data.chartData, e.data.verDB)
}


async function createStore(chartName, chartData, verDB) {
  const reqDB = indexedDB.open('WeatherDB', verDB)

  reqDB.onupgradeneeded = () => {
    reqDB.result.createObjectStore(`${chartName}`, { autoIncrement: true })
    reqDB.result.onerror = e => console.error(e.target.error)
  }

  reqDB.onerror = e => console.error(e.target.error)

  reqDB.onsuccess = () => {
    const tx = reqDB.result.transaction(`${chartName}`, 'readwrite')
    const store = tx.objectStore(`${chartName}`)

    chartData?.forEach(item => store.add(item))

    tx.oncomplete = () => reqDB.result.close()
    tx.onerror = e => console.error(e.target.error)
  }
}