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
 for(let n=1;n<=18;n++){
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
  const expectedObjective=[8,11,14,17].includes(n)?'ordered':[9,12,15,18].includes(n)?'rush':'free';
  assert.equal(start.objective,expectedObjective,'Correct objective at stage '+n);
  assert.equal(start.timeLimitSeconds,expectedObjective==='rush'?45:90,'Correct time limit at stage '+n);
  if(expectedObjective==='ordered')assert.equal(start.nextPulse,1,'First ordered pulse is active at stage '+n);
  assert.equal(sandbox.window.PULSEFALL_TEST_REPORT().geometryPassed,18,'All 18 stages have valid geometry');
  const routeReport=sandbox.window.PULSEFALL_TEST_REPORT();
  assert.equal(routeReport.routeBudgetPassed,18,'All 18 route estimates fit time budgets');
  assert.equal(routeReport.routeAudits.length,18,'All stages have route audits');
  assert.equal(routeReport.routeAudits[n-1].hazardOrbConflicts,0,'No hazard-pulse overlaps at stage '+n);
  freshElement('play').click();
  handlers.keydown({code:'ArrowRight',repeat:false,preventDefault(){}});
  handlers.keydown({code:'Space',repeat:false,preventDefault(){}});
  handlers.keydown({code:'ShiftLeft',repeat:false,preventDefault(){}});
  for(let i=1;i<=2;i++){assert.ok(frames.length,'Frame scheduled '+label+' stage '+n);frames.shift()(i*16.67)}
  const activated=debug.snapshot();
  assert.ok(activated.time>0,'Physics time advanced '+label+' stage '+n);
  assert.ok(activated.player.x>start.player.x,'Right movement advanced '+label+' stage '+n);
  assert.equal(activated.player.g,-1,'Gravity reversed before any restart '+label+' stage '+n);
  assert.ok(activated.player.dashCooldown>0,'Dash activated before any restart '+label+' stage '+n);
  for(let i=3;i<=60;i++){assert.ok(frames.length,'Frame scheduled '+label+' stage '+n);frames.shift()(i*16.67)}
  handlers.keyup({code:'ArrowRight'});
  const after=debug.snapshot();
  assert.ok(after.time>0,'Physics simulation continued '+label+' stage '+n);
  assert.ok(freshElement('score').textContent.includes('STAGE '+n+'/18'),'Stage '+n+' initialized in '+label);
  passed++;
 }
}
console.log('PASS: '+passed+' startup/render/movement/gravity/dash smoke checks across 18 stages in portrait and landscape. Does not prove solvability.');
