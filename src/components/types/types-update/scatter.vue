<script>
  import Scatter from '../scatter.vue';

  export default {
    name: 'TypesUpdateScatter',
    extends: Scatter,
    props: {
      graph: { type: Object, default: () => ({}) }
    },
    data: () => {
      return {
        submitText: 'Обновить'
      };
    },
    mounted() {
      this.lines = this.graph.values;
      this.layout = this.graph.layout;
    },
    methods: {
      submit() {
        this.$emit('update', { values: this.lines, layout: this.layout });
      }
    }
  };
</script>
