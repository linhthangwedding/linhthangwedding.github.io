/* Anonymous Polaroid hearts. Shared totals always come from the server. */
(function initPhotoHearts(){
  "use strict";
  const buttons=[...document.querySelectorAll(".photo-heart")];
  const status=document.getElementById("photoHeartStatus");
  if (!buttons.length||!status) return;
  const endpoint=typeof RSVP_ENDPOINT==="string"?RSVP_ENDPOINT:"";
  const photos={
    keukenhof:{vi:"ảnh Keukenhof",en:"Keukenhof photo"},
    rotterdam:{vi:"ảnh Rotterdam",en:"Rotterdam photo"},
    zaandam:{vi:"ảnh Zaandam",en:"Zaandam photo"}
  };
  const labels={
    vi:{like:"Thả tim",unlike:"Bỏ tim",hearts:"lượt tim",loading:"Đang tải lượt tim",
      saving:"Đang lưu lượt tim…",saved:"Đã lưu lượt tim",removed:"Đã bỏ tim",
      unavailable:"Chưa tải được lượt tim. Vui lòng thử lại sau.",
      failed:"Chưa xác nhận được lượt tim. Bạn thử lại nhé."},
    en:{like:"Like",unlike:"Unlike",hearts:"likes",loading:"Loading likes",
      saving:"Saving your like…",saved:"Like saved",removed:"Like removed",
      unavailable:"Likes are unavailable right now. Please try again later.",
      failed:"We couldn't confirm your like. Please try again."}
  };
  const randomId=()=>[...crypto.getRandomValues(new Uint8Array(16))]
    .map(n=>n.toString(16).padStart(2,"0")).join("");
  let visitor;
  try {
    visitor=localStorage.getItem("ltw:photo-hearts:visitor:v1");
    if (!/^[a-f0-9]{32}$/.test(visitor||"")) {
      visitor=randomId();
      localStorage.setItem("ltw:photo-hearts:visitor:v1",visitor);
    }
  } catch (_) {visitor=randomId();}
  let snapshot=null,busy=false,refreshing=null,inView=false,lastRefresh=0,statusKey="",pendingChoice=null;
  const language=()=>document.documentElement.lang==="vi"?"vi":"en";
  function announce(key){
    statusKey=key;status.textContent=labels[language()][key]||"";
  }
  function render(pending=pendingChoice){
    const locale=language(),text=labels[locale];
    for(const button of buttons){
      const id=button.dataset.photo;
      let liked=!!snapshot?.liked[id],count=snapshot?snapshot.counts[id]:null;
      if(pending&&pending.id===id){
        count=Math.max(0,count+(pending.liked===liked?0:pending.liked?1:-1));
        liked=pending.liked;
      }
      button.disabled=busy||!snapshot;
      button.setAttribute("aria-pressed",String(liked));
      const label=snapshot?(liked?text.unlike:text.like)+" · "+photos[id][locale]+" · "+count+" "+text.hearts:
        text.loading+" · "+photos[id][locale];
      button.setAttribute("aria-label",label);
      button.title=snapshot?label:text.unavailable;
      button.querySelector(".photo-heart-count").textContent=count===null?"—":String(count);
    }
    if(statusKey)status.textContent=text[statusKey]||"";
  }
  function requestSnapshot(){
    return new Promise((resolve,reject)=>{
      if(!endpoint)return reject(new Error("Missing endpoint"));
      const callback="ltwPhotoHearts_"+randomId(),tag=document.createElement("script"),url=new URL(endpoint);
      url.searchParams.set("action","photoLikes");
      url.searchParams.set("visitor",visitor);
      url.searchParams.set("callback",callback);
      url.searchParams.set("nocache",String(Date.now()));
      let done=false;
      const timer=setTimeout(()=>finish(new Error("timeout")),15000);
      function finish(error,data){
        if(done)return;
        done=true;clearTimeout(timer);tag.remove();delete window[callback];
        if(error)reject(error);else resolve(data);
      }
      window[callback]=data=>{
        const valid=data&&data.ok===true&&data.photoHeartsVersion===1&&
          Object.keys(photos).every(id=>Number.isSafeInteger(data.counts?.[id])&&
            data.counts[id]>=0&&typeof data.liked?.[id]==="boolean");
        finish(valid?null:new Error("Unavailable"),data);
      };
      tag.onerror=()=>finish(new Error("network"));
      tag.src=url.toString();document.head.appendChild(tag);
    });
  }
  async function refresh(){
    if(busy)return;
    if(refreshing)return refreshing;
    refreshing=requestSnapshot().then(data=>{
      if(busy)return;
      snapshot=data;lastRefresh=Date.now();render();
    }).catch(()=>{if(!snapshot)announce("unavailable");render();})
      .finally(()=>{refreshing=null;});
    return refreshing;
  }
  for(const button of buttons)button.addEventListener("click",async()=>{
    if(busy||!snapshot)return;
    const id=button.dataset.photo,wantLiked=!snapshot.liked[id],receipt=randomId();
    busy=true;pendingChoice={id,liked:wantLiked};announce("saving");render();
    const body=new URLSearchParams({action:"photoLike",photo:id,visitor,liked:String(wantLiked),receipt});
    try{
      await fetch(endpoint,{method:"POST",mode:"no-cors",credentials:"omit",cache:"no-store",body});
      let confirmed=null;
      for(let attempt=0;attempt<3;attempt++){
        const data=await requestSnapshot();
        if(data.receipts?.[id]===receipt&&data.liked[id]===wantLiked){confirmed=data;break;}
        await new Promise(resolve=>setTimeout(resolve,400*(attempt+1)));
      }
      if(!confirmed)throw new Error("Unconfirmed");
      snapshot=confirmed;lastRefresh=Date.now();
      if(wantLiked){
        button.classList.remove("just-liked");
        void button.offsetWidth;
        button.classList.add("just-liked");
      }
      announce(wantLiked?"saved":"removed");
    }catch(_){announce("failed");}
    finally{busy=false;pendingChoice=null;render();}
  });
  new MutationObserver(()=>render()).observe(document.documentElement,
    {attributes:true,attributeFilter:["lang"]});
  const gallery=document.querySelector(".polaroid-gallery");
  if("IntersectionObserver" in window){
    new IntersectionObserver(entries=>{
      inView=entries.some(entry=>entry.isIntersecting);
      if(inView&&Date.now()-lastRefresh>10000)refresh();
    }).observe(gallery);
  }else{inView=true;}
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible"&&inView)refresh();
  });
  window.addEventListener("focus",()=>{if(inView&&Date.now()-lastRefresh>10000)refresh();});
  setInterval(()=>{if(document.visibilityState==="visible"&&inView)refresh();},20000);
  render();refresh();
})();
