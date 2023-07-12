import { createContext, useState } from 'react'

type ChartNameProps = { chartName: string }

interface ChartContextProps {
  chartState: ChartNameProps,
  setChartState: React.Dispatch<React.SetStateAction<ChartNameProps>>
}


const ChartContext = createContext({} as ChartContextProps)


function ChartProvider({ children }: { children: React.ReactNode }) {
  const [chartState, setChartState] = useState({
    chartName: 'temperature'
  })

  return (
    <ChartContext.Provider value={{ chartState, setChartState }}>
      { children }
    </ChartContext.Provider>
  )
}


export { ChartContext, ChartProvider }
