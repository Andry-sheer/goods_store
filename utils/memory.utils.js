export const ramSizeConverter = {
  toFormat : {
    MB : (value) => Number(value),
    GB : (value) => value * 1024,
    TB : (value) => value * 1048576
  }
};

export const ramValidate = (value, unit = 'MB') => {
  let ramValue;

  switch (unit) {
    case 'MB':
      ramValue = value;
      break;
    case 'GB':
      ramValue = ramSizeConverter.toFormat.GB(value);
      break;
    case 'TB':
      ramValue = ramSizeConverter.toFormat.TB(value);
      break;
    default : throw new Error('Unit must be either MB, GB or TB');
  }

  if (ramValue < 1 || ramValue > 196608) {
    return {
      isValid : false,
      message : "RAM must be between 1 MB and 192 GB"
    }
  }

  return { isValid : true, value : ramValue };
}

export const memoryValidate = (value, unit = 'MB') => {
  let memoryValue;

  switch (unit) {
    case "MB":
      memoryValue = value;
      break;
    case "GB":
      memoryValue = ramSizeConverter.toFormat.GB(value);
      break;
    case "TB":
      memoryValue = ramSizeConverter.toFormat.TB(value);
      break;
    default: throw new Error('Unit must be either MB, GB or TB');
  }


  if (memoryValue < 1 || memoryValue > 67108864) {
    return {
      isValid : false,
      message : "Memory must be between 1 MB and 64 TB"
    }
  }

  return { isValid : true, value : memoryValue }
}



export const formatSize = (value) => ({
  MB : `${value} MB`,
  GB : `${(value / 1024).toFixed(2)} GB`,
  TB : `${(value / 1048576).toFixed(2)} TB`
});