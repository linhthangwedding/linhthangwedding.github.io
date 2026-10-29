/**
 * Linh & Thang RSVP receiver, bound to the wedding Master Google Sheet.
 *
 * Public invitation links live INSIDE the existing Guest List tables:
 *   Bride-side pink table: Name B, RSVP F, count G, Link H
 *   Other guest table:     Name K, RSVP Q, count R, Link S
 *   RSVP count is calculated in Guest List from private registry columns H/I.
 *
 * Slugs and links automatically recalculate in Google Sheets formulas.
 * PREP mode: only the newest guest link works; old test slugs are ignored.
 * LIVE mode: old and new slugs (created after launch) point to one guest ID.
 * At launch, run activateWeddingInvitations() once. No redeploy is needed.
 *
 * The hidden "RSVP Online" tab is only a private token/response registry.
 * Never publish the guest list or its long token values in the GitHub repo.
 * After editing this file in Apps Script, redeploy a NEW version.
 */
const REGISTRY_TAB = "RSVP Online";
const GUEST_TAB = "Guest List";
const WEDDING_EVENT = "Đám cưới";
const MASTER_SPREADSHEET_ID = "1WCea4Ju0-sWCj_ZSxH5n82MpcYN0cSGIA9s01gSGO2o";

// Explicitly open the wedding master sheet. A deployed Web App may have no
// active spreadsheet context, even when the script works from the editor.
function getWeddingBook_() {
  return SpreadsheetApp.openById(MASTER_SPREADSHEET_ID);
}

function cleanText_(value, max) {
  var s = String(value == null ? "" : value).trim().slice(0, max || 1000);
  return /^[=+@\-]/.test(s) ? "'" + s : s;
}
/**
 * The active mode lives in hidden RSVP Online V2; launch time in W2.
 * Current slug Q, last-seen snapshot U, alias history in RSVP Link History.
 */
/**
 * PREP: do not archive trial links; only sync the current slug snapshot.
 * LIVE: keep every former slug after the launch timestamp for the same ID.
 */
function getInvitationPhase_(book) {
  var registry = book.getSheetByName(REGISTRY_TAB);
  if (!registry) throw new Error("Missing RSVP Online");
  var mode = String(registry.getRange(2,22).getDisplayValue() || "").trim();
  var started = registry.getRange(2,23).getValue();
  var ms = started instanceof Date && !isNaN(started.getTime()) ?
    started.getTime() : null;
  return {live:mode === "LIVE" && ms !== null, startedMs:ms};
}
function syncAliasSnapshots_(book) {
  var registry = book.getSheetByName(REGISTRY_TAB);
  var history = book.getSheetByName("RSVP Link History");
  if (!registry || !history) throw new Error("Missing invitation registry/history");
  var count = registry.getLastRow() - 1;
  if (count < 1) return;
  var phase = getInvitationPhase_(book);
  var rows = registry.getRange(2,1,count,21).getDisplayValues();
  var changed = false, changedItems = [], snapshots = [];
  rows.forEach(function(rec) {
    var id = String(rec[0] || "").trim();
    var current = String(rec[16] || "").trim();
    var previous = String(rec[20] || "").trim();
    if (current !== previous) {
      changed = true;
      if (phase.live && id && previous) changedItems.push([previous,id]);
    }
    snapshots.push([current]);
  });
  if (!changed) return;
  if (phase.live && changedItems.length) {
    var last = history.getLastRow();
    var known = last > 1 ? history.getRange(2,1,last-1,3).getValues() : [];
    var used = {};
    known.forEach(function(row) {
      var timestamp = row[2] instanceof Date ? row[2].getTime() : NaN;
      if (timestamp >= phase.startedMs)
        used[String(row[0]) + "\u0001" + String(row[1])] = true;
    });
    var additions = [], now = new Date();
    changedItems.forEach(function(pair) {
      var key = pair[0]+"\u0001"+pair[1];
      if (!used[key]) {
        additions.push([pair[0],pair[1],now,"Tự lưu sau khi phát thiệp"]);
        used[key] = true;
      }
    });
    if (additions.length) {
      var first = history.getLastRow()+1;
      var capacity = history.getMaxRows();
      if (first + additions.length - 1 > capacity)
        history.insertRowsAfter(capacity,first+additions.length-1-capacity);
      history.getRange(first,1,additions.length,4).setValues(additions);
    }
  }
  registry.getRange(2,21,count,1).setValues(snapshots);
  SpreadsheetApp.flush();
}
/**
 * Run this ONCE when the invitations are ready to send officially.
 * It takes a PREP baseline before recording the official launch time.
 * No redeploy is required at launch, only a single manual Run.
 */
