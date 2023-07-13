import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { ChartProvider } from './stores'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChartProvider>
    <App />
  </ChartProvider>
)
