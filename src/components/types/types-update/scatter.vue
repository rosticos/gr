<script>
import Scatter from '../scatter.vue'

export default {
  name: 'TypesUpdateScatter',
  extends: Scatter,
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
      this.$emit('update', { values: this.lines, layout: this.layout })
    }
  },
  mounted () {
    this.lines = this.graph.values
    this.layout = this.graph.layout
  }
}
</script>
