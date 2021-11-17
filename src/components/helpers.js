export const clone = (object) => JSON.parse(JSON.stringify(object));

export const hasClass = (target, className, recursiveCheckForParents = false) => {
  // Если не указан recursiveCheckForParents, то проверяем только для текущего элемента
  if (!recursiveCheckForParents) {
    return 'classList' in target && target.classList && target.classList.contains(className);
  }

  // Если указан recursiveCheckForParents, то сначала проверяем class на самом элементе
  if ('classList' in target && target.classList?.contains(className)) {
    return true;
  }

  // Если у элемента нет parentNode, то возвращаем false
  if (!target.parentNode) {
    return false;
  }

  // Рекурсивно проверяем для всех parentNode
  const checkForParent = (node) => {
    if ('classList' in node && node.classList && node.classList.contains(className)) {
      return true;
    }
    if (node.parentNode) {
      return checkForParent(node.parentNode);
    }

    return false;
  };

  return checkForParent(target.parentNode);
};
