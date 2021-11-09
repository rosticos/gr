import Plotly from 'plotly.js'

const plotlyFunctions = ['restyle', 'relayout', 'update', 'addTraces', 'deleteTraces', 'moveTraces', 'extendTraces', 'prependTraces', 'purge']

export const methods = plotlyFunctions.reduce((all, functionName) => {
  all[functionName] = function (...args) {
    // eslint-disable-next-line
    return Plotly[functionName].apply(Plotly, [this.$el, ...args])
  }
  return all
}, {})
