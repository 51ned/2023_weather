import React, { Dispatch, SetStateAction, createContext, useState } from 'react'


type WeatherStateProps = {
  chartType: string,
  firstYear: string,
  lastYear: string
}

interface WeatherContextProps {
  setGlobalState: Dispatch<SetStateAction<WeatherStateProps>>,
  globalState: WeatherStateProps
}


const WeatherContext = createContext({} as WeatherContextProps)


function Provider({ children }: any) {
  const [globalState, setGlobalState] = useState({
    chartType: 'temperature',
    firstYear: '1881',
    lastYear: '2006'
  })

  return (
    <WeatherContext.Provider value={{ globalState, setGlobalState }}>
      { children }
    </WeatherContext.Provider>
  )
}


export { WeatherContext, Provider }
export type { WeatherStateProps }