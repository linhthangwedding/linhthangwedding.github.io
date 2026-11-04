/**
 * Anonymous shared hearts; independent of RSVP, Guest List and PREP/LIVE.
 * The API never accepts names or returns visitor lists.
 */
var PHOTO_HEART_IDS_=["keukenhof","rotterdam","zaandam"];
var PHOTO_HEART_PREFIX_="ltw:photo-hearts:v1:";
function photoHeartVisitorKey_(visitor) {
  if (!/^[a-f0-9]{32}$/.test(String(visitor||""))) return "";
  var digest=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,visitor,Utilities.Charset.UTF_8);
  return PHOTO_HEART_PREFIX_+"visitor:"+digest.map(function(b) {
    return ("0"+((b+256)%256).toString(16)).slice(-2);
  }).join("");
}
function photoHeartRecord_(store,key) {
  var record=key?JSON.parse(store.getProperty(key)||"{}"):{};
  return {mask:Number(record.mask)||0,receipts:record.receipts||{}};
}
function photoHeartSnapshot_(store,record) {
  var counts={},liked={},receipts={};
  PHOTO_HEART_IDS_.forEach(function(id,i) {
    counts[id]=Math.max(0,parseInt(store.getProperty(PHOTO_HEART_PREFIX_+"count:"+id),10)||0);
    liked[id]=!!(record.mask&(1<<i));
    receipts[id]=String(record.receipts[id]||"");
  });
  return {ok:true,photoHeartsVersion:1,counts:counts,liked:liked,receipts:receipts};
}
function photoHeartsRead_(q) {
  var visitor=String(q.visitor||""),key=visitor?photoHeartVisitorKey_(visitor):"";
  if (visitor&&!key) return {ok:false,error:"invalid_visitor"};
  var lock=LockService.getScriptLock(),locked=false;
  try {
    locked=lock.tryLock(5000);
    if (!locked) return {ok:false,error:"busy"};
    var store=PropertiesService.getScriptProperties();
    return photoHeartSnapshot_(store,photoHeartRecord_(store,key));
  } catch (_) { return {ok:false,error:"hearts_unavailable"}; }
  finally { if (locked) lock.releaseLock(); }
}
function photoHeartsWrite_(p) {
  var id=String(p.photo||""),index=PHOTO_HEART_IDS_.indexOf(id);
  var key=photoHeartVisitorKey_(String(p.visitor||"")),receipt=String(p.receipt||"");
  if (index<0||!key||!/^[a-f0-9]{32}$/.test(receipt)||(p.liked!=="true"&&p.liked!=="false"))
    return {ok:false,error:"invalid_parameters"};
  var lock=LockService.getScriptLock(),locked=false;
  try {
    locked=lock.tryLock(10000);
    if (!locked) return {ok:false,error:"busy"};
    var store=PropertiesService.getScriptProperties(),record=photoHeartRecord_(store,key),bit=1<<index;
    var wasLiked=!!(record.mask&bit),wantLiked=p.liked==="true";
    var countKey=PHOTO_HEART_PREFIX_+"count:"+id;
    var count=Math.max(0,parseInt(store.getProperty(countKey),10)||0);
    // Desired-state writes are idempotent; retries cannot add a second heart.
    if (wasLiked!==wantLiked) count=Math.max(0,count+(wantLiked?1:-1));
    record.mask=wantLiked?(record.mask|bit):(record.mask&~bit);
    record.receipts[id]=receipt;
    var updates={};
    updates[countKey]=String(count);
    updates[key]=JSON.stringify(record);
    store.setProperties(updates,false);
    return photoHeartSnapshot_(store,record);
  } catch (_) { return {ok:false,error:"hearts_unavailable"}; }
  finally { if (locked) lock.releaseLock(); }
}
// Read-only diagnostic: does not create reactions, guests or spreadsheet tabs.
function verifyPhotoHeartsBackend() {
  var result=photoHeartsRead_({});
  if (!result.ok) throw new Error("Photo hearts backend unavailable");
  console.log("Photo hearts ready: "+JSON.stringify(result.counts));
}
