"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=e=>{"AbortError"!==e.name&&console.error(e.message)},t=(e,t="")=>{if("object"==typeof e&&e.errno)throw new TypeError(`Fetch ${t} failed with ${e.errno}: ${e.errmsg}`);return e},r=({serverURL:e,paths:r,signal:n})=>fetch(`${e}/article?path=${encodeURIComponent(r.join(","))}`,{signal:n}).then((e=>e.json())).then((e=>t(e,"visit count"))).then((e=>Array.isArray(e)?e:[e])),n=({serverURL:e,path:r})=>fetch(`${e}/article`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:r})}).then((e=>e.json())).then((e=>t(e,"visit count"))),o=e=>e.dataset.path||e.getAttribute("id"),a=(e,t)=>{t.forEach(((t,r)=>{t.innerText=e[r].toString()}))};exports.pageviewCount=({serverURL:t,path:s=window.location.pathname,selector:i=".waline-pageview-count",update:l=!0})=>{const h=new AbortController,c=Array.from(document.querySelectorAll(i)),p=e=>{const t=o(e);return null!==t&&s!==t},u=n=>r({serverURL:t,paths:n.map((e=>o(e)||s)),signal:h.signal}).then((e=>a(e,n))).catch(e);if(l){const e=c.filter((e=>!p(e))),r=c.filter(p);n({serverURL:t,path:s}).then((t=>a(new Array(e.length).fill(t),e))),r.length&&u(r)}else u(c);return h.abort.bind(h)},exports.version="2.0.5";
//# sourceMappingURL=pageview.cjs.js.map
