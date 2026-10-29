const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbwDA6HVjo0JZUM0dCiPjVwNB2Whzjgsr4IiuTxulmd2LDijhpfQ3SR_c34VVJ6mXHNRxQ/exec"; // Google Apps Script deployed Web App.

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
    preview:"Phần xác nhận tham dự đang được kết nối. Vui lòng chưa gửi phản hồi tại đây.",
    missingInvite:"Vui lòng mở đường dẫn thiệp riêng mà Linh & Thang gửi cho bạn để xác nhận tham dự.",
    guestLoading:"Đang tải tên khách mời từ danh sách thiệp...",
    guestInvalid:"Không tìm thấy thiệp tương ứng với đường dẫn này. Vui lòng kiểm tra link được gửi.",
    guestUnavailable:"Chưa tải được tên khách mời. Vui lòng thử lại sau khi hệ thống được cập nhật.",
    guestNotReady:"Thiệp của bạn đang chờ xác nhận sự kiện. Vui lòng liên hệ Linh & Thang.",
    pending:"Đang kiểm tra phản hồi của bạn...",
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
    preview:"Online RSVP is being connected. Responses cannot be submitted yet.",
    missingInvite:"Please use the personalized invitation link sent by Linh & Thang to RSVP.",
    guestLoading:"Loading your invitation name...",
    guestInvalid:"This invitation link was not found. Please check the link you received.",
    guestUnavailable:"We could not load your invitation name yet. Please try again later.",
    guestNotReady:"This invitation is pending event confirmation. Please contact Linh & Thang.",
    pending:"Checking your response...",
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
  const inviteNotice=document.getElementById("inviteGuestNotice");
  if(inviteNotice?.dataset.messageKey) inviteNotice.textContent=copy[next][inviteNotice.dataset.messageKey];
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("active",b.dataset.lang===next));
}
document.querySelectorAll(".lang-btn").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));

const yesBranch=document.getElementById("yesBranch");
const noBranch=document.getElementById("noBranch");
document.querySelectorAll('input[name="attending"]').forEach(r=>r.addEventListener("change",()=>{
  yesBranch.classList.toggle("hidden",!(r.checked&&r.value==="yes"));
  noBranch.classList.toggle("hidden",!(r.checked&&r.value==="no"));
}));


// Personal URL: ?i=chi-thu-tam-kp. Historical slugs remain valid.
// The name on the invitation is fetched from the private guest registry;
// the optional legacy "&to=" is only a fallback for previously shared URLs.
const inviteParams = new URLSearchParams(window.location.search);
const inviteCode = (inviteParams.get("i") || inviteParams.get("invite") || "").trim();
let inviteDisplayName = (inviteParams.get("to") || "").trim().slice(0,120);
let inviteReady = false;
const inviteLabel = document.getElementById("inviteGuestName");
const inviteNotice = document.getElementById("inviteGuestNotice");
const guestNameField = document.querySelector('#rsvpForm [name="guest_name"]');
const submitButton = document.querySelector('#rsvpForm button[type="submit"]');
document.getElementById("rsvpInvite").value = inviteCode;
guestNameField.readOnly = !!inviteCode;
if (inviteCode) submitButton.disabled = true;

function applyGuestName(value){
  inviteDisplayName = String(value || "").trim().slice(0,120);
  if (!inviteDisplayName) return;
  inviteLabel.textContent = inviteDisplayName;
  inviteLabel.classList.remove("hidden");
  guestNameField.value = inviteDisplayName;
  guestNameField.readOnly = true;
}
if (inviteCode && inviteDisplayName) applyGuestName(inviteDisplayName);

function showInviteNotice(key) {
  inviteNotice.dataset.messageKey = key || "";
  inviteNotice.classList.toggle("hidden", !key);
  inviteNotice.textContent = key ? copy[lang][key] : "";
}
function showRSVPStatus(key) {
  const el = document.getElementById("formStatus");
  el.dataset.messageKey = key || "";
  el.textContent = key ? copy[lang][key] : "";
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
  showInviteNotice("guestLoading");
  if (!RSVP_ENDPOINT) {
    showInviteNotice("guestUnavailable");
    return;
  }
  // Apps Script's first request after deployment can be slow.
  // Retry once so temporary cold starts do not leave invitations blank.
  let failedKey = "guestUnavailable";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const guest = await readRSVPData("guest");
      if (guest && guest.valid === true && typeof guest.name === "string" && guest.name.trim()) {
        applyGuestName(guest.name);
        inviteReady = guest.canRsvp === true;
        submitButton.disabled = !inviteReady;
        showInviteNotice(inviteReady ? null : "guestNotReady");
        showRSVPStatus(null);
        return;
      }
      if (guest && guest.invalid === true) {
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
  if (!inviteCode || !inviteDisplayName || !inviteReady) {
    showRSVPStatus("missingInvite");
    return;
  }
  if (!RSVP_ENDPOINT) {
    showRSVPStatus("preview");
    return;
  }
  if (!["yes", "no"].includes(data.attending)) return;

  const receipt = (window.crypto?.randomUUID?.() ||
    (String(Date.now()) + Math.random().toString(36).slice(2)));
  const body = new URLSearchParams({
    invite: inviteCode,
    attending: data.attending,
    party_size: data.attending === "yes" ? String(data.party_size || 1) : "0",
    wishes: data.wishes || "",
    language: lang,
    receipt: receipt
  });

  button.disabled = true;
  showRSVPStatus("pending");
  try {
    // Opaque responses do not count as confirmation.
    await fetch(RSVP_ENDPOINT, {
      method: "POST", mode: "no-cors", body, cache: "no-store"
    });
    let stored = false;
    for (let i = 0; i < 5; i++) {
      await wait(i === 0 ? 1100 : 1900);
      try {
        const check = await readRSVPReceipt(receipt);
        if (check?.saved === true) {
          stored = true;
          break;
        }
        if (check?.invalid === true) break;
      } catch (_) { /* Retry transient receipt-check failures. */ }
    }
    showRSVPStatus(stored ? "success" : "error");
  } catch (_) {
    showRSVPStatus("error");
  } finally {
    button.disabled = false;
  }
});

setLang("vi");
resolveInviteName();
