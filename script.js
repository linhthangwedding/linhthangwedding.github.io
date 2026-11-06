const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbwDA6HVjo0JZUM0dCiPjVwNB2Whzjgsr4IiuTxulmd2LDijhpfQ3SR_c34VVJ6mXHNRxQ/exec"; // Google Apps Script deployed Web App.

const copy = {
  vi:{
    weddingOf:"LỄ THÀNH HÔN CỦA",
    heroTagline:"Hai gia đình · Một hành trình · Một đời bên nhau",
    formalInvite:"THÂN MẾN MỜI",
    inviteCopy:"Đến chung vui cùng chúng mình và hai bên gia đình trong ngày cưới nhé. Có bạn ở đó, ngày vui sẽ thêm trọn vẹn.",
    wedding:"ĐÁM CƯỚI",
    celebrationsTitle:"HAI BUỔI TIỆC CỦA CHÚNG MÌNH",
    celebrationNote:"Vì ở xa, chúng mình gửi lời mời này thay cho tấm thiệp trao tận tay. Rất mong được đón bạn đến chung vui trong ngày cưới.",
    vinhCelebration:"TIỆC TẠI VINH",
    hcmCelebration:"TIỆC TẠI TP. HỒ CHÍ MINH",
    vinhVenue:"Nhà hàng Giao Tế",
    vinhCity:"TP. Vinh, Nghệ An, Việt Nam",
    vinhDirections:"🚙💨 Chỉ đường đến Nhà hàng Giao Tế",
    hcmDirections:"🚙💨 Chỉ đường đến Capella Parkview",
    dateLabel:"Ngày",
    timeLabel:"Thời gian",
    locationLabel:"Địa điểm",
    city:"Thành phố Hồ Chí Minh",
    rsvpButton:"Xác nhận tham dự",
    direction:"Chỉ đường ↗",
    saveDate:"Lưu ngày vào lịch",
    storyOrigin:"Amsterdam — nơi chúng mình gặp nhau",
    storyPhotoCoupleAlt:"Linh và Thắng bên nhau",
    storyPhotoZaandamAlt:"Linh và Thắng tại Zaandam",
    storyTitle:"CÂU CHUYỆN CỦA CHÚNG MÌNH",
    musicSectionTitle:"GIAI ĐIỆU CỦA CHÚNG MÌNH",
    musicPlayLabel:"Phát I Think They Call This Love (Cover)",
    musicPauseLabel:"Tạm dừng I Think They Call This Love (Cover)",
    musicLoading:"Đang tải trình phát nhạc…",
    musicReady:"Đã sẵn sàng. Nhấn đĩa than để phát nhạc",
    musicTryingAutoplay:"Đang thử phát nhạc tự động…",
    musicAutoplayBlocked:"Trình duyệt chặn tự phát. Chạm đĩa than để nghe nhạc",
    musicPlaying:"Đang phát qua Spotify",
    musicPaused:"Nhạc đã tạm dừng",
    musicUnavailable:"Không tải được trình phát. Bạn có thể mở bài hát bằng liên kết Spotify bên dưới.",
    musicOpenSpotify:"Mở bằng Spotify ↗",
    rsvpSignoff:"Thương mến,\nLinh & Thắng ♡",
    rsvpTitle:"HẸN BẠN TRONG NGÀY VUI",
    rsvpIntro:"Chúng mình rất mong được gặp bạn. Bạn nhắn lại để chúng mình chuẩn bị đón tiếp thật chu đáo nhé.",
    rsvpDeadline:"Hạn xác nhận: Thứ Tư, 10/02/2027, 23:59 (giờ Việt Nam) / 17:59 (giờ Trung Âu, CET).",
    rsvpReceivedIntro:"Chúng mình đã nhận được phản hồi của bạn rồi.",
    rsvpDeadlinePassedIntro:"Thời hạn xác nhận tham dự đã kết thúc.",
    rsvpClosedYes:"Cảm ơn {name}! Chúng mình đã nhận được xác nhận cho {count} người, bao gồm bạn. Hẹn gặp bạn trong ngày vui nhé!",
    rsvpClosedNo:"Cảm ơn {name} đã nhắn lại. Tiếc là không được đón bạn trong ngày cưới, mong sớm có dịp gặp nhau nhé.",
    rsvpClosedDeadline:"Thời gian xác nhận đã kết thúc vào ngày 10/02/2027. Nếu cần thay đổi kế hoạch, bạn nhắn trực tiếp cho Linh & Thắng nhé.",
    rsvpClosedNotReady:"Thiệp này chưa mở phần xác nhận. Bạn nhắn Linh & Thắng để chúng mình hỗ trợ nhé.",
    rsvpEditHint:"Kế hoạch có thay đổi? Bạn có thể nhắn lại đến 23:59 ngày 10/02/2027 (giờ Việt Nam) / 17:59 (CET).",
    rsvpEditButton:"Cập nhật xác nhận",
    rsvpEditingIntro:"Bạn cập nhật câu trả lời bên dưới rồi lưu lại nhé.",
    rsvpCancelEdit:"Quay lại xác nhận",
    submitUpdate:"Lưu thay đổi",
    rsvpCalendarButton:"Lưu ngày vui vào lịch",
    guestSummaryLabel:"Phản hồi dành cho",
    attendingQ:"Bạn có thể đến chung vui cùng chúng mình không?",
    yes:"Mình sẽ đến chung vui",no:"Tiếc quá, mình không đến được",
    venueQuestion:"Chúng mình sẽ được đón bạn ở đâu?",
    venueVinh:"Nghệ An",
    venueHCM:"TP. Hồ Chí Minh",
    rsvpSeeYou:"Hẹn gặp bạn tại",
    venueSummary:"tiệc cưới ở {venue}!",
    venueRequired:"Bạn chọn giúp chúng mình tiệc tại Vinh hoặc TP. Hồ Chí Minh nhé.",
    rsvpMaintenance:"Phần xác nhận đang được cập nhật. Vui lòng thử lại khi hệ thống hoàn tất.",
    partySize:"Số người tham dự (bao gồm bạn)",
    partySizeHelp:"Vui lòng tính cả bạn trong tổng số người.",
    partySummary:"Chúng mình sẽ đón {count} người, bao gồm bạn.",
    partySizeInvalid:"Vui lòng nhập số người từ 1 đến 10.",
    successYes:"Cảm ơn bạn! Chúng mình đã nhận được xác nhận cho {count} người. Hẹn gặp bạn nhé!",
    successNo:"Cảm ơn bạn đã nhắn lại. Mong sớm có dịp gặp nhau nhé.",
    declineMessage:"💗 Cảm ơn {name} đã nhắn lại. Chúng mình tiếc vì không được đón bạn trong ngày cưới. Nếu muốn gửi đôi lời chúc, bạn để lại bên dưới nhé. Chúng mình sẽ trân quý những lời chúc ấy. 💌",
    wishes:"Đôi lời chúc dành cho Linh & Thắng",
    wishesPlaceholder:"Bạn gửi chúng mình một lời chúc nhé…",
    submit:"Gửi lời xác nhận",
    preview:"Phần xác nhận tham dự đang được kết nối. Vui lòng chưa gửi phản hồi tại đây.",
    missingInvite:"Bạn mở lại link thiệp riêng mà Linh & Thắng đã gửi để xác nhận tham dự nhé.",
    guestLoading:"Đang mở lời mời dành riêng cho bạn…",
    guestInvalid:"Link thiệp này chưa đúng. Bạn kiểm tra lại link hoặc nhắn Linh & Thắng để chúng mình gửi lại nhé.",
    guestUnavailable:"Chưa tải được tên khách mời. Bạn thử tải lại trang hoặc nhắn Linh & Thắng nhé.",
    guestNotReady:"Thiệp của bạn đang chờ xác nhận sự kiện. Bạn nhắn Linh & Thắng để chúng mình hỗ trợ nhé.",
    pending:"Đang gửi lời xác nhận của bạn…",
    success:"Cảm ơn bạn! Chúng mình đã nhận được lời xác nhận rồi.",
    error:"Lời xác nhận chưa gửi được. Bạn thử lại nhé.",
    uncertain:"Chưa thể xác nhận phản hồi đã được lưu hay chưa. Vui lòng tải lại trang để kiểm tra, không gửi nhiều lần.",
    pageTitle:"Thiệp cưới Linh & Thang",
    pageDescription:"Thiệp cưới của Linh và Thang",
    brandAria:"Linh và Thang",
    languageAria:"Chọn ngôn ngữ",
    imageAlt:"Tranh màu nước chân dung cưới của Linh và Thắng"
  },
  en:{
    weddingOf:"WE'RE GETTING MARRIED",
    heroTagline:"A new chapter, with our favorite people.",
    formalInvite:"WE'D LOVE TO CELEBRATE WITH YOU",
    inviteCopy:"Come celebrate our wedding day with us and our families. It wouldn't be the same without you.",
    wedding:"OUR WEDDING DAY",
    celebrationsTitle:"OUR CELEBRATIONS",
    celebrationNote:"We're sending this invitation from afar, as we can't give it to you in person. We'd love to have you with us on our wedding day.",
    vinhCelebration:"VINH CELEBRATION",
    hcmCelebration:"HO CHI MINH CITY CELEBRATION",
    vinhVenue:"Diamond Palace",
    vinhCity:"Nghe An Province, Vietnam",
    vinhDirections:"🚙💨 Directions to Diamond Palace",
    hcmDirections:"🚙💨 Directions to Capella Parkview",
    dateLabel:"Date",
    timeLabel:"Time",
    locationLabel:"Venue",
    city:"Ho Chi Minh City, Vietnam",
    rsvpButton:"Let us know",
    direction:"Get directions ↗",
    saveDate:"Add to calendar",
    storyOrigin:"Amsterdam — where we met",
    storyPhotoCoupleAlt:"Linh and Thang together",
    storyPhotoZaandamAlt:"Linh and Thang in Zaandam",
    storyTitle:"A LITTLE ABOUT US",
    musicSectionTitle:"OUR SONG",
    musicPlayLabel:"Play I Think They Call This Love (Cover)",
    musicPauseLabel:"Pause I Think They Call This Love (Cover)",
    musicLoading:"Loading music player…",
    musicReady:"Ready. Tap the record to play",
    musicTryingAutoplay:"Trying to play music automatically…",
    musicAutoplayBlocked:"Autoplay blocked. Tap the record to play",
    musicPlaying:"Playing through Spotify",
    musicPaused:"Music paused",
    musicUnavailable:"Player unavailable. You can open the song in Spotify below.",
    musicOpenSpotify:"Open in Spotify ↗",
    rsvpSignoff:"With love,\nLinh & Thang ♡",
    rsvpTitle:"CAN YOU MAKE IT?",
    rsvpIntro:"We really hope you can join us! Let us know below so we can plan for you.",
    rsvpDeadline:"Please RSVP by Wednesday, 10th Feb 2027,\nat 11:59 PM (VN time) or 5:59 PM (EU time).",
    rsvpReceivedIntro:"We've received your reply. Thank you for letting us know!",
    rsvpDeadlinePassedIntro:"RSVP is now closed.",
    rsvpClosedYes:"Thank you, {name}! We've noted {count} attending, including you.",
    rsvpClosedNo:"Thank you, {name}! We've noted that you can't make it.",
    rsvpClosedDeadline:"RSVP closed on February 10, 2027. Please contact Linh & Thang directly if your plans change.",
    rsvpClosedNotReady:"RSVP isn't open for this invitation. Please contact Linh & Thang.",
    rsvpEditHint:"Plans changed? You can update your RSVP until February 10, 2027, at 11:59 PM (Vietnam time) / 5:59 PM (CET).",
    rsvpEditButton:"Update my RSVP",
    rsvpEditingIntro:"Need to make a change? Update your reply below and save your changes.",
    rsvpCancelEdit:"Back to my RSVP",
    submitUpdate:"Save changes",
    rsvpCalendarButton:"Add to my calendar",
    guestSummaryLabel:"Replying for",
    attendingQ:"Will you be joining us?",
    yes:"Yes, I'll be there!",
    no:"Sorry, I can't",
    venueQuestion:"Which celebration will you be joining?",
    venueVinh:"Nghe An",
    venueHCM:"Ho Chi Minh City",
    rsvpSeeYou:"See you at our",
    venueSummary:"{venue} celebration!",
    venueRequired:"Please choose Vinh or Ho Chi Minh City.",
    rsvpMaintenance:"RSVP is being updated. Please check back when the update is complete.",
    partySize:"How many are coming (including you)?",
    partySizeHelp:"Please include yourself in the total.",
    partySummary:"That's {count} in your group, including you.",
    partySizeInvalid:"Please enter a number from 1 to 10.",
    successYes:"Yay, see you there! We've noted {count} attending. ♡",
    successNo:"Thanks for letting us know. We'll miss you! ♡",
    declineMessage:"{name}, thank you for being part of our journey and for all the lovely memories we've made along the way 🫶\n\nWe'll miss having you with us on our wedding day, but we're so glad our paths crossed.\n\nIf you'd like to leave us a little wish, we'd love to read it 😘",
    wishes:"A little note or wish for Linh & Thang",
    wishesPlaceholder:"Leave us a little wish, if you'd like...",
    submit:"Send my RSVP",
    preview:"RSVP isn't ready just yet. Please try again a little later.",
    missingInvite:"Please open your personal invitation link to send your RSVP.",
    guestLoading:"Just a sec, we're finding your invitation...",
    guestInvalid:"We couldn't find this invitation. Please double-check the link you received.",
    guestUnavailable:"We couldn't load your invitation right now. Please refresh and try again.",
    guestNotReady:"RSVP isn't open for this invitation yet. Please check with Linh & Thang.",
    pending:"Sending your RSVP...",
    success:"Thanks! We've received your RSVP.",
    error:"Something went wrong. Your RSVP may not have been saved. Please try again.",
    uncertain:"We couldn't confirm whether your response was saved. Please refresh the page to check before trying again.",
    pageTitle:"Linh & Thang | We're getting married!",
    pageDescription:"Come celebrate the wedding of Linh and Thang on February 28, 2027, in Ho Chi Minh City.",
    brandAria:"Linh and Thang",
    languageAria:"Choose a language",
    imageAlt:"Watercolour wedding portrait of Linh and Thang",
  }
};

