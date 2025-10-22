// @ts-nocheck
'use strict';

import {
  getValueFromToStringResult,
  isClass,
  notObject
} from './general';
import {
  ESSERIALIZER_NULL,
  BOOLEAN_FIELD,
  BUILTIN_CLASS_INT8ARRAY,
  BUILTIN_CLASS_UINT8ARRAY,
  BUILTIN_CLASS_UINT8CLAMPEDARRAY,
  BUILTIN_CLASS_INT16ARRAY,
  BUILTIN_CLASS_UINT16ARRAY,
  BUILTIN_CLASS_INT32ARRAY,
  BUILTIN_CLASS_UINT32ARRAY,
  BUILTIN_CLASS_FLOAT32ARRAY,
  BUILTIN_CLASS_FLOAT64ARRAY,
  BUILTIN_CLASS_BIGINT64ARRAY,
  BUILTIN_CLASS_BIGUINT64ARRAY,
  BUILTIN_CLASS_ARRAYBUFFER,
  BUILTIN_CLASS_SHAREDARRAYBUFFER,
  BUILTIN_CLASS_BOOLEAN,
  BUILTIN_CLASS_DATAVIEW,
  BUILTIN_CLASS_DATE,
  BUILTIN_CLASS_INTL_COLLATOR,
  BUILTIN_CLASS_INTL_DATETIMEFORMAT,
  BUILTIN_CLASS_INTL_LISTFORMAT,
  BUILTIN_CLASS_INTL_LOCALE,
  BUILTIN_CLASS_INTL_NUMBERFORMAT,
  BUILTIN_CLASS_INTL_PLURALRULES,
  BUILTIN_CLASS_INTL_RELATIVETIMEFORMAT,
  BUILTIN_CLASS_REGEXP,
  BUILTIN_CLASS_SET,
  BUILTIN_CLASS_STRING,
  BUILTIN_CLASS_ERROR,
  BUILTIN_CLASS_EVAL_ERROR,
  BUILTIN_CLASS_RANGE_ERROR,
  BUILTIN_CLASS_REFERENCE_ERROR,
  BUILTIN_CLASS_SYNTAX_ERROR,
  BUILTIN_CLASS_TYPE_ERROR,
  BUILTIN_CLASS_URI_ERROR,
  BUILTIN_CLASS_AGGREGATE_ERROR,
  BUILTIN_TYPE_NOT_FINITE,
  BUILTIN_TYPE_UNDEFINED,
  CLASS_NAME_FIELD,
  TIMESTAMP_FIELD,
  TO_STRING_FIELD,
  BUILTIN_TYPE_BIG_INT,
  ARRAY_FIELD,
  OPTIONS_FIELD
} from './constant';

interface DeserializeOptions {
  fieldsForConstructorParameters?: Array<string>,
  ignoreProperties?: Array<string>,
  rawProperties?: Array<string>
}

const REGEXP_BEGIN_WITH_CLASS = /^\s*class\s+/;

function deserializeFromParsedObj(parsedObj: any, classes: Array<any>, options: DeserializeOptions): any {
  return deserializeFromParsedObjWithClassMapping(parsedObj, getClassMappingFromClassArray(classes), options);
}

function deserializeFromParsedObjWithClassMapping(parsedObj: any, classMapping: object, options: DeserializeOptions = {}): any {
  if (notObject(parsedObj)) {
    return parsedObj;
  }

  if (Array.isArray(parsedObj)) {
    return _deserializeArray(parsedObj, classMapping);
  }

  const classNameInParsedObj: string = parsedObj[CLASS_NAME_FIELD];
  const deserializedValueForBuiltinType = _deserializeBuiltinTypes(classNameInParsedObj, parsedObj, classMapping);
  if (deserializedValueForBuiltinType !== ESSERIALIZER_NULL) {
    return deserializedValueForBuiltinType;
  }

  const classNameInParsedObj1 = parsedObj[`${CLASS_NAME_FIELD}1`];
  if (classNameInParsedObj1) {
    const deserializedValueForBuiltinType1 = _deserializeBuiltinTypes(classNameInParsedObj1, parsedObj, classMapping);
    if (deserializedValueForBuiltinType1 !== ESSERIALIZER_NULL) {
      return deserializedValueForBuiltinType1;
    }
  }

  if ((classNameInParsedObj && !classMapping[classNameInParsedObj]) && (!classNameInParsedObj || !classMapping[classNameInParsedObj1])) {
    throw new Error(`Class ${classNameInParsedObj} not found`);
  }

  let constructorParameters = [];
  if (options.fieldsForConstructorParameters) {
    constructorParameters = options.fieldsForConstructorParameters.map((field) => {
      if (field in parsedObj) {
        return parsedObj[field];
      }
      return {}; // Prevent passing undefined to constructor
    });
  }
  const classFromMapping = classMapping[classNameInParsedObj] || (classNameInParsedObj1 && classMapping[classNameInParsedObj1])
  const deserializedObj: object = deserializeClassProperty(classFromMapping, constructorParameters);
  return deserializeValuesWithClassMapping(deserializedObj, parsedObj, classMapping, options);
}

