!function(e,t){if("function"==typeof define&&define.amd)define("Waline",["exports"],t);else if("undefined"!=typeof exports)t(exports);else{var n={exports:{}};t(n.exports),e.Waline=n.exports}}("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:this,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.version=e.pageviewCount=void 0;const t={"Content-Type":"application/json"},n=e=>(e=>{let{serverURL:n,lang:r,path:o,type:a,action:i}=e;return fetch(`${n}/article?lang=${r}`,{method:"POST",headers:t,body:JSON.stringify({path:o,type:a,action:i})}).then((e=>e.json()))})({...e,type:"time",action:"inc"}),r=e=>{const t=function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"").replace(/\/$/u,"")}(e);return/^(https?:)?\/\//.test(t)?t:`https://${t}`},o=e=>{"AbortError"!==e.name&&console.error(e.message)},a=e=>e.dataset.path||e.getAttribute("id"),i=(e,t)=>{t.forEach(((t,n)=>{t.innerText=e[n].toString()}))};e.pageviewCount=e=>{let{serverURL:t,path:l=window.location.pathname,selector:s=".waline-pageview-count",update:p=!0,lang:c=navigator.language}=e;const g=new AbortController,h=Array.from(document.querySelectorAll(s)),f=e=>{const t=a(e);return null!==t&&l!==t},u=e=>(e=>{let{serverURL:t,lang:n,paths:r,signal:o}=e;return(e=>{let{serverURL:t,lang:n,paths:r,type:o,signal:a}=e;return fetch(`${t}/article?path=${encodeURIComponent(r.join(","))}&type=${encodeURIComponent(o.join(","))}&lang=${n}`,{signal:a}).then((e=>e.json()))})({serverURL:t,lang:n,paths:r,type:["time"],signal:o}).then((e=>Array.isArray(e)?e:[e]))})({serverURL:r(t),paths:e.map((e=>a(e)||l)),lang:c,signal:g.signal}).then((t=>i(t,e))).catch(o);if(p){const e=h.filter((e=>!f(e))),o=h.filter(f);n({serverURL:r(t),path:l,lang:c}).then((t=>i(new Array(e.length).fill(t),e))),o.length&&u(o)}else u(h);return g.abort.bind(g)},e.version="2.15.5"}));
//# sourceMappingURL=pageview.js.map
