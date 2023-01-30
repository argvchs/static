import{h as e,reactive as t,ref as n,readonly as o,defineComponent as l,inject as i,computed as r,watch as a,onMounted as s,onUnmounted as c,resolveComponent as m,openBlock as u,createElementBlock as d,createElementVNode as p,createVNode as v,toDisplayString as g,createCommentVNode as h,normalizeClass as f,Fragment as y,renderList as w,withDirectives as b,vModelDynamic as k,vModelText as C,normalizeStyle as $,createTextVNode as I,createBlock as S,provide as x,watchEffect as L,onBeforeUnmount as j}from"vue";import R from"autosize";import{marked as E}from"marked";import z from"hanabi";const U=({size:t})=>e("svg",{width:t,height:t,viewBox:"0 0 100 100",preserveAspectRatio:"xMidYMid"},e("circle",{cx:50,cy:50,fill:"none",stroke:"currentColor",strokeWidth:"4",r:"40","stroke-dasharray":"85 30"},e("animateTransform",{attributeName:"transform",type:"rotate",repeatCount:"indefinite",dur:"1s",values:"0 50 50;360 50 50",keyTimes:"0;1"}))),M=e=>{let t={};const n=localStorage.getItem(e);if(n)try{t=JSON.parse(n)}catch(e){}return{get:e=>t[e]||null,set(n,o){try{t[n]=JSON.parse(JSON.stringify(o)),localStorage.setItem(e,JSON.stringify(t))}catch(e){}},update(n){t=JSON.parse(JSON.stringify(n)),localStorage.setItem(e,JSON.stringify(t))}}};let N,A;const P=()=>(A||(N=M("WALINE_USER_CACHE"),A=t({nick:N.get("nick")||"",mail:N.get("mail")||"",link:N.get("link")||"",editor:""})),{inputs:A,store:N}),T=["nick","mail","link"],O=e=>e.filter((e=>T.includes(e))),_=e=>new Promise(((t,n)=>{const o=new FileReader;o.readAsDataURL(e),o.onload=()=>{var e;return t((null===(e=o.result)||void 0===e?void 0:e.toString())||"")},o.onerror=n})),B=e=>!0===e?'<p class="vtex">Tex is not available in preview</p>':'<span class="vtex">Tex is not available in preview</span>',W=["nick","nickError","mail","mailError","link","optional","placeholder","sofa","submit","reply","cancelReply","comment","refresh","more","preview","emoji","uploadImage","seconds","minutes","hours","days","now","uploading","login","logout","admin","sticky","word","wordHint","anonymous"],H=e=>Object.fromEntries(e.map(((e,t)=>[W[t],e])));var V=H(["NickName","NickName cannot be less than 3 bytes.","E-Mail","Please confirm your email address.","Website","Optional","Comment here...","No comment yet.","Submit","Reply","Cancel reply","Comments","Refresh","Load More...","Preview","Emoji","Upload Image","seconds ago","minutes ago","hours ago","days ago","just now","Uploading","Login","logout","Admin","Sticky","Words","Please input comments between $0 and $1 words!\n Current word number: $2","Anonymous"]),D=H(["ニックネーム","3バイト以上のニックネームをご入力ください.","メールアドレス","メールアドレスをご確認ください.","サイト","オプション","ここにコメント","コメントしましょう~","提出する","返信する","キャンセル","コメント","更新","さらに読み込む","プレビュー","絵文字","画像をアップロード","秒前","分前","時間前","日前","たっだ今","アップロード","ログインする","ログアウト","管理者","トップに置く","ワード","コメントは $0 から $1 ワードの間でなければなりません!\n 現在の単語番号: $2","匿名"]),q=H(["昵称","昵称不能少于3个字符","邮箱","请填写正确的邮件地址","网址","可选","欢迎评论","来发评论吧~","提交","回复","取消回复","评论","刷新","加载更多...","预览","表情","上传图片","秒前","分钟前","小时前","天前","刚刚","正在上传","登录","退出","博主","置顶","字","评论字数应在 $0 到 $1 字之间！\n当前字数：$2","匿名"]),J=H(["暱稱","郵箱","網址","可選","暱稱不能少於3個字元","請填寫正確的郵件地址","歡迎評論","來發評論吧~","提交","回覆","取消回覆","評論","刷新","載入更多...","預覽","表情","上傳圖片","秒前","分鐘前","小時前","天前","剛剛","正在上傳","登錄","退出","博主","置頂","字","評論字數應在 $0 到 $1 字之間！\n當前字數：$2","匿名"]),F=H(["Apelido","Apelido não pode ser menor que 3 bytes.","E-Mail","Por favor, confirme seu endereço de e-mail.","Website","Opcional","Comente aqui...","Nenhum comentário, ainda.","Enviar","Responder","Cancelar resposta","Comentários","Refrescar","Carregar Mais...","Visualizar","Emoji","Enviar Imagem","segundos atrás","minutos atrás","horas atrás","dias atrás","agora mesmo","Enviando","Entrar","Sair","Admin","Sticky","Palavras","Favor enviar comentário com $0 a $1 palavras!\n Número de palavras atuais: $2","Anônimo"]),K=H(["Псевдоним","Никнейм не может быть меньше 3 байт.","Эл. адрес","Пожалуйста, подтвердите адрес вашей электронной почты.","Веб-сайт","Необязательный","Комментарий здесь...","Пока нет комментариев.","Отправить","Отвечать","Отменить ответ","Комментарии","Обновить","Загрузи больше...","Превью","эмодзи","Загрузить изображение","секунд назад","несколько минут назад","несколько часов назад","дней назад","прямо сейчас","Загрузка","Авторизоваться","Выход из системы","Админ","Липкий","Слова","Пожалуйста, введите комментарии от $0 до $1 слов!\nНомер текущего слова: $2","Анонимный"]);const Y={zh:q,"zh-cn":q,"zh-CN":q,"zh-tw":J,"zh-TW":J,en:V,"en-US":V,"en-us":V,jp:D,"jp-jp":D,"jp-JP":D,"pt-br":F,"pt-BR":F,ru:K,"ru-ru":K,"ru-RU":K},G=e=>{try{e=decodeURI(e)}catch(e){}return e},Q=(e="")=>e.replace(/\/$/u,""),X=e=>/^(https?:)?\/\//.test(e);let Z;const ee=e=>{Z||(Z=M("WALINE_EMOJI"));const t=Boolean(/@[0-9]+\.[0-9]+\.[0-9]+/.test(e));if(t){const t=Z.get(e);if(t)return Promise.resolve(t)}return fetch(`${e}/info.json`).then((e=>e.json())).then((n=>{const o={folder:e,...n};return t&&Z.set(e,o),o}))},te=(e,t="",n="",o="")=>`${t?`${t}/`:""}${n}${e}${o?`.${o}`:""}`,ne=e=>{const t=Q(e);return X(t)?t:`https://${t}`},oe=(e,t)=>"function"==typeof e?e:!1!==e&&t,le="{--waline-white:#000;--waline-light-grey:#666;--waline-dark-grey:#999;--waline-color:#888;--waline-bgcolor:#1e1e1e;--waline-bgcolor-light:#272727;--waline-bgcolor-hover: #444;--waline-border-color:#333;--waline-disable-bgcolor:#444;--waline-disable-color:#272727;--waline-bq-color:#272727;--waline-info-bgcolor:#272727;--waline-info-color:#666}",ie=e=>e.type.includes("image"),re=e=>{const t=Array.from(e).find(ie);return t?t.getAsFile():null},ae=({serverURL:e,path:t,page:n,pageSize:o,signal:l,token:i})=>{const r={};return i&&(r.Authorization=`Bearer ${i}`),fetch(`${e}/comment?path=${encodeURIComponent(t)}&pageSize=${o}&page=${n}`,{signal:l,headers:r}).then((e=>e.json())).then((e=>((e,t="")=>{if("object"==typeof e&&e.errno)throw new TypeError(`Fetch ${t} failed with ${e.errno}: ${e.errmsg}`);return e})(e,"comment list")))},se=/\$.*?\$/,ce=/^\$(.*?)\$/,me=/^(?:\s{0,3})\$\$((?:[^\n]|\n[^\n])+?)\n{0,1}\$\$/,ue=(e="",t={})=>e.replace(/:(.+?):/g,((e,n)=>t[n]?`<img class="vemoji" src="${t[n]}" alt="${n}">`:e)),de=(e,{emojiMap:t,highlighter:n,texRenderer:o})=>{if(E.setOptions({highlight:n||void 0,breaks:!0,smartLists:!0,smartypants:!0}),o){const e=(e=>[{name:"blockMath",level:"block",tokenizer(t){const n=me.exec(t);if(null!==n)return{type:"html",raw:n[0],text:e(!0,n[1])}}},{name:"inlineMath",level:"inline",start(e){const t=e.search(se);return-1!==t?t:e.length},tokenizer(t){const n=ce.exec(t);if(null!==n)return{type:"html",raw:n[0],text:e(!1,n[1])}}}])(o);E.use({extensions:e})}return E.parse(ue(e,t))},pe=(e,t)=>{let n=e.toString();for(;n.length<t;)n="0"+n;return n},ve=(e,t)=>{if(e)try{"string"==typeof e&&(e=new Date(-1!==e.indexOf(" ")?e.replace(/-/g,"/"):e));const n=e.getTime(),o=(new Date).getTime()-n,l=Math.floor(o/864e5);if(0===l){const e=o%864e5,n=Math.floor(e/36e5);if(0===n){const n=e%36e5,o=Math.floor(n/6e4);if(0===o){const e=n%6e4;return`${Math.round(e/1e3)} ${t.seconds}`}return`${o} ${t.minutes}`}return`${n} ${t.hours}`}return l<0?t.now:l<8?`${l} ${t.days}`:(e=>{const t=pe(e.getDate(),2),n=pe(e.getMonth()+1,2);return`${pe(e.getFullYear(),2)}-${n}-${t}`})(e)}catch(e){console.log(e)}return""},ge=n({}),he=()=>{if(!ge.value.token){const e=(()=>{try{const e=localStorage.getItem("WALINE_USER"),t=sessionStorage.getItem("WALINE_USER");return e?JSON.parse(e):t?JSON.parse(t):null}catch(e){return null}})();e&&(ge.value=e)}return{userInfo:o(ge),setUserInfo:e=>{ge.value=e}}};var fe=l({name:"CommentBox",components:{CloseIcon:({size:t})=>e("svg",{class:"wl-close-icon",viewBox:"0 0 1024 1024",width:t,height:t},[e("path",{d:"M697.173 85.333h-369.92c-144.64 0-241.92 101.547-241.92 252.587v348.587c0 150.613 97.28 252.16 241.92 252.16h369.92c144.64 0 241.494-101.547 241.494-252.16V337.92c0-151.04-96.854-252.587-241.494-252.587z",fill:"currentColor"}),e("path",{d:"m640.683 587.52-75.947-75.861 75.904-75.862a37.29 37.29 0 0 0 0-52.778 37.205 37.205 0 0 0-52.779 0l-75.946 75.818-75.862-75.946a37.419 37.419 0 0 0-52.821 0 37.419 37.419 0 0 0 0 52.821l75.947 75.947-75.776 75.733a37.29 37.29 0 1 0 52.778 52.821l75.776-75.776 75.947 75.947a37.376 37.376 0 0 0 52.779-52.821z",fill:"#888"})]),EmojiIcon:()=>e("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},e("path",{d:"M563.2 463.3 677 540c1.7 1.2 3.7 1.8 5.8 1.8.7 0 1.4-.1 2-.2 2.7-.5 5.1-2.1 6.6-4.4l25.3-37.8c1.5-2.3 2.1-5.1 1.6-7.8s-2.1-5.1-4.4-6.6l-73.6-49.1 73.6-49.1c2.3-1.5 3.9-3.9 4.4-6.6.5-2.7 0-5.5-1.6-7.8l-25.3-37.8a10.1 10.1 0 0 0-6.6-4.4c-.7-.1-1.3-.2-2-.2-2.1 0-4.1.6-5.8 1.8l-113.8 76.6c-9.2 6.2-14.7 16.4-14.7 27.5.1 11 5.5 21.3 14.7 27.4zM387 348.8h-45.5c-5.7 0-10.4 4.7-10.4 10.4v153.3c0 5.7 4.7 10.4 10.4 10.4H387c5.7 0 10.4-4.7 10.4-10.4V359.2c0-5.7-4.7-10.4-10.4-10.4zm333.8 241.3-41-20a10.3 10.3 0 0 0-8.1-.5c-2.6.9-4.8 2.9-5.9 5.4-30.1 64.9-93.1 109.1-164.4 115.2-5.7.5-9.9 5.5-9.5 11.2l3.9 45.5c.5 5.3 5 9.5 10.3 9.5h.9c94.8-8 178.5-66.5 218.6-152.7 2.4-5 .3-11.2-4.8-13.6zm186-186.1c-11.9-42-30.5-81.4-55.2-117.1-24.1-34.9-53.5-65.6-87.5-91.2-33.9-25.6-71.5-45.5-111.6-59.2-41.2-14-84.1-21.1-127.8-21.1h-1.2c-75.4 0-148.8 21.4-212.5 61.7-63.7 40.3-114.3 97.6-146.5 165.8-32.2 68.1-44.3 143.6-35.1 218.4 9.3 74.8 39.4 145 87.3 203.3.1.2.3.3.4.5l36.2 38.4c1.1 1.2 2.5 2.1 3.9 2.6 73.3 66.7 168.2 103.5 267.5 103.5 73.3 0 145.2-20.3 207.7-58.7 37.3-22.9 70.3-51.5 98.1-85 27.1-32.7 48.7-69.5 64.2-109.1 15.5-39.7 24.4-81.3 26.6-123.8 2.4-43.6-2.5-87-14.5-129zm-60.5 181.1c-8.3 37-22.8 72-43 104-19.7 31.1-44.3 58.6-73.1 81.7-28.8 23.1-61 41-95.7 53.4-35.6 12.7-72.9 19.1-110.9 19.1-82.6 0-161.7-30.6-222.8-86.2l-34.1-35.8c-23.9-29.3-42.4-62.2-55.1-97.7-12.4-34.7-18.8-71-19.2-107.9-.4-36.9 5.4-73.3 17.1-108.2 12-35.8 30-69.2 53.4-99.1 31.7-40.4 71.1-72 117.2-94.1 44.5-21.3 94-32.6 143.4-32.6 49.3 0 97 10.8 141.8 32 34.3 16.3 65.3 38.1 92 64.8 26.1 26 47.5 56 63.6 89.2 16.2 33.2 26.6 68.5 31 105.1 4.6 37.5 2.7 75.3-5.6 112.3z",fill:"currentColor"})),ImageIcon:()=>e("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},[e("path",{d:"M784 112H240c-88 0-160 72-160 160v480c0 88 72 160 160 160h544c88 0 160-72 160-160V272c0-88-72-160-160-160zm96 640c0 52.8-43.2 96-96 96H240c-52.8 0-96-43.2-96-96V272c0-52.8 43.2-96 96-96h544c52.8 0 96 43.2 96 96v480z",fill:"currentColor"}),e("path",{d:"M352 480c52.8 0 96-43.2 96-96s-43.2-96-96-96-96 43.2-96 96 43.2 96 96 96zm0-128c17.6 0 32 14.4 32 32s-14.4 32-32 32-32-14.4-32-32 14.4-32 32-32zm462.4 379.2-3.2-3.2-177.6-177.6c-25.6-25.6-65.6-25.6-91.2 0l-80 80-36.8-36.8c-25.6-25.6-65.6-25.6-91.2 0L200 728c-4.8 6.4-8 14.4-8 24 0 17.6 14.4 32 32 32 9.6 0 16-3.2 22.4-9.6L380.8 640l134.4 134.4c6.4 6.4 14.4 9.6 24 9.6 17.6 0 32-14.4 32-32 0-9.6-4.8-17.6-9.6-24l-52.8-52.8 80-80L769.6 776c6.4 4.8 12.8 8 20.8 8 17.6 0 32-14.4 32-32 0-8-3.2-16-8-20.8z",fill:"currentColor"})]),MarkdownIcon:()=>e("svg",{width:"16",height:"16",ariaHidden:"true"},e("path",{d:"M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z",fill:"currentColor"})),PreviewIcon:()=>e("svg",{viewBox:"0 0 1024 1024",width:"24",height:"24"},[e("path",{d:"M710.816 654.301c70.323-96.639 61.084-230.578-23.705-314.843-46.098-46.098-107.183-71.109-172.28-71.109-65.008 0-126.092 25.444-172.28 71.109-45.227 46.098-70.756 107.183-70.756 172.106 0 64.923 25.444 126.007 71.194 172.106 46.099 46.098 107.184 71.109 172.28 71.109 51.414 0 100.648-16.212 142.824-47.404l126.53 126.006c7.058 7.06 16.297 10.979 26.406 10.979 10.105 0 19.343-3.919 26.402-10.979 14.467-14.467 14.467-38.172 0-52.723L710.816 654.301zm-315.107-23.265c-65.88-65.88-65.88-172.54 0-238.42 32.069-32.07 74.245-49.149 119.471-49.149 45.227 0 87.407 17.603 119.472 49.149 65.88 65.879 65.88 172.539 0 238.42-63.612 63.178-175.242 63.178-238.943 0zm0 0",fill:"currentColor"}),e("path",{d:"M703.319 121.603H321.03c-109.8 0-199.469 89.146-199.469 199.38v382.034c0 109.796 89.236 199.38 199.469 199.38h207.397c20.653 0 37.384-16.645 37.384-37.299 0-20.649-16.731-37.296-37.384-37.296H321.03c-68.582 0-124.352-55.77-124.352-124.267V321.421c0-68.496 55.77-124.267 124.352-124.267h382.289c68.582 0 124.352 55.771 124.352 124.267V524.72c0 20.654 16.736 37.299 37.385 37.299 20.654 0 37.384-16.645 37.384-37.299V320.549c-.085-109.8-89.321-198.946-199.121-198.946zm0 0",fill:"currentColor"})]),LoadingIcon:U},props:{rootId:{type:String,default:""},replyId:{type:String,default:""},replyUser:{type:String,default:""}},emits:["submit","cancel-reply"],setup(e,{emit:t}){const o=i("config"),{inputs:l,store:m}=P(),{userInfo:u,setUserInfo:d}=he(),p=n({}),v=n(null),g=n(null),h=n(null),f=n(null),y=n({tabs:[],map:{}}),w=n(0),b=n(!1),k=n(!1),C=n(""),$=n(0),I=n(0),S=n(!1),x=n(""),L=n(!1),j=r((()=>o.value.locale)),E=r((()=>{var e;return Boolean(null===(e=u.value)||void 0===e?void 0:e.token)})),z=r((()=>!1!==o.value.imageUploader)),U=e=>{const t=v.value,n=t.selectionStart,o=t.selectionEnd||0,i=t.scrollTop;l.editor=t.value.substring(0,n)+e+t.value.substring(o,t.value.length),t.focus(),t.selectionStart=n+e.length,t.selectionEnd=n+e.length,t.scrollTop=i},M=e=>{const t=`![${o.value.locale.uploading} ${e.name}]()`;return U(t),Promise.resolve().then((()=>o.value.imageUploader(e))).then((n=>{l.editor=l.editor.replace(t,`\r\n![${e.name}](${n})`)}))},N=()=>{var n,i,r,a,s;const{serverURL:c,lang:d,login:g,wordLimit:h,requiredMeta:f}=o.value,w={comment:x.value,nick:l.nick,mail:l.mail,link:l.link,ua:navigator.userAgent,url:o.value.path};if(null===(n=u.value)||void 0===n?void 0:n.token)w.nick=u.value.display_name,w.mail=u.value.email,w.link=u.value.url;else{if("force"===g)return;if((f.indexOf("nick")>-1||w.nick)&&!w.nick)return null===(i=p.value.nick)||void 0===i||i.focus(),alert(j.value.nickError);if(f.indexOf("mail")>-1&&!w.mail)return null===(r=p.value.mail)||void 0===r||r.focus(),alert(j.value.mailError);if(!w.comment)return void(null===(a=v.value)||void 0===a||a.focus());w.nick||(w.nick=j.value.anonymous)}if(!S.value)return alert(j.value.wordHint.replace("$0",h[0].toString()).replace("$1",h[1].toString()).replace("$2",$.value.toString()));w.comment=ue(w.comment,y.value.map),e.replyId&&e.rootId&&(w.pid=e.replyId,w.rid=e.rootId,w.at=e.replyUser),L.value=!0,(({serverURL:e,lang:t,token:n,comment:o})=>{const l={"Content-Type":"application/json"};return n&&(l.Authorization=`Bearer ${n}`),fetch(`${e}/comment?lang=${t}`,{method:"POST",headers:l,body:JSON.stringify(o)}).then((e=>e.json()))})({serverURL:c,lang:d,token:null===(s=u.value)||void 0===s?void 0:s.token,comment:w}).then((n=>{if(L.value=!1,m.update({nick:w.nick,link:w.link,mail:w.mail}),n.errmsg)return alert(n.errmsg);t("submit",n.data),l.editor="",C.value="",e.replyId&&t("cancel-reply")})).catch((e=>{L.value=!1,alert(e.message)}))},A=e=>{h.value.contains(e.target)||f.value.contains(e.target)||(b.value=!1)};return a((()=>l.editor),(e=>{const{highlighter:t,texRenderer:n}=o.value;x.value=e,C.value=de(e,{emojiMap:y.value.map,highlighter:t,texRenderer:n}),$.value=(e=>(e=>e.match(/[\w\d\s\u00C0-\u024F]+/giu)||[])(e).reduce(((e,t)=>e+(""===t.trim()?0:t.trim().split(/\s+/u).length)),0)+(e=>e.match(/[\u4E00-\u9FA5]/gu)||[])(e).length)(e),v.value&&(e?R(v.value):R.destroy(v.value))}),{immediate:!0}),a((()=>o.value.emoji),(e=>e.then((e=>{y.value=e}))),{immediate:!0}),a([o,$],(([e,t])=>{const{wordLimit:n}=e;n?t<n[0]&&0!==n[0]?(I.value=n[0],S.value=!1):t>n[1]?(I.value=n[1],S.value=!1):(I.value=n[1],S.value=!0):(I.value=0,S.value=!0)}),{immediate:!0}),s((()=>{document.body.addEventListener("click",A)})),c((()=>{document.body.removeEventListener("click",A)})),{config:o,locale:j,insert:U,onChange:()=>{const e=g.value;e.files&&z.value&&M(e.files[0]).then((()=>{e.value=""}))},onDrop:e=>{var t;if(null===(t=e.dataTransfer)||void 0===t?void 0:t.items){const t=re(e.dataTransfer.items);t&&z.value&&(M(t),e.preventDefault())}},onKeyDown:e=>{const t=e.key;(e.ctrlKey||e.metaKey)&&"Enter"===t&&N()},onPaste:e=>{if(e.clipboardData){const t=re(e.clipboardData.items);t&&z.value&&M(t)}},onLogin:e=>{e.preventDefault();const{lang:t,serverURL:n}=o.value,l=(window.innerWidth-450)/2,i=(window.innerHeight-450)/2,r=window.open(`${n}/ui/login?lng=${encodeURIComponent(t)}`,"_blank",`width=450,height=450,left=${l},top=${i},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`);null==r||r.postMessage({type:"TOKEN",data:null},"*");const a=({data:e})=>{e&&"userInfo"===e.type&&e.data.token&&(null==r||r.close(),d(e.data),(e.data.remember?localStorage:sessionStorage).setItem("WALINE_USER",JSON.stringify(e.data)),window.removeEventListener("message",a))};window.addEventListener("message",a)},onLogout:()=>{d({}),localStorage.setItem("WALINE_USER","null"),sessionStorage.setItem("WALINE_USER","null")},onProfile:e=>{e.preventDefault();const{lang:t,serverURL:n}=o.value,l=(window.innerWidth-800)/2,i=(window.innerHeight-800)/2,r=window.open(`${n}/ui/profile?lng=${encodeURIComponent(t)}`,"_blank",`width=800,height=800,left=${l},top=${i},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`);null==r||r.postMessage({type:"TOKEN",data:u.value.token},"*");const a=({data:e})=>{e&&"profile"===e.type&&(d(Object.assign({},u.value,e)),[localStorage,sessionStorage].filter((e=>e.getItem("WALINE_USER"))).forEach((e=>e.setItem("WALINE_USER",JSON.stringify(u)))),window.removeEventListener("message",a))};window.addEventListener("message",a)},submitComment:N,isLogin:E,userInfo:u,isSubmitting:L,wordNumber:$,wordLimit:I,isWordNumberLegal:S,inputs:l,emoji:y,emojiTabIndex:w,showEmoji:b,canUploadImage:z,previewText:C,showPreview:k,inputRefs:p,editorRef:v,emojiButtonRef:h,emojiPopupRef:f,imageUploadRef:g}}});const ye={class:"wl-comment"},we={key:0,class:"wl-login-info"},be={class:"wl-avatar"},ke=["title"],Ce=["src"],$e=["textContent"],Ie={class:"wl-panel"},Se=["for","textContent"],xe=["id","name","type","onUpdate:modelValue"],Le=["placeholder"],je=["innerHTML"],Re={class:"wl-footer"},Ee={class:"wl-actions"},ze={href:"https://guides.github.com/features/mastering-markdown/",title:"Markdown Guide","aria-label":"Markdown is supported",class:"wl-action",target:"_blank",rel:"noreferrer"},Ue=["title"],Me=["title"],Ne=["title"],Ae={class:"wl-info"},Pe={class:"wl-text-number"},Te={key:0},Oe=I("  /  "),_e=["textContent"],Be=["textContent"],We=["disabled"],He={key:0,class:"wl-tab-wrapper"},Ve=["title","onClick"],De=["src","alt"],qe={key:0,class:"wl-tabs"},Je=["onClick"],Fe=["src","alt","title"],Ke=["title"];fe.render=function(e,t,n,o,l,i){const r=m("CloseIcon"),a=m("MarkdownIcon"),s=m("EmojiIcon"),c=m("ImageIcon"),x=m("PreviewIcon"),L=m("LoadingIcon");return u(),d("div",ye,["disable"!==e.config.login&&e.isLogin?(u(),d("div",we,[p("div",be,[p("button",{class:"wl-logout-btn",title:e.locale.logout,onClick:t[0]||(t[0]=(...t)=>e.onLogout&&e.onLogout(...t))},[v(r,{size:14})],8,ke),p("img",{src:e.userInfo.avatar,alt:"avatar"},null,8,Ce)]),p("a",{href:"#",class:"wl-login-nick","aria-label":"Profile",onClick:t[1]||(t[1]=(...t)=>e.onProfile&&e.onProfile(...t)),textContent:g(e.userInfo.display_name)},null,8,$e)])):h("v-if",!0),p("div",Ie,["force"!==e.config.login&&e.config.meta.length&&!e.isLogin?(u(),d("div",{key:0,class:f(["wl-header",`item${e.config.meta.length}`])},[(u(!0),d(y,null,w(e.config.meta,(t=>(u(),d("div",{class:"wl-header-item",key:t},[p("label",{for:t,textContent:g(e.locale[t]+(e.config.requiredMeta.includes(t)||!e.config.requiredMeta.length?"":`(${e.locale.optional})`))},null,8,Se),b(p("input",{ref_for:!0,ref:n=>{n&&(e.inputRefs[t]=n)},id:`wl-${t}`,class:f(["wl-input",`wl-${t}`]),name:t,type:"mail"===t?"email":"text","onUpdate:modelValue":n=>e.inputs[t]=n},null,10,xe),[[k,e.inputs[t]]])])))),128))],2)):h("v-if",!0),b(p("textarea",{class:"wl-editor",ref:"editorRef",id:"wl-edit",placeholder:e.replyUser?`@${e.replyUser}`:e.locale.placeholder,"onUpdate:modelValue":t[2]||(t[2]=t=>e.inputs.editor=t),onKeydown:t[3]||(t[3]=(...t)=>e.onKeyDown&&e.onKeyDown(...t)),onDrop:t[4]||(t[4]=(...t)=>e.onDrop&&e.onDrop(...t)),onPaste:t[5]||(t[5]=(...t)=>e.onPaste&&e.onPaste(...t))},null,40,Le),[[C,e.inputs.editor]]),p("div",{class:"wl-preview",style:$({display:e.showPreview?"block":"none"})},[p("h4",null,g(e.locale.preview)+":",1),p("div",{class:"wl-content",innerHTML:e.previewText},null,8,je)],4),p("div",Re,[p("div",Ee,[p("a",ze,[v(a)]),p("button",{ref:"emojiButtonRef",class:f(["wl-action",{actived:e.showEmoji}]),title:e.locale.emoji,onClick:t[6]||(t[6]=t=>e.showEmoji=!e.showEmoji)},[v(s)],10,Ue),p("input",{ref:"imageUploadRef",class:"upload",id:"wl-image-upload",type:"file",accept:".png,.jpg,.jpeg,.webp,.bmp,.gif",onChange:t[7]||(t[7]=(...t)=>e.onChange&&e.onChange(...t))},null,544),e.canUploadImage?(u(),d("label",{key:0,for:"wl-image-upload",class:"wl-action",title:e.locale.uploadImage},[v(c)],8,Me)):h("v-if",!0),p("button",{class:f(["wl-action",{actived:e.showPreview}]),title:e.locale.preview,onClick:t[8]||(t[8]=t=>e.showPreview=!e.showPreview)},[v(x)],10,Ne)]),p("div",Ae,[p("div",Pe,[I(g(e.wordNumber)+" ",1),e.config.wordLimit?(u(),d("span",Te,[Oe,p("span",{class:f({illegal:!e.isWordNumberLegal}),textContent:g(e.wordLimit)},null,10,_e)])):h("v-if",!0),I("  "+g(e.locale.word),1)]),"disable"===e.config.login||e.isLogin?h("v-if",!0):(u(),d("button",{key:0,class:"wl-btn",onClick:t[9]||(t[9]=(...t)=>e.onLogin&&e.onLogin(...t)),textContent:g(e.locale.login)},null,8,Be)),"force"!==e.config.login||e.isLogin?(u(),d("button",{key:1,class:"wl-btn primary",title:"Cmd|Ctrl + Enter",disabled:e.isSubmitting,onClick:t[10]||(t[10]=(...t)=>e.submitComment&&e.submitComment(...t))},[e.isSubmitting?(u(),S(L,{key:0,size:16})):(u(),d(y,{key:1},[I(g(e.locale.submit),1)],2112))],8,We)):h("v-if",!0)]),p("div",{ref:"emojiPopupRef",class:f(["wl-emoji-popup",{display:e.showEmoji}])},[(u(!0),d(y,null,w(e.emoji.tabs,((t,n)=>(u(),d(y,{key:t.name},[n===e.emojiTabIndex?(u(),d("div",He,[(u(!0),d(y,null,w(t.items,(t=>(u(),d("button",{key:t,title:t,onClick:n=>e.insert(`:${t}:`)},[e.showEmoji?(u(),d("img",{key:0,class:"wl-emoji",src:e.emoji.map[t],alt:t,loading:"lazy",referrerPolicy:"no-referrer"},null,8,De)):h("v-if",!0)],8,Ve)))),128))])):h("v-if",!0)],64)))),128)),e.emoji.tabs.length>1?(u(),d("div",qe,[(u(!0),d(y,null,w(e.emoji.tabs,((t,n)=>(u(),d("button",{key:t.name,class:f(["wl-tab",{active:e.emojiTabIndex===n}]),onClick:t=>e.emojiTabIndex=n},[p("img",{class:"wl-emoji",src:t.icon,alt:t.name,title:t.name,loading:"lazy",referrerPolicy:"no-referrer"},null,8,Fe)],10,Je)))),128))])):h("v-if",!0)],2)])]),e.replyId?(u(),d("button",{key:1,class:"wl-close",title:e.locale.cancelReply,onClick:t[11]||(t[11]=t=>e.$emit("cancel-reply"))},[v(r,{size:24})],8,Ke)):h("v-if",!0)])},fe.__file="src/components/CommentBox.vue";var Ye=l({props:{comment:{type:Object,required:!0},rootId:{type:String,required:!0},reply:{type:Object}},components:{CommentBox:fe,ReplyIcon:()=>e("svg",{viewBox:"0 0 1024 1024",width:"18",height:"18"},e("path",{d:"M1019.2 720C1001.6 625.6 968 566.4 904 497.6c-89.6-89.6-214.4-150.4-347.2-176v-120c0-25.6-8-51.2-25.6-64-33.6-30.4-81.6-30.4-112-4.8L33.6 441.6C12.8 459.2 0 484.8 0 510.4c0 25.6 12.8 51.2 30.4 68.8l385.6 312c17.6 12.8 33.6 17.6 51.2 17.6 12.8 0 25.6-4.8 38.4-8C536 888 552 857.6 552 824v-99.2c124.8 20.8 248 86.4 339.2 140.8 25.6 17.6 59.2 17.6 89.6 0 25.6-17.6 43.2-46.4 43.2-76.8 0-33.6 0-56-4.8-68.8zm-500.8-89.6-46.4-4.8v193.6L86.4 510.4 472 201.6V400l38.4 4.8c128 12.8 248 68.8 334.4 153.6 51.2 56 76.8 102.4 94.4 179.2 0 4.8 4.8 20.8 4.8 51.2C835.2 720 672 640 518.4 630.4z",fill:"currentColor"})),VerifiedIcon:()=>e("svg",{class:"verified-icon",viewBox:"0 0 1024 1024",width:"14",height:"14"},e("path",{d:"m894.4 461.56-54.4-63.2c-10.4-12-18.8-34.4-18.8-50.4v-68c0-42.4-34.8-77.2-77.2-77.2h-68c-15.6 0-38.4-8.4-50.4-18.8l-63.2-54.4c-27.6-23.6-72.8-23.6-100.8 0l-62.8 54.8c-12 10-34.8 18.4-50.4 18.4h-69.2c-42.4 0-77.2 34.8-77.2 77.2v68.4c0 15.6-8.4 38-18.4 50l-54 63.6c-23.2 27.6-23.2 72.4 0 100l54 63.6c10 12 18.4 34.4 18.4 50v68.4c0 42.4 34.8 77.2 77.2 77.2h69.2c15.6 0 38.4 8.4 50.4 18.8l63.2 54.4c27.6 23.6 72.8 23.6 100.8 0l63.2-54.4c12-10.4 34.4-18.8 50.4-18.8h68c42.4 0 77.2-34.8 77.2-77.2v-68c0-15.6 8.4-38.4 18.8-50.4l54.4-63.2c23.2-27.6 23.2-73.2-.4-100.8zm-216-25.2-193.2 193.2a30 30 0 0 1-42.4 0l-96.8-96.8a30.16 30.16 0 0 1 0-42.4c11.6-11.6 30.8-11.6 42.4 0l75.6 75.6 172-172c11.6-11.6 30.8-11.6 42.4 0 11.6 11.6 11.6 30.8 0 42.4z",fill:"#27ae60"}))},emits:["submit","reply"],setup(e){const t=i("config"),n=r((()=>t.value.locale)),o=r((()=>{let{link:t}=e.comment;return t?X(t)?t:`https://${t}`:""})),l=r((()=>{var t;return e.comment.objectId===(null===(t=e.reply)||void 0===t?void 0:t.objectId)}));return{config:t,locale:n,isReplyingCurrent:l,link:o,timeAgo:ve}}});const Ge=["id"],Qe={class:"wl-user","aria-hidden":"true"},Xe=["src"],Ze={class:"wl-card"},et={class:"wl-head"},tt=["href"],nt={key:1,class:"wl-nick"},ot=["textContent"],lt=["textContent"],it=["textContent"],rt=["title"],at={class:"wl-meta","aria-hidden":"true"},st=["textContent"],ct=["textContent"],mt=["innerHTML"],ut={key:0,class:"wl-reply-wrapper"},dt={key:1,class:"wl-quote"};Ye.render=function(e,t,n,o,l,i){const r=m("VerifiedIcon"),a=m("ReplyIcon"),s=m("CommentBox"),c=m("CommentCard",!0);return u(),d("div",{class:"wl-item",id:e.comment.objectId},[p("div",Qe,[e.comment.avatar?(u(),d("img",{key:0,src:e.comment.avatar},null,8,Xe)):h("v-if",!0),e.comment.type?(u(),S(r,{key:1})):h("v-if",!0)]),p("div",Ze,[p("div",et,[e.link?(u(),d("a",{key:0,class:"wl-nick",href:e.link,target:"_blank",rel:"nofollow noreferrer"},g(e.comment.nick),9,tt)):(u(),d("span",nt,g(e.comment.nick),1)),"administrator"===e.comment.type?(u(),d("span",{key:2,class:"wl-badge",textContent:g(e.locale.admin)},null,8,ot)):h("v-if",!0),e.comment.sticky?(u(),d("span",{key:3,class:"wl-badge",textContent:g(e.locale.sticky)},null,8,lt)):h("v-if",!0),p("span",{class:"wl-time",textContent:g(e.timeAgo(e.comment.insertedAt,e.locale))},null,8,it),p("button",{class:f(["wl-reply",{active:e.isReplyingCurrent}]),title:e.isReplyingCurrent?e.locale.cancelReply:e.locale.reply,onClick:t[0]||(t[0]=t=>e.$emit("reply",e.isReplyingCurrent?null:e.comment))},[v(a)],10,rt)]),p("div",at,[e.comment.browser?(u(),d("span",{key:0,textContent:g(e.comment.browser)},null,8,st)):h("v-if",!0),e.comment.os?(u(),d("span",{key:1,textContent:g(e.comment.os)},null,8,ct)):h("v-if",!0)]),p("div",{class:"wl-content",innerHTML:e.comment.comment},null,8,mt),e.isReplyingCurrent?(u(),d("div",ut,[v(s,{replyId:e.comment.objectId,replyUser:e.comment.nick,rootId:e.rootId,onSubmit:t[1]||(t[1]=t=>e.$emit("submit",t)),onCancelReply:t[2]||(t[2]=t=>e.$emit("reply",null))},null,8,["replyId","replyUser","rootId"])])):h("v-if",!0),e.comment.children?(u(),d("div",dt,[(u(!0),d(y,null,w(e.comment.children,(n=>(u(),S(c,{key:n.objectId,comment:n,reply:e.reply,rootId:e.rootId,onReply:t[3]||(t[3]=t=>e.$emit("reply",t)),onSubmit:t[4]||(t[4]=t=>e.$emit("submit",t))},null,8,["comment","reply","rootId"])))),128))])):h("v-if",!0)])],8,Ge)},Ye.__file="src/components/CommentCard.vue";var pt=l({name:"WalineRoot",components:{CommentBox:fe,CommentCard:Ye,LoadingIcon:U},props:{serverURL:{type:String,required:!0},path:{type:String,required:!0},meta:{type:Array},requiredMeta:{type:Array},visitor:{type:Boolean},dark:{type:[String,Boolean]},lang:{type:String},locale:{type:Object},pageSize:{type:Number},wordLimit:{type:[Number,Array]},emoji:{type:Array},login:{type:String},highlighter:{type:Function},imageUploader:{type:[Function,!1]},texRender:{type:Function}},setup(e){const t=r((()=>(({serverURL:e,path:t=location.pathname,lang:n="zh-CN",locale:o,emoji:l=["https://cdn.jsdelivr.net/gh/walinejs/emojis@1.0.0/weibo"],meta:i=["nick","mail","link"],requiredMeta:r=[],pageSize:a=10,wordLimit:s,imageUploader:c,highlighter:m,texRenderer:u,copyright:d=!0,login:p="enable",...v})=>{return{serverURL:ne(e),path:G(t),lang:n,locale:{...Y[n]||Y["zh-CN"],..."object"==typeof o?o:{}},emoji:(g=l,Promise.all(g.map((e=>"string"==typeof e?ee(Q(e)):Promise.resolve(e)))).then((e=>{const t={tabs:[],map:{}};return e.forEach((e=>{const{name:n,folder:o,icon:l,prefix:i,type:r,items:a}=e;t.tabs.push({name:n,icon:te(l,o,i,r),items:a.map((e=>{const n=`${i||""}${e}`;return t.map[n]=te(e,o,i,r),n}))})})),t}))),wordLimit:Array.isArray(s)?s:!!s&&[0,s],meta:O(i),requiredMeta:O(r),pageSize:a,login:p,imageUploader:oe(c,_),highlighter:oe(m,z),texRenderer:oe(u,B),copyright:d,...v};var g})(e))),{userInfo:o}=he(),l=n("loading"),i=n(0),c=n(1),m=n(0),u=n([]),d=n(null),p=r((()=>{return"string"==typeof(e=t.value.dark)?"auto"===e?`@media(prefers-color-scheme:dark){body${le}}`:`${e}${le}`:!0===e?`:root${le}`:"";var e}));let v,g;const h=e=>{var n;const{serverURL:r,path:a,pageSize:s}=t.value,d=new AbortController;l.value="loading",null==v||v(),ae({serverURL:r,path:a,pageSize:s,page:e,signal:d.signal,token:null===(n=o.value)||void 0===n?void 0:n.token}).then((t=>{l.value="success",i.value=t.count,u.value.push(...t.data),c.value=e,m.value=t.totalPages})).catch((e=>{"AbortError"!==e.name&&(console.error(e.message),l.value="error")})),v=d.abort.bind(d)},f=()=>{i.value=0,u.value=[],h(1)};return x("config",t),a((()=>e.path),f),s((()=>{var e;f();const t=document.createElement("style");t.innerText=p.value,null===(e=document.querySelector("[data-waline]"))||void 0===e||e.appendChild(t),g=L((()=>{t.innerText=p.value}))})),j((()=>g())),{config:t,darkmodeStyle:p,i18n:r((()=>t.value.locale)),status:l,count:i,page:c,totalPages:m,data:u,reply:d,loadMore:()=>h(c.value+1),refresh:f,onReply:e=>{d.value=e},onSubmit:e=>{if(e.rid){const t=u.value.find((({objectId:t})=>t===e.rid));if(!t)return;Array.isArray(t.children)||(t.children=[]),t.children.push(e)}else u.value.unshift(e)},version:"2.0.1"}}});const vt={"data-waline":""},gt={class:"wl-count"},ht=["textContent"],ft={class:"wl-cards"},yt={key:1,class:"wl-action"},wt=["textContent"],bt={key:0,class:"wl-loading"},kt=["textContent"],Ct={class:"wl-more"},$t=["textContent"],It={key:3,class:"wl-power"},St=I(" Powered by "),xt=p("a",{href:"https://github.com/walinejs/waline",target:"_blank",rel:"noreferrer"}," Waline ",-1);pt.render=function(e,t,n,o,l,i){const r=m("CommentBox"),a=m("CommentCard"),s=m("LoadingIcon");return u(),d("div",vt,[e.reply?h("v-if",!0):(u(),S(r,{key:0,onSubmit:e.onSubmit},null,8,["onSubmit"])),p("div",gt,[e.count?(u(),d("span",{key:0,class:"wl-num",textContent:g(e.count)},null,8,ht)):h("v-if",!0),I(" "+g(e.i18n.comment),1)]),p("div",ft,[(u(!0),d(y,null,w(e.data,(t=>(u(),S(a,{key:t.objectId,"root-id":t.objectId,comment:t,reply:e.reply,onReply:e.onReply,onSubmit:e.onSubmit},null,8,["root-id","comment","reply","onReply","onSubmit"])))),128))]),"error"===e.status?(u(),d("div",yt,[p("button",{type:"button",class:"wl-btn",onClick:t[0]||(t[0]=(...t)=>e.refresh&&e.refresh(...t)),textContent:g(e.i18n.refresh)},null,8,wt)])):(u(),d(y,{key:2},["loading"===e.status?(u(),d("div",bt,[v(s,{size:30})])):e.data.length?e.page<e.totalPages?(u(),d(y,{key:2},[h(" Load more button "),p("div",Ct,[p("button",{type:"button",class:"wl-btn",onClick:t[1]||(t[1]=(...t)=>e.loadMore&&e.loadMore(...t)),textContent:g(e.i18n.more)},null,8,$t)])],2112)):h("v-if",!0):(u(),d("div",{key:1,class:"wl-empty",textContent:g(e.i18n.sofa)},null,8,kt))],2112)),h(" Copyright Information "),e.config.copyright?(u(),d("div",It,[St,xt,I(" v"+g(e.version),1)])):h("v-if",!0)])},pt.__file="src/components/Waline.vue";const Lt="2.0.1";export{pt as Waline,Lt as version};
//# sourceMappingURL=component.js.map
