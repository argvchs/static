!function(e,t){if("function"==typeof define&&define.amd)define("Waline",["exports"],t);else if("undefined"!=typeof exports)t(exports);else{var n={exports:{}};t(n.exports),e.Waline=n.exports}}("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:this,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.version=e.pageviewCount=void 0;e.version="2.10.0";const t=e=>{const t=function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"").replace(/\/$/u,"")}(e);return/^(https?:)?\/\//.test(t)?t:`https://${t}`},n=e=>{"AbortError"!==e.name&&console.error(e.message)},r={"Content-Type":"application/json"},o=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";if("object"==typeof e&&e.errno)throw new TypeError(`Fetch ${t} failed with ${e.errno}: ${e.errmsg}`);return e},i=e=>{let{serverURL:t,lang:n,paths:r,signal:i}=e;return fetch(`${t}/article?path=${encodeURIComponent(r.join(","))}&lang=${n}`,{signal:i}).then((e=>e.json())).then((e=>o(e,"visit count"))).then((e=>Array.isArray(e)?e:[e]))},a=e=>{let{serverURL:t,lang:n,path:i}=e;return fetch(`${t}/article?lang=${n}`,{method:"POST",headers:r,body:JSON.stringify({path:i})}).then((e=>e.json())).then((e=>o(e,"visit count")))},l=e=>e.dataset.path||e.getAttribute("id"),s=(e,t)=>{t.forEach(((t,n)=>{t.innerText=e[n].toString()}))};e.pageviewCount=e=>{let{serverURL:r,path:o=window.location.pathname,selector:h=".waline-pageview-count",update:p=!0,lang:f="zh-CN"}=e;const c=new AbortController,u=Array.from(document.querySelectorAll(h)),d=e=>{const t=l(e);return null!==t&&o!==t},g=e=>i({serverURL:t(r),paths:e.map((e=>l(e)||o)),lang:f,signal:c.signal}).then((t=>s(t,e))).catch(n);if(p){const e=u.filter((e=>!d(e))),n=u.filter(d);a({serverURL:t(r),path:o,lang:f}).then((t=>s(new Array(e.length).fill(t),e))),n.length&&g(n)}else g(u);return c.abort.bind(c)}}));
//# sourceMappingURL=pageview.js.map
