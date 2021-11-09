<script>
import Pie from '../pie.vue'

export default {
  name: 'TypesUpdatePie',
  extends: Pie,
  data: () => {
    return {
      submitText: 'Обновить'
    }
  },
  props: {
    graph: Object
  },
  methods: {
    submit () {
      this.$emit('update', { values: this.pies, layout: this.layout })
    }
  },
  mounted () {
    this.pies = this.graph.values
    this.layout = this.graph.layout
  }
}
</script>
