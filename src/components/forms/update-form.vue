<template>
  <div class="card card_column">
    <div v-for="(graph, index) in expandItem.value" v-bind:key="index">
      <div>
        <div
          class="card__content card__content_active d-flex"
          v-on:click="setExpand(index)">
          <p style="cursor: pointer" class="p-title-bold">
            {{ graph.layout.title }}
          </p>
          <div
            class="ml-auto p-icon p-icon-chevron-right"
            v-bind:class="{ section__btn_close_rotate: isExpanded(index) }" />
        </div>

        <component
          v-bind:is="getActiveComponent(graph.type)"
          v-if="expanded.includes(index)"
          v-bind:graph="graph"
          v-on:update="update($event, graph, index)" />
      </div>
    </div>
  </div>
</template>

<script>
  import UpdateScatter from '../types/types-update/scatter.vue';
  import UpdatePie from '../types/types-update/pie.vue';
  import UpdateBar from '../types/types-update/bar.vue';
  import BaseGraphNormalize from '@/utils/base-graph-normalize.vue';

  import { X_MIN, X_MAX } from '@/utils/consts';

  export default {
    name: 'UpdateForm',
    components: {
      UpdateScatter,
      UpdatePie,
      UpdateBar
    },
    extends: BaseGraphNormalize,
    props: {
      type: { type: String, default: '' },
      expandItem: {
        type: [Number, Object],
        default: null
      }
    },
    data: () => {
      return {
        expanded: []
      };
    },
    watch: {
      expandItem: {
        immediate: true,
        handler(value) {
          if (value != null) {
            this.setExpand(value, true);
          }
        }
      }
    },
    methods: {
      setExpand(index, isDirect = false) {
        if (this.expanded.includes(index) && !isDirect) {
          this.expanded = this.expanded.filter((expand) => expand !== index);
        } else {
          this.expanded.push(index);
        }
      },
      isExpanded(index) {
        return this.expanded.includes(index);
      },
      getActiveComponent(type) {
        let component = '';

        switch (type) {
          case 'scatter':
            component = 'update-scatter';
            break;

          case 'bar':
            component = 'update-bar';
            break;

          case 'pie':
            component = 'update-pie';
            break;

          default:
            break;
        }

        return component;
      },
      update({ values, layout }, graph, index) {
        if (graph.type === 'scatter') {
          const normalizedLines = values.map(line => this.normalizeLine(line));

          this.expandItem.normalizedValue = this.expandItem.normalizedValue.map((graph, curIndex) => {
            if (curIndex === index) {
              graph = {
                layout: JSON.parse(JSON.stringify(layout)),
                data: normalizedLines
              };
            }

            return graph;
          });

          if (values.some(value => value.declareType === 'byCoords')) {
            const xArray = values.map(item => {
              if (item.declareType === 'byCoords') {
                return item.value.map(item => item.x);
              }
              return [];
            }).flat();

            const value = {
              'xaxis.range[0]': Math.min(...xArray),
              'xaxis.range[1]': Math.max(...xArray)
            };

            this.recount(value, index);
            this.recount(value, this.expandItem, index, 'scatter');
          } else {
            const value = {
              'xaxis.range[0]': layout.xaxis.range[0] || X_MIN,
              'xaxis.range[1]': layout.xaxis.range[1] || X_MAX
            };

            this.recount(value, this.expandItem, index, 'scatter');
          }
        }

        if (graph.type === 'pie') {
          const normalizedPies = values.map((pie, index) => this.normalizePie(pie, index / 2, index % 2));

          this.expandItem.normalizedValue = this.expandItem.normalizedValue.map((graph, curIndex) => {
            if (curIndex === index) {
              graph = {
                layout: {
                  ...JSON.parse(JSON.stringify(layout)),
                  grid: { rows: Math.ceil(normalizedPies.length / 2), columns: normalizedPies.length === 1 ? 1 : 2 }
                },
                data: normalizedPies
              };
            }

            return graph;
          });
        }

        if (graph.type === 'bar') {
          const normalizedBars = values.map(bar => this.normalizeBar(bar));

          this.expandItem.normalizedValue = this.expandItem.normalizedValue.map((graph, curIndex) => {
            if (curIndex === index) {
              graph = {
                layout: {
                  ...JSON.parse(JSON.stringify(layout)),
                  barmode: 'group'
                },
                data: normalizedBars
              };
            }

            return graph;
          });
        }

        this.$emit('update');
      },
      addLine() {
      //
      }
    }
  };
</script>
