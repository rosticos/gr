const X_MIN = -3
const X_MAX = 3

Vue.component('create-scatter', {
  template: `
    <div>
      <div class="card card_column card_background-light-grey" v-for="(line, index) in lines">
        <div class="d-flex">
          <select v-model="line.declareType" v-on:change="onChangeDeclareType(index)" class="input-block select-css">
            <option disabled value="">Способ задания линии</option>
            <option value="byFunction">Функция</option>
            <option value="byCoords">По координатно</option>
          </select>

          <select v-model="line.mode" class="input-block select-css">
            <option disabled value="">Тип отображения линии</option>
            <option value="lines">Линия</option>
            <option value="markers">Маркеры</option>
            <option value="lines+markers">Линия и маркеры</option>
          </select>

          <div class="btn btn_outline ml-2" v-on:click="addPoint(index)" v-if="line.declareType === 'byCoords'">
            <div class="p-icon p-icon-add"></div>
          </div>
        </div>

        <input v-if="line.declareType === 'byFunction'" type="text" class="input-block mt-4" v-model="line.value">
        
        <div v-if="line.declareType === 'byCoords'">
          <div v-for="(value, valueIndex) in line.value" class="d-flex mt-4">
            <div class="d-flex">
              <p>X:</p>
              <input type="text" class="input-block ml-2" v-model="value.x">
            </div>

            <div class="d-flex ml-2">
              <p>Y:</p>
              <input type="text" class="input-block ml-2" v-model="value.y">
            </div>  

            <div class="btn btn_outline ml-2" v-on:click="removePoint(index, valueIndex)">
              <div class="p-icon p-icon-close"></div>
            </div>
          </div> 
        </div>
      </div>

      <div class="card__actions">
        <div class="btn btn_outline" v-on:click="addLine">
          <div class="p-icon p-icon-add mr-2"></div>
          Добавить график
        </div>

        <div class="btn btn_primary ml-auto" v-on:click="createGraph">
          Создать
        </div>
      </div>
    </div>
  `,
  data: () => {
    return {
      lines: [
        {
          declareType: 'byFunction',
          type: 'scatter',
          mode: 'lines',
          value: ''
        }
      ]
    }
  },
  methods: {
    setDefault () {
      this.lines = [
        {
          declareType: 'byCoords',
          type: 'scatter',
          mode: 'lines',
          value: []
        }
      ]
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
      this.$emit('create', this.lines)

      this.setDefault()
    }
  }
})

Vue.component('create-bar', {
  template: `
    <div>
      <div class="card card_column">
        <div v-for="(_, titleIndex) in titles" :key="titleIndex">
          <div class="d-flex mt-4">
            <p>Столбец:</p>
            <input type="text" class="input-block ml-2" v-model="titles[titleIndex]">

            <div class="btn btn_outline ml-2" v-on:click="removeBarTitle(titleIndex)">
              <div class="p-icon p-icon-close"></div>
            </div>
          </div> 
        </div>

        <div class="btn btn_outline ml-auto mt-4" v-on:click="addItem">
          <div class="p-icon p-icon-add"></div>
          Добавить столбец
        </div>
      </div>

      <div class="card card_column card_background-light-grey" v-for="(bar, index) in bars">
        <div>
          <div class="d-flex">
            <p>Название:</p>
            <input type="text" class="input-block ml-2" v-model="bar.name">
            <div class="btn btn_outline ml-2" v-on:click="removeBar(index)">
              <div class="p-icon p-icon-close"></div>
            </div>
          </div>
          <div v-for="counter in bar.counter" :key="counter" class="d-flex mt-4">
            <div class="d-flex">
              <p>Столбец:</p>
              <input type="text" disabled class="input-block ml-2" v-model="titles[counter - 1]">
            </div> 

            <div class="d-flex ml-auto">
              <p>Значение:</p>
              <input type="text" class="input-block ml-2" v-model="bar.values[counter - 1]">
            </div>  
          </div>
        </div>
      </div>

      <div class="card__actions">
        <div class="btn btn_outline" v-on:click="addBar">
          <div class="p-icon p-icon-add"></div>
          Добавить столбец
        </div>

        <div class="btn btn_primary ml-auto" v-on:click="createGraph">
          Создать
        </div>
      </div>
    </div>
  `,
  data: () => {
    return {
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
      this.$emit('create', this.bars)

      this.setDefault()
    }
  }
})

