<template>
  <nav class="nav">
    <div class="nav__btn" v-on:click="toggleNavigation">
      <div class="p-icon p-icon-contents" />
    </div>

    <div class="nav__btn" v-on:click="exportPdf">
      PDF
    </div>

    <div class="nav__btn" v-on:click="$emit('download')">
      Сохранить
    </div>

    <div class="nav__btn" v-on:click="$refs.jsonImporter.click()">
      Импорт
    </div>

    <input ref="jsonImporter" type="file" style="display: none;" enctype="multipart/form-data" v-on:change="readFile($event)">
  </nav>
</template>

<script>
  export default {
    name: 'FormHeader',
    methods: {
      toggleNavigation() {
        this.$emit('toggle-navigation');
      },
      exportPdf() {
        this.$emit('export-pdf');
      },
      create(type) {
        this.$emit(`create-${type}`);
      },
      readFile(event) {
        const files = event.target.files;
        const file = files[0];           
        const reader = new FileReader();

        reader.onload = (event) => {
          this.$emit('import', event.target.result);
        };

        reader.readAsText(file);
      }
    }
  };
</script>

<style>
  .nav {
    display: flex;
    height: 37px;
  }

  .nav__btn {
    display: flex;
    align-items: center;
    padding: 0 20px;
    transition: background .3s ease;
    cursor: pointer;
    height: 38px;
  }

  .nav__btn + .nav__btn {}

  .nav__btn_close:hover,
  .nav__btn_close:active {
    background: var(--color-light-grey);
  }

  .nav__btn:hover {
    background: var(--color-white-smoke);
  }

  .nav__btn_active {
    background: var(--color-light-grey);
  }
</style>
