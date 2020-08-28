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

export {
  getRandomInteger,
  getArrayRandomLength
};
