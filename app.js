const canvas=document.getElementById('artCanvas');
const ctx=canvas.getContext('2d');
const picker=document.getElementById('colorPicker');
const hexValue=document.getElementById('hexValue');
const moodSelect=document.getElementById('mood');
const density=document.getElementById('density');
const densityLabel=document.getElementById('densityLabel');
let artNo=1;

function hexToRgb(hex){const n=parseInt(hex.slice(1),16);return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};}
function mix(a,b,t){return Math.round(a+(b-a)*t);}
function color(hex,alpha=1){const c=hexToRgb(hex);return `rgba(${c.r},${c.g},${c.b},${alpha})`;}
function adjust(hex,amount){const c=hexToRgb(hex);return `rgb(${Math.max(0,Math.min(255,c.r+amount))},${Math.max(0,Math.min(255,c.g+amount))},${Math.max(0,Math.min(255,c.b+amount))})`;}
function seededRandom(seed){let x=seed>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
function drawArt(){
 const w=canvas.width,h=canvas.height;
 const base=picker.value, mood=moodSelect.value, amount=Number(density.value);
 const rand=seededRandom(Date.now()%1000000+Math.floor(Math.random()*999999));
 hexValue.textContent=base.toUpperCase();
 densityLabel.textContent=['Whisper','Gentle','Balanced','Lush','Mythic'][amount-1];
 document.querySelectorAll('.swatch').forEach(s=>s.classList.toggle('selected',s.dataset.color.toLowerCase()===base.toLowerCase()));
 const bg=ctx.createLinearGradient(0,0,w,h);
 bg.addColorStop(0,'#061824');bg.addColorStop(.5,mood==='mystic'?'#10213d':'#082d3b');bg.addColorStop(1,'#04131f');
 ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 // Soft color currents
 for(let i=0;i<10+amount*3;i++){
   const x=rand()*w,y=rand()*h,r=50+rand()*170;
   const g=ctx.createRadialGradient(x,y,0,x,y,r);
   g.addColorStop(0,color(base,.04+rand()*.12));g.addColorStop(1,color(base,0));
   ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
 }
 // Fine drifting particles
 for(let i=0;i<180+amount*80;i++){
   const x=rand()*w,y=rand()*h,r=.5+rand()*2;
   ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
   ctx.fillStyle=rand()>.45?color(base,.15+rand()*.5):`rgba(197,239,255,${.12+rand()*.45})`;ctx.fill();
 }
 // Organic coral / abstract branching silhouettes
 const branchCount=5+amount*3;
 for(let b=0;b<branchCount;b++){
   const x=rand()*w,y=h*(.66+rand()*.38),len=75+rand()*180;
   ctx.lineCap='round';ctx.lineJoin='round';
   drawBranch(x,y,-Math.PI/2+(rand()-.5)*.6,len,2+rand()*7,3+amount*2,rand,base,mood);
 }
 // Floating jellyfish-like forms
 const jellies=2+amount;
 for(let j=0;j<jellies;j++){
   const x=rand()*w,y=90+rand()*h*.56,r=24+rand()*46;
   const palette=mood==='royal'?'#f3bd79':mood==='mystic'?'#9b8cff':base;
   ctx.save();ctx.translate(x,y);
   const glow=ctx.createRadialGradient(0,0,2,0,0,r*1.7);
   glow.addColorStop(0,color(palette,.3));glow.addColorStop(1,color(palette,0));
   ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,r*1.7,0,Math.PI*2);ctx.fill();
   ctx.beginPath();ctx.ellipse(0,0,r,r*.57,0,Math.PI,Math.PI*2);
   ctx.quadraticCurveTo(r*.9,r*.6,r*.52,r*.52);ctx.quadraticCurveTo(r*.22,r*.72,0,r*.48);ctx.quadraticCurveTo(-r*.28,r*.75,-r*.56,r*.5);ctx.quadraticCurveTo(-r*.9,r*.45,-r,0);
   ctx.closePath();ctx.fillStyle=color(palette,.38);ctx.fill();ctx.strokeStyle=color(palette,.85);ctx.lineWidth=1.5;ctx.stroke();
   for(let t=0;t<3+amount;t++){const tx=(rand()-.5)*r*1.5;ctx.beginPath();ctx.moveTo(tx,r*.38);ctx.bezierCurveTo(tx-12,r*.7,tx+12,r,tx+(rand()-.5)*30,r+25+rand()*55);ctx.strokeStyle=color(palette,.55);ctx.lineWidth=1+rand()*2;ctx.stroke();}
   ctx.restore();
 }
 // Palace-like geometric arches in the distance
 if(mood==='royal'||mood==='dream'){
   ctx.save();ctx.globalAlpha=.36;
   for(let i=0;i<5;i++){
    const x=100+i*155,y=h*.73,ww=50+rand()*30,hh=90+rand()*110;
    ctx.strokeStyle=i%2?color(base,.8):'#9bdde0';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x-ww/2,y);ctx.lineTo(x-ww/2,y-hh*.65);ctx.quadraticCurveTo(x-ww/2,y-hh,x,y-hh);ctx.quadraticCurveTo(x+ww/2,y-hh,x+ww/2,y-hh*.65);ctx.lineTo(x+ww/2,y);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x,y-hh*.65);ctx.lineTo(x,y-hh*.2);ctx.stroke();
   }
   ctx.restore();
 }
 // Kelp ribbons sweep up from the floor
 if(mood==='wild'||mood==='dream'){
   for(let k=0;k<10+amount*3;k++){
    const x=rand()*w,y=h+15,ht=90+rand()*240,lean=(rand()-.5)*130;
    ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x-lean,y-ht*.3,x+lean,y-ht*.7,x+lean*.4,y-ht);
    ctx.strokeStyle=k%3===0?color(base,.6):`rgba(61,176,146,${.2+rand()*.45})`;ctx.lineWidth=2+rand()*5;ctx.stroke();
   }
 }
 // Fine orbit rings, like currents and magical maps
 ctx.save();ctx.globalAlpha=.25;ctx.strokeStyle='#b5f7f1';ctx.lineWidth=1;
 for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(w*(.22+rand()*.56),h*(.2+rand()*.55),40+rand()*110,18+rand()*45,rand(),0,Math.PI*2);ctx.stroke();}
 ctx.restore();
 // Framing vignette and title glow
 const vignette=ctx.createRadialGradient(w/2,h/2,h*.12,w/2,h/2,h*.8);
 vignette.addColorStop(0,'rgba(0,8,18,0)');vignette.addColorStop(1,'rgba(0,8,18,.48)');
 ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
 const titles={dream:'The Lagoon Oracle',mystic:'Whispers of the Trench',royal:'The Coral Palace',wild:'The Kelp Cathedral'};
 document.getElementById('artTitle').textContent=titles[mood];
 document.getElementById('artNumber').textContent=String(artNo).padStart(3,'0');
 const moodNames={dream:'DREAMING REEF',mystic:'MYSTIC TRENCH',royal:'CORAL PALACE',wild:'KELP FOREST'};
 document.getElementById('paletteName').textContent=base.toUpperCase()+' · '+moodNames[mood];
}
function drawBranch(x,y,angle,len,width,depth,rand,base,mood){
 if(depth<=0||len<7)return;
 const bend=(rand()-.5)*.55;
 const nx=x+Math.cos(angle+bend)*len,ny=y+Math.sin(angle+bend)*len;
 ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo((x+nx)/2+(rand()-.5)*25,(y+ny)/2,nx,ny);
 ctx.strokeStyle=mood==='mystic'?(rand()>.5?'rgba(138,133,255,.7)':color(base,.65)):rand()>.5?color(base,.65):'rgba(91,205,181,.58)';
 ctx.lineWidth=width;ctx.stroke();
 if(depth>2){ctx.beginPath();ctx.arc(nx,ny,width*.85,0,Math.PI*2);ctx.fillStyle=color(base,.5);ctx.fill();}
 drawBranch(nx,ny,angle-.35-rand()*.5,len*(.65+rand()*.12),width*.72,depth-1,rand,base,mood);
 if(rand()>.18)drawBranch(nx,ny,angle+.25+rand()*.55,len*(.55+rand()*.15),width*.68,depth-1,rand,base,mood);
}
picker.addEventListener('input',drawArt);
document.querySelectorAll('.swatch').forEach(btn=>btn.addEventListener('click',()=>{picker.value=btn.dataset.color;drawArt();}));
moodSelect.addEventListener('change',drawArt);
density.addEventListener('input',drawArt);
document.getElementById('createBtn').addEventListener('click',()=>{artNo++;drawArt();});
document.getElementById('surpriseBtn').addEventListener('click',()=>{
 const colors=['#40d9c2','#ff7eaa','#a58aff','#ffca68','#6db8ff','#a8e66a','#ff9275','#e4a7ff','#f4f0ac'];
 picker.value=colors[Math.floor(Math.random()*colors.length)];
 const moods=['dream','mystic','royal','wild'];moodSelect.value=moods[Math.floor(Math.random()*moods.length)];
 density.value=1+Math.floor(Math.random()*5);artNo++;drawArt();
});
document.getElementById('downloadBtn').addEventListener('click',()=>{
 const link=document.createElement('a');link.download='abyssal-atelier-'+String(artNo).padStart(3,'0')+'.png';link.href=canvas.toDataURL('image/png');link.click();
});
drawArt();
