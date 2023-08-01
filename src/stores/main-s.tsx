import { autorun, makeAutoObservable } from 'mobx'

import { buttonStore } from './button-s'
import { selectStore } from './select-s'


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
    return this.chartData[this.chartName]?.slice(
      ...selectStore.indexes
    )
  }
})


autorun(() => {
  mainStore.points
})