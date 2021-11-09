import { InputTypes } from '../consts/input-types'
import { TEXTAREA_ELEMENT_INPUT_DATA_ATTRIBUTE_NAME as INPUT_DATA_ATTRIBUTE_NAME } from '../consts/textarea-element-input-name'

const isInputType = (inputDataItem, inputType) => inputDataItem.inputType === inputType

/**
 * Функция заменяет шаблоны компонентов инпутов на текстовые значения
 * */
export default function normalizeTemplate (template, inputsData) {
  const wrapperElement = document.createElement('div')
  wrapperElement.innerHTML = template

  const inputElements = wrapperElement.querySelectorAll(`[${INPUT_DATA_ATTRIBUTE_NAME}]`)
  inputElements.forEach(inputElement => {
    const inputDataItem = inputsData.find(inputDataItem => inputDataItem.id === inputElement.id)

    if (!inputDataItem) {
      return
    }

    let inputElementHTML = ''

    if (isInputType(inputDataItem, InputTypes.TEXT)) {
      inputElementHTML = inputDataItem.inputData.value ?? inputDataItem.inputData.label
    }

    if (isInputType(inputDataItem, InputTypes.FILE)) {
      if (inputDataItem.inputData.value) {
        inputElementHTML = `<a href="${inputDataItem.inputData.value}" target="_blank">${decodeURI(inputDataItem.inputData.value.substring(inputDataItem.inputData.value.lastIndexOf('/') + 1))}</a>`
      } else {
        inputElementHTML = inputDataItem.inputData.label
      }
    }

    if (isInputType(inputDataItem, InputTypes.SELECT)) {
      inputElementHTML = inputDataItem.inputData.value
        ? inputDataItem.inputData.items.find(item => item.id === inputDataItem.inputData.value).text
        : inputDataItem.inputData.label
    }

    inputElement.innerHTML = inputElementHTML

    // Сбрасываем class list до стандартных
    const inputElementType = inputElement.dataset.textareaElementInput
    inputElement.className = `textarea-element-input textarea-element-input-${inputElementType}`
  })

  return wrapperElement.innerHTML
}
