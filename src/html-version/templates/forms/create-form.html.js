export default `
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
  `;
