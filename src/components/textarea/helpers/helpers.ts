import { v4 as uuid } from 'uuid';
import { InputTypesDefaults } from '../consts/input-types';

export const createTextareaElementInputNode = (type) => {
  const id = `textarea-element-input-${uuid()}`;
  const label = InputTypesDefaults[type].initialData.label;

  const element = document.createElement('span');
  element.id = id;
  element.classList.add('textarea-element-input');
  element.classList.add(`textarea-element-input-${type.toLowerCase()}`);
  element.setAttribute('data-textarea-element-input', type.toLowerCase());
  element.innerText = label;

  return element;
};
