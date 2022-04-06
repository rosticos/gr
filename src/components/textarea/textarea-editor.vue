<template>
  <div class="textarea-element-edit textarea-element-edit_mode_edit">
    <div 
      v-bind:id="editorId"
      v-bind:class="{ 'textarea-element-edit__editor_header': header }"
      class="textarea-element-edit__editor" />
  </div>
</template>

<script>
  import tinymce from 'tinymce';

  /* Default icons are required for TinyMCE 5.3 or above */
  import 'tinymce/icons/default';

  /* A theme is also required */
  import 'tinymce/themes/silver';

  /* Import the skin */
  import 'tinymce/skins/ui/oxide/skin.css';
  import 'tinymce/skins/ui/oxide/content.min.css';

  /* Import plugins */

  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/image';
  import 'tinymce/plugins/imagetools';
  import 'tinymce/plugins/quickbars';
  import 'tinymce/plugins/paste';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/table';

  import '@wiris/mathtype-tinymce5';

  import { TextareaModes as Modes } from './consts/modes';
  import createEditorConfig from './helpers/create-editor-config';


  export default {
    components: {
    // Textarea
    // TextareaElementEdit,
    // TextareaElementFill
    },
    props: {
      id: { required: true, type: String },
      value: { default: '', type: String },
      mode: { default: Modes.EDIT, type: String },
      header: { default: false, type: Boolean }
    },
    data() {
      return {
        Modes: Modes,
        isEditorInitialized: false,

        isFocused: false,
        editor: null,
        editorId: null,
        tinymceIsDirty: false
      };
    },
    computed: {
      placeholder() {
        return this.header ? 'Введите заголовок' : 'Напишите здесь необходимую информацию';
      },
      syncValue: {
        set(value) {
          this.$emit('update:value', value);
        },
        get() {
          return this.value;
        }
      },
      classNames() {
        return {
          [this.rootElementClassName]: true,
          [`textarea-element-edit_mode_${this.mode.toLowerCase()}`]: true,
          'is-dirty': this.tinymceIsDirty
        };
      }
    },
    async mounted() {
      await this.setupEditor();
    },
    created() {
      this.editorId = 'editor-' + this.id;
    },
    methods: {
      async setupEditor() {
        const [ editor ] = await tinymce.init(createEditorConfig(this, tinymce));

        this.editor = editor;
      },
      focus() {
        if (this.mode === Modes.EDIT) {
          this.elementEdit.focusEditor();
        }
      },
      onEditorInput() {
        this.tinymceIsDirty = !!this.editor && !!this.editor.getContent();
      },
      async updateTemplate() {
        if (!this.editor) {
          return;
        }

        // Необходим перерендеринг, для того, чтобы tinymce выполнил встроенные алгоритмы и отдал корректный шаблон
        await this.$nextTick();

        const content = this.editor.getContent();

        this.syncValue = content;
      }
    }
  };
</script>

<style>
  .textarea-element-edit {}
  .textarea-element-edit_mode_create::before,
  .textarea-element-edit_mode_edit::before {
    color: var(--color-grey-chateau);
    content: attr(placeholder);
    position: absolute;
  }
  .textarea-element-edit.is-dirty::before {
    display: none;
  }
  .textarea-element-edit__editor:focus {
    box-shadow: none !important;
  }
  .textarea-element-edit__editor {
    font-size: 14px !important;
    line-height: 24px;
  }
  .textarea-element-edit__editor_header {
    font-size: 17px !important;
    font-weight: 700 !important;
    line-height: 24px;
  }
  .mce-content-body div.mce-resizehandle {
    z-index: 99 !important; /* Fix 10000 z-index */
  }
  .textarea-element-edit .mce-offscreen-selection {
    display: none !important;
    visibility: hidden !important;
  }
</style>
