/**
 * OPTIONAL manual helper for Linh & Thang.
 * Add as a NEW .gs file to the existing, private Master Sheet Apps Script.
 *
 * Creates a private JSON snapshot in the owner's Google Drive for
 * Cloudflare Workers KV bulk import. NEVER publish the JSON on GitHub.
 *
 * PREP: generating a new snapshot invalidates all earlier PREP slugs
 * in the Cloudflare lookup after "__active_snapshot" is updated.
 * It DOES NOT activate LIVE or change any RSVP data.
 */
function exportGuestNamesForCloudflare() {
  var book = SpreadsheetApp.openById("1WCea4Ju0-sWCj_ZSxH5n82MpcYN0cSGIA9s01gSGO2o");
  var sheet = book.getSheetByName("Guest List");
  if (!sheet) throw new Error("Guest List not found");
  var last = sheet.getLastRow();
  if (last < 2) throw new Error("Guest List is empty");
  var rows = sheet.getRange(2, 1, last - 1, 19).getDisplayValues();

  var snapshot = "prep_" + Utilities.formatDate(
    new Date(), "UTC", "yyyyMMdd_HHmmss"
  );
  var pairs = [], seen = {};
  var linkPattern = /^https:\/\/linhthangwedding\.github\.io\/\?i=([a-z0-9][a-z0-9-]{1,75})$/;

  function addEntry(row, nameColumn, linkColumn, sheetRow) {
    var name = String(row[nameColumn] || "").trim();
    var url = String(row[linkColumn] || "").trim();
    if (!url && !name) return;
    if (!url) return; // Guests without an invitation link are not imported.
    var match = url.match(linkPattern);
    if (!match) throw new Error("Unexpected link format in row " + sheetRow);
    if (!name || name.length > 120) {
      throw new Error("Missing or invalid guest name in row " + sheetRow);
    }
    var slug = match[1];
    if (seen[slug]) throw new Error("Duplicate current invitation slug");
    seen[slug] = true;
    pairs.push({ key: "guest:" + snapshot + ":" + slug, value: name });
  }

  rows.forEach(function(row, i) {
    addEntry(row, 1, 7, i + 2);  // Left table B / H
    addEntry(row, 10, 18, i + 2); // Right table K / S
  });
  if (!pairs.length) throw new Error("No linked wedding guests to export");

  // The active pointer MUST appear last in the import. Names are uploaded
  // first; once the pointer changes, previous PREP links are no longer read.
  pairs.push({ key: "__active_snapshot", value: snapshot });

  var fileName = "PRIVATE-wedding-guest-kv-" + snapshot + ".json";
  var blob = Utilities.newBlob(
    JSON.stringify(pairs, null, 2), "application/json", fileName
  );
  var file = DriveApp.createFile(blob);
  console.log("Created private KV import file in Google Drive. Entries: " + (pairs.length - 1));
  console.log("File URL (keep private): " + file.getUrl());
  console.log("Do not attach this JSON to GitHub or a public webpage.");
}
