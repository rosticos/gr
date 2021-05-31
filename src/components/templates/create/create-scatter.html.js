export default `<div>
  <div class="card__content" v-for="(line, index) in lines" :key="index">
    <div class="d-flex">
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

    <div v-if="line.declareType === 'byFunction'" class="mt-2">
      <div class="mt-2">
        <p class="p-input__label">Название линии</p>
        <input type="text" class="input-block" v-model="line.name">
      </div>

      <div class="mt-2">
        <p class="p-input__label">Функция (y=cos(x), y=sin(x) ...)</p>
        <input type="text" class="input-block" v-model="line.value">
      </div>

      <div class="mt-2 card__content">
        <div class="d-flex">
          <p class="p-title">Константы</p>
          <div class="btn btn_outline ml-auto" v-on:click="addConst(index)">
            <div class="p-icon p-icon-add"></div>
          </div>
        </div>
        
        <div class="mt-2">
          <div v-for="(cons, consIndex) in line.constsArray" :key="consIndex">
            <div class="card__content d-flex">
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

  <div class="card__content">
    <p class="p-title">Настроить график</p>
    
    <div class="mt-2 card__content">
      <p class="p-input__label">Название графика</p>
      <input type="text" class="input-block" v-model="layout.title">
    </div>

    <div class="d-flex mt-2">
      <div>
        <p class="p-input__label">Горизонталь</p>
        <input type="text" class="input-block" v-model="layout.xaxis.title">
      </div>

      <div>
        <p class="p-input__label">Вертикаль</p>
        <input type="text" class="input-block ml-2" v-model="layout.yaxis.title">
      </div>
    </div>
  </div>

  <div class="card__actions">
    <div class="btn btn_outline" v-on:click="addLine">
      <div class="p-icon p-icon-add mr-2"></div>
      Добавить график
    </div>

    <div class="btn btn_primary ml-auto" v-on:click="onCreate" v-if="layout.title !== ''">
      Создать
    </div>
  </div>
</div>`
