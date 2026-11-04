const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');
const source=fs.readFileSync(path.join(__dirname,'../script.js'),'utf8');
const ui=source.slice(source.indexOf('(function initPhotoHearts(){'));
const ids=['keukenhof','rotterdam','zaandam'];
const baseline=()=>({ok:true,heartsSupported:true,heartsVersion:2,counts:{keukenhof:7,rotterdam:3,zaandam:5},mine:{keukenhof:0,rotterdam:0,zaandam:0}});
const tick=async()=>{for(let i=0;i<25;i++) await Promise.resolve();};
function fixture({storage=new Map(),locks}={}){
  const requests=[],events={},timers=new Map(),floats=[],status={textContent:''};
  let timerId=0;
  const buttons=ids.map(photo=>({
    dataset:{photoHeart:photo},attributes:{},count:{textContent:''},disabled:true,
    parentElement:{appendChild:heart=>floats.push(heart)},
    setAttribute(key,value){this.attributes[key]=value;},
    querySelector(selector){return selector==='svg'?{cloneNode:()=>({})}:this.count;},
    addEventListener(_,handler){this.click=handler;}
  }));
  const window={crypto:webcrypto,navigator:{locks},
    localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},
    sessionStorage:{getItem:()=>null,setItem(){}},
    addEventListener:(name,handler)=>{events[name]=handler;}
  };
  const document={documentElement:{lang:'vi'},visibilityState:'visible',
    querySelector:()=>({}),querySelectorAll:()=>buttons,getElementById:()=>status,
    createElement:()=>({attributes:{},style:{setProperty(){}},setAttribute(k,v){this.attributes[k]=v;},
      appendChild(){},addEventListener(){},remove(){this.removed=true;}}),
    head:{appendChild(script){
      const params=new URL(script.src).searchParams;
      requests.push({script,params,done:false});
    }},addEventListener(){}
  };
  vm.runInNewContext(ui,{window,document,URL,Uint8Array,RSVP_ENDPOINT:'https://example.test/exec',
    MutationObserver:class{observe(){}},
    setTimeout:(callback,delay)=>{const id=++timerId;timers.set(id,{callback,delay});return id;},
    clearTimeout:id=>timers.delete(id),setInterval(){}
  });
  const take=action=>{
    const request=requests.find(r=>!r.done&&r.params.get('action')===action);
    assert.ok(request,'Expected pending '+action);
    return request;
  };
  const respond=(request,data)=>{
    request.done=true;window[request.params.get('callback')](structuredClone(data));
  };
  const state=i=>({count:buttons[i].count.textContent,hearted:buttons[i].attributes['data-hearted'],disabled:buttons[i].disabled});
  return {buttons,requests,events,status,take,respond,state,storage,floats,timers,
    fail(request){request.done=true;request.script.onerror();},
    retry(){const entry=[...timers.values()].find(t=>t.delay===1500);assert.ok(entry);entry.callback();},
    async start(data=baseline()){respond(take('photo-hearts'),data);await tick();}
  };
}
function saved(mine){
  const data=baseline();
  for(const photo of ids){data.mine[photo]=mine[photo] || 0;data.counts[photo]+=data.mine[photo];}
  return data;
}
(async()=>{
  let f=fixture();await f.start();
  for(let i=0;i<12;i++) f.buttons[0].click();
  assert.deepEqual(f.state(0),{count:'19',hearted:'true',disabled:false});
  assert.equal(f.floats.length,12,'Every tap emits its own heart immediately');
  assert.equal(f.floats.every(h=>h.className==='photo-heart-float'&&h.attributes['aria-hidden']==='true'),true);
  let first=f.take('photo-heart');assert.equal(first.params.get('taps'),'1');
  f.buttons[1].click();f.buttons[1].click();f.buttons[2].click();
  assert.equal(f.state(1).count,'5');assert.equal(f.state(2).count,'6');
  f.respond(first,saved({keukenhof:1}));await tick();
  assert.equal(f.state(0).count,'19','An acknowledgement must not erase taps made while saving');
  let next=f.take('photo-heart');assert.equal(next.params.get('taps'),'12');
  f.respond(next,saved({keukenhof:12}));await tick();
  next=f.take('photo-heart');assert.equal(next.params.get('photo'),'rotterdam');
  assert.equal(next.params.get('taps'),'2');
  f.respond(next,saved({keukenhof:12,rotterdam:2}));await tick();
  next=f.take('photo-heart');assert.equal(next.params.get('photo'),'zaandam');
  f.respond(next,saved({keukenhof:12,rotterdam:2,zaandam:1}));await tick();
  assert.deepEqual(ids.map((_,i)=>f.state(i).count),['19','5','6']);
  for(const h of f.floats) assert.equal(h.removed,undefined);
  for(const timer of f.timers.values()) if(timer.delay===1800) timer.callback();
  assert.equal(f.floats.every(h=>h.removed),true,'Animation cleanup removes particles');

  f=fixture();await f.start();f.events.focus();const stale=f.take('photo-hearts');
  f.buttons[0].click();first=f.take('photo-heart');
  f.respond(stale,baseline());await tick();assert.equal(f.state(0).count,'8');
  f.respond(first,saved({keukenhof:1}));await tick();assert.equal(f.state(0).count,'8');

  for(const alreadySaved of [false,true]){
    f=fixture();await f.start();f.buttons[0].click();first=f.take('photo-heart');
    f.fail(first);await tick();
    assert.deepEqual(f.state(0),{count:'8',hearted:'true',disabled:false});
    f.buttons[0].click();next=f.take('photo-heart');assert.equal(next.params.get('taps'),'2');
    f.respond(next,saved({keukenhof:2}));await tick();assert.equal(f.state(0).count,'9');
    // Reopening after a failed response must resend the persisted cumulative
    // target; this is safe whether or not the earlier server save succeeded.
    f=fixture();await f.start();f.buttons[2].click();first=f.take('photo-heart');
    f.fail(first);await tick();
    const returning=fixture({storage:f.storage});
    await returning.start(alreadySaved?saved({zaandam:1}):baseline());
    if(!alreadySaved){
      const retry=returning.take('photo-heart');assert.equal(retry.params.get('taps'),'1');
      returning.respond(retry,saved({zaandam:1}));await tick();
    }
    assert.equal(returning.state(2).count,'6');
  }

  // Web Locks allocate simultaneous taps in separate tabs to distinct targets.
  let chain=Promise.resolve();
  const locks={request:(_name,run)=>{const p=chain.then(run);chain=p.catch(()=>{});return p;}};
  const storage=new Map(),tabA=fixture({storage,locks});
  await tabA.start();
  const tabB=fixture({storage,locks});await tabB.start();
  tabA.buttons[0].click();tabB.buttons[0].click();
  assert.equal(tabA.state(0).count,'8');assert.equal(tabB.state(0).count,'8','Feedback does not wait for a lock');
  await tick();
  const a=tabA.take('photo-heart'),b=tabB.take('photo-heart');
  assert.equal(a.params.get('taps'),'1');assert.equal(b.params.get('taps'),'2','Concurrent tabs do not lose a tap');
  tabA.respond(a,saved({keukenhof:1}));tabB.respond(b,saved({keukenhof:2}));await tick();
  const newer=tabA.requests.find(r=>!r.done&&r.params.get('action')==='photo-heart');
  if(newer){assert.equal(newer.params.get('taps'),'2');tabA.respond(newer,saved({keukenhof:2}));await tick();}
  assert.equal(tabA.state(0).count,'9');assert.equal(tabB.state(0).count,'9');
  console.log('PASS: instant repeated taps and particles; independent photos; stale polls; offline retention and reload; idempotent retry; concurrent tabs; particle cleanup.');
})().catch(error=>{console.error(error);process.exitCode=1;});

