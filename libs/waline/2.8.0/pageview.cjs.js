"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=e=>{const t=((e="")=>e.replace(/\/$/u,""))(e);return/^(https?:)?\/\//.test(t)?t:`https://${t}`},t=e=>{"AbortError"!==e.name&&console.error(e.message)},r={"Content-Type":"application/json"},n=(e,t="")=>{if("object"==typeof e&&e.errno)throw new TypeError(`Fetch ${t} failed with ${e.errno}: ${e.errmsg}`);return e},o=({serverURL:e,lang:t,paths:r,signal:o})=>fetch(`${e}/article?path=${encodeURIComponent(r.join(","))}&lang=${t}`,{signal:o}).then((e=>e.json())).then((e=>n(e,"visit count"))).then((e=>Array.isArray(e)?e:[e])),a=({serverURL:e,lang:t,path:o})=>fetch(`${e}/article?lang=${t}`,{method:"POST",headers:r,body:JSON.stringify({path:o})}).then((e=>e.json())).then((e=>n(e,"visit count"))),s=e=>e.dataset.path||e.getAttribute("id"),i=(e,t)=>{t.forEach(((t,r)=>{t.innerText=e[r].toString()}))};exports.pageviewCount=({serverURL:r,path:n=window.location.pathname,selector:l=".waline-pageview-count",update:h=!0,lang:c="zh-CN"})=>{const p=new AbortController,g=Array.from(document.querySelectorAll(l)),u=e=>{const t=s(e);return null!==t&&n!==t},d=a=>o({serverURL:e(r),paths:a.map((e=>s(e)||n)),lang:c,signal:p.signal}).then((e=>i(e,a))).catch(t);if(h){const t=g.filter((e=>!u(e))),o=g.filter(u);a({serverURL:e(r),path:n,lang:c}).then((e=>i(new Array(t.length).fill(e),t))),o.length&&d(o)}else d(g);return p.abort.bind(p)},exports.version="2.8.0";
//# sourceMappingURL=pageview.cjs.js.map
