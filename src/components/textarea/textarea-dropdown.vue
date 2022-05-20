<template>
  <div v-bind:class="$style.dropdown">
    <div 
      v-bind:class="$style.option"
      v-on:click="create('header')">
      Заголовок
    </div>
    
    <div 
      v-bind:class="$style.option"
      v-on:click="create('textarea')">
      Текст
    </div>

    <div 
      v-bind:class="$style.option"
      v-on:click="create('graph')">
      График
    </div>
  </div>
</template>

<script>

  export default {
    name: 'TextareaDropdown',
    data() {
      return {
        options: [
          { 
            title: 'Заголовок',
            action: 'header'
          },
          { 
            title: 'Текст',
            action: 'textarea'
          },
          { 
            title: 'График',
            action: 'graph'
          }
        ]
      };
    },
    methods: {
      create(type) {
        this.$emit(`create-${type}`);
      }
    }
  };
</script>

<style module>
  .dropdown {
  }
  .option {
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 30px;
    padding: 10px 10px;
    background: var(--color-white);
    transition: all .3s ease;
    border-top: 1px solid var(--color-light-grey);
    border-bottom: 1px solid var(--color-light-grey);
  }
  .option:hover {
    background: var(--color-light-grey);
  }
  .option:first-of-type {
    border-radius: var(--base-radius) 0 0 var(--base-radius);
    border-left: 1px solid var(--color-light-grey);
  }
  .option:last-of-type {
    border-radius: 0 var(--base-radius) var(--base-radius) 0;
    border-right: 1px solid var(--color-light-grey);
  }
  .option + .option {
    border-left: 1px solid var(--color-light-grey);
  }
</style>
