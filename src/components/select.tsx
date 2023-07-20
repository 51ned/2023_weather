import { useContext, useRef, useState } from 'react'
import { useClickOutside } from '../hooks'

import { YearsContext } from '../stores'

import style from './select.module.css'


interface SelectProps {
  label: string,
  name: string
  opts: number[],
  selectedYear: string,
  yearKey: 'firstYear' | 'lastYear'
}


export function Select({ label, name, opts, selectedYear, yearKey }: SelectProps) {
  const {yearsState, setYearsState} = useContext(YearsContext)
  const [isOpened, setOpened] = useState(false)
  const selectRef = useRef(null)


  const toggle = () => setOpened(!isOpened)

  const selectHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault()
  
    const value = e.target.value
  
    if (value !== selectedYear) {
      setYearsState({...yearsState, [`${yearKey}`]: value})
    }
  }


  useClickOutside(selectRef, () => setOpened(false))

  
  return (
    <div className={style.wrap}>
      <span className={style.label} id={name}>
        { label }
      </span>

      <div className={style.container}>
        <select
          aria-labelledby={name}
          className={style.native}
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

        <div
          aria-hidden={isOpened ? 'false' : 'true'}
          className={isOpened ? `${style.custom, style.opened}` : `${style.custom}`}
          onClick={toggle}
          ref={selectRef}
        >
          <div aria-labelledby={name} className={style.opts_custom}>
            {opts.map((item, index) => {
              return (
                <div className={style.opt_custom} key={index}>
                  { item }
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