function _deserializeArray(parsedObj, classMapping: object) {
  return parsedObj.map((item) => {
    return deserializeFromParsedObjWithClassMapping(item, classMapping)
  });
}

function _deserializeBuiltinTypes(classNameInParsedObj, parsedObj, classMapping) {
  switch (classNameInParsedObj) {
    case BUILTIN_CLASS_INT8ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Int8Array);
    case BUILTIN_CLASS_UINT8ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Uint8Array);
    case BUILTIN_CLASS_UINT8CLAMPEDARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Uint8ClampedArray);
    case BUILTIN_CLASS_INT16ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Int16Array);
    case BUILTIN_CLASS_UINT16ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Uint16Array);
    case BUILTIN_CLASS_INT32ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Int32Array);
    case BUILTIN_CLASS_UINT32ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Uint32Array);
    case BUILTIN_CLASS_FLOAT32ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Float32Array);
    case BUILTIN_CLASS_FLOAT64ARRAY:
      return _deserializeArrayInstance(parsedObj[ARRAY_FIELD], Float64Array);
    case BUILTIN_CLASS_BIGINT64ARRAY:
      return _deserializeBigIntArrayInstance(parsedObj[ARRAY_FIELD], BigInt64Array);
    case BUILTIN_CLASS_BIGUINT64ARRAY:
      return _deserializeBigIntArrayInstance(parsedObj[ARRAY_FIELD], BigUint64Array);
    case BUILTIN_TYPE_BIG_INT:
      return deserializeBigInt(parsedObj[TO_STRING_FIELD]);
    case BUILTIN_TYPE_UNDEFINED:
      return undefined;
    case BUILTIN_TYPE_NOT_FINITE:
      return getValueFromToStringResult(parsedObj[TO_STRING_FIELD]);
    case BUILTIN_CLASS_ARRAYBUFFER:
      return _deserializeArrayBuffer(parsedObj[ARRAY_FIELD]);
    case BUILTIN_CLASS_SHAREDARRAYBUFFER:
      return _deserializeSharedArrayBuffer(parsedObj[ARRAY_FIELD]);
    case BUILTIN_CLASS_BOOLEAN:
      return deserializeBoolean(parsedObj);
    case BUILTIN_CLASS_DATAVIEW:
      return _deserializeDataView(parsedObj[ARRAY_FIELD]);
    case BUILTIN_CLASS_DATE:
      return deserializeDate(parsedObj);
    case BUILTIN_CLASS_INTL_COLLATOR:
      return _deserializeIntlInstance(parsedObj, Intl.Collator);
    case BUILTIN_CLASS_INTL_DATETIMEFORMAT:
      return _deserializeIntlInstance(parsedObj, Intl.DateTimeFormat);
    case BUILTIN_CLASS_INTL_LISTFORMAT:
      // @ts-ignore
      return _deserializeIntlInstance(parsedObj, Intl.ListFormat);
    case BUILTIN_CLASS_INTL_LOCALE:
      // @ts-ignore
      return new Intl.Locale(parsedObj[TO_STRING_FIELD]);
    case BUILTIN_CLASS_INTL_NUMBERFORMAT:
      return _deserializeIntlInstance(parsedObj, Intl.NumberFormat);
    case BUILTIN_CLASS_INTL_PLURALRULES:
      return _deserializeIntlInstance(parsedObj, Intl.PluralRules);
    case BUILTIN_CLASS_INTL_RELATIVETIMEFORMAT:
      // @ts-ignore
      return _deserializeIntlInstance(parsedObj, Intl.RelativeTimeFormat);
    case BUILTIN_CLASS_REGEXP:
      return deserializeRegExp(parsedObj);
    case BUILTIN_CLASS_SET:
      return _deserializeSet(parsedObj, classMapping);
    case BUILTIN_CLASS_STRING:
      return deserializeString(parsedObj);
    case BUILTIN_CLASS_ERROR:
      return deserializeError(parsedObj, Error);
    case BUILTIN_CLASS_EVAL_ERROR:
      return deserializeError(parsedObj, EvalError);
    case BUILTIN_CLASS_RANGE_ERROR:
      return deserializeError(parsedObj, RangeError);
    case BUILTIN_CLASS_REFERENCE_ERROR:
      return deserializeError(parsedObj, ReferenceError);
    case BUILTIN_CLASS_SYNTAX_ERROR:
      return deserializeError(parsedObj, SyntaxError);
    case BUILTIN_CLASS_TYPE_ERROR:
      return deserializeError(parsedObj, TypeError);
    case BUILTIN_CLASS_URI_ERROR:
      return deserializeError(parsedObj, URIError);
    case BUILTIN_CLASS_AGGREGATE_ERROR:
      return deserializeError(parsedObj, AggregateError);
    default:
      return ESSERIALIZER_NULL;
  }
}

