// Dependency-free startup/render smoke test. Run: node tests/smoke.cjs
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','index.html'),'utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(js,'Inline game script found');
new vm.Script(js,{filename:'pulsefall.js'});
const elements=new Map();
const ctx=new Proxy({}, {get:(o,k)=>k in o?o[k]:(k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{}),set:(o,k,v)=>(o[k]=v,true)});
function element(id){if(!elements.has(id))elements.set(id,{style:{},classList:{add(){},remove(){}},textContent:'',innerHTML:'',addEventListener(){},setPointerCapture(){},click(){this.onclick?.()}});return elements.get(id)}
let passed=0;
for(let n=1;n<=120;n++){
 const frames=[];
 const document={getElementById:element,querySelectorAll:()=>[],addEventListener(){},hidden:false};
 const sandbox={document,window:{addEventListener(){}},location:{search:'?diagnostics=1&testStage='+n},innerWidth:390,innerHeight:844,devicePixelRatio:1,performance:{now:()=>0},requestAnimationFrame(fn){frames.push(fn)},localStorage:{getItem(){return null},setItem(){throw Error('test mode attempted to save')},removeItem(){throw Error('test mode attempted to delete save')}},Math,Number,Set,Array,console:{warn(){}},URLSearchParams};
 element('game').getContext=()=>ctx;
 vm.runInNewContext(js,sandbox,{timeout:1500,filename:'pulsefall.js'});
 assert.ok(frames.length,'Animation scheduled at stage '+n);
 frames.shift()(16.67);
 assert.ok(element('score').textContent.includes('STAGE '+n+'/120'),'Stage '+n+' initialized');
 passed++;
}
console.log('PASS: parsed, initialized and rendered '+passed+' stages (not playthrough solvability).');
