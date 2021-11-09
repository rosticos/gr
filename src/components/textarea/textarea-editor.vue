<template>
  <div class="textarea-element">
    <template v-if="mode === Modes.EDIT || mode === Modes.CREATE">
      <div class="constructor-header-toolbar">
        <div class="constructor-header-toolbar__tinymce-toolbar" />
      </div>
      <div class="container">
        <div id="kek"></div>
      </div>
    </template>
    <template v-else-if="mode === Modes.FILL">
      <div></div>
    </template>
    <template v-else-if="mode === Modes.VIEW">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="textarea-element__view" v-html="data.template" />
    </template>
  </div>
</template>

<script>
import tinymce from 'tinymce'

/* Default icons are required for TinyMCE 5.3 or above */
import 'tinymce/icons/default'

/* A theme is also required */
import 'tinymce/themes/silver'

/* Import the skin */
import 'tinymce/skins/ui/oxide/skin.css'

/* Import plugins */
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/code'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/table'

import '@wiris/mathtype-tinymce5'

import { TextareaModes as Modes } from './consts/modes'

export default {
  components: {
    // Textarea
    // TextareaElementEdit,
    // TextareaElementFill
  },
  props: {
    // id: { required: true, type: String },
    // documentPartId: { required: true, type: String },
    value: { default: '', type: String },
    mode: { default: Modes.EDIT, type: String }
  },
  computed: {
    syncValue: {
      set (value) {
        this.$emit('value:update', value)
      },
      get () {
        return this.value
      }
    }
  },
  data () {
    return {
      Modes: Modes,
      isEditorInitialized: false,

      isFocused: false,
      editor: null,
      placeholder: 'Напишите здесь необходимую информацию'
    }
  },
  methods: {
    async setupEditor () {
      const [editor] = await tinymce.init({
        base_url: '/tinymce',
        selector: '#kek',
        height: 500,
        icons_url: '/tinymce/icons/editor-icons/index.js',
        icons: 'editor-icons',
        placeholder: 'Ask a question or post an update...',
        inline: true,
        contextmenu: false,
        menubar: false,
        language: 'ru',
        table_resize_bars: false,
        keep_styles: false,
        quickbars_insert_toolbar: false,
        quickbars_selection_toolbar: 'bold italic underline',
        plugins: 'placeholder code link lists table tiny_mce_wiris',
        toolbar: 'undo redo | formatselect | ' +
  ' bold italic backcolor | alignleft aligncenter ' +
  ' alignright alignjustify | bullist numlist outdent indent |' +
  ' removeformat | tiny_mce_wiris_formulaEditor'

      })

      this.editor = editor

      setTimeout(() => {
        this.isEditorInitialized = true
      })
    },
    focus () {
      if (this.mode === Modes.EDIT) {
        this.elementEdit.focusEditor()
      }
    },
    updateTemplate (template) {
      // this.data.template = normalizeTemplate(template ?? this.data.template, this.data.inputsData)
    }
  },
  watch: {
    'data.inputsData': {
      deep: true,
      handler () {
        this.updateTemplate()
      }
    }
  },
  mounted () {
    this.setupEditor()
  }
}
</script>

<style>
  @import './assets/styles/editor.css';

  #kek {
    background-color: transparent;
    padding: 28px 64px;
    position: relative;
  }

  .constructor-header-toolbar {
    background-color: #fff;
    box-shadow: inset 0 -1px 0 0 var(--color-link-water) !important;
    display: flex;
    height: 44px;
    padding: 6px 24px;
    width: 100%;
  }
  .constructor-header-toolbar__structure {
    margin-right: 8px;
  }
  .constructor-header-toolbar__tinymce-toolbar {}

  .textarea-element {
    font-family: Arial, sans-serif !important;
    font-size: 14px !important;
    line-height: 24px !important;
    margin-bottom: -8px; /* Сдвигаем margin-bottom, так основные элементы внутри textarea-element (paragraphs, lists, tables) имеют margin-bottom: 8px */
  }
  .textarea-element a {
    color: var(--color-link) !important;
  }
  .textarea-element a:hover {
    color: var(--color-link-hover) !important;
  }
  .textarea-element a:active {
    color: var(--color-link-active) !important;
  }
  .textarea-element p, .textarea-element ol, .textarea-element table {
    margin-bottom: 8px !important;
  }
  .textarea-element__view .textarea-element-input {
    background-color: var(--color-white-smoke) !important;
    box-shadow: inset 0 0 0 1px var(--color-link-water) !important;
    color: var(--color-text-tertiary) !important;
    cursor: auto !important;
    padding-left: 6px !important;
    padding-right: 6px !important;
    user-select: auto;
    white-space: normal;
  }
  .textarea-element table {
    border: 1px solid var(--color-grey-heather) !important;
    border-collapse: collapse;
  }
  .textarea-element tr, .textarea-element td {
    border: 1px solid var(--color-grey-heather) !important;
  }
  .textarea-element td {
    padding: 5px 8px;
  }
</style>
