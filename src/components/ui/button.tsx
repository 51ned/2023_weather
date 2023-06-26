import { useContext } from 'react'

import { WeatherContext } from '../../stores/context'

import style from './button.module.css'


interface ButtonProps {
  children: React.ReactNode,
  value: string
}


export function Button({
  children,
  value
}: ButtonProps) {

  const { globalState, setGlobalState } = useContext(WeatherContext)

  const handleClick = (evt: {
    preventDefault: () => void;
    currentTarget: { value: string }
  }) => {
    evt.preventDefault()

    const value = evt.currentTarget.value

    if (value === globalState.chartType) return

    setGlobalState({ ...globalState, chartType: value })
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