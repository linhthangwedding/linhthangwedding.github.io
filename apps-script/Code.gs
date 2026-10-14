/**
 * Linh & Thang Wedding RSVP receiver.
 * Paste into Extensions > Apps Script of the PRIVATE Master Google Sheet.
 * Deploy as a Web App: Execute as Me / Access Anyone.
 * No guest data, tokens, or private URLs belong in this public source file.
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
  if (!registry) throw new Error("Missing RSVP Online sheet");
  var last = registry.getLastRow();
  if (last < 2) return null;
  var rows = registry.getRange(2, 1, last - 1, 16).getDisplayValues();
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === invite ||
        (invite.length === 16 && String(rows[i][0]).trim().slice(0,16) === invite)) {
      return {registry: registry, index: i + 2, row: rows[i]};
    }
  }
  return null;
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
function js_(callback, obj) {
  return ContentService.createTextOutput(
    callback + "(" + JSON.stringify(obj) + ");"
  ).setMimeType(ContentService.MimeType.JAVASCRIPT);
}
function doGet(e) {
  var q = (e && e.parameter) || {};
  var callback = String(q.callback || "");
  if (!/^[A-Za-z_$][A-Za-z0-9_$]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput("/* Invalid callback */")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  if (q.action !== "status" && q.action !== "guest") return js_(callback, {saved:false, invalid:true});
  try {
    var book = SpreadsheetApp.getActiveSpreadsheet();
    var found = findInvite_(book, String(q.invite || ""));
    if (!found) return js_(callback, {saved:false, invalid:true});
    // Label comes from the editable "Tên khách mời" in Guest List.
    // The private registry holds the original token; short links use 16 chars.
    if (q.action === "guest") {
      var guestTab = book.getSheetByName(GUEST_TAB);
      if (!guestTab || guestTab.getLastRow() < 150)
        return js_(callback, {valid:false, invalid:true});
      var data = guestTab.getRange(150,1,guestTab.getLastRow()-149,5)
        .getDisplayValues();
      for (var j=0;j<data.length;j++) {
        if (String(data[j][4]).trim() === String(found.row[0]).trim()) {
          var displayName = String(data[j][0] || "").trim().slice(0,120);
          if (!displayName) break;
          return js_(callback, {valid:true, name:displayName,
            canRsvp:String(found.row[3]).trim() === WEDDING_EVENT});
        }
      }
      return js_(callback, {valid:false, invalid:true});
    }
    if (String(found.row[3]).trim() !== WEDDING_EVENT) {
      return js_(callback, {saved:false, invalid:true});
    }
    var receipt = String(q.receipt || "");
    return js_(callback, {
      saved: !!receipt && receipt === String(found.row[11]).trim()
    });
  } catch (err) {
    return js_(callback, {saved:false});
  }
}
function doPost(e) {
  var p = (e && e.parameter) || {};
  var invite = String(p.invite || "").trim();
  var attending = String(p.attending || "").trim();
  var receipt = String(p.receipt || "").trim();
  if (!/^[a-z0-9]{16,64}$/.test(invite) ||
      !/^(yes|no)$/.test(attending) ||
      !/^[a-zA-Z0-9-]{8,100}$/.test(receipt)) {
    return json_({ok:false, error:"invalid_parameters"});
  }

  var lock = LockService.getDocumentLock() || LockService.getScriptLock();
  if (!lock.tryLock(15000)) return json_({ok:false, error:"busy"});
  try {
    var book = SpreadsheetApp.getActiveSpreadsheet();
    var found = findInvite_(book, invite);
    if (!found) return json_({ok:false, error:"unknown_invitation"});
    var record = found.row;
    if (String(record[3]).trim() !== WEDDING_EVENT) {
      return json_({ok:false, error:"event_not_confirmed"});
    }
    var side = String(record[14]).trim();
    var sourceRow = Number(record[15]);
    if (!Number.isInteger(sourceRow) || sourceRow < 2 ||
        (side !== "LEFT" && side !== "RIGHT")) {
      return json_({ok:false, error:"bad_source_mapping"});
    }
    var guestTab = book.getSheetByName(GUEST_TAB);
    if (!guestTab) throw new Error("Missing Guest List sheet");
    var nameCol = side === "LEFT" ? 2 : 9;
    var responseCol = side === "LEFT" ? 5 : 15;
    // Fail safely rather than write another guest's response after sheet reorders.
    var actualName = String(guestTab.getRange(sourceRow,nameCol).getDisplayValue()).trim();
    var expectedName = String(record[1]).trim();
    if (!actualName || actualName !== expectedName) {
      return json_({ok:false, error:"guest_row_has_moved"});
    }
    var count = attending === "yes" ?
      Math.max(1,Math.min(10,parseInt(p.party_size,10)||1)) : 0;
    var answer = attending === "yes" ? "Có" : "Không";
    var note = cleanText_(p.wishes,1000);
    var time = new Date();

    found.registry.getRange(found.index,8,1,5)
      .setValues([[answer,count,note,time,receipt]]);
    guestTab.getRange(sourceRow,responseCol).setValue(
      answer === "Có" && count > 1 ? "Có ("+count+" khách)" : answer
    );
    SpreadsheetApp.flush();
    return json_({ok:true});
  } catch (err) {
    return json_({ok:false,error:"server_error"});
  } finally {
    lock.releaseLock();
  }
}
