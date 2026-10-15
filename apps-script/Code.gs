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
  if (!/^[a-z0-9][a-z0-9-]{1,75}$/.test(invite)) return null;
  var registry = book.getSheetByName(REGISTRY_TAB);
  if (!registry) throw new Error("Missing private RSVP registry");
  var last = registry.getLastRow();
  if (last < 2) return null;
  var rows = registry.getRange(2, 1, last - 1, 17).getDisplayValues();
  for (var i = 0; i < rows.length; i++) {
    var original = String(rows[i][0] || "").trim();
    if (original === invite || String(rows[i][16] || "") === invite ||
        (invite.length === 16 && original.slice(0,16) === invite)) {
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
  // Determine columns by the real headers, not fixed positions. This also
  // supports changes to the table layout such as adding a column.
  var width = sheet.getLastColumn();
  var headers = sheet.getRange(1,1,1,width).getDisplayValues()[0];
  var isGuestName = function(h){return h === "Tên khách mời" || h === "Name";};
  var getIndices = function(pred){
    var out=[]; for (var i=0;i<headers.length;i++) if(pred(headers[i])) out.push(i);
    return out;
  };
  var guestNames=getIndices(isGuestName);
  var links=getIndices(function(h){return h === "Link";});
  var responses=getIndices(function(h){return h === "RSVP";});
  var events=getIndices(function(h){return h === "Event";});
  var which = side === "LEFT" ? 0 : 1;
  if (guestNames.length < 2 || links.length < 2 || events.length < 2) return null;
  var nameCol=guestNames[which],linkCol=links[which],eventCol=events[which];
  var responseCol=-1;
  for (var j=0;j<responses.length;j++) {
    if (responses[j] > nameCol && responses[j] < linkCol) {responseCol=responses[j];break;}
  }
  if (responseCol < 0) return null;
  var slug=String(record[16] || "").trim();
  var fullId=String(record[0] || "").trim();
  var oldShort=fullId.slice(0,16);
  if (!/^[a-z0-9-]{2,76}$/.test(slug)) return null;
  var rows=sheet.getRange(2,1,sheet.getLastRow()-1,width).getDisplayValues();
  var match=null;
  for (var i=0;i<rows.length;i++){
    var row=rows[i];
    var link=String(row[linkCol] || "").trim();
    var suffix=link.split("?i=")[1] || "";
    var isMatch=suffix === slug || suffix === oldShort;
    if (isMatch && String(row[nameCol] || "").trim()) {
      if (match) return null; // Collision protection.
      match={
        tab:sheet, rowNumber:i+2, name:String(row[nameCol]).trim(),
        event:String(row[eventCol] || "").trim(), responseCol:responseCol+1
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
  if (!/^[a-z0-9][a-z0-9-]{1,75}$/.test(invite) ||
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
