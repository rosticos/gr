<template>
  <div class="editor-page">
    <div class="constructor-header-toolbar">
      <form-header 
        v-on:create-graph="createGrapg"
        v-on:create-textarea="createTextarea"
        v-on:import="onImport"
        v-on:download="onDownload" />
      <div class="constructor-header-toolbar__tinymce-toolbar" />
    </div>

    <div v-if="viewTree.length" class="editor-page__container">
      <div class="wrapper">
        <div class="container">
          <div 
            v-for="(item, index) in viewTree"
            v-bind:key="item.id"
            class="document-part document-part-class-free document-part_mode_edit document-part-class-free_mode_edit">
            <div v-if="item.type === 'graph'" class="document-part_graph">
              <div class="plotly__actions">
                <div
                  class="btn btn_outline ml-2"
                  v-on:click="removeItem(index)">
                  <div class="p-icon p-icon-close" />
                </div>

                <div class="btn btn_outline ml-2" v-on:click="editGraph(item)">
                  <div class="p-icon p-icon-edit" />
                </div>
              </div>
              <div v-for="graph in item.normalizedValue" v-bind:key="graph.id">
                <div class="plotly">
                  <plotly
                    v-bind:data="graph.data"
                    v-bind:layout="graph.layout"
                    v-bind:display-mode-bar="true"
                    v-bind:scroll-zoom="true"
                    v-bind:mode-bar-buttons-to-remove="[
                      'lasso2d',
                      'zoom2d',
                      'resetScale2d',
                      'toggleSpikelines',
                      'producedWithPlotly',
                    ]"
                    v-on:relayout="recount($event, item, 0, graph.data[0].type)" />
                </div>
              </div>
            </div>

            <div v-if="item.type === 'text'">
              <div class="plotly__actions">
                <div
                  class="btn btn_outline ml-2"
                  v-on:click="removeItem(index)">
                  <div class="p-icon p-icon-close" />
                </div>
              </div>

              <div class="textarea-element">
                <textarea-editor 
                  v-bind:id="`textarea-${item.id}`"
                  class="textarea-element__edit"
                  v-bind:value.sync="item.value" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <section
        class="section-container"
        v-bind:class="{ 'section-container_hide': !isVisibleMenu }">
        <div
          class="section__btn_close"
          v-on:click="isVisibleMenu = !isVisibleMenu">
          <div
            class="p-icon p-icon-chevron-left"
            v-bind:class="{ section__btn_close_rotate: isVisibleMenu }" />
        </div>

        <div class="section-container__block">
          <div class="section-container__actions">
            <div
              class="section__btn"
              v-bind:class="{ section__btn_active: action === 'create' }"
              v-on:click="action = 'create'">
              Создание
            </div>
            <div
              class="section__btn"
              v-bind:class="{ section__btn_active: action === 'edit' }"
              v-on:click="action = 'edit'">
              Редактирование
            </div>
          </div>
          <div v-if="action === 'create'" class="section-container__content">
            <keep-alive>
              <create-form v-on:create="onCreate" />
            </keep-alive>
          </div>
          <div v-if="action === 'edit'" class="section-container__content">
            <keep-alive>
              <update-form
                v-bind:expand-item="expandItem"
                v-on:update="onUpdate" />
            </keep-alive>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import FormHeader from '../components/form-header.vue';
  import CreateForm from '../components/forms/create-form.vue';
  import UpdateForm from '../components/forms/update-form.vue';
  import Plotly from '../components/plotly/plotly';
  import BaseGraphNormalize from '@/utils/base-graph-normalize.vue';
  import TextareaEditor from '../components/textarea/textarea-editor.vue';

  import { v4 as uuid } from 'uuid';
  // import MathJax from 'mathjax'

  export default {
    name: 'Home',
    components: {
      FormHeader,
      CreateForm,
      UpdateForm,
      Plotly,
      TextareaEditor
    },
    extends: BaseGraphNormalize,
    data: () => {
      return {
        expandItem: null,
        error: null,
        action: 'create',
        isVisibleMenu: false,
        viewTree: []
      };
    },
    mounted() {
      this.createTextarea('Импортируйте имеющийся документ или начните создавать новый с добавления блоков <b>«График»</b> или <b>«Текст»</b>.');
    },
    methods: {
      normalizeViewTree(viewTree) {
        return viewTree.map(v => {
          if (v.type === 'graph') {
            return {
              id: v.id,
              type: v.type,
              value: v.value,
              normalizedValue: []
            };
          }

          if (v.type === 'text') {
            return {
              type: v.type,
              value: v.value
            };
          }

          return v;
        });
      },
      onDownload() {
        const a = window.document.createElement('a');
        var file = new Blob([JSON.stringify(this.normalizeViewTree(this.viewTree))], {type: 'text/plain'});
        const url = URL.createObjectURL(file);

        a.href = url;
        a.style.display = 'none';
        a.download = `${new Date().toJSON()}.txt`;

        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
      },
      async onImport(viewTree) {
        this.viewTree = viewTree;

        this.viewTree = this.viewTree.map((item, index) => {
          if (item.type === 'graph') {
            item.value.map((graph) => {
              this.onCreate(
                {
                  index,
                  values: graph.values,
                  layout: graph.layout,
                  type: graph.values[0].type
                },
                true
              );
            });
          }

          if (item.type === 'text') {
            //
            return {
              id: uuid(),
              type: item.type,
              value: item.value
            };
          }

          return item;
        });
      },
      createGrapg() {
        this.isVisibleMenu = true;
        this.action = 'create';
      },
      editGraph(item) {
        this.isVisibleMenu = true;
        this.action = 'edit';

        this.expandItem = item;
      },
      removeItem(index) {
        this.viewTree = this.viewTree.filter((v, i)=> {
          if (index === i) {
            return false;
          }

          return true;
        });
      },
      createTextarea(initValue = '') {
        this.viewTree.push({
          id: uuid(),
          type: 'text',
          value: `<p>${ initValue }</p>`
        });
      },
      onUpdate() {
        //
        this.isVisibleMenu = false;
      },
      onCreate({ index, values, layout, type }, isMountEvent = false) {
        this.error = null;

        if (!isMountEvent) {
          this.viewTree.push({
            id: uuid(),
            type: 'graph',
            value: [{ values, layout, type }],
            normalizedValue: []
          });

          this.isVisibleMenu = false;
        }

        if (index == null) {
          index = this.viewTree.length - 1;
        }

        try {
          if (type === 'scatter') {
            const normalizedLines = values.map((line) =>
              this.normalizeLine(line)
            );

            this.viewTree[index].normalizedValue.push({
              layout: JSON.parse(JSON.stringify(layout)),
              data: normalizedLines
            });

            if (values.some((value) => value.declareType === 'byCoords')) {
              const xArray = values
                .map((item) => {
                  if (item.declareType === 'byCoords') {
                    return item.value.map((item) => item.x);
                  }
                  return [];
                })
                .flat();

              const value = {
                'xaxis.range[0]': Math.min(...xArray),
                'xaxis.range[1]': Math.max(...xArray)
              };

              this.recount(
                value,
                this.viewTree[index].length - 1,
                index,
                'scatter'
              );
            } else {
              const value = {
                'xaxis.range[0]': layout.xaxis.range[0],
                'xaxis.range[1]': layout.xaxis.range[1]
              };

              this.recount(
                value,
                this.viewTree[index].length - 1,
                index,
                'scatter'
              );
            }
          }

          if (type === 'pie') {
            const normalizedPies = values.map((pie, index) =>
              this.normalizePie(pie, index / 2, index % 2)
            );

            this.viewTree[index].normalizedValue.push({
              layout: {
                ...layout,
                grid: {
                  rows: Math.ceil(normalizedPies.length / 2),
                  columns: normalizedPies.length === 1 ? 1 : 2
                }
              },
              data: normalizedPies
            });
          }

          if (type === 'bar') {
            const normalizedBars = values.map((bar) => this.normalizeBar(bar));
            this.viewTree[index].normalizedValue.push({
              layout: {
                ...layout,
                barmode: 'group'
              },
              data: normalizedBars
            });
          }
        } catch (error) {
          this.error = error;
        }
      }
    }
  };
