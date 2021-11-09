<template>
  <span v-bind="attributes">
    <template v-if="mode === Modes.EDIT">
      <v-menu v-bind="editMenuAttributes">
        <template v-slot:activator="{ on }">
          <span
            class="textarea-element-input__content"
            v-on="on"
            v-text="data.value || data.label" />
        </template>
        <edit-menu-content
          v-on:copy="$emit('copy')"
          v-on:delete="$emit('delete')" />
      </v-menu>
    </template>

    <template v-if="mode === Modes.FILL">
      <v-menu v-model="isActiveFill" v-bind="fillMenuAttributes">
        <template v-slot:activator="{ on }">
          <span
            class="textarea-element-input__content"
            v-on="on"
            v-text="data.value || data.label" />
        </template>
        <div class="textarea-element-input-fill-menu-content">
          <v-text-field
            v-model="dataValue"
            dense
            outlined
            style="min-width: 300px"
            v-bind:placeholder="data.label" />
          <v-btn icon small v-on:click="submitFillMenu">
            <m-icon name="check" size="s" />
          </v-btn>
          <v-btn icon small v-on:click="cancelFillMenu">
            <m-icon name="close" size="s" />
          </v-btn>
        </div>
      </v-menu>
    </template>

    <template v-if="mode === Modes.VIEW">
      {{ data.value || data.label }}
    </template>
  </span>
</template>

<script>
import TextareaElementInputBase from '../textarea/base/textarea-element-input.vue'
import { DocumentPartElementTextareaInputTypes as InputTypes } from '@/document-part-elements/enums/document-part-element-textarea-input-types'

export default {
  name: 'TextareaElementInputText',
  extends: TextareaElementInputBase,
  data () {
    return {
      type: InputTypes.TEXT
    }
  }
}
</script>
