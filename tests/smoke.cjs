// Dependency-free startup/render smoke test. Run: node tests/smoke.cjs
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(js,'Inline game script found');
new vm.Script(js,{filename:'pulsefall.js'});
const elements=new Map();
const ctx=new Proxy({}, {get:(o,k)=>k in o?o[k]:(k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{}),set:(o,k,v)=>(o[k]=v,true)});
function element(id){if(!elements.has(id))elements.set(id,{style:{},classList:{add(){},remove(){}},textContent:'',innerHTML:'',addEventListener(){},setPointerCapture(){},click(){this.onclick?.()}});return elements.get(id)}
let passed=0;
for(const [width,height,label] of [[390,844,'portrait'],[960,540,'landscape']]){
 for(let n=1;n<=120;n++){
  const frames=[],elements=new Map();
  function freshElement(id){if(!elements.has(id))elements.set(id,{style:{},classList:{add(){},remove(){}},textContent:'',innerHTML:'',addEventListener(){},setPointerCapture(){},click(){this.onclick?.()}});return elements.get(id)}
  const handlers={};const document={getElementById:freshElement,querySelectorAll:()=>[],addEventListener(type,fn){handlers[type]=fn},hidden:false};
  freshElement('game').getContext=()=>ctx;
  const sandbox={document,window:{addEventListener(){}},location:{search:'?diagnostics=1&testStage='+n},innerWidth:width,innerHeight:height,devicePixelRatio:1,performance:{now:()=>0},requestAnimationFrame(fn){frames.push(fn)},localStorage:{getItem(){return null},setItem(){throw Error('test mode attempted to save')},removeItem(){throw Error('test mode attempted to delete save')}},Math,Number,Set,Array,console:{warn(){}},URLSearchParams,addEventListener(){}};
  vm.runInNewContext(js,sandbox,{timeout:1500,filename:'pulsefall.js'});
  assert.ok(frames.length,'Animation scheduled at stage '+n);
  const debug=sandbox.window.PULSEFALL_DEBUG;
  assert.ok(debug,'Diagnostic physics snapshot available at stage '+n);
  const start=debug.snapshot();
  assert.equal(start.level,n);
  freshElement('play').click();
  handlers.keydown({code:'ArrowRight',repeat:false,preventDefault(){}});
  handlers.keydown({code:'Space',repeat:false,preventDefault(){}});
  handlers.keydown({code:'ShiftLeft',repeat:false,preventDefault(){}});
  for(let i=1;i<=60;i++){assert.ok(frames.length,'Frame scheduled '+label+' stage '+n);frames.shift()(i*16.67)}
  handlers.keyup({code:'ArrowRight'});
  const after=debug.snapshot();
  assert.ok(after.time>0,'Physics time advanced '+label+' stage '+n);
  assert.ok(after.player.x>start.player.x,'Right movement advanced '+label+' stage '+n);
  assert.equal(after.player.g,-1,'Gravity reversed '+label+' stage '+n);
  assert.ok(after.player.dashCooldown>0,'Dash activated '+label+' stage '+n);
  assert.ok(freshElement('score').textContent.includes('STAGE '+n+'/120'),'Stage '+n+' initialized in '+label);
  passed++;
 }
}
console.log('PASS: '+passed+' startup/render/movement/gravity/dash smoke checks across 120 stages in portrait and landscape. Does not prove solvability.');
