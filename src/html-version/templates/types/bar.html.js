export default `
  <div>
    <hr>
    <div class="card card_column">
      <div class="card__content d-flex">
        <p class="p-input__label">Название:</p>
        <input type="text" class="ml-2 input-block" v-model="layout.title">
      </div>
    </div>
    <hr>

    <div class="card__content">
      <div class="btn btn_outline ml-2" v-on:click="addItem">
        <div class="p-icon p-icon-add"></div>
        Добавить столбец
      </div>
      <div v-for="(_, titleIndex) in titles" :key="titleIndex">
        <div class="d-flex mt-2">
          <p class="p-input__label">Столбец:</p>
          <input type="text" class="input-block ml-2" v-model="titles[titleIndex]">

          <div class="btn btn_outline ml-2" v-on:click="removeBarTitle(titleIndex)">
            <div class="p-icon p-icon-close"></div>
          </div>
        </div> 
      </div>
    </div>

    <hr>

    <div class="card card_column card_background-light-grey" v-for="(bar, index) in bars">
      <div class="card__content">
        <div class="d-flex">
          <p class="p-title-bold">Столбец {{ index + 1 }}</p>
          <div class="btn btn_outline ml-auto" v-on:click="removeBar(index)">
            <div class="p-icon p-icon-close"></div>
          </div>
        </div>
        <div v-for="counter in bar.counter" :key="counter" class="mt-2">
          <div class="d-flex mr-2">
            <p class="p-input__label">{{ titles[counter - 1] }}:</p>
            <input type="text" class="ml-2 input-block" v-model="bar.values[counter - 1]">
          </div> 
        </div>
      </div>
      <hr>
    </div>

    <div class="card__content card__actions">
      <div class="btn btn_outline" v-on:click="addBar">
        <div class="p-icon p-icon-add"></div>
        Добавить график
      </div>

      <div class="btn btn_primary ml-auto" v-on:click="submit" v-if="layout.title !== ''">
        {{ submitText }}
      </div>
    </div>
  </div>
`;