// Only &vn and &en select a language; English is the default.
const languageParams = new URLSearchParams(window.location.search);
let lang = languageParams.has("vn") ? "vi" : "en";

function replaceLanguageInUrl(next) {
  const url = new URL(window.location.href);
  for (const key of ["lang", "vn", "en"]) url.searchParams.delete(key);
  url.searchParams.append(next === "vi" ? "vn" : "en", "");
  // Keep the flag bare (&vn), rather than URLSearchParams' default &vn=.
  url.search = url.searchParams.toString()
    .replace(/(^|&)(vn|en)=(?=&|$)/g, "$1$2");
  window.history.replaceState(
    window.history.state, "", url.pathname + url.search + url.hash
  );
}
if (languageParams.has("vn") || languageParams.has("en")) {
  replaceLanguageInUrl(lang);
} else if (languageParams.has("lang")) {
  // Discard the retired parameter without using its value.
  const url = new URL(window.location.href);
  url.searchParams.delete("lang");
  window.history.replaceState(
    window.history.state, "", url.pathname + url.search + url.hash
  );
}

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
  if(status?.dataset.messageKey){
    const template=copy[next][status.dataset.messageKey] || "";
    status.textContent=template.replace("{count}",status.dataset.confirmedCount || "");
  }
  refreshPartyConfirmation();
  refreshDeclineMessage();
  refreshRsvpPanel();
  const inviteNotice=document.getElementById("inviteGuestNotice");
  if(inviteNotice?.dataset.messageKey) inviteNotice.textContent=copy[next][inviteNotice.dataset.messageKey];
  document.querySelectorAll(".lang-btn").forEach(b=>{
    const active=b.dataset.lang===next;
    b.classList.toggle("active",active);
    b.setAttribute("aria-pressed",String(active));
  });
}
document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>{
  setLang(b.dataset.lang);
  replaceLanguageInUrl(b.dataset.lang);
}));

