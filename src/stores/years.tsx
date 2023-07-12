import { createContext, useState } from 'react'


type YearsStateProps = {
  firstYear: string,
  lastYear: string
}

interface yearsContextProps {
  setYearsState: React.Dispatch<React.SetStateAction<YearsStateProps>>,
  yearsState: YearsStateProps
}


const YearsContext = createContext({} as yearsContextProps)


function YearsProvider({ children }: { children: React.ReactNode }) {
  const [yearsState, setYearsState] = useState({
    firstYear: '1881',
    lastYear: '2006'
  })

  return (
    <YearsContext.Provider value={{ yearsState, setYearsState }}>
      { children }
    </YearsContext.Provider>
  )
}


export { YearsContext, YearsProvider }
export type { YearsStateProps }
