<template>
  <div>
    <textarea-editor v-bind:data="{}"/>
  </div>
</template>

<script>
import TextareaEditor from '../components/textarea/textarea-editor.vue'

export default {
  name: 'Textarea',
  components: {
    TextareaEditor
  }
}
</script>

<style>

</style>
