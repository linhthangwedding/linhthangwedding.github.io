const RSVP_ENDPOINT = "";

const copy = {
  vi:{
    weddingOf:"THE WEDDING OF",
    heroTagline:"Hai gia đình · Một hành trình · Một đời bên nhau",
    formalInvite:"TRÂN TRỌNG KÍNH MỜI",
    inviteCopy:"Đến dự buổi tiệc chung vui cùng gia đình chúng tôi",
    inviteEnglish:"We warmly invite you to celebrate with us",
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
    submit:"Gửi RSVP",
    preview:"RSVP đang ở chế độ preview. Phản hồi đã được lưu tạm trên thiết bị này."
  },
  en:{
    weddingOf:"THE WEDDING OF",
    heroTagline:"Two families · One journey · A lifetime together",
    formalInvite:"WE WARMLY INVITE YOU",
    inviteCopy:"To celebrate this special day together with our families",
    inviteEnglish:"We warmly invite you to celebrate with us",
    wedding:"WEDDING",
    dateLabel:"Date",
    timeLabel:"Time",
    locationLabel:"Location",
    city:"Ho Chi Minh City",
    rsvpButton:"RSVP",
    direction:"Get direction ↗",
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
    preview:"RSVP is in preview mode. Your response has been saved locally on this device."
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
    status.textContent=copy[lang].preview;
    return;
  }

  try{
    const res=await fetch(RSVP_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    if(!res.ok) throw new Error();
    status.textContent=lang==="vi"?"Cảm ơn bạn. RSVP đã được ghi nhận.":"Thank you. Your RSVP has been received.";
  }catch{
    status.textContent=lang==="vi"?"Chưa gửi được RSVP. Vui lòng thử lại.":"We couldn't send your RSVP. Please try again.";
  }
});

setLang("vi");