const yesBranch=document.getElementById("yesBranch");
const noBranch=document.getElementById("noBranch");
const partySizeField= document.querySelector('#yesBranch [name="party_size"]');
const venueFieldset=document.getElementById("rsvpVenueFieldset");
const venueRadios=[...document.querySelectorAll('input[name="venue"]')];
function refreshPartyConfirmation() {
  const value=Number(partySizeField.value);
  const el=document.getElementById("partyConfirmation");
  el.textContent=(Number.isInteger(value) && value>=1 && value<=10
    ?copy[lang].partySummary.replace("{count}",String(value))
    :copy[lang].partySizeInvalid);
}
document.querySelectorAll('input[name="attending"]').forEach(r=>r.addEventListener("change",()=>{
  const yes=document.querySelector('input[name="attending"][value="yes"]').checked;
  const no=document.querySelector('input[name="attending"][value="no"]').checked;
  yesBranch.classList.toggle("hidden",!yes);
  noBranch.classList.toggle("hidden",!no);
  partySizeField.disabled=!yes;
  partySizeField.required=yes;
  venueFieldset.disabled=!yes;
  venueRadios.forEach(option=>{
    option.disabled=!yes;
    option.required=yes;
  });
  refreshPartyConfirmation();
}));
partySizeField.addEventListener("input",refreshPartyConfirmation);


