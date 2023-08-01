import { makeAutoObservable } from 'mobx'

import { getYears, getIndexes } from '../utils'

import { FIRST_YEAR, LAST_YEAR } from '../lib/consts'


export const selectStore = makeAutoObservable({
  firstYear: FIRST_YEAR,
  lastYear: LAST_YEAR,

  setYear(yearKey: 'firstYear' | 'lastYear', value: number) {
    selectStore[yearKey] = value
  },

  get years() {
    return getYears(FIRST_YEAR, this.lastYear)
  },

  get yearsReversed() {
    return getYears(this.firstYear, LAST_YEAR).reverse()
  },

  get indexes() {
    return getIndexes(this.firstYear, this.lastYear)
  }
})
