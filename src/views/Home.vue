<template>
  <div>
    <form-header />

    <!-- {{ viewTree[viewTree.length - 1] }} -->
    <div class="container">
      <div v-for="(item, index) in viewTree" :key="`tree-${index}`">
        <div v-if="item.type === 'graph'">
          <div v-for="(graph, index) in item.normalizedValue" :key="`graph-${index}`">
              <div class="plotly">
                <div class="plotly__actions">
                  <div class="btn btn_outline ml-2" v-on:click="removeGraph(index)">
                    <div class="p-icon p-icon-close"></div>
                  </div>

                  <div class="btn btn_outline ml-2" v-on:click="setEditMode(index)">
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

        <div v-if="item.type === 'text'">
          {{ item.value }}
        </div>
      </div>
    </div>

    <div class="section">
      <section class="section-container" :class="{ 'section-container_hide': !isVisibleMenu }">
        <div class="section__btn_close" v-on:click="isVisibleMenu = !isVisibleMenu">
          <div class="p-icon p-icon-chevron-left" :class="{ 'section__btn_close_rotate': isVisibleMenu }"></div>
        </div>

        <div class="section-container__block">
          <div class="section-container__actions">
            <div class="section__btn" v-bind:class="{ 'section__btn_active': action === 'create' }" v-on:click="action = 'create'">
              Создание
            </div>
            <div class="section__btn" v-bind:class="{ 'section__btn_active': action === 'edit' }" v-on:click="action = 'edit'">
              Редактирование
            </div>
          </div>
          <div class="section-container__content" v-if="action === 'create'">
            <keep-alive>
              <create-form v-on:create="onCreateGraph" />
            </keep-alive>
          </div>
          <div class="section-container__content" v-else-if="action === 'edit' && graphs.length">
            <keep-alive>
              <update-form v-on:update="onUpdate" v-bind:graphs="graphs" v-bind:expand-item="expandItem"/>
            </keep-alive>
          </div>
        </div>
      </section>

      <!-- <div class="container">
        <div v-if="error" style="padding-top: 100px;">
          <p>- Ой, что-то пошло не так...</p>
          <p>- А что делать?</p>
          <p>- Зайди в раздел "Редактирование" и поправь параметры, указанные в ошибке</p>
          <p class="p-error mt-2 mb-2">{{ error }}</p>
          <p v-on:click="isVisibleMenu = true; action = 'edit';">-&nbsp;<b class="p-link">Редактировать?</b></p>
        </div>

        <div v-if="normalizedGraphs.length === 0 && !error" style="padding-top: 100px;">
          <p>- Пока нет графиков на полотне...</p>
          <p v-on:click="isVisibleMenu = true;">-&nbsp;<b class="p-link">Создать?</b></p>
        </div>

        <div v-else v-for="(graph, index) in normalizedGraphs" :key="index">
          <div class="plotly">
            <div class="plotly__actions">
              <div class="btn btn_outline ml-2" v-on:click="removeGraph(index)">
                <div class="p-icon p-icon-close"></div>
              </div>

              <div class="btn btn_outline ml-2" v-on:click="setEditMode(index)">
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
      </div> -->
    </div>
  </div>
</template>

<script>
import FormHeader from '../components/form-header.vue'
import CreateForm from '../components/forms/create-form.vue'
import UpdateForm from '../components/forms/update-form.vue'
import Plotly from '../components/plotly/plotly'

import { parse, evaluate } from 'mathjs'
// import MathJax from 'mathjax'

const X_MIN = -30
const X_MAX = 30

