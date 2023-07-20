import { useContext } from 'react'

import { ChartContext } from '../stores'

import style from './button.module.css'


interface ButtonProps {
  children: React.ReactNode,
  value: string
}


export function Button({ children, value }: ButtonProps) {
  const { chartState, setChartState } = useContext(ChartContext)

  const handleClick = (evt: {
    preventDefault: () => void
    currentTarget: { value: string }
  }) => {
    evt.preventDefault()

    const value = evt.currentTarget.value

    if (value === chartState.chartName) return

    setChartState({ ...chartState, chartName: value })
  }
  
  return (
    <button
      className={style.button}
      onClick={handleClick}
      value={value}
    >
      { children }
    </button>
  )
}