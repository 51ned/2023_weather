import { selectStore } from '../stores'

import style from './select.module.css'


interface SelectProps {
  opts: number[]
  yearKey: 'firstYear' | 'lastYear'
}


export function Select ({ opts, yearKey }: SelectProps) {
  const { setYear } = selectStore

  const selectHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
    setYear(yearKey, +e.target.value)
  }

  return (
    <select
      className={style.select}
      onChange={selectHandle}
      value={selectStore[yearKey]}
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