function _deserializeArrayBuffer(byteArray) {
  return new Uint8Array(byteArray).buffer;
}

function _deserializeSharedArrayBuffer(byteArray) {
  const sab = new SharedArrayBuffer(byteArray.length);
  const sabViewArray = new Uint8Array(sab);
  byteArray.forEach((byte, index) => {
    sabViewArray[index] = byte;
  });
  return sab;
}

function _deserializeDataView(byteArray) {
  return new DataView(new Uint8Array(byteArray).buffer);
}

function _deserializeArrayInstance(arr, ArrayClass) {
  return new ArrayClass(arr);
}

function _deserializeBigIntArrayInstance(arr, ArrayClass) {
  return new ArrayClass(arr.map((biObj) => {
    return deserializeBigInt(biObj[TO_STRING_FIELD]);
  }));
}

function deserializeBigInt(str) {
  return BigInt(str);
}

function deserializeBoolean(parsedObj) {
  return new Boolean(parsedObj[BOOLEAN_FIELD]);
}

function deserializeDate(parsedObj) {
  return typeof parsedObj[TIMESTAMP_FIELD] === 'number' ? new Date(parsedObj[TIMESTAMP_FIELD]) : null;
}

function _deserializeIntlInstance(parsedObj, IntlClass) {
  const options = parsedObj[OPTIONS_FIELD];
  const locale = options.locale;
  delete options.locale;
  return new IntlClass(locale, options);
}

function deserializeRegExp(parsedObj) {
  const regExpStr = parsedObj[TO_STRING_FIELD];
  const lastIndexOfSlash = regExpStr.lastIndexOf('/');
  return new RegExp(regExpStr.substring(1, lastIndexOfSlash), regExpStr.substring(lastIndexOfSlash + 1));
}

function _deserializeSet(parsedObj, classMapping) {
  return new Set(_deserializeArray(parsedObj[ARRAY_FIELD], classMapping));
}

function deserializeString(parsedObj) {
  return new String(parsedObj[TO_STRING_FIELD]);
}

function deserializeError(parsedObj, ErrorClass) {
  let error;
  if (parsedObj.message) {
    // @ts-ignore
    error = new ErrorClass(parsedObj.message);
  } else {
    // @ts-ignore
    error = new ErrorClass();
  }
  delete error.stack;

  if (parsedObj.name) {
    error.name = parsedObj.name;
  }
  if (parsedObj.stack) {
    error.stack = parsedObj.stack;
  }

  if (ErrorClass === AggregateError) {
    error.errors = deserializeFromParsedObjWithClassMapping(parsedObj.errors, {});
  }

  return error;
}

function deserializeClassProperty(classObj, constructorParameters: Array<any>) {
  if (!classObj) {
    return {};
  }

  const additionalParameterNumber = Math.max(classObj.length - constructorParameters.length, 0);
  const FALLBACK_PARAMETERS = [{}, 0, '', null];
  let fallbackParam = FALLBACK_PARAMETERS.shift();
  let deserializedObj;
  while (!deserializedObj && fallbackParam !== undefined) {
    deserializedObj = createDeserializedObj(
      classObj,
      constructorParameters.concat(Array.from(Array(additionalParameterNumber), () => (fallbackParam)))
    );

    if (additionalParameterNumber === 0) {
      fallbackParam = undefined;
    } else {
      fallbackParam = FALLBACK_PARAMETERS.shift();
    }
  }
  if (!deserializedObj) {
    deserializedObj = {};
    Object.setPrototypeOf(deserializedObj, classObj ? classObj.prototype : Object.prototype);
  }

  return deserializedObj;
}

