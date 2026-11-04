const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
let properties={unrelatedPrivateSetting:'not-for-public-output'},held=false,writes=0;
const context=vm.createContext({
  console:{log(){},error(){}},
  Utilities:{DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(_,value)=>Array.from(crypto.createHash('sha256').update(value).digest())},
  LockService:{getScriptLock:()=>({tryLock:()=>{assert.equal(held,false);held=true;return true;},releaseLock:()=>{held=false;}})},
  PropertiesService:{getScriptProperties:()=>({getProperties:()=>({...properties}),setProperty:(k,v)=>{assert.equal(held,true);properties[k]=v;writes++;}})},
  SpreadsheetApp:{openById(){throw Error('Heart requests must not read the guest sheet');}},
  ContentService:{MimeType:{JAVASCRIPT:'js',JSON:'json'},createTextOutput:value=>({value,setMimeType(){return this;}})}
});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../apps-script/Code.gs'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../apps-script/PhotoHearts.gs'),'utf8'),context);
const call=q=>JSON.parse(JSON.stringify(context.photoHearts_(q)));
const read=client=>call({action:'photo-hearts',client});
const tap=(client,photo,taps)=>call({action:'photo-heart',client,photo,taps});
const legacy=(client,photo,liked)=>call({action:'photo-heart',client,photo,liked});
const a='a'.repeat(32),b='b'.repeat(32),c='c'.repeat(32);
assert.deepEqual(read(a).counts,{keukenhof:0,rotterdam:0,zaandam:0});
assert.equal(legacy(a,'keukenhof','1').counts.keukenhof,1);
assert.equal(read(a).mine.keukenhof,1,'Keep hearts from the original boolean storage');
assert.equal(tap(a,'keukenhof','2').counts.keukenhof,2);
assert.equal(tap(a,'keukenhof','25').counts.keukenhof,25,'Every tap contributes');
assert.equal(read(b).counts.keukenhof,25,'Other visitors see the shared count');
assert.equal(read(b).mine.keukenhof,0);
assert.equal(tap(b,'keukenhof','3').counts.keukenhof,28);
const savedWrites=writes;
assert.equal(tap(a,'keukenhof','25').counts.keukenhof,28,'Lost-response retries are idempotent');
assert.equal(tap(a,'keukenhof','2').counts.keukenhof,28,'A stale target cannot undo later taps');
assert.equal(writes,savedWrites);
assert.equal(legacy(a,'keukenhof','0').counts.keukenhof,28,'A cached toggle page cannot erase cumulative hearts');
assert.equal(tap(a,'rotterdam','1').counts.rotterdam,1);
assert.equal(legacy(a,'rotterdam','0').counts.rotterdam,1,'Protect even the first cumulative heart');
assert.equal(tap(a,'zaandam','8').counts.zaandam,8);
assert.deepEqual(read(a).mine,{keukenhof:25,rotterdam:1,zaandam:8});
assert.equal(legacy(c,'keukenhof','1').counts.keukenhof,29);
assert.equal(legacy(c,'keukenhof','0').counts.keukenhof,28,'Unmigrated legacy toggles remain compatible');
const before=writes;
for(const q of [
  {client:'bad',photo:'keukenhof',taps:'1'},
  {client:a,photo:'unknown',taps:'1'},
  ...['0','-1','1.5','1e3','NaN','1000000000'].map(taps=>({client:a,photo:'keukenhof',taps})),
  {photo:'keukenhof',taps:'1'},
  {client:a,photo:'keukenhof',liked:'true'}
]) assert.equal(call({action:'photo-heart',...q}).error,'invalid_parameters');
assert.equal(writes,before);
const result=context.doGet({parameter:{action:'photo-hearts',callback:'checkWeddingHearts',client:c}}).value;
assert.match(result,/^checkWeddingHearts\(/);
assert.ok(result.includes('"heartsVersion":2'));
for(const secret of ['unrelatedPrivateSetting','not-for-public-output',a,b,c,'invite','email','name'])
  assert.equal(result.includes(secret),false,'No private identifiers or settings in the public response');
assert.equal(context.doGet({parameter:{action:'photo-hearts',callback:'x);alert(1)//',client:a}}).value,'/* Invalid callback */');
for(let i=1;i<=30;i++){
  const token=i.toString(16).padStart(32,'0');
  for(const photo of ['keukenhof','rotterdam','zaandam']){
    assert.equal(tap(token,photo,'20').ok,true);
    assert.equal(tap(token,photo,'20').ok,true);
    assert.equal(tap(token,photo,'10').ok,true);
  }
}
assert.deepEqual(read(c).counts,{keukenhof:628,rotterdam:601,zaandam:608});
assert.equal(held,false);
console.log('PASS: repeated shared hearts; legacy migration; all three photos; lost responses; stale targets; old cached pages; validation; private-data isolation; independent visitors.');

