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
    storySignoff:"Thương mến,\nLinh & Thắng ♡",
    rsvpTitle:"XÁC NHẬN THAM DỰ",
    rsvpIntro:"Rất mong được đón tiếp bạn trong ngày đặc biệt của chúng mình.",
    guestSummaryLabel:"Phản hồi dành cho",
    attendingQ:"Bạn có thể tham dự không?",
    yes:"Có",no:"Không",
    partySize:"Số người tham dự (bao gồm bạn)",
    partySizeHelp:"Vui lòng tính cả bạn trong tổng số người.",
    partySummary:"Bạn sẽ xác nhận: {count} người tham dự.",
    partySizeInvalid:"Vui lòng nhập số người từ 1 đến 10.",
    successYes:"Cảm ơn bạn! Chúng mình đã ghi nhận {count} người tham dự.",
    successNo:"Cảm ơn bạn! Chúng mình đã ghi nhận bạn không thể tham dự.",
    declineMessage:"💗 Cảm ơn {name} vì đã là một phần thật đẹp trong thanh xuân của chúng mình. Chúng mình thật tiếc vì không thể có bạn bên cạnh trong ngày cưới. Dù vậy, những kỷ niệm đã có cùng nhau luôn rất đáng quý. Nếu bạn muốn gửi đôi lời chúc phúc, chúng mình sẽ rất vui khi được đọc và giữ lại như một món quà của ngày đặc biệt này. 💌",
    wishes:"Lời chúc phúc dành cho Linh & Thắng",
    wishesPlaceholder:"Gửi chúng mình đôi lời chúc nhé...",
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
    weddingOf:"WE'RE GETTING MARRIED",
    heroTagline:"A new chapter, with our favorite people.",
    formalInvite:"WE'D LOVE TO CELEBRATE WITH YOU",
    inviteCopy:"Come celebrate our wedding day with us and our families. It wouldn't be the same without you.",
    wedding:"OUR WEDDING DAY",
    dateLabel:"Date",
    timeLabel:"Time",
    locationLabel:"Where",
    city:"Ho Chi Minh City, Vietnam",
    rsvpButton:"Let us know",
    direction:"Get directions ↗",
    saveDate:"Add to calendar",
    storyTitle:"A LITTLE ABOUT US",
    storyCopy:"From everyday moments to adventures far from home, we've shared a lot of laughs, a few surprises, and so many happy memories. Now we're ready for the next chapter, together.",
    storySignoff:"With love,\nLinh & Thang ♡",
    rsvpTitle:"CAN YOU MAKE IT?",
    rsvpIntro:"We really hope you can join us! Let us know below so we can plan for you.",
    guestSummaryLabel:"Replying for",
    attendingQ:"Will you be joining us?",
    yes:"Yes, I'll be there!",
    no:"Sorry, I can't",
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
    pageTitle:"Linh & Thang | We're getting married!",
    pageDescription:"Come celebrate the wedding of Linh and Thang on February 28, 2027, in Ho Chi Minh City.",
    brandAria:"Linh and Thang",
    languageAria:"Choose a language",
    imageAlt:"Linh and Thang in Paris",
  }
};

const requestedLang = new URLSearchParams(window.location.search).get("lang");
let lang = requestedLang === "vi" ? "vi" : "en";

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
  const url=new URL(window.location.href);
  url.searchParams.set("lang",b.dataset.lang);
  window.history.replaceState(null,"",url.toString());
}));

const yesBranch=document.getElementById("yesBranch");
const noBranch=document.getElementById("noBranch");
const partySizeField= document.querySelector('#yesBranch [name="party_size"]');
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
      cleanUrl.pathname + cleanUrl.search + cleanUrl.hash
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
        inviteReady = guest.canRsvp === true;
        submitButton.disabled = !inviteReady;
        showInviteNotice(inviteReady ? null : "guestNotReady");
        showRSVPStatus(null);
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
  if (!inviteCode || !inviteDisplayName || !inviteReady) {
    showRSVPStatus("missingInvite");
    return;
  }
  if (!RSVP_ENDPOINT) {
    showRSVPStatus("preview");
    return;
  }
  if (!["yes", "no"].includes(data.attending)) return;
  const people=data.attending==="yes" ? Number(data.party_size) : 0;
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
    if(stored) showRSVPConfirmation(data.attending,people);
    else showRSVPStatus("error");
  } catch (_) {
    showRSVPStatus("error");
  } finally {
    button.disabled = false;
  }
});

setLang(lang);
if (!inviteCode) showRSVPStatus("missingInvite");
resolveInviteName();
