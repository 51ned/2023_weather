import { useContext } from 'react'

import { YearsContext } from '../stores/years'

import style from './select.module.css'


interface SelectProps {
  opts: number[],
  selectedYear: string,
  yearKey: 'firstYear' | 'lastYear'
}


export function Select({ opts, selectedYear, yearKey }: SelectProps) {
  const { yearsState, setYearsState} = useContext(YearsContext)

  const selectHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
  
    const value = e.target.value
  
    if (value !== selectedYear) {
      setYearsState({...yearsState, [`${yearKey}`]: value})
    }
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