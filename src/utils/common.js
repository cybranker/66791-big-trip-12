const addZerosNumber = (number, needLength = 2) => {
  number = String(number);

  while (number.length < needLength) {
    number = `0${number}`;
  }

  return number;
};

export {addZerosNumber};
