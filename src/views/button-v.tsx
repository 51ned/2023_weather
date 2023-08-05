import cn from 'classnames'

import { buttonStore } from '../stores/.'

import style from './button.module.css'


interface ButtonProps {
  children: React.ReactNode,
  value: string
}


export function Button({children, value}: ButtonProps) {
  const { chartName, setChartName } = buttonStore

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setChartName(value)
  }

  const className = cn(style.button, {
    [style.active]: chartName === value
  })

  return (
    <button
      className={className}
      onClick={handleClick}
      value={value}
    >
      { children }
    </button>
  )
}
