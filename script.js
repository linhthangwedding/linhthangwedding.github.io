const RSVP_ENDPOINT = "";

const copy = {
  vi:{
    weddingOf:"LỄ THÀNH HÔN CỦA",
    heroTagline:"Hai gia đình · Một hành trình · Một đời bên nhau",
    formalInvite:"TRÂN TRỌNG KÍNH MỜI",
    inviteCopy:"Đến chung vui trong ngày cưới của chúng mình cùng hai bên gia đình",
    wedding:"ĐÁM CƯỚI",
    dateLabel:"Ngày",
    timeLabel:"Thời gian",
    locationLabel:"Địa điểm",
    city:"Thành phố Hồ Chí Minh",
    rsvpButton:"Xác nhận tham dự",
    direction:"Chỉ đường ↗",
    saveDate:"Lưu ngày vào lịch",
    storyTitle:"CÂU CHUYỆN CỦA CHÚNG MÌNH",
    storyCopy:"Cùng nhau đi qua những hành trình, những thành phố và những mùa hoa. Giờ đây, chúng mình sẵn sàng bắt đầu một chương mới.",
    storySignoff:"Cùng nhau, luôn là nhà.",
    rsvpTitle:"XÁC NHẬN THAM DỰ",
    rsvpIntro:"Rất mong được đón tiếp bạn trong ngày đặc biệt của chúng mình.",
    guestName:"Tên của bạn",
    guestPlaceholder:"Nhập tên của bạn",
    attendingQ:"Bạn có thể tham dự không?",
    yes:"Có",no:"Không",
    partySize:"Tổng số khách tham dự",
    wishes:"Lời nhắn dành cho Linh & Thang",
    wishesPlaceholder:"Để lại vài lời cho chúng mình...",
    submit:"Gửi xác nhận",
    preview:"Đây là bản xem trước. Phản hồi mới chỉ được lưu trên thiết bị của bạn, chưa được gửi đến chúng mình.",
    success:"Cảm ơn bạn! Chúng mình đã nhận được xác nhận của bạn.",
    error:"Chưa gửi được xác nhận. Vui lòng thử lại.",
    pageTitle:"Thiệp cưới Linh & Thang",
    pageDescription:"Thiệp cưới của Linh và Thang",
    brandAria:"Linh và Thang",
    languageAria:"Chọn ngôn ngữ",
    imageAlt:"Linh và Thang ở Paris"
  },
  en:{
    weddingOf:"THE WEDDING OF",
    heroTagline:"Two families · One journey · A lifetime together",
    formalInvite:"WE WARMLY INVITE YOU",
    inviteCopy:"Join us and our families to celebrate our wedding day",
    wedding:"WEDDING",
    dateLabel:"Date",
    timeLabel:"Time",
    locationLabel:"Location",
    city:"Ho Chi Minh City",
    rsvpButton:"RSVP",
    direction:"Get directions ↗",
    saveDate:"Save the date",
    storyTitle:"OUR STORY",
    storyCopy:"Across journeys, cities and changing seasons, we found home in each other. Now we are ready to begin a new chapter together.",
    storySignoff:"Together, always home.",
    rsvpTitle:"RSVP",
    rsvpIntro:"We would be delighted to celebrate this special day with you.",
    guestName:"Your name",
    guestPlaceholder:"Enter your name",
    attendingQ:"Will you be able to attend?",
    yes:"Yes",no:"No",
    partySize:"Total number of guests",
    wishes:"A message for Linh & Thang",
    wishesPlaceholder:"Leave us a little message...",
    submit:"Send RSVP",
    preview:"This is a preview. Your response is saved only on this device and has not been sent to us.",
    success:"Thank you! We have received your response.",
    error:"Your response could not be sent. Please try again.",
    pageTitle:"Linh & Thang — Wedding Invitation",
    pageDescription:"The wedding invitation of Linh and Thang",
    brandAria:"Linh and Thang",
    languageAria:"Choose a language",
    imageAlt:"Linh and Thang in Paris"
  }
};

let lang="vi";

function setLang(next){
  lang=next;
  document.documentElement.lang=next;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const v=copy[next][el.dataset.i18n];
    if(v!==undefined) el.textContent=v;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    const v=copy[next][el.dataset.i18nPlaceholder];
    if(v!==undefined) el.placeholder=v;
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(el=>{
    const v=copy[next][el.dataset.i18nAriaLabel];
    if(v!==undefined) el.setAttribute("aria-label",v);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach(el=>{
    const v=copy[next][el.dataset.i18nAlt];
    if(v!==undefined) el.alt=v;
  });
  document.title=copy[next].pageTitle;
  document.querySelector('meta[name="description"]')?.setAttribute("content",copy[next].pageDescription);
  const status=document.getElementById("formStatus");
  if(status?.dataset.messageKey) status.textContent=copy[next][status.dataset.messageKey];
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("active",b.dataset.lang===next));
}
document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));

const yesBranch=document.getElementById("yesBranch");
const noBranch=document.getElementById("noBranch");
document.querySelectorAll('input[name="attending"]').forEach(r=>r.addEventListener("change",()=>{
  yesBranch.classList.toggle("hidden",!(r.checked&&r.value==="yes"));
  noBranch.classList.toggle("hidden",!(r.checked&&r.value==="no"));
}));

document.getElementById("rsvpForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const status=document.getElementById("formStatus");
  const data=Object.fromEntries(new FormData(e.currentTarget).entries());
  data.language=lang;
  data.submitted_at=new Date().toISOString();

  if(!RSVP_ENDPOINT){
    localStorage.setItem("linh-thang-rsvp-preview",JSON.stringify(data));
    status.dataset.messageKey="preview";
    status.textContent=copy[lang].preview;
    return;
  }

  try{
    const res=await fetch(RSVP_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    if(!res.ok) throw new Error();
    status.dataset.messageKey="success";
    status.textContent=copy[lang].success;
  }catch{
    status.dataset.messageKey="error";
    status.textContent=copy[lang].error;
  }
});

setLang("vi");