export default {
  name: 'Home',
  components: {
    FormHeader,
    CreateForm,
    UpdateForm,
    Plotly
  },
  data: () => {
    return {
      expandItem: null,
      error: null,
      action: 'create',
      isVisibleMenu: false,
      viewTree: [
        {
          type: 'graph',
          value: [{
            values: [{
              name: 'y=f*x',
              funcRelative: 'x',
              declareType: 'byFunction',
              type: 'scatter',
              mode: 'lines',
              value: 'y=f*x',
              constsArray: [{
                name: 'f',
                value: 1
              }]
            }],
            layout: {
              title: 'График',
              xaxis: {
                title: 'X',
                range: [-30, 30]
              },
              yaxis: {
                title: 'Y',
                range: [-30, 30]
              }
            },
            type: 'scatter'
          }],
          normalizedValue: []
        },
        {
          type: 'text',
          value: 'text'
        },
        {
          type: 'graph',
          value: [{
            values: [{
              name: 'y=f*x',
              funcRelative: 'x',
              declareType: 'byFunction',
              type: 'scatter',
              mode: 'lines',
              value: 'y=f*x',
              constsArray: [{
                name: 'f',
                value: 1
              }]
            }],
            layout: {
              title: 'График',
              xaxis: {
                title: 'X',
                range: [-30, 30]
              },
              yaxis: {
                title: 'Y',
                range: [-30, 30]
              }
            },
            type: 'scatter'
          }],
          normalizedValue: []
        }
      ],
      // Массив графиков для отрисовки
      normalizedGraphs: [],
      // Массив графиков для восстановления
      graphs: [{
        values: [{
          name: 'y=f*x',
          funcRelative: 'x',
          declareType: 'byFunction',
          type: 'scatter',
          mode: 'lines',
          value: 'y=f*x',
          constsArray: [{
            name: 'f',
            value: 1
          }]
        }],
        layout: {
          title: 'График',
          xaxis: {
            title: 'X',
            range: [-30, 30]
          },
          yaxis: {
            title: 'Y',
            range: [-30, 30]
          }
        },
        type: 'scatter'
      }]
    }
  },
  created () {
    this.viewTree.map((item, index) => {
      console.log(item)
      if (item.type === 'graph') {
        item.value.map(graph => {
          this.onCreateGraph({
            index,
            values: graph.values,
            layout: graph.layout,
            type: graph.values[0].type
          }, true)
        })
      }

      if (item.type === 'text') {

      }
    })

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
          y: line.value.map(item => item.y)
        }
      } else if (line.declareType === 'byFunction') {
        const { x, y } = this.createFunctionalLine(line, xMin, xMax)

        return {
          name: line.value,
          type: line.type,
          mode: line.mode,
          x,
          y
        }
      }
    },
    // getTex (value) {
    //   const html = MathJax.tex2svg(value)
    //   return html.outerHTML
    // },
    onUpdate ({ values, layout, type, index }) {
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
              return []
            }).flat()

            const value = {
              'xaxis.range[0]': Math.min(...xArray),
              'xaxis.range[1]': Math.max(...xArray)
            }

            this.recount(value, index)
          } else {
            const value = {
              'xaxis.range[0]': layout.xaxis.range[0] || X_MIN,
              'xaxis.range[1]': layout.xaxis.range[1] || X_MAX
            }

            this.recount(value, index, 'scatter')
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
        this.error = error
      }
    },
    onCreate ({ values, layout, type }, isMountEvent = false) {
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
              return []
            }).flat()

            const value = {
              'xaxis.range[0]': Math.min(...xArray),
              'xaxis.range[1]': Math.max(...xArray)
            }

            this.recount(value, this.graphs.length - 1)
          } else {
            const value = {
              'xaxis.range[0]': layout.xaxis.range[0],
              'xaxis.range[1]': layout.xaxis.range[1]
            }

            this.recount(value, this.graphs.length - 1, 'scatter')
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
        this.error = error
      }
    },
    onCreateGraph ({ index, values, layout, type }, isMountEvent = false) {
      this.error = null
      if (index == null) {
        index = this.viewTree.length - 1
      }

      if (!isMountEvent) {
        this.viewTree.push({ type: 'graph', value: [{ values, layout, type }], normalizedValue: [] })
      }

      try {
        if (type === 'scatter') {
          const normalizedLines = values.map(line => this.normalizeLine(line))

          this.viewTree[index].normalizedValue.push({
            layout: JSON.parse(JSON.stringify(layout)),
            data: normalizedLines
          })

          console.log(this.viewTree[index])

          if (values.some(value => value.declareType === 'byCoords')) {
            const xArray = values.map(item => {
              if (item.declareType === 'byCoords') {
                return item.value.map(item => item.x)
              }
              return []
            }).flat()

            const value = {
              'xaxis.range[0]': Math.min(...xArray),
              'xaxis.range[1]': Math.max(...xArray)
            }

            this.recount(value, this.viewTree[index].length - 1)
          } else {
            const value = {
              'xaxis.range[0]': layout.xaxis.range[0],
              'xaxis.range[1]': layout.xaxis.range[1]
            }

            this.recount(value, this.viewTree[index].length - 1, 'scatter')
          }
        }

        if (type === 'pie') {
          const normalizedPies = values.map((pie, index) => this.normalizePie(pie, index / 2, index % 2))

          this.viewTree[index].normalizedValue.push({
            layout: {
              ...layout,
              grid: { rows: Math.ceil(normalizedPies.length / 2), columns: normalizedPies.length === 1 ? 1 : 2 }
            },
            data: normalizedPies
          })
        }

        if (type === 'bar') {
          const normalizedBars = values.map(bar => this.normalizeBar(bar))
          this.viewTree[index].normalizedValue.push({
            layout: {
              ...layout,
              barmode: 'group'
            },
            data: normalizedBars
          })
        }
      } catch (error) {
        this.error = error
      }
    },
    recount (value, index, type) {
      if (type === 'scatter') {
        const lines = this.graphs[index].values

        if (value?.['xaxis.range[0]'] && value?.['xaxis.range[1]']) {
          const normalizedLines = lines.map(line => {
            if (line.declareType === 'byFunction' && (value?.['xaxis.range[0]'] < X_MIN || value?.['xaxis.range[1]'] > X_MAX)) {
              const [xMin, xMax] = [value['xaxis.range[0]'], value['xaxis.range[1]']]

              return this.normalizeLine(line, xMin, xMax)
            }

            return this.normalizeLine(line)
          })

          this.normalizedGraphs[index].data = normalizedLines
        }
      }
    },
    createFunctionalLine (line, xMin = X_MIN, xMax = X_MAX) {
      // Оптимизация (меньшее количество точек в массиве)
      let dx = 0.1

      switch (true) {
        case (Math.abs(xMin - xMax)) >= 1000 && (Math.abs(xMin - xMax)) < 10000:
          dx = 0.5
          break
        case (Math.abs(xMin - xMax)) >= 10000 && (Math.abs(xMin - xMax)) < 100000:
          dx = 10
          break
        case (Math.abs(xMin - xMax)) >= 100000 && (Math.abs(xMin - xMax)) < 1000000:
          dx = 100
          break
        case (Math.abs(xMin - xMax)) >= 1000000 && (Math.abs(xMin - xMax)) < 10000000:
          dx = 1000
          break
        case (Math.abs(xMin - xMax)) >= 10000000 && (Math.abs(xMin - xMax)) < 100000000:
          dx = 10000
          break
        case (Math.abs(xMin - xMax)) >= 100000000:
          dx = 10000000
          break
        default:
          dx = 0.1
      }
      const xArray = []; const yArray = []

      const node = parse(line.value)
      const scope = new Map()

      if (line.constsArray.length) {
        line.constsArray.forEach(cons => {
          scope.set(cons.name, evaluate(cons.value))
        })
      }

      for (let x = xMin; x < xMax; x += dx) {
        const code = node.compile()

        xArray.push(x)
        yArray.push(code.evaluate({ [line.funcRelative]: x, ...Object.fromEntries(scope) }))
      }

      return {
        x: xArray,
        y: yArray
      }
    }
  }
}
</script>
