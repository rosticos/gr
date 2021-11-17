<template>
  <div class="card card_column">
    <div v-for="(graph, index) in graphs" v-bind:key="index">
      <hr />
      <div>
        <div
          class="card__content card__content_active d-flex"
          v-on:click="setExpand(index)"
        >
          <p style="cursor: pointer" class="p-title-bold">
            {{ graph.layout.title }}
          </p>
          <div
            class="ml-auto p-icon p-icon-chevron-right"
            v-bind:class="{ section__btn_close_rotate: isExpanded(index) }"
          />
        </div>

        <component
          v-bind:is="getActiveComponent(graph.type)"
          v-if="expanded.includes(index)"
          v-bind:graph="graph"
          v-on:update="onUpdate($event, graph.type, index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UpdateScatter from "../types/types-update/scatter.vue";
import UpdatePie from "../types/types-update/pie.vue";
import UpdateBar from "../types/types-update/bar.vue";

export default {
  name: "UpdateForm",
  components: {
    UpdateScatter,
    UpdatePie,
    UpdateBar,
  },
  props: {
    graphs: { type: Array, default: () => [] },
    type: { type: String, default: "" },
    expandItem: {
      type: [Number, Object],
      default: null,
    },
  },
  data: () => {
    return {
      expanded: [],
    };
  },
  watch: {
    expandItem: {
      immediate: true,
      handler(value) {
        if (value != null) {
          this.setExpand(value, true);
        }
      },
    },
  },
  methods: {
    setExpand(index, isDirect = false) {
      if (this.expanded.includes(index) && !isDirect) {
        this.expanded = this.expanded.filter((expand) => expand !== index);
      } else {
        this.expanded.push(index);
      }
    },
    isExpanded(index) {
      return this.expanded.includes(index);
    },
    getActiveComponent(type) {
      let component = "";

      switch (type) {
        case "scatter":
          component = "update-scatter";
          break;

        case "bar":
          component = "update-bar";
          break;

        case "pie":
          component = "update-pie";
          break;

        default:
          break;
      }

      return component;
    },
    onUpdate({ values, layout }, type, index) {
      this.$emit("update", { values, layout, type, index });
    },
    addLine() {
      //
    },
  },
};
</script>
