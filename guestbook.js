(() => {
  "use strict";
  const API = "https://linh-thang-guestbook.foreverkyuhyun.chatgpt.site/api/guestbook";
  const root = document.getElementById("guestbook");
  const dialog = document.getElementById("guestbookDialog");
  if (!root || !dialog) return;
  const ui = {
    vi:{
      title:"SỔ LƯU BÚT",intro:"Một lời chúc, một kỷ niệm, hay đôi dòng bạn muốn gửi đến chúng mình/em.",
      open:"Gửi lời chúc",modalTitle:"Đôi lời cho Linh & Thắng",modalIntro:"Chúng mình/em rất mong được đọc những lời nhắn của bạn.",
      name:"Tên của bạn",namePlaceholder:"Bạn muốn ký tên là gì?",message:"Lời chúc của bạn",messagePlaceholder:"Viết đôi dòng cho chúng mình/em nhé…",
      publicNote:"Tên và lời chúc của bạn sẽ hiển thị trong sổ lưu bút để mọi người cùng đọc.",
      send:"Gửi lời chúc",sending:"Đang gửi lời chúc…",success:"Cảm ơn bạn! Lời chúc đã được lưu vào sổ lưu bút rồi ♡",
      empty:"Chưa có lời chúc nào. Bạn viết đôi dòng đầu tiên nhé.",loading:"Đang mở sổ lưu bút…",
      loadError:"Chưa tải được lời chúc. Bạn thử lại nhé.",error:"Chưa xác nhận được lời chúc đã lưu. Bạn thử gửi lại nhé; cùng một lời chúc sẽ không bị lưu hai lần.",
      rateLimit:"Bạn vừa gửi lời chúc rồi. Chờ một phút trước khi gửi thêm nhé.",
      invalid:"Bạn điền tên và lời chúc trước khi gửi nhé.",retry:"Thử lại",more:"Xem thêm lời chúc",scroll:"Cuộn trong khung để đọc thêm lời chúc",close:"Đóng form lời chúc",list:"Những lời chúc dành cho Linh và Thắng"
    },
    en:{
      title:"OUR GUESTBOOK",intro:"A wish, a memory, or a few words for our next chapter.",
      open:"Leave a wish",modalTitle:"A little note for Linh & Thang",modalIntro:"We’d love to read a few words from you.",
      name:"Your name",namePlaceholder:"How would you like to sign your note?",message:"Your wish",messagePlaceholder:"Leave us a little note…",
      publicNote:"Your name and wish will appear in the guestbook for everyone to read.",
      send:"Send my wish",sending:"Sending your wish…",success:"Thank you! Your wish is now in our guestbook ♡",
      empty:"No wishes yet. Leave the first little note for us.",loading:"Opening our guestbook…",
      loadError:"We couldn’t load the wishes. Please try again.",error:"We couldn’t confirm your wish was saved. Please try again; the same wish won’t be saved twice.",
      rateLimit:"You’ve just sent a wish. Please wait a minute before adding another.",
      invalid:"Please add your name and wish before sending.",retry:"Try again",more:"Read more wishes",scroll:"Scroll inside the guestbook to read more",close:"Close the wish form",list:"Wishes for Linh and Thang"
    }
  };
  const el = id => document.getElementById(id);
  const list=el("guestbookList"), state=el("guestbookState"), retry=el("guestbookRetry"), more=el("guestbookMore"), hint=el("guestbookScrollHint");
  const form=el("guestbookForm"), name=el("guestbookName"), message=el("guestbookMessage"), send=el("guestbookSend"), feedback=el("guestbookFeedback");
  let entries=[], next=null, busy=false, loading=false, loaded=false, visible=false, stateKey="loading", feedbackKey="", feedbackKind="", pending=null, returnFocus=null, savedScroll=0, writeVersion=0;
  const language=()=>document.documentElement.lang==="vi"?"vi":"en";
  const words=()=>ui[language()];
  const uid=()=> {
    if(crypto.randomUUID) return crypto.randomUUID();
    const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
    const h=Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
    return h.slice(0,8)+"-"+h.slice(8,12)+"-"+h.slice(12,16)+"-"+h.slice(16,20)+"-"+h.slice(20);
  };
  let client="";
  try{client=localStorage.getItem("ltw:guestbook-client:v1")||"";}catch(_){}
  if(!/^[a-f0-9]{32}$/.test(client)){client=uid().replaceAll("-","");try{localStorage.setItem("ltw:guestbook-client:v1",client);}catch(_){}}
  function renderEntries(){
    const scroll=list.scrollTop;
    list.replaceChildren();
    const dates=new Intl.DateTimeFormat(language()==="vi"?"vi-VN":"en-GB",{day:"numeric",month:"short",year:"numeric"});
    for(const entry of entries){
      const card=document.createElement("article");card.className="guestbook-entry";
      const quote=document.createElement("blockquote");quote.textContent=entry.message;
      const footer=document.createElement("footer"), author=document.createElement("cite"), date=document.createElement("time");
      author.textContent="— "+entry.name;date.dateTime=new Date(entry.createdAt).toISOString();date.textContent=dates.format(new Date(entry.createdAt));
      footer.append(author,date);card.append(quote,footer);list.append(card);
    }
    list.scrollTop=scroll;
    hint.hidden=list.scrollHeight<=list.clientHeight+5;
  }
  function translate(){
    const w=words();
    document.querySelectorAll("[data-gb-copy]").forEach(node=>{node.textContent=w[node.dataset.gbCopy]||"";});
    name.placeholder=w.namePlaceholder;message.placeholder=w.messagePlaceholder;
    el("guestbookClose").setAttribute("aria-label",w.close);list.setAttribute("aria-label",w.list);
    state.textContent=w[stateKey]||"";state.hidden=!!entries.length;
    retry.hidden=stateKey!=="loadError";more.hidden=!next;more.disabled=loading;
    send.textContent=w[busy?"sending":"send"];send.disabled=busy;
    feedback.hidden=!feedbackKey;feedback.textContent=w[feedbackKey]||"";feedback.dataset.kind=feedbackKind;
    renderEntries();
  }
  function status(key,kind=""){feedbackKey=key;feedbackKind=kind;translate();}
  function validEntry(e){return e&&typeof e.id==="string"&&typeof e.name==="string"&&e.name.length<=80&&typeof e.message==="string"&&e.message.length<=1000&&Number.isSafeInteger(e.createdAt)&&e.createdAt>0&&e.createdAt<8640000000000000;}
  async function request(url,options={}){
    const controller=new AbortController(), timer=setTimeout(()=>controller.abort(),18000);
    try{
      const response=await fetch(url,{...options,signal:controller.signal,credentials:"omit",cache:"no-store",referrerPolicy:"no-referrer"});
      let data;try{data=await response.json();}catch(_){throw new Error("unavailable");}
      if(!response.ok){const error=new Error(data.error||"unavailable");error.status=response.status;throw error;}
      return data;
    }finally{clearTimeout(timer);}
  }
  async function load(append=false){
    if(loading)return;
    const requestVersion=writeVersion;
    loading=true;if(!entries.length)stateKey="loading";translate();
    try{
      const url=new URL(API);if(append&&next)url.searchParams.set("before",next);
      const data=await request(url);
      if(!Array.isArray(data.messages)||!data.messages.every(validEntry))throw new Error("invalid");
      if(requestVersion!==writeVersion)return;
      const incoming=append?[...entries,...data.messages]:data.messages;
      entries=[...new Map(incoming.map(e=>[e.id,e])).values()];
      next=typeof data.next==="string"?data.next:null;loaded=true;stateKey="empty";
    }catch(_){if(!entries.length)stateKey="loadError";}
    finally{loading=false;translate();if(requestVersion!==writeVersion)load();}
  }
  function open(){
    returnFocus=document.activeElement;savedScroll=window.scrollY;
    if(!name.value.trim()&&typeof inviteDisplayName==="string")name.value=inviteDisplayName.slice(0,80);
    if(feedbackKind!=="success")status("");
    dialog.showModal();document.documentElement.classList.add("guestbook-is-open");
    (name.value.trim()?message:name).focus({preventScroll:true});
  }
  el("guestbookOpen").addEventListener("click",open);
  el("guestbookClose").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",event=>{
    if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
  });
  dialog.addEventListener("close",()=>{
    document.documentElement.classList.remove("guestbook-is-open");
    window.scrollTo({top:savedScroll,behavior:"instant"});returnFocus?.focus({preventScroll:true});
  });
  message.addEventListener("input",()=>{el("guestbookCounter").textContent=message.value.length+" / 1000";if(!busy)pending=null;});
  name.addEventListener("input",()=>{if(!busy)pending=null;});
  retry.addEventListener("click",()=>load());more.addEventListener("click",()=>load(true));
  form.addEventListener("submit",async event=>{
    event.preventDefault();if(busy||!form.reportValidity())return;
    const author=name.value.trim().replace(/\s+/g," "),note=message.value.trim();
    if(!author||!note){status("invalid","error");return;}
    if(!pending||pending.name!==author||pending.message!==note)pending={id:uid(),client,name:author,message:note,public:true,website:form.elements.website.value};
    busy=true;status("sending");name.readOnly=true;message.readOnly=true;
    try{
      const data=await request(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(pending)});
      if(data.saved!==true||!validEntry(data.entry)||data.entry.id!==pending.id)throw new Error("unconfirmed");
      writeVersion++;entries=[data.entry,...entries.filter(e=>e.id!==data.entry.id)];stateKey="empty";loaded=true;pending=null;
      message.value="";el("guestbookCounter").textContent="0 / 1000";status("success","success");list.scrollTop=0;
      load();
    }catch(error){status(error.status===429?"rateLimit":error.status===400?"invalid":"error","error");}
    finally{busy=false;name.readOnly=false;message.readOnly=false;translate();}
  });
  new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  if("IntersectionObserver"in window){
    new IntersectionObserver(changes=>{visible=changes.some(e=>e.isIntersecting);if(visible&&!loaded)load();},{rootMargin:"180px"}).observe(root);
  }else{visible=true;load();}
  setInterval(()=>{if(visible&&document.visibilityState==="visible"&&!next)load();},45000);
  window.addEventListener("online",()=>{if(visible)load();});
  window.addEventListener("resize",()=>{hint.hidden=list.scrollHeight<=list.clientHeight+5;});
  translate();
})();