// Personal URL: ?i=chi-thu-tam-kp. Historical slugs remain valid.
// The name on the invitation is fetched from the private guest registry;
// the optional legacy "&to=" is only a fallback for previously shared URLs.
const inviteParams = new URLSearchParams(window.location.search);
const inviteCode = (inviteParams.get("i") || inviteParams.get("invite") || "").trim();
let inviteDisplayName = (inviteParams.get("to") || "").trim().slice(0,120);
// Keep legacy personalized links working, but remove display hints and
// referral tracking from the address bar after their values are read.
// The immutable invitation slug remains intact for backend verification.
if (inviteCode) {
  const cleanUrl = new URL(window.location.href);
  let changed = false;
  for (const key of [...cleanUrl.searchParams.keys()]) {
    if (key === "to" || key.startsWith("utm_")) {
      cleanUrl.searchParams.delete(key);
      changed = true;
    }
  }
  if (cleanUrl.hash === "#story") {
    cleanUrl.hash = "";
    changed = true;
  }
  if (changed) {
    window.history.replaceState(
      window.history.state,
      "",
      cleanUrl.pathname + cleanUrl.search.replace(/([?&])(vn|en)=(?=&|$)/g, "$1$2") + cleanUrl.hash
    );
  }
}
let inviteReady = false;
// Remember only guest names validated by the private registry, per browser.
// Future visits can paint the exact accented name at first HTML parse, while
// every RSVP still requires a fresh backend check.
const inviteCacheKey=inviteCode ? "ltw:verifiedGuest:"+inviteCode : "";
function readCachedInviteName() {
  if (!inviteCacheKey) return "";
  for (const kind of ["localStorage", "sessionStorage"]) {
    try {
      const store=window[kind];
      const c=JSON.parse(store.getItem(inviteCacheKey) || "null");
      if (c && typeof c.name==="string" && c.expires>Date.now())
        return c.name.trim().slice(0,120);
    } catch (_) { /* Storage can be blocked. */ }
  }
  return "";
}
function cacheVerifiedInviteName(name) {
  if (!inviteCacheKey) return;
  const entry=JSON.stringify({name:name, expires:Date.now()+3*24*60*60*1000});
  for (const kind of ["localStorage", "sessionStorage"]) {
    try { window[kind].setItem(inviteCacheKey,entry); } catch (_) { /* Not essential for RSVP. */ }
  }
}
function clearCachedInviteName() {
  if (!inviteCacheKey) return;
  for (const kind of ["localStorage", "sessionStorage"]) {
    try { window[kind].removeItem(inviteCacheKey); } catch (_) {}
  }
}
const cachedInviteName=readCachedInviteName();
const inviteLabel = document.getElementById("inviteGuestName");
const declineMessage = document.getElementById("declineMessage");
function refreshDeclineMessage() {
  const guest = inviteDisplayName || (lang==="vi" ? "bạn" : "you");
  declineMessage.textContent = copy[lang].declineMessage.replace("{name}",guest);
}
const inviteNotice = document.getElementById("inviteGuestNotice");
const rsvpGuestSummary = document.getElementById("rsvpGuestSummary");
const rsvpGuestName = document.getElementById("rsvpGuestName");
const submitButton = document.querySelector('#rsvpForm button[type="submit"]');
const rsvpForm = document.getElementById("rsvpForm");
const rsvpClosedPanel = document.getElementById("rsvpClosedPanel");
const rsvpClosedMessage = document.getElementById("rsvpClosedMessage");
const rsvpVenueSummary=document.getElementById("rsvpVenueSummary");
const rsvpSeeYou=document.getElementById("rsvpSeeYou");
const rsvpSignoff=document.getElementById("rsvpSignoff");
const rsvpEditControls = document.getElementById("rsvpEditControls");
const rsvpEditButton = document.getElementById("rsvpEditButton");
const rsvpActionRow = document.getElementById("rsvpActionRow");
const rsvpCalendarButton = document.getElementById("rsvpCalendarButton");
const rsvpCancelEdit = document.getElementById("rsvpCancelEdit");
const rsvpIntro = document.getElementById("rsvpIntro");
const rsvpDeadline = document.querySelector(".rsvp-deadline");
// The exact cutoff is February 10, 2027 at 23:59:59.999, Vietnam (UTC+7).
const RSVP_DEADLINE_UTC = Date.parse("2027-02-10T23:59:59.999+07:00");
const rsvpDeadlinePassed = () => Date.now() > RSVP_DEADLINE_UTC;
let rsvpView = {kind:"open",attending:null,partySize:0,venue:""};
let savedRsvp = {attending:null,partySize:0,venue:""};
let rsvpEditAllowed = false;
let editingRsvp = false;
let submissionUncertain = false;
function refreshRsvpPanel() {
  const closed = rsvpView.kind !== "open";
  rsvpForm.classList.toggle("hidden", closed);
  rsvpClosedPanel.classList.toggle("hidden", !closed);
  rsvpIntro.textContent = copy[lang][
    editingRsvp ? "rsvpEditingIntro" :
    rsvpView.kind === "responded" ? "rsvpReceivedIntro" :
    rsvpView.kind === "deadline" ? "rsvpDeadlinePassedIntro" : "rsvpIntro"
  ];
  const confirmed = rsvpView.kind === "responded";
  rsvpSignoff.classList.toggle("hidden", !confirmed);
  rsvpDeadline.classList.toggle("hidden", confirmed);
  const canChange = closed && confirmed && rsvpEditAllowed &&
    !rsvpDeadlinePassed() && !submissionUncertain;
  rsvpEditControls.classList.toggle("hidden", !canChange);
  const showCalendar = closed && confirmed && rsvpView.attending === "yes" &&
    (rsvpView.venue === "HCM" || rsvpView.venue === "Vinh");
  if (showCalendar) {
    const isVinh = rsvpView.venue === "Vinh";
    rsvpCalendarButton.href = isVinh
      ? "https://linhthangwedding.github.io/assets/linh-thang-wedding-vinh.ics"
      : "https://linhthangwedding.github.io/assets/linh-thang-wedding.ics";
    rsvpCalendarButton.download = isVinh
      ? "Linh-Thang-Wedding-Vinh.ics" : "Linh-Thang-Wedding.ics";
  }
  rsvpEditButton.classList.toggle("hidden", !canChange);
  rsvpCalendarButton.classList.toggle("hidden", !showCalendar);
  rsvpActionRow.classList.toggle("hidden", !(canChange || showCalendar));
  rsvpCancelEdit.classList.toggle("hidden", !editingRsvp);
  submitButton.textContent = copy[lang][editingRsvp ? "submitUpdate" : "submit"];
  if (!closed) return;
  const key = confirmed
    ? (rsvpView.attending === "yes" ? "rsvpClosedYes" : "rsvpClosedNo")
    : (rsvpView.kind === "deadline" ? "rsvpClosedDeadline" :
      rsvpView.kind === "maintenance" ? "rsvpMaintenance" : "rsvpClosedNotReady");
  rsvpClosedMessage.textContent = copy[lang][key]
    .replace("{name}", inviteDisplayName || (lang === "vi" ? "bạn" : "friend"))
    .replace("{count}", String(rsvpView.partySize));
  const selectedVenue = rsvpView.venue === "Vinh" ? copy[lang].venueVinh :
    rsvpView.venue === "HCM" ? copy[lang].venueHCM : "";
  const showVenue = confirmed && rsvpView.attending === "yes" && Boolean(selectedVenue);
  rsvpVenueSummary.classList.toggle("hidden", !showVenue);
  rsvpSeeYou.classList.toggle("hidden", !showVenue);
  rsvpVenueSummary.textContent = selectedVenue ? copy[lang].venueSummary.replace("{venue}",selectedVenue) : "";
}
function closeRsvp(kind, attending, count, venue) {
  const selectedVenue = attending === "yes" && ["Vinh","HCM"].includes(venue) ? venue : "";
  rsvpView = {kind, attending:attending || null, partySize:Number(count)||0,venue:selectedVenue};
  if (kind === "responded") {
    savedRsvp = {...rsvpView};
  }
  editingRsvp = false;
  inviteReady = false;
  submitButton.disabled = true;
  refreshRsvpPanel();
}
rsvpEditButton.addEventListener("click", () => {
  if (!rsvpEditAllowed || rsvpDeadlinePassed() || submissionUncertain ||
      rsvpView.kind !== "responded" || !savedRsvp.attending) return;
  editingRsvp = true;
  rsvpView = {kind:"open",attending:null,partySize:0,venue:""};
  inviteReady = true;
  const savedChoice = document.querySelector(
    'input[name="attending"][value="' + savedRsvp.attending + '"]'
  );
  savedChoice.checked = true;
  venueRadios.forEach(option=>{option.checked=option.value===savedRsvp.venue;});
  partySizeField.value = String(savedRsvp.partySize || 1);
  savedChoice.dispatchEvent(new Event("change", {bubbles:true}));
  refreshRsvpPanel();
  submitButton.disabled = false;
});
rsvpCancelEdit.addEventListener("click", () => {
  if (submissionUncertain || rsvpCancelEdit.disabled) return;
  closeRsvp("responded", savedRsvp.attending, savedRsvp.partySize, savedRsvp.venue);
});
document.getElementById("rsvpInvite").value = inviteCode;
// All RSVP submissions require a verified personalized link.
submitButton.disabled = true;

