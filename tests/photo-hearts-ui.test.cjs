const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');
const source=fs.readFileSync(path.join(__dirname,'../script.js'),'utf8');
const ui=source.slice(source.indexOf('(function initPhotoHearts(){'));
const ids=['keukenhof','rotterdam','zaandam'];
const baseline=()=>({ok:true,heartsSupported:true,counts:{keukenhof:7,rotterdam:3,zaandam:5},liked:{keukenhof:false,rotterdam:false,zaandam:false}});
const tick=async()=>{for(let i=0;i<12;i++) await Promise.resolve();};
function fixture(){
  const requests=[],events={},status={textContent:''};
  const buttons=ids.map(photo=>({
    dataset:{photoHeart:photo},attributes:{},count:{textContent:''},disabled:true,
    setAttribute(key,value){this.attributes[key]=value;},
    querySelector(){return this.count;},
    addEventListener(_,handler){this.click=handler;}
  }));
  const storage=new Map();
  const window={crypto:webcrypto,
    localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
    sessionStorage:{getItem:()=>null,setItem(){}},
    addEventListener:(name,handler)=>{events[name]=handler;}
  };
  const document={documentElement:{lang:'vi'},visibilityState:'visible',
    querySelector:()=>({}),querySelectorAll:()=>buttons,getElementById:()=>status,
    createElement:()=>({remove(){}}),
    head:{appendChild(script){
      const params=new URL(script.src).searchParams;
      requests.push({script,params,done:false});
    }},addEventListener(){}
  };
  vm.runInNewContext(ui,{window,document,URL,Uint8Array,RSVP_ENDPOINT:'https://example.test/exec',
    MutationObserver:class{observe(){}},setTimeout:()=>1,clearTimeout(){},setInterval(){}
  });
  const take=action=>{
    const request=requests.find(r=>!r.done&&r.params.get('action')===action);
    assert.ok(request,'Expected pending '+action);
    return request;
  };
  const respond=(request,data)=>{
    request.done=true;
    window[request.params.get('callback')](structuredClone(data));
  };
  const state=i=>({count:buttons[i].count.textContent,pressed:buttons[i].attributes['aria-pressed'],disabled:buttons[i].disabled});
  return {buttons,requests,events,status,take,respond,state,
    async start(){respond(take('photo-hearts'),baseline());await tick();}
  };
}
(async()=>{
  // Hold every network response. Feedback must happen during the click itself.
  let f=fixture();await f.start();
  f.buttons[0].click();
  assert.deepEqual(f.state(0),{count:'8',pressed:'true',disabled:false});
  const first=f.take('photo-heart');
  f.buttons[1].click();
  assert.deepEqual(f.state(1),{count:'4',pressed:'true',disabled:false});
  assert.equal(f.requests.filter(r=>r.params.get('action')==='photo-heart').length,1);
  const a=baseline();a.counts.keukenhof=8;a.liked.keukenhof=true;
  f.respond(first,a);await tick();
  assert.equal(f.state(1).count,'4','First response must not erase another pending photo');
  const second=f.take('photo-heart');assert.equal(second.params.get('photo'),'rotterdam');
  const ab=structuredClone(a);ab.counts.rotterdam=4;ab.liked.rotterdam=true;
  f.respond(second,ab);await tick();
  assert.equal(f.state(0).count,'8');assert.equal(f.state(1).count,'4');

  // Undo before the first response: keep the latest intent visible throughout.
  f=fixture();await f.start();f.buttons[0].click();
  const like=f.take('photo-heart');f.buttons[0].click();
  assert.deepEqual(f.state(0),{count:'7',pressed:'false',disabled:false});
  f.respond(like,a);await tick();
  assert.equal(f.state(0).count,'7','Late like acknowledgement must not flash the old intent');
  const unlike=f.take('photo-heart');assert.equal(unlike.params.get('liked'),'0');
  f.respond(unlike,baseline());await tick();
  f.buttons[0].click();const triple=f.take('photo-heart');f.buttons[0].click();f.buttons[0].click();
  assert.equal(f.state(0).count,'8');f.respond(triple,a);await tick();
  assert.equal(f.requests.filter(r=>!r.done&&r.params.get('action')==='photo-heart').length,0,'Coalesce repeated taps');

  // A poll started before a click must not roll back the immediate update.
  f=fixture();await f.start();f.events.focus();const stale=f.take('photo-hearts');
  f.buttons[0].click();const write=f.take('photo-heart');
  f.respond(stale,baseline());await tick();assert.equal(f.state(0).count,'8');
  f.respond(write,a);await tick();assert.equal(f.state(0).count,'8');

  // Failed delivery can mean either no save or a lost successful response.
  for(const saved of [false,true]){
    f=fixture();await f.start();f.buttons[0].click();const failed=f.take('photo-heart');
    failed.done=true;failed.script.onerror();await tick();
    assert.deepEqual(f.state(0),{count:'7',pressed:'false',disabled:true});
    assert.ok(f.status.textContent.includes('Chưa xác nhận'));
    f.respond(f.take('photo-hearts'),saved?a:baseline());await tick();
    assert.deepEqual(f.state(0),{count:saved?'8':'7',pressed:String(saved),disabled:false});
    assert.equal(f.requests.filter(r=>r.params.get('action')==='photo-heart').length,1,'Read back uncertain saves instead of double-submitting');
  }
  console.log('PASS: immediate counts before network response; independent photos; rapid undo/coalescing; stale polls; failure rollback and reconciliation.');
})().catch(error=>{console.error(error);process.exitCode=1;});
