const X_MIN = -30
const X_MAX = 30

import { default as Scatter } from './templates/types/scatter.html.js'
import { default as Bar } from './templates/types/bar.html.js'
import { default as Pie } from './templates/types/pie.html.js'
import { default as CreateForm } from './templates/forms/create-form.html.js'
import { default as UpdateForm } from './templates/forms/update-form.html.js'

Vue.component('create-graph', {
  template: CreateForm,
  data: function () {
    return {
      type: ''
    }
  },
  computed: {
    getActiveComponent () {
      let component = ''

      switch (this.type) {
        case 'scatter':
          component = 'create-scatter'
          break;
        
        case 'bar':
          component = 'create-bar'
          break;

        case 'pie':
          component = 'create-pie'
          break;
        
        default:
          break;
      }

      return component;
    }
  },
  methods: {
    onCreate ({ values, layout }) {
      this.$emit('create', { values, layout, type: this.type })
      this.type = ''
    },
    addLine () {
      // 
    }
  }
})

Vue.component('update-graph', {
  template: UpdateForm,
  props: {
    graphs: Array,
    type: String,
    expandItem: {
      type: [Number, Object],
      default: null
    }
  },
  data: () => {
    return {
      expanded: []
    }
  },
  watch: {
    expandItem: {
      immediate: true,
      handler (value) {
        if (value != null) {
          this.setExpand(value, true);
        }
      }
    }
  },
  methods: {
    setExpand (index, isDirect = false) {
      if (this.expanded.includes(index) && !isDirect) {
        this.expanded = this.expanded.filter(expand => expand !== index)
      } else {
        this.expanded.push(index)
      }
    },
    isExpanded (index) {
      return this.expanded.includes(index)
    },
    getActiveComponent (type) {
      let component = ''

      switch (type) {
        case 'scatter':
          component = 'update-scatter'
          break;
        
        case 'bar':
          component = 'update-bar'
          break;

        case 'pie':
          component = 'update-pie'
          break;
        
        default:
          break;
      }

      return component;
    },
    onUpdate ({ values, layout }, type, index) {
      this.$emit('update', { values, layout, type, index})
    },
    addLine () {
      // 
    }
  }
})

const createScatter = Vue.component('create-scatter', {
  template: Scatter, 
  data: () => {
    return {
      submitText: 'Создать',
      layout: {
        title: 'График',
        xaxis: {
          title: 'X',
          range: [ -30, 30 ]
        },
        yaxis: {
          title: 'Y',
          range: [ -30, 30 ]
        },
      },
      lines: [
        { 
          name: 'y=f*x',
          funcRelative: 'x',
          declareType: 'byFunction',
          type: 'scatter',
          mode: 'lines',
          value: 'y=f*x',
          constsArray: [{
            name: 'f',
            value: 1
          }],
        }
      ]
    }
  },
  methods: {
    removeLine (index) {
      this.lines.splice(index, 1)
    },
    removeConst (index, consIndex) {
      this.lines[index].constsArray.splice(consIndex, 1)
    },
    addConst (index) {
      this.lines[index].constsArray.push({ name: '', value: '' })
    },
    getParamsValues (str) {
      return this.str.split(/,/)
    },
    addPoint(index) {
      this.lines[index].value.push({
        x: '',
        y: ''
      })
    },
    removePoint(index, rmIndex) {
      this.lines[index].value.splice(rmIndex, 1)
    },
    onChangeDeclareType (index) {
      if (this.lines[index].declareType === 'byFunction') {
        this.lines[index].value = ''
      } else if (this.lines[index].declareType === 'byCoords') {
        this.lines[index].value = [{
          x: '',
          y: ''
        }]
      }

    },
    add () {
      this.$emit('add', this.graph)
    },
    addLine () {
      this.lines.push({
        constsArray: [],
        funcRelative: 'x',
        declareType: 'byFunction',
        type: 'scatter',
        mode: 'lines',
        value: ''
      })
    },
    submit () {
      this.$emit('create', { values: this.lines, layout: this.layout })
    }
  }
})

