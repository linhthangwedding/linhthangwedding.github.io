# Cloudflare name lookup for Linh & Thang

This is an optional, private, fast guest-name lookup, NOT an RSVP backend.
- GitHub Pages serves the wedding website.
- Cloudflare Workers KV holds a private snapshot of names.
- Google Apps Script still validates invitation IDs and locks RSVP after submission.
- Do not enable LIVE until the wedding owner explicitly asks.
- NEVER commit private guest names, snapshot JSON, or credentials.

## First-time setup

1. Sign in to https://dash.cloudflare.com/. Ensure Node.js 20+ is available for npx.
2. On Mac/PC Terminal, clone the public website repository and deploy:

        git clone https://github.com/linhthangwedding/linhthangwedding.github.io.git
        cd linhthangwedding.github.io/cloudflare-guest-lookup
        npx wrangler login
        npx wrangler deploy

   Wrangler automatically provisions the GUEST_NAMES KV binding. Copy the published URL such as https://linh-thang-guest-lookup.<account>.workers.dev.

3. From the PRIVATE Master Google Sheet, open Extensions > Apps Script. Add a new source file copied from ExportGuestNamesToKV.gs in this folder. DO NOT replace existing Code.gs. Select the function exportGuestNamesForCloudflare and Run once, authorizing Drive and Sheets if prompted.
4. The function creates a private JSON file in My Drive named PRIVATE-wedding-guest-kv-....json. Download it to your own computer. DO NOT upload it to GitHub.
5. In Terminal, inside the cloudflare-guest-lookup folder, import the downloaded JSON:

        npx wrangler kv bulk put "/full/path/to/PRIVATE-wedding-guest-kv-....json" --binding GUEST_NAMES --remote

6. Verify https://<worker-url>/health. It returns a JSON response with ready: true. The /guest?i=<current-slug> endpoint returns a single name, never the whole list.
7. Once the endpoint exists, edit guest-lookup-config.js in the website root so that window.LTW_GUEST_LOOKUP_ENDPOINT equals the actual published Worker URL ending in /guest. The website then loads names from Cloudflare while Google Apps Script separately checks RSVP.

Until step 7, the optional fast lookup is DISABLED and the current invitation functions as before.

## Updating names / old versus new links

- PREP: Re-export and re-import after names change. The new snapshot pointer invalidates PREP trial links from the earlier snapshot (after KV propagation, typically 30-60 seconds). The Apps Script backend still accepts only the latest PREP link.
- LIVE: Only after the owner explicitly authorizes launch. The export includes current links and historical aliases that were created at/after the official launch timestamp, mapped to the same guest. Earlier PREP aliases stay disabled.
- The export function reads the sheet, creates a private file and NOTHING MORE. It does not change RSVP data, switch mode, activateWeddingInvitations, or send invitations.
- Cloudflare KV is eventually consistent; wait for replication when reimporting. Previously verified local browser names may temporarily appear before updated values are checked.

## Privacy limitations

This is a read-only per-guest lookup. The KV data is private and no public bulk-list route exists.
It is not strong identity authentication: readable slug links can be guessed. Someone who knows or guesses a slug could request the corresponding display name. CORS does NOT prevent direct non-browser requests. Random invitation codes or stronger authentication would be needed to stop guessed-name disclosure.

Keep the private export off GitHub, and delete stale copies in Downloads once imported.

Official documentation:
- https://developers.cloudflare.com/workers/wrangler/configuration/
- https://developers.cloudflare.com/workers/wrangler/commands/kv/
- https://developers.cloudflare.com/kv/concepts/kv-namespaces/
