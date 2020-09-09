const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getArrayRandomLength = (arr, len) => {
  const newArr = [];
  let value;

  for (let i = 0; i <= len; i++) {
    value = arr[getRandomInteger(0, arr.length - 1)];

    newArr.push(value);
    arr = arr.filter((it) => it !== value);
  }

  return newArr;
};

const addZerosNumber = (number, needLength = 2) => {
  number = String(number);

  while (number.length < needLength) {
    number = `0${number}`;
  }

  return number;
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export {
  getRandomInteger,
  getArrayRandomLength,
  addZerosNumber,
  updateItem
};
