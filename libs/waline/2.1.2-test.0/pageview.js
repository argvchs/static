!function(e,t){if("function"==typeof define&&define.amd)define("Waline",["exports"],t);else if("undefined"!=typeof exports)t(exports);else{var n={exports:{}};t(n.exports),e.Waline=n.exports}}("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:this,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.version=e.pageviewCount=void 0;e.version="2.1.1";const t=e=>{"AbortError"!==e.name&&console.error(e.message)},n=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";if("object"==typeof e&&e.errno)throw new TypeError("Fetch ".concat(t," failed with ").concat(e.errno,": ").concat(e.errmsg));return e},o=e=>{let{serverURL:t,lang:o,paths:r,signal:a}=e;return fetch("".concat(t,"/article?path=").concat(encodeURIComponent(r.join(",")),"&lang=").concat(o),{signal:a}).then((e=>e.json())).then((e=>n(e,"visit count"))).then((e=>Array.isArray(e)?e:[e]))},r=e=>{let{serverURL:t,lang:o,path:r}=e;return fetch("".concat(t,"/article?lang=").concat(o),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:r})}).then((e=>e.json())).then((e=>n(e,"visit count")))},a=e=>e.dataset.path||e.getAttribute("id"),i=(e,t)=>{t.forEach(((t,n)=>{t.innerText=e[n].toString()}))};e.pageviewCount=e=>{let{serverURL:n,path:l=window.location.pathname,selector:s=".waline-pageview-count",update:c=!0,lang:h="zh-CN"}=e;const f=new AbortController,p=Array.from(document.querySelectorAll(s)),d=e=>{const t=a(e);return null!==t&&l!==t},g=e=>o({serverURL:n,paths:e.map((e=>a(e)||l)),lang:h,signal:f.signal}).then((t=>i(t,e))).catch(t);if(c){const e=p.filter((e=>!d(e))),t=p.filter(d);r({serverURL:n,path:l,lang:h}).then((t=>i(new Array(e.length).fill(t),e))),t.length&&g(t)}else g(p);return f.abort.bind(f)}}));
//# sourceMappingURL=pageview.js.map
