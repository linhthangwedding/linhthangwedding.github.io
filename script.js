const RSVP_ENDPOINT = ""; // Add Tally/webhook endpoint later.

const translations = {
  vi:{
    weddingOf:"THE WEDDING OF",
    heroLine:"HAI GIA ĐÌNH · MỘT HÀNH TRÌNH · MỘT ĐỜI BÊN NHAU",
    rsvp:"Xác nhận tham dự", saveDate:"Lưu ngày",
    warmInvite:"TRÂN TRỌNG KÍNH MỜI", warmInviteSub:"Cùng chúng mình chia sẻ ngày đặc biệt này",
    celebrations:"Lịch cưới", celebrationsSub:"WEDDING CELEBRATIONS",
    brideEvent:"NHÀ GÁI · ĐÁM HỎI", groomEvent:"NHÀ TRAI · ĐÁM CƯỚI",
    hotel:"Khách sạn ABC", nghean:"Nghệ An", restaurant:"Capella Parkview", hcm:"Thành phố Hồ Chí Minh",
    timeTbc:"Thời gian sẽ cập nhật", details:"Xem chi tiết",
    story:"Cùng nhau đi qua những hành trình, những thành phố, những mùa hoa, và giờ đây chúng mình sẵn sàng bắt đầu một chương mới.",
    photoNote:"Ảnh thật sẽ tự hiện ở đây sau khi được thêm vào thư mục assets.",
    rsvpTitle:"Xác nhận tham dự", guestName:"Tên của bạn", guestNamePlaceholder:"Nhập tên của bạn",
    attendingQ:"Bạn có thể tham dự cùng chúng mình không?", yes:"Có", no:"Không",
    whichEvent:"Bạn sẽ tham dự buổi nào?", selectOne:"Chọn một", brideEventOption:"Nghệ An · Đám hỏi", groomEventOption:"TP.HCM · Đám cưới", bothEvents:"Cả hai",
    partySize:"Tổng số khách tham dự", companionNames:"Tên người đi cùng", optional:"Không bắt buộc",
    wishes:"Lời chúc dành cho Linh & Thang", wishesPlaceholder:"Để lại vài lời cho chúng mình...",
    submitRsvp:"Gửi RSVP", thanks:"Cảm ơn bạn đã là một phần trong câu chuyện của chúng mình.",
    preview:"Bản RSVP đang ở chế độ preview. Khi nối Tally, câu trả lời sẽ được gửi và theo dõi tự động.",
    sent:"Cảm ơn bạn. RSVP đã được ghi nhận."
  },
  en:{
    weddingOf:"THE WEDDING OF",
    heroLine:"TWO FAMILIES · ONE JOURNEY · A LIFETIME TOGETHER",
    rsvp:"RSVP", saveDate:"Save the date",
    warmInvite:"WE WARMLY INVITE YOU", warmInviteSub:"Come celebrate this special day with us",
    celebrations:"Wedding Celebrations", celebrationsSub:"OUR TWO CELEBRATIONS",
    brideEvent:"BRIDE'S FAMILY · ENGAGEMENT", groomEvent:"GROOM'S FAMILY · WEDDING",
    hotel:"ABC Hotel", nghean:"Nghe An", restaurant:"Capella Parkview", hcm:"Ho Chi Minh City",
    timeTbc:"Time to be confirmed", details:"View details",
    story:"Across journeys, cities and changing seasons, we found home in each other. Now we are ready to begin a new chapter together.",
    photoNote:"Our real photos will appear here once added to the assets folder.",
    rsvpTitle:"Will you join us?", guestName:"Your name", guestNamePlaceholder:"Enter your name",
    attendingQ:"Will you be able to celebrate with us?", yes:"Yes", no:"No",
    whichEvent:"Which celebration will you attend?", selectOne:"Select one", brideEventOption:"Nghe An · Engagement", groomEventOption:"Ho Chi Minh City · Wedding", bothEvents:"Both",
    partySize:"Total number of guests", companionNames:"Names of accompanying guests", optional:"Optional",
    wishes:"A message for Linh & Thang", wishesPlaceholder:"Leave us a little message...",
    submitRsvp:"Send RSVP", thanks:"Thank you for being part of our story.",
    preview:"RSVP is currently in preview mode. Once Tally is connected, responses will be sent and tracked automatically.",
    sent:"Thank you. Your RSVP has been received."
  }
};

let lang="vi";
function applyLanguage(next){
  lang=next;
  document.documentElement.lang=next;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.dataset.i18n;
    if(translations[next][key]) el.textContent=translations[next][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    const key=el.dataset.i18nPlaceholder;
    if(translations[next][key]) el.placeholder=translations[next][key];
  });
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("active",b.dataset.lang===next));
}
document.querySelectorAll(".lang-btn").forEach(btn=>btn.addEventListener("click",()=>applyLanguage(btn.dataset.lang)));

const yes=document.getElementById("yesBranch");
const no=document.getElementById("noBranch");
document.querySelectorAll('input[name="attending"]').forEach(r=>r.addEventListener("change",()=>{
  yes.classList.toggle("hidden",r.value!=="yes"||!r.checked);
  no.classList.toggle("hidden",r.value!=="no"||!r.checked);
}));

const params=new URLSearchParams(location.search);
document.getElementById("guestId").value=params.get("guest")||"";

document.querySelectorAll(".photo-slot img").forEach(img=>{
  img.addEventListener("error",()=>{img.style.display="none";});
});

document.getElementById("rsvpForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const status=document.getElementById("formStatus");
  const data=Object.fromEntries(new FormData(e.currentTarget).entries());
  data.language=lang;
  data.submitted_at=new Date().toISOString();

  if(!RSVP_ENDPOINT){
    localStorage.setItem("linh-thang-rsvp-preview",JSON.stringify(data));
    status.textContent=translations[lang].preview;
    return;
  }

  try{
    const res=await fetch(RSVP_ENDPOINT,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    });
    if(!res.ok) throw new Error("Submission failed");
    status.textContent=translations[lang].sent;
    e.currentTarget.reset();
    yes.classList.add("hidden"); no.classList.add("hidden");
  }catch(err){
    status.textContent=lang==="vi"?"Chưa gửi được RSVP. Vui lòng thử lại.":"We couldn't send your RSVP. Please try again.";
  }
});

applyLanguage("vi");