Vue.component('create-pie', {
  template: `
    <div>
      <div class="card card_column card_background-light-grey" v-for="(pie, index) in pies">
      
        <div class="card">
          <div class="d-flex" style="background: white;">
            <p>Количество значений для добавления:</p>
            <input class="input-block ml-2" v-model="computedAddCounter">
          </div>

          <div class="btn btn_outline ml-auto" v-on:click="addItem(index)">
            Добавить {{ computedAddCounter }}
          </div>
        </div>

        <div>
          <div v-for="counter in pie.counter" :key="counter" class="d-flex mt-4">
            <div class="d-flex">
              <p>Наименование:</p>
              <input type="text" class="input-block ml-2" v-model="pie.labels[counter - 1]">
            </div>

            <div class="d-flex ml-auto">
              <p>Значение:</p>
              <input type="text" class="input-block ml-2" v-model="pie.values[counter - 1]">
            </div>  

            <div class="btn btn_outline ml-2" v-on:click="removePieItem(index, counter - 1)">
              <div class="p-icon p-icon-close"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card__actions">
        <div class="btn btn_outline" v-on:click="addPie">
          <div class="p-icon p-icon-add"></div>
          Добавить
        </div>

        <div class="btn btn_primary ml-auto" v-on:click="createGraph">
          Создать
        </div>
      </div>
    </div>
  `,
  data: () => {
    return {
      addCounter: 3,
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
  computed: {
    computedAddCounter: {
      get () {
        return this.addCounter
      },
      set (value) {
        this.addCounter = parseInt(value) || 0
      }
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
      this.pies[index].counter += this.computedAddCounter;
      this.pies[index].values.push(...Array(this.computedAddCounter).fill(1));
      this.pies[index].labels.push(...Array(this.computedAddCounter).fill(''));
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
    createGraph () {
      this.$emit('create', this.pies)

      this.setDefault()
    }
  }
})

Vue.component('create-graph', {
  template:`
    <div class="card card_column">
      <select v-model="type" class="input-block select-css">
        <option disabled value="">Выберите один из вариантов</option>
        <option value="scatter">График</option>
        <option value="bar">Столбчатая диаграмма</option>
        <option value="pie">Круговая диаграмма</option>
      </select>

      <component
        v-if="type !== ''"
        v-bind:is="getActiveComponent"
        v-on:create="onCreate"
        class="mt-4"
      >
      </component>
    </div>
  `,
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
    onCreate (values) {
      this.$emit('create', values, this.type)
      this.type = ''
    },
    addLine () {
      // 
    }
  }
})

new Vue({
  el: "#app",
  data: () => {
    return {
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
        y: bar.values,
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
        values: pie.values,
        labels: pie.labels
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
    onCreate (values, type) {
      this.graphs.push(values);

      if (type === 'scatter') {
        const normalizedLines = values.map(line => this.normalizeLine(line))

        this.normalizedGraphs.push({
          layout: {
            title: `График - ${this.normalizedGraphs.length}`
          },
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
            title: `График - ${this.normalizedGraphs.length}`,
            grid: { rows: Math.ceil(normalizedPies.length / 2), columns: normalizedPies.length === 1 ? 1 : 2 }
          },
          data: normalizedPies
        })
      }

      if (type === 'bar') {
        const normalizedBars = values.map(bar => this.normalizeBar(bar))

        this.normalizedGraphs.push({
          layout: {
            title: `График - ${this.normalizedGraphs.length}`,
            barmode: 'group'
          },
          data: normalizedBars
        })
      }
    },
    recount (value, index) {
      if (this.graphs[index][0].type === 'scatter') {
        const lines = this.graphs[index];

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
  }
})      

