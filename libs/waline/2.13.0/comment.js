!function(e,t){if("function"==typeof define&&define.amd)define("Waline",["exports"],t);else if("undefined"!=typeof exports)t(exports);else{var n={exports:{}};t(n.exports),e.Waline=n.exports}}("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:this,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.version=e.commentCount=void 0;const t=e=>{let{serverURL:t,lang:n,paths:r,signal:o}=e;return fetch(`${t}/comment?type=count&url=${encodeURIComponent(r.join(","))}&lang=${n}`,{signal:o,headers:{}}).then((e=>e.json())).then((e=>function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";if("object"==typeof e&&e.errno)throw new TypeError(`Fetch ${t} failed with ${e.errno}: ${e.errmsg}`);return e}(e,"comment count"))).then((e=>Array.isArray(e)?e:[e]))},n=e=>{const t=function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"").replace(/\/$/u,"")}(e);return/^(https?:)?\/\//.test(t)?t:`https://${t}`},r=e=>{"AbortError"!==e.name&&console.error(e.message)};e.commentCount=e=>{let{serverURL:o,path:i=window.location.pathname,selector:s=".waline-comment-count",lang:a="zh-CN"}=e;const l=new AbortController,c=document.querySelectorAll(s);return c.length&&t({serverURL:n(o),paths:Array.from(c).map((e=>(e=>{try{e=decodeURI(e)}catch(e){}return e})(e.dataset.path||e.getAttribute("id")||i))),lang:a,signal:l.signal}).then((e=>{c.forEach(((t,n)=>{t.innerText=e[n].toString()}))})).catch(r),l.abort.bind(l)};e.version="2.13.0"}));
//# sourceMappingURL=comment.js.map
