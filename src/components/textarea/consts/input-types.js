import TextareaElementInputText from '../textarea-element-input-text.vue';

export const InputTypes = {
  TEXT: 'TEXT'
  // FILE: 'FILE',
  // SELECT: 'SELECT'
};

export const InputTypesDefaults = {
  // [InputTypes.SELECT]: {
  //   title: 'Выпадающий список',
  //   component: TextareaElementInputSelect,
  //   initialData: {
  //     label: 'Выпадающий список',
  //     items: [],
  //     value: null
  //   }
  // },
  [InputTypes.TEXT]: {
    title: 'Поле ввода',
    component: TextareaElementInputText,
    initialData: {
      label: 'Поле ввода',
      value: null
    }
  }
  // [InputTypes.FILE]: {
  //   title: 'Загрузка файла',
  //   component: TextareaElementInputFile,
  //   initialData: {
  //     label: 'Загрузка файла',
  //     value: null
  //   }
  // }
};
