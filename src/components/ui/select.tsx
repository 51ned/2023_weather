import { useContext } from 'react'

import { WeatherContext } from '../../stores/context'

import style from './select.module.css'


interface SelectProps {
  opts: number[],
  selectedYear: string,
  yearKey: 'firstYear' | 'lastYear'
}


export function Select({
  opts,
  selectedYear,
  yearKey
}: SelectProps) {
  const { globalState, setGlobalState} = useContext(WeatherContext)

  const selectHandle = (evt: {
    preventDefault: () => void;
    currentTarget: { value: string }
  }) => {
    evt.preventDefault()

    const value = evt.currentTarget.value

    if (value === selectedYear) return

    setGlobalState({...globalState, [`${yearKey}`]: value})
  }

  return (
    <select
      className={style.select}
      onChange={selectHandle}
      value={selectedYear}
    >
      {opts.map((item, index) => {
        return (
          <option key={index} value={item}>
            { item }
          </option>
        )
      })}
    </select>
  )
}