const createBar = Vue.component('create-bar', {
  template: Bar,
  data: () => {
    return {
      submitText: 'Создать',
      layout: {
        title: 'Столбцы'
      },
      titles: ['Столбец'],
      bars: [
        {
          counter: 1,
          type: 'bar',
          name: '',
          values: [],
        }
      ]
    }
  },
  methods: {
    setDefault () {
      this.bars = [
        {
          counter: 1,
          type: 'bar',
          name: '',
          values: [],
        }
      ]
    },
    removeBarTitle (index) {
      this.titles.splice(index, 1)
      this.bars.forEach(bar => {
        bar.values.splice(index, 1);
        bar.counter -= 1;
      })
    },
    removeBar (index) {
      this.bars.splice(index, 1);
    },
    addItem () {
      this.titles.push('')
      this.bars.forEach(bar => {
        bar.values = [...bar.values, 0];
        bar.counter += 1;
      })
    },
    addBar () {
      this.bars.push({
        counter: this.titles.length,
        type: 'bar',
        name: '',
        values: Array(this.titles.length).fill(0),
      })
    },
    submit () {
      this.bars = this.bars.map(bar => ({ ...bar, titles: this.titles }))
      this.$emit('create', { values: this.bars, layout: this.layout })

      this.setDefault()
    }
  }
})

const createPie = Vue.component('create-pie', {
  template: Pie,
  data: () => {
    return {
      submitText: 'Создать',
      layout: {
        title: 'Круговая диаграмма'
      },
      pies: [
        {
          counter: 3,
          type: 'pie',
          textinfo: "label+percent",
          values: [],
          labels: [],
          insidetextorientation: "radial"
        }
      ]
    }
  },
  methods: {
    setDefault () {
      this.pies = [
        {
          counter: 3,
          type: 'pie',
          textinfo: "label+percent",
          values: [],
          labels: [],
          insidetextorientation: "radial"
        }
      ]
    },
    removePieItem (index, pieIndex) {
      this.pies[index].counter -= 1;
      this.pies[index].values.splice(pieIndex, 1);
      this.pies[index].labels.splice(pieIndex, 1);
    },
    addItem (index) {
      this.pies[index].counter += 1;
      this.pies[index].values.push('');
      this.pies[index].labels.push('');
    },
    addPie () {
      this.pies.push({
        counter: 1,
        type: 'pie',
        textinfo: "label+percent",
        values: [0],
        labels: [''],
        insidetextorientation: "radial"
      })
    },
    removeItem (index) {
      this.pies.splice(index, 1)
    },
    submit () {
      this.$emit('create', { values: this.pies, layout: this.layout })

      this.setDefault()
    }
  }
})

Vue.component('update-scatter', {
  template: Scatter,
  extends: createScatter,
  props: {
    graph: Object
  },
  data: () => {
    return {
      submitText: 'Обновить',
    }
  },
  methods: {
    submit () {
      this.$emit('update', { values: this.lines, layout: this.layout })
    }
  },
  mounted () {
    this.lines = this.graph.values;
    this.layout = this.graph.layout;
  }
})

Vue.component('update-bar', {
  template: Bar,
  extends: createBar,
  data: () => {
    return {
      submitText: 'Обновить',
    }
  },
  props: {
    graph: Object
  },
  methods: {
    submit () {
      this.bars = this.bars.map(bar => ({ ...bar, titles: this.titles }))
      this.$emit('update', { values: this.bars, layout: this.layout })
    }
  },
  mounted () {
    this.titles = this.graph.values[0].titles;
    this.bars = this.graph.values;
    this.layout = this.graph.layout;
  }
})

Vue.component('update-pie', {
  template: Pie,
  extends: createPie,
  data: () => {
    return {
      submitText: 'Обновить',
    }
  },
  props: {
    graph: Object
  },
  methods: {
    submit () {
      this.$emit('update', { values: this.pies, layout: this.layout })
    }
  },
  mounted () {
    this.pies = this.graph.values;
    this.layout = this.graph.layout;
  }
})

