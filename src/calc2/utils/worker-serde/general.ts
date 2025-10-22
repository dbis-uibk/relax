'use strict';

function notObject(target:any): boolean {
  return target === null || typeof target !== 'object';
}

function getValueFromToStringResult(result:string) {
  switch (result) {
    case 'Infinity':
      return Infinity;
    case '-Infinity':
      return -Infinity;
    case 'NaN':
      return NaN;
    default:
      return null;
  }
}

function isSupportedBuiltinClass(target: any): boolean {
  return [Date].indexOf(target) >= 0;
}

function isClass(target:any): boolean {
  if (isSupportedBuiltinClass(target)) {
    return true;
  }

  // Adopt solution from https://stackoverflow.com/a/46759625/707451
  try {
    Reflect.construct(String, [], target);
  } catch (e) {
    return false;
  }
  return true;
}

export {
  getValueFromToStringResult,
  notObject,
  isClass
};