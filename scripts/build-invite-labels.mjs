// Rebuild the display-only snapshot after approving guest name/link changes.
// Input on stdin: [{slug, name}, ...] from the current active Guest List links.
// Never commit that plaintext input, response data, or private registry IDs.
// Usage: node scripts/build-invite-labels.mjs < /private/approved-labels.json
import {readFileSync, writeFileSync} from "node:fs";
import {createHash, randomBytes, createCipheriv} from "node:crypto";
const guests = JSON.parse(readFileSync(0, "utf8"));
const labels = {};
const digest = value => createHash("sha256").update(value).digest();
for (const {slug, name} of guests) {
  if (!/^[a-z0-9][a-z0-9-]{1,75}$/.test(slug) || typeof name !== "string" || !name.trim()) throw Error("Invalid display label");
  const id = digest(slug).toString("hex");
  if (labels[id]) throw Error("Duplicate invitation slug");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", digest("ltw:invite-label:v1:" + slug), iv);
  cipher.setAAD(Buffer.from(slug));
  const encrypted = Buffer.concat([cipher.update(name.trim().slice(0,120), "utf8"), cipher.final(), cipher.getAuthTag()]);
  labels[id] = [iv.toString("base64"), encrypted.toString("base64")];
}
writeFileSync(new URL("../assets/invite-labels-20261124.json", import.meta.url), JSON.stringify({version:1,generatedAt:new Date().toISOString(),labels})+"\n");