new Vue({
  el: '#app',
  data: () => {
    return {
      expandItem: null,
      error: null,
      action: 'create',
      isVisibleMenu: true,
      // Массив графиков для отрисовки
      normalizedGraphs: [],
      // Массив графиков для восстановления
      graphs: [{
        "values": [{
          "name": "y=f*x",
          "funcRelative": "x",
          "declareType": "byFunction",
          "type": "scatter",
          "mode": "lines",
          "value": "y=f*x",
          "constsArray": [{
            "name": "f",
            "value": 1
          }]
        }],
        "layout": {
          "title": "График",
          "xaxis": {
            "title": "X",
            "range": [-30, 30]
          },
          "yaxis": {
            "title": "Y",
            "range": [-30, 30]
          }
        },
        "type": "scatter"
      }]
    }
  },
  created () {
    this.graphs.map(graph => {
      this.onCreate({ 
        values: graph.values, 
        layout: graph.layout, 
        type: graph.values[0].type 
      }, true)
    })
  },
  methods: {
    setEditMode (index) {
      this.isVisibleMenu = true
      this.action = 'edit'

      this.expandItem = index
    },
    removeGraph (index) {
      this.normalizedGraphs.splice(index, 1)
      this.graphs.splice(index, 1)
    },
    normalizeBar (bar) {
      return {
        type: bar.type,
        x: bar.titles,
        y: bar.values.map(value => parseFloat(value)),
        name: bar.name
      }
    },
    normalizePie (pie, row, column) {
      return {
        type: pie.type,
        domain: {
          row,
          column
        },
        textinfo: pie.textinfo,
        insidetextorientation: pie.insidetextorientation,
        values: JSON.parse(JSON.stringify(pie.values)),
        labels: JSON.parse(JSON.stringify(pie.labels))
      }
    },
    normalizeLine (line, xMin = X_MIN, xMax = X_MAX) {
      if (line.declareType === 'byCoords') {
        return {
          type: line.type,
          mode: line.mode,
          x: line.value.map(item => item.x),
          y: line.value.map(item => item.y),
        }
      } else if (line.declareType === 'byFunction') {
        const { x, y } = this.createFunctionalLine(line, xMin, xMax)

        return {
          name: line.value,
          type: line.type,
          mode: line.mode,
          x,
          y,
        }
      }
    },
    getTex (value) {
      let html = MathJax.tex2svg(value);
      return html.outerHTML
    },
    onUpdate ({values, layout, type, index}) {
      this.error = null
      try {
        if (type === 'scatter') {
          const normalizedLines = values.map(line => this.normalizeLine(line))

          if (this.graphs.length > this.normalizedGraphs.length) {
            this.normalizedGraphs.push({
              layout: JSON.parse(JSON.stringify(layout)),
              data: normalizedLines
            })
          } else {
            this.normalizedGraphs = this.normalizedGraphs.map((graph, curIndex) => {
              if (curIndex === index) {
                graph = {
                  layout: JSON.parse(JSON.stringify(layout)),
                  data: normalizedLines
                }
              }
    
              return graph
            })
          }

          if (values.some(value => value.declareType === 'byCoords')) {
            const xArray = values.map(item => {
              if (item.declareType === 'byCoords') {
                return item.value.map(item => item.x)
              } 
              return [];
            }).flat();
            
            const value = {
              'xaxis.range[0]': Math.min(...xArray),
              'xaxis.range[1]': Math.max(...xArray),
            }
            
            this.recount(value, index);
          } else {
            const value = {
              'xaxis.range[0]': layout.xaxis.range[0] || X_MIN,
              'xaxis.range[1]': layout.xaxis.range[1] || X_MAX,
            }

            this.recount(value, index, 'scatter');
          }
        }

        if (type === 'pie') {
          const normalizedPies = values.map((pie, index) => this.normalizePie(pie, index / 2, index % 2))

          this.normalizedGraphs = this.normalizedGraphs.map((graph, curIndex) => {
            if (curIndex === index) {
              graph = {
                layout: {
                  ...JSON.parse(JSON.stringify(layout)),
                  grid: { rows: Math.ceil(normalizedPies.length / 2), columns: normalizedPies.length === 1 ? 1 : 2 }
                },
                data: normalizedPies
              }
            }

            return graph
          })
        }

        if (type === 'bar') {
          const normalizedBars = values.map(bar => this.normalizeBar(bar))

          this.normalizedGraphs = this.normalizedGraphs.map((graph, curIndex) => {
            if (curIndex === index) {
              graph = {
                layout: {
                  ...JSON.parse(JSON.stringify(layout)),
                  barmode: 'group'
                },
                data: normalizedBars
              }
            }

            return graph
          })
        }

        this.graphs = this.graphs.map((graph, curIndex) => {
          if (curIndex === index) {
            graph = { values, layout, type }
          }

          return graph
        })
      } catch (error) {
        this.error = error;
      }
    },
    onCreate ({values, layout, type }, isMountEvent = false) {
      this.error = null

      if (!isMountEvent) {
        this.graphs.push({ values, layout, type })
      }
      
      try {
        if (type === 'scatter') {
          const normalizedLines = values.map(line => this.normalizeLine(line))
  
          this.normalizedGraphs.push({
            layout: JSON.parse(JSON.stringify(layout)),
            data: normalizedLines
          })
  
          if (values.some(value => value.declareType === 'byCoords')) {
            const xArray = values.map(item => {
              if (item.declareType === 'byCoords') {
                return item.value.map(item => item.x)
              } 
              return [];
            }).flat();
            
            const value = {
              'xaxis.range[0]': Math.min(...xArray),
              'xaxis.range[1]': Math.max(...xArray),
            }
            
            this.recount(value, this.graphs.length - 1);
          } else {
            const value = {
              'xaxis.range[0]': layout.xaxis.range[0],
              'xaxis.range[1]': layout.xaxis.range[1],
            }

            this.recount(value, this.graphs.length - 1, 'scatter');
          }
        }
  
        if (type === 'pie') {
          const normalizedPies = values.map((pie, index) => this.normalizePie(pie, index / 2, index % 2))
  
          this.normalizedGraphs.push({
            layout: {
              ...layout,
              grid: { rows: Math.ceil(normalizedPies.length / 2), columns: normalizedPies.length === 1 ? 1 : 2 }
            },
            data: normalizedPies
          })
        }
  
        if (type === 'bar') {
          const normalizedBars = values.map(bar => this.normalizeBar(bar))
          this.normalizedGraphs.push({
            layout: {
              ...layout,
              barmode: 'group'
            },
            data: normalizedBars
          })
        }
      } catch (error) {
        this.error = error;
      }
    },
    recount (value, index, type) {
      if (type === 'scatter') {
        const lines = this.graphs[index].values;
        
        if (value?.['xaxis.range[0]'] && value?.['xaxis.range[1]']) {
          const normalizedLines = lines.map(line => {
            if (line.declareType === 'byFunction' && (value?.['xaxis.range[0]'] < X_MIN || value?.['xaxis.range[1]'] > X_MAX)) {
            
              const [ xMin, xMax ] = [value['xaxis.range[0]'], value['xaxis.range[1]']]

              return this.normalizeLine(line, xMin, xMax)
            }

            return this.normalizeLine(line)
          })

          this.normalizedGraphs[index].data = normalizedLines;
        }
      }
    },
    createFunctionalLine (line, xMin = X_MIN, xMax = X_MAX) {
      // Оптимизация (меньшее количество точек в массиве)
      let dx = 0.1

      switch (true) {
        case (Math.abs(xMin - xMax)) >= 1000 && (Math.abs(xMin - xMax)) < 10000:
          dx = 0.5
          break;
        case (Math.abs(xMin - xMax)) >= 10000 && (Math.abs(xMin - xMax)) < 100000:
          dx = 10
          break;
        case (Math.abs(xMin - xMax)) >= 100000 && (Math.abs(xMin - xMax)) < 1000000:
          dx = 100
          break;
        case (Math.abs(xMin - xMax)) >= 1000000 && (Math.abs(xMin - xMax)) < 10000000:
          dx = 1000
          break;
        case (Math.abs(xMin - xMax)) >= 10000000 && (Math.abs(xMin - xMax)) < 100000000:
          dx = 10000
          break;
        case (Math.abs(xMin - xMax)) >= 100000000:
          dx = 10000000
          break;
        default:
          dx = 0.1
      }
      const xArray = [], yArray = [];
      
      const node = math.parse(line.value);
      const scope = new Map();
      
      if (line.constsArray.length) {
        line.constsArray.forEach(cons => {
          scope.set(cons.name, math.evaluate(cons.value))
        })
      }
      
      for (let x = xMin; x < xMax; x += dx ) {
        const code = node.compile();
        
        xArray.push(x);
        yArray.push(code.evaluate({ [line.funcRelative]:x, ...Object.fromEntries(scope) }));
      }
      
      return {
        x: xArray,
        y: yArray,
      };
    }
  }
})