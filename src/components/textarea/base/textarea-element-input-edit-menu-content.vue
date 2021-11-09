<template>
  <div class="textarea-element-input-edit-menu-content" v-on:mousedown="onMousedown">
    <v-btn class="mr-1" icon x-small v-on:click="$emit('copy')">
      <m-icon name="copy" size="s" />
    </v-btn>
    <v-btn icon x-small v-on:click="$emit('delete')">
      <m-icon name="trash" size="s" />
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'TextareaElementInputEditMenuContent',
  metgods: {
    onMousedown (event) {
      /* Чтобы не терять фокус на редакторе */
      event.preventDefault()
    }
  }
}
</script>

<style>
  .textarea-element-input-edit-menu-content {
    display: flex;
    padding: 4px;
  }
</style>
