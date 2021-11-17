<script>
  import TextareaElementInputEditMenuContent from './textarea-element-input-edit-menu-content.vue';
  import { InputModes as InputTypes } from '../consts/input-modes';
  import { TextareaModes as Modes } from '../consts/modes';

  export default {
    name: 'TextareaElementInput',
    components: {
      EditMenuContent: TextareaElementInputEditMenuContent
    },
    props: {
      id: { required: true, type: String },
      mode: { required: true, type: String },
      data: { required: true, type: Object }
    },
    data() {
      return {
        Modes: Modes,

        type: InputTypes.TEXT,
        isActiveFill: false,
        valueCache: null
      };
    },
    computed: {
      isActiveEdit() {
        return this.$store.state.constructorModule.activeTextareaElement?.activeInput?.id === this.id;
      },
      classNames() {
        return {
          'textarea-element-input': true,
          'textarea-element-input_is-open': this.isActiveEdit || this.isActiveFill,
          [`textarea-element-input_mode_${this.mode.toLowerCase()}`]: true,
          [`textarea-element-input-${this.type.toLowerCase()}`]: true
        };
      },
      attributes() {
        return {
          id: this.id,
          class: this.classNames,
          contenteditable: false,
          'data-textarea-element-input': this.type.toLowerCase()
        };
      },
      editMenuAttributes() {
        return {
          value: this.isActiveEdit,
          closeOnClick: false,
          closeOnContentClick: false,
          openOnClick: false,
          contentClass: 'textarea-element-input-edit-menu',
          offsetY: true,
          top: true
        };
      },
      fillMenuAttributes() {
        return {
          closeOnContentClick: false,
          contentClass: 'textarea-element-input-fill-menu',
          offsetY: true
        };
      },
      dataValue: {
        get() {
          return this.data.value;
        },
        set(value) {
          this.$emit('update:data', { ...this.data, value });
        }
      }
    },
    watch: {
      isActiveFill: {
        handler(value) {
          if (value) {
            this.valueCache = this.data.value;
          }
        }
      }
    },
    created() {
      this.onComponentCreated();
    },
    mounted() {
      // Удаляем неиспользуемый HTML элемент, который генерирует компонент VMenu, так как он является блочным и ломает layout контента в редакторе
      const [uselessMenuHTMLElement] = this.$el.getElementsByClassName('v-menu');
      if (uselessMenuHTMLElement) {
        this.$nextTick(() => {
          uselessMenuHTMLElement.remove();
        });
      }

      this.onComponentMounted();
    },
    methods: {
      submitFillMenu() {
        this.isActiveFill = false;
      },
      cancelFillMenu() {
        this.dataValue = this.valueCache;

        this.isActiveFill = false;
      },
      onComponentCreated() {},
      onComponentMounted() {}
    }
  };
</script>

<style>
  .textarea-element-input {
    background-color: #FFFFFF;
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px;
    color: rgba(0, 119, 219, 0.8);
    cursor: default !important;
    font-size: 14px;
    font-weight: normal;
    margin: 0 2px;
    padding: 3px 0;
    position: relative;
    transition: background-color .3s ease-in-out, background-color .3s ease-in-out;
  }
  .textarea-element-input:hover {
    background-color: rgba(0, 119, 219, 0.05);
  }
  .textarea-element-input_is-open {
    background-color: rgba(0, 119, 219, 0.1) !important;
  }
  .textarea-element-input_highlight {
    background-color: rgba(0, 119, 219, 0.1) !important;
    transform: scale(1.1);
    transition: none;
  }
  .textarea-element-input_mode_fill {
    position: static;
  }
  .textarea-element-input__content {
    padding: 3px 6px;
  }
  .textarea-element-input-edit-menu.v-menu__content,
  .textarea-element-input-fill-menu.v-menu__content {
    background-color: #FFFFFF;
    border-radius: 6px !important;
    box-shadow: var(--shadow-card-hover) !important;
    margin-top: -4px !important;
    min-width: unset !important;
  }
  .textarea-element-input-fill-menu.v-menu__content {
    margin-top: 4px !important;
  }
  .textarea-element-input-fill-menu-content {
    display: flex;
    gap: 8px;
    padding: 12px;
  }
  .textarea-element-input-fill-menu-content .v-btn {
    background-color: var(--color-white-smoke);
  }
</style>
