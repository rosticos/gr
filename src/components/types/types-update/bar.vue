<script>
  import Bar from '../bar.vue';

  export default {
    name: 'TypesUpdateBar',
    extends: Bar,
    props: {
      graph: Object
    },
    data: () => {
      return {
        submitText: 'Обновить'
      };
    },
    mounted() {
      this.titles = this.graph.values[0].titles;
      this.bars = this.graph.values;
      this.layout = this.graph.layout;
    },
    methods: {
      submit() {
        this.bars = this.bars.map(bar => ({ ...bar, titles: this.titles }));
        this.$emit('update', { values: this.bars, layout: this.layout });
      }
    }
  };
</script>
