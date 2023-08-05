import { autorun, makeAutoObservable } from 'mobx'

import { buttonStore } from './button-s'
import { selectStore } from './select-s'

import { smoothData } from '../utils/smooth-data'

type ChartData = {
  [key: string]: number[] | null
}


export const mainStore = makeAutoObservable({
  chartData: {
    precipitation: null,
    temperature: null
  } as ChartData,

  get chartName() {
    return buttonStore.chartName
  },

  setData(values: number[]) {
    mainStore.chartData[mainStore.chartName] = values
  },

  get points() {
    const rawPoints = this.chartData[this.chartName]?.slice(
      ...selectStore.indexes
    )

    if (rawPoints) {
      return smoothData(rawPoints)
    }
  }
})


autorun(() => {
  mainStore.points
})