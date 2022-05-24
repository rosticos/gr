<template>
  <label class="checkbox" v-bind:class="classes">
    <input 
      v-model="modelValue"
      type="checkbox"
      class="checkbox__input"
      v-bind:disabled="disabled">

    <div class="checkmark">
      <div v-if="modelValue" class="checkmark-icon" />
      <symbol viewBox="0 0 24 24">
        <g fill="none" fill-rule="evenodd"><path d="M0 0h24v24H0z" /><path d="M17.304 7.282a1 1 0 011.477 1.343l-.085.093-8.25 8a1 1 0 01-1.299.08l-.093-.08-3.75-3.637A1 1 0 016.6 11.564l.095.082 3.054 2.961 7.554-7.325z" fill="currentColor" /></g>
      </symbol>
    </div>

    <div v-if="label">
      <p class="checkbox__label">
        <!-- @slot Текст чекбокса -->
        <slot>{{ label }}</slot>
      </p>
    </div>
  </label>
</template>

<script>
  export default {
    props: { 
      disabled: { type: Boolean, default: false },
      value: { type: Boolean, default: false },
      label: { type: String, default: '' }
    },
    computed: {
      modelValue: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        }
      },
      classes() {
        return [
          {
            'is-checked': this.modelValue,
            'is-disabled': this.disabled
          }
        ];
      }
    }
  };
</script>

<style scoped>
  .checkbox {
    cursor: pointer;
    outline: none;
    vertical-align: top;
    width: 24px;
  }

  .checkbox__label {
    margin-left: 8px;
  }

  .checkbox__input {
    display: none;
  }

  .checkmark:hover, .checkmark {
    border: 1px solid var(--color-light-grey);
    border-radius: 6px;
  }

  .checkmark {
    width: 24px;
    height: 24px;
    margin-right: 12px;
    background-size: 12px 8px;
    transition: all .3s ease;
  }
  
  .checkmark-icon {
    height: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' style='width:24px;height:24px' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z' /%3E%3C/svg%3E");
  }

  .checkbox.is-checked .checkmark {
    border-color: var(--color-red);
    background-color: var(--color-red);
  }
</style>
