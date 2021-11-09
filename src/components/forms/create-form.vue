<template>
  <div class="card card_column">
    <div class="card__content">
      <p class="p-input__label">Тип графика</p>
      <select v-model="type" class="input-block select-css">
        <option disabled value="">Выберите один из вариантов</option>
        <option value="scatter">График</option>
        <option value="bar">Столбцы</option>
        <option value="pie">Круговая диаграмма</option>
      </select>
    </div>

    <component
      v-if="type !== ''"
      v-bind:is="getActiveComponent"
      v-on:create="onCreate"
    >
    </component>
  </div>
</template>

<script>
import CreateScatter from '../types/types-create/scatter.vue'
import CreatePie from '../types/types-create/pie.vue'
import CreateBar from '../types/types-create/bar.vue'

export default {
  name: 'CreateForm',
  components: {
    CreateScatter,
    CreatePie,
    CreateBar
  },
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
          break

        case 'bar':
          component = 'create-bar'
          break

        case 'pie':
          component = 'create-pie'
          break

        default:
          break
      }

      return component
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
}
</script>
