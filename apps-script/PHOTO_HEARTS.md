# Shared anonymous Polaroid hearts

Three stable photo IDs: `keukenhof`, `rotterdam`, `zaandam`.
The browser sends a random 128-bit ID, a photo ID, a desired like/unlike state,
and a random write receipt. It never sends an invitation code or guest name.
The server stores only a SHA-256 digest of the browser ID, a three-bit state,
receipts and aggregate totals in private Script Properties.

## Deploy with the existing Apps Script Web App

1. Open the Apps Script project already serving the wedding Web App.
2. Add `PhotoHearts.gs` with the exact contents of this file in the repository.
3. In the CURRENT live `Code.gs`, add only these routes:
   - In `doGet`, AFTER validating the JSONP callback and BEFORE the guest/status action check:
     `if (q.action === "photoLikes") return js_(callback,photoHeartsRead_(q));`
   - In `doPost`, immediately after reading `e.parameter` into `p`:
     `if (p.action === "photoLike") return json_(photoHeartsWrite_(p));`
   The repository Code.gs includes these two insertions; preserve other live differences.
4. Save. Optionally run `verifyPhotoHeartsBackend`, a read-only diagnostic.
5. Deploy > Manage deployments > Edit the EXISTING Web App > New version > Deploy.
   Keep the existing /exec URL and existing audience; do not activate wedding invitations.
6. Publish the matching website change after the API is available.

Reads: GET `action=photoLikes&callback=<validFunction>&visitor=<randomHex32>`.
Writes: POST form fields `action=photoLike&photo=<id>&visitor=<randomHex32>&liked=true|false&receipt=<randomHex32>`.
The frontend verifies the receipt through a subsequent read before confirming a write.
The script-wide lock serializes state changes and totals. Retrying a desired-state write
cannot add a second like. Counts are shared; localStorage stores only the browser ID.

## Display and identity

- Each Polaroid footer has an outline navy heart and a shared count.
- A liked heart fills navy. Click again to remove the like.
- No names, avatars, visitor lists or invitation data are returned or displayed.
- Open pages refresh counts every 20 seconds while the gallery is visible,
  and refresh when the viewer returns to the page.
- Without login this is one like per browser profile per photo, not verified
  identity per person. Clearing browser storage or using another browser creates a new visitor.
- Loading or unavailable data shows a dash and disables writes. Never fake a
  successful server count with browser-only counters.

## Verification

Run `node --test tests/photo-hearts.test.cjs`.
The tests simulate independent A/B/C visitors and check shared totals, retries,
unlikes, separate photos, lock contention, private outputs, and isolation from RSVP.
Live verification must check two independent browser profiles, then undo test likes.
No real RSVP should be submitted. Guest List, PREP/LIVE, existing invitation
lookups and RSVP data are untouched.

Deploy status: source prepared and automated checks passed; Google Apps Script
editor sign-in and deployment still required before this feature is live.
