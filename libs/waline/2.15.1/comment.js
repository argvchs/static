!function(e,t){if("function"==typeof define&&define.amd)define("Waline",["exports"],t);else if("undefined"!=typeof exports)t(exports);else{var n={exports:{}};t(n.exports),e.Waline=n.exports}}("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:this,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.version=e.commentCount=void 0;const t=e=>{const t=function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"").replace(/\/$/u,"")}(e);return/^(https?:)?\/\//.test(t)?t:`https://${t}`},n=e=>{"AbortError"!==e.name&&console.error(e.message)};e.version="2.15.1",e.commentCount=e=>{let{serverURL:o,path:r=window.location.pathname,selector:a=".waline-comment-count",lang:s=navigator.language}=e;const i=new AbortController,l=document.querySelectorAll(a);return l.length&&(e=>{let{serverURL:t,lang:n,paths:o,signal:r}=e;return fetch(`${t}/comment?type=count&url=${encodeURIComponent(o.join(","))}&lang=${n}`,{signal:r}).then((e=>e.json())).then((e=>Array.isArray(e)?e:[e]))})({serverURL:t(o),paths:Array.from(l).map((e=>(e=>{try{e=decodeURI(e)}catch(e){}return e})(e.dataset.path||e.getAttribute("id")||r))),lang:s,signal:i.signal}).then((e=>{l.forEach(((t,n)=>{t.innerText=e[n].toString()}))})).catch(n),i.abort.bind(i)}}));
//# sourceMappingURL=comment.js.map
