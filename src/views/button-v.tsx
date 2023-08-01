import { buttonStore, mainStore } from '../stores/.'

import style from './button.module.css'


interface ButtonProps {
  children: React.ReactNode,
  value: string
}


export function Button({children, value}: ButtonProps) {
  const { setChartName } = buttonStore

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setChartName(value)
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
