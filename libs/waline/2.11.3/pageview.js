!function(e,t){if("function"==typeof define&&define.amd)define("Waline",["exports"],t);else if("undefined"!=typeof exports)t(exports);else{var n={exports:{}};t(n.exports),e.Waline=n.exports}}("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:this,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.version=e.pageviewCount=void 0;e.version="2.11.3";const t={"Content-Type":"application/json"},n=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";if("object"==typeof e&&e.errno)throw new TypeError(`Fetch ${t} failed with ${e.errno}: ${e.errmsg}`);return e},r=e=>{let{serverURL:t,lang:r,paths:o,signal:a}=e;return(e=>{let{serverURL:t,lang:r,paths:o,type:a,signal:i}=e;return fetch(`${t}/article?path=${encodeURIComponent(o.join(","))}&type=${encodeURIComponent(a.join(","))}&lang=${r}`,{signal:i}).then((e=>e.json())).then((e=>n(e,"article count")))})({serverURL:t,lang:r,paths:o,type:["time"],signal:a}).then((e=>Array.isArray(e)?e:[e]))},o=e=>(e=>{let{serverURL:r,lang:o,path:a,type:i,action:l}=e;return fetch(`${r}/article?lang=${o}`,{method:"POST",headers:t,body:JSON.stringify({path:a,type:i,action:l})}).then((e=>e.json())).then((e=>n(e,"article count")))})({...e,type:"time"}),a=e=>{const t=function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"").replace(/\/$/u,"")}(e);return/^(https?:)?\/\//.test(t)?t:`https://${t}`},i=e=>{"AbortError"!==e.name&&console.error(e.message)},l=e=>e.dataset.path||e.getAttribute("id"),s=(e,t)=>{t.forEach(((t,n)=>{t.innerText=e[n].toString()}))};e.pageviewCount=e=>{let{serverURL:t,path:n=window.location.pathname,selector:p=".waline-pageview-count",update:h=!0,lang:c="zh-CN"}=e;const f=new AbortController,g=Array.from(document.querySelectorAll(p)),u=e=>{const t=l(e);return null!==t&&n!==t},d=e=>r({serverURL:a(t),paths:e.map((e=>l(e)||n)),lang:c,signal:f.signal}).then((t=>s(t,e))).catch(i);if(h){const e=g.filter((e=>!u(e))),r=g.filter(u);o({serverURL:a(t),path:n,lang:c}).then((t=>s(new Array(e.length).fill(t),e))),r.length&&d(r)}else d(g);return f.abort.bind(f)}}));
//# sourceMappingURL=pageview.js.map
