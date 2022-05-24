<template>
  <div>
    <div v-for="(line, index) in lines" v-bind:key="index">
      <hr>
      <div class="card__content d-flex align-center">
        <p class="p-title-bold">{{ line.name || 'Новая линия' }}</p>
        <div v-if="showInEditMode" class="ml-auto btn btn_outline" v-on:click="removeLine(index)">
          <div class="p-icon p-icon-close" />
        </div>
      </div>
      <hr>

      <div class="card__content d-flex align-center pb-0">
        <div v-if="showInEditMode" class="d-flex align-center">
          <gr-checkbox v-model="line.disabled" />
          <p class="p-input__label ml-2 my-0">Заблокировать изменения блока "{{ line.name || 'Новая линия' }}"</p>
        </div>
      </div>

      <div class="card__content d-flex align-center pb-0">
        <div>
          <p class="p-input__label">Название линии</p>
          <select v-model="line.declareType" v-bind:disabled="isDisabled(line.disabled)" class="input-block select-css" v-on:change="onChangeDeclareType(index)">
            <option disabled value="">Способ задания линии</option>
            <option value="byFunction">Функция</option>
            <option value="byCoords">Координаты</option>
          </select>
        </div>

        <div class="ml-2">
          <p class="p-input__label">Тип линии</p>
          <select v-model="line.mode" v-bind:disabled="isDisabled(line.disabled)" class="input-block select-css">
            <option disabled value="">Тип отображения линии</option>
            <option value="lines">Линия</option>
            <option value="markers">Маркеры</option>
            <option value="lines+markers">Линия и маркеры</option>
          </select>
        </div>
      </div>

      <div v-if="line.declareType === 'byFunction'" class=" pt-0 card__content">
        <div>
          <p class="p-input__label">Название линии</p>
          <input v-model="line.name" v-bind:disabled="isDisabled(line.disabled)" type="text" class="input-block">
        </div>

        <div class="mt-2">
          <p class="p-input__label">Функция (y=cos(x), y=sin(x) ...)</p>
          <textarea v-model="line.value" v-bind:disabled="isDisabled(line.disabled)" type="text" class="input-block" />
        </div>

        <div class="mt-2">
          <p class="p-input__label">Построит функцию относительно ... (x)</p>
          <input v-model="line.funcRelative" v-bind:disabled="isDisabled(line.disabled)" type="text" class="input-block">
        </div>

        <div class="d-flex mt-4">
          <p class="p-title">Константы</p>
          <div v-if="showInEditMode" class="btn btn_outline ml-auto" v-on:click="addConst(index)">
            <div class="p-icon p-icon-add" />
          </div>
        </div>

        <div>
          <div v-for="(cons, consIndex) in line.constsArray" v-bind:key="consIndex">
            <div class="d-flex align-center">
              <div v-if="showInEditMode">
                <p class="p-input__label">&nbsp;</p>
                <gr-checkbox v-model="cons.disabled" />
              </div>

              <div>
                <p class="p-input__label">Название</p>
                <input v-model="cons.name" v-bind:disabled="isDisabled(cons.disabled)" type="text" class="input-block">
              </div>

              <div class="ml-2">
                <p class="p-input__label">Значение</p>
                <input v-model="cons.value" v-bind:disabled="isDisabled(cons.disabled)" type="text" class="input-block">
              </div>

              <div v-if="showInEditMode" class="btn-container_s">
                <div class="btn btn_outline ml-2" v-on:click="removeConst(index, consIndex)">
                  <div class="p-icon p-icon-close" />
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex align-center mt-4">
            <div class="d-flex align-center">
              <p class="p-input__label ml-2 my-0">Чекбокс обозначает блокировку изменения константы</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="line.declareType === 'byCoords'" class="card__content">
        <div>
          <p class="p-input__label">Название линии</p>
          <input v-model="line.name" type="text" class="input-block">
        </div>

        <div class="d-flex mt-4">
          <p class="p-title">Значения</p>
          <div v-if="showInEditMode" class="btn btn_outline ml-auto" v-on:click="addPoint(index)">
            <div class="p-icon p-icon-add" />
          </div>
        </div>

        <div v-for="(value, valueIndex) in line.value" v-bind:key="valueIndex" class="d-flex align-center">
          <div v-if="showInEditMode">
            <p class="p-input__label">&nbsp;</p>
            <gr-checkbox v-model="value.disabled" />
          </div>

          <div>
            <p class="p-input__label">X:</p>
            <input v-model="value.x" v-bind:disabled="isDisabled(value.disabled)" type="text" class="input-block">
          </div>

          <div class="ml-2">
            <p class="p-input__label">Y:</p>
            <input v-model="value.y" v-bind:disabled="isDisabled(value.disabled)" type="text" class="input-block">
          </div>

          <div v-if="showInEditMode" class="btn-container_s">
            <div class="btn btn_outline ml-2" v-on:click="removePoint(index, valueIndex)">
              <div class="p-icon p-icon-close" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr>
    <div class="card__content">
      <p class="p-title">Настроить график</p>
    </div>
    <hr>

    <div class="card__content d-flex align-center pb-0">
      <div v-if="showInEditMode" class="d-flex align-center">
        <gr-checkbox v-model="layout.disabled" />
        <p class="p-input__label ml-2 my-0">Заблокировать изменения блока "Настроить график"</p>
      </div>
    </div>

    <div class="card__content">
      <div>
        <p class="p-input__label">Название графика</p>
        <input v-model="layout.title" v-bind:disabled="isDisabled(layout.disabled)" type="text" class="input-block">
      </div>

      <div>
        <p class="p-input__label">Горизонталь</p>
        <input v-model="layout.xaxis.title" v-bind:disabled="isDisabled(layout.disabled)" type="text" class="input-block">
      </div>

      <div>
        <p class="p-input__label">Вертикаль</p>
        <input v-model="layout.yaxis.title" v-bind:disabled="isDisabled(layout.disabled)" type="text" class="input-block">
      </div>

      <div>
        <p class="p-input__label">Начальная область по горизонтале:</p>
        <div class="d-flex">
          <input v-model.number="layout.xaxis.range[0]" v-bind:disabled="isDisabled(layout.disabled)" type="text" class="input-block">
          <input v-model.number="layout.xaxis.range[1]" v-bind:disabled="isDisabled(layout.disabled)" type="text" class="input-block">
        </div>
      </div>

      <div>
        <p class="p-input__label">Начальная область по горизонтале:</p>
        <div class="d-flex">
          <input v-model.number="layout.yaxis.range[0]" v-bind:disabled="isDisabled(layout.disabled)" type="text" class="input-block">
          <input v-model.number="layout.yaxis.range[1]" v-bind:disabled="isDisabled(layout.disabled)" type="text" class="input-block">
        </div>
      </div>
    </div>

    <div class="card__content card__actions">
      <div v-if="showInEditMode" class="btn btn_outline" v-on:click="addLine">
        <div class="p-icon p-icon-add mr-2" />
        Добавить график
      </div>

      <div v-if="layout.title !== ''" class="btn btn_primary ml-auto" v-on:click="submit">
        {{ submitText }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Scatter',
    data: () => {
      return {
        submitText: 'Создать',
        layout: {
          disabled: true,
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
        lines: [
          {
            name: 'y=f*x',
            disabled: false,
            funcRelative: 'x',
            declareType: 'byFunction',
            type: 'scatter',
            mode: 'lines',
            value: 'y=f*x',
            constsArray: [{
              name: 'f',
              value: 1,
              disabled: true
            }]
          }
        ]
      };
    },
    computed: {
      showInEditMode() {
        return this.isEditMode;
      }
    },
    methods: {
      isDisabled(disabled) {
        return disabled && this.isViewMode;
      },
      removeLine(index) {
        this.lines.splice(index, 1);
      },
      removeConst(index, consIndex) {
        this.lines[index].constsArray.splice(consIndex, 1);
      },
      addConst(index) {
        this.lines[index].constsArray.push({ name: '', value: '', disabled: false });
      },
      addPoint(index) {
        this.lines[index].value.push({
          x: '',
          y: ''
        });
      },
      removePoint(index, rmIndex) {
        this.lines[index].value.splice(rmIndex, 1);
      },
      onChangeDeclareType(index) {
        if (this.lines[index].declareType === 'byFunction') {
          this.lines[index].value = '';
        } else if (this.lines[index].declareType === 'byCoords') {
          this.lines[index].value = [{
            disabled: false,
            x: '',
            y: ''
          }];
        }
      },
      add() {
        this.$emit('add', this.graph);
      },
      addLine() {
        this.lines.push({
          constsArray: [],
          funcRelative: 'x',
          declareType: 'byFunction',
          type: 'scatter',
          mode: 'lines',
          value: ''
        });
      },
      submit() {
        this.$emit('create', { values: this.lines, layout: this.layout });
      }
    }
  };
</script>
