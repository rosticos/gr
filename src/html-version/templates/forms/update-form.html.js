export default `
<div class="card card_column">
  <div v-for="(graph, index) in graphs" :key="index">
    <hr>  
    <div>
      <div v-on:click="setExpand(index)" class="card__content card__content_active d-flex">
        <p style="cursor: pointer;" class="p-title-bold">{{ graph.layout.title }}</p>
        <div class="ml-auto p-icon p-icon-chevron-right" :class="{ 'section__btn_close_rotate': isExpanded(index) }"></div>
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