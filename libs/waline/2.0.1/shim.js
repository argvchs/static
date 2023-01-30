"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("vue"),t=require("autosize"),o=require("marked"),n=require("hanabi");function l(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r=l(t),a=l(n);const i=["nick","mail","link"],c=e=>e.filter((e=>i.includes(e))),s=e=>new Promise(((t,o)=>{const n=new FileReader;n.readAsDataURL(e),n.onload=()=>{var e;return t((null===(e=n.result)||void 0===e?void 0:e.toString())||"")},n.onerror=o})),m=e=>!0===e?'<p class="vtex">Tex is not available in preview</p>':'<span class="vtex">Tex is not available in preview</span>',d=["nick","nickError","mail","mailError","link","optional","placeholder","sofa","submit","reply","cancelReply","comment","refresh","more","preview","emoji","uploadImage","seconds","minutes","hours","days","now","uploading","login","logout","admin","sticky","word","wordHint","anonymous"],u=e=>Object.fromEntries(e.map(((e,t)=>[d[t],e])));var p=u(["NickName","NickName cannot be less than 3 bytes.","E-Mail","Please confirm your email address.","Website","Optional","Comment here...","No comment yet.","Submit","Reply","Cancel reply","Comments","Refresh","Load More...","Preview","Emoji","Upload Image","seconds ago","minutes ago","hours ago","days ago","just now","Uploading","Login","logout","Admin","Sticky","Words","Please input comments between $0 and $1 words!\n Current word number: $2","Anonymous"]),g=u(["ニックネーム","3バイト以上のニックネームをご入力ください.","メールアドレス","メールアドレスをご確認ください.","サイト","オプション","ここにコメント","コメントしましょう~","提出する","返信する","キャンセル","コメント","更新","さらに読み込む","プレビュー","絵文字","画像をアップロード","秒前","分前","時間前","日前","たっだ今","アップロード","ログインする","ログアウト","管理者","トップに置く","ワード","コメントは $0 から $1 ワードの間でなければなりません!\n 現在の単語番号: $2","匿名"]),v=u(["昵称","昵称不能少于3个字符","邮箱","请填写正确的邮件地址","网址","可选","欢迎评论","来发评论吧~","提交","回复","取消回复","评论","刷新","加载更多...","预览","表情","上传图片","秒前","分钟前","小时前","天前","刚刚","正在上传","登录","退出","博主","置顶","字","评论字数应在 $0 到 $1 字之间！\n当前字数：$2","匿名"]),h=u(["暱稱","郵箱","網址","可選","暱稱不能少於3個字元","請填寫正確的郵件地址","歡迎評論","來發評論吧~","提交","回覆","取消回覆","評論","刷新","載入更多...","預覽","表情","上傳圖片","秒前","分鐘前","小時前","天前","剛剛","正在上傳","登錄","退出","博主","置頂","字","評論字數應在 $0 到 $1 字之間！\n當前字數：$2","匿名"]),f=u(["Apelido","Apelido não pode ser menor que 3 bytes.","E-Mail","Por favor, confirme seu endereço de e-mail.","Website","Opcional","Comente aqui...","Nenhum comentário, ainda.","Enviar","Responder","Cancelar resposta","Comentários","Refrescar","Carregar Mais...","Visualizar","Emoji","Enviar Imagem","segundos atrás","minutos atrás","horas atrás","dias atrás","agora mesmo","Enviando","Entrar","Sair","Admin","Sticky","Palavras","Favor enviar comentário com $0 a $1 palavras!\n Número de palavras atuais: $2","Anônimo"]),y=u(["Псевдоним","Никнейм не может быть меньше 3 байт.","Эл. адрес","Пожалуйста, подтвердите адрес вашей электронной почты.","Веб-сайт","Необязательный","Комментарий здесь...","Пока нет комментариев.","Отправить","Отвечать","Отменить ответ","Комментарии","Обновить","Загрузи больше...","Превью","эмодзи","Загрузить изображение","секунд назад","несколько минут назад","несколько часов назад","дней назад","прямо сейчас","Загрузка","Авторизоваться","Выход из системы","Админ","Липкий","Слова","Пожалуйста, введите комментарии от $0 до $1 слов!\nНомер текущего слова: $2","Анонимный"]);const k={zh:v,"zh-cn":v,"zh-CN":v,"zh-tw":h,"zh-TW":h,en:p,"en-US":p,"en-us":p,jp:g,"jp-jp":g,"jp-JP":g,"pt-br":f,"pt-BR":f,ru:y,"ru-ru":y,"ru-RU":y},w=e=>{let t={};const o=localStorage.getItem(e);if(o)try{t=JSON.parse(o)}catch(e){}return{get:e=>t[e]||null,set(o,n){try{t[o]=JSON.parse(JSON.stringify(n)),localStorage.setItem(e,JSON.stringify(t))}catch(e){}},update(o){t=JSON.parse(JSON.stringify(o)),localStorage.setItem(e,JSON.stringify(t))}}};let C,b;const E=()=>(b||(C=w("WALINE_USER_CACHE"),b=e.reactive({nick:C.get("nick")||"",mail:C.get("mail")||"",link:C.get("link")||"",editor:""})),{inputs:b,store:C}),N=e=>{try{e=decodeURI(e)}catch(e){}return e},B=(e="")=>e.replace(/\/$/u,""),$=e=>/^(https?:)?\/\//.test(e);let S;const L=e=>{S||(S=w("WALINE_EMOJI"));const t=Boolean(/@[0-9]+\.[0-9]+\.[0-9]+/.test(e));if(t){const t=S.get(e);if(t)return Promise.resolve(t)}return fetch(`${e}/info.json`).then((e=>e.json())).then((o=>{const n={folder:e,...o};return t&&S.set(e,n),n}))},x=(e,t="",o="",n="")=>`${t?`${t}/`:""}${o}${e}${n?`.${n}`:""}`,I=e=>{const t=B(e);return $(t)?t:`https://${t}`},V=(e,t)=>"function"==typeof e?e:!1!==e&&t,R="{--waline-white:#000;--waline-light-grey:#666;--waline-dark-grey:#999;--waline-color:#888;--waline-bgcolor:#1e1e1e;--waline-bgcolor-light:#272727;--waline-bgcolor-hover: #444;--waline-border-color:#333;--waline-disable-bgcolor:#444;--waline-disable-color:#272727;--waline-bq-color:#272727;--waline-info-bgcolor:#272727;--waline-info-color:#666}",j=e=>e.type.includes("image"),U=e=>{const t=Array.from(e).find(j);return t?t.getAsFile():null},z=e=>{"AbortError"!==e.name&&console.error(e.message)},A=(e,t="")=>{if("object"==typeof e&&e.errno)throw new TypeError(`Fetch ${t} failed with ${e.errno}: ${e.errmsg}`);return e},M=({serverURL:e,paths:t,signal:o})=>fetch(`${e}/article?path=${encodeURIComponent(t.join(","))}`,{signal:o}).then((e=>e.json())).then((e=>A(e,"visit count"))).then((e=>Array.isArray(e)?e:[e])),T=({serverURL:e,path:t})=>fetch(`${e}/article`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:t})}).then((e=>e.json())).then((e=>A(e,"visit count"))),D=e=>e instanceof HTMLElement?e:"string"==typeof e?document.querySelector(e):null,P=/\$.*?\$/,O=/^\$(.*?)\$/,_=/^(?:\s{0,3})\$\$((?:[^\n]|\n[^\n])+?)\n{0,1}\$\$/,q=(e="",t={})=>e.replace(/:(.+?):/g,((e,o)=>t[o]?`<img class="vemoji" src="${t[o]}" alt="${o}">`:e)),H=(e,{emojiMap:t,highlighter:n,texRenderer:l})=>{if(o.marked.setOptions({highlight:n||void 0,breaks:!0,smartLists:!0,smartypants:!0}),l){const e=(e=>[{name:"blockMath",level:"block",tokenizer(t){const o=_.exec(t);if(null!==o)return{type:"html",raw:o[0],text:e(!0,o[1])}}},{name:"inlineMath",level:"inline",start(e){const t=e.search(P);return-1!==t?t:e.length},tokenizer(t){const o=O.exec(t);if(null!==o)return{type:"html",raw:o[0],text:e(!1,o[1])}}}])(l);o.marked.use({extensions:e})}return o.marked.parse(q(e,t))},W=e=>e.dataset.path||e.getAttribute("id"),F=(e,t)=>{let o=e.toString();for(;o.length<t;)o="0"+o;return o},J=(e,t)=>{if(e)try{"string"==typeof e&&(e=new Date(-1!==e.indexOf(" ")?e.replace(/-/g,"/"):e));const o=e.getTime(),n=(new Date).getTime()-o,l=Math.floor(n/864e5);if(0===l){const e=n%864e5,o=Math.floor(e/36e5);if(0===o){const o=e%36e5,n=Math.floor(o/6e4);if(0===n){const e=o%6e4;return`${Math.round(e/1e3)} ${t.seconds}`}return`${n} ${t.minutes}`}return`${o} ${t.hours}`}return l<0?t.now:l<8?`${l} ${t.days}`:(e=>{const t=F(e.getDate(),2),o=F(e.getMonth()+1,2);return`${F(e.getFullYear(),2)}-${o}-${t}`})(e)}catch(e){console.log(e)}return""},K=()=>{try{const e=localStorage.getItem("WALINE_USER"),t=sessionStorage.getItem("WALINE_USER");return e?JSON.parse(e):t?JSON.parse(t):null}catch(e){return null}},Y=e.ref({}),G=()=>{if(!Y.value.token){const e=K();e&&(Y.value=e)}return{userInfo:e.readonly(Y),setUserInfo:e=>{Y.value=e}}},Q=({serverURL:e,path:t=window.location.pathname,selector:o=".waline-comment-count"})=>{var n;const l=new AbortController,r=document.querySelectorAll(o),{userInfo:a}=G();return r.length&&(({serverURL:e,paths:t,signal:o,token:n})=>{const l={};return n&&(l.Authorization=`Bearer ${n}`),fetch(`${e}/comment?type=count&url=${encodeURIComponent(t.join(","))}`,{signal:o,headers:l}).then((e=>e.json())).then((e=>A(e,"comment count"))).then((e=>Array.isArray(e)?e:[e]))})({serverURL:e,paths:Array.from(r).map((e=>N(e.dataset.path||e.getAttribute("id")||t))),signal:l.signal,token:null===(n=a.value)||void 0===n?void 0:n.token}).then((e=>{r.forEach(((t,o)=>{t.innerText=e[o].toString()}))})).catch(z),l.abort.bind(l)},X=({size:t})=>e.h("svg",{width:t,height:t,viewBox:"0 0 100 100",preserveAspectRatio:"xMidYMid"},e.h("circle",{cx:50,cy:50,fill:"none",stroke:"currentColor",strokeWidth:"4",r:"40","stroke-dasharray":"85 30"},e.h("animateTransform",{attributeName:"transform",type:"rotate",repeatCount:"indefinite",dur:"1s",values:"0 50 50;360 50 50",keyTimes:"0;1"})));var Z=e.defineComponent({name:"CommentBox",components:{CloseIcon:({size:t})=>e.h("svg",{class:"wl-close-icon",viewBox:"0 0 1024 1024",width:t,height:t},[e.h("path",{d:"M697.173 85.333h-369.92c-144.64 0-241.92 101.547-241.92 252.587v348.587c0 150.613 97.28 252.16 241.92 252.16h369.92c144.64 0 241.494-101.547 241.494-252.16V337.92c0-151.04-96.854-252.587-241.494-252.587z",fill:"currentColor"}),e.h("path",{d:"m640.683 587.52-75.947-75.861 75.904-75.862a37.29 37.29 0 0 0 0-52.778 37.205 37.205 0 0 0-52.779 0l-75.946 75.818-75.862-75.946a37.419 37.419 0 0 0-52.821 0 37.419 37.419 0 0 0 0 52.821l75.947 75.947-75.776 75.733a37.29 37.29 0 1 0 52.778 52.821l75.776-75.776 75.947 75.947a37.376 37.376 0 0 0 52.779-52.821z",fill:"#888"})]),EmojiIcon:()=>e.h("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},e.h("path",{d:"M563.2 463.3 677 540c1.7 1.2 3.7 1.8 5.8 1.8.7 0 1.4-.1 2-.2 2.7-.5 5.1-2.1 6.6-4.4l25.3-37.8c1.5-2.3 2.1-5.1 1.6-7.8s-2.1-5.1-4.4-6.6l-73.6-49.1 73.6-49.1c2.3-1.5 3.9-3.9 4.4-6.6.5-2.7 0-5.5-1.6-7.8l-25.3-37.8a10.1 10.1 0 0 0-6.6-4.4c-.7-.1-1.3-.2-2-.2-2.1 0-4.1.6-5.8 1.8l-113.8 76.6c-9.2 6.2-14.7 16.4-14.7 27.5.1 11 5.5 21.3 14.7 27.4zM387 348.8h-45.5c-5.7 0-10.4 4.7-10.4 10.4v153.3c0 5.7 4.7 10.4 10.4 10.4H387c5.7 0 10.4-4.7 10.4-10.4V359.2c0-5.7-4.7-10.4-10.4-10.4zm333.8 241.3-41-20a10.3 10.3 0 0 0-8.1-.5c-2.6.9-4.8 2.9-5.9 5.4-30.1 64.9-93.1 109.1-164.4 115.2-5.7.5-9.9 5.5-9.5 11.2l3.9 45.5c.5 5.3 5 9.5 10.3 9.5h.9c94.8-8 178.5-66.5 218.6-152.7 2.4-5 .3-11.2-4.8-13.6zm186-186.1c-11.9-42-30.5-81.4-55.2-117.1-24.1-34.9-53.5-65.6-87.5-91.2-33.9-25.6-71.5-45.5-111.6-59.2-41.2-14-84.1-21.1-127.8-21.1h-1.2c-75.4 0-148.8 21.4-212.5 61.7-63.7 40.3-114.3 97.6-146.5 165.8-32.2 68.1-44.3 143.6-35.1 218.4 9.3 74.8 39.4 145 87.3 203.3.1.2.3.3.4.5l36.2 38.4c1.1 1.2 2.5 2.1 3.9 2.6 73.3 66.7 168.2 103.5 267.5 103.5 73.3 0 145.2-20.3 207.7-58.7 37.3-22.9 70.3-51.5 98.1-85 27.1-32.7 48.7-69.5 64.2-109.1 15.5-39.7 24.4-81.3 26.6-123.8 2.4-43.6-2.5-87-14.5-129zm-60.5 181.1c-8.3 37-22.8 72-43 104-19.7 31.1-44.3 58.6-73.1 81.7-28.8 23.1-61 41-95.7 53.4-35.6 12.7-72.9 19.1-110.9 19.1-82.6 0-161.7-30.6-222.8-86.2l-34.1-35.8c-23.9-29.3-42.4-62.2-55.1-97.7-12.4-34.7-18.8-71-19.2-107.9-.4-36.9 5.4-73.3 17.1-108.2 12-35.8 30-69.2 53.4-99.1 31.7-40.4 71.1-72 117.2-94.1 44.5-21.3 94-32.6 143.4-32.6 49.3 0 97 10.8 141.8 32 34.3 16.3 65.3 38.1 92 64.8 26.1 26 47.5 56 63.6 89.2 16.2 33.2 26.6 68.5 31 105.1 4.6 37.5 2.7 75.3-5.6 112.3z",fill:"currentColor"})),ImageIcon:()=>e.h("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},[e.h("path",{d:"M784 112H240c-88 0-160 72-160 160v480c0 88 72 160 160 160h544c88 0 160-72 160-160V272c0-88-72-160-160-160zm96 640c0 52.8-43.2 96-96 96H240c-52.8 0-96-43.2-96-96V272c0-52.8 43.2-96 96-96h544c52.8 0 96 43.2 96 96v480z",fill:"currentColor"}),e.h("path",{d:"M352 480c52.8 0 96-43.2 96-96s-43.2-96-96-96-96 43.2-96 96 43.2 96 96 96zm0-128c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zm462.4 379.2-3.2-3.2-177.6-177.6c-25.6-25.6-65.6-25.6-91.2 0l-80 80-36.8-36.8c-25.6-25.6-65.6-25.6-91.2 0L200 728c-4.8 6.4-8 14.4-8 24 0 17.6 14.4 32 32 32 9.6 0 16-3.2 22.4-9.6L380.8 640l134.4 134.4c6.4 6.4 14.4 9.6 24 9.6 17.6 0 32-14.4 32-32 0-9.6-4.8-17.6-9.6-24l-52.8-52.8 80-80L769.6 776c6.4 4.8 12.8 8 20.8 8 17.6 0 32-14.4 32-32 0-8-3.2-16-8-20.8z",fill:"currentColor"})]),MarkdownIcon:()=>e.h("svg",{width:"16",height:"16",ariaHidden:"true"},e.h("path",{d:"M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z",fill:"currentColor"})),PreviewIcon:()=>e.h("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},[e.h("path",{d:"M710.816 654.301c70.323-96.639 61.084-230.578-23.705-314.843-46.098-46.098-107.183-71.109-172.28-71.109-65.008 0-126.092 25.444-172.28 71.109-45.227 46.098-70.756 107.183-70.756 172.106 0 64.923 25.444 126.007 71.194 172.106 46.099 46.098 107.184 71.109 172.28 71.109 51.414 0 100.648-16.212 142.824-47.404l126.53 126.006c7.058 7.06 16.297 10.979 26.406 10.979 10.105 0 19.343-3.919 26.402-10.979 14.467-14.467 14.467-38.172 0-52.723L710.816 654.301zm-315.107-23.265c-65.88-65.88-65.88-172.54 0-238.42 32.069-32.07 74.245-49.149 119.471-49.149 45.227 0 87.407 17.603 119.472 49.149 65.88 65.879 65.88 172.539 0 238.42-63.612 63.178-175.242 63.178-238.943 0zm0 0",fill:"currentColor"}),e.h("path",{d:"M703.319 121.603H321.03c-109.8 0-199.469 89.146-199.469 199.38v382.034c0 109.796 89.236 199.38 199.469 199.38h207.397c20.653 0 37.384-16.645 37.384-37.299 0-20.649-16.731-37.296-37.384-37.296H321.03c-68.582 0-124.352-55.77-124.352-124.267V321.421c0-68.496 55.77-124.267 124.352-124.267h382.289c68.582 0 124.352 55.771 124.352 124.267V524.72c0 20.654 16.736 37.299 37.385 37.299 20.654 0 37.384-16.645 37.384-37.299V320.549c-.085-109.8-89.321-198.946-199.121-198.946zm0 0",fill:"currentColor"})]),LoadingIcon:X},props:{rootId:{type:String,default:""},replyId:{type:String,default:""},replyUser:{type:String,default:""}},emits:["submit","cancel-reply"],setup(t,{emit:o}){const n=e.inject("config"),{inputs:l,store:a}=E(),{userInfo:i,setUserInfo:c}=G(),s=e.ref({}),m=e.ref(null),d=e.ref(null),u=e.ref(null),p=e.ref(null),g=e.ref({tabs:[],map:{}}),v=e.ref(0),h=e.ref(!1),f=e.ref(!1),y=e.ref(""),k=e.ref(0),w=e.ref(0),C=e.ref(!1),b=e.ref(""),N=e.ref(!1),B=e.computed((()=>n.value.locale)),$=e.computed((()=>{var e;return Boolean(null===(e=i.value)||void 0===e?void 0:e.token)})),S=e.computed((()=>!1!==n.value.imageUploader)),L=e=>{const t=m.value,o=t.selectionStart,n=t.selectionEnd||0,r=t.scrollTop;l.editor=t.value.substring(0,o)+e+t.value.substring(n,t.value.length),t.focus(),t.selectionStart=o+e.length,t.selectionEnd=o+e.length,t.scrollTop=r},x=e=>{const t=`![${n.value.locale.uploading} ${e.name}]()`;return L(t),Promise.resolve().then((()=>n.value.imageUploader(e))).then((o=>{l.editor=l.editor.replace(t,`\r\n![${e.name}](${o})`)}))},I=()=>{var e,r,c,d,u;const{serverURL:p,lang:v,login:h,wordLimit:f,requiredMeta:w}=n.value,E={comment:b.value,nick:l.nick,mail:l.mail,link:l.link,ua:navigator.userAgent,url:n.value.path};if(null===(e=i.value)||void 0===e?void 0:e.token)E.nick=i.value.display_name,E.mail=i.value.email,E.link=i.value.url;else{if("force"===h)return;if((w.indexOf("nick")>-1||E.nick)&&!E.nick)return null===(r=s.value.nick)||void 0===r||r.focus(),alert(B.value.nickError);if(w.indexOf("mail")>-1&&!E.mail)return null===(c=s.value.mail)||void 0===c||c.focus(),alert(B.value.mailError);if(!E.comment)return void(null===(d=m.value)||void 0===d||d.focus());E.nick||(E.nick=B.value.anonymous)}if(!C.value)return alert(B.value.wordHint.replace("$0",f[0].toString()).replace("$1",f[1].toString()).replace("$2",k.value.toString()));E.comment=q(E.comment,g.value.map),t.replyId&&t.rootId&&(E.pid=t.replyId,E.rid=t.rootId,E.at=t.replyUser),N.value=!0,(({serverURL:e,lang:t,token:o,comment:n})=>{const l={"Content-Type":"application/json"};return o&&(l.Authorization=`Bearer ${o}`),fetch(`${e}/comment?lang=${t}`,{method:"POST",headers:l,body:JSON.stringify(n)}).then((e=>e.json()))})({serverURL:p,lang:v,token:null===(u=i.value)||void 0===u?void 0:u.token,comment:E}).then((e=>{if(N.value=!1,a.update({nick:E.nick,link:E.link,mail:E.mail}),e.errmsg)return alert(e.errmsg);o("submit",e.data),l.editor="",y.value="",t.replyId&&o("cancel-reply")})).catch((e=>{N.value=!1,alert(e.message)}))},V=e=>{u.value.contains(e.target)||p.value.contains(e.target)||(h.value=!1)};return e.watch((()=>l.editor),(e=>{const{highlighter:t,texRenderer:o}=n.value;b.value=e,y.value=H(e,{emojiMap:g.value.map,highlighter:t,texRenderer:o}),k.value=(e=>(e=>e.match(/[\w\d\s\u00C0-\u024F]+/giu)||[])(e).reduce(((e,t)=>e+(""===t.trim()?0:t.trim().split(/\s+/u).length)),0)+(e=>e.match(/[\u4E00-\u9FA5]/gu)||[])(e).length)(e),m.value&&(e?r.default(m.value):r.default.destroy(m.value))}),{immediate:!0}),e.watch((()=>n.value.emoji),(e=>e.then((e=>{g.value=e}))),{immediate:!0}),e.watch([n,k],(([e,t])=>{const{wordLimit:o}=e;o?t<o[0]&&0!==o[0]?(w.value=o[0],C.value=!1):t>o[1]?(w.value=o[1],C.value=!1):(w.value=o[1],C.value=!0):(w.value=0,C.value=!0)}),{immediate:!0}),e.onMounted((()=>{document.body.addEventListener("click",V)})),e.onUnmounted((()=>{document.body.removeEventListener("click",V)})),{config:n,locale:B,insert:L,onChange:()=>{const e=d.value;e.files&&S.value&&x(e.files[0]).then((()=>{e.value=""}))},onDrop:e=>{var t;if(null===(t=e.dataTransfer)||void 0===t?void 0:t.items){const t=U(e.dataTransfer.items);t&&S.value&&(x(t),e.preventDefault())}},onKeyDown:e=>{const t=e.key;(e.ctrlKey||e.metaKey)&&"Enter"===t&&I()},onPaste:e=>{if(e.clipboardData){const t=U(e.clipboardData.items);t&&S.value&&x(t)}},onLogin:e=>{e.preventDefault();const{lang:t,serverURL:o}=n.value,l=(window.innerWidth-450)/2,r=(window.innerHeight-450)/2,a=window.open(`${o}/ui/login?lng=${encodeURIComponent(t)}`,"_blank",`width=450,height=450,left=${l},top=${r},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`);null==a||a.postMessage({type:"TOKEN",data:null},"*");const i=({data:e})=>{e&&"userInfo"===e.type&&e.data.token&&(null==a||a.close(),c(e.data),(e.data.remember?localStorage:sessionStorage).setItem("WALINE_USER",JSON.stringify(e.data)),window.removeEventListener("message",i))};window.addEventListener("message",i)},onLogout:()=>{c({}),localStorage.setItem("WALINE_USER","null"),sessionStorage.setItem("WALINE_USER","null")},onProfile:e=>{e.preventDefault();const{lang:t,serverURL:o}=n.value,l=(window.innerWidth-800)/2,r=(window.innerHeight-800)/2,a=window.open(`${o}/ui/profile?lng=${encodeURIComponent(t)}`,"_blank",`width=800,height=800,left=${l},top=${r},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`);null==a||a.postMessage({type:"TOKEN",data:i.value.token},"*");const s=({data:e})=>{e&&"profile"===e.type&&(c(Object.assign({},i.value,e)),[localStorage,sessionStorage].filter((e=>e.getItem("WALINE_USER"))).forEach((e=>e.setItem("WALINE_USER",JSON.stringify(i)))),window.removeEventListener("message",s))};window.addEventListener("message",s)},submitComment:I,isLogin:$,userInfo:i,isSubmitting:N,wordNumber:k,wordLimit:w,isWordNumberLegal:C,inputs:l,emoji:g,emojiTabIndex:v,showEmoji:h,canUploadImage:S,previewText:y,showPreview:f,inputRefs:s,editorRef:m,emojiButtonRef:u,emojiPopupRef:p,imageUploadRef:d}}});const ee={class:"wl-comment"},te={key:0,class:"wl-login-info"},oe={class:"wl-avatar"},ne=["title"],le=["src"],re=["textContent"],ae={class:"wl-panel"},ie=["for","textContent"],ce=["id","name","type","onUpdate:modelValue"],se=["placeholder"],me=["innerHTML"],de={class:"wl-footer"},ue={class:"wl-actions"},pe={href:"https://guides.github.com/features/mastering-markdown/",title:"Markdown Guide","aria-label":"Markdown is supported",class:"wl-action",target:"_blank",rel:"noreferrer"},ge=["title"],ve=["title"],he=["title"],fe={class:"wl-info"},ye={class:"wl-text-number"},ke={key:0},we=e.createTextVNode("  /  "),Ce=["textContent"],be=["textContent"],Ee=["disabled"],Ne={key:0,class:"wl-tab-wrapper"},Be=["title","onClick"],$e=["src","alt"],Se={key:0,class:"wl-tabs"},Le=["onClick"],xe=["src","alt","title"],Ie=["title"];Z.render=function(t,o,n,l,r,a){const i=e.resolveComponent("CloseIcon"),c=e.resolveComponent("MarkdownIcon"),s=e.resolveComponent("EmojiIcon"),m=e.resolveComponent("ImageIcon"),d=e.resolveComponent("PreviewIcon"),u=e.resolveComponent("LoadingIcon");return e.openBlock(),e.createElementBlock("div",ee,["disable"!==t.config.login&&t.isLogin?(e.openBlock(),e.createElementBlock("div",te,[e.createElementVNode("div",oe,[e.createElementVNode("button",{class:"wl-logout-btn",title:t.locale.logout,onClick:o[0]||(o[0]=(...e)=>t.onLogout&&t.onLogout(...e))},[e.createVNode(i,{size:14})],8,ne),e.createElementVNode("img",{src:t.userInfo.avatar,alt:"avatar"},null,8,le)]),e.createElementVNode("a",{href:"#",class:"wl-login-nick","aria-label":"Profile",onClick:o[1]||(o[1]=(...e)=>t.onProfile&&t.onProfile(...e)),textContent:e.toDisplayString(t.userInfo.display_name)},null,8,re)])):e.createCommentVNode("v-if",!0),e.createElementVNode("div",ae,["force"!==t.config.login&&t.config.meta.length&&!t.isLogin?(e.openBlock(),e.createElementBlock("div",{key:0,class:e.normalizeClass(["wl-header",`item${t.config.meta.length}`])},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.config.meta,(o=>(e.openBlock(),e.createElementBlock("div",{class:"wl-header-item",key:o},[e.createElementVNode("label",{for:o,textContent:e.toDisplayString(t.locale[o]+(t.config.requiredMeta.includes(o)||!t.config.requiredMeta.length?"":`(${t.locale.optional})`))},null,8,ie),e.withDirectives(e.createElementVNode("input",{ref_for:!0,ref:e=>{e&&(t.inputRefs[o]=e)},id:`wl-${o}`,class:e.normalizeClass(["wl-input",`wl-${o}`]),name:o,type:"mail"===o?"email":"text","onUpdate:modelValue":e=>t.inputs[o]=e},null,10,ce),[[e.vModelDynamic,t.inputs[o]]])])))),128))],2)):e.createCommentVNode("v-if",!0),e.withDirectives(e.createElementVNode("textarea",{class:"wl-editor",ref:"editorRef",id:"wl-edit",placeholder:t.replyUser?`@${t.replyUser}`:t.locale.placeholder,"onUpdate:modelValue":o[2]||(o[2]=e=>t.inputs.editor=e),onKeydown:o[3]||(o[3]=(...e)=>t.onKeyDown&&t.onKeyDown(...e)),onDrop:o[4]||(o[4]=(...e)=>t.onDrop&&t.onDrop(...e)),onPaste:o[5]||(o[5]=(...e)=>t.onPaste&&t.onPaste(...e))},null,40,se),[[e.vModelText,t.inputs.editor]]),e.createElementVNode("div",{class:"wl-preview",style:e.normalizeStyle({display:t.showPreview?"block":"none"})},[e.createElementVNode("h4",null,e.toDisplayString(t.locale.preview)+":",1),e.createElementVNode("div",{class:"wl-content",innerHTML:t.previewText},null,8,me)],4),e.createElementVNode("div",de,[e.createElementVNode("div",ue,[e.createElementVNode("a",pe,[e.createVNode(c)]),e.createElementVNode("button",{ref:"emojiButtonRef",class:e.normalizeClass(["wl-action",{actived:t.showEmoji}]),title:t.locale.emoji,onClick:o[6]||(o[6]=e=>t.showEmoji=!t.showEmoji)},[e.createVNode(s)],10,ge),e.createElementVNode("input",{ref:"imageUploadRef",class:"upload",id:"wl-image-upload",type:"file",accept:".png,.jpg,.jpeg,.webp,.bmp,.gif",onChange:o[7]||(o[7]=(...e)=>t.onChange&&t.onChange(...e))},null,544),t.canUploadImage?(e.openBlock(),e.createElementBlock("label",{key:0,for:"wl-image-upload",class:"wl-action",title:t.locale.uploadImage},[e.createVNode(m)],8,ve)):e.createCommentVNode("v-if",!0),e.createElementVNode("button",{class:e.normalizeClass(["wl-action",{actived:t.showPreview}]),title:t.locale.preview,onClick:o[8]||(o[8]=e=>t.showPreview=!t.showPreview)},[e.createVNode(d)],10,he)]),e.createElementVNode("div",fe,[e.createElementVNode("div",ye,[e.createTextVNode(e.toDisplayString(t.wordNumber)+" ",1),t.config.wordLimit?(e.openBlock(),e.createElementBlock("span",ke,[we,e.createElementVNode("span",{class:e.normalizeClass({illegal:!t.isWordNumberLegal}),textContent:e.toDisplayString(t.wordLimit)},null,10,Ce)])):e.createCommentVNode("v-if",!0),e.createTextVNode("  "+e.toDisplayString(t.locale.word),1)]),"disable"===t.config.login||t.isLogin?e.createCommentVNode("v-if",!0):(e.openBlock(),e.createElementBlock("button",{key:0,class:"wl-btn",onClick:o[9]||(o[9]=(...e)=>t.onLogin&&t.onLogin(...e)),textContent:e.toDisplayString(t.locale.login)},null,8,be)),"force"!==t.config.login||t.isLogin?(e.openBlock(),e.createElementBlock("button",{key:1,class:"wl-btn primary",title:"Cmd|Ctrl + Enter",disabled:t.isSubmitting,onClick:o[10]||(o[10]=(...e)=>t.submitComment&&t.submitComment(...e))},[t.isSubmitting?(e.openBlock(),e.createBlock(u,{key:0,size:16})):(e.openBlock(),e.createElementBlock(e.Fragment,{key:1},[e.createTextVNode(e.toDisplayString(t.locale.submit),1)],2112))],8,Ee)):e.createCommentVNode("v-if",!0)]),e.createElementVNode("div",{ref:"emojiPopupRef",class:e.normalizeClass(["wl-emoji-popup",{display:t.showEmoji}])},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.emoji.tabs,((o,n)=>(e.openBlock(),e.createElementBlock(e.Fragment,{key:o.name},[n===t.emojiTabIndex?(e.openBlock(),e.createElementBlock("div",Ne,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(o.items,(o=>(e.openBlock(),e.createElementBlock("button",{key:o,title:o,onClick:e=>t.insert(`:${o}:`)},[t.showEmoji?(e.openBlock(),e.createElementBlock("img",{key:0,class:"wl-emoji",src:t.emoji.map[o],alt:o,loading:"lazy",referrerPolicy:"no-referrer"},null,8,$e)):e.createCommentVNode("v-if",!0)],8,Be)))),128))])):e.createCommentVNode("v-if",!0)],64)))),128)),t.emoji.tabs.length>1?(e.openBlock(),e.createElementBlock("div",Se,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.emoji.tabs,((o,n)=>(e.openBlock(),e.createElementBlock("button",{key:o.name,class:e.normalizeClass(["wl-tab",{active:t.emojiTabIndex===n}]),onClick:e=>t.emojiTabIndex=n},[e.createElementVNode("img",{class:"wl-emoji",src:o.icon,alt:o.name,title:o.name,loading:"lazy",referrerPolicy:"no-referrer"},null,8,xe)],10,Le)))),128))])):e.createCommentVNode("v-if",!0)],2)])]),t.replyId?(e.openBlock(),e.createElementBlock("button",{key:1,class:"wl-close",title:t.locale.cancelReply,onClick:o[11]||(o[11]=e=>t.$emit("cancel-reply"))},[e.createVNode(i,{size:24})],8,Ie)):e.createCommentVNode("v-if",!0)])},Z.__file="src/components/CommentBox.vue";var Ve=e.defineComponent({props:{comment:{type:Object,required:!0},rootId:{type:String,required:!0},reply:{type:Object}},components:{CommentBox:Z,ReplyIcon:()=>e.h("svg",{viewBox:"0 0 1024 1024",width:"18",height:"18"},e.h("path",{d:"M1019.2 720C1001.6 625.6 968 566.4 904 497.6c-89.6-89.6-214.4-150.4-347.2-176v-120c0-25.6-8-51.2-25.6-64-33.6-30.4-81.6-30.4-112-4.8L33.6 441.6C12.8 459.2 0 484.8 0 510.4c0 25.6 12.8 51.2 30.4 68.8l385.6 312c17.6 12.8 33.6 17.6 51.2 17.6 12.8 0 25.6-4.8 38.4-8C536 888 552 857.6 552 824v-99.2c124.8 20.8 248 86.4 339.2 140.8 25.6 17.6 59.2 17.6 89.6 0 25.6-17.6 43.2-46.4 43.2-76.8 0-33.6 0-56-4.8-68.8zm-500.8-89.6-46.4-4.8v193.6L86.4 510.4 472 201.6V400l38.4 4.8c128 12.8 248 68.8 334.4 153.6 51.2 56 76.8 102.4 94.4 179.2 0 4.8 4.8 20.8 4.8 51.2C835.2 720 672 640 518.4 630.4z",fill:"currentColor"})),VerifiedIcon:()=>e.h("svg",{class:"verified-icon",viewBox:"0 0 1024 1024",width:"14",height:"14"},e.h("path",{d:"m894.4 461.56-54.4-63.2c-10.4-12-18.8-34.4-18.8-50.4v-68c0-42.4-34.8-77.2-77.2-77.2h-68c-15.6 0-38.4-8.4-50.4-18.8l-63.2-54.4c-27.6-23.6-72.8-23.6-100.8 0l-62.8 54.8c-12 10-34.8 18.4-50.4 18.4h-69.2c-42.4 0-77.2 34.8-77.2 77.2v68.4c0 15.6-8.4 38-18.4 50l-54 63.6c-23.2 27.6-23.2 72.4 0 100l54 63.6c10 12 18.4 34.4 18.4 50v68.4c0 42.4 34.8 77.2 77.2 77.2h69.2c15.6 0 38.4 8.4 50.4 18.8l63.2 54.4c27.6 23.6 72.8 23.6 100.8 0l63.2-54.4c12-10.4 34.4-18.8 50.4-18.8h68c42.4 0 77.2-34.8 77.2-77.2v-68c0-15.6 8.4-38.4 18.8-50.4l54.4-63.2c23.2-27.6 23.2-73.2-.4-100.8zm-216-25.2-193.2 193.2a30 30 0 0 1-42.4 0l-96.8-96.8a30.16 30.16 0 0 1 0-42.4c11.6-11.6 30.8-11.6 42.4 0l75.6 75.6 172-172c11.6-11.6 30.8-11.6 42.4 0 11.6 11.6 11.6 30.8 0 42.4z",fill:"#27ae60"}))},emits:["submit","reply"],setup(t){const o=e.inject("config"),n=e.computed((()=>o.value.locale)),l=e.computed((()=>{let{link:e}=t.comment;return e?$(e)?e:`https://${e}`:""})),r=e.computed((()=>{var e;return t.comment.objectId===(null===(e=t.reply)||void 0===e?void 0:e.objectId)}));return{config:o,locale:n,isReplyingCurrent:r,link:l,timeAgo:J}}});const Re=["id"],je={class:"wl-user","aria-hidden":"true"},Ue=["src"],ze={class:"wl-card"},Ae={class:"wl-head"},Me=["href"],Te={key:1,class:"wl-nick"},De=["textContent"],Pe=["textContent"],Oe=["textContent"],_e=["title"],qe={class:"wl-meta","aria-hidden":"true"},He=["textContent"],We=["textContent"],Fe=["innerHTML"],Je={key:0,class:"wl-reply-wrapper"},Ke={key:1,class:"wl-quote"};Ve.render=function(t,o,n,l,r,a){const i=e.resolveComponent("VerifiedIcon"),c=e.resolveComponent("ReplyIcon"),s=e.resolveComponent("CommentBox"),m=e.resolveComponent("CommentCard",!0);return e.openBlock(),e.createElementBlock("div",{class:"wl-item",id:t.comment.objectId},[e.createElementVNode("div",je,[t.comment.avatar?(e.openBlock(),e.createElementBlock("img",{key:0,src:t.comment.avatar},null,8,Ue)):e.createCommentVNode("v-if",!0),t.comment.type?(e.openBlock(),e.createBlock(i,{key:1})):e.createCommentVNode("v-if",!0)]),e.createElementVNode("div",ze,[e.createElementVNode("div",Ae,[t.link?(e.openBlock(),e.createElementBlock("a",{key:0,class:"wl-nick",href:t.link,target:"_blank",rel:"nofollow noreferrer"},e.toDisplayString(t.comment.nick),9,Me)):(e.openBlock(),e.createElementBlock("span",Te,e.toDisplayString(t.comment.nick),1)),"administrator"===t.comment.type?(e.openBlock(),e.createElementBlock("span",{key:2,class:"wl-badge",textContent:e.toDisplayString(t.locale.admin)},null,8,De)):e.createCommentVNode("v-if",!0),t.comment.sticky?(e.openBlock(),e.createElementBlock("span",{key:3,class:"wl-badge",textContent:e.toDisplayString(t.locale.sticky)},null,8,Pe)):e.createCommentVNode("v-if",!0),e.createElementVNode("span",{class:"wl-time",textContent:e.toDisplayString(t.timeAgo(t.comment.insertedAt,t.locale))},null,8,Oe),e.createElementVNode("button",{class:e.normalizeClass(["wl-reply",{active:t.isReplyingCurrent}]),title:t.isReplyingCurrent?t.locale.cancelReply:t.locale.reply,onClick:o[0]||(o[0]=e=>t.$emit("reply",t.isReplyingCurrent?null:t.comment))},[e.createVNode(c)],10,_e)]),e.createElementVNode("div",qe,[t.comment.browser?(e.openBlock(),e.createElementBlock("span",{key:0,textContent:e.toDisplayString(t.comment.browser)},null,8,He)):e.createCommentVNode("v-if",!0),t.comment.os?(e.openBlock(),e.createElementBlock("span",{key:1,textContent:e.toDisplayString(t.comment.os)},null,8,We)):e.createCommentVNode("v-if",!0)]),e.createElementVNode("div",{class:"wl-content",innerHTML:t.comment.comment},null,8,Fe),t.isReplyingCurrent?(e.openBlock(),e.createElementBlock("div",Je,[e.createVNode(s,{replyId:t.comment.objectId,replyUser:t.comment.nick,rootId:t.rootId,onSubmit:o[1]||(o[1]=e=>t.$emit("submit",e)),onCancelReply:o[2]||(o[2]=e=>t.$emit("reply",null))},null,8,["replyId","replyUser","rootId"])])):e.createCommentVNode("v-if",!0),t.comment.children?(e.openBlock(),e.createElementBlock("div",Ke,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.comment.children,(n=>(e.openBlock(),e.createBlock(m,{key:n.objectId,comment:n,reply:t.reply,rootId:t.rootId,onReply:o[3]||(o[3]=e=>t.$emit("reply",e)),onSubmit:o[4]||(o[4]=e=>t.$emit("submit",e))},null,8,["comment","reply","rootId"])))),128))])):e.createCommentVNode("v-if",!0)])],8,Re)},Ve.__file="src/components/CommentCard.vue";var Ye=e.defineComponent({name:"WalineRoot",components:{CommentBox:Z,CommentCard:Ve,LoadingIcon:X},props:{serverURL:{type:String,required:!0},path:{type:String,required:!0},meta:{type:Array},requiredMeta:{type:Array},visitor:{type:Boolean},dark:{type:[String,Boolean]},lang:{type:String},locale:{type:Object},pageSize:{type:Number},wordLimit:{type:[Number,Array]},emoji:{type:Array},login:{type:String},highlighter:{type:Function},imageUploader:{type:[Function,!1]},texRender:{type:Function}},setup(t){const o=e.computed((()=>(({serverURL:e,path:t=location.pathname,lang:o="zh-CN",locale:n,emoji:l=["https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/weibo"],meta:r=["nick","mail","link"],requiredMeta:i=[],pageSize:d=10,wordLimit:u,imageUploader:p,highlighter:g,texRenderer:v,copyright:h=!0,login:f="enable",...y})=>{return{serverURL:I(e),path:N(t),lang:o,locale:{...k[o]||k["zh-CN"],..."object"==typeof n?n:{}},emoji:(w=l,Promise.all(w.map((e=>"string"==typeof e?L(B(e)):Promise.resolve(e)))).then((e=>{const t={tabs:[],map:{}};return e.forEach((e=>{const{name:o,folder:n,icon:l,prefix:r,type:a,items:i}=e;t.tabs.push({name:o,icon:x(l,n,r,a),items:i.map((e=>{const o=`${r||""}${e}`;return t.map[o]=x(e,n,r,a),o}))})})),t}))),wordLimit:Array.isArray(u)?u:!!u&&[0,u],meta:c(r),requiredMeta:c(i),pageSize:d,login:f,imageUploader:V(p,s),highlighter:V(g,a.default),texRenderer:V(v,m),copyright:h,...y};var w})(t))),{userInfo:n}=G(),l=e.ref("loading"),r=e.ref(0),i=e.ref(1),d=e.ref(0),u=e.ref([]),p=e.ref(null),g=e.computed((()=>{return"string"==typeof(e=o.value.dark)?"auto"===e?`@media(prefers-color-scheme:dark){body${R}}`:`${e}${R}`:!0===e?`:root${R}`:"";var e}));let v,h;const f=e=>{var t;const{serverURL:a,path:c,pageSize:s}=o.value,m=new AbortController;l.value="loading",null==v||v(),(({serverURL:e,path:t,page:o,pageSize:n,signal:l,token:r})=>{const a={};return r&&(a.Authorization=`Bearer ${r}`),fetch(`${e}/comment?path=${encodeURIComponent(t)}&pageSize=${n}&page=${o}`,{signal:l,headers:a}).then((e=>e.json())).then((e=>A(e,"comment list")))})({serverURL:a,path:c,pageSize:s,page:e,signal:m.signal,token:null===(t=n.value)||void 0===t?void 0:t.token}).then((t=>{l.value="success",r.value=t.count,u.value.push(...t.data),i.value=e,d.value=t.totalPages})).catch((e=>{"AbortError"!==e.name&&(console.error(e.message),l.value="error")})),v=m.abort.bind(m)},y=()=>{r.value=0,u.value=[],f(1)};return e.provide("config",o),e.watch((()=>t.path),y),e.onMounted((()=>{var t;y();const o=document.createElement("style");o.innerText=g.value,null===(t=document.querySelector("[data-waline]"))||void 0===t||t.appendChild(o),h=e.watchEffect((()=>{o.innerText=g.value}))})),e.onBeforeUnmount((()=>h())),{config:o,darkmodeStyle:g,i18n:e.computed((()=>o.value.locale)),status:l,count:r,page:i,totalPages:d,data:u,reply:p,loadMore:()=>f(i.value+1),refresh:y,onReply:e=>{p.value=e},onSubmit:e=>{if(e.rid){const t=u.value.find((({objectId:t})=>t===e.rid));if(!t)return;Array.isArray(t.children)||(t.children=[]),t.children.push(e)}else u.value.unshift(e)},version:"2.0.1"}}});const Ge={"data-waline":""},Qe={class:"wl-count"},Xe=["textContent"],Ze={class:"wl-cards"},et={key:1,class:"wl-action"},tt=["textContent"],ot={key:0,class:"wl-loading"},nt=["textContent"],lt={class:"wl-more"},rt=["textContent"],at={key:3,class:"wl-power"},it=e.createTextVNode(" Powered by "),ct=e.createElementVNode("a",{href:"https://github.com/walinejs/waline",target:"_blank",rel:"noreferrer"}," Waline ",-1);Ye.render=function(t,o,n,l,r,a){const i=e.resolveComponent("CommentBox"),c=e.resolveComponent("CommentCard"),s=e.resolveComponent("LoadingIcon");return e.openBlock(),e.createElementBlock("div",Ge,[t.reply?e.createCommentVNode("v-if",!0):(e.openBlock(),e.createBlock(i,{key:0,onSubmit:t.onSubmit},null,8,["onSubmit"])),e.createElementVNode("div",Qe,[t.count?(e.openBlock(),e.createElementBlock("span",{key:0,class:"wl-num",textContent:e.toDisplayString(t.count)},null,8,Xe)):e.createCommentVNode("v-if",!0),e.createTextVNode(" "+e.toDisplayString(t.i18n.comment),1)]),e.createElementVNode("div",Ze,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.data,(o=>(e.openBlock(),e.createBlock(c,{key:o.objectId,"root-id":o.objectId,comment:o,reply:t.reply,onReply:t.onReply,onSubmit:t.onSubmit},null,8,["root-id","comment","reply","onReply","onSubmit"])))),128))]),"error"===t.status?(e.openBlock(),e.createElementBlock("div",et,[e.createElementVNode("button",{type:"button",class:"wl-btn",onClick:o[0]||(o[0]=(...e)=>t.refresh&&t.refresh(...e)),textContent:e.toDisplayString(t.i18n.refresh)},null,8,tt)])):(e.openBlock(),e.createElementBlock(e.Fragment,{key:2},["loading"===t.status?(e.openBlock(),e.createElementBlock("div",ot,[e.createVNode(s,{size:30})])):t.data.length?t.page<t.totalPages?(e.openBlock(),e.createElementBlock(e.Fragment,{key:2},[e.createCommentVNode(" Load more button "),e.createElementVNode("div",lt,[e.createElementVNode("button",{type:"button",class:"wl-btn",onClick:o[1]||(o[1]=(...e)=>t.loadMore&&t.loadMore(...e)),textContent:e.toDisplayString(t.i18n.more)},null,8,rt)])],2112)):e.createCommentVNode("v-if",!0):(e.openBlock(),e.createElementBlock("div",{key:1,class:"wl-empty",textContent:e.toDisplayString(t.i18n.sofa)},null,8,nt))],2112)),e.createCommentVNode(" Copyright Information "),t.config.copyright?(e.openBlock(),e.createElementBlock("div",at,[it,ct,e.createTextVNode(" v"+e.toDisplayString(t.version),1)])):e.createCommentVNode("v-if",!0)])},Ye.__file="src/components/Waline.vue";const st=(e,t)=>{t.forEach(((t,o)=>{t.innerText=e[o].toString()}))},mt=({serverURL:e,path:t=window.location.pathname,selector:o=".waline-pageview-count",update:n=!0})=>{const l=new AbortController,r=Array.from(document.querySelectorAll(o)),a=e=>{const o=W(e);return null!==o&&t!==o},i=o=>M({serverURL:e,paths:o.map((e=>W(e)||t)),signal:l.signal}).then((e=>st(e,o))).catch(z);if(n){const o=r.filter((e=>!a(e))),n=r.filter(a);T({serverURL:e,path:t}).then((e=>st(new Array(o.length).fill(e),o))),n.length&&i(n)}else i(r);return l.abort.bind(l)};exports.RecentComments=({el:e,serverURL:t,count:o})=>{var n;const l=D(e),r=new AbortController;return(({serverURL:e,count:t,signal:o,token:n})=>{const l={};return n&&(l.Authorization=`Bearer ${n}`),fetch(`${e}/comment?type=recent&count=${t}`,{signal:o,headers:l}).then((e=>e.json())).then((e=>A(e,"recent comment")))})({serverURL:t,count:o,signal:r.signal,token:null===(n=K())||void 0===n?void 0:n.token}).then((e=>l&&e.length?(l.innerHTML=`<ul class="wl-recent-list">${e.map((e=>`<li class="wl-recent-item"><a href="${e.url}">${e.nick}</a>：${e.comment}</li>`)).join("")}</ul>`,{comments:e,destroy:()=>{r.abort(),l.innerHTML=""}}):{comments:e,destroy:()=>r.abort()}))},exports.commentCount=Q,exports.defaultLang="zh-CN",exports.defaultTexRenderer=m,exports.defaultUploadImage=s,exports.getMeta=c,exports.init=({el:t="#waline",path:o=window.location.pathname,comment:n=!1,pageview:l=!1,...r})=>{const a=t?D(t):null;if(t&&!a)throw new Error("Option 'el' do not match any domElement!");if(!r.serverURL)throw new Error("Option 'serverURL' is missing!");const i=e.reactive({...r}),c=e.reactive({comment:n,pageview:l,path:o}),s=()=>{c.comment&&Q({serverURL:i.serverURL,path:c.path,selector:"string"==typeof c.comment?c.comment:void 0})},m=()=>{c.pageview&&mt({serverURL:i.serverURL,path:c.path,selector:"string"==typeof c.pageview?c.pageview:void 0})},d=a?e.createApp((()=>e.h(Ye,{path:c.path,...i}))):null;d&&d.mount(a),s(),m();const u=e.watchEffect(s),p=e.watchEffect(m);return{el:a,update:({comment:e,pageview:t,path:o=window.location.pathname,...n})=>{Object.entries(n).map((([e,t])=>{i[e]=t})),c.path=o,void 0!==e&&(c.comment=e),void 0!==t&&(c.pageview=t)},destroy:()=>{null==d||d.unmount(),u(),p()}}},exports.locales=k,exports.pageviewCount=mt,exports.version="2.0.1";
//# sourceMappingURL=shim.js.map
