<script>
import Bar from '../bar.vue'

export default {
  name: 'TypesCreateBar',
  extends: Bar,
  data: () => {
    return {
      submitText: 'Создать'
    }
  }
}
</script>
