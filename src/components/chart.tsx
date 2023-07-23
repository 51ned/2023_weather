import { useContext, useEffect, useState } from 'react'

import { ChartContext, YearsContext } from '../stores'

import { Canvas, Placeholder } from './'

import { getIndexes } from '../utils'

import { NAME_DB } from '../lib/consts'


export function Chart() {
  const { yearsState } = useContext(YearsContext)
  const { firstYear, lastYear } = yearsState

  const { chartState } = useContext(ChartContext)
  const { chartName } = chartState

  const [trigger, setTrigger] = useState<string | null>(null)
  const [points, setPoints] = useState<number[] | null>()

  
  useEffect(() => {
    const storageListner = setInterval(() => {
      if (localStorage.getItem(`${chartName}StoreFilled`) === 'true') {
        setTrigger('wake up and fight') // you in the army now
        clearInterval(storageListner)
      }
    }, 100)
  }, [chartName, firstYear, lastYear])


  useEffect(() => {
    if (trigger) {
      const reqDB = indexedDB.open(NAME_DB)
  
      reqDB.onsuccess = () => {
        const tx = reqDB.result.transaction(`${chartName}`, 'readonly')
        const store = tx.objectStore(`${chartName}`)
  
        const [firstIndex, lastIndex] = getIndexes(firstYear, lastYear)
        const range = IDBKeyRange.bound(firstIndex, lastIndex)
        
        const storeReq = store.getAll(range)
        
        storeReq.onsuccess = () => setPoints(storeReq.result)
        storeReq.onerror = (e: Event) => console.error(`${(e.target as IDBRequest).error}`)
  
        tx.oncomplete = () => reqDB.result.close()
        tx.onerror = (e: Event) => console.error(`${(e.target as IDBTransaction).error}`)
      }
    }
  
    return () => {
      setTrigger(null)
      setPoints(null)
    }
  }, [chartName, firstYear, lastYear, trigger])


  return (
    <>
      { !points ? <Placeholder /> : <Canvas points={points} /> }
    </>
  )
}
