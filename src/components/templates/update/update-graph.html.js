export default `
<div class="card card_column">
  <div>
    <p class="p-title">Редактирование графиков</p>
  </div>

  <div v-for="(graph, index) in graphs" :key="index">
    <div class="card__content">
      <div v-on:click="setExpand(index)">
        <p class="p-title-bold">{{ graph.layout.title }}</p>
      </div>
      <component
        v-if="expanded.includes(index)"
        v-bind:is="getActiveComponent(graph.type)"
        v-bind:graph="graph"
        v-on:update="onUpdate($event, graph.type, index)"
      >
      </component>
    </div>
  </div>
</div>
`