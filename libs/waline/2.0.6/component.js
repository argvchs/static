import{h as e,ref as t,unref as n,isRef as o,watch as l,getCurrentScope as r,onScopeDispose as i,shallowRef as a,computed as s,defineComponent as c,inject as u,onMounted as m,onUnmounted as d,resolveComponent as p,openBlock as v,createElementBlock as g,createElementVNode as f,createVNode as w,toDisplayString as h,createCommentVNode as y,normalizeClass as b,Fragment as k,renderList as C,withDirectives as $,vModelDynamic as I,vModelText as j,vShow as S,createTextVNode as x,createBlock as L,provide as E,watchEffect as R,onBeforeUnmount as z}from"vue";import M from"autosize";import{marked as O}from"marked";import A from"hanabi";const P=({size:t})=>e("svg",{width:t,height:t,viewBox:"0 0 100 100",preserveAspectRatio:"xMidYMid"},e("circle",{cx:50,cy:50,fill:"none",stroke:"currentColor",strokeWidth:"4",r:"40","stroke-dasharray":"85 30"},e("animateTransform",{attributeName:"transform",type:"rotate",repeatCount:"indefinite",dur:"1s",values:"0 50 50;360 50 50",keyTimes:"0;1"})));function U(e){return!!r()&&(i(e),!0)}const N="undefined"!=typeof window,T=()=>{};const _=e=>e();var B=Object.getOwnPropertySymbols,F=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable;function W(e,t,n={}){const o=n,{eventFilter:r=_}=o,i=((e,t)=>{var n={};for(var o in e)F.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&B)for(var o of B(e))t.indexOf(o)<0&&D.call(e,o)&&(n[o]=e[o]);return n})(o,["eventFilter"]);return l(e,(a=r,s=t,function(...e){a((()=>s.apply(this,e)),{fn:s,thisArg:this,args:e})}),i);var a,s}var q=Object.defineProperty,H=Object.defineProperties,V=Object.getOwnPropertyDescriptors,J=Object.getOwnPropertySymbols,K=Object.prototype.hasOwnProperty,Y=Object.prototype.propertyIsEnumerable,G=(e,t,n)=>t in e?q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;function X(e,n,o={}){const l=o,{eventFilter:r}=l,i=((e,t)=>{var n={};for(var o in e)K.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&J)for(var o of J(e))t.indexOf(o)<0&&Y.call(e,o)&&(n[o]=e[o]);return n})(l,["eventFilter"]),{eventFilter:a,pause:s,resume:c,isActive:u}=function(e=_){const n=t(!0);return{isActive:n,pause:function(){n.value=!1},resume:function(){n.value=!0},eventFilter:(...t)=>{n.value&&e(...t)}}}(r),m=W(e,n,(d=((e,t)=>{for(var n in t||(t={}))K.call(t,n)&&G(e,n,t[n]);if(J)for(var n of J(t))Y.call(t,n)&&G(e,n,t[n]);return e})({},i),H(d,V({eventFilter:a}))));var d;return{stop:m,pause:s,resume:c,isActive:u}}const Q=N?window:void 0;function Z(...e){let t,o,r,i;if("string"==typeof e[0]?([o,r,i]=e,t=Q):[t,o,r,i]=e,!t)return T;let a=T;const s=l((()=>function(e){var t;const o=n(e);return null!=(t=null==o?void 0:o.$el)?t:o}(t)),(e=>{a(),e&&(e.addEventListener(o,r,i),a=()=>{e.removeEventListener(o,r,i),a=T})}),{immediate:!0,flush:"post"}),c=()=>{s(),a()};return U(c),c}N&&window.document,N&&window.navigator,N&&window.location;const ee="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},te="__vueuse_ssr_handlers__";ee[te]=ee[te]||{};const ne=ee[te];const oe={boolean:{read:e=>"true"===e,write:e=>String(e)},object:{read:e=>JSON.parse(e),write:e=>JSON.stringify(e)},number:{read:e=>Number.parseFloat(e),write:e=>String(e)},any:{read:e=>e,write:e=>String(e)},string:{read:e=>e,write:e=>String(e)},map:{read:e=>new Map(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))},set:{read:e=>new Set(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e))},date:{read:e=>new Date(e),write:e=>e.toISOString()}};function le(e,o,l,r={}){var i;const{flush:s="pre",deep:c=!0,listenToStorageChanges:u=!0,writeDefaults:m=!0,shallow:d,window:p=Q,eventFilter:v,onError:g=(e=>{console.error(e)})}=r,f=(d?a:t)(o);if(!l)try{l=function(e,t){return ne[e]||t}("getDefaultStorage",(()=>{var e;return null==(e=Q)?void 0:e.localStorage}))()}catch(e){g(e)}if(!l)return f;const w=n(o),h=function(e){return null==e?"any":e instanceof Set?"set":e instanceof Map?"map":e instanceof Date?"date":"boolean"==typeof e?"boolean":"string"==typeof e?"string":"object"==typeof e||Array.isArray(e)?"object":Number.isNaN(e)?"any":"number"}(w),y=null!=(i=r.serializer)?i:oe[h],{pause:b,resume:k}=X(f,(()=>function(t){try{null==t?l.removeItem(e):l.setItem(e,y.write(t))}catch(e){g(e)}}(f.value)),{flush:s,deep:c,eventFilter:v});return p&&u&&Z(p,"storage",C),C(),f;function C(t){t&&t.key!==e||(f.value=function(t){if(!t||t.key===e){b();try{const n=t?t.newValue:l.getItem(e);return null==n?(m&&null!==w&&l.setItem(e,y.write(w)),w):"string"!=typeof n?n:y.read(n)}catch(e){g(e)}finally{k()}}}(t))}}var re,ie,ae=Object.defineProperty,se=Object.getOwnPropertySymbols,ce=Object.prototype.hasOwnProperty,ue=Object.prototype.propertyIsEnumerable,me=(e,t,n)=>t in e?ae(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;function de(e={}){const{controls:r=!1,interval:i="requestAnimationFrame"}=e,a=t(new Date),s=()=>a.value=new Date,c="requestAnimationFrame"===i?function(e,n={}){const{immediate:o=!0,window:l=Q}=n,r=t(!1);let i=null;function a(){r.value&&l&&(e(),i=l.requestAnimationFrame(a))}function s(){!r.value&&l&&(r.value=!0,a())}function c(){r.value=!1,null!=i&&l&&(l.cancelAnimationFrame(i),i=null)}return o&&s(),U(c),{isActive:r,pause:c,resume:s}}(s,{immediate:!0}):function(e,r=1e3,i={}){const{immediate:a=!0,immediateCallback:s=!1}=i;let c=null;const u=t(!1);function m(){c&&(clearInterval(c),c=null)}function d(){u.value=!1,m()}function p(){r<=0||(u.value=!0,s&&e(),m(),c=setInterval(e,n(r)))}a&&N&&p(),o(r)&&U(l(r,(()=>{a&&N&&p()})));return U(d),{isActive:u,pause:d,resume:p}}(s,i,{immediate:!0});return r?((e,t)=>{for(var n in t||(t={}))ce.call(t,n)&&me(e,n,t[n]);if(se)for(var n of se(t))ue.call(t,n)&&me(e,n,t[n]);return e})({now:a},c):a}N&&(null==window?void 0:window.navigator)&&(null==(re=null==window?void 0:window.navigator)?void 0:re.platform)&&/iP(ad|hone|od)/.test(null==(ie=null==window?void 0:window.navigator)?void 0:ie.platform);const pe=["nick","mail","link"],ve=e=>e.filter((e=>pe.includes(e))),ge=e=>new Promise(((t,n)=>{const o=new FileReader;o.readAsDataURL(e),o.onload=()=>{var e;return t((null===(e=o.result)||void 0===e?void 0:e.toString())||"")},o.onerror=n})),fe=e=>!0===e?'<p class="wl-tex">Tex is not available in preview</p>':'<span class="wl-tex">Tex is not available in preview</span>',we=["nick","nickError","mail","mailError","link","optional","placeholder","sofa","submit","reply","cancelReply","comment","refresh","more","preview","emoji","uploadImage","seconds","minutes","hours","days","now","uploading","login","logout","admin","sticky","word","wordHint","anonymous"],he=e=>Object.fromEntries(e.map(((e,t)=>[we[t],e])));var ye=he(["NickName","NickName cannot be less than 3 bytes.","E-Mail","Please confirm your email address.","Website","Optional","Comment here...","No comment yet.","Submit","Reply","Cancel reply","Comments","Refresh","Load More...","Preview","Emoji","Upload Image","seconds ago","minutes ago","hours ago","days ago","just now","Uploading","Login","logout","Admin","Sticky","Words","Please input comments between $0 and $1 words!\n Current word number: $2","Anonymous"]),be=he(["ニックネーム","3バイト以上のニックネームをご入力ください.","メールアドレス","メールアドレスをご確認ください.","サイト","オプション","ここにコメント","コメントしましょう~","提出する","返信する","キャンセル","コメント","更新","さらに読み込む","プレビュー","絵文字","画像をアップロード","秒前","分前","時間前","日前","たっだ今","アップロード","ログインする","ログアウト","管理者","トップに置く","ワード","コメントは $0 から $1 ワードの間でなければなりません!\n 現在の単語番号: $2","匿名"]),ke=he(["昵称","昵称不能少于3个字符","邮箱","请填写正确的邮件地址","网址","可选","欢迎评论","来发评论吧~","提交","回复","取消回复","评论","刷新","加载更多...","预览","表情","上传图片","秒前","分钟前","小时前","天前","刚刚","正在上传","登录","退出","博主","置顶","字","评论字数应在 $0 到 $1 字之间！\n当前字数：$2","匿名"]),Ce=he(["暱稱","郵箱","網址","可選","暱稱不能少於3個字元","請填寫正確的郵件地址","歡迎評論","來發評論吧~","提交","回覆","取消回覆","評論","刷新","載入更多...","預覽","表情","上傳圖片","秒前","分鐘前","小時前","天前","剛剛","正在上傳","登錄","退出","博主","置頂","字","評論字數應在 $0 到 $1 字之間！\n當前字數：$2","匿名"]),$e=he(["Apelido","Apelido não pode ser menor que 3 bytes.","E-Mail","Por favor, confirme seu endereço de e-mail.","Website","Opcional","Comente aqui...","Nenhum comentário, ainda.","Enviar","Responder","Cancelar resposta","Comentários","Refrescar","Carregar Mais...","Visualizar","Emoji","Enviar Imagem","segundos atrás","minutos atrás","horas atrás","dias atrás","agora mesmo","Enviando","Entrar","Sair","Admin","Sticky","Palavras","Favor enviar comentário com $0 a $1 palavras!\n Número de palavras atuais: $2","Anônimo"]),Ie=he(["Псевдоним","Никнейм не может быть меньше 3 байт.","Эл. адрес","Пожалуйста, подтвердите адрес вашей электронной почты.","Веб-сайт","Необязательный","Комментарий здесь...","Пока нет комментариев.","Отправить","Отвечать","Отменить ответ","Комментарии","Обновить","Загрузи больше...","Превью","эмодзи","Загрузить изображение","секунд назад","несколько минут назад","несколько часов назад","дней назад","прямо сейчас","Загрузка","Авторизоваться","Выход из системы","Админ","Липкий","Слова","Пожалуйста, введите комментарии от $0 до $1 слов!\nНомер текущего слова: $2","Анонимный"]);const je={zh:ke,"zh-cn":ke,"zh-CN":ke,"zh-tw":Ce,"zh-TW":Ce,en:ye,"en-US":ye,"en-us":ye,jp:be,"jp-jp":be,"jp-JP":be,"pt-br":$e,"pt-BR":$e,ru:Ie,"ru-ru":Ie,"ru-RU":Ie},Se=e=>{try{e=decodeURI(e)}catch(e){}return e},xe=(e="")=>e.replace(/\/$/u,""),Le=e=>/^(https?:)?\/\//.test(e),Ee=e=>{const t=xe(e);return Le(t)?t:`https://${t}`},Re=e=>Array.isArray(e)?e:!!e&&[0,e],ze=(e,t)=>"function"==typeof e?e:!1!==e&&t,Me="{--waline-white:#000;--waline-light-grey:#666;--waline-dark-grey:#999;--waline-color:#888;--waline-bgcolor:#1e1e1e;--waline-bgcolor-light:#272727;--waline-bgcolor-hover: #444;--waline-border-color:#333;--waline-disable-bgcolor:#444;--waline-disable-color:#272727;--waline-bq-color:#272727;--waline-info-bgcolor:#272727;--waline-info-color:#666}",Oe=(e,t)=>{let n=e.toString();for(;n.length<t;)n="0"+n;return n},Ae=e=>{const t=le("WALINE_EMOJI",{}),n=Boolean(/@[0-9]+\.[0-9]+\.[0-9]+/.test(e));if(n){const e=t.value.link;if(e)return Promise.resolve(e)}return fetch(`${e}/info.json`).then((e=>e.json())).then((o=>{const l={folder:e,...o};return n&&(t.value.link=l),l}))},Pe=(e,t="",n="",o="")=>`${t?`${t}/`:""}${n}${e}${o?`.${o}`:""}`,Ue=({serverURL:e,path:t,page:n,pageSize:o,signal:l,token:r})=>{const i={};return r&&(i.Authorization=`Bearer ${r}`),fetch(`${e}/comment?path=${encodeURIComponent(t)}&pageSize=${o}&page=${n}`,{signal:l,headers:i}).then((e=>e.json())).then((e=>((e,t="")=>{if("object"==typeof e&&e.errno)throw new TypeError(`Fetch ${t} failed with ${e.errno}: ${e.errmsg}`);return e})(e,"comment list")))},Ne=e=>e.type.includes("image"),Te=e=>{const t=Array.from(e).find(Ne);return t?t.getAsFile():null},_e=/\$.*?\$/,Be=/^\$(.*?)\$/,Fe=/^(?:\s{0,3})\$\$((?:[^\n]|\n[^\n])+?)\n{0,1}\$\$/,De=(e="",t={})=>e.replace(/:(.+?):/g,((e,n)=>t[n]?`<img class="wl-emoji" src="${t[n]}" alt="${n}">`:e)),We=(e,{emojiMap:t,highlighter:n,texRenderer:o})=>{if(O.setOptions({highlight:n||void 0,breaks:!0,smartLists:!0,smartypants:!0}),o){const e=(e=>[{name:"blockMath",level:"block",tokenizer(t){const n=Fe.exec(t);if(null!==n)return{type:"html",raw:n[0],text:e(!0,n[1])}}},{name:"inlineMath",level:"inline",start(e){const t=e.search(_e);return-1!==t?t:e.length},tokenizer(t){const n=Be.exec(t);if(null!==n)return{type:"html",raw:n[0],text:e(!1,n[1])}}}])(o);O.use({extensions:e})}return O.parse(De(e,t))},qe=(e,t)=>{const n=de();return s((()=>{if(!e)return"";const o="string"==typeof e?new Date(-1!==e.indexOf(" ")?e.replace(/-/g,"/"):e):e,l=n.value.getTime()-o.getTime(),r=Math.floor(l/864e5);if(0===r){const e=l%864e5,n=Math.floor(e/36e5);if(0===n){const n=e%36e5,o=Math.floor(n/6e4);if(0===o){const e=n%6e4;return`${Math.round(e/1e3)} ${t.seconds}`}return`${o} ${t.minutes}`}return`${n} ${t.hours}`}return r<0?t.now:r<8?`${r} ${t.days}`:(e=>{const t=Oe(e.getDate(),2),n=Oe(e.getMonth()+1,2);return`${Oe(e.getFullYear(),2)}-${n}-${t}`})(o)}))},He=()=>le("USER_KEY",{});var Ve=c({name:"CommentBox",components:{CloseIcon:({size:t})=>e("svg",{class:"wl-close-icon",viewBox:"0 0 1024 1024",width:t,height:t},[e("path",{d:"M697.173 85.333h-369.92c-144.64 0-241.92 101.547-241.92 252.587v348.587c0 150.613 97.28 252.16 241.92 252.16h369.92c144.64 0 241.494-101.547 241.494-252.16V337.92c0-151.04-96.854-252.587-241.494-252.587z",fill:"currentColor"}),e("path",{d:"m640.683 587.52-75.947-75.861 75.904-75.862a37.29 37.29 0 0 0 0-52.778 37.205 37.205 0 0 0-52.779 0l-75.946 75.818-75.862-75.946a37.419 37.419 0 0 0-52.821 0 37.419 37.419 0 0 0 0 52.821l75.947 75.947-75.776 75.733a37.29 37.29 0 1 0 52.778 52.821l75.776-75.776 75.947 75.947a37.376 37.376 0 0 0 52.779-52.821z",fill:"#888"})]),EmojiIcon:()=>e("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},e("path",{d:"M563.2 463.3 677 540c1.7 1.2 3.7 1.8 5.8 1.8.7 0 1.4-.1 2-.2 2.7-.5 5.1-2.1 6.6-4.4l25.3-37.8c1.5-2.3 2.1-5.1 1.6-7.8s-2.1-5.1-4.4-6.6l-73.6-49.1 73.6-49.1c2.3-1.5 3.9-3.9 4.4-6.6.5-2.7 0-5.5-1.6-7.8l-25.3-37.8a10.1 10.1 0 0 0-6.6-4.4c-.7-.1-1.3-.2-2-.2-2.1 0-4.1.6-5.8 1.8l-113.8 76.6c-9.2 6.2-14.7 16.4-14.7 27.5.1 11 5.5 21.3 14.7 27.4zM387 348.8h-45.5c-5.7 0-10.4 4.7-10.4 10.4v153.3c0 5.7 4.7 10.4 10.4 10.4H387c5.7 0 10.4-4.7 10.4-10.4V359.2c0-5.7-4.7-10.4-10.4-10.4zm333.8 241.3-41-20a10.3 10.3 0 0 0-8.1-.5c-2.6.9-4.8 2.9-5.9 5.4-30.1 64.9-93.1 109.1-164.4 115.2-5.7.5-9.9 5.5-9.5 11.2l3.9 45.5c.5 5.3 5 9.5 10.3 9.5h.9c94.8-8 178.5-66.5 218.6-152.7 2.4-5 .3-11.2-4.8-13.6zm186-186.1c-11.9-42-30.5-81.4-55.2-117.1-24.1-34.9-53.5-65.6-87.5-91.2-33.9-25.6-71.5-45.5-111.6-59.2-41.2-14-84.1-21.1-127.8-21.1h-1.2c-75.4 0-148.8 21.4-212.5 61.7-63.7 40.3-114.3 97.6-146.5 165.8-32.2 68.1-44.3 143.6-35.1 218.4 9.3 74.8 39.4 145 87.3 203.3.1.2.3.3.4.5l36.2 38.4c1.1 1.2 2.5 2.1 3.9 2.6 73.3 66.7 168.2 103.5 267.5 103.5 73.3 0 145.2-20.3 207.7-58.7 37.3-22.9 70.3-51.5 98.1-85 27.1-32.7 48.7-69.5 64.2-109.1 15.5-39.7 24.4-81.3 26.6-123.8 2.4-43.6-2.5-87-14.5-129zm-60.5 181.1c-8.3 37-22.8 72-43 104-19.7 31.1-44.3 58.6-73.1 81.7-28.8 23.1-61 41-95.7 53.4-35.6 12.7-72.9 19.1-110.9 19.1-82.6 0-161.7-30.6-222.8-86.2l-34.1-35.8c-23.9-29.3-42.4-62.2-55.1-97.7-12.4-34.7-18.8-71-19.2-107.9-.4-36.9 5.4-73.3 17.1-108.2 12-35.8 30-69.2 53.4-99.1 31.7-40.4 71.1-72 117.2-94.1 44.5-21.3 94-32.6 143.4-32.6 49.3 0 97 10.8 141.8 32 34.3 16.3 65.3 38.1 92 64.8 26.1 26 47.5 56 63.6 89.2 16.2 33.2 26.6 68.5 31 105.1 4.6 37.5 2.7 75.3-5.6 112.3z",fill:"currentColor"})),ImageIcon:()=>e("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},[e("path",{d:"M784 112H240c-88 0-160 72-160 160v480c0 88 72 160 160 160h544c88 0 160-72 160-160V272c0-88-72-160-160-160zm96 640c0 52.8-43.2 96-96 96H240c-52.8 0-96-43.2-96-96V272c0-52.8 43.2-96 96-96h544c52.8 0 96 43.2 96 96v480z",fill:"currentColor"}),e("path",{d:"M352 480c52.8 0 96-43.2 96-96s-43.2-96-96-96-96 43.2-96 96 43.2 96 96 96zm0-128c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zm462.4 379.2-3.2-3.2-177.6-177.6c-25.6-25.6-65.6-25.6-91.2 0l-80 80-36.8-36.8c-25.6-25.6-65.6-25.6-91.2 0L200 728c-4.8 6.4-8 14.4-8 24 0 17.6 14.4 32 32 32 9.6 0 16-3.2 22.4-9.6L380.8 640l134.4 134.4c6.4 6.4 14.4 9.6 24 9.6 17.6 0 32-14.4 32-32 0-9.6-4.8-17.6-9.6-24l-52.8-52.8 80-80L769.6 776c6.4 4.8 12.8 8 20.8 8 17.6 0 32-14.4 32-32 0-8-3.2-16-8-20.8z",fill:"currentColor"})]),MarkdownIcon:()=>e("svg",{width:"16",height:"16",ariaHidden:"true"},e("path",{d:"M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z",fill:"currentColor"})),PreviewIcon:()=>e("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},[e("path",{d:"M710.816 654.301c70.323-96.639 61.084-230.578-23.705-314.843-46.098-46.098-107.183-71.109-172.28-71.109-65.008 0-126.092 25.444-172.28 71.109-45.227 46.098-70.756 107.183-70.756 172.106 0 64.923 25.444 126.007 71.194 172.106 46.099 46.098 107.184 71.109 172.28 71.109 51.414 0 100.648-16.212 142.824-47.404l126.53 126.006c7.058 7.06 16.297 10.979 26.406 10.979 10.105 0 19.343-3.919 26.402-10.979 14.467-14.467 14.467-38.172 0-52.723L710.816 654.301zm-315.107-23.265c-65.88-65.88-65.88-172.54 0-238.42 32.069-32.07 74.245-49.149 119.471-49.149 45.227 0 87.407 17.603 119.472 49.149 65.88 65.879 65.88 172.539 0 238.42-63.612 63.178-175.242 63.178-238.943 0zm0 0",fill:"currentColor"}),e("path",{d:"M703.319 121.603H321.03c-109.8 0-199.469 89.146-199.469 199.38v382.034c0 109.796 89.236 199.38 199.469 199.38h207.397c20.653 0 37.384-16.645 37.384-37.299 0-20.649-16.731-37.296-37.384-37.296H321.03c-68.582 0-124.352-55.77-124.352-124.267V321.421c0-68.496 55.77-124.267 124.352-124.267h382.289c68.582 0 124.352 55.771 124.352 124.267V524.72c0 20.654 16.736 37.299 37.385 37.299 20.654 0 37.384-16.645 37.384-37.299V320.549c-.085-109.8-89.321-198.946-199.121-198.946zm0 0",fill:"currentColor"})]),LoadingIcon:P},props:{rootId:{type:String,default:""},replyId:{type:String,default:""},replyUser:{type:String,default:""}},emits:["submit","cancel-reply"],setup(e,{emit:n}){const o=u("config"),r=le("WALINE_COMMENT_BOX_EDITOR",""),i=le("WALINE_USER_META",{nick:"",mail:"",link:""}),a=He(),c=t({}),p=t(null),v=t(null),g=t(null),f=t(null),w=t({tabs:[],map:{}}),h=t(0),y=t(!1),b=t(!1),k=t(""),C=t(0),$=t(0),I=t(!1),j=t(""),S=t(!1),x=s((()=>o.value.locale)),L=s((()=>{var e;return Boolean(null===(e=a.value)||void 0===e?void 0:e.token)})),E=s((()=>!1!==o.value.imageUploader)),R=e=>{const t=p.value,n=t.selectionStart,o=t.selectionEnd||0,l=t.scrollTop;r.value=t.value.substring(0,n)+e+t.value.substring(o,t.value.length),t.focus(),t.selectionStart=n+e.length,t.selectionEnd=n+e.length,t.scrollTop=l},z=e=>{const t=`![${o.value.locale.uploading} ${e.name}]()`;return R(t),Promise.resolve().then((()=>o.value.imageUploader(e))).then((n=>{r.value=r.value.replace(t,`\r\n![${e.name}](${n})`)}))},O=()=>{var t,l,s,u,m;const{serverURL:d,lang:v,login:g,wordLimit:f,requiredMeta:h}=o.value,y={comment:j.value,nick:i.value.nick,mail:i.value.mail,link:i.value.link,ua:navigator.userAgent,url:o.value.path};if(null===(t=a.value)||void 0===t?void 0:t.token)y.nick=a.value.display_name,y.mail=a.value.email,y.link=a.value.url;else{if("force"===g)return;if((h.indexOf("nick")>-1||y.nick)&&!y.nick)return null===(l=c.value.nick)||void 0===l||l.focus(),alert(x.value.nickError);if(h.indexOf("mail")>-1&&!y.mail)return null===(s=c.value.mail)||void 0===s||s.focus(),alert(x.value.mailError);if(!y.comment)return void(null===(u=p.value)||void 0===u||u.focus());y.nick||(y.nick=x.value.anonymous)}if(!I.value)return alert(x.value.wordHint.replace("$0",f[0].toString()).replace("$1",f[1].toString()).replace("$2",C.value.toString()));y.comment=De(y.comment,w.value.map),e.replyId&&e.rootId&&(y.pid=e.replyId,y.rid=e.rootId,y.at=e.replyUser),S.value=!0,(({serverURL:e,lang:t,token:n,comment:o})=>{const l={"Content-Type":"application/json"};return n&&(l.Authorization=`Bearer ${n}`),fetch(`${e}/comment?lang=${t}`,{method:"POST",headers:l,body:JSON.stringify(o)}).then((e=>e.json()))})({serverURL:d,lang:v,token:null===(m=a.value)||void 0===m?void 0:m.token,comment:y}).then((t=>{if(S.value=!1,t.errmsg)return alert(t.errmsg);n("submit",t.data),r.value="",k.value="",e.replyId&&n("cancel-reply")})).catch((e=>{S.value=!1,alert(e.message)}))},A=e=>{g.value.contains(e.target)||f.value.contains(e.target)||(y.value=!1)};return l([o,C],(([e,t])=>{const{wordLimit:n}=e;n?t<n[0]&&0!==n[0]?($.value=n[0],I.value=!1):t>n[1]?($.value=n[1],I.value=!1):($.value=n[1],I.value=!0):($.value=0,I.value=!0)}),{immediate:!0}),m((()=>{document.body.addEventListener("click",A),l((()=>r.value),(e=>{const{highlighter:t,texRenderer:n}=o.value;j.value=e,k.value=We(e,{emojiMap:w.value.map,highlighter:t,texRenderer:n}),C.value=(e=>(e=>e.match(/[\w\d\s\u00C0-\u024F]+/giu)||[])(e).reduce(((e,t)=>e+(""===t.trim()?0:t.trim().split(/\s+/u).length)),0)+(e=>e.match(/[\u4E00-\u9FA5]/gu)||[])(e).length)(e),e?M(p.value):M.destroy(p.value)}),{immediate:!0}),l((()=>o.value.emoji),(e=>{return(t=e,Promise.all(t.map((e=>"string"==typeof e?Ae(xe(e)):Promise.resolve(e)))).then((e=>{const t={tabs:[],map:{}};return e.forEach((e=>{const{name:n,folder:o,icon:l,prefix:r,type:i,items:a}=e;t.tabs.push({name:n,icon:Pe(l,o,r,i),items:a.map((e=>{const n=`${r||""}${e}`;return t.map[n]=Pe(e,o,r,i),n}))})})),t}))).then((e=>{w.value=e}));var t}),{immediate:!0})})),d((()=>{document.body.removeEventListener("click",A)})),{config:o,locale:x,insert:R,onChange:()=>{const e=v.value;e.files&&E.value&&z(e.files[0]).then((()=>{e.value=""}))},onDrop:e=>{var t;if(null===(t=e.dataTransfer)||void 0===t?void 0:t.items){const t=Te(e.dataTransfer.items);t&&E.value&&(z(t),e.preventDefault())}},onKeyDown:e=>{const t=e.key;(e.ctrlKey||e.metaKey)&&"Enter"===t&&O()},onPaste:e=>{if(e.clipboardData){const t=Te(e.clipboardData.items);t&&E.value&&z(t)}},onLogin:e=>{e.preventDefault();const{lang:t,serverURL:n}=o.value,l=(window.innerWidth-450)/2,r=(window.innerHeight-450)/2,i=window.open(`${n}/ui/login?lng=${encodeURIComponent(t)}`,"_blank",`width=450,height=450,left=${l},top=${r},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`);null==i||i.postMessage({type:"TOKEN",data:null},"*");const s=({data:e})=>{e&&"userInfo"===e.type&&e.data.token&&(null==i||i.close(),a.value=e.data,(e.data.remember?localStorage:sessionStorage).setItem("WALINE_USER",JSON.stringify(e.data)),window.removeEventListener("message",s))};window.addEventListener("message",s)},onLogout:()=>{a.value={},localStorage.setItem("WALINE_USER","null"),sessionStorage.setItem("WALINE_USER","null")},onProfile:e=>{e.preventDefault();const{lang:t,serverURL:n}=o.value,l=(window.innerWidth-800)/2,r=(window.innerHeight-800)/2,i=window.open(`${n}/ui/profile?lng=${encodeURIComponent(t)}`,"_blank",`width=800,height=800,left=${l},top=${r},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`);null==i||i.postMessage({type:"TOKEN",data:a.value.token},"*");const s=({data:e})=>{e&&"profile"===e.type&&(a.value={...a.value,...e},[localStorage,sessionStorage].filter((e=>e.getItem("WALINE_USER"))).forEach((e=>e.setItem("WALINE_USER",JSON.stringify(a)))),window.removeEventListener("message",s))};window.addEventListener("message",s)},submitComment:O,isLogin:L,userInfo:a,isSubmitting:S,wordNumber:C,wordLimit:$,isWordNumberLegal:I,editor:r,userMeta:i,emoji:w,emojiTabIndex:h,showEmoji:y,canUploadImage:E,previewText:k,showPreview:b,inputRefs:c,editorRef:p,emojiButtonRef:g,emojiPopupRef:f,imageUploadRef:v}}});const Je={class:"wl-comment"},Ke={key:0,class:"wl-login-info"},Ye={class:"wl-avatar"},Ge=["title"],Xe=["src"],Qe=["textContent"],Ze={class:"wl-panel"},et=["for","textContent"],tt=["id","name","type","onUpdate:modelValue"],nt=["placeholder"],ot={class:"wl-preview"},lt=f("hr",null,null,-1),rt=["innerHTML"],it={class:"wl-footer"},at={class:"wl-actions"},st={href:"https://guides.github.com/features/mastering-markdown/",title:"Markdown Guide","aria-label":"Markdown is supported",class:"wl-action",target:"_blank",rel:"noreferrer"},ct=["title"],ut=["title"],mt=["title"],dt={class:"wl-info"},pt={class:"wl-text-number"},vt={key:0},gt=x("  /  "),ft=["textContent"],wt=["textContent"],ht=["disabled"],yt={key:0,class:"wl-tab-wrapper"},bt=["title","onClick"],kt=["src","alt"],Ct={key:0,class:"wl-tabs"},$t=["onClick"],It=["src","alt","title"],jt=["title"];Ve.render=function(e,t,n,o,l,r){const i=p("CloseIcon"),a=p("MarkdownIcon"),s=p("EmojiIcon"),c=p("ImageIcon"),u=p("PreviewIcon"),m=p("LoadingIcon");return v(),g("div",Je,["disable"!==e.config.login&&e.isLogin?(v(),g("div",Ke,[f("div",Ye,[f("button",{class:"wl-logout-btn",title:e.locale.logout,onClick:t[0]||(t[0]=(...t)=>e.onLogout&&e.onLogout(...t))},[w(i,{size:14})],8,Ge),f("img",{src:e.userInfo.avatar,alt:"avatar"},null,8,Xe)]),f("a",{href:"#",class:"wl-login-nick","aria-label":"Profile",onClick:t[1]||(t[1]=(...t)=>e.onProfile&&e.onProfile(...t)),textContent:h(e.userInfo.display_name)},null,8,Qe)])):y("v-if",!0),f("div",Ze,["force"!==e.config.login&&e.config.meta.length&&!e.isLogin?(v(),g("div",{key:0,class:b(["wl-header",`item${e.config.meta.length}`])},[(v(!0),g(k,null,C(e.config.meta,(t=>(v(),g("div",{class:"wl-header-item",key:t},[f("label",{for:t,textContent:h(e.locale[t]+(e.config.requiredMeta.includes(t)||!e.config.requiredMeta.length?"":`(${e.locale.optional})`))},null,8,et),$(f("input",{ref_for:!0,ref:n=>{n&&(e.inputRefs[t]=n)},id:`wl-${t}`,class:b(["wl-input",`wl-${t}`]),name:t,type:"mail"===t?"email":"text","onUpdate:modelValue":n=>e.userMeta[t]=n},null,10,tt),[[I,e.userMeta[t]]])])))),128))],2)):y("v-if",!0),$(f("textarea",{class:"wl-editor",ref:"editorRef",id:"wl-edit",placeholder:e.replyUser?`@${e.replyUser}`:e.locale.placeholder,"onUpdate:modelValue":t[2]||(t[2]=t=>e.editor=t),onKeydown:t[3]||(t[3]=(...t)=>e.onKeyDown&&e.onKeyDown(...t)),onDrop:t[4]||(t[4]=(...t)=>e.onDrop&&e.onDrop(...t)),onPaste:t[5]||(t[5]=(...t)=>e.onPaste&&e.onPaste(...t))},null,40,nt),[[j,e.editor]]),$(f("div",ot,[lt,f("h4",null,h(e.locale.preview)+":",1),f("div",{class:"wl-content",innerHTML:e.previewText},null,8,rt)],512),[[S,e.showPreview]]),f("div",it,[f("div",at,[f("a",st,[w(a)]),f("button",{ref:"emojiButtonRef",class:b(["wl-action",{actived:e.showEmoji}]),title:e.locale.emoji,onClick:t[6]||(t[6]=t=>e.showEmoji=!e.showEmoji)},[w(s)],10,ct),f("input",{ref:"imageUploadRef",class:"upload",id:"wl-image-upload",type:"file",accept:".png,.jpg,.jpeg,.webp,.bmp,.gif",onChange:t[7]||(t[7]=(...t)=>e.onChange&&e.onChange(...t))},null,544),e.canUploadImage?(v(),g("label",{key:0,for:"wl-image-upload",class:"wl-action",title:e.locale.uploadImage},[w(c)],8,ut)):y("v-if",!0),f("button",{class:b(["wl-action",{actived:e.showPreview}]),title:e.locale.preview,onClick:t[8]||(t[8]=t=>e.showPreview=!e.showPreview)},[w(u)],10,mt)]),f("div",dt,[f("div",pt,[x(h(e.wordNumber)+" ",1),e.config.wordLimit?(v(),g("span",vt,[gt,f("span",{class:b({illegal:!e.isWordNumberLegal}),textContent:h(e.wordLimit)},null,10,ft)])):y("v-if",!0),x("  "+h(e.locale.word),1)]),"disable"===e.config.login||e.isLogin?y("v-if",!0):(v(),g("button",{key:0,class:"wl-btn",onClick:t[9]||(t[9]=(...t)=>e.onLogin&&e.onLogin(...t)),textContent:h(e.locale.login)},null,8,wt)),"force"!==e.config.login||e.isLogin?(v(),g("button",{key:1,class:"wl-btn primary",title:"Cmd|Ctrl + Enter",disabled:e.isSubmitting,onClick:t[10]||(t[10]=(...t)=>e.submitComment&&e.submitComment(...t))},[e.isSubmitting?(v(),L(m,{key:0,size:16})):(v(),g(k,{key:1},[x(h(e.locale.submit),1)],2112))],8,ht)):y("v-if",!0)]),f("div",{ref:"emojiPopupRef",class:b(["wl-emoji-popup",{display:e.showEmoji}])},[(v(!0),g(k,null,C(e.emoji.tabs,((t,n)=>(v(),g(k,{key:t.name},[n===e.emojiTabIndex?(v(),g("div",yt,[(v(!0),g(k,null,C(t.items,(t=>(v(),g("button",{key:t,title:t,onClick:n=>e.insert(`:${t}:`)},[e.showEmoji?(v(),g("img",{key:0,class:"wl-emoji",src:e.emoji.map[t],alt:t,loading:"lazy",referrerPolicy:"no-referrer"},null,8,kt)):y("v-if",!0)],8,bt)))),128))])):y("v-if",!0)],64)))),128)),e.emoji.tabs.length>1?(v(),g("div",Ct,[(v(!0),g(k,null,C(e.emoji.tabs,((t,n)=>(v(),g("button",{key:t.name,class:b(["wl-tab",{active:e.emojiTabIndex===n}]),onClick:t=>e.emojiTabIndex=n},[f("img",{class:"wl-emoji",src:t.icon,alt:t.name,title:t.name,loading:"lazy",referrerPolicy:"no-referrer"},null,8,It)],10,$t)))),128))])):y("v-if",!0)],2)])]),e.replyId?(v(),g("button",{key:1,class:"wl-close",title:e.locale.cancelReply,onClick:t[11]||(t[11]=t=>e.$emit("cancel-reply"))},[w(i,{size:24})],8,jt)):y("v-if",!0)])},Ve.__file="src/components/CommentBox.vue";var St=c({props:{comment:{type:Object,required:!0},rootId:{type:String,required:!0},reply:{type:Object}},components:{CommentBox:Ve,ReplyIcon:()=>e("svg",{viewBox:"0 0 1024 1024",width:"18",height:"18"},e("path",{d:"M1019.2 720C1001.6 625.6 968 566.4 904 497.6c-89.6-89.6-214.4-150.4-347.2-176v-120c0-25.6-8-51.2-25.6-64-33.6-30.4-81.6-30.4-112-4.8L33.6 441.6C12.8 459.2 0 484.8 0 510.4c0 25.6 12.8 51.2 30.4 68.8l385.6 312c17.6 12.8 33.6 17.6 51.2 17.6 12.8 0 25.6-4.8 38.4-8C536 888 552 857.6 552 824v-99.2c124.8 20.8 248 86.4 339.2 140.8 25.6 17.6 59.2 17.6 89.6 0 25.6-17.6 43.2-46.4 43.2-76.8 0-33.6 0-56-4.8-68.8zm-500.8-89.6-46.4-4.8v193.6L86.4 510.4 472 201.6V400l38.4 4.8c128 12.8 248 68.8 334.4 153.6 51.2 56 76.8 102.4 94.4 179.2 0 4.8 4.8 20.8 4.8 51.2C835.2 720 672 640 518.4 630.4z",fill:"currentColor"})),VerifiedIcon:()=>e("svg",{class:"verified-icon",viewBox:"0 0 1024 1024",width:"14",height:"14"},e("path",{d:"m894.4 461.56-54.4-63.2c-10.4-12-18.8-34.4-18.8-50.4v-68c0-42.4-34.8-77.2-77.2-77.2h-68c-15.6 0-38.4-8.4-50.4-18.8l-63.2-54.4c-27.6-23.6-72.8-23.6-100.8 0l-62.8 54.8c-12 10-34.8 18.4-50.4 18.4h-69.2c-42.4 0-77.2 34.8-77.2 77.2v68.4c0 15.6-8.4 38-18.4 50l-54 63.6c-23.2 27.6-23.2 72.4 0 100l54 63.6c10 12 18.4 34.4 18.4 50v68.4c0 42.4 34.8 77.2 77.2 77.2h69.2c15.6 0 38.4 8.4 50.4 18.8l63.2 54.4c27.6 23.6 72.8 23.6 100.8 0l63.2-54.4c12-10.4 34.4-18.8 50.4-18.8h68c42.4 0 77.2-34.8 77.2-77.2v-68c0-15.6 8.4-38.4 18.8-50.4l54.4-63.2c23.2-27.6 23.2-73.2-.4-100.8zm-216-25.2-193.2 193.2a30 30 0 0 1-42.4 0l-96.8-96.8a30.16 30.16 0 0 1 0-42.4c11.6-11.6 30.8-11.6 42.4 0l75.6 75.6 172-172c11.6-11.6 30.8-11.6 42.4 0 11.6 11.6 11.6 30.8 0 42.4z",fill:"#27ae60"}))},emits:["submit","reply"],setup(e){const t=u("config"),n=s((()=>t.value.locale)),o=s((()=>{let{link:t}=e.comment;return t?Le(t)?t:`https://${t}`:""})),l=qe(e.comment.insertedAt,n.value),r=s((()=>{var t;return e.comment.objectId===(null===(t=e.reply)||void 0===t?void 0:t.objectId)}));return{config:t,locale:n,isReplyingCurrent:r,link:o,time:l}}});const xt=["id"],Lt={class:"wl-user","aria-hidden":"true"},Et=["src"],Rt={class:"wl-card"},zt={class:"wl-head"},Mt=["href"],Ot={key:1,class:"wl-nick"},At=["textContent"],Pt=["textContent"],Ut=["textContent"],Nt=["title"],Tt={class:"wl-meta","aria-hidden":"true"},_t=["textContent"],Bt=["textContent"],Ft=["innerHTML"],Dt={key:0,class:"wl-reply-wrapper"},Wt={key:1,class:"wl-quote"};St.render=function(e,t,n,o,l,r){const i=p("VerifiedIcon"),a=p("ReplyIcon"),s=p("CommentBox"),c=p("CommentCard",!0);return v(),g("div",{class:"wl-item",id:e.comment.objectId},[f("div",Lt,[e.comment.avatar?(v(),g("img",{key:0,src:e.comment.avatar},null,8,Et)):y("v-if",!0),e.comment.type?(v(),L(i,{key:1})):y("v-if",!0)]),f("div",Rt,[f("div",zt,[e.link?(v(),g("a",{key:0,class:"wl-nick",href:e.link,target:"_blank",rel:"nofollow noreferrer"},h(e.comment.nick),9,Mt)):(v(),g("span",Ot,h(e.comment.nick),1)),"administrator"===e.comment.type?(v(),g("span",{key:2,class:"wl-badge",textContent:h(e.locale.admin)},null,8,At)):y("v-if",!0),e.comment.sticky?(v(),g("span",{key:3,class:"wl-badge",textContent:h(e.locale.sticky)},null,8,Pt)):y("v-if",!0),f("span",{class:"wl-time",textContent:h(e.time)},null,8,Ut),f("button",{class:b(["wl-reply",{active:e.isReplyingCurrent}]),title:e.isReplyingCurrent?e.locale.cancelReply:e.locale.reply,onClick:t[0]||(t[0]=t=>e.$emit("reply",e.isReplyingCurrent?null:e.comment))},[w(a)],10,Nt)]),f("div",Tt,[e.comment.browser?(v(),g("span",{key:0,textContent:h(e.comment.browser)},null,8,_t)):y("v-if",!0),e.comment.os?(v(),g("span",{key:1,textContent:h(e.comment.os)},null,8,Bt)):y("v-if",!0)]),f("div",{class:"wl-content",innerHTML:e.comment.comment},null,8,Ft),e.isReplyingCurrent?(v(),g("div",Dt,[w(s,{replyId:e.comment.objectId,replyUser:e.comment.nick,rootId:e.rootId,onSubmit:t[1]||(t[1]=t=>e.$emit("submit",t)),onCancelReply:t[2]||(t[2]=t=>e.$emit("reply",null))},null,8,["replyId","replyUser","rootId"])])):y("v-if",!0),e.comment.children?(v(),g("div",Wt,[(v(!0),g(k,null,C(e.comment.children,(n=>(v(),L(c,{key:n.objectId,comment:n,reply:e.reply,rootId:e.rootId,onReply:t[3]||(t[3]=t=>e.$emit("reply",t)),onSubmit:t[4]||(t[4]=t=>e.$emit("submit",t))},null,8,["comment","reply","rootId"])))),128))])):y("v-if",!0)])],8,xt)},St.__file="src/components/CommentCard.vue";var qt=c({name:"WalineRoot",components:{CommentBox:Ve,CommentCard:St,LoadingIcon:P},props:{serverURL:{type:String,required:!0},path:{type:String,required:!0},meta:{type:Array},requiredMeta:{type:Array},dark:{type:[String,Boolean]},lang:{type:String},locale:{type:Object},pageSize:{type:Number},wordLimit:{type:[Number,Array]},emoji:{type:Array},login:{type:String},highlighter:{type:Function},imageUploader:{type:[Function,Boolean]},texRenderer:{type:[Function,Boolean]}},setup(e){const n=s((()=>(({serverURL:e,path:t=location.pathname,lang:n="zh-CN",locale:o,emoji:l=["//unpkg.com/@waline/emojis@1.0.1/weibo/info.json"],meta:r=["nick","mail","link"],requiredMeta:i=[],dark:a=!1,pageSize:s=10,wordLimit:c,imageUploader:u,highlighter:m,texRenderer:d,copyright:p=!0,login:v="enable",...g})=>({serverURL:Ee(e),path:Se(t),locale:{...je[n]||je["zh-CN"],..."object"==typeof o?o:{}},wordLimit:Re(c),meta:ve(r),requiredMeta:ve(i),imageUploader:ze(u,ge),highlighter:ze(m,A),texRenderer:ze(d,fe),lang:n,dark:a,emoji:l,pageSize:s,login:v,copyright:p,...g}))(e))),o=He(),r=t("loading"),i=t(0),a=t(1),c=t(0),u=t([]),d=t(null),p=s((()=>{return"string"==typeof(e=n.value.dark)?"auto"===e?`@media(prefers-color-scheme:dark){body${Me}}`:`${e}${Me}`:!0===e?`:root${Me}`:"";var e}));let v,g;const f=e=>{var t;const{serverURL:l,path:s,pageSize:m}=n.value,d=new AbortController;r.value="loading",null==v||v(),Ue({serverURL:l,path:s,pageSize:m,page:e,signal:d.signal,token:null===(t=o.value)||void 0===t?void 0:t.token}).then((t=>{r.value="success",i.value=t.count,u.value.push(...t.data),a.value=e,c.value=t.totalPages})).catch((e=>{"AbortError"!==e.name&&(console.error(e.message),r.value="error")})),v=d.abort.bind(d)},w=()=>{i.value=0,u.value=[],f(1)};return E("config",n),l((()=>e.path),w),m((()=>{var e;w();const t=document.createElement("style");t.innerText=p.value,null===(e=document.querySelector("[data-waline]"))||void 0===e||e.appendChild(t),g=R((()=>{t.innerText=p.value}))})),z((()=>g())),{config:n,darkmodeStyle:p,i18n:s((()=>n.value.locale)),status:r,count:i,page:a,totalPages:c,data:u,reply:d,loadMore:()=>f(a.value+1),refresh:w,onReply:e=>{d.value=e},onSubmit:e=>{if(e.rid){const t=u.value.find((({objectId:t})=>t===e.rid));if(!t)return;Array.isArray(t.children)||(t.children=[]),t.children.push(e)}else u.value.unshift(e)},version:"2.0.6"}}});const Ht={"data-waline":""},Vt={class:"wl-count"},Jt=["textContent"],Kt={class:"wl-cards"},Yt={key:1,class:"wl-operation"},Gt=["textContent"],Xt={key:0,class:"wl-loading"},Qt=["textContent"],Zt={class:"wl-operation"},en=["textContent"],tn={key:3,class:"wl-power"},nn=x(" Powered by "),on=f("a",{href:"https://github.com/walinejs/waline",target:"_blank",rel:"noreferrer"}," Waline ",-1);qt.render=function(e,t,n,o,l,r){const i=p("CommentBox"),a=p("CommentCard"),s=p("LoadingIcon");return v(),g("div",Ht,[e.reply?y("v-if",!0):(v(),L(i,{key:0,onSubmit:e.onSubmit},null,8,["onSubmit"])),f("div",Vt,[e.count?(v(),g("span",{key:0,class:"wl-num",textContent:h(e.count)},null,8,Jt)):y("v-if",!0),x(" "+h(e.i18n.comment),1)]),f("div",Kt,[(v(!0),g(k,null,C(e.data,(t=>(v(),L(a,{key:t.objectId,"root-id":t.objectId,comment:t,reply:e.reply,onReply:e.onReply,onSubmit:e.onSubmit},null,8,["root-id","comment","reply","onReply","onSubmit"])))),128))]),"error"===e.status?(v(),g("div",Yt,[f("button",{type:"button",class:"wl-btn",onClick:t[0]||(t[0]=(...t)=>e.refresh&&e.refresh(...t)),textContent:h(e.i18n.refresh)},null,8,Gt)])):(v(),g(k,{key:2},["loading"===e.status?(v(),g("div",Xt,[w(s,{size:30})])):e.data.length?e.page<e.totalPages?(v(),g(k,{key:2},[y(" Load more button "),f("div",Zt,[f("button",{type:"button",class:"wl-btn",onClick:t[1]||(t[1]=(...t)=>e.loadMore&&e.loadMore(...t)),textContent:h(e.i18n.more)},null,8,en)])],2112)):y("v-if",!0):(v(),g("div",{key:1,class:"wl-empty",textContent:h(e.i18n.sofa)},null,8,Qt))],2112)),y(" Copyright Information "),e.config.copyright?(v(),g("div",tn,[nn,on,x(" v"+h(e.version),1)])):y("v-if",!0)])},qt.__file="src/components/Waline.vue";const ln="2.0.6";export{qt as Waline,ln as version};
//# sourceMappingURL=component.js.map
