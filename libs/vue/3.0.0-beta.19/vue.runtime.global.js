var Vue = (function (exports) {
  'use strict';

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   * IMPORTANT: all calls of this function must be prefixed with
   * \/\*#\_\_PURE\_\_\*\/
   * So that rollup can tree-shake them if necessary.
   */
  function makeMap(str, expectsLowerCase) {
      const map = Object.create(null);
      const list = str.split(',');
      for (let i = 0; i < list.length; i++) {
          map[list[i]] = true;
      }
      return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
  }

  const GLOBALS_WHITE_LISTED = 'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
      'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
      'Object,Boolean,String,RegExp,Map,Set,JSON,Intl';
  const isGloballyWhitelisted = /*#__PURE__*/ makeMap(GLOBALS_WHITE_LISTED);

  /**
   * On the client we only need to offer special cases for boolean attributes that
   * have different names from their corresponding dom properties:
   * - itemscope -> N/A
   * - allowfullscreen -> allowFullscreen
   * - formnovalidate -> formNoValidate
   * - ismap -> isMap
   * - nomodule -> noModule
   * - novalidate -> noValidate
   * - readonly -> readOnly
   */
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /*#__PURE__*/ makeMap(specialBooleanAttrs);

  function normalizeStyle(value) {
      if (isArray(value)) {
          const res = {};
          for (let i = 0; i < value.length; i++) {
              const item = value[i];
              const normalized = normalizeStyle(isString(item) ? parseStringStyle(item) : item);
              if (normalized) {
                  for (const key in normalized) {
                      res[key] = normalized[key];
                  }
              }
          }
          return res;
      }
      else if (isObject(value)) {
          return value;
      }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:(.+)/;
  function parseStringStyle(cssText) {
      const ret = {};
      cssText.split(listDelimiterRE).forEach(item => {
          if (item) {
              const tmp = item.split(propertyDelimiterRE);
              tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
          }
      });
      return ret;
  }
  function normalizeClass(value) {
      let res = '';
      if (isString(value)) {
          res = value;
      }
      else if (isArray(value)) {
          for (let i = 0; i < value.length; i++) {
              res += normalizeClass(value[i]) + ' ';
          }
      }
      else if (isObject(value)) {
          for (const name in value) {
              if (value[name]) {
                  res += name + ' ';
              }
          }
      }
      return res.trim();
  }

  // These tag configs are shared between compiler-dom and runtime-dom, so they
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element
  const HTML_TAGS = 'html,body,base,head,link,meta,style,title,address,article,aside,footer,' +
      'header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,' +
      'figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,' +
      'data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,' +
      'time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,' +
      'canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,' +
      'th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,' +
      'option,output,progress,select,textarea,details,dialog,menu,menuitem,' +
      'summary,content,element,shadow,template,blockquote,iframe,tfoot';
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Element
  const SVG_TAGS = 'svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,' +
      'defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,' +
      'feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,' +
      'feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,' +
      'feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,' +
      'fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,' +
      'foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,' +
      'mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,' +
      'polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,' +
      'text,textPath,title,tspan,unknown,use,view';
  const isHTMLTag = /*#__PURE__*/ makeMap(HTML_TAGS);
  const isSVGTag = /*#__PURE__*/ makeMap(SVG_TAGS);

  function looseEqual(a, b) {
      if (a === b)
          return true;
      const isObjectA = isObject(a);
      const isObjectB = isObject(b);
      if (isObjectA && isObjectB) {
          try {
              const isArrayA = isArray(a);
              const isArrayB = isArray(b);
              if (isArrayA && isArrayB) {
                  return (a.length === b.length &&
                      a.every((e, i) => looseEqual(e, b[i])));
              }
              else if (a instanceof Date && b instanceof Date) {
                  return a.getTime() === b.getTime();
              }
              else if (!isArrayA && !isArrayB) {
                  const keysA = Object.keys(a);
                  const keysB = Object.keys(b);
                  return (keysA.length === keysB.length &&
                      keysA.every(key => looseEqual(a[key], b[key])));
              }
              else {
                  /* istanbul ignore next */
                  return false;
              }
          }
          catch (e) {
              /* istanbul ignore next */
              return false;
          }
      }
      else if (!isObjectA && !isObjectB) {
          return String(a) === String(b);
      }
      else {
          return false;
      }
  }
  function looseIndexOf(arr, val) {
      return arr.findIndex(item => looseEqual(item, val));
  }

  // For converting {{ interpolation }} values to displayed strings.
  const toDisplayString = (val) => {
      return val == null
          ? ''
          : isObject(val)
              ? JSON.stringify(val, replacer, 2)
              : String(val);
  };
  const replacer = (_key, val) => {
      if (val instanceof Map) {
          return {
              [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val]) => {
                  entries[`${key} =>`] = val;
                  return entries;
              }, {})
          };
      }
      else if (val instanceof Set) {
          return {
              [`Set(${val.size})`]: [...val.values()]
          };
      }
      else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
          return String(val);
      }
      return val;
  };

  const EMPTY_OBJ =  Object.freeze({})
      ;
  const EMPTY_ARR = [];
  const NOOP = () => { };
  /**
   * Always return false.
   */
  const NO = () => false;
  const onRE = /^on[^a-z]/;
  const isOn = (key) => onRE.test(key);
  const extend = Object.assign;
  const remove = (arr, el) => {
      const i = arr.indexOf(el);
      if (i > -1) {
          arr.splice(i, 1);
      }
  };
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const isArray = Array.isArray;
  const isFunction = (val) => typeof val === 'function';
  const isString = (val) => typeof val === 'string';
  const isSymbol = (val) => typeof val === 'symbol';
  const isObject = (val) => val !== null && typeof val === 'object';
  const isPromise = (val) => {
      return isObject(val) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
      return toTypeString(value).slice(8, -1);
  };
  const isPlainObject = (val) => toTypeString(val) === '[object Object]';
  const isReservedProp = /*#__PURE__*/ makeMap('key,ref,' +
      'onVnodeBeforeMount,onVnodeMounted,' +
      'onVnodeBeforeUpdate,onVnodeUpdated,' +
      'onVnodeBeforeUnmount,onVnodeUnmounted');
  const cacheStringFunction = (fn) => {
      const cache = Object.create(null);
      return ((str) => {
          const hit = cache[str];
          return hit || (cache[str] = fn(str));
      });
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction((str) => {
      return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));
  });
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction((str) => {
      return str.replace(hyphenateRE, '-$1').toLowerCase();
  });
  const capitalize = cacheStringFunction((str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
  });
  // compare whether a value has changed, accounting for NaN.
  const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);
  const invokeArrayFns = (fns, arg) => {
      for (let i = 0; i < fns.length; i++) {
          fns[i](arg);
      }
  };
  const def = (obj, key, value) => {
      Object.defineProperty(obj, key, {
          configurable: true,
          enumerable: false,
          value
      });
  };
  const toNumber = (val) => {
      const n = parseFloat(val);
      return isNaN(n) ? val : n;
  };

  const targetMap = new WeakMap();
  const effectStack = [];
  let activeEffect;
  const ITERATE_KEY = Symbol( 'iterate' );
  const MAP_KEY_ITERATE_KEY = Symbol( 'Map key iterate' );
  function isEffect(fn) {
      return fn && fn._isEffect === true;
  }
  function effect(fn, options = EMPTY_OBJ) {
      if (isEffect(fn)) {
          fn = fn.raw;
      }
      const effect = createReactiveEffect(fn, options);
      if (!options.lazy) {
          effect();
      }
      return effect;
  }
  function stop(effect) {
      if (effect.active) {
          cleanup(effect);
          if (effect.options.onStop) {
              effect.options.onStop();
          }
          effect.active = false;
      }
  }
  let uid = 0;
  function createReactiveEffect(fn, options) {
      const effect = function reactiveEffect(...args) {
          if (!effect.active) {
              return options.scheduler ? undefined : fn(...args);
          }
          if (!effectStack.includes(effect)) {
              cleanup(effect);
              try {
                  enableTracking();
                  effectStack.push(effect);
                  activeEffect = effect;
                  return fn(...args);
              }
              finally {
                  effectStack.pop();
                  resetTracking();
                  activeEffect = effectStack[effectStack.length - 1];
              }
          }
      };
      effect.id = uid++;
      effect._isEffect = true;
      effect.active = true;
      effect.raw = fn;
      effect.deps = [];
      effect.options = options;
      return effect;
  }
  function cleanup(effect) {
      const { deps } = effect;
      if (deps.length) {
          for (let i = 0; i < deps.length; i++) {
              deps[i].delete(effect);
          }
          deps.length = 0;
      }
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = false;
  }
  function enableTracking() {
      trackStack.push(shouldTrack);
      shouldTrack = true;
  }
  function resetTracking() {
      const last = trackStack.pop();
      shouldTrack = last === undefined ? true : last;
  }
  function track(target, type, key) {
      if (!shouldTrack || activeEffect === undefined) {
          return;
      }
      let depsMap = targetMap.get(target);
      if (!depsMap) {
          targetMap.set(target, (depsMap = new Map()));
      }
      let dep = depsMap.get(key);
      if (!dep) {
          depsMap.set(key, (dep = new Set()));
      }
      if (!dep.has(activeEffect)) {
          dep.add(activeEffect);
          activeEffect.deps.push(dep);
          if ( activeEffect.options.onTrack) {
              activeEffect.options.onTrack({
                  effect: activeEffect,
                  target,
                  type,
                  key
              });
          }
      }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
      const depsMap = targetMap.get(target);
      if (!depsMap) {
          // never been tracked
          return;
      }
      const effects = new Set();
      const add = (effectsToAdd) => {
          if (effectsToAdd) {
              effectsToAdd.forEach(effect => {
                  if (effect !== activeEffect || !shouldTrack) {
                      effects.add(effect);
                  }
              });
          }
      };
      if (type === "clear" /* CLEAR */) {
          // collection being cleared
          // trigger all effects for target
          depsMap.forEach(add);
      }
      else if (key === 'length' && isArray(target)) {
          depsMap.forEach((dep, key) => {
              if (key === 'length' || key >= newValue) {
                  add(dep);
              }
          });
      }
      else {
          // schedule runs for SET | ADD | DELETE
          if (key !== void 0) {
              add(depsMap.get(key));
          }
          // also run for iteration key on ADD | DELETE | Map.SET
          const isAddOrDelete = type === "add" /* ADD */ ||
              (type === "delete" /* DELETE */ && !isArray(target));
          if (isAddOrDelete ||
              (type === "set" /* SET */ && target instanceof Map)) {
              add(depsMap.get(isArray(target) ? 'length' : ITERATE_KEY));
          }
          if (isAddOrDelete && target instanceof Map) {
              add(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
      }
      const run = (effect) => {
          if ( effect.options.onTrigger) {
              effect.options.onTrigger({
                  effect,
                  target,
                  key,
                  type,
                  newValue,
                  oldValue,
                  oldTarget
              });
          }
          if (effect.options.scheduler) {
              effect.options.scheduler(effect);
          }
          else {
              effect();
          }
      };
      effects.forEach(run);
  }

  const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol)
      .map(key => Symbol[key])
      .filter(isSymbol));
  const get = /*#__PURE__*/ createGetter();
  const shallowGet = /*#__PURE__*/ createGetter(false, true);
  const readonlyGet = /*#__PURE__*/ createGetter(true);
  const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true);
  const arrayInstrumentations = {};
  ['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
      arrayInstrumentations[key] = function (...args) {
          const arr = toRaw(this);
          for (let i = 0, l = this.length; i < l; i++) {
              track(arr, "get" /* GET */, i + '');
          }
          // we run the method using the original args first (which may be reactive)
          const res = arr[key](...args);
          if (res === -1 || res === false) {
              // if that didn't work, run it again using raw values.
              return arr[key](...args.map(toRaw));
          }
          else {
              return res;
          }
      };
  });
  function createGetter(isReadonly = false, shallow = false) {
      return function get(target, key, receiver) {
          if (key === "__v_isReactive" /* IS_REACTIVE */) {
              return !isReadonly;
          }
          else if (key === "__v_isReadonly" /* IS_READONLY */) {
              return isReadonly;
          }
          else if (key === "__v_raw" /* RAW */ &&
              receiver ===
                  (isReadonly
                      ? target["__v_readonly" /* READONLY */]
                      : target["__v_reactive" /* REACTIVE */])) {
              return target;
          }
          const targetIsArray = isArray(target);
          if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
              return Reflect.get(arrayInstrumentations, key, receiver);
          }
          const res = Reflect.get(target, key, receiver);
          if (isSymbol(key)
              ? builtInSymbols.has(key)
              : key === `__proto__` || key === `__v_isRef`) {
              return res;
          }
          if (!isReadonly) {
              track(target, "get" /* GET */, key);
          }
          if (shallow) {
              return res;
          }
          if (isRef(res)) {
              // ref unwrapping, only for Objects, not for Arrays.
              return targetIsArray ? res : res.value;
          }
          if (isObject(res)) {
              // Convert returned value into a proxy as well. we do the isObject check
              // here to avoid invalid value warning. Also need to lazy access readonly
              // and reactive here to avoid circular dependency.
              return isReadonly ? readonly(res) : reactive(res);
          }
          return res;
      };
  }
  const set = /*#__PURE__*/ createSetter();
  const shallowSet = /*#__PURE__*/ createSetter(true);
  function createSetter(shallow = false) {
      return function set(target, key, value, receiver) {
          const oldValue = target[key];
          if (!shallow) {
              value = toRaw(value);
              if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
                  oldValue.value = value;
                  return true;
              }
          }
          const hadKey = hasOwn(target, key);
          const result = Reflect.set(target, key, value, receiver);
          // don't trigger if target is something up in the prototype chain of original
          if (target === toRaw(receiver)) {
              if (!hadKey) {
                  trigger(target, "add" /* ADD */, key, value);
              }
              else if (hasChanged(value, oldValue)) {
                  trigger(target, "set" /* SET */, key, value, oldValue);
              }
          }
          return result;
      };
  }
  function deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      const oldValue = target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
          trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
      }
      return result;
  }
  function has(target, key) {
      const result = Reflect.has(target, key);
      track(target, "has" /* HAS */, key);
      return result;
  }
  function ownKeys(target) {
      track(target, "iterate" /* ITERATE */, ITERATE_KEY);
      return Reflect.ownKeys(target);
  }
  const mutableHandlers = {
      get,
      set,
      deleteProperty,
      has,
      ownKeys
  };
  const readonlyHandlers = {
      get: readonlyGet,
      has,
      ownKeys,
      set(target, key) {
          {
              console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
          }
          return true;
      },
      deleteProperty(target, key) {
          {
              console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
          }
          return true;
      }
  };
  const shallowReactiveHandlers = extend({}, mutableHandlers, {
      get: shallowGet,
      set: shallowSet
  });
  // Props handlers are special in the sense that it should not unwrap top-level
  // refs (in order to allow refs to be explicitly passed down), but should
  // retain the reactivity of the normal readonly object.
  const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
      get: shallowReadonlyGet
  });

  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function get$1(target, key, wrap) {
      target = toRaw(target);
      const rawKey = toRaw(key);
      if (key !== rawKey) {
          track(target, "get" /* GET */, key);
      }
      track(target, "get" /* GET */, rawKey);
      const { has, get } = getProto(target);
      if (has.call(target, key)) {
          return wrap(get.call(target, key));
      }
      else if (has.call(target, rawKey)) {
          return wrap(get.call(target, rawKey));
      }
  }
  function has$1(key) {
      const target = toRaw(this);
      const rawKey = toRaw(key);
      if (key !== rawKey) {
          track(target, "has" /* HAS */, key);
      }
      track(target, "has" /* HAS */, rawKey);
      const has = getProto(target).has;
      return has.call(target, key) || has.call(target, rawKey);
  }
  function size(target) {
      target = toRaw(target);
      track(target, "iterate" /* ITERATE */, ITERATE_KEY);
      return Reflect.get(getProto(target), 'size', target);
  }
  function add(value) {
      value = toRaw(value);
      const target = toRaw(this);
      const proto = getProto(target);
      const hadKey = proto.has.call(target, value);
      const result = proto.add.call(target, value);
      if (!hadKey) {
          trigger(target, "add" /* ADD */, value, value);
      }
      return result;
  }
  function set$1(key, value) {
      value = toRaw(value);
      const target = toRaw(this);
      const { has, get, set } = getProto(target);
      let hadKey = has.call(target, key);
      if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
      }
      else {
          checkIdentityKeys(target, has, key);
      }
      const oldValue = get.call(target, key);
      const result = set.call(target, key, value);
      if (!hadKey) {
          trigger(target, "add" /* ADD */, key, value);
      }
      else if (hasChanged(value, oldValue)) {
          trigger(target, "set" /* SET */, key, value, oldValue);
      }
      return result;
  }
  function deleteEntry(key) {
      const target = toRaw(this);
      const { has, get, delete: del } = getProto(target);
      let hadKey = has.call(target, key);
      if (!hadKey) {
          key = toRaw(key);
          hadKey = has.call(target, key);
      }
      else {
          checkIdentityKeys(target, has, key);
      }
      const oldValue = get ? get.call(target, key) : undefined;
      // forward the operation before queueing reactions
      const result = del.call(target, key);
      if (hadKey) {
          trigger(target, "delete" /* DELETE */, key, undefined, oldValue);
      }
      return result;
  }
  function clear() {
      const target = toRaw(this);
      const hadItems = target.size !== 0;
      const oldTarget =  target instanceof Map
              ? new Map(target)
              : new Set(target)
          ;
      // forward the operation before queueing reactions
      const result = getProto(target).clear.call(target);
      if (hadItems) {
          trigger(target, "clear" /* CLEAR */, undefined, undefined, oldTarget);
      }
      return result;
  }
  function createForEach(isReadonly, shallow) {
      return function forEach(callback, thisArg) {
          const observed = this;
          const target = toRaw(observed);
          const wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive;
          !isReadonly && track(target, "iterate" /* ITERATE */, ITERATE_KEY);
          // important: create sure the callback is
          // 1. invoked with the reactive map as `this` and 3rd arg
          // 2. the value received should be a corresponding reactive/readonly.
          function wrappedCallback(value, key) {
              return callback.call(thisArg, wrap(value), wrap(key), observed);
          }
          return getProto(target).forEach.call(target, wrappedCallback);
      };
  }
  function createIterableMethod(method, isReadonly, shallow) {
      return function (...args) {
          const target = toRaw(this);
          const isMap = target instanceof Map;
          const isPair = method === 'entries' || (method === Symbol.iterator && isMap);
          const isKeyOnly = method === 'keys' && isMap;
          const innerIterator = getProto(target)[method].apply(target, args);
          const wrap = isReadonly ? toReadonly : shallow ? toShallow : toReactive;
          !isReadonly &&
              track(target, "iterate" /* ITERATE */, isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
          // return a wrapped iterator which returns observed versions of the
          // values emitted from the real iterator
          return {
              // iterator protocol
              next() {
                  const { value, done } = innerIterator.next();
                  return done
                      ? { value, done }
                      : {
                          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                          done
                      };
              },
              // iterable protocol
              [Symbol.iterator]() {
                  return this;
              }
          };
      };
  }
  function createReadonlyMethod(type) {
      return function (...args) {
          {
              const key = args[0] ? `on key "${args[0]}" ` : ``;
              console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
          }
          return type === "delete" /* DELETE */ ? false : this;
      };
  }
  const mutableInstrumentations = {
      get(key) {
          return get$1(this, key, toReactive);
      },
      get size() {
          return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
  };
  const shallowInstrumentations = {
      get(key) {
          return get$1(this, key, toShallow);
      },
      get size() {
          return size(this);
      },
      has: has$1,
      add,
      set: set$1,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
  };
  const readonlyInstrumentations = {
      get(key) {
          return get$1(this, key, toReadonly);
      },
      get size() {
          return size(this);
      },
      has: has$1,
      add: createReadonlyMethod("add" /* ADD */),
      set: createReadonlyMethod("set" /* SET */),
      delete: createReadonlyMethod("delete" /* DELETE */),
      clear: createReadonlyMethod("clear" /* CLEAR */),
      forEach: createForEach(true, false)
  };
  const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
  iteratorMethods.forEach(method => {
      mutableInstrumentations[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations[method] = createIterableMethod(method, true, false);
      shallowInstrumentations[method] = createIterableMethod(method, false, true);
  });
  function createInstrumentationGetter(isReadonly, shallow) {
      const instrumentations = shallow
          ? shallowInstrumentations
          : isReadonly
              ? readonlyInstrumentations
              : mutableInstrumentations;
      return (target, key, receiver) => {
          if (key === "__v_isReactive" /* IS_REACTIVE */) {
              return !isReadonly;
          }
          else if (key === "__v_isReadonly" /* IS_READONLY */) {
              return isReadonly;
          }
          else if (key === "__v_raw" /* RAW */) {
              return target;
          }
          return Reflect.get(hasOwn(instrumentations, key) && key in target
              ? instrumentations
              : target, key, receiver);
      };
  }
  const mutableCollectionHandlers = {
      get: createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
      get: createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
      get: createInstrumentationGetter(true, false)
  };
  function checkIdentityKeys(target, has, key) {
      const rawKey = toRaw(key);
      if (rawKey !== key && has.call(target, rawKey)) {
          const type = toRawType(target);
          console.warn(`Reactive ${type} contains both the raw and reactive ` +
              `versions of the same object${type === `Map` ? `as keys` : ``}, ` +
              `which can lead to inconsistencies. ` +
              `Avoid differentiating between the raw and reactive versions ` +
              `of an object and only use the reactive version if possible.`);
      }
  }

  const collectionTypes = new Set([Set, Map, WeakMap, WeakSet]);
  const isObservableType = /*#__PURE__*/ makeMap('Object,Array,Map,Set,WeakMap,WeakSet');
  const canObserve = (value) => {
      return (!value["__v_skip" /* SKIP */] &&
          isObservableType(toRawType(value)) &&
          !Object.isFrozen(value));
  };
  function reactive(target) {
      // if trying to observe a readonly proxy, return the readonly version.
      if (target && target["__v_isReadonly" /* IS_READONLY */]) {
          return target;
      }
      return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers);
  }
  // Return a reactive-copy of the original object, where only the root level
  // properties are reactive, and does NOT unwrap refs nor recursively convert
  // returned properties.
  function shallowReactive(target) {
      return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers);
  }
  function readonly(target) {
      return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers);
  }
  // Return a reactive-copy of the original object, where only the root level
  // properties are readonly, and does NOT unwrap refs nor recursively convert
  // returned properties.
  // This is used for creating the props proxy object for stateful components.
  function shallowReadonly(target) {
      return createReactiveObject(target, true, shallowReadonlyHandlers, readonlyCollectionHandlers);
  }
  function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers) {
      if (!isObject(target)) {
          {
              console.warn(`value cannot be made reactive: ${String(target)}`);
          }
          return target;
      }
      // target is already a Proxy, return it.
      // exception: calling readonly() on a reactive object
      if (target["__v_raw" /* RAW */] &&
          !(isReadonly && target["__v_isReactive" /* IS_REACTIVE */])) {
          return target;
      }
      // target already has corresponding Proxy
      if (hasOwn(target, isReadonly ? "__v_readonly" /* READONLY */ : "__v_reactive" /* REACTIVE */)) {
          return isReadonly
              ? target["__v_readonly" /* READONLY */]
              : target["__v_reactive" /* REACTIVE */];
      }
      // only a whitelist of value types can be observed.
      if (!canObserve(target)) {
          return target;
      }
      const observed = new Proxy(target, collectionTypes.has(target.constructor) ? collectionHandlers : baseHandlers);
      def(target, isReadonly ? "__v_readonly" /* READONLY */ : "__v_reactive" /* REACTIVE */, observed);
      return observed;
  }
  function isReactive(value) {
      if (isReadonly(value)) {
          return isReactive(value["__v_raw" /* RAW */]);
      }
      return !!(value && value["__v_isReactive" /* IS_REACTIVE */]);
  }
  function isReadonly(value) {
      return !!(value && value["__v_isReadonly" /* IS_READONLY */]);
  }
  function isProxy(value) {
      return isReactive(value) || isReadonly(value);
  }
  function toRaw(observed) {
      return ((observed && toRaw(observed["__v_raw" /* RAW */])) || observed);
  }
  function markRaw(value) {
      def(value, "__v_skip" /* SKIP */, true);
      return value;
  }

  const convert = (val) => isObject(val) ? reactive(val) : val;
  function isRef(r) {
      return r ? r.__v_isRef === true : false;
  }
  function ref(value) {
      return createRef(value);
  }
  function shallowRef(value) {
      return createRef(value, true);
  }
  function createRef(rawValue, shallow = false) {
      if (isRef(rawValue)) {
          return rawValue;
      }
      let value = shallow ? rawValue : convert(rawValue);
      const r = {
          __v_isRef: true,
          get value() {
              track(r, "get" /* GET */, 'value');
              return value;
          },
          set value(newVal) {
              if (hasChanged(toRaw(newVal), rawValue)) {
                  rawValue = newVal;
                  value = shallow ? newVal : convert(newVal);
                  trigger(r, "set" /* SET */, 'value',  { newValue: newVal } );
              }
          }
      };
      return r;
  }
  function triggerRef(ref) {
      trigger(ref, "set" /* SET */, 'value',  { newValue: ref.value } );
  }
  function unref(ref) {
      return isRef(ref) ? ref.value : ref;
  }
  function customRef(factory) {
      const { get, set } = factory(() => track(r, "get" /* GET */, 'value'), () => trigger(r, "set" /* SET */, 'value'));
      const r = {
          __v_isRef: true,
          get value() {
              return get();
          },
          set value(v) {
              set(v);
          }
      };
      return r;
  }
  function toRefs(object) {
      if ( !isProxy(object)) {
          console.warn(`toRefs() expects a reactive object but received a plain one.`);
      }
      const ret = {};
      for (const key in object) {
          ret[key] = toRef(object, key);
      }
      return ret;
  }
  function toRef(object, key) {
      return {
          __v_isRef: true,
          get value() {
              return object[key];
          },
          set value(newVal) {
              object[key] = newVal;
          }
      };
  }

  function computed(getterOrOptions) {
      let getter;
      let setter;
      if (isFunction(getterOrOptions)) {
          getter = getterOrOptions;
          setter =  () => {
                  console.warn('Write operation failed: computed value is readonly');
              }
              ;
      }
      else {
          getter = getterOrOptions.get;
          setter = getterOrOptions.set;
      }
      let dirty = true;
      let value;
      let computed;
      const runner = effect(getter, {
          lazy: true,
          scheduler: () => {
              if (!dirty) {
                  dirty = true;
                  trigger(computed, "set" /* SET */, 'value');
              }
          }
      });
      computed = {
          __v_isRef: true,
          // expose effect so computed can be stopped
          effect: runner,
          get value() {
              if (dirty) {
                  value = runner();
                  dirty = false;
              }
              track(computed, "get" /* GET */, 'value');
              return value;
          },
          set value(newValue) {
              setter(newValue);
          }
      };
      return computed;
  }

  const stack = [];
  function pushWarningContext(vnode) {
      stack.push(vnode);
  }
  function popWarningContext() {
      stack.pop();
  }
  function warn(msg, ...args) {
      // avoid props formatting or warn handler tracking deps that might be mutated
      // during patch, leading to infinite recursion.
      pauseTracking();
      const instance = stack.length ? stack[stack.length - 1].component : null;
      const appWarnHandler = instance && instance.appContext.config.warnHandler;
      const trace = getComponentTrace();
      if (appWarnHandler) {
          callWithErrorHandling(appWarnHandler, instance, 11 /* APP_WARN_HANDLER */, [
              msg + args.join(''),
              instance && instance.proxy,
              trace
                  .map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`)
                  .join('\n'),
              trace
          ]);
      }
      else {
          const warnArgs = [`[Vue warn]: ${msg}`, ...args];
          if (trace.length &&
              // avoid spamming console during tests
              !false) {
              warnArgs.push(`\n`, ...formatTrace(trace));
          }
          console.warn(...warnArgs);
      }
      resetTracking();
  }
  function getComponentTrace() {
      let currentVNode = stack[stack.length - 1];
      if (!currentVNode) {
          return [];
      }
      // we can't just use the stack because it will be incomplete during updates
      // that did not start from the root. Re-construct the parent chain using
      // instance parent pointers.
      const normalizedStack = [];
      while (currentVNode) {
          const last = normalizedStack[0];
          if (last && last.vnode === currentVNode) {
              last.recurseCount++;
          }
          else {
              normalizedStack.push({
                  vnode: currentVNode,
                  recurseCount: 0
              });
          }
          const parentInstance = currentVNode.component && currentVNode.component.parent;
          currentVNode = parentInstance && parentInstance.vnode;
      }
      return normalizedStack;
  }
  function formatTrace(trace) {
      const logs = [];
      trace.forEach((entry, i) => {
          logs.push(...(i === 0 ? [] : [`\n`]), ...formatTraceEntry(entry));
      });
      return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
      const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
      const isRoot = vnode.component ? vnode.component.parent == null : false;
      const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
      const close = `>` + postfix;
      return vnode.props
          ? [open, ...formatProps(vnode.props), close]
          : [open + close];
  }
  function formatProps(props) {
      const res = [];
      const keys = Object.keys(props);
      keys.slice(0, 3).forEach(key => {
          res.push(...formatProp(key, props[key]));
      });
      if (keys.length > 3) {
          res.push(` ...`);
      }
      return res;
  }
  function formatProp(key, value, raw) {
      if (isString(value)) {
          value = JSON.stringify(value);
          return raw ? value : [`${key}=${value}`];
      }
      else if (typeof value === 'number' ||
          typeof value === 'boolean' ||
          value == null) {
          return raw ? value : [`${key}=${value}`];
      }
      else if (isRef(value)) {
          value = formatProp(key, toRaw(value.value), true);
          return raw ? value : [`${key}=Ref<`, value, `>`];
      }
      else if (isFunction(value)) {
          return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
      }
      else {
          value = toRaw(value);
          return raw ? value : [`${key}=`, value];
      }
  }

  const ErrorTypeStrings = {
      ["bc" /* BEFORE_CREATE */]: 'beforeCreate hook',
      ["c" /* CREATED */]: 'created hook',
      ["bm" /* BEFORE_MOUNT */]: 'beforeMount hook',
      ["m" /* MOUNTED */]: 'mounted hook',
      ["bu" /* BEFORE_UPDATE */]: 'beforeUpdate hook',
      ["u" /* UPDATED */]: 'updated',
      ["bum" /* BEFORE_UNMOUNT */]: 'beforeUnmount hook',
      ["um" /* UNMOUNTED */]: 'unmounted hook',
      ["a" /* ACTIVATED */]: 'activated hook',
      ["da" /* DEACTIVATED */]: 'deactivated hook',
      ["ec" /* ERROR_CAPTURED */]: 'errorCaptured hook',
      ["rtc" /* RENDER_TRACKED */]: 'renderTracked hook',
      ["rtg" /* RENDER_TRIGGERED */]: 'renderTriggered hook',
      [0 /* SETUP_FUNCTION */]: 'setup function',
      [1 /* RENDER_FUNCTION */]: 'render function',
      [2 /* WATCH_GETTER */]: 'watcher getter',
      [3 /* WATCH_CALLBACK */]: 'watcher callback',
      [4 /* WATCH_CLEANUP */]: 'watcher cleanup function',
      [5 /* NATIVE_EVENT_HANDLER */]: 'native event handler',
      [6 /* COMPONENT_EVENT_HANDLER */]: 'component event handler',
      [7 /* VNODE_HOOK */]: 'vnode hook',
      [8 /* DIRECTIVE_HOOK */]: 'directive hook',
      [9 /* TRANSITION_HOOK */]: 'transition hook',
      [10 /* APP_ERROR_HANDLER */]: 'app errorHandler',
      [11 /* APP_WARN_HANDLER */]: 'app warnHandler',
      [12 /* FUNCTION_REF */]: 'ref function',
      [13 /* ASYNC_COMPONENT_LOADER */]: 'async component loader',
      [14 /* SCHEDULER */]: 'scheduler flush. This is likely a Vue internals bug. ' +
          'Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/vue-next'
  };
  function callWithErrorHandling(fn, instance, type, args) {
      let res;
      try {
          res = args ? fn(...args) : fn();
      }
      catch (err) {
          handleError(err, instance, type);
      }
      return res;
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
      if (isFunction(fn)) {
          const res = callWithErrorHandling(fn, instance, type, args);
          if (res && isPromise(res)) {
              res.catch(err => {
                  handleError(err, instance, type);
              });
          }
          return res;
      }
      const values = [];
      for (let i = 0; i < fn.length; i++) {
          values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
      return values;
  }
  function handleError(err, instance, type) {
      const contextVNode = instance ? instance.vnode : null;
      if (instance) {
          let cur = instance.parent;
          // the exposed instance is the render proxy to keep it consistent with 2.x
          const exposedInstance = instance.proxy;
          // in production the hook receives only the error code
          const errorInfo =  ErrorTypeStrings[type] ;
          while (cur) {
              const errorCapturedHooks = cur.ec;
              if (errorCapturedHooks) {
                  for (let i = 0; i < errorCapturedHooks.length; i++) {
                      if (errorCapturedHooks[i](err, exposedInstance, errorInfo)) {
                          return;
                      }
                  }
              }
              cur = cur.parent;
          }
          // app-level handling
          const appErrorHandler = instance.appContext.config.errorHandler;
          if (appErrorHandler) {
              callWithErrorHandling(appErrorHandler, null, 10 /* APP_ERROR_HANDLER */, [err, exposedInstance, errorInfo]);
              return;
          }
      }
      logError(err, type, contextVNode);
  }
  function logError(err, type, contextVNode) {
      // default behavior is crash in prod & test, recover in dev.
      {
          const info = ErrorTypeStrings[type];
          if (contextVNode) {
              pushWarningContext(contextVNode);
          }
          warn(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
          console.error(err);
          if (contextVNode) {
              popWarningContext();
          }
      }
  }

  const queue = [];
  const postFlushCbs = [];
  const p = Promise.resolve();
  let isFlushing = false;
  let isFlushPending = false;
  const RECURSION_LIMIT = 100;
  function nextTick(fn) {
      return fn ? p.then(fn) : p;
  }
  function queueJob(job) {
      if (!queue.includes(job)) {
          queue.push(job);
          queueFlush();
      }
  }
  function invalidateJob(job) {
      const i = queue.indexOf(job);
      if (i > -1) {
          queue[i] = null;
      }
  }
  function queuePostFlushCb(cb) {
      if (!isArray(cb)) {
          postFlushCbs.push(cb);
      }
      else {
          postFlushCbs.push(...cb);
      }
      queueFlush();
  }
  function queueFlush() {
      if (!isFlushing && !isFlushPending) {
          isFlushPending = true;
          nextTick(flushJobs);
      }
  }
  function flushPostFlushCbs(seen) {
      if (postFlushCbs.length) {
          const cbs = [...new Set(postFlushCbs)];
          postFlushCbs.length = 0;
          {
              seen = seen || new Map();
          }
          for (let i = 0; i < cbs.length; i++) {
              {
                  checkRecursiveUpdates(seen, cbs[i]);
              }
              cbs[i]();
          }
      }
  }
  const getId = (job) => (job.id == null ? Infinity : job.id);
  function flushJobs(seen) {
      isFlushPending = false;
      isFlushing = true;
      let job;
      {
          seen = seen || new Map();
      }
      // Sort queue before flush.
      // This ensures that:
      // 1. Components are updated from parent to child. (because parent is always
      //    created before the child so its render effect will have smaller
      //    priority number)
      // 2. If a component is unmounted during a parent component's update,
      //    its update can be skipped.
      // Jobs can never be null before flush starts, since they are only invalidated
      // during execution of another flushed job.
      queue.sort((a, b) => getId(a) - getId(b));
      while ((job = queue.shift()) !== undefined) {
          if (job === null) {
              continue;
          }
          {
              checkRecursiveUpdates(seen, job);
          }
          callWithErrorHandling(job, null, 14 /* SCHEDULER */);
      }
      flushPostFlushCbs(seen);
      isFlushing = false;
      // some postFlushCb queued jobs!
      // keep flushing until it drains.
      if (queue.length || postFlushCbs.length) {
          flushJobs(seen);
      }
  }
  function checkRecursiveUpdates(seen, fn) {
      if (!seen.has(fn)) {
          seen.set(fn, 1);
      }
      else {
          const count = seen.get(fn);
          if (count > RECURSION_LIMIT) {
              throw new Error('Maximum recursive updates exceeded. ' +
                  "You may have code that is mutating state in your component's " +
                  'render function or updated hook or watcher source function.');
          }
          else {
              seen.set(fn, count + 1);
          }
      }
  }

  let isHmrUpdating = false;
  const hmrDirtyComponents = new Set();
  // Expose the HMR runtime on the global object
  // This makes it entirely tree-shakable without polluting the exports and makes
  // it easier to be used in toolings like vue-loader
  // Note: for a component to be eligible for HMR it also needs the __hmrId option
  // to be set so that its instances can be registered / removed.
  {
      const globalObject = typeof global !== 'undefined'
          ? global
          : typeof self !== 'undefined'
              ? self
              : typeof window !== 'undefined'
                  ? window
                  : {};
      globalObject.__VUE_HMR_RUNTIME__ = {
          createRecord: tryWrap(createRecord),
          rerender: tryWrap(rerender),
          reload: tryWrap(reload)
      };
  }
  const map = new Map();
  function registerHMR(instance) {
      const id = instance.type.__hmrId;
      let record = map.get(id);
      if (!record) {
          createRecord(id);
          record = map.get(id);
      }
      record.add(instance);
  }
  function unregisterHMR(instance) {
      map.get(instance.type.__hmrId).delete(instance);
  }
  function createRecord(id) {
      if (map.has(id)) {
          return false;
      }
      map.set(id, new Set());
      return true;
  }
  function rerender(id, newRender) {
      const record = map.get(id);
      if (!record)
          return;
      // Array.from creates a snapshot which avoids the set being mutated during
      // updates
      Array.from(record).forEach(instance => {
          if (newRender) {
              instance.render = newRender;
          }
          instance.renderCache = [];
          // this flag forces child components with slot content to update
          isHmrUpdating = true;
          instance.update();
          isHmrUpdating = false;
      });
  }
  function reload(id, newComp) {
      const record = map.get(id);
      if (!record)
          return;
      // Array.from creates a snapshot which avoids the set being mutated during
      // updates
      Array.from(record).forEach(instance => {
          const comp = instance.type;
          if (!hmrDirtyComponents.has(comp)) {
              // 1. Update existing comp definition to match new one
              extend(comp, newComp);
              for (const key in comp) {
                  if (!(key in newComp)) {
                      delete comp[key];
                  }
              }
              // 2. Mark component dirty. This forces the renderer to replace the component
              // on patch.
              hmrDirtyComponents.add(comp);
              // 3. Make sure to unmark the component after the reload.
              queuePostFlushCb(() => {
                  hmrDirtyComponents.delete(comp);
              });
          }
          if (instance.parent) {
              // 4. Force the parent instance to re-render. This will cause all updated
              // components to be unmounted and re-mounted. Queue the update so that we
              // don't end up forcing the same parent to re-render multiple times.
              queueJob(instance.parent.update);
          }
          else if (instance.appContext.reload) {
              // root instance mounted via createApp() has a reload method
              instance.appContext.reload();
          }
          else if (typeof window !== 'undefined') {
              // root instance inside tree created via raw render(). Force reload.
              window.location.reload();
          }
          else {
              console.warn('[HMR] Root or manually mounted instance modified. Full reload required.');
          }
      });
  }
  function tryWrap(fn) {
      return (id, arg) => {
          try {
              return fn(id, arg);
          }
          catch (e) {
              console.error(e);
              console.warn(`[HMR] Something went wrong during Vue component hot-reload. ` +
                  `Full reload required.`);
          }
      };
  }

  // mark the current rendering instance for asset resolution (e.g.
  // resolveComponent, resolveDirective) during render
  let currentRenderingInstance = null;
  function setCurrentRenderingInstance(instance) {
      currentRenderingInstance = instance;
  }
  // dev only flag to track whether $attrs was used during render.
  // If $attrs was used during render then the warning for failed attrs
  // fallthrough can be suppressed.
  let accessedAttrs = false;
  function markAttrsAccessed() {
      accessedAttrs = true;
  }
  function renderComponentRoot(instance) {
      const { type: Component, parent, vnode, proxy, withProxy, props, slots, attrs, emit, renderCache } = instance;
      let result;
      currentRenderingInstance = instance;
      {
          accessedAttrs = false;
      }
      try {
          let fallthroughAttrs;
          if (vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */) {
              // withProxy is a proxy with a different `has` trap only for
              // runtime-compiled render functions using `with` block.
              const proxyToUse = withProxy || proxy;
              result = normalizeVNode(instance.render.call(proxyToUse, proxyToUse, renderCache));
              fallthroughAttrs = attrs;
          }
          else {
              // functional
              const render = Component;
              // in dev, mark attrs accessed if optional props (attrs === props)
              if (true && attrs === props) {
                  markAttrsAccessed();
              }
              result = normalizeVNode(render.length > 1
                  ? render(props, true
                      ? {
                          get attrs() {
                              markAttrsAccessed();
                              return attrs;
                          },
                          slots,
                          emit
                      }
                      : { attrs, slots, emit })
                  : render(props, null /* we know it doesn't need it */));
              fallthroughAttrs = Component.props ? attrs : getFallthroughAttrs(attrs);
          }
          // attr merging
          // in dev mode, comments are preserved, and it's possible for a template
          // to have comments along side the root element which makes it a fragment
          let root = result;
          let setRoot = undefined;
          if (true) {
              ;
              [root, setRoot] = getChildRoot(result);
          }
          if (Component.inheritAttrs !== false &&
              fallthroughAttrs &&
              Object.keys(fallthroughAttrs).length) {
              if (root.shapeFlag & 1 /* ELEMENT */ ||
                  root.shapeFlag & 6 /* COMPONENT */) {
                  root = cloneVNode(root, fallthroughAttrs);
              }
              else if (true && !accessedAttrs && root.type !== Comment) {
                  const allAttrs = Object.keys(attrs);
                  const eventAttrs = [];
                  const extraAttrs = [];
                  for (let i = 0, l = allAttrs.length; i < l; i++) {
                      const key = allAttrs[i];
                      if (isOn(key)) {
                          // remove `on`, lowercase first letter to reflect event casing accurately
                          eventAttrs.push(key[2].toLowerCase() + key.slice(3));
                      }
                      else {
                          extraAttrs.push(key);
                      }
                  }
                  if (extraAttrs.length) {
                      warn(`Extraneous non-props attributes (` +
                          `${extraAttrs.join(', ')}) ` +
                          `were passed to component but could not be automatically inherited ` +
                          `because component renders fragment or text root nodes.`);
                  }
                  if (eventAttrs.length) {
                      warn(`Extraneous non-emits event listeners (` +
                          `${eventAttrs.join(', ')}) ` +
                          `were passed to component but could not be automatically inherited ` +
                          `because component renders fragment or text root nodes. ` +
                          `If the listener is intended to be a component custom event listener only, ` +
                          `declare it using the "emits" option.`);
                  }
              }
          }
          // inherit scopeId
          const scopeId = vnode.scopeId;
          const treeOwnerId = parent && parent.type.__scopeId;
          const slotScopeId = treeOwnerId && treeOwnerId !== scopeId ? treeOwnerId + '-s' : null;
          if (scopeId || slotScopeId) {
              const extras = {};
              if (scopeId)
                  extras[scopeId] = '';
              if (slotScopeId)
                  extras[slotScopeId] = '';
              root = cloneVNode(root, extras);
          }
          // inherit directives
          if (vnode.dirs) {
              if (true && !isElementRoot(root)) {
                  warn(`Runtime directive used on component with non-element root node. ` +
                      `The directives will not function as intended.`);
              }
              root.dirs = vnode.dirs;
          }
          // inherit transition data
          if (vnode.transition) {
              if (true && !isElementRoot(root)) {
                  warn(`Component inside <Transition> renders non-element root node ` +
                      `that cannot be animated.`);
              }
              root.transition = vnode.transition;
          }
          if (true && setRoot) {
              setRoot(root);
          }
          else {
              result = root;
          }
      }
      catch (err) {
          handleError(err, instance, 1 /* RENDER_FUNCTION */);
          result = createVNode(Comment);
      }
      currentRenderingInstance = null;
      return result;
  }
  const getChildRoot = (vnode) => {
      if (vnode.type !== Fragment) {
          return [vnode, undefined];
      }
      const rawChildren = vnode.children;
      const dynamicChildren = vnode.dynamicChildren;
      const children = rawChildren.filter(child => {
          return !(isVNode(child) && child.type === Comment);
      });
      if (children.length !== 1) {
          return [vnode, undefined];
      }
      const childRoot = children[0];
      const index = rawChildren.indexOf(childRoot);
      const dynamicIndex = dynamicChildren
          ? dynamicChildren.indexOf(childRoot)
          : null;
      const setRoot = (updatedRoot) => {
          rawChildren[index] = updatedRoot;
          if (dynamicIndex !== null)
              dynamicChildren[dynamicIndex] = updatedRoot;
      };
      return [normalizeVNode(childRoot), setRoot];
  };
  const getFallthroughAttrs = (attrs) => {
      let res;
      for (const key in attrs) {
          if (key === 'class' || key === 'style' || isOn(key)) {
              (res || (res = {}))[key] = attrs[key];
          }
      }
      return res;
  };
  const isElementRoot = (vnode) => {
      return (vnode.shapeFlag & 6 /* COMPONENT */ ||
          vnode.shapeFlag & 1 /* ELEMENT */ ||
          vnode.type === Comment // potential v-if branch switch
      );
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
      const { props: prevProps, children: prevChildren } = prevVNode;
      const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
      // Parent component's render function was hot-updated. Since this may have
      // caused the child component's slots content to have changed, we need to
      // force the child to update as well.
      if ( (prevChildren || nextChildren) && isHmrUpdating) {
          return true;
      }
      // force child update for runtime directive or transition on component vnode.
      if (nextVNode.dirs || nextVNode.transition) {
          return true;
      }
      if (patchFlag > 0) {
          if (patchFlag & 1024 /* DYNAMIC_SLOTS */) {
              // slot content that references values that might have changed,
              // e.g. in a v-for
              return true;
          }
          if (patchFlag & 16 /* FULL_PROPS */) {
              if (!prevProps) {
                  return !!nextProps;
              }
              // presence of this flag indicates props are always non-null
              return hasPropsChanged(prevProps, nextProps);
          }
          else if (patchFlag & 8 /* PROPS */) {
              const dynamicProps = nextVNode.dynamicProps;
              for (let i = 0; i < dynamicProps.length; i++) {
                  const key = dynamicProps[i];
                  if (nextProps[key] !== prevProps[key]) {
                      return true;
                  }
              }
          }
      }
      else if (!optimized) {
          // this path is only taken by manually written render functions
          // so presence of any children leads to a forced update
          if (prevChildren || nextChildren) {
              if (!nextChildren || !nextChildren.$stable) {
                  return true;
              }
          }
          if (prevProps === nextProps) {
              return false;
          }
          if (!prevProps) {
              return !!nextProps;
          }
          if (!nextProps) {
              return true;
          }
          return hasPropsChanged(prevProps, nextProps);
      }
      return false;
  }
  function hasPropsChanged(prevProps, nextProps) {
      const nextKeys = Object.keys(nextProps);
      if (nextKeys.length !== Object.keys(prevProps).length) {
          return true;
      }
      for (let i = 0; i < nextKeys.length; i++) {
          const key = nextKeys[i];
          if (nextProps[key] !== prevProps[key]) {
              return true;
          }
      }
      return false;
  }
  function updateHOCHostEl({ vnode, parent }, el // HostNode
  ) {
      while (parent && parent.subTree === vnode) {
          (vnode = parent.vnode).el = el;
          parent = parent.parent;
      }
  }

  const isSuspense = (type) => type.__isSuspense;
  // Suspense exposes a component-like API, and is treated like a component
  // in the compiler, but internally it's a special built-in type that hooks
  // directly into the renderer.
  const SuspenseImpl = {
      // In order to make Suspense tree-shakable, we need to avoid importing it
      // directly in the renderer. The renderer checks for the __isSuspense flag
      // on a vnode's type and calls the `process` method, passing in renderer
      // internals.
      __isSuspense: true,
      process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, 
      // platform-specific impl passed from renderer
      rendererInternals) {
          if (n1 == null) {
              mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, rendererInternals);
          }
          else {
              patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, optimized, rendererInternals);
          }
      },
      hydrate: hydrateSuspense
  };
  // Force-casted public typing for h and TSX props inference
  const Suspense = ( SuspenseImpl
      );
  function mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, rendererInternals) {
      const { p: patch, o: { createElement } } = rendererInternals;
      const hiddenContainer = createElement('div');
      const suspense = (n2.suspense = createSuspenseBoundary(n2, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, optimized, rendererInternals));
      // start mounting the content subtree in an off-dom container
      patch(null, suspense.subTree, hiddenContainer, null, parentComponent, suspense, isSVG, optimized);
      // now check if we have encountered any async deps
      if (suspense.deps > 0) {
          // mount the fallback tree
          patch(null, suspense.fallbackTree, container, anchor, parentComponent, null, // fallback tree will not have suspense context
          isSVG, optimized);
          n2.el = suspense.fallbackTree.el;
      }
      else {
          // Suspense has no async deps. Just resolve.
          suspense.resolve();
      }
  }
  function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, optimized, { p: patch }) {
      const suspense = (n2.suspense = n1.suspense);
      suspense.vnode = n2;
      const { content, fallback } = normalizeSuspenseChildren(n2);
      const oldSubTree = suspense.subTree;
      const oldFallbackTree = suspense.fallbackTree;
      if (!suspense.isResolved) {
          patch(oldSubTree, content, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, optimized);
          if (suspense.deps > 0) {
              // still pending. patch the fallback tree.
              patch(oldFallbackTree, fallback, container, anchor, parentComponent, null, // fallback tree will not have suspense context
              isSVG, optimized);
              n2.el = fallback.el;
          }
          // If deps somehow becomes 0 after the patch it means the patch caused an
          // async dep component to unmount and removed its dep. It will cause the
          // suspense to resolve and we don't need to do anything here.
      }
      else {
          // just normal patch inner content as a fragment
          patch(oldSubTree, content, container, anchor, parentComponent, suspense, isSVG, optimized);
          n2.el = content.el;
      }
      suspense.subTree = content;
      suspense.fallbackTree = fallback;
  }
  let hasWarned = false;
  function createSuspenseBoundary(vnode, parent, parentComponent, container, hiddenContainer, anchor, isSVG, optimized, rendererInternals, isHydrating = false) {
      /* istanbul ignore if */
      if ( !hasWarned) {
          hasWarned = true;
          // @ts-ignore `console.info` cannot be null error
          console[console.info ? 'info' : 'log'](`<Suspense> is an experimental feature and its API will likely change.`);
      }
      const { p: patch, m: move, um: unmount, n: next, o: { parentNode } } = rendererInternals;
      const getCurrentTree = () => suspense.isResolved || suspense.isHydrating
          ? suspense.subTree
          : suspense.fallbackTree;
      const { content, fallback } = normalizeSuspenseChildren(vnode);
      const suspense = {
          vnode,
          parent,
          parentComponent,
          isSVG,
          optimized,
          container,
          hiddenContainer,
          anchor,
          deps: 0,
          subTree: content,
          fallbackTree: fallback,
          isHydrating,
          isResolved: false,
          isUnmounted: false,
          effects: [],
          resolve() {
              {
                  if (suspense.isResolved) {
                      throw new Error(`resolveSuspense() is called on an already resolved suspense boundary.`);
                  }
                  if (suspense.isUnmounted) {
                      throw new Error(`resolveSuspense() is called on an already unmounted suspense boundary.`);
                  }
              }
              const { vnode, subTree, fallbackTree, effects, parentComponent, container } = suspense;
              if (suspense.isHydrating) {
                  suspense.isHydrating = false;
              }
              else {
                  // this is initial anchor on mount
                  let { anchor } = suspense;
                  // unmount fallback tree
                  if (fallbackTree.el) {
                      // if the fallback tree was mounted, it may have been moved
                      // as part of a parent suspense. get the latest anchor for insertion
                      anchor = next(fallbackTree);
                      unmount(fallbackTree, parentComponent, suspense, true);
                  }
                  // move content from off-dom container to actual container
                  move(subTree, container, anchor, 0 /* ENTER */);
              }
              const el = (vnode.el = subTree.el);
              // suspense as the root node of a component...
              if (parentComponent && parentComponent.subTree === vnode) {
                  parentComponent.vnode.el = el;
                  updateHOCHostEl(parentComponent, el);
              }
              // check if there is a pending parent suspense
              let parent = suspense.parent;
              let hasUnresolvedAncestor = false;
              while (parent) {
                  if (!parent.isResolved) {
                      // found a pending parent suspense, merge buffered post jobs
                      // into that parent
                      parent.effects.push(...effects);
                      hasUnresolvedAncestor = true;
                      break;
                  }
                  parent = parent.parent;
              }
              // no pending parent suspense, flush all jobs
              if (!hasUnresolvedAncestor) {
                  queuePostFlushCb(effects);
              }
              suspense.isResolved = true;
              suspense.effects = [];
              // invoke @resolve event
              const onResolve = vnode.props && vnode.props.onResolve;
              if (isFunction(onResolve)) {
                  onResolve();
              }
          },
          recede() {
              suspense.isResolved = false;
              const { vnode, subTree, fallbackTree, parentComponent, container, hiddenContainer, isSVG, optimized } = suspense;
              // move content tree back to the off-dom container
              const anchor = next(subTree);
              move(subTree, hiddenContainer, null, 1 /* LEAVE */);
              // remount the fallback tree
              patch(null, fallbackTree, container, anchor, parentComponent, null, // fallback tree will not have suspense context
              isSVG, optimized);
              const el = (vnode.el = fallbackTree.el);
              // suspense as the root node of a component...
              if (parentComponent && parentComponent.subTree === vnode) {
                  parentComponent.vnode.el = el;
                  updateHOCHostEl(parentComponent, el);
              }
              // invoke @recede event
              const onRecede = vnode.props && vnode.props.onRecede;
              if (isFunction(onRecede)) {
                  onRecede();
              }
          },
          move(container, anchor, type) {
              move(getCurrentTree(), container, anchor, type);
              suspense.container = container;
          },
          next() {
              return next(getCurrentTree());
          },
          registerDep(instance, setupRenderEffect) {
              // suspense is already resolved, need to recede.
              // use queueJob so it's handled synchronously after patching the current
              // suspense tree
              if (suspense.isResolved) {
                  queueJob(() => {
                      suspense.recede();
                  });
              }
              const hydratedEl = instance.vnode.el;
              suspense.deps++;
              instance
                  .asyncDep.catch(err => {
                  handleError(err, instance, 0 /* SETUP_FUNCTION */);
              })
                  .then(asyncSetupResult => {
                  // retry when the setup() promise resolves.
                  // component may have been unmounted before resolve.
                  if (instance.isUnmounted || suspense.isUnmounted) {
                      return;
                  }
                  suspense.deps--;
                  // retry from this component
                  instance.asyncResolved = true;
                  const { vnode } = instance;
                  {
                      pushWarningContext(vnode);
                  }
                  handleSetupResult(instance, asyncSetupResult);
                  if (hydratedEl) {
                      // vnode may have been replaced if an update happened before the
                      // async dep is resolved.
                      vnode.el = hydratedEl;
                  }
                  setupRenderEffect(instance, vnode, 
                  // component may have been moved before resolve.
                  // if this is not a hydration, instance.subTree will be the comment
                  // placeholder.
                  hydratedEl
                      ? parentNode(hydratedEl)
                      : parentNode(instance.subTree.el), 
                  // anchor will not be used if this is hydration, so only need to
                  // consider the comment placeholder case.
                  hydratedEl ? null : next(instance.subTree), suspense, isSVG, optimized);
                  updateHOCHostEl(instance, vnode.el);
                  {
                      popWarningContext();
                  }
                  if (suspense.deps === 0) {
                      suspense.resolve();
                  }
              });
          },
          unmount(parentSuspense, doRemove) {
              suspense.isUnmounted = true;
              unmount(suspense.subTree, parentComponent, parentSuspense, doRemove);
              if (!suspense.isResolved) {
                  unmount(suspense.fallbackTree, parentComponent, parentSuspense, doRemove);
              }
          }
      };
      return suspense;
  }
  function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, optimized, rendererInternals, hydrateNode) {
      /* eslint-disable no-restricted-globals */
      const suspense = (vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement('div'), null, isSVG, optimized, rendererInternals, true /* hydrating */));
      // there are two possible scenarios for server-rendered suspense:
      // - success: ssr content should be fully resolved
      // - failure: ssr content should be the fallback branch.
      // however, on the client we don't really know if it has failed or not
      // attempt to hydrate the DOM assuming it has succeeded, but we still
      // need to construct a suspense boundary first
      const result = hydrateNode(node, suspense.subTree, parentComponent, suspense, optimized);
      if (suspense.deps === 0) {
          suspense.resolve();
      }
      return result;
      /* eslint-enable no-restricted-globals */
  }
  function normalizeSuspenseChildren(vnode) {
      const { shapeFlag, children } = vnode;
      if (shapeFlag & 32 /* SLOTS_CHILDREN */) {
          const { default: d, fallback } = children;
          return {
              content: normalizeVNode(isFunction(d) ? d() : d),
              fallback: normalizeVNode(isFunction(fallback) ? fallback() : fallback)
          };
      }
      else {
          return {
              content: normalizeVNode(children),
              fallback: normalizeVNode(null)
          };
      }
  }
  function queueEffectWithSuspense(fn, suspense) {
      if (suspense && !suspense.isResolved) {
          if (isArray(fn)) {
              suspense.effects.push(...fn);
          }
          else {
              suspense.effects.push(fn);
          }
      }
      else {
          queuePostFlushCb(fn);
      }
  }

  /**
   * Wrap a slot function to memoize current rendering instance
   * @private
   */
  function withCtx(fn, ctx = currentRenderingInstance) {
      if (!ctx)
          return fn;
      return function renderFnWithContext() {
          const owner = currentRenderingInstance;
          setCurrentRenderingInstance(ctx);
          const res = fn.apply(null, arguments);
          setCurrentRenderingInstance(owner);
          return res;
      };
  }

  // SFC scoped style ID management.
  let currentScopeId = null;
  const scopeIdStack = [];
  /**
   * @private
   */
  function pushScopeId(id) {
      scopeIdStack.push((currentScopeId = id));
  }
  /**
   * @private
   */
  function popScopeId() {
      scopeIdStack.pop();
      currentScopeId = scopeIdStack[scopeIdStack.length - 1] || null;
  }
  /**
   * @private
   */
  function withScopeId(id) {
      return ((fn) => withCtx(function () {
          pushScopeId(id);
          const res = fn.apply(this, arguments);
          popScopeId();
          return res;
      }));
  }

  const isTeleport = (type) => type.__isTeleport;
  const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === '');
  const resolveTarget = (props, select) => {
      const targetSelector = props && props.to;
      if (isString(targetSelector)) {
          if (!select) {
              
                  warn(`Current renderer does not support string target for Teleports. ` +
                      `(missing querySelector renderer option)`);
              return null;
          }
          else {
              const target = select(targetSelector);
              if (!target) {
                  
                      warn(`Failed to locate Teleport target with selector "${targetSelector}".`);
              }
              return target;
          }
      }
      else {
          if ( !targetSelector) {
              warn(`Invalid Teleport target: ${targetSelector}`);
          }
          return targetSelector;
      }
  };
  const TeleportImpl = {
      __isTeleport: true,
      process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals) {
          const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment } } = internals;
          const disabled = isTeleportDisabled(n2.props);
          const { shapeFlag, children } = n2;
          if (n1 == null) {
              // insert anchors in the main view
              const placeholder = (n2.el =  createComment('teleport start')
                  );
              const mainAnchor = (n2.anchor =  createComment('teleport end')
                  );
              insert(placeholder, container, anchor);
              insert(mainAnchor, container, anchor);
              const target = (n2.target = resolveTarget(n2.props, querySelector));
              const targetAnchor = (n2.targetAnchor = createText(''));
              if (target) {
                  insert(targetAnchor, target);
              }
              else {
                  warn('Invalid Teleport target on mount:', target, `(${typeof target})`);
              }
              const mount = (container, anchor) => {
                  // Teleport *always* has Array children. This is enforced in both the
                  // compiler and vnode children normalization.
                  if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                      mountChildren(children, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                  }
              };
              if (disabled) {
                  mount(container, mainAnchor);
              }
              else if (target) {
                  mount(target, targetAnchor);
              }
          }
          else {
              // update content
              n2.el = n1.el;
              const mainAnchor = (n2.anchor = n1.anchor);
              const target = (n2.target = n1.target);
              const targetAnchor = (n2.targetAnchor = n1.targetAnchor);
              const wasDisabled = isTeleportDisabled(n1.props);
              const currentContainer = wasDisabled ? container : target;
              const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
              if (n2.dynamicChildren) {
                  // fast path when the teleport happens to be a block root
                  patchBlockChildren(n1.dynamicChildren, n2.dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG);
              }
              else if (!optimized) {
                  patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG);
              }
              if (disabled) {
                  if (!wasDisabled) {
                      // enabled -> disabled
                      // move into main container
                      moveTeleport(n2, container, mainAnchor, internals, 1 /* TOGGLE */);
                  }
              }
              else {
                  // target changed
                  if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
                      const nextTarget = (n2.target = resolveTarget(n2.props, querySelector));
                      if (nextTarget) {
                          moveTeleport(n2, nextTarget, null, internals, 0 /* TARGET_CHANGE */);
                      }
                      else {
                          warn('Invalid Teleport target on update:', target, `(${typeof target})`);
                      }
                  }
                  else if (wasDisabled) {
                      // disabled -> enabled
                      // move into teleport target
                      moveTeleport(n2, target, targetAnchor, internals, 1 /* TOGGLE */);
                  }
              }
          }
      },
      remove(vnode, { r: remove, o: { remove: hostRemove } }) {
          const { shapeFlag, children, anchor } = vnode;
          hostRemove(anchor);
          if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
              for (let i = 0; i < children.length; i++) {
                  remove(children[i]);
              }
          }
      },
      move: moveTeleport,
      hydrate: hydrateTeleport
  };
  function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2 /* REORDER */) {
      // move target anchor if this is a target change.
      if (moveType === 0 /* TARGET_CHANGE */) {
          insert(vnode.targetAnchor, container, parentAnchor);
      }
      const { el, anchor, shapeFlag, children, props } = vnode;
      const isReorder = moveType === 2 /* REORDER */;
      // move main view anchor if this is a re-order.
      if (isReorder) {
          insert(el, container, parentAnchor);
      }
      // if this is a re-order and teleport is enabled (content is in target)
      // do not move children. So the opposite is: only move children if this
      // is not a reorder, or the teleport is disabled
      if (!isReorder || isTeleportDisabled(props)) {
          // Teleport has either Array children or no children.
          if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
              for (let i = 0; i < children.length; i++) {
                  move(children[i], container, parentAnchor, 2 /* REORDER */);
              }
          }
      }
      // move main view anchor if this is a re-order.
      if (isReorder) {
          insert(anchor, container, parentAnchor);
      }
  }
  function hydrateTeleport(node, vnode, parentComponent, parentSuspense, optimized, { o: { nextSibling, parentNode, querySelector } }, hydrateChildren) {
      const target = (vnode.target = resolveTarget(vnode.props, querySelector));
      if (target) {
          // if multiple teleports rendered to the same target element, we need to
          // pick up from where the last teleport finished instead of the first node
          const targetNode = target._lpa || target.firstChild;
          if (vnode.shapeFlag & 16 /* ARRAY_CHILDREN */) {
              if (isTeleportDisabled(vnode.props)) {
                  vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, optimized);
                  vnode.targetAnchor = targetNode;
              }
              else {
                  vnode.anchor = nextSibling(node);
                  vnode.targetAnchor = hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, optimized);
              }
              target._lpa =
                  vnode.targetAnchor && nextSibling(vnode.targetAnchor);
          }
      }
      return vnode.anchor && nextSibling(vnode.anchor);
  }
  // Force-casted public typing for h and TSX props inference
  const Teleport = TeleportImpl;

  const COMPONENTS = 'components';
  const DIRECTIVES = 'directives';
  /**
   * @private
   */
  function resolveComponent(name) {
      return resolveAsset(COMPONENTS, name) || name;
  }
  const NULL_DYNAMIC_COMPONENT = Symbol();
  /**
   * @private
   */
  function resolveDynamicComponent(component) {
      if (isString(component)) {
          return resolveAsset(COMPONENTS, component, false) || component;
      }
      else {
          // invalid types will fallthrough to createVNode and raise warning
          return component || NULL_DYNAMIC_COMPONENT;
      }
  }
  /**
   * @private
   */
  function resolveDirective(name) {
      return resolveAsset(DIRECTIVES, name);
  }
  // implementation
  function resolveAsset(type, name, warnMissing = true) {
      const instance = currentRenderingInstance || currentInstance;
      if (instance) {
          let camelized, capitalized;
          const registry = instance[type];
          let res = registry[name] ||
              registry[(camelized = camelize(name))] ||
              registry[(capitalized = capitalize(camelized))];
          if (!res && type === COMPONENTS) {
              const self = instance.type;
              const selfName = self.displayName || self.name;
              if (selfName &&
                  (selfName === name ||
                      selfName === camelized ||
                      selfName === capitalized)) {
                  res = self;
              }
          }
          if ( warnMissing && !res) {
              warn(`Failed to resolve ${type.slice(0, -1)}: ${name}`);
          }
          return res;
      }
      else {
          warn(`resolve${capitalize(type.slice(0, -1))} ` +
              `can only be used in render() or setup().`);
      }
  }

  const Fragment = Symbol( 'Fragment' );
  const Text = Symbol( 'Text' );
  const Comment = Symbol( 'Comment' );
  const Static = Symbol( 'Static' );
  // Since v-if and v-for are the two possible ways node structure can dynamically
  // change, once we consider v-if branches and each v-for fragment a block, we
  // can divide a template into nested blocks, and within each block the node
  // structure would be stable. This allows us to skip most children diffing
  // and only worry about the dynamic nodes (indicated by patch flags).
  const blockStack = [];
  let currentBlock = null;
  /**
   * Open a block.
   * This must be called before `createBlock`. It cannot be part of `createBlock`
   * because the children of the block are evaluated before `createBlock` itself
   * is called. The generated code typically looks like this:
   *
   * ```js
   * function render() {
   *   return (openBlock(),createBlock('div', null, [...]))
   * }
   * ```
   * disableTracking is true when creating a v-for fragment block, since a v-for
   * fragment always diffs its children.
   *
   * @private
   */
  function openBlock(disableTracking = false) {
      blockStack.push((currentBlock = disableTracking ? null : []));
  }
  // Whether we should be tracking dynamic child nodes inside a block.
  // Only tracks when this value is > 0
  // We are not using a simple boolean because this value may need to be
  // incremented/decremented by nested usage of v-once (see below)
  let shouldTrack$1 = 1;
  /**
   * Block tracking sometimes needs to be disabled, for example during the
   * creation of a tree that needs to be cached by v-once. The compiler generates
   * code like this:
   *
   * ``` js
   * _cache[1] || (
   *   setBlockTracking(-1),
   *   _cache[1] = createVNode(...),
   *   setBlockTracking(1),
   *   _cache[1]
   * )
   * ```
   *
   * @private
   */
  function setBlockTracking(value) {
      shouldTrack$1 += value;
  }
  /**
   * Create a block root vnode. Takes the same exact arguments as `createVNode`.
   * A block root keeps track of dynamic nodes within the block in the
   * `dynamicChildren` array.
   *
   * @private
   */
  function createBlock(type, props, children, patchFlag, dynamicProps) {
      const vnode = createVNode(type, props, children, patchFlag, dynamicProps, true /* isBlock: prevent a block from tracking itself */);
      // save current block children on the block vnode
      vnode.dynamicChildren = currentBlock || EMPTY_ARR;
      // close block
      blockStack.pop();
      currentBlock = blockStack[blockStack.length - 1] || null;
      // a block is always going to be patched, so track it as a child of its
      // parent block
      if (currentBlock) {
          currentBlock.push(vnode);
      }
      return vnode;
  }
  function isVNode(value) {
      return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
      if (
          n2.shapeFlag & 6 /* COMPONENT */ &&
          hmrDirtyComponents.has(n2.type)) {
          // HMR only: if the component has been hot-updated, force a reload.
          return false;
      }
      return n1.type === n2.type && n1.key === n2.key;
  }
  let vnodeArgsTransformer;
  /**
   * Internal API for registering an arguments transform for createVNode
   * used for creating stubs in the test-utils
   * It is *internal* but needs to be exposed for test-utils to pick up proper
   * typings
   */
  function transformVNodeArgs(transformer) {
      vnodeArgsTransformer = transformer;
  }
  const createVNodeWithArgsTransform = (...args) => {
      return _createVNode(...(vnodeArgsTransformer
          ? vnodeArgsTransformer(args, currentRenderingInstance)
          : args));
  };
  const InternalObjectKey = `__vInternal`;
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({ ref }) => {
      return (ref != null
          ? isArray(ref)
              ? ref
              : [currentRenderingInstance, ref]
          : null);
  };
  const createVNode = ( createVNodeWithArgsTransform
      );
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
      if (!type || type === NULL_DYNAMIC_COMPONENT) {
          if ( !type) {
              warn(`Invalid vnode type when creating vnode: ${type}.`);
          }
          type = Comment;
      }
      if (isVNode(type)) {
          return cloneVNode(type, props, children);
      }
      // class component normalization.
      if (isFunction(type) && '__vccOpts' in type) {
          type = type.__vccOpts;
      }
      // class & style normalization.
      if (props) {
          // for reactive or proxy objects, we need to clone it to enable mutation.
          if (isProxy(props) || InternalObjectKey in props) {
              props = extend({}, props);
          }
          let { class: klass, style } = props;
          if (klass && !isString(klass)) {
              props.class = normalizeClass(klass);
          }
          if (isObject(style)) {
              // reactive state objects need to be cloned since they are likely to be
              // mutated
              if (isProxy(style) && !isArray(style)) {
                  style = extend({}, style);
              }
              props.style = normalizeStyle(style);
          }
      }
      // encode the vnode type information into a bitmap
      const shapeFlag = isString(type)
          ? 1 /* ELEMENT */
          :  isSuspense(type)
              ? 128 /* SUSPENSE */
              : isTeleport(type)
                  ? 64 /* TELEPORT */
                  : isObject(type)
                      ? 4 /* STATEFUL_COMPONENT */
                      : isFunction(type)
                          ? 2 /* FUNCTIONAL_COMPONENT */
                          : 0;
      if ( shapeFlag & 4 /* STATEFUL_COMPONENT */ && isProxy(type)) {
          type = toRaw(type);
          warn(`Vue received a Component which was made a reactive object. This can ` +
              `lead to unnecessary performance overhead, and should be avoided by ` +
              `marking the component with \`markRaw\` or using \`shallowRef\` ` +
              `instead of \`ref\`.`, `\nComponent that was made reactive: `, type);
      }
      const vnode = {
          __v_isVNode: true,
          __v_skip: true,
          type,
          props,
          key: props && normalizeKey(props),
          ref: props && normalizeRef(props),
          scopeId: currentScopeId,
          children: null,
          component: null,
          suspense: null,
          dirs: null,
          transition: null,
          el: null,
          anchor: null,
          target: null,
          targetAnchor: null,
          staticCount: 0,
          shapeFlag,
          patchFlag,
          dynamicProps,
          dynamicChildren: null,
          appContext: null
      };
      // validate key
      if ( vnode.key !== vnode.key) {
          warn(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
      }
      normalizeChildren(vnode, children);
      // presence of a patch flag indicates this node needs patching on updates.
      // component nodes also should always be patched, because even if the
      // component doesn't need to update, it needs to persist the instance on to
      // the next vnode so that it can be properly unmounted later.
      if (shouldTrack$1 > 0 &&
          !isBlockNode &&
          currentBlock &&
          // the EVENTS flag is only for hydration and if it is the only flag, the
          // vnode should not be considered dynamic due to handler caching.
          patchFlag !== 32 /* HYDRATE_EVENTS */ &&
          (patchFlag > 0 ||
              shapeFlag & 128 /* SUSPENSE */ ||
              shapeFlag & 64 /* TELEPORT */ ||
              shapeFlag & 4 /* STATEFUL_COMPONENT */ ||
              shapeFlag & 2 /* FUNCTIONAL_COMPONENT */)) {
          currentBlock.push(vnode);
      }
      return vnode;
  }
  function cloneVNode(vnode, extraProps, children) {
      const props = extraProps
          ? vnode.props
              ? mergeProps(vnode.props, extraProps)
              : extend({}, extraProps)
          : vnode.props;
      // This is intentionally NOT using spread or extend to avoid the runtime
      // key enumeration cost.
      const cloned = {
          __v_isVNode: true,
          __v_skip: true,
          type: vnode.type,
          props,
          key: props && normalizeKey(props),
          ref: extraProps && extraProps.ref ? normalizeRef(extraProps) : vnode.ref,
          scopeId: vnode.scopeId,
          children: vnode.children,
          target: vnode.target,
          targetAnchor: vnode.targetAnchor,
          staticCount: vnode.staticCount,
          shapeFlag: vnode.shapeFlag,
          // if the vnode is cloned with extra props, we can no longer assume its
          // existing patch flag to be reliable and need to bail out of optimized mode.
          // however we don't want block nodes to de-opt their children, so if the
          // vnode is a block node, we only add the FULL_PROPS flag to it.
          patchFlag: extraProps
              ? vnode.dynamicChildren
                  ? vnode.patchFlag | 16 /* FULL_PROPS */
                  : -2 /* BAIL */
              : vnode.patchFlag,
          dynamicProps: vnode.dynamicProps,
          dynamicChildren: vnode.dynamicChildren,
          appContext: vnode.appContext,
          dirs: vnode.dirs,
          transition: vnode.transition,
          // These should technically only be non-null on mounted VNodes. However,
          // they *should* be copied for kept-alive vnodes. So we just always copy
          // them since them being non-null during a mount doesn't affect the logic as
          // they will simply be overwritten.
          component: vnode.component,
          suspense: vnode.suspense,
          el: vnode.el,
          anchor: vnode.anchor
      };
      if (children) {
          normalizeChildren(cloned, children);
      }
      return cloned;
  }
  /**
   * @private
   */
  function createTextVNode(text = ' ', flag = 0) {
      return createVNode(Text, null, text, flag);
  }
  /**
   * @private
   */
  function createStaticVNode(content, numberOfNodes) {
      // A static vnode can contain multiple stringified elements, and the number
      // of elements is necessary for hydration.
      const vnode = createVNode(Static, null, content);
      vnode.staticCount = numberOfNodes;
      return vnode;
  }
  /**
   * @private
   */
  function createCommentVNode(text = '', 
  // when used as the v-else branch, the comment node must be created as a
  // block to ensure correct updates.
  asBlock = false) {
      return asBlock
          ? (openBlock(), createBlock(Comment, null, text))
          : createVNode(Comment, null, text);
  }
  function normalizeVNode(child) {
      if (child == null || typeof child === 'boolean') {
          // empty placeholder
          return createVNode(Comment);
      }
      else if (isArray(child)) {
          // fragment
          return createVNode(Fragment, null, child);
      }
      else if (typeof child === 'object') {
          // already vnode, this should be the most common since compiled templates
          // always produce all-vnode children arrays
          return child.el === null ? child : cloneVNode(child);
      }
      else {
          // strings and numbers
          return createVNode(Text, null, String(child));
      }
  }
  // optimized normalization for template-compiled render fns
  function cloneIfMounted(child) {
      return child.el === null ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
      let type = 0;
      const { shapeFlag } = vnode;
      if (children == null) {
          children = null;
      }
      else if (isArray(children)) {
          type = 16 /* ARRAY_CHILDREN */;
      }
      else if (typeof children === 'object') {
          // Normalize slot to plain children
          if ((shapeFlag & 1 /* ELEMENT */ || shapeFlag & 64 /* TELEPORT */) &&
              children.default) {
              normalizeChildren(vnode, children.default());
              return;
          }
          else {
              type = 32 /* SLOTS_CHILDREN */;
              if (!children._ && !(InternalObjectKey in children)) {
                  children._ctx = currentRenderingInstance;
              }
          }
      }
      else if (isFunction(children)) {
          children = { default: children, _ctx: currentRenderingInstance };
          type = 32 /* SLOTS_CHILDREN */;
      }
      else {
          children = String(children);
          // force teleport children to array so it can be moved around
          if (shapeFlag & 64 /* TELEPORT */) {
              type = 16 /* ARRAY_CHILDREN */;
              children = [createTextVNode(children)];
          }
          else {
              type = 8 /* TEXT_CHILDREN */;
          }
      }
      vnode.children = children;
      vnode.shapeFlag |= type;
  }
  const handlersRE = /^on|^vnode/;
  function mergeProps(...args) {
      const ret = extend({}, args[0]);
      for (let i = 1; i < args.length; i++) {
          const toMerge = args[i];
          for (const key in toMerge) {
              if (key === 'class') {
                  if (ret.class !== toMerge.class) {
                      ret.class = normalizeClass([ret.class, toMerge.class]);
                  }
              }
              else if (key === 'style') {
                  ret.style = normalizeStyle([ret.style, toMerge.style]);
              }
              else if (handlersRE.test(key)) {
                  // on*, vnode*
                  const existing = ret[key];
                  const incoming = toMerge[key];
                  if (existing !== incoming) {
                      ret[key] = existing
                          ? [].concat(existing, toMerge[key])
                          : incoming;
                  }
              }
              else {
                  ret[key] = toMerge[key];
              }
          }
      }
      return ret;
  }

  function emit(instance, event, ...args) {
      const props = instance.vnode.props || EMPTY_OBJ;
      {
          const options = normalizeEmitsOptions(instance.type.emits);
          if (options) {
              if (!(event in options)) {
                  const propsOptions = normalizePropsOptions(instance.type)[0];
                  if (!propsOptions || !(`on` + capitalize(event) in propsOptions)) {
                      warn(`Component emitted event "${event}" but it is neither declared in ` +
                          `the emits option nor as an "on${capitalize(event)}" prop.`);
                  }
              }
              else {
                  const validator = options[event];
                  if (isFunction(validator)) {
                      const isValid = validator(...args);
                      if (!isValid) {
                          warn(`Invalid event arguments: event validation failed for event "${event}".`);
                      }
                  }
              }
          }
      }
      let handler = props[`on${capitalize(event)}`];
      // for v-model update:xxx events, also trigger kebab-case equivalent
      // for props passed via kebab-case
      if (!handler && event.startsWith('update:')) {
          event = hyphenate(event);
          handler = props[`on${capitalize(event)}`];
      }
      if (handler) {
          callWithAsyncErrorHandling(handler, instance, 6 /* COMPONENT_EVENT_HANDLER */, args);
      }
  }
  function normalizeEmitsOptions(options) {
      if (!options) {
          return;
      }
      else if (isArray(options)) {
          if (options._n) {
              return options._n;
          }
          const normalized = {};
          options.forEach(key => (normalized[key] = null));
          def(options, '_n', normalized);
          return normalized;
      }
      else {
          return options;
      }
  }
  // Check if an incoming prop key is a declared emit event listener.
  // e.g. With `emits: { click: null }`, props named `onClick` and `onclick` are
  // both considered matched listeners.
  function isEmitListener(emits, key) {
      return (isOn(key) &&
          (hasOwn((emits = normalizeEmitsOptions(emits)), key[2].toLowerCase() + key.slice(3)) ||
              hasOwn(emits, key.slice(2))));
  }

  function initProps(instance, rawProps, isStateful, // result of bitwise flag comparison
  isSSR = false) {
      const props = {};
      const attrs = {};
      def(attrs, InternalObjectKey, 1);
      setFullProps(instance, rawProps, props, attrs);
      // validation
      {
          validateProps(props, instance.type);
      }
      if (isStateful) {
          // stateful
          instance.props = isSSR ? props : shallowReactive(props);
      }
      else {
          if (!instance.type.props) {
              // functional w/ optional props, props === attrs
              instance.props = attrs;
          }
          else {
              // functional w/ declared props
              instance.props = props;
          }
      }
      instance.attrs = attrs;
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
      const { props, attrs, vnode: { patchFlag } } = instance;
      const rawCurrentProps = toRaw(props);
      const [options] = normalizePropsOptions(instance.type);
      if ((optimized || patchFlag > 0) && !(patchFlag & 16 /* FULL_PROPS */)) {
          if (patchFlag & 8 /* PROPS */) {
              // Compiler-generated props & no keys change, just set the updated
              // the props.
              const propsToUpdate = instance.vnode.dynamicProps;
              for (let i = 0; i < propsToUpdate.length; i++) {
                  const key = propsToUpdate[i];
                  // PROPS flag guarantees rawProps to be non-null
                  const value = rawProps[key];
                  if (options) {
                      // attr / props separation was done on init and will be consistent
                      // in this code path, so just check if attrs have it.
                      if (hasOwn(attrs, key)) {
                          attrs[key] = value;
                      }
                      else {
                          const camelizedKey = camelize(key);
                          props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value);
                      }
                  }
                  else {
                      attrs[key] = value;
                  }
              }
          }
      }
      else {
          // full props update.
          setFullProps(instance, rawProps, props, attrs);
          // in case of dynamic props, check if we need to delete keys from
          // the props object
          let kebabKey;
          for (const key in rawCurrentProps) {
              if (!rawProps ||
                  // for camelCase
                  (!hasOwn(rawProps, key) &&
                      // it's possible the original props was passed in as kebab-case
                      // and converted to camelCase (#955)
                      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey)))) {
                  if (options) {
                      if (rawPrevProps &&
                          // for camelCase
                          (rawPrevProps[key] !== undefined ||
                              // for kebab-case
                              rawPrevProps[kebabKey] !== undefined)) {
                          props[key] = resolvePropValue(options, rawProps || EMPTY_OBJ, key, undefined);
                      }
                  }
                  else {
                      delete props[key];
                  }
              }
          }
          // in the case of functional component w/o props declaration, props and
          // attrs point to the same object so it should already have been updated.
          if (attrs !== rawCurrentProps) {
              for (const key in attrs) {
                  if (!rawProps || !hasOwn(rawProps, key)) {
                      delete attrs[key];
                  }
              }
          }
      }
      // trigger updates for $attrs in case it's used in component slots
      trigger(instance, "set" /* SET */, '$attrs');
      if ( rawProps) {
          validateProps(props, instance.type);
      }
  }
  function setFullProps(instance, rawProps, props, attrs) {
      const [options, needCastKeys] = normalizePropsOptions(instance.type);
      const emits = instance.type.emits;
      if (rawProps) {
          for (const key in rawProps) {
              const value = rawProps[key];
              // key, ref are reserved and never passed down
              if (isReservedProp(key)) {
                  continue;
              }
              // prop option names are camelized during normalization, so to support
              // kebab -> camel conversion here we need to camelize the key.
              let camelKey;
              if (options && hasOwn(options, (camelKey = camelize(key)))) {
                  props[camelKey] = value;
              }
              else if ((!emits || !isEmitListener(emits, key)) &&
                  // ignore v-model listeners
                  !key.startsWith(`onUpdate:`)) {
                  // Any non-declared (either as a prop or an emitted event) props are put
                  // into a separate `attrs` object for spreading. Make sure to preserve
                  // original key casing
                  attrs[key] = value;
              }
          }
      }
      if (needCastKeys) {
          const rawCurrentProps = toRaw(props);
          for (let i = 0; i < needCastKeys.length; i++) {
              const key = needCastKeys[i];
              props[key] = resolvePropValue(options, rawCurrentProps, key, rawCurrentProps[key]);
          }
      }
  }
  function resolvePropValue(options, props, key, value) {
      const opt = options[key];
      if (opt != null) {
          const hasDefault = hasOwn(opt, 'default');
          // default values
          if (hasDefault && value === undefined) {
              const defaultValue = opt.default;
              value =
                  opt.type !== Function && isFunction(defaultValue)
                      ? defaultValue()
                      : defaultValue;
          }
          // boolean casting
          if (opt[0 /* shouldCast */]) {
              if (!hasOwn(props, key) && !hasDefault) {
                  value = false;
              }
              else if (opt[1 /* shouldCastTrue */] &&
                  (value === '' || value === hyphenate(key))) {
                  value = true;
              }
          }
      }
      return value;
  }
  function normalizePropsOptions(comp) {
      if (comp.__props) {
          return comp.__props;
      }
      const raw = comp.props;
      const normalized = {};
      const needCastKeys = [];
      // apply mixin/extends props
      let hasExtends = false;
      if ( !isFunction(comp)) {
          const extendProps = (raw) => {
              const [props, keys] = normalizePropsOptions(raw);
              extend(normalized, props);
              if (keys)
                  needCastKeys.push(...keys);
          };
          if (comp.extends) {
              hasExtends = true;
              extendProps(comp.extends);
          }
          if (comp.mixins) {
              hasExtends = true;
              comp.mixins.forEach(extendProps);
          }
      }
      if (!raw && !hasExtends) {
          return (comp.__props = EMPTY_ARR);
      }
      if (isArray(raw)) {
          for (let i = 0; i < raw.length; i++) {
              if ( !isString(raw[i])) {
                  warn(`props must be strings when using array syntax.`, raw[i]);
              }
              const normalizedKey = camelize(raw[i]);
              if (validatePropName(normalizedKey)) {
                  normalized[normalizedKey] = EMPTY_OBJ;
              }
          }
      }
      else if (raw) {
          if ( !isObject(raw)) {
              warn(`invalid props options`, raw);
          }
          for (const key in raw) {
              const normalizedKey = camelize(key);
              if (validatePropName(normalizedKey)) {
                  const opt = raw[key];
                  const prop = (normalized[normalizedKey] =
                      isArray(opt) || isFunction(opt) ? { type: opt } : opt);
                  if (prop) {
                      const booleanIndex = getTypeIndex(Boolean, prop.type);
                      const stringIndex = getTypeIndex(String, prop.type);
                      prop[0 /* shouldCast */] = booleanIndex > -1;
                      prop[1 /* shouldCastTrue */] =
                          stringIndex < 0 || booleanIndex < stringIndex;
                      // if the prop needs boolean casting or default value
                      if (booleanIndex > -1 || hasOwn(prop, 'default')) {
                          needCastKeys.push(normalizedKey);
                      }
                  }
              }
          }
      }
      const normalizedEntry = [normalized, needCastKeys];
      comp.__props = normalizedEntry;
      return normalizedEntry;
  }
  // use function string name to check type constructors
  // so that it works across vms / iframes.
  function getType(ctor) {
      const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
      return match ? match[1] : '';
  }
  function isSameType(a, b) {
      return getType(a) === getType(b);
  }
  function getTypeIndex(type, expectedTypes) {
      if (isArray(expectedTypes)) {
          for (let i = 0, len = expectedTypes.length; i < len; i++) {
              if (isSameType(expectedTypes[i], type)) {
                  return i;
              }
          }
      }
      else if (isFunction(expectedTypes)) {
          return isSameType(expectedTypes, type) ? 0 : -1;
      }
      return -1;
  }
  /**
   * dev only
   */
  function validateProps(props, comp) {
      const rawValues = toRaw(props);
      const options = normalizePropsOptions(comp)[0];
      for (const key in options) {
          let opt = options[key];
          if (opt == null)
              continue;
          validateProp(key, rawValues[key], opt, !hasOwn(rawValues, key));
      }
  }
  /**
   * dev only
   */
  function validatePropName(key) {
      if (key[0] !== '$') {
          return true;
      }
      else {
          warn(`Invalid prop name: "${key}" is a reserved property.`);
      }
      return false;
  }
  /**
   * dev only
   */
  function validateProp(name, value, prop, isAbsent) {
      const { type, required, validator } = prop;
      // required!
      if (required && isAbsent) {
          warn('Missing required prop: "' + name + '"');
          return;
      }
      // missing but optional
      if (value == null && !prop.required) {
          return;
      }
      // type check
      if (type != null && type !== true) {
          let isValid = false;
          const types = isArray(type) ? type : [type];
          const expectedTypes = [];
          // value is valid as long as one of the specified types match
          for (let i = 0; i < types.length && !isValid; i++) {
              const { valid, expectedType } = assertType(value, types[i]);
              expectedTypes.push(expectedType || '');
              isValid = valid;
          }
          if (!isValid) {
              warn(getInvalidTypeMessage(name, value, expectedTypes));
              return;
          }
      }
      // custom validator
      if (validator && !validator(value)) {
          warn('Invalid prop: custom validator check failed for prop "' + name + '".');
      }
  }
  const isSimpleType = /*#__PURE__*/ makeMap('String,Number,Boolean,Function,Symbol');
  /**
   * dev only
   */
  function assertType(value, type) {
      let valid;
      const expectedType = getType(type);
      if (isSimpleType(expectedType)) {
          const t = typeof value;
          valid = t === expectedType.toLowerCase();
          // for primitive wrapper objects
          if (!valid && t === 'object') {
              valid = value instanceof type;
          }
      }
      else if (expectedType === 'Object') {
          valid = toRawType(value) === 'Object';
      }
      else if (expectedType === 'Array') {
          valid = isArray(value);
      }
      else {
          valid = value instanceof type;
      }
      return {
          valid,
          expectedType
      };
  }
  /**
   * dev only
   */
  function getInvalidTypeMessage(name, value, expectedTypes) {
      let message = `Invalid prop: type check failed for prop "${name}".` +
          ` Expected ${expectedTypes.map(capitalize).join(', ')}`;
      const expectedType = expectedTypes[0];
      const receivedType = toRawType(value);
      const expectedValue = styleValue(value, expectedType);
      const receivedValue = styleValue(value, receivedType);
      // check if we need to specify expected value
      if (expectedTypes.length === 1 &&
          isExplicable(expectedType) &&
          !isBoolean(expectedType, receivedType)) {
          message += ` with value ${expectedValue}`;
      }
      message += `, got ${receivedType} `;
      // check if we need to specify received value
      if (isExplicable(receivedType)) {
          message += `with value ${receivedValue}.`;
      }
      return message;
  }
  /**
   * dev only
   */
  function styleValue(value, type) {
      if (type === 'String') {
          return `"${value}"`;
      }
      else if (type === 'Number') {
          return `${Number(value)}`;
      }
      else {
          return `${value}`;
      }
  }
  /**
   * dev only
   */
  function isExplicable(type) {
      const explicitTypes = ['string', 'number', 'boolean'];
      return explicitTypes.some(elem => type.toLowerCase() === elem);
  }
  /**
   * dev only
   */
  function isBoolean(...args) {
      return args.some(elem => elem.toLowerCase() === 'boolean');
  }

  function injectHook(type, hook, target = currentInstance, prepend = false) {
      if (target) {
          const hooks = target[type] || (target[type] = []);
          // cache the error handling wrapper for injected hooks so the same hook
          // can be properly deduped by the scheduler. "__weh" stands for "with error
          // handling".
          const wrappedHook = hook.__weh ||
              (hook.__weh = (...args) => {
                  if (target.isUnmounted) {
                      return;
                  }
                  // disable tracking inside all lifecycle hooks
                  // since they can potentially be called inside effects.
                  pauseTracking();
                  // Set currentInstance during hook invocation.
                  // This assumes the hook does not synchronously trigger other hooks, which
                  // can only be false when the user does something really funky.
                  setCurrentInstance(target);
                  const res = callWithAsyncErrorHandling(hook, target, type, args);
                  setCurrentInstance(null);
                  resetTracking();
                  return res;
              });
          if (prepend) {
              hooks.unshift(wrappedHook);
          }
          else {
              hooks.push(wrappedHook);
          }
      }
      else {
          const apiName = `on${capitalize(ErrorTypeStrings[type].replace(/ hook$/, ''))}`;
          warn(`${apiName} is called when there is no active component instance to be ` +
              `associated with. ` +
              `Lifecycle injection APIs can only be used during execution of setup().` +
              ( ` If you are using async setup(), make sure to register lifecycle ` +
                      `hooks before the first await statement.`
                  ));
      }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => 
  // post-create lifecycle registrations are noops during SSR
  !isInSSRComponentSetup && injectHook(lifecycle, hook, target);
  const onBeforeMount = createHook("bm" /* BEFORE_MOUNT */);
  const onMounted = createHook("m" /* MOUNTED */);
  const onBeforeUpdate = createHook("bu" /* BEFORE_UPDATE */);
  const onUpdated = createHook("u" /* UPDATED */);
  const onBeforeUnmount = createHook("bum" /* BEFORE_UNMOUNT */);
  const onUnmounted = createHook("um" /* UNMOUNTED */);
  const onRenderTriggered = createHook("rtg" /* RENDER_TRIGGERED */);
  const onRenderTracked = createHook("rtc" /* RENDER_TRACKED */);
  const onErrorCaptured = (hook, target = currentInstance) => {
      injectHook("ec" /* ERROR_CAPTURED */, hook, target);
  };

  function useTransitionState() {
      const state = {
          isMounted: false,
          isLeaving: false,
          isUnmounting: false,
          leavingVNodes: new Map()
      };
      onMounted(() => {
          state.isMounted = true;
      });
      onBeforeUnmount(() => {
          state.isUnmounting = true;
      });
      return state;
  }
  const BaseTransitionImpl = {
      name: `BaseTransition`,
      props: {
          mode: String,
          appear: Boolean,
          persisted: Boolean,
          // enter
          onBeforeEnter: Function,
          onEnter: Function,
          onAfterEnter: Function,
          onEnterCancelled: Function,
          // leave
          onBeforeLeave: Function,
          onLeave: Function,
          onAfterLeave: Function,
          onLeaveCancelled: Function,
          // appear
          onBeforeAppear: Function,
          onAppear: Function,
          onAfterAppear: Function,
          onAppearCancelled: Function
      },
      setup(props, { slots }) {
          const instance = getCurrentInstance();
          const state = useTransitionState();
          let prevTransitionKey;
          return () => {
              const children = slots.default && getTransitionRawChildren(slots.default(), true);
              if (!children || !children.length) {
                  return;
              }
              // warn multiple elements
              if ( children.length > 1) {
                  warn('<transition> can only be used on a single element or component. Use ' +
                      '<transition-group> for lists.');
              }
              // there's no need to track reactivity for these props so use the raw
              // props for a bit better perf
              const rawProps = toRaw(props);
              const { mode } = rawProps;
              // check mode
              if ( mode && !['in-out', 'out-in', 'default'].includes(mode)) {
                  warn(`invalid <transition> mode: ${mode}`);
              }
              // at this point children has a guaranteed length of 1.
              const child = children[0];
              if (state.isLeaving) {
                  return emptyPlaceholder(child);
              }
              // in the case of <transition><keep-alive/></transition>, we need to
              // compare the type of the kept-alive children.
              const innerChild = getKeepAliveChild(child);
              if (!innerChild) {
                  return emptyPlaceholder(child);
              }
              const enterHooks = (innerChild.transition = resolveTransitionHooks(innerChild, rawProps, state, instance));
              const oldChild = instance.subTree;
              const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
              let transitionKeyChanged = false;
              const { getTransitionKey } = innerChild.type;
              if (getTransitionKey) {
                  const key = getTransitionKey();
                  if (prevTransitionKey === undefined) {
                      prevTransitionKey = key;
                  }
                  else if (key !== prevTransitionKey) {
                      prevTransitionKey = key;
                      transitionKeyChanged = true;
                  }
              }
              // handle mode
              if (oldInnerChild &&
                  oldInnerChild.type !== Comment &&
                  (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
                  const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
                  // update old tree's hooks in case of dynamic transition
                  setTransitionHooks(oldInnerChild, leavingHooks);
                  // switching between different views
                  if (mode === 'out-in') {
                      state.isLeaving = true;
                      // return placeholder node and queue update when leave finishes
                      leavingHooks.afterLeave = () => {
                          state.isLeaving = false;
                          instance.update();
                      };
                      return emptyPlaceholder(child);
                  }
                  else if (mode === 'in-out') {
                      leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
                          const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
                          leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
                          // early removal callback
                          el._leaveCb = () => {
                              earlyRemove();
                              el._leaveCb = undefined;
                              delete enterHooks.delayedLeave;
                          };
                          enterHooks.delayedLeave = delayedLeave;
                      };
                  }
              }
              return child;
          };
      }
  };
  // export the public type for h/tsx inference
  // also to avoid inline import() in generated d.ts files
  const BaseTransition = BaseTransitionImpl;
  function getLeavingNodesForType(state, vnode) {
      const { leavingVNodes } = state;
      let leavingVNodesCache = leavingVNodes.get(vnode.type);
      if (!leavingVNodesCache) {
          leavingVNodesCache = Object.create(null);
          leavingVNodes.set(vnode.type, leavingVNodesCache);
      }
      return leavingVNodesCache;
  }
  // The transition hooks are attached to the vnode as vnode.transition
  // and will be called at appropriate timing in the renderer.
  function resolveTransitionHooks(vnode, { appear, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled }, state, instance) {
      const key = String(vnode.key);
      const leavingVNodesCache = getLeavingNodesForType(state, vnode);
      const callHook = (hook, args) => {
          hook &&
              callWithAsyncErrorHandling(hook, instance, 9 /* TRANSITION_HOOK */, args);
      };
      const hooks = {
          persisted,
          beforeEnter(el) {
              let hook = onBeforeEnter;
              if (!state.isMounted) {
                  if (appear) {
                      hook = onBeforeAppear || onBeforeEnter;
                  }
                  else {
                      return;
                  }
              }
              // for same element (v-show)
              if (el._leaveCb) {
                  el._leaveCb(true /* cancelled */);
              }
              // for toggled element with same key (v-if)
              const leavingVNode = leavingVNodesCache[key];
              if (leavingVNode &&
                  isSameVNodeType(vnode, leavingVNode) &&
                  leavingVNode.el._leaveCb) {
                  // force early removal (not cancelled)
                  leavingVNode.el._leaveCb();
              }
              callHook(hook, [el]);
          },
          enter(el) {
              let hook = onEnter;
              let afterHook = onAfterEnter;
              let cancelHook = onEnterCancelled;
              if (!state.isMounted) {
                  if (appear) {
                      hook = onAppear || onEnter;
                      afterHook = onAfterAppear || onAfterEnter;
                      cancelHook = onAppearCancelled || onEnterCancelled;
                  }
                  else {
                      return;
                  }
              }
              let called = false;
              const done = (el._enterCb = (cancelled) => {
                  if (called)
                      return;
                  called = true;
                  if (cancelled) {
                      callHook(cancelHook, [el]);
                  }
                  else {
                      callHook(afterHook, [el]);
                  }
                  if (hooks.delayedLeave) {
                      hooks.delayedLeave();
                  }
                  el._enterCb = undefined;
              });
              if (hook) {
                  hook(el, done);
                  if (hook.length <= 1) {
                      done();
                  }
              }
              else {
                  done();
              }
          },
          leave(el, remove) {
              const key = String(vnode.key);
              if (el._enterCb) {
                  el._enterCb(true /* cancelled */);
              }
              if (state.isUnmounting) {
                  return remove();
              }
              callHook(onBeforeLeave, [el]);
              let called = false;
              const done = (el._leaveCb = (cancelled) => {
                  if (called)
                      return;
                  called = true;
                  remove();
                  if (cancelled) {
                      callHook(onLeaveCancelled, [el]);
                  }
                  else {
                      callHook(onAfterLeave, [el]);
                  }
                  el._leaveCb = undefined;
                  if (leavingVNodesCache[key] === vnode) {
                      delete leavingVNodesCache[key];
                  }
              });
              leavingVNodesCache[key] = vnode;
              if (onLeave) {
                  onLeave(el, done);
                  if (onLeave.length <= 1) {
                      done();
                  }
              }
              else {
                  done();
              }
          }
      };
      return hooks;
  }
  // the placeholder really only handles one special case: KeepAlive
  // in the case of a KeepAlive in a leave phase we need to return a KeepAlive
  // placeholder with empty content to avoid the KeepAlive instance from being
  // unmounted.
  function emptyPlaceholder(vnode) {
      if (isKeepAlive(vnode)) {
          vnode = cloneVNode(vnode);
          vnode.children = null;
          return vnode;
      }
  }
  function getKeepAliveChild(vnode) {
      return isKeepAlive(vnode)
          ? vnode.children
              ? vnode.children[0]
              : undefined
          : vnode;
  }
  function setTransitionHooks(vnode, hooks) {
      if (vnode.shapeFlag & 6 /* COMPONENT */ && vnode.component) {
          setTransitionHooks(vnode.component.subTree, hooks);
      }
      else {
          vnode.transition = hooks;
      }
  }
  function getTransitionRawChildren(children, keepComment = false) {
      let ret = [];
      let keyedFragmentCount = 0;
      for (let i = 0; i < children.length; i++) {
          const child = children[i];
          // handle fragment children case, e.g. v-for
          if (child.type === Fragment) {
              if (child.patchFlag & 128 /* KEYED_FRAGMENT */)
                  keyedFragmentCount++;
              ret = ret.concat(getTransitionRawChildren(child.children, keepComment));
          }
          // comment placeholders should be skipped, e.g. v-if
          else if (keepComment || child.type !== Comment) {
              ret.push(child);
          }
      }
      // #1126 if a transition children list contains multiple sub fragments, these
      // fragments will be merged into a flat children array. Since each v-for
      // fragment may contain different static bindings inside, we need to de-top
      // these children to force full diffs to ensure correct behavior.
      if (keyedFragmentCount > 1) {
          for (let i = 0; i < ret.length; i++) {
              ret[i].patchFlag = -2 /* BAIL */;
          }
      }
      return ret;
  }

  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  const KeepAliveImpl = {
      name: `KeepAlive`,
      // Marker for special handling inside the renderer. We are not using a ===
      // check directly on KeepAlive in the renderer, because importing it directly
      // would prevent it from being tree-shaken.
      __isKeepAlive: true,
      inheritRef: true,
      props: {
          include: [String, RegExp, Array],
          exclude: [String, RegExp, Array],
          max: [String, Number]
      },
      setup(props, { slots }) {
          const cache = new Map();
          const keys = new Set();
          let current = null;
          const instance = getCurrentInstance();
          const parentSuspense = instance.suspense;
          // KeepAlive communicates with the instantiated renderer via the
          // ctx where the renderer passes in its internals,
          // and the KeepAlive instance exposes activate/deactivate implementations.
          // The whole point of this is to avoid importing KeepAlive directly in the
          // renderer to facilitate tree-shaking.
          const sharedContext = instance.ctx;
          const { renderer: { p: patch, m: move, um: _unmount, o: { createElement } } } = sharedContext;
          const storageContainer = createElement('div');
          sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
              const instance = vnode.component;
              move(vnode, container, anchor, 0 /* ENTER */, parentSuspense);
              // in case props have changed
              patch(instance.vnode, vnode, container, anchor, instance, parentSuspense, isSVG, optimized);
              queuePostRenderEffect(() => {
                  instance.isDeactivated = false;
                  if (instance.a) {
                      invokeArrayFns(instance.a);
                  }
                  const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
                  if (vnodeHook) {
                      invokeVNodeHook(vnodeHook, instance.parent, vnode);
                  }
              }, parentSuspense);
          };
          sharedContext.deactivate = (vnode) => {
              const instance = vnode.component;
              move(vnode, storageContainer, null, 1 /* LEAVE */, parentSuspense);
              queuePostRenderEffect(() => {
                  if (instance.da) {
                      invokeArrayFns(instance.da);
                  }
                  const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
                  if (vnodeHook) {
                      invokeVNodeHook(vnodeHook, instance.parent, vnode);
                  }
                  instance.isDeactivated = true;
              }, parentSuspense);
          };
          function unmount(vnode) {
              // reset the shapeFlag so it can be properly unmounted
              resetShapeFlag(vnode);
              _unmount(vnode, instance, parentSuspense);
          }
          function pruneCache(filter) {
              cache.forEach((vnode, key) => {
                  const name = getName(vnode.type);
                  if (name && (!filter || !filter(name))) {
                      pruneCacheEntry(key);
                  }
              });
          }
          function pruneCacheEntry(key) {
              const cached = cache.get(key);
              if (!current || cached.type !== current.type) {
                  unmount(cached);
              }
              else if (current) {
                  // current active instance should no longer be kept-alive.
                  // we can't unmount it now but it might be later, so reset its flag now.
                  resetShapeFlag(current);
              }
              cache.delete(key);
              keys.delete(key);
          }
          watch(() => [props.include, props.exclude], ([include, exclude]) => {
              include && pruneCache(name => matches(include, name));
              exclude && pruneCache(name => matches(exclude, name));
          });
          // cache sub tree in beforeMount/Update (i.e. right after the render)
          let pendingCacheKey = null;
          const cacheSubtree = () => {
              if (pendingCacheKey) {
                  cache.set(pendingCacheKey, instance.subTree);
              }
          };
          onBeforeMount(cacheSubtree);
          onBeforeUpdate(cacheSubtree);
          onBeforeUnmount(() => {
              cache.forEach(cached => {
                  const { subTree, suspense } = instance;
                  if (cached.type === subTree.type) {
                      // current instance will be unmounted as part of keep-alive's unmount
                      resetShapeFlag(subTree);
                      // but invoke its deactivated hook here
                      const da = subTree.component.da;
                      da && queuePostRenderEffect(da, suspense);
                      return;
                  }
                  unmount(cached);
              });
          });
          return () => {
              pendingCacheKey = null;
              if (!slots.default) {
                  return null;
              }
              const children = slots.default();
              let vnode = children[0];
              if (children.length > 1) {
                  {
                      warn(`KeepAlive should contain exactly one component child.`);
                  }
                  current = null;
                  return children;
              }
              else if (!isVNode(vnode) ||
                  !(vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */)) {
                  current = null;
                  return vnode;
              }
              const comp = vnode.type;
              const name = getName(comp);
              const { include, exclude, max } = props;
              if ((include && (!name || !matches(include, name))) ||
                  (exclude && name && matches(exclude, name))) {
                  return (current = vnode);
              }
              const key = vnode.key == null ? comp : vnode.key;
              const cachedVNode = cache.get(key);
              // clone vnode if it's reused because we are going to mutate it
              if (vnode.el) {
                  vnode = cloneVNode(vnode);
              }
              // #1513 it's possible for the returned vnode to be cloned due to attr
              // fallthrough or scopeId, so the vnode here may not be the final vnode
              // that is mounted. Instead of caching it directly, we store the pending
              // key and cache `instance.subTree` (the normalized vnode) in
              // beforeMount/beforeUpdate hooks.
              pendingCacheKey = key;
              if (cachedVNode) {
                  // copy over mounted state
                  vnode.el = cachedVNode.el;
                  vnode.component = cachedVNode.component;
                  if (vnode.transition) {
                      // recursively update transition hooks on subTree
                      setTransitionHooks(vnode, vnode.transition);
                  }
                  // avoid vnode being mounted as fresh
                  vnode.shapeFlag |= 512 /* COMPONENT_KEPT_ALIVE */;
                  // make this key the freshest
                  keys.delete(key);
                  keys.add(key);
              }
              else {
                  keys.add(key);
                  // prune oldest entry
                  if (max && keys.size > parseInt(max, 10)) {
                      pruneCacheEntry(keys.values().next().value);
                  }
              }
              // avoid vnode being unmounted
              vnode.shapeFlag |= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
              current = vnode;
              return vnode;
          };
      }
  };
  // export the public type for h/tsx inference
  // also to avoid inline import() in generated d.ts files
  const KeepAlive = KeepAliveImpl;
  function getName(comp) {
      return comp.displayName || comp.name;
  }
  function matches(pattern, name) {
      if (isArray(pattern)) {
          return pattern.some((p) => matches(p, name));
      }
      else if (isString(pattern)) {
          return pattern.split(',').indexOf(name) > -1;
      }
      else if (pattern.test) {
          return pattern.test(name);
      }
      /* istanbul ignore next */
      return false;
  }
  function onActivated(hook, target) {
      registerKeepAliveHook(hook, "a" /* ACTIVATED */, target);
  }
  function onDeactivated(hook, target) {
      registerKeepAliveHook(hook, "da" /* DEACTIVATED */, target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
      // cache the deactivate branch check wrapper for injected hooks so the same
      // hook can be properly deduped by the scheduler. "__wdc" stands for "with
      // deactivation check".
      const wrappedHook = hook.__wdc ||
          (hook.__wdc = () => {
              // only fire the hook if the target instance is NOT in a deactivated branch.
              let current = target;
              while (current) {
                  if (current.isDeactivated) {
                      return;
                  }
                  current = current.parent;
              }
              hook();
          });
      injectHook(type, wrappedHook, target);
      // In addition to registering it on the target instance, we walk up the parent
      // chain and register it on all ancestor instances that are keep-alive roots.
      // This avoids the need to walk the entire component tree when invoking these
      // hooks, and more importantly, avoids the need to track child components in
      // arrays.
      if (target) {
          let current = target.parent;
          while (current && current.parent) {
              if (isKeepAlive(current.parent.vnode)) {
                  injectToKeepAliveRoot(wrappedHook, type, target, current);
              }
              current = current.parent;
          }
      }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
      injectHook(type, hook, keepAliveRoot, true /* prepend */);
      onUnmounted(() => {
          remove(keepAliveRoot[type], hook);
      }, target);
  }
  function resetShapeFlag(vnode) {
      let shapeFlag = vnode.shapeFlag;
      if (shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
          shapeFlag -= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
      }
      if (shapeFlag & 512 /* COMPONENT_KEPT_ALIVE */) {
          shapeFlag -= 512 /* COMPONENT_KEPT_ALIVE */;
      }
      vnode.shapeFlag = shapeFlag;
  }

  const isInternalKey = (key) => key[0] === '_' || key === '$stable';
  const normalizeSlotValue = (value) => isArray(value)
      ? value.map(normalizeVNode)
      : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => withCtx((props) => {
      if ( currentInstance) {
          warn(`Slot "${key}" invoked outside of the render function: ` +
              `this will not track dependencies used in the slot. ` +
              `Invoke the slot function inside the render function instead.`);
      }
      return normalizeSlotValue(rawSlot(props));
  }, ctx);
  const normalizeObjectSlots = (rawSlots, slots) => {
      const ctx = rawSlots._ctx;
      for (const key in rawSlots) {
          if (isInternalKey(key))
              continue;
          const value = rawSlots[key];
          if (isFunction(value)) {
              slots[key] = normalizeSlot(key, value, ctx);
          }
          else if (value != null) {
              {
                  warn(`Non-function value encountered for slot "${key}". ` +
                      `Prefer function slots for better performance.`);
              }
              const normalized = normalizeSlotValue(value);
              slots[key] = () => normalized;
          }
      }
  };
  const normalizeVNodeSlots = (instance, children) => {
      if ( !isKeepAlive(instance.vnode)) {
          warn(`Non-function value encountered for default slot. ` +
              `Prefer function slots for better performance.`);
      }
      const normalized = normalizeSlotValue(children);
      instance.slots.default = () => normalized;
  };
  const initSlots = (instance, children) => {
      if (instance.vnode.shapeFlag & 32 /* SLOTS_CHILDREN */) {
          if (children._ === 1) {
              instance.slots = children;
              // make compiler marker non-enumerable
              def(children, '_', 1);
          }
          else {
              normalizeObjectSlots(children, (instance.slots = {}));
          }
      }
      else {
          instance.slots = {};
          if (children) {
              normalizeVNodeSlots(instance, children);
          }
      }
      def(instance.slots, InternalObjectKey, 1);
  };
  const updateSlots = (instance, children) => {
      const { vnode, slots } = instance;
      let needDeletionCheck = true;
      let deletionComparisonTarget = EMPTY_OBJ;
      if (vnode.shapeFlag & 32 /* SLOTS_CHILDREN */) {
          if (children._ === 1) {
              // compiled slots.
              if ( isHmrUpdating) {
                  // Parent was HMR updated so slot content may have changed.
                  // force update slots and mark instance for hmr as well
                  extend(slots, children);
              }
              else if (
              // bail on dynamic slots (v-if, v-for, reference of scope variables)
              !(vnode.patchFlag & 1024 /* DYNAMIC_SLOTS */)) {
                  // compiled AND static.
                  // no need to update, and skip stale slots removal.
                  needDeletionCheck = false;
              }
              else {
                  // compiled but dynamic - update slots, but skip normalization.
                  extend(slots, children);
              }
          }
          else {
              needDeletionCheck = !children.$stable;
              normalizeObjectSlots(children, slots);
          }
          deletionComparisonTarget = children;
      }
      else if (children) {
          // non slot object children (direct value) passed to a component
          normalizeVNodeSlots(instance, children);
          deletionComparisonTarget = { default: 1 };
      }
      // delete stale slots
      if (needDeletionCheck) {
          for (const key in slots) {
              if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
                  delete slots[key];
              }
          }
      }
  };

  /**
  Runtime helper for applying directives to a vnode. Example usage:

  const comp = resolveComponent('comp')
  const foo = resolveDirective('foo')
  const bar = resolveDirective('bar')

  return withDirectives(h(comp), [
    [foo, this.x],
    [bar, this.y]
  ])
  */
  const isBuiltInDirective = /*#__PURE__*/ makeMap('bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text');
  function validateDirectiveName(name) {
      if (isBuiltInDirective(name)) {
          warn('Do not use built-in directive ids as custom directive id: ' + name);
      }
  }
  /**
   * Adds directives to a VNode.
   */
  function withDirectives(vnode, directives) {
      const internalInstance = currentRenderingInstance;
      if (internalInstance === null) {
           warn(`withDirectives can only be used inside render functions.`);
          return vnode;
      }
      const instance = internalInstance.proxy;
      const bindings = vnode.dirs || (vnode.dirs = []);
      for (let i = 0; i < directives.length; i++) {
          let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
          if (isFunction(dir)) {
              dir = {
                  mounted: dir,
                  updated: dir
              };
          }
          bindings.push({
              dir,
              instance,
              value,
              oldValue: void 0,
              arg,
              modifiers
          });
      }
      return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
      const bindings = vnode.dirs;
      const oldBindings = prevVNode && prevVNode.dirs;
      for (let i = 0; i < bindings.length; i++) {
          const binding = bindings[i];
          if (oldBindings) {
              binding.oldValue = oldBindings[i].value;
          }
          const hook = binding.dir[name];
          if (hook) {
              callWithAsyncErrorHandling(hook, instance, 8 /* DIRECTIVE_HOOK */, [
                  vnode.el,
                  binding,
                  vnode,
                  prevVNode
              ]);
          }
      }
  }

  function createAppContext() {
      return {
          config: {
              isNativeTag: NO,
              devtools: true,
              performance: false,
              globalProperties: {},
              optionMergeStrategies: {},
              isCustomElement: NO,
              errorHandler: undefined,
              warnHandler: undefined
          },
          mixins: [],
          components: {},
          directives: {},
          provides: Object.create(null)
      };
  }
  function createAppAPI(render, hydrate) {
      return function createApp(rootComponent, rootProps = null) {
          if (rootProps != null && !isObject(rootProps)) {
               warn(`root props passed to app.mount() must be an object.`);
              rootProps = null;
          }
          const context = createAppContext();
          const installedPlugins = new Set();
          let isMounted = false;
          const app = {
              _component: rootComponent,
              _props: rootProps,
              _container: null,
              _context: context,
              version,
              get config() {
                  return context.config;
              },
              set config(v) {
                  {
                      warn(`app.config cannot be replaced. Modify individual options instead.`);
                  }
              },
              use(plugin, ...options) {
                  if (installedPlugins.has(plugin)) {
                       warn(`Plugin has already been applied to target app.`);
                  }
                  else if (plugin && isFunction(plugin.install)) {
                      installedPlugins.add(plugin);
                      plugin.install(app, ...options);
                  }
                  else if (isFunction(plugin)) {
                      installedPlugins.add(plugin);
                      plugin(app, ...options);
                  }
                  else {
                      warn(`A plugin must either be a function or an object with an "install" ` +
                          `function.`);
                  }
                  return app;
              },
              mixin(mixin) {
                  {
                      if (!context.mixins.includes(mixin)) {
                          context.mixins.push(mixin);
                      }
                      else {
                          warn('Mixin has already been applied to target app' +
                              (mixin.name ? `: ${mixin.name}` : ''));
                      }
                  }
                  return app;
              },
              component(name, component) {
                  {
                      validateComponentName(name, context.config);
                  }
                  if (!component) {
                      return context.components[name];
                  }
                  if ( context.components[name]) {
                      warn(`Component "${name}" has already been registered in target app.`);
                  }
                  context.components[name] = component;
                  return app;
              },
              directive(name, directive) {
                  {
                      validateDirectiveName(name);
                  }
                  if (!directive) {
                      return context.directives[name];
                  }
                  if ( context.directives[name]) {
                      warn(`Directive "${name}" has already been registered in target app.`);
                  }
                  context.directives[name] = directive;
                  return app;
              },
              mount(rootContainer, isHydrate) {
                  if (!isMounted) {
                      const vnode = createVNode(rootComponent, rootProps);
                      // store app context on the root VNode.
                      // this will be set on the root instance on initial mount.
                      vnode.appContext = context;
                      // HMR root reload
                      {
                          context.reload = () => {
                              render(cloneVNode(vnode), rootContainer);
                          };
                      }
                      if (isHydrate && hydrate) {
                          hydrate(vnode, rootContainer);
                      }
                      else {
                          render(vnode, rootContainer);
                      }
                      isMounted = true;
                      app._container = rootContainer;
                      return vnode.component.proxy;
                  }
                  else {
                      warn(`App has already been mounted.\n` +
                          `If you want to remount the same app, move your app creation logic ` +
                          `into a factory function and create fresh app instances for each ` +
                          `mount - e.g. \`const createMyApp = () => createApp(App)\``);
                  }
              },
              unmount() {
                  if (isMounted) {
                      render(null, app._container);
                  }
                  else {
                      warn(`Cannot unmount an app that is not mounted.`);
                  }
              },
              provide(key, value) {
                  if ( key in context.provides) {
                      warn(`App already provides property with key "${String(key)}". ` +
                          `It will be overwritten with the new value.`);
                  }
                  // TypeScript doesn't allow symbols as index type
                  // https://github.com/Microsoft/TypeScript/issues/24587
                  context.provides[key] = value;
                  return app;
              }
          };
          return app;
      };
  }

  let hasMismatch = false;
  const isSVGContainer = (container) => /svg/.test(container.namespaceURI) && container.tagName !== 'foreignObject';
  const isComment = (node) => node.nodeType === 8 /* COMMENT */;
  // Note: hydration is DOM-specific
  // But we have to place it in core due to tight coupling with core - splitting
  // it out creates a ton of unnecessary complexity.
  // Hydration also depends on some renderer internal logic which needs to be
  // passed in via arguments.
  function createHydrationFunctions(rendererInternals) {
      const { mt: mountComponent, p: patch, o: { patchProp, nextSibling, parentNode, remove, insert, createComment } } = rendererInternals;
      const hydrate = (vnode, container) => {
          if ( !container.hasChildNodes()) {
              warn(`Attempting to hydrate existing markup but container is empty. ` +
                  `Performing full mount instead.`);
              patch(null, vnode, container);
              return;
          }
          hasMismatch = false;
          hydrateNode(container.firstChild, vnode, null, null);
          flushPostFlushCbs();
          if (hasMismatch && !false) {
              // this error should show up in production
              console.error(`Hydration completed but contains mismatches.`);
          }
      };
      const hydrateNode = (node, vnode, parentComponent, parentSuspense, optimized = false) => {
          const isFragmentStart = isComment(node) && node.data === '[';
          const onMismatch = () => handleMismtach(node, vnode, parentComponent, parentSuspense, isFragmentStart);
          const { type, ref, shapeFlag } = vnode;
          const domType = node.nodeType;
          vnode.el = node;
          let nextNode = null;
          switch (type) {
              case Text:
                  if (domType !== 3 /* TEXT */) {
                      nextNode = onMismatch();
                  }
                  else {
                      if (node.data !== vnode.children) {
                          hasMismatch = true;
                          
                              warn(`Hydration text mismatch:` +
                                  `\n- Client: ${JSON.stringify(node.data)}` +
                                  `\n- Server: ${JSON.stringify(vnode.children)}`);
                          node.data = vnode.children;
                      }
                      nextNode = nextSibling(node);
                  }
                  break;
              case Comment:
                  if (domType !== 8 /* COMMENT */ || isFragmentStart) {
                      nextNode = onMismatch();
                  }
                  else {
                      nextNode = nextSibling(node);
                  }
                  break;
              case Static:
                  if (domType !== 1 /* ELEMENT */) {
                      nextNode = onMismatch();
                  }
                  else {
                      // determine anchor, adopt content
                      nextNode = node;
                      // if the static vnode has its content stripped during build,
                      // adopt it from the server-rendered HTML.
                      const needToAdoptContent = !vnode.children.length;
                      for (let i = 0; i < vnode.staticCount; i++) {
                          if (needToAdoptContent)
                              vnode.children += nextNode.outerHTML;
                          if (i === vnode.staticCount - 1) {
                              vnode.anchor = nextNode;
                          }
                          nextNode = nextSibling(nextNode);
                      }
                      return nextNode;
                  }
                  break;
              case Fragment:
                  if (!isFragmentStart) {
                      nextNode = onMismatch();
                  }
                  else {
                      nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, optimized);
                  }
                  break;
              default:
                  if (shapeFlag & 1 /* ELEMENT */) {
                      if (domType !== 1 /* ELEMENT */ ||
                          vnode.type !== node.tagName.toLowerCase()) {
                          nextNode = onMismatch();
                      }
                      else {
                          nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, optimized);
                      }
                  }
                  else if (shapeFlag & 6 /* COMPONENT */) {
                      // when setting up the render effect, if the initial vnode already
                      // has .el set, the component will perform hydration instead of mount
                      // on its sub-tree.
                      const container = parentNode(node);
                      const hydrateComponent = () => {
                          mountComponent(vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), optimized);
                      };
                      // async component
                      const loadAsync = vnode.type.__asyncLoader;
                      if (loadAsync) {
                          loadAsync().then(hydrateComponent);
                      }
                      else {
                          hydrateComponent();
                      }
                      // component may be async, so in the case of fragments we cannot rely
                      // on component's rendered output to determine the end of the fragment
                      // instead, we do a lookahead to find the end anchor node.
                      nextNode = isFragmentStart
                          ? locateClosingAsyncAnchor(node)
                          : nextSibling(node);
                  }
                  else if (shapeFlag & 64 /* TELEPORT */) {
                      if (domType !== 8 /* COMMENT */) {
                          nextNode = onMismatch();
                      }
                      else {
                          nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, optimized, rendererInternals, hydrateChildren);
                      }
                  }
                  else if ( shapeFlag & 128 /* SUSPENSE */) {
                      nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, isSVGContainer(parentNode(node)), optimized, rendererInternals, hydrateNode);
                  }
                  else {
                      warn('Invalid HostVNode type:', type, `(${typeof type})`);
                  }
          }
          if (ref != null && parentComponent) {
              setRef(ref, null, parentComponent, parentSuspense, vnode);
          }
          return nextNode;
      };
      const hydrateElement = (el, vnode, parentComponent, parentSuspense, optimized) => {
          optimized = optimized || !!vnode.dynamicChildren;
          const { props, patchFlag, shapeFlag, dirs } = vnode;
          // skip props & children if this is hoisted static nodes
          if (patchFlag !== -1 /* HOISTED */) {
              // props
              if (props) {
                  if (!optimized ||
                      (patchFlag & 16 /* FULL_PROPS */ ||
                          patchFlag & 32 /* HYDRATE_EVENTS */)) {
                      for (const key in props) {
                          if (!isReservedProp(key) && isOn(key)) {
                              patchProp(el, key, null, props[key]);
                          }
                      }
                  }
                  else if (props.onClick) {
                      // Fast path for click listeners (which is most often) to avoid
                      // iterating through props.
                      patchProp(el, 'onClick', null, props.onClick);
                  }
              }
              // vnode / directive hooks
              let vnodeHooks;
              if ((vnodeHooks = props && props.onVnodeBeforeMount)) {
                  invokeVNodeHook(vnodeHooks, parentComponent, vnode);
              }
              if (dirs) {
                  invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
              }
              if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
                  queueEffectWithSuspense(() => {
                      vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
                      dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
                  }, parentSuspense);
              }
              // children
              if (shapeFlag & 16 /* ARRAY_CHILDREN */ &&
                  // skip if element has innerHTML / textContent
                  !(props && (props.innerHTML || props.textContent))) {
                  let next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, optimized);
                  let hasWarned = false;
                  while (next) {
                      hasMismatch = true;
                      if ( !hasWarned) {
                          warn(`Hydration children mismatch in <${vnode.type}>: ` +
                              `server rendered element contains more child nodes than client vdom.`);
                          hasWarned = true;
                      }
                      // The SSRed DOM contains more nodes than it should. Remove them.
                      const cur = next;
                      next = next.nextSibling;
                      remove(cur);
                  }
              }
              else if (shapeFlag & 8 /* TEXT_CHILDREN */) {
                  if (el.textContent !== vnode.children) {
                      hasMismatch = true;
                      
                          warn(`Hydration text content mismatch in <${vnode.type}>:\n` +
                              `- Client: ${el.textContent}\n` +
                              `- Server: ${vnode.children}`);
                      el.textContent = vnode.children;
                  }
              }
          }
          return el.nextSibling;
      };
      const hydrateChildren = (node, vnode, container, parentComponent, parentSuspense, optimized) => {
          optimized = optimized || !!vnode.dynamicChildren;
          const children = vnode.children;
          const l = children.length;
          let hasWarned = false;
          for (let i = 0; i < l; i++) {
              const vnode = optimized
                  ? children[i]
                  : (children[i] = normalizeVNode(children[i]));
              if (node) {
                  node = hydrateNode(node, vnode, parentComponent, parentSuspense, optimized);
              }
              else {
                  hasMismatch = true;
                  if ( !hasWarned) {
                      warn(`Hydration children mismatch in <${container.tagName.toLowerCase()}>: ` +
                          `server rendered element contains fewer child nodes than client vdom.`);
                      hasWarned = true;
                  }
                  // the SSRed DOM didn't contain enough nodes. Mount the missing ones.
                  patch(null, vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container));
              }
          }
          return node;
      };
      const hydrateFragment = (node, vnode, parentComponent, parentSuspense, optimized) => {
          const container = parentNode(node);
          const next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, optimized);
          if (next && isComment(next) && next.data === ']') {
              return nextSibling((vnode.anchor = next));
          }
          else {
              // fragment didn't hydrate successfully, since we didn't get a end anchor
              // back. This should have led to node/children mismatch warnings.
              hasMismatch = true;
              // since the anchor is missing, we need to create one and insert it
              insert((vnode.anchor = createComment(`]`)), container, next);
              return next;
          }
      };
      const handleMismtach = (node, vnode, parentComponent, parentSuspense, isFragment) => {
          hasMismatch = true;
          
              warn(`Hydration node mismatch:\n- Client vnode:`, vnode.type, `\n- Server rendered DOM:`, node, node.nodeType === 3 /* TEXT */
                  ? `(text)`
                  : isComment(node) && node.data === '['
                      ? `(start of fragment)`
                      : ``);
          vnode.el = null;
          if (isFragment) {
              // remove excessive fragment nodes
              const end = locateClosingAsyncAnchor(node);
              while (true) {
                  const next = nextSibling(node);
                  if (next && next !== end) {
                      remove(next);
                  }
                  else {
                      break;
                  }
              }
          }
          const next = nextSibling(node);
          const container = parentNode(node);
          remove(node);
          patch(null, vnode, container, next, parentComponent, parentSuspense, isSVGContainer(container));
          return next;
      };
      const locateClosingAsyncAnchor = (node) => {
          let match = 0;
          while (node) {
              node = nextSibling(node);
              if (node && isComment(node)) {
                  if (node.data === '[')
                      match++;
                  if (node.data === ']') {
                      if (match === 0) {
                          return nextSibling(node);
                      }
                      else {
                          match--;
                      }
                  }
              }
          }
          return node;
      };
      return [hydrate, hydrateNode];
  }

  let supported;
  let perf;
  function startMeasure(instance, type) {
      if (instance.appContext.config.performance && isSupported()) {
          perf.mark(`vue-${type}-${instance.uid}`);
      }
  }
  function endMeasure(instance, type) {
      if (instance.appContext.config.performance && isSupported()) {
          const startTag = `vue-${type}-${instance.uid}`;
          const endTag = startTag + `:end`;
          perf.mark(endTag);
          perf.measure(`<${formatComponentName(instance, instance.type)}> ${type}`, startTag, endTag);
          perf.clearMarks(startTag);
          perf.clearMarks(endTag);
      }
  }
  function isSupported() {
      if (supported !== undefined) {
          return supported;
      }
      /* eslint-disable no-restricted-globals */
      if (typeof window !== 'undefined' && window.performance) {
          supported = true;
          perf = window.performance;
      }
      else {
          supported = false;
      }
      /* eslint-enable no-restricted-globals */
      return supported;
  }

  function createDevEffectOptions(instance) {
      return {
          scheduler: queueJob,
          onTrack: instance.rtc ? e => invokeArrayFns(instance.rtc, e) : void 0,
          onTrigger: instance.rtg ? e => invokeArrayFns(instance.rtg, e) : void 0
      };
  }
  const queuePostRenderEffect =  queueEffectWithSuspense
      ;
  const setRef = (rawRef, oldRawRef, parentComponent, parentSuspense, vnode) => {
      let value;
      if (!vnode) {
          value = null;
      }
      else {
          if (vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */) {
              value = vnode.component.proxy;
          }
          else {
              value = vnode.el;
          }
      }
      const [owner, ref] = rawRef;
      if ( !owner) {
          warn(`Missing ref owner context. ref cannot be used on hoisted vnodes. ` +
              `A vnode with ref must be created inside the render function.`);
          return;
      }
      const oldRef = oldRawRef && oldRawRef[1];
      const refs = owner.refs === EMPTY_OBJ ? (owner.refs = {}) : owner.refs;
      const setupState = owner.setupState;
      // unset old ref
      if (oldRef != null && oldRef !== ref) {
          if (isString(oldRef)) {
              refs[oldRef] = null;
              if (hasOwn(setupState, oldRef)) {
                  queuePostRenderEffect(() => {
                      setupState[oldRef] = null;
                  }, parentSuspense);
              }
          }
          else if (isRef(oldRef)) {
              oldRef.value = null;
          }
      }
      if (isString(ref)) {
          refs[ref] = value;
          if (hasOwn(setupState, ref)) {
              queuePostRenderEffect(() => {
                  setupState[ref] = value;
              }, parentSuspense);
          }
      }
      else if (isRef(ref)) {
          ref.value = value;
      }
      else if (isFunction(ref)) {
          callWithErrorHandling(ref, parentComponent, 12 /* FUNCTION_REF */, [
              value,
              refs
          ]);
      }
      else {
          warn('Invalid template ref type:', value, `(${typeof value})`);
      }
  };
  /**
   * The createRenderer function accepts two generic arguments:
   * HostNode and HostElement, corresponding to Node and Element types in the
   * host environment. For example, for runtime-dom, HostNode would be the DOM
   * `Node` interface and HostElement would be the DOM `Element` interface.
   *
   * Custom renderers can pass in the platform specific types like this:
   *
   * ``` js
   * const { render, createApp } = createRenderer<Node, Element>({
   *   patchProp,
   *   ...nodeOps
   * })
   * ```
   */
  function createRenderer(options) {
      return baseCreateRenderer(options);
  }
  // Separate API for creating hydration-enabled renderer.
  // Hydration logic is only used when calling this function, making it
  // tree-shakable.
  function createHydrationRenderer(options) {
      return baseCreateRenderer(options, createHydrationFunctions);
  }
  // implementation
  function baseCreateRenderer(options, createHydrationFns) {
      const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, forcePatchProp: hostForcePatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
      // Note: functions inside this closure should use `const xxx = () => {}`
      // style in order to prevent being inlined by minifiers.
      const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, optimized = false) => {
          // patching & not same type, unmount old tree
          if (n1 && !isSameVNodeType(n1, n2)) {
              anchor = getNextHostNode(n1);
              unmount(n1, parentComponent, parentSuspense, true);
              n1 = null;
          }
          if (n2.patchFlag === -2 /* BAIL */) {
              optimized = false;
              n2.dynamicChildren = null;
          }
          const { type, ref, shapeFlag } = n2;
          switch (type) {
              case Text:
                  processText(n1, n2, container, anchor);
                  break;
              case Comment:
                  processCommentNode(n1, n2, container, anchor);
                  break;
              case Static:
                  if (n1 == null) {
                      mountStaticNode(n2, container, anchor, isSVG);
                  }
                  else {
                      patchStaticNode(n1, n2, container, isSVG);
                  }
                  break;
              case Fragment:
                  processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                  break;
              default:
                  if (shapeFlag & 1 /* ELEMENT */) {
                      processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                  }
                  else if (shapeFlag & 6 /* COMPONENT */) {
                      processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                  }
                  else if (shapeFlag & 64 /* TELEPORT */) {
                      type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals);
                  }
                  else if ( shapeFlag & 128 /* SUSPENSE */) {
                      type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals);
                  }
                  else {
                      warn('Invalid VNode type:', type, `(${typeof type})`);
                  }
          }
          // set ref
          if (ref != null && parentComponent) {
              setRef(ref, n1 && n1.ref, parentComponent, parentSuspense, n2);
          }
      };
      const processText = (n1, n2, container, anchor) => {
          if (n1 == null) {
              hostInsert((n2.el = hostCreateText(n2.children)), container, anchor);
          }
          else {
              const el = (n2.el = n1.el);
              if (n2.children !== n1.children) {
                  hostSetText(el, n2.children);
              }
          }
      };
      const processCommentNode = (n1, n2, container, anchor) => {
          if (n1 == null) {
              hostInsert((n2.el = hostCreateComment(n2.children || '')), container, anchor);
          }
          else {
              // there's no support for dynamic comments
              n2.el = n1.el;
          }
      };
      const mountStaticNode = (n2, container, anchor, isSVG) => {
          [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
      };
      /**
       * Dev / HMR only
       */
      const patchStaticNode = (n1, n2, container, isSVG) => {
          // static nodes are only patched during dev for HMR
          if (n2.children !== n1.children) {
              const anchor = hostNextSibling(n1.anchor);
              // remove existing
              removeStaticNode(n1);
              [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
          }
          else {
              n2.el = n1.el;
              n2.anchor = n1.anchor;
          }
      };
      /**
       * Dev / HMR only
       */
      const moveStaticNode = (vnode, container, anchor) => {
          let cur = vnode.el;
          const end = vnode.anchor;
          while (cur && cur !== end) {
              const next = hostNextSibling(cur);
              hostInsert(cur, container, anchor);
              cur = next;
          }
          hostInsert(end, container, anchor);
      };
      /**
       * Dev / HMR only
       */
      const removeStaticNode = (vnode) => {
          let cur = vnode.el;
          while (cur && cur !== vnode.anchor) {
              const next = hostNextSibling(cur);
              hostRemove(cur);
              cur = next;
          }
          hostRemove(vnode.anchor);
      };
      const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
          isSVG = isSVG || n2.type === 'svg';
          if (n1 == null) {
              mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
          }
          else {
              patchElement(n1, n2, parentComponent, parentSuspense, isSVG, optimized);
          }
      };
      const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
          let el;
          let vnodeHook;
          const { type, props, shapeFlag, transition, scopeId, patchFlag, dirs } = vnode;
          if (vnode.el &&
              hostCloneNode !== undefined &&
              patchFlag === -1 /* HOISTED */) {
              // If a vnode has non-null el, it means it's being reused.
              // Only static vnodes can be reused, so its mounted DOM nodes should be
              // exactly the same, and we can simply do a clone here.
              el = vnode.el = hostCloneNode(vnode.el);
          }
          else {
              el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is);
              // mount children first, since some props may rely on child content
              // being already rendered, e.g. `<select value>`
              if (shapeFlag & 8 /* TEXT_CHILDREN */) {
                  hostSetElementText(el, vnode.children);
              }
              else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                  mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== 'foreignObject', optimized || !!vnode.dynamicChildren);
              }
              // props
              if (props) {
                  for (const key in props) {
                      if (!isReservedProp(key)) {
                          hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
                      }
                  }
                  if ((vnodeHook = props.onVnodeBeforeMount)) {
                      invokeVNodeHook(vnodeHook, parentComponent, vnode);
                  }
              }
              if (dirs) {
                  invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount');
              }
              // scopeId
              if (scopeId) {
                  hostSetScopeId(el, scopeId);
              }
              const treeOwnerId = parentComponent && parentComponent.type.__scopeId;
              // vnode's own scopeId and the current patched component's scopeId is
              // different - this is a slot content node.
              if (treeOwnerId && treeOwnerId !== scopeId) {
                  hostSetScopeId(el, treeOwnerId + '-s');
              }
              if (transition && !transition.persisted) {
                  transition.beforeEnter(el);
              }
          }
          hostInsert(el, container, anchor);
          if ((vnodeHook = props && props.onVnodeMounted) ||
              (transition && !transition.persisted) ||
              dirs) {
              queuePostRenderEffect(() => {
                  vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
                  transition && !transition.persisted && transition.enter(el);
                  dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted');
              }, parentSuspense);
          }
      };
      const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, optimized, start = 0) => {
          for (let i = start; i < children.length; i++) {
              const child = (children[i] = optimized
                  ? cloneIfMounted(children[i])
                  : normalizeVNode(children[i]));
              patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
          }
      };
      const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, optimized) => {
          const el = (n2.el = n1.el);
          let { patchFlag, dynamicChildren, dirs } = n2;
          // #1426 take the old vnode's patch flag into account since user may clone a
          // compiler-generated vnode, which de-opts to FULL_PROPS
          patchFlag |= n1.patchFlag & 16 /* FULL_PROPS */;
          const oldProps = n1.props || EMPTY_OBJ;
          const newProps = n2.props || EMPTY_OBJ;
          let vnodeHook;
          if ((vnodeHook = newProps.onVnodeBeforeUpdate)) {
              invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          }
          if (dirs) {
              invokeDirectiveHook(n2, n1, parentComponent, 'beforeUpdate');
          }
          if ( isHmrUpdating) {
              // HMR updated, force full diff
              patchFlag = 0;
              optimized = false;
              dynamicChildren = null;
          }
          if (patchFlag > 0) {
              // the presence of a patchFlag means this element's render code was
              // generated by the compiler and can take the fast path.
              // in this path old node and new node are guaranteed to have the same shape
              // (i.e. at the exact same position in the source template)
              if (patchFlag & 16 /* FULL_PROPS */) {
                  // element props contain dynamic keys, full diff needed
                  patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
              }
              else {
                  // class
                  // this flag is matched when the element has dynamic class bindings.
                  if (patchFlag & 2 /* CLASS */) {
                      if (oldProps.class !== newProps.class) {
                          hostPatchProp(el, 'class', null, newProps.class, isSVG);
                      }
                  }
                  // style
                  // this flag is matched when the element has dynamic style bindings
                  if (patchFlag & 4 /* STYLE */) {
                      hostPatchProp(el, 'style', oldProps.style, newProps.style, isSVG);
                  }
                  // props
                  // This flag is matched when the element has dynamic prop/attr bindings
                  // other than class and style. The keys of dynamic prop/attrs are saved for
                  // faster iteration.
                  // Note dynamic keys like :[foo]="bar" will cause this optimization to
                  // bail out and go through a full diff because we need to unset the old key
                  if (patchFlag & 8 /* PROPS */) {
                      // if the flag is present then dynamicProps must be non-null
                      const propsToUpdate = n2.dynamicProps;
                      for (let i = 0; i < propsToUpdate.length; i++) {
                          const key = propsToUpdate[i];
                          const prev = oldProps[key];
                          const next = newProps[key];
                          if (next !== prev ||
                              (hostForcePatchProp && hostForcePatchProp(el, key))) {
                              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
                          }
                      }
                  }
              }
              // text
              // This flag is matched when the element has only dynamic text children.
              if (patchFlag & 1 /* TEXT */) {
                  if (n1.children !== n2.children) {
                      hostSetElementText(el, n2.children);
                  }
              }
          }
          else if (!optimized && dynamicChildren == null) {
              // unoptimized, full diff
              patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
          }
          const areChildrenSVG = isSVG && n2.type !== 'foreignObject';
          if (dynamicChildren) {
              patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG);
              if ( parentComponent && parentComponent.type.__hmrId) {
                  traverseStaticChildren(n1, n2);
              }
          }
          else if (!optimized) {
              // full diff
              patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG);
          }
          if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
              queuePostRenderEffect(() => {
                  vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
                  dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated');
              }, parentSuspense);
          }
      };
      // The fast path for blocks.
      const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG) => {
          for (let i = 0; i < newChildren.length; i++) {
              const oldVNode = oldChildren[i];
              const newVNode = newChildren[i];
              // Determine the container (parent element) for the patch.
              const container = 
              // - In the case of a Fragment, we need to provide the actual parent
              // of the Fragment itself so it can move its children.
              oldVNode.type === Fragment ||
                  // - In the case of different nodes, there is going to be a replacement
                  // which also requires the correct parent container
                  !isSameVNodeType(oldVNode, newVNode) ||
                  // - In the case of a component, it could contain anything.
                  oldVNode.shapeFlag & 6 /* COMPONENT */
                  ? hostParentNode(oldVNode.el)
                  : // In other cases, the parent container is not actually used so we
                      // just pass the block element here to avoid a DOM parentNode call.
                      fallbackContainer;
              patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, true);
          }
      };
      const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
          if (oldProps !== newProps) {
              for (const key in newProps) {
                  if (isReservedProp(key))
                      continue;
                  const next = newProps[key];
                  const prev = oldProps[key];
                  if (next !== prev ||
                      (hostForcePatchProp && hostForcePatchProp(el, key))) {
                      hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
                  }
              }
              if (oldProps !== EMPTY_OBJ) {
                  for (const key in oldProps) {
                      if (!isReservedProp(key) && !(key in newProps)) {
                          hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
                      }
                  }
              }
          }
      };
      const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
          const fragmentStartAnchor = (n2.el = n1 ? n1.el : hostCreateText(''));
          const fragmentEndAnchor = (n2.anchor = n1 ? n1.anchor : hostCreateText(''));
          let { patchFlag, dynamicChildren } = n2;
          if (patchFlag > 0) {
              optimized = true;
          }
          if ( isHmrUpdating) {
              // HMR updated, force full diff
              patchFlag = 0;
              optimized = false;
              dynamicChildren = null;
          }
          if (n1 == null) {
              hostInsert(fragmentStartAnchor, container, anchor);
              hostInsert(fragmentEndAnchor, container, anchor);
              // a fragment can only have array children
              // since they are either generated by the compiler, or implicitly created
              // from arrays.
              mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, optimized);
          }
          else {
              if (patchFlag > 0 &&
                  patchFlag & 64 /* STABLE_FRAGMENT */ &&
                  dynamicChildren) {
                  // a stable fragment (template root or <template v-for>) doesn't need to
                  // patch children order, but it may contain dynamicChildren.
                  patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG);
                  if ( parentComponent && parentComponent.type.__hmrId) {
                      traverseStaticChildren(n1, n2);
                  }
              }
              else {
                  // keyed / unkeyed, or manual fragments.
                  // for keyed & unkeyed, since they are compiler generated from v-for,
                  // each child is guaranteed to be a block so the fragment will never
                  // have dynamicChildren.
                  patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, optimized);
              }
          }
      };
      const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
          if (n1 == null) {
              if (n2.shapeFlag & 512 /* COMPONENT_KEPT_ALIVE */) {
                  parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
              }
              else {
                  mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
              }
          }
          else {
              updateComponent(n1, n2, optimized);
          }
      };
      const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
          const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense));
          if ( instance.type.__hmrId) {
              registerHMR(instance);
          }
          {
              pushWarningContext(initialVNode);
              startMeasure(instance, `mount`);
          }
          // inject renderer internals for keepAlive
          if (isKeepAlive(initialVNode)) {
              instance.ctx.renderer = internals;
          }
          // resolve props and slots for setup context
          {
              startMeasure(instance, `init`);
          }
          setupComponent(instance);
          {
              endMeasure(instance, `init`);
          }
          // setup() is async. This component relies on async logic to be resolved
          // before proceeding
          if ( instance.asyncDep) {
              if (!parentSuspense) {
                  warn('async setup() is used without a suspense boundary!');
                  return;
              }
              parentSuspense.registerDep(instance, setupRenderEffect);
              // Give it a placeholder if this is not hydration
              if (!initialVNode.el) {
                  const placeholder = (instance.subTree = createVNode(Comment));
                  processCommentNode(null, placeholder, container, anchor);
              }
              return;
          }
          setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
          {
              popWarningContext();
              endMeasure(instance, `mount`);
          }
      };
      const updateComponent = (n1, n2, optimized) => {
          const instance = (n2.component = n1.component);
          if (shouldUpdateComponent(n1, n2, optimized)) {
              if (
                  instance.asyncDep &&
                  !instance.asyncResolved) {
                  // async & still pending - just update props and slots
                  // since the component's reactive effect for render isn't set-up yet
                  {
                      pushWarningContext(n2);
                  }
                  updateComponentPreRender(instance, n2, optimized);
                  {
                      popWarningContext();
                  }
                  return;
              }
              else {
                  // normal update
                  instance.next = n2;
                  // in case the child component is also queued, remove it to avoid
                  // double updating the same child component in the same flush.
                  invalidateJob(instance.update);
                  // instance.update is the reactive effect runner.
                  instance.update();
              }
          }
          else {
              // no update needed. just copy over properties
              n2.component = n1.component;
              n2.el = n1.el;
              instance.vnode = n2;
          }
      };
      const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
          // create reactive effect for rendering
          instance.update = effect(function componentEffect() {
              if (!instance.isMounted) {
                  let vnodeHook;
                  const { el, props } = initialVNode;
                  const { bm, m, a, parent } = instance;
                  {
                      startMeasure(instance, `render`);
                  }
                  const subTree = (instance.subTree = renderComponentRoot(instance));
                  {
                      endMeasure(instance, `render`);
                  }
                  // beforeMount hook
                  if (bm) {
                      invokeArrayFns(bm);
                  }
                  // onVnodeBeforeMount
                  if ((vnodeHook = props && props.onVnodeBeforeMount)) {
                      invokeVNodeHook(vnodeHook, parent, initialVNode);
                  }
                  if (el && hydrateNode) {
                      {
                          startMeasure(instance, `hydrate`);
                      }
                      // vnode has adopted host node - perform hydration instead of mount.
                      hydrateNode(initialVNode.el, subTree, instance, parentSuspense);
                      {
                          endMeasure(instance, `hydrate`);
                      }
                  }
                  else {
                      {
                          startMeasure(instance, `patch`);
                      }
                      patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
                      {
                          endMeasure(instance, `patch`);
                      }
                      initialVNode.el = subTree.el;
                  }
                  // mounted hook
                  if (m) {
                      queuePostRenderEffect(m, parentSuspense);
                  }
                  // onVnodeMounted
                  if ((vnodeHook = props && props.onVnodeMounted)) {
                      queuePostRenderEffect(() => {
                          invokeVNodeHook(vnodeHook, parent, initialVNode);
                      }, parentSuspense);
                  }
                  // activated hook for keep-alive roots.
                  if (a &&
                      initialVNode.shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
                      queuePostRenderEffect(a, parentSuspense);
                  }
                  instance.isMounted = true;
              }
              else {
                  // updateComponent
                  // This is triggered by mutation of component's own state (next: null)
                  // OR parent calling processComponent (next: VNode)
                  let { next, bu, u, parent, vnode } = instance;
                  let originNext = next;
                  let vnodeHook;
                  {
                      pushWarningContext(next || instance.vnode);
                  }
                  if (next) {
                      updateComponentPreRender(instance, next, optimized);
                  }
                  else {
                      next = vnode;
                  }
                  {
                      startMeasure(instance, `render`);
                  }
                  const nextTree = renderComponentRoot(instance);
                  {
                      endMeasure(instance, `render`);
                  }
                  const prevTree = instance.subTree;
                  instance.subTree = nextTree;
                  next.el = vnode.el;
                  // beforeUpdate hook
                  if (bu) {
                      invokeArrayFns(bu);
                  }
                  // onVnodeBeforeUpdate
                  if ((vnodeHook = next.props && next.props.onVnodeBeforeUpdate)) {
                      invokeVNodeHook(vnodeHook, parent, next, vnode);
                  }
                  // reset refs
                  // only needed if previous patch had refs
                  if (instance.refs !== EMPTY_OBJ) {
                      instance.refs = {};
                  }
                  {
                      startMeasure(instance, `patch`);
                  }
                  patch(prevTree, nextTree, 
                  // parent may have changed if it's in a teleport
                  hostParentNode(prevTree.el), 
                  // anchor may have changed if it's in a fragment
                  getNextHostNode(prevTree), instance, parentSuspense, isSVG);
                  {
                      endMeasure(instance, `patch`);
                  }
                  next.el = nextTree.el;
                  if (originNext === null) {
                      // self-triggered update. In case of HOC, update parent component
                      // vnode el. HOC is indicated by parent instance's subTree pointing
                      // to child component's vnode
                      updateHOCHostEl(instance, nextTree.el);
                  }
                  // updated hook
                  if (u) {
                      queuePostRenderEffect(u, parentSuspense);
                  }
                  // onVnodeUpdated
                  if ((vnodeHook = next.props && next.props.onVnodeUpdated)) {
                      queuePostRenderEffect(() => {
                          invokeVNodeHook(vnodeHook, parent, next, vnode);
                      }, parentSuspense);
                  }
                  {
                      popWarningContext();
                  }
              }
          },  createDevEffectOptions(instance) );
      };
      const updateComponentPreRender = (instance, nextVNode, optimized) => {
          if ( instance.type.__hmrId) {
              optimized = false;
          }
          nextVNode.component = instance;
          const prevProps = instance.vnode.props;
          instance.vnode = nextVNode;
          instance.next = null;
          updateProps(instance, nextVNode.props, prevProps, optimized);
          updateSlots(instance, nextVNode.children);
      };
      const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized = false) => {
          const c1 = n1 && n1.children;
          const prevShapeFlag = n1 ? n1.shapeFlag : 0;
          const c2 = n2.children;
          const { patchFlag, shapeFlag } = n2;
          // fast path
          if (patchFlag > 0) {
              if (patchFlag & 128 /* KEYED_FRAGMENT */) {
                  // this could be either fully-keyed or mixed (some keyed some not)
                  // presence of patchFlag means children are guaranteed to be arrays
                  patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                  return;
              }
              else if (patchFlag & 256 /* UNKEYED_FRAGMENT */) {
                  // unkeyed
                  patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                  return;
              }
          }
          // children has 3 possibilities: text, array or no children.
          if (shapeFlag & 8 /* TEXT_CHILDREN */) {
              // text children fast path
              if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
                  unmountChildren(c1, parentComponent, parentSuspense);
              }
              if (c2 !== c1) {
                  hostSetElementText(container, c2);
              }
          }
          else {
              if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
                  // prev children was array
                  if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                      // two arrays, cannot assume anything, do full diff
                      patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                  }
                  else {
                      // no new children, just unmount old
                      unmountChildren(c1, parentComponent, parentSuspense, true);
                  }
              }
              else {
                  // prev children was text OR null
                  // new children is array OR null
                  if (prevShapeFlag & 8 /* TEXT_CHILDREN */) {
                      hostSetElementText(container, '');
                  }
                  // mount new if array
                  if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
                  }
              }
          }
      };
      const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
          c1 = c1 || EMPTY_ARR;
          c2 = c2 || EMPTY_ARR;
          const oldLength = c1.length;
          const newLength = c2.length;
          const commonLength = Math.min(oldLength, newLength);
          let i;
          for (i = 0; i < commonLength; i++) {
              const nextChild = (c2[i] = optimized
                  ? cloneIfMounted(c2[i])
                  : normalizeVNode(c2[i]));
              patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, optimized);
          }
          if (oldLength > newLength) {
              // remove old
              unmountChildren(c1, parentComponent, parentSuspense, true, commonLength);
          }
          else {
              // mount new
              mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, commonLength);
          }
      };
      // can be all-keyed or mixed
      const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) => {
          let i = 0;
          const l2 = c2.length;
          let e1 = c1.length - 1; // prev ending index
          let e2 = l2 - 1; // next ending index
          // 1. sync from start
          // (a b) c
          // (a b) d e
          while (i <= e1 && i <= e2) {
              const n1 = c1[i];
              const n2 = (c2[i] = optimized
                  ? cloneIfMounted(c2[i])
                  : normalizeVNode(c2[i]));
              if (isSameVNodeType(n1, n2)) {
                  patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, optimized);
              }
              else {
                  break;
              }
              i++;
          }
          // 2. sync from end
          // a (b c)
          // d e (b c)
          while (i <= e1 && i <= e2) {
              const n1 = c1[e1];
              const n2 = (c2[e2] = optimized
                  ? cloneIfMounted(c2[e2])
                  : normalizeVNode(c2[e2]));
              if (isSameVNodeType(n1, n2)) {
                  patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, optimized);
              }
              else {
                  break;
              }
              e1--;
              e2--;
          }
          // 3. common sequence + mount
          // (a b)
          // (a b) c
          // i = 2, e1 = 1, e2 = 2
          // (a b)
          // c (a b)
          // i = 0, e1 = -1, e2 = 0
          if (i > e1) {
              if (i <= e2) {
                  const nextPos = e2 + 1;
                  const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
                  while (i <= e2) {
                      patch(null, (c2[i] = optimized
                          ? cloneIfMounted(c2[i])
                          : normalizeVNode(c2[i])), container, anchor, parentComponent, parentSuspense, isSVG);
                      i++;
                  }
              }
          }
          // 4. common sequence + unmount
          // (a b) c
          // (a b)
          // i = 2, e1 = 2, e2 = 1
          // a (b c)
          // (b c)
          // i = 0, e1 = 0, e2 = -1
          else if (i > e2) {
              while (i <= e1) {
                  unmount(c1[i], parentComponent, parentSuspense, true);
                  i++;
              }
          }
          // 5. unknown sequence
          // [i ... e1 + 1]: a b [c d e] f g
          // [i ... e2 + 1]: a b [e d c h] f g
          // i = 2, e1 = 4, e2 = 5
          else {
              const s1 = i; // prev starting index
              const s2 = i; // next starting index
              // 5.1 build key:index map for newChildren
              const keyToNewIndexMap = new Map();
              for (i = s2; i <= e2; i++) {
                  const nextChild = (c2[i] = optimized
                      ? cloneIfMounted(c2[i])
                      : normalizeVNode(c2[i]));
                  if (nextChild.key != null) {
                      if ( keyToNewIndexMap.has(nextChild.key)) {
                          warn(`Duplicate keys found during update:`, JSON.stringify(nextChild.key), `Make sure keys are unique.`);
                      }
                      keyToNewIndexMap.set(nextChild.key, i);
                  }
              }
              // 5.2 loop through old children left to be patched and try to patch
              // matching nodes & remove nodes that are no longer present
              let j;
              let patched = 0;
              const toBePatched = e2 - s2 + 1;
              let moved = false;
              // used to track whether any node has moved
              let maxNewIndexSoFar = 0;
              // works as Map<newIndex, oldIndex>
              // Note that oldIndex is offset by +1
              // and oldIndex = 0 is a special value indicating the new node has
              // no corresponding old node.
              // used for determining longest stable subsequence
              const newIndexToOldIndexMap = new Array(toBePatched);
              for (i = 0; i < toBePatched; i++)
                  newIndexToOldIndexMap[i] = 0;
              for (i = s1; i <= e1; i++) {
                  const prevChild = c1[i];
                  if (patched >= toBePatched) {
                      // all new children have been patched so this can only be a removal
                      unmount(prevChild, parentComponent, parentSuspense, true);
                      continue;
                  }
                  let newIndex;
                  if (prevChild.key != null) {
                      newIndex = keyToNewIndexMap.get(prevChild.key);
                  }
                  else {
                      // key-less node, try to locate a key-less node of the same type
                      for (j = s2; j <= e2; j++) {
                          if (newIndexToOldIndexMap[j - s2] === 0 &&
                              isSameVNodeType(prevChild, c2[j])) {
                              newIndex = j;
                              break;
                          }
                      }
                  }
                  if (newIndex === undefined) {
                      unmount(prevChild, parentComponent, parentSuspense, true);
                  }
                  else {
                      newIndexToOldIndexMap[newIndex - s2] = i + 1;
                      if (newIndex >= maxNewIndexSoFar) {
                          maxNewIndexSoFar = newIndex;
                      }
                      else {
                          moved = true;
                      }
                      patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, optimized);
                      patched++;
                  }
              }
              // 5.3 move and mount
              // generate longest stable subsequence only when nodes have moved
              const increasingNewIndexSequence = moved
                  ? getSequence(newIndexToOldIndexMap)
                  : EMPTY_ARR;
              j = increasingNewIndexSequence.length - 1;
              // looping backwards so that we can use last patched node as anchor
              for (i = toBePatched - 1; i >= 0; i--) {
                  const nextIndex = s2 + i;
                  const nextChild = c2[nextIndex];
                  const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
                  if (newIndexToOldIndexMap[i] === 0) {
                      // mount new
                      patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG);
                  }
                  else if (moved) {
                      // move if:
                      // There is no stable subsequence (e.g. a reverse)
                      // OR current node is not among the stable sequence
                      if (j < 0 || i !== increasingNewIndexSequence[j]) {
                          move(nextChild, container, anchor, 2 /* REORDER */);
                      }
                      else {
                          j--;
                      }
                  }
              }
          }
      };
      const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
          const { el, type, transition, children, shapeFlag } = vnode;
          if (shapeFlag & 6 /* COMPONENT */) {
              move(vnode.component.subTree, container, anchor, moveType);
              return;
          }
          if ( shapeFlag & 128 /* SUSPENSE */) {
              vnode.suspense.move(container, anchor, moveType);
              return;
          }
          if (shapeFlag & 64 /* TELEPORT */) {
              type.move(vnode, container, anchor, internals);
              return;
          }
          if (type === Fragment) {
              hostInsert(el, container, anchor);
              for (let i = 0; i < children.length; i++) {
                  move(children[i], container, anchor, moveType);
              }
              hostInsert(vnode.anchor, container, anchor);
              return;
          }
          // static node move can only happen when force updating HMR
          if ( type === Static) {
              moveStaticNode(vnode, container, anchor);
              return;
          }
          // single nodes
          const needTransition = moveType !== 2 /* REORDER */ &&
              shapeFlag & 1 /* ELEMENT */ &&
              transition;
          if (needTransition) {
              if (moveType === 0 /* ENTER */) {
                  transition.beforeEnter(el);
                  hostInsert(el, container, anchor);
                  queuePostRenderEffect(() => transition.enter(el), parentSuspense);
              }
              else {
                  const { leave, delayLeave, afterLeave } = transition;
                  const remove = () => hostInsert(el, container, anchor);
                  const performLeave = () => {
                      leave(el, () => {
                          remove();
                          afterLeave && afterLeave();
                      });
                  };
                  if (delayLeave) {
                      delayLeave(el, remove, performLeave);
                  }
                  else {
                      performLeave();
                  }
              }
          }
          else {
              hostInsert(el, container, anchor);
          }
      };
      const unmount = (vnode, parentComponent, parentSuspense, doRemove = false) => {
          const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
          // unset ref
          if (ref != null && parentComponent) {
              setRef(ref, null, parentComponent, parentSuspense, null);
          }
          if (shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
              parentComponent.ctx.deactivate(vnode);
              return;
          }
          const shouldInvokeDirs = shapeFlag & 1 /* ELEMENT */ && dirs;
          let vnodeHook;
          if ((vnodeHook = props && props.onVnodeBeforeUnmount)) {
              invokeVNodeHook(vnodeHook, parentComponent, vnode);
          }
          if (shapeFlag & 6 /* COMPONENT */) {
              unmountComponent(vnode.component, parentSuspense, doRemove);
          }
          else {
              if ( shapeFlag & 128 /* SUSPENSE */) {
                  vnode.suspense.unmount(parentSuspense, doRemove);
                  return;
              }
              if (shouldInvokeDirs) {
                  invokeDirectiveHook(vnode, null, parentComponent, 'beforeUnmount');
              }
              if (dynamicChildren &&
                  // #1153: fast path should not be taken for non-stable (v-for) fragments
                  (type !== Fragment ||
                      (patchFlag > 0 && patchFlag & 64 /* STABLE_FRAGMENT */))) {
                  // fast path for block nodes: only need to unmount dynamic children.
                  unmountChildren(dynamicChildren, parentComponent, parentSuspense);
              }
              else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
                  unmountChildren(children, parentComponent, parentSuspense);
              }
              // an unmounted teleport should always remove its children
              if (shapeFlag & 64 /* TELEPORT */) {
                  vnode.type.remove(vnode, internals);
              }
              if (doRemove) {
                  remove(vnode);
              }
          }
          if ((vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
              queuePostRenderEffect(() => {
                  vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
                  shouldInvokeDirs &&
                      invokeDirectiveHook(vnode, null, parentComponent, 'unmounted');
              }, parentSuspense);
          }
      };
      const remove = vnode => {
          const { type, el, anchor, transition } = vnode;
          if (type === Fragment) {
              removeFragment(el, anchor);
              return;
          }
          if ( type === Static) {
              removeStaticNode(vnode);
              return;
          }
          const performRemove = () => {
              hostRemove(el);
              if (transition && !transition.persisted && transition.afterLeave) {
                  transition.afterLeave();
              }
          };
          if (vnode.shapeFlag & 1 /* ELEMENT */ &&
              transition &&
              !transition.persisted) {
              const { leave, delayLeave } = transition;
              const performLeave = () => leave(el, performRemove);
              if (delayLeave) {
                  delayLeave(vnode.el, performRemove, performLeave);
              }
              else {
                  performLeave();
              }
          }
          else {
              performRemove();
          }
      };
      const removeFragment = (cur, end) => {
          // For fragments, directly remove all contained DOM nodes.
          // (fragment child nodes cannot have transition)
          let next;
          while (cur !== end) {
              next = hostNextSibling(cur);
              hostRemove(cur);
              cur = next;
          }
          hostRemove(end);
      };
      const unmountComponent = (instance, parentSuspense, doRemove) => {
          if ( instance.type.__hmrId) {
              unregisterHMR(instance);
          }
          const { bum, effects, update, subTree, um, da, isDeactivated } = instance;
          // beforeUnmount hook
          if (bum) {
              invokeArrayFns(bum);
          }
          // update may be null if a component is unmounted before its async
          // setup has resolved.
          if (update) {
              stop(update);
              unmount(subTree, instance, parentSuspense, doRemove);
          }
          if (effects) {
              queuePostRenderEffect(() => {
                  for (let i = 0; i < effects.length; i++) {
                      stop(effects[i]);
                  }
              }, parentSuspense);
          }
          // unmounted hook
          if (um) {
              queuePostRenderEffect(um, parentSuspense);
          }
          // deactivated hook
          if (da &&
              !isDeactivated &&
              instance.vnode.shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
              queuePostRenderEffect(da, parentSuspense);
          }
          queuePostRenderEffect(() => {
              instance.isUnmounted = true;
          }, parentSuspense);
          // A component with async dep inside a pending suspense is unmounted before
          // its async dep resolves. This should remove the dep from the suspense, and
          // cause the suspense to resolve immediately if that was the last dep.
          if (
              parentSuspense &&
              !parentSuspense.isResolved &&
              !parentSuspense.isUnmounted &&
              instance.asyncDep &&
              !instance.asyncResolved) {
              parentSuspense.deps--;
              if (parentSuspense.deps === 0) {
                  parentSuspense.resolve();
              }
          }
      };
      const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, start = 0) => {
          for (let i = start; i < children.length; i++) {
              unmount(children[i], parentComponent, parentSuspense, doRemove);
          }
      };
      const getNextHostNode = vnode => {
          if (vnode.shapeFlag & 6 /* COMPONENT */) {
              return getNextHostNode(vnode.component.subTree);
          }
          if ( vnode.shapeFlag & 128 /* SUSPENSE */) {
              return vnode.suspense.next();
          }
          return hostNextSibling((vnode.anchor || vnode.el));
      };
      /**
       * #1156
       * When a component is HMR-enabled, we need to make sure that all static nodes
       * inside a block also inherit the DOM element from the previous tree so that
       * HMR updates (which are full updates) can retrieve the element for patching.
       *
       * Dev only.
       */
      const traverseStaticChildren = (n1, n2) => {
          const ch1 = n1.children;
          const ch2 = n2.children;
          if (isArray(ch1) && isArray(ch2)) {
              for (let i = 0; i < ch1.length; i++) {
                  const c1 = ch1[i];
                  const c2 = ch2[i];
                  if (isVNode(c1) &&
                      isVNode(c2) &&
                      c2.shapeFlag & 1 /* ELEMENT */ &&
                      !c2.dynamicChildren) {
                      if (c2.patchFlag <= 0) {
                          c2.el = c1.el;
                      }
                      traverseStaticChildren(c1, c2);
                  }
              }
          }
      };
      const render = (vnode, container) => {
          if (vnode == null) {
              if (container._vnode) {
                  unmount(container._vnode, null, null, true);
              }
          }
          else {
              patch(container._vnode || null, vnode, container);
          }
          flushPostFlushCbs();
          container._vnode = vnode;
      };
      const internals = {
          p: patch,
          um: unmount,
          m: move,
          r: remove,
          mt: mountComponent,
          mc: mountChildren,
          pc: patchChildren,
          pbc: patchBlockChildren,
          n: getNextHostNode,
          o: options
      };
      let hydrate;
      let hydrateNode;
      if (createHydrationFns) {
          [hydrate, hydrateNode] = createHydrationFns(internals);
      }
      return {
          render,
          hydrate,
          createApp: createAppAPI(render, hydrate)
      };
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
      callWithAsyncErrorHandling(hook, instance, 7 /* VNODE_HOOK */, [
          vnode,
          prevVNode
      ]);
  }
  // https://en.wikipedia.org/wiki/Longest_increasing_subsequence
  function getSequence(arr) {
      const p = arr.slice();
      const result = [0];
      let i, j, u, v, c;
      const len = arr.length;
      for (i = 0; i < len; i++) {
          const arrI = arr[i];
          if (arrI !== 0) {
              j = result[result.length - 1];
              if (arr[j] < arrI) {
                  p[i] = j;
                  result.push(i);
                  continue;
              }
              u = 0;
              v = result.length - 1;
              while (u < v) {
                  c = ((u + v) / 2) | 0;
                  if (arr[result[c]] < arrI) {
                      u = c + 1;
                  }
                  else {
                      v = c;
                  }
              }
              if (arrI < arr[result[u]]) {
                  if (u > 0) {
                      p[i] = result[u - 1];
                  }
                  result[u] = i;
              }
          }
      }
      u = result.length;
      v = result[u - 1];
      while (u-- > 0) {
          result[u] = v;
          v = p[v];
      }
      return result;
  }

  const invoke = (fn) => fn();
  // Simple effect.
  function watchEffect(effect, options) {
      return doWatch(effect, null, options);
  }
  // initial value for watchers to trigger on undefined initial values
  const INITIAL_WATCHER_VALUE = {};
  // implementation
  function watch(source, cb, options) {
      if ( !isFunction(cb)) {
          warn(`\`watch(fn, options?)\` signature has been moved to a separate API. ` +
              `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
              `supports \`watch(source, cb, options?) signature.`);
      }
      return doWatch(source, cb, options);
  }
  function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ, instance = currentInstance) {
      if ( !cb) {
          if (immediate !== undefined) {
              warn(`watch() "immediate" option is only respected when using the ` +
                  `watch(source, callback, options?) signature.`);
          }
          if (deep !== undefined) {
              warn(`watch() "deep" option is only respected when using the ` +
                  `watch(source, callback, options?) signature.`);
          }
      }
      const warnInvalidSource = (s) => {
          warn(`Invalid watch source: `, s, `A watch source can only be a getter/effect function, a ref, ` +
              `a reactive object, or an array of these types.`);
      };
      let getter;
      if (isArray(source)) {
          getter = () => source.map(s => {
              if (isRef(s)) {
                  return s.value;
              }
              else if (isReactive(s)) {
                  return traverse(s);
              }
              else if (isFunction(s)) {
                  return callWithErrorHandling(s, instance, 2 /* WATCH_GETTER */);
              }
              else {
                   warnInvalidSource(s);
              }
          });
      }
      else if (isRef(source)) {
          getter = () => source.value;
      }
      else if (isReactive(source)) {
          getter = () => source;
          deep = true;
      }
      else if (isFunction(source)) {
          if (cb) {
              // getter with cb
              getter = () => callWithErrorHandling(source, instance, 2 /* WATCH_GETTER */);
          }
          else {
              // no cb -> simple effect
              getter = () => {
                  if (instance && instance.isUnmounted) {
                      return;
                  }
                  if (cleanup) {
                      cleanup();
                  }
                  return callWithErrorHandling(source, instance, 3 /* WATCH_CALLBACK */, [onInvalidate]);
              };
          }
      }
      else {
          getter = NOOP;
           warnInvalidSource(source);
      }
      if (cb && deep) {
          const baseGetter = getter;
          getter = () => traverse(baseGetter());
      }
      let cleanup;
      const onInvalidate = (fn) => {
          cleanup = runner.options.onStop = () => {
              callWithErrorHandling(fn, instance, 4 /* WATCH_CLEANUP */);
          };
      };
      let oldValue = isArray(source) ? [] : INITIAL_WATCHER_VALUE;
      const applyCb = cb
          ? () => {
              if (instance && instance.isUnmounted) {
                  return;
              }
              const newValue = runner();
              if (deep || hasChanged(newValue, oldValue)) {
                  // cleanup before running cb again
                  if (cleanup) {
                      cleanup();
                  }
                  callWithAsyncErrorHandling(cb, instance, 3 /* WATCH_CALLBACK */, [
                      newValue,
                      // pass undefined as the old value when it's changed for the first time
                      oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
                      onInvalidate
                  ]);
                  oldValue = newValue;
              }
          }
          : void 0;
      let scheduler;
      if (flush === 'sync') {
          scheduler = invoke;
      }
      else if (flush === 'pre') {
          scheduler = job => {
              if (!instance || instance.isMounted) {
                  queueJob(job);
              }
              else {
                  // with 'pre' option, the first call must happen before
                  // the component is mounted so it is called synchronously.
                  job();
              }
          };
      }
      else {
          scheduler = job => queuePostRenderEffect(job, instance && instance.suspense);
      }
      const runner = effect(getter, {
          lazy: true,
          // so it runs before component update effects in pre flush mode
          computed: true,
          onTrack,
          onTrigger,
          scheduler: applyCb ? () => scheduler(applyCb) : scheduler
      });
      recordInstanceBoundEffect(runner);
      // initial run
      if (applyCb) {
          if (immediate) {
              applyCb();
          }
          else {
              oldValue = runner();
          }
      }
      else {
          runner();
      }
      return () => {
          stop(runner);
          if (instance) {
              remove(instance.effects, runner);
          }
      };
  }
  // this.$watch
  function instanceWatch(source, cb, options) {
      const publicThis = this.proxy;
      const getter = isString(source)
          ? () => publicThis[source]
          : source.bind(publicThis);
      return doWatch(getter, cb.bind(publicThis), options, this);
  }
  function traverse(value, seen = new Set()) {
      if (!isObject(value) || seen.has(value)) {
          return value;
      }
      seen.add(value);
      if (isArray(value)) {
          for (let i = 0; i < value.length; i++) {
              traverse(value[i], seen);
          }
      }
      else if (value instanceof Map) {
          value.forEach((v, key) => {
              // to register mutation dep for existing keys
              traverse(value.get(key), seen);
          });
      }
      else if (value instanceof Set) {
          value.forEach(v => {
              traverse(v, seen);
          });
      }
      else {
          for (const key in value) {
              traverse(value[key], seen);
          }
      }
      return value;
  }

  function provide(key, value) {
      if (!currentInstance) {
          {
              warn(`provide() can only be used inside setup().`);
          }
      }
      else {
          let provides = currentInstance.provides;
          // by default an instance inherits its parent's provides object
          // but when it needs to provide values of its own, it creates its
          // own provides object using parent provides object as prototype.
          // this way in `inject` we can simply look up injections from direct
          // parent and let the prototype chain do the work.
          const parentProvides = currentInstance.parent && currentInstance.parent.provides;
          if (parentProvides === provides) {
              provides = currentInstance.provides = Object.create(parentProvides);
          }
          // TS doesn't allow symbol as index type
          provides[key] = value;
      }
  }
  function inject(key, defaultValue) {
      // fallback to `currentRenderingInstance` so that this can be called in
      // a functional component
      const instance = currentInstance || currentRenderingInstance;
      if (instance) {
          const provides = instance.provides;
          if (key in provides) {
              // TS doesn't allow symbol as index type
              return provides[key];
          }
          else if (arguments.length > 1) {
              return defaultValue;
          }
          else {
              warn(`injection "${String(key)}" not found.`);
          }
      }
      else {
          warn(`inject() can only be used inside setup() or functional components.`);
      }
  }

  function createDuplicateChecker() {
      const cache = Object.create(null);
      return (type, key) => {
          if (cache[key]) {
              warn(`${type} property "${key}" is already defined in ${cache[key]}.`);
          }
          else {
              cache[key] = type;
          }
      };
  }
  function applyOptions(instance, options, deferredData = [], deferredWatch = [], asMixin = false) {
      const { 
      // composition
      mixins, extends: extendsOptions, 
      // state
      data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, 
      // assets
      components, directives, 
      // lifecycle
      beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeUnmount, unmounted, renderTracked, renderTriggered, errorCaptured } = options;
      const publicThis = instance.proxy;
      const ctx = instance.ctx;
      const globalMixins = instance.appContext.mixins;
      // call it only during dev
      // applyOptions is called non-as-mixin once per instance
      if (!asMixin) {
          callSyncHook('beforeCreate', options, publicThis, globalMixins);
          // global mixins are applied first
          applyMixins(instance, globalMixins, deferredData, deferredWatch);
      }
      // extending a base component...
      if (extendsOptions) {
          applyOptions(instance, extendsOptions, deferredData, deferredWatch, true);
      }
      // local mixins
      if (mixins) {
          applyMixins(instance, mixins, deferredData, deferredWatch);
      }
      const checkDuplicateProperties =  createDuplicateChecker() ;
      {
          const propsOptions = normalizePropsOptions(options)[0];
          if (propsOptions) {
              for (const key in propsOptions) {
                  checkDuplicateProperties("Props" /* PROPS */, key);
              }
          }
      }
      // options initialization order (to be consistent with Vue 2):
      // - props (already done outside of this function)
      // - inject
      // - methods
      // - data (deferred since it relies on `this` access)
      // - computed
      // - watch (deferred since it relies on `this` access)
      if (injectOptions) {
          if (isArray(injectOptions)) {
              for (let i = 0; i < injectOptions.length; i++) {
                  const key = injectOptions[i];
                  ctx[key] = inject(key);
                  {
                      checkDuplicateProperties("Inject" /* INJECT */, key);
                  }
              }
          }
          else {
              for (const key in injectOptions) {
                  const opt = injectOptions[key];
                  if (isObject(opt)) {
                      ctx[key] = inject(opt.from, opt.default);
                  }
                  else {
                      ctx[key] = inject(opt);
                  }
                  {
                      checkDuplicateProperties("Inject" /* INJECT */, key);
                  }
              }
          }
      }
      if (methods) {
          for (const key in methods) {
              const methodHandler = methods[key];
              if (isFunction(methodHandler)) {
                  ctx[key] = methodHandler.bind(publicThis);
                  {
                      checkDuplicateProperties("Methods" /* METHODS */, key);
                  }
              }
              else {
                  warn(`Method "${key}" has type "${typeof methodHandler}" in the component definition. ` +
                      `Did you reference the function correctly?`);
              }
          }
      }
      if (dataOptions) {
          if ( !isFunction(dataOptions)) {
              warn(`The data option must be a function. ` +
                  `Plain object usage is no longer supported.`);
          }
          if (asMixin) {
              deferredData.push(dataOptions);
          }
          else {
              resolveData(instance, dataOptions, publicThis);
          }
      }
      if (!asMixin) {
          if (deferredData.length) {
              deferredData.forEach(dataFn => resolveData(instance, dataFn, publicThis));
          }
          {
              const rawData = toRaw(instance.data);
              for (const key in rawData) {
                  checkDuplicateProperties("Data" /* DATA */, key);
                  // expose data on ctx during dev
                  if (key[0] !== '$' && key[0] !== '_') {
                      Object.defineProperty(ctx, key, {
                          configurable: true,
                          enumerable: true,
                          get: () => rawData[key],
                          set: NOOP
                      });
                  }
              }
          }
      }
      if (computedOptions) {
          for (const key in computedOptions) {
              const opt = computedOptions[key];
              const get = isFunction(opt)
                  ? opt.bind(publicThis, publicThis)
                  : isFunction(opt.get)
                      ? opt.get.bind(publicThis, publicThis)
                      : NOOP;
              if ( get === NOOP) {
                  warn(`Computed property "${key}" has no getter.`);
              }
              const set = !isFunction(opt) && isFunction(opt.set)
                  ? opt.set.bind(publicThis)
                  :  () => {
                          warn(`Write operation failed: computed property "${key}" is readonly.`);
                      }
                      ;
              const c = computed$1({
                  get,
                  set
              });
              Object.defineProperty(ctx, key, {
                  enumerable: true,
                  configurable: true,
                  get: () => c.value,
                  set: v => (c.value = v)
              });
              {
                  checkDuplicateProperties("Computed" /* COMPUTED */, key);
              }
          }
      }
      if (watchOptions) {
          deferredWatch.push(watchOptions);
      }
      if (!asMixin && deferredWatch.length) {
          deferredWatch.forEach(watchOptions => {
              for (const key in watchOptions) {
                  createWatcher(watchOptions[key], ctx, publicThis, key);
              }
          });
      }
      if (provideOptions) {
          const provides = isFunction(provideOptions)
              ? provideOptions.call(publicThis)
              : provideOptions;
          for (const key in provides) {
              provide(key, provides[key]);
          }
      }
      // asset options
      if (components) {
          extend(instance.components, components);
      }
      if (directives) {
          extend(instance.directives, directives);
      }
      // lifecycle options
      if (!asMixin) {
          callSyncHook('created', options, publicThis, globalMixins);
      }
      if (beforeMount) {
          onBeforeMount(beforeMount.bind(publicThis));
      }
      if (mounted) {
          onMounted(mounted.bind(publicThis));
      }
      if (beforeUpdate) {
          onBeforeUpdate(beforeUpdate.bind(publicThis));
      }
      if (updated) {
          onUpdated(updated.bind(publicThis));
      }
      if (activated) {
          onActivated(activated.bind(publicThis));
      }
      if (deactivated) {
          onDeactivated(deactivated.bind(publicThis));
      }
      if (errorCaptured) {
          onErrorCaptured(errorCaptured.bind(publicThis));
      }
      if (renderTracked) {
          onRenderTracked(renderTracked.bind(publicThis));
      }
      if (renderTriggered) {
          onRenderTriggered(renderTriggered.bind(publicThis));
      }
      if (beforeUnmount) {
          onBeforeUnmount(beforeUnmount.bind(publicThis));
      }
      if (unmounted) {
          onUnmounted(unmounted.bind(publicThis));
      }
  }
  function callSyncHook(name, options, ctx, globalMixins) {
      callHookFromMixins(name, globalMixins, ctx);
      const baseHook = options.extends && options.extends[name];
      if (baseHook) {
          baseHook.call(ctx);
      }
      const mixins = options.mixins;
      if (mixins) {
          callHookFromMixins(name, mixins, ctx);
      }
      const selfHook = options[name];
      if (selfHook) {
          selfHook.call(ctx);
      }
  }
  function callHookFromMixins(name, mixins, ctx) {
      for (let i = 0; i < mixins.length; i++) {
          const fn = mixins[i][name];
          if (fn) {
              fn.call(ctx);
          }
      }
  }
  function applyMixins(instance, mixins, deferredData, deferredWatch) {
      for (let i = 0; i < mixins.length; i++) {
          applyOptions(instance, mixins[i], deferredData, deferredWatch, true);
      }
  }
  function resolveData(instance, dataFn, publicThis) {
      const data = dataFn.call(publicThis, publicThis);
      if ( isPromise(data)) {
          warn(`data() returned a Promise - note data() cannot be async; If you ` +
              `intend to perform data fetching before component renders, use ` +
              `async setup() + <Suspense>.`);
      }
      if (!isObject(data)) {
           warn(`data() should return an object.`);
      }
      else if (instance.data === EMPTY_OBJ) {
          instance.data = reactive(data);
      }
      else {
          // existing data: this is a mixin or extends.
          extend(instance.data, data);
      }
  }
  function createWatcher(raw, ctx, publicThis, key) {
      const getter = () => publicThis[key];
      if (isString(raw)) {
          const handler = ctx[raw];
          if (isFunction(handler)) {
              watch(getter, handler);
          }
          else {
              warn(`Invalid watch handler specified by key "${raw}"`, handler);
          }
      }
      else if (isFunction(raw)) {
          watch(getter, raw.bind(publicThis));
      }
      else if (isObject(raw)) {
          if (isArray(raw)) {
              raw.forEach(r => createWatcher(r, ctx, publicThis, key));
          }
          else {
              watch(getter, raw.handler.bind(publicThis), raw);
          }
      }
      else {
          warn(`Invalid watch option: "${key}"`);
      }
  }
  function resolveMergedOptions(instance) {
      const raw = instance.type;
      const { __merged, mixins, extends: extendsOptions } = raw;
      if (__merged)
          return __merged;
      const globalMixins = instance.appContext.mixins;
      if (!globalMixins.length && !mixins && !extendsOptions)
          return raw;
      const options = {};
      globalMixins.forEach(m => mergeOptions(options, m, instance));
      extendsOptions && mergeOptions(options, extendsOptions, instance);
      mixins && mixins.forEach(m => mergeOptions(options, m, instance));
      mergeOptions(options, raw, instance);
      return (raw.__merged = options);
  }
  function mergeOptions(to, from, instance) {
      const strats = instance.appContext.config.optionMergeStrategies;
      for (const key in from) {
          if (strats && hasOwn(strats, key)) {
              to[key] = strats[key](to[key], from[key], instance.proxy, key);
          }
          else if (!hasOwn(to, key)) {
              to[key] = from[key];
          }
      }
  }

  const publicPropertiesMap = extend(Object.create(null), {
      $: i => i,
      $el: i => i.vnode.el,
      $data: i => i.data,
      $props: i => ( shallowReadonly(i.props) ),
      $attrs: i => ( shallowReadonly(i.attrs) ),
      $slots: i => ( shallowReadonly(i.slots) ),
      $refs: i => ( shallowReadonly(i.refs) ),
      $parent: i => i.parent && i.parent.proxy,
      $root: i => i.root && i.root.proxy,
      $emit: i => i.emit,
      $options: i => ( resolveMergedOptions(i) ),
      $forceUpdate: i => () => queueJob(i.update),
      $nextTick: () => nextTick,
      $watch:  i => instanceWatch.bind(i) 
  });
  const PublicInstanceProxyHandlers = {
      get({ _: instance }, key) {
          const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
          // let @vue/reatvitiy know it should never observe Vue public instances.
          if (key === "__v_skip" /* SKIP */) {
              return true;
          }
          // data / props / ctx
          // This getter gets called for every property access on the render context
          // during render and is a major hotspot. The most expensive part of this
          // is the multiple hasOwn() calls. It's much faster to do a simple property
          // access on a plain object, so we use an accessCache object (with null
          // prototype) to memoize what access type a key corresponds to.
          let normalizedProps;
          if (key[0] !== '$') {
              const n = accessCache[key];
              if (n !== undefined) {
                  switch (n) {
                      case 0 /* SETUP */:
                          return setupState[key];
                      case 1 /* DATA */:
                          return data[key];
                      case 3 /* CONTEXT */:
                          return ctx[key];
                      case 2 /* PROPS */:
                          return props[key];
                      // default: just fallthrough
                  }
              }
              else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
                  accessCache[key] = 0 /* SETUP */;
                  return setupState[key];
              }
              else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
                  accessCache[key] = 1 /* DATA */;
                  return data[key];
              }
              else if (
              // only cache other properties when instance has declared (thus stable)
              // props
              (normalizedProps = normalizePropsOptions(type)[0]) &&
                  hasOwn(normalizedProps, key)) {
                  accessCache[key] = 2 /* PROPS */;
                  return props[key];
              }
              else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
                  accessCache[key] = 3 /* CONTEXT */;
                  return ctx[key];
              }
              else {
                  accessCache[key] = 4 /* OTHER */;
              }
          }
          const publicGetter = publicPropertiesMap[key];
          let cssModule, globalProperties;
          // public $xxx properties
          if (publicGetter) {
              if (key === '$attrs') {
                  track(instance, "get" /* GET */, key);
                   markAttrsAccessed();
              }
              return publicGetter(instance);
          }
          else if (
          // css module (injected by vue-loader)
          (cssModule = type.__cssModules) &&
              (cssModule = cssModule[key])) {
              return cssModule;
          }
          else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
              // user may set custom properties to `this` that start with `$`
              accessCache[key] = 3 /* CONTEXT */;
              return ctx[key];
          }
          else if (
          // global properties
          ((globalProperties = appContext.config.globalProperties),
              hasOwn(globalProperties, key))) {
              return globalProperties[key];
          }
          else if (
              currentRenderingInstance &&
              // #1091 avoid internal isRef/isVNode checks on component instance leading
              // to infinite warning loop
              key.indexOf('__v') !== 0) {
              if (data !== EMPTY_OBJ && key[0] === '$' && hasOwn(data, key)) {
                  warn(`Property ${JSON.stringify(key)} must be accessed via $data because it starts with a reserved ` +
                      `character and is not proxied on the render context.`);
              }
              else {
                  warn(`Property ${JSON.stringify(key)} was accessed during render ` +
                      `but is not defined on instance.`);
              }
          }
      },
      set({ _: instance }, key, value) {
          const { data, setupState, ctx } = instance;
          if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
              setupState[key] = value;
          }
          else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
              data[key] = value;
          }
          else if (key in instance.props) {
              
                  warn(`Attempting to mutate prop "${key}". Props are readonly.`, instance);
              return false;
          }
          if (key[0] === '$' && key.slice(1) in instance) {
              
                  warn(`Attempting to mutate public property "${key}". ` +
                      `Properties starting with $ are reserved and readonly.`, instance);
              return false;
          }
          else {
              if ( key in instance.appContext.config.globalProperties) {
                  Object.defineProperty(ctx, key, {
                      enumerable: true,
                      configurable: true,
                      value
                  });
              }
              else {
                  ctx[key] = value;
              }
          }
          return true;
      },
      has({ _: { data, setupState, accessCache, ctx, type, appContext } }, key) {
          let normalizedProps;
          return (accessCache[key] !== undefined ||
              (data !== EMPTY_OBJ && hasOwn(data, key)) ||
              (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) ||
              ((normalizedProps = normalizePropsOptions(type)[0]) &&
                  hasOwn(normalizedProps, key)) ||
              hasOwn(ctx, key) ||
              hasOwn(publicPropertiesMap, key) ||
              hasOwn(appContext.config.globalProperties, key));
      }
  };
  {
      PublicInstanceProxyHandlers.ownKeys = (target) => {
          warn(`Avoid app logic that relies on enumerating keys on a component instance. ` +
              `The keys will be empty in production mode to avoid performance overhead.`);
          return Reflect.ownKeys(target);
      };
  }
  const RuntimeCompiledPublicInstanceProxyHandlers = extend({}, PublicInstanceProxyHandlers, {
      get(target, key) {
          // fast path for unscopables when using `with` block
          if (key === Symbol.unscopables) {
              return;
          }
          return PublicInstanceProxyHandlers.get(target, key, target);
      },
      has(_, key) {
          const has = key[0] !== '_' && !isGloballyWhitelisted(key);
          if ( !has && PublicInstanceProxyHandlers.has(_, key)) {
              warn(`Property ${JSON.stringify(key)} should not start with _ which is a reserved prefix for Vue internals.`);
          }
          return has;
      }
  });
  // In dev mode, the proxy target exposes the same properties as seen on `this`
  // for easier console inspection. In prod mode it will be an empty object so
  // these properties definitions can be skipped.
  function createRenderContext(instance) {
      const target = {};
      // expose internal instance for proxy handlers
      Object.defineProperty(target, `_`, {
          configurable: true,
          enumerable: false,
          get: () => instance
      });
      // expose public properties
      Object.keys(publicPropertiesMap).forEach(key => {
          Object.defineProperty(target, key, {
              configurable: true,
              enumerable: false,
              get: () => publicPropertiesMap[key](instance),
              // intercepted by the proxy so no need for implementation,
              // but needed to prevent set errors
              set: NOOP
          });
      });
      // expose global properties
      const { globalProperties } = instance.appContext.config;
      Object.keys(globalProperties).forEach(key => {
          Object.defineProperty(target, key, {
              configurable: true,
              enumerable: false,
              get: () => globalProperties[key],
              set: NOOP
          });
      });
      return target;
  }
  // dev only
  function exposePropsOnRenderContext(instance) {
      const { ctx, type } = instance;
      const propsOptions = normalizePropsOptions(type)[0];
      if (propsOptions) {
          Object.keys(propsOptions).forEach(key => {
              Object.defineProperty(ctx, key, {
                  enumerable: true,
                  configurable: true,
                  get: () => instance.props[key],
                  set: NOOP
              });
          });
      }
  }
  // dev only
  function exposeSetupStateOnRenderContext(instance) {
      const { ctx, setupState } = instance;
      Object.keys(toRaw(setupState)).forEach(key => {
          Object.defineProperty(ctx, key, {
              enumerable: true,
              configurable: true,
              get: () => setupState[key],
              set: NOOP
          });
      });
  }

  const emptyAppContext = createAppContext();
  let uid$1 = 0;
  function createComponentInstance(vnode, parent, suspense) {
      // inherit parent app context - or - if root, adopt from root vnode
      const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
      const instance = {
          uid: uid$1++,
          vnode,
          parent,
          appContext,
          type: vnode.type,
          root: null,
          next: null,
          subTree: null,
          update: null,
          render: null,
          proxy: null,
          withProxy: null,
          effects: null,
          provides: parent ? parent.provides : Object.create(appContext.provides),
          accessCache: null,
          renderCache: [],
          // state
          ctx: EMPTY_OBJ,
          data: EMPTY_OBJ,
          props: EMPTY_OBJ,
          attrs: EMPTY_OBJ,
          slots: EMPTY_OBJ,
          refs: EMPTY_OBJ,
          setupState: EMPTY_OBJ,
          setupContext: null,
          // per-instance asset storage (mutable during options resolution)
          components: Object.create(appContext.components),
          directives: Object.create(appContext.directives),
          // suspense related
          suspense,
          asyncDep: null,
          asyncResolved: false,
          // lifecycle hooks
          // not using enums here because it results in computed properties
          isMounted: false,
          isUnmounted: false,
          isDeactivated: false,
          bc: null,
          c: null,
          bm: null,
          m: null,
          bu: null,
          u: null,
          um: null,
          bum: null,
          da: null,
          a: null,
          rtg: null,
          rtc: null,
          ec: null,
          emit: null // to be set immediately
      };
      {
          instance.ctx = createRenderContext(instance);
      }
      instance.root = parent ? parent.root : instance;
      instance.emit = emit.bind(null, instance);
      return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  const setCurrentInstance = (instance) => {
      currentInstance = instance;
  };
  const isBuiltInTag = /*#__PURE__*/ makeMap('slot,component');
  function validateComponentName(name, config) {
      const appIsNativeTag = config.isNativeTag || NO;
      if (isBuiltInTag(name) || appIsNativeTag(name)) {
          warn('Do not use built-in or reserved HTML elements as component id: ' + name);
      }
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false) {
      isInSSRComponentSetup = isSSR;
      const { props, children, shapeFlag } = instance.vnode;
      const isStateful = shapeFlag & 4 /* STATEFUL_COMPONENT */;
      initProps(instance, props, isStateful, isSSR);
      initSlots(instance, children);
      const setupResult = isStateful
          ? setupStatefulComponent(instance, isSSR)
          : undefined;
      isInSSRComponentSetup = false;
      return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
      const Component = instance.type;
      {
          if (Component.name) {
              validateComponentName(Component.name, instance.appContext.config);
          }
          if (Component.components) {
              const names = Object.keys(Component.components);
              for (let i = 0; i < names.length; i++) {
                  validateComponentName(names[i], instance.appContext.config);
              }
          }
          if (Component.directives) {
              const names = Object.keys(Component.directives);
              for (let i = 0; i < names.length; i++) {
                  validateDirectiveName(names[i]);
              }
          }
      }
      // 0. create render proxy property access cache
      instance.accessCache = {};
      // 1. create public instance / render proxy
      // also mark it raw so it's never observed
      instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
      {
          exposePropsOnRenderContext(instance);
      }
      // 2. call setup()
      const { setup } = Component;
      if (setup) {
          const setupContext = (instance.setupContext =
              setup.length > 1 ? createSetupContext(instance) : null);
          currentInstance = instance;
          pauseTracking();
          const setupResult = callWithErrorHandling(setup, instance, 0 /* SETUP_FUNCTION */, [ shallowReadonly(instance.props) , setupContext]);
          resetTracking();
          currentInstance = null;
          if (isPromise(setupResult)) {
              if (isSSR) {
                  // return the promise so server-renderer can wait on it
                  return setupResult.then((resolvedResult) => {
                      handleSetupResult(instance, resolvedResult);
                  });
              }
              else {
                  // async setup returned Promise.
                  // bail here and wait for re-entry.
                  instance.asyncDep = setupResult;
              }
          }
          else {
              handleSetupResult(instance, setupResult);
          }
      }
      else {
          finishComponentSetup(instance);
      }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
      if (isFunction(setupResult)) {
          // setup returned an inline render function
          instance.render = setupResult;
      }
      else if (isObject(setupResult)) {
          if ( isVNode(setupResult)) {
              warn(`setup() should not return VNodes directly - ` +
                  `return a render function instead.`);
          }
          // setup returned bindings.
          // assuming a render function compiled from template is present.
          instance.setupState = reactive(setupResult);
          {
              exposeSetupStateOnRenderContext(instance);
          }
      }
      else if ( setupResult !== undefined) {
          warn(`setup() should return an object. Received: ${setupResult === null ? 'null' : typeof setupResult}`);
      }
      finishComponentSetup(instance);
  }
  let compile;
  /**
   * For runtime-dom to register the compiler.
   * Note the exported method uses any to avoid d.ts relying on the compiler types.
   */
  function registerRuntimeCompiler(_compile) {
      compile = _compile;
  }
  function finishComponentSetup(instance, isSSR) {
      const Component = instance.type;
      // template / render function normalization
      if (!instance.render) {
          if (compile && Component.template && !Component.render) {
              {
                  startMeasure(instance, `compile`);
              }
              Component.render = compile(Component.template, {
                  isCustomElement: instance.appContext.config.isCustomElement || NO
              });
              {
                  endMeasure(instance, `compile`);
              }
              Component.render._rc = true;
          }
          if ( !Component.render) {
              /* istanbul ignore if */
              if (!compile && Component.template) {
                  warn(`Component provided template option but ` +
                      `runtime compilation is not supported in this build of Vue.` +
                      (   ` Use "vue.global.js" instead.`
                                  ) /* should not happen */);
              }
              else {
                  warn(`Component is missing template or render function.`);
              }
          }
          instance.render = (Component.render || NOOP);
          // for runtime-compiled render functions using `with` blocks, the render
          // proxy used needs a different `has` handler which is more performant and
          // also only allows a whitelist of globals to fallthrough.
          if (instance.render._rc) {
              instance.withProxy = new Proxy(instance.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
          }
      }
      // support for 2.x options
      {
          currentInstance = instance;
          applyOptions(instance, Component);
          currentInstance = null;
      }
  }
  const attrHandlers = {
      get: (target, key) => {
          {
              markAttrsAccessed();
          }
          return target[key];
      },
      set: () => {
          warn(`setupContext.attrs is readonly.`);
          return false;
      },
      deleteProperty: () => {
          warn(`setupContext.attrs is readonly.`);
          return false;
      }
  };
  function createSetupContext(instance) {
      {
          // We use getters in dev in case libs like test-utils overwrite instance
          // properties (overwrites should not be done in prod)
          return Object.freeze({
              get attrs() {
                  return new Proxy(instance.attrs, attrHandlers);
              },
              get slots() {
                  return shallowReadonly(instance.slots);
              },
              get emit() {
                  return (event, ...args) => instance.emit(event, ...args);
              }
          });
      }
  }
  // record effects created during a component's setup() so that they can be
  // stopped when the component unmounts
  function recordInstanceBoundEffect(effect) {
      if (currentInstance) {
          (currentInstance.effects || (currentInstance.effects = [])).push(effect);
      }
  }
  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = (str) => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');
  function formatComponentName(instance, Component, isRoot = false) {
      let name = isFunction(Component)
          ? Component.displayName || Component.name
          : Component.name;
      if (!name && Component.__file) {
          const match = Component.__file.match(/([^/\\]+)\.vue$/);
          if (match) {
              name = match[1];
          }
      }
      if (!name && instance && instance.parent) {
          // try to infer the name based on local resolution
          const registry = instance.parent.components;
          for (const key in registry) {
              if (registry[key] === Component) {
                  name = key;
                  break;
              }
          }
      }
      return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }

  function computed$1(getterOrOptions) {
      const c = computed(getterOrOptions);
      recordInstanceBoundEffect(c.effect);
      return c;
  }

  // implementation, close to no-op
  function defineComponent(options) {
      return isFunction(options) ? { setup: options } : options;
  }

  function defineAsyncComponent(source) {
      if (isFunction(source)) {
          source = { loader: source };
      }
      const { loader, loadingComponent: loadingComponent, errorComponent: errorComponent, delay = 200, timeout, // undefined = never times out
      suspensible = true, onError: userOnError } = source;
      let pendingRequest = null;
      let resolvedComp;
      let retries = 0;
      const retry = () => {
          retries++;
          pendingRequest = null;
          return load();
      };
      const load = () => {
          let thisRequest;
          return (pendingRequest ||
              (thisRequest = pendingRequest = loader()
                  .catch(err => {
                  err = err instanceof Error ? err : new Error(String(err));
                  if (userOnError) {
                      return new Promise((resolve, reject) => {
                          const userRetry = () => resolve(retry());
                          const userFail = () => reject(err);
                          userOnError(err, userRetry, userFail, retries + 1);
                      });
                  }
                  else {
                      throw err;
                  }
              })
                  .then((comp) => {
                  if (thisRequest !== pendingRequest && pendingRequest) {
                      return pendingRequest;
                  }
                  if ( !comp) {
                      warn(`Async component loader resolved to undefined. ` +
                          `If you are using retry(), make sure to return its return value.`);
                  }
                  // interop module default
                  if (comp &&
                      (comp.__esModule || comp[Symbol.toStringTag] === 'Module')) {
                      comp = comp.default;
                  }
                  if ( comp && !isObject(comp) && !isFunction(comp)) {
                      throw new Error(`Invalid async component load result: ${comp}`);
                  }
                  resolvedComp = comp;
                  return comp;
              })));
      };
      return defineComponent({
          __asyncLoader: load,
          name: 'AsyncComponentWrapper',
          setup() {
              const instance = currentInstance;
              // already resolved
              if (resolvedComp) {
                  return () => createInnerComp(resolvedComp, instance);
              }
              const onError = (err) => {
                  pendingRequest = null;
                  handleError(err, instance, 13 /* ASYNC_COMPONENT_LOADER */);
              };
              // suspense-controlled or SSR.
              if (( suspensible && instance.suspense) ||
                  (false )) {
                  return load()
                      .then(comp => {
                      return () => createInnerComp(comp, instance);
                  })
                      .catch(err => {
                      onError(err);
                      return () => errorComponent
                          ? createVNode(errorComponent, { error: err })
                          : null;
                  });
              }
              const loaded = ref(false);
              const error = ref();
              const delayed = ref(!!delay);
              if (delay) {
                  setTimeout(() => {
                      delayed.value = false;
                  }, delay);
              }
              if (timeout != null) {
                  setTimeout(() => {
                      if (!loaded.value) {
                          const err = new Error(`Async component timed out after ${timeout}ms.`);
                          onError(err);
                          error.value = err;
                      }
                  }, timeout);
              }
              load()
                  .then(() => {
                  loaded.value = true;
              })
                  .catch(err => {
                  onError(err);
                  error.value = err;
              });
              return () => {
                  if (loaded.value && resolvedComp) {
                      return createInnerComp(resolvedComp, instance);
                  }
                  else if (error.value && errorComponent) {
                      return createVNode(errorComponent, {
                          error: error.value
                      });
                  }
                  else if (loadingComponent && !delayed.value) {
                      return createVNode(loadingComponent);
                  }
              };
          }
      });
  }
  function createInnerComp(comp, { vnode: { props, children } }) {
      return createVNode(comp, props, children);
  }

  // Actual implementation
  function h(type, propsOrChildren, children) {
      if (arguments.length === 2) {
          if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
              // single vnode without props
              if (isVNode(propsOrChildren)) {
                  return createVNode(type, null, [propsOrChildren]);
              }
              // props without children
              return createVNode(type, propsOrChildren);
          }
          else {
              // omit props
              return createVNode(type, null, propsOrChildren);
          }
      }
      else {
          if (isVNode(children)) {
              children = [children];
          }
          return createVNode(type, propsOrChildren, children);
      }
  }

  const useCSSModule = (name = '$style') => {
      {
          {
              warn(`useCSSModule() is not supported in the global build.`);
          }
          return EMPTY_OBJ;
      }
  };

  const ssrContextKey = Symbol( `ssrContext` );
  const useSSRContext = () => {
      {
          warn(`useSsrContext() is not supported in the global build.`);
      }
  };

  /**
   * Actual implementation
   */
  function renderList(source, renderItem) {
      let ret;
      if (isArray(source) || isString(source)) {
          ret = new Array(source.length);
          for (let i = 0, l = source.length; i < l; i++) {
              ret[i] = renderItem(source[i], i);
          }
      }
      else if (typeof source === 'number') {
          ret = new Array(source);
          for (let i = 0; i < source; i++) {
              ret[i] = renderItem(i + 1, i);
          }
      }
      else if (isObject(source)) {
          if (source[Symbol.iterator]) {
              ret = Array.from(source, renderItem);
          }
          else {
              const keys = Object.keys(source);
              ret = new Array(keys.length);
              for (let i = 0, l = keys.length; i < l; i++) {
                  const key = keys[i];
                  ret[i] = renderItem(source[key], key, i);
              }
          }
      }
      else {
          ret = [];
      }
      return ret;
  }

  /**
   * For prefixing keys in v-on="obj" with "on"
   * @private
   */
  function toHandlers(obj) {
      const ret = {};
      if ( !isObject(obj)) {
          warn(`v-on with no argument expects an object value.`);
          return ret;
      }
      for (const key in obj) {
          ret[`on${capitalize(key)}`] = obj[key];
      }
      return ret;
  }

  /**
   * Compiler runtime helper for rendering <slot/>
   * @private
   */
  function renderSlot(slots, name, props = {}, 
  // this is not a user-facing function, so the fallback is always generated by
  // the compiler and guaranteed to be a function returning an array
  fallback) {
      let slot = slots[name];
      if ( slot && slot.length > 1) {
          warn(`SSR-optimized slot function detected in a non-SSR-optimized render ` +
              `function. You need to mark this component with $dynamic-slots in the ` +
              `parent template.`);
          slot = () => [];
      }
      return (openBlock(),
          createBlock(Fragment, { key: props.key }, slot ? slot(props) : fallback ? fallback() : [], slots._ ? 64 /* STABLE_FRAGMENT */ : -2 /* BAIL */));
  }

  /**
   * Compiler runtime helper for creating dynamic slots object
   * @private
   */
  function createSlots(slots, dynamicSlots) {
      for (let i = 0; i < dynamicSlots.length; i++) {
          const slot = dynamicSlots[i];
          // array of dynamic slot generated by <template v-for="..." #[...]>
          if (isArray(slot)) {
              for (let j = 0; j < slot.length; j++) {
                  slots[slot[j].name] = slot[j].fn;
              }
          }
          else if (slot) {
              // conditional single slot generated by <template v-if="..." #foo>
              slots[slot.name] = slot.fn;
          }
      }
      return slots;
  }

  // Core API ------------------------------------------------------------------
  const version = "3.0.0-beta.19";
  /**
   * @private
   */
  const _toDisplayString = toDisplayString;
  /**
   * @private
   */
  const _camelize = camelize;
  /**
   * SSR utils for \@vue/server-renderer. Only exposed in cjs builds.
   * @internal
   */
  const ssrUtils = ( null);

  const svgNS = 'http://www.w3.org/2000/svg';
  const doc = (typeof document !== 'undefined' ? document : null);
  let tempContainer;
  let tempSVGContainer;
  const nodeOps = {
      insert: (child, parent, anchor) => {
          parent.insertBefore(child, anchor || null);
      },
      remove: child => {
          const parent = child.parentNode;
          if (parent) {
              parent.removeChild(child);
          }
      },
      createElement: (tag, isSVG, is) => isSVG
          ? doc.createElementNS(svgNS, tag)
          : doc.createElement(tag, is ? { is } : undefined),
      createText: text => doc.createTextNode(text),
      createComment: text => doc.createComment(text),
      setText: (node, text) => {
          node.nodeValue = text;
      },
      setElementText: (el, text) => {
          el.textContent = text;
      },
      parentNode: node => node.parentNode,
      nextSibling: node => node.nextSibling,
      querySelector: selector => doc.querySelector(selector),
      setScopeId(el, id) {
          el.setAttribute(id, '');
      },
      cloneNode(el) {
          return el.cloneNode(true);
      },
      // __UNSAFE__
      // Reason: innerHTML.
      // Static content here can only come from compiled templates.
      // As long as the user only uses trusted templates, this is safe.
      insertStaticContent(content, parent, anchor, isSVG) {
          const temp = isSVG
              ? tempSVGContainer ||
                  (tempSVGContainer = doc.createElementNS(svgNS, 'svg'))
              : tempContainer || (tempContainer = doc.createElement('div'));
          temp.innerHTML = content;
          const first = temp.firstChild;
          let node = first;
          let last = node;
          while (node) {
              last = node;
              nodeOps.insert(node, parent, anchor);
              node = temp.firstChild;
          }
          return [first, last];
      }
  };

  // compiler should normalize class + :class bindings on the same element
  // into a single binding ['staticClass', dynamic]
  function patchClass(el, value, isSVG) {
      if (value == null) {
          value = '';
      }
      if (isSVG) {
          el.setAttribute('class', value);
      }
      else {
          // directly setting className should be faster than setAttribute in theory
          // if this is an element during a transition, take the temporary transition
          // classes into account.
          const transitionClasses = el._vtc;
          if (transitionClasses) {
              value = (value
                  ? [value, ...transitionClasses]
                  : [...transitionClasses]).join(' ');
          }
          el.className = value;
      }
  }

  function patchStyle(el, prev, next) {
      const style = el.style;
      if (!next) {
          el.removeAttribute('style');
      }
      else if (isString(next)) {
          if (prev !== next) {
              style.cssText = next;
          }
      }
      else {
          for (const key in next) {
              setStyle(style, key, next[key]);
          }
          if (prev && !isString(prev)) {
              for (const key in prev) {
                  if (next[key] == null) {
                      setStyle(style, key, '');
                  }
              }
          }
      }
  }
  const importantRE = /\s*!important$/;
  function setStyle(style, name, val) {
      if (name.startsWith('--')) {
          // custom property definition
          style.setProperty(name, val);
      }
      else {
          const prefixed = autoPrefix(style, name);
          if (importantRE.test(val)) {
              // !important
              style.setProperty(hyphenate(prefixed), val.replace(importantRE, ''), 'important');
          }
          else {
              style[prefixed] = val;
          }
      }
  }
  const prefixes = ['Webkit', 'Moz', 'ms'];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
      const cached = prefixCache[rawName];
      if (cached) {
          return cached;
      }
      let name = _camelize(rawName);
      if (name !== 'filter' && name in style) {
          return (prefixCache[rawName] = name);
      }
      name = capitalize(name);
      for (let i = 0; i < prefixes.length; i++) {
          const prefixed = prefixes[i] + name;
          if (prefixed in style) {
              return (prefixCache[rawName] = prefixed);
          }
      }
      return rawName;
  }

  const xlinkNS = 'http://www.w3.org/1999/xlink';
  function patchAttr(el, key, value, isSVG) {
      if (isSVG && key.startsWith('xlink:')) {
          if (value == null) {
              el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
          }
          else {
              el.setAttributeNS(xlinkNS, key, value);
          }
      }
      else {
          // note we are only checking boolean attributes that don't have a
          // corresponding dom prop of the same name here.
          const isBoolean = isSpecialBooleanAttr(key);
          if (value == null || (isBoolean && value === false)) {
              el.removeAttribute(key);
          }
          else {
              el.setAttribute(key, isBoolean ? '' : value);
          }
      }
  }

  // __UNSAFE__
  // functions. The user is reponsible for using them with only trusted content.
  function patchDOMProp(el, key, value, 
  // the following args are passed only due to potential innerHTML/textContent
  // overriding existing VNodes, in which case the old tree must be properly
  // unmounted.
  prevChildren, parentComponent, parentSuspense, unmountChildren) {
      if (key === 'innerHTML' || key === 'textContent') {
          if (prevChildren) {
              unmountChildren(prevChildren, parentComponent, parentSuspense);
          }
          el[key] = value == null ? '' : value;
          return;
      }
      if (key === 'value' && el.tagName !== 'PROGRESS') {
          // store value as _value as well since
          // non-string values will be stringified.
          el._value = value;
          el.value = value == null ? '' : value;
          return;
      }
      if (value === '' && typeof el[key] === 'boolean') {
          // e.g. <select multiple> compiles to { multiple: '' }
          el[key] = true;
      }
      else if (value == null && typeof el[key] === 'string') {
          // e.g. <div :id="null">
          el[key] = '';
      }
      else {
          // some properties perform value validation and throw
          try {
              el[key] = value;
          }
          catch (e) {
              {
                  warn(`Failed setting prop "${key}" on <${el.tagName.toLowerCase()}>: ` +
                      `value ${value} is invalid.`, e);
              }
          }
      }
  }

  // Async edge case fix requires storing an event listener's attach timestamp.
  let _getNow = Date.now;
  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  if (typeof document !== 'undefined' &&
      _getNow() > document.createEvent('Event').timeStamp) {
      // if the low-res timestamp which is bigger than the event timestamp
      // (which is evaluated AFTER) it means the event is using a hi-res timestamp,
      // and we need to use the hi-res version for event listeners as well.
      _getNow = () => performance.now();
  }
  // To avoid the overhead of repeatedly calling performance.now(), we cache
  // and use the same timestamp for all event listeners attached in the same tick.
  let cachedNow = 0;
  const p$1 = Promise.resolve();
  const reset = () => {
      cachedNow = 0;
  };
  const getNow = () => cachedNow || (p$1.then(reset), (cachedNow = _getNow()));
  function addEventListener(el, event, handler, options) {
      el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
      el.removeEventListener(event, handler, options);
  }
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
      const name = rawName.slice(2).toLowerCase();
      const prevOptions = prevValue && 'options' in prevValue && prevValue.options;
      const nextOptions = nextValue && 'options' in nextValue && nextValue.options;
      const invoker = prevValue && prevValue.invoker;
      const value = nextValue && 'handler' in nextValue ? nextValue.handler : nextValue;
      if (prevOptions || nextOptions) {
          const prev = prevOptions || EMPTY_OBJ;
          const next = nextOptions || EMPTY_OBJ;
          if (prev.capture !== next.capture ||
              prev.passive !== next.passive ||
              prev.once !== next.once) {
              if (invoker) {
                  removeEventListener(el, name, invoker, prev);
              }
              if (nextValue && value) {
                  const invoker = createInvoker(value, instance);
                  nextValue.invoker = invoker;
                  addEventListener(el, name, invoker, next);
              }
              return;
          }
      }
      if (nextValue && value) {
          if (invoker) {
              prevValue.invoker = null;
              invoker.value = value;
              nextValue.invoker = invoker;
              invoker.lastUpdated = getNow();
          }
          else {
              addEventListener(el, name, createInvoker(value, instance), nextOptions || void 0);
          }
      }
      else if (invoker) {
          removeEventListener(el, name, invoker, prevOptions || void 0);
      }
  }
  function createInvoker(initialValue, instance) {
      const invoker = (e) => {
          // async edge case #6566: inner click event triggers patch, event handler
          // attached to outer element during patch, and triggered again. This
          // happens because browsers fire microtask ticks between event propagation.
          // the solution is simple: we save the timestamp when a handler is attached,
          // and the handler would only fire if the event passed to it was fired
          // AFTER it was attached.
          const timeStamp = e.timeStamp || _getNow();
          if (timeStamp >= invoker.lastUpdated - 1) {
              callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5 /* NATIVE_EVENT_HANDLER */, [e]);
          }
      };
      invoker.value = initialValue;
      initialValue.invoker = invoker;
      invoker.lastUpdated = getNow();
      return invoker;
  }
  function patchStopImmediatePropagation(e, value) {
      if (isArray(value)) {
          const originalStop = e.stopImmediatePropagation;
          e.stopImmediatePropagation = () => {
              originalStop.call(e);
              e._stopped = true;
          };
          return value.map(fn => (e) => !e._stopped && fn(e));
      }
      else {
          return value;
      }
  }

  const nativeOnRE = /^on[a-z]/;
  const forcePatchProp = (_, key) => key === 'value';
  const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
      switch (key) {
          // special
          case 'class':
              patchClass(el, nextValue, isSVG);
              break;
          case 'style':
              patchStyle(el, prevValue, nextValue);
              break;
          default:
              if (isOn(key)) {
                  // ignore v-model listeners
                  if (!key.startsWith('onUpdate:')) {
                      patchEvent(el, key, prevValue, nextValue, parentComponent);
                  }
              }
              else if (shouldSetAsProp(el, key, nextValue, isSVG)) {
                  patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
              }
              else {
                  // special case for <input v-model type="checkbox"> with
                  // :true-value & :false-value
                  // store value as dom properties since non-string values will be
                  // stringified.
                  if (key === 'true-value') {
                      el._trueValue = nextValue;
                  }
                  else if (key === 'false-value') {
                      el._falseValue = nextValue;
                  }
                  patchAttr(el, key, nextValue, isSVG);
              }
              break;
      }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
      if (isSVG) {
          // most keys must be set as attribute on svg elements to work
          // ...except innerHTML
          if (key === 'innerHTML') {
              return true;
          }
          // or native onclick with function values
          if (key in el && nativeOnRE.test(key) && isFunction(value)) {
              return true;
          }
          return false;
      }
      // spellcheck and draggable are numerated attrs, however their
      // corresponding DOM properties are actually booleans - this leads to
      // setting it with a string "false" value leading it to be coerced to
      // `true`, so we need to always treat them as attributes.
      // Note that `contentEditable` doesn't have this problem: its DOM
      // property is also enumerated string values.
      if (key === 'spellcheck' || key === 'draggable') {
          return false;
      }
      // #1526 <input list> must be set as attribute
      if (key === 'list' && el.tagName === 'INPUT') {
          return false;
      }
      // native onclick with string value, must be set as attribute
      if (nativeOnRE.test(key) && isString(value)) {
          return false;
      }
      return key in el;
  }

  const TRANSITION = 'transition';
  const ANIMATION = 'animation';
  // DOM Transition is a higher-order-component based on the platform-agnostic
  // base Transition component, with DOM-specific logic.
  const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
  Transition.displayName = 'Transition';
  const DOMTransitionPropsValidators = {
      name: String,
      type: String,
      css: {
          type: Boolean,
          default: true
      },
      duration: [String, Number, Object],
      enterFromClass: String,
      enterActiveClass: String,
      enterToClass: String,
      appearFromClass: String,
      appearActiveClass: String,
      appearToClass: String,
      leaveFromClass: String,
      leaveActiveClass: String,
      leaveToClass: String
  };
  const TransitionPropsValidators = (Transition.props = extend({}, BaseTransition.props, DOMTransitionPropsValidators));
  function resolveTransitionProps(rawProps) {
      let { name = 'v', type, css = true, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
      const baseProps = {};
      for (const key in rawProps) {
          if (!(key in DOMTransitionPropsValidators)) {
              baseProps[key] = rawProps[key];
          }
      }
      if (!css) {
          return baseProps;
      }
      const durations = normalizeDuration(duration);
      const enterDuration = durations && durations[0];
      const leaveDuration = durations && durations[1];
      const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
      const finishEnter = (el, isAppear, done) => {
          removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
          removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
          done && done();
      };
      const finishLeave = (el, done) => {
          removeTransitionClass(el, leaveToClass);
          removeTransitionClass(el, leaveActiveClass);
          done && done();
      };
      const makeEnterHook = (isAppear) => {
          return (el, done) => {
              const hook = isAppear ? onAppear : onEnter;
              const resolve = () => finishEnter(el, isAppear, done);
              hook && hook(el, resolve);
              nextFrame(() => {
                  removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
                  addTransitionClass(el, isAppear ? appearToClass : enterToClass);
                  if (!(hook && hook.length > 1)) {
                      if (enterDuration) {
                          setTimeout(resolve, enterDuration);
                      }
                      else {
                          whenTransitionEnds(el, type, resolve);
                      }
                  }
              });
          };
      };
      return extend(baseProps, {
          onBeforeEnter(el) {
              onBeforeEnter && onBeforeEnter(el);
              addTransitionClass(el, enterActiveClass);
              addTransitionClass(el, enterFromClass);
          },
          onBeforeAppear(el) {
              onBeforeAppear && onBeforeAppear(el);
              addTransitionClass(el, appearActiveClass);
              addTransitionClass(el, appearFromClass);
          },
          onEnter: makeEnterHook(false),
          onAppear: makeEnterHook(true),
          onLeave(el, done) {
              const resolve = () => finishLeave(el, done);
              addTransitionClass(el, leaveActiveClass);
              addTransitionClass(el, leaveFromClass);
              nextFrame(() => {
                  removeTransitionClass(el, leaveFromClass);
                  addTransitionClass(el, leaveToClass);
                  if (!(onLeave && onLeave.length > 1)) {
                      if (leaveDuration) {
                          setTimeout(resolve, leaveDuration);
                      }
                      else {
                          whenTransitionEnds(el, type, resolve);
                      }
                  }
              });
              onLeave && onLeave(el, resolve);
          },
          onEnterCancelled(el) {
              finishEnter(el, false);
              onEnterCancelled && onEnterCancelled(el);
          },
          onAppearCancelled(el) {
              finishEnter(el, true);
              onAppearCancelled && onAppearCancelled(el);
          },
          onLeaveCancelled(el) {
              finishLeave(el);
              onLeaveCancelled && onLeaveCancelled(el);
          }
      });
  }
  function normalizeDuration(duration) {
      if (duration == null) {
          return null;
      }
      else if (isObject(duration)) {
          return [NumberOf(duration.enter), NumberOf(duration.leave)];
      }
      else {
          const n = NumberOf(duration);
          return [n, n];
      }
  }
  function NumberOf(val) {
      const res = toNumber(val);
      validateDuration(res);
      return res;
  }
  function validateDuration(val) {
      if (typeof val !== 'number') {
          warn(`<transition> explicit duration is not a valid number - ` +
              `got ${JSON.stringify(val)}.`);
      }
      else if (isNaN(val)) {
          warn(`<transition> explicit duration is NaN - ` +
              'the duration expression might be incorrect.');
      }
  }
  function addTransitionClass(el, cls) {
      cls.split(/\s+/).forEach(c => c && el.classList.add(c));
      (el._vtc ||
          (el._vtc = new Set())).add(cls);
  }
  function removeTransitionClass(el, cls) {
      cls.split(/\s+/).forEach(c => c && el.classList.remove(c));
      const { _vtc } = el;
      if (_vtc) {
          _vtc.delete(cls);
          if (!_vtc.size) {
              el._vtc = undefined;
          }
      }
  }
  function nextFrame(cb) {
      requestAnimationFrame(() => {
          requestAnimationFrame(cb);
      });
  }
  function whenTransitionEnds(el, expectedType, cb) {
      const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
      if (!type) {
          return cb();
      }
      const endEvent = type + 'end';
      let ended = 0;
      const end = () => {
          el.removeEventListener(endEvent, onEnd);
          cb();
      };
      const onEnd = (e) => {
          if (e.target === el) {
              if (++ended >= propCount) {
                  end();
              }
          }
      };
      setTimeout(() => {
          if (ended < propCount) {
              end();
          }
      }, timeout + 1);
      el.addEventListener(endEvent, onEnd);
  }
  function getTransitionInfo(el, expectedType) {
      const styles = window.getComputedStyle(el);
      // JSDOM may return undefined for transition properties
      const getStyleProperties = (key) => (styles[key] || '').split(', ');
      const transitionDelays = getStyleProperties(TRANSITION + 'Delay');
      const transitionDurations = getStyleProperties(TRANSITION + 'Duration');
      const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
      const animationDelays = getStyleProperties(ANIMATION + 'Delay');
      const animationDurations = getStyleProperties(ANIMATION + 'Duration');
      const animationTimeout = getTimeout(animationDelays, animationDurations);
      let type = null;
      let timeout = 0;
      let propCount = 0;
      /* istanbul ignore if */
      if (expectedType === TRANSITION) {
          if (transitionTimeout > 0) {
              type = TRANSITION;
              timeout = transitionTimeout;
              propCount = transitionDurations.length;
          }
      }
      else if (expectedType === ANIMATION) {
          if (animationTimeout > 0) {
              type = ANIMATION;
              timeout = animationTimeout;
              propCount = animationDurations.length;
          }
      }
      else {
          timeout = Math.max(transitionTimeout, animationTimeout);
          type =
              timeout > 0
                  ? transitionTimeout > animationTimeout
                      ? TRANSITION
                      : ANIMATION
                  : null;
          propCount = type
              ? type === TRANSITION
                  ? transitionDurations.length
                  : animationDurations.length
              : 0;
      }
      const hasTransform = type === TRANSITION &&
          /\b(transform|all)(,|$)/.test(styles[TRANSITION + 'Property']);
      return {
          type,
          timeout,
          propCount,
          hasTransform
      };
  }
  function getTimeout(delays, durations) {
      while (delays.length < durations.length) {
          delays = delays.concat(delays);
      }
      return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
  }
  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer
  // numbers in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down
  // (i.e. acting as a floor function) causing unexpected behaviors
  function toMs(s) {
      return Number(s.slice(0, -1).replace(',', '.')) * 1000;
  }

  const positionMap = new WeakMap();
  const newPositionMap = new WeakMap();
  const TransitionGroupImpl = {
      name: 'TransitionGroup',
      props: extend({}, TransitionPropsValidators, {
          tag: String,
          moveClass: String
      }),
      setup(props, { slots }) {
          const instance = getCurrentInstance();
          const state = useTransitionState();
          let prevChildren;
          let children;
          onUpdated(() => {
              // children is guaranteed to exist after initial render
              if (!prevChildren.length) {
                  return;
              }
              const moveClass = props.moveClass || `${props.name || 'v'}-move`;
              if (!hasCSSTransform(prevChildren[0].el, instance.vnode.el, moveClass)) {
                  return;
              }
              // we divide the work into three loops to avoid mixing DOM reads and writes
              // in each iteration - which helps prevent layout thrashing.
              prevChildren.forEach(callPendingCbs);
              prevChildren.forEach(recordPosition);
              const movedChildren = prevChildren.filter(applyTranslation);
              // force reflow to put everything in position
              forceReflow();
              movedChildren.forEach(c => {
                  const el = c.el;
                  const style = el.style;
                  addTransitionClass(el, moveClass);
                  style.transform = style.webkitTransform = style.transitionDuration = '';
                  const cb = (el._moveCb = (e) => {
                      if (e && e.target !== el) {
                          return;
                      }
                      if (!e || /transform$/.test(e.propertyName)) {
                          el.removeEventListener('transitionend', cb);
                          el._moveCb = null;
                          removeTransitionClass(el, moveClass);
                      }
                  });
                  el.addEventListener('transitionend', cb);
              });
          });
          return () => {
              const rawProps = toRaw(props);
              const cssTransitionProps = resolveTransitionProps(rawProps);
              const tag = rawProps.tag || Fragment;
              prevChildren = children;
              children = slots.default ? getTransitionRawChildren(slots.default()) : [];
              for (let i = 0; i < children.length; i++) {
                  const child = children[i];
                  if (child.key != null) {
                      setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
                  }
                  else {
                      warn(`<TransitionGroup> children must be keyed.`);
                  }
              }
              if (prevChildren) {
                  for (let i = 0; i < prevChildren.length; i++) {
                      const child = prevChildren[i];
                      setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
                      positionMap.set(child, child.el.getBoundingClientRect());
                  }
              }
              return createVNode(tag, null, children);
          };
      }
  };
  // remove mode props as TransitionGroup doesn't support it
  delete TransitionGroupImpl.props.mode;
  const TransitionGroup = TransitionGroupImpl;
  function callPendingCbs(c) {
      const el = c.el;
      if (el._moveCb) {
          el._moveCb();
      }
      if (el._enterCb) {
          el._enterCb();
      }
  }
  function recordPosition(c) {
      newPositionMap.set(c, c.el.getBoundingClientRect());
  }
  function applyTranslation(c) {
      const oldPos = positionMap.get(c);
      const newPos = newPositionMap.get(c);
      const dx = oldPos.left - newPos.left;
      const dy = oldPos.top - newPos.top;
      if (dx || dy) {
          const s = c.el.style;
          s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
          s.transitionDuration = '0s';
          return c;
      }
  }
  // this is put in a dedicated function to avoid the line from being treeshaken
  function forceReflow() {
      return document.body.offsetHeight;
  }
  function hasCSSTransform(el, root, moveClass) {
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      const clone = el.cloneNode();
      if (el._vtc) {
          el._vtc.forEach(cls => {
              cls.split(/\s+/).forEach(c => c && clone.classList.remove(c));
          });
      }
      moveClass.split(/\s+/).forEach(c => c && clone.classList.add(c));
      clone.style.display = 'none';
      const container = (root.nodeType === 1
          ? root
          : root.parentNode);
      container.appendChild(clone);
      const { hasTransform } = getTransitionInfo(clone);
      container.removeChild(clone);
      return hasTransform;
  }

  const getModelAssigner = (vnode) => {
      const fn = vnode.props['onUpdate:modelValue'];
      return isArray(fn) ? value => invokeArrayFns(fn, value) : fn;
  };
  function onCompositionStart(e) {
      e.target.composing = true;
  }
  function onCompositionEnd(e) {
      const target = e.target;
      if (target.composing) {
          target.composing = false;
          trigger$1(target, 'input');
      }
  }
  function trigger$1(el, type) {
      const e = document.createEvent('HTMLEvents');
      e.initEvent(type, true, true);
      el.dispatchEvent(e);
  }
  // We are exporting the v-model runtime directly as vnode hooks so that it can
  // be tree-shaken in case v-model is never used.
  const vModelText = {
      beforeMount(el, { value, modifiers: { lazy, trim, number } }, vnode) {
          el.value = value == null ? '' : value;
          el._assign = getModelAssigner(vnode);
          const castToNumber = number || el.type === 'number';
          addEventListener(el, lazy ? 'change' : 'input', e => {
              if (e.target.composing)
                  return;
              let domValue = el.value;
              if (trim) {
                  domValue = domValue.trim();
              }
              else if (castToNumber) {
                  domValue = toNumber(domValue);
              }
              el._assign(domValue);
          });
          if (trim) {
              addEventListener(el, 'change', () => {
                  el.value = el.value.trim();
              });
          }
          if (!lazy) {
              addEventListener(el, 'compositionstart', onCompositionStart);
              addEventListener(el, 'compositionend', onCompositionEnd);
              // Safari < 10.2 & UIWebView doesn't fire compositionend when
              // switching focus before confirming composition choice
              // this also fixes the issue where some browsers e.g. iOS Chrome
              // fires "change" instead of "input" on autocomplete.
              addEventListener(el, 'change', onCompositionEnd);
          }
      },
      beforeUpdate(el, { value, modifiers: { trim, number } }, vnode) {
          el._assign = getModelAssigner(vnode);
          if (document.activeElement === el) {
              if (trim && el.value.trim() === value) {
                  return;
              }
              if ((number || el.type === 'number') && toNumber(el.value) === value) {
                  return;
              }
          }
          el.value = value == null ? '' : value;
      }
  };
  const vModelCheckbox = {
      beforeMount(el, binding, vnode) {
          setChecked(el, binding, vnode);
          el._assign = getModelAssigner(vnode);
          addEventListener(el, 'change', () => {
              const modelValue = el._modelValue;
              const elementValue = getValue(el);
              const checked = el.checked;
              const assign = el._assign;
              if (isArray(modelValue)) {
                  const index = looseIndexOf(modelValue, elementValue);
                  const found = index !== -1;
                  if (checked && !found) {
                      assign(modelValue.concat(elementValue));
                  }
                  else if (!checked && found) {
                      const filtered = [...modelValue];
                      filtered.splice(index, 1);
                      assign(filtered);
                  }
              }
              else {
                  assign(getCheckboxValue(el, checked));
              }
          });
      },
      beforeUpdate(el, binding, vnode) {
          el._assign = getModelAssigner(vnode);
          setChecked(el, binding, vnode);
      }
  };
  function setChecked(el, { value, oldValue }, vnode) {
      el._modelValue = value;
      if (isArray(value)) {
          el.checked = looseIndexOf(value, vnode.props.value) > -1;
      }
      else if (value !== oldValue) {
          el.checked = looseEqual(value, getCheckboxValue(el, true));
      }
  }
  const vModelRadio = {
      beforeMount(el, { value }, vnode) {
          el.checked = looseEqual(value, vnode.props.value);
          el._assign = getModelAssigner(vnode);
          addEventListener(el, 'change', () => {
              el._assign(getValue(el));
          });
      },
      beforeUpdate(el, { value, oldValue }, vnode) {
          el._assign = getModelAssigner(vnode);
          if (value !== oldValue) {
              el.checked = looseEqual(value, vnode.props.value);
          }
      }
  };
  const vModelSelect = {
      // use mounted & updated because <select> relies on its children <option>s.
      mounted(el, { value }, vnode) {
          setSelected(el, value);
          el._assign = getModelAssigner(vnode);
          addEventListener(el, 'change', () => {
              const selectedVal = Array.prototype.filter
                  .call(el.options, (o) => o.selected)
                  .map(getValue);
              el._assign(el.multiple ? selectedVal : selectedVal[0]);
          });
      },
      beforeUpdate(el, _binding, vnode) {
          el._assign = getModelAssigner(vnode);
      },
      updated(el, { value }) {
          setSelected(el, value);
      }
  };
  function setSelected(el, value) {
      const isMultiple = el.multiple;
      if (isMultiple && !isArray(value)) {
          
              warn(`<select multiple v-model> expects an Array value for its binding, ` +
                  `but got ${Object.prototype.toString.call(value).slice(8, -1)}.`);
          return;
      }
      for (let i = 0, l = el.options.length; i < l; i++) {
          const option = el.options[i];
          const optionValue = getValue(option);
          if (isMultiple) {
              option.selected = looseIndexOf(value, optionValue) > -1;
          }
          else {
              if (looseEqual(getValue(option), value)) {
                  el.selectedIndex = i;
                  return;
              }
          }
      }
      if (!isMultiple) {
          el.selectedIndex = -1;
      }
  }
  // retrieve raw value set via :value bindings
  function getValue(el) {
      return '_value' in el ? el._value : el.value;
  }
  // retrieve raw value for true-value and false-value set via :true-value or :false-value bindings
  function getCheckboxValue(el, checked) {
      const key = checked ? '_trueValue' : '_falseValue';
      return key in el ? el[key] : checked;
  }
  const vModelDynamic = {
      beforeMount(el, binding, vnode) {
          callModelHook(el, binding, vnode, null, 'beforeMount');
      },
      mounted(el, binding, vnode) {
          callModelHook(el, binding, vnode, null, 'mounted');
      },
      beforeUpdate(el, binding, vnode, prevVNode) {
          callModelHook(el, binding, vnode, prevVNode, 'beforeUpdate');
      },
      updated(el, binding, vnode, prevVNode) {
          callModelHook(el, binding, vnode, prevVNode, 'updated');
      }
  };
  function callModelHook(el, binding, vnode, prevVNode, hook) {
      let modelToUse;
      switch (el.tagName) {
          case 'SELECT':
              modelToUse = vModelSelect;
              break;
          case 'TEXTAREA':
              modelToUse = vModelText;
              break;
          default:
              switch (el.type) {
                  case 'checkbox':
                      modelToUse = vModelCheckbox;
                      break;
                  case 'radio':
                      modelToUse = vModelRadio;
                      break;
                  default:
                      modelToUse = vModelText;
              }
      }
      const fn = modelToUse[hook];
      fn && fn(el, binding, vnode, prevVNode);
  }

  const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'];
  const modifierGuards = {
      stop: e => e.stopPropagation(),
      prevent: e => e.preventDefault(),
      self: e => e.target !== e.currentTarget,
      ctrl: e => !e.ctrlKey,
      shift: e => !e.shiftKey,
      alt: e => !e.altKey,
      meta: e => !e.metaKey,
      left: e => 'button' in e && e.button !== 0,
      middle: e => 'button' in e && e.button !== 1,
      right: e => 'button' in e && e.button !== 2,
      exact: (e, modifiers) => systemModifiers.some(m => e[`${m}Key`] && !modifiers.includes(m))
  };
  /**
   * @private
   */
  const withModifiers = (fn, modifiers) => {
      return (event, ...args) => {
          for (let i = 0; i < modifiers.length; i++) {
              const guard = modifierGuards[modifiers[i]];
              if (guard && guard(event, modifiers))
                  return;
          }
          return fn(event, ...args);
      };
  };
  // Kept for 2.x compat.
  // Note: IE11 compat for `spacebar` and `del` is removed for now.
  const keyNames = {
      esc: 'escape',
      space: ' ',
      up: 'arrow-up',
      left: 'arrow-left',
      right: 'arrow-right',
      down: 'arrow-down',
      delete: 'backspace'
  };
  /**
   * @private
   */
  const withKeys = (fn, modifiers) => {
      return (event) => {
          if (!('key' in event))
              return;
          const eventKey = hyphenate(event.key);
          if (
          // None of the provided key modifiers match the current event key
          !modifiers.some(k => k === eventKey || keyNames[k] === eventKey)) {
              return;
          }
          return fn(event);
      };
  };

  const vShow = {
      beforeMount(el, { value }, { transition }) {
          el._vod = el.style.display === 'none' ? '' : el.style.display;
          if (transition && value) {
              transition.beforeEnter(el);
          }
          else {
              setDisplay(el, value);
          }
      },
      mounted(el, { value }, { transition }) {
          if (transition && value) {
              transition.enter(el);
          }
      },
      updated(el, { value, oldValue }, { transition }) {
          if (!value === !oldValue)
              return;
          if (transition) {
              if (value) {
                  transition.beforeEnter(el);
                  setDisplay(el, true);
                  transition.enter(el);
              }
              else {
                  transition.leave(el, () => {
                      setDisplay(el, false);
                  });
              }
          }
          else {
              setDisplay(el, value);
          }
      },
      beforeUnmount(el, { value }) {
          setDisplay(el, value);
      }
  };
  function setDisplay(el, value) {
      el.style.display = value ? el._vod : 'none';
  }

  const rendererOptions = extend({ patchProp, forcePatchProp }, nodeOps);
  // lazy create the renderer - this makes core renderer logic tree-shakable
  // in case the user only imports reactivity utilities from Vue.
  let renderer;
  let enabledHydration = false;
  function ensureRenderer() {
      return renderer || (renderer = createRenderer(rendererOptions));
  }
  function ensureHydrationRenderer() {
      renderer = enabledHydration
          ? renderer
          : createHydrationRenderer(rendererOptions);
      enabledHydration = true;
      return renderer;
  }
  // use explicit type casts here to avoid import() calls in rolled-up d.ts
  const render = ((...args) => {
      ensureRenderer().render(...args);
  });
  const hydrate = ((...args) => {
      ensureHydrationRenderer().hydrate(...args);
  });
  const createApp = ((...args) => {
      const app = ensureRenderer().createApp(...args);
      {
          injectNativeTagCheck(app);
      }
      const { mount } = app;
      app.mount = (containerOrSelector) => {
          const container = normalizeContainer(containerOrSelector);
          if (!container)
              return;
          const component = app._component;
          if (!isFunction(component) && !component.render && !component.template) {
              component.template = container.innerHTML;
          }
          // clear content before mounting
          container.innerHTML = '';
          const proxy = mount(container);
          container.removeAttribute('v-cloak');
          return proxy;
      };
      return app;
  });
  const createSSRApp = ((...args) => {
      const app = ensureHydrationRenderer().createApp(...args);
      {
          injectNativeTagCheck(app);
      }
      const { mount } = app;
      app.mount = (containerOrSelector) => {
          const container = normalizeContainer(containerOrSelector);
          if (container) {
              return mount(container, true);
          }
      };
      return app;
  });
  function injectNativeTagCheck(app) {
      // Inject `isNativeTag`
      // this is used for component name validation (dev only)
      Object.defineProperty(app.config, 'isNativeTag', {
          value: (tag) => isHTMLTag(tag) || isSVGTag(tag),
          writable: false
      });
  }
  function normalizeContainer(container) {
      if (isString(container)) {
          const res = document.querySelector(container);
          if ( !res) {
              warn(`Failed to mount app: mount target selector returned null.`);
          }
          return res;
      }
      return container;
  }

  // This entry exports the runtime only, and is built as
  const compile$1 = () => {
      {
          warn(`Runtime compilation is not supported in this build of Vue.` +
              (   ` Use "vue.global.js" instead.`
                          ) /* should not happen */);
      }
  };

  exports.BaseTransition = BaseTransition;
  exports.Comment = Comment;
  exports.Fragment = Fragment;
  exports.KeepAlive = KeepAlive;
  exports.Static = Static;
  exports.Suspense = Suspense;
  exports.Teleport = Teleport;
  exports.Text = Text;
  exports.Transition = Transition;
  exports.TransitionGroup = TransitionGroup;
  exports.callWithAsyncErrorHandling = callWithAsyncErrorHandling;
  exports.callWithErrorHandling = callWithErrorHandling;
  exports.camelize = _camelize;
  exports.cloneVNode = cloneVNode;
  exports.compile = compile$1;
  exports.computed = computed$1;
  exports.createApp = createApp;
  exports.createBlock = createBlock;
  exports.createCommentVNode = createCommentVNode;
  exports.createHydrationRenderer = createHydrationRenderer;
  exports.createRenderer = createRenderer;
  exports.createSSRApp = createSSRApp;
  exports.createSlots = createSlots;
  exports.createStaticVNode = createStaticVNode;
  exports.createTextVNode = createTextVNode;
  exports.createVNode = createVNode;
  exports.customRef = customRef;
  exports.defineAsyncComponent = defineAsyncComponent;
  exports.defineComponent = defineComponent;
  exports.getCurrentInstance = getCurrentInstance;
  exports.getTransitionRawChildren = getTransitionRawChildren;
  exports.h = h;
  exports.handleError = handleError;
  exports.hydrate = hydrate;
  exports.inject = inject;
  exports.isProxy = isProxy;
  exports.isReactive = isReactive;
  exports.isReadonly = isReadonly;
  exports.isRef = isRef;
  exports.isVNode = isVNode;
  exports.markRaw = markRaw;
  exports.mergeProps = mergeProps;
  exports.nextTick = nextTick;
  exports.onActivated = onActivated;
  exports.onBeforeMount = onBeforeMount;
  exports.onBeforeUnmount = onBeforeUnmount;
  exports.onBeforeUpdate = onBeforeUpdate;
  exports.onDeactivated = onDeactivated;
  exports.onErrorCaptured = onErrorCaptured;
  exports.onMounted = onMounted;
  exports.onRenderTracked = onRenderTracked;
  exports.onRenderTriggered = onRenderTriggered;
  exports.onUnmounted = onUnmounted;
  exports.onUpdated = onUpdated;
  exports.openBlock = openBlock;
  exports.popScopeId = popScopeId;
  exports.provide = provide;
  exports.pushScopeId = pushScopeId;
  exports.queuePostFlushCb = queuePostFlushCb;
  exports.reactive = reactive;
  exports.readonly = readonly;
  exports.ref = ref;
  exports.registerRuntimeCompiler = registerRuntimeCompiler;
  exports.render = render;
  exports.renderList = renderList;
  exports.renderSlot = renderSlot;
  exports.resolveComponent = resolveComponent;
  exports.resolveDirective = resolveDirective;
  exports.resolveDynamicComponent = resolveDynamicComponent;
  exports.resolveTransitionHooks = resolveTransitionHooks;
  exports.setBlockTracking = setBlockTracking;
  exports.setTransitionHooks = setTransitionHooks;
  exports.shallowReactive = shallowReactive;
  exports.shallowReadonly = shallowReadonly;
  exports.shallowRef = shallowRef;
  exports.ssrContextKey = ssrContextKey;
  exports.ssrUtils = ssrUtils;
  exports.toDisplayString = _toDisplayString;
  exports.toHandlers = toHandlers;
  exports.toRaw = toRaw;
  exports.toRef = toRef;
  exports.toRefs = toRefs;
  exports.transformVNodeArgs = transformVNodeArgs;
  exports.triggerRef = triggerRef;
  exports.unref = unref;
  exports.useCSSModule = useCSSModule;
  exports.useSSRContext = useSSRContext;
  exports.useTransitionState = useTransitionState;
  exports.vModelCheckbox = vModelCheckbox;
  exports.vModelDynamic = vModelDynamic;
  exports.vModelRadio = vModelRadio;
  exports.vModelSelect = vModelSelect;
  exports.vModelText = vModelText;
  exports.vShow = vShow;
  exports.version = version;
  exports.warn = warn;
  exports.watch = watch;
  exports.watchEffect = watchEffect;
  exports.withCtx = withCtx;
  exports.withDirectives = withDirectives;
  exports.withKeys = withKeys;
  exports.withModifiers = withModifiers;
  exports.withScopeId = withScopeId;

  return exports;

}({}));
