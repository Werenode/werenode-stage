import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── Icônes SVG ────────────────────────────────────────────────────────────────
const ZapIcon    = ({size=32,color='#34d399'}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const CodeIcon   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const BatteryIcon= () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>;
const GameIcon   = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><line x1="8" y1="14" x2="12" y2="14"/><line x1="10" y1="12" x2="10" y2="16"/><circle cx="17" cy="13" r="1" fill="#34d399"/><circle cx="19" cy="15" r="1" fill="#34d399"/></svg>;

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES DU JEU
// ═══════════════════════════════════════════════════════════════════════════════
const GW = 900, GH = 500;
const BULLET_SPEED = 7;
const TANK_SPEED   = 3;
const MAX_BULLETS  = 5;
const MAX_MINES    = 3;
const SHOOT_CD     = 300;
const MINE_CD      = 800;
const POWERUP_TYPES  = ['heal','speed','rapid_fire','shield'];
const POWERUP_COLORS = { heal:'#00c864', speed:'#00dce6', rapid_fire:'#ffd700', shield:'#a000c8' };
const POWERUP_LABELS = { heal:'+VIE', speed:'SPEED', rapid_fire:'RAPIDE', shield:'SHIELD' };

function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function dist(ax,ay,bx,by){ return Math.sqrt((ax-bx)**2+(ay-by)**2); }
function rectsOverlap(ax,ay,aw,ah,bx,by,bw,bh){
  return ax < bx+bw && ax+aw > bx && ay < by+bh && ay+ah > by;
}

// ─── Générateur de murs ────────────────────────────────────────────────────────
function generateWalls(){
  const result=[];
  for(let i=0;i<12;i++){
    const w=randInt(30,120), h=randInt(30,100);
    const x=randInt(80, GW-80-w), y=randInt(80, GH-80-h);
    result.push({ x,y,w,h, hp:3, maxHp:3 });
  }
  return result;
}

// ─── État initial du jeu ───────────────────────────────────────────────────────
function initialGameState(){
  return {
    tanks: [
      { x:80,  y:220, angle:0,   color:'#2878ff', color2:'#4af', life:100, bullets:[], mines:[], speed:TANK_SPEED, baseSpeed:TANK_SPEED, shootCd:SHOOT_CD, lastShoot:0, lastMine:0, shield:0, effects:{}, id:0 },
      { x:780, y:220, angle:180, color:'#e03030', color2:'#f88', life:100, bullets:[], mines:[], speed:TANK_SPEED, baseSpeed:TANK_SPEED, shootCd:SHOOT_CD, lastShoot:0, lastMine:0, shield:0, effects:{}, id:1 },
    ],
    walls: generateWalls(),
    powerups: [],
    particles: [],
    lastPowerupSpawn: 0,
    score: [0,0],
    phase: 'playing',
    winner: null,
    winnerColor: null,
    deathTimer: 0,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIQUE DU JEU
// ═══════════════════════════════════════════════════════════════════════════════

function moveTank(tank, dx, dy, gs) {
  const nx = tank.x + dx, ny = tank.y + dy;
  if (nx < 0 || nx+40 > GW || ny < 0 || ny+30 > GH) return;
  for (const w of gs.walls)
    if (rectsOverlap(nx,ny,40,30, w.x,w.y,w.w,w.h)) return;
  tank.x = nx; tank.y = ny;
}

function shootTank(tank, now) {
  if (tank.bullets.length >= MAX_BULLETS) return;
  if (now - tank.lastShoot < tank.shootCd) return;
  const cx = tank.x+20, cy = tank.y+15;
  const spd = tank.effects.rapid_fire ? 12 : BULLET_SPEED;
  const rad = (tank.angle * Math.PI) / 180;
  tank.bullets.push({ x:cx, y:cy, vx: Math.cos(rad)*spd, vy:-Math.sin(rad)*spd, color:tank.color });
  tank.lastShoot = now;
}

function mineTank(tank, now) {
  if (tank.mines.length >= MAX_MINES) return;
  if (now - tank.lastMine < MINE_CD) return;
  tank.mines.push({ x:tank.x+20, y:tank.y+15, color:tank.color });
  tank.lastMine = now;
}

function updateBullets(self, enemy, gs) {
  self.bullets = self.bullets.filter(b => {
    b.x += b.vx; b.y += b.vy;
    if (b.x<0||b.x>GW||b.y<0||b.y>GH) return false;
    if (rectsOverlap(b.x-4,b.y-2,8,4, enemy.x,enemy.y,40,30)) {
      if (enemy.shield <= 0) enemy.life -= 10;
      spawnExplosion(gs, b.x, b.y, self.color, 12, 20);
      return false;
    }
    for (const w of [...gs.walls]) {
      if (rectsOverlap(b.x-4,b.y-2,8,4, w.x,w.y,w.w,w.h)) {
        spawnExplosion(gs, b.x, b.y, '#b4906a', 6, 15);
        w.hp--;
        if (w.hp<=0) {
          spawnExplosion(gs, w.x+w.w/2, w.y+w.h/2, '#b4906a', 20, 50);
          gs.walls = gs.walls.filter(x=>x!==w);
        }
        return false;
      }
    }
    return true;
  });
}

function updateMines(self, enemy, gs) {
  self.mines = self.mines.filter(m => {
    if (dist(m.x, m.y, enemy.x+20, enemy.y+15) < 45) {
      enemy.life -= 30;
      spawnExplosion(gs, m.x, m.y, '#ff8c00', 40, 80);
      return false;
    }
    return true;
  });
}

function spawnExplosion(gs, cx, cy, color, count=30, radius=60) {
  for (let i=0;i<count;i++) {
    const angle = Math.random()*Math.PI*2;
    const spd   = Math.random()*(radius/10)+1;
    const life  = randInt(20,50);
    gs.particles.push({ x:cx, y:cy, vx:Math.cos(angle)*spd, vy:Math.sin(angle)*spd, life, maxLife:life, color, size:randInt(3,8) });
  }
}

function updateParticles(gs) {
  gs.particles = gs.particles.filter(p => {
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.1; p.life--;
    return p.life > 0;
  });
}

function spawnPowerup(gs) {
  const type = POWERUP_TYPES[randInt(0, POWERUP_TYPES.length-1)];
  for (let i=0;i<50;i++) {
    const x=randInt(80,GW-80), y=randInt(80,GH-80);
    if (!gs.walls.some(w=>rectsOverlap(x-14,y-14,28,28,w.x,w.y,w.w,w.h))) {
      gs.powerups.push({ x, y, type, anim:0 });
      return;
    }
  }
}

function applyPowerup(tank, type, now) {
  if (type==='heal')            { tank.life = Math.min(100, tank.life+40); }
  else if (type==='speed')      { tank.speed=6; tank.effects.speed = now+5000; }
  else if (type==='rapid_fire') { tank.shootCd=100; tank.effects.rapid_fire = now+5000; }
  else if (type==='shield')     { tank.shield=300; tank.effects.shield = now+5000; }
}

function updateEffects(tank, now) {
  if (tank.effects.speed && now > tank.effects.speed) { tank.speed=tank.baseSpeed; delete tank.effects.speed; }
  if (tank.effects.rapid_fire && now > tank.effects.rapid_fire) { tank.shootCd=SHOOT_CD; delete tank.effects.rapid_fire; }
  if (tank.shield > 0) tank.shield--;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDU CANVAS
// ═══════════════════════════════════════════════════════════════════════════════
function drawGame(ctx, gs) {
  // Fond désert
  const grad = ctx.createLinearGradient(0,0,GW,GH);
  grad.addColorStop(0,'#c8a96e'); grad.addColorStop(1,'#a07840');
  ctx.fillStyle = grad; ctx.fillRect(0,0,GW,GH);
  // Texture
  ctx.globalAlpha=0.07;
  for(let i=0;i<GW;i+=20) for(let j=0;j<GH;j+=20)
    if((i+j)%40===0){ ctx.fillStyle='#fff'; ctx.fillRect(i,j,10,10); }
  ctx.globalAlpha=1;

  // Murs
  for (const w of gs.walls) {
    const ratio = w.hp / w.maxHp;
    ctx.save();
    ctx.fillStyle = `hsl(25,30%,${30+ratio*20}%)`;
    ctx.strokeStyle = '#4a3520'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(w.x, w.y, w.w, w.h, 6); ctx.fill(); ctx.stroke();
    if (w.hp < w.maxHp) {
      ctx.strokeStyle = `rgba(0,0,0,${0.5*(1-ratio)})`; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(w.x+w.w*0.3, w.y); ctx.lineTo(w.x+w.w*0.5, w.y+w.h);
      if (w.hp===1){ ctx.moveTo(w.x, w.y+w.h*0.4); ctx.lineTo(w.x+w.w, w.y+w.h*0.6); }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Powerups
  for (const p of gs.powerups) {
    p.anim = (p.anim+1)%60;
    const off = Math.sin(p.anim/60*Math.PI*2)*4;
    const cy = p.y + off, c = POWERUP_COLORS[p.type];
    ctx.beginPath(); ctx.arc(p.x, cy, 14, 0, Math.PI*2);
    ctx.fillStyle=c+'44'; ctx.fill();
    ctx.strokeStyle=c; ctx.lineWidth=2; ctx.stroke();
    ctx.fillStyle='#000'; ctx.font='bold 9px monospace';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(POWERUP_LABELS[p.type], p.x, cy);
  }

  // Particules
  for (const p of gs.particles) {
    const ratio = p.life/p.maxLife;
    ctx.globalAlpha = ratio*0.9;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1,p.size*ratio), 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha=1;

  // Tanks
  for (const t of gs.tanks) {
    ctx.save();
    ctx.translate(t.x+20, t.y+15);
    ctx.rotate(-t.angle * Math.PI / 180);
    // Bouclier
    if (t.shield > 0) {
      const a = Math.min(0.5, t.shield/300);
      ctx.beginPath(); ctx.arc(0,0,26,0,Math.PI*2);
      ctx.fillStyle=`rgba(100,100,255,${a*0.35})`; ctx.fill();
      ctx.strokeStyle=`rgba(150,150,255,${a})`; ctx.lineWidth=2; ctx.stroke();
    }
    // Corps
    ctx.fillStyle=t.color; ctx.beginPath(); ctx.roundRect(-18,-12,36,24,4); ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.lineWidth=1.5; ctx.stroke();
    // Chenilles
    ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fillRect(-18,-14,36,4); ctx.fillRect(-18,10,36,4);
    // Canon
    ctx.fillStyle=t.color; ctx.fillRect(4,-3,20,6);
    ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.lineWidth=1; ctx.stroke();
    // Tourelle
    ctx.beginPath(); ctx.arc(0,0,9,0,Math.PI*2);
    ctx.fillStyle='white'; ctx.globalAlpha=0.3; ctx.fill(); ctx.globalAlpha=1;
    ctx.strokeStyle=t.color; ctx.lineWidth=2; ctx.stroke();
    ctx.restore();

    // Balles
    for (const b of t.bullets) {
      ctx.fillStyle=b.color; ctx.shadowColor=b.color; ctx.shadowBlur=6;
      ctx.beginPath(); ctx.ellipse(b.x,b.y,5,3,Math.atan2(b.vy,b.vx),0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
    }
    // Mines
    for (const m of t.mines) {
      ctx.beginPath(); ctx.arc(m.x,m.y,9,0,Math.PI*2);
      ctx.fillStyle=m.color+'99'; ctx.fill();
      ctx.strokeStyle=m.color; ctx.lineWidth=2; ctx.stroke();
      ctx.strokeStyle='rgba(0,0,0,0.6)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(m.x-5,m.y); ctx.lineTo(m.x+5,m.y);
      ctx.moveTo(m.x,m.y-5); ctx.lineTo(m.x,m.y+5); ctx.stroke();
    }
  }

  // HUD
  const [t1,t2] = gs.tanks;
  const drawBar = (tank, x) => {
    ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.roundRect(x,10,104,16,4); ctx.fill();
    const pct = Math.max(0,tank.life/100);
    ctx.fillStyle = pct>0.6 ? tank.color : pct>0.3 ? '#ffd700' : '#e03030';
    if(pct>0){ ctx.beginPath(); ctx.roundRect(x+2,12,pct*100,12,3); ctx.fill(); }
    ctx.fillStyle='white'; ctx.font='bold 10px monospace'; ctx.textAlign='center';
    ctx.fillText(`${Math.ceil(Math.max(0,tank.life))} PV`, x+52, 21);
    ctx.font='9px monospace'; ctx.fillStyle='rgba(255,255,255,0.55)'; ctx.textAlign='left';
    ctx.fillText(`⬤ ${tank.bullets.length}/${MAX_BULLETS}   ✕ ${tank.mines.length}/${MAX_MINES}`, x, 38);
    let ey=50;
    for(const eff of Object.keys(tank.effects)){
      ctx.fillStyle=POWERUP_COLORS[eff];
      ctx.fillText(POWERUP_LABELS[eff], x, ey); ey+=11;
    }
  };
  drawBar(t1, 10);
  drawBar(t2, GW-114);

  // Noms des joueurs
  ctx.font='bold 12px monospace'; ctx.textAlign='center';
  ctx.fillStyle=t1.color; ctx.fillText('J1', 62, 8);
  ctx.fillStyle=t2.color; ctx.fillText('J2', GW-62, 8);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT JEU
// ═══════════════════════════════════════════════════════════════════════════════
function TankGame() {
  const canvasRef = useRef(null);
  const stateRef  = useRef(initialGameState());
  const keysRef   = useRef({});
  const animRef   = useRef(null);
  const [uiScore, setUiScore] = useState([0,0]);
  const [phase, setPhase]     = useState('playing');
  const [winner, setWinner]   = useState(null);
  const [winColor, setWinColor] = useState(null);

  const tick = useCallback((ts) => {
    const gs  = stateRef.current;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) { animRef.current = requestAnimationFrame(tick); return; }

    if (gs.phase === 'gameover') {
      updateParticles(gs);
      drawGame(ctx, gs);
      animRef.current = requestAnimationFrame(tick);
      return;
    }

    const k = keysRef.current;
    const [t1, t2] = gs.tanks;

    if (k['z']||k['Z'])     { moveTank(t1, 0,-t1.speed,gs); t1.angle=90;  }
    if (k['s']||k['S'])     { moveTank(t1, 0, t1.speed,gs); t1.angle=270; }
    if (k['q']||k['Q'])     { moveTank(t1,-t1.speed,0,gs);  t1.angle=180; }
    if (k['d']||k['D'])     { moveTank(t1, t1.speed,0,gs);  t1.angle=0;   }
    if (k['e']||k['E'])     shootTank(t1, ts);
    if (k['a']||k['A'])     mineTank(t1, ts);

    if (k['ArrowUp'])       { moveTank(t2, 0,-t2.speed,gs); t2.angle=90;  }
    if (k['ArrowDown'])     { moveTank(t2, 0, t2.speed,gs); t2.angle=270; }
    if (k['ArrowLeft'])     { moveTank(t2,-t2.speed,0,gs);  t2.angle=180; }
    if (k['ArrowRight'])    { moveTank(t2, t2.speed,0,gs);  t2.angle=0;   }
    if (k['Enter'])         shootTank(t2, ts);
    if (k['Shift'])         mineTank(t2, ts);

    if (ts - gs.lastPowerupSpawn > 8000 && gs.powerups.length < 4) {
      spawnPowerup(gs); gs.lastPowerupSpawn = ts;
    }
    for (const p of [...gs.powerups]) {
      for (const tank of gs.tanks) {
        if (rectsOverlap(tank.x,tank.y,40,30, p.x-14,p.y-14,28,28)) {
          applyPowerup(tank, p.type, ts);
          spawnExplosion(gs, p.x, p.y, POWERUP_COLORS[p.type], 15, 30);
          gs.powerups = gs.powerups.filter(x=>x!==p);
        }
      }
    }

    for (let i=0;i<2;i++) { updateBullets(gs.tanks[i], gs.tanks[1-i], gs); updateMines(gs.tanks[i], gs.tanks[1-i], gs); }
    for (const t of gs.tanks) updateEffects(t, ts);
    updateParticles(gs);

    for (const t of gs.tanks) {
      if (t.life <= 0) {
        const win = gs.tanks[1-t.id];
        gs.score[win.id]++;
        gs.phase = 'gameover';
        for(let i=0;i<5;i++) spawnExplosion(gs, randInt(200,700), randInt(100,400), win.color, 60, 100);
        setUiScore([...gs.score]);
        setPhase('gameover');
        setWinner(`Joueur ${win.id+1}`);
        setWinColor(win.color);
        break;
      }
    }

    drawGame(ctx, gs);
    animRef.current = requestAnimationFrame(tick);
  }, []);

  const restart = useCallback(() => {
    const prev = [...stateRef.current.score];
    const ns = initialGameState();
    ns.score = prev;
    stateRef.current = ns;
    setPhase('playing');
    setWinner(null);
  }, []);

  useEffect(() => {
    const onDown = e => {
      keysRef.current[e.key] = true;
      if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter'].includes(e.key)) e.preventDefault();
    };
    const onUp = e => { delete keysRef.current[e.key]; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup',   onUp);
    return () => { window.removeEventListener('keydown',onDown); window.removeEventListener('keyup',onUp); };
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [tick]);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
      {/* Score */}
      <div style={{ display:'flex', justifyContent:'space-between', width:'100%', maxWidth:GW, padding:'0 2px', alignItems:'center' }}>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', lineHeight:1.8 }}>
          <b style={{color:'#4af'}}>Joueur 1</b> — Z/Q/S/D · E tir · A mine
        </div>
        <div style={{ fontSize:22, fontWeight:900, letterSpacing:6 }}>
          <span style={{color:'#4af'}}>{uiScore[0]}</span>
          <span style={{color:'rgba(255,255,255,0.25)'}}> – </span>
          <span style={{color:'#f88'}}>{uiScore[1]}</span>
        </div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', lineHeight:1.8, textAlign:'right' }}>
          <b style={{color:'#f88'}}>Joueur 2</b> — ↑↓←→ · Entrée tir · Shift mine
        </div>
      </div>

      {/* Canvas */}
      <div style={{ position:'relative', width:'100%', maxWidth:GW }}>
        <canvas ref={canvasRef} width={GW} height={GH}
          style={{ borderRadius:14, border:'1px solid rgba(255,255,255,0.1)', display:'block', width:'100%' }}
        />
        {phase==='gameover' && (
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', borderRadius:14, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(6px)' }}>
            <div style={{ fontSize:40, fontWeight:900, color:winColor, textShadow:`0 0 30px ${winColor}`, marginBottom:8, fontFamily:'monospace' }}>
              {winner} GAGNE !
            </div>
            <div style={{ color:'rgba(255,255,255,0.45)', fontSize:15, marginBottom:28 }}>
              Score : {uiScore[0]} – {uiScore[1]}
            </div>
            <button onClick={restart} style={{ padding:'12px 36px', borderRadius:10, border:'none', cursor:'pointer', background:'linear-gradient(90deg,#10b981,#06b6d4)', color:'white', fontWeight:700, fontSize:16 }}>
              ▶ Rejouer
            </button>
          </div>
        )}
      </div>

      {/* Légende powerups */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
        {Object.entries(POWERUP_COLORS).map(([k,c]) => (
          <span key={k} style={{ fontSize:11, background:`${c}22`, color:c, border:`1px solid ${c}55`, padding:'3px 10px', borderRadius:6 }}>
            {POWERUP_LABELS[k]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════════════════════════
export default function Appli() {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('missions');

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const missions = [
    { icon:<CodeIcon/>, title:"Réalisation d'un jeu en Python et d'un site rapport de stage", description:"développement d'applications web avec React et Node.js", tags:["React","Node.js","PostgreSQL"] },
    { icon:<BatteryIcon/>, title:"Immersion dans le métier d'ingénieur", description:"Intégration de solutions IoT pour la gestion intelligente de bornes de recharge", tags:["IoT","MQTT","APIs"] },
  ];
  const competences = [
    { nom:"Codage et programmation", niveau:25 },
    { nom:"Physique quantique",  niveau:1 },
    { nom:"Compréhension du métier d'ingénieur",        niveau:85 },
  ];
  const timeline = [
    { mois:"Jour 1",   titre:"Onboarding",    desc:"Visite de Centrale Supélec et introduction au métier d'un ingénieur dans l'électricité" },
    { mois:"Jour 2–4", titre:"Programmation",  desc:"Visite de plusieurs zones de charges et bornes et programmation d'une application et d'un jeu " },
    { mois:"Jour 5",   titre:"Bilan",         desc:"Fin des programmes et visite du DateCenter" },
  ];

  const s = {
    page: { minHeight:'100vh', background:'#0a0e27', color:'white', overflowX:'hidden', fontFamily:"'Segoe UI', system-ui, sans-serif", margin:0, padding:0 },
    blob:  { position:'fixed', width:500, height:500, background:'radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(6,182,212,0.08) 100%)', borderRadius:'50%', filter:'blur(80px)', top:'10%', left:'10%', pointerEvents:'none', zIndex:0, transform:`translate(${scrollY*0.05}px, ${scrollY*0.03}px)` },
    blob2: { position:'fixed', width:350, height:350, background:'radial-gradient(circle, rgba(100,0,200,0.12) 0%, transparent 100%)', borderRadius:'50%', filter:'blur(80px)', bottom:'5%', right:'5%', pointerEvents:'none', zIndex:0 },
    nav:   { position:'fixed', top:0, left:0, right:0, zIndex:50, backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', background:'rgba(10,14,39,0.9)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'0 32px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' },
    section: { padding:'80px 32px', maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 },
    h2: { fontSize:'clamp(26px,4vw,40px)', fontWeight:800, textAlign:'center', marginBottom:48, background:'linear-gradient(90deg,white,rgba(255,255,255,0.6))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
    card: { padding:28, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:18 },
    tag: { fontSize:11, background:'rgba(52,211,153,0.12)', color:'#34d399', padding:'3px 10px', borderRadius:6, border:'1px solid rgba(52,211,153,0.2)' },
  };

  const tabs = [
    { id:'missions', label:'Missions' },
    { id:'competences', label:'Compétences' },
    { id:'timeline', label:'Timeline' },
    { id:'jeu', label:'🎮 Jeu' },
  ];

  return (
    <div style={s.page}>
      <div style={s.blob}/>
      <div style={s.blob2}/>

      {/* Nav */}
      <nav style={s.nav}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <ZapIcon size={26} color="#34d399"/>
          <span style={{ fontSize:19, fontWeight:800, background:'linear-gradient(90deg,#34d399,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Werenode Stage
          </span>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {tabs.map(t=>(
            <a key={t.id} href={`#${t.id}`} onClick={()=>setActiveTab(t.id)} style={{ padding:'7px 15px', borderRadius:8, fontSize:13, textDecoration:'none', fontWeight:600, background:activeTab===t.id?'rgba(52,211,153,0.12)':'transparent', color:activeTab===t.id?'#34d399':'rgba(255,255,255,0.45)', border:`1px solid ${activeTab===t.id?'rgba(52,211,153,0.3)':'transparent'}`, transition:'all 0.2s' }}>
              {t.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'80px 24px 40px', position:'relative', zIndex:1 }}>
        <div style={{ fontSize:10, letterSpacing:4, color:'#34d399', textTransform:'uppercase', marginBottom:16, border:'1px solid rgba(52,211,153,0.3)', padding:'4px 16px', borderRadius:999, display:'inline-block' }}>
          Stage de 3ème
        </div>
        <h1 style={{ fontSize:'clamp(40px,8vw,84px)', fontWeight:900, lineHeight:1.05, marginBottom:24, background:'linear-gradient(135deg,#34d399 0%,#22d3ee 50%,#818cf8 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
          Mon Stage chez<br/>Werenode
        </h1>
        <p style={{ fontSize:19, color:'rgba(255,255,255,0.42)', marginBottom:40, maxWidth:460 }}>
          Découverte de la recharge intelligente pour véhicules électriques
        </p>
        <div style={{ display:'flex', gap:12 }}>
          <a href="#missions" onClick={()=>setActiveTab('missions')} style={{ padding:'13px 30px', background:'linear-gradient(90deg,#10b981,#06b6d4)', borderRadius:12, fontWeight:700, fontSize:15, color:'white', textDecoration:'none', boxShadow:'0 4px 24px rgba(16,185,129,0.3)' }}>
            Voir mes missions
          </a>
          <a href="#jeu" onClick={()=>setActiveTab('jeu')} style={{ padding:'13px 30px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, fontWeight:700, fontSize:15, color:'white', textDecoration:'none' }}>
            🎮 Jouer
          </a>
        </div>
      </section>

      {/* Missions */}
      <section id="missions" style={s.section}>
        <h2 style={s.h2}>Mes Missions</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
          {missions.map((m,i)=>(
            <div key={i} style={s.card}>
              {m.icon}
              <h3 style={{ fontSize:18, fontWeight:700, margin:'12px 0 8px' }}>{m.title}</h3>
              <p style={{ color:'rgba(255,255,255,0.48)', lineHeight:1.6, marginBottom:16, fontSize:14 }}>{m.description}</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>{m.tags.map(t=><span key={t} style={s.tag}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Compétences */}
      <section id="competences" style={{ ...s.section, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={s.h2}>Compétences</h2>
        <div style={{ maxWidth:540, margin:'0 auto' }}>
          {competences.map((c,i)=>(
            <div key={i} style={{ marginBottom:28 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14 }}>
                <span>{c.nom}</span><span style={{ color:'#34d399', fontWeight:700 }}>{c.niveau}%</span>
              </div>
              <div style={{ height:8, background:'rgba(255,255,255,0.08)', borderRadius:999, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${c.niveau}%`, background:'linear-gradient(90deg,#10b981,#06b6d4)', borderRadius:999 }}/>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" style={{ ...s.section, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={s.h2}>Déroulé du Stage</h2>
        <div style={{ maxWidth:460, margin:'0 auto' }}>
          {timeline.map((t,i)=>(
            <div key={i} style={{ display:'flex', gap:20, marginBottom:32 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                <div style={{ width:14, height:14, borderRadius:'50%', background:'linear-gradient(135deg,#34d399,#22d3ee)', flexShrink:0, boxShadow:'0 0 10px rgba(52,211,153,0.5)' }}/>
                {i<timeline.length-1&&<div style={{ width:2, flex:1, background:'rgba(255,255,255,0.08)', marginTop:6 }}/>}
              </div>
              <div style={{ paddingBottom:i<timeline.length-1?24:0 }}>
                <div style={{ fontSize:10, color:'#34d399', letterSpacing:2, textTransform:'uppercase', marginBottom:4 }}>{t.mois}</div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>{t.titre}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.42)' }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Jeu */}
      <section id="jeu" style={{ ...s.section, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.22)', borderRadius:999, padding:'5px 20px', marginBottom:14 }}>
            <GameIcon/><span style={{ fontSize:11, color:'#34d399', letterSpacing:2, textTransform:'uppercase', fontWeight:700 }}>Mini-jeu</span>
          </div>
          <h2 style={s.h2}>Combat de Chars</h2>
          <p style={{ color:'rgba(255,255,255,0.38)', fontSize:14, marginTop:-32, marginBottom:0 }}>
            Jeu 2 joueurs local — porté depuis le code Python du stage
          </p>
        </div>
        <TankGame/>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.07)', padding:'28px 24px', textAlign:'center', color:'rgba(255,255,255,0.22)', fontSize:13, position:'relative', zIndex:1 }}>
        Stage de 3ème • monstage.werenode.fr
      </footer>
    </div>
  );
}
