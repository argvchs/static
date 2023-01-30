import{getCurrentScope as e,onScopeDispose as t,ref as n,unref as o,isRef as l,watch as r,readonly as i,shallowRef as a,h as s,computed as c,defineComponent as u,inject as m,onMounted as d,onUnmounted as p,resolveComponent as v,openBlock as g,createElementBlock as f,createElementVNode as w,createVNode as y,toDisplayString as h,createCommentVNode as b,normalizeClass as k,Fragment as C,renderList as $,withDirectives as I,vModelDynamic as j,vModelText as x,vShow as S,createTextVNode as L,createBlock as E,provide as R}from"vue";import z from"autosize";import{marked as M}from"marked";import O from"hanabi";function A(n){return!!e()&&(t(n),!0)}const P="undefined"!=typeof window,U=()=>{};const N=e=>e();var _=Object.getOwnPropertySymbols,T=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;function D(e,t,n={}){const o=n,{eventFilter:l=N}=o,i=((e,t)=>{var n={};for(var o in e)T.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&_)for(var o of _(e))t.indexOf(o)<0&&B.call(e,o)&&(n[o]=e[o]);return n})(o,["eventFilter"]);return r(e,(a=l,s=t,function(...e){a((()=>s.apply(this,e)),{fn:s,thisArg:this,args:e})}),i);var a,s}var F=Object.defineProperty,W=Object.defineProperties,H=Object.getOwnPropertyDescriptors,V=Object.getOwnPropertySymbols,q=Object.prototype.hasOwnProperty,J=Object.prototype.propertyIsEnumerable,K=(e,t,n)=>t in e?F(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;function Y(e,t,o={}){const l=o,{eventFilter:r}=l,i=((e,t)=>{var n={};for(var o in e)q.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&V)for(var o of V(e))t.indexOf(o)<0&&J.call(e,o)&&(n[o]=e[o]);return n})(l,["eventFilter"]),{eventFilter:a,pause:s,resume:c,isActive:u}=function(e=N){const t=n(!0);return{isActive:t,pause:function(){t.value=!1},resume:function(){t.value=!0},eventFilter:(...n)=>{t.value&&e(...n)}}}(r),m=D(e,t,(d=((e,t)=>{for(var n in t||(t={}))q.call(t,n)&&K(e,n,t[n]);if(V)for(var n of V(t))J.call(t,n)&&K(e,n,t[n]);return e})({},i),W(d,H({eventFilter:a}))));var d;return{stop:m,pause:s,resume:c,isActive:u}}const G=P?window:void 0,X=P?window.document:void 0;function Q(...e){let t,n,l,i;if("string"==typeof e[0]?([n,l,i]=e,t=G):[t,n,l,i]=e,!t)return U;let a=U;const s=r((()=>function(e){var t;const n=o(e);return null!=(t=null==n?void 0:n.$el)?t:n}(t)),(e=>{a(),e&&(e.addEventListener(n,l,i),a=()=>{e.removeEventListener(n,l,i),a=U})}),{immediate:!0,flush:"post"}),c=()=>{s(),a()};return A(c),c}P&&window.navigator,P&&window.location;const Z="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},ee="__vueuse_ssr_handlers__";Z[ee]=Z[ee]||{};const te=Z[ee];const ne={boolean:{read:e=>"true"===e,write:e=>String(e)},object:{read:e=>JSON.parse(e),write:e=>JSON.stringify(e)},number:{read:e=>Number.parseFloat(e),write:e=>String(e)},any:{read:e=>e,write:e=>String(e)},string:{read:e=>e,write:e=>String(e)},map:{read:e=>new Map(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))},set:{read:e=>new Set(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e))},date:{read:e=>new Date(e),write:e=>e.toISOString()}};function oe(e,t,l,r={}){var i;const{flush:s="pre",deep:c=!0,listenToStorageChanges:u=!0,writeDefaults:m=!0,shallow:d,window:p=G,eventFilter:v,onError:g=(e=>{console.error(e)})}=r,f=(d?a:n)(t);if(!l)try{l=function(e,t){return te[e]||t}("getDefaultStorage",(()=>{var e;return null==(e=G)?void 0:e.localStorage}))()}catch(e){g(e)}if(!l)return f;const w=o(t),y=function(e){return null==e?"any":e instanceof Set?"set":e instanceof Map?"map":e instanceof Date?"date":"boolean"==typeof e?"boolean":"string"==typeof e?"string":"object"==typeof e||Array.isArray(e)?"object":Number.isNaN(e)?"any":"number"}(w),h=null!=(i=r.serializer)?i:ne[y],{pause:b,resume:k}=Y(f,(()=>function(t){try{null==t?l.removeItem(e):l.setItem(e,h.write(t))}catch(e){g(e)}}(f.value)),{flush:s,deep:c,eventFilter:v});return p&&u&&Q(p,"storage",C),C(),f;function C(t){t&&t.key!==e||(f.value=function(t){if(!t||t.key===e){b();try{const n=t?t.newValue:l.getItem(e);return null==n?(m&&null!==w&&l.setItem(e,h.write(w)),w):"string"!=typeof n?n:h.read(n)}catch(e){g(e)}finally{k()}}}(t))}}var le,re,ie=Object.defineProperty,ae=Object.getOwnPropertySymbols,se=Object.prototype.hasOwnProperty,ce=Object.prototype.propertyIsEnumerable,ue=(e,t,n)=>t in e?ie(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;function me(e={}){const{controls:t=!1,interval:i="requestAnimationFrame"}=e,a=n(new Date),s=()=>a.value=new Date,c="requestAnimationFrame"===i?function(e,t={}){const{immediate:o=!0,window:l=G}=t,r=n(!1);let i=null;function a(){r.value&&l&&(e(),i=l.requestAnimationFrame(a))}function s(){!r.value&&l&&(r.value=!0,a())}function c(){r.value=!1,null!=i&&l&&(l.cancelAnimationFrame(i),i=null)}return o&&s(),A(c),{isActive:r,pause:c,resume:s}}(s,{immediate:!0}):function(e,t=1e3,i={}){const{immediate:a=!0,immediateCallback:s=!1}=i;let c=null;const u=n(!1);function m(){c&&(clearInterval(c),c=null)}function d(){u.value=!1,m()}function p(){t<=0||(u.value=!0,s&&e(),m(),c=setInterval(e,o(t)))}a&&P&&p(),l(t)&&A(r(t,(()=>{a&&P&&p()})));return A(d),{isActive:u,pause:d,resume:p}}(s,i,{immediate:!0});return t?((e,t)=>{for(var n in t||(t={}))se.call(t,n)&&ue(e,n,t[n]);if(ae)for(var n of ae(t))ce.call(t,n)&&ue(e,n,t[n]);return e})({now:a},c):a}P&&(null==window?void 0:window.navigator)&&(null==(le=null==window?void 0:window.navigator)?void 0:le.platform)&&/iP(ad|hone|od)/.test(null==(re=null==window?void 0:window.navigator)?void 0:re.platform);let de=0;const pe=({size:e})=>s("svg",{width:e,height:e,viewBox:"0 0 100 100",preserveAspectRatio:"xMidYMid"},s("circle",{cx:50,cy:50,fill:"none",stroke:"currentColor",strokeWidth:"4",r:"40","stroke-dasharray":"85 30"},s("animateTransform",{attributeName:"transform",type:"rotate",repeatCount:"indefinite",dur:"1s",values:"0 50 50;360 50 50",keyTimes:"0;1"}))),ve=["nick","mail","link"],ge=e=>e.filter((e=>ve.includes(e))),fe=e=>new Promise(((t,n)=>{const o=new FileReader;o.readAsDataURL(e),o.onload=()=>{var e;return t((null===(e=o.result)||void 0===e?void 0:e.toString())||"")},o.onerror=n})),we=e=>!0===e?'<p class="wl-tex">Tex is not available in preview</p>':'<span class="wl-tex">Tex is not available in preview</span>',ye=["nick","nickError","mail","mailError","link","optional","placeholder","sofa","submit","reply","cancelReply","comment","refresh","more","preview","emoji","uploadImage","seconds","minutes","hours","days","now","uploading","login","logout","admin","sticky","word","wordHint","anonymous","level0","level1","level2","level3","level4","level5"],he=e=>Object.fromEntries(e.map(((e,t)=>[ye[t],e])));var be=he(["NickName","NickName cannot be less than 3 bytes.","E-Mail","Please confirm your email address.","Website","Optional","Comment here...","No comment yet.","Submit","Reply","Cancel reply","Comments","Refresh","Load More...","Preview","Emoji","Upload Image","seconds ago","minutes ago","hours ago","days ago","just now","Uploading","Login","logout","Admin","Sticky","Words","Please input comments between $0 and $1 words!\n Current word number: $2","Anonymous","Dwarves","Hobbits","Ents","Wizards","Elves","Maiar"]),ke=he(["ニックネーム","3バイト以上のニックネームをご入力ください.","メールアドレス","メールアドレスをご確認ください.","サイト","オプション","ここにコメント","コメントしましょう~","提出する","返信する","キャンセル","コメント","更新","さらに読み込む","プレビュー","絵文字","画像をアップロード","秒前","分前","時間前","日前","たっだ今","アップロード","ログインする","ログアウト","管理者","トップに置く","ワード","コメントは $0 から $1 ワードの間でなければなりません!\n 現在の単語番号: $2","匿名"]),Ce=he(["昵称","昵称不能少于3个字符","邮箱","请填写正确的邮件地址","网址","可选","欢迎评论","来发评论吧~","提交","回复","取消回复","评论","刷新","加载更多...","预览","表情","上传图片","秒前","分钟前","小时前","天前","刚刚","正在上传","登录","退出","博主","置顶","字","评论字数应在 $0 到 $1 字之间！\n当前字数：$2","匿名","潜水","冒泡","吐槽","活跃","话痨","传说"]),$e=he(["暱稱","郵箱","網址","可選","暱稱不能少於3個字元","請填寫正確的郵件地址","歡迎評論","來發評論吧~","提交","回覆","取消回覆","評論","刷新","載入更多...","預覽","表情","上傳圖片","秒前","分鐘前","小時前","天前","剛剛","正在上傳","登錄","退出","博主","置頂","字","評論字數應在 $0 到 $1 字之間！\n當前字數：$2","匿名","潛水","冒泡","吐槽","活躍","話癆","傳說"]),Ie=he(["Apelido","Apelido não pode ser menor que 3 bytes.","E-Mail","Por favor, confirme seu endereço de e-mail.","Website","Opcional","Comente aqui...","Nenhum comentário, ainda.","Enviar","Responder","Cancelar resposta","Comentários","Refrescar","Carregar Mais...","Visualizar","Emoji","Enviar Imagem","segundos atrás","minutos atrás","horas atrás","dias atrás","agora mesmo","Enviando","Entrar","Sair","Admin","Sticky","Palavras","Favor enviar comentário com $0 a $1 palavras!\n Número de palavras atuais: $2","Anônimo"]),je=he(["Псевдоним","Никнейм не может быть меньше 3 байт.","Эл. адрес","Пожалуйста, подтвердите адрес вашей электронной почты.","Веб-сайт","Необязательный","Комментарий здесь...","Пока нет комментариев.","Отправить","Отвечать","Отменить ответ","Комментарии","Обновить","Загрузи больше...","Превью","эмодзи","Загрузить изображение","секунд назад","несколько минут назад","несколько часов назад","дней назад","прямо сейчас","Загрузка","Авторизоваться","Выход из системы","Админ","Липкий","Слова","Пожалуйста, введите комментарии от $0 до $1 слов!\nНомер текущего слова: $2","Анонимный"]);const xe={zh:Ce,"zh-cn":Ce,"zh-CN":Ce,"zh-tw":$e,"zh-TW":$e,en:be,"en-US":be,"en-us":be,jp:ke,"jp-jp":ke,"jp-JP":ke,"pt-br":Ie,"pt-BR":Ie,ru:je,"ru-ru":je,"ru-RU":je},Se=e=>{try{e=decodeURI(e)}catch(e){}return e},Le=(e="")=>e.replace(/\/$/u,""),Ee=e=>/^(https?:)?\/\//.test(e),Re=e=>{const t=Le(e);return Ee(t)?t:`https://${t}`},ze=e=>Array.isArray(e)?e:!!e&&[0,e],Me=(e,t)=>"function"==typeof e?e:!1!==e&&t,Oe="{--waline-white:#000;--waline-light-grey:#666;--waline-dark-grey:#999;--waline-color:#888;--waline-bgcolor:#1e1e1e;--waline-bgcolor-light:#272727;--waline-bgcolor-hover: #444;--waline-border-color:#333;--waline-disable-bgcolor:#444;--waline-disable-color:#272727;--waline-bq-color:#272727;--waline-info-bgcolor:#272727;--waline-info-color:#666}",Ae=(e,t)=>{let n=e.toString();for(;n.length<t;)n="0"+n;return n},Pe=(e,t,n)=>{if(!e)return"";const o="string"==typeof e?new Date(-1!==e.indexOf(" ")?e.replace(/-/g,"/"):e):e,l=t.getTime()-o.getTime(),r=Math.floor(l/864e5);if(0===r){const e=l%864e5,t=Math.floor(e/36e5);if(0===t){const t=e%36e5,o=Math.floor(t/6e4);if(0===o){const e=t%6e4;return`${Math.round(e/1e3)} ${n.seconds}`}return`${o} ${n.minutes}`}return`${t} ${n.hours}`}return r<0?n.now:r<8?`${r} ${n.days}`:(e=>{const t=Ae(e.getDate(),2),n=Ae(e.getMonth()+1,2);return`${Ae(e.getFullYear(),2)}-${n}-${t}`})(o)},Ue=e=>{const t=oe("WALINE_EMOJI",{}),n=Boolean(/@[0-9]+\.[0-9]+\.[0-9]+/.test(e));if(n){const n=t.value[e];if(n)return Promise.resolve(n)}return fetch(`${e}/info.json`).then((e=>e.json())).then((o=>{const l={folder:e,...o};return n&&(t.value[e]=l),l}))},Ne=(e,t="",n="",o="")=>`${t?`${t}/`:""}${n}${e}${o?`.${o}`:""}`,_e=({serverURL:e,lang:t,path:n,page:o,pageSize:l,signal:r,token:i})=>{const a={};return i&&(a.Authorization=`Bearer ${i}`),fetch(`${e}/comment?path=${encodeURIComponent(n)}&pageSize=${l}&page=${o}&lang=${t}`,{signal:r,headers:a}).then((e=>e.json())).then((e=>((e,t="")=>{if("object"==typeof e&&e.errno)throw new TypeError(`Fetch ${t} failed with ${e.errno}: ${e.errmsg}`);return e})(e,"comment list")))},Te=e=>e.type.includes("image"),Be=e=>{const t=Array.from(e).find(Te);return t?t.getAsFile():null},De=/\$.*?\$/,Fe=/^\$(.*?)\$/,We=/^(?:\s{0,3})\$\$((?:[^\n]|\n[^\n])+?)\n{0,1}\$\$/,He=(e="",t={})=>e.replace(/:(.+?):/g,((e,n)=>t[n]?`<img class="wl-emoji" src="${t[n]}" alt="${n}">`:e)),Ve=(e,{emojiMap:t,highlighter:n,texRenderer:o})=>{if(M.setOptions({highlight:n||void 0,breaks:!0,smartLists:!0,smartypants:!0}),o){const e=(e=>[{name:"blockMath",level:"block",tokenizer(t){const n=We.exec(t);if(null!==n)return{type:"html",raw:n[0],text:e(!0,n[1])}}},{name:"inlineMath",level:"inline",start(e){const t=e.search(De);return-1!==t?t:e.length},tokenizer(t){const n=Fe.exec(t);if(null!==n)return{type:"html",raw:n[0],text:e(!1,n[1])}}}])(o);M.use({extensions:e})}return M.parse(He(e,t))},qe=()=>oe("USER_KEY",{});var Je=u({name:"CommentBox",components:{CloseIcon:({size:e})=>s("svg",{class:"wl-close-icon",viewBox:"0 0 1024 1024",width:e,height:e},[s("path",{d:"M697.173 85.333h-369.92c-144.64 0-241.92 101.547-241.92 252.587v348.587c0 150.613 97.28 252.16 241.92 252.16h369.92c144.64 0 241.494-101.547 241.494-252.16V337.92c0-151.04-96.854-252.587-241.494-252.587z",fill:"currentColor"}),s("path",{d:"m640.683 587.52-75.947-75.861 75.904-75.862a37.29 37.29 0 0 0 0-52.778 37.205 37.205 0 0 0-52.779 0l-75.946 75.818-75.862-75.946a37.419 37.419 0 0 0-52.821 0 37.419 37.419 0 0 0 0 52.821l75.947 75.947-75.776 75.733a37.29 37.29 0 1 0 52.778 52.821l75.776-75.776 75.947 75.947a37.376 37.376 0 0 0 52.779-52.821z",fill:"#888"})]),EmojiIcon:()=>s("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},s("path",{d:"M563.2 463.3 677 540c1.7 1.2 3.7 1.8 5.8 1.8.7 0 1.4-.1 2-.2 2.7-.5 5.1-2.1 6.6-4.4l25.3-37.8c1.5-2.3 2.1-5.1 1.6-7.8s-2.1-5.1-4.4-6.6l-73.6-49.1 73.6-49.1c2.3-1.5 3.9-3.9 4.4-6.6.5-2.7 0-5.5-1.6-7.8l-25.3-37.8a10.1 10.1 0 0 0-6.6-4.4c-.7-.1-1.3-.2-2-.2-2.1 0-4.1.6-5.8 1.8l-113.8 76.6c-9.2 6.2-14.7 16.4-14.7 27.5.1 11 5.5 21.3 14.7 27.4zM387 348.8h-45.5c-5.7 0-10.4 4.7-10.4 10.4v153.3c0 5.7 4.7 10.4 10.4 10.4H387c5.7 0 10.4-4.7 10.4-10.4V359.2c0-5.7-4.7-10.4-10.4-10.4zm333.8 241.3-41-20a10.3 10.3 0 0 0-8.1-.5c-2.6.9-4.8 2.9-5.9 5.4-30.1 64.9-93.1 109.1-164.4 115.2-5.7.5-9.9 5.5-9.5 11.2l3.9 45.5c.5 5.3 5 9.5 10.3 9.5h.9c94.8-8 178.5-66.5 218.6-152.7 2.4-5 .3-11.2-4.8-13.6zm186-186.1c-11.9-42-30.5-81.4-55.2-117.1-24.1-34.9-53.5-65.6-87.5-91.2-33.9-25.6-71.5-45.5-111.6-59.2-41.2-14-84.1-21.1-127.8-21.1h-1.2c-75.4 0-148.8 21.4-212.5 61.7-63.7 40.3-114.3 97.6-146.5 165.8-32.2 68.1-44.3 143.6-35.1 218.4 9.3 74.8 39.4 145 87.3 203.3.1.2.3.3.4.5l36.2 38.4c1.1 1.2 2.5 2.1 3.9 2.6 73.3 66.7 168.2 103.5 267.5 103.5 73.3 0 145.2-20.3 207.7-58.7 37.3-22.9 70.3-51.5 98.1-85 27.1-32.7 48.7-69.5 64.2-109.1 15.5-39.7 24.4-81.3 26.6-123.8 2.4-43.6-2.5-87-14.5-129zm-60.5 181.1c-8.3 37-22.8 72-43 104-19.7 31.1-44.3 58.6-73.1 81.7-28.8 23.1-61 41-95.7 53.4-35.6 12.7-72.9 19.1-110.9 19.1-82.6 0-161.7-30.6-222.8-86.2l-34.1-35.8c-23.9-29.3-42.4-62.2-55.1-97.7-12.4-34.7-18.8-71-19.2-107.9-.4-36.9 5.4-73.3 17.1-108.2 12-35.8 30-69.2 53.4-99.1 31.7-40.4 71.1-72 117.2-94.1 44.5-21.3 94-32.6 143.4-32.6 49.3 0 97 10.8 141.8 32 34.3 16.3 65.3 38.1 92 64.8 26.1 26 47.5 56 63.6 89.2 16.2 33.2 26.6 68.5 31 105.1 4.6 37.5 2.7 75.3-5.6 112.3z",fill:"currentColor"})),ImageIcon:()=>s("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},[s("path",{d:"M784 112H240c-88 0-160 72-160 160v480c0 88 72 160 160 160h544c88 0 160-72 160-160V272c0-88-72-160-160-160zm96 640c0 52.8-43.2 96-96 96H240c-52.8 0-96-43.2-96-96V272c0-52.8 43.2-96 96-96h544c52.8 0 96 43.2 96 96v480z",fill:"currentColor"}),s("path",{d:"M352 480c52.8 0 96-43.2 96-96s-43.2-96-96-96-96 43.2-96 96 43.2 96 96 96zm0-128c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zm462.4 379.2-3.2-3.2-177.6-177.6c-25.6-25.6-65.6-25.6-91.2 0l-80 80-36.8-36.8c-25.6-25.6-65.6-25.6-91.2 0L200 728c-4.8 6.4-8 14.4-8 24 0 17.6 14.4 32 32 32 9.6 0 16-3.2 22.4-9.6L380.8 640l134.4 134.4c6.4 6.4 14.4 9.6 24 9.6 17.6 0 32-14.4 32-32 0-9.6-4.8-17.6-9.6-24l-52.8-52.8 80-80L769.6 776c6.4 4.8 12.8 8 20.8 8 17.6 0 32-14.4 32-32 0-8-3.2-16-8-20.8z",fill:"currentColor"})]),MarkdownIcon:()=>s("svg",{width:"16",height:"16",ariaHidden:"true"},s("path",{d:"M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z",fill:"currentColor"})),PreviewIcon:()=>s("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},[s("path",{d:"M710.816 654.301c70.323-96.639 61.084-230.578-23.705-314.843-46.098-46.098-107.183-71.109-172.28-71.109-65.008 0-126.092 25.444-172.28 71.109-45.227 46.098-70.756 107.183-70.756 172.106 0 64.923 25.444 126.007 71.194 172.106 46.099 46.098 107.184 71.109 172.28 71.109 51.414 0 100.648-16.212 142.824-47.404l126.53 126.006c7.058 7.06 16.297 10.979 26.406 10.979 10.105 0 19.343-3.919 26.402-10.979 14.467-14.467 14.467-38.172 0-52.723L710.816 654.301zm-315.107-23.265c-65.88-65.88-65.88-172.54 0-238.42 32.069-32.07 74.245-49.149 119.471-49.149 45.227 0 87.407 17.603 119.472 49.149 65.88 65.879 65.88 172.539 0 238.42-63.612 63.178-175.242 63.178-238.943 0zm0 0",fill:"currentColor"}),s("path",{d:"M703.319 121.603H321.03c-109.8 0-199.469 89.146-199.469 199.38v382.034c0 109.796 89.236 199.38 199.469 199.38h207.397c20.653 0 37.384-16.645 37.384-37.299 0-20.649-16.731-37.296-37.384-37.296H321.03c-68.582 0-124.352-55.77-124.352-124.267V321.421c0-68.496 55.77-124.267 124.352-124.267h382.289c68.582 0 124.352 55.771 124.352 124.267V524.72c0 20.654 16.736 37.299 37.385 37.299 20.654 0 37.384-16.645 37.384-37.299V320.549c-.085-109.8-89.321-198.946-199.121-198.946zm0 0",fill:"currentColor"})]),LoadingIcon:pe},props:{rootId:{type:String,default:""},replyId:{type:String,default:""},replyUser:{type:String,default:""}},emits:["submit","cancel-reply"],setup(e,{emit:t}){const o=m("config"),l=oe("WALINE_COMMENT_BOX_EDITOR",""),i=oe("WALINE_USER_META",{nick:"",mail:"",link:""}),a=qe(),s=n({}),u=n(null),v=n(null),g=n(null),f=n(null),w=n({tabs:[],map:{}}),y=n(0),h=n(!1),b=n(!1),k=n(""),C=n(0),$=n(0),I=n(!1),j=n(""),x=n(!1),S=c((()=>o.value.locale)),L=c((()=>{var e;return Boolean(null===(e=a.value)||void 0===e?void 0:e.token)})),E=c((()=>!1!==o.value.imageUploader)),R=e=>{const t=u.value,n=t.selectionStart,o=t.selectionEnd||0,r=t.scrollTop;l.value=t.value.substring(0,n)+e+t.value.substring(o,t.value.length),t.focus(),t.selectionStart=n+e.length,t.selectionEnd=n+e.length,t.scrollTop=r},M=e=>{const t=`![${o.value.locale.uploading} ${e.name}]()`;return R(t),Promise.resolve().then((()=>o.value.imageUploader(e))).then((n=>{l.value=l.value.replace(t,`\r\n![${e.name}](${n})`)}))},O=()=>{var n,r,c,m,d;const{serverURL:p,lang:v,login:g,wordLimit:f,requiredMeta:y}=o.value,h={comment:j.value,nick:i.value.nick,mail:i.value.mail,link:i.value.link,ua:navigator.userAgent,url:o.value.path};if(null===(n=a.value)||void 0===n?void 0:n.token)h.nick=a.value.display_name,h.mail=a.value.email,h.link=a.value.url;else{if("force"===g)return;if(y.indexOf("nick")>-1&&!h.nick)return null===(r=s.value.nick)||void 0===r||r.focus(),alert(S.value.nickError);if(y.indexOf("mail")>-1&&!h.mail||h.mail&&!/^\w(?:[\w._-]*\w)?@(?:\w(?:[\w-]*\w)?\.){0,2}\w+$/.exec(h.mail))return null===(c=s.value.mail)||void 0===c||c.focus(),alert(S.value.mailError);if(!h.comment)return void(null===(m=u.value)||void 0===m||m.focus());h.nick||(h.nick=S.value.anonymous)}if(!I.value)return alert(S.value.wordHint.replace("$0",f[0].toString()).replace("$1",f[1].toString()).replace("$2",C.value.toString()));h.comment=He(h.comment,w.value.map),e.replyId&&e.rootId&&(h.pid=e.replyId,h.rid=e.rootId,h.at=e.replyUser),x.value=!0,(({serverURL:e,lang:t,token:n,comment:o})=>{const l={"Content-Type":"application/json"};return n&&(l.Authorization=`Bearer ${n}`),fetch(`${e}/comment?lang=${t}`,{method:"POST",headers:l,body:JSON.stringify(o)}).then((e=>e.json()))})({serverURL:p,lang:v,token:null===(d=a.value)||void 0===d?void 0:d.token,comment:h}).then((n=>{if(x.value=!1,n.errmsg)return alert(n.errmsg);t("submit",n.data),l.value="",k.value="",e.replyId&&t("cancel-reply")})).catch((e=>{x.value=!1,alert(e.message)}))},A=e=>{g.value.contains(e.target)||f.value.contains(e.target)||(h.value=!1)};return r([o,C],(([e,t])=>{const{wordLimit:n}=e;n?t<n[0]&&0!==n[0]?($.value=n[0],I.value=!1):t>n[1]?($.value=n[1],I.value=!1):($.value=n[1],I.value=!0):($.value=0,I.value=!0)}),{immediate:!0}),d((()=>{document.body.addEventListener("click",A),r((()=>l.value),(e=>{const{highlighter:t,texRenderer:n}=o.value;j.value=e,k.value=Ve(e,{emojiMap:w.value.map,highlighter:t,texRenderer:n}),C.value=(e=>(e=>e.match(/[\w\d\s\u00C0-\u024F]+/giu)||[])(e).reduce(((e,t)=>e+(""===t.trim()?0:t.trim().split(/\s+/u).length)),0)+(e=>e.match(/[\u4E00-\u9FA5]/gu)||[])(e).length)(e),e?z(u.value):z.destroy(u.value)}),{immediate:!0}),r((()=>o.value.emoji),(e=>{return(t=Array.isArray(e)?e:[],Promise.all(t.map((e=>"string"==typeof e?Ue(Le(e)):Promise.resolve(e)))).then((e=>{const t={tabs:[],map:{}};return e.forEach((e=>{const{name:n,folder:o,icon:l,prefix:r,type:i,items:a}=e;t.tabs.push({name:n,icon:Ne(l,o,r,i),items:a.map((e=>{const n=`${r||""}${e}`;return t.map[n]=Ne(e,o,r,i),n}))})})),t}))).then((e=>{w.value=e}));var t}),{immediate:!0})})),p((()=>{document.body.removeEventListener("click",A)})),{config:o,locale:S,insert:R,onChange:()=>{const e=v.value;e.files&&E.value&&M(e.files[0]).then((()=>{e.value=""}))},onDrop:e=>{var t;if(null===(t=e.dataTransfer)||void 0===t?void 0:t.items){const t=Be(e.dataTransfer.items);t&&E.value&&(M(t),e.preventDefault())}},onKeyDown:e=>{const t=e.key;(e.ctrlKey||e.metaKey)&&"Enter"===t&&O()},onPaste:e=>{if(e.clipboardData){const t=Be(e.clipboardData.items);t&&E.value&&M(t)}},onLogin:e=>{e.preventDefault();const{lang:t,serverURL:n}=o.value,l=(window.innerWidth-450)/2,r=(window.innerHeight-450)/2,i=window.open(`${n}/ui/login?lng=${encodeURIComponent(t)}`,"_blank",`width=450,height=450,left=${l},top=${r},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`);null==i||i.postMessage({type:"TOKEN",data:null},"*");const s=({data:e})=>{e&&"userInfo"===e.type&&e.data.token&&(null==i||i.close(),a.value=e.data,(e.data.remember?localStorage:sessionStorage).setItem("WALINE_USER",JSON.stringify(e.data)),window.removeEventListener("message",s))};window.addEventListener("message",s)},onLogout:()=>{a.value={},localStorage.setItem("WALINE_USER","null"),sessionStorage.setItem("WALINE_USER","null")},onProfile:e=>{e.preventDefault();const{lang:t,serverURL:n}=o.value,l=(window.innerWidth-800)/2,r=(window.innerHeight-800)/2,i=window.open(`${n}/ui/profile?lng=${encodeURIComponent(t)}`,"_blank",`width=800,height=800,left=${l},top=${r},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`);null==i||i.postMessage({type:"TOKEN",data:a.value.token},"*");const s=({data:e})=>{e&&"profile"===e.type&&(a.value={...a.value,...e},[localStorage,sessionStorage].filter((e=>e.getItem("WALINE_USER"))).forEach((e=>e.setItem("WALINE_USER",JSON.stringify(a)))),window.removeEventListener("message",s))};window.addEventListener("message",s)},submitComment:O,isLogin:L,userInfo:a,isSubmitting:x,wordNumber:C,wordLimit:$,isWordNumberLegal:I,editor:l,userMeta:i,emoji:w,emojiTabIndex:y,showEmoji:h,canUploadImage:E,previewText:k,showPreview:b,inputRefs:s,editorRef:u,emojiButtonRef:g,emojiPopupRef:f,imageUploadRef:v}}});const Ke={class:"wl-comment"},Ye={key:0,class:"wl-login-info"},Ge={class:"wl-avatar"},Xe=["title"],Qe=["src"],Ze=["textContent"],et={class:"wl-panel"},tt=["for","textContent"],nt=["id","name","type","onUpdate:modelValue"],ot=["placeholder"],lt={class:"wl-preview"},rt=w("hr",null,null,-1),it=["innerHTML"],at={class:"wl-footer"},st={class:"wl-actions"},ct={href:"https://guides.github.com/features/mastering-markdown/",title:"Markdown Guide","aria-label":"Markdown is supported",class:"wl-action",target:"_blank",rel:"noreferrer"},ut=["title"],mt=["title"],dt=["title"],pt={class:"wl-info"},vt={class:"wl-text-number"},gt={key:0},ft=L("  /  "),wt=["textContent"],yt=["textContent"],ht=["disabled"],bt={key:0,class:"wl-tab-wrapper"},kt=["title","onClick"],Ct=["src","alt"],$t={key:0,class:"wl-tabs"},It=["onClick"],jt=["src","alt","title"],xt=["title"];Je.render=function(e,t,n,o,l,r){const i=v("CloseIcon"),a=v("MarkdownIcon"),s=v("EmojiIcon"),c=v("ImageIcon"),u=v("PreviewIcon"),m=v("LoadingIcon");return g(),f("div",Ke,["disable"!==e.config.login&&e.isLogin?(g(),f("div",Ye,[w("div",Ge,[w("button",{class:"wl-logout-btn",title:e.locale.logout,onClick:t[0]||(t[0]=(...t)=>e.onLogout&&e.onLogout(...t))},[y(i,{size:14})],8,Xe),w("img",{src:e.userInfo.avatar,alt:"avatar"},null,8,Qe)]),w("a",{href:"#",class:"wl-login-nick","aria-label":"Profile",onClick:t[1]||(t[1]=(...t)=>e.onProfile&&e.onProfile(...t)),textContent:h(e.userInfo.display_name)},null,8,Ze)])):b("v-if",!0),w("div",et,["force"!==e.config.login&&e.config.meta.length&&!e.isLogin?(g(),f("div",{key:0,class:k(["wl-header",`item${e.config.meta.length}`])},[(g(!0),f(C,null,$(e.config.meta,(t=>(g(),f("div",{class:"wl-header-item",key:t},[w("label",{for:t,textContent:h(e.locale[t]+(e.config.requiredMeta.includes(t)||!e.config.requiredMeta.length?"":`(${e.locale.optional})`))},null,8,tt),I(w("input",{ref_for:!0,ref:n=>{n&&(e.inputRefs[t]=n)},id:`wl-${t}`,class:k(["wl-input",`wl-${t}`]),name:t,type:"mail"===t?"email":"text","onUpdate:modelValue":n=>e.userMeta[t]=n},null,10,nt),[[j,e.userMeta[t]]])])))),128))],2)):b("v-if",!0),I(w("textarea",{class:"wl-editor",ref:"editorRef",id:"wl-edit",placeholder:e.replyUser?`@${e.replyUser}`:e.locale.placeholder,"onUpdate:modelValue":t[2]||(t[2]=t=>e.editor=t),onKeydown:t[3]||(t[3]=(...t)=>e.onKeyDown&&e.onKeyDown(...t)),onDrop:t[4]||(t[4]=(...t)=>e.onDrop&&e.onDrop(...t)),onPaste:t[5]||(t[5]=(...t)=>e.onPaste&&e.onPaste(...t))},null,40,ot),[[x,e.editor]]),I(w("div",lt,[rt,w("h4",null,h(e.locale.preview)+":",1),w("div",{class:"wl-content",innerHTML:e.previewText},null,8,it)],512),[[S,e.showPreview]]),w("div",at,[w("div",st,[w("a",ct,[y(a)]),I(w("button",{ref:"emojiButtonRef",class:k(["wl-action",{actived:e.showEmoji}]),title:e.locale.emoji,onClick:t[6]||(t[6]=t=>e.showEmoji=!e.showEmoji)},[y(s)],10,ut),[[S,e.emoji.tabs.length]]),w("input",{ref:"imageUploadRef",class:"upload",id:"wl-image-upload",type:"file",accept:".png,.jpg,.jpeg,.webp,.bmp,.gif",onChange:t[7]||(t[7]=(...t)=>e.onChange&&e.onChange(...t))},null,544),e.canUploadImage?(g(),f("label",{key:0,for:"wl-image-upload",class:"wl-action",title:e.locale.uploadImage},[y(c)],8,mt)):b("v-if",!0),w("button",{class:k(["wl-action",{actived:e.showPreview}]),title:e.locale.preview,onClick:t[8]||(t[8]=t=>e.showPreview=!e.showPreview)},[y(u)],10,dt)]),w("div",pt,[w("div",vt,[L(h(e.wordNumber)+" ",1),e.config.wordLimit?(g(),f("span",gt,[ft,w("span",{class:k({illegal:!e.isWordNumberLegal}),textContent:h(e.wordLimit)},null,10,wt)])):b("v-if",!0),L("  "+h(e.locale.word),1)]),"disable"===e.config.login||e.isLogin?b("v-if",!0):(g(),f("button",{key:0,class:"wl-btn",onClick:t[9]||(t[9]=(...t)=>e.onLogin&&e.onLogin(...t)),textContent:h(e.locale.login)},null,8,yt)),"force"!==e.config.login||e.isLogin?(g(),f("button",{key:1,class:"wl-btn primary",title:"Cmd|Ctrl + Enter",disabled:e.isSubmitting,onClick:t[10]||(t[10]=(...t)=>e.submitComment&&e.submitComment(...t))},[e.isSubmitting?(g(),E(m,{key:0,size:16})):(g(),f(C,{key:1},[L(h(e.locale.submit),1)],2112))],8,ht)):b("v-if",!0)]),w("div",{ref:"emojiPopupRef",class:k(["wl-emoji-popup",{display:e.showEmoji}])},[(g(!0),f(C,null,$(e.emoji.tabs,((t,n)=>(g(),f(C,{key:t.name},[n===e.emojiTabIndex?(g(),f("div",bt,[(g(!0),f(C,null,$(t.items,(t=>(g(),f("button",{key:t,title:t,onClick:n=>e.insert(`:${t}:`)},[e.showEmoji?(g(),f("img",{key:0,class:"wl-emoji",src:e.emoji.map[t],alt:t,loading:"lazy",referrerPolicy:"no-referrer"},null,8,Ct)):b("v-if",!0)],8,kt)))),128))])):b("v-if",!0)],64)))),128)),e.emoji.tabs.length>1?(g(),f("div",$t,[(g(!0),f(C,null,$(e.emoji.tabs,((t,n)=>(g(),f("button",{key:t.name,class:k(["wl-tab",{active:e.emojiTabIndex===n}]),onClick:t=>e.emojiTabIndex=n},[w("img",{class:"wl-emoji",src:t.icon,alt:t.name,title:t.name,loading:"lazy",referrerPolicy:"no-referrer"},null,8,jt)],10,It)))),128))])):b("v-if",!0)],2)])]),e.replyId?(g(),f("button",{key:1,class:"wl-close",title:e.locale.cancelReply,onClick:t[11]||(t[11]=t=>e.$emit("cancel-reply"))},[y(i,{size:24})],8,xt)):b("v-if",!0)])},Je.__file="src/components/CommentBox.vue";var St=u({props:{comment:{type:Object,required:!0},rootId:{type:String,required:!0},reply:{type:Object}},components:{CommentBox:Je,ReplyIcon:()=>s("svg",{viewBox:"0 0 1024 1024",width:"18",height:"18"},s("path",{d:"M1019.2 720C1001.6 625.6 968 566.4 904 497.6c-89.6-89.6-214.4-150.4-347.2-176v-120c0-25.6-8-51.2-25.6-64-33.6-30.4-81.6-30.4-112-4.8L33.6 441.6C12.8 459.2 0 484.8 0 510.4c0 25.6 12.8 51.2 30.4 68.8l385.6 312c17.6 12.8 33.6 17.6 51.2 17.6 12.8 0 25.6-4.8 38.4-8C536 888 552 857.6 552 824v-99.2c124.8 20.8 248 86.4 339.2 140.8 25.6 17.6 59.2 17.6 89.6 0 25.6-17.6 43.2-46.4 43.2-76.8 0-33.6 0-56-4.8-68.8zm-500.8-89.6-46.4-4.8v193.6L86.4 510.4 472 201.6V400l38.4 4.8c128 12.8 248 68.8 334.4 153.6 51.2 56 76.8 102.4 94.4 179.2 0 4.8 4.8 20.8 4.8 51.2C835.2 720 672 640 518.4 630.4z",fill:"currentColor"})),VerifiedIcon:()=>s("svg",{class:"verified-icon",viewBox:"0 0 1024 1024",width:"14",height:"14"},s("path",{d:"m894.4 461.56-54.4-63.2c-10.4-12-18.8-34.4-18.8-50.4v-68c0-42.4-34.8-77.2-77.2-77.2h-68c-15.6 0-38.4-8.4-50.4-18.8l-63.2-54.4c-27.6-23.6-72.8-23.6-100.8 0l-62.8 54.8c-12 10-34.8 18.4-50.4 18.4h-69.2c-42.4 0-77.2 34.8-77.2 77.2v68.4c0 15.6-8.4 38-18.4 50l-54 63.6c-23.2 27.6-23.2 72.4 0 100l54 63.6c10 12 18.4 34.4 18.4 50v68.4c0 42.4 34.8 77.2 77.2 77.2h69.2c15.6 0 38.4 8.4 50.4 18.8l63.2 54.4c27.6 23.6 72.8 23.6 100.8 0l63.2-54.4c12-10.4 34.4-18.8 50.4-18.8h68c42.4 0 77.2-34.8 77.2-77.2v-68c0-15.6 8.4-38.4 18.8-50.4l54.4-63.2c23.2-27.6 23.2-73.2-.4-100.8zm-216-25.2-193.2 193.2a30 30 0 0 1-42.4 0l-96.8-96.8a30.16 30.16 0 0 1 0-42.4c11.6-11.6 30.8-11.6 42.4 0l75.6 75.6 172-172c11.6-11.6 30.8-11.6 42.4 0 11.6 11.6 11.6 30.8 0 42.4z",fill:"#27ae60"}))},emits:["submit","reply"],setup(e){const t=m("config"),n=c((()=>t.value.locale)),o=c((()=>{let{link:t}=e.comment;return t?Ee(t)?t:`https://${t}`:""})),l=((e,t)=>{const n=me();return c((()=>Pe(e,n.value,t)))})(e.comment.insertedAt,n.value),r=c((()=>{var t;return e.comment.objectId===(null===(t=e.reply)||void 0===t?void 0:t.objectId)}));return{config:t,locale:n,isReplyingCurrent:r,link:o,time:l}}});const Lt=["id"],Et={class:"wl-user","aria-hidden":"true"},Rt=["src"],zt={class:"wl-card"},Mt={class:"wl-head"},Ot=["href"],At={key:1,class:"wl-nick"},Pt=["textContent"],Ut=["textContent"],Nt=["textContent"],_t=["textContent"],Tt=["title"],Bt={class:"wl-meta","aria-hidden":"true"},Dt=["textContent"],Ft=["textContent"],Wt=["innerHTML"],Ht={key:0,class:"wl-reply-wrapper"},Vt={key:1,class:"wl-quote"};St.render=function(e,t,n,o,l,r){const i=v("VerifiedIcon"),a=v("ReplyIcon"),s=v("CommentBox"),c=v("CommentCard",!0);return g(),f("div",{class:"wl-item",id:e.comment.objectId},[w("div",Et,[e.comment.avatar?(g(),f("img",{key:0,src:e.comment.avatar},null,8,Rt)):b("v-if",!0),e.comment.type?(g(),E(i,{key:1})):b("v-if",!0)]),w("div",zt,[w("div",Mt,[e.link?(g(),f("a",{key:0,class:"wl-nick",href:e.link,target:"_blank",rel:"nofollow noreferrer"},h(e.comment.nick),9,Ot)):(g(),f("span",At,h(e.comment.nick),1)),"administrator"===e.comment.type?(g(),f("span",{key:2,class:"wl-badge",textContent:h(e.locale.admin)},null,8,Pt)):b("v-if",!0),e.comment.sticky?(g(),f("span",{key:3,class:"wl-badge",textContent:h(e.locale.sticky)},null,8,Ut)):b("v-if",!0),e.comment.level>=0?(g(),f("span",{key:4,class:"wl-badge",textContent:h(e.locale[`level${e.comment.level}`]||`Level ${e.comment.level}`)},null,8,Nt)):b("v-if",!0),w("span",{class:"wl-time",textContent:h(e.time)},null,8,_t),w("button",{class:k(["wl-reply",{active:e.isReplyingCurrent}]),title:e.isReplyingCurrent?e.locale.cancelReply:e.locale.reply,onClick:t[0]||(t[0]=t=>e.$emit("reply",e.isReplyingCurrent?null:e.comment))},[y(a)],10,Tt)]),w("div",Bt,[e.comment.browser?(g(),f("span",{key:0,textContent:h(e.comment.browser)},null,8,Dt)):b("v-if",!0),e.comment.os?(g(),f("span",{key:1,textContent:h(e.comment.os)},null,8,Ft)):b("v-if",!0)]),w("div",{class:"wl-content",innerHTML:e.comment.comment},null,8,Wt),e.isReplyingCurrent?(g(),f("div",Ht,[y(s,{replyId:e.comment.objectId,replyUser:e.comment.nick,rootId:e.rootId,onSubmit:t[1]||(t[1]=t=>e.$emit("submit",t)),onCancelReply:t[2]||(t[2]=t=>e.$emit("reply",null))},null,8,["replyId","replyUser","rootId"])])):b("v-if",!0),e.comment.children?(g(),f("div",Vt,[(g(!0),f(C,null,$(e.comment.children,(n=>(g(),E(c,{key:n.objectId,comment:n,reply:e.reply,rootId:e.rootId,onReply:t[3]||(t[3]=t=>e.$emit("reply",t)),onSubmit:t[4]||(t[4]=t=>e.$emit("submit",t))},null,8,["comment","reply","rootId"])))),128))])):b("v-if",!0)])],8,Lt)},St.__file="src/components/CommentCard.vue";var qt=u({name:"WalineRoot",components:{CommentBox:Je,CommentCard:St,LoadingIcon:pe},props:{serverURL:{type:String,required:!0},path:{type:String,required:!0},meta:{type:Array},requiredMeta:{type:Array},dark:{type:[String,Boolean]},lang:{type:String},locale:{type:Object},pageSize:{type:Number},wordLimit:{type:[Number,Array]},emoji:{type:[Array,Boolean]},login:{type:String},highlighter:{type:Function},imageUploader:{type:[Function,Boolean]},texRenderer:{type:[Function,Boolean]}},setup(e){const t=c((()=>(({serverURL:e,path:t=location.pathname,lang:n="zh-CN",locale:o,emoji:l=["//unpkg.com/@waline/emojis@1.0.1/weibo"],meta:r=["nick","mail","link"],requiredMeta:i=[],dark:a=!1,pageSize:s=10,wordLimit:c,imageUploader:u,highlighter:m,texRenderer:d,copyright:p=!0,login:v="enable",...g})=>({serverURL:Re(e),path:Se(t),locale:{...xe[n]||xe["zh-CN"],..."object"==typeof o?o:{}},wordLimit:ze(c),meta:ge(r),requiredMeta:ge(i),imageUploader:Me(u,fe),highlighter:Me(m,O),texRenderer:Me(d,we),lang:n,dark:a,emoji:l,pageSize:s,login:v,copyright:p,...g}))(e))),o=qe(),l=n("loading"),a=n(0),s=n(1),u=n(0),m=n([]),p=n(null),v=c((()=>{return"string"==typeof(e=t.value.dark)?"auto"===e?`@media(prefers-color-scheme:dark){body${Oe}}`:`${e}${Oe}`:!0===e?`:root${Oe}`:"";var e}));let g;!function(e,t={}){const o=n(!1),{document:l=X,immediate:a=!0,manual:s=!1,id:c="vueuse_styletag_"+ ++de}=t,u=n(e);let m=()=>{};const d=()=>{if(!l)return;const e=l.getElementById(c)||l.createElement("style");e.type="text/css",e.id=c,t.media&&(e.media=t.media),l.head.appendChild(e),o.value||(m=r(u,(t=>{e.innerText=t}),{immediate:!0}),o.value=!0)},p=()=>{l&&o.value&&(m(),l.head.removeChild(l.getElementById(c)),o.value=!1)};a&&!s&&d(),s||A(p),i(o)}(v);const f=e=>{var n;const{serverURL:r,path:i,pageSize:c}=t.value,d=new AbortController;l.value="loading",null==g||g(),_e({serverURL:r,lang:t.value.lang,path:i,pageSize:c,page:e,signal:d.signal,token:null===(n=o.value)||void 0===n?void 0:n.token}).then((t=>{l.value="success",a.value=t.count,m.value.push(...t.data),s.value=e,u.value=t.totalPages})).catch((e=>{"AbortError"!==e.name&&(console.error(e.message),l.value="error")})),g=d.abort.bind(d)},w=()=>{a.value=0,m.value=[],f(1)};return R("config",t),r((()=>e.path),w),d((()=>w())),{config:t,darkmodeStyle:v,i18n:c((()=>t.value.locale)),status:l,count:a,page:s,totalPages:u,data:m,reply:p,loadMore:()=>f(s.value+1),refresh:w,onReply:e=>{p.value=e},onSubmit:e=>{if(e.rid){const t=m.value.find((({objectId:t})=>t===e.rid));if(!t)return;Array.isArray(t.children)||(t.children=[]),t.children.push(e)}else m.value.unshift(e)},version:"2.1.1"}}});const Jt={"data-waline":""},Kt={class:"wl-count"},Yt=["textContent"],Gt={class:"wl-cards"},Xt={key:1,class:"wl-operation"},Qt=["textContent"],Zt={key:0,class:"wl-loading"},en=["textContent"],tn={class:"wl-operation"},nn=["textContent"],on={key:3,class:"wl-power"},ln=L(" Powered by "),rn=w("a",{href:"https://github.com/walinejs/waline",target:"_blank",rel:"noreferrer"}," Waline ",-1);qt.render=function(e,t,n,o,l,r){const i=v("CommentBox"),a=v("CommentCard"),s=v("LoadingIcon");return g(),f("div",Jt,[e.reply?b("v-if",!0):(g(),E(i,{key:0,onSubmit:e.onSubmit},null,8,["onSubmit"])),w("div",Kt,[e.count?(g(),f("span",{key:0,class:"wl-num",textContent:h(e.count)},null,8,Yt)):b("v-if",!0),L(" "+h(e.i18n.comment),1)]),w("div",Gt,[(g(!0),f(C,null,$(e.data,(t=>(g(),E(a,{key:t.objectId,"root-id":t.objectId,comment:t,reply:e.reply,onReply:e.onReply,onSubmit:e.onSubmit},null,8,["root-id","comment","reply","onReply","onSubmit"])))),128))]),"error"===e.status?(g(),f("div",Xt,[w("button",{type:"button",class:"wl-btn",onClick:t[0]||(t[0]=(...t)=>e.refresh&&e.refresh(...t)),textContent:h(e.i18n.refresh)},null,8,Qt)])):(g(),f(C,{key:2},["loading"===e.status?(g(),f("div",Zt,[y(s,{size:30})])):e.data.length?e.page<e.totalPages?(g(),f(C,{key:2},[b(" Load more button "),w("div",tn,[w("button",{type:"button",class:"wl-btn",onClick:t[1]||(t[1]=(...t)=>e.loadMore&&e.loadMore(...t)),textContent:h(e.i18n.more)},null,8,nn)])],2112)):b("v-if",!0):(g(),f("div",{key:1,class:"wl-empty",textContent:h(e.i18n.sofa)},null,8,en))],2112)),b(" Copyright Information "),e.config.copyright?(g(),f("div",on,[ln,rn,L(" v"+h(e.version),1)])):b("v-if",!0)])},qt.__file="src/components/Waline.vue";const an="2.1.1";export{qt as Waline,an as version};
//# sourceMappingURL=component.js.map