function applyGuestName(value){
  inviteDisplayName = String(value || "").trim().slice(0,120);
  if (!inviteDisplayName) return;
  inviteLabel.textContent = inviteDisplayName;
  inviteLabel.classList.remove("hidden");
  rsvpGuestName.textContent = inviteDisplayName;
  rsvpGuestSummary.classList.remove("hidden");
  refreshDeclineMessage();
}
if (inviteCode && (inviteDisplayName || cachedInviteName)) {
  applyGuestName(inviteDisplayName || cachedInviteName);
}
function showInviteNotice(key) {
  inviteNotice.dataset.messageKey = key || "";
  inviteNotice.classList.toggle("hidden", !key);
  inviteNotice.textContent = key ? copy[lang][key] : "";
}
function showRSVPStatus(key) {
  const el = document.getElementById("formStatus");
  el.dataset.messageKey = key || "";
  delete el.dataset.confirmedCount;
  el.textContent = key ? copy[lang][key] : "";
}
function showRSVPConfirmation(attending,count) {
  const el=document.getElementById("formStatus");
  const key=attending==="yes"?"successYes":"successNo";
  el.dataset.messageKey=key;
  el.dataset.confirmedCount=String(count);
  el.textContent=copy[lang][key].replace("{count}",String(count));
}

// Apps Script ContentService has no regular CORS headers. A no-cors POST
// writes the response; a read-only JSONP receipt check confirms it reached
// the spreadsheet, so the site never displays success based on an opaque POST.
function readRSVPData(action, params = {}) {
  return new Promise((resolve, reject) => {
    if (!RSVP_ENDPOINT) return reject(new Error("RSVP endpoint missing"));
    const callback = "ltRsvp" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const endpoint = new URL(RSVP_ENDPOINT);
    endpoint.searchParams.set("action", action);
    endpoint.searchParams.set("invite", inviteCode);
    for (const [key, value] of Object.entries(params)) {
      endpoint.searchParams.set(key, value);
    }
    endpoint.searchParams.set("callback", callback);
    endpoint.searchParams.set("nocache", String(Date.now()));
    let settled = false;
    const cleanup = () => {
      delete window[callback];
      script.remove();
      clearTimeout(timeout);
    };
    const finish = (err, result) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (err) reject(err);
      else resolve(result);
    };
    window[callback] = (result) => finish(null, result);
    script.onerror = () => finish(new Error("RSVP lookup unavailable"));
    const timeout = setTimeout(() => finish(new Error("RSVP lookup timed out")), 20000);
    script.src = endpoint.toString();
    document.head.appendChild(script);
  });
}
function readRSVPReceipt(receipt) {
  return readRSVPData("status", {receipt});
}

