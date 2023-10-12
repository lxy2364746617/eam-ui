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
const delFileList = (array1, array2) => {
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
    let nameToCheck =
      array1[i].deviceName + array1[i].sModel + array1[i].deviceCode;
    let existsInArray2 = array2.some(
      (obj) => obj.deviceName + obj.sModel + obj.deviceCode === nameToCheck
    );

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
const upName2 = (array1, array2) => {
  let indicesToRemove = [];

  for (let i = 0; i < array1.length; i++) {
    let nameToCheck = array1[i].deviceName + array1[i].sModel;
    let existsInArray2 = array2.some(
      (obj) => obj.deviceName + obj.sModel === nameToCheck
    );

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
const formatDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp); // 创建日期对象

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export {
  setStore,
  getStore,
  removeStore,
  delList,
  upName,
  convertToTargetFormat,
  delFileList,
  formatDateFromTimestamp,
  upName2,
};