function createDeserializedObj(classObj, allConstructorParameters) {
  let deserializedObj;
  try {
    if (REGEXP_BEGIN_WITH_CLASS.test(classObj.toString())) {
      deserializedObj = new classObj(...allConstructorParameters);
    } else {// It's class in function style.
      let objectConstructor = classObj.prototype.constructor;
      if (objectConstructor.name === 'Object') {
        objectConstructor = classObj; // In case object's constructor is not in its prototype, such as Big in big.js
      }
      deserializedObj = Object.create(objectConstructor.prototype);
      objectConstructor.call(deserializedObj, allConstructorParameters)
    }
  } catch (e) {
    deserializedObj = null;
  }
  return deserializedObj;
}

function deserializeValuesWithClassMapping(deserializedObj, parsedObj, classMapping, options: DeserializeOptions) {
  for (const k in parsedObj) {
    const v = parsedObj[k];

    if (options.ignoreProperties && options.ignoreProperties.includes(k)) {
      continue;
    }
    if (options.rawProperties && options.rawProperties.includes(k)) {
      deserializedObj[k] = JSON.stringify(v);
      continue;
    }

    const descriptor = Object.getOwnPropertyDescriptor(deserializedObj, k);
    if (canSkipCopyingValue(k, v, descriptor)) {
      continue;
    }
    if (descriptor && descriptor.writable === false && typeof v === 'object') {
      assignWritableField(deserializedObj[k], v, classMapping);
      continue;
    }

    deserializedObj[k] = deserializeFromParsedObjWithClassMapping(v, classMapping);
  }
  return deserializedObj;
}

function canSkipCopyingValue(keyOfParsedObj, valueOfParsedObj, descriptorOfDeserializedObjProperty) {
  if (keyOfParsedObj === CLASS_NAME_FIELD || (keyOfParsedObj === CLASS_NAME_FIELD + '1')) {
    return true;
  }
  return descriptorOfDeserializedObjProperty && (
    typeof descriptorOfDeserializedObjProperty.set === 'function' ||
    (descriptorOfDeserializedObjProperty.writable === false && typeof valueOfParsedObj !== 'object')
  );
}

function assignWritableField(targetObj, sourceObj, classMapping) {
  for (const field in sourceObj) {
    const descriptor = Object.getOwnPropertyDescriptor(targetObj, field);
    if (descriptor && !(descriptor.writable === true || typeof descriptor.set === 'function')) {
      continue;
    }
    targetObj[field] = deserializeFromParsedObjWithClassMapping(sourceObj[field], classMapping);
  }
}

/**
 *
 * @param classes It's an array of Class definition. "any" is used in code only
 * because there is no TypeScript type definition for Class.
 */
function getClassMappingFromClassArray(classes: Array<any> = []): object {
  const classMapping: object = {};
  classes.forEach((c) => {
    if (!isClass(c)) {
      return;
    }
    const className: string = c.name;
    const previousClass = classMapping[className];
    // if (previousClass && previousClass !== c) {
    //   console.warn('WARNING: Found class definition with the same name: ' + className);
    // }
    // @ts-ignore
    classMapping[className] = c;

    // workaround for how webpack generates the class name
    const classNameWithoutFilePrefix = className.split('_').slice(1).join('_')
    const previousClassWithoutFilePrefix = classMapping[classNameWithoutFilePrefix]
    // if (previousClassWithoutFilePrefix && previousClassWithoutFilePrefix !== c) {
    //   console.warn('WARNING: Found class definition with the same name: ' + className);
    // }
    // @ts-ignore
    classMapping[classNameWithoutFilePrefix] = c;
  });

  return classMapping;
}

/**
 *
 * @param classObj It's a Class definition. "any" is used in code only
 * because there is no TypeScript type definition for Class.
 */
function getParentClassName(classObj: any): string {
  return classObj.prototype.__proto__.constructor.name;
}

export {
  deserializeFromParsedObj,
  deserializeFromParsedObjWithClassMapping,
  getClassMappingFromClassArray,
  getParentClassName
};