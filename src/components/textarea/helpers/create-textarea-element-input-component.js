import { InputTypesDefaults } from '../consts/input-types';

const clone = (object) => JSON.parse(JSON.stringify(object));

export default function createTextareaElementInputComponent({
  id,
  mode,
  inputType,
  inputData,
  onInputUpdateDataCallback,
  eventListeners,
  provide
}) {
  const componentOptions = {
    propsData: { id, data: clone(inputData), mode }
  };

  if (provide) {
    componentOptions.provide = provide;
  }

  // eslint-disable-next-line
  const component = new InputTypesDefaults[inputType].component(componentOptions)
  component.$on('update:data', (inputData) => {
    onInputUpdateDataCallback({ id, inputType, inputData });
  });

  if (eventListeners) {
    Object.entries(eventListeners).forEach(([eventName, eventCallback]) => {
      component.$on(eventName, eventCallback);
    });
  }

  component.$mount(`#${id}`);

  return component;
}
