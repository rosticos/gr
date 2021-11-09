<template>
  <div>
    <div v-for="(line, index) in lines" :key="index">
      <hr>
      <div class="card__content d-flex">
        <p class="p-title-bold">{{ line.name || 'Новая линия' }}</p>
        <div class="ml-auto btn btn_outline ml-2" v-on:click="removeLine(index)">
          <div class="p-icon p-icon-close"></div>
        </div>
      </div>
      <hr>

      <div class="card__content d-flex pb-0">
        <div>
          <p class="p-input__label">Название линии</p>
          <select v-model="line.declareType" v-on:change="onChangeDeclareType(index)" class="input-block select-css">
            <option disabled value="">Способ задания линии</option>
            <option value="byFunction">Функция</option>
            <option value="byCoords">Координаты</option>
          </select>
        </div>

        <div class="ml-2">
          <p class="p-input__label">Тип линии</p>
          <select v-model="line.mode" class="input-block select-css">
            <option disabled value="">Тип отображения линии</option>
            <option value="lines">Линия</option>
            <option value="markers">Маркеры</option>
            <option value="lines+markers">Линия и маркеры</option>
          </select>
        </div>

        <div class="btn-container_s">
          <div class="btn btn_outline ml-2" v-on:click="addPoint(index)" v-if="line.declareType === 'byCoords'">
            <div class="p-icon p-icon-add"></div>
          </div>
        </div>
      </div>

      <div v-if="line.declareType === 'byFunction'" class=" pt-0 card__content">
        <div>
          <p class="p-input__label">Название линии</p>
          <input type="text" class="input-block" v-model="line.name">
        </div>

        <div class="mt-2">
          <p class="p-input__label">Функция (y=cos(x), y=sin(x) ...)</p>
          <input type="text" class="input-block" v-model="line.value">
        </div>

        <div class="mt-2">
          <p class="p-input__label">Построит функцию относительно ... (x)</p>
          <input type="text" class="input-block" v-model="line.funcRelative">
        </div>

        <div class="d-flex my-4">
          <p class="p-title">Константы</p>
          <div class="btn btn_outline ml-auto" v-on:click="addConst(index)">
            <div class="p-icon p-icon-add"></div>
          </div>
        </div>

        <div>
          <div class="mt-2">
            <div v-for="(cons, consIndex) in line.constsArray" :key="consIndex">
              <div class="d-flex">
                <div>
                  <p class="p-input__label">Название</p>
                  <input type="text" class="input-block" v-model="cons.name">
                </div>

                <div class="ml-2">
                  <p class="p-input__label">Значение</p>
                  <input type="text" class="input-block" v-model="cons.value">
                </div>

                <div class="btn-container_s">
                  <div class="btn btn_outline ml-2" v-on:click="removeConst(index, consIndex)">
                    <div class="p-icon p-icon-close"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="line.declareType === 'byCoords'">
        <div class="mt-2 card__content">
          <p class="p-input__label">Название линии</p>
          <input type="text" class="input-block" v-model="line.name">
        </div>

        <div v-for="(value, valueIndex) in line.value" :key="valueIndex" class="d-flex mt-4">
          <div>
            <p class="p-input__label">X:</p>
            <input type="text" class="input-block" v-model="value.x">
          </div>

          <div class="ml-2">
            <p class="p-input__label">Y:</p>
            <input type="text" class="input-block" v-model="value.y">
          </div>

          <div class="btn-container_s">
            <div class="btn btn_outline ml-2" v-on:click="removePoint(index, valueIndex)">
              <div class="p-icon p-icon-close"></div>
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

    <div class="card__content">
      <div>
        <p class="p-input__label">Название графика</p>
        <input type="text" class="input-block" v-model="layout.title">
      </div>

      <div>
        <p class="p-input__label">Горизонталь</p>
        <input type="text" class="input-block" v-model="layout.xaxis.title">
      </div>

      <div>
        <p class="p-input__label">Вертикаль</p>
        <input type="text" class="input-block" v-model="layout.yaxis.title">
      </div>

      <div>
        <p class="p-input__label">Начальная область по горизонтале:</p>
        <div class="d-flex">
          <input type="text" class="input-block" v-model.number="layout.xaxis.range[0]">
          <input type="text" class="input-block" v-model.number="layout.xaxis.range[1]">
        </div>
      </div>

      <div>
        <p class="p-input__label">Начальная область по горизонтале:</p>
        <div class="d-flex">
          <input type="text" class="input-block" v-model.number="layout.yaxis.range[0]">
          <input type="text" class="input-block" v-model.number="layout.yaxis.range[1]">
        </div>
      </div>
    </div>

    <div class="card__content card__actions">
      <div class="btn btn_outline" v-on:click="addLine">
        <div class="p-icon p-icon-add mr-2"></div>
        Добавить график
      </div>

      <div class="btn btn_primary ml-auto" v-on:click="submit" v-if="layout.title !== ''">
        {{ submitText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pie',
  data: () => {
    return {
      submitText: 'Создать',
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
          }]
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
    addPoint (index) {
      this.lines[index].value.push({
        x: '',
        y: ''
      })
    },
    removePoint (index, rmIndex) {
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
}
</script>
