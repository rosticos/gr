<template>
  <div>
    <form-header v-on:create-graph="showCreateGraph" v-on:create-text="showCreateText"/>

    <div class="container">
      <div v-for="(item, index) in viewTree" :key="`tree-${index}`">
        <div v-if="item.type === 'graph'">
          <div v-for="(graph, index) in item.normalizedValue" :key="graph.id">
            <div class="plotly">
              <div class="plotly__actions">
                <div class="btn btn_outline ml-2" v-on:click="removeGraph(item.id)">
                  <div class="p-icon p-icon-close"></div>
                </div>

                <div class="btn btn_outline ml-2" v-on:click="setEditMode(item.id)">
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
          <TextareaEditor v-bind:value.sync="item.value"/>
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
          <!-- <div class="section-container__content" v-if="action === 'create'">
            <keep-alive>
              <create-form v-on:create="onCreate" />
            </keep-alive>
          </div> -->
          <!-- <div class="section-container__content" v-else-if="action === 'edit' && graphs.length">
            <keep-alive>
              <update-form v-on:update="onUpdate" v-bind:graphs="graphs" v-bind:expand-item="expandItem"/>
            </keep-alive>
          </div> -->
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import FormHeader from '../components/form-header.vue'
// import CreateForm from '../components/forms/create-form.vue'
// import UpdateForm from '../components/forms/update-form.vue'
import Plotly from '../components/plotly/plotly'
import TextareaEditor from '../components/textarea/textarea-editor.vue'

import { parse, evaluate } from 'mathjs'
import { v4 as uuid } from 'uuid'
// import MathJax from 'mathjax'

const X_MIN = -30
const X_MAX = 30

export default {
  name: 'Home',
  components: {
    FormHeader,
    // CreateForm,
    // UpdateForm,
    Plotly,
    TextareaEditor
  },
  data: () => {
    return {
      expandItem: null,
      error: null,
      action: 'create',
      isVisibleMenu: false,
      viewTree: [
        {
          id: uuid(),
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
          id: uuid(),
          type: 'text',
          value: 'text'
        }
      ]
    }
  },
  created () {
    this.viewTree.map((item, index) => {
      if (item.type === 'graph') {
        item.value.map(graph => {
          this.onCreate({
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
  },
  methods: {
    showCreateForm () {

    },
    setEditMode (id) {
      this.isVisibleMenu = true
      this.action = 'edit'

      this.expandItem = id
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
    onCreate ({ index, values, layout, type }, isMountEvent = false) {
      this.error = null

      if (index == null) {
        index = this.viewTree.length - 1
      }

      if (!isMountEvent) {
        this.viewTree.push({ id: uuid(), type: 'graph', value: [{ values, layout, type }], normalizedValue: [] })
      }

      try {
        if (type === 'scatter') {
          const normalizedLines = values.map(line => this.normalizeLine(line))

          this.viewTree[index].normalizedValue.push({
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
