const X_MIN = -30
const X_MAX = 30

import { default as CreateScatter } from './templates/create/create-scatter.html.js'
import { default as CreateBar } from './templates/create/create-bar.html.js'
import { default as CreatePie } from './templates/create/create-pie.html.js'
import { default as CreateGraph } from './templates/create/create-graph.html.js'

import { default as UpdateGraph } from './templates/update/update-graph.html.js'
import { default as UpdateScatter } from './templates/update/update-scatter.html.js'
import { default as UpdateBar } from './templates/update/update-bar.html.js'
import { default as UpdatePie } from './templates/update/update-pie.html.js'

Vue.component('create-scatter', {
  template: CreateScatter, 
  data: () => {
    return {
      paramsArray: [{
        name: 'n',
        value: [1, 2, 3, 4, 5]
      }],
      constsArray: [{
        name: 'f',
        value: 1
      }],
      layout: {
        title: 'График',
        xaxis: {
          title: 'X'
        },
        yaxis: {
          title: 'Y'
        },
      },
      lines: [
        {
          name: 'y=cos(x)',
          declareType: 'byFunction',
          type: 'scatter',
          mode: 'lines',
          value: 'y=cos(x)'
        }
      ]
    }
  },
  methods: {
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
        declareType: 'byFunction',
        type: 'scatter',
        mode: 'lines',
        value: ''
      })
    },
    createGraph () {
      this.$emit('create', { values: this.lines, layout: this.layout })
    }
  }
})

Vue.component('create-bar', {
  template: CreateBar,
  data: () => {
    return {
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
    createGraph () {
      this.bars = this.bars.map(bar => ({ ...bar, titles: this.titles }))
      this.$emit('create', { values: this.bars, layout: this.layout })

      this.setDefault()
    }
  }
})

Vue.component('create-pie', {
  template: CreatePie,
  data: () => {
    return {
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
    createGraph () {
      this.$emit('create', { values: this.pies, layout: this.layout })

      this.setDefault()
    }
  }
})

Vue.component('create-graph', {
  template: CreateGraph,
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
  template: UpdateGraph,
  props: {
    graphs: Array,
    type: String
  },
  data: () => {
    return {
      expanded: []
    }
  },
  methods: {
    setExpand (index) {
      if (this.expanded.includes(index)) {
        this.expanded = this.expanded.filter(expand => expand !== index)
      } else {
        this.expanded.push(index)
      }
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

Vue.component('update-scatter', {
  template: UpdateScatter,
  data: () => {
    return {
      layout: {
        title: 'График',
        xaxis: {
          title: 'X'
        },
        yaxis: {
          title: 'Y'
        },
      },
      lines: [
        {
          name: '',
          declareType: 'byFunction',
          type: 'scatter',
          mode: 'lines',
          value: ''
        }
      ]
    }
  },
  props: {
    graph: Object
  },
  methods: {
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
        declareType: 'byFunction',
        type: 'scatter',
        mode: 'lines',
        value: ''
      })
    },
    updateGraph () {
      this.$emit('update', { values: this.lines, layout: this.layout })
    }
  },
  mounted () {
    this.lines = this.graph.values;
    this.layout = this.graph.layout;
  }
})

Vue.component('update-bar', {
  template: UpdateBar,
  data: () => {
    return {
      layout: {
        title: ''
      },
      titles: ['Название столбца'],
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
  props: {
    graph: Object
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
    updateGraph () {
      this.bars = this.bars.map(bar => ({ ...bar, titles: this.titles }))
      this.$emit('update', { values: this.bars, layout: this.layout })
    }
  },
  mounted () {
    this.bars = this.graph.values;
    this.layout = this.graph.layout;
  }
})

Vue.component('update-pie', {
  template: UpdatePie,
  data: () => {
    return {
      layout: {
        title: ''
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
  props: {
    graph: Object
  },
  methods: {
    removeItem (index) {
      this.pies.splice(index, 1)
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
    updateGraph () {
      this.$emit('update', { values: this.pies, layout: this.layout })
    }
  },
  mounted () {
    this.pies = this.graph.values;
    this.layout = this.graph.layout;
  }
})

export function createVue(newGraphs, id) {
  return new Vue({
    el: id,
    template: `
    <div>     
      <div class="container">
        <div v-for="(graph, index) in normalizedGraphs" :key="index">
          <div class="plotly">
            <div class="plotly__actions">
              <div class="btn btn_outline ml-2" v-on:click="removeGraph(index)">
                <div class="p-icon p-icon-close"></div>
              </div>
              
              <div class="btn btn_outline ml-2" v-on:click="removePoint(index, valueIndex)">
                <div class="p-icon p-icon-edit"></div>
              </div>
            </div>

            <plotly 
              v-bind:data="graph.data" 
              v-bind:layout="graph.layout" 
              v-bind:display-mode-bar="true" 
              v-on:relayout="recount($event, index, graph.data[0].type)"
              v-bind:scroll-zoom="true"
              v-bind:mode-bar-buttons-to-remove="['lasso2d','zoom2d','resetScale2d','toggleSpikelines','producedWithPlotly']"
            ></plotly>
          </div>
        </div>
      </div>
    </div>
    `,
    data: () => {
      return {
        action: 'create',
        isVisibleMenu: false,
        // Массив графиков для отрисовки
        normalizedGraphs: [],
        // Массив графиков для восстановления
        graphs: []
      }
    },
    methods: {
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
          const { x, y } = this.createFunctionalLine(line.value, xMin, xMax)
  
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
        this.graphs = this.graphs.map((graph, curIndex) => {
          if (curIndex === index) {
            graph = { values, layout, type }
          }
  
          return graph
        })
  
        if (type === 'scatter') {
          const normalizedLines = values.map(line => this.normalizeLine(line))
          
          this.normalizedGraphs = this.normalizedGraphs.map((graph, curIndex) => {
            if (curIndex === index) {
              graph = {
                layout: JSON.parse(JSON.stringify(layout)),
                data: normalizedLines
              }
            }
  
            return graph
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
            
            this.recount(value, index);
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
      },
      onCreate ({values, layout, type }) {
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
      },
      recount (value, index, type) {
        if (type === 'scatter') {
          const lines = this.graphs[index].values;
  
          const normalizedLines = lines.map(line => {
            if (line.declareType === 'byFunction' && (value?.['xaxis.range[0]'] < X_MIN || value?.['xaxis.range[1]'] > X_MAX)) {
            
              const [ xMin, xMax ] = [value['xaxis.range[0]'], value['xaxis.range[1]']]
  
              return this.normalizeLine(line, xMin, xMax)
            }
  
            return this.normalizeLine(line)
          })
  
          this.normalizedGraphs[index].data = normalizedLines;
        }
      },
      createFunctionalLine (value, xMin = X_MIN, xMax = X_MAX) {
        const dx = 0.1;
        const xArray = [], yArray = [];
        
        const node = math.parse(value);
        
        for (let x = xMin; x < xMax; x += dx ) {
          const code = node.compile();
  
          xArray.push(x);
          yArray.push(code.evaluate({ x }));
        }
        
        return {
          x: xArray,
          y: yArray,
        };
      }
    },
    created () {
      this.graphs = newGraphs;

      this.graphs.map(graph => {
        this.onCreate({ values: graph.values, layout: graph.layout, type: graph.values[0].type })
      })
    }
  })
}