</script>

<style>
  @import '../components/textarea/assets/styles/editor.css';
  @import '../components/textarea/assets/styles/document-part.css';

  .editor-page {
    flex: 1 1 auto;
    backface-visibility: hidden;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 100%;
    position: relative;
    background: #F2F3F7;
  }
  .editor-page__container {
    padding: 60px 0;
    display: flex;
    flex: 1 1 auto;
  }

  .editor-page .wrapper {
    margin: 0 auto;
  }

  .editor-page .wrapper .container {
    border-radius: 20px;
    padding: 20px 0;
    background: #fff;
  }

  .constructor-header-toolbar {
    background-color: #fff;
    border-bottom: 1px solid var(--color-light-grey);
    display: flex;
    height: 38px;
    padding: 0px;
    width: 100%;
    position: fixed;
    z-index: 100;
  }
  .constructor-header-toolbar__structure {
    margin-right: 8px;
  }
  .constructor-header-toolbar__tinymce-toolbar {}

  .textarea-element {
    font-family: Arial, sans-serif !important;
    font-size: 14px !important;
    line-height: 24px !important;
    margin-bottom: -8px; /* Сдвигаем margin-bottom, так основные элементы внутри textarea-element (paragraphs, lists, tables) имеют margin-bottom: 8px */
  }
  .textarea-element a {
    color: var(--color-link) !important;
  }
  .textarea-element a:hover {
    color: var(--color-link-hover) !important;
  }
  .textarea-element a:active {
    color: var(--color-link-active) !important;
  }
  .textarea-element p, .textarea-element ol, .textarea-element table {
    margin-bottom: 8px !important;
  }
  .textarea-element__view .textarea-element-input {
    background-color: var(--color-white-smoke) !important;
    box-shadow: inset 0 0 0 1px var(--color-light-grey) !important;
    color: var(--color-text-tertiary) !important;
    cursor: auto !important;
    padding-left: 6px !important;
    padding-right: 6px !important;
    user-select: auto;
    white-space: normal;
  }
  .textarea-element table {
    border: 1px solid var(--color-light-grey) !important;
    border-collapse: collapse;
  }
  .textarea-element tr, .textarea-element td {
    border: 1px solid var(--color-light-grey) !important;
  }
  .textarea-element td {
    padding: 5px 8px;
  }
</style>
