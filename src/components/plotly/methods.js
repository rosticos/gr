const plotlyFunctions = ["restyle", "relayout", "update", "addTraces", "deleteTraces", "moveTraces", "extendTraces", "prependTraces", "purge"];

export const methods = plotlyFunctions.reduce((all, functionName) => {
  all[functionName] = function(...args) {
    return Plotly[functionName].apply(Plotly, [this.$el, ...args]);
  };
  return all;
}, {});