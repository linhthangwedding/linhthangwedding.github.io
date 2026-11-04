const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const crypto=require("node:crypto");
function setup(){
 const values=new Map();let held=false,busy=false,sheetReads=0;
 const lock={tryLock(){if(busy||held)return false;held=true;return true;},releaseLock(){held=false;}};
 const context=vm.createContext({
  console,
  Utilities:{DigestAlgorithm:{SHA_256:"sha256"},Charset:{UTF_8:"utf8"},
   computeDigest:(_,token)=>[...crypto.createHash("sha256").update(token).digest()]},
  PropertiesService:{getScriptProperties:()=>({
   getProperty:key=>values.get(key)||null,
   setProperties:(updates,deleteAll)=>{assert.equal(deleteAll,false);Object.entries(updates).forEach(([k,v])=>values.set(k,v));}
  })},
  LockService:{getScriptLock:()=>lock},
  SpreadsheetApp:{openById(){sheetReads++;throw Error("Photo hearts must not read RSVP");}},
  ContentService:{MimeType:{JSON:"json",JAVASCRIPT:"js"},createTextOutput:data=>({data,setMimeType(){return this;}})}
 });
 for(const file of ["apps-script/Code.gs","apps-script/PhotoHearts.gs"])
  vm.runInContext(fs.readFileSync(file,"utf8"),context);
 const token=n=>n.toString(16).padStart(32,"0");
 let receipt=100;
 const read=visitor=>JSON.parse(context.doGet({parameter:{action:"photoLikes",callback:"readHearts",visitor:visitor||""}}).data.slice(11,-2));
 const write=(visitor,photo,liked)=>JSON.parse(context.doPost({parameter:{action:"photoLike",visitor,photo,liked:String(liked),receipt:token(receipt++)}}).data);
 return {read,write,token,values,busy:value=>busy=value,sheetReads:()=>sheetReads};
}
test("A's like is visible to B; B's like makes C see two, without names",()=>{
 const api=setup(),a=api.token(1),b=api.token(2),c=api.token(3);
 assert.equal(api.read(c).counts.keukenhof,0);
 assert.equal(api.write(a,"keukenhof",true).counts.keukenhof,1);
 assert.equal(api.read(b).counts.keukenhof,1);
 assert.equal(api.write(b,"keukenhof",true).counts.keukenhof,2);
 const snapshot=api.read(c);
 assert.equal(snapshot.counts.keukenhof,2);
 assert.deepEqual(Object.keys(snapshot).sort(),["counts","liked","ok","photoHeartsVersion","receipts"]);
 assert.equal(snapshot.liked.keukenhof,false);
 assert.equal(JSON.stringify(snapshot).includes(a),false);
 assert.equal(JSON.stringify(snapshot).includes(b),false);
 assert.equal(api.sheetReads(),0);
});
test("Repeated desired-state writes cannot double-count; unlike is also idempotent",()=>{
 const api=setup(),a=api.token(1),b=api.token(2);
 api.write(a,"keukenhof",true);api.write(a,"keukenhof",true);
 assert.equal(api.read(b).counts.keukenhof,1);
 assert.equal(api.read(a).liked.keukenhof,true);
 api.write(a,"keukenhof",false);api.write(a,"keukenhof",false);
 assert.equal(api.read(b).counts.keukenhof,0);
 assert.equal(api.read(a).liked.keukenhof,false);
});
test("Independent photos and receipts persist across reads",()=>{
 const api=setup(),a=api.token(1);
 const first=api.write(a,"keukenhof",true);
 api.write(a,"rotterdam",true);
 const state=api.read(a);
 assert.equal(state.counts.keukenhof,1);assert.equal(state.counts.rotterdam,1);
 assert.equal(state.counts.zaandam,0);
 assert.equal(state.receipts.keukenhof,first.receipts.keukenhof);
 api.write(a,"keukenhof",false);
 assert.equal(api.read(a).liked.rotterdam,true);
});
test("Invalid visitors/photos and lock contention leave totals unchanged",()=>{
 const api=setup(),a=api.token(1);
 assert.equal(api.write(a,"unknown",true).ok,false);
 assert.equal(api.write("a guest name","keukenhof",true).ok,false);
 assert.equal(api.read("bad").ok,false);
 api.busy(true);
 assert.equal(api.write(a,"keukenhof",true).error,"busy");
 api.busy(false);
 assert.equal(api.read(a).counts.keukenhof,0);
 assert.equal(api.values.size,0);
 assert.equal(api.sheetReads(),0);
});
test("Stored reactions contain only anonymous digests, flags and receipts",()=>{
 const api=setup(),a=api.token(1);
 api.write(a,"zaandam",true);
 const serialized=JSON.stringify([...api.values]);
 assert.equal(serialized.includes(a),false);
 assert.equal(serialized.includes("name"),false);
 assert.equal(serialized.includes("invite"),false);
 assert.equal(serialized.includes("guest"),false);
});