async function resolveInviteName() {
  if (!inviteCode) return;
  // Don't show a loading message when a previously verified name is visible.
  showInviteNotice(inviteDisplayName ? null : "guestLoading");
  if (!RSVP_ENDPOINT) {
    showInviteNotice("guestUnavailable");
    return;
  }
  // Apps Script's first request after deployment can be slow.
  // Retry once so temporary cold starts do not leave invitations blank.
  let failedKey = "guestUnavailable";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // The first lookup started in the document head, in parallel with
      // HTML rendering. Reuse that result instead of starting another request.
      const guest = attempt===0 && window.__ltwEarlyGuestLookup
        ? await window.__ltwEarlyGuestLookup
        : await readRSVPData("guest");
      if (guest && guest.valid === true && typeof guest.name === "string" && guest.name.trim()) {
        applyGuestName(guest.name);
        cacheVerifiedInviteName(inviteDisplayName);
        const venueBackendReady = guest.venueSupported === true;
        inviteReady = venueBackendReady && guest.canRsvp === true && !rsvpDeadlinePassed();
        rsvpEditAllowed = venueBackendReady && guest.canEdit === true && !rsvpDeadlinePassed();
        if (guest.responded === true) {
          closeRsvp("responded", guest.attending, guest.partySize, guest.venue);
        } else if (guest.deadlinePassed === true || rsvpDeadlinePassed()) {
          closeRsvp("deadline");
        } else if (!inviteReady) {
          closeRsvp(venueBackendReady ? "notready" : "maintenance");
        } else {
          rsvpView = {kind:"open",attending:null,partySize:0,venue:""};
          refreshRsvpPanel();
        }
        submitButton.disabled = !inviteReady;
        showInviteNotice(null);
        showRSVPStatus(venueBackendReady ? null : "rsvpMaintenance");
        return;
      }
      if (guest && guest.invalid === true) {
        clearCachedInviteName();
        // Do not leave an unverified URL-provided name visible on an invalid link.
        inviteDisplayName="";
        inviteLabel.textContent="";
        inviteLabel.classList.add("hidden");
        rsvpGuestName.textContent="";
        rsvpGuestSummary.classList.add("hidden");
        failedKey = "guestInvalid";
        break;
      }
      if (guest && guest.error) console.warn("RSVP guest lookup:", guest.error);
    } catch (error) {
      console.warn("RSVP guest lookup failed", error);
    }
    if (attempt === 0) await wait(800);
  }
  // If legacy links carried the name, display it, but never claim the
  // guest is verified or enable sending RSVP without the backend.
  if (inviteDisplayName) applyGuestName(inviteDisplayName);
  showInviteNotice(failedKey);
  showRSVPStatus(failedKey);
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

document.getElementById("rsvpForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form).entries());
  if (!inviteCode || !inviteDisplayName || !inviteReady || rsvpView.kind !== "open" || submissionUncertain) {
    showRSVPStatus("missingInvite");
    return;
  }
  if (!RSVP_ENDPOINT) {
    showRSVPStatus("preview");
    return;
  }
  if (rsvpDeadlinePassed()) {
    closeRsvp("deadline");
    return;
  }
  if (!["yes", "no"].includes(data.attending)) return;
  const people=data.attending==="yes" ? Number(data.party_size) : 0;
  const venue=data.attending==="yes" ? String(data.venue||"") : "";
  if (data.attending==="yes" && !["Vinh","HCM"].includes(venue)) {
    showRSVPStatus("venueRequired");
    venueRadios[0].focus();
    return;
  }
  if (data.attending==="yes" &&
      (!Number.isInteger(people)||people<1||people>10)) {
    showRSVPStatus("partySizeInvalid");
    partySizeField.focus();
    return;
  }

  const receipt = (window.crypto?.randomUUID?.() ||
    (String(Date.now()) + Math.random().toString(36).slice(2)));
  const body = new URLSearchParams({
    invite: inviteCode,
    attending: data.attending,
    party_size: String(people),
    venue: venue,
    wishes: data.wishes || "",
    language: lang,
    receipt: receipt
  });

  button.disabled = true;
  rsvpCancelEdit.disabled = true;
  showRSVPStatus("pending");
  try {
    // Opaque responses do not count as confirmation.
    await fetch(RSVP_ENDPOINT, {
      method: "POST", mode: "no-cors", body, cache: "no-store"
    });
    // The POST request has completed. Check its receipt immediately; no
    // mandatory 1.1-second delay before the first check. Retry if needed.
    let stored = false;
    let previousReply = null;
    for (const delay of [0,300,550,850,1250,1800]) {
      if (delay) await wait(delay);
      try {
        const check = await readRSVPReceipt(receipt);
        if (check?.saved === true && (data.attending==="no" || check.venue===venue)) {
          stored = true;
          break;
        }
        if (check?.responded === true && !editingRsvp) {
          previousReply = check;
          break;
        }
        if (check?.invalid === true) break;
      } catch (_) { /* Retry transient receipt-check failures. */ }
    }
    if (stored) {
      showRSVPConfirmation(data.attending, people);
      closeRsvp("responded", data.attending, people, venue);
    } else if (previousReply) {
      closeRsvp("responded", previousReply.attending, previousReply.partySize, previousReply.venue);
    } else {
      // A no-cors POST can succeed despite a failed receipt lookup. Avoid
      // offering a second submission until the page checks the server again.
      submissionUncertain = true;
      showRSVPStatus("uncertain");
    }
  } catch (_) {
    submissionUncertain = true;
    showRSVPStatus("uncertain");
  } finally {
    button.disabled = !inviteReady || submissionUncertain || rsvpView.kind !== "open";
    rsvpCancelEdit.disabled = submissionUncertain;
  }
});

setLang(lang);
if (!inviteCode) showRSVPStatus("missingInvite");
resolveInviteName();

