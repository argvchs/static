const e="2.5.0",t=e=>{"AbortError"!==e.name&&console.error(e.message)},r={"Content-Type":"application/json"},n=(e,t="")=>{if("object"==typeof e&&e.errno)throw new TypeError(`Fetch ${t} failed with ${e.errno}: ${e.errmsg}`);return e},a=({serverURL:e,lang:t,paths:r,signal:a})=>fetch(`${e}/article?path=${encodeURIComponent(r.join(","))}&lang=${t}`,{signal:a}).then((e=>e.json())).then((e=>n(e,"visit count"))).then((e=>Array.isArray(e)?e:[e])),o=({serverURL:e,lang:t,path:a})=>fetch(`${e}/article?lang=${t}`,{method:"POST",headers:r,body:JSON.stringify({path:a})}).then((e=>e.json())).then((e=>n(e,"visit count"))),l=e=>e.dataset.path||e.getAttribute("id"),i=(e,t)=>{t.forEach(((t,r)=>{t.innerText=e[r].toString()}))},s=({serverURL:e,path:r=window.location.pathname,selector:n=".waline-pageview-count",update:s=!0,lang:h="zh-CN"})=>{const c=new AbortController,g=Array.from(document.querySelectorAll(n)),p=e=>{const t=l(e);return null!==t&&r!==t},f=n=>a({serverURL:e,paths:n.map((e=>l(e)||r)),lang:h,signal:c.signal}).then((e=>i(e,n))).catch(t);if(s){const t=g.filter((e=>!p(e))),n=g.filter(p);o({serverURL:e,path:r,lang:h}).then((e=>i(new Array(t.length).fill(e),t))),n.length&&f(n)}else f(g);return c.abort.bind(c)};export{s as pageviewCount,e as version};
//# sourceMappingURL=pageview.esm.js.map
