/**
 * OPTIONAL manual helper for Linh & Thang.
 * Add as a NEW .gs file to the existing, private Master Sheet Apps Script.
 *
 * Creates a private JSON snapshot in the owner's Google Drive for
 * Cloudflare Workers KV bulk import. NEVER publish the JSON on GitHub.
 *
 * PREP: only current slugs are included; old trial slugs become inactive.
 * LIVE: post-launch historical slugs are also included, mapped to the same
 * current guest name. Earlier PREP-only aliases are not reactivated.
 * This function NEVER activates LIVE or changes any RSVP data.
 */
function exportGuestNamesForCloudflare() {
  var book = SpreadsheetApp.openById("1WCea4Ju0-sWCj_ZSxH5n82MpcYN0cSGIA9s01gSGO2o");
  var sheet = book.getSheetByName("Guest List");
  if (!sheet) throw new Error("Guest List not found");
  var last = sheet.getLastRow();
  if (last < 2) throw new Error("Guest List is empty");
  var rows = sheet.getRange(2, 1, last - 1, 19).getDisplayValues();

  var registry = book.getSheetByName("RSVP Online");
  if (!registry) throw new Error("RSVP Online registry not found");
  var mode = String(registry.getRange("V2").getDisplayValue() || "").trim();
  var launchDate = registry.getRange("W2").getValue();
  var live = mode === "LIVE";
  if (live && (!(launchDate instanceof Date) || isNaN(launchDate.getTime()))) {
    throw new Error("LIVE launch date is missing");
  }
  var snapshot = (live ? "live_" : "prep_") + Utilities.formatDate(
    new Date(), "UTC", "yyyyMMdd_HHmmss"
  ) + "_" + Utilities.getUuid().slice(0, 8);
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
    addSlug(match[1], name);
  }

  function addSlug(slug, name) {
    if (!/^[a-z0-9][a-z0-9-]{1,75}$/.test(slug)) return;
    if (seen[slug]) {
      if (seen[slug] !== name) throw new Error("Ambiguous invitation slug");
      return;
    }
    seen[slug] = name;
    pairs.push({ key: "guest:" + snapshot + ":" + slug, value: name });
  }

  rows.forEach(function(row, i) {
    addEntry(row, 1, 7, i + 2);  // Left table B / H
    addEntry(row, 10, 18, i + 2); // Right table K / S
  });
  if (!pairs.length) throw new Error("No linked wedding guests to export");

  if (live) {
    // Preserve ONLY aliases created at or after the official launch.
    var history = book.getSheetByName("RSVP Link History");
    if (!history) throw new Error("RSVP Link History not found");
    var registryLast = registry.getLastRow();
    var currentById = {};
    if (registryLast > 1) {
      var currentRows = registry.getRange(2, 1, registryLast - 1, 17).getDisplayValues();
      currentRows.forEach(function(row) {
        var id = String(row[0] || "").trim();
        var name = String(row[1] || "").trim();
        if (id && name) currentById[id] = name;
      });
    }
    if (history.getLastRow() > 1) {
      var historyRows = history.getRange(2, 1, history.getLastRow() - 1, 3).getValues();
      historyRows.forEach(function(row) {
        var alias = String(row[0] || "").trim();
        var id = String(row[1] || "").trim();
        var storedAt = row[2];
        if (storedAt instanceof Date && storedAt.getTime() >= launchDate.getTime() &&
            currentById[id]) addSlug(alias, currentById[id]);
      });
    }
  }

  // The active pointer is imported with the new keys; older snapshot
  // slugs are not looked up by the Worker once this pointer changes.
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
