const e="2.7.1",t=e=>{const t=((e="")=>e.replace(/\/$/u,""))(e);return/^(https?:)?\/\//.test(t)?t:`https://${t}`},r=e=>{"AbortError"!==e.name&&console.error(e.message)},n={"Content-Type":"application/json"},a=(e,t="")=>{if("object"==typeof e&&e.errno)throw new TypeError(`Fetch ${t} failed with ${e.errno}: ${e.errmsg}`);return e},o=({serverURL:e,lang:t,paths:r,signal:n})=>fetch(`${e}/article?path=${encodeURIComponent(r.join(","))}&lang=${t}`,{signal:n}).then((e=>e.json())).then((e=>a(e,"visit count"))).then((e=>Array.isArray(e)?e:[e])),l=({serverURL:e,lang:t,path:r})=>fetch(`${e}/article?lang=${t}`,{method:"POST",headers:n,body:JSON.stringify({path:r})}).then((e=>e.json())).then((e=>a(e,"visit count"))),s=e=>e.dataset.path||e.getAttribute("id"),i=(e,t)=>{t.forEach(((t,r)=>{t.innerText=e[r].toString()}))},h=({serverURL:e,path:n=window.location.pathname,selector:a=".waline-pageview-count",update:h=!0,lang:c="zh-CN"})=>{const p=new AbortController,g=Array.from(document.querySelectorAll(a)),u=e=>{const t=s(e);return null!==t&&n!==t},f=a=>o({serverURL:t(e),paths:a.map((e=>s(e)||n)),lang:c,signal:p.signal}).then((e=>i(e,a))).catch(r);if(h){const r=g.filter((e=>!u(e))),a=g.filter(u);l({serverURL:t(e),path:n,lang:c}).then((e=>i(new Array(r.length).fill(e),r))),a.length&&f(a)}else f(g);return p.abort.bind(p)};export{h as pageviewCount,e as version};
//# sourceMappingURL=pageview.esm.js.map
