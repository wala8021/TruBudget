function d2h(d) {
  return d.toString(16);
}

function h2d(h) {
  return parseInt(h, 16);
}

export const stringToHex = (string = "") => {
  let str = "";
  let i = 0;
  const tmpLen = string.length;
  let c;

  for (; i < tmpLen; i += 1) {
    c = string.charCodeAt(i);
    str += d2h(c);
  }
  return str;
};

export const hexToString = hex => {
  const hexArray = hex.match(/.{2}/g);
  let str = "";
  let i = 0;
  const tmpLen = hexArray.length;
  let c;

  for (; i < tmpLen; i += 1) {
    c = String.fromCharCode(h2d(hexArray[i]));
    str += c;
  }

  return str;
};

export const objectToHex = object => {
  const cleansedString = removeInvisibleChars(JSON.stringify(object));
  return stringToHex(cleansedString);
};

// const removeControlCharacter = json => json.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

const removeInvisibleChars = (x: string): string => x.replace(/[^\P{C}]/gu, "");

/*
 * Parse hex string, throws if not parseable.
 */
export const hexToObject = hex => {
  const cleansedString = removeInvisibleChars(hexToString(hex));
  return JSON.parse(cleansedString);
};
