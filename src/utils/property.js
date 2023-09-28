const LOCAL = "local";
/**
 * 存储localStorage
 */
const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  if (LOCAL === "local") {
    window.localStorage.setItem(name, content);
  } else {
    window.sessionStorage.setItem(name, content);
  }
};

/**
 * 获取localStorage
 */
const getStore = (name) => {
  if (!name) return;
  if (LOCAL === "local") {
    return JSON.parse(window.localStorage.getItem(name) || "[]");
  } else {
    return JSON.parse(window.sessionStorage.getItem(name) || "[]");
  }
};

/**
 * 删除localStorage
 */
const removeStore = (name) => {
  if (!name) return;
  if (LOCAL === "local") {
    window.localStorage.removeItem(name);
  } else {
    window.sessionStorage.removeItem(name);
  }
};
const delList = (array1, array2) => {
  let indicesToRemove = [];

  for (let i = 0; i < array1.length; i++) {
    let idToCheck = array1[i].id;

    let existsInArray2 = array2.some((obj) => obj.id === idToCheck);

    if (existsInArray2) {
      indicesToRemove.push(i);
    }
  }

  for (let i = indicesToRemove.length - 1; i >= 0; i--) {
    array1.splice(indicesToRemove[i], 1);
  }
  return array1;
};
const upName = (array1, array2) => {
  let indicesToRemove = [];

  for (let i = 0; i < array1.length; i++) {
    let nameToCheck = array1[i].demandDate;
    let existsInArray2 = array2.some((obj) => obj.demandDate === nameToCheck);

    if (existsInArray2) {
      indicesToRemove.push(i);
    }
  }

  for (let i = indicesToRemove.length - 1; i >= 0; i--) {
    array1.splice(indicesToRemove[i], 1);
  }

  array1 = array1.concat(array2);
  return array1;
};
// 递归函数，将原始数据转换为目标格式
const convertToTargetFormat = (data) => {
  return data.map((item) => ({
    value: item.id,
    label: item.label,
    children: item.children ? convertToTargetFormat(item.children) : undefined,
  }));
};
/**
 * 导出
 **/
export {
  setStore,
  getStore,
  removeStore,
  delList,
  upName,
  convertToTargetFormat,
};
