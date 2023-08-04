self.onmessage = async (e: MessageEvent) => {
  await createStore(e.data.chartName, e.data.chartData, e.data.verDB)
}


async function createStore(chartName: string, chartData: number[], verDB: number) {
  const reqDB = indexedDB.open('WeatherDB', verDB)

  reqDB.onupgradeneeded = () => {
    reqDB.result.createObjectStore(`${chartName}`, { autoIncrement: true })
    reqDB.result.onerror = (e: Event) => console.error((e.target as IDBRequest).error)
  }

  reqDB.onerror = (e: Event) => console.error((e.target as IDBRequest).error)

  reqDB.onsuccess = () => {
    const tx = reqDB.result.transaction(`${chartName}`, 'readwrite')
    const store = tx.objectStore(`${chartName}`)

    chartData?.forEach(item => store.add(item))

    tx.oncomplete = () => reqDB.result.close()
    tx.onerror = (e: Event) => console.error((e.target as IDBTransaction).error)
  }
}