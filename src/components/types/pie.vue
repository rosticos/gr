<template>
    <div>
      <hr>
      <div class="card__content">
        <p class="p-input__label">Название:</p>
        <input type="text" class="input-block ml-2" v-model="layout.title">
      </div>
      <hr>

      <div class="card card_column card__content" v-for="(pie, index) in pies" :key="`pie-${index}`">
        <div class="card">
          <div class="btn btn_outline" v-on:click="addItem(index)">
            <div class="p-icon p-icon-add"></div>
            Добавить часть
          </div>

          <div class="btn btn_outline ml-auto" v-on:click="removeItem(index)">
            <div class="p-icon p-icon-close"></div>
          </div>
        </div>

        <div class="mt-4">
          <div v-for="counter in pie.counter" :key="counter" class="d-flex mt-2">
            <div class="d-flex">
              <p class="p-input__label">Наим:</p>
              <input type="text" class="input-block ml-2" v-model="pie.labels[counter - 1]">
            </div>

            <div class="d-flex ml-2">
              <p class="p-input__label">Значение:</p>
              <input type="text" class="input-block ml-2" v-model="pie.values[counter - 1]">
            </div>

            <div class="btn btn_outline ml-2" v-on:click="removePieItem(index, counter - 1)">
              <div class="p-icon p-icon-close"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card__content card__actions">
        <div class="btn btn_outline" v-on:click="addPie">
          <div class="p-icon p-icon-add"></div>
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
        title: 'Круговая диаграмма'
      },
      pies: [
        {
          counter: 3,
          type: 'pie',
          textinfo: 'label+percent',
          values: [],
          labels: [],
          insidetextorientation: 'radial'
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
          textinfo: 'label+percent',
          values: [],
          labels: [],
          insidetextorientation: 'radial'
        }
      ]
    },
    removePieItem (index, pieIndex) {
      this.pies[index].counter -= 1
      this.pies[index].values.splice(pieIndex, 1)
      this.pies[index].labels.splice(pieIndex, 1)
    },
    addItem (index) {
      this.pies[index].counter += 1
      this.pies[index].values.push('')
      this.pies[index].labels.push('')
    },
    addPie () {
      this.pies.push({
        counter: 1,
        type: 'pie',
        textinfo: 'label+percent',
        values: [0],
        labels: [''],
        insidetextorientation: 'radial'
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
}
</script>
