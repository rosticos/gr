export default `
    <div>
      <div class="mt-2">
        <p class="p-input__label">Название:</p>
        <input type="text" class="input-block ml-2" v-model="layout.title">
      </div>

      <div class="card card_column card_background-light-grey" v-for="(pie, index) in pies">
      
        <div class="card">
          <div class="btn btn_outline ml-2" v-on:click="addItem(index)">
            Добавить поле
          </div>

          <div class="btn btn_outline ml-auto" v-on:click="removeItem(index)">
              <div class="p-icon p-icon-close"></div>
            </div>
        </div>

        <div>
          <div v-for="counter in pie.counter" :key="counter" class="d-flex mt-4">
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

      <div class="card__actions">
        <div class="btn btn_outline" v-on:click="addPie">
          <div class="p-icon p-icon-add"></div>
          Добавить
        </div>

        <div class="btn btn_primary ml-auto" v-on:click="createGraph" v-if="layout.title !== ''">
          Создать
        </div>
      </div>
    </div>
`