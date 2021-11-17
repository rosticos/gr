<template>
  <nav class="nav">
    <div class="nav__btn" v-on:click="create('graph')">
      График
    </div>

    <div class="nav__btn" v-on:click="create('text')">
      Текст
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'FormHeader',
    methods: {
      create(type) {
        this.$emit(`create-${type}`);
      }
    }
  };
</script>

<style>
  .nav {
    border-bottom: 1px solid var(--color-light-grey);
    display: flex;
    margin-bottom: 24px;
  }

  .nav__btn {
    padding: 20px;
    transition: all .3s ease;
    cursor: pointer;
    text-align: center;
  }

  .nav__btn + .nav__btn {
    border-left: 1px solid var(--color-light-grey);
  }

  .nav__btn:last-of-type {
    border-right: 1px solid var(--color-light-grey);
  }

  .nav__btn_close:hover,
  .nav__btn_close:active {
    background: var(--color-light-grey);
  }

  .nav__btn:hover {
    background: var(--color-grey);
  }

  .nav__btn_active {
    background: var(--color-light-grey);
  }
</style>