function activateWeddingInvitations() {
  var lock=LockService.getDocumentLock() || LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw new Error("Cannot obtain sheet lock");
  try {
    var book=getWeddingBook_();
    var registry=book.getSheetByName(REGISTRY_TAB);
    var current=getInvitationPhase_(book);
    if (current.live) return "Đã bật LIVE trước đó, không thay đổi thời điểm phát thiệp.";
    registry.getRange(2,22).setValue("PREP");
    syncAliasSnapshots_(book);
    registry.getRange(2,23).setValue(new Date());
    registry.getRange(2,22).setValue("LIVE");
    SpreadsheetApp.flush();
    return "Đã bật LIVE: bắt đầu giữ link cũ kể từ bây giờ.";
  } finally {
    lock.releaseLock();
  }
}

function syncAliasesWithLock_(book) {
  var lock = LockService.getDocumentLock() || LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try { syncAliasSnapshots_(book); }
  finally { lock.releaseLock(); }
}
/**
 * Bound-sheet name edits. Detect columns by "Tên khách mời" headers rather
 * than hard-coding B/J (the right-hand table may shift when columns are added).
 */
function onEdit(e) {
  if (!e || !e.range || e.range.getSheet().getName() !== GUEST_TAB) return;
  if (e.range.getLastRow() < 2) return;
  var sheet=e.range.getSheet();
  var headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getDisplayValues()[0];
  var first=e.range.getColumn(), last=e.range.getLastColumn();
  var editedNameColumn=false;
  for (var i=0;i<headers.length;i++) {
    if ((headers[i]==="Tên khách mời" || headers[i]==="Name") &&
        i+1>=first && i+1<=last) editedNameColumn=true;
  }
  if (!editedNameColumn) return;
  SpreadsheetApp.flush();
  syncAliasesWithLock_(e.source || getWeddingBook_());
}
/**
 * Resolve a CURRENT slug, a historic slug or a legacy random invitation ID.
 * Always return a STABLE registry record, never identify guests by their names.
 * Ambiguity across two invitations fails closed.
 */
/**
 * PREP: current slug only. Old pre-launch test URLs do not work.
 * LIVE: current slug + any previous slug archived after activation.
 * Always match against the same immutable invitation ID.
 */
function findInvite_(book, invite) {
  if (!/^[a-z0-9][a-z0-9-]{1,75}$/.test(invite)) return null;
  var registry = book.getSheetByName(REGISTRY_TAB);
  if (!registry) return null;
  var count = registry.getLastRow()-1;
  if (count < 1) return null;
  var rows=registry.getRange(2,1,count,21).getDisplayValues();
  var candidates={},byId={};
  rows.forEach(function(rec,i) {
    var id=String(rec[0]||"").trim();
    if (!id) return;
    byId[id]={registry:registry,index:i+2,row:rec};
    if (String(rec[16]||"").trim()===invite) candidates[id]=true;
  });
  var phase=getInvitationPhase_(book);
  if (phase.live) {
    var history=book.getSheetByName("RSVP Link History");
    if (!history) return null;
    var last=history.getLastRow();
    if (last>1) {
      var aliases=history.getRange(2,1,last-1,3).getValues();
      aliases.forEach(function(row) {
        var timestamp=row[2] instanceof Date ? row[2].getTime() : NaN;
        var id=String(row[1]||"").trim();
        if (timestamp>=phase.startedMs && String(row[0]||"").trim()===invite && byId[id])
          candidates[id]=true;
      });
    }
  }
  var ids=Object.keys(candidates);
  return ids.length===1?byId[ids[0]]:null;
}

/**
 * Find the current guest using the CURRENT Link slug, not its name or row number.
 * Formula changes propagate automatically when the guest name changes.
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
  if (!/^[a-z0-9-]{2,76}$/.test(slug)) return null;
  var rows=sheet.getRange(2,1,sheet.getLastRow()-1,width).getDisplayValues();
  var match=null;
  for (var i=0;i<rows.length;i++){
    var row=rows[i];
    var link=String(row[linkCol] || "").trim();
    var suffix=link.split("?i=")[1] || "";
    var isMatch=suffix === slug;
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
    var book=getWeddingBook_();
    syncAliasesWithLock_(book);
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
    // Expose a non-sensitive error state rather than silently returning an
    // RSVP receipt-shaped response when a guest name lookup has failed.
    console.error("Wedding RSVP read error",err);
    return js_(callback,{valid:false,saved:false,error:"backend_unavailable"});
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
    var book=getWeddingBook_();
    syncAliasSnapshots_(book); // post already owns the document lock
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
