(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":14}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/map"), __esModule: true };
},{"core-js/library/fn/map":15}],3:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":16}],4:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":17}],5:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":18}],6:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":19}],7:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":20}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/regexp/escape"), __esModule: true };
},{"core-js/library/fn/regexp/escape":21}],9:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],10:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":4}],11:[function(require,module,exports){
"use strict";

var _Object$getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;
    _again = false;
    if (object === null) object = Function.prototype;

    var desc = _Object$getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        desc = parent = undefined;
        continue _function;
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/get-own-property-descriptor":5}],12:[function(require,module,exports){
"use strict";

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of")["default"];

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/create":3,"babel-runtime/core-js/object/set-prototype-of":7}],13:[function(require,module,exports){
"use strict";

exports["default"] = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
};

exports.__esModule = true;
},{}],14:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":68,"../modules/es6.string.iterator":75,"../modules/web.dom.iterable":78}],15:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.map');
require('../modules/es7.map.to-json');
module.exports = require('../modules/$.core').Map;
},{"../modules/$.core":30,"../modules/es6.map":70,"../modules/es6.object.to-string":74,"../modules/es6.string.iterator":75,"../modules/es7.map.to-json":76,"../modules/web.dom.iterable":78}],16:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":48}],17:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":48}],18:[function(require,module,exports){
var $ = require('../../modules/$');
require('../../modules/es6.object.get-own-property-descriptor');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":48,"../../modules/es6.object.get-own-property-descriptor":71}],19:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/$.core').Object.keys;
},{"../../modules/$.core":30,"../../modules/es6.object.keys":72}],20:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":30,"../../modules/es6.object.set-prototype-of":73}],21:[function(require,module,exports){
require('../../modules/es7.regexp.escape');
module.exports = require('../../modules/$.core').RegExp.escape;
},{"../../modules/$.core":30,"../../modules/es7.regexp.escape":77}],22:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],23:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],24:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":42}],25:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":26,"./$.wks":66}],26:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],27:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , hide         = require('./$.hide')
  , mix          = require('./$.mix')
  , ctx          = require('./$.ctx')
  , strictNew    = require('./$.strict-new')
  , defined      = require('./$.defined')
  , forOf        = require('./$.for-of')
  , $iterDefine  = require('./$.iter-define')
  , step         = require('./$.iter-step')
  , ID           = require('./$.uid')('id')
  , $has         = require('./$.has')
  , isObject     = require('./$.is-object')
  , setSpecies   = require('./$.set-species')
  , DESCRIPTORS  = require('./$.descriptors')
  , isExtensible = Object.isExtensible || isObject
  , SIZE         = DESCRIPTORS ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    mix(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./$":48,"./$.ctx":31,"./$.defined":33,"./$.descriptors":34,"./$.for-of":36,"./$.has":38,"./$.hide":39,"./$.is-object":42,"./$.iter-define":45,"./$.iter-step":46,"./$.mix":50,"./$.set-species":56,"./$.strict-new":59,"./$.uid":65}],28:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = require('./$.for-of')
  , classof = require('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":25,"./$.for-of":36}],29:[function(require,module,exports){
'use strict';
var global         = require('./$.global')
  , $              = require('./$')
  , $def           = require('./$.def')
  , fails          = require('./$.fails')
  , hide           = require('./$.hide')
  , mix            = require('./$.mix')
  , forOf          = require('./$.for-of')
  , strictNew      = require('./$.strict-new')
  , isObject       = require('./$.is-object')
  , DESCRIPTORS    = require('./$.descriptors')
  , setToStringTag = require('./$.set-to-string-tag');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  if(!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    mix(C.prototype, methods);
  } else {
    C = wrapper(function(target, iterable){
      strictNew(target, C, NAME);
      target._c = new Base;
      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
    });
    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
        if(!IS_ADDER && IS_WEAK && !isObject(a))return KEY == 'get' ? undefined : false;
        var result = this._c[KEY](a === 0 ? 0 : a, b);
        return IS_ADDER ? this : result;
      });
    });
    if('size' in proto)$.setDesc(C.prototype, 'size', {
      get: function(){
        return this._c.size;
      }
    });
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F, O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$":48,"./$.def":32,"./$.descriptors":34,"./$.fails":35,"./$.for-of":36,"./$.global":37,"./$.hide":39,"./$.is-object":42,"./$.mix":50,"./$.set-to-string-tag":57,"./$.strict-new":59}],30:[function(require,module,exports){
var core = module.exports = {version: '1.2.5'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],31:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":22}],32:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , PROTOTYPE = 'prototype';
var ctx = function(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
};
var $def = function(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , isProto  = type & $def.P
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {})[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    if(isGlobal && typeof target[key] != 'function')exp = source[key];
    // bind timers to global for call from export context
    else if(type & $def.B && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & $def.W && target[key] == out)!function(C){
      exp = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      exp[PROTOTYPE] = C[PROTOTYPE];
    }(out);
    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export
    exports[key] = exp;
    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
module.exports = $def;
},{"./$.core":30,"./$.global":37}],33:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],34:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":35}],35:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],36:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":24,"./$.ctx":31,"./$.is-array-iter":41,"./$.iter-call":43,"./$.to-length":63,"./core.get-iterator-method":67}],37:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],38:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],39:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":48,"./$.descriptors":34,"./$.property-desc":52}],40:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":26}],41:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./$.iterators')
  , ITERATOR   = require('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return (Iterators.Array || ArrayProto[ITERATOR]) === it;
};
},{"./$.iterators":47,"./$.wks":66}],42:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],43:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":24}],44:[function(require,module,exports){
'use strict';
var $              = require('./$')
  , descriptor     = require('./$.property-desc')
  , setToStringTag = require('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":48,"./$.hide":39,"./$.property-desc":52,"./$.set-to-string-tag":57,"./$.wks":66}],45:[function(require,module,exports){
'use strict';
var LIBRARY         = require('./$.library')
  , $def            = require('./$.def')
  , $redef          = require('./$.redef')
  , hide            = require('./$.hide')
  , has             = require('./$.has')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , Iterators       = require('./$.iterators')
  , $iterCreate     = require('./$.iter-create')
  , setToStringTag  = require('./$.set-to-string-tag')
  , getProto        = require('./$').getProto
  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR     = '@@iterator'
  , KEYS            = 'keys'
  , VALUES          = 'values';
var returnThis = function(){ return this; };
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
  }
  // Define iterator
  if((!LIBRARY || FORCE) && (BUGGY || !(SYMBOL_ITERATOR in proto))){
    hide(proto, SYMBOL_ITERATOR, _default);
  }
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEFAULT == VALUES ? _default : getMethod(VALUES),
      keys:    IS_SET            ? _default : getMethod(KEYS),
      entries: DEFAULT != VALUES ? _default : getMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$redef(proto, key, methods[key]);
    } else $def($def.P + $def.F * BUGGY, NAME, methods);
  }
  return methods;
};
},{"./$":48,"./$.def":32,"./$.has":38,"./$.hide":39,"./$.iter-create":44,"./$.iterators":47,"./$.library":49,"./$.redef":53,"./$.set-to-string-tag":57,"./$.wks":66}],46:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],47:[function(require,module,exports){
module.exports = {};
},{}],48:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],49:[function(require,module,exports){
module.exports = true;
},{}],50:[function(require,module,exports){
var $redef = require('./$.redef');
module.exports = function(target, src){
  for(var key in src)$redef(target, key, src[key]);
  return target;
};
},{"./$.redef":53}],51:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $def  = require('./$.def')
  , core  = require('./$.core')
  , fails = require('./$.fails');
module.exports = function(KEY, exec){
  var $def = require('./$.def')
    , fn   = (core.Object || {})[KEY] || Object[KEY]
    , exp  = {};
  exp[KEY] = exec(fn);
  $def($def.S + $def.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":30,"./$.def":32,"./$.fails":35}],52:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],53:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":39}],54:[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],55:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":48,"./$.an-object":24,"./$.ctx":31,"./$.is-object":42}],56:[function(require,module,exports){
'use strict';
var core        = require('./$.core')
  , $           = require('./$')
  , DESCRIPTORS = require('./$.descriptors')
  , SPECIES     = require('./$.wks')('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":48,"./$.core":30,"./$.descriptors":34,"./$.wks":66}],57:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":48,"./$.has":38,"./$.wks":66}],58:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":37}],59:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],60:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":33,"./$.to-integer":61}],61:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],62:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":33,"./$.iobject":40}],63:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":61}],64:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":33}],65:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],66:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , uid    = require('./$.uid')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":37,"./$.shared":58,"./$.uid":65}],67:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":25,"./$.core":30,"./$.iterators":47,"./$.wks":66}],68:[function(require,module,exports){
var anObject = require('./$.an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./$.core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./$.an-object":24,"./$.core":30,"./core.get-iterator-method":67}],69:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./$.add-to-unscopables')
  , step             = require('./$.iter-step')
  , Iterators        = require('./$.iterators')
  , toIObject        = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":23,"./$.iter-define":45,"./$.iter-step":46,"./$.iterators":47,"./$.to-iobject":62}],70:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":29,"./$.collection-strong":27}],71:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":51,"./$.to-iobject":62}],72:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":51,"./$.to-object":64}],73:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.def":32,"./$.set-proto":55}],74:[function(require,module,exports){

},{}],75:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":45,"./$.string-at":60}],76:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $def  = require('./$.def');

$def($def.P, 'Map', {toJSON: require('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":28,"./$.def":32}],77:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $def = require('./$.def')
  , $re  = require('./$.replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');
$def($def.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"./$.def":32,"./$.replacer":54}],78:[function(require,module,exports){
require('./es6.array.iterator');
var Iterators = require('./$.iterators');
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
},{"./$.iterators":47,"./es6.array.iterator":69}],79:[function(require,module,exports){
(function (global){
/*jshint -W116, -W030 */
/*global window, $, jQuery, Handlebars, marked, Editor */

'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _dbRelalg = require('../../db/relalg');

var relalgjs = _interopRequireWildcard(_dbRelalg);

var _Editor = require('./Editor');

var _CalculatorHelpers = require('./CalculatorHelpers');

var Calculator = (function () {
	function Calculator() {
		_classCallCheck(this, Calculator);

		var calc = this;

		this.options = {
			alertContainer: $('body > .alertContainer'),
			groupsSelector: $('#groups-selector'),
			groupsSelectorList: $('#groups-selector').find('#groups-selector-list'),
			groupRelationList: $('#groups'),
			groupDesc: $('#groups-desc'),
			groupInfo: $('#groups-info'),
			resultContainers: {
				'ra': $('#tab-editor-ra').find('> .exec-result'),
				'sql': $('#tab-editor-sql').find('> .exec-result')
			},
			modalSqlDump: $('#modal-sqldump'),

			staticGroups: [{
				maintainerGroup: i18n.t('calc.maintainer-groups.misc'),
				maintainer: '',

				source: 'http',
				url: 'data/local_groups.txt'
			}, {
				maintainerGroup: i18n.t('calc.maintainer-groups.uibk'),
				maintainer: '<a href="https://github.com/mtschu">mtschu</a>',

				source: 'gist',
				url: '2923a30a474fdcb46bee'
			}, {
				maintainerGroup: i18n.t('calc.maintainer-groups.uibk'),
				maintainer: '<a href="https://gist.github.com/woolfg">Wolfgang Gassler</a>',

				source: 'gist',
				url: '7d1871f79a8bcb4788de'
			}],
			numTreeLabelColors: 6,

			keywords: {
				'ra': ['pi', 'sigma', 'rho', 'tau', '<-', 'intersect', 'union', '/', '-', '\\', 'x', 'cross join', 'join', 'inner join', 'natural join', 'left join', 'right join', 'left outer join', 'right outer join', 'full outer join', 'left semi join', 'right semi join', 'anti join', 'and', 'or', 'xor', '||'],
				'sql': ['distinct', 'select distinct', 'from', 'where', 'order by', 'asc', 'desc', 'inner join', 'inner', 'join', 'natural', 'union', 'intersect', 'outer join', 'natural join', 'left join', 'right join', 'left outer join', 'right outer join', 'full outer join', 'group by', 'having', 'limit', 'offset', 'and', 'or', 'xor', '||']
			}
		};
		this.state = {
			currentGroup: null,
			groups: {
				'static': {},
				gist: {},
				own: {}
			},
			relations: {},

			editors: {
				ra: null,
				sql: null,

				// group editor
				sqldump: null,
				group: null
			},
			currentEditorName: null
		};

		marked.setOptions({
			renderer: new marked.Renderer(),
			gfm: true,
			tables: true,
			breaks: false,
			pedantic: false,
			sanitize: true,
			smartLists: true,
			smartypants: false
		});

		function getColumnNamesFromRaRoot(root) {
			// use columns from all calculated schemas for hints
			var columns = [];
			var i;
			var rec = function rec(n) {
				var schema = n.getSchema();
				for (i = 0; i < schema.getSize(); i++) {
					if (!schema.needsFullName(i)) columns.push(schema.getName(i));

					columns.push(schema.getFullName(i));
				}

				if (n.hasChild()) rec(n.getChild());
				if (n.hasChild2()) rec(n.getChild2());
			};
			rec(root, columns);

			// use column names as hints
			return columns;
		}

		function getHintsFromGroup(group) {
			if (!group) return [];

			var i, j, tables, schema, columnName, tableName;
			var hints = [];

			// add table and column names
			tables = calc.state.currentGroup.tables;
			for (i in tables) {
				schema = tables[i].relation.getSchema();
				tableName = tables[i].tableName;

				hints.push(tableName);

				for (j = 0; j < schema.getSize(); j++) {
					columnName = schema.getColumn(j).getName();

					hints.push(columnName);
					hints.push(tableName + '.' + columnName);
				}
			}

			return hints;
		}

		this.state.editors.ra = new _Editor.Editor({
			textarea: $('#tab-editor-ra').find('> textarea'),
			historyContainer: $('#tab-editor-ra').find('.history-container'),
			downloadButton: $('#tab-editor-ra').find('.download-button'),
			execErrors: $('#tab-editor-ra').find('> .exec-errors'),
			execButton: $('#tab-editor-ra').find('.exec-button'),
			execFunction: function execFunction(text) {
				var relations = calc.state.relations;

				var ast = relalgjs.parseRelalg(text, _Object$keys(relations));
				relalgjs.replaceVariables(ast, relations);

				if (ast.child === null) {
					if (ast.assignments.length > 0) throw new Error(i18n.t('calc.messages.error-query-missing-assignments-found'));else throw new Error(i18n.t('calc.messages.error-query-missing'));
				}

				var root = relalgjs.relalgFromRelalgAstRoot(ast, relations);
				root.check();

				calc.displayRaResult(root);

				this.historyAddEntry(text);
				this.updateHistoryList();

				if (this.options.enableInlineRelationEditor) this.addInlineRelationMarkers(ast);
			},
			linterFunction: function linterFunction(text) {
				var relations = calc.state.relations;
				var hints = [];

				var ast = relalgjs.parseRelalg(text, _Object$keys(relations));
				relalgjs.replaceVariables(ast, relations);

				for (var i = 0; i < ast.assignments.length; i++) {
					hints.push(ast.assignments[i].name);
				}

				if (ast.child === null) {
					if (ast.assignments.length > 0) throw new Error(i18n.t('calc.messages.error-query-missing-assignments-found'));else throw new Error(i18n.t('calc.messages.error-query-missing'));
				}

				var root = relalgjs.relalgFromRelalgAstRoot(ast, relations);
				root.check();

				if (this.options.enableInlineRelationEditor) this.addInlineRelationMarkers(ast);

				// use columns from all calculated schemas for hints
				return hints.concat(getColumnNamesFromRaRoot(root));
			},
			getHintsFunction: function getHintsFunction() {
				var arr = calc.options.keywords.ra;

				// add table and column names
				arr = arr.concat(getHintsFromGroup(calc.state.currentGroup));

				return arr;
			},
			codeMirrorOptions: {
				mode: 'ra'
			},
			enableInlineRelationEditor: true
		});
		$('#tab-editor-ra .editor-ra-new-relation').click(function () {
			calc.state.editors.ra.openModalInlineEditor_inlineRelationNew();
		});

		this.state.editors.sql = new _Editor.Editor({
			textarea: $('#tab-editor-sql').find('> textarea'),
			historyContainer: $('#tab-editor-sql').find('.history-container'),
			downloadButton: $('#tab-editor-sql').find('.download-button'),
			execErrors: $('#tab-editor-sql').find('> .exec-errors'),
			execButton: $('#tab-editor-sql').find('.exec-button'),
			execFunction: function execFunction(text, addWarning) {
				var warnings, i;

				var relations = calc.state.relations;

				var ast = relalgjs.parseSQLSelect(text);
				relalgjs.replaceVariables(ast, relations);
				var root = relalgjs.relalgFromSQLAstRoot(ast, relations);
				root.check();

				warnings = root.getWarnings(true);
				for (i = 0; i < warnings.length; i++) {
					addWarning(warnings[i].message);
				}

				calc.displayRaResult(root);

				this.historyAddEntry(text);
				this.updateHistoryList();
			},
			linterFunction: function linterFunction(text) {
				var relations = calc.state.relations;
				var hints = [];

				var ast = relalgjs.parseSQLSelect(text);
				relalgjs.replaceVariables(ast, relations);

				for (var i = 0; i < ast.assignments.length; i++) {
					hints.push(ast.assignments[i].name);
				}

				var root = relalgjs.relalgFromSQLAstRoot(ast, relations);
				root.check();

				// use columns from all calculated schemas for hints
				return hints.concat(getColumnNamesFromRaRoot(root));
			},
			getHintsFunction: function getHintsFunction() {
				var arr = calc.options.keywords.sql;

				// add table and column names
				arr = arr.concat(getHintsFromGroup(calc.state.currentGroup));

				return arr;
			},
			codeMirrorOptions: {
				mode: 'text/x-mysql'
			}
		});

		this.state.editors.group = new _Editor.Editor({
			textarea: $('#tab-editor-group').find('> textarea'),
			downloadButton: $('#tab-editor-group').find('.download-button'),
			execErrors: $('#tab-editor-group').find('> .exec-errors'),
			execButton: $('#tab-editor-group').find('.exec-button'),
			execFunction: function execFunction(text) {
				var result_container = $('#tab-editor-group').find('> .exec-result');
				result_container.empty();

				var groupAst = relalgjs.parseRelalgGroup(text);
				var groups = _CalculatorHelpers.CalculatorHelpers.getGroupsFromGroupAst(groupAst);

				if (this.options.enableInlineRelationEditor) this.addInlineRelationMarkers(groupAst);

				// display result
				var i, j, list;
				for (i = 0; i < groups.length; i++) {
					result_container.append($('<h4>').text(groups[i].groupName));

					list = $('<ul class="table-list">');
					for (j = 0; j < groups[i].tables.length; j++) {
						list.append($('<li>').append($('<h5>').text(groups[i].tables[j].tableName)).append(groups[i].tables[j].relation.getResult().getHtml()));
					}
					result_container.append(list);
				}
				result_container.append(getUseGroupsButton(groups));
				result_container.find('table').addClass('table table-condensed');

				function getUseGroupsButton(newGroups) {
					var button = $('<button type="button" class="btn btn-primary"></button>').click(function (e) {
						var i, id;
						var firstId = null;

						for (i = 0; i < newGroups.length; i++) {
							id = _CalculatorHelpers.CalculatorHelpers.StringHashCode(newGroups[i].definition);

							calc.state.groups.own[id] = newGroups[i];

							if (i === 0) {
								firstId = id;
							}
						}

						if (firstId !== null) {
							calc.changeToGroup('own', firstId);
						} else {
							calc.updategroupsSelector();
						}
					});
					button.text(i18n.t('calc.editors.group.button-use', { count: newGroups.length }));

					return button;
				}
			},
			linterFunction: function linterFunction(text) {
				var groupAst = relalgjs.parseRelalgGroup(text);

				if (this.options.enableInlineRelationEditor) this.addInlineRelationMarkers(groupAst);

				_CalculatorHelpers.CalculatorHelpers.getGroupsFromGroupAst(groupAst);
				return [];
			},
			getHintsFunction: function getHintsFunction() {
				var arr = calc.options.keywords.ra;

				arr.push('group');

				// add table and column names
				arr = arr.concat(getHintsFromGroup(calc.state.currentGroup));

				return arr;
			},
			enableInlineRelationEditor: true
		});

		this.state.editors.group.state.editor.on('change', function () {
			var result_container = $('#tab-editor-group').find('> .exec-result');
			result_container.empty();
		});

		$('#tab-editor-group').find('.editor-group-new-relation').click(function () {
			calc.state.editors.group.openModalInlineEditor_inlineRelationNew();
		});
		$('#tab-editor-group').find('.editor-group-import-sql').click(function () {
			calc.modalSqlDumpOpen();
		});

		// modal dialog for sqldump editor
		this.state.editors.sqldump = new _Editor.Editor({
			textarea: $('#editor-sqldump').find('> textarea'),
			execErrors: $('#editor-sqldump').find('> .exec-errors'),
			execButton: $('#modal-sqldump').find('.exec-button'),
			execFunction: function execFunction(text) {
				var ast = relalgjs.parseSQLDump(text);
				ast.groups[0].headers.group = i18n.t('calc.editors.group.sql-import-group-name-placeholder');

				var result = relalgjs.textFromGroupAstRoot(ast);
				calc.state.editors.group.setText(result, true);

				calc.modalSqlDumpClose();
			},
			linterFunction: function linterFunction(text) {
				var ast = relalgjs.parseSQLDump(text);
				ast.groups[0].headers.group = ''; // start with empty name

				return [];
			}
		});

		this.options.modalSqlDump.on('shown.bs.modal', function (e) {
			calc.state.editors.sqldump.refresh();
		});

		// save the current editor and track changes
		this.state.currentEditorName = 'ra';
		$('#main-editors').find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			var activatedTab = e.target;
			var previousTab = e.relatedTarget;

			calc.state.currentEditorName = $(activatedTab).attr('href').replace(/#tab-editor-/, '');

			calc.state.editors[calc.state.currentEditorName].refresh();
		});

		// add custom extensions to RA editor
		this.state.editors.ra.state.editor.on('beforeChange', function (instance, changeObj) {
			// replace wrong charaters with right one
			if (changeObj !== 'paste') return;

			var text = [];
			for (var i = 0; i < changeObj.text.length; i++) {
				text[i] = changeObj.text[i].replace(/×/g, '⨯');
			}
			changeObj.update(changeObj.from, changeObj.to, text);
		});

		$('body').on('click', '.replace, .replace-all', function () {
			var text = $(this).data('text') || this.innerHTML;
			//var lang = $(this).data('lang');

			var replaceSelection = $(this).hasClass('replace-all') === false;
			var editor = calc.state.editors[calc.state.currentEditorName];

			editor.setText(text, replaceSelection);
			editor.focus();
		});

		// controller stuff
		$('*.has-tooltip[title]').tooltip({
			container: 'body',
			html: true
		});

		this.options.groupsSelector.on('click', 'a[data-group-gid][data-group-type]', function () {
			var e = $(this);
			var type = e.data('group-type');
			var gid = e.data('group-gid');

			calc.changeToGroup(type, gid);
		});
		this.options.groupsSelector.on('click', 'table', function (e) {
			e.stopPropagation();
			e.preventDefault();
		});

		function groupSelectLoadGist() {
			// gist load is the only button
			var input = calc.options.groupsSelector.find('input.gist-load-input');
			var id = input.val();
			if (id.trim().length === 0) return;

			calc.loadGroupFromGist(id, true, function (err) {
				if (!err) {
					input.val('');
					calc.options.groupsSelector.find('.dropdown-toggle').dropdown('toggle');

					calc.displayAlertMsg(i18n.t('calc.messages.gist-load-success'), 'success', 20);
				} else {
					console.error(err);
				}
			});
		}

		this.options.groupsSelector.on('click', '.open-group-new-btn', function () {
			calc.openGroupEditor('new');
		});
		this.options.groupsSelector.on('click', '.open-group-current-btn', function () {
			calc.openGroupEditor('current');
		});

		this.options.groupsSelector.on('click', '.gist-load-btn', groupSelectLoadGist);
		this.options.groupsSelector.on('keyup', '.gist-load-input', function (e) {
			if (e.keyCode !== 13) return;

			groupSelectLoadGist();
		});

		$('.codemirror-toolbar span[data-name]').popover({
			trigger: 'hover',
			container: '#toolbar-popovers',
			placement: 'bottom',
			title: function title() {
				var name = $(this).data('name');
				var title = i18n.t(name);
				return title;
			},
			content: function content() {
				var name = $(this).data('name');
				var content = i18n.t(name + '-content');
				return content;
			},
			html: true
		});

		this.tour = this._initTour();
		var tour = this.tour;
		$('#start-tour').click(function () {
			tour.restart();
		});
	}

	// global export

	_createClass(Calculator, [{
		key: 'modalSqlDumpOpen',
		value: function modalSqlDumpOpen() {
			/*if(setCurrentGroupDefinition === true && this.state.currentGroup){
    var definition = this.state.currentGroup.definition;
    this.state.editors.group.setText(definition);
    }*/

			this.options.modalSqlDump.modal('show');
		}
	}, {
		key: 'modalSqlDumpClose',
		value: function modalSqlDumpClose() {
			this.options.modalSqlDump.modal('hide');
		}
	}, {
		key: 'openGroupEditor',
		value: function openGroupEditor(cmd) {
			var text = null;

			if (cmd === 'current' && this.state.currentGroup) {
				text = this.state.currentGroup.definition;
			} else if (cmd === 'new') {
				text = i18n.t('calc.editors.group.new-group-example-group');
			}

			if (text !== null) {
				this.state.editors.group.setText(text);
			}

			// swith to tab
			$('#main-editors').find('> ul a:last').tab('show');
		}
	}, {
		key: 'displayRaResult',
		value: function displayRaResult(root) {
			var container = $('<div class="ra-result clearfix"><div class="tree"></div><div class="result"></div></div>');

			// add result table
			var resultContainer = container.find('> .result');
			resultContainer.html(_CalculatorHelpers.CalculatorHelpers.getRaResultHtml(root));

			// add result tree
			var treeContainer = container.find('> .tree');
			treeContainer.html(_CalculatorHelpers.CalculatorHelpers.getRaTreeHtml(root, this.options.numTreeLabelColors));

			// mark root of tree as active
			treeContainer.find('a').first().addClass('active');

			// register handlers for partial results
			treeContainer.find('a.formula').click(function (event) {
				treeContainer.find('a.formula.active').removeClass('active');
				$(this).addClass('active');

				var raNode = $(this).data('raNode');
				resultContainer.html(_CalculatorHelpers.CalculatorHelpers.getRaResultHtml(raNode));
			});

			this.options.resultContainers[this.state.currentEditorName].html(container);
		}
	}, {
		key: 'updategroupsSelector',
		value: function updategroupsSelector() {
			var list = this.options.groupsSelectorList;
			var template_line = Handlebars.compile('<li class="{{#if active}}active{{/if}}"><a href="#" data-group-type="{{type}}" data-group-gid="{{gid}}">{{name}}</a></li>');
			// tags: <span class="label label-default">book</span>

			var types = ['static', 'gist', 'own'];
			var i, j, type, group, gid, headline, ul;

			var entries = {};
			list.empty();

			// collect all groups and group them by their maintainer's group-name
			for (i = 0; i < types.length; i++) {
				type = types[i];

				for (gid in this.state.groups[type]) {
					if (!this.state.groups[type].hasOwnProperty(gid)) continue;

					group = this.state.groups[type][gid];

					if (group.sourceInfo && group.sourceInfo.maintainerGroup) {
						headline = group.sourceInfo.maintainerGroup;
					} else {
						// e.g loaded from gist or unsaved own
						headline = i18n.t('calc.maintainer-groups.temp');
					}

					if (!entries[headline]) entries[headline] = [];

					entries[headline].push({
						gid: gid,
						type: type,
						group: group,

						name: group.groupName,
						active: group === this.state.currentGroup
					});
				}
			}

			for (headline in entries) {
				if (!entries.hasOwnProperty(headline)) continue;

				entries[headline].sort(function (a, b) {
					return a.name.localeCompare(b.name);
				});

				ul = $('<ul>');

				for (i = 0; i < entries[headline].length; i++) {
					ul.append(template_line(entries[headline][i]));
				}

				list.append('<li>' + headline + '</li>');
				list.children('li:last-child').append(ul);
			}

			//name of current group
			var buttonText = this.options.groupsSelector.find('> button > span:first-child');
			if (this.state.currentGroup) {
				buttonText.text(this.state.currentGroup.groupName);
			}
		}
	}, {
		key: 'changeToGroup',
		value: function changeToGroup(type, gid) {
			this.state.currentGroup = this.state.groups[type][gid];

			var group = this.state.currentGroup;
			var tid, table;

			// create relation references
			this.state.relations = {};
			for (tid in group.tables) {
				table = group.tables[tid];
				this.state.relations[table.tableName] = table.relation;
			}

			this.updategroupsSelector();
			this.updateGroupRelationList();
			this.updateGroupInfoDesc();

			// force the linter to reevaluate the query with the new relations for all editors
			this.state.editors.ra.forceLinterRun();
			this.state.editors.sql.forceLinterRun();
		}
	}, {
		key: 'updateGroupInfoDesc',
		value: function updateGroupInfoDesc() {
			var group = this.state.currentGroup;
			var groupInfo = this.options.groupInfo;
			var groupDesc = this.options.groupDesc;

			// set description
			groupDesc.html(group.groupDesc ? marked(group.groupDesc) : '');
			groupDesc.find('a').attr('target', '_blank');
			groupInfo.html(group.groupInfo || '');
		}

		/** builds the ul with the relations and columns */
	}, {
		key: 'updateGroupRelationList',
		value: function updateGroupRelationList(argGroup) {
			var groupUL = this.options.groupRelationList;
			var group = argGroup || this.state.currentGroup;
			var i, tid, table, schema;

			groupUL.empty();

			for (tid in group.tables) {
				if (!group.tables.hasOwnProperty(tid)) continue;

				table = group.tables[tid];
				schema = table.relation.getSchema();

				var tableLI = $('<li>');
				var tableEntry = $('<span>').addClass('replace').text(table.tableName);

				// create popover
				var title, content;

				var maxRows = 4;
				var result = table.relation.getResult();

				content = $(result.getHtml(true, maxRows));
				content.addClass('table').addClass('table-condensed');

				if (result.getNumRows() > maxRows) {
					var ellipsis = $('<tr>');
					for (i = 0; i < result.getNumCols(); i++) {
						ellipsis.append($('<td>').html('&hellip;'));
					}

					content.find('tbody').append(ellipsis);
				}

				title = table.tableName + ' (' + result.getNumRows() + ' row' + (result.getNumRows() > 1 ? 's)' : ')');

				tableEntry.popover({
					html: true,
					trigger: 'hover',
					container: 'body',
					placement: 'right',
					delay: {
						show: 2000,
						hide: 100
					},
					title: title,
					content: content
				});

				tableLI.append(tableEntry);

				var ul = $('<ul>');
				for (i = 0; i < schema.getSize(); i++) {
					var c = schema.getColumn(i);
					ul.append($('<li>').append($('<span>').addClass('replace').text(c.getName())).append(' <small class="muted text-muted">' + c.getType() + '</small>'));
				}

				tableLI.append(ul);
				groupUL.append(tableLI);
			}
		}
	}, {
		key: 'displayAlertMsg',
		value: function displayAlertMsg(text, type, timeout) {
			type = type || 'danger';
			timeout = typeof timeout === 'undefined' ? false : timeout;
			var header = ({
				'success': i18n.t('editor.alert-message-headers.success'),
				'info': i18n.t('editor.alert-message-headers.info'),
				'warning': i18n.t('editor.alert-message-headers.warning'),
				'danger': i18n.t('editor.alert-message-headers.error')
			})[type];

			if (typeof header === 'undefined') throw 'this should not happen; type not found';

			var el = $('<div>').addClass('alert alert-' + type + ' alert-dismissable');
			el.append('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
			el.append('<strong>' + header + ': </strong>');
			el.append(text);
			el.alert();
			if (timeout !== false) {
				window.setTimeout(function () {
					el.alert('close');
				}, timeout * 1000);
			}

			this.options.alertContainer.prepend(el);
		}
	}, {
		key: 'mergeNewGroups',
		value: function mergeNewGroups(newGroups, type, doChangeToFirstGroup) {
			var i, id;
			var firstId = null;

			for (i = 0; i < newGroups.length; i++) {
				id = _CalculatorHelpers.CalculatorHelpers.StringHashCode(newGroups[i].definition);

				this.state.groups[type][id] = newGroups[i];

				if (i === 0) {
					firstId = id;
				}
			}

			if (firstId !== null && doChangeToFirstGroup === true) {
				this.changeToGroup(type, firstId);
			} else {
				this.updategroupsSelector();
			}
		}
	}, {
		key: 'loadStaticGroups',
		value: function loadStaticGroups(doChangeToFirstGroup) {
			var self = this;
			var source, id;
			var g;

			for (var i = this.options.staticGroups.length - 1; i >= 0; i--) {
				g = this.options.staticGroups[i];

				_CalculatorHelpers.CalculatorHelpers.loadGroupsFromSource(g.source, g.url, { maintainerGroup: g.maintainerGroup }, (function (isFirst) {
					return function (err, newGroups) {
						if (err) {
							self.displayAlertMsg(err);
							console.error(err);
							return;
						}

						self.mergeNewGroups(newGroups, 'static', doChangeToFirstGroup && isFirst);
					};
				})(i == 0));
			}
		}
	}, {
		key: 'loadGroupFromGist',
		value: function loadGroupFromGist(gistId, doChangeToFirstGroup, finishedCallback) {
			// clear gistId
			gistId = gistId.toString().trim();
			var match = /([a-zA-Z0-9]+)$/.exec(gistId);
			if (match.length === 2) {
				gistId = match[1];
			}

			var self = this;
			_CalculatorHelpers.CalculatorHelpers.loadGroupsFromSource('gist', gistId, {}, function (err, newGroups) {
				if (err) {
					self.displayAlertMsg(err);
					console.error(err);

					finishedCallback && finishedCallback(err);

					return;
				}

				self.mergeNewGroups(newGroups, 'gist', doChangeToFirstGroup);

				finishedCallback && finishedCallback(null);
			});
		}
	}, {
		key: '_initTour',
		value: function _initTour() {
			var calc = this;
			var tour = new Tour({
				//storage: false,
				debug: false,
				backdropPadding: 10,
				steps: [{
					orphan: true,
					content: i18n.t('calc.tour.welcome'),
					backdrop: true
				}, {
					element: '#groups-selector',
					placement: 'bottom',
					backdrop: true,
					title: '',
					content: i18n.t('calc.tour.choose-dataset-here')
				}, {
					element: '#groups-selector-list',
					placement: 'right',
					content: i18n.t('calc.tour.currently-loaded-datasets'),
					onShow: function onShow(tour) {
						$('#groups-selector').find('> .dropdown-menu').css('display', 'block');
					},
					onHide: function onHide(tour) {
						$('#groups-selector').find('> .dropdown-menu').css('display', '');
					}
				}, {
					element: '#groups-selector > div .row > div:nth-child(2) > div:first-child',
					placement: 'left',
					content: i18n.t('calc.tour.load-dataset-via-gist'),
					onShow: function onShow(tour) {
						$('#groups-selector').find('> .dropdown-menu').css('display', 'block');
					},
					onHide: function onHide(tour) {
						$('#groups-selector').find('> .dropdown-menu').css('display', '');
					}
				}, {
					element: '#groups',
					placement: 'right',
					backdrop: true,
					content: i18n.t('calc.tour.relation-attributes')
				}, {
					element: '#tab-editor-ra > .toolbar',
					placement: 'bottom',
					backdrop: true,
					content: i18n.t('calc.tour.ra-toolbar'),
					onShow: function onShow(tour) {
						// switch to RA tab
						$('#main-editors').find('> ul > li:nth-child(1) > a').tab('show');
					}
				}, {
					element: '#tab-editor-ra .CodeMirror',
					placement: 'top',
					backdrop: true,
					content: i18n.t('calc.tour.ra-statement-goes-here')
				}, {
					element: '#tab-editor-ra .CodeMirror',
					placement: 'top',
					content: i18n.t('calc.tour.ra-example-query'),
					onShow: function onShow(tour) {
						calc.changeToGroup('static', 358242007); // load the R,S,T set

						var editor = calc.state.editors[calc.state.currentEditorName];
						editor.setText("π a, c (\n	σ a < 3 (\n		R ⨝ S\n	)\n)", false);
					}
				}, {
					element: '#tab-editor-ra .CodeMirror',
					placement: 'top',
					content: i18n.t('calc.tour.ra-example-query-plaintext'),
					onShow: function onShow(tour) {
						calc.changeToGroup('static', 358242007); // load the R,S,T set

						var editor = calc.state.editors.ra;
						editor.setText("pi a, c (\n	sigma a < 3 (\n		R join S\n	)\n)", false);
					}
				}, {
					element: '#tab-editor-ra .exec-button',
					placement: 'top',
					reflex: false,
					content: i18n.t('calc.tour.ra-example-execute-it'),
					onNext: function onNext(tour) {

						tour.end();

						var handler = function handler(e) {
							if (e.detail.editor === calc.state.editors.ra) {
								document.removeEventListener('editor.execSuccessful', handler);

								tour.goTo(tour.getCurrentStep() + 1);
								tour.start(true);
							}
						};
						document.addEventListener('editor.execSuccessful', handler, false);
						$('#tab-editor-ra').find('.exec-button').trigger('click');
					}
				}, {
					element: '#tab-editor-ra .exec-result .result',
					placement: 'top',
					backdrop: true,
					content: i18n.t('calc.tour.ra-example-result')
				}, {
					element: '#tab-editor-ra .exec-result .tree > ul',
					placement: 'top',
					backdrop: true,
					content: i18n.t('calc.tour.ra-example-operator-tree')
				},

				// SQL
				{
					element: '#main-editors > ul > li:nth-child(2)',
					placement: 'bottom',
					content: i18n.t('calc.tour.switch-to-sql'),
					onHide: function onHide(tour) {
						// switch to SQL tab
						$('#main-editors').find('> ul > li:nth-child(2) > a').tab('show');
					}
				}, {
					element: '#tab-editor-sql .CodeMirror',
					placement: 'top',
					content: i18n.t('calc.tour.sql-example-query'),
					onShow: function onShow(tour) {
						calc.changeToGroup('static', 358242007); // load the R,S,T set

						var editor = calc.state.editors.sql;
						editor.setText("select distinct a, c\nfrom R\n	natural join S\nwhere a < 3", false);
					}
				}, {
					element: '#tab-editor-sql .exec-button',
					placement: 'top',
					reflex: false,
					content: i18n.t('calc.tour.sql-example-execute-it'),
					onNext: function onNext(tour) {

						tour.end();

						var handler = function handler(e) {
							if (e.detail.editor === calc.state.editors.sql) {
								document.removeEventListener('editor.execSuccessful', handler);

								tour.goTo(tour.getCurrentStep() + 1);
								tour.start(true);
							}
						};
						document.addEventListener('editor.execSuccessful', handler, false);
						$('#tab-editor-sql').find('.exec-button').trigger('click');
					}
				}, {
					element: '#tab-editor-sql .exec-result',
					placement: 'top',
					backdrop: true,
					content: i18n.t('calc.tour.sql-example-result')
				},

				// END
				{
					orphan: true,
					title: 'the end',
					content: i18n.t('calc.tour.end'),
					onShow: function onShow(tour) {
						// switch to relalg tab
						$('#main-editors').find('> ul > li:nth-child(1) > a').tab('show');
					}
				}]
			});
			tour.init();
			return tour;
		}
	}, {
		key: 'startTourWhenNew',
		value: function startTourWhenNew(delayMs) {
			var tour = this.tour;
			setTimeout(function () {
				tour.start();
			}, delayMs);
		}
	}]);

	return Calculator;
})();

exports.Calculator = Calculator;
global.Calculator = Calculator;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../db/relalg":110,"./CalculatorHelpers":80,"./Editor":81,"babel-runtime/core-js/object/keys":6,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/interop-require-wildcard":13}],80:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _dbRelalg = require('../../db/relalg');

var relalgjs = _interopRequireWildcard(_dbRelalg);

// just a collection of static functions

var CalculatorHelpers = (function () {
	function CalculatorHelpers() {
		_classCallCheck(this, CalculatorHelpers);
	}

	_createClass(CalculatorHelpers, null, [{
		key: 'StringHashCode',
		value: function StringHashCode(str) {
			// http://stackoverflow.com/a/7616484
			var hash = 0,
			    i,
			    chr,
			    len;
			if (str.length === 0) return hash;
			for (i = 0, len = str.length; i < len; i++) {
				chr = str.charCodeAt(i);
				hash = (hash << 5) - hash + chr;
				hash |= 0; // Convert to 32bit integer
			}
			return hash;
		}
	}, {
		key: 'parseGroupsFromDefinition',
		value: function parseGroupsFromDefinition(text, groupInfo, sourceInfo) {
			var groupAst = relalgjs.parseRelalgGroup(text);
			return CalculatorHelpers.getGroupsFromGroupAst(groupAst, groupInfo, sourceInfo);
		}
	}, {
		key: 'getGroupsFromGroupAst',
		value: function getGroupsFromGroupAst(groupAst, groupInfo, sourceInfo) {
			var groups = [];
			for (var i = 0; i < groupAst.groups.length; i++) {
				var ast_group = groupAst.groups[i];
				relalgjs.replaceVariables(ast_group, []);

				var group = {
					groupName: ast_group.headers.group,
					groupDesc: ast_group.headers.description || '',
					tables: [],
					groupInfo: groupInfo || null,
					sourceInfo: sourceInfo || null,
					definition: ast_group.codeInfo.text
				};

				// tables
				for (var j = 0; j < ast_group.assignments.length; j++) {
					var result = relalgjs.relalgFromRelalgAstNode(ast_group.assignments[j].child, []);
					result.check();

					var relation = result.getResult().createRelation(ast_group.assignments[j].name);

					var schema = relation.getSchema();
					var columnNames = new Array(schema.getSize());
					var columnTypes = new Array(schema.getSize());
					for (var k = 0; k < schema.getSize(); k++) {
						var c = schema.getColumn(k);
						columnNames[k] = c.getName();
						columnTypes[k] = c.getType();
					}

					group.tables[j] = {
						tableId: 1,
						tableName: ast_group.assignments[j].name,
						columnNames: columnNames,
						columnTypes: columnTypes,
						relation: relation
					};
				}

				groups.push(group);
			}
			return groups;
		}

		/**
   * load group defnition(s) from a remote location;
   * finishedCallback(err, newGroups)
   */
	}, {
		key: 'loadGroupsFromSource',
		value: function loadGroupsFromSource(source, id, sourceInfo, finishedCallback) {
			if (!sourceInfo) sourceInfo = {};

			function fuzzy_time(date) {
				var diff = (new Date() - date) / 1000; // seconds
				var days = Math.ceil(diff / 86400);
				return diff < 60 && 'just now' || diff < 120 && 'one minute ago' || diff < 3600 && Math.ceil(diff / 60) + ' minutes ago' || diff < 7200 && 'one hour ago' || diff < 86400 && Math.floor(diff / 3600) + ' hours ago' || diff < 86400 && 'yesterday' || days < 7 && days + ' days ago' || days < 14 && 'one week ago' || days < 365 && Math.floor(days / 7) + ' weeks ago' || days < 730 && 'one year ago' || Math.floor(days / 365) + ' years ago';
			}

			function gist_success(data) {
				var newGroups = [];
				for (var i in data.files) {
					var info = $('<p>Source: </p>').append($('<a target="_blank">gist.github.com</a>').attr('href', data.html_url));
					var additional = $('<br><small class="text-muted">');

					// owner
					additional.append('by ');
					if (data.owner) additional.append($('<a target="_blank">').attr('href', data.owner.html_url).text(data.owner.login));else additional.append('anonymous');

					if (data.comments > 0) additional.append(' (' + data.comments + ' comment' + (data.comments > 1 ? 's)' : ')'));

					additional.append('<br>last modified ' + fuzzy_time(new Date(data.updated_at)));

					info.append(additional);

					try {
						newGroups = newGroups.concat(CalculatorHelpers.parseGroupsFromDefinition(data.files[i].content, info, sourceInfo));

						finishedCallback && finishedCallback(null, newGroups);
					} catch (e) {
						var msg = 'could not parse given group from gist with id "' + id + '": ' + e;
						console.error(msg, id, e);
						finishedCallback && finishedCallback(msg, null);
					}
				}
			}

			switch (source) {
				case 'gist':
					jQuery.ajax({
						url: 'https://api.github.com/gists/' + id,
						success: gist_success,
						crossDomain: true,
						statusCode: {
							404: function _() {
								finishedCallback && finishedCallback('gist ' + id + ' not found', null);
							}
						},
						async: true
					});
					break;
				case 'http':
					// load all local groups stored in seperate file
					$.get(id, function (data) {
						try {
							var newGroups = CalculatorHelpers.parseGroupsFromDefinition(data, '', sourceInfo);

							finishedCallback && finishedCallback(null, newGroups);
						} catch (e) {

							var msg = 'cannot parse groups file: ' + e.message;
							if (e.line) msg += ' in line    ' + e.line;
							msg += '<br>see log for more information';

							console.error(msg, e);
							finishedCallback && finishedCallback(msg, null);
						}
					});

					break;
				default:
					throw new Error('unknown source ' + source);
			}
		}
	}, {
		key: 'getRaResultHtml',
		value: function getRaResultHtml(raNode) {
			var maxLinesPerPage = 50;
			var container = $('<div>');

			// formula
			container.html($('<h4 class="result-formula">').append(raNode.getFormulaHtml(true, false)));

			var resultContainer = $('<div class="result-table">');
			container.append(resultContainer);

			var start_time = new Date().getTime();

			var result = raNode.getResult();

			if (global.DEBUG) console.log(result.getNumRows() + ' rows in ' + (new Date().getTime() - start_time) + 'ms');

			var table = $(result.getHtml(false, maxLinesPerPage, 0));
			table.addClass('table').addClass('table-condensed');

			resultContainer.html(table);

			var numPages = Math.ceil(result.getNumRows() / maxLinesPerPage);
			if (numPages > 1) {
				var pag = $('<div class="result-pag">');
				resultContainer.append(pag);

				pag.bootpag({
					total: numPages,
					page: 1,
					maxVisible: 10,
					leaps: false
				}).on('page', (function (oldTable, result, maxLinesPerPage) {
					return function (event, num) {
						var table = $(result.getHtml(false, maxLinesPerPage, (num - 1) * maxLinesPerPage));

						oldTable.find('> tbody').replaceWith(table.find('> tbody'));
					};
				})(table, result, maxLinesPerPage));
				pag.find(' > ul').addClass('pagination');
			}

			//return result.getNumRows();
			return container;
		}

		/** generate a syntaxtree from an RA-tree */
	}, {
		key: 'getRaTreeHtml',
		value: function getRaTreeHtml(root, numColorsArg) {
			var ul = $('<ul>');

			var numColors = !numColorsArg ? 0 : numColorsArg;
			var usedVariables = 0;
			var usedVariableNames = {};

			var rec = function rec(n) {
				var li = $('<li>');
				var fromVariableMarker = null;

				// formula
				var formula = $('<a>');
				formula.addClass('formula');

				if (n.hasMetaData('fromVariable')) {
					var variableName = n.getMetaData('fromVariable');
					if (typeof usedVariableNames[variableName] === 'undefined') usedVariableNames[variableName] = usedVariables++;

					var num = usedVariableNames[variableName] % numColors;
					fromVariableMarker = '<span class="label label-info label-info-' + num + '">' + variableName + ' =</span> ';
					formula.append(fromVariableMarker);
				}

				formula.popover({
					trigger: 'hover',
					container: 'body',
					placement: 'right',
					title: (function () {
						var title = $('<div>');
						if (n.hasMetaData('fromVariable')) title.append(fromVariableMarker);
						title.append(n.getFormulaHtml(true, false));

						return title;
					})(),
					content: (function (n) {
						var schema_ul = $('<ul>');
						var schema = n.getSchema();
						var i;

						for (i = 0; i < schema.getSize(); i++) {
							schema_ul.append($('<li>').append(schema.getColumn(i).toString()).append(' ').append('<small class="muted text-muted">' + schema.getType(i) + '</small>'));
						}

						var numRows = n.getResultNumRows();

						var container = $('<div>').append('columns:').append(schema_ul);

						if (n.hasMetaData('naturalJoinConditions')) {
							var ul = $('<ul>');
							var conditions = n.getMetaData('naturalJoinConditions');
							for (i = 0; i < conditions.length; i++) {
								ul.append($('<li>').append(conditions[i].getFormulaHtml(true, false)));
							}
							container.append($('<div>natural join conditions:</div>').append(ul));
						}

						container.append('<p>' + numRows + ' row' + (numRows == 1 ? '' : 's') + '</p>');

						// add inline table definition
						if (n.hasMetaData('isInlineRelation') && n.getMetaData('isInlineRelation') === true && n.hasMetaData('inlineRelationDefinition')) {
							container.append($('<pre>').text(n.getMetaData('inlineRelationDefinition')));
						}

						return container;
					})(n),
					html: true
				});

				formula.append(n.getFormulaHtml(false, false));
				formula.data('raNode', n);

				li.append(formula);

				// first child
				if (n.hasChild() || n.hasChild2()) {
					var ul = $('<ul>');
					if (n.hasChild()) ul.append(rec(n.getChild()));
					if (n.hasChild2()) ul.append(rec(n.getChild2()));
					li.append(ul);
				}

				return li;
			};

			return ul.append(rec(root));
		}
	}]);

	return CalculatorHelpers;
})();

exports.CalculatorHelpers = CalculatorHelpers;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../db/relalg":110,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/interop-require-wildcard":13}],81:[function(require,module,exports){
(function (global){
/*jshint -W116, -W030, -W083 */
/*global CodeMirror, $, jQuery, document, window, Blob, setTimeout, Handsontable */

'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _dbRelalg = require('../../db/relalg');

var relalgjs = _interopRequireWildcard(_dbRelalg);

global.DEBUG = true;

// Polyfill for creating CustomEvents on IE9/10/11
// code pulled from:
// https://github.com/d4tocchini/customevent-polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill
if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
	var CustomEvent = function CustomEvent(event, params) {
		var evt;
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};

		evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	};

	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent; // expose definition to window
}

CodeMirror.defineMode('ra', function () {
	var keywords = ['pi', 'sigma', 'rho', 'tau', '<-', '->', 'intersect', 'union', 'except', '/', '-', '\\\\', 'x', 'cross join', 'join', 'inner join', 'natural join', 'left join', 'right join', 'left outer join', 'right outer join', 'left semi join', 'right semi join', 'anti join', 'anti semi join', 'and', 'or', 'xor'];
	var keywordsMath = ['π', 'σ', 'ρ', 'τ', '←', '→', '∩', '∪', '÷', '-', '⨯', '⨝', '⟕', '⟖', '⟗', '⋉', '⋊', '▷'];
	var operators = ['<-', '->', '>=', '<=', '=', '∧', '∨', '⊻', '⊕', '≠', '=', '¬', '>', '<', '≥', '≤'];
	var matchAny = function matchAny(stream, array, consume, successorPattern) {
		for (var i = 0; i < array.length; i++) {
			var needle;
			if (!successorPattern) needle = array[i];else needle = new RegExp('^' + array[i] + successorPattern);

			if (stream.match(needle, consume)) return true;
		}
		return false;
	};
	var seperators = '([\\(\\)\[\\]\{\\}, \\.\\t]|$)';

	return {
		startState: function startState() {
			return {
				inBlockComment: false
			};
		},
		token: function token(stream, state) {
			if (state.inBlockComment) {
				if (stream.match(/.*?\*\//, true)) state.inBlockComment = false;else stream.match(/.*/, true);
				return 'comment';
			} else if (!state.inBlockComment && stream.match(/^\/\*.*/, true)) {
				state.inBlockComment = true;
				return 'comment';
			} else if (state.inInlineRelation) {
				if (stream.match(/.*?}/, true)) state.inInlineRelation = false;else stream.match(/.*/, true);
				return 'inlineRelation';
			} else if (stream.match(/^{/, true)) {
				state.inInlineRelation = true;
				return 'inlineRelation';
			} else if (stream.match(/^--[\t ]/, true)) {
				stream.skipToEnd();
				return 'comment';
			} else if (stream.match(/^\/\*.*?$/, true)) {
				return 'comment';
			} else if (matchAny(stream, keywordsMath, true)) {
				return 'keyword math'; // needed for the correct font
			} else if (matchAny(stream, keywords, true, seperators)) {
					return 'keyword';
				} else if (matchAny(stream, operators, true)) {
					return 'operator math';
				} else if (stream.match(/^\[[0-9]+]/, true)) {
					return 'attribute';
				} else if (stream.match(/^[0-9]+(\.[0-9]+)?/, true)) {
					return 'number';
				} else if (stream.match(/\^'[^']*'/i, true)) {
					return 'string';
				} else if (stream.match(/\^[a-z]+\.[a-z]*/i, true)) {
					return 'qualified-column';
				} else if (stream.match(/^[\(\)\[]\{},]/i, true)) {
					return 'bracket';
				} else if (stream.match(/^[a-z][a-z0-9\.]*/i, true)) {
					return 'word';
				} else {
					stream.next();
					return 'else';
				}
		}
	};
});

var Editor = (function () {
	function Editor(options) {
		_classCallCheck(this, Editor);

		this.options = {
			textarea: $(options.textarea),
			execErrors: $(options.execErrors),
			execButton: $(options.execButton),
			downloadButton: options.downloadButton ? $(options.downloadButton) : null,
			historyContainer: options.execButton ? $(options.historyContainer) : null,

			execFunction: options.execFunction, // function(query), sync, should throw exception on error
			linterFunction: options.linterFunction, // function(text), sync, should throw exception on error or return an array of strings used as hints in the future
			getHintsFunction: options.getHintsFunction,

			enableInlineRelationEditor: options.enableInlineRelationEditor || false,

			historyMaxEntries: typeof options.historyMaxEntries !== 'undefined' ? options.historyMaxEntries : 10,
			historyMaxLabelLength: options.historyMaxLabelLength ? options.historyMaxLabelLength : 20,

			eventExecSuccessfulName: 'editor.execSuccessful',
			gutterClass: 'CodeMirror-table-edit-markers'
		};
		this.state = {
			editor: null,

			history: [],
			hinter: {
				hints: [],
				hintsFromLinter: [],
				changed: true
			}
		};

		var self = this;

		var codeMirrorOptions = {
			smartdent: true,
			tabSize: 2,
			indentWithTabs: true,
			lineNumbers: true,
			lineWrapping: true,
			matchBrackets: true,
			autoCloseBrackets: true,
			smartIndent: true,
			autofocus: false,
			gutters: ['CodeMirror-lint-markers'],
			//lint: true,
			mode: 'custom',
			viewportMargin: Infinity,
			extraKeys: {
				'Shift-Tab': 'indentLess',
				'Ctrl-Enter': function CtrlEnter(cm) {
					self.exec(false);
				},
				'Shift-Ctrl-Enter': function ShiftCtrlEnter(cm) {
					if (self.state.editor.somethingSelected()) self.exec(true);
				},
				'Ctrl-S': function CtrlS(cm) {
					self.downloadEditorText();
				},
				'Ctrl-Space': function CtrlSpace(cm) {
					CodeMirror.showHint(cm, function (cm) {
						return self.genericHint(cm);
					}, {
						closeOnUnfocus: true
					});
				}

			},
			placeholder: i18n.t('editor.codemirror-placeholder')
		};
		if (options.codeMirrorOptions) {
			jQuery.extend(codeMirrorOptions, options.codeMirrorOptions);
		}
		if (options.enableInlineRelationEditor) {
			codeMirrorOptions.gutters.push(this.options.gutterClass);
		}

		this.state.editor = CodeMirror.fromTextArea(this.options.textarea[0], codeMirrorOptions);

		if (this.options.linterFunction) {
			//var mode = this.state.editor.getOption('mode');

			this.state.editor.setOption('lint', function (text) {
				return self.linter(text);
			});
		}

		this.state.editor.on('cursorActivity', function (cm) {
			if (self.state.editor.somethingSelected()) {
				self.options.execButton.addClass('selection-selected');
			} else self.options.execButton.removeClass('selection-selected');
		});

		this.options.execButton.click(function () {
			self.exec(self.state.editor.somethingSelected());
		});

		if (this.options.downloadButton) {
			this.options.downloadButton.click(function () {
				self.downloadEditorText();
			});
		}
	}

	_createClass(Editor, [{
		key: 'forceLinterRun',
		value: function forceLinterRun() {
			// remove and insert text to force linter to run
			var editor = this.state.editor;
			var text = editor.getValue();
			editor.setValue('');
			editor.setValue(text);
		}
	}, {
		key: 'historyAddEntry',
		value: function historyAddEntry(code) {
			var historyMaxEntries = this.options.historyMaxEntries;
			var historyMaxLabelLength = this.options.historyMaxLabelLength;

			var format_time = function format_time(t) {
				var h = t.getHours() >= 10 ? t.getHours() : '0' + t.getHours();
				var m = t.getMinutes() >= 10 ? t.getMinutes() : '0' + t.getMinutes();
				var s = t.getSeconds() >= 10 ? t.getSeconds() : '0' + t.getSeconds();
				return h + ':' + m + ':' + s;
			};

			var time = format_time(new Date());
			var label = code.length > historyMaxLabelLength ? code.substr(0, historyMaxLabelLength - 4) + ' ...' : code;

			var entry = {
				time: time,
				label: label,
				code: code
			};

			this.state.history.push(entry);
			this.state.history = this.state.history.slice(-historyMaxEntries);
		}
	}, {
		key: 'updateHistoryList',
		value: function updateHistoryList() {
			if (this.options.historyContainer === null) {
				return;
			}

			var row, codeNode, i, entry;
			var history = this.state.history;
			var historyButton = this.options.historyContainer.find('.btn');
			var historyUl = this.options.historyContainer.find('ul');

			historyUl.empty();
			for (i = 0; i < history.length; i++) {
				entry = history[i];

				row = $('<li>').append('<small class="muted text-muted">' + entry.time + '</small>');

				codeNode = $('<div>').text(entry.code).addClass('replace-all').data('text', entry.code);

				// colorize the code
				codeNode.addClass('colorize');
				CodeMirror.colorize(codeNode, this.state.editor.getOption('mode'));

				row.append(codeNode);

				historyUl.prepend(row);
			}

			if (history.length > 0) {
				historyButton.removeClass('disabled');
			} else {
				historyButton.addClass('disabled');
			}
		}
	}, {
		key: 'clearExecutionAlerts',
		value: function clearExecutionAlerts() {
			var execErrors = this.options.execErrors;
			var execButton = this.options.execButton;

			execErrors.empty();
			execButton.removeClass('btn-danger');
		}
	}, {
		key: 'addExecutionWarning',
		value: function addExecutionWarning(msg, position) {
			this._addExecutionAlert(msg, position, 'warning');
		}
	}, {
		key: 'addExecutionError',
		value: function addExecutionError(msg, position) {
			this._addExecutionAlert(msg, position, 'error');
		}
	}, {
		key: '_addExecutionAlert',
		value: function _addExecutionAlert(msg, position, type) {
			var execErrors = this.options.execErrors;
			var execButton = this.options.execButton;
			// position = {line, ch}
			var editor = this.state.editor;
			var name = ({
				'error': i18n.t('editor.alert-message-headers.error'),
				'warning': i18n.t('editor.alert-message-headers.warning')
			})[type];
			var className = ({
				'error': 'alert-danger',
				'warning': 'alert-warning'
			})[type];

			var el = $('<div class="alert ' + className + '"></div>');
			if (position) {
				el.append($('<strong>' + name + ' <a href="#">' + i18n.t('editor.error-at-line-x', { line: position.line + 1 }) + '</a>: </strong>'));
				el.find('a').click(function (event) {
					editor.focus();
					editor.setCursor(position);
					editor.scrollIntoView(null, 42);

					event.preventDefault();
					return false;
				});
			} else {
				el.append('<strong>' + name + ': </strong>');
			}

			el.append(msg);
			execErrors.append(el);
			if (!execButton.hasClass('btn-danger')) execButton.addClass('btn-danger');
		}
	}, {
		key: 'setText',
		value: function setText(text, replaceSelection) {
			if (replaceSelection === true) {
				this.state.editor.replaceSelection(text, 'end');
			} else {
				this.state.editor.setValue(text);
			}

			this.clearExecutionAlerts();
			this.options.execButton.removeClass('btn-danger btn-success');
		}
	}, {
		key: 'getText',
		value: function getText() {
			return this.state.editor.getValue();
		}
	}, {
		key: 'focus',
		value: function focus() {
			this.state.editor.focus();
		}
	}, {
		key: 'refresh',
		value: function refresh() {
			this.state.editor.refresh();
		}
	}, {
		key: 'downloadEditorText',
		value: function downloadEditorText(basename) {
			var filename = basename || 'query';

			switch (this.state.editor.getOption('mode')) {
				case 'sql':
				/* falls through */
				case 'text/x-mysql':
					filename += '.sql';
					break;
				case 'ra':
				/* falls through */
				default:
					filename += '.txt';
					break;
			}

			function download_text(filename, text) {
				var a = document.createElement('a');
				//noinspection JSUnresolvedFunction
				a.href = window.URL.createObjectURL(new Blob([text], { 'type': 'text/plain' }));
				a.download = filename;
				a.click();
			}

			download_text(filename, this.state.editor.getValue());
		}
	}, {
		key: 'createGist',
		value: function createGist() {
			var text = this.state.editor.getValue();

			var data = {
				"description": "posting gist test",
				"public": false,
				"files": {
					"content.txt": {
						"content": text
					}
				}
			};

			$.ajax({
				url: 'https://api.github.com/gists',
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify(data)
			}).success(function (e) {
				console.log(e);
			}).error(function (e) {
				console.warn("gist save error", e);
			});
		}

		// should be called after group change
	}, {
		key: 'resetHinter',
		value: function resetHinter() {
			this.state.hinter = {
				hintsHash: {},
				hintsFromLinter: [],
				changed: true
			};
		}
	}, {
		key: 'linter',
		value: function linter(text) {
			if (text.length === 0 || !this.options.linterFunction) {
				return [];
			}

			try {
				var hintsFromLinter = this.options.linterFunction.call(this, text);

				if (hintsFromLinter.length === 0 && this.state.hinter.hintsFromLinter.length === 0) {
					// no hint recreation needed
				} else {
						this.state.hinter.hintsFromLinter = hintsFromLinter;
						this.state.hinter.changed = true;
					}

				return []; // no errors to display
			} catch (e) {
				var found = [];

				if (global.DEBUG) console.log(e);

				if (!e.line || !e.column) {
					this.clearExecutionAlerts();
					this.addExecutionError(e.message);
					return [];
				}

				var line = e.line - 1;
				var column = e.column - 1;
				var message = e.message.replace(/(\\(u|x)[0-9A-F]+)/g, function (str, group0) {
					return String.fromCharCode(parseInt(group0.substr(2), 16));
				});

				// find the length of the token
				var len;
				if (e.codeInfo) {
					len = e.codeInfo.text.length;
				} else {
					// try to find token to mark current token
					var token = this.state.editor.getTokenAt({
						line: line,
						ch: column + 1
					});
					if (typeof token.string == 'undefined') len = 10;else len = Math.max(token.string.length, 1);
				}

				found.push({
					from: CodeMirror.Pos(line, column),
					to: CodeMirror.Pos(line, column + len),
					message: message,
					severity: 'error'
				});

				if (this.options.enableInlineRelationEditor) this.clearInlineRelationMarkers();

				return found;
			}
		}
	}, {
		key: 'genericHint',
		value: function genericHint(cm) {
			var cur = cm.getCursor();
			var token = cm.getTokenAt(cur);
			var getObj = function getObj(text, category) {
				return {
					text: text,
					displayText: text,
					className: 'hint-' + (category || 'unknown')
				};
			};

			var hinterCache = this.state.hinter;

			var hints, i, unfilteredObj, hintText;
			var unfiltered;

			if (hinterCache.changed === true) {
				// recreate unfiltered hints
				unfilteredObj = {}; // use object to eliminate duplicates

				if (this.options.getHintsFunction) {
					hints = this.options.getHintsFunction();
				} else {
					hints = [];
				}

				// add keywords
				for (i = 0; i < hints.length; i++) {
					unfilteredObj[hints[i]] = getObj(hints[i]);
				}

				// add hints from linter
				for (i = 0; i < hinterCache.hintsFromLinter.length; i++) {
					hintText = hinterCache.hintsFromLinter[i];

					unfilteredObj[hintText] = getObj(hintText);
				}

				// copy to array
				unfiltered = [];
				for (hintText in unfilteredObj) {
					if (!unfilteredObj.hasOwnProperty(hintText)) continue;

					unfiltered.push(unfilteredObj[hintText]);
				}

				hinterCache.hints = unfiltered;
				hinterCache.changed = false;
			} else {
				unfiltered = hinterCache.hints;
			}

			// filter
			var filtered = [],
			    kwText;
			var tokenText = token.string;

			if (tokenText.length > 0) {
				for (i = 0; i < unfiltered.length; i++) {
					kwText = unfiltered[i].text;
					if (kwText.length > tokenText.length && kwText.indexOf(tokenText) === 0) {
						filtered.push(unfiltered[i]);
					}
				}
			} else {
				// no text => full hint list
				filtered = unfiltered;
			}

			return {
				list: filtered,
				from: CodeMirror.Pos(cur.line, token.start),
				to: CodeMirror.Pos(cur.line, token.end)
			};
		}
	}, {
		key: 'exec',
		value: function exec(selectionOnly) {
			var editor = this.state.editor;
			var offset = {
				line: 0,
				ch: 0
			};
			var lastLine = 0;
			var query = '';
			var self = this;

			function getCodemirrorPosFromCodePos(pos) {
				if (typeof pos === 'undefined') {
					return undefined;
				}

				return {
					line: offset.line + pos.line - 1,
					ch: offset.ch + (pos.column || 1) - 1
				};
			}

			function getPosFromErrorObj(obj) {
				if (typeof obj.line !== 'undefined' && typeof obj.column !== 'undefined') {
					return {
						line: obj.line,
						column: obj.column
					};
				} else if (typeof obj.codeInfo !== 'undefined' && typeof obj.codeInfo.line !== 'undefined' && typeof obj.codeInfo.column !== 'undefined') {
					return {
						line: obj.codeInfo.line,
						ch: obj.codeInfo.column
					};
				} else {
					return undefined;
				}
			}

			if (selectionOnly !== true) {
				// execute whole text
				query = editor.getValue();
				lastLine = editor.lineCount() - 1;
			} else {
				// execute selection
				query = editor.getSelection();
				offset = editor.getCursor('from');

				lastLine = editor.getCursor('end').line;
			}
			if (query.length === 0) {
				this.clearExecutionAlerts();
				this.addExecutionError(i18n.t('editor.error-no-query-found'));
				return;
			}

			this.clearExecutionAlerts();

			try {
				this.options.execFunction.call(this, query, function (msg) {
					self.addExecutionWarning(msg);
				});
				this.options.execButton.removeClass('btn-danger').addClass('btn-success');

				var event = new (CustomEvent || window.CustomEvent)(this.options.eventExecSuccessfulName, {
					'detail': {
						editor: this
					}
				});
				document.dispatchEvent(event);

				return true;
			} catch (e) {
				if (global.DEBUG) console.log(e, e.stack);

				// fallback if it is a string
				var message = typeof e.message !== 'undefined' ? e.message : e;

				// try to generate translated pegjs error messages
				if (e.name && e.name === 'SyntaxError' && typeof e.expected !== 'undefined' && e.expected !== null && typeof e.found !== 'undefined') {
					message = Editor.buildTranslatedPegJsMessage(e.expected, e.found);
				}

				// replace \xHEX chars generated by pegjs
				message = message.replace(/(\\(u|x)[0-9A-F]+)/g, function (str, group0) {
					return '<span class="math">' + String.fromCharCode(parseInt(group0.substr(2), 16)) + '</span>';
				});

				this.addExecutionError(message, getCodemirrorPosFromCodePos(getPosFromErrorObj(e)));

				this.options.execButton.removeClass('btn-success').addClass('btn-danger');

				if (this.options.enableInlineRelationEditor) this.clearInlineRelationMarkers();

				return false;
			}
		}

		/* this is a modified version of the original pegjs function
   * source: https://github.com/pegjs/pegjs/blob/v0.8.0/lib/compiler/passes/generate-javascript.js#L849-L937
   */
	}, {
		key: 'setExecutionDisabled',
		value: function setExecutionDisabled(enable) {
			if (enable === false) {
				this.options.execButton.removeClass('disabled');
			} else {
				this.options.execButton.addClass('disabled');
			}
		}
	}, {
		key: 'setReadOnly',
		value: function setReadOnly(enable) {
			var editor = this.state.editor;
			var wrapper = $(editor.getWrapperElement());

			if (enable === false) {
				editor.setOption('readOnly', false);
				wrapper.removeClass('readonly');
			} else {
				editor.setOption('readOnly', 'nocursor');
				wrapper.addClass('readonly');
			}
		}
	}, {
		key: 'openModalInlineEditor_inlineRelationNew',
		value: function openModalInlineEditor_inlineRelationNew() {
			var self = this;
			var editor = this.state.editor;
			var widget;
			var cursor = editor.getCursor();
			var container = this.getInlineRelationEditor(null, function (err, tableStr) {
				if (!err) {
					editor.replaceRange(tableStr, cursor, cursor);
				}
				widget.clear();
				self.setReadOnly(false);
				self.setExecutionDisabled(false);
				self.forceLinterRun();
			});

			widget = editor.addLineWidget(cursor.line, container, {
				coverGutter: false
			});
			setTimeout(function () {
				$(container).find('> .editor').handsontable("selectCell", 0, 0);
			}, 50);

			this.setReadOnly(true);
			this.setExecutionDisabled(true);
		}
	}, {
		key: 'openModalInlineEditor_inlineRelationChange',
		value: function openModalInlineEditor_inlineRelationChange(table) {
			var self = this;
			var editor = this.state.editor;
			var widget;
			var mark;
			var from = { line: table.line, ch: table.column };
			var to = editor.findPosH(from, table.length, 'char');

			var container = this.getInlineRelationEditor(table.content, function (err, tableStr) {
				mark.clear();
				widget.clear();
				if (!err) {
					editor.replaceRange(tableStr, from, to);
				}
				self.setReadOnly(false);
				self.setExecutionDisabled(false);
				self.forceLinterRun();
			});

			mark = editor.markText(from, to, {
				collapsed: true,
				readOnly: true,
				replacedWith: $('<i class="fa fa-table"></i>')[0]
			});

			this.setReadOnly(true);
			this.setExecutionDisabled(true);
			widget = editor.addLineWidget(table.line, container);

			// try to set focus on new editor
			setTimeout(function () {
				$(container).find('> .editor').handsontable("selectCell", 0, 0);
			}, 50);
		}
	}, {
		key: 'getInlineRelationEditor',
		value: function getInlineRelationEditor(content, callback) {
			/** Handsontable */
			var handsontable = null;
			var data, i, j, row, value, tmp;

			var container = $('<div class="grid-editor-container"><div class="editor"></div><div class="errors alert alert-danger" style="display: none;"></div></div>');
			var gridContainer = container.find('> .editor');
			var errorContainer = container.find('> .errors');
			var btnOk = $('<button class="btn btn-primary disabled">' + i18n.t('editor.inline-relation-editor.button-ok') + '</button>').click(function () {
				var tableStr = processGrid(handsontable);

				if (tableStr === false) {
					console.error('this should not happen; button should be disabled');
					callback && callback('this should not happen; button should be disabled', null);
					return;
				}

				callback && callback(null, tableStr);
			});
			var btnCancel = $('<button class="btn btn-default">' + i18n.t('editor.inline-relation-editor.button-cancel') + '</button>').click(function () {
				callback && callback('cancel', null);
			});

			container.append(btnOk);
			container.append(btnCancel);

			function dateFormatISO(val) {
				return val.getFullYear() + '-' + (val.getMonth() + 1 < 10 ? '0' + (val.getMonth() + 1) : val.getMonth() + 1) + '-' + (val.getDate() < 10 ? '0' + val.getDate() : val.getDate());
			}

			function processGrid(handsontable) {
				var i, j, row, value;
				var text = '{\n';
				var quotedSingle, quotedDouble;
				var emptyColumns = handsontable.countEmptyCols(true);
				var emptyRows = handsontable.countEmptyRows(true);

				try {
					if (data.length > 0 && data[0].length === emptyColumns && data.length === emptyRows) {
						throw new Error(i18n.t('editor.inline-relation-editor.enter-your-data'));
					}

					for (i = 0; i < data.length - emptyRows; i++) {
						row = data[i];
						for (j = 0; j < row.length - emptyColumns; j++) {
							value = row[j];

							if (j !== 0) {
								text += '\t';
							}

							// remove quotes
							if (/^'.*'$|^".*"$/.test(value)) {
								value = value.substr(1, value.length - 2);
							}

							if (i === 0 && value === null) {
								throw new Error(i18n.t('editor.inline-relation-editor.error-column-name-missing', { index: j + 1 }));
							} else if (value === null || typeof value === 'string' && value.toLowerCase() === 'null') {
								text += 'null';
							} else if (i === 0 || /^[\-_a-zA-Z0-9\.]+$/.test(value) || /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) || typeof value === 'number') {
								text += value;
							} else if (value instanceof Date) {
								text += dateFormatISO(value);
							} else {
								quotedSingle = value.indexOf("'") !== -1;
								quotedDouble = value.indexOf('"') !== -1;

								if (quotedSingle && quotedDouble) {
									throw new Error(i18n.t('editor.inline-relation-editor.error-wrong-quoted-string'));
								} else if (quotedSingle) {
									text += '"' + value + '"';
								} else {
									text += "'" + value + "'";
								}
							}
						}

						text += '\n';
					}
					text += '}';

					var ast = relalgjs.parseRelalg(text, []);
					var result = relalgjs.textFromRelalgAstRoot(ast);
					//resultContainer.html(result);
					console.log(result);

					errorContainer.hide();
					btnOk.removeClass('disabled');

					return result;
				} catch (e) {
					console.log(e.message);
					errorContainer.html(e.message).show();

					btnOk.addClass('disabled');

					return false;
				}
			}

			var boldRenderer = function boldRenderer(instance, td, row, col, prop, value, cellProperties) {
				Handsontable.renderers.TextRenderer.apply(this, arguments);
				td.style.fontWeight = 'bold';
			};

			function valueRenderer(instance, td, row, col, prop, value, cellProperties) {
				Handsontable.renderers.TextRenderer.apply(this, arguments);

				if (value === 'null') {
					td.style.fontStyle = 'italic';
					td.style.background = '#eee';
				}
			}

			// build data array
			if (content) {
				data = [];

				// column definitions
				row = [];
				for (i = 0; i < content.columns.length; i++) {
					tmp = content.columns[i].relAlias ? content.columns[i].relAlias + '.' : '';
					row.push(tmp + content.columns[i].name + ':' + content.columns[i].type);
				}
				data.push(row);

				// rows
				for (i = 0; i < content.rows.length; i++) {
					row = [];
					for (j = 0; j < content.rows[i].length; j++) {
						value = content.rows[i][j];

						if (value instanceof Date) {
							value = dateFormatISO(value);
						} else if (value === null) {
							value = 'null';
						}

						row.push(value);
					}
					data.push(row);
				}
			} else {
				data = [[], []];
			}

			gridContainer.handsontable({
				data: data,
				minRows: 2,
				minCols: 2,
				minSpareRows: 1,
				minSpareCols: 1,
				fixedRowsTop: 1,
				rowHeaders: false,
				colHeaders: false,
				pasteMode: 'overwrite',
				tabMoves: function tabMoves(event) {
					// allows to tab out of the grid

					if (event.shiftKey) {
						return { row: 0, col: -1 };
					}

					/* jump to out of the grid and focus one of the buttons if [TAB] was pressed in
      * the spare column */
					var selection = handsontable.getSelected();
					var startCol = selection[1];

					if (startCol === handsontable.countCols() - 1 && handsontable.isEmptyCol(startCol)) {
						setTimeout(function () {
							handsontable.deselectCell();
							container.find("button:not(.disabled)").first().focus();
						}, 0);
						return { row: 0, col: 0 };
					} else {
						return { row: 0, col: 1 };
					}
				},
				cells: function cells(row, col, prop) {
					// select render function depending on position
					var cellProperties = {};

					if (row === 0) {
						cellProperties.renderer = boldRenderer;
						cellProperties.placeholder = i18n.t('editor.inline-relation-editor.placeholder-column-name-and-types');
					} else {
						cellProperties.renderer = valueRenderer;

						cellProperties.validator = function (value, callback) {
							if (typeof value === 'string') {
								var quotedSingle = value.indexOf("'") !== -1;
								var quotedDouble = value.indexOf('"') !== -1;

								if (quotedDouble && quotedSingle) {
									callback(false);
									return;
								}
							}

							callback(true);
						};
						//cellProperties.placeholder = 'value';
					}
					return cellProperties;
				},

				allowInvalid: true,
				beforeChange: function beforeChange(changes, source) {
					var i;

					// set all empty cells to null
					for (i = 0; i < changes.length; i++) {
						if (changes[i][3] === '') {
							changes[i][3] = null;
						}
					}
				},
				afterChange: function afterChange(changes, source) {
					var emptyRows = this.countEmptyRows(true) - this.getSettings().minSpareRows;
					if (emptyRows > 0) this.alter('remove_row', this.countRows() - 1 - emptyRows, emptyRows);

					var emptyCols = this.countEmptyCols(true) - this.getSettings().minSpareCols;
					if (emptyCols > 0) this.alter('remove_col', this.countCols() - 1 - emptyCols, emptyCols);

					processGrid(this);
				}
			});
			handsontable = gridContainer.handsontable('getInstance');

			return container.get(0);
		}
	}, {
		key: 'addInlineRelationMarkers',
		value: function addInlineRelationMarkers(root) {
			var editor = this.state.editor;
			var getTables = function getTables(root) {
				var a = [];
				var i, j;
				var rec = function rec(parent, attrName, a) {
					var child = parent[attrName];

					if (child.type == 'table') {
						// replace
						a.push({
							name: child.name,
							line: child.codeInfo.line - 1,
							column: child.codeInfo.column - 1,
							//offset: child.codeInfo.offset,
							length: child.codeInfo.text.length,

							content: {
								columns: child.columns,
								rows: child.rows
							}
						});
						return;
					}

					if (typeof child.child !== 'undefined' && child.child !== null) {
						rec(child, 'child', a);
					}

					if (typeof child.child2 !== 'undefined' && child.child2 !== null) {
						rec(child, 'child2', a);
					}
				};

				if (root.type == 'groupRoot') {
					for (i = 0; i < root.groups.length; i++) {
						for (j = 0; j < root.groups[i].assignments.length; j++) {
							rec(root.groups[i].assignments[j], 'child', a);
						}
					}
				} else {
					// assume RA-root
					rec(root, 'child', a);
					for (i = 0; i < root.assignments.length; i++) {
						rec(root.assignments[i], 'child', a);
					}
				}
				return a;
			};

			var tables = getTables(root);

			this.clearInlineRelationMarkers();

			var i, e;
			for (i = 0; i < tables.length; i++) {
				e = $('<i class="fa fa-table" title="edit relation"></i>').click((function (self, table) {
					return function () {
						self.openModalInlineEditor_inlineRelationChange(table);

						self.clearInlineRelationMarkers();
					};
				})(this, tables[i]));

				editor.setGutterMarker(tables[i].line, this.options.gutterClass, e[0]);
			}
		}
	}, {
		key: 'clearInlineRelationMarkers',
		value: function clearInlineRelationMarkers() {
			this.state.editor.clearGutter(this.options.gutterClass);
		}
	}], [{
		key: 'buildTranslatedPegJsMessage',
		value: function buildTranslatedPegJsMessage(expected, found) {
			function cleanupExpected(expected) {
				var i = 1;

				expected.sort(function (a, b) {
					if (a.description < b.description) {
						return -1;
					} else if (a.description > b.description) {
						return 1;
					} else {
						return 0;
					}
				});

				while (i < expected.length) {
					if (expected[i - 1] === expected[i]) {
						expected.splice(i, 1);
					} else {
						i++;
					}
				}
			}

			function buildMessage(expected, found) {
				function stringEscape(s) {
					function hex(ch) {
						return ch.charCodeAt(0).toString(16).toUpperCase();
					}

					return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\x08/g, '\\b').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {
						return '\\x0' + hex(ch);
					}).replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {
						return '\\x' + hex(ch);
					}).replace(/[\u0180-\u0FFF]/g, function (ch) {
						return '\\u0' + hex(ch);
					}).replace(/[\u1080-\uFFFF]/g, function (ch) {
						return '\\u' + hex(ch);
					});
				}

				var expectedDescs = new Array(expected.length),
				    expectedDesc,
				    foundDesc,
				    i;

				for (i = 0; i < expected.length; i++) {
					expectedDescs[i] = expected[i].description;
				}

				expectedDesc = expected.length > 1 ? expectedDescs.slice(0, -1).join(", ") + " " + i18n.t('editor.pegjs-error.or') + " " + expectedDescs[expected.length - 1] : expectedDescs[0];

				foundDesc = found ? "\"" + stringEscape(found) + "\"" : i18n.t('editor.pegjs-error.end-of-input');

				return i18n.t('editor.pegjs-error.expected-found', { expected: expectedDesc, found: foundDesc });
			}

			if (expected !== null) {
				cleanupExpected(expected);
			}
			return buildMessage(expected, found);
		}
	}]);

	return Editor;
})();

exports.Editor = Editor;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../../db/relalg":110,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/interop-require-wildcard":13}],82:[function(require,module,exports){
(function (global){
'use strict';

var _Calculator = require('./Calculator');

global.calc_controller = function () {
	// src: http://stackoverflow.com/a/2880929
	var urlParams;
	(window.onpopstate = function () {
		var match,
		    pl = /\+/g,
		    // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		    decode = function decode(s) {
			return decodeURIComponent(s.replace(pl, " "));
		},
		    query = window.location.search.substring(1);

		urlParams = {};
		while (match = search.exec(query)) {
			urlParams[decode(match[1])] = decode(match[2]);
		}
	}).call();

	i18n.init({
		//resStore: resources,
		fallbackLng: 'en',
		//lng: 'de',
		debug: true,
		setJqueryExt: true,
		detectLngQS: 'lang' }, // ?lang=de
	function (t, err) {
		var calc = null;
		$(function () {
			calc = new _Calculator.Calculator();

			$('body').i18n();

			if (!urlParams.data) {
				calc.loadStaticGroups(true);
			} else {
				try {
					// extract source and id
					var data = urlParams.data;
					var source, id, pos;

					if ((pos = data.indexOf(':')) == -1) throw new Error('data syntax is: ?data=source:id');

					source = data.substring(0, pos).toLowerCase();
					id = data.substring(pos + 1);

					if (source.length === 0) throw new Error('no source given; data syntax is: ?data=source:id');else if (id.length === 0) throw new Error('no id given; data syntax is: ?data=source:id');

					if (source === 'gist') {
						calc.loadGroupFromGist(id, true);
					} else {
						throw new Error('data source not supported');
					}

					calc.loadStaticGroups(false);
				} catch (e) {
					calc.displayAlertMsg(e.message);

					calc.loadStaticGroups(true);
				}
			}

			// start tour after 1 sec delay for all new visitors
			calc.startTourWhenNew(1000);
		});
	});
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Calculator":79}],83:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Table = require('./Table');

var _Join = require('./Join');

/**
 * relational algebra anti-join operator
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}        child          the left child expression
 * @param   {RANode}        child2         the right child expression
 * @returns {AntiJoin}
 */

var AntiJoin = (function (_RANode) {
	_inherits(AntiJoin, _RANode);

	function AntiJoin(child, child2) {
		_classCallCheck(this, AntiJoin);

		_get(Object.getPrototypeOf(AntiJoin.prototype), 'constructor', this).call(this, '▷');

		this.setChild(child);
		this.setChild2(child2);

		// is set by check
		this._condition = null;
		this._schema = null;
	}

	_createClass(AntiJoin, [{
		key: 'setChild2',
		value: function setChild2(child2) {
			this._child2 = child2;
		}
	}, {
		key: 'getSchema',
		value: function getSchema() {
			return this._schema;
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var res = new _Table.Table();
			res.setSchema(this.getSchema());

			var orgA = this._child.getResult(session);
			var orgB = this._child2.getResult(session);

			// copy
			var condition = this._condition;

			// nested loop join
			var numRowsA = orgA.getNumRows();
			var numRowsB = orgB.getNumRows();
			var rowA, rowB, partnerFound;

			for (var i = 0; i < numRowsA; i++) {
				rowA = orgA.getRow(i);
				partnerFound = false;

				for (var j = 0; j < numRowsB; j++) {
					rowB = orgB.getRow(j);

					if (condition.evaluate(rowA, rowB, i, session) === true) {
						partnerFound = true;
						break;
					}
				}

				if (partnerFound === false) {
					res.addRow(rowA);
				}
			}

			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();
			this._child2.check();

			var schemaA = this._child.getSchema();
			var schemaB = this._child2.getSchema();

			this._condition = _Join.Join.getNaturalJoinCondition(schemaA, schemaB);
			this.setMetaData('naturalJoinConditions', _Join.Join.getNaturalJoinConditionArray(schemaA, schemaB));

			this._schema = schemaA;

			this._condition.check(schemaA, schemaB);
			if (this._condition.getDataType() !== 'boolean') {
				this.throwExecutionError(i18n.t('db.messages.exec.error-condition-must-be-boolean'));
			}
		}
	}]);

	return AntiJoin;
})(_RANode2.RANode);

exports.AntiJoin = AntiJoin;

},{"./ExecutionError":88,"./Join":93,"./RANode":97,"./Table":105,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],84:[function(require,module,exports){
/**
 * a column of a relation
 * @constructor
 * @param   {String} name         the name of the column
 * @param   {String} relAlias     the relation alias of the name (or null)
 * @param   {String} optionalType optional type of the column
 * @returns {Column} returns a column with the given attributes
 */
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var Column = (function () {
	function Column(name, relAlias, optionalType) {
		_classCallCheck(this, Column);

		this._name = name;
		this._relAlias = relAlias;
		this._type = optionalType;
	}

	_createClass(Column, [{
		key: 'getName',
		value: function getName() {
			return this._name;
		}
	}, {
		key: 'getRelAlias',
		value: function getRelAlias() {
			return this._relAlias;
		}
	}, {
		key: 'getType',
		value: function getType() {
			return this._type;
		}
	}, {
		key: 'setRelAlias',
		value: function setRelAlias(relAlias) {
			this._relAlias = relAlias;
		}
	}, {
		key: 'toString',
		value: function toString() {
			return Column.printColumn(this._name, this._relAlias);
		}
	}, {
		key: 'equals',
		value: function equals(columnB) {
			return this._name === columnB._name && this._relAlias === columnB._relAlias;
		}
	}], [{
		key: 'printColumn',
		value: function printColumn(name, relAlias) {
			var pName;
			if (typeof name == 'number') pName = '[' + name + ']';else pName = name;

			if (relAlias === null) return pName;
			return relAlias + '.' + pName;
		}
	}]);

	return Column;
})();

exports.Column = Column;

},{"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10}],85:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ExecutionError = require('./ExecutionError');

var _Join2 = require('./Join');

var _ValueExpr = require('./ValueExpr');

var ValueExpr = _interopRequireWildcard(_ValueExpr);

/**
 * relational algebra inner Join operator
 *
 * this is just a wrapper for {@link Join} with true as condition
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}               child     the left child expression
 * @param   {RANode}               child2    the right child expression
 * @returns {CrossJoin}
 */

var CrossJoin = (function (_Join) {
  _inherits(CrossJoin, _Join);

  function CrossJoin(child, child2) {
    _classCallCheck(this, CrossJoin);

    _get(Object.getPrototypeOf(CrossJoin.prototype), 'constructor', this).call(this, child, child2, new ValueExpr.ValueExprGeneric('boolean', 'constant', [true]), 'inner', '⨯');
  }

  _createClass(CrossJoin, [{
    key: 'getArgumentHtml',
    value: function getArgumentHtml() {
      return '';
    }
  }]);

  return CrossJoin;
})(_Join2.Join);

exports.CrossJoin = CrossJoin;

},{"./ExecutionError":88,"./Join":93,"./ValueExpr":107,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12,"babel-runtime/helpers/interop-require-wildcard":13}],86:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Table = require('./Table');

/**
 * relational algebra difference operator
 *
 * @constructor
 * @extends RANode
 * @param   {RANode} child  the left child expression
 * @param   {RANode} child2 the right child expression
 * @returns {Difference}
 */

var Difference = (function (_RANode) {
	_inherits(Difference, _RANode);

	function Difference(child, child2) {
		_classCallCheck(this, Difference);

		_get(Object.getPrototypeOf(Difference.prototype), 'constructor', this).call(this, '-');

		this.setChild(child);
		this.setChild2(child2);
	}

	_createClass(Difference, [{
		key: 'setChild2',
		value: function setChild2(child2) {
			this._child2 = child2;
		}
	}, {
		key: 'getSchema',
		value: function getSchema() {
			return this._child.getSchema();
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var res = new _Table.Table();
			var orgA = this.getChild().getResult(session);
			var orgB = this.getChild2().getResult(session);
			res.setSchema(this._schema);

			// copy
			for (var i = 0; i < orgA.getNumRows(); i++) {
				var rowA = orgA.getRow(i);
				var notFound = true;
				for (var j = 0; j < orgB.getNumRows(); j++) {
					if (_Table.Table.rowEqualsRow(rowA, orgB.getRow(j))) {
						notFound = false;
						break;
					}
				}

				if (notFound) res.addRow(rowA);
			}

			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();
			this._child2.check();

			if (this._child.getSchema().equalsTypeOnly(this._child2.getSchema()) == false) {
				this.throwExecutionError(i18n.t('db.messages.exec.error-schemas-not-unifiable', { schemaA: this._child.getSchema(), schemaB: this._child2.getSchema() }));
			}

			// schema of union is the left schema
			this._schema = this._child.getSchema().copy();
		}
	}]);

	return Difference;
})(_RANode2.RANode);

exports.Difference = Difference;

},{"./ExecutionError":88,"./RANode":97,"./Table":105,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],87:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Difference = require('./Difference');

var _Projection = require('./Projection');

var _CrossJoin = require('./CrossJoin');

/**
 * relational algebra division operator
 *
 * @constructor
 * @extends RANode
 * @param   {RANode} child  the left child expression
 * @param   {RANode} child2 the right child expression
 * @returns {Division}
 */

var Division = (function (_RANode) {
	_inherits(Division, _RANode);

	function Division(child, child2) {
		_classCallCheck(this, Division);

		_get(Object.getPrototypeOf(Division.prototype), 'constructor', this).call(this, '÷');

		this.setChild(child);
		this.setChild2(child2);

		// is set by check
		this._delegate = null;
	}

	_createClass(Division, [{
		key: 'setChild2',
		value: function setChild2(child2) {
			this._child2 = child2;
		}
	}, {
		key: 'getSchema',
		value: function getSchema() {
			return this._delegate.getSchema();
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var res = this._delegate.getResult(session);

			res.eliminateDuplicateRows();
			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();
			this._child2.check();

			// schema r' is (sch(left) \ sch(right))
			var schemaA = this._child.getSchema();
			var schemaB = this._child2.getSchema();
			var numColsA = schemaA.getSize();
			var numColsB = schemaB.getSize();

			var schema = schemaA.copy();
			for (var i = 0; i < numColsB; i++) {
				var index = schema.getColumnIndex(schemaB.getColumn(i).getName(), null, false);
				if (index > -1) schema.removeColumn(index);
			}

			if (schema.getSize() === numColsA) {
				// size has not changed => schemaB not part of schemaA
				this.throwExecutionError(i18n.t('db.messages.exec.error-schema-a-not-part-of-schema-b', { schemaA: schemaB, schemaB: schemaA }));
			}

			// (R % S) := (pi r'(R)) - ( ( (pi r'(R) x (S) )) - (R) )
			this._delegate = new _Difference.Difference(new _Projection.Projection(this._child, schema.getColumns()).setCodeInfoObject(this._codeInfo), new _Projection.Projection(new _Difference.Difference(new _CrossJoin.CrossJoin(new _Projection.Projection(this._child, schema.getColumns()).setCodeInfoObject(this._codeInfo), this._child2).setCodeInfoObject(this._codeInfo), this._child).setCodeInfoObject(this._codeInfo), schema.getColumns()).setCodeInfoObject(this._codeInfo));
			this._delegate.check();
		}
	}]);

	return Division;
})(_RANode2.RANode);

exports.Division = Division;

},{"./CrossJoin":85,"./Difference":86,"./ExecutionError":88,"./Projection":96,"./RANode":97,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],88:[function(require,module,exports){
"use strict";

var _get = require("babel-runtime/helpers/get")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
	value: true
});

var ExecutionError = (function (_Error) {
	_inherits(ExecutionError, _Error);

	function ExecutionError(message, codeInfo) {
		_classCallCheck(this, ExecutionError);

		_get(Object.getPrototypeOf(ExecutionError.prototype), "constructor", this).call(this, message);
		/* codeInfo
   {
   line: -1,
   column: -1,
   offset: -1,
   text: ''
   };
   */
		if (codeInfo) {
			this.message = message;
			this.line = codeInfo.line;
			this.column = codeInfo.column;
			this.codeInfo = codeInfo;
		} else {
			this.message = message;
		}
	}

	return ExecutionError;
})(Error);

exports.ExecutionError = ExecutionError;

},{"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],89:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Join = require('./Join');

var _Union = require('./Union');

var _ValueExpr = require('./ValueExpr');

var ValueExpr = _interopRequireWildcard(_ValueExpr);

/**
 * relational algebra full outer Join operator
 *
 * A full outer join B = (A left outer join B) union (A right outer join B)
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}               child     the left child expression
 * @param   {RANode}               child2    the right child expression
 * @param   {null|ValueExpr|Array} condition see condition of {@link Join}
 * @returns {FullOuterJoin}
 */

var FullOuterJoin = (function (_RANode) {
	_inherits(FullOuterJoin, _RANode);

	// condition can be null to generate natural condition

	function FullOuterJoin(child, child2, condition) {
		_classCallCheck(this, FullOuterJoin);

		_get(Object.getPrototypeOf(FullOuterJoin.prototype), 'constructor', this).call(this, '⟗');

		this.setChild(child);
		this.setChild2(child2);
		this._condition = condition;
		this._isNaturalJoin = condition === null || condition instanceof Array;

		// this is used for the USING() clause for SQL where the natural join is restricted to some columns
		if (condition instanceof Array) {
			if (condition.length === 0) throw 'this should not happen array has to have at least one element';

			this._restrictToColumns = condition;
		} else {
			this._restrictToColumns = false;
		}

		// is set by check
		this._delegate = null;
	}

	_createClass(FullOuterJoin, [{
		key: 'setChild2',
		value: function setChild2(child2) {
			this._child2 = child2;
		}
	}, {
		key: 'getSchema',
		value: function getSchema() {
			return this._delegate.getSchema();
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var res = this._delegate.getResult(session);

			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'check',
		value: function check() {
			// full outer theta-join is union of left and right outer theta-joins

			this._child.check();
			this._child2.check();
			var schemaA = this._child.getSchema();
			var schemaB = this._child2.getSchema();

			if (this._isNaturalJoin) {
				// check if columns of using clause appear in both schemas
				if (this._restrictToColumns !== false) {
					for (var i = 0; i < this._restrictToColumns.length; i++) {
						if (schemaA.getColumnIndexArray(this._restrictToColumns[i], null).length === 0 || schemaB.getColumnIndexArray(this._restrictToColumns[i], null).length === 0) {
							this.throwExecutionError(i18n.t('db.messages.exec.error-column-not-in-both-schemas', { column: this._restrictToColumns[i] }));
						}
					}
				}

				// generate natural condition to force left and right joins of delegate to theta joins
				this._condition = _Join.Join.getNaturalJoinCondition(schemaA, schemaB, this._restrictToColumns);
				this.setMetaData('naturalJoinConditions', _Join.Join.getNaturalJoinConditionArray(schemaA, schemaB, this._restrictToColumns));
			} else {
				//this._condition = this._condition;
			}

			this._condition.check(schemaA, schemaB);
			if (this._condition.getDataType() !== 'boolean') {
				this.throwExecutionError(i18n.t('db.messages.exec.error-condition-must-be-boolean'));
			}

			this._delegate = new _Union.Union(new _Join.Join(this._child, this._child2, this._condition, 'left'), new _Join.Join(this._child, this._child2, this._condition, 'right'));
			this._delegate.check();
		}
	}, {
		key: 'getArgumentHtml',
		value: function getArgumentHtml() {
			if (this._isNaturalJoin) return '';
			return this._condition.getFormulaHtml();
		}
	}]);

	return FullOuterJoin;
})(_RANode2.RANode);

exports.FullOuterJoin = FullOuterJoin;

},{"./ExecutionError":88,"./Join":93,"./RANode":97,"./Union":106,"./ValueExpr":107,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12,"babel-runtime/helpers/interop-require-wildcard":13}],90:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Table = require('./Table');

var _Schema = require('./Schema');

var _Column = require('./Column');

/**
 * relational algebra group-by operator
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}  child              the child expression
 * @param   {Array}   groupByCols        Array of {name, relalias} objects
 * @param   {Array}   aggregateFunctions Array of {aggFunction, col{name, relAlias}} objects
 * @returns {GroupBy}
 */

var GroupBy = (function (_RANode) {
	_inherits(GroupBy, _RANode);

	function GroupBy(child, groupByCols, aggregateFunctions) {
		_classCallCheck(this, GroupBy);

		_get(Object.getPrototypeOf(GroupBy.prototype), 'constructor', this).call(this, '&gamma;');
		this.setChild(child);

		this._groupByCols = groupByCols;
		this._aggregateFunctions = aggregateFunctions;

		this._schema = null;
		this._groupByColumnIndices = null;
	}

	_createClass(GroupBy, [{
		key: 'getSchema',
		value: function getSchema() {
			return this._schema;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();
			var childSchema = this._child.getSchema();

			this._groupByColumnIndices = new Array(this._groupByCols.length);

			for (var i = 0; i < this._groupByCols.length; i++) {
				this._groupByColumnIndices[i] = childSchema.getColumnIndex(this._groupByCols[i].name, this._groupByCols[i].relAlias);
			}

			for (var i = 0; i < this._aggregateFunctions.length; i++) {
				var f = this._aggregateFunctions[i];

				switch (f.aggFunction) {
					case 'COUNT_ALL':
					case 'COUNT':
					case 'SUM':
					case 'AVG':
					case 'MIN':
					case 'MAX':
						break;
					default:
						throw new Error('should not happen; unknown aggregate function');
				}

				if (f.aggFunction != 'COUNT_ALL') this._aggregateFunctions[i].colIndex = childSchema.getColumnIndex(f.col.name, f.col.relAlias);
			}

			// create new Schema
			this._schema = new _Schema.Schema();
			for (var i = 0; i < this._groupByColumnIndices.length; i++) {
				this._schema.addColumn2(childSchema.getColumn(this._groupByColumnIndices[i]));
			}
			for (var i = 0; i < this._aggregateFunctions.length; i++) {
				var func = this._aggregateFunctions[i];
				var type;
				var colType = childSchema.getType(func.colIndex);

				switch (func.aggFunction) {
					case 'MIN':
					case 'MAX':
						type = colType;
						break;
					case 'SUM':
					case 'AVG':
						if (colType !== 'number') this.throwExecutionError(i18n.t('db.messages.exec.error-func-not-defined-for-column-type', { func: func.aggFunction, colType: colType }));
						type = colType;
						break;
					case 'COUNT_ALL':
					case 'COUNT':
						type = 'number';
						break;
					default:
						throw new Error('unknown aggregate function ' + func.aggFunction);
				}
				this._schema.addColumn(func.name, null, type);
			}
		}
	}, {
		key: 'getArgumentHtml',
		value: function getArgumentHtml() {
			var group = [];
			var agg = [];
			var i;

			for (i = 0; i < this._groupByCols.length; i++) {
				group.push(_Column.Column.printColumn(this._groupByCols[i].name, this._groupByCols[i].relAlias));
			}
			for (i = 0; i < this._aggregateFunctions.length; i++) {
				var func = this._aggregateFunctions[i];
				var s;
				if (func.aggFunction == 'COUNT_ALL') s = 'COUNT(*)';else s = func.aggFunction + '(' + _Column.Column.printColumn(func.col.name, func.col.relAlias) + ')';

				s += '→' + func.name;
				agg.push(s);
			}

			return group.join(', ') + '; ' + agg.join(', ');
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var org = this.getChild().getResult(session);
			var res = new _Table.Table();
			res.setSchema(this._schema);

			var hasGroupCols = this._groupByCols.length > 0;
			var groupsOfRows; // might be sparcely filled
			var numberOfGroups = 0; // === number of rows in result table

			if (hasGroupCols) {
				var hashtable = {};
				for (var i = 0; i < org.getNumRows(); i++) {
					var row = org.getRow(i);
					var keyTuple = new Array(this._groupByColumnIndices.length);

					for (var j = 0; j < this._groupByColumnIndices.length; j++) {
						keyTuple[j] = row[this._groupByColumnIndices[j]];
					}

					var key = JSON.stringify(keyTuple);
					if (typeof hashtable[key] != 'undefined') {
						hashtable[key].rows.push(row);
					} else {
						hashtable[key] = {
							rows: [row],
							resultTuple: keyTuple,
							rownumber: i
						};
						numberOfGroups++;
					}
				}

				groupsOfRows = new Array(org.getNumRows()); // sparcely filled

				// write hashtable into sparcely filled array to preserve ordering
				var _entry = undefined;
				for (var key in hashtable) {
					if (!hashtable.hasOwnProperty(key)) continue;

					_entry = hashtable[key];
					groupsOfRows[_entry.rownumber] = _entry;
				}
			} else {
				// no grouping attributes => entire relation is one group
				numberOfGroups = 1;
				groupsOfRows = new Array(numberOfGroups);

				groupsOfRows[0] = {
					rows: org.getRows(),
					resultTuple: []
				};
			}

			// min and max for strings, numbers and dates
			var generic_min = function generic_min(a, b) {
				if (a < b) return a;
				return b;
			};
			var generic_max = function generic_max(a, b) {
				if (a > b) return a;
				return b;
			};

			// execute aggregate functions
			var aggValue, group, value;
			var entry = undefined;
			for (var h = 0; h < groupsOfRows.length; h++) {
				if (!groupsOfRows[h]) continue; // skipp unfilled rows

				entry = groupsOfRows[h];
				group = entry.rows;

				for (var i = 0; i < this._aggregateFunctions.length; i++) {
					var func = this._aggregateFunctions[i];

					if (func.aggFunction == 'COUNT_ALL') {
						aggValue = group.length;
					} else {
						//var colType = this._child.getSchema().getType(func.colIndex);
						switch (func.aggFunction) {
							case 'COUNT':
								aggValue = 0;

								for (var j = 0; j < group.length; j++) {
									value = group[j][func.colIndex];
									if (value !== null) aggValue++;
								}

								break;

							case 'MIN':
							case 'MAX':
								aggValue = null;
								var c = func.aggFunction == 'MIN' ? generic_min : generic_max;

								for (var j = 0; j < group.length; j++) {
									value = group[j][func.colIndex];
									if (aggValue === null) aggValue = value;else aggValue = c(aggValue, value);
								}

								break;

							case 'AVG':
							case 'SUM':
								var sum = 0;
								var counter = 0;

								for (var j = 0; j < group.length; j++) {
									value = group[j][func.colIndex];
									if (value !== null) {
										sum += value;
										counter++;
									}
								}

								if (counter === 0) {
									aggValue = null;
								} else if (func.aggFunction == 'SUM') {
									aggValue = sum;
								} else {
									//AVG
									aggValue = sum / counter;
								}

								break;

							default:
								throw new Error('this should not happen');
						}
					}
					entry.resultTuple.push(aggValue);
				}
			}

			// write into result-table
			for (var i = 0; i < groupsOfRows.length; i++) {
				if (!groupsOfRows[i]) continue;
				res.addRow(groupsOfRows[i].resultTuple);
			}

			res.eliminateDuplicateRows();
			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}]);

	return GroupBy;
})(_RANode2.RANode);

exports.GroupBy = GroupBy;

},{"./Column":84,"./ExecutionError":88,"./RANode":97,"./Schema":102,"./Table":105,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],91:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Join = require('./Join');

/**
 * relational algebra inner Join operator
 *
 * this is just a wrapper for {@link Join}
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}               child     the left child expression
 * @param   {RANode}               child2    the right child expression
 * @param   {null|ValueExpr|Array} condition see condition of {@link Join}
 * @returns {InnerJoin}
 */

var InnerJoin = (function (_RANode) {
  _inherits(InnerJoin, _RANode);

  function InnerJoin(child, child2, condition) {
    _classCallCheck(this, InnerJoin);

    _get(Object.getPrototypeOf(InnerJoin.prototype), 'constructor', this).call(this, '⨝');
    return new _Join.Join(child, child2, condition, 'inner', this._functionName);
  }

  return InnerJoin;
})(_RANode2.RANode);

exports.InnerJoin = InnerJoin;

},{"./ExecutionError":88,"./Join":93,"./RANode":97,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],92:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Table = require('./Table');

/**
 * Calculates the intersection of two relations
 * The order of the rows is kept.
 * The output schema will be the schema of the left child
 *
 * @constructor
 * @extends RANode
 * @param   {RANode} child  the left child expression
 * @param   {RANode} child2 the right child expression
 * @returns {Intersect}
 */

var Intersect = (function (_RANode) {
	_inherits(Intersect, _RANode);

	function Intersect(child, child2) {
		_classCallCheck(this, Intersect);

		_get(Object.getPrototypeOf(Intersect.prototype), 'constructor', this).call(this, '∩');

		this.setChild(child);
		this.setChild2(child2);

		this._schema = null; // is set by check
	}

	_createClass(Intersect, [{
		key: 'setChild2',
		value: function setChild2(child2) {
			this._child2 = child2;
		}
	}, {
		key: 'getSchema',
		value: function getSchema() {
			return this._schema;
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var res = new _Table.Table();
			var orgA = this.getChild().getResult(session);
			var orgB = this.getChild2().getResult(session);
			res.setSchema(this._schema);

			// copy
			var numRowsA = orgA.getNumRows();
			var numRowsB = orgB.getNumRows();
			var numCols = orgA.getNumCols();
			for (var i = 0; i < numRowsA; i++) {
				var rowA = orgA.getRow(i);
				for (var j = 0; j < numRowsB; j++) {
					var rowB = orgB.getRow(j);
					var equals = true;

					for (var k = 0; k < numCols; k++) {
						if (rowA[k] !== rowB[k]) {
							equals = false;
							break;
						}
					}

					if (equals) {
						res.addRow(rowA);
						break;
					}
				}
			}

			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();
			this._child2.check();

			if (this._child.getSchema().equalsTypeOnly(this._child2.getSchema()) == false) {
				this.throwExecutionError(i18n.t('db.messages.exec.error-schemas-not-unifiable', { schemaA: this._child.getSchema(), schemaB: this._child2.getSchema() }));
			}

			// schema is the left schema
			this._schema = this._child.getSchema().copy();
		}
	}]);

	return Intersect;
})(_RANode2.RANode);

exports.Intersect = Intersect;

},{"./ExecutionError":88,"./RANode":97,"./Table":105,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],93:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Table = require('./Table');

var _Schema = require('./Schema');

var _ValueExpr = require('./ValueExpr');

var ValueExpr = _interopRequireWildcard(_ValueExpr);

/**
 * relational algebra Join operator
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}               child     the left child expression
 * @param   {RANode}               child2    the right child expression
 * @param   {null|ValueExpr|Array} condition condition is either a ValueExpr evaluating to boolean
 *                                         or an Array of unqualified column names as strings for the using clause or
 *                                         null for a natural join
 * @param   {String}               joinType  joinType is either inner, left or right
 * @returns {Join}
 */

var Join = (function (_RANode) {
	_inherits(Join, _RANode);

	function Join(child, child2, condition, joinType, functionNameOverride) {
		_classCallCheck(this, Join);

		_get(Object.getPrototypeOf(Join.prototype), 'constructor', this).call(this, functionNameOverride || '⨝');
		this._condition = condition;
		if (joinType !== 'inner' && joinType !== 'left' && joinType !== 'right') throw new Error('unknown joinType: ' + joinType);

		this._joinType = joinType;
		this._isNaturalJoin = condition === null || condition instanceof Array;

		// this is used for the USING() clause for SQL where the natural join is restricted to some columns
		if (condition instanceof Array) {
			if (condition.length === 0) throw 'this should not happen array has to have at least one element';

			this._restrictToColumns = condition;
		} else {
			this._restrictToColumns = false;
		}

		this.setChild(child);
		this.setChild2(child2);
		if (this._isNaturalJoin === false && condition instanceof ValueExpr.ValueExpr === false) throw new Error('no condition given');

		this._schema = null;
		this._keepColumns = null;
	}

	_createClass(Join, [{
		key: 'setChild2',
		value: function setChild2(child2) {
			this._child2 = child2;
		}
	}, {
		key: 'getSchema',
		value: function getSchema() {
			return this._schema;
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var createNullArray = function createNullArray(size) {
				var a = new Array(size);
				for (var i = 0; i < size; i++) a[i] = null;
				return a;
			};
			var createNaturalRowArray = function createNaturalRowArray(rowA, rowB, keepIndicesA, keepIndicesB) {
				var row = new Array(rowSize);
				var col = 0;
				for (var k = 0; k < keepIndicesA.length; k++) {
					row[col++] = rowA[keepIndicesA[k]];
				}
				for (var k = 0; k < keepIndicesB.length; k++) {
					row[col++] = rowB[keepIndicesB[k]];
				}
				return row;
			};

			var res = new _Table.Table();
			res.setSchema(this.getSchema());

			var orgA = this._child.getResult(session);
			var orgB = this._child2.getResult(session);

			var condition = this._condition;

			// nested loop join
			var numRowsA = orgA.getNumRows();
			var numRowsB = orgB.getNumRows();
			var numColsA = orgA.getNumCols();
			var numColsB = orgB.getNumCols();
			var isNaturalJoin = this._isNaturalJoin;

			var rowSize, keepIndicesA, keepIndicesB;
			if (isNaturalJoin) {
				rowSize = this._keepColumns.size;
				keepIndicesA = this._keepColumns.keepIndicesA;
				keepIndicesB = this._keepColumns.keepIndicesB;
			}

			var nullArrayLeft, nullArrayRight;

			var row;
			if (this._joinType === 'inner') {
				for (var i = 0; i < numRowsA; i++) {
					var rowA = orgA.getRow(i);

					for (var j = 0; j < numRowsB; j++) {
						var rowB = orgB.getRow(j);

						if (condition.evaluate(rowA, rowB, i, session) !== true) continue;

						// add row
						if (!isNaturalJoin) row = rowA.concat(rowB);else {
							row = createNaturalRowArray(rowA, rowB, keepIndicesA, keepIndicesB);
						}

						res.addRow(row);
					}
				}
			} else if (this._joinType === 'left') {
				nullArrayRight = createNullArray(this.getSchema().getSize() - numColsA); // == size of new B

				for (var i = 0; i < numRowsA; i++) {
					var rowA = orgA.getRow(i);
					var match = false;

					for (var j = 0; j < numRowsB; j++) {
						var rowB = orgB.getRow(j);

						if (condition.evaluate(rowA, rowB, i, session) === true) {
							if (!isNaturalJoin) res.addRow(rowA.concat(rowB));else {
								res.addRow(createNaturalRowArray(rowA, rowB, keepIndicesA, keepIndicesB));
							}

							match = true;
						}
					}

					if (match === false) {
						res.addRow(rowA.concat(nullArrayRight));
					}
				}
			} else if (this._joinType === 'right') {
				nullArrayLeft = createNullArray(this.getSchema().getSize() - numColsB); // == size of new A

				for (var j = 0; j < numRowsB; j++) {
					var rowB = orgB.getRow(j);
					var match = false;

					for (var i = 0; i < numRowsA; i++) {
						var rowA = orgA.getRow(i);

						if (condition.evaluate(rowA, rowB, i, session) === true) {
							if (!isNaturalJoin) res.addRow(rowA.concat(rowB));else {
								res.addRow(createNaturalRowArray(rowA, rowB, keepIndicesA, keepIndicesB));
							}

							match = true;
						}
					}

					if (match == false) {
						res.addRow(nullArrayLeft.concat(rowB));
					}
				}
			}

			res.eliminateDuplicateRows();
			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();
			this._child2.check();
			var schemaA = this._child.getSchema();
			var schemaB = this._child2.getSchema();

			if (this._isNaturalJoin) {
				// check if columns of using clause appear in both schemas
				if (this._restrictToColumns !== false) {
					for (var i = 0; i < this._restrictToColumns.length; i++) {
						if (schemaA.getColumnIndexArray(this._restrictToColumns[i], null).length === 0 || schemaB.getColumnIndexArray(this._restrictToColumns[i], null).length === 0) {
							this.throwExecutionError(i18n.t('db.messages.exec.error-column-not-in-both-schemas', { column: this._restrictToColumns[i] }));
						}
					}
				}

				// generate natural condition
				this._condition = Join.getNaturalJoinCondition(schemaA, schemaB, this._restrictToColumns);
				this.setMetaData('naturalJoinConditions', Join.getNaturalJoinConditionArray(schemaA, schemaB, this._restrictToColumns));

				var tmp = _Schema.Schema.concatNatural(schemaA, schemaB, this._joinType !== 'right', this._restrictToColumns);
				this._schema = tmp.schema;
				this._keepColumns = tmp.keep;
			} else {
				// check columns appearing in both schemas
				var conflicts = schemaA.getConflictingColumnsArray(schemaB);
				if (conflicts.length > 0) {
					this.throwExecutionError(i18n.t('db.messages.exec.error-join-would-produce-non-unique-columns', { conflicts: conflicts.join(', ') }));
				}

				try {
					this._schema = _Schema.Schema.concat(this._child.getSchema(), this._child2.getSchema());
				} catch (e) {
					this.throwExecutionError(e.message);
				}
			}

			this._condition.check(schemaA, schemaB);
			if (this._condition.getDataType() !== 'boolean') {
				this.throwExecutionError(i18n.t('db.messages.exec.error-condition-must-be-boolean'));
			}
		}
	}, {
		key: 'getArgumentHtml',
		value: function getArgumentHtml() {
			if (this._isNaturalJoin) return '';
			return this._condition.getFormulaHtml();
		}
	}], [{
		key: 'getNaturalJoinConditionArray',
		value: function getNaturalJoinConditionArray(schemaA, schemaB, restrictToColumns) {
			if (typeof restrictToColumns === 'undefined') {
				restrictToColumns = false;
			}
			var numColsA = schemaA.getSize();

			var conditions = [];

			// find columns with the same name in schemaA and schemaB
			for (var i = 0; i < numColsA; i++) {
				var a = schemaA.getColumn(i);
				if (restrictToColumns !== false && restrictToColumns.indexOf(a.getName()) === -1) {
					// skip all but certain columns (for joins with USING())
					continue;
				}
				var indices = schemaB.getColumnIndexArray(a.getName(), null, false);
				if (indices.length === 0) continue;

				for (var j = 0; j < indices.length; j++) {
					var index = indices[j];

					var b = schemaB.getColumn(index);

					// the column indices are set manually
					var equals = new ValueExpr.ValueExprGeneric('boolean', '=', [new ValueExpr.ValueExprColumnValue(a.getName(), a.getRelAlias(), i), new ValueExpr.ValueExprColumnValue(b.getName(), b.getRelAlias(), numColsA + index)]);
					conditions.push(equals);
				}
			}
			return conditions;
		}
	}, {
		key: 'getNaturalJoinCondition',
		value: function getNaturalJoinCondition(schemaA, schemaB, restrictToColumns) {
			var conditions = Join.getNaturalJoinConditionArray(schemaA, schemaB, restrictToColumns);
			var length = conditions.length;
			switch (length) {
				case 0:
					return new ValueExpr.ValueExprGeneric('boolean', 'constant', [true]);

				case 1:
					return conditions[0];

				default:
					var cond = new ValueExpr.ValueExprGeneric('boolean', 'and', [conditions[0], conditions[1]]);
					for (var i = 2; i < length; i++) {
						cond = new ValueExpr.ValueExprGeneric('boolean', 'and', [cond, conditions[i]]);
					}
					return cond;
			}
		}
	}]);

	return Join;
})(_RANode2.RANode);

exports.Join = Join;

},{"./ExecutionError":88,"./RANode":97,"./Schema":102,"./Table":105,"./ValueExpr":107,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12,"babel-runtime/helpers/interop-require-wildcard":13}],94:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ExecutionError = require('./ExecutionError');

var _Join2 = require('./Join');

/**
 * relational algebra left outer Join operator
 *
 * this is just a wrapper for {@link Join}
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}               child     the left child expression
 * @param   {RANode}               child2    the right child expression
 * @param   {null|ValueExpr|Array} condition see condition of {@link Join}
 * @returns {LeftOuterJoin}
 */

var LeftOuterJoin = (function (_Join) {
  _inherits(LeftOuterJoin, _Join);

  function LeftOuterJoin(child, child2, condition) {
    _classCallCheck(this, LeftOuterJoin);

    _get(Object.getPrototypeOf(LeftOuterJoin.prototype), 'constructor', this).call(this, child, child2, condition, 'left', '⟕');
  }

  return LeftOuterJoin;
})(_Join2.Join);

exports.LeftOuterJoin = LeftOuterJoin;

},{"./ExecutionError":88,"./Join":93,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],95:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

/**
 * relational algebra order-by operator
 *
 * @constructor
 * @extends RANode
 * @param   {RANode}  child     child expression
 * @param   {Array}   orderCols Array of {@link RA.Column}
 * @param   {Array}   orderAsc  Array of Boolean indicating the sort direction (true == asc)
 * @returns {OrderBy}
 */

var OrderBy = (function (_RANode) {
	_inherits(OrderBy, _RANode);

	function OrderBy(child, orderCols, orderAsc) {
		_classCallCheck(this, OrderBy);

		_get(Object.getPrototypeOf(OrderBy.prototype), 'constructor', this).call(this, '&tau;');

		this.setChild(child);

		this._orderCols = orderCols;
		this._orderAsc = orderAsc;

		if (this._orderAsc.length != this._orderCols.length) throw new Error('order cols not correct');

		this._orderIndices = null;
	}

	_createClass(OrderBy, [{
		key: 'getSchema',
		value: function getSchema() {
			return this._child.getSchema();
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var res = this.getChild().getResult(session).copy();
			res.eliminateDuplicateRows();
			this.setResultNumRows(res.getNumRows());

			res.sort(this._orderIndices, this._orderAsc);
			return res;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();
			var schema = this._child.getSchema();

			this._orderIndices = [];

			for (var i = 0; i < this._orderCols.length; i++) {
				var col = this._orderCols[i];
				var index = schema.getColumnIndex(col.getName(), col.getRelAlias());

				this._orderIndices.push(index);
			}
		}
	}, {
		key: 'getArgumentHtml',
		value: function getArgumentHtml() {
			var list = [];

			for (var i = 0; i < this._orderCols.length; i++) {
				var s = this._orderCols[i].toString() + ' ' + (this._orderAsc[i] ? 'asc' : 'desc');
				list.push(s);
			}
			return list.join(', ');
		}
	}]);

	return OrderBy;
})(_RANode2.RANode);

exports.OrderBy = OrderBy;

},{"./ExecutionError":88,"./RANode":97,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],96:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Table = require('./Table');

var _Schema = require('./Schema');

var _Column = require('./Column');

/**
 * relational algebra projection operator
 * @constructor
 * @extends RANode
 * @param   {RANode} child  the child expression
 * @param   {RANode} proj array of {name, relAlias, child} or Column (mixed)
 * @returns {RANode}
 */

var Projection = (function (_RANode) {
	_inherits(Projection, _RANode);

	function Projection(child, proj) {
		_classCallCheck(this, Projection);

		_get(Object.getPrototypeOf(Projection.prototype), 'constructor', this).call(this, '&pi;');
		this._proj = null;
		this._projIndeces = null; // set by check
		this._projectedSchema = null;

		this.setChild(child);
		if (typeof proj !== 'undefined') this.setProjection(proj);
	}

	_createClass(Projection, [{
		key: 'getSchema',
		value: function getSchema() {
			if (this._proj === null) return this._child.getSchema();

			return this._projectedSchema;
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			if (this._proj === null) return this._child.getResult(session);

			var org = this._child.getResult(session);
			var res = new _Table.Table();
			res.setSchema(this.getSchema());

			var numCols = res.getNumCols();
			var numRows = org.getNumRows();

			var i, j, orgRow, resRow;
			for (i = 0; i < numRows; i++) {
				orgRow = org.getRow(i);
				resRow = new Array(numCols);
				for (j = 0; j < numCols; j++) {
					if (this._projIndeces[j] === -1) {
						resRow[j] = this._proj[j].child.evaluate(orgRow, null, i, session);
					} else {
						resRow[j] = orgRow[this._projIndeces[j]];
					}
					//resRow[j] = i+1; //ROWNUM
				}
				res.addRow(resRow);
			}

			res.eliminateDuplicateRows();
			this.setResultNumRows(res.getNumRows());
			return res;
		}

		/**
   * sets the projection of the node
   * @param proj array of {name, relAlias, child} or Column
   */
	}, {
		key: 'setProjection',
		value: function setProjection(proj) {
			if (this.hasChild() === false) throw new Error("no child set");

			this._proj = proj;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();

			// check if all parts are part of the schema
			var unprojectedSchema = this._child.getSchema();
			var proj = this._proj;
			var childSchema = this._child.getSchema();
			var name, relAlias;
			var col, index, i;

			try {

				// handle if column name == X.* => replace entry in proj with real names
				for (i = 0; i < proj.length; i++) {
					if (proj[i] instanceof _Column.Column === false) {
						continue;
					}

					name = proj[i].getName();
					relAlias = proj[i].getRelAlias();
					if (name !== '*') continue;

					proj.splice(i, 1);

					var found = 0;
					for (var j = 0; j < childSchema.getSize(); j++) {
						col = childSchema.getColumn(j);
						if (relAlias !== null && col.getRelAlias() != relAlias) continue;

						proj.splice(i + found, 0, col); //TODO: add {name, child, relalias}
						found++;
					}

					if (found === 0) this.throwExecutionError(i18n.t('db.messages.exec.error-no-columns-match-alias-star'));
				}

				// call check for all expression
				for (i = 0; i < proj.length; i++) {
					if (proj[i] instanceof _Column.Column) {
						continue;
					}

					proj[i].child.check(unprojectedSchema, null);
					if (proj[i].child.getDataType() === 'null') {
						this.throwExecutionError(i18n.t('db.messages.exec.error-datatype-not-specified-for-col', { index: i + 1, column: proj[i].child._codeInfo.text }));
					}
				}

				// search for indices with the names
				this._projIndeces = [];
				for (i = 0; i < proj.length; i++) {
					if (proj[i] instanceof _Column.Column === false) {
						index = -1;
					} else {
						name = proj[i].getName();
						relAlias = proj[i].getRelAlias();
						index = childSchema.getColumnIndex(name, relAlias);
					}

					this._projIndeces[i] = index;
				}
			} catch (e) {
				if (e instanceof _ExecutionError.ExecutionError) throw e;else this.throwExecutionError(i18n.t('db.messages.exec.error-invalid-projection-error', { argument: this.getArgumentHtml(), error: e.message }));
			}

			// create projected schema
			var projectedSchema = new _Schema.Schema();
			for (i = 0; i < this._projIndeces.length; i++) {
				index = this._projIndeces[i];

				if (index === -1) {
					projectedSchema.addColumn(proj[i].name, proj[i].relAlias, proj[i].child.getDataType());
				} else {
					col = unprojectedSchema.getColumn(index);
					var type = unprojectedSchema.getType(index);
					projectedSchema.addColumn(col.getName(), col.getRelAlias(), type);
				}
			}

			this._projectedSchema = projectedSchema;
		}
	}, {
		key: 'getArgumentHtml',
		value: function getArgumentHtml() {
			var i,
			    args = [];
			var tmp, p;

			for (i = 0; i < this._proj.length; i++) {
				p = this._proj[i];

				if (p instanceof _Column.Column === true) {
					args.push(p.toString());
				} else {
					tmp = p.child.getFormulaHtml();
					tmp += '→';
					tmp += p.relAlias === null ? '' : p.relAlias + '.';
					tmp += p.name;

					args.push(tmp);
				}
			}

			return args.join(', ');
		}
	}]);

	return Projection;
})(_RANode2.RANode);

exports.Projection = Projection;

},{"./Column":84,"./ExecutionError":88,"./RANode":97,"./Schema":102,"./Table":105,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],97:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

/**
 * the base class for all relational algebra operations
 *
 * the calculation of an expression must follow the following 3 steps:
 * - the instances of the operators get plugged together building a operator tree
 *   at this stage no checking is done
 * - the `check()` function  is called recursively to check the correct nesting
 *   of the expressions like schema compability or existence of columns
 *   used in an projection
 *   The `check()` function also calculates the output schema for the specific
 *   operator.
 * - after check has been called the actual result is calculated when `getResult()` is called
 *   the results are not cached and return a new of Table that is independant of the results
 *   of their operands
 *   the session object is created automatically at the root of the tree
 * @constructor
 * @abstract
 * @returns {RANode} this is an abstract class
 */

var RANode = (function () {
	function RANode(functionName) {
		_classCallCheck(this, RANode);

		this._functionName = functionName || '';
		this._child = null;
		this._child2 = null;
		this._codeInfo = null;
		this._metaData = {};
		this._resultNumRows = -1;
		this._wrappedInBrackets = false;
		this._warnings = [];
	}

	_createClass(RANode, [{
		key: 'setCodeInfo',
		value: function setCodeInfo(line, column, offset, text) {
			this._codeInfo = {
				line: line,
				column: column,
				offset: offset,
				text: text
			};
			return this;
		}
	}, {
		key: 'setCodeInfoObject',
		value: function setCodeInfoObject(codeInfo) {
			this._codeInfo = codeInfo;
			return this;
		}
	}, {
		key: 'addWarning',
		value: function addWarning(msg, codeInfo) {
			var w = {
				message: msg
			};
			if (codeInfo) {
				w.line = codeInfo.line;
				w.column = codeInfo.column;
				w.codeInfo = codeInfo;
			}

			if (!this._warnings) this._warnings = [];

			this._warnings.push(w);
		}
	}, {
		key: 'getWarnings',
		value: function getWarnings(recursive) {
			var acc = this._warnings ? this._warnings.slice() : [];

			if (recursive === true && this.hasChild()) acc = acc.concat(this.getChild().getWarnings(true));
			if (recursive === true && this.hasChild2()) acc = acc.concat(this.getChild2().getWarnings(true));

			return acc;
		}
	}, {
		key: 'setWrappedInBrackets',
		value: function setWrappedInBrackets(wrappedInBrackets) {
			this._wrappedInBrackets = wrappedInBrackets === undefined ? true : wrappedInBrackets;
		}
	}, {
		key: 'throwExecutionError',
		value: function throwExecutionError(message) {
			throw new _ExecutionError.ExecutionError(message, this._codeInfo);
		}
	}, {
		key: 'getSchema',
		value: function getSchema() {
			throw new Error('not implemented: needs to be overwritten');
		}
	}, {
		key: 'getChild',
		value: function getChild() {
			return this._child;
		}
	}, {
		key: 'getChild2',
		value: function getChild2() {
			return this._child2;
		}
	}, {
		key: 'hasChild2',
		value: function hasChild2() {
			return typeof this._child2 != 'undefined' && this._child2 !== null;
		}
	}, {
		key: 'hasChild',
		value: function hasChild() {
			return typeof this._child != 'undefined' && this._child !== null;
		}
	}, {
		key: 'setChild',
		value: function setChild(child) {
			this._child = child;
		}
	}, {
		key: 'setChild2',
		value: function setChild2(child2) {
			throw new Error('not implemented: needs to be overwritten');
		}
	}, {
		key: 'setMetaData',
		value: function setMetaData(key, value) {
			if (!this._metaData) this._metaData = {};
			this._metaData[key] = value;
		}
	}, {
		key: 'hasMetaData',
		value: function hasMetaData(key) {
			if (!this._metaData) return false;
			return typeof this._metaData[key] !== 'undefined';
		}
	}, {
		key: 'getMetaData',
		value: function getMetaData(key) {
			return this._metaData[key];
		}
	}, {
		key: 'getResultNumRows',
		value: function getResultNumRows() {
			if (typeof this._resultNumRows == 'undefined' || this._resultNumRows == -1) throw new Error('result num rows not set! call only after getResult');

			return this._resultNumRows;
		}
	}, {
		key: 'setResultNumRows',
		value: function setResultNumRows(num) {
			this._resultNumRows = num;
		}

		/**
   * every implementation has to call
   *  `session = this._returnOrCreateSession(session);`
   * to initialize the session if necessary
   *
   * @param {Object} [session] the session object or undefined if called on a root node
   */
	}, {
		key: 'getResult',
		value: function getResult(session) {
			throw new Error('not implemented: needs to be overwritten');
		}

		/**
   * this method is called in every getResult() method
   *
   * this is actually a hack due to the lack of a statement object
   * there is no place to store data that can be used
   * by all operators
   *
   * the method will create a new session when called with undefined
   * or just returns the argument
   *
   * @param   {Object} session the already initialized session object or undefined
   * @returns {Object} [[Description]]
   */
	}, {
		key: '_returnOrCreateSession',
		value: function _returnOrCreateSession(session) {
			if (typeof session === 'undefined') {
				// create a new session
				return {
					statement_timestamp: new Date()
				};
			} else {
				return session;
			}
		}
	}, {
		key: 'getArgumentHtml',
		value: function getArgumentHtml() {
			return '';
		}
	}, {
		key: 'getFormulaHtml',
		value: function getFormulaHtml(printChildren, isChildElement) {
			printChildren = typeof printChildren === 'undefined' ? true : printChildren;

			// used to prevent brackets for the root element
			isChildElement = typeof isChildElement === 'undefined' ? true : isChildElement;

			var s = '';
			if (this.hasChild() && this.hasChild2()) {
				// binary functions
				s += '<span class="math"> ' + this._functionName + ' </span>';
				s += '<sub> ' + this.getArgumentHtml() + ' </sub>';

				if (printChildren === true) {
					s = this.getChild().getFormulaHtml(printChildren) + s;
					s += this.getChild2().getFormulaHtml(printChildren);
				}
			} else if (this.hasChild()) {
				s += '<span class="math"> ' + this._functionName + ' </span>';
				s += '<sub> ' + this.getArgumentHtml() + ' </sub>';

				if (printChildren === true) {
					s += this.getChild().getFormulaHtml(printChildren);
				}
			} else {
				s += '<span class="math">' + this._functionName + '</span>';
			}

			s = '<span>' + s + '</span>';

			if (this._wrappedInBrackets === true && isChildElement === true) {
				return '(' + s + ')';
			} else {
				return s;
			}
		}
	}, {
		key: 'check',
		value: function check() {
			throw new Error('not implemented: needs to be overwritten');
		}
	}]);

	return RANode;
})();

exports.RANode = RANode;

},{"./ExecutionError":88,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10}],98:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Table = require('./Table');

var _Schema = require('./Schema');

/**
 * the base of all relational algebra statements
 * @param   {String} functionName the name of the relation
 * @returns {Relation}
 * @constructor
 * @augments RANode
 */

var Relation = (function (_RANode) {
	_inherits(Relation, _RANode);

	function Relation(functionName) {
		_classCallCheck(this, Relation);

		_get(Object.getPrototypeOf(Relation.prototype), 'constructor', this).call(this, functionName);
		this._table = new _Table.Table();
	}

	_createClass(Relation, [{
		key: 'setChild',
		value: function setChild() {
			throw new Error('not implemented: needs to be overwritten');
		}
	}, {
		key: 'setSchema',
		value: function setSchema(schema, doNotSetRelAlias) {
			this._schema = schema.copy();
			if (doNotSetRelAlias !== true) this._schema.setRelAlias(this._functionName);
			this._table.setSchema(this._schema);

			return this;
		}
	}, {
		key: 'addRow',
		value: function addRow(arr) {
			this._table.addRow(arr);
		}
	}, {
		key: 'addRows',
		value: function addRows(arr) {
			this._table.addRows(arr);
		}
	}, {
		key: 'getResultNumRows',
		value: function getResultNumRows() {
			return this._resultNumRows;
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			this._returnOrCreateSession(session);

			var res = this._table.copy();

			res.eliminateDuplicateRows();
			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'getSchema',
		value: function getSchema() {
			return this._table.getSchema();
		}
	}, {
		key: 'check',
		value: function check() {
			// noop
		}
	}, {
		key: 'hasChild',
		value: function hasChild() {
			return false;
		}
	}, {
		key: 'copy',
		value: function copy() {
			var c = new Relation(this._functionName);
			c.setSchema(this._schema);
			c._table = this._table.copy();
			return c;
		}
	}]);

	return Relation;
})(_RANode2.RANode);

exports.Relation = Relation;

},{"./ExecutionError":88,"./RANode":97,"./Schema":102,"./Table":105,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],99:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Schema = require('./Schema');

var _Column = require('./Column');

/**
 * relational algebra anti-join operator
 *
 * the columns that should be renamed are added via `addRenaming()`
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}        child the left child expression
 * @returns {RenameColumns}
 */

var RenameColumns = (function (_RANode) {
	_inherits(RenameColumns, _RANode);

	function RenameColumns(child) {
		_classCallCheck(this, RenameColumns);

		_get(Object.getPrototypeOf(RenameColumns.prototype), 'constructor', this).call(this, '&rho;');

		this._renameList = [];

		this.setChild(child);
		this._schema = null;
	}

	_createClass(RenameColumns, [{
		key: 'getSchema',
		value: function getSchema() {
			return this._schema;
		}
	}, {
		key: 'addRenaming',
		value: function addRenaming(newName, oldName, oldRelAlias) {
			this._renameList.push({
				newName: newName,
				oldName: oldName,
				oldRelAlias: oldRelAlias
			});
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();

			var schemaA = this._child.getSchema().copy();
			var schema = new _Schema.Schema();
			var list = this._renameList;
			var i, j, oldColumn, columnRenamed, e;

			// check the rename list
			for (i = 0; i < list.length; i++) {
				if (schemaA.getColumnIndex(list[i].oldName, list[i].oldRelAlias, false) === -1) {
					this.throwExecutionError(i18n.t('db.messages.exec.error-column-not-found-name', { column: _Column.Column.printColumn(list[i].oldName, list[i].oldRelAlias), schema: schemaA.toString() }));
				}
			}

			// create the new schema
			for (i = 0; i < schemaA.getSize(); i++) {
				oldColumn = schemaA.getColumn(i);

				columnRenamed = false;
				for (j = 0; j < list.length; j++) {
					e = list[j];
					if (e.oldName == oldColumn.getName() && (e.oldRelAlias === null || e.oldRelAlias == oldColumn.getRelAlias())) {

						// add column with new name
						schema.addColumn(e.newName, oldColumn.getRelAlias(), oldColumn.getType());

						columnRenamed = true;
						break;
					}
				}

				if (columnRenamed) continue;

				// add the not renamed column with its original
				schema.addColumn2(schemaA.getColumn(i));
			}

			this._schema = schema;
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var res = this._child.getResult(session).copy();
			res.setSchema(this.getSchema());

			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'getArgumentHtml',
		value: function getArgumentHtml() {
			var out = [];
			var list = this._renameList;
			for (var i = 0; i < list.length; i++) {
				var e = list[i];
				out.push(e.newName + '←' + _Column.Column.printColumn(e.oldName, e.oldRelAlias));
			}

			return out.join(', ');
		}
	}]);

	return RenameColumns;
})(_RANode2.RANode);

exports.RenameColumns = RenameColumns;

},{"./Column":84,"./ExecutionError":88,"./RANode":97,"./Schema":102,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],100:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

/**
 * relational algebra anti-join operator
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}         child           the left child expression
 * @param {String} new alias for the relation as String
 * @returns {RenameRelation}
 */

var RenameRelation = (function (_RANode) {
	_inherits(RenameRelation, _RANode);

	function RenameRelation(child, newRelAlias) {
		_classCallCheck(this, RenameRelation);

		_get(Object.getPrototypeOf(RenameRelation.prototype), 'constructor', this).call(this, '&rho;');

		this._newRelAlias = newRelAlias;

		this.setChild(child);
		this._schema = null;
	}

	_createClass(RenameRelation, [{
		key: 'getSchema',
		value: function getSchema() {
			return this._schema;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();

			try {
				this._schema = this._child.getSchema().copy();
				this._schema.setRelAlias(this._newRelAlias);
			} catch (e) {
				this.throwExecutionError(e.message);
			}
		}
	}, {
		key: 'getResult',
		value: function getResult() {
			var res = this._child.getResult().copy();
			res.setSchema(this.getSchema());

			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'getArgumentHtml',
		value: function getArgumentHtml() {
			return this._newRelAlias;
		}
	}]);

	return RenameRelation;
})(_RANode2.RANode);

exports.RenameRelation = RenameRelation;

},{"./ExecutionError":88,"./RANode":97,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],101:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ExecutionError = require('./ExecutionError');

var _Join2 = require('./Join');

/**
 * relational algebra right outer Join operator
 *
 * this is just a wrapper for {@link Join}
 * @param   {RANode}               child     the left child expression
 * @param   {RANode}               child2    the right child expression
 * @param   {null|ValueExpr|Array} condition see condition of {@link Join}
 * @returns {RightOuterJoin}
 * @extends RANode
 * @constructor
 */

var RightOuterJoin = (function (_Join) {
  _inherits(RightOuterJoin, _Join);

  function RightOuterJoin(child, child2, condition) {
    _classCallCheck(this, RightOuterJoin);

    _get(Object.getPrototypeOf(RightOuterJoin.prototype), 'constructor', this).call(this, child, child2, condition, 'right', '⟖');
  }

  return RightOuterJoin;
})(_Join2.Join);

exports.RightOuterJoin = RightOuterJoin;

},{"./ExecutionError":88,"./Join":93,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],102:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _Column = require('./Column');

/**
 * the schema of a relation
 * @memberof RA
 * @constructor
 * @returns {Schema} returns a Schema
 */

var Schema = (function () {
	function Schema() {
		_classCallCheck(this, Schema);

		this._names = [];
		this._relAliases = [];
		this._types = [];
		this._size = 0;

		// key: name, value: [] of columns
		this._colIndexPerName = {};
	}

	_createClass(Schema, [{
		key: 'getSize',
		value: function getSize() {
			return this._size;
		}
	}, {
		key: 'addColumn',
		value: function addColumn(name, relAlias, type) {
			if (!(type === 'string' || type === 'date' || type === 'number' || type === 'boolean')) throw new Error('unknown type! ' + type);

			this._names.push(name);
			this._relAliases.push(relAlias);
			this._types.push(type);
			var index = this._size;

			if (this.isUnique(index) === false) {
				throw new Error(i18n.t('db.messages.exec.error-column-not-unique', { column: relAlias + '.' + name }));
			}

			//names
			this._addColToIndex(name, index);

			this._size++;

			return this;
		}
	}, {
		key: 'addColumn2',
		value: function addColumn2(column) {
			return this.addColumn(column.getName(), column.getRelAlias(), column.getType());
		}
	}, {
		key: '_addColToIndex',
		value: function _addColToIndex(name, index) {
			if (typeof this._colIndexPerName[name] == 'undefined') {
				this._colIndexPerName[name] = [index];
			} else {
				this._colIndexPerName[name].push(index);
			}
		}
	}, {
		key: '_removeColFromIndex',
		value: function _removeColFromIndex(index) {
			var name = this._names[index];
			var indices = this._colIndexPerName[name];
			indices.splice(indices.indexOf(index, 0), 1);
			if (indices.length === 0) delete this._colIndexPerName[name];
		}
	}, {
		key: 'removeColumn',
		value: function removeColumn(index) {
			this._names.splice(index, 1);
			this._relAliases.splice(index, 1);
			this._types.splice(index, 1);
			this._size--;

			// update names because index is 1 lower at all following columns
			for (var i = index; i < this._size; i++) {
				var name = this._names[i];
				var indices = this._colIndexPerName[name];
				for (var j = 0; j < indices.length; j++) {
					indices[j] -= 1;
				}
			}
		}
	}, {
		key: 'copy',
		value: function copy() {
			var res = new Schema();
			for (var i = 0; i < this._size; i++) {
				res.addColumn(this._names[i], this._relAliases[i], this._types[i]);
			}
			return res;
		}
	}, {
		key: 'isUnique',
		value: function isUnique(index) {
			for (var j = 0; j < this._size; j++) {
				if (index == j) continue;

				if (this._names[index] === this._names[j] && this._relAliases[index] === this._relAliases[j]) return false;
			}
			return true;
		}
	}, {
		key: 'getColumn',
		value: function getColumn(index) {
			return new _Column.Column(this._names[index], this._relAliases[index], this._types[index]);
		}
	}, {
		key: 'getColumns',
		value: function getColumns() {
			var a = [];
			for (var i = 0; i < this._size; i++) {
				a.push(this.getColumn(i));
			}
			return a;
		}
	}, {
		key: 'getColumnIndex',
		value: function getColumnIndex(name, relAlias, throwsExceptions) {
			if (typeof throwsExceptions == 'undefined') throwsExceptions = true;

			var indices = this.getColumnIndexArray(name, relAlias);

			if (indices.length === 0) {
				if (throwsExceptions) {
					var error = 'db.messages.exec.error-column-not-found-' + (typeof name === 'string' ? 'name' : 'index');
					throw new Error(i18n.t(error, { column: _Column.Column.printColumn(name, relAlias), schema: this.toString() }));
				} else return -1;
			} else if (indices.length == 1) return indices[0];else throw new Error(i18n.t('db.messages.exec.error-column-ambiguous', {
				column: _Column.Column.printColumn(name, relAlias),
				schema: this.toString()
			}));
		}

		/**
   * returns an array of Columns that appear in both
   * schemas (fully quallified)
   * @param {Schema} schemaB the other schema
   * @returns {Column[]} array of Column objects
   */
	}, {
		key: 'getConflictingColumnsArray',
		value: function getConflictingColumnsArray(schemaB) {
			var i, index;
			var conflicts = [];

			for (i = 0; i < this._size; i++) {
				index = schemaB.getColumnIndex(this._names[i], this._relAliases[i], false);
				if (index !== -1) {
					conflicts.push(this.getColumn(i));
				}
			}
			return conflicts;
		}
	}, {
		key: 'getColumnIndexArray',
		value: function getColumnIndexArray(name, relAlias) {
			var index;
			if (typeof name === 'string') {
				var indices = this._colIndexPerName[name];
				if (typeof indices == 'undefined' || indices === null) {
					return [];
				}

				if (relAlias === null) {
					return indices; // contains all indices of columns with the given name
				}

				// check relAlias for all columns with the same name
				for (var i = 0; i < indices.length; i++) {
					index = indices[i];
					if (this._relAliases[index] === relAlias) {
						return [index]; // found full qualified name; must be unique => only hit
					}
				}
			} else {
					// name is the column index (starting at 1)!!
					index = name - 1;

					if (name < 1 || name > this._size) throw new Error(i18n.t('db.messages.exec.error-column-index-out-of-range', {
						column: _Column.Column.printColumn(name, relAlias),
						schema: this.toString()
					}));

					if (relAlias === null) return [index];

					// check if column has the given relAlias
					if (this._relAliases[index] === relAlias) return [index];
				}

			return [];
		}
	}, {
		key: 'getType',
		value: function getType(index) {
			return this._types[index];
		}
	}, {
		key: 'equals',
		value: function equals(schemaB) {
			if (this.equalsTypeOnly(schemaB) === false) return false;

			for (var i = 0; i < this._size; i++) {
				if (this._names[i] !== schemaB._names[i] || this._relAliases[i] !== schemaB._relAliases[i]) return false;
			}

			return true;
		}
	}, {
		key: 'equalsTypeOnly',
		value: function equalsTypeOnly(schemaB) {
			if (this._size != schemaB._size) return false;

			for (var i = 0; i < this._size; i++) {
				if (this._types[i] !== schemaB._types[i]) return false;
			}

			return true;
		}

		// no index => all
	}, {
		key: 'setRelAlias',
		value: function setRelAlias(relAlias, index) {
			var setRelAliasAtIndex = function setRelAliasAtIndex(schema, relAlias, index) {
				schema._relAliases[index] = relAlias;

				if (schema.isUnique(index) === false) {
					throw new Error(i18n.t('db.messages.exec.error-could-not-change-rel-alias-ambiguity', { alias: relAlias }));
				}
			};

			if (typeof index == 'undefined') {
				// set all relAliases
				for (var i = 0; i < this._size; i++) setRelAliasAtIndex(this, relAlias, i);
			} else {
				setRelAliasAtIndex(this, relAlias, index);
			}
		}
	}, {
		key: 'setName',
		value: function setName(newName, index) {
			var oldName = this._names[index];

			// update index
			this._removeColFromIndex(index);
			this._addColToIndex(newName, index);

			this._names[index] = newName;

			if (this.isUnique(index) === false) {
				throw new Error(i18n.t('db.messages.exec.error-could-not-change-rel-alias-ambiguity', {
					newName: newName,
					oldName: oldName,
					schema: this.toString()
				}));
			}
		}
	}, {
		key: 'needsFullName',
		value: function needsFullName(index) {
			return this._colIndexPerName[this._names[index]].length > 1;
		}
	}, {
		key: 'getName',
		value: function getName(index) {
			return this._names[index];
		}
	}, {
		key: 'getFullName',
		value: function getFullName(index) {
			return (this._relAliases[index] ? this._relAliases[index] + '.' : '') + this._names[index];
		}
	}, {
		key: 'toString',
		value: function toString() {
			var list = [];

			for (var i = 0; i < this._size; i++) {
				var c = this.getColumn(i);
				var type = this.getType(i);
				var name = c.toString();
				/*if(this.needsFullName(i))
     name = c.toString();
     else
     name = c.getName();*/

				list.push(name + ' : ' + type);
			}
			return '[' + list.join(', ') + ']';
		}

		/**
   * concatinates the two given schemas
   * @param   {Schema} schemaA a Schema
   * @param   {Schema} schemaB a Schema
   * @returns {Schema} concatinated schema
   */
	}], [{
		key: 'concat',
		value: function concat(schemaA, schemaB) {
			var schema = schemaA.copy();

			var numColsB = schemaB.getSize();
			for (var i = 0; i < numColsB; i++) {
				var col = schemaB.getColumn(i);
				var type = schemaB.getType(i);
				schema.addColumn(col.getName(), col.getRelAlias(), type);
			}
			return schema;
		}

		/**
   * concatinates the two given schemas like required by a natural join
   * @param   {Schema}  schemaA             the first Schema
   * @param   {Schema}  schemaB             the second Schema
   * @param   {Boolean} keepColsFromSchemaA wether the columns of the left (true)
   *                                      or the right (false) schema should be kept
   *                                      if they have the same name
   * @param   {Array}   [restrictToColumns] optional argument to indicate that only the columns
   *                                      with names listed in the Array of Strings should
   *                                      be considered for the equality search.
   *                                      This is used for the USING() clause in SQL that is
   *                                      actually a restricted version of a natural join
   * @returns {Object}  an object {keep, schema} where keep is an Object describing which columns/indices
   *                                             of which schema schould be kept and which not
   */
	}, {
		key: 'concatNatural',
		value: function concatNatural(schemaA, schemaB, keepColsFromSchemaA, restrictToColumns) {
			if (typeof keepColsFromSchemaA === 'undefined') keepColsFromSchemaA = true;
			// use only a certain set of columns (all by default)
			if (typeof restrictToColumns === 'undefined') restrictToColumns = false;

			var sizeA = schemaA.getSize();
			var sizeB = schemaB.getSize();
			var work = {
				keepA: new Array(sizeA),
				keepB: new Array(sizeB),
				size: -1, // size of schema

				keepIndicesA: [],
				keepIndicesB: []
			};
			var i, j;

			// init
			for (i = 0; i < sizeA; i++) {
				work.keepA[i] = true;
			}
			for (i = 0; i < sizeB; i++) {
				work.keepB[i] = true;
			}

			// find columns with the same name in schemaA and schemaB
			for (i = 0; i < sizeA; i++) {
				var candidate = schemaA.getColumn(i);
				if (restrictToColumns !== false && restrictToColumns.indexOf(candidate.getName()) === -1) {
					// skip column if it is not in the restriction set
					continue;
				}

				var colIndicesInA = schemaA.getColumnIndexArray(candidate.getName(), null);
				var colIndicesInB = schemaB.getColumnIndexArray(candidate.getName(), null);

				if (colIndicesInA.length === 0 || colIndicesInB.length === 0) continue;

				if (keepColsFromSchemaA) {
					// keep the all columns (with this name) in A and none (with this name) in B
					for (j = 0; j < colIndicesInB.length; j++) work.keepB[colIndicesInB[j]] = false;
				} else {
					// keep the all columns (with this name) in B and none (with this name) in A
					for (j = 0; j < colIndicesInA.length; j++) work.keepA[colIndicesInA[j]] = false;
				}
			}

			// generate concatenated schema from work-information
			var schema = new Schema();
			var col;
			for (i = 0; i < sizeA; i++) {
				if (work.keepA[i] === false) continue;

				col = schemaA.getColumn(i);
				schema.addColumn(col.getName(), col.getRelAlias(), schemaA.getType(i));
			}
			for (i = 0; i < sizeB; i++) {
				if (work.keepB[i] === false) continue;

				col = schemaB.getColumn(i);
				schema.addColumn(col.getName(), col.getRelAlias(), schemaB.getType(i));
			}

			work.size = schema.getSize();

			// create arrays with the indices we want to keep
			for (i = 0; i < sizeA; i++) {
				if (work.keepA[i] === false) continue;
				work.keepIndicesA.push(i);
			}
			for (i = 0; i < sizeB; i++) {
				if (work.keepB[i] === false) continue;
				work.keepIndicesB.push(i);
			}

			return {
				keep: work,
				schema: schema
			};
		}
	}]);

	return Schema;
})();

exports.Schema = Schema;

},{"./Column":84,"./ExecutionError":88,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10}],103:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Table = require('./Table');

var _ValueExpr = require('./ValueExpr');

var ValueExpr = _interopRequireWildcard(_ValueExpr);

var Selection = (function (_RANode) {
	_inherits(Selection, _RANode);

	function Selection(child, condition) {
		_classCallCheck(this, Selection);

		_get(Object.getPrototypeOf(Selection.prototype), 'constructor', this).call(this, '&sigma;');
		this._condition = condition;

		this.setChild(child);
		if (condition instanceof ValueExpr.ValueExpr == false) throw new Error('no condition given');

		this._schema = null;
	}

	_createClass(Selection, [{
		key: 'getSchema',
		value: function getSchema() {
			return this._schema;
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var res = new _Table.Table();
			var org = this.getChild().getResult(session);
			res.setSchema(org.getSchema());

			// copy
			var condition = this._condition;
			var numRows = org.getNumRows();
			for (var i = 0; i < numRows; i++) {
				var row = org.getRow(i);

				if (condition.evaluate(row, null, i, session) === true) res.addRow(row);
			}

			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();

			// schema of union is the left schema
			this._schema = this._child.getSchema();

			this._condition.check(this._schema);
			if (this._condition.getDataType() !== 'boolean') {
				this.throwExecutionError(i18n.t('db.messages.exec.error-condition-must-be-boolean'));
			}
		}
	}, {
		key: 'getArgumentHtml',
		value: function getArgumentHtml() {
			return this._condition.getFormulaHtml();
		}
	}]);

	return Selection;
})(_RANode2.RANode);

exports.Selection = Selection;

},{"./ExecutionError":88,"./RANode":97,"./Table":105,"./ValueExpr":107,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12,"babel-runtime/helpers/interop-require-wildcard":13}],104:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Table = require('./Table');

var _Join = require('./Join');

/**
 * relational algebra semi-join operator
 *
 * @extends RANode
 * @constructor
 * @param   {RANode}        child          the left child expression
 * @param   {RANode}        child2         the right child expression
 * @param   {Boolean}       isLeftSemiJoin true if if is a left semi join; false for right semi join
 * @returns {SemiJoin}
 */

var SemiJoin = (function (_RANode) {
	_inherits(SemiJoin, _RANode);

	function SemiJoin(child, child2, isLeftSemiJoin) {
		_classCallCheck(this, SemiJoin);

		_get(Object.getPrototypeOf(SemiJoin.prototype), 'constructor', this).call(this, isLeftSemiJoin ? '⋉' : '⋊');

		this.setChild(child);
		this.setChild2(child2);

		this._isLeftSemiJoin = isLeftSemiJoin;

		// is set by check
		this._condition = null;
		this._schema = null;
	}

	_createClass(SemiJoin, [{
		key: 'setChild2',
		value: function setChild2(child2) {
			this._child2 = child2;
		}
	}, {
		key: 'getSchema',
		value: function getSchema() {
			return this._schema;
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var res = new _Table.Table();
			res.setSchema(this.getSchema());

			var orgA = this._child.getResult(session);
			var orgB = this._child2.getResult(session);

			// copy
			var condition = this._condition;

			// nested loop join
			var numRowsA = orgA.getNumRows();
			var numRowsB = orgB.getNumRows();

			for (var i = 0; i < numRowsA; i++) {
				var rowA = orgA.getRow(i);

				for (var j = 0; j < numRowsB; j++) {
					var rowB = orgB.getRow(j);

					if (condition.evaluate(rowA, rowB, i, session) === true) if (this._isLeftSemiJoin) res.addRow(rowA);else res.addRow(rowB);
				}
			}

			res.eliminateDuplicateRows();
			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();
			this._child2.check();

			var schemaA = this._child.getSchema();
			var schemaB = this._child2.getSchema();

			this._condition = _Join.Join.getNaturalJoinCondition(schemaA, schemaB);
			this.setMetaData('naturalJoinConditions', _Join.Join.getNaturalJoinConditionArray(schemaA, schemaB));

			if (this._isLeftSemiJoin) {
				this._schema = schemaA;
			} else {
				this._schema = schemaB;
			}

			this._condition.check(schemaA, schemaB);
			if (this._condition.getDataType() !== 'boolean') {
				this.throwExecutionError(i18n.t('db.messages.exec.error-condition-must-be-boolean'));
			}
		}
	}]);

	return SemiJoin;
})(_RANode2.RANode);

exports.SemiJoin = SemiJoin;

},{"./ExecutionError":88,"./Join":93,"./RANode":97,"./Table":105,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],105:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _Schema = require('./Schema');

var _Relation = require('./Relation');

var Table = (function () {
	function Table() {
		_classCallCheck(this, Table);

		this._rows = [];
		this._schema = new _Schema.Schema();
	}

	_createClass(Table, [{
		key: 'addRow',
		value: function addRow(dataArray) {
			this._rows.push(dataArray);
		}
	}, {
		key: 'addRows',
		value: function addRows(rows) {
			for (var i = 0; i < rows.length; i++) {
				this.addRow(rows[i]);
			}
		}
	}, {
		key: 'setSchema',
		value: function setSchema(schema) {
			if (schema instanceof _Schema.Schema === false) throw new Error("illegal argument: no schema");

			this._schema = schema;

			return this;
		}
	}, {
		key: 'getSchema',
		value: function getSchema() {
			return this._schema;
		}
	}, {
		key: 'getRow',
		value: function getRow(i) {
			return this._rows[i];
		}
	}, {
		key: 'getRows',
		value: function getRows() {
			return this._rows;
		}
	}, {
		key: 'getNumRows',
		value: function getNumRows() {
			return this._rows.length;
		}
	}, {
		key: 'getNumCols',
		value: function getNumCols() {
			return this._schema.getSize();
		}
	}, {
		key: 'getValueHtmlAt',
		value: function getValueHtmlAt(row, col) {
			var value = this._rows[row][col];
			var type = this._schema.getType(col);

			var text;

			if (value === null) {
				text = 'null';
			} else {
				switch (type) {
					case 'number':
					case 'string':
						text = value;
						break;
					case 'date':
						text = value.getFullYear() + '-' + (value.getMonth() + 1 < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1) + '-' + (value.getDate() < 10 ? '0' + value.getDate() : value.getDate());
						break;
					case 'boolean':
						text = value ? 'true' : 'false';
						break;
					default:
						throw new Error('unknown type ' + type);
				}
			}

			return '<span class="' + (value === null ? 'null ' + type : type) + '">' + text + '</span>';
		}
	}, {
		key: 'getHtml',
		value: function getHtml(unqualifiedColumnNames, maxRows, offset) {
			offset = offset || 0;

			var numCols = this.getNumCols();
			var i;

			var thead = '<thead><tr>';
			for (i = 0; i < numCols; i++) {
				var c = this._schema.getColumn(i);

				if (unqualifiedColumnNames) thead += '<th>' + c.getName() + '</th>';else thead += '<th>' + c.toString() + '</th>';
			}
			thead += '</tr></thead>';

			var tbody = '<tbody>';
			var numRows = this.getNumRows();
			var end = numRows;
			if (maxRows) end = Math.min(numRows, offset + maxRows);

			for (i = offset; i < end; i++) {
				var tr = '<tr>';
				for (var j = 0; j < numCols; j++) tr += '<td>' + this.getValueHtmlAt(i, j) + '</td>';

				tbody += tr + '</tr>';
			}

			return '<table>' + thead + tbody + '</table>';
		}
	}, {
		key: 'equals',
		value: function equals(table) {
			if (table instanceof Table === false) throw new Error("can not compare");

			// compare schema
			if (this._schema.equals(table._schema) === false) return false;

			// compare rows
			if (this._rows.length != table._rows.length) return false;

			for (var i = 0; i < this._rows.length; i++) if (Table.rowEqualsRow(this._rows[i], table._rows[i]) == false) return false;

			return true;
		}
	}, {
		key: 'eliminateDuplicateRows',
		value: function eliminateDuplicateRows() {
			var uniqueRows = new _Map();
			for (var i = 0; i < this._rows.length; i++) {
				var key = JSON.stringify(this._rows[i]);
				if (uniqueRows.has(key) === false) {
					uniqueRows.set(key, this._rows[i]);
				}
			}

			this._rows = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = _getIterator(uniqueRows.values()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var value = _step.value;

					this._rows.push(value);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator['return']) {
						_iterator['return']();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: 'sort',
		value: function sort(sortByColumnIndices, sortAscending) {
			var size = this.getNumCols();
			var i;

			if (typeof sortByColumnIndices == 'undefined') {
				sortByColumnIndices = [];
				for (i = 0; i < size; i++) {
					sortByColumnIndices[i] = i;
				}
			}
			if (typeof sortAscending == 'undefined') {
				sortAscending = [];
				for (i = 0; i < sortByColumnIndices.length; i++) {
					sortAscending[i] = true;
				}
			}

			// check indices
			if (sortByColumnIndices.length > size) throw new Error('invalid sort cols');

			for (i = 0; i < sortByColumnIndices.length; i++) {
				if (sortByColumnIndices[i] >= size || sortByColumnIndices[i] < 0) throw new Error('invalid sort cols');
			}

			// check sort order array
			var sortByColumnIndicesLength = sortByColumnIndices.length;
			if (sortByColumnIndicesLength != sortAscending.length) throw new Error('invalid sort cols');

			var sortByColumnIndicesTypes = [];
			for (i = 0; i < sortByColumnIndices.length; i++) {
				sortByColumnIndicesTypes[i] = this._schema.getType(sortByColumnIndices[i]);
			}

			var compare = function compare(rowA, rowB, col, mul, type) {
				var o1 = rowA[col];
				var o2 = rowB[col];

				if (o1 == null && o2 == null) {
					return 0;
				} else if (o1 == null && o2 != null) {
					return mul * 1;
				} else if (o1 != null && o2 == null) {
					return mul * -1;
				} else if (type == 'number' || type == 'date' || type == 'boolean') {
					return mul * (o1 - o2);
				} else if (typeof o1 == 'string') {
					return mul * o1.localeCompare(o2);
				}
			};

			var compareAll = function compareAll(rowA, rowB) {
				var mul, col, type;

				var last = 0;
				for (var i = 0; i < sortByColumnIndicesLength; i++) {
					mul = sortAscending[i] ? 1 : -1;
					col = sortByColumnIndices[i];
					type = sortByColumnIndicesTypes[i];

					last = compare(rowA, rowB, col, mul, type);
					if (last === 0) continue;

					return last;
				}
				return last;
			};

			this._rows.sort(compareAll);
		}
	}, {
		key: 'copy',
		value: function copy() {
			var res = new Table();
			res.setSchema(this.getSchema().copy());
			res.addRows(this.getRows());
			return res;
		}
	}, {
		key: 'createRelation',
		value: function createRelation(name) {
			var relation = new _Relation.Relation(name);
			relation.setSchema(this.getSchema().copy());
			relation.addRows(this.getRows());
			return relation;
		}
	}], [{
		key: 'rowEqualsRow',
		value: function rowEqualsRow(rowA, rowB) {
			if (rowA.length != rowB.length) return false;

			for (var i = 0; i < rowA.length; i++) {
				if (rowA[i] !== rowB[i]) {
					return false;
				}
			}

			return true;
		}
	}]);

	return Table;
})();

exports.Table = Table;

},{"./ExecutionError":88,"./Relation":98,"./Schema":102,"babel-runtime/core-js/get-iterator":1,"babel-runtime/core-js/map":2,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10}],106:[function(require,module,exports){
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _RANode2 = require('./RANode');

var _Table = require('./Table');

/**
 * This is the Union operation
 * The two child expression must have a union compatible schema.
 * The schema of the left child is used as the output schema.
 *
 * Union is done by concatenating the two results (left||right)
 *
 * @constructor
 * @extends RANode
 * @param   {RANode} child  left child expression
 * @param   {RANode} child2 right child expression
 * @returns {Union}
 */

var Union = (function (_RANode) {
	_inherits(Union, _RANode);

	function Union(child, child2) {
		_classCallCheck(this, Union);

		_get(Object.getPrototypeOf(Union.prototype), 'constructor', this).call(this, '∪');

		this.setChild(child);
		this.setChild2(child2);

		this._schema = null; // is set by check
	}

	_createClass(Union, [{
		key: 'setChild2',
		value: function setChild2(child2) {
			this._child2 = child2;
		}
	}, {
		key: 'getSchema',
		value: function getSchema() {
			return this._schema;
		}
	}, {
		key: 'getResult',
		value: function getResult(session) {
			session = this._returnOrCreateSession(session);

			var res = new _Table.Table();
			var orgA = this.getChild().getResult(session);
			var orgB = this.getChild2().getResult(session);
			res.setSchema(this._schema);

			// copy
			res.addRows(orgA.getRows());
			res.addRows(orgB.getRows());

			res.eliminateDuplicateRows();
			this.setResultNumRows(res.getNumRows());
			return res;
		}
	}, {
		key: 'check',
		value: function check() {
			this._child.check();
			this._child2.check();

			if (this._child.getSchema().equalsTypeOnly(this._child2.getSchema()) == false) {
				this.throwExecutionError(i18n.t('db.messages.exec.error-schemas-not-unifiable', { schemaA: this._child.getSchema(), schemaB: this._child2.getSchema() }));
			}

			// schema of union is the left schema
			this._schema = this._child.getSchema().copy();
		}
	}]);

	return Union;
})(_RANode2.RANode);

exports.Union = Union;

},{"./ExecutionError":88,"./RANode":97,"./Table":105,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],107:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _RegExp$escape = require('babel-runtime/core-js/regexp/escape')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _ExecutionError = require('./ExecutionError');

var _Column = require('./Column');

var MILLI_SEC_PER_DAY = 24 * 3600 * 1000;

if (!_RegExp$escape) {
	/**
  * polyfill for RegExp.escape
  * src: https://github.com/benjamingr/RegExp.escape/blob/master/polyfill.js
  *
  * @param s
  * @returns {string}
  */
	RegExp.escape = function (s) {
		return String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
	};
}

/**
 * the base class for all valueExpressions
 *
 * the calculation of an expression must follow the folowing 3 steps:
 * - the instances of the operators get plugged together building a operator tree
 *   at this stage no checking is done
 * - the `check()` function  is called recursivly to check the correct nesting
 *   of the expressions like schema compability or existance of columns
 *   used in an projection
 *   The `check()` function also calculates the output schema for the specific
 *   operator.
 * - after check has been called the actual result is calculated when `evaluate()` is called
 * @constructor
 * @memberof RA
 * @returns {ValueExpr}
 * @abstract
 */

var ValueExpr = (function () {
	function ValueExpr() {
		_classCallCheck(this, ValueExpr);

		this.func = null;
		this.dataType = null;
		this._wrappedInBrackets = false;
	}

	/**
  * value expression with no predefined datatype
  * @constructor
  * @memberof RA
  * @param {String}               name                   the name of a column
  * @param {String}               relAlias               the relation alias of the column
  * @param {Number}               manuallySetColumnIndex the index of the column described; this allows
  *                                                      to set the index within a schema because sometimes
  *                                                      it can not be determined by the check function
  * @returns {ValueExprColumnValue}
  * @extends RA.ValueExpr
  */

	/**
  * sets information about where the specific expression was defined in the code
  * this is used for providing better errors
  * @param   {Number}    line   the line in the code
  * @param   {Number}    column the column in the code
  * @param   {Number}    offset offset (in chars) in the code
  * @param   {String}    text   the part of the code that was parsed to the expression
  * @returns {ValueExpr} this
  */

	_createClass(ValueExpr, [{
		key: 'setCodeInfo',
		value: function setCodeInfo(line, column, offset, text) {
			this._codeInfo = {
				line: line,
				column: column,
				offset: offset,
				text: text
			};
			return this;
		}
	}, {
		key: 'setCodeInfoObject',
		value: function setCodeInfoObject(codeInfo) {
			this._codeInfo = codeInfo;
			return this;
		}
	}, {
		key: 'throwExecutionError',
		value: function throwExecutionError(message) {
			throw new _ExecutionError.ExecutionError(message, this._codeInfo);
		}

		/**
   * evaluates the _checked_ expression against one or two given tuples
   * if two tuples are given they are considered to be concatinated
   * @param {Array}  tuple            a tuple of a relation
   * @param {Array}  tupleB           a second tuple (that is meant to be seen as the right part of the first)
   * @param {Number} row              the index of the index (this is used for some functions)
   * @param {Object} statementSession the session object of the relalg statement
   * @abstract
   */
	}, {
		key: 'evaluate',
		value: function evaluate(tuple, tupleB, row, statementSession) {
			throw new Error('not implemented: needs to be overwritten');
		}

		/**
   * get the datatype that is returned by this expression
   * @abstract
   */
	}, {
		key: 'getDataType',
		value: function getDataType() {
			throw new Error('not implemented: needs to be overwritten');
		}

		/**
   * this method must be called before calling evaluate
   * with the schema(s) the tuples will be part of
   *
   * in this step the column names are checked and the indices
   * (used by evaluate) are calculated
   * @param {Schema} schemaA the schema for the first tuple
   * @param {Schema} schemaB the schema for the second tuple
   * @abstract
   */
	}, {
		key: 'check',
		value: function check(schemaA, schemaB) {
			throw new Error('not implemeted: needs to be overwritten');
		}

		/**
   * gets a html representation of the expression (as String)
   * @abstract
   */
	}, {
		key: 'getFormulaHtml',
		value: function getFormulaHtml() {
			throw new Error('not implemeted: needs to be overwritten');
		}

		/**
   * sets the indicator wether the expression was wrapped in brackets in the code
   * this is used for getFormulaHtml because at this stage there is no more information
   * about the precedence of the operators and how the expression was created
   * @param {Boolean} wrappedInBrackets true when this (sub) expression was wrapped in brackets
   */
	}, {
		key: 'setWrappedInBrackets',
		value: function setWrappedInBrackets(wrappedInBrackets) {
			this._wrappedInBrackets = wrappedInBrackets === undefined ? true : wrappedInBrackets;
		}
	}]);

	return ValueExpr;
})();

exports.ValueExpr = ValueExpr;

var ValueExprColumnValue = (function (_ValueExpr) {
	_inherits(ValueExprColumnValue, _ValueExpr);

	function ValueExprColumnValue(name, relAlias, manuallySetColumnIndex) {
		_classCallCheck(this, ValueExprColumnValue);

		_get(Object.getPrototypeOf(ValueExprColumnValue.prototype), 'constructor', this).call(this);
		this._name = name;
		this._relAlias = relAlias;
		this._index = null;

		if (typeof manuallySetColumnIndex !== 'undefined') {
			this._index = manuallySetColumnIndex;
		}
	}

	/**
  * all value expressions that are not column values belong here
  * @memberof RA
  * @constructor
  * @param {String} dataType the datatype the function returns
  * @param {String} func     the name of the function used
  * @param {Array}  args     array containing the specific arguments for the function
  */

	_createClass(ValueExprColumnValue, [{
		key: 'getDataType',
		value: function getDataType() {
			return this._type;
		}
	}, {
		key: 'check',
		value: function check(schemaA, schemaB) {
			if (this._index === null) {
				// the index has not been set manually
				this._index = ValueExprColumnValue._getColumnIndex(schemaA, schemaB, this._name, this._relAlias);
			}
			this._type = ValueExprColumnValue._getType(schemaA, schemaB, this._index);

			return true;
		}
	}, {
		key: 'evaluate',
		value: function evaluate(tupleA, tupleB, row, statementSession) {
			if (this._index >= tupleA.length) {
				return tupleB[this._index - tupleA.length];
			}
			return tupleA[this._index];
		}
	}, {
		key: 'toString',
		value: function toString() {
			return _Column.Column.printColumn(this._name, this._relAlias);
		}
	}, {
		key: 'getFormulaHtml',
		value: function getFormulaHtml() {
			var s = _Column.Column.printColumn(this._name, this._relAlias);
			if (this._wrappedInBrackets === true) {
				return '(' + s + ')';
			} else {
				return s;
			}
		}
	}], [{
		key: '_getColumnIndex',
		value: function _getColumnIndex(schemaA, schemaB, name, relAlias) {
			if (!schemaB || schemaB === null) {
				return schemaA.getColumnIndex(name, relAlias, true);
			}

			// if 2 schemas are given make sure the given relAlias.name is not ambiguous
			var index = schemaA.getColumnIndex(name, relAlias, false);
			if (index == -1) {
				// must be in schemaB!
				return schemaB.getColumnIndex(name, relAlias, true) + schemaA.getSize();
			} else {
				if (schemaB.getColumnIndex(name, relAlias, false) != -1) {
					// ambiguous!!
					throw new Error('column ' + relAlias + '.' + name + ' found in both schemas: ' + schemaA.toString() + " " + schemaB.toString());
				} else {
					return index;
				}
			}
		}
	}, {
		key: '_getType',
		value: function _getType(schemaA, schemaB, index) {
			if (index >= schemaA.getSize()) {
				return schemaB.getType(index - schemaA.getSize());
			}
			return schemaA.getType(index);
		}
	}]);

	return ValueExprColumnValue;
})(ValueExpr);

exports.ValueExprColumnValue = ValueExprColumnValue;

var ValueExprGeneric = (function (_ValueExpr2) {
	_inherits(ValueExprGeneric, _ValueExpr2);

	function ValueExprGeneric(dataType, func, args) {
		_classCallCheck(this, ValueExprGeneric);

		_get(Object.getPrototypeOf(ValueExprGeneric.prototype), 'constructor', this).call(this);
		this._func = func;
		this._dataType = dataType;
		this._dataTypeCalculated = null;
		this._args = args || [];
	}

	_createClass(ValueExprGeneric, [{
		key: 'evaluate',
		value: function evaluate(tupleA, tupleB, row, statementSession) {
			switch (this._dataType) {
				case 'string':
					return this._evaluateString(tupleA, tupleB, row, statementSession);
				case 'number':
					return this._evaluateNumber(tupleA, tupleB, row, statementSession);
				case 'boolean':
					return this._evaluateBoolean(tupleA, tupleB, row, statementSession);
				case 'date':
					return this._evaluateDate(tupleA, tupleB, row, statementSession);
				case 'null':
					return this._evaluateNull(tupleA, tupleB, row, statementSession);
				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: '_parseIsoDate',
		value: function _parseIsoDate(str) {
			var regex = /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/;
			var groups = regex.exec(str);

			var year = parseInt(groups[1], 10);
			var month = parseInt(groups[2], 10) - 1;
			var day = parseInt(groups[3], 10);
			var date = new Date(year, month, day);

			if (date.getFullYear() != year || date.getMonth() != month || date.getDate() != day) {
				this.throwExecutionError(i18n.t('db.messages.exec.error-invalid-date-format', { str: str }));
			}
			return date;
		}
	}, {
		key: '_evaluateNull',
		value: function _evaluateNull(tupleA, tupleB, row, statementSession) {
			var i, value;

			if (this._func === 'constant') {
				return null;
			}

			switch (this._func) {
				case 'constant':
					return null;
				case 'coalesce':
					// returns the first non null value or null if all are null
					for (i = 0; i < this._args.length; i++) {
						value = this._args[i].evaluate(tupleA, tupleB, row, statementSession);
						if (value !== null) return value;
					}
					return null;
				case 'caseWhen':
				case 'caseWhenElse':
					// conditions are on i%2 === 0
					// values on i%2 === 1

					// see http://www.postgresql.org/docs/9.3/static/functions-conditional.html
					for (i = 0; i < this._args.length; i += 2) {
						if (this._args[i].evaluate(tupleA, tupleB, row, statementSession) === true) {
							return this._args[i + 1].evaluate(tupleA, tupleB, row, statementSession);
						}
					}
					return null;
				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: '_evaluateDate',
		value: function _evaluateDate(tupleA, tupleB, row, statementSession) {
			var a, b;

			if (this._func === 'transaction_timestamp' || this._func === 'statement_timestamp' || this._func === 'now' || this._func === 'clock_timestamp') {
				// dates are the same due to lack of transaction concept
				// now is alias of transaction_timestamp
				return statementSession.statement_timestamp;
			}

			a = this._args[0].evaluate(tupleA, tupleB, row, statementSession);
			b = this._args.length > 1 && this._args[1].evaluate(tupleA, tupleB, row, statementSession);

			if (a === null || this._args.length > 1 && b === null) return null;

			switch (this._func) {
				case 'clock_timestamp':
					return new Date();

				case 'date':
					return this._parseIsoDate(a);
				case 'adddate':
					return new Date(a.getTime() + b * MILLI_SEC_PER_DAY);
				case 'subdate':
					return new Date(a.getTime() - b * MILLI_SEC_PER_DAY);
				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: '_checkDate',
		value: function _checkDate(schemaA, schemaB) {
			switch (this._func) {
				case 'transaction_timestamp':
				case 'statement_timestamp':
				case 'clock_timestamp':
				case 'now':
					return true;

				case 'date':
					return this._checkArgsDataType(schemaA, schemaB, ['string']);

				case 'adddate':
				case 'subdate':
					return this._checkArgsDataType(schemaA, schemaB, ['date', 'number']);

				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: '_evaluateBoolean',
		value: function _evaluateBoolean(tupleA, tupleB, row, statementSession) {
			var a, b, typeA;

			if (this._func === 'constant') {
				return this._args[0];
			}

			a = this._args[0].evaluate(tupleA, tupleB, row, statementSession);
			b = this._args.length > 1 && this._args[1].evaluate(tupleA, tupleB, row, statementSession);

			switch (this._func) {
				case 'not':
					if (a == 'unknown') return a;
					return !a;
				case 'and':
					if (a === false || b === false) return false;
					if (a === true && b === true) return true;
					return 'unknown';
				case 'or':
					if (a === true || b === true) return true;
					if (a === false && b === false) return false;
					return 'unknown';
				case 'xor':
					if (a === 'unknown' || b === 'unknown') return 'unknown';
					return a !== b;
				case '=':
				case '>=':
				case '<=':
				case '>':
				case '<':
				case '!=':
					typeA = this._args[0].getDataType();
					return ValueExprGeneric._condition_compare(a, b, typeA, this._func);
				case 'like':
				case 'ilike':
					return this._regex.test(a);
				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: '_checkBoolean',
		value: function _checkBoolean(schemaA, schemaB) {
			var typeA, typeB;

			switch (this._func) {
				case 'constant':
					return true;
				case 'not':
					return this._checkArgsDataType(schemaA, schemaB, ['boolean']);
				case 'and':
				case 'or':
				case 'xor':
					return this._checkArgsDataType(schemaA, schemaB, ['boolean', 'boolean']);
				case '=':
				case '>=':
				case '<=':
				case '>':
				case '<':
				case '!=':
					// check if the datatypes are identical
					this._args[0].check(schemaA, schemaB);
					this._args[1].check(schemaA, schemaB);

					typeA = this._args[0].getDataType();
					typeB = this._args[1].getDataType();
					if (typeA === 'null' || typeB === 'null') {
						return true;
					} else if (typeA === typeB) {
						return true;
					} else {
						this.throwExecutionError(i18n.t('db.messages.exec.error-could-not-compare-different-types', { typeA: typeA, typeB: typeB }));
					}
					return this._checkArgsDataType(schemaA, schemaB, ['boolean', 'boolean']);
				case 'like':
				case 'ilike':
					// http://www.postgresql.org/docs/9.4/static/functions-matching.html#FUNCTIONS-LIKE
					this._args[0].check(schemaA, schemaB);
					if (this._args[1].getDataType() !== 'string' || this._args[1]._func !== 'constant') {
						return false;
					}

					// cache regex
					var value = this._args[1]._args[0]; // direct access of constant value
					var regex_str = _RegExp$escape(value);
					regex_str = regex_str.replace(/([^\\]?)_/g, '$1.');
					regex_str = regex_str.replace(/([^\\]?)%/g, '$1.*');

					var flags = this._func === 'ilike' ? 'i' : '';

					this._regex = new RegExp('^' + regex_str + '$', flags);

					break;
				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: '_evaluateString',
		value: function _evaluateString(tupleA, tupleB, row, statementSession) {
			var a, value, i;

			switch (this._func) {
				case 'constant':
					return this._args[0];
				case 'lower':
				case 'upper':
					a = this._args[0].evaluate(tupleA, tupleB, row, statementSession);

					if (a === null) return null;else if (this._func === 'lower') {
						return a.toLowerCase();
					} else {
						return a.toUpperCase();
					}
					break;
				case 'concat':
					value = '';
					for (i = 0; i < this._args.length; i++) {
						a = this._args[i].evaluate(tupleA, tupleB, row, statementSession);
						if (a === null) {
							return null;
						}

						value += a;
					}
					return value;
				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: '_evaluateNumber',
		value: function _evaluateNumber(tupleA, tupleB, row, statementSession) {
			// no args
			switch (this._func) {
				case 'constant':
					return this._args[0];
			}

			// unary and binary functions
			var valueA = this._args.length > 0 ? this._args[0].evaluate(tupleA, tupleB, row, statementSession) : undefined;
			var valueB = this._args.length > 1 ? this._args[1].evaluate(tupleA, tupleB, row, statementSession) : undefined;

			switch (this._func) {
				case 'add':
					if (valueA === null || valueB === null) return null;
					return valueA + valueB;
				case 'sub':
					if (valueA === null || valueB === null) return null;
					return valueA - valueB;
				case 'mul':
					if (valueA === null || valueB === null) return null;
					return valueA * valueB;
				case 'div':
					if (valueA === null || valueB === null) return null;
					return valueA / valueB;
				case 'mod':
					if (valueA === null || valueB === null) return null;
					return valueA % valueB;

				case 'abs':
					if (valueA === null) return null;
					return Math.abs(valueA);

				case 'floor':
					if (valueA === null) return null;
					return Math.floor(valueA);

				case 'ceil':
					if (valueA === null) return null;
					return Math.ceil(valueA);

				case 'round':
					if (valueA === null) return null;
					return Math.round(valueA);

				case 'minus':
					if (valueA === null) return null;
					return -valueA;

				case 'rand':
					return Math.random();

				case 'rownum':
					return row + 1;

				case 'strlen':
					if (valueA === null) return null;
					return valueA.length;

				case 'year':
					if (valueA === null) return null;
					return valueA.getFullYear();
				case 'month':
					if (valueA === null) return null;
					return valueA.getMonth() + 1;
				case 'dayofmonth':
					if (valueA === null) return null;
					return valueA.getDate();
				case 'hour':
					if (valueA === null) return null;
					return valueA.getHours();
				case 'minute':
					if (valueA === null) return null;
					return valueA.getMinutes();
				case 'second':
					if (valueA === null) return null;
					return valueA.getSeconds();

				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: '_checkArgsDataType',
		value: function _checkArgsDataType(schemaA, schemaB, types_expected) {
			var i,
			    types_given = [];

			if (this._args.length != types_expected.length) {
				throw 'this should not happen: #args != #types';
			}

			for (i = 0; i < types_expected.length; i++) {
				this._args[i].check(schemaA, schemaB);
				types_given.push(this._args[i].getDataType());
			}

			for (i = 0; i < types_given.length; i++) {
				if (types_given[i] !== types_expected[i]) {
					this.throwExecutionError(i18n.t('db.messages.exec.error-function-expects-type', { func: this._func, expected: types_expected, given: types_given }));
				}
			}
			return true;
		}
	}, {
		key: 'getDataType',
		value: function getDataType() {
			if (this._dataTypeCalculated) {
				return this._dataTypeCalculated;
			}
			return this._dataType;
		}
	}, {
		key: 'check',
		value: function check(schemaA, schemaB) {
			switch (this._dataType) {
				case 'string':
					return this._checkString(schemaA, schemaB);
				case 'number':
					return this._checkNumber(schemaA, schemaB);
				case 'boolean':
					return this._checkBoolean(schemaA, schemaB);
				case 'date':
					return this._checkDate(schemaA, schemaB);
				case 'null':
					return this._checkNull(schemaA, schemaB);
				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: '_checkNull',
		value: function _checkNull(schemaA, schemaB) {
			var i, dataType;
			switch (this._func) {
				case 'constant':
					return true;
				case 'coalesce':
					if (this._args.length === 0) {
						throw 'this should not happen!';
					}

					// all arguments must be of same type or null
					this._args[0].check(schemaA, schemaB);
					this._dataTypeCalculated = this._args[0].getDataType();

					for (i = 1; i < this._args.length; i++) {
						this._args[i].check(schemaA, schemaB);
						dataType = this._args[i].getDataType();

						if (this._dataType === 'null' && dataType !== 'null') {
							this._dataTypeCalculated = dataType;
						} else if (dataType !== 'null' && this._dataType !== dataType) {
							this.throwExecutionError(i18n.t('db.messages.exec.error-function-expects-arguments-of-same-type', { func: 'COALESCE()' }));
						}
					}
					break;
				case 'caseWhen':
				case 'caseWhenElse':
					// conditions are on i%2 === 0
					// values on i%2 === 1

					// check conditions to be boolean
					for (i = 0; i < this._args.length; i += 2) {
						this._args[i].check(schemaA, schemaB);
						if (this._args[i].getDataType() !== 'boolean') {
							this.throwExecutionError(i18n.t('db.messages.exec.error-case-when-condition-must-be-boolean'));
						}
					}

					// all values must be of same type
					this._args[1].check(schemaA, schemaB);
					this._dataTypeCalculated = this._args[1].getDataType();

					for (i = 3; i < this._args.length; i += 2) {
						this._args[i].check(schemaA, schemaB);
						dataType = this._args[i].getDataType();

						if (this._dataType === 'null' && dataType !== 'null') {
							this._dataTypeCalculated = dataType;
						} else if (dataType !== 'null' && this._dataType !== dataType) {
							this.throwExecutionError(i18n.t('db.messages.exec.error-case-when-expects-results-of-same-type'));
						}
					}
					break;
				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: '_checkString',
		value: function _checkString(schemaA, schemaB) {
			var i, dataType;

			switch (this._func) {
				case 'constant':
					return true;
				case 'lower':
				case 'upper':
					return this._checkArgsDataType(schemaA, schemaB, ['string']);
				case 'concat':
					if (this._args.length === 0) {
						throw 'this should not happen!';
					}

					// all arguments must be of type String or null
					this._args[0].check(schemaA, schemaB);
					this._dataTypeCalculated = 'string';

					for (i = 1; i < this._args.length; i++) {
						this._args[i].check(schemaA, schemaB);
						dataType = this._args[i].getDataType();

						if (this._dataType === 'null' && dataType !== 'null') {
							this._dataTypeCalculated = dataType;
						} else if (dataType !== 'null' && this._dataType !== dataType) {
							this.throwExecutionError(i18n.t('db.messages.exec.error-function-expects-arguments-of-same-type', { func: 'CONCAT()' }));
						}
					}
					break;
				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: '_checkNumber',
		value: function _checkNumber(schemaA, schemaB) {
			switch (this._func) {
				case 'constant':
				case 'rand':
				case 'rownum':
					return true;
				case 'add':
				case 'sub':
				case 'mul':
				case 'div':
				case 'mod':
					return this._checkArgsDataType(schemaA, schemaB, ['number', 'number']);
				case 'abs':
				case 'floor':
				case 'ceil':
				case 'round':
				case 'minus':
					return this._checkArgsDataType(schemaA, schemaB, ['number']);
				case 'strlen':
					return this._checkArgsDataType(schemaA, schemaB, ['string']);

				case 'year':
				case 'month':
				case 'dayofmonth':
				case 'hour':
				case 'minute':
				case 'second':
					return this._checkArgsDataType(schemaA, schemaB, ['date']);

				default:
					throw 'this should not happen!';
			}
		}
	}, {
		key: 'toString',
		value: function toString() {
			var str, i;

			str = this._func + '(';
			for (i = 0; i < this._args.length; i++) {
				if (i != 0) {
					str += ', ';
				}
				str += this._args[i] === null ? 'null' : this._args[i].toString();
			}
			return str + ')';
		}
	}, {
		key: 'getFormulaHtml',
		value: function getFormulaHtml() {
			/*jshint validthis:true */
			function printValue(val, type) {
				if (val === null) {
					return 'null';
				}
				switch (type) {
					case 'number':
						return val;
					case 'string':
						return "'" + val + "'";
					case 'date':
						return val.getFullYear() + '-' + (val.getMonth() + 1 < 10 ? '0' + (val.getMonth() + 1) : val.getMonth() + 1) + '-' + (val.getDate() < 10 ? '0' + val.getDate() : val.getDate());
					case 'null':
						return 'null';
					case 'boolean':
						return val ? 'true' : 'false';
					default:
						throw new Error('unknown type ' + type);
				}
			}

			function printFunction(func_name) {
				var str, i;

				str = (func_name || this._func) + '(';
				for (i = 0; i < this._args.length; i++) {
					if (i != 0) {
						str += ', ';
					}
					str += this._args[i].getFormulaHtml();
				}
				return str + ')';
			}

			function printCase(hasElse) {
				// conditions are on i%2 === 0
				// values on i%2 === 1
				// else is the very last element (if present)

				var str = 'CASE';
				var i;
				for (i = 0; i < this._args.length - (hasElse ? 2 : 0); i += 2) {
					str += ' WHEN ' + this._args[i].getFormulaHtml() + ' THEN ' + this._args[i + 1].getFormulaHtml();
				}
				if (hasElse === true) {
					str += ' ELSE ' + this._args[this._args.length - 1].getFormulaHtml();
				}

				return str + ' END';
			}

			function binary(func_name) {
				var s = '';

				s += '<span> ' + (func_name || this._func) + ' </span>';
				s = this._args[0].getFormulaHtml() + s;
				s += this._args[1].getFormulaHtml();
				return '<span>' + s + '</span>';
			}

			function getFormula() {
				switch (this._func) {
					case 'constant':
						return printValue(this._args[0], this._dataTypeCalculated || this._dataType);
					case 'rand':
					case 'rownum':
					case 'abs':
					case 'ceil':
					case 'floor':
					case 'round':
					case 'year':
					case 'month':
					case 'dayofmonth':
					case 'hour':
					case 'minute':
					case 'second':
					case 'adddate':
					case 'subdate':
					case 'concat':
					case 'upper':
					case 'lower':
					case 'date':
					case 'coalesce':
						return printFunction.call(this);
					case 'strlen':
						return printFunction.call(this, 'length');

					case 'minus':
						return printFunction.call(this, '-');

					case 'not':
						return printFunction.call(this, '!');

					case 'caseWhen':
					case 'caseWhenElse':
						return printCase.call(this, this._func === 'caseWhenElse');

					case 'add':
					case 'sub':
					case 'mul':
					case 'div':
					case 'mod':

					case 'and':
					case 'or':
					case 'xor':

					case '=':
					case '>=':
					case '<=':
					case '>':
					case '<':
					case '!=':
					case 'like':
					case 'ilike':
						return binary.call(this, ({
							'add': '+',
							'sub': '-',
							'mul': '*',
							'div': '/',
							'mod': '%',

							'>=': '≥',
							'<=': '≤',
							'>': '&gt;',
							'<': '&lt;',
							'!=': '≠'
						})[this._func] || this._func);
				}

				return this.toString();
			}

			if (this._wrappedInBrackets === true) {
				return '( ' + getFormula.call(this) + ' )';
			} else {
				return getFormula.call(this);
			}
		}
	}], [{
		key: '_condition_compare',
		value: function _condition_compare(valueA, valueB, type, comperator) {
			if (valueA === null || valueB === null) {
				// null compared with any not null value => 'unknown'

				switch (comperator) {
					case '=':
					case '>=':
					case '<=':
						if (valueA === valueB) return true;
						return 'unknown';
					case '<':
					case '>':
						if (valueA === valueB) return false;
						return 'unknown';
					case '!=':
						return valueA !== valueB;
					default:
						throw new Error('unknown operator');
				}
			}

			switch (type) {
				case 'number':
				case 'string':
					switch (comperator) {
						case '=':
							return valueA == valueB;
						case '>':
							return valueA > valueB;
						case '<':
							return valueA < valueB;
						case '>=':
							return valueA >= valueB;
						case '<=':
							return valueA <= valueB;
						case '!=':
							return valueA !== valueB;
						default:
							throw new Error('unknown operator');
					}
					break;
				case 'date':
					switch (comperator) {
						case '=':
							return valueA.getTime() == valueB.getTime();
						case '>':
							return valueA > valueB;
						case '<':
							return valueA < valueB;
						case '>=':
							return valueA >= valueB;
						case '<=':
							return valueA <= valueB;
						case '!=':
							return valueA.getTime() !== valueB.getTime();
						default:
							throw new Error('unknown operator');
					}
					break;
				case 'boolean':
					if (typeof valueA !== 'boolean' || typeof valueB !== 'boolean') throw new Error('operands have different type');

					switch (comperator) {
						case '=':
							return valueA == valueB;
						case '>':
							return valueA > valueB;
						case '<':
							return valueA < valueB;
						case '>=':
							return valueA >= valueB;
						case '<=':
							return valueA <= valueB;
						case '!=':
							return valueA !== valueB;
						default:
							throw new Error('unknown operator');
					}
					break;
				default:
					throw new Error('unknown type ' + type);
			}
		}
	}]);

	return ValueExprGeneric;
})(ValueExpr);

exports.ValueExprGeneric = ValueExprGeneric;

},{"./Column":84,"./ExecutionError":88,"babel-runtime/core-js/regexp/escape":8,"babel-runtime/helpers/class-call-check":9,"babel-runtime/helpers/create-class":10,"babel-runtime/helpers/get":11,"babel-runtime/helpers/inherits":12}],108:[function(require,module,exports){
"use strict";

module.exports = (function () {
  function a(a, b) {
    function c() {
      this.constructor = a;
    }c.prototype = b.prototype, a.prototype = new c();
  }function b(a, b, c, d, e, f) {
    this.message = a, this.expected = b, this.found = c, this.offset = d, this.line = e, this.column = f, this.name = "SyntaxError";
  }function c(a) {
    function c() {
      return a.substring(fk, ek);
    }function d() {
      return fk;
    }function e() {
      return h(fk).line;
    }function f() {
      return h(fk).column;
    }function g(a) {
      throw j(a, null, fk);
    }function h(b) {
      function c(b, c, d) {
        var e, f;for (e = c; d > e; e++) f = a.charAt(e), "\n" === f ? (b.seenCR || b.line++, b.column = 1, b.seenCR = !1) : "\r" === f || "\u2028" === f || "\u2029" === f ? (b.line++, b.column = 1, b.seenCR = !0) : (b.column++, b.seenCR = !1);
      }return gk !== b && (gk > b && (gk = 0, hk = { line: 1, column: 1, seenCR: !1 }), c(hk, gk, b), gk = b), hk;
    }function i(a) {
      ik > ek || (ek > ik && (ik = ek, jk = []), jk.push(a));
    }function j(c, d, e) {
      function f(a) {
        var b = 1;for (a.sort(function (a, b) {
          return a.description < b.description ? -1 : a.description > b.description ? 1 : 0;
        }); b < a.length;) a[b - 1] === a[b] ? a.splice(b, 1) : b++;
      }function g(a, b) {
        function c(a) {
          function b(a) {
            return a.charCodeAt(0).toString(16).toUpperCase();
          }return a.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (a) {
            return "\\x0" + b(a);
          }).replace(/[\x10-\x1F\x80-\xFF]/g, function (a) {
            return "\\x" + b(a);
          }).replace(/[\u0180-\u0FFF]/g, function (a) {
            return "\\u0" + b(a);
          }).replace(/[\u1080-\uFFFF]/g, function (a) {
            return "\\u" + b(a);
          });
        }var d,
            e,
            f,
            g = new Array(a.length);for (f = 0; f < a.length; f++) g[f] = a[f].description;return d = a.length > 1 ? g.slice(0, -1).join(", ") + " or " + g[a.length - 1] : g[0], e = b ? '"' + c(b) + '"' : "end of input", "Expected " + d + " but " + e + " found.";
      }var i = h(e),
          j = e < a.length ? a.charAt(e) : null;return null !== d && f(d), new b(null !== c ? c : g(d, j), d, j, e, i.line, i.column);
    }function k() {
      var a,
          b,
          c = 134 * ek + 0,
          d = lk[c];return d ? (ek = d.nextPos, d.result) : (a = ek, b = la(), b !== Ob && (fk = a, b = Rb(b)), a = b, lk[c] = { nextPos: ek, result: a }, a);
    }function l() {
      var a,
          b,
          c = 134 * ek + 1,
          d = lk[c];return d ? (ek = d.nextPos, d.result) : (a = ek, b = ma(), b !== Ob && (fk = a, b = Rb(b)), a = b, lk[c] = { nextPos: ek, result: a }, a);
    }function m() {
      var b,
          c,
          d = 134 * ek + 2,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (b = ek, kk++, a.length > ek ? (c = a.charAt(ek), ek++) : (c = Ob, 0 === kk && i(Ub)), kk--, c === Ob ? b = Sb : (ek = b, b = Tb), lk[d] = { nextPos: ek, result: b }, b);
    }function n() {
      var b,
          c = 134 * ek + 3,
          d = lk[c];return d ? (ek = d.nextPos, d.result) : (a.substr(ek, 2) === Vb ? (b = Vb, ek += 2) : (b = Ob, 0 === kk && i(Wb)), b === Ob && (10 === a.charCodeAt(ek) ? (b = Xb, ek++) : (b = Ob, 0 === kk && i(Yb))), lk[c] = { nextPos: ek, result: b }, b);
    }function o() {
      var a,
          b = 134 * ek + 4,
          c = lk[b];return c ? (ek = c.nextPos, c.result) : (a = p(), a === Ob && (a = q()), lk[b] = { nextPos: ek, result: a }, a);
    }function p() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 134 * ek + 5,
          l = lk[k];if (l) return ek = l.nextPos, l.result;if ((kk++, b = ek, a.substr(ek, 2) === $b ? (c = $b, ek += 2) : (c = Ob, 0 === kk && i(_b)), c !== Ob ? (ac.test(a.charAt(ek)) ? (d = a.charAt(ek), ek++) : (d = Ob, 0 === kk && i(bc)), d !== Ob ? (e = ek, kk++, f = n(), f === Ob && (f = m()), kk--, f !== Ob ? (ek = e, e = Sb) : e = Tb, e !== Ob ? (fk = b, c = cc(), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, a.substr(ek, 2) === $b ? (c = $b, ek += 2) : (c = Ob, 0 === kk && i(_b)), c !== Ob ? (d = ek, kk++, e = n(), e === Ob && (e = m()), kk--, e !== Ob ? (ek = d, d = Sb) : d = Tb, d !== Ob ? (fk = b, c = cc(), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob))) if ((b = ek, a.substr(ek, 2) === $b ? (c = $b, ek += 2) : (c = Ob, 0 === kk && i(_b)), c !== Ob)) if ((ac.test(a.charAt(ek)) ? (d = a.charAt(ek), ek++) : (d = Ob, 0 === kk && i(bc)), d !== Ob)) {
        for (e = ek, f = [], g = ek, h = ek, kk++, j = n(), kk--, j === Ob ? h = Sb : (ek = h, h = Tb), h !== Ob ? (a.length > ek ? (j = a.charAt(ek), ek++) : (j = Ob, 0 === kk && i(Ub)), j !== Ob ? (h = [h, j], g = h) : (ek = g, g = Tb)) : (ek = g, g = Tb); g !== Ob;) f.push(g), g = ek, h = ek, kk++, j = n(), kk--, j === Ob ? h = Sb : (ek = h, h = Tb), h !== Ob ? (a.length > ek ? (j = a.charAt(ek), ek++) : (j = Ob, 0 === kk && i(Ub)), j !== Ob ? (h = [h, j], g = h) : (ek = g, g = Tb)) : (ek = g, g = Tb);f !== Ob && (f = a.substring(e, ek)), e = f, e !== Ob ? (f = ek, kk++, g = n(), g === Ob && (g = m()), kk--, g !== Ob ? (ek = f, f = Sb) : f = Tb, f !== Ob ? (fk = b, c = dc(e), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb);
      } else ek = b, b = Tb;else ek = b, b = Tb;return kk--, b === Ob && (c = Ob, 0 === kk && i(Zb)), lk[k] = { nextPos: ek, result: b }, b;
    }function q() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 134 * ek + 6,
          k = lk[j];if (k) return ek = k.nextPos, k.result;if ((b = ek, a.substr(ek, 2) === ec ? (c = ec, ek += 2) : (c = Ob, 0 === kk && i(fc)), c !== Ob)) {
        for (d = ek, e = [], f = ek, g = ek, kk++, a.substr(ek, 2) === gc ? (h = gc, ek += 2) : (h = Ob, 0 === kk && i(hc)), kk--, h === Ob ? g = Sb : (ek = g, g = Tb), g !== Ob ? (a.length > ek ? (h = a.charAt(ek), ek++) : (h = Ob, 0 === kk && i(Ub)), h !== Ob ? (g = [g, h], f = g) : (ek = f, f = Tb)) : (ek = f, f = Tb); f !== Ob;) e.push(f), f = ek, g = ek, kk++, a.substr(ek, 2) === gc ? (h = gc, ek += 2) : (h = Ob, 0 === kk && i(hc)), kk--, h === Ob ? g = Sb : (ek = g, g = Tb), g !== Ob ? (a.length > ek ? (h = a.charAt(ek), ek++) : (h = Ob, 0 === kk && i(Ub)), h !== Ob ? (g = [g, h], f = g) : (ek = f, f = Tb)) : (ek = f, f = Tb);e !== Ob && (e = a.substring(d, ek)), d = e, d !== Ob ? (a.substr(ek, 2) === gc ? (e = gc, ek += 2) : (e = Ob, 0 === kk && i(hc)), e !== Ob ? (fk = b, c = dc(d), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb);
      } else ek = b, b = Tb;return lk[j] = { nextPos: ek, result: b }, b;
    }function r() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 134 * ek + 7,
          k = lk[j];if (k) return ek = k.nextPos, k.result;for (kk++, b = ek, c = [], d = ek, e = [], f = o(); f !== Ob;) e.push(f), f = o();if (e !== Ob) {
        if ((f = [], jc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(kc)), g !== Ob)) for (; g !== Ob;) f.push(g), jc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(kc));else f = Tb;if (f !== Ob) {
          for (g = [], h = o(); h !== Ob;) g.push(h), h = o();g !== Ob ? (e = [e, f, g], d = e) : (ek = d, d = Tb);
        } else ek = d, d = Tb;
      } else ek = d, d = Tb;if (d !== Ob) for (; d !== Ob;) {
        for (c.push(d), d = ek, e = [], f = o(); f !== Ob;) e.push(f), f = o();if (e !== Ob) {
          if ((f = [], jc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(kc)), g !== Ob)) for (; g !== Ob;) f.push(g), jc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(kc));else f = Tb;if (f !== Ob) {
            for (g = [], h = o(); h !== Ob;) g.push(h), h = o();g !== Ob ? (e = [e, f, g], d = e) : (ek = d, d = Tb);
          } else ek = d, d = Tb;
        } else ek = d, d = Tb;
      } else c = Tb;return c !== Ob && (fk = b, c = cc()), b = c, kk--, b === Ob && (c = Ob, 0 === kk && i(ic)), lk[j] = { nextPos: ek, result: b }, b;
    }function s() {
      var b,
          c,
          d = 134 * ek + 8,
          e = lk[d];if (e) return ek = e.nextPos, e.result;for (kk++, b = [], c = o(), c === Ob && (jc.test(a.charAt(ek)) ? (c = a.charAt(ek), ek++) : (c = Ob, 0 === kk && i(kc))); c !== Ob;) b.push(c), c = o(), c === Ob && (jc.test(a.charAt(ek)) ? (c = a.charAt(ek), ek++) : (c = Ob, 0 === kk && i(kc)));return kk--, b === Ob && (c = Ob, 0 === kk && i(lc)), lk[d] = { nextPos: ek, result: b }, b;
    }function t() {
      var b,
          c,
          d = 134 * ek + 10,
          e = lk[d];if (e) return ek = e.nextPos, e.result;for (kk++, b = [], mc.test(a.charAt(ek)) ? (c = a.charAt(ek), ek++) : (c = Ob, 0 === kk && i(nc)); c !== Ob;) b.push(c), mc.test(a.charAt(ek)) ? (c = a.charAt(ek), ek++) : (c = Ob, 0 === kk && i(nc));return kk--, b === Ob && (c = Ob, 0 === kk && i(oc)), lk[d] = { nextPos: ek, result: b }, b;
    }function u() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 134 * ek + 11,
          k = lk[j];if (k) return ek = k.nextPos, k.result;for (b = ek, c = [], d = ek, e = [], f = o(); f !== Ob;) e.push(f), f = o();if (e !== Ob) {
        if ((f = [], ac.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(bc)), g !== Ob)) for (; g !== Ob;) f.push(g), ac.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(bc));else f = Tb;if (f !== Ob) {
          for (g = [], h = o(); h !== Ob;) g.push(h), h = o();g !== Ob ? (e = [e, f, g], d = e) : (ek = d, d = Tb);
        } else ek = d, d = Tb;
      } else ek = d, d = Tb;if (d !== Ob) for (; d !== Ob;) {
        for (c.push(d), d = ek, e = [], f = o(); f !== Ob;) e.push(f), f = o();if (e !== Ob) {
          if ((f = [], ac.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(bc)), g !== Ob)) for (; g !== Ob;) f.push(g), ac.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(bc));else f = Tb;if (f !== Ob) {
            for (g = [], h = o(); h !== Ob;) g.push(h), h = o();g !== Ob ? (e = [e, f, g], d = e) : (ek = d, d = Tb);
          } else ek = d, d = Tb;
        } else ek = d, d = Tb;
      } else c = Tb;return c !== Ob && (fk = b, c = cc()), b = c, lk[j] = { nextPos: ek, result: b }, b;
    }function v() {
      var b,
          c,
          d,
          e = 134 * ek + 12,
          f = lk[e];if (f) return ek = f.nextPos, f.result;for (b = ek, c = [], d = o(), d === Ob && (ac.test(a.charAt(ek)) ? (d = a.charAt(ek), ek++) : (d = Ob, 0 === kk && i(bc))); d !== Ob;) c.push(d), d = o(), d === Ob && (ac.test(a.charAt(ek)) ? (d = a.charAt(ek), ek++) : (d = Ob, 0 === kk && i(bc)));return c !== Ob && (fk = b, c = cc()), b = c, lk[e] = { nextPos: ek, result: b }, b;
    }function w() {
      var b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 13,
          h = lk[g];if (h) return ek = h.nextPos, h.result;if ((kk++, b = ek, 39 === a.charCodeAt(ek) ? (c = qc, ek++) : (c = Ob, 0 === kk && i(rc)), c !== Ob)) {
        for (d = ek, e = [], sc.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(tc)); f !== Ob;) e.push(f), sc.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(tc));e !== Ob && (e = a.substring(d, ek)), d = e, d !== Ob ? (39 === a.charCodeAt(ek) ? (e = qc, ek++) : (e = Ob, 0 === kk && i(rc)), e !== Ob ? (fk = b, c = uc(d), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb);
      } else ek = b, b = Tb;return kk--, b === Ob && (c = Ob, 0 === kk && i(pc)), lk[g] = { nextPos: ek, result: b }, b;
    }function x() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 134 * ek + 14,
          j = lk[h];if (j) return ek = j.nextPos, j.result;if ((b = ek, c = ek, d = ek, 45 === a.charCodeAt(ek) ? (e = wc, ek++) : (e = Ob, 0 === kk && i(xc)), e === Ob && (e = vc), e !== Ob)) {
        if ((f = [], yc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(zc)), g !== Ob)) for (; g !== Ob;) f.push(g), yc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(zc));else f = Tb;f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb);
      } else ek = d, d = Tb;return d !== Ob && (d = a.substring(c, ek)), c = d, c !== Ob && (fk = b, c = Ac(c)), b = c, lk[h] = { nextPos: ek, result: b }, b;
    }function y() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 134 * ek + 15,
          l = lk[k];if (l) return ek = l.nextPos, l.result;if ((b = ek, c = ek, d = ek, 45 === a.charCodeAt(ek) ? (e = wc, ek++) : (e = Ob, 0 === kk && i(xc)), e === Ob && (e = vc), e !== Ob)) {
        if ((f = [], yc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(zc)), g !== Ob)) for (; g !== Ob;) f.push(g), yc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(zc));else f = Tb;if (f !== Ob) if ((46 === a.charCodeAt(ek) ? (g = Bc, ek++) : (g = Ob, 0 === kk && i(Cc)), g !== Ob)) {
          if ((h = [], yc.test(a.charAt(ek)) ? (j = a.charAt(ek), ek++) : (j = Ob, 0 === kk && i(zc)), j !== Ob)) for (; j !== Ob;) h.push(j), yc.test(a.charAt(ek)) ? (j = a.charAt(ek), ek++) : (j = Ob, 0 === kk && i(zc));else h = Tb;h !== Ob ? (e = [e, f, g, h], d = e) : (ek = d, d = Tb);
        } else ek = d, d = Tb;else ek = d, d = Tb;
      } else ek = d, d = Tb;return d !== Ob && (d = a.substring(c, ek)), c = d, c !== Ob && (fk = b, c = Dc(c)), b = c, lk[k] = { nextPos: ek, result: b }, b;
    }function z() {
      var a,
          b = 134 * ek + 16,
          c = lk[b];return c ? (ek = c.nextPos, c.result) : (a = y(), a === Ob && (a = x()), lk[b] = { nextPos: ek, result: a }, a);
    }function A() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l = 134 * ek + 17,
          m = lk[l];return m ? (ek = m.nextPos, m.result) : (kk++, b = ek, c = ek, d = ek, yc.test(a.charAt(ek)) ? (e = a.charAt(ek), ek++) : (e = Ob, 0 === kk && i(zc)), e !== Ob ? (yc.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(zc)), f !== Ob ? (yc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(zc)), g !== Ob ? (yc.test(a.charAt(ek)) ? (h = a.charAt(ek), ek++) : (h = Ob, 0 === kk && i(zc)), h !== Ob ? (e = [e, f, g, h], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb)) : (ek = d, d = Tb)) : (ek = d, d = Tb), d !== Ob && (d = a.substring(c, ek)), c = d, c !== Ob ? (45 === a.charCodeAt(ek) ? (d = wc, ek++) : (d = Ob, 0 === kk && i(xc)), d !== Ob ? (e = ek, f = ek, yc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(zc)), g !== Ob ? (yc.test(a.charAt(ek)) ? (h = a.charAt(ek), ek++) : (h = Ob, 0 === kk && i(zc)), h !== Ob ? (g = [g, h], f = g) : (ek = f, f = Tb)) : (ek = f, f = Tb), f !== Ob && (f = a.substring(e, ek)), e = f, e !== Ob ? (45 === a.charCodeAt(ek) ? (f = wc, ek++) : (f = Ob, 0 === kk && i(xc)), f !== Ob ? (g = ek, h = ek, yc.test(a.charAt(ek)) ? (j = a.charAt(ek), ek++) : (j = Ob, 0 === kk && i(zc)), j !== Ob ? (yc.test(a.charAt(ek)) ? (k = a.charAt(ek), ek++) : (k = Ob, 0 === kk && i(zc)), k !== Ob ? (j = [j, k], h = j) : (ek = h, h = Tb)) : (ek = h, h = Tb), h !== Ob && (h = a.substring(g, ek)), g = h, g !== Ob ? (fk = b, c = Fc(c, e, g), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), kk--, b === Ob && (c = Ob, 0 === kk && i(Ec)), lk[l] = { nextPos: ek, result: b }, b);
    }function B() {
      var b,
          c,
          d = 134 * ek + 18,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (b = ek, a.substr(ek, 4).toLowerCase() === Gc ? (c = a.substr(ek, 4), ek += 4) : (c = Ob, 0 === kk && i(Hc)), c !== Ob && (fk = b, c = Ic()), b = c, b === Ob && (b = ek, a.substr(ek, 5).toLowerCase() === Jc ? (c = a.substr(ek, 5), ek += 5) : (c = Ob, 0 === kk && i(Kc)), c !== Ob && (fk = b, c = Lc()), b = c), lk[d] = { nextPos: ek, result: b }, b);
    }function C() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 19,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (61 === a.charCodeAt(ek) ? (d = Mc, ek++) : (d = Ob, 0 === kk && i(Nc)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), lk[f] = { nextPos: ek, result: b }, b);
    }function D() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 134 * ek + 20,
          l = lk[k];if (l) return ek = l.nextPos, l.result;if ((kk++, b = ek, c = ek, kk++, d = ek, e = Hb(), e !== Ob)) {
        if ((f = ek, kk++, g = [], Pc.test(a.charAt(ek)) ? (h = a.charAt(ek), ek++) : (h = Ob, 0 === kk && i(Qc)), h !== Ob)) for (; h !== Ob;) g.push(h), Pc.test(a.charAt(ek)) ? (h = a.charAt(ek), ek++) : (h = Ob, 0 === kk && i(Qc));else g = Tb;kk--, g === Ob ? f = Sb : (ek = f, f = Tb), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb);
      } else ek = d, d = Tb;if ((kk--, d === Ob ? c = Sb : (ek = c, c = Tb), c !== Ob)) {
        if ((d = ek, e = ek, f = [], Rc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(Sc)), g !== Ob)) for (; g !== Ob;) f.push(g), Rc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(Sc));else f = Tb;if (f !== Ob) {
          for (g = ek, h = [], Pc.test(a.charAt(ek)) ? (j = a.charAt(ek), ek++) : (j = Ob, 0 === kk && i(Qc)); j !== Ob;) h.push(j), Pc.test(a.charAt(ek)) ? (j = a.charAt(ek), ek++) : (j = Ob, 0 === kk && i(Qc));h !== Ob && (h = a.substring(g, ek)), g = h, g !== Ob ? (f = [f, g], e = f) : (ek = e, e = Tb);
        } else ek = e, e = Tb;e !== Ob && (e = a.substring(d, ek)), d = e, d !== Ob ? (fk = b, c = Tc(d), b = c) : (ek = b, b = Tb);
      } else ek = b, b = Tb;return kk--, b === Ob && (c = Ob, 0 === kk && i(Oc)), lk[k] = { nextPos: ek, result: b }, b;
    }function E() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 134 * ek + 21,
          l = lk[k];if (l) return ek = l.nextPos, l.result;if ((b = ek, c = ek, kk++, d = ek, e = Hb(), e !== Ob)) {
        if ((f = ek, kk++, g = [], Pc.test(a.charAt(ek)) ? (h = a.charAt(ek), ek++) : (h = Ob, 0 === kk && i(Qc)), h !== Ob)) for (; h !== Ob;) g.push(h), Pc.test(a.charAt(ek)) ? (h = a.charAt(ek), ek++) : (h = Ob, 0 === kk && i(Qc));else g = Tb;kk--, g === Ob ? f = Sb : (ek = f, f = Tb), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb);
      } else ek = d, d = Tb;if ((kk--, d === Ob ? c = Sb : (ek = c, c = Tb), c !== Ob)) {
        if ((d = ek, e = ek, f = [], Rc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(Sc)), g !== Ob)) for (; g !== Ob;) f.push(g), Rc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(Sc));else f = Tb;if (f !== Ob) {
          for (g = ek, h = [], Pc.test(a.charAt(ek)) ? (j = a.charAt(ek), ek++) : (j = Ob, 0 === kk && i(Qc)); j !== Ob;) h.push(j), Pc.test(a.charAt(ek)) ? (j = a.charAt(ek), ek++) : (j = Ob, 0 === kk && i(Qc));h !== Ob && (h = a.substring(g, ek)), g = h, g !== Ob ? (f = [f, g], e = f) : (ek = e, e = Tb);
        } else ek = e, e = Tb;e !== Ob && (e = a.substring(d, ek)), d = e, d !== Ob ? (fk = b, c = Tc(d), b = c) : (ek = b, b = Tb);
      } else ek = b, b = Tb;return lk[k] = { nextPos: ek, result: b }, b;
    }function F() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 134 * ek + 22,
          j = lk[h];if (j) return ek = j.nextPos, j.result;if ((b = ek, c = ek, d = D(), d !== Ob ? (46 === a.charCodeAt(ek) ? (e = Bc, ek++) : (e = Ob, 0 === kk && i(Cc)), e !== Ob ? (d = [d, e], c = d) : (ek = c, c = Tb)) : (ek = c, c = Tb), c === Ob && (c = vc), c !== Ob ? (d = E(), d !== Ob ? (fk = b, c = Uc(c, d), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob)) if ((b = ek, c = ek, d = D(), d !== Ob ? (46 === a.charCodeAt(ek) ? (e = Bc, ek++) : (e = Ob, 0 === kk && i(Cc)), e !== Ob ? (d = [d, e], c = d) : (ek = c, c = Tb)) : (ek = c, c = Tb), c === Ob && (c = vc), c !== Ob)) if ((91 === a.charCodeAt(ek) ? (d = Vc, ek++) : (d = Ob, 0 === kk && i(Wc)), d !== Ob)) {
        if ((e = ek, f = [], yc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(zc)), g !== Ob)) for (; g !== Ob;) f.push(g), yc.test(a.charAt(ek)) ? (g = a.charAt(ek), ek++) : (g = Ob, 0 === kk && i(zc));else f = Tb;f !== Ob && (f = a.substring(e, ek)), e = f, e !== Ob ? (93 === a.charCodeAt(ek) ? (f = Xc, ek++) : (f = Ob, 0 === kk && i(Yc)), f !== Ob ? (fk = b, c = Zc(c, e), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb);
      } else ek = b, b = Tb;else ek = b, b = Tb;return lk[h] = { nextPos: ek, result: b }, b;
    }function G() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 23,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (960 === a.charCodeAt(ek) ? (d = $c, ek++) : (d = Ob, 0 === kk && i(_c)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (a.substr(ek, 2).toLowerCase() === ad ? (d = a.substr(ek, 2), ek += 2) : (d = Ob, 0 === kk && i(bd)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[f] = { nextPos: ek, result: b }, b);
    }function H() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 24,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (963 === a.charCodeAt(ek) ? (d = cd, ek++) : (d = Ob, 0 === kk && i(dd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (a.substr(ek, 5).toLowerCase() === ed ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(fd)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[f] = { nextPos: ek, result: b }, b);
    }function I() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 25,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (961 === a.charCodeAt(ek) ? (d = gd, ek++) : (d = Ob, 0 === kk && i(hd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (a.substr(ek, 3).toLowerCase() === id ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(jd)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[f] = { nextPos: ek, result: b }, b);
    }function J() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 26,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (8592 === a.charCodeAt(ek) ? (b = kd, ek++) : (b = Ob, 0 === kk && i(ld)), b === Ob && (b = ek, c = s(), c !== Ob ? (a.substr(ek, 2) === md ? (d = md, ek += 2) : (d = Ob, 0 === kk && i(nd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[f] = { nextPos: ek, result: b }, b);
    }function K() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 27,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (8594 === a.charCodeAt(ek) ? (d = od, ek++) : (d = Ob, 0 === kk && i(pd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (a.substr(ek, 2) === qd ? (d = qd, ek += 2) : (d = Ob, 0 === kk && i(rd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[f] = { nextPos: ek, result: b }, b);
    }function L() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 29,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (964 === a.charCodeAt(ek) ? (d = sd, ek++) : (d = Ob, 0 === kk && i(td)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (a.substr(ek, 3).toLowerCase() === ud ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(vd)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[f] = { nextPos: ek, result: b }, b);
    }function M() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 30,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (947 === a.charCodeAt(ek) ? (d = wd, ek++) : (d = Ob, 0 === kk && i(xd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (a.substr(ek, 5).toLowerCase() === yd ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(zd)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[f] = { nextPos: ek, result: b }, b);
    }function N() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 31,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (8746 === a.charCodeAt(ek) ? (d = Ad, ek++) : (d = Ob, 0 === kk && i(Bd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (a.substr(ek, 5).toLowerCase() === Cd ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(Dd)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[f] = { nextPos: ek, result: b }, b);
    }function O() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 32,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (8745 === a.charCodeAt(ek) ? (d = Ed, ek++) : (d = Ob, 0 === kk && i(Fd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (a.substr(ek, 9).toLowerCase() === Gd ? (d = a.substr(ek, 9), ek += 9) : (d = Ob, 0 === kk && i(Hd)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[f] = { nextPos: ek, result: b }, b);
    }function P() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 33,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (247 === a.charCodeAt(ek) ? (d = Id, ek++) : (d = Ob, 0 === kk && i(Jd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (47 === a.charCodeAt(ek) ? (d = Kd, ek++) : (d = Ob, 0 === kk && i(Ld)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[f] = { nextPos: ek, result: b }, b);
    }function Q() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 34,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (45 === a.charCodeAt(ek) ? (d = wc, ek++) : (d = Ob, 0 === kk && i(xc)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (92 === a.charCodeAt(ek) ? (d = Md, ek++) : (d = Ob, 0 === kk && i(Nd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (a.substr(ek, 6).toLowerCase() === Od ? (d = a.substr(ek, 6), ek += 6) : (d = Ob, 0 === kk && i(Pd)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb))), lk[f] = { nextPos: ek, result: b }, b);
    }function R() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 134 * ek + 35,
          j = lk[h];return j ? (ek = j.nextPos, j.result) : (b = ek, c = s(), c !== Ob ? (10799 === a.charCodeAt(ek) ? (d = Qd, ek++) : (d = Ob, 0 === kk && i(Rd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (120 === a.charCodeAt(ek) ? (d = Sd, ek++) : (d = Ob, 0 === kk && i(Td)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (a.substr(ek, 5).toLowerCase() === Ud ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(Vd)), d !== Ob ? (e = r(), e !== Ob ? (a.substr(ek, 4).toLowerCase() === Wd ? (f = a.substr(ek, 4), ek += 4) : (f = Ob, 0 === kk && i(Xd)), f !== Ob ? (g = r(), g !== Ob ? (c = [c, d, e, f, g], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb))), lk[h] = { nextPos: ek, result: b }, b);
    }function S() {
      var b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 36,
          h = lk[g];return h ? (ek = h.nextPos, h.result) : (b = ek, c = s(), c !== Ob ? (10781 === a.charCodeAt(ek) ? (d = Yd, ek++) : (d = Ob, 0 === kk && i(Zd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (8904 === a.charCodeAt(ek) ? (d = $d, ek++) : (d = Ob, 0 === kk && i(_d)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (d = ek, a.substr(ek, 5).toLowerCase() === ae ? (e = a.substr(ek, 5), ek += 5) : (e = Ob, 0 === kk && i(be)), e !== Ob ? (f = r(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb), d === Ob && (d = vc), d !== Ob ? (a.substr(ek, 4).toLowerCase() === Wd ? (e = a.substr(ek, 4), ek += 4) : (e = Ob, 0 === kk && i(Xd)), e !== Ob ? (f = r(), f !== Ob ? (c = [c, d, e, f], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb))), lk[g] = { nextPos: ek, result: b }, b);
    }function T() {
      var b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 37,
          h = lk[g];return h ? (ek = h.nextPos, h.result) : (b = ek, c = s(), c !== Ob ? (10781 === a.charCodeAt(ek) ? (d = Yd, ek++) : (d = Ob, 0 === kk && i(Zd)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (8904 === a.charCodeAt(ek) ? (d = $d, ek++) : (d = Ob, 0 === kk && i(_d)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (d = ek, a.substr(ek, 7).toLowerCase() === ce ? (e = a.substr(ek, 7), ek += 7) : (e = Ob, 0 === kk && i(de)), e !== Ob ? (f = r(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb), d === Ob && (d = vc), d !== Ob ? (a.substr(ek, 4).toLowerCase() === Wd ? (e = a.substr(ek, 4), ek += 4) : (e = Ob, 0 === kk && i(Xd)), e !== Ob ? (f = r(), f !== Ob ? (c = [c, d, e, f], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb))), lk[g] = { nextPos: ek, result: b }, b);
    }function U() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 134 * ek + 38,
          l = lk[k];return l ? (ek = l.nextPos, l.result) : (b = ek, c = s(), c !== Ob ? (8905 === a.charCodeAt(ek) ? (d = ee, ek++) : (d = Ob, 0 === kk && i(fe)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (a.substr(ek, 4).toLowerCase() === ge ? (d = a.substr(ek, 4), ek += 4) : (d = Ob, 0 === kk && i(he)), d !== Ob ? (e = r(), e !== Ob ? (a.substr(ek, 4).toLowerCase() === ie ? (f = a.substr(ek, 4), ek += 4) : (f = Ob, 0 === kk && i(je)), f !== Ob ? (g = r(), g !== Ob ? (a.substr(ek, 4).toLowerCase() === Wd ? (h = a.substr(ek, 4), ek += 4) : (h = Ob, 0 === kk && i(Xd)), h !== Ob ? (j = r(), j !== Ob ? (c = [c, d, e, f, g, h, j], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[k] = { nextPos: ek, result: b }, b);
    }function V() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 134 * ek + 39,
          l = lk[k];return l ? (ek = l.nextPos, l.result) : (b = ek, c = s(), c !== Ob ? (8906 === a.charCodeAt(ek) ? (d = ke, ek++) : (d = Ob, 0 === kk && i(le)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (a.substr(ek, 5).toLowerCase() === me ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(ne)), d !== Ob ? (e = r(), e !== Ob ? (a.substr(ek, 4).toLowerCase() === ie ? (f = a.substr(ek, 4), ek += 4) : (f = Ob, 0 === kk && i(je)), f !== Ob ? (g = r(), g !== Ob ? (a.substr(ek, 4).toLowerCase() === Wd ? (h = a.substr(ek, 4), ek += 4) : (h = Ob, 0 === kk && i(Xd)), h !== Ob ? (j = r(), j !== Ob ? (c = [c, d, e, f, g, h, j], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[k] = { nextPos: ek, result: b }, b);
    }function W() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 134 * ek + 40,
          k = lk[j];return k ? (ek = k.nextPos, k.result) : (b = ek, c = s(), c !== Ob ? (9655 === a.charCodeAt(ek) ? (d = oe, ek++) : (d = Ob, 0 === kk && i(pe)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (a.substr(ek, 4).toLowerCase() === qe ? (d = a.substr(ek, 4), ek += 4) : (d = Ob, 0 === kk && i(re)), d !== Ob ? (e = ek, f = r(), f !== Ob ? (a.substr(ek, 4).toLowerCase() === ie ? (g = a.substr(ek, 4), ek += 4) : (g = Ob, 0 === kk && i(je)), g !== Ob ? (f = [f, g], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb), e === Ob && (e = vc), e !== Ob ? (f = r(), f !== Ob ? (a.substr(ek, 4).toLowerCase() === Wd ? (g = a.substr(ek, 4), ek += 4) : (g = Ob, 0 === kk && i(Xd)), g !== Ob ? (h = r(), h !== Ob ? (c = [c, d, e, f, g, h], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[j] = { nextPos: ek, result: b }, b);
    }function X() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 134 * ek + 41,
          k = lk[j];return k ? (ek = k.nextPos, k.result) : (b = ek, c = s(), c !== Ob ? (10197 === a.charCodeAt(ek) ? (d = se, ek++) : (d = Ob, 0 === kk && i(te)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (a.substr(ek, 4).toLowerCase() === ge ? (d = a.substr(ek, 4), ek += 4) : (d = Ob, 0 === kk && i(he)), d !== Ob ? (e = ek, f = r(), f !== Ob ? (a.substr(ek, 5).toLowerCase() === ue ? (g = a.substr(ek, 5), ek += 5) : (g = Ob, 0 === kk && i(ve)), g !== Ob ? (f = [f, g], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb), e === Ob && (e = vc), e !== Ob ? (f = r(), f !== Ob ? (a.substr(ek, 4).toLowerCase() === Wd ? (g = a.substr(ek, 4), ek += 4) : (g = Ob, 0 === kk && i(Xd)), g !== Ob ? (h = r(), h !== Ob ? (c = [c, d, e, f, g, h], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[j] = { nextPos: ek, result: b }, b);
    }function Y() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 134 * ek + 42,
          k = lk[j];return k ? (ek = k.nextPos, k.result) : (b = ek, c = s(), c !== Ob ? (10198 === a.charCodeAt(ek) ? (d = we, ek++) : (d = Ob, 0 === kk && i(xe)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (a.substr(ek, 5).toLowerCase() === me ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(ne)), d !== Ob ? (e = ek, f = r(), f !== Ob ? (a.substr(ek, 5).toLowerCase() === ue ? (g = a.substr(ek, 5), ek += 5) : (g = Ob, 0 === kk && i(ve)), g !== Ob ? (f = [f, g], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb), e === Ob && (e = vc), e !== Ob ? (f = r(), f !== Ob ? (a.substr(ek, 4).toLowerCase() === Wd ? (g = a.substr(ek, 4), ek += 4) : (g = Ob, 0 === kk && i(Xd)), g !== Ob ? (h = r(), h !== Ob ? (c = [c, d, e, f, g, h], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[j] = { nextPos: ek, result: b }, b);
    }function Z() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 134 * ek + 43,
          k = lk[j];return k ? (ek = k.nextPos, k.result) : (b = ek, c = s(), c !== Ob ? (10199 === a.charCodeAt(ek) ? (d = ye, ek++) : (d = Ob, 0 === kk && i(ze)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = r(), c !== Ob ? (a.substr(ek, 4).toLowerCase() === Ae ? (d = a.substr(ek, 4), ek += 4) : (d = Ob, 0 === kk && i(Be)), d !== Ob ? (e = ek, f = r(), f !== Ob ? (a.substr(ek, 5).toLowerCase() === ue ? (g = a.substr(ek, 5), ek += 5) : (g = Ob, 0 === kk && i(ve)), g !== Ob ? (f = [f, g], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb), e === Ob && (e = vc), e !== Ob ? (f = r(), f !== Ob ? (a.substr(ek, 4).toLowerCase() === Wd ? (g = a.substr(ek, 4), ek += 4) : (g = Ob, 0 === kk && i(Xd)), g !== Ob ? (h = r(), h !== Ob ? (c = [c, d, e, f, g, h], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[j] = { nextPos: ek, result: b }, b);
    }function $() {
      var a,
          b,
          c,
          d,
          e,
          f = 134 * ek + 44,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (a = ek, b = D(), b !== Ob ? (fk = ek, c = Ce(b), c = c ? Tb : Sb, c !== Ob ? (d = C(), d !== Ob ? (e = qa(), e !== Ob ? (fk = a, b = De(b, e), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[f] = { nextPos: ek, result: a }, a);
    }function _() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 45,
          f = lk[e];return f ? (ek = f.nextPos, f.result) : (a = ek, b = xb(), b !== Ob ? (c = K(), c !== Ob ? (d = E(), d !== Ob ? (fk = a, b = Ee(b, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), a === Ob && (a = ek, b = E(), b !== Ob ? (c = J(), c !== Ob ? (d = xb(), d !== Ob ? (fk = a, b = Fe(b, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), a === Ob && (a = ek, b = F(), b !== Ob && (fk = a, b = Tc(b)), a = b)), lk[e] = { nextPos: ek, result: a }, a);
    }function aa() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 134 * ek + 46,
          l = lk[k];if (l) return ek = l.nextPos, l.result;if ((b = ek, c = _(), c !== Ob)) {
        for (d = [], e = ek, f = s(), f !== Ob ? (44 === a.charCodeAt(ek) ? (g = Ge, ek++) : (g = Ob, 0 === kk && i(He)), g !== Ob ? (h = s(), h !== Ob ? (j = _(), j !== Ob ? (f = [f, g, h, j], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb); e !== Ob;) d.push(e), e = ek, f = s(), f !== Ob ? (44 === a.charCodeAt(ek) ? (g = Ge, ek++) : (g = Ob, 0 === kk && i(He)), g !== Ob ? (h = s(), h !== Ob ? (j = _(), j !== Ob ? (f = [f, g, h, j], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb);d !== Ob ? (fk = b, c = Ie(c, d), b = c) : (ek = b, b = Tb);
      } else ek = b, b = Tb;return lk[k] = { nextPos: ek, result: b }, b;
    }function ba() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 134 * ek + 47,
          l = lk[k];if (l) return ek = l.nextPos, l.result;if ((b = ek, c = F(), c !== Ob)) {
        for (d = [], e = ek, f = s(), f !== Ob ? (44 === a.charCodeAt(ek) ? (g = Ge, ek++) : (g = Ob, 0 === kk && i(He)), g !== Ob ? (h = s(), h !== Ob ? (j = F(), j !== Ob ? (f = [f, g, h, j], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb); e !== Ob;) d.push(e), e = ek, f = s(), f !== Ob ? (44 === a.charCodeAt(ek) ? (g = Ge, ek++) : (g = Ob, 0 === kk && i(He)), g !== Ob ? (h = s(), h !== Ob ? (j = F(), j !== Ob ? (f = [f, g, h, j], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb);d !== Ob ? (fk = b, c = Ie(c, d), b = c) : (ek = b, b = Tb);
      } else ek = b, b = Tb;return lk[k] = { nextPos: ek, result: b }, b;
    }function ca() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 48,
          f = lk[e];return f ? (ek = f.nextPos, f.result) : (a = ek, b = E(), b !== Ob ? (c = J(), c !== Ob ? (d = F(), d !== Ob ? (fk = a, b = Je(b, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), a === Ob && (a = ek, b = F(), b !== Ob ? (c = K(), c !== Ob ? (d = E(), d !== Ob ? (fk = a, b = Ke(b, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb)), lk[e] = { nextPos: ek, result: a }, a);
    }function da() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 134 * ek + 49,
          l = lk[k];if (l) return ek = l.nextPos, l.result;if ((b = ek, c = ca(), c !== Ob)) {
        for (d = [], e = ek, f = s(), f !== Ob ? (44 === a.charCodeAt(ek) ? (g = Ge, ek++) : (g = Ob, 0 === kk && i(He)), g !== Ob ? (h = s(), h !== Ob ? (j = ca(), j !== Ob ? (f = [f, g, h, j], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb); e !== Ob;) d.push(e), e = ek, f = s(), f !== Ob ? (44 === a.charCodeAt(ek) ? (g = Ge, ek++) : (g = Ob, 0 === kk && i(He)), g !== Ob ? (h = s(), h !== Ob ? (j = ca(), j !== Ob ? (f = [f, g, h, j], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb);d !== Ob ? (fk = b, c = Le(c, d), b = c) : (ek = b, b = Tb);
      } else ek = b, b = Tb;return lk[k] = { nextPos: ek, result: b }, b;
    }function ea() {
      var b,
          c,
          d = 134 * ek + 50,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (b = ek, a.substr(ek, 3).toLowerCase() === Me ? (c = a.substr(ek, 3), ek += 3) : (c = Ob, 0 === kk && i(Ne)), c !== Ob && (fk = b, c = Ic()), b = c, b === Ob && (b = ek, a.substr(ek, 4).toLowerCase() === Oe ? (c = a.substr(ek, 4), ek += 4) : (c = Ob, 0 === kk && i(Pe)), c !== Ob && (fk = b, c = Lc()), b = c), lk[d] = { nextPos: ek, result: b }, b);
    }function fa() {
      var a,
          b,
          c,
          d,
          e,
          f = 134 * ek + 51,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (a = ek, b = F(), b !== Ob ? (c = ek, d = r(), d !== Ob ? (e = ea(), e !== Ob ? (d = [d, e], c = d) : (ek = c, c = Tb)) : (ek = c, c = Tb), c === Ob && (c = vc), c !== Ob ? (fk = a, b = Qe(b, c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[f] = { nextPos: ek, result: a }, a);
    }function ga() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 134 * ek + 52,
          l = lk[k];if (l) return ek = l.nextPos, l.result;if ((b = ek, c = fa(), c !== Ob)) {
        for (d = [], e = ek, f = s(), f !== Ob ? (44 === a.charCodeAt(ek) ? (g = Ge, ek++) : (g = Ob, 0 === kk && i(He)), g !== Ob ? (h = s(), h !== Ob ? (j = fa(), j !== Ob ? (f = [f, g, h, j], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb); e !== Ob;) d.push(e), e = ek, f = s(), f !== Ob ? (44 === a.charCodeAt(ek) ? (g = Ge, ek++) : (g = Ob, 0 === kk && i(He)), g !== Ob ? (h = s(), h !== Ob ? (j = fa(), j !== Ob ? (f = [f, g, h, j], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb);d !== Ob ? (fk = b, c = Le(c, d), b = c) : (ek = b, b = Tb);
      } else ek = b, b = Tb;return lk[k] = { nextPos: ek, result: b }, b;
    }function ha() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 134 * ek + 53,
          k = lk[j];return k ? (ek = k.nextPos, k.result) : (b = ek, c = ek, a.substr(ek, 3).toLowerCase() === Re ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(Se)), d === Ob && (a.substr(ek, 5).toLowerCase() === Te ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(Ue)), d === Ob && (a.substr(ek, 3).toLowerCase() === Ve ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(We)), d === Ob && (a.substr(ek, 3).toLowerCase() === Xe ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(Ye)), d === Ob && (a.substr(ek, 3).toLowerCase() === Ze ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i($e)))))), d !== Ob && (d = a.substring(c, ek)), c = d, c !== Ob ? (40 === a.charCodeAt(ek) ? (d = _e, ek++) : (d = Ob, 0 === kk && i(af)), d !== Ob ? (e = s(), e !== Ob ? (f = F(), f !== Ob ? (g = s(), g !== Ob ? (41 === a.charCodeAt(ek) ? (h = bf, ek++) : (h = Ob, 0 === kk && i(cf)), h !== Ob ? (fk = b, c = df(c, f), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, a.substr(ek, 8).toLowerCase() === ef ? (c = a.substr(ek, 8), ek += 8) : (c = Ob, 0 === kk && i(ff)), c !== Ob && (fk = b, c = gf()), b = c), lk[j] = { nextPos: ek, result: b }, b);
    }function ia() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 54,
          f = lk[e];return f ? (ek = f.nextPos, f.result) : (a = ek, b = ha(), b !== Ob ? (c = K(), c !== Ob ? (d = E(), d !== Ob ? (fk = a, b = hf(b, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), a === Ob && (a = ek, b = E(), b !== Ob ? (c = J(), c !== Ob ? (d = ha(), d !== Ob ? (fk = a, b = jf(b, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb)), lk[e] = { nextPos: ek, result: a }, a);
    }function ja() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 134 * ek + 55,
          l = lk[k];if (l) return ek = l.nextPos, l.result;if ((b = ek, c = ia(), c !== Ob)) {
        for (d = [], e = ek, f = s(), f !== Ob ? (44 === a.charCodeAt(ek) ? (g = Ge, ek++) : (g = Ob, 0 === kk && i(He)), g !== Ob ? (h = s(), h !== Ob ? (j = ia(), j !== Ob ? (f = [f, g, h, j], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb); e !== Ob;) d.push(e), e = ek, f = s(), f !== Ob ? (44 === a.charCodeAt(ek) ? (g = Ge, ek++) : (g = Ob, 0 === kk && i(He)), g !== Ob ? (h = s(), h !== Ob ? (j = ia(), j !== Ob ? (f = [f, g, h, j], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb);d !== Ob ? (fk = b, c = Ie(c, d), b = c) : (ek = b, b = Tb);
      } else ek = b, b = Tb;return lk[k] = { nextPos: ek, result: b }, b;
    }function ka() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 56,
          f = lk[e];return f ? (ek = f.nextPos, f.result) : (a = ek, b = fb(), b !== Ob ? (c = r(), c !== Ob ? (fk = ek, d = kf(b), d = d ? Sb : Tb, d !== Ob ? (fk = a, b = uc(b), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[e] = { nextPos: ek, result: a }, a);
    }function la() {
      var a,
          b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 57,
          h = lk[g];if (h) return ek = h.nextPos, h.result;if ((a = ek, b = s(), b !== Ob)) {
        for (c = [], d = ek, e = $(), e !== Ob ? (f = r(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb); d !== Ob;) c.push(d), d = ek, e = $(), e !== Ob ? (f = r(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb);c !== Ob ? (d = $(), d !== Ob ? (e = s(), e !== Ob ? (fk = a, b = lf(c, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb);
      } else ek = a, a = Tb;if (a === Ob) if ((a = ek, b = s(), b !== Ob)) {
        for (c = [], d = ek, e = $(), e !== Ob ? (f = r(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb); d !== Ob;) c.push(d), d = ek, e = $(), e !== Ob ? (f = r(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb);c !== Ob ? (d = qa(), d === Ob && (d = vc), d !== Ob ? (e = s(), e !== Ob ? (fk = a, b = mf(c, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return lk[g] = { nextPos: ek, result: a }, a;
    }function ma() {
      var a,
          b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 58,
          h = lk[g];if (h) return ek = h.nextPos, h.result;if ((a = ek, b = t(), b !== Ob)) {
        if ((c = [], d = ek, e = t(), e !== Ob ? (f = pa(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb), d !== Ob)) for (; d !== Ob;) c.push(d), d = ek, e = t(), e !== Ob ? (f = pa(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb);else c = Tb;c !== Ob ? (d = t(), d !== Ob ? (fk = a, b = nf(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return lk[g] = { nextPos: ek, result: a }, a;
    }function na() {
      var a,
          b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 59,
          h = lk[g];if (h) return ek = h.nextPos, h.result;if ((a = ek, b = oa(), b !== Ob)) {
        for (c = [], d = ek, e = r(), e !== Ob ? (f = oa(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb); d !== Ob;) c.push(d), d = ek, e = r(), e !== Ob ? (f = oa(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb);c !== Ob ? (fk = a, b = of(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return lk[g] = { nextPos: ek, result: a }, a;
    }function oa() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l = 134 * ek + 60,
          m = lk[l];if (m) return ek = m.nextPos, m.result;if ((b = ek, c = ek, kk++, d = ek, e = [], pf.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(qf)), f !== Ob)) for (; f !== Ob;) e.push(f), pf.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(qf));else e = Tb;if ((e !== Ob ? (58 === a.charCodeAt(ek) ? (f = rf, ek++) : (f = Ob, 0 === kk && i(sf)), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb), kk--, d !== Ob ? (ek = c, c = Sb) : c = Tb, c !== Ob)) {
        if ((d = ek, e = [], pf.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(qf)), f !== Ob)) for (; f !== Ob;) e.push(f), pf.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(qf));else e = Tb;if ((e !== Ob && (e = a.substring(d, ek)), d = e, d !== Ob)) if ((58 === a.charCodeAt(ek) ? (e = rf, ek++) : (e = Ob, 0 === kk && i(sf)), e !== Ob)) {
          for (f = ek, g = [], h = ek, j = ek, kk++, k = n(), kk--, k === Ob ? j = Sb : (ek = j, j = Tb), j !== Ob ? (a.length > ek ? (k = a.charAt(ek), ek++) : (k = Ob, 0 === kk && i(Ub)), k !== Ob ? (j = [j, k], h = j) : (ek = h, h = Tb)) : (ek = h, h = Tb); h !== Ob;) g.push(h), h = ek, j = ek, kk++, k = n(), kk--, k === Ob ? j = Sb : (ek = j, j = Tb), j !== Ob ? (a.length > ek ? (k = a.charAt(ek), ek++) : (k = Ob, 0 === kk && i(Ub)), k !== Ob ? (j = [j, k], h = j) : (ek = h, h = Tb)) : (ek = h, h = Tb);g !== Ob && (g = a.substring(f, ek)), f = g, f !== Ob ? (fk = b, c = tf(d, f), b = c) : (ek = b, b = Tb);
        } else ek = b, b = Tb;else ek = b, b = Tb;
      } else ek = b, b = Tb;if (b === Ob) {
        if ((b = ek, c = ek, kk++, d = ek, e = [], pf.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(qf)), f !== Ob)) for (; f !== Ob;) e.push(f), pf.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(qf));else e = Tb;if ((e !== Ob ? (a.substr(ek, 2) === uf ? (f = uf, ek += 2) : (f = Ob, 0 === kk && i(vf)), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb), kk--, d !== Ob ? (ek = c, c = Sb) : c = Tb, c !== Ob)) {
          if ((d = ek, e = [], pf.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(qf)), f !== Ob)) for (; f !== Ob;) e.push(f), pf.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(qf));else e = Tb;if ((e !== Ob && (e = a.substring(d, ek)), d = e, d !== Ob)) if ((a.substr(ek, 2) === uf ? (e = uf, ek += 2) : (e = Ob, 0 === kk && i(vf)), e !== Ob)) {
            for (f = ek, g = [], a.substr(ek, 3) === wf ? (h = wf, ek += 3) : (h = Ob, 0 === kk && i(xf)), h === Ob && (h = ek, j = ek, kk++, a.substr(ek, 2) === yf ? (k = yf, ek += 2) : (k = Ob, 0 === kk && i(zf)), kk--, k === Ob ? j = Sb : (ek = j, j = Tb), j !== Ob ? (a.length > ek ? (k = a.charAt(ek), ek++) : (k = Ob, 0 === kk && i(Ub)), k !== Ob ? (j = [j, k], h = j) : (ek = h, h = Tb)) : (ek = h, h = Tb)); h !== Ob;) g.push(h), a.substr(ek, 3) === wf ? (h = wf, ek += 3) : (h = Ob, 0 === kk && i(xf)), h === Ob && (h = ek, j = ek, kk++, a.substr(ek, 2) === yf ? (k = yf, ek += 2) : (k = Ob, 0 === kk && i(zf)), kk--, k === Ob ? j = Sb : (ek = j, j = Tb), j !== Ob ? (a.length > ek ? (k = a.charAt(ek), ek++) : (k = Ob, 0 === kk && i(Ub)), k !== Ob ? (j = [j, k], h = j) : (ek = h, h = Tb)) : (ek = h, h = Tb));g !== Ob && (g = a.substring(f, ek)), f = g, f !== Ob ? (a.substr(ek, 2) === yf ? (g = yf, ek += 2) : (g = Ob, 0 === kk && i(zf)), g !== Ob ? (fk = b, c = Af(d, f), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb);
          } else ek = b, b = Tb;else ek = b, b = Tb;
        } else ek = b, b = Tb;
      }return lk[l] = { nextPos: ek, result: b }, b;
    }function pa() {
      var a,
          b,
          c,
          d,
          e,
          f,
          g,
          h = 134 * ek + 61,
          i = lk[h];if (i) return ek = i.nextPos, i.result;if ((a = ek, b = s(), b !== Ob)) if ((c = na(), c !== Ob)) {
        if ((d = [], e = ek, f = r(), f !== Ob ? (g = $(), g !== Ob ? (f = [f, g], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb), e !== Ob)) for (; e !== Ob;) d.push(e), e = ek, f = r(), f !== Ob ? (g = $(), g !== Ob ? (f = [f, g], e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb);else d = Tb;d !== Ob ? (fk = a, b = Bf(c, d), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;else ek = a, a = Tb;return lk[h] = { nextPos: ek, result: a }, a;
    }function qa() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 62,
          f = lk[e];if (f) return ek = f.nextPos, f.result;if ((a = ek, b = ra(), b !== Ob)) {
        if ((c = [], d = wa(), d === Ob && (d = xa()), d !== Ob)) for (; d !== Ob;) c.push(d), d = wa(), d === Ob && (d = xa());else c = Tb;c !== Ob ? (fk = a, b = Cf(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return a === Ob && (a = ra()), lk[e] = { nextPos: ek, result: a }, a;
    }function ra() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 63,
          f = lk[e];if (f) return ek = f.nextPos, f.result;if ((a = ek, b = sa(), b !== Ob)) {
        if ((c = [], d = va(), d !== Ob)) for (; d !== Ob;) c.push(d), d = va();else c = Tb;c !== Ob ? (fk = a, b = Cf(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return a === Ob && (a = sa()), lk[e] = { nextPos: ek, result: a }, a;
    }function sa() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 64,
          f = lk[e];if (f) return ek = f.nextPos, f.result;if ((a = ek, b = ta(), b !== Ob)) {
        if ((c = [], d = ya(), d === Ob && (d = za(), d === Ob && (d = Aa(), d === Ob && (d = Ba(), d === Ob && (d = Ca(), d === Ob && (d = Da(), d === Ob && (d = Ea(), d === Ob && (d = Fa(), d === Ob && (d = Ga(), d === Ob && (d = Ha()))))))))), d !== Ob)) for (; d !== Ob;) c.push(d), d = ya(), d === Ob && (d = za(), d === Ob && (d = Aa(), d === Ob && (d = Ba(), d === Ob && (d = Ca(), d === Ob && (d = Da(), d === Ob && (d = Ea(), d === Ob && (d = Fa(), d === Ob && (d = Ga(), d === Ob && (d = Ha())))))))));else c = Tb;c !== Ob ? (fk = a, b = Cf(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return a === Ob && (a = ta()), lk[e] = { nextPos: ek, result: a }, a;
    }function ta() {
      var a,
          b = 134 * ek + 65,
          c = lk[b];return c ? (ek = c.nextPos, c.result) : (a = Na(), a === Ob && (a = Ma(), a === Ob && (a = La(), a === Ob && (a = Ka(), a === Ob && (a = Ja(), a === Ob && (a = Ia(), a === Ob && (a = ua())))))), lk[b] = { nextPos: ek, result: a }, a);
    }function ua() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 134 * ek + 66,
          j = lk[h];return j ? (ek = j.nextPos, j.result) : (b = eb(), b === Ob && (b = Oa(), b === Ob && (b = ek, 40 === a.charCodeAt(ek) ? (c = _e, ek++) : (c = Ob, 0 === kk && i(af)), c !== Ob ? (d = s(), d !== Ob ? (e = qa(), e !== Ob ? (f = s(), f !== Ob ? (41 === a.charCodeAt(ek) ? (g = bf, ek++) : (g = Ob, 0 === kk && i(cf)), g !== Ob ? (fk = b, c = Df(e), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb))), lk[h] = { nextPos: ek, result: b }, b);
    }function va() {
      var a,
          b,
          c,
          d = 134 * ek + 67,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = O(), b !== Ob ? (c = sa(), c !== Ob ? (fk = a, b = Ef(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function wa() {
      var a,
          b,
          c,
          d = 134 * ek + 68,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = N(), b !== Ob ? (c = ra(), c !== Ob ? (fk = a, b = Ff(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function xa() {
      var a,
          b,
          c,
          d = 134 * ek + 69,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = Q(), b !== Ob ? (c = ra(), c !== Ob ? (fk = a, b = Gf(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function ya() {
      var a,
          b,
          c,
          d = 134 * ek + 70,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = R(), b !== Ob ? (c = ta(), c !== Ob ? (fk = a, b = Hf(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function za() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 71,
          f = lk[e];return f ? (ek = f.nextPos, f.result) : (a = ek, b = S(), b !== Ob ? (c = ka(), c !== Ob ? (d = ta(), d !== Ob ? (fk = a, b = If(c, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[e] = { nextPos: ek, result: a }, a);
    }function Aa() {
      var a,
          b,
          c,
          d = 134 * ek + 72,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = T(), b !== Ob ? (c = ta(), c !== Ob ? (fk = a, b = Jf(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function Ba() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 73,
          f = lk[e];return f ? (ek = f.nextPos, f.result) : (a = ek, b = X(), b !== Ob ? (c = ka(), c === Ob && (c = vc), c !== Ob ? (d = ta(), d !== Ob ? (fk = a, b = Kf(c, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[e] = { nextPos: ek, result: a }, a);
    }function Ca() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 74,
          f = lk[e];return f ? (ek = f.nextPos, f.result) : (a = ek, b = Y(), b !== Ob ? (c = ka(), c === Ob && (c = vc), c !== Ob ? (d = ta(), d !== Ob ? (fk = a, b = Lf(c, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[e] = { nextPos: ek, result: a }, a);
    }function Da() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 75,
          f = lk[e];return f ? (ek = f.nextPos, f.result) : (a = ek, b = Z(), b !== Ob ? (c = ka(), c === Ob && (c = vc), c !== Ob ? (d = ta(), d !== Ob ? (fk = a, b = Mf(c, d), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[e] = { nextPos: ek, result: a }, a);
    }function Ea() {
      var a,
          b,
          c,
          d = 134 * ek + 76,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = U(), b !== Ob ? (c = ta(), c !== Ob ? (fk = a, b = Nf(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function Fa() {
      var a,
          b,
          c,
          d = 134 * ek + 77,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = V(), b !== Ob ? (c = ta(), c !== Ob ? (fk = a, b = Of(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function Ga() {
      var a,
          b,
          c,
          d = 134 * ek + 78,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = W(), b !== Ob ? (c = ta(), c !== Ob ? (fk = a, b = Pf(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function Ha() {
      var a,
          b,
          c,
          d = 134 * ek + 79,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = P(), b !== Ob ? (c = ta(), c !== Ob ? (fk = a, b = Qf(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function Ia() {
      var a,
          b,
          c,
          d,
          e,
          f = 134 * ek + 80,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (a = ek, b = G(), b !== Ob ? (c = aa(), c !== Ob ? (d = r(), d !== Ob ? (e = ta(), e !== Ob ? (fk = a, b = Rf(c, e), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[f] = { nextPos: ek, result: a }, a);
    }function Ja() {
      var a,
          b,
          c,
          d,
          e,
          f = 134 * ek + 81,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (a = ek, b = H(), b !== Ob ? (c = fb(), c !== Ob ? (d = r(), d !== Ob ? (e = ta(), e !== Ob ? (fk = a, b = Sf(c, e), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[f] = { nextPos: ek, result: a }, a);
    }function Ka() {
      var a,
          b,
          c,
          d,
          e,
          f = 134 * ek + 82,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (a = ek, b = I(), b !== Ob ? (c = da(), c !== Ob ? (d = r(), d !== Ob ? (e = ta(), e !== Ob ? (fk = a, b = Tf(c, e), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[f] = { nextPos: ek, result: a }, a);
    }function La() {
      var a,
          b,
          c,
          d,
          e,
          f = 134 * ek + 83,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (a = ek, b = I(), b !== Ob ? (c = D(), c !== Ob ? (d = r(), d !== Ob ? (e = ta(), e !== Ob ? (fk = a, b = Uf(c, e), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[f] = { nextPos: ek, result: a }, a);
    }function Ma() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l = 134 * ek + 84,
          m = lk[l];return m ? (ek = m.nextPos, m.result) : (b = ek, c = M(), c !== Ob ? (d = ba(), d !== Ob ? (e = s(), e !== Ob ? (59 === a.charCodeAt(ek) ? (f = Vf, ek++) : (f = Ob, 0 === kk && i(Wf)), f !== Ob ? (g = s(), g !== Ob ? (h = ja(), h !== Ob ? (j = r(), j !== Ob ? (k = ta(), k !== Ob ? (fk = b, c = Xf(d, h, k), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = M(), c !== Ob ? (d = ek, e = s(), e !== Ob ? (59 === a.charCodeAt(ek) ? (f = Vf, ek++) : (f = Ob, 0 === kk && i(Wf)), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb), d === Ob && (d = vc), d !== Ob ? (e = s(), e !== Ob ? (f = ja(), f !== Ob ? (g = r(), g !== Ob ? (h = ta(), h !== Ob ? (fk = b, c = Yf(f, h), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), lk[l] = { nextPos: ek, result: b }, b);
    }function Na() {
      var a,
          b,
          c,
          d,
          e,
          f = 134 * ek + 85,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (a = ek, b = L(), b !== Ob ? (c = ga(), c !== Ob ? (d = r(), d !== Ob ? (e = ta(), e !== Ob ? (fk = a, b = Zf(c, e), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[f] = { nextPos: ek, result: a }, a);
    }function Oa() {
      var a,
          b,
          c = 134 * ek + 86,
          d = lk[c];return d ? (ek = d.nextPos, d.result) : (a = ek, b = D(), b !== Ob && (fk = a, b = $f(b)), a = b, lk[c] = { nextPos: ek, result: a }, a);
    }function Pa() {
      var a,
          b = 134 * ek + 87,
          c = lk[b];return c ? (ek = c.nextPos, c.result) : (a = Ra(), a === Ob && (a = Sa(), a === Ob && (a = Ta(), a === Ob && (a = Va(), a === Ob && (a = Ua(), a === Ob && (a = Wa()))))), lk[b] = { nextPos: ek, result: a }, a);
    }function Qa() {
      var a,
          b = 134 * ek + 88,
          c = lk[b];return c ? (ek = c.nextPos, c.result) : (a = Ra(), a === Ob && (a = Sa()), lk[b] = { nextPos: ek, result: a }, a);
    }function Ra() {
      var b,
          c = 134 * ek + 89,
          d = lk[c];return d ? (ek = d.nextPos, d.result) : (61 === a.charCodeAt(ek) ? (b = Mc, ek++) : (b = Ob, 0 === kk && i(Nc)), lk[c] = { nextPos: ek, result: b }, b);
    }function Sa() {
      var b,
          c,
          d = 134 * ek + 90,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (b = ek, a.substr(ek, 2) === _f ? (c = _f, ek += 2) : (c = Ob, 0 === kk && i(ag)), c === Ob && (8800 === a.charCodeAt(ek) ? (c = bg, ek++) : (c = Ob, 0 === kk && i(cg)), c === Ob && (a.substr(ek, 2) === dg ? (c = dg, ek += 2) : (c = Ob, 0 === kk && i(eg)))), c !== Ob && (fk = b, c = fg()), b = c, lk[d] = { nextPos: ek, result: b }, b);
    }function Ta() {
      var b,
          c,
          d = 134 * ek + 91,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (b = ek, a.substr(ek, 2) === gg ? (c = gg, ek += 2) : (c = Ob, 0 === kk && i(hg)), c === Ob && (8805 === a.charCodeAt(ek) ? (c = ig, ek++) : (c = Ob, 0 === kk && i(jg))), c !== Ob && (fk = b, c = kg()), b = c, lk[d] = { nextPos: ek, result: b }, b);
    }function Ua() {
      var b,
          c = 134 * ek + 92,
          d = lk[c];return d ? (ek = d.nextPos, d.result) : (62 === a.charCodeAt(ek) ? (b = lg, ek++) : (b = Ob, 0 === kk && i(mg)), lk[c] = { nextPos: ek, result: b }, b);
    }function Va() {
      var b,
          c,
          d = 134 * ek + 93,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (b = ek, a.substr(ek, 2) === ng ? (c = ng, ek += 2) : (c = Ob, 0 === kk && i(og)), c === Ob && (8804 === a.charCodeAt(ek) ? (c = pg, ek++) : (c = Ob, 0 === kk && i(qg))), c !== Ob && (fk = b, c = rg()), b = c, lk[d] = { nextPos: ek, result: b }, b);
    }function Wa() {
      var b,
          c = 134 * ek + 94,
          d = lk[c];return d ? (ek = d.nextPos, d.result) : (60 === a.charCodeAt(ek) ? (b = sg, ek++) : (b = Ob, 0 === kk && i(tg)), lk[c] = { nextPos: ek, result: b }, b);
    }function Xa() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 95,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (kk++, b = ek, c = r(), c !== Ob ? (a.substr(ek, 3).toLowerCase() === vg ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(wg)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (8743 === a.charCodeAt(ek) ? (d = xg, ek++) : (d = Ob, 0 === kk && i(yg)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), kk--, b === Ob && (c = Ob, 0 === kk && i(ug)), lk[f] = { nextPos: ek, result: b }, b);
    }function Ya() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 96,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (kk++, b = ek, c = r(), c !== Ob ? (a.substr(ek, 3).toLowerCase() === Ag ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(Bg)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (8891 === a.charCodeAt(ek) ? (d = Cg, ek++) : (d = Ob, 0 === kk && i(Dg)), d === Ob && (8853 === a.charCodeAt(ek) ? (d = Eg, ek++) : (d = Ob, 0 === kk && i(Fg))), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), kk--, b === Ob && (c = Ob, 0 === kk && i(zg)), lk[f] = { nextPos: ek, result: b }, b);
    }function Za() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 97,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (kk++, b = ek, c = r(), c !== Ob ? (a.substr(ek, 2).toLowerCase() === Hg ? (d = a.substr(ek, 2), ek += 2) : (d = Ob, 0 === kk && i(Ig)), d !== Ob ? (e = r(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (8744 === a.charCodeAt(ek) ? (d = Jg, ek++) : (d = Ob, 0 === kk && i(Kg)), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)), kk--, b === Ob && (c = Ob, 0 === kk && i(Gg)), lk[f] = { nextPos: ek, result: b }, b);
    }function $a() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 98,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (kk++, b = ek, c = s(), c !== Ob ? (33 === a.charCodeAt(ek) ? (d = Mg, ek++) : (d = Ob, 0 === kk && i(Ng)), d === Ob && (172 === a.charCodeAt(ek) ? (d = Og, ek++) : (d = Ob, 0 === kk && i(Pg))), d !== Ob ? (e = s(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), kk--, b === Ob && (c = Ob, 0 === kk && i(Lg)), lk[f] = { nextPos: ek, result: b }, b);
    }function _a() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 99,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (kk++, b = ek, c = v(), c !== Ob ? (44 === a.charCodeAt(ek) ? (d = Ge, ek++) : (d = Ob, 0 === kk && i(He)), d !== Ob ? (e = v(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = v(), c !== Ob ? (59 === a.charCodeAt(ek) ? (d = Vf, ek++) : (d = Ob, 0 === kk && i(Wf)), d !== Ob ? (e = v(), e !== Ob ? (c = [c, d, e], b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = u())), kk--, b === Ob && (c = Ob, 0 === kk && i(Qg)), lk[f] = { nextPos: ek, result: b }, b);
    }function ab() {
      var b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 100,
          h = lk[g];return h ? (ek = h.nextPos, h.result) : (b = ek, c = F(), c !== Ob ? (d = ek, 58 === a.charCodeAt(ek) ? (e = rf, ek++) : (e = Ob, 0 === kk && i(sf)), e !== Ob ? (a.substr(ek, 6).toLowerCase() === Rg ? (f = a.substr(ek, 6), ek += 6) : (f = Ob, 0 === kk && i(Sg)), f === Ob && (a.substr(ek, 6).toLowerCase() === Tg ? (f = a.substr(ek, 6), ek += 6) : (f = Ob, 0 === kk && i(Ug)), f === Ob && (a.substr(ek, 4).toLowerCase() === Vg ? (f = a.substr(ek, 4), ek += 4) : (f = Ob, 0 === kk && i(Wg)), f === Ob && (a.substr(ek, 7).toLowerCase() === Xg ? (f = a.substr(ek, 7), ek += 7) : (f = Ob, 0 === kk && i(Yg))))), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb), d === Ob && (d = vc), d !== Ob ? (fk = b, c = Zg(c, d), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb), lk[g] = { nextPos: ek, result: b }, b);
    }function bb() {
      var b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 101,
          h = lk[g];if (h) return ek = h.nextPos, h.result;if ((b = ek, c = A(), c !== Ob && (fk = b, c = $g(c)), b = c, b === Ob && (b = ek, a.substr(ek, 4) === _g ? (c = _g, ek += 4) : (c = Ob, 0 === kk && i(ah)), c === Ob && (a.substr(ek, 4) === bh ? (c = bh, ek += 4) : (c = Ob, 0 === kk && i(ch))), c !== Ob && (fk = b, c = dh()), b = c, b === Ob && (b = ek, c = B(), c !== Ob ? (d = ek, kk++, e = _a(), e === Ob && (e = n(), e === Ob && (125 === a.charCodeAt(ek) ? (e = eh, ek++) : (e = Ob, 0 === kk && i(fh)))), kk--, e !== Ob ? (ek = d, d = Sb) : d = Tb, d !== Ob ? (fk = b, c = gh(c), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob)))) {
        if ((b = ek, c = ek, d = [], hh.test(a.charAt(ek)) ? (e = a.charAt(ek), ek++) : (e = Ob, 0 === kk && i(ih)), e !== Ob)) for (; e !== Ob;) d.push(e), hh.test(a.charAt(ek)) ? (e = a.charAt(ek), ek++) : (e = Ob, 0 === kk && i(ih));else d = Tb;if ((d !== Ob && (d = a.substring(c, ek)), c = d, c !== Ob && (fk = b, c = jh(c)), b = c, b === Ob)) {
          if ((b = ek, 39 === a.charCodeAt(ek) ? (c = qc, ek++) : (c = Ob, 0 === kk && i(rc)), c !== Ob)) {
            for (d = ek, e = [], sc.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(tc)); f !== Ob;) e.push(f), sc.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(tc));e !== Ob && (e = a.substring(d, ek)), d = e, d !== Ob ? (39 === a.charCodeAt(ek) ? (e = qc, ek++) : (e = Ob, 0 === kk && i(rc)), e !== Ob ? (fk = b, c = kh(d), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb);
          } else ek = b, b = Tb;if (b === Ob) if ((b = ek, 34 === a.charCodeAt(ek) ? (c = lh, ek++) : (c = Ob, 0 === kk && i(mh)), c !== Ob)) {
            for (d = ek, e = [], nh.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(oh)); f !== Ob;) e.push(f), nh.test(a.charAt(ek)) ? (f = a.charAt(ek), ek++) : (f = Ob, 0 === kk && i(oh));e !== Ob && (e = a.substring(d, ek)), d = e, d !== Ob ? (34 === a.charCodeAt(ek) ? (e = lh, ek++) : (e = Ob, 0 === kk && i(mh)), e !== Ob ? (fk = b, c = kh(d), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb);
          } else ek = b, b = Tb;
        }
      }return lk[g] = { nextPos: ek, result: b }, b;
    }function cb() {
      var a,
          b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 102,
          h = lk[g];if (h) return ek = h.nextPos, h.result;if ((a = ek, b = ab(), b !== Ob)) {
        for (c = [], d = ek, e = _a(), e !== Ob ? (f = ab(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb); d !== Ob;) c.push(d), d = ek, e = _a(), e !== Ob ? (f = ab(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb);c !== Ob ? (fk = a, b = ph(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return lk[g] = { nextPos: ek, result: a }, a;
    }function db() {
      var a,
          b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 103,
          h = lk[g];if (h) return ek = h.nextPos, h.result;if ((a = ek, b = bb(), b !== Ob)) {
        for (c = [], d = ek, e = _a(), e !== Ob ? (f = bb(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb); d !== Ob;) c.push(d), d = ek, e = _a(), e !== Ob ? (f = bb(), f !== Ob ? (e = [e, f], d = e) : (ek = d, d = Tb)) : (ek = d, d = Tb);c !== Ob ? (fk = a, b = qh(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return lk[g] = { nextPos: ek, result: a }, a;
    }function eb() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          o = 134 * ek + 104,
          p = lk[o];if (p) return ek = p.nextPos, p.result;if ((b = ek, 123 === a.charCodeAt(ek) ? (c = rh, ek++) : (c = Ob, 0 === kk && i(sh)), c !== Ob)) if ((d = s(), d !== Ob)) if ((e = cb(), e !== Ob)) if ((f = v(), f !== Ob)) {
        for (g = [], h = ek, j = n(), j !== Ob ? (k = s(), k !== Ob ? (l = db(), l !== Ob ? (m = v(), m !== Ob ? (j = [j, k, l, m], h = j) : (ek = h, h = Tb)) : (ek = h, h = Tb)) : (ek = h, h = Tb)) : (ek = h, h = Tb); h !== Ob;) g.push(h), h = ek, j = n(), j !== Ob ? (k = s(), k !== Ob ? (l = db(), l !== Ob ? (m = v(), m !== Ob ? (j = [j, k, l, m], h = j) : (ek = h, h = Tb)) : (ek = h, h = Tb)) : (ek = h, h = Tb)) : (ek = h, h = Tb);g !== Ob ? (h = s(), h !== Ob ? (125 === a.charCodeAt(ek) ? (j = eh, ek++) : (j = Ob, 0 === kk && i(fh)), j !== Ob ? (fk = b, c = th(e, g), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb);
      } else ek = b, b = Tb;else ek = b, b = Tb;else ek = b, b = Tb;else ek = b, b = Tb;return lk[o] = { nextPos: ek, result: b }, b;
    }function fb() {
      var a,
          b,
          c = 134 * ek + 105,
          d = lk[c];return d ? (ek = d.nextPos, d.result) : (kk++, a = xb(), kk--, a === Ob && (b = Ob, 0 === kk && i(uh)), lk[c] = { nextPos: ek, result: a }, a);
    }function gb() {
      var a,
          b,
          c,
          d = 134 * ek + 106,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = Za(), b !== Ob ? (c = yb(), c !== Ob ? (fk = a, b = vh(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function hb() {
      var b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 107,
          h = lk[g];return h ? (ek = h.nextPos, h.result) : (b = ek, c = s(), c !== Ob ? (a.substr(ek, 2) === wh ? (d = wh, ek += 2) : (d = Ob, 0 === kk && i(xh)), d !== Ob ? (e = s(), e !== Ob ? (f = yb(), f !== Ob ? (fk = b, c = yh(f), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), lk[g] = { nextPos: ek, result: b }, b);
    }function ib() {
      var a,
          b,
          c,
          d = 134 * ek + 108,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = Ya(), b !== Ob ? (c = zb(), c !== Ob ? (fk = a, b = zh(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function jb() {
      var a,
          b,
          c,
          d = 134 * ek + 109,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = Xa(), b !== Ob ? (c = Ab(), c !== Ob ? (fk = a, b = Ah(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function kb() {
      var b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 110,
          h = lk[g];return h ? (ek = h.nextPos, h.result) : (b = ek, c = s(), c !== Ob ? (d = Qa(), d !== Ob ? (e = s(), e !== Ob ? (f = ub(), f !== Ob ? (fk = b, c = Bh(d, f), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (d = Pa(), d !== Ob ? (e = s(), e !== Ob ? (f = Cb(), f !== Ob ? (fk = b, c = Bh(d, f), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), b === Ob && (b = ek, c = s(), c !== Ob ? (a.substr(ek, 4).toLowerCase() === Ch ? (d = a.substr(ek, 4), ek += 4) : (d = Ob, 0 === kk && i(Dh)), d === Ob && (a.substr(ek, 5).toLowerCase() === Eh ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(Fh))), d !== Ob ? (e = s(), e !== Ob ? (f = tb(), f !== Ob ? (fk = b, c = Gh(d, f), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb))), lk[g] = { nextPos: ek, result: b }, b);
    }function lb() {
      var b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 111,
          h = lk[g];return h ? (ek = h.nextPos, h.result) : (b = ek, c = s(), c !== Ob ? (45 === a.charCodeAt(ek) ? (d = wc, ek++) : (d = Ob, 0 === kk && i(xc)), d === Ob && (43 === a.charCodeAt(ek) ? (d = Hh, ek++) : (d = Ob, 0 === kk && i(Ih))), d !== Ob ? (e = s(), e !== Ob ? (f = Db(), f !== Ob ? (fk = b, c = Jh(d, f), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), lk[g] = { nextPos: ek, result: b }, b);
    }function mb() {
      var b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 112,
          h = lk[g];return h ? (ek = h.nextPos, h.result) : (b = ek, c = s(), c !== Ob ? (42 === a.charCodeAt(ek) ? (d = Kh, ek++) : (d = Ob, 0 === kk && i(Lh)), d === Ob && (47 === a.charCodeAt(ek) ? (d = Kd, ek++) : (d = Ob, 0 === kk && i(Ld)), d === Ob && (37 === a.charCodeAt(ek) ? (d = Mh, ek++) : (d = Ob, 0 === kk && i(Nh)))), d !== Ob ? (e = s(), e !== Ob ? (f = Eb(), f !== Ob ? (fk = b, c = Oh(d, f), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), lk[g] = { nextPos: ek, result: b }, b);
    }function nb() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 113,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = s(), c !== Ob ? (45 === a.charCodeAt(ek) ? (d = wc, ek++) : (d = Ob, 0 === kk && i(xc)), d !== Ob ? (e = Fb(), e !== Ob ? (fk = b, c = Ph(e), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), lk[f] = { nextPos: ek, result: b }, b);
    }function ob() {
      var a,
          b,
          c,
          d = 134 * ek + 114,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = $a(), b !== Ob ? (c = Gb(), c !== Ob ? (fk = a, b = Qh(c), a = b) : (ek = a, a = Tb)) : (ek = a, a = Tb), lk[d] = { nextPos: ek, result: a }, a);
    }function pb() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n,
          o = 134 * ek + 115,
          p = lk[o];if (p) return ek = p.nextPos, p.result;if ((b = ek, c = ek, a.substr(ek, 8).toLowerCase() === Rh ? (d = a.substr(ek, 8), ek += 8) : (d = Ob, 0 === kk && i(Sh)), d !== Ob && (fk = c, d = Th()), c = d, c === Ob && (c = ek, a.substr(ek, 6).toLowerCase() === Uh ? (d = a.substr(ek, 6), ek += 6) : (d = Ob, 0 === kk && i(Vh)), d !== Ob && (fk = c, d = Wh()), c = d), c !== Ob)) if ((40 === a.charCodeAt(ek) ? (d = _e, ek++) : (d = Ob, 0 === kk && i(af)), d !== Ob)) if ((e = s(), e !== Ob)) if ((f = xb(), f !== Ob)) if ((g = s(), g !== Ob)) {
        for (h = [], j = ek, 44 === a.charCodeAt(ek) ? (k = Ge, ek++) : (k = Ob, 0 === kk && i(He)), k !== Ob ? (l = s(), l !== Ob ? (m = xb(), m !== Ob ? (n = s(), n !== Ob ? (k = [k, l, m, n], j = k) : (ek = j, j = Tb)) : (ek = j, j = Tb)) : (ek = j, j = Tb)) : (ek = j, j = Tb); j !== Ob;) h.push(j), j = ek, 44 === a.charCodeAt(ek) ? (k = Ge, ek++) : (k = Ob, 0 === kk && i(He)), k !== Ob ? (l = s(), l !== Ob ? (m = xb(), m !== Ob ? (n = s(), n !== Ob ? (k = [k, l, m, n], j = k) : (ek = j, j = Tb)) : (ek = j, j = Tb)) : (ek = j, j = Tb)) : (ek = j, j = Tb);h !== Ob ? (41 === a.charCodeAt(ek) ? (j = bf, ek++) : (j = Ob, 0 === kk && i(cf)), j !== Ob ? (fk = b, c = Xh(c, f, h), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb);
      } else ek = b, b = Tb;else ek = b, b = Tb;else ek = b, b = Tb;else ek = b, b = Tb;else ek = b, b = Tb;return lk[o] = { nextPos: ek, result: b }, b;
    }function qb() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n = 134 * ek + 116,
          o = lk[n];return o ? (ek = o.nextPos, o.result) : (b = ek, c = ek, a.substr(ek, 7).toLowerCase() === Yh ? (d = a.substr(ek, 7), ek += 7) : (d = Ob, 0 === kk && i(Zh)), d !== Ob && (fk = c, d = $h()), c = d, c === Ob && (c = ek, a.substr(ek, 7).toLowerCase() === _h ? (d = a.substr(ek, 7), ek += 7) : (d = Ob, 0 === kk && i(ai)), d !== Ob && (fk = c, d = bi()), c = d, c === Ob && (c = ek, a.substr(ek, 3).toLowerCase() === ci ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(di)), d !== Ob && (fk = c, d = ei()), c = d, c === Ob && (c = ek, a.substr(ek, 3).toLowerCase() === fi ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(gi)), d !== Ob && (fk = c, d = hi()), c = d, c === Ob && (c = ek, a.substr(ek, 3).toLowerCase() === ii ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(ji)), d !== Ob && (fk = c, d = ki()), c = d, c === Ob && (c = ek, a.substr(ek, 3).toLowerCase() === li ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(mi)), d !== Ob && (fk = c, d = ni()), c = d, c === Ob && (c = ek, a.substr(ek, 3).toLowerCase() === oi ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(pi)), d !== Ob && (fk = c, d = qi()), c = d)))))), c !== Ob ? (40 === a.charCodeAt(ek) ? (d = _e, ek++) : (d = Ob, 0 === kk && i(af)), d !== Ob ? (e = s(), e !== Ob ? (f = xb(), f !== Ob ? (g = s(), g !== Ob ? (44 === a.charCodeAt(ek) ? (h = Ge, ek++) : (h = Ob, 0 === kk && i(He)), h !== Ob ? (j = s(), j !== Ob ? (k = xb(), k !== Ob ? (l = s(), l !== Ob ? (41 === a.charCodeAt(ek) ? (m = bf, ek++) : (m = Ob, 0 === kk && i(cf)), m !== Ob ? (fk = b, c = ri(c, f, k), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), lk[n] = { nextPos: ek, result: b }, b);
    }function rb() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 134 * ek + 117,
          k = lk[j];return k ? (ek = k.nextPos, k.result) : (b = ek, c = ek, a.substr(ek, 5).toLowerCase() === si ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(ti)), d !== Ob && (fk = c, d = ui()), c = d, c === Ob && (c = ek, a.substr(ek, 5).toLowerCase() === vi ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(wi)), d !== Ob && (fk = c, d = ui()), c = d, c === Ob && (c = ek, a.substr(ek, 5).toLowerCase() === xi ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(yi)), d !== Ob && (fk = c, d = zi()), c = d, c === Ob && (c = ek, a.substr(ek, 5).toLowerCase() === Ai ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(Bi)), d !== Ob && (fk = c, d = zi()), c = d, c === Ob && (c = ek, a.substr(ek, 6).toLowerCase() === Ci ? (d = a.substr(ek, 6), ek += 6) : (d = Ob, 0 === kk && i(Di)), d !== Ob && (fk = c, d = Ei()), c = d, c === Ob && (c = ek, a.substr(ek, 3).toLowerCase() === Fi ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(Gi)), d !== Ob && (fk = c, d = Hi()), c = d, c === Ob && (c = ek, a.substr(ek, 5).toLowerCase() === Ii ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(Ji)), d !== Ob && (fk = c, d = Ki()), c = d, c === Ob && (c = ek, a.substr(ek, 4).toLowerCase() === Li ? (d = a.substr(ek, 4), ek += 4) : (d = Ob, 0 === kk && i(Mi)), d !== Ob && (fk = c, d = Ni()), c = d, c === Ob && (c = ek, a.substr(ek, 5).toLowerCase() === Oi ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(Pi)), d !== Ob && (fk = c, d = Qi()), c = d, c === Ob && (c = ek, a.substr(ek, 4).toLowerCase() === Vg ? (d = a.substr(ek, 4), ek += 4) : (d = Ob, 0 === kk && i(Wg)), d !== Ob && (fk = c, d = Ri()), c = d, c === Ob && (c = ek, a.substr(ek, 4).toLowerCase() === Si ? (d = a.substr(ek, 4), ek += 4) : (d = Ob, 0 === kk && i(Ti)), d !== Ob && (fk = c, d = Ui()), c = d, c === Ob && (c = ek, a.substr(ek, 5).toLowerCase() === Vi ? (d = a.substr(ek, 5), ek += 5) : (d = Ob, 0 === kk && i(Wi)), d !== Ob && (fk = c, d = Xi()), c = d, c === Ob && (c = ek, a.substr(ek, 3).toLowerCase() === Yi ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(Zi)), d !== Ob && (fk = c, d = $i()), c = d, c === Ob && (c = ek, a.substr(ek, 4).toLowerCase() === _i ? (d = a.substr(ek, 4), ek += 4) : (d = Ob, 0 === kk && i(aj)), d !== Ob && (fk = c, d = bj()), c = d, c === Ob && (c = ek, a.substr(ek, 6).toLowerCase() === cj ? (d = a.substr(ek, 6), ek += 6) : (d = Ob, 0 === kk && i(dj)), d !== Ob && (fk = c, d = ej()), c = d, c === Ob && (c = ek, a.substr(ek, 6).toLowerCase() === fj ? (d = a.substr(ek, 6), ek += 6) : (d = Ob, 0 === kk && i(gj)), d !== Ob && (fk = c, d = hj()), c = d, c === Ob && (c = ek, a.substr(ek, 10).toLowerCase() === ij ? (d = a.substr(ek, 10), ek += 10) : (d = Ob, 0 === kk && i(jj)), d !== Ob && (fk = c, d = $i()), c = d)))))))))))))))), c !== Ob ? (40 === a.charCodeAt(ek) ? (d = _e, ek++) : (d = Ob, 0 === kk && i(af)), d !== Ob ? (e = s(), e !== Ob ? (f = xb(), f !== Ob ? (g = s(), g !== Ob ? (41 === a.charCodeAt(ek) ? (h = bf, ek++) : (h = Ob, 0 === kk && i(cf)), h !== Ob ? (fk = b, c = kj(c, f), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), lk[j] = { nextPos: ek, result: b }, b);
    }function sb() {
      var b,
          c,
          d,
          e,
          f,
          g = 134 * ek + 118,
          h = lk[g];return h ? (ek = h.nextPos, h.result) : (b = ek, c = ek, a.substr(ek, 4).toLowerCase() === lj ? (d = a.substr(ek, 4), ek += 4) : (d = Ob, 0 === kk && i(mj)), d !== Ob && (fk = c, d = nj()), c = d, c === Ob && (c = ek, a.substr(ek, 6).toLowerCase() === oj ? (d = a.substr(ek, 6), ek += 6) : (d = Ob, 0 === kk && i(pj)), d !== Ob && (fk = c, d = qj()), c = d, c === Ob && (c = ek, a.substr(ek, 3).toLowerCase() === rj ? (d = a.substr(ek, 3), ek += 3) : (d = Ob, 0 === kk && i(sj)), d !== Ob && (fk = c, d = tj()), c = d, c === Ob && (c = ek, a.substr(ek, 17).toLowerCase() === uj ? (d = a.substr(ek, 17), ek += 17) : (d = Ob, 0 === kk && i(vj)), d !== Ob && (fk = c, d = tj()), c = d, c === Ob && (c = ek, a.substr(ek, 21).toLowerCase() === wj ? (d = a.substr(ek, 21), ek += 21) : (d = Ob, 0 === kk && i(xj)), d !== Ob && (fk = c, d = yj()), c = d, c === Ob && (c = ek, a.substr(ek, 19).toLowerCase() === zj ? (d = a.substr(ek, 19), ek += 19) : (d = Ob, 0 === kk && i(Aj)), d !== Ob && (fk = c, d = Bj()), c = d, c === Ob && (c = ek, a.substr(ek, 15).toLowerCase() === Cj ? (d = a.substr(ek, 15), ek += 15) : (d = Ob, 0 === kk && i(Dj)), d !== Ob && (fk = c, d = Ej()), c = d, c === Ob && (c = ek, a.substr(ek, 7).toLowerCase() === Fj ? (d = a.substr(ek, 7), ek += 7) : (d = Ob, 0 === kk && i(Gj)), d !== Ob && (fk = c, d = Ej()), c = d))))))), c !== Ob ? (40 === a.charCodeAt(ek) ? (d = _e, ek++) : (d = Ob, 0 === kk && i(af)), d !== Ob ? (e = s(), e !== Ob ? (41 === a.charCodeAt(ek) ? (f = bf, ek++) : (f = Ob, 0 === kk && i(cf)), f !== Ob ? (fk = b, c = Hj(c), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb), lk[g] = { nextPos: ek, result: b }, b);
    }function tb() {
      var a,
          b,
          c,
          d = 134 * ek + 119,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (a = ek, b = ek, c = z(), c !== Ob && (fk = b, c = Ij(c)), b = c, b === Ob && (b = ek, c = B(), c !== Ob && (fk = b, c = Jj(c)), b = c, b === Ob && (b = ek, c = w(), c !== Ob && (fk = b, c = Kj(c)), b = c)), b !== Ob && (fk = a, b = Lj(b)), a = b, a === Ob && (a = ub()), lk[d] = { nextPos: ek, result: a }, a);
    }function ub() {
      var b,
          c,
          d = 134 * ek + 120,
          e = lk[d];return e ? (ek = e.nextPos, e.result) : (b = ek, a.substr(ek, 4).toLowerCase() === _g ? (c = a.substr(ek, 4), ek += 4) : (c = Ob, 0 === kk && i(ah)), c !== Ob && (fk = b, c = Mj(c)), b = c, lk[d] = { nextPos: ek, result: b }, b);
    }function vb() {
      var b,
          c,
          d,
          e,
          f = 134 * ek + 121,
          g = lk[f];return g ? (ek = g.nextPos, g.result) : (b = ek, c = F(), c !== Ob ? (d = ek, kk++, 40 === a.charCodeAt(ek) ? (e = _e, ek++) : (e = Ob, 0 === kk && i(af)), kk--, e === Ob ? d = Sb : (ek = d, d = Tb), d !== Ob ? (fk = b, c = Nj(c), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb), lk[f] = { nextPos: ek, result: b }, b);
    }function wb() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n,
          o = 134 * ek + 122,
          p = lk[o];if (p) return ek = p.nextPos, p.result;if ((b = ek, a.substr(ek, 4).toLowerCase() === Oj ? (c = a.substr(ek, 4), ek += 4) : (c = Ob, 0 === kk && i(Pj)), c !== Ob)) {
        if ((d = [], e = ek, f = r(), f !== Ob ? (a.substr(ek, 4).toLowerCase() === Qj ? (g = a.substr(ek, 4), ek += 4) : (g = Ob, 0 === kk && i(Rj)), g !== Ob ? (h = r(), h !== Ob ? (j = Bb(), j !== Ob ? (k = r(), k !== Ob ? (a.substr(ek, 4).toLowerCase() === Sj ? (l = a.substr(ek, 4), ek += 4) : (l = Ob, 0 === kk && i(Tj)), l !== Ob ? (m = r(), m !== Ob ? (n = Bb(), n !== Ob ? (fk = e, f = Uj(j, n), e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb), e !== Ob)) for (; e !== Ob;) d.push(e), e = ek, f = r(), f !== Ob ? (a.substr(ek, 4).toLowerCase() === Qj ? (g = a.substr(ek, 4), ek += 4) : (g = Ob, 0 === kk && i(Rj)), g !== Ob ? (h = r(), h !== Ob ? (j = Bb(), j !== Ob ? (k = r(), k !== Ob ? (a.substr(ek, 4).toLowerCase() === Sj ? (l = a.substr(ek, 4), ek += 4) : (l = Ob, 0 === kk && i(Tj)), l !== Ob ? (m = r(), m !== Ob ? (n = Bb(), n !== Ob ? (fk = e, f = Uj(j, n), e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb);else d = Tb;d !== Ob ? (e = ek, f = r(), f !== Ob ? (a.substr(ek, 4).toLowerCase() === Vj ? (g = a.substr(ek, 4), ek += 4) : (g = Ob, 0 === kk && i(Wj)), g !== Ob ? (h = r(), h !== Ob ? (j = Bb(), j !== Ob ? (fk = e, f = Xj(j), e = f) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb)) : (ek = e, e = Tb), e === Ob && (e = vc), e !== Ob ? (f = r(), f !== Ob ? (a.substr(ek, 3).toLowerCase() === Yj ? (g = a.substr(ek, 3), ek += 3) : (g = Ob, 0 === kk && i(Zj)), g !== Ob ? (fk = b, c = $j(d, e), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb);
      } else ek = b, b = Tb;return lk[o] = { nextPos: ek, result: b }, b;
    }function xb() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 123,
          f = lk[e];if (f) return ek = f.nextPos, f.result;if ((a = ek, b = yb(), b !== Ob)) {
        if ((c = [], d = gb(), d === Ob && (d = hb()), d !== Ob)) for (; d !== Ob;) c.push(d), d = gb(), d === Ob && (d = hb());else c = Tb;c !== Ob ? (fk = a, b = _j(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return a === Ob && (a = yb()), lk[e] = { nextPos: ek, result: a }, a;
    }function yb() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 124,
          f = lk[e];if (f) return ek = f.nextPos, f.result;if ((a = ek, b = zb(), b !== Ob)) {
        if ((c = [], d = ib(), d !== Ob)) for (; d !== Ob;) c.push(d), d = ib();else c = Tb;c !== Ob ? (fk = a, b = _j(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return a === Ob && (a = zb()), lk[e] = { nextPos: ek, result: a }, a;
    }function zb() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 125,
          f = lk[e];if (f) return ek = f.nextPos, f.result;if ((a = ek, b = Ab(), b !== Ob)) {
        if ((c = [], d = jb(), d !== Ob)) for (; d !== Ob;) c.push(d), d = jb();else c = Tb;c !== Ob ? (fk = a, b = _j(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return a === Ob && (a = Ab()), lk[e] = { nextPos: ek, result: a }, a;
    }function Ab() {
      var a,
          b = 134 * ek + 126,
          c = lk[b];return c ? (ek = c.nextPos, c.result) : (a = wb(), a === Ob && (a = Bb()), lk[b] = { nextPos: ek, result: a }, a);
    }function Bb() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 127,
          f = lk[e];if (f) return ek = f.nextPos, f.result;if ((a = ek, b = Cb(), b !== Ob)) {
        if ((c = [], d = kb(), d !== Ob)) for (; d !== Ob;) c.push(d), d = kb();else c = Tb;c !== Ob ? (fk = a, b = _j(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return a === Ob && (a = Cb()), lk[e] = { nextPos: ek, result: a }, a;
    }function Cb() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 128,
          f = lk[e];if (f) return ek = f.nextPos, f.result;if ((a = ek, b = Db(), b !== Ob)) {
        if ((c = [], d = lb(), d !== Ob)) for (; d !== Ob;) c.push(d), d = lb();else c = Tb;c !== Ob ? (fk = a, b = _j(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return a === Ob && (a = Db()), lk[e] = { nextPos: ek, result: a }, a;
    }function Db() {
      var a,
          b,
          c,
          d,
          e = 134 * ek + 129,
          f = lk[e];if (f) return ek = f.nextPos, f.result;if ((a = ek, b = Eb(), b !== Ob)) {
        if ((c = [], d = mb(), d !== Ob)) for (; d !== Ob;) c.push(d), d = mb();else c = Tb;c !== Ob ? (fk = a, b = _j(b, c), a = b) : (ek = a, a = Tb);
      } else ek = a, a = Tb;return a === Ob && (a = Eb()), lk[e] = { nextPos: ek, result: a }, a;
    }function Eb() {
      var a,
          b = 134 * ek + 130,
          c = lk[b];return c ? (ek = c.nextPos, c.result) : (a = nb(), a === Ob && (a = Fb()), lk[b] = { nextPos: ek, result: a }, a);
    }function Fb() {
      var a,
          b = 134 * ek + 131,
          c = lk[b];return c ? (ek = c.nextPos, c.result) : (a = ob(), a === Ob && (a = Gb()), lk[b] = { nextPos: ek, result: a }, a);
    }function Gb() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 134 * ek + 132,
          j = lk[h];return j ? (ek = j.nextPos, j.result) : (b = tb(), b === Ob && (b = sb(), b === Ob && (b = rb(), b === Ob && (b = qb(), b === Ob && (b = pb(), b === Ob && (b = vb(), b === Ob && (b = ek, 40 === a.charCodeAt(ek) ? (c = _e, ek++) : (c = Ob, 0 === kk && i(af)), c !== Ob ? (d = s(), d !== Ob ? (e = xb(), e !== Ob ? (f = s(), f !== Ob ? (41 === a.charCodeAt(ek) ? (g = bf, ek++) : (g = Ob, 0 === kk && i(cf)), g !== Ob ? (fk = b, c = Df(e), b = c) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb)) : (ek = b, b = Tb))))))), lk[h] = { nextPos: ek, result: b }, b);
    }function Hb() {
      var b,
          c = 134 * ek + 133,
          d = lk[c];return d ? (ek = d.nextPos, d.result) : (a.substr(ek, 2).toLowerCase() === ad ? (b = a.substr(ek, 2), ek += 2) : (b = Ob, 0 === kk && i(bd)), b === Ob && (a.substr(ek, 5).toLowerCase() === ed ? (b = a.substr(ek, 5), ek += 5) : (b = Ob, 0 === kk && i(fd)), b === Ob && (a.substr(ek, 3).toLowerCase() === id ? (b = a.substr(ek, 3), ek += 3) : (b = Ob, 0 === kk && i(jd)), b === Ob && (a.substr(ek, 3).toLowerCase() === ud ? (b = a.substr(ek, 3), ek += 3) : (b = Ob, 0 === kk && i(vd)), b === Ob && (a.substr(ek, 5).toLowerCase() === yd ? (b = a.substr(ek, 5), ek += 5) : (b = Ob, 0 === kk && i(zd)), b === Ob && (a.substr(ek, 3).toLowerCase() === vg ? (b = a.substr(ek, 3), ek += 3) : (b = Ob, 0 === kk && i(wg)), b === Ob && (a.substr(ek, 2).toLowerCase() === Hg ? (b = a.substr(ek, 2), ek += 2) : (b = Ob, 0 === kk && i(Ig)), b === Ob && (a.substr(ek, 3).toLowerCase() === ak ? (b = a.substr(ek, 3), ek += 3) : (b = Ob, 0 === kk && i(bk)), b === Ob && (a.substr(ek, 5).toLowerCase() === Cd ? (b = a.substr(ek, 5), ek += 5) : (b = Ob, 0 === kk && i(Dd)), b === Ob && (a.substr(ek, 9).toLowerCase() === Gd ? (b = a.substr(ek, 9), ek += 9) : (b = Ob, 0 === kk && i(Hd)), b === Ob && (a.substr(ek, 6).toLowerCase() === Od ? (b = a.substr(ek, 6), ek += 6) : (b = Ob, 0 === kk && i(Pd)), b === Ob && (a.substr(ek, 4).toLowerCase() === Wd ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(Xd)), b === Ob && (a.substr(ek, 5).toLowerCase() === Ud ? (b = a.substr(ek, 5), ek += 5) : (b = Ob, 0 === kk && i(Vd)), b === Ob && (a.substr(ek, 4).toLowerCase() === Wd ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(Xd)), b === Ob && (a.substr(ek, 4).toLowerCase() === ge ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(he)), b === Ob && (a.substr(ek, 5).toLowerCase() === me ? (b = a.substr(ek, 5), ek += 5) : (b = Ob, 0 === kk && i(ne)), b === Ob && (a.substr(ek, 5).toLowerCase() === ue ? (b = a.substr(ek, 5), ek += 5) : (b = Ob, 0 === kk && i(ve)), b === Ob && (a.substr(ek, 4).toLowerCase() === Ae ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(Be)), b === Ob && (a.substr(ek, 6).toLowerCase() === ck ? (b = a.substr(ek, 6), ek += 6) : (b = Ob, 0 === kk && i(dk)), b === Ob && (a.substr(ek, 4).toLowerCase() === ie ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(je)), b === Ob && (a.substr(ek, 4).toLowerCase() === qe ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(re)), b === Ob && (a.substr(ek, 4).toLowerCase() === Oe ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(Pe)), b === Ob && (a.substr(ek, 3).toLowerCase() === Me ? (b = a.substr(ek, 3), ek += 3) : (b = Ob, 0 === kk && i(Ne)), b === Ob && (a.substr(ek, 4).toLowerCase() === Oj ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(Pj)), b === Ob && (a.substr(ek, 4).toLowerCase() === Qj ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(Rj)), b === Ob && (a.substr(ek, 4).toLowerCase() === Sj ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(Tj)), b === Ob && (a.substr(ek, 4).toLowerCase() === Vj ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(Wj)), b === Ob && (a.substr(ek, 3).toLowerCase() === Yj ? (b = a.substr(ek, 3), ek += 3) : (b = Ob, 0 === kk && i(Zj)), b === Ob && (a.substr(ek, 4).toLowerCase() === Gc ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(Hc)), b === Ob && (a.substr(ek, 5).toLowerCase() === Jc ? (b = a.substr(ek, 5), ek += 5) : (b = Ob, 0 === kk && i(Kc)), b === Ob && (a.substr(ek, 4).toLowerCase() === _g ? (b = a.substr(ek, 4), ek += 4) : (b = Ob, 0 === kk && i(ah)))))))))))))))))))))))))))))))), lk[c] = { nextPos: ek, result: b }, b);
    }function Ib() {
      return { line: e(), column: f(), offset: d(), text: c() };
    }function Jb(a) {
      for (var b, c = {}, d = 0; d < a.length; d++) b = a[d].name, c[b] && g(i18n.t("db.messages.parser.error-duplicate-variable", { name: b })), c[b] = !0;
    }function Kb(a, b) {
      var c = b[0];c.child = a, c.codeInfo = Ib();for (var d, e = 1; e < b.length; e++) d = b[e], d.child = c, d.codeInfo = Ib(), c = d;return c;
    }function Lb(a, b) {
      var c = b[0];c.args[0] = a, c.codeInfo = Ib();for (var d, e = 1; e < b.length; e++) d = b[e], d.args[0] = c, d.codeInfo = Ib(), c = d;return c;
    }var Mb,
        Nb = arguments.length > 1 ? arguments[1] : {},
        Ob = {},
        Pb = { start: k, groupStart: l },
        Qb = k,
        Rb = function Rb(a) {
      return a;
    },
        Sb = void 0,
        Tb = Ob,
        Ub = { type: "any", description: "any character" },
        Vb = "\r\n",
        Wb = { type: "literal", value: "\r\n", description: '"\\r\\n"' },
        Xb = "\n",
        Yb = { type: "literal", value: "\n", description: '"\\n"' },
        Zb = { type: "other", description: "-- " },
        $b = "--",
        _b = { type: "literal", value: "--", description: '"--"' },
        ac = /^[ \t]/,
        bc = { type: "class", value: "[ \\t]", description: "[ \\t]" },
        cc = function cc() {
      return "";
    },
        dc = function dc(a) {
      return a;
    },
        ec = "/*",
        fc = { type: "literal", value: "/*", description: '"/*"' },
        gc = "*/",
        hc = { type: "literal", value: "*/", description: '"*/"' },
        ic = { type: "other", description: "whitespace" },
        jc = /^[ \t\r\n]/,
        kc = { type: "class", value: "[ \\t\\r\\n]", description: "[ \\t\\r\\n]" },
        lc = { type: "other", description: "optional whitespace" },
        mc = /^[\r\n\t ]/,
        nc = { type: "class", value: "[\\r\\n\\t ]", description: "[\\r\\n\\t ]" },
        oc = { type: "other", description: "optional whitespace without comments" },
        pc = { type: "other", description: "string" },
        qc = "'",
        rc = { type: "literal", value: "'", description: '"\'"' },
        sc = /^[^'\n]/,
        tc = { type: "class", value: "[^'\\n]", description: "[^'\\n]" },
        uc = function uc(a) {
      return a;
    },
        vc = null,
        wc = "-",
        xc = { type: "literal", value: "-", description: '"-"' },
        yc = /^[0-9]/,
        zc = { type: "class", value: "[0-9]", description: "[0-9]" },
        Ac = function Ac(a) {
      return parseInt(a, 10);
    },
        Bc = ".",
        Cc = { type: "literal", value: ".", description: '"."' },
        Dc = function Dc(a) {
      return parseFloat(a);
    },
        Ec = { type: "other", description: "date in ISO format (YYYY-MM-DD)" },
        Fc = function Fc(a, b, d) {
      a = parseInt(a, 10), b = parseInt(b, 10) - 1, d = parseInt(d, 10);var e = new Date(a, b, d);return (e.getFullYear() != a || e.getMonth() != b || e.getDate() != d) && g(i18n.t("db.messages.parser.error-invalid-date-format", { str: c() })), e;
    },
        Gc = "true",
        Hc = { type: "literal", value: "true", description: '"true"' },
        Ic = function Ic() {
      return !0;
    },
        Jc = "false",
        Kc = { type: "literal", value: "false", description: '"false"' },
        Lc = function Lc() {
      return !1;
    },
        Mc = "=",
        Nc = { type: "literal", value: "=", description: '"="' },
        Oc = { type: "other", description: "relationName" },
        Pc = /^[0-9a-zA-Z_]/,
        Qc = { type: "class", value: "[0-9a-zA-Z_]", description: "[0-9a-zA-Z_]" },
        Rc = /^[a-zA-Z]/,
        Sc = { type: "class", value: "[a-zA-Z]", description: "[a-zA-Z]" },
        Tc = function Tc(a) {
      return a;
    },
        Uc = function Uc(a, b) {
      return null != a && (a = a[0]), { type: "columnName", name: b, relAlias: a };
    },
        Vc = "[",
        Wc = { type: "literal", value: "[", description: '"["' },
        Xc = "]",
        Yc = { type: "literal", value: "]", description: '"]"' },
        Zc = function Zc(a, b) {
      return null != a && (a = a[0]), { type: "columnName", name: parseInt(b, 10), relAlias: a };
    },
        $c = "π",
        _c = { type: "literal", value: "π", description: "\"\\u03C0\"" },
        ad = "pi",
        bd = { type: "literal", value: "pi", description: '"pi"' },
        cd = "σ",
        dd = { type: "literal", value: "σ", description: "\"\\u03C3\"" },
        ed = "sigma",
        fd = { type: "literal", value: "sigma", description: '"sigma"' },
        gd = "ρ",
        hd = { type: "literal", value: "ρ", description: "\"\\u03C1\"" },
        id = "rho",
        jd = { type: "literal", value: "rho", description: '"rho"' },
        kd = "←",
        ld = { type: "literal", value: "←", description: "\"\\u2190\"" },
        md = "<-",
        nd = { type: "literal", value: "<-", description: '"<-"' },
        od = "→",
        pd = { type: "literal", value: "→", description: "\"\\u2192\"" },
        qd = "->",
        rd = { type: "literal", value: "->", description: '"->"' },
        sd = "τ",
        td = { type: "literal", value: "τ", description: "\"\\u03C4\"" },
        ud = "tau",
        vd = { type: "literal", value: "tau", description: '"tau"' },
        wd = "γ",
        xd = { type: "literal", value: "γ", description: "\"\\u03B3\"" },
        yd = "gamma",
        zd = { type: "literal", value: "gamma", description: '"gamma"' },
        Ad = "∪",
        Bd = { type: "literal", value: "∪", description: "\"\\u222A\"" },
        Cd = "union",
        Dd = { type: "literal", value: "union", description: '"union"' },
        Ed = "∩",
        Fd = { type: "literal", value: "∩", description: "\"\\u2229\"" },
        Gd = "intersect",
        Hd = { type: "literal", value: "intersect", description: '"intersect"' },
        Id = "÷",
        Jd = { type: "literal", value: "÷", description: '"\\xF7"' },
        Kd = "/",
        Ld = { type: "literal", value: "/", description: '"/"' },
        Md = "\\",
        Nd = { type: "literal", value: "\\", description: '"\\\\"' },
        Od = "except",
        Pd = { type: "literal", value: "except", description: '"except"' },
        Qd = "⨯",
        Rd = { type: "literal", value: "⨯", description: "\"\\u2A2F\"" },
        Sd = "x",
        Td = { type: "literal", value: "x", description: '"x"' },
        Ud = "cross",
        Vd = { type: "literal", value: "cross", description: '"cross"' },
        Wd = "join",
        Xd = { type: "literal", value: "join", description: '"join"' },
        Yd = "⨝",
        Zd = { type: "literal", value: "⨝", description: "\"\\u2A1D\"" },
        $d = "⋈",
        _d = { type: "literal", value: "⋈", description: "\"\\u22C8\"" },
        ae = "inner",
        be = { type: "literal", value: "inner", description: '"inner"' },
        ce = "natural",
        de = { type: "literal", value: "natural", description: '"natural"' },
        ee = "⋉",
        fe = { type: "literal", value: "⋉", description: "\"\\u22C9\"" },
        ge = "left",
        he = { type: "literal", value: "left", description: '"left"' },
        ie = "semi",
        je = { type: "literal", value: "semi", description: '"semi"' },
        ke = "⋊",
        le = { type: "literal", value: "⋊", description: "\"\\u22CA\"" },
        me = "right",
        ne = { type: "literal", value: "right", description: '"right"' },
        oe = "▷",
        pe = { type: "literal", value: "▷", description: "\"\\u25B7\"" },
        qe = "anti",
        re = { type: "literal", value: "anti", description: '"anti"' },
        se = "⟕",
        te = { type: "literal", value: "⟕", description: "\"\\u27D5\"" },
        ue = "outer",
        ve = { type: "literal", value: "outer", description: '"outer"' },
        we = "⟖",
        xe = { type: "literal", value: "⟖", description: "\"\\u27D6\"" },
        ye = "⟗",
        ze = { type: "literal", value: "⟗", description: "\"\\u27D7\"" },
        Ae = "full",
        Be = { type: "literal", value: "full", description: '"full"' },
        Ce = function Ce(a) {
      nk.push(a);
    },
        De = function De(a, b) {
      return { type: "assignment", name: a, child: b, codeInfo: Ib() };
    },
        Ee = function Ee(a, b) {
      return { type: "namedColumnExpr", name: b, relAlias: null, child: a, codeInfo: Ib() };
    },
        Fe = function Fe(a, b) {
      return { type: "namedColumnExpr", name: a, relAlias: null, child: b, codeInfo: Ib() };
    },
        Ge = ",",
        He = { type: "literal", value: ",", description: '","' },
        Ie = function Ie(a, b) {
      var c = [a];if (null !== b) for (var d in b) c.push(b[d][3]);return c;
    },
        Je = function Je(a, b) {
      return { type: "colAssignment", src: b, dst: a, codeInfo: Ib() };
    },
        Ke = function Ke(a, b) {
      return { type: "colAssignment", src: a, dst: b, codeInfo: Ib() };
    },
        Le = function Le(a, b) {
      var c = [a];if (null !== b) for (var d in b) c.push(b[d][3]);return c;
    },
        Me = "asc",
        Ne = { type: "literal", value: "asc", description: '"asc"' },
        Oe = "desc",
        Pe = { type: "literal", value: "desc", description: '"desc"' },
        Qe = function Qe(a, b) {
      return b = null == b ? !0 : b[1], { col: a, asc: b };
    },
        Re = "sum",
        Se = { type: "literal", value: "sum", description: '"sum"' },
        Te = "count",
        Ue = { type: "literal", value: "count", description: '"count"' },
        Ve = "avg",
        We = { type: "literal", value: "avg", description: '"avg"' },
        Xe = "min",
        Ye = { type: "literal", value: "min", description: '"min"' },
        Ze = "max",
        $e = { type: "literal", value: "max", description: '"max"' },
        _e = "(",
        af = { type: "literal", value: "(", description: '"("' },
        bf = ")",
        cf = { type: "literal", value: ")", description: '")"' },
        df = function df(a, b) {
      return { aggFunction: a.toUpperCase(), col: b };
    },
        ef = "count(*)",
        ff = { type: "literal", value: "count(*)", description: '"count(*)"' },
        gf = function gf() {
      return { aggFunction: "COUNT_ALL", col: null };
    },
        hf = function hf(a, b) {
      return a.name = b, a;
    },
        jf = function jf(a, b) {
      return b.name = a, b;
    },
        kf = function kf(a) {
      if ("valueExpr" === a.type && "columnValue" === a.func && !a.wrappedInBrackets && null === a.args[1]) {
        for (var b = 0; b < nk.length; b++) if (nk[b] === a.args[0]) return !1;return !0;
      }return !0;
    },
        lf = function lf(a, b) {
      var c = [b];for (var d in a) c.push(a[d][0]);return Jb(c), { type: "root", assignments: c, child: null, codeInfo: Ib() };
    },
        mf = function mf(a, b) {
      for (var c = [], d = 0; d < a.length; d++) c.push(a[d][0]);return Jb(c), { type: "root", assignments: c, child: b, codeInfo: Ib() };
    },
        nf = function nf(a) {
      for (var b = [], c = 0; c < a.length; c++) b.push(a[c][1]);return { type: "groupRoot", groups: b, codeInfo: Ib() };
    },
        of = function of(a, b) {
      var c = {};return c[a.header] = a.text, b.map(function (a) {
        var b = a[1].header;c[b] && g(i18n.t("db.messages.parser.error-group-duplicate-header", { name: b })), c[b] = a[1].text;
      }), c;
    },
        pf = /^[a-z]/,
        qf = { type: "class", value: "[a-z]", description: "[a-z]" },
        rf = ":",
        sf = { type: "literal", value: ":", description: '":"' },
        tf = function tf(a, b) {
      return { header: a, text: b };
    },
        uf = "[[",
        vf = { type: "literal", value: "[[", description: '"[["' },
        wf = "\\]]",
        xf = { type: "literal", value: "\\]]", description: '"\\\\]]"' },
        yf = "]]",
        zf = { type: "literal", value: "]]", description: '"]]"' },
        Af = function Af(a, b) {
      switch (a) {case "group":
          break;case "description":
          break;default:
          g(i18n.t("db.messages.parser.error-group-unknown-header", { name: a }));}return b = b.replace(/\\]]/g, "]]"), b = b.replace(/\\\\]]/g, "\\]]"), { header: a, text: b };
    },
        Bf = function Bf(a, b) {
      for (var c = [], d = 0; d < b.length; d++) c.push(b[d][1]);return Jb(c), "undefined" == typeof a.group ? g(i18n.t("db.messages.parser.error-group-header-name-missing") + ': "group: ..........\\n"') : 0 === a.group.trim().length && g(i18n.t("error-group-header-name-empty")), { type: "tableGroup", headers: a, assignments: c, codeInfo: Ib() };
    },
        Cf = function Cf(a, b) {
      return Kb(a, b);
    },
        Df = function Df(a) {
      return a.wrappedInBrackets = !0, a;
    },
        Ef = function Ef(a) {
      return { type: "intersect", child2: a };
    },
        Ff = function Ff(a) {
      return { type: "union", child2: a };
    },
        Gf = function Gf(a) {
      return { type: "difference", child2: a };
    },
        Hf = function Hf(a) {
      return { type: "crossJoin", child2: a };
    },
        If = function If(a, b) {
      return { type: "thetaJoin", child2: b, arg: a };
    },
        Jf = function Jf(a) {
      return { type: "naturalJoin", child2: a };
    },
        Kf = function Kf(a, b) {
      return { type: "leftOuterJoin", child2: b, arg: a };
    },
        Lf = function Lf(a, b) {
      return { type: "rightOuterJoin", child2: b, arg: a };
    },
        Mf = function Mf(a, b) {
      return { type: "fullOuterJoin", child2: b, arg: a };
    },
        Nf = function Nf(a) {
      return { type: "leftSemiJoin", child2: a };
    },
        Of = function Of(a) {
      return { type: "rightSemiJoin", child2: a };
    },
        Pf = function Pf(a) {
      return { type: "antiJoin", child2: a };
    },
        Qf = function Qf(a) {
      return { type: "division", child2: a };
    },
        Rf = function Rf(a, b) {
      return { type: "projection", child: b, arg: a, codeInfo: Ib() };
    },
        Sf = function Sf(a, b) {
      return { type: "selection", child: b, arg: a, codeInfo: Ib() };
    },
        Tf = function Tf(a, b) {
      return { type: "renameColumns", child: b, arg: a, codeInfo: Ib() };
    },
        Uf = function Uf(a, b) {
      return { type: "renameRelation", child: b, newRelAlias: a, codeInfo: Ib() };
    },
        Vf = ";",
        Wf = { type: "literal", value: ";", description: '";"' },
        Xf = function Xf(a, b, c) {
      return { type: "groupBy", child: c, group: a, aggregate: b, codeInfo: Ib() };
    },
        Yf = function Yf(a, b) {
      return { type: "groupBy", child: b, group: [], aggregate: a, codeInfo: Ib() };
    },
        Zf = function Zf(a, b) {
      return { type: "orderBy", child: b, arg: a, codeInfo: Ib() };
    },
        $f = function $f(a) {
      return { type: "relation", name: a, codeInfo: Ib() };
    },
        _f = "!=",
        ag = { type: "literal", value: "!=", description: '"!="' },
        bg = "≠",
        cg = { type: "literal", value: "≠", description: "\"\\u2260\"" },
        dg = "<>",
        eg = { type: "literal", value: "<>", description: '"<>"' },
        fg = function fg() {
      return "!=";
    },
        gg = ">=",
        hg = { type: "literal", value: ">=", description: '">="' },
        ig = "≥",
        jg = { type: "literal", value: "≥", description: "\"\\u2265\"" },
        kg = function kg() {
      return ">=";
    },
        lg = ">",
        mg = { type: "literal", value: ">", description: '">"' },
        ng = "<=",
        og = { type: "literal", value: "<=", description: '"<="' },
        pg = "≤",
        qg = { type: "literal", value: "≤", description: "\"\\u2264\"" },
        rg = function rg() {
      return "<=";
    },
        sg = "<",
        tg = { type: "literal", value: "<", description: '"<"' },
        ug = { type: "other", description: "logical AND" },
        vg = "and",
        wg = { type: "literal", value: "and", description: '"and"' },
        xg = "∧",
        yg = { type: "literal", value: "∧", description: "\"\\u2227\"" },
        zg = { type: "other", description: "logical XOR" },
        Ag = "xor",
        Bg = { type: "literal", value: "xor", description: '"xor"' },
        Cg = "⊻",
        Dg = { type: "literal", value: "⊻", description: "\"\\u22BB\"" },
        Eg = "⊕",
        Fg = { type: "literal", value: "⊕", description: "\"\\u2295\"" },
        Gg = { type: "other", description: "logical OR" },
        Hg = "or",
        Ig = { type: "literal", value: "or", description: '"or"' },
        Jg = "∨",
        Kg = { type: "literal", value: "∨", description: "\"\\u2228\"" },
        Lg = { type: "other", description: "logical NOT" },
        Mg = "!",
        Ng = { type: "literal", value: "!", description: '"!"' },
        Og = "¬",
        Pg = { type: "literal", value: "¬", description: '"\\xAC"' },
        Qg = { type: "other", description: "delimiter" },
        Rg = "string",
        Sg = { type: "literal", value: "string", description: '"string"' },
        Tg = "number",
        Ug = { type: "literal", value: "number", description: '"number"' },
        Vg = "date",
        Wg = { type: "literal", value: "date", description: '"date"' },
        Xg = "boolean",
        Yg = { type: "literal", value: "boolean", description: '"boolean"' },
        Zg = function Zg(a, b) {
      return { name: a.name, relAlias: a.relAlias, type: null === b ? null : b[1].toLowerCase() };
    },
        $g = function $g(a) {
      return { type: "date", value: a };
    },
        _g = "null",
        ah = { type: "literal", value: "null", description: '"null"' },
        bh = "NULL",
        ch = { type: "literal", value: "NULL", description: '"NULL"' },
        dh = function dh() {
      return { type: "null", value: null };
    },
        eh = "}",
        fh = { type: "literal", value: "}", description: '"}"' },
        gh = function gh(a) {
      return { type: "boolean", value: a, quoted: !1 };
    },
        hh = /^[\-_a-z0-9.]/i,
        ih = { type: "class", value: "[\\-_a-z0-9.]i", description: "[\\-_a-z0-9.]i" },
        jh = function jh(a) {
      return { type: "string", value: a, quoted: !1 };
    },
        kh = function kh(a) {
      return { type: "string", value: a, quoted: !0 };
    },
        lh = '"',
        mh = { type: "literal", value: '"', description: '"\\""' },
        nh = /^[^"\n]/,
        oh = { type: "class", value: '[^"\\n]', description: '[^"\\n]' },
        ph = function ph(a, b) {
      for (var c, d = [a], e = 0; e < b.length; e++) {
        c = b[e][1];for (var f = 0; f < d.length; f++) if (d[f].name == c.name && d[f].relAlias == c.relAlias) {
          var h = null == c.relAlias ? "" : c.relAlias + ".";g(i18n.t("db.messages.parser.error-group-non-unique-attribute", { name: h + c.name, index: e + 2 }));
        }d.push(c);
      }return d;
    },
        qh = function qh(a, b) {
      for (var c = [a], d = 0; d < b.length; d++) c.push(b[d][1]);return c;
    },
        rh = "{",
        sh = { type: "literal", value: "{", description: '"{"' },
        th = function th(a, b) {
      for (var c, d, e, f = a.length, h = [], i = 0; i < b.length; i++) {
        c = b[i][2], c.length != f && g("expected " + f + " columns in row " + (i + 1) + " but " + c.length + " found"), e = new Array(f);for (var j = 0; f > j; j++) if ((d = c[j], "null" !== d.type)) switch ((null === a[j].type && ("date" == d.type ? a[j].type = "date" : "boolean" == d.type ? a[j].type = "boolean" : "number" == d.type || d.value.match(/^-?[0-9]+(\.[0-9]+)?$/) && !d.quoted ? a[j].type = "number" : "string" == d.type && (a[j].type = "string")), a[j].type)) {case "date":
            "date" !== d.type && g("no valid date in row " + (i + 1) + " column " + (j + 1)), e[j] = d.value;break;case "number":
            "number" === d.type ? e[j] = d.value : d.value.match(/^-?[0-9]+$/) ? e[j] = parseInt(d.value, 10) : d.value.match(/^-?[0-9]+\.[0-9]+$/) ? e[j] = parseFloat(d.value) : g("no number in row " + (i + 1) + " column " + (j + 1) + '; found: "' + d.value + '"');break;case "string":
            e[j] = d.value.toString();break;case "boolean":
            e[j] = d.value;break;default:
            throw new Error("should not happen: " + a[j].type);} else e[j] = null;h.push(e);
      }for (var i = 0; f > i; i++) null === a[i].type && g("type for column " + a[i].name + " must be set explicitly");return { type: "table", name: "_inlineRelation" + mk++, columns: a, rows: h, codeInfo: Ib() };
    },
        uh = { type: "other", description: "boolean expression" },
        vh = function vh(a) {
      return { type: "valueExpr", datatype: "boolean", func: "or", args: [void 0, a], codeInfo: Ib() };
    },
        wh = "||",
        xh = { type: "literal", value: "||", description: '"||"' },
        yh = function yh(a) {
      return { type: "valueExpr", datatype: "string", func: "concat", args: [void 0, a], codeInfo: Ib() };
    },
        zh = function zh(a) {
      return { type: "valueExpr", datatype: "boolean", func: "xor", args: [void 0, a], codeInfo: Ib() };
    },
        Ah = function Ah(a) {
      return { type: "valueExpr", datatype: "boolean", func: "and", args: [void 0, a], codeInfo: Ib() };
    },
        Bh = function Bh(a, b) {
      return { type: "valueExpr", datatype: "boolean", func: a, args: [void 0, b], codeInfo: Ib() };
    },
        Ch = "like",
        Dh = { type: "literal", value: "like", description: '"like"' },
        Eh = "ilike",
        Fh = { type: "literal", value: "ilike", description: '"ilike"' },
        Gh = function Gh(a, b) {
      return "string" !== b.datatype && g(i18n.t("db.messages.parser.error-valueexpr-like-operand-no-string")), { type: "valueExpr", datatype: "boolean", func: a.toLowerCase(), args: [void 0, b], codeInfo: Ib() };
    },
        Hh = "+",
        Ih = { type: "literal", value: "+", description: '"+"' },
        Jh = function Jh(a, b) {
      return a = ({ "+": "add", "-": "sub" })[a], { type: "valueExpr", datatype: "number", func: a, args: [void 0, b], codeInfo: Ib() };
    },
        Kh = "*",
        Lh = { type: "literal", value: "*", description: '"*"' },
        Mh = "%",
        Nh = { type: "literal", value: "%", description: '"%"' },
        Oh = function Oh(a, b) {
      return a = ({ "*": "mul", "/": "div", "%": "mod" })[a], { type: "valueExpr", datatype: "number", func: a, args: [void 0, b], codeInfo: Ib() };
    },
        Ph = function Ph(a) {
      return { type: "valueExpr", datatype: "number", func: "minus", args: [a], codeInfo: Ib() };
    },
        Qh = function Qh(a) {
      return { type: "valueExpr", datatype: "boolean", func: "not", args: [a], codeInfo: Ib() };
    },
        Rh = "coalesce",
        Sh = { type: "literal", value: "coalesce", description: '"coalesce"' },
        Th = function Th() {
      return ["coalesce", "null"];
    },
        Uh = "concat",
        Vh = { type: "literal", value: "concat", description: '"concat"' },
        Wh = function Wh() {
      return ["concat", "string"];
    },
        Xh = function Xh(a, b, c) {
      for (var d = [b], e = 0; e < c.length; e++) d.push(c[e][2]);return { type: "valueExpr", datatype: a[1], func: a[0], args: d, codeInfo: Ib() };
    },
        Yh = "adddate",
        Zh = { type: "literal", value: "adddate", description: '"adddate"' },
        $h = function $h() {
      return ["adddate", "date"];
    },
        _h = "subdate",
        ai = { type: "literal", value: "subdate", description: '"subdate"' },
        bi = function bi() {
      return ["subdate", "date"];
    },
        ci = "mod",
        di = { type: "literal", value: "mod", description: '"mod"' },
        ei = function ei() {
      return ["mod", "number"];
    },
        fi = "add",
        gi = { type: "literal", value: "add", description: '"add"' },
        hi = function hi() {
      return ["add", "number"];
    },
        ii = "sub",
        ji = { type: "literal", value: "sub", description: '"sub"' },
        ki = function ki() {
      return ["sub", "number"];
    },
        li = "mul",
        mi = { type: "literal", value: "mul", description: '"mul"' },
        ni = function ni() {
      return ["mul", "number"];
    },
        oi = "div",
        pi = { type: "literal", value: "div", description: '"div"' },
        qi = function qi() {
      return ["div", "number"];
    },
        ri = function ri(a, b, c) {
      return { type: "valueExpr", datatype: a[1], func: a[0], args: [b, c], codeInfo: Ib() };
    },
        si = "upper",
        ti = { type: "literal", value: "upper", description: '"upper"' },
        ui = function ui() {
      return ["upper", "string"];
    },
        vi = "ucase",
        wi = { type: "literal", value: "ucase", description: '"ucase"' },
        xi = "lower",
        yi = { type: "literal", value: "lower", description: '"lower"' },
        zi = function zi() {
      return ["lower", "string"];
    },
        Ai = "lcase",
        Bi = { type: "literal", value: "lcase", description: '"lcase"' },
        Ci = "length",
        Di = { type: "literal", value: "length", description: '"length"' },
        Ei = function Ei() {
      return ["strlen", "number"];
    },
        Fi = "abs",
        Gi = { type: "literal", value: "abs", description: '"abs"' },
        Hi = function Hi() {
      return ["abs", "number"];
    },
        Ii = "floor",
        Ji = { type: "literal", value: "floor", description: '"floor"' },
        Ki = function Ki() {
      return ["floor", "number"];
    },
        Li = "ceil",
        Mi = { type: "literal", value: "ceil", description: '"ceil"' },
        Ni = function Ni() {
      return ["ceil", "number"];
    },
        Oi = "round",
        Pi = { type: "literal", value: "round", description: '"round"' },
        Qi = function Qi() {
      return ["round", "number"];
    },
        Ri = function Ri() {
      return ["date", "date"];
    },
        Si = "year",
        Ti = { type: "literal", value: "year", description: '"year"' },
        Ui = function Ui() {
      return ["year", "number"];
    },
        Vi = "month",
        Wi = { type: "literal", value: "month", description: '"month"' },
        Xi = function Xi() {
      return ["month", "number"];
    },
        Yi = "day",
        Zi = { type: "literal", value: "day", description: '"day"' },
        $i = function $i() {
      return ["dayofmonth", "number"];
    },
        _i = "hour",
        aj = { type: "literal", value: "hour", description: '"hour"' },
        bj = function bj() {
      return ["hour", "number"];
    },
        cj = "minute",
        dj = { type: "literal", value: "minute", description: '"minute"' },
        ej = function ej() {
      return ["minute", "number"];
    },
        fj = "second",
        gj = { type: "literal", value: "second", description: '"second"' },
        hj = function hj() {
      return ["second", "number"];
    },
        ij = "dayofmonth",
        jj = { type: "literal", value: "dayofmonth", description: '"dayofmonth"' },
        kj = function kj(a, b) {
      return { type: "valueExpr", datatype: a[1], func: a[0], args: [b], codeInfo: Ib() };
    },
        lj = "rand",
        mj = { type: "literal", value: "rand", description: '"rand"' },
        nj = function nj() {
      return ["rand", "number"];
    },
        oj = "rownum",
        pj = { type: "literal", value: "rownum", description: '"rownum"' },
        qj = function qj() {
      return ["rownum", "number"];
    },
        rj = "now",
        sj = { type: "literal", value: "now", description: '"now"' },
        tj = function tj() {
      return ["now", "date"];
    },
        uj = "current_timestamp",
        vj = { type: "literal", value: "current_timestamp", description: '"current_timestamp"' },
        wj = "transaction_timestamp",
        xj = { type: "literal", value: "transaction_timestamp", description: '"transaction_timestamp"' },
        yj = function yj() {
      return ["transaction_timestamp", "date"];
    },
        zj = "statement_timestamp",
        Aj = { type: "literal", value: "statement_timestamp", description: '"statement_timestamp"' },
        Bj = function Bj() {
      return ["statement_timestamp", "date"];
    },
        Cj = "clock_timestamp",
        Dj = { type: "literal", value: "clock_timestamp", description: '"clock_timestamp"' },
        Ej = function Ej() {
      return ["clock_timestamp", "date"];
    },
        Fj = "sysdate",
        Gj = { type: "literal", value: "sysdate", description: '"sysdate"' },
        Hj = function Hj(a) {
      return { type: "valueExpr", datatype: a[1], func: a[0], args: [], codeInfo: Ib() };
    },
        Ij = function Ij(a) {
      return [a, "number"];
    },
        Jj = function Jj(a) {
      return [a, "boolean"];
    },
        Kj = function Kj(a) {
      return [a, "string"];
    },
        Lj = function Lj(a) {
      return { type: "valueExpr", datatype: a[1], func: "constant", args: [a[0]], codeInfo: Ib() };
    },
        Mj = function Mj(a) {
      return { type: "valueExpr", datatype: "null", func: "constant", args: [null], codeInfo: Ib() };
    },
        Nj = function Nj(a) {
      return { type: "valueExpr", datatype: "null", func: "columnValue", args: [a.name, a.relAlias], codeInfo: Ib() };
    },
        Oj = "case",
        Pj = { type: "literal", value: "case", description: '"case"' },
        Qj = "when",
        Rj = { type: "literal", value: "when", description: '"when"' },
        Sj = "then",
        Tj = { type: "literal", value: "then", description: '"then"' },
        Uj = function Uj(a, b) {
      return { w: a, t: b };
    },
        Vj = "else",
        Wj = { type: "literal", value: "else", description: '"else"' },
        Xj = function Xj(a) {
      return a;
    },
        Yj = "end",
        Zj = { type: "literal", value: "end", description: '"end"' },
        $j = function $j(a, b) {
      var c,
          d = [];for (c = 0; c < a.length; c++) d.push(a[c].w), d.push(a[c].t);return null !== b && (d.push({ type: "valueExpr", datatype: "boolean", func: "constant", args: [!0], codeInfo: Ib() }), d.push(b)), { type: "valueExpr", datatype: "null", func: null === b ? "caseWhen" : "caseWhenElse", args: d, codeInfo: Ib() };
    },
        _j = function _j(a, b) {
      return Lb(a, b);
    },
        ak = "not",
        bk = { type: "literal", value: "not", description: '"not"' },
        ck = "natual",
        dk = { type: "literal", value: "natual", description: '"natual"' },
        ek = 0,
        fk = 0,
        gk = 0,
        hk = { line: 1, column: 1, seenCR: !1 },
        ik = 0,
        jk = [],
        kk = 0,
        lk = {};if ("startRule" in Nb) {
      if (!(Nb.startRule in Pb)) throw new Error("Can't start parsing from rule \"" + Nb.startRule + '".');Qb = Pb[Nb.startRule];
    }var mk = 1,
        nk = Nb.relationNames || [];if ((Mb = Qb(), Mb !== Ob && ek === a.length)) return Mb;throw (Mb !== Ob && ek < a.length && i({ type: "end", description: "end of input" }), j(null, jk, ik));
  }return a(b, Error), { SyntaxError: b, parse: c };
})();

},{}],109:[function(require,module,exports){
"use strict";

module.exports = (function () {
  function a(a, b) {
    function c() {
      this.constructor = a;
    }c.prototype = b.prototype, a.prototype = new c();
  }function b(a, b, c, d, e, f) {
    this.message = a, this.expected = b, this.found = c, this.offset = d, this.line = e, this.column = f, this.name = "SyntaxError";
  }function c(a) {
    function c() {
      return a.substring(nk, mk);
    }function d() {
      return nk;
    }function e() {
      return h(nk).line;
    }function f() {
      return h(nk).column;
    }function g(a) {
      throw j(a, null, nk);
    }function h(b) {
      function c(b, c, d) {
        var e, f;for (e = c; d > e; e++) f = a.charAt(e), "\n" === f ? (b.seenCR || b.line++, b.column = 1, b.seenCR = !1) : "\r" === f || "\u2028" === f || "\u2029" === f ? (b.line++, b.column = 1, b.seenCR = !0) : (b.column++, b.seenCR = !1);
      }return ok !== b && (ok > b && (ok = 0, pk = { line: 1, column: 1, seenCR: !1 }), c(pk, ok, b), ok = b), pk;
    }function i(a) {
      qk > mk || (mk > qk && (qk = mk, rk = []), rk.push(a));
    }function j(c, d, e) {
      function f(a) {
        var b = 1;for (a.sort(function (a, b) {
          return a.description < b.description ? -1 : a.description > b.description ? 1 : 0;
        }); b < a.length;) a[b - 1] === a[b] ? a.splice(b, 1) : b++;
      }function g(a, b) {
        function c(a) {
          function b(a) {
            return a.charCodeAt(0).toString(16).toUpperCase();
          }return a.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\x08/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (a) {
            return "\\x0" + b(a);
          }).replace(/[\x10-\x1F\x80-\xFF]/g, function (a) {
            return "\\x" + b(a);
          }).replace(/[\u0180-\u0FFF]/g, function (a) {
            return "\\u0" + b(a);
          }).replace(/[\u1080-\uFFFF]/g, function (a) {
            return "\\u" + b(a);
          });
        }var d,
            e,
            f,
            g = new Array(a.length);for (f = 0; f < a.length; f++) g[f] = a[f].description;return d = a.length > 1 ? g.slice(0, -1).join(", ") + " or " + g[a.length - 1] : g[0], e = b ? '"' + c(b) + '"' : "end of input", "Expected " + d + " but " + e + " found.";
      }var i = h(e),
          j = e < a.length ? a.charAt(e) : null;return null !== d && f(d), new b(null !== c ? c : g(d, j), d, j, e, i.line, i.column);
    }function k() {
      var a,
          b,
          c,
          d = 113 * mk + 0,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (a = mk, b = P(), b !== qb && (nk = a, b = tb(b)), a = b, a === qb && (a = mk, b = P(), b !== qb ? (c = r(), c !== qb ? (nk = a, b = tb(b), a = b) : (mk = a, a = ub)) : (mk = a, a = ub), a === qb && (a = mk, b = r(), b !== qb ? (c = P(), c !== qb ? (nk = a, b = tb(c), a = b) : (mk = a, a = ub)) : (mk = a, a = ub))), tk[d] = { nextPos: mk, result: a }, a);
    }function l() {
      var a,
          b = 113 * mk + 1,
          c = tk[b];return c ? (mk = c.nextPos, c.result) : (a = Ba(), tk[b] = { nextPos: mk, result: a }, a);
    }function m() {
      var b,
          c,
          d = 113 * mk + 2,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (b = mk, sk++, a.length > mk ? (c = a.charAt(mk), mk++) : (c = qb, 0 === sk && i(wb)), sk--, c === qb ? b = vb : (mk = b, b = ub), tk[d] = { nextPos: mk, result: b }, b);
    }function n() {
      var b,
          c = 113 * mk + 3,
          d = tk[c];return d ? (mk = d.nextPos, d.result) : (a.substr(mk, 2) === xb ? (b = xb, mk += 2) : (b = qb, 0 === sk && i(yb)), b === qb && (10 === a.charCodeAt(mk) ? (b = zb, mk++) : (b = qb, 0 === sk && i(Ab))), tk[c] = { nextPos: mk, result: b }, b);
    }function o() {
      var a,
          b = 113 * mk + 4,
          c = tk[b];return c ? (mk = c.nextPos, c.result) : (a = p(), a === qb && (a = q()), tk[b] = { nextPos: mk, result: a }, a);
    }function p() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 113 * mk + 5,
          l = tk[k];if (l) return mk = l.nextPos, l.result;if ((sk++, b = mk, a.substr(mk, 2) === Cb ? (c = Cb, mk += 2) : (c = qb, 0 === sk && i(Db)), c !== qb ? (Eb.test(a.charAt(mk)) ? (d = a.charAt(mk), mk++) : (d = qb, 0 === sk && i(Fb)), d !== qb ? (e = mk, sk++, f = n(), f === qb && (f = m()), sk--, f !== qb ? (mk = e, e = vb) : e = ub, e !== qb ? (c = [c, d, e], b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, a.substr(mk, 2) === Cb ? (c = Cb, mk += 2) : (c = qb, 0 === sk && i(Db)), c !== qb ? (d = mk, sk++, e = n(), e === qb && (e = m()), sk--, e !== qb ? (mk = d, d = vb) : d = ub, d !== qb ? (c = [c, d], b = c) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb))) if ((b = mk, a.substr(mk, 2) === Cb ? (c = Cb, mk += 2) : (c = qb, 0 === sk && i(Db)), c !== qb)) if ((Eb.test(a.charAt(mk)) ? (d = a.charAt(mk), mk++) : (d = qb, 0 === sk && i(Fb)), d !== qb)) {
        for (e = mk, f = [], g = mk, h = mk, sk++, j = n(), sk--, j === qb ? h = vb : (mk = h, h = ub), h !== qb ? (a.length > mk ? (j = a.charAt(mk), mk++) : (j = qb, 0 === sk && i(wb)), j !== qb ? (h = [h, j], g = h) : (mk = g, g = ub)) : (mk = g, g = ub); g !== qb;) f.push(g), g = mk, h = mk, sk++, j = n(), sk--, j === qb ? h = vb : (mk = h, h = ub), h !== qb ? (a.length > mk ? (j = a.charAt(mk), mk++) : (j = qb, 0 === sk && i(wb)), j !== qb ? (h = [h, j], g = h) : (mk = g, g = ub)) : (mk = g, g = ub);f !== qb && (f = a.substring(e, mk)), e = f, e !== qb ? (f = mk, sk++, g = n(), g === qb && (g = m()), sk--, g !== qb ? (mk = f, f = vb) : f = ub, f !== qb ? (c = [c, d, e, f], b = c) : (mk = b, b = ub)) : (mk = b, b = ub);
      } else mk = b, b = ub;else mk = b, b = ub;return sk--, b === qb && (c = qb, 0 === sk && i(Bb)), tk[k] = { nextPos: mk, result: b }, b;
    }function q() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 113 * mk + 6,
          j = tk[h];if (j) return mk = j.nextPos, j.result;if ((b = mk, a.substr(mk, 2) === Gb ? (c = Gb, mk += 2) : (c = qb, 0 === sk && i(Hb)), c !== qb)) {
        for (d = [], e = mk, f = mk, sk++, a.substr(mk, 2) === Ib ? (g = Ib, mk += 2) : (g = qb, 0 === sk && i(Jb)), sk--, g === qb ? f = vb : (mk = f, f = ub), f !== qb ? (a.length > mk ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(wb)), g !== qb ? (f = [f, g], e = f) : (mk = e, e = ub)) : (mk = e, e = ub); e !== qb;) d.push(e), e = mk, f = mk, sk++, a.substr(mk, 2) === Ib ? (g = Ib, mk += 2) : (g = qb, 0 === sk && i(Jb)), sk--, g === qb ? f = vb : (mk = f, f = ub), f !== qb ? (a.length > mk ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(wb)), g !== qb ? (f = [f, g], e = f) : (mk = e, e = ub)) : (mk = e, e = ub);d !== qb ? (a.substr(mk, 2) === Ib ? (e = Ib, mk += 2) : (e = qb, 0 === sk && i(Jb)), e !== qb ? (c = [c, d, e], b = c) : (mk = b, b = ub)) : (mk = b, b = ub);
      } else mk = b, b = ub;return tk[h] = { nextPos: mk, result: b }, b;
    }function r() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 113 * mk + 7,
          k = tk[j];if (k) return mk = k.nextPos, k.result;for (sk++, b = mk, c = [], d = mk, e = [], f = o(); f !== qb;) e.push(f), f = o();if (e !== qb) {
        if ((f = [], Lb.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(Mb)), g !== qb)) for (; g !== qb;) f.push(g), Lb.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(Mb));else f = ub;if (f !== qb) {
          for (g = [], h = o(); h !== qb;) g.push(h), h = o();g !== qb ? (e = [e, f, g], d = e) : (mk = d, d = ub);
        } else mk = d, d = ub;
      } else mk = d, d = ub;if (d !== qb) for (; d !== qb;) {
        for (c.push(d), d = mk, e = [], f = o(); f !== qb;) e.push(f), f = o();if (e !== qb) {
          if ((f = [], Lb.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(Mb)), g !== qb)) for (; g !== qb;) f.push(g), Lb.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(Mb));else f = ub;if (f !== qb) {
            for (g = [], h = o(); h !== qb;) g.push(h), h = o();g !== qb ? (e = [e, f, g], d = e) : (mk = d, d = ub);
          } else mk = d, d = ub;
        } else mk = d, d = ub;
      } else c = ub;return c !== qb && (nk = b, c = Nb()), b = c, sk--, b === qb && (c = qb, 0 === sk && i(Kb)), tk[j] = { nextPos: mk, result: b }, b;
    }function s() {
      var b,
          c,
          d = 113 * mk + 8,
          e = tk[d];if (e) return mk = e.nextPos, e.result;for (sk++, b = [], c = o(), c === qb && (Lb.test(a.charAt(mk)) ? (c = a.charAt(mk), mk++) : (c = qb, 0 === sk && i(Mb))); c !== qb;) b.push(c), c = o(), c === qb && (Lb.test(a.charAt(mk)) ? (c = a.charAt(mk), mk++) : (c = qb, 0 === sk && i(Mb)));return sk--, b === qb && (c = qb, 0 === sk && i(Ob)), tk[d] = { nextPos: mk, result: b }, b;
    }function t() {
      var b,
          c,
          d = 113 * mk + 9,
          e = tk[d];if (e) return mk = e.nextPos, e.result;if ((sk++, b = [], Qb.test(a.charAt(mk)) ? (c = a.charAt(mk), mk++) : (c = qb, 0 === sk && i(Rb)), c !== qb)) for (; c !== qb;) b.push(c), Qb.test(a.charAt(mk)) ? (c = a.charAt(mk), mk++) : (c = qb, 0 === sk && i(Rb));else b = ub;return sk--, b === qb && (c = qb, 0 === sk && i(Pb)), tk[d] = { nextPos: mk, result: b }, b;
    }function u() {
      var b,
          c,
          d = 113 * mk + 10,
          e = tk[d];if (e) return mk = e.nextPos, e.result;for (sk++, b = [], Qb.test(a.charAt(mk)) ? (c = a.charAt(mk), mk++) : (c = qb, 0 === sk && i(Rb)); c !== qb;) b.push(c), Qb.test(a.charAt(mk)) ? (c = a.charAt(mk), mk++) : (c = qb, 0 === sk && i(Rb));return sk--, b === qb && (c = qb, 0 === sk && i(Sb)), tk[d] = { nextPos: mk, result: b }, b;
    }function v() {
      var b,
          c,
          d,
          e,
          f,
          g = 113 * mk + 11,
          h = tk[g];if (h) return mk = h.nextPos, h.result;if ((sk++, b = mk, 34 === a.charCodeAt(mk) ? (c = Ub, mk++) : (c = qb, 0 === sk && i(Vb)), c !== qb)) {
        for (d = [], Wb.test(a.charAt(mk)) ? (e = a.charAt(mk), mk++) : (e = qb, 0 === sk && i(Xb)); e !== qb;) d.push(e), Wb.test(a.charAt(mk)) ? (e = a.charAt(mk), mk++) : (e = qb, 0 === sk && i(Xb));d !== qb ? (34 === a.charCodeAt(mk) ? (e = Ub, mk++) : (e = qb, 0 === sk && i(Vb)), e !== qb ? (nk = b, c = Yb(), b = c) : (mk = b, b = ub)) : (mk = b, b = ub);
      } else mk = b, b = ub;if (b === qb) if ((b = mk, 39 === a.charCodeAt(mk) ? (c = Zb, mk++) : (c = qb, 0 === sk && i($b)), c !== qb)) {
        for (d = mk, e = [], _b.test(a.charAt(mk)) ? (f = a.charAt(mk), mk++) : (f = qb, 0 === sk && i(ac)); f !== qb;) e.push(f), _b.test(a.charAt(mk)) ? (f = a.charAt(mk), mk++) : (f = qb, 0 === sk && i(ac));e !== qb && (e = a.substring(d, mk)), d = e, d !== qb ? (39 === a.charCodeAt(mk) ? (e = Zb, mk++) : (e = qb, 0 === sk && i($b)), e !== qb ? (nk = b, c = bc(d), b = c) : (mk = b, b = ub)) : (mk = b, b = ub);
      } else mk = b, b = ub;return sk--, b === qb && (c = qb, 0 === sk && i(Tb)), tk[g] = { nextPos: mk, result: b }, b;
    }function w() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 113 * mk + 12,
          j = tk[h];if (j) return mk = j.nextPos, j.result;if ((b = mk, c = mk, d = mk, 45 === a.charCodeAt(mk) ? (e = dc, mk++) : (e = qb, 0 === sk && i(ec)), e === qb && (e = cc), e !== qb)) {
        if ((f = [], fc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(gc)), g !== qb)) for (; g !== qb;) f.push(g), fc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(gc));else f = ub;f !== qb ? (e = [e, f], d = e) : (mk = d, d = ub);
      } else mk = d, d = ub;return d !== qb && (d = a.substring(c, mk)), c = d, c !== qb && (nk = b, c = hc(c)), b = c, tk[h] = { nextPos: mk, result: b }, b;
    }function x() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 113 * mk + 13,
          l = tk[k];if (l) return mk = l.nextPos, l.result;if ((b = mk, c = mk, d = mk, 45 === a.charCodeAt(mk) ? (e = dc, mk++) : (e = qb, 0 === sk && i(ec)), e === qb && (e = cc), e !== qb)) {
        if ((f = [], fc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(gc)), g !== qb)) for (; g !== qb;) f.push(g), fc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(gc));else f = ub;if (f !== qb) if ((46 === a.charCodeAt(mk) ? (g = ic, mk++) : (g = qb, 0 === sk && i(jc)), g !== qb)) {
          if ((h = [], fc.test(a.charAt(mk)) ? (j = a.charAt(mk), mk++) : (j = qb, 0 === sk && i(gc)), j !== qb)) for (; j !== qb;) h.push(j), fc.test(a.charAt(mk)) ? (j = a.charAt(mk), mk++) : (j = qb, 0 === sk && i(gc));else h = ub;h !== qb ? (e = [e, f, g, h], d = e) : (mk = d, d = ub);
        } else mk = d, d = ub;else mk = d, d = ub;
      } else mk = d, d = ub;return d !== qb && (d = a.substring(c, mk)), c = d, c !== qb && (nk = b, c = kc(c)), b = c, tk[k] = { nextPos: mk, result: b }, b;
    }function y() {
      var a,
          b = 113 * mk + 14,
          c = tk[b];return c ? (mk = c.nextPos, c.result) : (a = x(), a === qb && (a = w()), tk[b] = { nextPos: mk, result: a }, a);
    }function z() {
      var b,
          c,
          d = 113 * mk + 15,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (b = mk, a.substr(mk, 4).toLowerCase() === lc ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(mc)), c !== qb && (nk = b, c = nc()), b = c, b === qb && (b = mk, a.substr(mk, 5).toLowerCase() === oc ? (c = a.substr(mk, 5), mk += 5) : (c = qb, 0 === sk && i(pc)), c !== qb && (nk = b, c = qc()), b = c), tk[d] = { nextPos: mk, result: b }, b);
    }function A() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 113 * mk + 16,
          l = tk[k];if (l) return mk = l.nextPos, l.result;if ((sk++, b = mk, c = mk, sk++, d = mk, e = kb(), e !== qb)) {
        if ((f = mk, sk++, g = [], sc.test(a.charAt(mk)) ? (h = a.charAt(mk), mk++) : (h = qb, 0 === sk && i(tc)), h !== qb)) for (; h !== qb;) g.push(h), sc.test(a.charAt(mk)) ? (h = a.charAt(mk), mk++) : (h = qb, 0 === sk && i(tc));else g = ub;sk--, g === qb ? f = vb : (mk = f, f = ub), f !== qb ? (e = [e, f], d = e) : (mk = d, d = ub);
      } else mk = d, d = ub;if ((sk--, d === qb ? c = vb : (mk = c, c = ub), c !== qb)) {
        if ((d = mk, e = mk, f = [], uc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(vc)), g !== qb)) for (; g !== qb;) f.push(g), uc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(vc));else f = ub;if (f !== qb) {
          for (g = mk, h = [], sc.test(a.charAt(mk)) ? (j = a.charAt(mk), mk++) : (j = qb, 0 === sk && i(tc)); j !== qb;) h.push(j), sc.test(a.charAt(mk)) ? (j = a.charAt(mk), mk++) : (j = qb, 0 === sk && i(tc));h !== qb && (h = a.substring(g, mk)), g = h, g !== qb ? (f = [f, g], e = f) : (mk = e, e = ub);
        } else mk = e, e = ub;e !== qb && (e = a.substring(d, mk)), d = e, d !== qb ? (nk = b, c = wc(d), b = c) : (mk = b, b = ub);
      } else mk = b, b = ub;return sk--, b === qb && (c = qb, 0 === sk && i(rc)), tk[k] = { nextPos: mk, result: b }, b;
    }function B() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 113 * mk + 17,
          l = tk[k];if (l) return mk = l.nextPos, l.result;if ((b = mk, c = mk, sk++, d = mk, e = kb(), e !== qb)) {
        if ((f = mk, sk++, g = [], sc.test(a.charAt(mk)) ? (h = a.charAt(mk), mk++) : (h = qb, 0 === sk && i(tc)), h !== qb)) for (; h !== qb;) g.push(h), sc.test(a.charAt(mk)) ? (h = a.charAt(mk), mk++) : (h = qb, 0 === sk && i(tc));else g = ub;sk--, g === qb ? f = vb : (mk = f, f = ub), f !== qb ? (e = [e, f], d = e) : (mk = d, d = ub);
      } else mk = d, d = ub;if ((sk--, d === qb ? c = vb : (mk = c, c = ub), c !== qb)) {
        if ((d = mk, e = mk, f = [], uc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(vc)), g !== qb)) for (; g !== qb;) f.push(g), uc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(vc));else f = ub;if (f !== qb) {
          for (g = mk, h = [], sc.test(a.charAt(mk)) ? (j = a.charAt(mk), mk++) : (j = qb, 0 === sk && i(tc)); j !== qb;) h.push(j), sc.test(a.charAt(mk)) ? (j = a.charAt(mk), mk++) : (j = qb, 0 === sk && i(tc));h !== qb && (h = a.substring(g, mk)), g = h, g !== qb ? (f = [f, g], e = f) : (mk = e, e = ub);
        } else mk = e, e = ub;e !== qb && (e = a.substring(d, mk)), d = e, d !== qb ? (nk = b, c = xc(d), b = c) : (mk = b, b = ub);
      } else mk = b, b = ub;return tk[k] = { nextPos: mk, result: b }, b;
    }function C() {
      var b,
          c,
          d,
          e,
          f,
          g = 113 * mk + 19,
          h = tk[g];return h ? (mk = h.nextPos, h.result) : (b = mk, a.substr(mk, 4).toLowerCase() === yc ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(zc)), c !== qb ? (a.substr(mk, 2) === Ac ? (d = Ac, mk += 2) : (d = qb, 0 === sk && i(Bc)), d !== qb ? (e = D(), e !== qb ? (a.substr(mk, 2) === Cc ? (f = Cc, mk += 2) : (f = qb, 0 === sk && i(Dc)), f !== qb ? (nk = b, c = Ec(e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[g] = { nextPos: mk, result: b }, b);
    }function D() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l = 113 * mk + 20,
          m = tk[l];return m ? (mk = m.nextPos, m.result) : (sk++, b = mk, c = mk, d = mk, fc.test(a.charAt(mk)) ? (e = a.charAt(mk), mk++) : (e = qb, 0 === sk && i(gc)), e !== qb ? (fc.test(a.charAt(mk)) ? (f = a.charAt(mk), mk++) : (f = qb, 0 === sk && i(gc)), f !== qb ? (fc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(gc)), g !== qb ? (fc.test(a.charAt(mk)) ? (h = a.charAt(mk), mk++) : (h = qb, 0 === sk && i(gc)), h !== qb ? (e = [e, f, g, h], d = e) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub), d !== qb && (d = a.substring(c, mk)), c = d, c !== qb ? (45 === a.charCodeAt(mk) ? (d = dc, mk++) : (d = qb, 0 === sk && i(ec)), d !== qb ? (e = mk, f = mk, fc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(gc)), g !== qb ? (fc.test(a.charAt(mk)) ? (h = a.charAt(mk), mk++) : (h = qb, 0 === sk && i(gc)), h !== qb ? (g = [g, h], f = g) : (mk = f, f = ub)) : (mk = f, f = ub), f !== qb && (f = a.substring(e, mk)), e = f, e !== qb ? (45 === a.charCodeAt(mk) ? (f = dc, mk++) : (f = qb, 0 === sk && i(ec)), f !== qb ? (g = mk, h = mk, fc.test(a.charAt(mk)) ? (j = a.charAt(mk), mk++) : (j = qb, 0 === sk && i(gc)), j !== qb ? (fc.test(a.charAt(mk)) ? (k = a.charAt(mk), mk++) : (k = qb, 0 === sk && i(gc)), k !== qb ? (j = [j, k], h = j) : (mk = h, h = ub)) : (mk = h, h = ub), h !== qb && (h = a.substring(g, mk)), g = h, g !== qb ? (nk = b, c = Gc(c, e, g), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), sk--, b === qb && (c = qb, 0 === sk && i(Fc)), tk[l] = { nextPos: mk, result: b }, b);
    }function E() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 21,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (b = mk, c = mk, d = A(), d !== qb ? (46 === a.charCodeAt(mk) ? (e = ic, mk++) : (e = qb, 0 === sk && i(jc)), e !== qb ? (d = [d, e], c = d) : (mk = c, c = ub)) : (mk = c, c = ub), c === qb && (c = cc), c !== qb ? (d = B(), d !== qb ? (nk = b, c = Hc(c, d), b = c) : (mk = b, b = ub)) : (mk = b, b = ub), tk[f] = { nextPos: mk, result: b }, b);
    }function F() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 22,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (b = mk, c = mk, d = A(), d !== qb ? (46 === a.charCodeAt(mk) ? (e = ic, mk++) : (e = qb, 0 === sk && i(jc)), e !== qb ? (d = [d, e], c = d) : (mk = c, c = ub)) : (mk = c, c = ub), c === qb && (c = cc), c !== qb ? (42 === a.charCodeAt(mk) ? (d = Ic, mk++) : (d = qb, 0 === sk && i(Jc)), d !== qb ? (nk = b, c = Kc(c), b = c) : (mk = b, b = ub)) : (mk = b, b = ub), tk[f] = { nextPos: mk, result: b }, b);
    }function G() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 23,
          g = tk[f];if (g) return mk = g.nextPos, g.result;if ((b = mk, c = mk, d = [], fc.test(a.charAt(mk)) ? (e = a.charAt(mk), mk++) : (e = qb, 0 === sk && i(gc)), e !== qb)) for (; e !== qb;) d.push(e), fc.test(a.charAt(mk)) ? (e = a.charAt(mk), mk++) : (e = qb, 0 === sk && i(gc));else d = ub;return d !== qb && (d = a.substring(c, mk)), c = d, c !== qb && (nk = b, c = Lc(c)), b = c, tk[f] = { nextPos: mk, result: b }, b;
    }function H() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 113 * mk + 24,
          l = tk[k];return l ? (mk = l.nextPos, l.result) : (b = mk, c = mk, a.substr(mk, 3).toLowerCase() === Mc ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(Nc)), d === qb && (a.substr(mk, 5).toLowerCase() === Oc ? (d = a.substr(mk, 5), mk += 5) : (d = qb, 0 === sk && i(Pc)), d === qb && (a.substr(mk, 3).toLowerCase() === Qc ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(Rc)), d === qb && (a.substr(mk, 3).toLowerCase() === Sc ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(Tc)), d === qb && (a.substr(mk, 3).toLowerCase() === Uc ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(Vc)))))), d !== qb && (d = a.substring(c, mk)), c = d, c !== qb ? (40 === a.charCodeAt(mk) ? (d = Wc, mk++) : (d = qb, 0 === sk && i(Xc)), d !== qb ? (e = s(), e !== qb ? (f = mk, a.substr(mk, 3).toLowerCase() === Yc ? (g = a.substr(mk, 3), mk += 3) : (g = qb, 0 === sk && i(Zc)), g !== qb ? (h = r(), h !== qb ? (g = [g, h], f = g) : (mk = f, f = ub)) : (mk = f, f = ub), f === qb && (f = cc), f !== qb ? (g = E(), g !== qb ? (h = s(), h !== qb ? (41 === a.charCodeAt(mk) ? (j = $c, mk++) : (j = qb, 0 === sk && i(_c)), j !== qb ? (nk = b, c = ad(c, g), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, a.substr(mk, 8).toLowerCase() === bd ? (c = a.substr(mk, 8), mk += 8) : (c = qb, 0 === sk && i(cd)), c !== qb && (nk = b, c = dd()), b = c), tk[k] = { nextPos: mk, result: b }, b);
    }function I() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 113 * mk + 25,
          j = tk[h];return j ? (mk = j.nextPos, j.result) : (b = mk, c = H(), c !== qb ? (d = r(), d !== qb ? (a.substr(mk, 2).toLowerCase() === ed ? (e = a.substr(mk, 2), mk += 2) : (e = qb, 0 === sk && i(fd)), e !== qb ? (f = r(), f !== qb ? (g = B(), g !== qb ? (nk = b, c = gd(c, g), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, c = H(), c !== qb ? (d = s(), d !== qb ? (nk = b, c = hd(c), b = c) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, c = F(), c !== qb && (nk = b, c = id(c)), b = c, b === qb && (b = mk, c = E(), c !== qb ? (d = r(), d !== qb ? (a.substr(mk, 2).toLowerCase() === ed ? (e = a.substr(mk, 2), mk += 2) : (e = qb, 0 === sk && i(fd)), e !== qb ? (f = r(), f !== qb ? (g = B(), g !== qb ? (nk = b, c = jd(c, g), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, c = ab(), c !== qb ? (d = r(), d !== qb ? (a.substr(mk, 2).toLowerCase() === ed ? (e = a.substr(mk, 2), mk += 2) : (e = qb, 0 === sk && i(fd)), e !== qb ? (f = r(), f !== qb ? (g = B(), g !== qb ? (nk = b, c = kd(c, g), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, c = E(), c !== qb && (nk = b, c = id(c)), b = c))))), tk[h] = { nextPos: mk, result: b }, b);
    }function J() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 113 * mk + 26,
          l = tk[k];if (l) return mk = l.nextPos, l.result;if ((b = mk, c = I(), c !== qb)) {
        for (d = [], e = mk, f = s(), f !== qb ? (44 === a.charCodeAt(mk) ? (g = ld, mk++) : (g = qb, 0 === sk && i(md)), g !== qb ? (h = s(), h !== qb ? (j = I(), j !== qb ? (f = [f, g, h, j], e = f) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub); e !== qb;) d.push(e), e = mk, f = s(), f !== qb ? (44 === a.charCodeAt(mk) ? (g = ld, mk++) : (g = qb, 0 === sk && i(md)), g !== qb ? (h = s(), h !== qb ? (j = I(), j !== qb ? (f = [f, g, h, j], e = f) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub);d !== qb ? (nk = b, c = nd(c, d), b = c) : (mk = b, b = ub);
      } else mk = b, b = ub;return tk[k] = { nextPos: mk, result: b }, b;
    }function K() {
      var b,
          c,
          d = 113 * mk + 28,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (b = mk, a.substr(mk, 3).toLowerCase() === od ? (c = a.substr(mk, 3), mk += 3) : (c = qb, 0 === sk && i(pd)), c !== qb && (nk = b, c = qd()), b = c, b === qb && (b = mk, a.substr(mk, 4).toLowerCase() === rd ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(sd)), c !== qb && (nk = b, c = td()), b = c), tk[d] = { nextPos: mk, result: b }, b);
    }function L() {
      var a,
          b,
          c,
          d,
          e,
          f = 113 * mk + 29,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (a = mk, b = E(), b === qb && (b = G()), b !== qb ? (c = mk, d = r(), d !== qb ? (e = K(), e !== qb ? (d = [d, e], c = d) : (mk = c, c = ub)) : (mk = c, c = ub), c === qb && (c = cc), c !== qb ? (nk = a, b = ud(b, c), a = b) : (mk = a, a = ub)) : (mk = a, a = ub), tk[f] = { nextPos: mk, result: a }, a);
    }function M() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 113 * mk + 30,
          l = tk[k];if (l) return mk = l.nextPos, l.result;if ((b = mk, c = L(), c !== qb)) {
        for (d = [], e = mk, f = s(), f !== qb ? (44 === a.charCodeAt(mk) ? (g = ld, mk++) : (g = qb, 0 === sk && i(md)), g !== qb ? (h = s(), h !== qb ? (j = L(), j !== qb ? (f = [f, g, h, j], e = f) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub); e !== qb;) d.push(e), e = mk, f = s(), f !== qb ? (44 === a.charCodeAt(mk) ? (g = ld, mk++) : (g = qb, 0 === sk && i(md)), g !== qb ? (h = s(), h !== qb ? (j = L(), j !== qb ? (f = [f, g, h, j], e = f) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub);d !== qb ? (nk = b, c = vd(c, d), b = c) : (mk = b, b = ub);
      } else mk = b, b = ub;return tk[k] = { nextPos: mk, result: b }, b;
    }function N() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 113 * mk + 31,
          l = tk[k];if (l) return mk = l.nextPos, l.result;if ((b = mk, c = E(), c !== qb)) {
        for (d = [], e = mk, f = s(), f !== qb ? (44 === a.charCodeAt(mk) ? (g = ld, mk++) : (g = qb, 0 === sk && i(md)), g !== qb ? (h = s(), h !== qb ? (j = E(), j !== qb ? (f = [f, g, h, j], e = f) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub); e !== qb;) d.push(e), e = mk, f = s(), f !== qb ? (44 === a.charCodeAt(mk) ? (g = ld, mk++) : (g = qb, 0 === sk && i(md)), g !== qb ? (h = s(), h !== qb ? (j = E(), j !== qb ? (f = [f, g, h, j], e = f) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub);d !== qb ? (nk = b, c = wd(c, d), b = c) : (mk = b, b = ub);
      } else mk = b, b = ub;return tk[k] = { nextPos: mk, result: b }, b;
    }function O() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 113 * mk + 32,
          l = tk[k];return l ? (mk = l.nextPos, l.result) : (b = mk, c = A(), c !== qb ? (d = r(), d !== qb ? (a.substr(mk, 2).toLowerCase() === ed ? (e = a.substr(mk, 2), mk += 2) : (e = qb, 0 === sk && i(fd)), e !== qb ? (f = s(), f !== qb ? (40 === a.charCodeAt(mk) ? (g = Wc, mk++) : (g = qb, 0 === sk && i(Xc)), g !== qb ? (h = T(), h !== qb ? (41 === a.charCodeAt(mk) ? (j = $c, mk++) : (j = qb, 0 === sk && i(_c)), j !== qb ? (nk = b, c = xd(c, h), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[k] = { nextPos: mk, result: b }, b);
    }function P() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 113 * mk + 33,
          j = tk[h];return j ? (mk = j.nextPos, j.result) : (b = mk, c = Q(), c === qb && (c = cc), c !== qb ? (d = s(), d !== qb ? (e = T(), e !== qb ? (f = s(), f !== qb ? (59 === a.charCodeAt(mk) ? (g = yd, mk++) : (g = qb, 0 === sk && i(zd)), g === qb && (g = cc), g !== qb ? (nk = b, c = Ad(c, e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[h] = { nextPos: mk, result: b }, b);
    }function Q() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m = 113 * mk + 34,
          n = tk[m];if (n) return mk = n.nextPos, n.result;if ((b = mk, a.substr(mk, 4).toLowerCase() === Bd ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(Cd)), c !== qb)) if ((d = r(), d !== qb)) if ((e = O(), e !== qb)) {
        for (f = [], g = mk, h = s(), h !== qb ? (44 === a.charCodeAt(mk) ? (j = ld, mk++) : (j = qb, 0 === sk && i(md)), j !== qb ? (k = s(), k !== qb ? (l = O(), l !== qb ? (h = [h, j, k, l], g = h) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub); g !== qb;) f.push(g), g = mk, h = s(), h !== qb ? (44 === a.charCodeAt(mk) ? (j = ld, mk++) : (j = qb, 0 === sk && i(md)), j !== qb ? (k = s(), k !== qb ? (l = O(), l !== qb ? (h = [h, j, k, l], g = h) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub);f !== qb ? (nk = b, c = Dd(e, f), b = c) : (mk = b, b = ub);
      } else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;return tk[m] = { nextPos: mk, result: b }, b;
    }function R() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 113 * mk + 35,
          j = tk[h];return j ? (mk = j.nextPos, j.result) : (b = mk, a.substr(mk, 6).toLowerCase() === Ed ? (c = a.substr(mk, 6), mk += 6) : (c = qb, 0 === sk && i(Fd)), c !== qb ? (d = r(), d !== qb ? (e = mk, a.substr(mk, 8).toLowerCase() === Gd ? (f = a.substr(mk, 8), mk += 8) : (f = qb, 0 === sk && i(Hd)), f !== qb ? (g = r(), g !== qb ? (f = [f, g], e = f) : (mk = e, e = ub)) : (mk = e, e = ub), e === qb && (e = cc), e !== qb ? (f = J(), f !== qb ? (nk = b, c = Id(e, f), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[h] = { nextPos: mk, result: b }, b);
    }function S() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 113 * mk + 36,
          j = tk[h];return j ? (mk = j.nextPos, j.result) : (b = mk, a.substr(mk, 5).toLowerCase() === Jd ? (c = a.substr(mk, 5), mk += 5) : (c = qb, 0 === sk && i(Kd)), c !== qb ? (d = r(), d !== qb ? (a.substr(mk, 2).toLowerCase() === Ld ? (e = a.substr(mk, 2), mk += 2) : (e = qb, 0 === sk && i(Md)), e !== qb ? (f = r(), f !== qb ? (g = M(), g !== qb ? (nk = b, c = Nd(g), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[h] = { nextPos: mk, result: b }, b);
    }function T() {
      var a,
          b,
          c,
          d,
          e,
          f,
          g = 113 * mk + 37,
          h = tk[g];return h ? (mk = h.nextPos, h.result) : (a = mk, b = U(), b !== qb ? (c = mk, d = r(), d !== qb ? (e = S(), e !== qb ? (d = [d, e], c = d) : (mk = c, c = ub)) : (mk = c, c = ub), c === qb && (c = cc), c !== qb ? (d = mk, e = r(), e !== qb ? (f = ga(), f === qb && (f = ja()), f !== qb ? (e = [e, f], d = e) : (mk = d, d = ub)) : (mk = d, d = ub), d === qb && (d = cc), d !== qb ? (nk = a, b = Od(b, c, d), a = b) : (mk = a, a = ub)) : (mk = a, a = ub)) : (mk = a, a = ub), a === qb && (a = U()), tk[g] = { nextPos: mk, result: a }, a);
    }function U() {
      var a,
          b,
          c,
          d,
          e = 113 * mk + 38,
          f = tk[e];if (f) return mk = f.nextPos, f.result;if ((a = mk, b = V(), b !== qb)) {
        if ((c = [], d = X(), d === qb && (d = Y()), d !== qb)) for (; d !== qb;) c.push(d), d = X(), d === qb && (d = Y());else c = ub;c !== qb ? (nk = a, b = Pd(b, c), a = b) : (mk = a, a = ub);
      } else mk = a, a = ub;return a === qb && (a = V()), tk[e] = { nextPos: mk, result: a }, a;
    }function V() {
      var a,
          b,
          c,
          d,
          e = 113 * mk + 39,
          f = tk[e];if (f) return mk = f.nextPos, f.result;if ((a = mk, b = W(), b !== qb)) {
        if ((c = [], d = Z(), d !== qb)) for (; d !== qb;) c.push(d), d = Z();else c = ub;c !== qb ? (nk = a, b = Pd(b, c), a = b) : (mk = a, a = ub);
      } else mk = a, a = ub;return a === qb && (a = W()), tk[e] = { nextPos: mk, result: a }, a;
    }function W() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q = 113 * mk + 40,
          t = tk[q];return t ? (mk = t.nextPos, t.result) : (b = mk, c = R(), c !== qb ? (d = r(), d !== qb ? (a.substr(mk, 4).toLowerCase() === Qd ? (e = a.substr(mk, 4), mk += 4) : (e = qb, 0 === sk && i(Rd)), e !== qb ? (f = r(), f !== qb ? (g = $(), g !== qb ? (h = mk, j = r(), j !== qb ? (k = da(), k !== qb ? (j = [j, k], h = j) : (mk = h, h = ub)) : (mk = h, h = ub), h === qb && (h = cc), h !== qb ? (j = mk, k = r(), k !== qb ? (a.substr(mk, 5).toLowerCase() === Sd ? (l = a.substr(mk, 5), mk += 5) : (l = qb, 0 === sk && i(Td)), l !== qb ? (m = r(), m !== qb ? (a.substr(mk, 2).toLowerCase() === Ld ? (n = a.substr(mk, 2), mk += 2) : (n = qb, 0 === sk && i(Md)), n !== qb ? (o = r(), o !== qb ? (p = N(), p !== qb ? (k = [k, l, m, n, o, p], j = k) : (mk = j, j = ub)) : (mk = j, j = ub)) : (mk = j, j = ub)) : (mk = j, j = ub)) : (mk = j, j = ub)) : (mk = j, j = ub), j === qb && (j = cc), j !== qb ? (k = mk, l = r(), l !== qb ? (m = ea(), m !== qb ? (l = [l, m], k = l) : (mk = k, k = ub)) : (mk = k, k = ub), k === qb && (k = cc), k !== qb ? (nk = b, c = Ud(c, g, h, j, k), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, 40 === a.charCodeAt(mk) ? (c = Wc, mk++) : (c = qb, 0 === sk && i(Xc)), c !== qb ? (d = s(), d !== qb ? (e = T(), e !== qb ? (f = s(), f !== qb ? (41 === a.charCodeAt(mk) ? (g = $c, mk++) : (g = qb, 0 === sk && i(_c)), g !== qb ? (nk = b, c = Vd(e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)), tk[q] = { nextPos: mk, result: b }, b);
    }function X() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 113 * mk + 41,
          k = tk[j];return k ? (mk = k.nextPos, k.result) : (b = mk, c = r(), c !== qb ? (a.substr(mk, 5).toLowerCase() === Wd ? (d = a.substr(mk, 5), mk += 5) : (d = qb, 0 === sk && i(Xd)), d !== qb ? (e = r(), e !== qb ? (f = mk, a.substr(mk, 3).toLowerCase() === Yc ? (g = a.substr(mk, 3), mk += 3) : (g = qb, 0 === sk && i(Yd)), g !== qb ? (h = r(), h !== qb ? (nk = f, g = nc(), f = g) : (mk = f, f = ub)) : (mk = f, f = ub), f === qb && (f = mk, a.substr(mk, 8).toLowerCase() === Gd ? (g = a.substr(mk, 8), mk += 8) : (g = qb, 0 === sk && i(Hd)), g !== qb ? (h = r(), h !== qb ? (nk = f, g = qc(), f = g) : (mk = f, f = ub)) : (mk = f, f = ub)), f === qb && (f = cc), f !== qb ? (g = V(), g !== qb ? (nk = b, c = Zd(f, g), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[j] = { nextPos: mk, result: b }, b);
    }function Y() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 113 * mk + 42,
          k = tk[j];return k ? (mk = k.nextPos, k.result) : (b = mk, c = r(), c !== qb ? (a.substr(mk, 6).toLowerCase() === $d ? (d = a.substr(mk, 6), mk += 6) : (d = qb, 0 === sk && i(_d)), d !== qb ? (e = r(), e !== qb ? (f = mk, a.substr(mk, 3).toLowerCase() === Yc ? (g = a.substr(mk, 3), mk += 3) : (g = qb, 0 === sk && i(Yd)), g !== qb ? (h = r(), h !== qb ? (nk = f, g = nc(), f = g) : (mk = f, f = ub)) : (mk = f, f = ub), f === qb && (f = mk, a.substr(mk, 8).toLowerCase() === Gd ? (g = a.substr(mk, 8), mk += 8) : (g = qb, 0 === sk && i(Hd)), g !== qb ? (h = r(), h !== qb ? (nk = f, g = qc(), f = g) : (mk = f, f = ub)) : (mk = f, f = ub)), f === qb && (f = cc), f !== qb ? (g = V(), g !== qb ? (nk = b, c = ae(f, g), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[j] = { nextPos: mk, result: b }, b);
    }function Z() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 113 * mk + 43,
          k = tk[j];return k ? (mk = k.nextPos, k.result) : (b = mk, c = r(), c !== qb ? (a.substr(mk, 9).toLowerCase() === be ? (d = a.substr(mk, 9), mk += 9) : (d = qb, 0 === sk && i(ce)), d !== qb ? (e = r(), e !== qb ? (f = mk, a.substr(mk, 3).toLowerCase() === Yc ? (g = a.substr(mk, 3), mk += 3) : (g = qb, 0 === sk && i(Yd)), g !== qb ? (h = r(), h !== qb ? (nk = f, g = nc(), f = g) : (mk = f, f = ub)) : (mk = f, f = ub), f === qb && (f = mk, a.substr(mk, 8).toLowerCase() === Gd ? (g = a.substr(mk, 8), mk += 8) : (g = qb, 0 === sk && i(Hd)), g !== qb ? (h = r(), h !== qb ? (nk = f, g = qc(), f = g) : (mk = f, f = ub)) : (mk = f, f = ub)), f === qb && (f = cc), f !== qb ? (g = V(), g !== qb ? (nk = b, c = de(f, g), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[j] = { nextPos: mk, result: b }, b);
    }function $() {
      var a,
          b,
          c,
          d,
          e = 113 * mk + 44,
          f = tk[e];if (f) return mk = f.nextPos, f.result;if ((a = mk, b = _(), b !== qb)) {
        if ((c = [], d = aa(), d === qb && (d = ba(), d === qb && (d = ca())), d !== qb)) for (; d !== qb;) c.push(d), d = aa(), d === qb && (d = ba(), d === qb && (d = ca()));else c = ub;c !== qb ? (nk = a, b = Pd(b, c), a = b) : (mk = a, a = ub);
      } else mk = a, a = ub;return a === qb && (a = _()), tk[e] = { nextPos: mk, result: a }, a;
    }function _() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m = 113 * mk + 45,
          n = tk[m];return n ? (mk = n.nextPos, n.result) : (b = mk, c = A(), c !== qb ? (d = mk, e = r(), e !== qb ? (a.substr(mk, 2).toLowerCase() === ed ? (f = a.substr(mk, 2), mk += 2) : (f = qb, 0 === sk && i(fd)), f !== qb ? (g = r(), g !== qb ? (h = A(), h !== qb ? (e = [e, f, g, h], d = e) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub), d === qb && (d = cc), d !== qb ? (nk = b, c = ee(c, d), b = c) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, 40 === a.charCodeAt(mk) ? (c = Wc, mk++) : (c = qb, 0 === sk && i(Xc)), c !== qb ? (d = s(), d !== qb ? (e = T(), e !== qb ? (f = s(), f !== qb ? (41 === a.charCodeAt(mk) ? (g = $c, mk++) : (g = qb, 0 === sk && i(_c)), g !== qb ? (h = r(), h !== qb ? (a.substr(mk, 2).toLowerCase() === ed ? (j = a.substr(mk, 2), mk += 2) : (j = qb, 0 === sk && i(fd)), j !== qb ? (k = r(), k !== qb ? (l = A(), l !== qb ? (nk = b, c = fe(e, l), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, 40 === a.charCodeAt(mk) ? (c = Wc, mk++) : (c = qb, 0 === sk && i(Xc)), c !== qb ? (d = s(), d !== qb ? (e = $(), e !== qb ? (f = s(), f !== qb ? (41 === a.charCodeAt(mk) ? (g = $c, mk++) : (g = qb, 0 === sk && i(_c)), g !== qb ? (nk = b, c = Vd(e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub))), tk[m] = { nextPos: mk, result: b }, b);
    }function aa() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 113 * mk + 46,
          k = tk[j];return k ? (mk = k.nextPos, k.result) : (b = mk, c = mk, d = r(), d !== qb ? (a.substr(mk, 5).toLowerCase() === ge ? (e = a.substr(mk, 5), mk += 5) : (e = qb, 0 === sk && i(he)), e !== qb ? (f = r(), f !== qb ? (a.substr(mk, 4).toLowerCase() === ie ? (g = a.substr(mk, 4), mk += 4) : (g = qb, 0 === sk && i(je)), g !== qb ? (h = r(), h !== qb ? (d = [d, e, f, g, h], c = d) : (mk = c, c = ub)) : (mk = c, c = ub)) : (mk = c, c = ub)) : (mk = c, c = ub)) : (mk = c, c = ub), c === qb && (c = mk, d = s(), d !== qb ? (44 === a.charCodeAt(mk) ? (e = ld, mk++) : (e = qb, 0 === sk && i(md)), e !== qb ? (f = s(), f !== qb ? (d = [d, e, f], c = d) : (mk = c, c = ub)) : (mk = c, c = ub)) : (mk = c, c = ub)), c !== qb ? (d = _(), d !== qb ? (nk = b, c = ke(d), b = c) : (mk = b, b = ub)) : (mk = b, b = ub), tk[j] = { nextPos: mk, result: b }, b);
    }function ba() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 113 * mk + 47,
          k = tk[j];return k ? (mk = k.nextPos, k.result) : (b = mk, c = r(), c !== qb ? (a.substr(mk, 7).toLowerCase() === le ? (d = a.substr(mk, 7), mk += 7) : (d = qb, 0 === sk && i(me)), d !== qb ? (e = r(), e !== qb ? (a.substr(mk, 4).toLowerCase() === ie ? (f = a.substr(mk, 4), mk += 4) : (f = qb, 0 === sk && i(je)), f !== qb ? (g = r(), g !== qb ? (h = _(), h !== qb ? (nk = b, c = ne(h), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[j] = { nextPos: mk, result: b }, b);
    }function ca() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          t,
          u,
          v,
          w = 113 * mk + 48,
          x = tk[w];if (x) return mk = x.nextPos, x.result;if ((b = mk, c = r(), c !== qb)) if ((d = mk, e = mk, a.substr(mk, 5).toLowerCase() === oe ? (f = a.substr(mk, 5), mk += 5) : (f = qb, 0 === sk && i(pe)), f !== qb ? (g = r(), g !== qb ? (f = [f, g], e = f) : (mk = e, e = ub)) : (mk = e, e = ub), e === qb && (e = cc), e !== qb ? (a.substr(mk, 4).toLowerCase() === ie ? (f = a.substr(mk, 4), mk += 4) : (f = qb, 0 === sk && i(je)), f !== qb ? (nk = d, e = qe(), d = e) : (mk = d, d = ub)) : (mk = d, d = ub), d === qb && (d = mk, a.substr(mk, 4).toLowerCase() === re ? (e = a.substr(mk, 4), mk += 4) : (e = qb, 0 === sk && i(se)), e !== qb ? (f = mk, g = r(), g !== qb ? (a.substr(mk, 5) === te ? (h = te, mk += 5) : (h = qb, 0 === sk && i(ue)), h !== qb ? (g = [g, h], f = g) : (mk = f, f = ub)) : (mk = f, f = ub), f === qb && (f = cc), f !== qb ? (g = r(), g !== qb ? (a.substr(mk, 4).toLowerCase() === ie ? (h = a.substr(mk, 4), mk += 4) : (h = qb, 0 === sk && i(je)), h !== qb ? (nk = d, e = ve(), d = e) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub), d === qb && (d = mk, a.substr(mk, 5).toLowerCase() === we ? (e = a.substr(mk, 5), mk += 5) : (e = qb, 0 === sk && i(xe)), e !== qb ? (f = mk, g = r(), g !== qb ? (a.substr(mk, 5).toLowerCase() === te ? (h = a.substr(mk, 5), mk += 5) : (h = qb, 0 === sk && i(ue)), h !== qb ? (g = [g, h], f = g) : (mk = f, f = ub)) : (mk = f, f = ub), f === qb && (f = cc), f !== qb ? (g = r(), g !== qb ? (a.substr(mk, 4).toLowerCase() === ie ? (h = a.substr(mk, 4), mk += 4) : (h = qb, 0 === sk && i(je)), h !== qb ? (nk = d, e = ye(), d = e) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub), d === qb && (d = mk, a.substr(mk, 4).toLowerCase() === ze ? (e = a.substr(mk, 4), mk += 4) : (e = qb, 0 === sk && i(Ae)), e !== qb ? (f = mk, g = r(), g !== qb ? (a.substr(mk, 5).toLowerCase() === te ? (h = a.substr(mk, 5), mk += 5) : (h = qb, 0 === sk && i(ue)), h !== qb ? (g = [g, h], f = g) : (mk = f, f = ub)) : (mk = f, f = ub), f === qb && (f = cc), f !== qb ? (g = r(), g !== qb ? (a.substr(mk, 4).toLowerCase() === ie ? (h = a.substr(mk, 4), mk += 4) : (h = qb, 0 === sk && i(je)), h !== qb ? (nk = d, e = Be(), d = e) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub)))), d !== qb)) if ((e = r(), e !== qb)) if ((f = _(), f !== qb)) if ((g = r(), g !== qb)) {
        if ((h = mk, a.substr(mk, 2).toLowerCase() === Ce ? (j = a.substr(mk, 2), mk += 2) : (j = qb, 0 === sk && i(De)), j !== qb ? (k = r(), k !== qb ? (l = Ka(), l !== qb ? (nk = h, j = Ee(l), h = j) : (mk = h, h = ub)) : (mk = h, h = ub)) : (mk = h, h = ub), h === qb)) {
          if ((h = mk, a.substr(mk, 5).toLowerCase() === Fe ? (j = a.substr(mk, 5), mk += 5) : (j = qb, 0 === sk && i(Ge)), j !== qb)) if ((k = s(), k !== qb)) if ((40 === a.charCodeAt(mk) ? (l = Wc, mk++) : (l = qb, 0 === sk && i(Xc)), l !== qb)) if ((m = s(), m !== qb)) if ((n = B(), n !== qb)) {
            for (o = [], p = mk, q = s(), q !== qb ? (44 === a.charCodeAt(mk) ? (t = ld, mk++) : (t = qb, 0 === sk && i(md)), t !== qb ? (u = s(), u !== qb ? (v = B(), v !== qb ? (q = [q, t, u, v], p = q) : (mk = p, p = ub)) : (mk = p, p = ub)) : (mk = p, p = ub)) : (mk = p, p = ub); p !== qb;) o.push(p), p = mk, q = s(), q !== qb ? (44 === a.charCodeAt(mk) ? (t = ld, mk++) : (t = qb, 0 === sk && i(md)), t !== qb ? (u = s(), u !== qb ? (v = B(), v !== qb ? (q = [q, t, u, v], p = q) : (mk = p, p = ub)) : (mk = p, p = ub)) : (mk = p, p = ub)) : (mk = p, p = ub);o !== qb ? (p = s(), p !== qb ? (41 === a.charCodeAt(mk) ? (q = $c, mk++) : (q = qb, 0 === sk && i(_c)), q !== qb ? (nk = h, j = He(n, o), h = j) : (mk = h, h = ub)) : (mk = h, h = ub)) : (mk = h, h = ub);
          } else mk = h, h = ub;else mk = h, h = ub;else mk = h, h = ub;else mk = h, h = ub;else mk = h, h = ub;h === qb && (h = mk, a.substr(mk, 7).toLowerCase() === le ? (j = a.substr(mk, 7), mk += 7) : (j = qb, 0 === sk && i(me)), j !== qb && (nk = h, j = Ie()), h = j);
        }h !== qb ? (nk = b, c = Je(d, f, h), b = c) : (mk = b, b = ub);
      } else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;return tk[w] = { nextPos: mk, result: b }, b;
    }function da() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 49,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (b = mk, a.substr(mk, 5).toLowerCase() === Ke ? (c = a.substr(mk, 5), mk += 5) : (c = qb, 0 === sk && i(Le)), c !== qb ? (d = r(), d !== qb ? (e = Ka(), e !== qb ? (nk = b, c = Me(e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[f] = { nextPos: mk, result: b }, b);
    }function ea() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 50,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (b = mk, a.substr(mk, 6).toLowerCase() === Ne ? (c = a.substr(mk, 6), mk += 6) : (c = qb, 0 === sk && i(Oe)), c !== qb ? (d = r(), d !== qb ? (e = Ka(), e !== qb ? (nk = b, c = Pe(e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[f] = { nextPos: mk, result: b }, b);
    }function fa() {
      var b,
          c,
          d = 113 * mk + 51,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (b = mk, a.substr(mk, 3).toLowerCase() === Yc ? (c = a.substr(mk, 3), mk += 3) : (c = qb, 0 === sk && i(Yd)), c !== qb && (nk = b, c = Qe()), b = c, b === qb && (b = mk, c = w(), c !== qb && (nk = b, c = Re(c)), b = c), tk[d] = { nextPos: mk, result: b }, b);
    }function ga() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k = 113 * mk + 52,
          l = tk[k];return l ? (mk = l.nextPos, l.result) : (b = mk, a.substr(mk, 5).toLowerCase() === Se ? (c = a.substr(mk, 5), mk += 5) : (c = qb, 0 === sk && i(Te)), c !== qb ? (d = r(), d !== qb ? (e = w(), e !== qb ? (f = s(), f !== qb ? (44 === a.charCodeAt(mk) ? (g = ld, mk++) : (g = qb, 0 === sk && i(md)), g !== qb ? (h = s(), h !== qb ? (j = fa(), j !== qb ? (nk = b, c = Ue(e, j), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, a.substr(mk, 5).toLowerCase() === Se ? (c = a.substr(mk, 5), mk += 5) : (c = qb, 0 === sk && i(Te)), c !== qb ? (d = r(), d !== qb ? (e = fa(), e !== qb ? (f = r(), f !== qb ? (a.substr(mk, 6).toLowerCase() === Ve ? (g = a.substr(mk, 6), mk += 6) : (g = qb, 0 === sk && i(We)), g !== qb ? (h = r(), h !== qb ? (j = w(), j !== qb ? (nk = b, c = Xe(e, j), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, a.substr(mk, 5).toLowerCase() === Se ? (c = a.substr(mk, 5), mk += 5) : (c = qb, 0 === sk && i(Te)), c !== qb ? (d = r(), d !== qb ? (e = fa(), e !== qb ? (nk = b, c = Ye(e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub))), tk[k] = { nextPos: mk, result: b }, b);
    }function ha() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 113 * mk + 53,
          k = tk[j];return k ? (mk = k.nextPos, k.result) : (b = mk, a.substr(mk, 6).toLowerCase() === Ve ? (c = a.substr(mk, 6), mk += 6) : (c = qb, 0 === sk && i(We)), c !== qb ? (d = r(), d !== qb ? (e = w(), e !== qb ? (f = mk, g = r(), g !== qb ? (a.substr(mk, 4).toLowerCase() === Ze ? (h = a.substr(mk, 4), mk += 4) : (h = qb, 0 === sk && i($e)), h === qb && (a.substr(mk, 3).toLowerCase() === _e ? (h = a.substr(mk, 3), mk += 3) : (h = qb, 0 === sk && i(af))), h !== qb ? (g = [g, h], f = g) : (mk = f, f = ub)) : (mk = f, f = ub), f === qb && (f = cc), f !== qb ? (nk = b, c = bf(e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[j] = { nextPos: mk, result: b }, b);
    }function ia() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m = 113 * mk + 54,
          n = tk[m];return n ? (mk = n.nextPos, n.result) : (b = mk, a.substr(mk, 5).toLowerCase() === cf ? (c = a.substr(mk, 5), mk += 5) : (c = qb, 0 === sk && i(df)), c !== qb ? (d = r(), d !== qb ? (a.substr(mk, 5).toLowerCase() === ef ? (e = a.substr(mk, 5), mk += 5) : (e = qb, 0 === sk && i(ff)), e === qb && (a.substr(mk, 4).toLowerCase() === gf ? (e = a.substr(mk, 4), mk += 4) : (e = qb, 0 === sk && i(hf))), e !== qb ? (f = r(), f !== qb ? (g = w(), g !== qb ? (h = r(), h !== qb ? (a.substr(mk, 4).toLowerCase() === Ze ? (j = a.substr(mk, 4), mk += 4) : (j = qb, 0 === sk && i($e)), j === qb && (a.substr(mk, 3).toLowerCase() === _e ? (j = a.substr(mk, 3), mk += 3) : (j = qb, 0 === sk && i(af))), j !== qb ? (k = r(), k !== qb ? (a.substr(mk, 4).toLowerCase() === jf ? (l = a.substr(mk, 4), mk += 4) : (l = qb, 0 === sk && i(kf)), l !== qb ? (nk = b, c = lf(g), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[m] = { nextPos: mk, result: b }, b);
    }function ja() {
      var a,
          b,
          c,
          d,
          e,
          f = 113 * mk + 55,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (a = mk, b = mk, c = ha(), c !== qb ? (d = r(), d !== qb ? (e = ia(), e !== qb ? (nk = b, c = mf(c, e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, c = ha(), c !== qb && (nk = b, c = nf(c)), b = c, b === qb && (b = mk, c = ia(), c !== qb && (nk = b, c = of(c)), b = c)), b !== qb && (nk = a, b = pf(b)), a = b, tk[f] = { nextPos: mk, result: a }, a);
    }function ka() {
      var a,
          b = 113 * mk + 57,
          c = tk[b];return c ? (mk = c.nextPos, c.result) : (a = ma(), a === qb && (a = na(), a === qb && (a = oa(), a === qb && (a = qa(), a === qb && (a = pa(), a === qb && (a = ra()))))), tk[b] = { nextPos: mk, result: a }, a);
    }function la() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 58,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (b = mk, a.substr(mk, 2).toLowerCase() === qf ? (c = a.substr(mk, 2), mk += 2) : (c = qb, 0 === sk && i(rf)), c !== qb ? (d = r(), d !== qb ? (a.substr(mk, 3).toLowerCase() === sf ? (e = a.substr(mk, 3), mk += 3) : (e = qb, 0 === sk && i(tf)), e !== qb ? (nk = b, c = uf(), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, a.substr(mk, 2).toLowerCase() === qf ? (c = a.substr(mk, 2), mk += 2) : (c = qb, 0 === sk && i(rf)), c !== qb && (nk = b, c = vf()), b = c), tk[f] = { nextPos: mk, result: b }, b);
    }function ma() {
      var b,
          c = 113 * mk + 59,
          d = tk[c];return d ? (mk = d.nextPos, d.result) : (61 === a.charCodeAt(mk) ? (b = wf, mk++) : (b = qb, 0 === sk && i(xf)), tk[c] = { nextPos: mk, result: b }, b);
    }function na() {
      var b,
          c,
          d = 113 * mk + 60,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (b = mk, a.substr(mk, 2) === yf ? (c = yf, mk += 2) : (c = qb, 0 === sk && i(zf)), c === qb && (a.substr(mk, 2) === Af ? (c = Af, mk += 2) : (c = qb, 0 === sk && i(Bf))), c !== qb && (nk = b, c = uf()), b = c, tk[d] = { nextPos: mk, result: b }, b);
    }function oa() {
      var b,
          c,
          d = 113 * mk + 61,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (b = mk, a.substr(mk, 2) === Cf ? (c = Cf, mk += 2) : (c = qb, 0 === sk && i(Df)), c !== qb && (nk = b, c = Ef()), b = c, tk[d] = { nextPos: mk, result: b }, b);
    }function pa() {
      var b,
          c = 113 * mk + 62,
          d = tk[c];return d ? (mk = d.nextPos, d.result) : (62 === a.charCodeAt(mk) ? (b = Ff, mk++) : (b = qb, 0 === sk && i(Gf)), tk[c] = { nextPos: mk, result: b }, b);
    }function qa() {
      var b,
          c,
          d = 113 * mk + 63,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (b = mk, a.substr(mk, 2) === Hf ? (c = Hf, mk += 2) : (c = qb, 0 === sk && i(If)), c !== qb && (nk = b, c = Jf()), b = c, tk[d] = { nextPos: mk, result: b }, b);
    }function ra() {
      var b,
          c = 113 * mk + 64,
          d = tk[c];return d ? (mk = d.nextPos, d.result) : (60 === a.charCodeAt(mk) ? (b = Kf, mk++) : (b = qb, 0 === sk && i(Lf)), tk[c] = { nextPos: mk, result: b }, b);
    }function sa() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 65,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (sk++, b = mk, c = r(), c !== qb ? (a.substr(mk, 3).toLowerCase() === Nf ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(Of)), d !== qb ? (e = r(), e !== qb ? (nk = b, c = Pf(), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), sk--, b === qb && (c = qb, 0 === sk && i(Mf)), tk[f] = { nextPos: mk, result: b }, b);
    }function ta() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 66,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (sk++, b = mk, c = r(), c !== qb ? (a.substr(mk, 3).toLowerCase() === Rf ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(Sf)), d !== qb ? (e = r(), e !== qb ? (c = [c, d, e], b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), sk--, b === qb && (c = qb, 0 === sk && i(Qf)), tk[f] = { nextPos: mk, result: b }, b);
    }function ua() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 67,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (sk++, b = mk, c = r(), c !== qb ? (a.substr(mk, 2).toLowerCase() === Uf ? (d = a.substr(mk, 2), mk += 2) : (d = qb, 0 === sk && i(Vf)), d !== qb ? (e = r(), e !== qb ? (nk = b, c = Wf(), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), sk--, b === qb && (c = qb, 0 === sk && i(Tf)), tk[f] = { nextPos: mk, result: b }, b);
    }function va() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 68,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (sk++, b = mk, c = s(), c !== qb ? (33 === a.charCodeAt(mk) ? (d = Yf, mk++) : (d = qb, 0 === sk && i(Zf)), d !== qb ? (e = s(), e !== qb ? (nk = b, c = $f(), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), sk--, b === qb && (c = qb, 0 === sk && i(Xf)), tk[f] = { nextPos: mk, result: b }, b);
    }function wa() {
      var b,
          c,
          d,
          e,
          f,
          g = 113 * mk + 70,
          h = tk[g];if (h) return mk = h.nextPos, h.result;if ((b = mk, c = u(), c !== qb ? (d = o(), d !== qb ? (e = u(), e !== qb ? (59 === a.charCodeAt(mk) ? (f = yd, mk++) : (f = qb, 0 === sk && i(zd)), f === qb && (f = cc), f !== qb ? (nk = b, c = bg(), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb)) if ((b = mk, 35 === a.charCodeAt(mk) ? (c = cg, mk++) : (c = qb, 0 === sk && i(dg)), c !== qb)) if ((d = u(), d !== qb)) {
        for (e = [], eg.test(a.charAt(mk)) ? (f = a.charAt(mk), mk++) : (f = qb, 0 === sk && i(fg)); f !== qb;) e.push(f), eg.test(a.charAt(mk)) ? (f = a.charAt(mk), mk++) : (f = qb, 0 === sk && i(fg));e !== qb ? (10 === a.charCodeAt(mk) ? (f = zb, mk++) : (f = qb, 0 === sk && i(Ab)), f !== qb ? (nk = b, c = bg(), b = c) : (mk = b, b = ub)) : (mk = b, b = ub);
      } else mk = b, b = ub;else mk = b, b = ub;return tk[g] = { nextPos: mk, result: b }, b;
    }function xa() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 71,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (b = mk, 96 === a.charCodeAt(mk) ? (c = gg, mk++) : (c = qb, 0 === sk && i(hg)), c !== qb ? (d = A(), d !== qb ? (96 === a.charCodeAt(mk) ? (e = gg, mk++) : (e = qb, 0 === sk && i(hg)), e !== qb ? (nk = b, c = bc(d), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, c = A(), c !== qb && (nk = b, c = bc(c)), b = c), tk[f] = { nextPos: mk, result: b }, b);
    }function ya() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m = 113 * mk + 72,
          n = tk[m];return n ? (mk = n.nextPos, n.result) : (b = mk, a.substr(mk, 4).toLowerCase() === ig ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(jg)), c !== qb ? (d = t(), d !== qb ? (a.substr(mk, 5).toLowerCase() === kg ? (e = a.substr(mk, 5), mk += 5) : (e = qb, 0 === sk && i(lg)), e !== qb ? (f = t(), f !== qb ? (g = mk, a.substr(mk, 2).toLowerCase() === mg ? (h = a.substr(mk, 2), mk += 2) : (h = qb, 0 === sk && i(ng)), h !== qb ? (j = t(), j !== qb ? (a.substr(mk, 6).toLowerCase() === _f ? (k = a.substr(mk, 6), mk += 6) : (k = qb, 0 === sk && i(ag)), k !== qb ? (l = t(), l !== qb ? (h = [h, j, k, l], g = h) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub), g === qb && (g = cc), g !== qb ? (h = xa(), h !== qb ? (j = u(), j !== qb ? (59 === a.charCodeAt(mk) ? (k = yd, mk++) : (k = qb, 0 === sk && i(zd)), k !== qb ? (nk = b, c = og(), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[m] = { nextPos: mk, result: b }, b);
    }function za() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m = 113 * mk + 73,
          n = tk[m];if (n) return mk = n.nextPos, n.result;if ((b = mk, a.substr(mk, 4).toLowerCase() === pg ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(qg)), c !== qb)) if ((d = t(), d !== qb)) if ((a.substr(mk, 6).toLowerCase() === rg ? (e = a.substr(mk, 6), mk += 6) : (e = qb, 0 === sk && i(sg)), e !== qb)) if ((f = t(), f !== qb)) if ((g = xa(), g !== qb)) if ((h = t(), h !== qb)) {
        if ((j = [], uc.test(a.charAt(mk)) ? (k = a.charAt(mk), mk++) : (k = qb, 0 === sk && i(vc)), k !== qb)) for (; k !== qb;) j.push(k), uc.test(a.charAt(mk)) ? (k = a.charAt(mk), mk++) : (k = qb, 0 === sk && i(vc));else j = ub;j !== qb ? (k = u(), k !== qb ? (59 === a.charCodeAt(mk) ? (l = yd, mk++) : (l = qb, 0 === sk && i(zd)), l !== qb ? (nk = b, c = tg(), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub);
      } else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;return tk[m] = { nextPos: mk, result: b }, b;
    }function Aa() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 113 * mk + 74,
          j = tk[h];return j ? (mk = j.nextPos, j.result) : (b = mk, a.substr(mk, 6).toLowerCase() === ug ? (c = a.substr(mk, 6), mk += 6) : (c = qb, 0 === sk && i(vg)), c !== qb ? (d = t(), d !== qb ? (a.substr(mk, 6).toLowerCase() === rg ? (e = a.substr(mk, 6), mk += 6) : (e = qb, 0 === sk && i(sg)), e !== qb ? (f = u(), f !== qb ? (59 === a.charCodeAt(mk) ? (g = yd, mk++) : (g = qb, 0 === sk && i(zd)), g !== qb ? (nk = b, c = wg(), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[h] = { nextPos: mk, result: b }, b);
    }function Ba() {
      var a,
          b,
          c,
          d,
          e,
          f,
          g = 113 * mk + 75,
          h = tk[g];if (h) return mk = h.nextPos, h.result;if ((a = mk, b = u(), b !== qb)) {
        if ((c = [], d = mk, e = za(), e === qb && (e = Aa(), e === qb && (e = wa(), e === qb && (e = ya(), e === qb && (e = Ga(), e === qb && (e = Ja()))))), e !== qb ? (f = u(), f !== qb ? (e = [e, f], d = e) : (mk = d, d = ub)) : (mk = d, d = ub), d !== qb)) for (; d !== qb;) c.push(d), d = mk, e = za(), e === qb && (e = Aa(), e === qb && (e = wa(), e === qb && (e = ya(), e === qb && (e = Ga(), e === qb && (e = Ja()))))), e !== qb ? (f = u(), f !== qb ? (e = [e, f], d = e) : (mk = d, d = ub)) : (mk = d, d = ub);else c = ub;c !== qb ? (d = u(), d !== qb ? (nk = a, b = xg(c), a = b) : (mk = a, a = ub)) : (mk = a, a = ub);
      } else mk = a, a = ub;return tk[g] = { nextPos: mk, result: a }, a;
    }function Ca() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n,
          o = 113 * mk + 76,
          p = tk[o];if (p) return mk = p.nextPos, p.result;if ((b = mk, a.substr(mk, 7).toLowerCase() === yg ? (c = a.substr(mk, 7), mk += 7) : (c = qb, 0 === sk && i(zg)), c !== qb)) {
        if ((d = mk, 40 === a.charCodeAt(mk) ? (e = Wc, mk++) : (e = qb, 0 === sk && i(Xc)), e !== qb)) if ((f = u(), f !== qb)) {
          if ((g = [], fc.test(a.charAt(mk)) ? (h = a.charAt(mk), mk++) : (h = qb, 0 === sk && i(gc)), h !== qb)) for (; h !== qb;) g.push(h), fc.test(a.charAt(mk)) ? (h = a.charAt(mk), mk++) : (h = qb, 0 === sk && i(gc));else g = ub;if (g !== qb) if ((h = u(), h !== qb)) if ((44 === a.charCodeAt(mk) ? (j = ld, mk++) : (j = qb, 0 === sk && i(md)), j !== qb)) if ((k = u(), k !== qb)) {
            if ((l = [], fc.test(a.charAt(mk)) ? (m = a.charAt(mk), mk++) : (m = qb, 0 === sk && i(gc)), m !== qb)) for (; m !== qb;) l.push(m), fc.test(a.charAt(mk)) ? (m = a.charAt(mk), mk++) : (m = qb, 0 === sk && i(gc));else l = ub;l !== qb ? (m = u(), m !== qb ? (41 === a.charCodeAt(mk) ? (n = $c, mk++) : (n = qb, 0 === sk && i(_c)), n !== qb ? (e = [e, f, g, h, j, k, l, m, n], d = e) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub);
          } else mk = d, d = ub;else mk = d, d = ub;else mk = d, d = ub;else mk = d, d = ub;
        } else mk = d, d = ub;else mk = d, d = ub;d === qb && (d = cc), d !== qb ? (nk = b, c = Ag(), b = c) : (mk = b, b = ub);
      } else mk = b, b = ub;if (b === qb) {
        if ((b = mk, a.substr(mk, 7).toLowerCase() === Bg ? (c = a.substr(mk, 7), mk += 7) : (c = qb, 0 === sk && i(Cg)), c === qb && (a.substr(mk, 8).toLowerCase() === Dg ? (c = a.substr(mk, 8), mk += 8) : (c = qb, 0 === sk && i(Eg)), c === qb && (a.substr(mk, 9).toLowerCase() === Fg ? (c = a.substr(mk, 9), mk += 9) : (c = qb, 0 === sk && i(Gg)), c === qb && (a.substr(mk, 6).toLowerCase() === Hg ? (c = a.substr(mk, 6), mk += 6) : (c = qb, 0 === sk && i(Ig)), c === qb && (a.substr(mk, 7).toLowerCase() === Jg ? (c = a.substr(mk, 7), mk += 7) : (c = qb, 0 === sk && i(Kg)), c === qb && (a.substr(mk, 3).toLowerCase() === Lg ? (c = a.substr(mk, 3), mk += 3) : (c = qb, 0 === sk && i(Mg)), c === qb && (a.substr(mk, 7).toLowerCase() === yg ? (c = a.substr(mk, 7), mk += 7) : (c = qb, 0 === sk && i(zg)))))))), c !== qb)) {
          if ((d = mk, 40 === a.charCodeAt(mk) ? (e = Wc, mk++) : (e = qb, 0 === sk && i(Xc)), e !== qb)) if ((f = u(), f !== qb)) {
            if ((g = [], fc.test(a.charAt(mk)) ? (h = a.charAt(mk), mk++) : (h = qb, 0 === sk && i(gc)), h !== qb)) for (; h !== qb;) g.push(h), fc.test(a.charAt(mk)) ? (h = a.charAt(mk), mk++) : (h = qb, 0 === sk && i(gc));else g = ub;g !== qb ? (h = u(), h !== qb ? (41 === a.charCodeAt(mk) ? (j = $c, mk++) : (j = qb, 0 === sk && i(_c)), j !== qb ? (e = [e, f, g, h, j], d = e) : (mk = d, d = ub)) : (mk = d, d = ub)) : (mk = d, d = ub);
          } else mk = d, d = ub;else mk = d, d = ub;d === qb && (d = cc), d !== qb ? (nk = b, c = Ag(), b = c) : (mk = b, b = ub);
        } else mk = b, b = ub;if (b === qb) {
          if ((b = mk, a.substr(mk, 5).toLowerCase() === Ng ? (c = a.substr(mk, 5), mk += 5) : (c = qb, 0 === sk && i(Og)), c === qb && (a.substr(mk, 6).toLowerCase() === Pg ? (c = a.substr(mk, 6), mk += 6) : (c = qb, 0 === sk && i(Qg)), c === qb && (a.substr(mk, 7).toLowerCase() === yg ? (c = a.substr(mk, 7), mk += 7) : (c = qb, 0 === sk && i(zg)))), c !== qb)) {
            if ((d = mk, 40 === a.charCodeAt(mk) ? (e = Wc, mk++) : (e = qb, 0 === sk && i(Xc)), e !== qb)) {
              if ((f = [], fc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(gc)), g !== qb)) for (; g !== qb;) f.push(g), fc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(gc));else f = ub;if (f !== qb) if ((g = s(), g !== qb)) if ((44 === a.charCodeAt(mk) ? (h = ld, mk++) : (h = qb, 0 === sk && i(md)), h !== qb)) if ((j = s(), j !== qb)) {
                if ((k = [], fc.test(a.charAt(mk)) ? (l = a.charAt(mk), mk++) : (l = qb, 0 === sk && i(gc)), l !== qb)) for (; l !== qb;) k.push(l), fc.test(a.charAt(mk)) ? (l = a.charAt(mk), mk++) : (l = qb, 0 === sk && i(gc));else k = ub;k !== qb ? (41 === a.charCodeAt(mk) ? (l = $c, mk++) : (l = qb, 0 === sk && i(_c)), l !== qb ? (e = [e, f, g, h, j, k, l], d = e) : (mk = d, d = ub)) : (mk = d, d = ub);
              } else mk = d, d = ub;else mk = d, d = ub;else mk = d, d = ub;else mk = d, d = ub;
            } else mk = d, d = ub;d === qb && (d = cc), d !== qb ? (nk = b, c = Ag(), b = c) : (mk = b, b = ub);
          } else mk = b, b = ub;if (b === qb) {
            if ((b = mk, a.substr(mk, 7).toLowerCase() === Rg ? (c = a.substr(mk, 7), mk += 7) : (c = qb, 0 === sk && i(Sg)), c === qb && (a.substr(mk, 4).toLowerCase() === Tg ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(Ug)), c === qb && (a.substr(mk, 4).toLowerCase() === Vg ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(Wg)))), c !== qb)) {
              if ((d = mk, 40 === a.charCodeAt(mk) ? (e = Wc, mk++) : (e = qb, 0 === sk && i(Xc)), e !== qb)) {
                if ((f = [], fc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(gc)), g !== qb)) for (; g !== qb;) f.push(g), fc.test(a.charAt(mk)) ? (g = a.charAt(mk), mk++) : (g = qb, 0 === sk && i(gc));else f = ub;f !== qb ? (41 === a.charCodeAt(mk) ? (g = $c, mk++) : (g = qb, 0 === sk && i(_c)), g !== qb ? (e = [e, f, g], d = e) : (mk = d, d = ub)) : (mk = d, d = ub);
              } else mk = d, d = ub;d === qb && (d = cc), d !== qb ? (nk = b, c = Xg(), b = c) : (mk = b, b = ub);
            } else mk = b, b = ub;b === qb && (a.substr(mk, 8).toLowerCase() === Yg ? (b = a.substr(mk, 8), mk += 8) : (b = qb, 0 === sk && i(Zg)), b === qb && (b = mk, a.substr(mk, 4).toLowerCase() === yc ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(zc)), c !== qb && (nk = b, c = $g()), b = c));
          }
        }
      }return tk[o] = { nextPos: mk, result: b }, b;
    }function Da() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m = 113 * mk + 77,
          n = tk[m];if (n) return mk = n.nextPos, n.result;if ((b = mk, c = [], _g.test(a.charAt(mk)) ? (d = a.charAt(mk), mk++) : (d = qb, 0 === sk && i(ah)), d !== qb)) for (; d !== qb;) c.push(d), _g.test(a.charAt(mk)) ? (d = a.charAt(mk), mk++) : (d = qb, 0 === sk && i(ah));else c = ub;if ((c !== qb && (nk = b, c = Ie()), b = c, b === qb)) {
        if ((b = mk, 40 === a.charCodeAt(mk) ? (c = Wc, mk++) : (c = qb, 0 === sk && i(Xc)), c !== qb)) if ((d = u(), d !== qb)) if ((e = xa(), e !== qb)) if ((f = u(), f !== qb)) {
          for (g = [], h = mk, 44 === a.charCodeAt(mk) ? (j = ld, mk++) : (j = qb, 0 === sk && i(md)), j !== qb ? (k = u(), k !== qb ? (l = xa(), l !== qb ? (j = [j, k, l], h = j) : (mk = h, h = ub)) : (mk = h, h = ub)) : (mk = h, h = ub); h !== qb;) g.push(h), h = mk, 44 === a.charCodeAt(mk) ? (j = ld, mk++) : (j = qb, 0 === sk && i(md)), j !== qb ? (k = u(), k !== qb ? (l = xa(), l !== qb ? (j = [j, k, l], h = j) : (mk = h, h = ub)) : (mk = h, h = ub)) : (mk = h, h = ub);g !== qb ? (h = u(), h !== qb ? (41 === a.charCodeAt(mk) ? (j = $c, mk++) : (j = qb, 0 === sk && i(_c)), j !== qb ? (nk = b, c = Ie(), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub);
        } else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;b === qb && (b = mk, c = xa(), c !== qb && (nk = b, c = Ie()), b = c);
      }return tk[m] = { nextPos: mk, result: b }, b;
    }function Ea() {
      var a,
          b,
          c,
          d,
          e,
          f,
          g,
          h,
          i = 113 * mk + 78,
          j = tk[i];if (j) return mk = j.nextPos, j.result;if ((a = mk, b = xa(), b !== qb)) if ((c = t(), c !== qb)) if ((d = Ca(), d !== qb)) {
        for (e = [], f = mk, g = t(), g !== qb ? (h = Da(), h !== qb ? (g = [g, h], f = g) : (mk = f, f = ub)) : (mk = f, f = ub); f !== qb;) e.push(f), f = mk, g = t(), g !== qb ? (h = Da(), h !== qb ? (g = [g, h], f = g) : (mk = f, f = ub)) : (mk = f, f = ub);e !== qb ? (nk = a, b = bh(b, d), a = b) : (mk = a, a = ub);
      } else mk = a, a = ub;else mk = a, a = ub;else mk = a, a = ub;return tk[i] = { nextPos: mk, result: a }, a;
    }function Fa() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n,
          o,
          p = 113 * mk + 79,
          q = tk[p];if (q) return mk = q.nextPos, q.result;if ((b = mk, 40 === a.charCodeAt(mk) ? (c = Wc, mk++) : (c = qb, 0 === sk && i(Xc)), c !== qb)) if ((d = u(), d !== qb)) {
        if ((e = Ea(), e === qb)) if ((e = [], f = mk, g = u(), g !== qb ? (h = Da(), h !== qb ? (g = [g, h], f = g) : (mk = f, f = ub)) : (mk = f, f = ub), f !== qb)) for (; f !== qb;) e.push(f), f = mk, g = u(), g !== qb ? (h = Da(), h !== qb ? (g = [g, h], f = g) : (mk = f, f = ub)) : (mk = f, f = ub);else e = ub;if (e !== qb) {
          if ((f = [], g = mk, h = u(), h !== qb)) if ((44 === a.charCodeAt(mk) ? (j = ld, mk++) : (j = qb, 0 === sk && i(md)), j !== qb)) if ((k = u(), k !== qb)) {
            if ((l = Ea(), l === qb)) if ((l = [], m = mk, n = u(), n !== qb ? (o = Da(), o !== qb ? (n = [n, o], m = n) : (mk = m, m = ub)) : (mk = m, m = ub), m !== qb)) for (; m !== qb;) l.push(m), m = mk, n = u(), n !== qb ? (o = Da(), o !== qb ? (n = [n, o], m = n) : (mk = m, m = ub)) : (mk = m, m = ub);else l = ub;l !== qb ? (h = [h, j, k, l], g = h) : (mk = g, g = ub);
          } else mk = g, g = ub;else mk = g, g = ub;else mk = g, g = ub;for (; g !== qb;) if ((f.push(g), g = mk, h = u(), h !== qb)) if ((44 === a.charCodeAt(mk) ? (j = ld, mk++) : (j = qb, 0 === sk && i(md)), j !== qb)) if ((k = u(), k !== qb)) {
            if ((l = Ea(), l === qb)) if ((l = [], m = mk, n = u(), n !== qb ? (o = Da(), o !== qb ? (n = [n, o], m = n) : (mk = m, m = ub)) : (mk = m, m = ub), m !== qb)) for (; m !== qb;) l.push(m), m = mk, n = u(), n !== qb ? (o = Da(), o !== qb ? (n = [n, o], m = n) : (mk = m, m = ub)) : (mk = m, m = ub);else l = ub;l !== qb ? (h = [h, j, k, l], g = h) : (mk = g, g = ub);
          } else mk = g, g = ub;else mk = g, g = ub;else mk = g, g = ub;f !== qb ? (g = u(), g !== qb ? (41 === a.charCodeAt(mk) ? (h = $c, mk++) : (h = qb, 0 === sk && i(_c)), h !== qb ? (nk = b, c = ch(e, f), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub);
        } else mk = b, b = ub;
      } else mk = b, b = ub;else mk = b, b = ub;return tk[p] = { nextPos: mk, result: b }, b;
    }function Ga() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q = 113 * mk + 80,
          s = tk[q];if (s) return mk = s.nextPos, s.result;if ((b = mk, a.substr(mk, 6).toLowerCase() === dh ? (c = a.substr(mk, 6), mk += 6) : (c = qb, 0 === sk && i(eh)), c !== qb)) if ((d = r(), d !== qb)) if ((a.substr(mk, 5).toLowerCase() === kg ? (e = a.substr(mk, 5), mk += 5) : (e = qb, 0 === sk && i(lg)), e !== qb)) if ((f = r(), f !== qb)) if ((g = mk, a.substr(mk, 2).toLowerCase() === mg ? (h = a.substr(mk, 2), mk += 2) : (h = qb, 0 === sk && i(ng)), h !== qb ? (j = r(), j !== qb ? (a.substr(mk, 3).toLowerCase() === sf ? (k = a.substr(mk, 3), mk += 3) : (k = qb, 0 === sk && i(tf)), k !== qb ? (l = r(), l !== qb ? (a.substr(mk, 6) === _f ? (m = _f, mk += 6) : (m = qb, 0 === sk && i(ag)), m !== qb ? (n = r(), n !== qb ? (h = [h, j, k, l, m, n], g = h) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub), g === qb && (g = cc), g !== qb)) if ((h = xa(), h !== qb)) if ((j = u(), j !== qb)) if ((k = Fa(), k !== qb)) if ((l = u(), l !== qb)) {
        for (m = [], n = mk, o = u(), o !== qb ? (p = Da(), p !== qb ? (o = [o, p], n = o) : (mk = n, n = ub)) : (mk = n, n = ub); n !== qb;) m.push(n), n = mk, o = u(), o !== qb ? (p = Da(), p !== qb ? (o = [o, p], n = o) : (mk = n, n = ub)) : (mk = n, n = ub);m !== qb ? (59 === a.charCodeAt(mk) ? (n = yd, mk++) : (n = qb, 0 === sk && i(zd)), n !== qb ? (nk = b, c = fh(h, k), b = c) : (mk = b, b = ub)) : (mk = b, b = ub);
      } else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;return tk[q] = { nextPos: mk, result: b }, b;
    }function Ha() {
      var b,
          c,
          d = 113 * mk + 81,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (b = mk, a.substr(mk, 4).toLowerCase() === gh ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(hh)), c !== qb && (nk = b, c = Ie()), b = c, tk[d] = { nextPos: mk, result: b }, b);
    }function Ia() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m = 113 * mk + 82,
          n = tk[m];if (n) return mk = n.nextPos, n.result;if ((b = mk, 40 === a.charCodeAt(mk) ? (c = Wc, mk++) : (c = qb, 0 === sk && i(Xc)), c !== qb)) if ((d = s(), d !== qb)) if ((e = y(), e === qb && (e = v(), e === qb && (e = C(), e === qb && (e = Ha()))), e !== qb)) {
        for (f = [], g = mk, h = s(), h !== qb ? (44 === a.charCodeAt(mk) ? (j = ld, mk++) : (j = qb, 0 === sk && i(md)), j !== qb ? (k = s(), k !== qb ? (l = y(), l === qb && (l = v(), l === qb && (l = C(), l === qb && (l = Ha()))), l !== qb ? (h = [h, j, k, l], g = h) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub); g !== qb;) f.push(g), g = mk, h = s(), h !== qb ? (44 === a.charCodeAt(mk) ? (j = ld, mk++) : (j = qb, 0 === sk && i(md)), j !== qb ? (k = s(), k !== qb ? (l = y(), l === qb && (l = v(), l === qb && (l = C(), l === qb && (l = Ha()))), l !== qb ? (h = [h, j, k, l], g = h) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub)) : (mk = g, g = ub);f !== qb ? (g = s(), g !== qb ? (41 === a.charCodeAt(mk) ? (h = $c, mk++) : (h = qb, 0 === sk && i(_c)), h !== qb ? (nk = b, c = ih(e, f), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub);
      } else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;return tk[m] = { nextPos: mk, result: b }, b;
    }function Ja() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          t,
          u,
          v,
          w = 113 * mk + 83,
          x = tk[w];if (x) return mk = x.nextPos, x.result;if ((b = mk, a.substr(mk, 6).toLowerCase() === jh ? (c = a.substr(mk, 6), mk += 6) : (c = qb, 0 === sk && i(kh)), c !== qb)) if ((d = r(), d !== qb)) if ((a.substr(mk, 4).toLowerCase() === lh ? (e = a.substr(mk, 4), mk += 4) : (e = qb, 0 === sk && i(mh)), e !== qb)) if ((f = r(), f !== qb)) if ((g = xa(), g !== qb)) if ((h = r(), h !== qb)) {
        if ((j = mk, k = s(), k !== qb)) if ((40 === a.charCodeAt(mk) ? (l = Wc, mk++) : (l = qb, 0 === sk && i(Xc)), l !== qb)) if ((m = s(), m !== qb)) if ((n = xa(), n !== qb)) {
          if ((o = [], p = mk, q = s(), q !== qb ? (44 === a.charCodeAt(mk) ? (t = ld, mk++) : (t = qb, 0 === sk && i(md)), t !== qb ? (u = s(), u !== qb ? (v = xa(), v !== qb ? (q = [q, t, u, v], p = q) : (mk = p, p = ub)) : (mk = p, p = ub)) : (mk = p, p = ub)) : (mk = p, p = ub), p !== qb)) for (; p !== qb;) o.push(p), p = mk, q = s(), q !== qb ? (44 === a.charCodeAt(mk) ? (t = ld, mk++) : (t = qb, 0 === sk && i(md)), t !== qb ? (u = s(), u !== qb ? (v = xa(), v !== qb ? (q = [q, t, u, v], p = q) : (mk = p, p = ub)) : (mk = p, p = ub)) : (mk = p, p = ub)) : (mk = p, p = ub);else o = ub;o !== qb ? (41 === a.charCodeAt(mk) ? (p = $c, mk++) : (p = qb, 0 === sk && i(_c)), p !== qb ? (q = r(), q !== qb ? (k = [k, l, m, n, o, p, q], j = k) : (mk = j, j = ub)) : (mk = j, j = ub)) : (mk = j, j = ub);
        } else mk = j, j = ub;else mk = j, j = ub;else mk = j, j = ub;else mk = j, j = ub;if ((j === qb && (j = cc), j !== qb)) if ((a.substr(mk, 6).toLowerCase() === nh ? (k = a.substr(mk, 6), mk += 6) : (k = qb, 0 === sk && i(oh)), k !== qb)) if ((l = s(), l !== qb)) if ((m = Ia(), m !== qb)) {
          for (n = [], o = mk, p = s(), p !== qb ? (44 === a.charCodeAt(mk) ? (q = ld, mk++) : (q = qb, 0 === sk && i(md)), q !== qb ? (t = s(), t !== qb ? (u = Ia(), u !== qb ? (p = [p, q, t, u], o = p) : (mk = o, o = ub)) : (mk = o, o = ub)) : (mk = o, o = ub)) : (mk = o, o = ub); o !== qb;) n.push(o), o = mk, p = s(), p !== qb ? (44 === a.charCodeAt(mk) ? (q = ld, mk++) : (q = qb, 0 === sk && i(md)), q !== qb ? (t = s(), t !== qb ? (u = Ia(), u !== qb ? (p = [p, q, t, u], o = p) : (mk = o, o = ub)) : (mk = o, o = ub)) : (mk = o, o = ub)) : (mk = o, o = ub);n !== qb ? (o = s(), o !== qb ? (59 === a.charCodeAt(mk) ? (p = yd, mk++) : (p = qb, 0 === sk && i(zd)), p !== qb ? (nk = b, c = ph(g, j, m, n), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub);
        } else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;
      } else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;return tk[w] = { nextPos: mk, result: b }, b;
    }function Ka() {
      var a,
          b,
          c = 113 * mk + 84,
          d = tk[c];return d ? (mk = d.nextPos, d.result) : (sk++, a = ab(), sk--, a === qb && (b = qb, 0 === sk && i(qh)), tk[c] = { nextPos: mk, result: a }, a);
    }function La() {
      var a,
          b,
          c,
          d = 113 * mk + 85,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (a = mk, b = ua(), b !== qb ? (c = bb(), c !== qb ? (nk = a, b = rh(c), a = b) : (mk = a, a = ub)) : (mk = a, a = ub), tk[d] = { nextPos: mk, result: a }, a);
    }function Ma() {
      var b,
          c,
          d,
          e,
          f,
          g = 113 * mk + 86,
          h = tk[g];return h ? (mk = h.nextPos, h.result) : (b = mk, c = s(), c !== qb ? (a.substr(mk, 2) === sh ? (d = sh, mk += 2) : (d = qb, 0 === sk && i(th)), d !== qb ? (e = s(), e !== qb ? (f = bb(), f !== qb ? (nk = b, c = uh(f), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[g] = { nextPos: mk, result: b }, b);
    }function Na() {
      var a,
          b,
          c,
          d = 113 * mk + 87,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (a = mk, b = ta(), b !== qb ? (c = cb(), c !== qb ? (nk = a, b = vh(c), a = b) : (mk = a, a = ub)) : (mk = a, a = ub), tk[d] = { nextPos: mk, result: a }, a);
    }function Oa() {
      var a,
          b,
          c,
          d = 113 * mk + 88,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (a = mk, b = sa(), b !== qb ? (c = db(), c !== qb ? (nk = a, b = wh(c), a = b) : (mk = a, a = ub)) : (mk = a, a = ub), tk[d] = { nextPos: mk, result: a }, a);
    }function Pa() {
      var b,
          c,
          d,
          e,
          f,
          g = 113 * mk + 89,
          h = tk[g];return h ? (mk = h.nextPos, h.result) : (b = mk, c = s(), c !== qb ? (d = la(), d !== qb ? (e = s(), e !== qb ? (f = Za(), f !== qb ? (nk = b, c = xh(d, f), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, c = s(), c !== qb ? (d = ka(), d !== qb ? (e = s(), e !== qb ? (f = fb(), f !== qb ? (nk = b, c = xh(d, f), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), b === qb && (b = mk, c = s(), c !== qb ? (a.substr(mk, 4).toLowerCase() === yh ? (d = a.substr(mk, 4), mk += 4) : (d = qb, 0 === sk && i(zh)), d === qb && (a.substr(mk, 5).toLowerCase() === Ah ? (d = a.substr(mk, 5), mk += 5) : (d = qb, 0 === sk && i(Bh))), d !== qb ? (e = s(), e !== qb ? (f = Ya(), f !== qb ? (nk = b, c = Ch(d, f), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub))), tk[g] = { nextPos: mk, result: b }, b);
    }function Qa() {
      var b,
          c,
          d,
          e,
          f,
          g = 113 * mk + 90,
          h = tk[g];return h ? (mk = h.nextPos, h.result) : (b = mk, c = s(), c !== qb ? (45 === a.charCodeAt(mk) ? (d = dc, mk++) : (d = qb, 0 === sk && i(ec)), d === qb && (43 === a.charCodeAt(mk) ? (d = Dh, mk++) : (d = qb, 0 === sk && i(Eh))), d !== qb ? (e = s(), e !== qb ? (f = gb(), f !== qb ? (nk = b, c = Fh(d, f), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[g] = { nextPos: mk, result: b }, b);
    }function Ra() {
      var b,
          c,
          d,
          e,
          f,
          g = 113 * mk + 91,
          h = tk[g];return h ? (mk = h.nextPos, h.result) : (b = mk, c = s(), c !== qb ? (42 === a.charCodeAt(mk) ? (d = Ic, mk++) : (d = qb, 0 === sk && i(Jc)), d === qb && (47 === a.charCodeAt(mk) ? (d = Gh, mk++) : (d = qb, 0 === sk && i(Hh)), d === qb && (37 === a.charCodeAt(mk) ? (d = Ih, mk++) : (d = qb, 0 === sk && i(Jh)))), d !== qb ? (e = s(), e !== qb ? (f = hb(), f !== qb ? (nk = b, c = Kh(d, f), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[g] = { nextPos: mk, result: b }, b);
    }function Sa() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 92,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (b = mk, c = s(), c !== qb ? (45 === a.charCodeAt(mk) ? (d = dc, mk++) : (d = qb, 0 === sk && i(ec)), d !== qb ? (e = ib(), e !== qb ? (nk = b, c = Lh(e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[f] = { nextPos: mk, result: b }, b);
    }function Ta() {
      var a,
          b,
          c,
          d = 113 * mk + 93,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (a = mk, b = va(), b !== qb ? (c = jb(), c !== qb ? (nk = a, b = Mh(c), a = b) : (mk = a, a = ub)) : (mk = a, a = ub), tk[d] = { nextPos: mk, result: a }, a);
    }function Ua() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n,
          o = 113 * mk + 94,
          p = tk[o];if (p) return mk = p.nextPos, p.result;if ((b = mk, c = mk, a.substr(mk, 8).toLowerCase() === Nh ? (d = a.substr(mk, 8), mk += 8) : (d = qb, 0 === sk && i(Oh)), d !== qb && (nk = c, d = Ph()), c = d, c === qb && (c = mk, a.substr(mk, 6).toLowerCase() === Qh ? (d = a.substr(mk, 6), mk += 6) : (d = qb, 0 === sk && i(Rh)), d !== qb && (nk = c, d = Sh()), c = d), c !== qb)) if ((40 === a.charCodeAt(mk) ? (d = Wc, mk++) : (d = qb, 0 === sk && i(Xc)), d !== qb)) if ((e = s(), e !== qb)) if ((f = ab(), f !== qb)) if ((g = s(), g !== qb)) {
        for (h = [], j = mk, 44 === a.charCodeAt(mk) ? (k = ld, mk++) : (k = qb, 0 === sk && i(md)), k !== qb ? (l = s(), l !== qb ? (m = ab(), m !== qb ? (n = s(), n !== qb ? (k = [k, l, m, n], j = k) : (mk = j, j = ub)) : (mk = j, j = ub)) : (mk = j, j = ub)) : (mk = j, j = ub); j !== qb;) h.push(j), j = mk, 44 === a.charCodeAt(mk) ? (k = ld, mk++) : (k = qb, 0 === sk && i(md)), k !== qb ? (l = s(), l !== qb ? (m = ab(), m !== qb ? (n = s(), n !== qb ? (k = [k, l, m, n], j = k) : (mk = j, j = ub)) : (mk = j, j = ub)) : (mk = j, j = ub)) : (mk = j, j = ub);h !== qb ? (41 === a.charCodeAt(mk) ? (j = $c, mk++) : (j = qb, 0 === sk && i(_c)), j !== qb ? (nk = b, c = Th(c, f, h), b = c) : (mk = b, b = ub)) : (mk = b, b = ub);
      } else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;else mk = b, b = ub;return tk[o] = { nextPos: mk, result: b }, b;
    }function Va() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n = 113 * mk + 95,
          o = tk[n];return o ? (mk = o.nextPos, o.result) : (b = mk, c = mk, a.substr(mk, 7).toLowerCase() === Uh ? (d = a.substr(mk, 7), mk += 7) : (d = qb, 0 === sk && i(Vh)), d !== qb && (nk = c, d = Wh()), c = d, c === qb && (c = mk, a.substr(mk, 7).toLowerCase() === Xh ? (d = a.substr(mk, 7), mk += 7) : (d = qb, 0 === sk && i(Yh)), d !== qb && (nk = c, d = Zh()), c = d, c === qb && (c = mk, a.substr(mk, 3).toLowerCase() === $h ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(_h)), d !== qb && (nk = c, d = ai()), c = d, c === qb && (c = mk, a.substr(mk, 3).toLowerCase() === bi ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(ci)), d !== qb && (nk = c, d = di()), c = d, c === qb && (c = mk, a.substr(mk, 3).toLowerCase() === ei ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(fi)), d !== qb && (nk = c, d = gi()), c = d, c === qb && (c = mk, a.substr(mk, 3).toLowerCase() === hi ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(ii)), d !== qb && (nk = c, d = ji()), c = d, c === qb && (c = mk, a.substr(mk, 3).toLowerCase() === ki ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(li)), d !== qb && (nk = c, d = mi()), c = d)))))), c !== qb ? (40 === a.charCodeAt(mk) ? (d = Wc, mk++) : (d = qb, 0 === sk && i(Xc)), d !== qb ? (e = s(), e !== qb ? (f = ab(), f !== qb ? (g = s(), g !== qb ? (44 === a.charCodeAt(mk) ? (h = ld, mk++) : (h = qb, 0 === sk && i(md)), h !== qb ? (j = s(), j !== qb ? (k = ab(), k !== qb ? (l = s(), l !== qb ? (41 === a.charCodeAt(mk) ? (m = $c, mk++) : (m = qb, 0 === sk && i(_c)), m !== qb ? (nk = b, c = ni(c, f, k), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[n] = { nextPos: mk, result: b }, b);
    }function Wa() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j = 113 * mk + 96,
          k = tk[j];return k ? (mk = k.nextPos, k.result) : (b = mk, c = mk, a.substr(mk, 5).toLowerCase() === oi ? (d = a.substr(mk, 5), mk += 5) : (d = qb, 0 === sk && i(pi)), d !== qb && (nk = c, d = qi()), c = d, c === qb && (c = mk, a.substr(mk, 5).toLowerCase() === ri ? (d = a.substr(mk, 5), mk += 5) : (d = qb, 0 === sk && i(si)), d !== qb && (nk = c, d = qi()), c = d, c === qb && (c = mk, a.substr(mk, 5).toLowerCase() === ti ? (d = a.substr(mk, 5), mk += 5) : (d = qb, 0 === sk && i(ui)), d !== qb && (nk = c, d = vi()), c = d, c === qb && (c = mk, a.substr(mk, 5).toLowerCase() === wi ? (d = a.substr(mk, 5), mk += 5) : (d = qb, 0 === sk && i(xi)), d !== qb && (nk = c, d = vi()), c = d, c === qb && (c = mk, a.substr(mk, 6).toLowerCase() === yi ? (d = a.substr(mk, 6), mk += 6) : (d = qb, 0 === sk && i(zi)), d !== qb && (nk = c, d = Ai()), c = d, c === qb && (c = mk, a.substr(mk, 3).toLowerCase() === Bi ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(Ci)), d !== qb && (nk = c, d = Di()), c = d, c === qb && (c = mk, a.substr(mk, 5).toLowerCase() === Ei ? (d = a.substr(mk, 5), mk += 5) : (d = qb, 0 === sk && i(Fi)), d !== qb && (nk = c, d = Gi()), c = d, c === qb && (c = mk, a.substr(mk, 4).toLowerCase() === Hi ? (d = a.substr(mk, 4), mk += 4) : (d = qb, 0 === sk && i(Ii)), d !== qb && (nk = c, d = Ji()), c = d, c === qb && (c = mk, a.substr(mk, 5).toLowerCase() === Ki ? (d = a.substr(mk, 5), mk += 5) : (d = qb, 0 === sk && i(Li)), d !== qb && (nk = c, d = Mi()), c = d, c === qb && (c = mk, a.substr(mk, 4).toLowerCase() === yc ? (d = a.substr(mk, 4), mk += 4) : (d = qb, 0 === sk && i(zc)), d !== qb && (nk = c, d = Ni()), c = d, c === qb && (c = mk, a.substr(mk, 4).toLowerCase() === Oi ? (d = a.substr(mk, 4), mk += 4) : (d = qb, 0 === sk && i(Pi)), d !== qb && (nk = c, d = Qi()), c = d, c === qb && (c = mk, a.substr(mk, 5).toLowerCase() === Ri ? (d = a.substr(mk, 5), mk += 5) : (d = qb, 0 === sk && i(Si)), d !== qb && (nk = c, d = Ti()), c = d, c === qb && (c = mk, a.substr(mk, 3).toLowerCase() === Ui ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(Vi)), d !== qb && (nk = c, d = Wi()), c = d, c === qb && (c = mk, a.substr(mk, 4).toLowerCase() === Xi ? (d = a.substr(mk, 4), mk += 4) : (d = qb, 0 === sk && i(Yi)), d !== qb && (nk = c, d = Zi()), c = d, c === qb && (c = mk, a.substr(mk, 6).toLowerCase() === $i ? (d = a.substr(mk, 6), mk += 6) : (d = qb, 0 === sk && i(_i)), d !== qb && (nk = c, d = aj()), c = d, c === qb && (c = mk, a.substr(mk, 6).toLowerCase() === bj ? (d = a.substr(mk, 6), mk += 6) : (d = qb, 0 === sk && i(cj)), d !== qb && (nk = c, d = dj()), c = d, c === qb && (c = mk, a.substr(mk, 10).toLowerCase() === ej ? (d = a.substr(mk, 10), mk += 10) : (d = qb, 0 === sk && i(fj)), d !== qb && (nk = c, d = Wi()), c = d)))))))))))))))), c !== qb ? (40 === a.charCodeAt(mk) ? (d = Wc, mk++) : (d = qb, 0 === sk && i(Xc)), d !== qb ? (e = s(), e !== qb ? (f = ab(), f !== qb ? (g = s(), g !== qb ? (41 === a.charCodeAt(mk) ? (h = $c, mk++) : (h = qb, 0 === sk && i(_c)), h !== qb ? (nk = b, c = gj(c, f), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[j] = { nextPos: mk, result: b }, b);
    }function Xa() {
      var b,
          c,
          d,
          e,
          f,
          g = 113 * mk + 97,
          h = tk[g];return h ? (mk = h.nextPos, h.result) : (b = mk, c = mk, a.substr(mk, 4).toLowerCase() === hj ? (d = a.substr(mk, 4), mk += 4) : (d = qb, 0 === sk && i(ij)), d !== qb && (nk = c, d = jj()), c = d, c === qb && (c = mk, a.substr(mk, 6).toLowerCase() === kj ? (d = a.substr(mk, 6), mk += 6) : (d = qb, 0 === sk && i(lj)), d !== qb && (nk = c, d = mj()), c = d, c === qb && (c = mk, a.substr(mk, 3).toLowerCase() === nj ? (d = a.substr(mk, 3), mk += 3) : (d = qb, 0 === sk && i(oj)), d !== qb && (nk = c, d = pj()), c = d, c === qb && (c = mk, a.substr(mk, 17).toLowerCase() === qj ? (d = a.substr(mk, 17), mk += 17) : (d = qb, 0 === sk && i(rj)), d !== qb && (nk = c, d = pj()), c = d, c === qb && (c = mk, a.substr(mk, 21).toLowerCase() === sj ? (d = a.substr(mk, 21), mk += 21) : (d = qb, 0 === sk && i(tj)), d !== qb && (nk = c, d = uj()), c = d, c === qb && (c = mk, a.substr(mk, 19).toLowerCase() === vj ? (d = a.substr(mk, 19), mk += 19) : (d = qb, 0 === sk && i(wj)), d !== qb && (nk = c, d = xj()), c = d, c === qb && (c = mk, a.substr(mk, 15).toLowerCase() === yj ? (d = a.substr(mk, 15), mk += 15) : (d = qb, 0 === sk && i(zj)), d !== qb && (nk = c, d = Aj()), c = d, c === qb && (c = mk, a.substr(mk, 7).toLowerCase() === Bj ? (d = a.substr(mk, 7), mk += 7) : (d = qb, 0 === sk && i(Cj)), d !== qb && (nk = c, d = Aj()), c = d))))))), c !== qb ? (40 === a.charCodeAt(mk) ? (d = Wc, mk++) : (d = qb, 0 === sk && i(Xc)), d !== qb ? (e = s(), e !== qb ? (41 === a.charCodeAt(mk) ? (f = $c, mk++) : (f = qb, 0 === sk && i(_c)), f !== qb ? (nk = b, c = Dj(c), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub), tk[g] = { nextPos: mk, result: b }, b);
    }function Ya() {
      var a,
          b,
          c,
          d = 113 * mk + 98,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (a = mk, b = mk, c = y(), c !== qb && (nk = b, c = Ej(c)), b = c, b === qb && (b = mk, c = z(), c !== qb && (nk = b, c = Fj(c)), b = c, b === qb && (b = mk, c = v(), c !== qb && (nk = b, c = Gj(c)), b = c)), b !== qb && (nk = a, b = Hj(b)), a = b, a === qb && (a = Za()), tk[d] = { nextPos: mk, result: a }, a);
    }function Za() {
      var b,
          c,
          d = 113 * mk + 99,
          e = tk[d];return e ? (mk = e.nextPos, e.result) : (b = mk, a.substr(mk, 4).toLowerCase() === gh ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(hh)), c !== qb && (nk = b, c = Ij(c)), b = c, tk[d] = { nextPos: mk, result: b }, b);
    }function $a() {
      var b,
          c,
          d,
          e,
          f = 113 * mk + 100,
          g = tk[f];return g ? (mk = g.nextPos, g.result) : (b = mk, c = E(), c !== qb ? (d = mk, sk++, 40 === a.charCodeAt(mk) ? (e = Wc, mk++) : (e = qb, 0 === sk && i(Xc)), sk--, e === qb ? d = vb : (mk = d, d = ub), d !== qb ? (nk = b, c = Jj(c), b = c) : (mk = b, b = ub)) : (mk = b, b = ub), tk[f] = { nextPos: mk, result: b }, b);
    }function _a() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h,
          j,
          k,
          l,
          m,
          n,
          o = 113 * mk + 101,
          p = tk[o];if (p) return mk = p.nextPos, p.result;if ((b = mk, a.substr(mk, 4).toLowerCase() === Kj ? (c = a.substr(mk, 4), mk += 4) : (c = qb, 0 === sk && i(Lj)), c !== qb)) {
        if ((d = [], e = mk, f = r(), f !== qb ? (a.substr(mk, 4).toLowerCase() === Mj ? (g = a.substr(mk, 4), mk += 4) : (g = qb, 0 === sk && i(Nj)), g !== qb ? (h = r(), h !== qb ? (j = eb(), j !== qb ? (k = r(), k !== qb ? (a.substr(mk, 4).toLowerCase() === Oj ? (l = a.substr(mk, 4), mk += 4) : (l = qb, 0 === sk && i(Pj)), l !== qb ? (m = r(), m !== qb ? (n = eb(), n !== qb ? (nk = e, f = Qj(j, n), e = f) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub), e !== qb)) for (; e !== qb;) d.push(e), e = mk, f = r(), f !== qb ? (a.substr(mk, 4).toLowerCase() === Mj ? (g = a.substr(mk, 4), mk += 4) : (g = qb, 0 === sk && i(Nj)), g !== qb ? (h = r(), h !== qb ? (j = eb(), j !== qb ? (k = r(), k !== qb ? (a.substr(mk, 4).toLowerCase() === Oj ? (l = a.substr(mk, 4), mk += 4) : (l = qb, 0 === sk && i(Pj)), l !== qb ? (m = r(), m !== qb ? (n = eb(), n !== qb ? (nk = e, f = Qj(j, n), e = f) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub);else d = ub;d !== qb ? (e = mk, f = r(), f !== qb ? (a.substr(mk, 4).toLowerCase() === Rj ? (g = a.substr(mk, 4), mk += 4) : (g = qb, 0 === sk && i(Sj)), g !== qb ? (h = r(), h !== qb ? (j = eb(), j !== qb ? (nk = e, f = Tj(j), e = f) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub)) : (mk = e, e = ub), e === qb && (e = cc), e !== qb ? (f = r(), f !== qb ? (a.substr(mk, 3).toLowerCase() === Uj ? (g = a.substr(mk, 3), mk += 3) : (g = qb, 0 === sk && i(Vj)), g !== qb ? (nk = b, c = Wj(d, e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub);
      } else mk = b, b = ub;return tk[o] = { nextPos: mk, result: b }, b;
    }function ab() {
      var a,
          b,
          c,
          d,
          e = 113 * mk + 102,
          f = tk[e];if (f) return mk = f.nextPos, f.result;if ((a = mk, b = bb(), b !== qb)) {
        if ((c = [], d = La(), d === qb && (d = Ma()), d !== qb)) for (; d !== qb;) c.push(d), d = La(), d === qb && (d = Ma());else c = ub;c !== qb ? (nk = a, b = Xj(b, c), a = b) : (mk = a, a = ub);
      } else mk = a, a = ub;return a === qb && (a = bb()), tk[e] = { nextPos: mk, result: a }, a;
    }function bb() {
      var a,
          b,
          c,
          d,
          e = 113 * mk + 103,
          f = tk[e];if (f) return mk = f.nextPos, f.result;if ((a = mk, b = cb(), b !== qb)) {
        if ((c = [], d = Na(), d !== qb)) for (; d !== qb;) c.push(d), d = Na();else c = ub;c !== qb ? (nk = a, b = Xj(b, c), a = b) : (mk = a, a = ub);
      } else mk = a, a = ub;return a === qb && (a = cb()), tk[e] = { nextPos: mk, result: a }, a;
    }function cb() {
      var a,
          b,
          c,
          d,
          e = 113 * mk + 104,
          f = tk[e];if (f) return mk = f.nextPos, f.result;if ((a = mk, b = db(), b !== qb)) {
        if ((c = [], d = Oa(), d !== qb)) for (; d !== qb;) c.push(d), d = Oa();else c = ub;c !== qb ? (nk = a, b = Xj(b, c), a = b) : (mk = a, a = ub);
      } else mk = a, a = ub;return a === qb && (a = db()), tk[e] = { nextPos: mk, result: a }, a;
    }function db() {
      var a,
          b = 113 * mk + 105,
          c = tk[b];return c ? (mk = c.nextPos, c.result) : (a = _a(), a === qb && (a = eb()), tk[b] = { nextPos: mk, result: a }, a);
    }function eb() {
      var a,
          b,
          c,
          d,
          e = 113 * mk + 106,
          f = tk[e];if (f) return mk = f.nextPos, f.result;if ((a = mk, b = fb(), b !== qb)) {
        if ((c = [], d = Pa(), d !== qb)) for (; d !== qb;) c.push(d), d = Pa();else c = ub;c !== qb ? (nk = a, b = Xj(b, c), a = b) : (mk = a, a = ub);
      } else mk = a, a = ub;return a === qb && (a = fb()), tk[e] = { nextPos: mk, result: a }, a;
    }function fb() {
      var a,
          b,
          c,
          d,
          e = 113 * mk + 107,
          f = tk[e];if (f) return mk = f.nextPos, f.result;if ((a = mk, b = gb(), b !== qb)) {
        if ((c = [], d = Qa(), d !== qb)) for (; d !== qb;) c.push(d), d = Qa();else c = ub;c !== qb ? (nk = a, b = Xj(b, c), a = b) : (mk = a, a = ub);
      } else mk = a, a = ub;return a === qb && (a = gb()), tk[e] = { nextPos: mk, result: a }, a;
    }function gb() {
      var a,
          b,
          c,
          d,
          e = 113 * mk + 108,
          f = tk[e];if (f) return mk = f.nextPos, f.result;if ((a = mk, b = hb(), b !== qb)) {
        if ((c = [], d = Ra(), d !== qb)) for (; d !== qb;) c.push(d), d = Ra();else c = ub;c !== qb ? (nk = a, b = Xj(b, c), a = b) : (mk = a, a = ub);
      } else mk = a, a = ub;return a === qb && (a = hb()), tk[e] = { nextPos: mk, result: a }, a;
    }function hb() {
      var a,
          b = 113 * mk + 109,
          c = tk[b];return c ? (mk = c.nextPos, c.result) : (a = Sa(), a === qb && (a = ib()), tk[b] = { nextPos: mk, result: a }, a);
    }function ib() {
      var a,
          b = 113 * mk + 110,
          c = tk[b];return c ? (mk = c.nextPos, c.result) : (a = Ta(), a === qb && (a = jb()), tk[b] = { nextPos: mk, result: a }, a);
    }function jb() {
      var b,
          c,
          d,
          e,
          f,
          g,
          h = 113 * mk + 111,
          j = tk[h];return j ? (mk = j.nextPos, j.result) : (b = Ya(), b === qb && (b = _a(), b === qb && (b = Xa(), b === qb && (b = Wa(), b === qb && (b = Va(), b === qb && (b = Ua(), b === qb && (b = $a(), b === qb && (b = mk, 40 === a.charCodeAt(mk) ? (c = Wc, mk++) : (c = qb, 0 === sk && i(Xc)), c !== qb ? (d = s(), d !== qb ? (e = ab(), e !== qb ? (f = s(), f !== qb ? (41 === a.charCodeAt(mk) ? (g = $c, mk++) : (g = qb, 0 === sk && i(_c)), g !== qb ? (nk = b, c = Vd(e), b = c) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)) : (mk = b, b = ub)))))))), tk[h] = { nextPos: mk, result: b }, b);
    }function kb() {
      var b,
          c = 113 * mk + 112,
          d = tk[c];return d ? (mk = d.nextPos, d.result) : (a.substr(mk, 2).toLowerCase() === Yj ? (b = a.substr(mk, 2), mk += 2) : (b = qb, 0 === sk && i(Zj)), b === qb && (a.substr(mk, 5).toLowerCase() === $j ? (b = a.substr(mk, 5), mk += 5) : (b = qb, 0 === sk && i(_j)), b === qb && (a.substr(mk, 3).toLowerCase() === ak ? (b = a.substr(mk, 3), mk += 3) : (b = qb, 0 === sk && i(bk)), b === qb && (a.substr(mk, 3).toLowerCase() === ck ? (b = a.substr(mk, 3), mk += 3) : (b = qb, 0 === sk && i(dk)), b === qb && (a.substr(mk, 5).toLowerCase() === ek ? (b = a.substr(mk, 5), mk += 5) : (b = qb, 0 === sk && i(fk)), b === qb && (a.substr(mk, 3).toLowerCase() === Nf ? (b = a.substr(mk, 3), mk += 3) : (b = qb, 0 === sk && i(Of)), b === qb && (a.substr(mk, 2).toLowerCase() === Uf ? (b = a.substr(mk, 2), mk += 2) : (b = qb, 0 === sk && i(Vf)), b === qb && (a.substr(mk, 3).toLowerCase() === sf ? (b = a.substr(mk, 3), mk += 3) : (b = qb, 0 === sk && i(tf)), b === qb && (a.substr(mk, 5).toLowerCase() === Wd ? (b = a.substr(mk, 5), mk += 5) : (b = qb, 0 === sk && i(Xd)), b === qb && (a.substr(mk, 9).toLowerCase() === be ? (b = a.substr(mk, 9), mk += 9) : (b = qb, 0 === sk && i(ce)), b === qb && (a.substr(mk, 6).toLowerCase() === $d ? (b = a.substr(mk, 6), mk += 6) : (b = qb, 0 === sk && i(_d)), b === qb && (a.substr(mk, 4).toLowerCase() === ie ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(je)), b === qb && (a.substr(mk, 5).toLowerCase() === ge ? (b = a.substr(mk, 5), mk += 5) : (b = qb, 0 === sk && i(he)), b === qb && (a.substr(mk, 4).toLowerCase() === ie ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(je)), b === qb && (a.substr(mk, 4).toLowerCase() === re ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(se)), b === qb && (a.substr(mk, 5).toLowerCase() === we ? (b = a.substr(mk, 5), mk += 5) : (b = qb, 0 === sk && i(xe)), b === qb && (a.substr(mk, 5).toLowerCase() === te ? (b = a.substr(mk, 5), mk += 5) : (b = qb, 0 === sk && i(ue)), b === qb && (a.substr(mk, 4).toLowerCase() === ze ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(Ae)), b === qb && (a.substr(mk, 6).toLowerCase() === gk ? (b = a.substr(mk, 6), mk += 6) : (b = qb, 0 === sk && i(hk)), b === qb && (a.substr(mk, 4).toLowerCase() === ik ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(jk)), b === qb && (a.substr(mk, 4).toLowerCase() === kk ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(lk)), b === qb && (a.substr(mk, 4).toLowerCase() === rd ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(sd)), b === qb && (a.substr(mk, 3).toLowerCase() === od ? (b = a.substr(mk, 3), mk += 3) : (b = qb, 0 === sk && i(pd)), b === qb && (a.substr(mk, 4).toLowerCase() === Kj ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(Lj)), b === qb && (a.substr(mk, 4).toLowerCase() === Mj ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(Nj)), b === qb && (a.substr(mk, 4).toLowerCase() === Oj ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(Pj)), b === qb && (a.substr(mk, 4).toLowerCase() === Rj ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(Sj)), b === qb && (a.substr(mk, 3).toLowerCase() === Uj ? (b = a.substr(mk, 3), mk += 3) : (b = qb, 0 === sk && i(Vj)), b === qb && (a.substr(mk, 4).toLowerCase() === lc ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(mc)), b === qb && (a.substr(mk, 5).toLowerCase() === oc ? (b = a.substr(mk, 5), mk += 5) : (b = qb, 0 === sk && i(pc)), b === qb && (a.substr(mk, 4).toLowerCase() === gh ? (b = a.substr(mk, 4), mk += 4) : (b = qb, 0 === sk && i(hh)))))))))))))))))))))))))))))))), tk[c] = { nextPos: mk, result: b }, b);
    }function lb(a) {
      for (var b, c = {}, d = 0; d < a.length; d++) b = a[d].name, c[b] && g(i18n.t("db.messages.parser.error-duplicate-variable", { name: b })), c[b] = !0;
    }function mb(a, b) {
      var c = b[0];c.args[0] = a, c.codeInfo = uk();for (var d, e = 1; e < b.length; e++) d = b[e], d.args[0] = c, d.codeInfo = uk(), c = d;return c;
    }function nb(a, b) {
      var c = b[0];c.child = a, c.codeInfo = uk();for (var d, e = 1; e < b.length; e++) d = b[e], d.child = c, d.codeInfo = uk(), c = d;return c;
    }var ob,
        pb = arguments.length > 1 ? arguments[1] : {},
        qb = {},
        rb = { start: k, dbDumpStart: l },
        sb = k,
        tb = function tb(a) {
      return a;
    },
        ub = qb,
        vb = void 0,
        wb = { type: "any", description: "any character" },
        xb = "\r\n",
        yb = { type: "literal", value: "\r\n", description: '"\\r\\n"' },
        zb = "\n",
        Ab = { type: "literal", value: "\n", description: '"\\n"' },
        Bb = { type: "other", description: "-- " },
        Cb = "--",
        Db = { type: "literal", value: "--", description: '"--"' },
        Eb = /^[ \t]/,
        Fb = { type: "class", value: "[ \\t]", description: "[ \\t]" },
        Gb = "/*",
        Hb = { type: "literal", value: "/*", description: '"/*"' },
        Ib = "*/",
        Jb = { type: "literal", value: "*/", description: '"*/"' },
        Kb = { type: "other", description: "whitespace" },
        Lb = /^[ \t\r\n]/,
        Mb = { type: "class", value: "[ \\t\\r\\n]", description: "[ \\t\\r\\n]" },
        Nb = function Nb() {
      return "";
    },
        Ob = { type: "other", description: "optional whitespace" },
        Pb = { type: "other", description: "whitespace without comments" },
        Qb = /^[\r\n\t ]/,
        Rb = { type: "class", value: "[\\r\\n\\t ]", description: "[\\r\\n\\t ]" },
        Sb = { type: "other", description: "optional whitespace without comments" },
        Tb = { type: "other", description: "string" },
        Ub = '"',
        Vb = { type: "literal", value: '"', description: '"\\""' },
        Wb = /^[^"\^\n]/,
        Xb = { type: "class", value: '[^"\\^\\n]', description: '[^"\\^\\n]' },
        Yb = function Yb() {
      g(i18n.t("db.messages.parser.error-sql-string-use-single-quotes"));
    },
        Zb = "'",
        $b = { type: "literal", value: "'", description: '"\'"' },
        _b = /^[^'\^\n]/,
        ac = { type: "class", value: "[^'\\^\\n]", description: "[^'\\^\\n]" },
        bc = function bc(a) {
      return a;
    },
        cc = null,
        dc = "-",
        ec = { type: "literal", value: "-", description: '"-"' },
        fc = /^[0-9]/,
        gc = { type: "class", value: "[0-9]", description: "[0-9]" },
        hc = function hc(a) {
      return parseInt(a, 10);
    },
        ic = ".",
        jc = { type: "literal", value: ".", description: '"."' },
        kc = function kc(a) {
      return parseFloat(a);
    },
        lc = "true",
        mc = { type: "literal", value: "true", description: '"true"' },
        nc = function nc() {
      return !0;
    },
        oc = "false",
        pc = { type: "literal", value: "false", description: '"false"' },
        qc = function qc() {
      return !1;
    },
        rc = { type: "other", description: "relationName" },
        sc = /^[0-9a-zA-Z_]/,
        tc = { type: "class", value: "[0-9a-zA-Z_]", description: "[0-9a-zA-Z_]" },
        uc = /^[a-zA-Z]/,
        vc = { type: "class", value: "[a-zA-Z]", description: "[a-zA-Z]" },
        wc = function wc(a) {
      var b = a.toLowerCase();return ("true" === b || "false" === b) && g(i18n.t("db.messages.parser.error-sql-invalid-relation-name", { str: a })), a;
    },
        xc = function xc(a) {
      var b = a.toLowerCase();return ("true" === b || "false" === b) && g(i18n.t("db.messages.parser.error-sql-invalid-column-name", { str: a })), a;
    },
        yc = "date",
        zc = { type: "literal", value: "date", description: '"date"' },
        Ac = "('",
        Bc = { type: "literal", value: "('", description: '"(\'"' },
        Cc = "')",
        Dc = { type: "literal", value: "')", description: '"\')"' },
        Ec = function Ec(a) {
      return a;
    },
        Fc = { type: "other", description: "date in ISO format (YYYY-MM-DD)" },
        Gc = function Gc(a, b, d) {
      a = parseInt(a, 10), b = parseInt(b, 10) - 1, d = parseInt(d, 10);var e = new Date(a, b, d);return (e.getFullYear() != a || e.getMonth() != b || e.getDate() != d) && g(i18n.t("db.messages.parser.error-invalid-date-format", { str: c() })), e;
    },
        Hc = function Hc(a, b) {
      return { type: "column", name: b, relAlias: a ? a[0] : null };
    },
        Ic = "*",
        Jc = { type: "literal", value: "*", description: '"*"' },
        Kc = function Kc(a) {
      return { type: "column", name: "*", relAlias: a ? a[0] : null };
    },
        Lc = function Lc(a) {
      return { type: "column", name: parseInt(a, 10), relAlias: null };
    },
        Mc = "sum",
        Nc = { type: "literal", value: "sum", description: '"sum"' },
        Oc = "count",
        Pc = { type: "literal", value: "count", description: '"count"' },
        Qc = "avg",
        Rc = { type: "literal", value: "avg", description: '"avg"' },
        Sc = "min",
        Tc = { type: "literal", value: "min", description: '"min"' },
        Uc = "max",
        Vc = { type: "literal", value: "max", description: '"max"' },
        Wc = "(",
        Xc = { type: "literal", value: "(", description: '"("' },
        Yc = "all",
        Zc = { type: "literal", value: "ALL", description: '"ALL"' },
        $c = ")",
        _c = { type: "literal", value: ")", description: '")"' },
        ad = function ad(a, b) {
      return { type: "aggFunction", aggFunction: a.toUpperCase(), col: b };
    },
        bd = "count(*)",
        cd = { type: "literal", value: "count(*)", description: '"count(*)"' },
        dd = function dd() {
      return { type: "aggFunction", aggFunction: "COUNT_ALL", col: null };
    },
        ed = "as",
        fd = { type: "literal", value: "as", description: '"as"' },
        gd = function gd(a, b) {
      return a.name = b, a;
    },
        hd = function hd(a) {
      g("aggregation columns must be named");
    },
        id = function id(a) {
      return a.alias = null, a;
    },
        jd = function jd(a, b) {
      return a.alias = b, a;
    },
        kd = function kd(a, b) {
      return { type: "namedColumnExpr", name: b, relAlias: null, child: a, codeInfo: uk() };
    },
        ld = ",",
        md = { type: "literal", value: ",", description: '","' },
        nd = function nd(a, b) {
      var c = [a];if (null != b) for (var d = 0; d < b.length; d++) {
        var e = b[d][3];c.push(e);
      }return c;
    },
        od = "asc",
        pd = { type: "literal", value: "asc", description: '"asc"' },
        qd = function qd() {
      return !0;
    },
        rd = "desc",
        sd = { type: "literal", value: "desc", description: '"desc"' },
        td = function td() {
      return !1;
    },
        ud = function ud(a, b) {
      return b = null == b ? !0 : b[1], { col: a, asc: b };
    },
        vd = function vd(a, b) {
      var c = [a];if (null != b) for (var d in b) c.push(b[d][3]);return { value: c, codeInfo: uk() };
    },
        wd = function wd(a, b) {
      var c = [a];if (null != b) for (var d in b) c.push(b[d][3]);return c;
    },
        xd = function xd(a, b) {
      return b.wrappedInBrackets = !0, { type: "assignment", name: a, child: { type: "relationFromSubstatement", statement: b, relAlias: a, codeInfo: uk() }, codeInfo: uk() };
    },
        yd = ";",
        zd = { type: "literal", value: ";", description: '";"' },
        Ad = function Ad(a, b) {
      var c = [];return null !== a && (c = a, lb(c)), { type: "root", assignments: c, child: b, codeInfo: uk() };
    },
        Bd = "with",
        Cd = { type: "literal", value: "with", description: '"with"' },
        Dd = function Dd(a, b) {
      for (var c = [a], d = 0; d < b.length; d++) c.push(b[d][3]);return c;
    },
        Ed = "select",
        Fd = { type: "literal", value: "select", description: '"select"' },
        Gd = "distinct",
        Hd = { type: "literal", value: "distinct", description: '"distinct"' },
        Id = function Id(a, b) {
      return { type: "select", distinct: null !== a, arg: b, codeInfo: uk() };
    },
        Jd = "order",
        Kd = { type: "literal", value: "order", description: '"order"' },
        Ld = "by",
        Md = { type: "literal", value: "by", description: '"by"' },
        Nd = function Nd(a) {
      return { type: "orderBy", child: null, arg: a, codeInfo: uk() };
    },
        Od = function Od(a, b, c) {
      var d = a;return null !== b && (b[1].child = d, d = b[1]), null !== c && (c[1].child = d, d = c[1]), d;
    },
        Pd = function Pd(a, b) {
      return nb(a, b);
    },
        Qd = "from",
        Rd = { type: "literal", value: "from", description: '"from"' },
        Sd = "group",
        Td = { type: "literal", value: "group", description: '"group"' },
        Ud = function Ud(a, b, c, d, e) {
      for (var f = 0, h = 0; h < a.arg.length; h++) "aggFunction" === a.arg[h].type && f++;return f > 0 && f != a.arg.length && null === d && g(i18n.t("db.messages.parser.error-sql-group-by-missing")), e && !d && 0 === f && g(i18n.t("db.messages.parser.error-sql-having-without-group-by")), { type: "statement", select: a, from: b, where: c ? c[1] : null, groupBy: d ? d[5] : null, having: e ? e[1] : null, numAggregationColumns: f, codeInfo: uk() };
    },
        Vd = function Vd(a) {
      return a.wrappedInBrackets = !0, a;
    },
        Wd = "union",
        Xd = { type: "literal", value: "union", description: '"union"' },
        Yd = { type: "literal", value: "all", description: '"all"' },
        Zd = function Zd(a, b) {
      return { type: "union", child2: b, all: a };
    },
        $d = "except",
        _d = { type: "literal", value: "except", description: '"except"' },
        ae = function ae(a, b) {
      return { type: "except", child2: b, all: a };
    },
        be = "intersect",
        ce = { type: "literal", value: "intersect", description: '"intersect"' },
        de = function de(a, b) {
      return { type: "intersect", child2: b, all: a };
    },
        ee = function ee(a, b) {
      var c = { type: "relation", name: a, relAlias: null, codeInfo: uk() };return null !== b ? { type: "renameRelation", child: c, newRelAlias: b[3], codeInfo: uk() } : c;
    },
        fe = function fe(a, b) {
      return a.wrappedInBrackets = !0, { type: "relationFromSubstatement", statement: a, relAlias: b, codeInfo: uk() };
    },
        ge = "cross",
        he = { type: "literal", value: "cross", description: '"cross"' },
        ie = "join",
        je = { type: "literal", value: "join", description: '"join"' },
        ke = function ke(a) {
      return { type: "crossJoin", child2: a, cond: null };
    },
        le = "natural",
        me = { type: "literal", value: "natural", description: '"natural"' },
        ne = function ne(a) {
      return { type: "naturalJoin", child2: a, cond: null };
    },
        oe = "inner",
        pe = { type: "literal", value: "inner", description: '"inner"' },
        qe = function qe() {
      return "innerJoin";
    },
        re = "left",
        se = { type: "literal", value: "left", description: '"left"' },
        te = "outer",
        ue = { type: "literal", value: "outer", description: '"outer"' },
        ve = function ve() {
      return "leftOuterJoin";
    },
        we = "right",
        xe = { type: "literal", value: "right", description: '"right"' },
        ye = function ye() {
      return "rightOuterJoin";
    },
        ze = "full",
        Ae = { type: "literal", value: "full", description: '"full"' },
        Be = function Be() {
      return "fullOuterJoin";
    },
        Ce = "on",
        De = { type: "literal", value: "on", description: '"on"' },
        Ee = function Ee(a) {
      return a;
    },
        Fe = "using",
        Ge = { type: "literal", value: "using", description: '"using"' },
        He = function He(a, b) {
      for (var c = [a], d = 0; d < b.length; d++) c.push(b[d][3]);return c;
    },
        Ie = function Ie() {
      return null;
    },
        Je = function Je(a, b, c) {
      return { type: a, child2: b, cond: c };
    },
        Ke = "where",
        Le = { type: "literal", value: "where", description: '"where"' },
        Me = function Me(a) {
      return { type: "where", arg: a, codeInfo: uk() };
    },
        Ne = "having",
        Oe = { type: "literal", value: "having", description: '"having"' },
        Pe = function Pe(a) {
      return { type: "having", arg: a, codeInfo: uk() };
    },
        Qe = function Qe() {
      return -1;
    },
        Re = function Re(a) {
      return 0 > a && g(i18n.t("db.messages.parser.error-sql-negative-limit")), a;
    },
        Se = "limit",
        Te = { type: "literal", value: "limit", description: '"limit"' },
        Ue = function Ue(a, b) {
      return { type: "limit", limit: b, offset: 0, codeInfo: uk() };
    },
        Ve = "offset",
        We = { type: "literal", value: "offset", description: '"offset"' },
        Xe = function Xe(a, b) {
      return { type: "limit", limit: a, offset: b, codeInfo: uk() };
    },
        Ye = function Ye(a) {
      return { type: "limit", limit: a, offset: 0, codeInfo: uk() };
    },
        Ze = "rows",
        $e = { type: "literal", value: "rows", description: '"rows"' },
        _e = "row",
        af = { type: "literal", value: "row", description: '"row"' },
        bf = function bf(a) {
      return a;
    },
        cf = "fetch",
        df = { type: "literal", value: "fetch", description: '"fetch"' },
        ef = "first",
        ff = { type: "literal", value: "first", description: '"first"' },
        gf = "next",
        hf = { type: "literal", value: "next", description: '"next"' },
        jf = "only",
        kf = { type: "literal", value: "only", description: '"only"' },
        lf = function lf(a) {
      return 0 > a && g(i18n.t("db.messages.parser.error-sql-negative-limit")), a;
    },
        mf = function mf(a, b) {
      return [a, b];
    },
        nf = function nf(a) {
      return [a, -1];
    },
        of = function of(a) {
      return [0, a];
    },
        pf = function pf(a) {
      return { type: "limit", child: null, limit: a[1], offset: a[0], codeInfo: uk() };
    },
        qf = "is",
        rf = { type: "literal", value: "is", description: '"is"' },
        sf = "not",
        tf = { type: "literal", value: "not", description: '"not"' },
        uf = function uf() {
      return "!=";
    },
        vf = function vf() {
      return "=";
    },
        wf = "=",
        xf = { type: "literal", value: "=", description: '"="' },
        yf = "<>",
        zf = { type: "literal", value: "<>", description: '"<>"' },
        Af = "!=",
        Bf = { type: "literal", value: "!=", description: '"!="' },
        Cf = ">=",
        Df = { type: "literal", value: ">=", description: '">="' },
        Ef = function Ef() {
      return ">=";
    },
        Ff = ">",
        Gf = { type: "literal", value: ">", description: '">"' },
        Hf = "<=",
        If = { type: "literal", value: "<=", description: '"<="' },
        Jf = function Jf() {
      return "<=";
    },
        Kf = "<",
        Lf = { type: "literal", value: "<", description: '"<"' },
        Mf = { type: "other", description: "logical AND" },
        Nf = "and",
        Of = { type: "literal", value: "and", description: '"and"' },
        Pf = function Pf() {
      return "AND";
    },
        Qf = { type: "other", description: "logical XOR" },
        Rf = "xor",
        Sf = { type: "literal", value: "xor", description: '"xor"' },
        Tf = { type: "other", description: "logical OR" },
        Uf = "or",
        Vf = { type: "literal", value: "or", description: '"or"' },
        Wf = function Wf() {
      return "OR";
    },
        Xf = { type: "other", description: "logical NOT" },
        Yf = "!",
        Zf = { type: "literal", value: "!", description: '"!"' },
        $f = function $f() {
      return "NOT";
    },
        _f = "exists",
        ag = { type: "literal", value: "exists", description: '"exists"' },
        bg = function bg() {
      return { type: "comment" };
    },
        cg = "#",
        dg = { type: "literal", value: "#", description: '"#"' },
        eg = /^[^\n]/,
        fg = { type: "class", value: "[^\\n]", description: "[^\\n]" },
        gg = "`",
        hg = { type: "literal", value: "`", description: '"`"' },
        ig = "drop",
        jg = { type: "literal", value: "drop", description: '"drop"' },
        kg = "table",
        lg = { type: "literal", value: "table", description: '"table"' },
        mg = "if",
        ng = { type: "literal", value: "if", description: '"if"' },
        og = function og() {
      return { type: "dropTable" };
    },
        pg = "lock",
        qg = { type: "literal", value: "lock", description: '"lock"' },
        rg = "tables",
        sg = { type: "literal", value: "tables", description: '"tables"' },
        tg = function tg() {
      return { type: "lockTable" };
    },
        ug = "unlock",
        vg = { type: "literal", value: "unlock", description: '"unlock"' },
        wg = function wg() {
      return { type: "unlockTable" };
    },
        xg = function xg(a) {
      var b,
          c,
          d,
          e,
          f,
          h,
          i = {},
          j = {};for (c = 0; c < a.length; c++) if ((b = a[c][0], b.type && ("table" === b.type || "insert" === b.type))) if ("table" == b.type) for (i[b.name] && g("table " + b.name + " already created"), i[b.name] = b, j[b.name] = {}, d = 0; d < b.columns.length; d++) j[b.name][b.columns[d].name] = d;else if ("insert" === b.type) for (i[b.name] || g("table " + b.name + " not created"), d = 0; d < b.values.length; d++) {
        if (0 === b.columns.length) f = b.values[d];else for (f = new Array(i[b.name].columns.length), e = 0; e < b.values[d].length; e++) f[j[b.name][b.columns[e]]] = b.values[d][e];for (f.length !== i[b.name].columns.length && g(i18n.t("db.messages.parser.error-sqldump-invalid-column-number", { line: b.codeInfo.line })), e = 0; e < f.length; e++) if ((h = i[b.name].columns[e].type, null !== f[e])) switch (h) {case "number":
            "number" != typeof f[e] && g(i18n.t("db.messages.parser.error-sqldump-invalid-type", { line: b.codeInfo.line }));break;case "string":
            "string" != typeof f[e] && g(i18n.t("db.messages.parser.error-sqldump-invalid-type", { line: b.codeInfo.line }));break;case "date":
            f[e] instanceof Date == !1 && g(i18n.t("db.messages.parser.error-sqldump-invalid-type", { line: b.codeInfo.line }));}i[b.name].rows.push(f);
      }var k = [];for (var l in i) k.push({ type: "assignment", name: l, child: i[l], codeInfo: uk() });var m = { type: "groupRoot", groups: [{ type: "tableGroup", headers: { group: "" }, assignments: k, codeInfo: uk() }], codeInfo: uk() };return m;
    },
        yg = "decimal",
        zg = { type: "literal", value: "decimal", description: '"decimal"' },
        Ag = function Ag() {
      return "number";
    },
        Bg = "tinyint",
        Cg = { type: "literal", value: "tinyint", description: '"tinyint"' },
        Dg = "smallint",
        Eg = { type: "literal", value: "smallint", description: '"smallint"' },
        Fg = "mediumint",
        Gg = { type: "literal", value: "mediumint", description: '"mediumint"' },
        Hg = "bigint",
        Ig = { type: "literal", value: "bigint", description: '"bigint"' },
        Jg = "integer",
        Kg = { type: "literal", value: "integer", description: '"integer"' },
        Lg = "int",
        Mg = { type: "literal", value: "int", description: '"int"' },
        Ng = "float",
        Og = { type: "literal", value: "float", description: '"float"' },
        Pg = "double",
        Qg = { type: "literal", value: "double", description: '"double"' },
        Rg = "varchar",
        Sg = { type: "literal", value: "varchar", description: '"varchar"' },
        Tg = "char",
        Ug = { type: "literal", value: "char", description: '"char"' },
        Vg = "text",
        Wg = { type: "literal", value: "text", description: '"text"' },
        Xg = function Xg() {
      return "string";
    },
        Yg = "datetime",
        Zg = { type: "literal", value: "datetime", description: '"datetime"' },
        $g = function $g() {
      return "date";
    },
        _g = /^[a-zA-Z0-9_=]/,
        ah = { type: "class", value: "[a-zA-Z0-9_=]", description: "[a-zA-Z0-9_=]" },
        bh = function bh(a, b) {
      return { name: a, type: b, relAlias: null };
    },
        ch = function ch(a, b) {
      var c = [];null !== a && a.type && c.push(a);for (var d = 0; d < b.length; d++) null !== b[d][3] && b[d][3].type && c.push(b[d][3]);return c;
    },
        dh = "create",
        eh = { type: "literal", value: "create", description: '"create"' },
        fh = function fh(a, b) {
      var c = { type: "table", name: a, columns: b, rows: [], codeInfo: uk() };return c;
    },
        gh = "null",
        hh = { type: "literal", value: "null", description: '"null"' },
        ih = function ih(a, b) {
      for (var c = [a], d = 0; d < b.length; d++) c.push(b[d][3]);return c;
    },
        jh = "insert",
        kh = { type: "literal", value: "insert", description: '"insert"' },
        lh = "into",
        mh = { type: "literal", value: "into", description: '"into"' },
        nh = "values",
        oh = { type: "literal", value: "values", description: '"values"' },
        ph = function ph(a, b, c, d) {
      var e,
          f = { type: "insert", name: a, columns: [], values: [c], codeInfo: uk() };if (d) for (e = 0; e < d.length; e++) f.values.push(d[e][3]);if (b) {
        f.columns.push(b[3]);for (var e = 0; e < b[4].length; e++) f.columns.push(b[4][e][3]);
      }var h = f.values[0].length;for (e = 1; e < f.values.length; e++) f.values[e].length !== h && g(i18n.t("db.messages.parser.error-sqldump-insert-wrong-number-columns"));return b && f.columns.length !== h && g(i18n.t("db.messages.parser.error-sqldump-insert-wrong-number-columns")), f;
    },
        qh = { type: "other", description: "boolean expression" },
        rh = function rh(a) {
      return { type: "valueExpr", datatype: "boolean", func: "or", args: [void 0, a], codeInfo: uk() };
    },
        sh = "||",
        th = { type: "literal", value: "||", description: '"||"' },
        uh = function uh(a) {
      return { type: "valueExpr", datatype: "string", func: "concat", args: [void 0, a], codeInfo: uk() };
    },
        vh = function vh(a) {
      return { type: "valueExpr", datatype: "boolean", func: "xor", args: [void 0, a], codeInfo: uk() };
    },
        wh = function wh(a) {
      return { type: "valueExpr", datatype: "boolean", func: "and", args: [void 0, a], codeInfo: uk() };
    },
        xh = function xh(a, b) {
      return { type: "valueExpr", datatype: "boolean", func: a, args: [void 0, b], codeInfo: uk() };
    },
        yh = "like",
        zh = { type: "literal", value: "like", description: '"like"' },
        Ah = "ilike",
        Bh = { type: "literal", value: "ilike", description: '"ilike"' },
        Ch = function Ch(a, b) {
      return "string" !== b.datatype && g(i18n.t("db.messages.parser.error-valueexpr-like-operand-no-string")), { type: "valueExpr", datatype: "boolean", func: a.toLowerCase(), args: [void 0, b], codeInfo: uk() };
    },
        Dh = "+",
        Eh = { type: "literal", value: "+", description: '"+"' },
        Fh = function Fh(a, b) {
      return a = ({ "+": "add", "-": "sub" })[a], { type: "valueExpr", datatype: "number", func: a, args: [void 0, b], codeInfo: uk() };
    },
        Gh = "/",
        Hh = { type: "literal", value: "/", description: '"/"' },
        Ih = "%",
        Jh = { type: "literal", value: "%", description: '"%"' },
        Kh = function Kh(a, b) {
      return a = ({ "*": "mul", "/": "div", "%": "mod" })[a], { type: "valueExpr", datatype: "number", func: a, args: [void 0, b], codeInfo: uk() };
    },
        Lh = function Lh(a) {
      return { type: "valueExpr", datatype: "number", func: "minus", args: [a], codeInfo: uk() };
    },
        Mh = function Mh(a) {
      return { type: "valueExpr", datatype: "boolean", func: "not", args: [a], codeInfo: uk() };
    },
        Nh = "coalesce",
        Oh = { type: "literal", value: "coalesce", description: '"coalesce"' },
        Ph = function Ph() {
      return ["coalesce", "null"];
    },
        Qh = "concat",
        Rh = { type: "literal", value: "concat", description: '"concat"' },
        Sh = function Sh() {
      return ["concat", "string"];
    },
        Th = function Th(a, b, c) {
      for (var d = [b], e = 0; e < c.length; e++) d.push(c[e][2]);return { type: "valueExpr", datatype: a[1], func: a[0], args: d, codeInfo: uk() };
    },
        Uh = "adddate",
        Vh = { type: "literal", value: "adddate", description: '"adddate"' },
        Wh = function Wh() {
      return ["adddate", "date"];
    },
        Xh = "subdate",
        Yh = { type: "literal", value: "subdate", description: '"subdate"' },
        Zh = function Zh() {
      return ["subdate", "date"];
    },
        $h = "mod",
        _h = { type: "literal", value: "mod", description: '"mod"' },
        ai = function ai() {
      return ["mod", "number"];
    },
        bi = "add",
        ci = { type: "literal", value: "add", description: '"add"' },
        di = function di() {
      return ["add", "number"];
    },
        ei = "sub",
        fi = { type: "literal", value: "sub", description: '"sub"' },
        gi = function gi() {
      return ["sub", "number"];
    },
        hi = "mul",
        ii = { type: "literal", value: "mul", description: '"mul"' },
        ji = function ji() {
      return ["mul", "number"];
    },
        ki = "div",
        li = { type: "literal", value: "div", description: '"div"' },
        mi = function mi() {
      return ["div", "number"];
    },
        ni = function ni(a, b, c) {
      return { type: "valueExpr", datatype: a[1], func: a[0], args: [b, c], codeInfo: uk() };
    },
        oi = "upper",
        pi = { type: "literal", value: "upper", description: '"upper"' },
        qi = function qi() {
      return ["upper", "string"];
    },
        ri = "ucase",
        si = { type: "literal", value: "ucase", description: '"ucase"' },
        ti = "lower",
        ui = { type: "literal", value: "lower", description: '"lower"' },
        vi = function vi() {
      return ["lower", "string"];
    },
        wi = "lcase",
        xi = { type: "literal", value: "lcase", description: '"lcase"' },
        yi = "length",
        zi = { type: "literal", value: "length", description: '"length"' },
        Ai = function Ai() {
      return ["strlen", "number"];
    },
        Bi = "abs",
        Ci = { type: "literal", value: "abs", description: '"abs"' },
        Di = function Di() {
      return ["abs", "number"];
    },
        Ei = "floor",
        Fi = { type: "literal", value: "floor", description: '"floor"' },
        Gi = function Gi() {
      return ["floor", "number"];
    },
        Hi = "ceil",
        Ii = { type: "literal", value: "ceil", description: '"ceil"' },
        Ji = function Ji() {
      return ["ceil", "number"];
    },
        Ki = "round",
        Li = { type: "literal", value: "round", description: '"round"' },
        Mi = function Mi() {
      return ["round", "number"];
    },
        Ni = function Ni() {
      return ["date", "date"];
    },
        Oi = "year",
        Pi = { type: "literal", value: "year", description: '"year"' },
        Qi = function Qi() {
      return ["year", "number"];
    },
        Ri = "month",
        Si = { type: "literal", value: "month", description: '"month"' },
        Ti = function Ti() {
      return ["month", "number"];
    },
        Ui = "day",
        Vi = { type: "literal", value: "day", description: '"day"' },
        Wi = function Wi() {
      return ["dayofmonth", "number"];
    },
        Xi = "hour",
        Yi = { type: "literal", value: "hour", description: '"hour"' },
        Zi = function Zi() {
      return ["hour", "number"];
    },
        $i = "minute",
        _i = { type: "literal", value: "minute", description: '"minute"' },
        aj = function aj() {
      return ["minute", "number"];
    },
        bj = "second",
        cj = { type: "literal", value: "second", description: '"second"' },
        dj = function dj() {
      return ["second", "number"];
    },
        ej = "dayofmonth",
        fj = { type: "literal", value: "dayofmonth", description: '"dayofmonth"' },
        gj = function gj(a, b) {
      return { type: "valueExpr", datatype: a[1], func: a[0], args: [b], codeInfo: uk() };
    },
        hj = "rand",
        ij = { type: "literal", value: "rand", description: '"rand"' },
        jj = function jj() {
      return ["rand", "number"];
    },
        kj = "rownum",
        lj = { type: "literal", value: "rownum", description: '"rownum"' },
        mj = function mj() {
      return ["rownum", "number"];
    },
        nj = "now",
        oj = { type: "literal", value: "now", description: '"now"' },
        pj = function pj() {
      return ["now", "date"];
    },
        qj = "current_timestamp",
        rj = { type: "literal", value: "current_timestamp", description: '"current_timestamp"' },
        sj = "transaction_timestamp",
        tj = { type: "literal", value: "transaction_timestamp", description: '"transaction_timestamp"' },
        uj = function uj() {
      return ["transaction_timestamp", "date"];
    },
        vj = "statement_timestamp",
        wj = { type: "literal", value: "statement_timestamp", description: '"statement_timestamp"' },
        xj = function xj() {
      return ["statement_timestamp", "date"];
    },
        yj = "clock_timestamp",
        zj = { type: "literal", value: "clock_timestamp", description: '"clock_timestamp"' },
        Aj = function Aj() {
      return ["clock_timestamp", "date"];
    },
        Bj = "sysdate",
        Cj = { type: "literal", value: "sysdate", description: '"sysdate"' },
        Dj = function Dj(a) {
      return { type: "valueExpr", datatype: a[1], func: a[0], args: [], codeInfo: uk() };
    },
        Ej = function Ej(a) {
      return [a, "number"];
    },
        Fj = function Fj(a) {
      return [a, "boolean"];
    },
        Gj = function Gj(a) {
      return [a, "string"];
    },
        Hj = function Hj(a) {
      return { type: "valueExpr", datatype: a[1], func: "constant", args: [a[0]], codeInfo: uk() };
    },
        Ij = function Ij(a) {
      return { type: "valueExpr", datatype: "null", func: "constant", args: [null], codeInfo: uk() };
    },
        Jj = function Jj(a) {
      return { type: "valueExpr", datatype: "null", func: "columnValue", args: [a.name, a.relAlias], codeInfo: uk() };
    },
        Kj = "case",
        Lj = { type: "literal", value: "case", description: '"case"' },
        Mj = "when",
        Nj = { type: "literal", value: "when", description: '"when"' },
        Oj = "then",
        Pj = { type: "literal", value: "then", description: '"then"' },
        Qj = function Qj(a, b) {
      return { w: a, t: b };
    },
        Rj = "else",
        Sj = { type: "literal", value: "else", description: '"else"' },
        Tj = function Tj(a) {
      return a;
    },
        Uj = "end",
        Vj = { type: "literal", value: "end", description: '"end"' },
        Wj = function Wj(a, b) {
      var c,
          d = [];for (c = 0; c < a.length; c++) d.push(a[c].w), d.push(a[c].t);return null !== b && (d.push({ type: "valueExpr", datatype: "boolean", func: "constant", args: [!0], codeInfo: uk() }), d.push(b)), { type: "valueExpr", datatype: "null", func: null === b ? "caseWhen" : "caseWhenElse", args: d, codeInfo: uk() };
    },
        Xj = function Xj(a, b) {
      return mb(a, b);
    },
        Yj = "pi",
        Zj = { type: "literal", value: "pi", description: '"pi"' },
        $j = "sigma",
        _j = { type: "literal", value: "sigma", description: '"sigma"' },
        ak = "rho",
        bk = { type: "literal", value: "rho", description: '"rho"' },
        ck = "tau",
        dk = { type: "literal", value: "tau", description: '"tau"' },
        ek = "gamma",
        fk = { type: "literal", value: "gamma", description: '"gamma"' },
        gk = "natual",
        hk = { type: "literal", value: "natual", description: '"natual"' },
        ik = "semi",
        jk = { type: "literal", value: "semi", description: '"semi"' },
        kk = "anti",
        lk = { type: "literal", value: "anti", description: '"anti"' },
        mk = 0,
        nk = 0,
        ok = 0,
        pk = { line: 1, column: 1, seenCR: !1 },
        qk = 0,
        rk = [],
        sk = 0,
        tk = {};if ("startRule" in pb) {
      if (!(pb.startRule in rb)) throw new Error("Can't start parsing from rule \"" + pb.startRule + '".');sb = rb[pb.startRule];
    }var uk = function uk() {
      return { line: e(), column: f(), offset: d(), text: c() };
    };if ((ob = sb(), ob !== qb && mk === a.length)) return ob;throw (ob !== qb && mk < a.length && i({ type: "end", description: "end of input" }), j(null, rk, qk));
  }return a(b, Error), { SyntaxError: b, parse: c };
})();

},{}],110:[function(require,module,exports){
'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.parseSQLSelect = parseSQLSelect;
exports.parseSQLDump = parseSQLDump;
exports.parseRelalg = parseRelalg;
exports.parseRelalgGroup = parseRelalgGroup;
exports.executeRelalg = executeRelalg;

var _translateReplaceVariables = require('./translate/replaceVariables');

var _translateRelalgFromAst = require('./translate/relalgFromAst');

var _translateTextFromAst = require('./translate/textFromAst');

Object.defineProperty(exports, 'textFromGroupAstRoot', {
	enumerable: true,
	get: function get() {
		return _translateTextFromAst.textFromGroupAstRoot;
	}
});
Object.defineProperty(exports, 'textFromRelalgAstNode', {
	enumerable: true,
	get: function get() {
		return _translateTextFromAst.textFromRelalgAstNode;
	}
});
Object.defineProperty(exports, 'textFromRelalgAstRoot', {
	enumerable: true,
	get: function get() {
		return _translateTextFromAst.textFromRelalgAstRoot;
	}
});
Object.defineProperty(exports, 'relalgFromRelalgAstNode', {
	enumerable: true,
	get: function get() {
		return _translateRelalgFromAst.relalgFromRelalgAstNode;
	}
});
Object.defineProperty(exports, 'relalgFromRelalgAstRoot', {
	enumerable: true,
	get: function get() {
		return _translateRelalgFromAst.relalgFromRelalgAstRoot;
	}
});
Object.defineProperty(exports, 'relalgFromSQLAstRoot', {
	enumerable: true,
	get: function get() {
		return _translateRelalgFromAst.relalgFromSQLAstRoot;
	}
});
Object.defineProperty(exports, 'replaceVariables', {
	enumerable: true,
	get: function get() {
		return _translateReplaceVariables.replaceVariables;
	}
});

var peg_parser_ra = require('./parser/parser_ra.min.js');
var peg_parser_sql = require('./parser/parser_sql.min.js');

function parseSQLSelect(text) {
	return peg_parser_sql.parse(text, { startRule: 'start' });
}

function parseSQLDump(text) {
	return peg_parser_sql.parse(text, { startRule: 'dbDumpStart' });
}

function parseRelalg(text, relationNames) {
	return peg_parser_ra.parse(text, { startRule: 'start', relationNames: relationNames });
}

function parseRelalgGroup(text) {
	return peg_parser_ra.parse(text, { startRule: 'groupStart' });
}

function executeRelalg(text, relations) {
	relations = relations || {};
	var ast = parseRelalg(text, _Object$keys(relations));
	(0, _translateReplaceVariables.replaceVariables)(ast, relations);
	var root = (0, _translateRelalgFromAst.relalgFromRelalgAstRoot)(ast, relations);
	root.check();
	return root;
}

},{"./parser/parser_ra.min.js":108,"./parser/parser_sql.min.js":109,"./translate/relalgFromAst":111,"./translate/replaceVariables":112,"./translate/textFromAst":113,"babel-runtime/core-js/object/keys":6}],111:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.relalgFromSQLAstRoot = relalgFromSQLAstRoot;
exports.relalgFromRelalgAstRoot = relalgFromRelalgAstRoot;
exports.relalgFromRelalgAstNode = relalgFromRelalgAstNode;

var _execValueExpr = require('../exec/ValueExpr');

var ValueExpr = _interopRequireWildcard(_execValueExpr);

var _execSchema = require('../exec/Schema');

var _execColumn = require('../exec/Column');

var _execTable = require('../exec/Table');

var _execRANode = require('../exec/RANode');

var _execProjection = require('../exec/Projection');

var _execUnion = require('../exec/Union');

var _execIntersect = require('../exec/Intersect');

var _execDivision = require('../exec/Division');

var _execDifference = require('../exec/Difference');

var _execSelection = require('../exec/Selection');

var _execGroupBy = require('../exec/GroupBy');

var _execOrderBy = require('../exec/OrderBy');

var _execInnerJoin = require('../exec/InnerJoin');

var _execLeftOuterJoin = require('../exec/LeftOuterJoin');

var _execRightOuterJoin = require('../exec/RightOuterJoin');

var _execFullOuterJoin = require('../exec/FullOuterJoin');

var _execCrossJoin = require('../exec/CrossJoin');

var _execSemiJoin = require('../exec/SemiJoin');

var _execAntiJoin = require('../exec/AntiJoin');

var _execRenameColumns = require('../exec/RenameColumns');

var _execRenameRelation = require('../exec/RenameRelation');

var _execRelation = require('../exec/Relation');

// translate a SQL-AST to RA

function relalgFromSQLAstRoot(astRoot, relations) {
	'use strict';

	function setCodeInfoFromNode(raNode, astNode) {
		if (!astNode.codeInfo) {
			throw new Error('should not happen');
		}

		raNode.setCodeInfo(astNode.codeInfo.line, astNode.codeInfo.column, astNode.codeInfo.offset, astNode.codeInfo.text);
	}

	function getError(msg, codeInfo) {
		var error = new Error(msg);
		error.line = codeInfo.line;
		error.column = codeInfo.column;
		error.codeInfo = codeInfo;
		return error;
	}

	function rec(n) {
		var node, rel;
		var a, b, tmp, i;
		var condition;
		if (typeof n.cond !== 'undefined') condition = n.cond === null || n.cond instanceof Array ? n.cond : rec(n.cond);

		switch (n.type) {
			case 'relation':
				if (typeof relations[n.name] == 'undefined') {
					throw getError(i18n.t('db.messages.translate.error-relation-not-found', { name: n.name }), n.codeInfo);
				}
				rel = relations[n.name].copy();
				if (n.relAlias === null) {
					node = rel;
					break;
				}
				node = new _execRenameRelation.RenameRelation(rel, n.relAlias);
				break;

			case 'valueExpr':
				if (n.datatype == 'null' && n.func === 'columnValue') {
					node = new ValueExpr.ValueExprColumnValue(n.args[0], n.args[1]);
				} else {
					switch (n.datatype) {
						case 'string':
						case 'number':
						case 'boolean':
						case 'date':
						case 'null':
							// all with unknown type
							tmp = [];
							for (i = 0; i < n.args.length; i++) {
								if (n.func === 'constant') tmp.push(n.args[i]);else tmp.push(rec(n.args[i]));
							}

							node = new ValueExpr.ValueExprGeneric(n.datatype, n.func, tmp);
							break;
						default:
							throw 'not implemented yet';
					}
				}
				break;

			case 'statement':
				node = parseStatement(n);

				if (n.select.distinct === false) {
					node.addWarning(i18n.t('db.messages.translate.warning-distinct-missing'), n.codeInfo);
				}
				break;

			case 'renameRelation':
				node = new _execRenameRelation.RenameRelation(rec(n.child), n.newRelAlias);
				break;

			case 'relationFromSubstatement':
				rel = rec(n.statement);
				node = new _execRenameRelation.RenameRelation(rel, n.relAlias);
				break;

			case 'innerJoin':
				node = new _execInnerJoin.InnerJoin(rec(n.child), rec(n.child2), condition);
				break;
			case 'leftOuterJoin':
				node = new _execLeftOuterJoin.LeftOuterJoin(rec(n.child), rec(n.child2), condition);
				break;
			case 'rightOuterJoin':
				node = new _execRightOuterJoin.RightOuterJoin(rec(n.child), rec(n.child2), condition);
				break;
			case 'fullOuterJoin':
				node = new _execFullOuterJoin.FullOuterJoin(rec(n.child), rec(n.child2), condition);
				break;
			case 'crossJoin':
				node = new _execCrossJoin.CrossJoin(rec(n.child), rec(n.child2));
				break;
			case 'naturalJoin':
				node = new _execInnerJoin.InnerJoin(rec(n.child), rec(n.child2), null);
				break;

			case 'union':
				node = new _execUnion.Union(rec(n.child), rec(n.child2));
				break;
			case 'intersect':
				node = new _execIntersect.Intersect(rec(n.child), rec(n.child2));
				break;
			case 'except':
				node = new _execDifference.Difference(rec(n.child), rec(n.child2));
				break;

			case 'orderBy':
				node = (function (n) {
					var orderCols = [];
					var orderAsc = [];
					for (i = 0; i < n.arg.value.length; i++) {
						var e = n.arg.value[i];

						orderAsc.push(e.asc);
						orderCols.push(new _execColumn.Column(e.col.name, e.col.relAlias));
					}
					node = new _execOrderBy.OrderBy(rec(n.child), orderCols, orderAsc);
					return node;
				})(n);
				break;

			case 'limit':
				node = (function (n) {
					var limit = n.limit;
					var offset = n.offset;

					var conditionOffset = new ValueExpr.ValueExprGeneric('boolean', '>', [new ValueExpr.ValueExprGeneric('number', 'rownum', []), new ValueExpr.ValueExprGeneric('number', 'constant', [offset])]);

					if (limit === -1) {
						// === LIMIT ALL => only offset
						node = new _execSelection.Selection(rec(n.child), conditionOffset);
					} else {
						// limit and offset
						var conditionLimit = new ValueExpr.ValueExprGeneric('boolean', '<=', [new ValueExpr.ValueExprGeneric('number', 'rownum', []), new ValueExpr.ValueExprGeneric('number', 'constant', [limit + offset])]);
						node = new _execSelection.Selection(rec(n.child), new ValueExpr.ValueExprGeneric('boolean', 'and', [conditionOffset, conditionLimit]));
					}
					return node;
				})(n);
				break;

			default:
				var e = new Error('type ' + n.type + ' not implemented');
				e.line = n.codeInfo.line;
				e.column = n.codeInfo.column;
				e.codeInfo = n.codeInfo;
				throw e;
		}

		if ((n.type === 'union' || n.type === 'intersect' || n.type === 'except') && n.all === true) {
			node.addWarning(i18n.t('db.messages.translate.warning-ignored-all-on-set-operators'), n.codeInfo);
		}

		if (n.wrappedInBrackets === true) {
			node.setWrappedInBrackets(true);
		}

		setCodeInfoFromNode(node, n);

		return node;
	}

	function getSelection(root, condition, codeInfo) {
		root.check();
		return new _execSelection.Selection(root, rec(condition));
	}

	function parseStatement(statement) {
		var root, i;
		var projectionArgs = statement.select.arg;
		var col;
		var projections;

		// from-CLAUSE
		root = rec(statement.from);
		setCodeInfoFromNode(root, statement.from);
		root.check();

		// selection
		if (statement.where !== null) {
			root = getSelection(root, statement.where.arg, statement.where.codeInfo);
			setCodeInfoFromNode(root, statement.where);
		}

		// groupby + aggregation
		if (statement.groupBy !== null || statement.numAggregationColumns > 0) {
			var aggregateFunctions = [];
			var groupByCols = statement.groupBy || [];

			// filter aggFunctions from SELECT list
			for (i = 0; i < projectionArgs.length; i++) {
				col = projectionArgs[i];
				if (col.type === 'aggFunction') aggregateFunctions.push(col);
			}

			if (aggregateFunctions.length > 0) root = new _execGroupBy.GroupBy(root, groupByCols, aggregateFunctions);else {
				// use projection if no aggregation is used
				projections = [];
				for (i = 0; i < groupByCols.length; i++) {
					col = groupByCols[i];
					projections.push(new _execColumn.Column(col.name, col.relAlias));
				}
				root = new _execProjection.Projection(root, projections);
			}
		}

		// having
		if (statement.having !== null) {
			root = getSelection(root, statement.having.arg, statement.having.codeInfo);
			setCodeInfoFromNode(root, statement.having);
		}

		// projection
		var colsRenamed = false;
		if (projectionArgs.length == 1 && projectionArgs[0].type === 'column' && projectionArgs[0].name === '*' && projectionArgs[0].relAlias === null) {
			// select * => no projection needed
		} else {
				projections = [];
				for (i = 0; i < projectionArgs.length; i++) {
					col = projectionArgs[i];

					if (col.type === 'aggFunction') {
						projections.push(new _execColumn.Column(col.name, null)); // has been renamed by gamma
					} else if (col.type === 'namedColumnExpr') {
							projections.push({
								name: col.name,
								relAlias: col.relAlias,
								child: rec(col.child)
							});
						} else if (col.type === 'column') {
							// normal columns
							projections.push(new _execColumn.Column(col.name, col.relAlias));

							if (col.alias !== null) colsRenamed = true;
						} else {
							throw 'this should not happen';
						}
				}
				root = new _execProjection.Projection(root, projections);
				setCodeInfoFromNode(root, statement.select);
			}

		// rename columns
		if (colsRenamed === true) {
			root = new _execRenameColumns.RenameColumns(root);

			for (i = 0; i < projectionArgs.length; i++) {
				if (projectionArgs[i].type === 'column' && projectionArgs[i].alias !== null) {
					root.addRenaming(projectionArgs[i].alias, projectionArgs[i].name, projectionArgs[i].relAlias);
				}
			}
		}

		return root;
	}

	return rec(astRoot.child);
}

// translates a RA-AST to RA

function relalgFromRelalgAstRoot(astRoot, relations) {
	// root is the real root node! of a statement
	return relalgFromRelalgAstNode(astRoot.child, relations);
}

/**
 * translates a RA-AST node to RA
 * @param   {Object} astNode   a node of a RA-AST
 * @param   {Object} relations hash of the relations that could be used in the statement
 * @returns {Object} an actual RA-expression
 */

function relalgFromRelalgAstNode(astNode, relations) {
	function rec(n) {
		var node;
		var child, i, e, condition, tmp;

		switch (n.type) {
			case 'relation':
				if (typeof relations[n.name] == 'undefined') {
					e = new Error(i18n.t('db.messages.translate.error-relation-not-found', { name: n.name }));
					e.line = n.codeInfo.line;
					e.column = n.codeInfo.column;
					e.codeInfo = n.codeInfo;
					throw e;
				}
				node = relations[n.name].copy();
				break;

			case 'table':
				var schema = new _execSchema.Schema();

				var col;
				for (i = 0; i < n.columns.length; i++) {
					col = n.columns[i];
					schema.addColumn(col.name, col.relAlias, col.type);
				}

				var rel = new _execRelation.Relation(n.name);
				rel.setSchema(schema, true);
				rel.addRows(n.rows);
				rel.setMetaData('isInlineRelation', true);
				rel.setMetaData('inlineRelationDefinition', n.codeInfo.text);
				//TODO: inlineRelationDefinition should be replaced; there should be a generic way to get the definition of a node
				node = rel;
				break;

			case 'selection':
				child = rec(n.child);
				condition = rec(n.arg);
				node = new _execSelection.Selection(child, condition);
				break;

			case 'valueExpr':
				if (n.datatype == 'null' && n.func === 'columnValue') {
					node = new ValueExpr.ValueExprColumnValue(n.args[0], n.args[1]);
				} else {
					switch (n.datatype) {
						case 'string':
						case 'number':
						case 'boolean':
						case 'date':
						case 'null':
							// all with unknown type
							tmp = [];
							for (i = 0; i < n.args.length; i++) {
								if (n.func === 'constant') tmp.push(n.args[i]);else tmp.push(rec(n.args[i]));
							}

							node = new ValueExpr.ValueExprGeneric(n.datatype, n.func, tmp);
							break;
						default:
							throw 'not implemented yet';
					}
				}
				break;

			case 'projection':
				child = rec(n.child);
				var projections = [];
				for (i = 0; i < n.arg.length; i++) {

					e = n.arg[i];

					if (e.type === 'columnName') {
						projections.push(new _execColumn.Column(e.name, e.relAlias));
					} else if (e.type === 'namedColumnExpr') {
						// namedColumnExpr
						projections.push({
							name: e.name,
							relAlias: e.relAlias,
							child: rec(e.child)
						});
					} else {
						throw 'should not happen';
					}
				}

				node = new _execProjection.Projection(child, projections);
				break;

			case 'orderBy':
				child = rec(n.child);
				var orderCols = [];
				var orderAsc = [];

				for (i = 0; i < n.arg.length; i++) {
					e = n.arg[i];

					orderAsc.push(e.asc);
					orderCols.push(new _execColumn.Column(e.col.name, e.col.relAlias));
				}

				node = new _execOrderBy.OrderBy(child, orderCols, orderAsc);
				break;

			case 'groupBy':
				child = rec(n.child);
				var aggregateFunctions = n.aggregate;
				var groupByCols = n.group;

				node = new _execGroupBy.GroupBy(child, groupByCols, aggregateFunctions);
				break;

			case 'union':
				node = new _execUnion.Union(rec(n.child), rec(n.child2));
				break;

			case 'intersect':
				node = new _execIntersect.Intersect(rec(n.child), rec(n.child2));
				break;

			case 'division':
				node = new _execDivision.Division(rec(n.child), rec(n.child2));
				break;

			case 'difference':
				node = new _execDifference.Difference(rec(n.child), rec(n.child2));
				break;

			case 'renameColumns':
				var ren = new _execRenameColumns.RenameColumns(rec(n.child));

				for (i = 0; i < n.arg.length; i++) {
					e = n.arg[i];

					ren.addRenaming(e.dst, e.src.name, e.src.relAlias);
				}

				node = ren;
				break;

			case 'renameRelation':
				node = new _execRenameRelation.RenameRelation(rec(n.child), n.newRelAlias);
				break;

			case 'thetaJoin':
				condition = rec(n.arg);
				node = new _execInnerJoin.InnerJoin(rec(n.child), rec(n.child2), condition);
				break;

			case 'crossJoin':
				node = new _execCrossJoin.CrossJoin(rec(n.child), rec(n.child2));
				break;

			case 'naturalJoin':
				node = new _execInnerJoin.InnerJoin(rec(n.child), rec(n.child2), null);
				break;

			case 'leftSemiJoin':
				node = new _execSemiJoin.SemiJoin(rec(n.child), rec(n.child2), true);
				break;

			case 'rightSemiJoin':
				node = new _execSemiJoin.SemiJoin(rec(n.child), rec(n.child2), false);
				break;

			case 'antiJoin':
				node = new _execAntiJoin.AntiJoin(rec(n.child), rec(n.child2));
				break;

			case 'leftOuterJoin':
				condition = n.arg === null ? null : rec(n.arg);
				node = new _execLeftOuterJoin.LeftOuterJoin(rec(n.child), rec(n.child2), condition);
				break;

			case 'rightOuterJoin':
				condition = n.arg === null ? null : rec(n.arg);
				node = new _execRightOuterJoin.RightOuterJoin(rec(n.child), rec(n.child2), condition);
				break;

			case 'fullOuterJoin':
				condition = n.arg === null ? null : rec(n.arg);
				node = new _execFullOuterJoin.FullOuterJoin(rec(n.child), rec(n.child2), condition);
				break;

			default:
				e = new Error('type ' + n.type + ' not implemented');
				if (n.codeInfo) {
					e.line = n.codeInfo.line;
					e.column = n.codeInfo.column;
					e.codeInfo = n.codeInfo;
				}
				throw e;
		}

		node.setCodeInfo(n.codeInfo.line, n.codeInfo.column, n.codeInfo.offset, n.codeInfo.text);

		if (typeof n.metaData != 'undefined') {
			for (var key in n.metaData) {
				if (!n.metaData.hasOwnProperty(key)) continue;

				node.setMetaData(key, n.metaData[key]);
			}
		}

		if (n.wrappedInBrackets === true) {
			node.setWrappedInBrackets(true);
		}

		return node;
	}

	return rec(astNode);
}

},{"../exec/AntiJoin":83,"../exec/Column":84,"../exec/CrossJoin":85,"../exec/Difference":86,"../exec/Division":87,"../exec/FullOuterJoin":89,"../exec/GroupBy":90,"../exec/InnerJoin":91,"../exec/Intersect":92,"../exec/LeftOuterJoin":94,"../exec/OrderBy":95,"../exec/Projection":96,"../exec/RANode":97,"../exec/Relation":98,"../exec/RenameColumns":99,"../exec/RenameRelation":100,"../exec/RightOuterJoin":101,"../exec/Schema":102,"../exec/Selection":103,"../exec/SemiJoin":104,"../exec/Table":105,"../exec/Union":106,"../exec/ValueExpr":107,"babel-runtime/helpers/interop-require-wildcard":13}],112:[function(require,module,exports){
/**
 * replaces all variables with there definition in the assignments of a RA statement
 * @param root
 * @param predefinedRelations
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.replaceVariables = replaceVariables;

function replaceVariables(root, predefinedRelations) {
	// root is the real root node! of a statement

	// find all relations used in this branch (recursively)
	function getRelationsIn(root, whiteList) {
		var a = [];
		function rec(parent, attrName, a) {
			var child = parent[attrName];

			if (child.type === 'statement') {
				// SQL statement
				rec(child, 'from', a);
			}

			if (child.type === 'relation' && typeof whiteList[child.name] !== 'undefined') {
				// replace
				a.push({
					name: child.name,
					line: child.line,
					column: child.column
				});
				return;
			}

			if (typeof child.child !== 'undefined' && child.child !== null) {
				rec(child, 'child', a);
			}

			if (typeof child.child2 !== 'undefined' && child.child2 !== null) {
				rec(child, 'child2', a);
			}
		}
		rec(root, 'child', a);
		return a;
	}

	if (root.assignments.length > 0) {
		var variables = {};
		var variableNames = {};
		var i;

		// names of declared variables
		for (i = 0; i < root.assignments.length; i++) {
			variableNames[root.assignments[i].name] = true;
		}

		for (i = 0; i < root.assignments.length; i++) {
			var name = root.assignments[i].name;
			var child = root.assignments[i].child;
			var childRelations = getRelationsIn(root.assignments[i], variableNames);

			if (typeof predefinedRelations[name] != 'undefined' || typeof variables[name] != 'undefined') {
				var e = new Error(i18n.t('db.messages.translate.error-variable-name-conflict', { name: name }));
				e.line = root.assignments[i].line;
				e.column = root.assignments[i].column;
				throw e;
			}

			// save the origin of the node
			if (!child.metaData) child.metaData = {};
			child.metaData.fromVariable = name;

			//replace_var(name, root.child, child);
			variables[name] = {
				name: name,
				child: child, // definition
				assignmentIndex: i,
				childRelations: childRelations // variables/relations used in definition
			};
		}

		// check for cycles with Depth-first search
		var visited = {};
		var finished = {};
		for (i in variables) {
			if (!variables.hasOwnProperty(i)) continue;

			visited[i] = false;
			finished[i] = false;
		}
		var dfs = function dfs(name, variables, visited, finished) {
			if (finished[name] === true) return;
			if (visited[name] === true) {
				throw new Error(i18n.t('db.messages.translate.error-variable-cyclic-usage', { name: name }));
			}
			visited[name] = true;

			var childRelations = variables[name].childRelations;
			for (var i = 0; i < childRelations.length; i++) {
				dfs(childRelations[i].name, variables, visited, finished);
			}
			finished[name] = true;
		};

		for (i in variables) {
			if (!variables.hasOwnProperty(i)) continue;

			dfs(i, variables, visited, finished);
		}

		// replace
		// replaces all ocurrencies of a variable named _name_ in root with child
		var replace2 = function replace2(parent, attrName, name, newChild) {
			var child = parent[attrName];

			if (child.type === 'statement') {
				// SQL statement
				replace2(child, 'from', name, newChild);
			}

			if (child.type == 'relation' && child.name == name) {
				// replace
				parent[attrName] = newChild;
				parent[attrName].wrappedInBrackets = true;
				return;
			}

			if (typeof child.child != 'undefined' && child.child !== null) {
				replace2(child, 'child', name, newChild);
			}

			if (typeof child.child2 != 'undefined' && child.child2 !== null) {
				replace2(child, 'child2', name, newChild);
			}
		};

		// replace all vars in all vars (except it selves)
		for (i in variables) {
			if (!variables.hasOwnProperty(i)) continue;

			for (var j in variables) {
				if (!variables.hasOwnProperty(j) || i == j) {
					continue;
				}

				replace2(variables[i], 'child', j, variables[j].child);

				// update variable in root node
				root.assignments[variables[i].assignmentIndex].child = variables[i].child;
			}
		}

		// replace vars in the roots child == the statement (if there is one)
		if (root.child !== null && typeof root.child !== 'undefined') {
			for (i in variables) {
				if (!variables.hasOwnProperty(i)) continue;

				replace2(root, 'child', i, variables[i].child);
			}
		}
	} // end if assignments.length > 0
}

},{}],113:[function(require,module,exports){
// builds the formated text version of a group
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.textFromGroupAstRoot = textFromGroupAstRoot;
exports.textFromRelalgAstRoot = textFromRelalgAstRoot;
exports.textFromRelalgAstNode = textFromRelalgAstNode;

function textFromGroupAstRoot(astRoot) {
	'use strict';

	if (astRoot.type !== 'groupRoot') throw new Error('wrong ast!?');
	var s = '';

	function group_to_text(group) {
		var s = '';
		// header
		for (var name in group.headers) {
			if (!group.headers.hasOwnProperty(name)) continue;

			s += name + ':';

			if (group.headers[name].indexOf('\n') !== -1) {
				s += '[[' + group.headers[name] + ']]\n';
			} else s += group.headers[name] + '\n';
		}
		s += '\n';

		// body
		for (var i = 0; i < group.assignments.length; i++) {
			s += group.assignments[i].name + ' = ';
			s += textFromRelalgAstNode(group.assignments[i].child);
			s += '\n\n';
		}

		return s;
	}

	for (var i = 0; i < astRoot.groups.length; i++) {
		s += group_to_text(astRoot.groups[i]);

		if (i !== astRoot.groups.length - 1) s += '\n\n\n\n';
	}

	return s;
}

// builds the formated text version of a relalg root

function textFromRelalgAstRoot(root) {
	'use strict';

	if (root.type !== 'root') throw new Error('wrong ast!?');
	var s = '';

	// assignments
	for (var i = 0; i < root.assignments.length; i++) {
		s += root.assignments[i].name + ' = ';
		s += textFromRelalgAstNode(root.assignments[i].child);
		s += '\n\n';
	}

	s += textFromRelalgAstNode(root.child);

	return s;
}

function textFromRelalgAstNode(node) {
	'use strict';

	function unaryFormula(className, funcName, argument, body) {
		var s = $('<span>'); //TODO: remove jquery!
		if (className !== null) s.addClass(className);

		if (funcName !== null) s.append(funcName);

		if (argument !== null) {
			var sub = $('<sub>');
			sub.append(argument);
			s.append(' ').append(sub);
		}

		if (body !== null) s.append(' ( ').append(body).append(' ) ');
		return s.text();
	}
	function binaryFormula(className, funcName, argument, child, child2) {
		var s = $('<span>');
		if (className !== null) s.addClass(className);

		s.append('( ').append(child).append(' ) ');

		s.append(funcName);
		if (argument !== null) {
			var sub = $('<sub>');
			sub.append(argument);
			s.append(sub);
		}

		s.append(' ( ').append(child2).append(' ) ');
		return s.text();
	}
	function columnName(name, relAlias) {
		if (typeof name === 'number') name = '[' + name + ']';

		if (relAlias === null) return name;
		return relAlias + '.' + name;
	}
	function comparison(className, comperator, child, child2, ltr) {
		var s = $('<span>');
		if (className !== null) s.addClass(className);

		if (ltr === true) s.append(child);else s.append(child2);

		var c = comperator;

		// nice comperator symbol
		switch (comperator) {
			case '!=':
				c = '≠';
				break;
			case '>=':
				c = '≥';
				break;
			case '<=':
				c = '≤';
				break;
		}
		s.append(c);

		if (ltr === true) s.append(child2);else s.append(child);

		return s.text();
	}
	function booleanOp(className, operator, child, child2) {
		var s = $('<span>');
		if (className !== null) s.addClass(className);

		s.append('(').append(child).append(') ');
		s.append(operator);
		s.append(' (').append(child2).append(')');
		return s.text();
	}
	function value(val, type) {
		if (val === null || type === 'null') return 'null';

		if (val instanceof Date) return val.getFullYear() + '-' + (val.getMonth() + 1 < 10 ? '0' + (val.getMonth() + 1) : val.getMonth() + 1) + '-' + (val.getDate() < 10 ? '0' + val.getDate() : val.getDate());else if (typeof val === 'string') return "'" + val + "'";else if (typeof val === 'number') return val.toString();else throw new Error('unknown type ' + type);
	}
	function variable(name) {
		var s = $('<span>');
		s.append(name);
		return s.text();
	}
	function formatInlineTable(rows, delimiter, compact) {
		// calculate max length per column
		var colLengths = [];
		if (compact === false) {
			for (var i = 0; i < rows.length; i++) {
				for (var j = 0; j < rows[i].length; j++) {
					var _length = rows[i][j].length;
					if (i === 0 || _length > colLengths[j]) {
						colLengths[j] = _length;
					}
				}
			}
		}

		// build output
		var s = '{\n';

		for (var i = 0; i < rows.length; i++) {
			for (var j = 0; j < rows[i].length; j++) {
				if (compact === false) {
					// pad with spaces (right)
					rows[i][j] = rows[i][j] + new Array(colLengths[j] + 1 - rows[i][j].length).join(' ');
				}
			}
			if (compact === false) {
				s += '\t';
			}
			s += rows[i].join(delimiter) + '\n';
		}

		return s + '}';
	}

	function rec(n) {
		// π σ ρ ←   ∧ ∨   ≠ = ¬ ≥ ≤   ∩ ∪ ÷ -   ✕ ⋈ ⟕ ⟖ ⟗ ⋉ ⋊

		switch (n.type) {
			case 'relation':
				return unaryFormula(n.type, n.name, null, null);

			case 'table':
				{
					var rows = [];

					// header
					var row = [];
					for (var i = 0; i < n.columns.length; i++) {
						var col = n.columns[i];

						row.push(columnName(col.name, col.relAlias) + ':' + col.type);
					}
					rows.push(row);

					// rows
					for (var i = 0; i < n.rows.length; i++) {
						row = [];
						for (var j = 0; j < n.rows[i].length; j++) {
							row.push(value(n.rows[i][j]));
						}
						rows.push(row);
					}
					return formatInlineTable(rows, ', ', false);
				}
			case 'selection':
				return unaryFormula(n.type, 'σ', rec(n.arg), rec(n.child));

			case 'projection':
				{
					var args = [];
					for (var i = 0; i < n.arg.length; i++) {
						args.push(columnName(n.arg[i].name, n.arg[i].relAlias));
					}

					return unaryFormula(n.type, 'π', args.join(', '), rec(n.child));
				}
			case 'union':
				return binaryFormula(n.type, '∪', null, rec(n.child), rec(n.child2));

			case 'intersect':
				return binaryFormula(n.type, '∩', null, rec(n.child), rec(n.child2));

			case 'division':
				return binaryFormula(n.type, '÷', null, rec(n.child), rec(n.child2));

			case 'difference':
				return binaryFormula(n.type, '-', null, rec(n.child), rec(n.child2));

			case 'renameColumns':
				{
					var args = [];
					for (var i = 0; i < n.arg.length; i++) {
						var e = n.arg[i];
						args.push(e.dst + '←' + columnName(e.src.name, e.src.relAlias));
					}

					return unaryFormula(n.type, 'ρ', args.join(', '), rec(n.child));
				}
			case 'renameRelation':
				return unaryFormula(n.type, 'ρ', n.newRelAlias, rec(n.child));

			case 'orderBy':
				{
					var args = [];
					for (var i = 0; i < n.arg.length; i++) {
						var e = n.arg[i];
						var s = columnName(e.col.name, e.col.relAlias) + ' ' + (e.asc ? 'asc' : 'desc');
						args.push(s);
					}

					return unaryFormula(n.type, 'ψ', args.join(', '), rec(n.child));
				}
			case 'groupBy':
				{
					var argument = '';
					var tmp = [];

					// group
					if (n.group.length > 0) {
						for (var i = 0; i < n.group.length; i++) {
							tmp.push(columnName(n.group[i].name, n.group[i].relAlias));
						}
						argument += tmp.join(', ') + ' ; ';
					}

					// aggregate
					tmp = [];
					for (var i = 0; i < n.aggregate.length; i++) {
						var f = n.aggregate[i];
						//tmp.push(f.name + '←');

						if (f.aggFunction == 'COUNT_ALL') tmp.push(f.name + ' ← COUNT(*)');else tmp.push(f.name + ' ← ' + f.aggFunction + '(' + columnName(f.col.name, f.col.relAlias) + ')');
					}
					argument += tmp.join(', ');

					return unaryFormula(n.type, 'γ', argument, rec(n.child));
				}
			case 'thetaJoin':
				return binaryFormula(n.type, '⋈', rec(n.arg), rec(n.child), rec(n.child2));

			case 'crossJoin':
				return binaryFormula(n.type, '⨯', null, rec(n.child), rec(n.child2));

			case 'naturalJoin':
				return binaryFormula(n.type, '⋈', null, rec(n.child), rec(n.child2));

			case 'leftSemiJoin':
				return binaryFormula(n.type, '⋉', null, rec(n.child), rec(n.child2));

			case 'rightSemiJoin':
				return binaryFormula(n.type, '⋊', null, rec(n.child), rec(n.child2));

			case 'antiJoin':
				return binaryFormula(n.type, '▷', null, rec(n.child), rec(n.child2));

			case 'leftOuterJoin':
				{
					var condition = n.arg === null ? null : rec(n.arg);
					return binaryFormula(n.type, '⟕', condition, rec(n.child), rec(n.child2));
				}
			case 'rightOuterJoin':
				{
					var condition = n.arg === null ? null : rec(n.arg);
					return binaryFormula(n.type, '⟖', condition, rec(n.child), rec(n.child2));
				}
			case 'fullOuterJoin':
				{
					var condition = n.arg === null ? null : rec(n.arg);
					return binaryFormula(n.type, '⟗', condition, rec(n.child), rec(n.child2));
				}

			case 'ConditionConst':
				return unaryFormula(n.type, n.value + '', null, null);

			case 'ConditionAnd':
				return booleanOp(n.type, '∧', rec(n.child), rec(n.child2));

			case 'ConditionNot':
				return unaryFormula(n.type, '¬', null, rec(n.child));

			case 'ConditionOr':
				return booleanOp(n.type, '∨', rec(n.child), rec(n.child2));

			case 'ConditionColEqualsValue':
				return comparison(n.type, n.comperator, columnName(n.col.name, n.col.relAlias), value(n.value, n.valType), n.ltr);

			case 'ConditionColEqualsCol':
				return comparison(n.type, n.comperator, columnName(n.col.name, n.col.relAlias), columnName(n.col2.name, n.col2.relAlias), false);

			case 'variable':
				return variable(n.name);

			default:
				throw new Error('type ' + n.type + ' not implemented');
		}
	}

	return rec(node);
}

},{}]},{},[82])
//# sourceMappingURL=calculator.bundle.js.map
