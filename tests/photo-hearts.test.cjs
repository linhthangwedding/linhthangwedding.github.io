const fs=require('node:fs');
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
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../apps-script/Code.gs'),'utf8'),context);
const call=q=>JSON.parse(JSON.stringify(context.photoHearts_(q)));
const read=client=>call({action:'photo-hearts',client});
const vote=(client,photo,liked)=>call({action:'photo-heart',client,photo,liked});
const a='a'.repeat(32),b='b'.repeat(32),c='c'.repeat(32);
assert.deepEqual(read(a).counts,{keukenhof:0,rotterdam:0,zaandam:0});
assert.equal(vote(a,'keukenhof','1').counts.keukenhof,1);
assert.equal(read(b).counts.keukenhof,1,'B sees A’s shared like');
assert.equal(read(b).liked.keukenhof,false);
assert.equal(vote(b,'keukenhof','1').counts.keukenhof,2);
assert.equal(read(c).counts.keukenhof,2,'C sees A and B’s shared likes');
assert.equal(vote(a,'keukenhof','1').counts.keukenhof,2,'A retry is idempotent');
assert.equal(vote(b,'keukenhof','0').counts.keukenhof,1);
assert.equal(vote(b,'keukenhof','0').counts.keukenhof,1,'Repeated unlike is idempotent');
assert.equal(read(a).liked.keukenhof,true,'Returning browser keeps its own state');
assert.equal(vote(a,'rotterdam','1').counts.keukenhof,1,'Photos have independent counts');
assert.equal(vote(a,'zaandam','1').counts.zaandam,1);
assert.equal(read(c).liked.zaandam,false);
const before=writes;
for(const q of [
  {action:'photo-heart',client:'bad',photo:'keukenhof',liked:'1'},
  {action:'photo-heart',client:a,photo:'unknown',liked:'1'},
  {action:'photo-heart',client:a,photo:'keukenhof',liked:'true'},
  {action:'photo-heart',photo:'keukenhof',liked:'1'}
]) assert.equal(call(q).error,'invalid_parameters');
assert.equal(writes,before,'Invalid requests do not mutate storage');
const result=context.doGet({parameter:{action:'photo-hearts',callback:'checkWeddingHearts',client:c}}).value;
assert.match(result,/^checkWeddingHearts\(/);
for(const secret of ['unrelatedPrivateSetting','not-for-public-output',a,b,c,'invite','email','name'])
  assert.equal(result.includes(secret),false,'No private identifiers or settings in public response');
assert.equal(context.doGet({parameter:{action:'photo-hearts',callback:'x);alert(1)//',client:a}}).value,'/* Invalid callback */');
for(let i=1;i<=30;i++){
  const token=i.toString(16).padStart(32,'0');
  for(const photo of ['keukenhof','rotterdam','zaandam']){
    assert.equal(vote(token,photo,'1').ok,true);
    assert.equal(vote(token,photo,'1').ok,true);
  }
}
assert.deepEqual(read(c).counts,{keukenhof:31,rotterdam:31,zaandam:31});
assert.equal(held,false,'All requests release the script lock');
console.log('PASS: A → B → C shared counts; all three photos; retries; unlike; returning browser; invalid input; JSONP validation; private-data isolation; 30 further independent browsers.');
