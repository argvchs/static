'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var compilerDom = require('@vue/compiler-dom');
var runtimeDom = require('@vue/runtime-dom');

const NOOP = () => { };
const isString = (val) => typeof val === 'string';

// This entry is the "full-build" that includes both the runtime
const compileCache = Object.create(null);
function compileToFunction(template, options) {
    if (!isString(template)) {
        if (template.nodeType) {
            template = template.innerHTML;
        }
        else {
            return NOOP;
        }
    }
    const key = template;
    const cached = compileCache[key];
    if (cached) {
        return cached;
    }
    if (template[0] === '#') {
        const el = document.querySelector(template);
        template = el ? el.innerHTML : ``;
    }
    const { code } = compilerDom.compile(template, {
        hoistStatic: true,
        onError(err) {
        },
        ...options
    });
    const render = new Function('Vue', code)(runtimeDom);
    return (compileCache[key] = render);
}
runtimeDom.registerRuntimeCompiler(compileToFunction);

Object.keys(runtimeDom).forEach(function (k) {
  if (k !== 'default') exports[k] = runtimeDom[k];
});
exports.compile = compileToFunction;
