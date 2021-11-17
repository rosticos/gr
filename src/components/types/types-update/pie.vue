<script>
  import Pie from '../pie.vue';

  export default {
    name: 'TypesUpdatePie',
    extends: Pie,
    props: {
      graph: Object
    },
    data: () => {
      return {
        submitText: 'Обновить'
      };
    },
    mounted() {
      this.pies = this.graph.values;
      this.layout = this.graph.layout;
    },
    methods: {
      submit() {
        this.$emit('update', { values: this.pies, layout: this.layout });
      }
    }
  };
</script>
