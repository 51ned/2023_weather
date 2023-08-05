import { selectStore } from '../stores'

import style from './range.module.css'


export function Range() {
  const { yearsReversed, setYear } = selectStore

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setYear('lastYear', value)
  }

  return (
    <div className={style.container}>
      <input
        className={style.input}
        defaultValue={yearsReversed[0]}
        max={yearsReversed[0]}
        min={yearsReversed[yearsReversed.length - 1]}
        onChange={handleChange}
        step='1'
        type='range'
      />
    </div>
  )
}
