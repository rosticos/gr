<template>
  <div>
    <div class="card card_column">
      <div class="card__content">
        <div class="d-flex align-center">
          <gr-checkbox v-if="showInEditMode" v-model="layout.disabled" />
          <p class="p-input__label ml-2">Название:</p>
          <input v-model="layout.title" v-bind:disabled="isDisabled(layout.disabled)" type="text" class="ml-2 input-block">
        </div>
      </div>
    </div>
    <hr>

    <div class="card__content">
      <div v-if="showInEditMode" class="btn btn_outline ml-2" v-on:click="addItem">
        <div class="p-icon p-icon-add" />
        Добавить столбец
      </div>

      <div v-for="(_, titleIndex) in titles" v-bind:key="titleIndex">
        <div class="d-flex align-center mt-2">
          <p class="p-input__label">Столбец:</p>
          
          <input v-model="titles[titleIndex]" v-bind:disabled="isDisabled(true)" type="text" class="input-block ml-2">

          <div v-if="showInEditMode" class="btn btn_outline ml-2" v-on:click="removeBarTitle(titleIndex)">
            <div class="p-icon p-icon-close" />
          </div>
        </div>
      </div>
    </div>

    <hr>

    <div v-for="(bar, index) in bars" v-bind:key="`bar-${index}`" class="card card_column card_background-light-grey">
      <div class="card__content">
        <div class="d-flex align-center">
          <p class="p-title-bold">Столбец {{ index + 1 }}</p>
          <div v-if="showInEditMode" class="btn btn_outline ml-auto" v-on:click="removeBar(index)">
            <div class="p-icon p-icon-close" />
          </div>
        </div>

        <div v-if="showInEditMode" class="d-flex align-center">
          <gr-checkbox v-model="bar.disabled" />
          <p class="p-input__label ml-2 my-0">Заблокировать изменения блока "Столбец {{ index + 1 }}"</p>
        </div>

        <div v-for="counter in bar.counter" v-bind:key="counter" class="mt-2">
          <div class="d-flex align-center mr-2">
            <p class="p-input__label">{{ titles[counter - 1] }}:</p>
            <input v-model="bar.values[counter - 1]" v-bind:disabled="isDisabled(bar.disabled)" type="text" class="ml-2 input-block">
          </div>
        </div>
      </div>
      <hr>
    </div>

    <div class="card__content card__actions">
      <div v-if="showInEditMode" class="btn btn_outline" v-on:click="addBar">
        <div class="p-icon p-icon-add" />
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
    name: 'Bar',
    data: () => {
      return {
        submitText: 'Создать',
        layout: {
          title: 'Столбцы',
          disabled: false
        },
        titles: ['Столбец'],
        bars: [
          {
            counter: 1,
            type: 'bar',
            name: '',
            disabled: false,
            values: []
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
      setDefault() {
        this.bars = [
          {
            counter: 1,
            type: 'bar',
            name: '',
            disabled: false,
            values: []
          }
        ];
      },
      removeBarTitle(index) {
        this.titles.splice(index, 1);
        this.bars.forEach(bar => {
          bar.values.splice(index, 1);
          bar.counter -= 1;
        });
      },
      removeBar(index) {
        this.bars.splice(index, 1);
      },
      addItem() {
        this.titles.push('');
        this.bars.forEach(bar => {
          bar.values = [...bar.values, 0];
          bar.counter += 1;
        });
      },
      addBar() {
        this.bars.push({
          counter: this.titles.length,
          type: 'bar',
          name: '',
          disabled: false,
          values: []
        });
      },
      submit() {
        this.bars = this.bars.map(bar => ({ ...bar, titles: this.titles }));
        this.$emit('create', { values: this.bars, layout: this.layout });

        this.setDefault();
      }
    }
  };
</script>
