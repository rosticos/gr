<script>
import Bar from '../bar.vue'

export default {
  name: 'TypesUpdateBar',
  extends: Bar,
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
      this.bars = this.bars.map(bar => ({ ...bar, titles: this.titles }))
      this.$emit('update', { values: this.bars, layout: this.layout })
    }
  },
  mounted () {
    this.titles = this.graph.values[0].titles
    this.bars = this.graph.values
    this.layout = this.graph.layout
  }
}
</script>
