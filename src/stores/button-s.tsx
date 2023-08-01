import { makeAutoObservable } from 'mobx'


export const buttonStore = makeAutoObservable({
  chartName: 'temperature',

  setChartName(value: string) {
    buttonStore.chartName = value
  }
})