// Play the uploaded full song through the vinyl control.
(function initWeddingVinylPlayer() {
  const player = document.getElementById("vinylPlayer");
  const button = document.getElementById("vinylPlayButton");
  const status = document.getElementById("vinylStatus");
  if (!player || !button || !status) return;

  Object.assign(copy.vi, {
    musicPlayLabel: "Phát I Do – 911",
    musicPauseLabel: "Tạm dừng I Do – 911",
    musicPlaying: "Đang phát I Do – 911",
    musicAutoplayBlocked: "Chạm vào trang để bắt đầu nghe nhạc",
    musicUnavailable: "Không tải được nhạc. Bạn thử tải lại trang nhé."
  });
  Object.assign(copy.en, {
    musicPlayLabel: "Play I Do – 911",
    musicPauseLabel: "Pause I Do – 911",
    musicPlaying: "Playing I Do – 911",
    musicAutoplayBlocked: "Tap the page to start the music",
    musicUnavailable: "Music unavailable. Please reload the page."
  });

  const audio = new Audio("assets/i-do-911.m4a");
  audio.preload = "auto";
  audio.loop = true;
  audio.volume = 0.2;

  function message(key) {
    status.dataset.i18n = key;
    status.textContent = copy[lang][key] || "";
  }

  function update() {
    const playing = !audio.paused && !audio.ended;
    player.classList.toggle("is-playing", playing);
    button.setAttribute("aria-pressed", String(playing));
    const key = playing ? "musicPauseLabel" : "musicPlayLabel";
    button.dataset.i18nAriaLabel = key;
    button.setAttribute("aria-label", copy[lang][key]);
    message(playing ? "musicPlaying" : "musicPaused");
  }

  let playAttempt = 0;
  async function play() {
    const attempt = ++playAttempt;
    try {
      audio.volume = 0.2;
      await audio.play();
    } catch (error) {
      if (attempt !== playAttempt) return;
      message(error.name === "NotAllowedError"
        ? "musicAutoplayBlocked" : "musicUnavailable");
    }
  }

  // If opening the page cannot start sound, use the first ordinary interaction.
  // The record keeps its own play/pause behavior, including keyboard activation.
  function startOnInteraction(event) {
    if (button.contains(event.target)) return;
    if (event.type === "keydown" &&
        (event.ctrlKey || event.metaKey || event.altKey ||
         ["Tab", "Escape", "Shift", "Control", "Alt", "Meta"].includes(event.key))) return;
    if (audio.paused) play();
  }
  function stopInteractionFallback() {
    document.removeEventListener("click", startOnInteraction);
    document.removeEventListener("keydown", startOnInteraction);
  }
  document.addEventListener("click", startOnInteraction);
  document.addEventListener("keydown", startOnInteraction);
  audio.addEventListener("playing", stopInteractionFallback);

  button.disabled = false;
  button.addEventListener("click", () => {
    if (audio.paused) play();
    else audio.pause();
  });
  audio.addEventListener("playing", update);
  audio.addEventListener("pause", update);
  audio.addEventListener("error", () => message("musicUnavailable"));

  update();
  message("musicTryingAutoplay");
  play();
})();
// Shared polaroid hearts. The API receives only a random browser token;
// invitation codes and guest names never accompany a photo-heart request.
(function initPhotoHearts(){
  const gallery=document.querySelector(".polaroid-gallery");
  const buttons=[...document.querySelectorAll("[data-photo-heart]")];
  const status=document.getElementById("photoHeartStatus");
  if(!gallery || !buttons.length || !status) return;
  const photos=buttons.map(button=>button.dataset.photoHeart);
  const storageKey="ltw:photo-heart-client:v1";
  const validClient=value=>/^[a-f0-9]{32}$/.test(value || "");
  const validTotal=value=>Number.isSafeInteger(value) && value>=0 && value<=999999999;
  let client="";
  for(const kind of ["localStorage","sessionStorage"]){
    try{
      const saved=window[kind].getItem(storageKey);
      if(validClient(saved)){client=saved;break;}
    }catch(_){}
  }
  if(!client){
    const bytes=new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    client=Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
    for(const kind of ["localStorage","sessionStorage"]){
      try{window[kind].setItem(storageKey,client);}catch(_){}
    }
  }
  const tapsKey=()=>"ltw:photo-heart-taps:v2:"+client;
  const blankTotals=()=>Object.fromEntries(photos.map(photo=>[photo,0]));
  function storedTotals(){
    const totals=blankTotals();
    for(const kind of ["localStorage","sessionStorage"]){
      try{
        const saved=JSON.parse(window[kind].getItem(tapsKey()) || "{}");
        for(const photo of photos) if(validTotal(saved?.[photo]))
          totals[photo]=Math.max(totals[photo],saved[photo]);
      }catch(_){}
    }
    return totals;
  }
  let desired=storedTotals(),unallocated=blankTotals();
  let snapshot=null,ready=false,saving=false,allocating=false,inView=false;
  let serial=0,appliedSerial=0,reading=null,retryTimer=null,retryDelay=1500;
  const isVietnamese=()=>document.documentElement.lang==="vi";
  const pending=()=>snapshot && photos.some(photo=>desired[photo]>snapshot.mine[photo]);
  function persist(){
    const saved=storedTotals();
    for(const photo of photos) desired[photo]=Math.max(desired[photo],saved[photo]);
    for(const kind of ["localStorage","sessionStorage"]){
      try{window[kind].setItem(tapsKey(),JSON.stringify(desired));}catch(_){}
    }
  }
  function render(){
    buttons.forEach(button=>{
      const photo=button.dataset.photoHeart;
      const extra=snapshot?Math.max(0,desired[photo]-snapshot.mine[photo])+unallocated[photo]:0;
      const count=snapshot?snapshot.counts[photo]+extra:null;
      button.querySelector(".photo-heart-count").textContent=count===null?"—":String(count);
      button.setAttribute("data-hearted",String(!!snapshot && (desired[photo]>0 || unallocated[photo]>0)));
      button.setAttribute("aria-busy",String(extra>0));
      const action=isVietnamese()?"Thả thêm tim cho ảnh này":"Send another heart to this photo";
      const total=count===null?"":(isVietnamese()?", "+count+" lượt tim":"; "+count+" hearts");
      button.setAttribute("aria-label",action+total);
      button.disabled=!ready;
    });
  }
  function floatHeart(button){
    const heart=document.createElement("span");
    heart.className="photo-heart-float";
    heart.setAttribute("aria-hidden","true");
    heart.style.setProperty("--heart-drift",(Math.random()*64-32).toFixed(1)+"px");
    heart.style.setProperty("--heart-turn",(Math.random()*36-18).toFixed(1)+"deg");
    heart.appendChild(button.querySelector("svg").cloneNode(true));
    button.parentElement.appendChild(heart);
    heart.addEventListener("animationend",()=>heart.remove(),{once:true});
    setTimeout(()=>heart.remove(),1800);
  }
  function request(action,params={}){
    return new Promise((resolve,reject)=>{
      const callback="ltPhotoHearts"+Math.random().toString(36).slice(2);
      const script=document.createElement("script");
      const endpoint=new URL(RSVP_ENDPOINT);
      endpoint.searchParams.set("action",action);
      endpoint.searchParams.set("client",client);
      endpoint.searchParams.set("callback",callback);
      endpoint.searchParams.set("nocache",String(Date.now()));
      for(const [key,value] of Object.entries(params)) endpoint.searchParams.set(key,value);
      let settled=false;
      const finish=(error,data)=>{
        if(settled) return;
        settled=true;
        clearTimeout(timer);
        script.remove();
        delete window[callback];
        if(error) reject(error);else resolve(data);
      };
      const timer=setTimeout(()=>finish(new Error("Photo hearts timed out")),20000);
      window[callback]=data=>{
        const valid=data?.ok===true && data.heartsSupported===true && data.heartsVersion>=2 &&
          photos.every(photo=>Number.isSafeInteger(data.counts?.[photo]) && data.counts[photo]>=0 &&
            validTotal(data.mine?.[photo]) && data.counts[photo]>=data.mine[photo]);
        finish(valid?null:new Error("Photo hearts unavailable"),data);
      };
      script.onerror=()=>finish(new Error("Photo hearts unavailable"));
      script.src=endpoint.toString();
      document.head.appendChild(script);
    });
  }
  function accept(data){
    // Another tab can finish a newer save before an older response arrives.
    if(snapshot) for(const photo of photos){
      if(data.mine[photo]<snapshot.mine[photo]){
        data.mine[photo]=snapshot.mine[photo];
        data.counts[photo]=snapshot.counts[photo];
      }
    }
    snapshot=data;ready=true;
    for(const photo of photos) desired[photo]=Math.max(desired[photo],data.mine[photo]);
    persist();retryDelay=1500;
    status.textContent="";
    render();
  }
  function scheduleRetry(){
    if(retryTimer!==null) return;
    retryTimer=setTimeout(()=>{
      retryTimer=null;
      if(pending()) synchronize();else refresh();
    },retryDelay);
    retryDelay=Math.min(retryDelay*2,15000);
  }
  function refresh(){
    if(saving || pending()) return synchronize();
    if(reading) return reading;
    const requestSerial=++serial,requestClient=client;
    reading=request("photo-hearts").then(data=>{
      if(client!==requestClient || saving || pending() || requestSerial<appliedSerial) return;
      appliedSerial=requestSerial;
      accept(data);
    }).catch(()=>{
      if(!snapshot) status.textContent=isVietnamese()?"Đang kết nối lượt tim.":"Connecting photo hearts.";
      scheduleRetry();
    }).finally(()=>{
      reading=null;
      if(pending()) synchronize();
    });
    return reading;
  }
  async function synchronize(){
    if(saving || !ready || !pending()) return;
    saving=true;
    const requestClient=client;
    try{
      while(pending() && client===requestClient){
        const photo=photos.find(id=>desired[id]>snapshot.mine[id]);
        const target=desired[photo];
        const data=await request("photo-heart",{photo,taps:String(target)});
        if(client!==requestClient) break;
        accept(data);
      }
      if(client===requestClient)
        status.textContent=isVietnamese()?"Đã lưu lượt tim.":"Hearts saved.";
    }catch(_){
      // Keep the visible count and persisted target. Retrying the same cumulative
      // total is safe even when the server saved it but its response was lost.
      status.textContent=isVietnamese()?"Lượt tim đang chờ kết nối để lưu.":
        "Your hearts will save when the connection returns.";
      scheduleRetry();
    }finally{
      saving=false;render();
      if(client!==requestClient) refresh();
    }
  }
  function allocateTaps(){
    if(allocating) return;
    allocating=true;
    const requestClient=client;
    const allocate=()=>{
      if(client!==requestClient) return;
      const saved=storedTotals();
      for(const photo of photos){
        desired[photo]=Math.min(999999999,Math.max(desired[photo],saved[photo],
          snapshot?.mine[photo] || 0)+unallocated[photo]);
        unallocated[photo]=0;
      }
      persist();render();
    };
    // Serialize allocation between tabs without delaying this tap's animation
    // or immediate count. Each tab still sends idempotent cumulative totals.
    const locks=window.navigator?.locks;
    if(locks){
      locks.request(tapsKey(),allocate).catch(allocate).finally(()=>{
        allocating=false;
        if(photos.some(photo=>unallocated[photo])) allocateTaps();
        synchronize();
      });
    }else{
      allocate();allocating=false;synchronize();
    }
  }
  buttons.forEach(button=>button.addEventListener("click",()=>{
    if(!ready || !snapshot) return;
    const photo=button.dataset.photoHeart;
    unallocated[photo]++;
    appliedSerial=++serial;
    floatHeart(button);render();allocateTaps();
  }));
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  if("IntersectionObserver" in window){
    new IntersectionObserver(entries=>{
      inView=entries.some(entry=>entry.isIntersecting);
      if(inView) refresh();
    },{rootMargin:"160px"}).observe(gallery);
  }else inView=true;
  setInterval(()=>{
    if(inView && document.visibilityState==="visible") refresh();
  },15000);
  const reconnect=()=>{
    if(retryTimer!==null){clearTimeout(retryTimer);retryTimer=null;}
    if(pending()) synchronize();else refresh();
  };
  window.addEventListener("focus",()=>{if(inView) reconnect();});
  window.addEventListener("online",reconnect);
  window.addEventListener("pageshow",event=>{if(event.persisted) reconnect();});
  document.addEventListener("visibilitychange",()=>{
    if(inView && document.visibilityState==="visible") reconnect();
  });
  window.addEventListener("storage",event=>{
    if(event.key===storageKey && validClient(event.newValue) && event.newValue!==client){
      client=event.newValue;desired=storedTotals();unallocated=blankTotals();
      snapshot=null;ready=false;appliedSerial=++serial;render();refresh();
    }else if(event.key===tapsKey()){
      const saved=storedTotals();
      for(const photo of photos) desired[photo]=Math.max(desired[photo],saved[photo]);
      render();synchronize();
    }
  });
  render();refresh();
})();

