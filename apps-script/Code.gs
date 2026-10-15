/**
 * Linh & Thang RSVP receiver, bound to the wedding Master Google Sheet.
 *
 * Public invitation links live INSIDE the existing Guest List tables:
 *   Bride-side pink table:  Name B, Event C, Confirm E, Link G
 *   Other guest table:      Name K, Event L, RSVP Q, Link R
 *
 * The hidden "RSVP Online" tab is only a private token/response registry.
 * Never publish the guest list or its long token values in the GitHub repo.
 * After editing this file in Apps Script, redeploy a NEW version.
 */
const REGISTRY_TAB = "RSVP Online";
const GUEST_TAB = "Guest List";
const WEDDING_EVENT = "Đám cưới";

function cleanText_(value, max) {
  var s = String(value == null ? "" : value).trim().slice(0, max || 1000);
  return /^[=+@\-]/.test(s) ? "'" + s : s;
}
function findInvite_(book, invite) {
  if (!/^[a-z0-9]{16,64}$/.test(invite)) return null;
  var registry = book.getSheetByName(REGISTRY_TAB);
  if (!registry) throw new Error("Missing private RSVP registry");
  var last = registry.getLastRow();
  if (last < 2) return null;
  var rows = registry.getRange(2, 1, last - 1, 16).getDisplayValues();
  for (var i = 0; i < rows.length; i++) {
    var original = String(rows[i][0] || "").trim();
    if (original === invite || (invite.length === 16 && original.slice(0,16) === invite)) {
      return {registry:registry, index:i+2, row:rows[i]};
    }
  }
  return null;
}
/**
 * Find the current guest row by matching the unchanging invitation token
 * in its Link cell. Unlike old row-number mapping, this survives edits to
 * guest display names and movement of an entire guest table row.
 */
function locateGuest_(book, record) {
  var sheet = book.getSheetByName(GUEST_TAB);
  if (!sheet || sheet.getLastRow() < 2) return null;
  var side = String(record[14] || "").trim();
  if (side !== "LEFT" && side !== "RIGHT") return null;
  var token = String(record[0] || "").slice(0,16);
  if (!/^[a-z0-9]{16}$/.test(token)) return null;
  var nameCol = side === "LEFT" ? 1 : 10; // B or K, 0-based
  var eventCol = side === "LEFT" ? 2 : 11; // C or L
  var linkCol = side === "LEFT" ? 6 : 17; // G or R
  var responseCol = side === "LEFT" ? 5 : 17; // E or Q, 1-based
  var lastRow = sheet.getLastRow();
  var records = sheet.getRange(2,1,lastRow-1,18).getDisplayValues();
  var suffix = "?i=" + token;
  var match = null;
  for (var i=0;i<records.length;i++) {
    var row = records[i],link = String(row[linkCol] || "").trim();
    if (link.endsWith(suffix) && String(row[nameCol] || "").trim()) {
      // Fail closed if the same code ever occurs on two guest rows.
      if (match) return null;
      match = {
        tab:sheet, rowNumber:i+2,
        name:String(row[nameCol]).trim(),
        event:String(row[eventCol] || "").trim(),
        responseCol:responseCol
      };
    }
  }
  return match;
}
function canRsvp_(eventName) {
  // A blank Event cell in the wedding Guest List means not yet categorized,
  // but the guest is still in the Capella invitation list.
  return eventName === "" || eventName === WEDDING_EVENT;
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
function js_(callback,obj) {
  return ContentService.createTextOutput(
    callback+"("+JSON.stringify(obj)+");"
  ).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
function doGet(e) {
  var q=(e&&e.parameter)||{},callback=String(q.callback||"");
  if (!/^[A-Za-z_$][A-Za-z0-9_$]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput("/* Invalid callback */")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  if (q.action !== "guest" && q.action !== "status")
    return js_(callback,{saved:false,invalid:true});
  try {
    var book=SpreadsheetApp.getActiveSpreadsheet();
    var found=findInvite_(book,String(q.invite||"").trim());
    if (!found) return js_(callback,{valid:false,invalid:true});
    var guest=locateGuest_(book,found.row);
    if (!guest) return js_(callback,{valid:false,invalid:true});
    if (q.action === "guest") {
      return js_(callback,{
        valid:true,
        name:guest.name.slice(0,120),
        canRsvp:canRsvp_(guest.event)
      });
    }
    if (!canRsvp_(guest.event))
      return js_(callback,{saved:false,invalid:true});
    var receipt=String(q.receipt||"");
    return js_(callback,{
      saved:!!receipt && receipt===String(found.row[11]||"").trim()
    });
  } catch(err) {
    return js_(callback,{saved:false});
  }
}
function doPost(e) {
  var p=(e&&e.parameter)||{};
  var invite=String(p.invite||"").trim();
  var attending=String(p.attending||"").trim();
  var receipt=String(p.receipt||"").trim();
  if (!/^[a-z0-9]{16,64}$/.test(invite) ||
      !/^(yes|no)$/.test(attending) ||
      !/^[a-zA-Z0-9-]{8,100}$/.test(receipt))
    return json_({ok:false,error:"invalid_parameters"});

  var lock=LockService.getDocumentLock()||LockService.getScriptLock();
  if (!lock.tryLock(15000)) return json_({ok:false,error:"busy"});
  try {
    var book=SpreadsheetApp.getActiveSpreadsheet();
    var found=findInvite_(book,invite);
    if (!found) return json_({ok:false,error:"unknown_invitation"});
    var guest=locateGuest_(book,found.row);
    if (!guest) return json_({ok:false,error:"guest_link_not_found"});
    if (!canRsvp_(guest.event))
      return json_({ok:false,error:"event_not_confirmed"});

    var count=attending==="yes" ?
      Math.max(1,Math.min(10,parseInt(p.party_size,10)||1)) : 0;
    var answer=attending==="yes"?"Có":"Không";
    var note=cleanText_(p.wishes,1000);
    var time=new Date();

    found.registry.getRange(found.index,8,1,5)
      .setValues([[answer,count,note,time,receipt]]);
    guest.tab.getRange(guest.rowNumber,guest.responseCol).setValue(
      answer==="Có"&&count>1 ? "Có ("+count+" khách)" : answer
    );
    SpreadsheetApp.flush();
    return json_({ok:true});
  }catch(err){
    return json_({ok:false,error:"server_error"});
  }finally{
    lock.releaseLock();
  }
}
