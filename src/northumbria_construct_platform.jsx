import { useState, useEffect } from "react";

// ── Brand ─────────────────────────────────────────────────────────────────────
const B = {
  dk:"#1A3C2E",md:"#2D6A4F",ac:"#40916C",lt:"#74C69D",
  pl:"#D8F3DC",st:"#EBF7EE",tx:"#1C2B22",tm:"#3A5242",
  tg:"#607466",wh:"#FFFFFF",
};
const AREA_COLOR={Strategy:"#1A3C2E",Operations:"#2D6A4F",Training:"#52B788",Comms:"#40916C",Media:"#74C69D"};
const STATUS_STYLE={
  "Complete":   {bg:"#C6EFCE",fg:"#1A5C2A",bd:"#74C69D"},
  "In Progress":{bg:"#FFF3CD",fg:"#7A5000",bd:"#F0C040"},
  "Not Started":{bg:"#FFE0E0",fg:"#8B1A1A",bd:"#E08080"},
};
const PRI_STYLE={
  Critical:{bg:"#1A3C2E",fg:"#fff"},High:{bg:"#40916C",fg:"#fff"},
  Medium:{bg:"#D8F3DC",fg:"#2D6A4F"},Low:{bg:"#f0f0f0",fg:"#555"},
};
const RACI_CYCLE=["","R","A","C","I"];
const RACI_STYLE={
  R:{bg:"#1A3C2E",fg:"#fff"},A:{bg:"#40916C",fg:"#fff"},
  C:{bg:"#D8F3DC",fg:"#1A3C2E"},I:{bg:"#e4e4e4",fg:"#555"},
  "":{bg:"transparent",fg:"#bbb"},
};

// ── Team (V1.1) ───────────────────────────────────────────────────────────────
const TEAM=[
  {id:"callum",    name:"Callum O'Connor",   role:"President / CEO",              area:"Strategy",   resp:"NSU approvals, strategic oversight, institutional alignment, internal coordination"},
  {id:"sandhya",   name:"Sandhya Chimata",    role:"Vice President / COO",         area:"Operations", resp:"Operational coordination and delivery assurance"},
  {id:"kufre",     name:"Kufre Antia",        role:"Training & Dev Manager / CTO", area:"Training",   resp:"Debate structure, speaker briefing, academic rigour, LinkedIn content capture (Audio-Visual), Documentation"},
  {id:"tolulope",  name:"Tolulope Idowu",     role:"Project Manager",              area:"Comms",      resp:"Promotion, Budget oversight, partnerships with depts & societies"},
  {id:"uchechukwu",name:"Uchechukwu Maduwuba",role:"Event / Media Manager",        area:"Media",      resp:"Audio Visuals, Media, Venue and NSU Logistics"},
];

// ── Tasks (V1.1 — tasks 2,3 Complete; task 5 In Progress; task 11 restored) ──
const DEFAULT_TASKS=[
  {id:1, desc:"Confirm event date & format",       owner:"callum",    start:"2026-04-06",end:"2026-04-06",status:"Complete",   pri:"Critical",deps:"",    notes:"Event fixed for 28 April",                                        pct:100},
  {id:2, desc:"Finalise debate motion",            owner:"kufre",     start:"2026-04-06",end:"2026-04-06",status:"Complete",   pri:"High",    deps:"1",   notes:"Single motion only",                                              pct:100},
  {id:3, desc:"Submit Event and Location booking", owner:"tolulope",  start:"2026-04-06",end:"2026-04-07",status:"Complete",   pri:"High",    deps:"1",   notes:"NSU approval confirmed",                                          pct:100},
  {id:4, desc:"Confirm Debate Chair",              owner:"callum",    start:"2026-04-07",end:"2026-04-08",status:"Not Started",pri:"High",    deps:"3",   notes:"Kelechi Ayanso, Barry Gledson, Michelle Littlemore, Pablo Martinez",pct:0},
  {id:5, desc:"Invitation for speakers",           owner:"tolulope",  start:"2026-04-08",end:"2026-04-09",status:"In Progress",pri:"High",    deps:"2,4", notes:"Prop & Opp — invitations sent",                                   pct:0},
  {id:6, desc:"Confirm speakers + reserves",       owner:"kufre",     start:"2026-04-09",end:"2026-04-11",status:"Not Started",pri:"High",    deps:"5",   notes:"Kufre, Lucas, Ikechukwu, Vemula, Judith, Adiyita, Maria",         pct:0},
  {id:7, desc:"Issue speaker briefing pack",       owner:"kufre",     start:"2026-04-11",end:"2026-04-11",status:"Not Started",pri:"Medium",  deps:"6",   notes:"Oxford rules",                                                    pct:0},
  {id:8, desc:"Launch promotion",                  owner:"tolulope",  start:"2026-04-12",end:"2026-04-23",status:"Not Started",pri:"High",    deps:"2,3", notes:"LinkedIn + reps",                                                 pct:0},
  {id:9, desc:"Open registration form",            owner:"tolulope",  start:"2026-04-12",end:"2026-04-27",status:"Not Started",pri:"Medium",  deps:"8",   notes:"MS Forms",                                                        pct:0},
  {id:10,desc:"Engage academic reps & societies",  owner:"tolulope",  start:"2026-04-14",end:"2026-04-17",status:"Not Started",pri:"Medium",  deps:"8",   notes:"Dept amplification",                                              pct:0},
  {id:11,desc:"Prepare debate run-of-show",        owner:"callum",    start:"2026-04-14",end:"2026-04-15",status:"Not Started",pri:"Medium",  deps:"4,6", notes:"Chair script",                                                    pct:0},
  {id:12,desc:"Prepare voting forms (QR)",         owner:"kufre",     start:"2026-04-16",end:"2026-04-18",status:"Not Started",pri:"Medium",  deps:"2",   notes:"Pre & post vote",                                                 pct:0},
  {id:13,desc:"Confirm AV & room setup",           owner:"uchechukwu",start:"2026-04-18",end:"2026-04-21",status:"Not Started",pri:"High",    deps:"3",   notes:"3 microphones, projector",                                        pct:0},
  {id:14,desc:"Promotion reminder push",           owner:"tolulope",  start:"2026-04-21",end:"2026-04-22",status:"Not Started",pri:"Medium",  deps:"8,9", notes:"Attendance boost",                                                pct:0},
  {id:15,desc:"Speaker reconfirmation",            owner:"kufre",     start:"2026-04-23",end:"2026-04-24",status:"Not Started",pri:"High",    deps:"6",   notes:"No-shows risk",                                                   pct:0},
  {id:16,desc:"Final logistics walkthrough",       owner:"uchechukwu",start:"2026-04-27",end:"2026-04-27",status:"Not Started",pri:"High",    deps:"13",  notes:"Go / No-go check",                                                pct:0},
  {id:17,desc:"DELIVER EVENT",                     owner:"callum",    start:"2026-04-28",end:"2026-04-28",status:"Not Started",pri:"Critical",deps:"16",  notes:"Event day — Reds Hall",                                           pct:0},
  {id:18,desc:"Publish LinkedIn article",          owner:"kufre",     start:"2026-04-29",end:"2026-05-01",status:"Not Started",pri:"Medium",  deps:"17",  notes:"Post-event output",                                               pct:0},
  {id:19,desc:"Capture feedback & lessons learned",owner:"tolulope",  start:"2026-04-29",end:"2026-05-03",status:"Not Started",pri:"Medium",  deps:"17",  notes:"Repeatability",                                                   pct:0},
];

const DEFAULT_RACI={
  1:{callum:"A",sandhya:"C",kufre:"I",tolulope:"R",uchechukwu:"I"},
  2:{callum:"A",sandhya:"C",kufre:"R",tolulope:"I",uchechukwu:"I"},
  3:{callum:"A",sandhya:"I",kufre:"I",tolulope:"R",uchechukwu:"C"},
  4:{callum:"R",sandhya:"A",kufre:"C",tolulope:"I",uchechukwu:"I"},
  5:{callum:"A",sandhya:"I",kufre:"C",tolulope:"R",uchechukwu:"I"},
  6:{callum:"A",sandhya:"I",kufre:"R",tolulope:"C",uchechukwu:"I"},
  7:{callum:"A",sandhya:"I",kufre:"R",tolulope:"I",uchechukwu:"I"},
  8:{callum:"A",sandhya:"I",kufre:"C",tolulope:"R",uchechukwu:"C"},
  9:{callum:"A",sandhya:"I",kufre:"I",tolulope:"R",uchechukwu:"I"},
  10:{callum:"A",sandhya:"I",kufre:"C",tolulope:"R",uchechukwu:"I"},
  11:{callum:"R",sandhya:"I",kufre:"A",tolulope:"I",uchechukwu:"I"},
  12:{callum:"A",sandhya:"I",kufre:"R",tolulope:"I",uchechukwu:"I"},
  13:{callum:"A",sandhya:"I",kufre:"I",tolulope:"C",uchechukwu:"R"},
  14:{callum:"A",sandhya:"I",kufre:"C",tolulope:"R",uchechukwu:"I"},
  15:{callum:"A",sandhya:"I",kufre:"R",tolulope:"C",uchechukwu:"I"},
  16:{callum:"A",sandhya:"C",kufre:"I",tolulope:"C",uchechukwu:"R"},
  17:{callum:"A",sandhya:"R",kufre:"R",tolulope:"R",uchechukwu:"R"},
  18:{callum:"A",sandhya:"I",kufre:"R",tolulope:"C",uchechukwu:"I"},
  19:{callum:"A",sandhya:"I",kufre:"C",tolulope:"R",uchechukwu:"I"},
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const GANTT_START=new Date("2026-04-06T12:00:00");
const GANTT_DAYS=33;
function ganttOffset(d){return Math.max(0,Math.round((new Date(d+"T12:00:00")-GANTT_START)/86400000));}
function ganttWidth(s,e){return Math.max(1,ganttOffset(e)-ganttOffset(s)+1);}
function fmtDate(d){if(!d)return"—";return new Date(d+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"});}
function memberObj(id){return TEAM.find(t=>t.id===id)||{name:id,area:"",role:""};}
function initials(n){return n.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();}
function calcPct(tasks){return tasks.length?Math.round(tasks.reduce((s,t)=>s+t.pct,0)/tasks.length):0;}
function loadState(key,def){try{const s=localStorage.getItem(key);return s?JSON.parse(s):JSON.parse(JSON.stringify(def));}catch{return JSON.parse(JSON.stringify(def));}}

function useIsMobile(){
  const[m,setM]=useState(()=>typeof window!=="undefined"&&window.innerWidth<768);
  useEffect(()=>{const h=()=>setM(window.innerWidth<768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  return m;
}

// ── Primitives ────────────────────────────────────────────────────────────────
function Avatar({name,area,size=32}){
  return<div style={{width:size,height:size,borderRadius:"50%",background:AREA_COLOR[area]||B.ac,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
    <span style={{fontSize:size*.38,fontWeight:700,color:"#fff"}}>{initials(name)}</span>
  </div>;
}
function Badge({label,small=false}){
  const s=STATUS_STYLE[label]||{bg:B.pl,fg:B.md,bd:"transparent"};
  return<span style={{display:"inline-block",padding:small?"2px 7px":"3px 10px",borderRadius:20,fontSize:small?10:11,fontWeight:600,background:s.bg,color:s.fg,border:`1px solid ${s.bd}`,whiteSpace:"nowrap"}}>{label}</span>;
}
function PriBadge({label}){
  const s=PRI_STYLE[label]||PRI_STYLE.Low;
  return<span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:s.bg,color:s.fg,whiteSpace:"nowrap"}}>{label}</span>;
}
function Pbar({pct,h=6,done=false}){
  return<div style={{height:h,borderRadius:99,background:B.pl,overflow:"hidden",flex:1}}>
    <div style={{height:"100%",width:`${pct}%`,borderRadius:99,transition:"width .4s",background:done?"#1A5C2A":B.ac}}/>
  </div>;
}
function Card({children,style:s}){return<div style={{background:B.wh,borderRadius:14,border:`1px solid ${B.pl}`,padding:"16px 18px",...s}}>{children}</div>;}
function SecHead({title,sub}){return<div style={{marginBottom:16}}><h2 style={{fontSize:18,fontWeight:700,color:B.dk,margin:0}}>{title}</h2>{sub&&<p style={{color:B.tg,fontSize:12,margin:"3px 0 0",lineHeight:1.4}}>{sub}</p>}</div>;}
function Toast({msg}){if(!msg)return null;return<div style={{position:"fixed",bottom:80,left:"50%",transform:"translateX(-50%)",background:B.dk,color:"#fff",padding:"10px 20px",borderRadius:99,fontSize:13,fontWeight:600,zIndex:999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.25)"}}>{msg}</div>;}

// ── Task modal ────────────────────────────────────────────────────────────────
function TaskModal({task,onSave,onDelete,onClose}){
  const isNew=!task.id;
  const[f,setF]=useState({desc:task.desc||"",start:task.start||"2026-04-06",end:task.end||"2026-04-07",status:task.status||"Not Started",pri:task.pri||"High",owner:task.owner||TEAM[0].id,pct:task.pct??0,deps:task.deps||"",notes:task.notes||""});
  const upd=(k,v)=>setF(x=>({...x,[k]:v}));
  function submit(){if(!f.desc.trim()){alert("Please enter a task description.");return;}let pct=Math.min(100,Math.max(0,parseInt(f.pct)||0));if(f.status==="Complete")pct=100;onSave({...task,...f,pct,updatedAt:Date.now()});}
  useEffect(()=>{const h=e=>{if(e.key==="Escape")onClose();};window.addEventListener("keydown",h);document.body.style.overflow="hidden";return()=>{window.removeEventListener("keydown",h);document.body.style.overflow="";};},[onClose]);
  const lbl={display:"block",fontSize:11,fontWeight:700,color:B.tg,marginBottom:5,textTransform:"uppercase",letterSpacing:.5};
  const inp={width:"100%",padding:"10px 12px",border:`1.5px solid ${B.pl}`,borderRadius:10,color:B.tx,background:B.st,fontSize:14,WebkitAppearance:"none",boxSizing:"border-box"};
  return<div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(26,60,46,.55)",zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
    <div style={{background:B.wh,borderRadius:"18px 18px 0 0",padding:"24px 20px 32px",width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{width:40,height:4,borderRadius:99,background:"#ddd",margin:"0 auto 18px"}}/>
      <h3 style={{fontSize:16,fontWeight:700,color:B.dk,margin:"0 0 18px"}}>{isNew?"+ Add Task":`Edit Task #${task.id}`}</h3>
      <div style={{marginBottom:14}}><label style={lbl}>Task Description</label><input style={inp} value={f.desc} onChange={e=>upd("desc",e.target.value)} placeholder="Describe the task…"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <div><label style={lbl}>Start</label><input style={inp} type="date" value={f.start} onChange={e=>upd("start",e.target.value)}/></div>
        <div><label style={lbl}>End</label><input style={inp} type="date" value={f.end} onChange={e=>upd("end",e.target.value)}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <div><label style={lbl}>Status</label><select style={inp} value={f.status} onChange={e=>upd("status",e.target.value)}>{["Not Started","In Progress","Complete"].map(s=><option key={s}>{s}</option>)}</select></div>
        <div><label style={lbl}>Priority</label><select style={inp} value={f.pri} onChange={e=>upd("pri",e.target.value)}>{["Low","Medium","High","Critical"].map(p=><option key={p}>{p}</option>)}</select></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        <div><label style={lbl}>Owner</label><select style={inp} value={f.owner} onChange={e=>upd("owner",e.target.value)}>{TEAM.map(m=><option key={m.id} value={m.id}>{m.name.split(" ")[0]}</option>)}</select></div>
        <div><label style={lbl}>% Done</label><input style={inp} type="number" min={0} max={100} value={f.pct} onChange={e=>upd("pct",e.target.value)}/></div>
      </div>
      <div style={{marginBottom:14}}><label style={lbl}>Notes</label><textarea style={{...inp,height:70,resize:"vertical"}} value={f.notes} onChange={e=>upd("notes",e.target.value)}/></div>
      <button onClick={submit} style={{width:"100%",background:B.dk,color:"#fff",padding:14,borderRadius:12,fontSize:15,fontWeight:700,border:"none",cursor:"pointer",marginBottom:10}}>{isNew?"Add Task":"Save Changes"}</button>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onClose} style={{flex:1,background:B.pl,color:B.md,padding:12,borderRadius:12,fontSize:14,fontWeight:600,border:"none",cursor:"pointer"}}>Cancel</button>
        {!isNew&&task.id>1&&<button onClick={()=>onDelete(task.id)} style={{flex:1,background:"#FFE0E0",color:"#8B1A1A",padding:12,borderRadius:12,fontSize:14,fontWeight:600,border:"none",cursor:"pointer"}}>Delete</button>}
      </div>
    </div>
  </div>;
}

// ════════════════════════════════════════════════════════════
// HOME
// ════════════════════════════════════════════════════════════
// ── Home sub-page: Project Brief ─────────────────────────────────────────────
function HomeBrief({isMobile,onNav}){
  const motions=[
    {n:1,m:"This House Believes That Professional Body Membership Is No Longer Essential for Career Progression in Construction.",f:"CIOB, ICE, APM relevance; employability; chartership"},
    {n:2,m:"This House Believes That Sustainability Targets Are Undermining Project Delivery Efficiency.",f:"ESG requirements, carbon targets, cost and programme pressures"},
    {n:3,m:"This house questions if construction graduates emerge fully industry-ready from universities.",f:"Curriculum relevance, graduate readiness, employability gap"},
    {n:4,m:"This house examines the extent to which university education equips construction graduates for modern industry expectations.",f:"Curriculum relevance, industry alignment, graduate competency"},
    {n:5,m:"This House Believes That Universities Are Failing to Prepare Construction Graduates for Industry.",f:"Employability gap, industry readiness, curriculum reform"},
  ];
  const fmt=[
    {seg:"Welcome & Introduction",dur:"5 mins",detail:"President opens — Northumbria Construct intro & housekeeping"},
    {seg:"Chair's Introduction",dur:"5 mins",detail:"Motion, Oxford rules and timing protocol"},
    {seg:"Pre-Debate Audience Vote",dur:"2–3 mins",detail:"Digital QR code vote before arguments"},
    {seg:"Proposition Opening",dur:"10 mins",detail:"2 speakers × 5 mins — IN FAVOUR (alternating)"},
    {seg:"Opposition Opening",dur:"10 mins",detail:"2 speakers × 5 mins — AGAINST"},
    {seg:"Moderated Q&A / Debate",dur:"25 mins",detail:"Chair facilitates; audience selected by Chair"},
    {seg:"Closing Statements",dur:"6 mins",detail:"1 speaker per side × 3 mins"},
    {seg:"Post-Debate Vote",dur:"2–3 mins",detail:"Audience re-votes; winner determined by swing"},
    {seg:"Result & Networking",dur:"10–15 mins",detail:"Chair announces result; informal engagement"},
  ];
  const success=[
    {icon:"🎓",val:"25+",lbl:"Students attending"},
    {icon:"📊",val:"75%+",lbl:"Positive feedback"},
    {icon:"🎙",val:"1",lbl:"Motion debated"},
    {icon:"🔗",val:"∞",lbl:"Future events enabled"},
  ];
  return<div>
    {/* Hero */}
    <div style={{background:B.dk,borderRadius:16,padding:isMobile?"20px 18px":"28px 32px",marginBottom:16,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-120,right:-120,width:380,height:380,borderRadius:"50%",border:"2px solid rgba(116,198,157,.12)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-60,left:-40,width:180,height:180,borderRadius:"50%",border:"1px solid rgba(116,198,157,.07)",pointerEvents:"none"}}/>
      <div style={{position:"relative"}}>
        <div style={{fontSize:10,fontWeight:700,color:B.lt,textTransform:"uppercase",letterSpacing:2,marginBottom:8}}>Northumbria Construct · APM Challenge</div>
        <h1 style={{fontSize:isMobile?22:30,fontWeight:800,color:"#fff",margin:"0 0 6px",lineHeight:1.15}}>Oxford-Style Debate Event</h1>
        <div style={{fontSize:13,color:B.lt,marginBottom:18,lineHeight:1.5}}>A high-impact, student-led academic event hosted by Northumbria Construct — Built Environment Student Society, Northumbria University</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["📅","28 April 2026"],["🕒","3pm – 5pm"],["📍","NSU – Reds Hall"],["🎓","~30 Students"],["✅","Free Entry"]].map(([ic,lbl])=>
            <div key={lbl} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.1)",borderRadius:99,padding:"5px 12px",border:"1px solid rgba(255,255,255,.15)"}}>
              <span style={{fontSize:12}}>{ic}</span><span style={{fontSize:11,color:"#fff",fontWeight:600}}>{lbl}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Project brief */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:15,color:B.dk,marginBottom:10}}>📄 Project Brief</div>
      <div style={{fontSize:13,color:B.tm,lineHeight:1.75,marginBottom:10}}>
        Northumbria Construct is organising a formal <strong style={{color:B.dk}}>Oxford-Style Debate</strong> as a high-value academic and professional development event for students of the Built Environment Faculty at Northumbria University. The event has been approved to take place at the NSU Building – Reds Hall on <strong style={{color:B.dk}}>Monday 28 April 2026, 3:00pm–5:00pm</strong>.
      </div>
      <div style={{fontSize:13,color:B.tm,lineHeight:1.75}}>
        The Oxford debate format pits two teams of student speakers against each other — a Proposition team arguing <em>for</em> the motion and an Opposition team arguing <em>against</em>. The audience votes before and after the debate, and the winning side is determined by the swing in opinion. A neutral Debate Chair facilitates throughout.
      </div>
    </Card>

    {/* Aims & Objectives */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:15,color:B.dk,marginBottom:10}}>🎯 Aims & Objectives</div>
      <div style={{fontSize:12,color:B.tg,marginBottom:12}}>The event is designed to achieve the following objectives:</div>
      {[
        ["Build professional skills","Develop confidence in public speaking, structured argumentation, and professional discourse — skills directly valued by industry and professional bodies (APM, CIOB, ICE)."],
        ["Stimulate critical thinking","Encourage intellectual engagement and mental stimulation, particularly valuable during the examination period."],
        ["Industry relevance","Expose students to contemporary issues affecting the built environment, project delivery, and professional practice through a live, contested debate."],
        ["Society mission","Deliver a high-engagement, low-cost academic event aligned with Northumbria Construct's mission of bridging academia and industry."],
        ["Visibility & growth","Increase awareness, participation, and visibility of Northumbria Construct within the student body and wider university community."],
      ].map(([title,desc],i)=>
        <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<4?`1px solid ${B.st}`:"none",alignItems:"flex-start"}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:B.dk,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
            <span style={{fontSize:11,fontWeight:800,color:B.lt}}>{i+1}</span>
          </div>
          <div><div style={{fontSize:13,fontWeight:700,color:B.dk,marginBottom:3}}>{title}</div><div style={{fontSize:12,color:B.tm,lineHeight:1.55}}>{desc}</div></div>
        </div>
      )}
    </Card>

    {/* Success criteria */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:15,color:B.dk,marginBottom:14}}>🏆 Success Criteria</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {success.map(({icon,val,lbl})=>
          <div key={lbl} style={{textAlign:"center",padding:"16px 10px",background:B.st,borderRadius:12,border:`1px solid ${B.pl}`}}>
            <div style={{fontSize:20,marginBottom:6}}>{icon}</div>
            <div style={{fontSize:22,fontWeight:800,color:B.dk,lineHeight:1}}>{val}</div>
            <div style={{fontSize:11,color:B.tg,marginTop:4,lineHeight:1.3}}>{lbl}</div>
          </div>
        )}
      </div>
      <div style={{fontSize:12,color:B.tg}}>Additional criteria: balanced debate with active audience Q&A · clear follow-on engagement with Northumbria Construct · post-event LinkedIn coverage published within 48 hours.</div>
    </Card>

    {/* Debate motions */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:15,color:B.dk,marginBottom:4}}>🎙 Debate Motions (Select One)</div>
      <div style={{fontSize:12,color:B.tg,marginBottom:14}}>5 motions available. Each is framed as a formal Oxford-style proposition. One will be selected by the committee.</div>
      {motions.map(({n,m,f})=><div key={n} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:n<5?`1px solid ${B.st}`:"none",alignItems:"flex-start"}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:B.dk,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:"#fff",flexShrink:0}}>{n}</div>
        <div><div style={{fontSize:13,fontWeight:600,color:B.dk,marginBottom:3,lineHeight:1.4}}>"{m}"</div><div style={{fontSize:11,color:B.tg}}>{f}</div></div>
      </div>)}
    </Card>

    {/* Event format */}
    <Card style={{marginBottom:16}}>
      <div style={{fontWeight:700,fontSize:15,color:B.dk,marginBottom:4}}>⏱ Event Format — 75–90 Minutes</div>
      <div style={{fontSize:12,color:B.tg,marginBottom:14}}>Formal debate followed by 30 minutes of informal networking.</div>
      {fmt.map(({seg,dur,detail},i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:i<fmt.length-1?`1px solid ${B.st}`:"none"}}>
        <div style={{flexShrink:0,width:58,textAlign:"center",background:B.dk,borderRadius:8,padding:"5px 6px"}}><span style={{fontSize:10,fontWeight:700,color:B.lt}}>{dur}</span></div>
        <div><div style={{fontSize:12,fontWeight:600,color:B.tx}}>{seg}</div><div style={{fontSize:11,color:B.tg,marginTop:1}}>{detail}</div></div>
      </div>)}
    </Card>

    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
      <button onClick={()=>onNav("dashboard")} style={{flex:1,minWidth:130,background:B.dk,color:"#fff",padding:13,borderRadius:12,fontSize:14,fontWeight:700,border:"none",cursor:"pointer"}}>View Dashboard →</button>
      <button onClick={()=>onNav("tasks")} style={{flex:1,minWidth:130,background:B.pl,color:B.dk,padding:13,borderRadius:12,fontSize:14,fontWeight:700,border:"none",cursor:"pointer"}}>Open Tasks →</button>
    </div>
  </div>;
}

// ── Home sub-page: Stakeholder Analysis ──────────────────────────────────────
function HomeStakeholders({isMobile}){
  const [selected,setSelected]=useState(null);
  const stakeholders=[
    {id:1,name:"NSU / Student Union",type:"Internal",power:4,interest:4,influence:4,ease:4,category:"Key Player",color:B.dk,strategy:"Keep fully informed and engaged. NSU has approved venue access — maintain strong relationship throughout. Regular updates on attendance and event logistics.",engagement:"Direct",owner:"Callum O'Connor"},
    {id:2,name:"Built Environment Students",type:"Beneficiary",power:2,interest:4,influence:3,ease:4,category:"Key Audience",color:B.ac,strategy:"Primary audience and core beneficiaries. Engage through WhatsApp groups, course reps, and LinkedIn. Over-invite to ensure 25+ attendance.",engagement:"Broadcast",owner:"Tolulope Idowu"},
    {id:3,name:"Academic Staff / Lecturers",type:"External",power:3,interest:3,influence:4,ease:3,category:"Keep Satisfied",color:B.md,strategy:"Leverage for promotional amplification. Request forwarding of event communications to student cohorts. Invite to attend as audience members.",engagement:"Periodic",owner:"Tolulope Idowu"},
    {id:4,name:"Debate Chair (External)",type:"External",power:3,interest:4,influence:4,ease:3,category:"Key Player",color:B.dk,strategy:"Critical to event quality. Shortlist: Kelechi Ayanso, Barry Gledson, Michelle Littlemore, Pablo Martinez. Brief thoroughly on Oxford rules and running order.",engagement:"Direct",owner:"Callum O'Connor"},
    {id:5,name:"Student Speakers (Prop/Opp)",type:"Internal",power:2,interest:4,influence:3,ease:4,category:"Keep Engaged",color:B.ac,strategy:"Kufre Antia leads recruitment. Pool: Kufre, Lucas, Ikechukwu, Vemula, Judith, Adiyita, Maria. Issue briefing pack and Oxford rules by 11 April.",engagement:"Direct",owner:"Kufre Antia"},
    {id:6,name:"Northumbria University (Faculty)",type:"External",power:4,interest:3,influence:4,ease:3,category:"Keep Satisfied",color:B.md,strategy:"Maintain awareness of event. Ensure event reflects positively on the Faculty and Built Environment department. Minimal action required beyond venue confirmation.",engagement:"Minimal",owner:"Callum O'Connor"},
    {id:7,name:"Professional Bodies (APM, CIOB)",type:"External",power:2,interest:3,influence:4,ease:2,category:"Monitor",color:"#607466",strategy:"Long-term relationship asset. Event aligns with APM/CIOB professional development objectives. Share post-event LinkedIn content for amplification.",engagement:"Post-event",owner:"Kufre Antia"},
    {id:8,name:"Society Alumni / LinkedIn Network",type:"External",power:1,interest:3,influence:3,ease:4,category:"Monitor",color:"#607466",strategy:"Engage post-event through LinkedIn article and event recap. Use to grow society's professional network and demonstrate student-led activity.",engagement:"Post-event",owner:"Kufre Antia"},
  ];
  const categories=[
    {label:"Key Player",bg:B.dk,fg:"#fff",desc:"High power, high interest — manage closely"},
    {label:"Key Audience",bg:B.ac,fg:"#fff",desc:"High interest, moderate power — keep engaged"},
    {label:"Keep Satisfied",bg:B.md,fg:"#fff",desc:"High power, moderate interest — keep informed"},
    {label:"Monitor",bg:"#e0e0e0",fg:B.tg,desc:"Lower power & interest — monitor periodically"},
  ];
  const sel=selected!==null?stakeholders.find(s=>s.id===selected):null;
  return<div>
    <SecHead title="Stakeholder Identification & Analysis" sub="4D framework: Power · Interest · Influence · Ease of Engagement"/>

    {/* Framework explanation */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:10}}>📐 Analysis Framework</div>
      <div style={{fontSize:12,color:B.tm,lineHeight:1.65,marginBottom:12}}>
        Stakeholders are identified and analysed across four dimensions, adapted from Northumbria Construct's innovative 4D stakeholder matrix developed during the Bridge the Gap project:
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[
          ["⚡ Power","The degree of authority or control the stakeholder has over the event — including venue access, speaker availability, and approvals."],
          ["🎯 Interest","How directly the stakeholder is affected by or cares about the event outcome and its success."],
          ["🔊 Influence","The stakeholder's ability to affect others' opinions or behaviours — particularly useful for promotion and amplification."],
          ["🤝 Ease","How accessible and straightforward it is to engage with this stakeholder effectively given available resources."],
        ].map(([t,d])=>
          <div key={t} style={{background:B.st,borderRadius:10,padding:"12px 14px",border:`1px solid ${B.pl}`}}>
            <div style={{fontWeight:700,fontSize:12,color:B.dk,marginBottom:5}}>{t}</div>
            <div style={{fontSize:11,color:B.tg,lineHeight:1.5}}>{d}</div>
          </div>
        )}
      </div>
    </Card>

    {/* Category legend */}
    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
      {categories.map(({label,bg,fg,desc})=>
        <div key={label} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 12px",background:B.wh,borderRadius:10,border:`1px solid ${B.pl}`}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:bg,flexShrink:0}}/>
          <div><div style={{fontSize:11,fontWeight:700,color:B.dk}}>{label}</div><div style={{fontSize:9,color:B.tg}}>{desc}</div></div>
        </div>
      )}
    </div>

    {/* Stakeholder grid */}
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
      {stakeholders.map(s=>{
        const isSel=selected===s.id;
        return<div key={s.id} style={{background:B.wh,borderRadius:12,border:`1px solid ${isSel?B.ac:B.pl}`,overflow:"hidden",transition:"all .15s"}}>
          <div onClick={()=>setSelected(isSel?null:s.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer"}}>
            <div style={{width:36,height:36,borderRadius:10,background:s.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:13,fontWeight:800,color:"#fff"}}>{s.id}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:13,color:B.dk}}>{s.name}</div>
              <div style={{fontSize:11,color:B.tg,marginTop:1}}>{s.type} · Owner: {s.owner.split(" ")[0]}</div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
              <span style={{fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:700,background:s.color,color:"#fff"}}>{s.category}</span>
              <span style={{fontSize:14,color:B.tg,transform:isSel?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>▾</span>
            </div>
          </div>
          {/* Score bars */}
          <div style={{padding:"0 16px 4px",display:"flex",gap:8",flexWrap:"wrap"}}>
            {[["P",s.power],["I",s.interest],["Inf",s.influence],["E",s.ease]].map(([lbl,val])=>
              <div key={lbl} style={{display:"flex",alignItems:"center",gap:5,marginBottom:8}}>
                <span style={{fontSize:9,fontWeight:700,color:B.tg,minWidth:20}}>{lbl}</span>
                <div style={{width:isMobile?48:64,height:5,borderRadius:99,background:B.pl,overflow:"hidden"}}>
                  <div style={{width:`${(val/4)*100}%`,height:"100%",background:s.color,borderRadius:99}}/>
                </div>
                <span style={{fontSize:9,color:B.tg}}>{val}/4</span>
              </div>
            )}
          </div>
          {/* Expanded detail */}
          {isSel&&<div style={{padding:"0 16px 14px",borderTop:`1px solid ${B.pl}`,marginTop:4}}>
            <div style={{fontSize:11,fontWeight:700,color:B.tg,textTransform:"uppercase",letterSpacing:.5,marginBottom:6,marginTop:10}}>Engagement Strategy</div>
            <div style={{fontSize:12,color:B.tm,lineHeight:1.65,marginBottom:8}}>{s.strategy}</div>
            <div style={{display:"flex",gap:10}}>
              <div style={{fontSize:11,color:B.tg}}>Engagement: <span style={{fontWeight:700,color:B.dk}}>{s.engagement}</span></div>
              <div style={{fontSize:11,color:B.tg}}>Owner: <span style={{fontWeight:700,color:B.dk}}>{s.owner}</span></div>
            </div>
          </div>}
        </div>;
      })}
    </div>

    {/* Power-interest matrix visual */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>📊 Power–Interest Map</div>
      <div style={{position:"relative",height:isMobile?240:280,background:B.st,borderRadius:10,border:`1px solid ${B.pl}`,overflow:"hidden"}}>
        {/* Quadrant labels */}
        {[
          {x:"5%",y:"5%",label:"Keep Satisfied",align:"left",color:B.tg},
          {x:"55%",y:"5%",label:"Key Players — Manage Closely",align:"left",color:B.dk},
          {x:"5%",y:"52%",label:"Monitor",align:"left",color:B.tg},
          {x:"55%",y:"52%",label:"Key Audience — Keep Engaged",align:"left",color:B.md},
        ].map(({x,y,label,align,color})=>
          <div key={label} style={{position:"absolute",left:x,top:y,fontSize:9,fontWeight:700,color,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>
        )}
        {/* Dividers */}
        <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:1,background:B.pl}}/>
        <div style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:B.pl}}/>
        {/* Axis labels */}
        <div style={{position:"absolute",bottom:4,left:"50%",transform:"translateX(-50%)",fontSize:9,color:B.tg,fontWeight:600}}>← Low Interest · High Interest →</div>
        {/* Dots */}
        {stakeholders.map(s=>{
          const x=((s.interest-1)/3)*45+5;
          const y=100-((s.power-1)/3)*45-10;
          return<div key={s.id} title={s.name} style={{position:"absolute",left:`${x}%`,top:`${y}%`,width:isMobile?22:26,height:isMobile?22:26,borderRadius:"50%",background:s.color,border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:2,boxShadow:"0 2px 6px rgba(0,0,0,.2)",transform:"translate(-50%,-50%)"}}
            onClick={()=>setSelected(selected===s.id?null:s.id)}>
            <span style={{fontSize:9,fontWeight:800,color:"#fff"}}>{s.id}</span>
          </div>;
        })}
        {/* Power axis label */}
        <div style={{position:"absolute",top:"50%",left:4,transform:"translateY(-50%) rotate(-90deg)",fontSize:9,color:B.tg,fontWeight:600,transformOrigin:"center",whiteSpace:"nowrap"}}>↑ High Power</div>
      </div>
      <div style={{fontSize:11,color:B.tg,marginTop:8}}>Tap any dot or card above to view engagement strategy. Numbers correspond to stakeholder IDs in the register.</div>
    </Card>
  </div>;
}

// ── Home sub-page: Project Team ───────────────────────────────────────────────
function HomeTeam({tasks,isMobile}){
  const coreRoles=[
    {role:"Project Manager",         resp:"Overall coordination; liaison with NSU and venue booking",               who:"Tolulope Idowu",          status:"Assigned",   notes:"Critical path owner"},
    {role:"Debate Chair / Moderator",resp:"Neutral facilitation; Oxford rules enforcement; strict timekeeping",    who:"Shortlist: Kelechi Ayanso · Barry Gledson · Michelle Littlemore · Pablo Martinez",status:"Shortlisted",notes:"Drop-dead: 9 Apr"},
    {role:"Proposition Team (2–3)",  resp:"Argue in favour of the motion",                                         who:"Kufre Antia (lead) · Kufre, Lucas, Ikechukwu, Vemula, Judith, Adiyita, Maria",status:"In Selection",notes:"Drop-dead: 15 Apr"},
    {role:"Opposition Team (2–3)",   resp:"Argue against the motion",                                             who:"Kufre Antia (lead) · TBC",status:"Open",       notes:"Drop-dead: 15 Apr"},
    {role:"Logistics Lead",          resp:"Reds Hall access, room setup, 3 mics, AV, seating, signage",           who:"Uchechukwu Maduwuba",     status:"Assigned",   notes:"Confirm room 21 Apr"},
    {role:"Comms & Engagement Lead", resp:"Promotion, registration, attendance tracking",                          who:"All team",                status:"Active",     notes:"MS Forms + LinkedIn"},
  ];
  const stBadge=s=>s==="Assigned"||s==="Active"?{bg:"#C6EFCE",fg:"#1A5C2A"}:s==="Shortlisted"||s==="In Selection"?{bg:"#FFF3CD",fg:"#7A5000"}:{bg:"#FFE0E0",fg:"#8B1A1A"};
  return<div>
    <SecHead title="Project Team" sub="Northumbria Construct Event Planning Committee — Oxford Debate"/>

    {/* Committee member cards */}
    <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>Planning Committee</div>
    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
      {TEAM.map(m=>{
        const mt=tasks.filter(t=>t.owner===m.id);const mp=calcPct(mt);const mc=mt.filter(t=>t.status==="Complete").length;
        return<Card key={m.id} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
          <Avatar name={m.name} area={m.area} size={46}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:14,color:B.dk}}>{m.name}</div>
            <div style={{fontSize:11,color:B.ac,fontWeight:600,marginBottom:5}}>{m.role}</div>
            <div style={{fontSize:11,color:B.tg,lineHeight:1.55}}>{m.resp}</div>
            <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:9,padding:"2px 9px",borderRadius:20,background:B.pl,color:B.md,fontWeight:700}}>{m.area}</span>
              <span style={{fontSize:9,color:B.tg}}>{mc}/{mt.length} tasks complete</span>
            </div>
            <div style={{marginTop:7,display:"flex",alignItems:"center",gap:6}}><Pbar pct={mp} h={5}/><span style={{fontSize:10,color:B.md,fontWeight:600,minWidth:30}}>{mp}%</span></div>
          </div>
        </Card>;
      })}
    </div>

    {/* Core delivery roles */}
    <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>Core Delivery Roles</div>
    <Card style={{padding:"0",overflow:"hidden",marginBottom:14}}>
      <div style={{background:B.md,padding:"11px 18px",fontWeight:700,fontSize:13,color:"#fff"}}>Assigned Roles — Oxford Debate 28 April</div>
      {coreRoles.map((r,i)=>{const sc=stBadge(r.status);return<div key={i} style={{padding:"12px 18px",background:i%2===0?B.wh:B.st,borderBottom:`1px solid ${B.pl}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5,flexWrap:"wrap",gap:6}}>
          <span style={{fontSize:13,fontWeight:700,color:B.dk}}>{r.role}</span>
          <span style={{fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:600,background:sc.bg,color:sc.fg}}>{r.status}</span>
        </div>
        <div style={{fontSize:11,color:B.tm,marginBottom:3}}>{r.resp}</div>
        <div style={{fontSize:11,color:B.tg,marginBottom:2}}><span style={{fontWeight:600}}>Assigned: </span>{r.who}</div>
        <div style={{fontSize:10,color:B.ac,fontStyle:"italic"}}>{r.notes}</div>
      </div>;})}
    </Card>

    {/* Workload overview */}
    <Card>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:14}}>📊 Workload Distribution</div>
      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
        {TEAM.map(m=>{
          const mt=tasks.filter(t=>t.owner===m.id);const mp=calcPct(mt);const mc=mt.filter(t=>t.status==="Complete").length;
          return<div key={m.id} style={{textAlign:"center",padding:"14px 10px",background:B.st,borderRadius:12,minWidth:100,flexShrink:0}}>
            <Avatar name={m.name} area={m.area} size={38}/>
            <div style={{fontSize:11,fontWeight:700,color:B.dk,marginTop:8}}>{m.name.split(" ")[0]}</div>
            <div style={{fontSize:9,color:B.tg,marginTop:2}}>{mt.length} tasks assigned</div>
            <div style={{fontSize:9,color:"#1A5C2A",marginTop:1}}>{mc} complete</div>
            <Pbar pct={mp} h={5} style={{marginTop:7}}/><div style={{fontSize:10,color:B.md,fontWeight:700,marginTop:3}}>{mp}%</div>
          </div>;
        })}
      </div>
    </Card>
  </div>;
}

// ── Home sub-page: Governance ─────────────────────────────────────────────────
function HomeGovernance({isMobile}){
  const decisions=[
    {type:"Strategic / Scope Changes",approval:"Project Sponsor + President",examples:"Changing the motion, moving the venue, cancelling the event"},
    {type:"Major Operational Changes",approval:"President + Project Manager",examples:"Rescheduling, replacing Debate Chair, changing audience capacity"},
    {type:"Minor Operational Changes",approval:"Project Manager",examples:"Adjusting timetable, swapping speakers, minor comms changes"},
    {type:"On-Day Decisions",approval:"Event Lead (Callum O'Connor)",examples:"Any decision required during the event on 28 April"},
  ];
  const gates=[
    {phase:"Gate 1 — Pre-Planning",date:"6 Apr",check:"Motion confirmed · Venue booked · Committee roles assigned · Workplan signed off",status:"Complete"},
    {phase:"Gate 2 — Speaker & Chair Lock",date:"15 Apr",check:"Debate Chair shortlisted · Proposition & Opposition teams confirmed · Briefing packs issued",status:"In Progress"},
    {phase:"Gate 3 — Promotion & Registration",date:"21 Apr",check:"Registration at 25+ · AV confirmed · All materials ready · Run-of-show complete",status:"Not Started"},
    {phase:"Gate 4 — Go / No-Go",date:"27 Apr",check:"Final logistics walkthrough · All speakers reconfirmed · Venue access confirmed",status:"Not Started"},
    {phase:"Event Delivery",date:"28 Apr",check:"Event delivered · Feedback captured · Photos and content collected",status:"Not Started"},
    {phase:"Post-Event Closure",date:"3 May",check:"LinkedIn article published · Feedback analysed · Lessons learned documented",status:"Not Started"},
  ];
  const stBadge=s=>s==="Complete"?{bg:"#C6EFCE",fg:"#1A5C2A"}:s==="In Progress"?{bg:"#FFF3CD",fg:"#7A5000"}:{bg:"#e8e8e8",fg:"#777"};
  return<div>
    <SecHead title="Project Governance" sub="Decision-making, oversight, change control and gate reviews"/>

    {/* Governance model */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:10}}>🏛 Governance Model</div>
      <div style={{fontSize:13,color:B.tm,lineHeight:1.7,marginBottom:12}}>
        This event is governed using a <strong style={{color:B.dk}}>hybrid governance model</strong> — combining structured phase gates for oversight with agile flexibility to respond quickly to changes. This approach is consistent with APMBoK section 1.3.1 and aligns with the model developed during Northumbria Construct's Bridge the Gap project.
      </div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr",gap:10}}>
        {[
          ["📋","Structured Gates","Defined decision checkpoints at each project phase ensure quality and alignment before progressing."],
          ["⚡","Agile Responses","The committee can adapt plans rapidly in response to speaker changes, attendance data or venue issues."],
          ["👁","Tiered Oversight","Decisions escalate based on impact — from PM (minor) to President (strategic) to Sponsor (critical)."],
        ].map(([ic,t,d])=>
          <div key={t} style={{background:B.st,borderRadius:10,padding:"14px 14px",border:`1px solid ${B.pl}`}}>
            <div style={{fontSize:20,marginBottom:8}}>{ic}</div>
            <div style={{fontWeight:700,fontSize:12,color:B.dk,marginBottom:5}}>{t}</div>
            <div style={{fontSize:11,color:B.tg,lineHeight:1.5}}>{d}</div>
          </div>
        )}
      </div>
    </Card>

    {/* Decision authority matrix */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>⚖️ Decision Authority Matrix</div>
      {decisions.map((d,i)=><div key={i} style={{padding:"11px 0",borderBottom:i<decisions.length-1?`1px solid ${B.st}`:"none"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:4}}>
          <span style={{fontSize:13,fontWeight:700,color:B.dk}}>{d.type}</span>
          <span style={{fontSize:11,padding:"2px 10px",borderRadius:99,background:B.dk,color:B.lt,fontWeight:600}}>{d.approval}</span>
        </div>
        <div style={{fontSize:11,color:B.tg,fontStyle:"italic"}}>{d.examples}</div>
      </div>)}
    </Card>

    {/* Change control */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:10}}>🔄 Change Control Process</div>
      <div style={{fontSize:12,color:B.tm,lineHeight:1.65,marginBottom:12}}>All changes to scope, programme or resources must be formally logged. The process is:</div>
      {[
        ["Identify","Any committee member identifies a required change and documents it with reason and impact."],
        ["Assess","Project Manager assesses impact on programme, budget and risk. Classifies as minor or major."],
        ["Approve","Minor changes approved by PM. Major changes require President sign-off. Critical changes require sponsor."],
        ["Implement","Approved change actioned. All affected documents (this tracker, risk register, RACI) updated."],
        ["Review","Change reviewed at next committee check-in. Lessons captured if relevant."],
      ].map(([step,desc],i)=>
        <div key={step} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:i<4?`1px solid ${B.st}`:"none",alignItems:"flex-start"}}>
          <div style={{width:24,height:24,borderRadius:"50%",background:B.ac,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
            <span style={{fontSize:11,fontWeight:800,color:"#fff"}}>{i+1}</span>
          </div>
          <div><div style={{fontSize:12,fontWeight:700,color:B.dk,marginBottom:2}}>{step}</div><div style={{fontSize:11,color:B.tm,lineHeight:1.5}}>{desc}</div></div>
        </div>
      )}
    </Card>

    {/* Gate reviews */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>🚦 Phase Gate Reviews</div>
      <div style={{fontSize:12,color:B.tg,marginBottom:14}}>The project is structured around six gates. Each gate must be passed before the next phase proceeds.</div>
      {gates.map(({phase,date,check,status},i)=>{
        const sc=stBadge(status);const isLast=i===gates.length-1;
        return<div key={phase} style={{display:"flex",gap:0,position:"relative"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:36,flexShrink:0}}>
            <div style={{width:16,height:16,borderRadius:"50%",background:status==="Complete"?B.dk:status==="In Progress"?B.ac:B.pl,border:`2px solid ${status==="Complete"?B.ac:status==="In Progress"?"#F0C040":B.pl}`,zIndex:1,marginTop:4}}/>
            {!isLast&&<div style={{width:2,flex:1,background:B.pl,margin:"2px 0"}}/>}
          </div>
          <div style={{padding:"0 0 20px 8px",flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,flexWrap:"wrap",gap:4}}>
              <span style={{fontSize:13,fontWeight:700,color:B.dk}}>{phase}</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:10,color:B.tg}}>{date}</span>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600,background:sc.bg,color:sc.fg}}>{status}</span>
              </div>
            </div>
            <div style={{fontSize:11,color:B.tg,lineHeight:1.55}}>{check}</div>
          </div>
        </div>;
      })}
    </Card>

    {/* Escalation path */}
    <Card>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>📞 Escalation & Communication</div>
      <div style={{display:"flex",flexDirection:"column",gap:0}}>
        {[
          {level:"Day-of issue",contact:"Callum O'Connor (Event Lead)",action:"Immediate decision authority on event day"},
          {level:"Overdue task / risk",contact:"Callum O'Connor → Committee",action:"Escalate at next WhatsApp check-in or direct message"},
          {level:"Budget overrun",contact:"Tolulope Idowu → Callum O'Connor",action:"PM flags, President approves any additional spend"},
          {level:"Venue / NSU issue",contact:"Uchechukwu Maduwuba → Callum O'Connor",action:"Media Manager holds NSU building contact"},
          {level:"Critical scope change",contact:"Callum O'Connor → Project Sponsor",action:"Requires sponsor sign-off before action"},
        ].map(({level,contact,action},i)=>
          <div key={level} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<4?`1px solid ${B.st}`:"none",alignItems:"flex-start"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:i===0?B.dk:B.ac,flexShrink:0,marginTop:5}}/>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:B.dk,marginBottom:2}}>{level}</div>
              <div style={{fontSize:11,color:B.ac,fontWeight:600,marginBottom:2}}>{contact}</div>
              <div style={{fontSize:11,color:B.tg}}>{action}</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  </div>;
}

// ── Home — wrapper with sub-page navigation ───────────────────────────────────
function Home({isMobile,onNav,tasks}){
  const[subPage,setSubPage]=useState("brief");
  const subPages=[
    {id:"brief",      label:"Project Brief",  icon:"📄"},
    {id:"stakeholders",label:"Stakeholders",  icon:"🗺"},
    {id:"team",       label:"Project Team",   icon:"👥"},
    {id:"governance", label:"Governance",     icon:"🏛"},
  ];
  return<div>
    {/* Sub-nav */}
    <div style={{display:"flex",gap:6,marginBottom:18,overflowX:"auto",paddingBottom:2}}>
      {subPages.map(p=>(
        <button key={p.id} onClick={()=>setSubPage(p.id)} style={{
          display:"flex",alignItems:"center",gap:6,
          padding:isMobile?"8px 12px":"9px 16px",borderRadius:10,
          border:`1.5px solid ${subPage===p.id?B.ac:B.pl}`,
          background:subPage===p.id?B.dk:"transparent",
          color:subPage===p.id?"#fff":B.tg,
          fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap",
          transition:"all .15s",
        }}>
          <span style={{fontSize:14}}>{p.icon}</span>{!isMobile&&p.label}
          {isMobile&&<span style={{fontSize:10}}>{p.label.split(" ")[0]}</span>}
        </button>
      ))}
    </div>
    {subPage==="brief"       &&<HomeBrief isMobile={isMobile} onNav={onNav}/>}
    {subPage==="stakeholders"&&<HomeStakeholders isMobile={isMobile}/>}
    {subPage==="team"        &&<HomeTeam tasks={tasks} isMobile={isMobile}/>}
    {subPage==="governance"  &&<HomeGovernance isMobile={isMobile}/>}
  </div>;
}

// ════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════
function Dashboard({tasks,onNav,isMobile}){
  const done=tasks.filter(t=>t.status==="Complete").length;
  const inp=tasks.filter(t=>t.status==="In Progress").length;
  const ns=tasks.filter(t=>t.status==="Not Started").length;
  const pct=calcPct(tasks);
  const dLeft=Math.max(0,Math.round((new Date("2026-04-28")-new Date())/86400000));
  const urgent=tasks.filter(t=>t.status!=="Complete"&&(t.pri==="Critical"||t.pri==="High")).slice(0,6);
  return<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,gap:12}}>
      <SecHead title="Dashboard" sub="Live project progress · auto-saves to browser"/>
      <div style={{background:B.dk,color:B.lt,padding:"10px 16px",borderRadius:12,textAlign:"center",flexShrink:0}}>
        <div style={{fontSize:24,fontWeight:700,lineHeight:1}}>{dLeft}</div>
        <div style={{fontSize:10,marginTop:2}}>days left</div>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
      {[{l:"Progress",v:`${pct}%`,s:`${tasks.length} tasks`,c:B.md},{l:"Complete",v:done,s:"finished",c:"#1A5C2A"},{l:"In Progress",v:inp,s:"active",c:"#7A5000"},{l:"Not Started",v:ns,s:"pending",c:"#8B1A1A"}].map((k,i)=>
        <Card key={i} style={{padding:"14px 16px"}}>
          <div style={{fontSize:10,color:B.tg,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>{k.l}</div>
          <div style={{fontSize:26,fontWeight:700,color:k.c,lineHeight:1}}>{k.v}</div>
          <div style={{fontSize:10,color:B.tg,marginTop:3}}>{k.s}</div>
        </Card>
      )}
    </div>
    <Card style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontWeight:700,fontSize:13,color:B.dk}}>Overall Completion</span><span style={{fontWeight:700,color:B.md}}>{pct}%</span></div>
      <Pbar pct={pct} h={12} done={pct===100}/>
      <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap"}}>
        {[["Complete",done,"#C6EFCE","#1A5C2A"],["In Progress",inp,"#FFF3CD","#7A5000"],["Not Started",ns,"#FFE0E0","#8B1A1A"]].map(([l,n,bg,fg])=>
          <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:10,height:10,borderRadius:3,background:bg,border:`1px solid ${fg}`}}/><span style={{fontSize:11,color:B.tg}}>{l}: <b style={{color:fg}}>{n}</b></span>
          </div>
        )}
      </div>
    </Card>
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>🔴 High Priority Tasks</div>
      {urgent.length===0?<div style={{fontSize:13,color:"#1A5C2A",textAlign:"center",padding:16}}>🎉 All high priority tasks done!</div>
        :urgent.map(t=><div key={t.id} onClick={()=>onNav("tasks")} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${B.st}`,cursor:"pointer"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:t.pri==="Critical"?B.dk:B.ac,flexShrink:0}}/>
          <div style={{flex:1,fontSize:12,lineHeight:1.3}}>{t.desc}</div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}><Badge label={t.status} small/><span style={{fontSize:10,color:B.tg}}>{fmtDate(t.end)}</span></div>
        </div>)
      }
    </Card>
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:14}}>👥 Team Workload</div>
      <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
        {TEAM.map(m=>{
          const mt=tasks.filter(t=>t.owner===m.id);const mp=calcPct(mt);
          return<div key={m.id} onClick={()=>onNav("team")} style={{textAlign:"center",padding:"12px 10px",background:B.st,borderRadius:12,minWidth:90,flexShrink:0,cursor:"pointer"}}>
            <Avatar name={m.name} area={m.area} size={36}/>
            <div style={{fontSize:11,fontWeight:600,color:B.dk,marginTop:7}}>{m.name.split(" ")[0]}</div>
            <div style={{fontSize:9,color:B.tg,marginTop:2}}>{mt.length} tasks</div>
            <Pbar pct={mp} h={4} style={{marginTop:6}}/><div style={{fontSize:10,color:B.md,fontWeight:600,marginTop:3}}>{mp}%</div>
          </div>;
        })}
      </div>
    </Card>
  </div>;
}

// ════════════════════════════════════════════════════════════
// TASK TRACKER
// ════════════════════════════════════════════════════════════
function TaskTracker({tasks,setTasks,setToast,isMobile}){
  const[modal,setModal]=useState(null);
  const[filter,setFilter]=useState("All");
  const visible=filter==="All"?tasks:tasks.filter(t=>t.status===filter);
  function handleSave(saved){
    if(!saved.id){const nid=tasks.length?Math.max(...tasks.map(t=>t.id))+1:1;setTasks(ts=>[...ts,{...saved,id:nid}]);setToast("✓ Task added");}
    else{setTasks(ts=>ts.map(t=>t.id===saved.id?saved:t));setToast(`✓ Task #${saved.id} updated`);}
    setModal(null);
  }
  function handleDelete(id){if(!window.confirm(`Delete task #${id}?`))return;setTasks(ts=>ts.filter(t=>t.id!==id));setModal(null);setToast("Task deleted");}
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,gap:10}}>
      <SecHead title="Tasks" sub="Tap any card to edit · changes sync to Gantt & RACI"/>
      <button onClick={()=>setModal({desc:"",start:"2026-04-06",end:"2026-04-07",status:"Not Started",pri:"High",owner:TEAM[0].id,pct:0,deps:"",notes:""})}
        style={{background:B.dk,color:"#fff",padding:"10px 16px",borderRadius:10,fontSize:13,fontWeight:700,border:"none",cursor:"pointer",flexShrink:0}}>+ Add</button>
    </div>
    <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
      {["All","Complete","In Progress","Not Started"].map(s=>
        <button key={s} onClick={()=>setFilter(s)} style={{padding:"7px 14px",borderRadius:99,border:`1.5px solid ${filter===s?B.ac:B.pl}`,background:filter===s?B.pl:"transparent",color:filter===s?B.md:B.tg,fontSize:12,fontWeight:600,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>{s}</button>
      )}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {visible.map(t=>{
        const m=memberObj(t.owner);const isMile=t.id===17;
        return<div key={t.id} onClick={()=>setModal(t)} style={{background:B.wh,borderRadius:14,border:`1px solid ${t.updatedAt&&Date.now()-t.updatedAt<60000?"#F0C040":B.pl}`,padding:"14px 16px",cursor:"pointer",borderLeft:`4px solid ${t.pri==="Critical"?B.dk:t.pri==="High"?B.ac:"transparent"}`}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:8}}>
            <span style={{fontSize:11,color:B.tg,fontWeight:600,minWidth:20,paddingTop:2}}>#{t.id}</span>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:isMile?700:600,color:isMile?B.dk:B.tx,lineHeight:1.3}}>{isMile?"⭐ ":""}{t.desc}</div>{t.notes&&<div style={{fontSize:11,color:B.tg,marginTop:3,lineHeight:1.4}}>{t.notes}</div>}</div>
            <span style={{color:B.ac,fontSize:16,flexShrink:0}}>›</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <Avatar name={m.name} area={m.area} size={22}/><span style={{fontSize:12,color:B.tm}}>{m.name.split(" ")[0]}</span>
            <span style={{fontSize:11,color:B.tg,marginLeft:"auto"}}>{fmtDate(t.start)} → {fmtDate(t.end)}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <Badge label={t.status}/><PriBadge label={t.pri}/>
            <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}><Pbar pct={t.pct} done={t.pct===100}/><span style={{fontSize:11,color:B.tg,minWidth:30}}>{t.pct}%</span></div>
          </div>
        </div>;
      })}
    </div>
    {modal!==null&&<TaskModal task={modal} onSave={handleSave} onDelete={handleDelete} onClose={()=>setModal(null)}/>}
  </div>;
}

// ════════════════════════════════════════════════════════════
// GANTT
// ════════════════════════════════════════════════════════════
function GanttChart({tasks,setTasks,setToast,isMobile}){
  const[modal,setModal]=useState(null);
  function handleSave(saved){setTasks(ts=>ts.map(t=>t.id===saved.id?{...saved,updatedAt:Date.now()}:t));setModal(null);setToast(`✓ Task #${saved.id} updated — RACI synced`);}
  function handleDelete(id){setTasks(ts=>ts.filter(t=>t.id!==id));setModal(null);setToast("Task deleted");}
  const barCol=t=>t.id===17?"#FFD700":t.status==="Complete"?B.dk:t.status==="In Progress"?B.ac:B.md;
  if(isMobile){
    return<div>
      <SecHead title="Gantt / Timeline" sub="Tap a task to edit dates & status"/>
      <div style={{background:"#FFF3CD",border:"1px solid #F0C040",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#7A5000"}}>🔗 Editing here syncs to RACI and Dashboard.</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {tasks.map(t=>{
          const m=memberObj(t.owner);const bc=barCol(t);const isMile=t.id===17;
          const gl=ganttOffset(t.start);const gw=ganttWidth(t.start,t.end);
          const barPct=Math.min(100,Math.round((gw/GANTT_DAYS)*100));
          const barLeft=Math.min(85,Math.round((gl/GANTT_DAYS)*100));
          return<div key={t.id} onClick={()=>setModal(t)} style={{background:B.wh,borderRadius:12,border:`1px solid ${B.pl}`,padding:"12px 14px",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:10,color:B.tg,minWidth:20}}>#{t.id}</span>
              <span style={{flex:1,fontSize:13,fontWeight:isMile?700:500,color:isMile?B.dk:B.tx}}>{isMile?"⭐ ":""}{t.desc}</span>
              <Badge label={t.status} small/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
              <Avatar name={m.name} area={m.area} size={18}/><span style={{fontSize:11,color:B.tg}}>{m.name.split(" ")[0]}</span>
              <span style={{fontSize:11,color:B.tg,marginLeft:"auto"}}>{fmtDate(t.start)} → {fmtDate(t.end)}</span>
            </div>
            <div style={{height:8,borderRadius:99,background:B.st,overflow:"hidden",position:"relative"}}>
              <div style={{position:"absolute",left:`${barLeft}%`,width:`${Math.max(4,barPct)}%`,height:"100%",background:bc,borderRadius:99}}/>
            </div>
          </div>;
        })}
      </div>
      {modal&&<TaskModal task={modal} onSave={handleSave} onDelete={handleDelete} onClose={()=>setModal(null)}/>}
    </div>;
  }
  const days=Array.from({length:GANTT_DAYS},(_,i)=>{const d=new Date("2026-04-06T12:00:00");d.setDate(d.getDate()+i);const isW=d.getDay()===0||d.getDay()===6;const isMile=i===22;return{i,isW,isMile,lbl:isMile?"28⭐":d.getMonth()===4?`${d.getDate()}/5`:String(d.getDate())};});
  return<div>
    <SecHead title="Gantt Chart" sub="6 April – 8 May 2026 · ⭐ = Event Day · Click task name to edit — syncs to RACI"/>
    <div style={{background:"#FFF3CD",border:"1px solid #F0C040",borderRadius:10,padding:"9px 14px",marginBottom:14,fontSize:12,color:"#7A5000",display:"flex",alignItems:"center",gap:8}}>
      🔗 <span>Editing any task here automatically updates the <b>RACI matrix</b>, <b>Dashboard</b> and <b>Final Report</b>.</span>
    </div>
    <div style={{overflowX:"auto",borderRadius:12,border:`1px solid ${B.pl}`}}>
      <table style={{borderCollapse:"collapse",minWidth:900,width:"100%",tableLayout:"fixed"}}>
        <colgroup><col style={{width:28}}/><col style={{width:200}}/><col style={{width:80}}/>{days.map((_,i)=><col key={i} style={{width:`${100/GANTT_DAYS}%`}}/>)}</colgroup>
        <thead>
          <tr><th colSpan={3} style={{background:B.dk,padding:"8px 12px",textAlign:"left",color:B.pl,fontSize:10,fontWeight:700}}>Task</th><th colSpan={GANTT_DAYS} style={{background:B.dk,padding:"8px 6px",textAlign:"center",color:B.lt,fontSize:10,fontWeight:700}}>April 2026 → May 2026</th></tr>
          <tr style={{background:B.dk}}>{["#","Task","Owner"].map(h=><th key={h} style={{padding:"6px 10px",color:B.pl,fontSize:10,fontWeight:700,textAlign:"left"}}>{h}</th>)}{days.map(d=><th key={d.i} style={{padding:"4px 1px",textAlign:"center",fontSize:d.isMile?9:8,fontWeight:d.isMile?700:600,color:d.isW?"rgba(116,198,157,.7)":d.isMile?"#FFD700":B.pl,background:d.isW?"rgba(0,0,0,.18)":B.dk,borderLeft:d.isMile?"2px solid rgba(255,215,0,.4)":undefined}}>{d.lbl}</th>)}</tr>
        </thead>
        <tbody>
          {tasks.map((t,ri)=>{
            const m=memberObj(t.owner);const gl=ganttOffset(t.start);const gw=ganttWidth(t.start,t.end);const bc=barCol(t);const bg=ri%2===0?B.wh:B.st;const isRecent=t.updatedAt&&Date.now()-t.updatedAt<60000;
            return<tr key={t.id} style={{background:isRecent?"#FFFBEA":bg,outline:isRecent?"2px solid #F0C040":"none"}}>
              <td style={{padding:"5px 10px",fontSize:10,color:B.tg,fontWeight:600}}>{t.id}</td>
              <td style={{padding:"5px 10px",cursor:"pointer"}} onClick={()=>setModal(t)}>
                <div style={{fontSize:11,fontWeight:t.id===17?700:400,color:t.id===17?B.dk:B.tx,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{isRecent&&<span style={{fontSize:9,color:"#7A5000",marginRight:4}}>✦</span>}{t.id===17?"⭐ ":""}{t.desc}</div>
                <div style={{fontSize:9,color:B.tg}}>{fmtDate(t.start)} → {fmtDate(t.end)}</div>
              </td>
              <td style={{padding:"5px 10px",fontSize:10,color:B.tm,whiteSpace:"nowrap"}}>{m.name.split(" ")[0]}</td>
              {days.map(d=>{const inBar=d.i>=gl&&d.i<gl+gw;const isStart=inBar&&d.i===gl;const isEnd=inBar&&d.i===gl+gw-1;return<td key={d.i} style={{padding:"4px 1px",height:32,textAlign:"center",background:inBar?bc:d.isW?"rgba(116,198,157,.08)":"transparent",borderLeft:d.isMile?"1px dashed rgba(255,215,0,.35)":undefined,borderRadius:isStart?"4px 0 0 4px":isEnd?"0 4px 4px 0":undefined}}>{inBar&&t.id===17&&d.i===gl&&<span style={{fontSize:12}}>⭐</span>}</td>;})}
            </tr>;
          })}
        </tbody>
      </table>
    </div>
    <div style={{display:"flex",gap:16,marginTop:10,flexWrap:"wrap"}}>
      {[["Planned",B.md],["In Progress",B.ac],["Complete",B.dk],["Milestone","#FFD700"],["Weekend","rgba(116,198,157,.15)"],["Just updated","#FFFBEA"]].map(([l,c])=>
        <div key={l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:14,height:9,borderRadius:2,background:c,border:"1px solid rgba(0,0,0,.1)"}}/><span style={{fontSize:10,color:B.tg}}>{l}</span></div>
      )}
    </div>
    {modal&&<TaskModal task={modal} onSave={handleSave} onDelete={handleDelete} onClose={()=>setModal(null)}/>}
  </div>;
}

// ════════════════════════════════════════════════════════════
// RACI — tick to complete with auto-propagation
// ════════════════════════════════════════════════════════════
function RaciMatrix({tasks,setTasks,raci,setRaci,setToast,isMobile}){
  const[modal,setModal]=useState(null);

  // Mark task complete from RACI — the key new feature
  function toggleTaskDone(taskId){
    const t=tasks.find(x=>x.id===taskId);
    if(!t)return;
    const alreadyDone=t.status==="Complete";
    const newStatus=alreadyDone?"Not Started":"Complete";
    const newPct=alreadyDone?0:100;
    setTasks(ts=>ts.map(x=>x.id===taskId?{...x,status:newStatus,pct:newPct,updatedAt:Date.now()}:x));
    setToast(alreadyDone?`↩ Task #${taskId} marked Not Started`:`✅ Task #${taskId} marked Complete — Gantt & Report updated`);
  }

  function cycleCell(taskId,memberId){
    setRaci(prev=>{const row=prev[taskId]||{};const cur=row[memberId]||"";const next=RACI_CYCLE[(RACI_CYCLE.indexOf(cur)+1)%RACI_CYCLE.length];return{...prev,[taskId]:{...row,[memberId]:next}};});
  }

  function handleSave(saved){setTasks(ts=>ts.map(t=>t.id===saved.id?{...saved,updatedAt:Date.now()}:t));setModal(null);setToast(`✓ Task #${saved.id} updated — Gantt & Report synced`);}
  function handleDelete(id){setTasks(ts=>ts.filter(t=>t.id!==id));setModal(null);setToast("Task deleted");}

  const warns=tasks.filter(t=>{const r=raci[t.id]||{};const v=Object.values(r);return!v.includes("R")||!v.includes("A");});

  return<div>
    <SecHead title="RACI Matrix" sub="Tap ✓ to mark a task complete — auto-updates Gantt, Dashboard & Final Report"/>

    <div style={{background:"#EBF7EE",border:`1px solid ${B.lt}`,borderRadius:10,padding:"12px 16px",marginBottom:14,fontSize:12,color:B.md,display:"flex",gap:10,alignItems:"flex-start"}}>
      <span style={{fontSize:18,flexShrink:0}}>💡</span>
      <div>
        <b style={{display:"block",marginBottom:3}}>How to mark actions complete:</b>
        Tap the <span style={{background:"#1A5C2A",color:"#fff",borderRadius:6,padding:"1px 7px",fontSize:11,fontWeight:700}}>✓</span> button at the end of any row to toggle the task between <b>Complete</b> and <b>Not Started</b>. This instantly updates the Gantt bar colour, Dashboard KPIs and Final Report. Use the <b>R/A/C/I cells</b> to adjust responsibility assignments.
      </div>
    </div>

    <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
      {[["R","Responsible","#1A3C2E","#fff"],["A","Accountable","#40916C","#fff"],["C","Consulted","#D8F3DC","#1A3C2E"],["I","Informed","#e4e4e4","#555"]].map(([v,l,bg,fg])=>
        <div key={v} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",background:B.wh,borderRadius:10,border:`1px solid ${B.pl}`}}>
          <div style={{width:24,height:24,borderRadius:6,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:fg,flexShrink:0}}>{v}</div>
          <div style={{fontSize:11,color:B.dk,fontWeight:600}}>{l}</div>
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px",background:B.wh,borderRadius:10,border:`1px solid ${B.pl}`}}>
        <div style={{width:24,height:24,borderRadius:6,background:"#1A5C2A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff",flexShrink:0}}>✓</div>
        <div style={{fontSize:11,color:B.dk,fontWeight:600}}>Mark Complete</div>
      </div>
    </div>

    {warns.length>0&&<div style={{background:"#FFF3CD",border:"1px solid #F0C040",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:12,color:"#7A5000"}}>⚠ {warns.length} task{warns.length>1?"s":""} missing R or A: {warns.map(t=>`#${t.id}`).join(", ")}</div>}

    <div style={{overflowX:"auto",background:B.wh,borderRadius:12,border:`1px solid ${B.pl}`,WebkitOverflowScrolling:"touch"}}>
      <table style={{borderCollapse:"collapse",minWidth:isMobile?680:820,width:"100%"}}>
        <thead>
          <tr style={{background:B.dk}}>
            <th style={{padding:"10px 8px",textAlign:"left",color:B.pl,fontSize:10,fontWeight:700,width:28,position:"sticky",left:0,background:B.dk,zIndex:2}}>#</th>
            <th style={{padding:"10px 10px",textAlign:"left",color:B.pl,fontSize:10,fontWeight:700,minWidth:isMobile?120:170,position:"sticky",left:28,background:B.dk,zIndex:2}}>Task</th>
            <th style={{padding:"10px 8px",textAlign:"center",color:B.pl,fontSize:10,fontWeight:700,minWidth:70}}>Status</th>
            <th style={{padding:"10px 8px",textAlign:"center",color:B.pl,fontSize:10,fontWeight:700,minWidth:isMobile?70:100}}>Timeline</th>
            {TEAM.map(m=><th key={m.id} style={{padding:"10px 6px",textAlign:"center",color:B.pl,fontSize:10,fontWeight:700,minWidth:56}}>
              <Avatar name={m.name} area={m.area} size={22}/><div style={{marginTop:3,fontSize:9}}>{m.name.split(" ")[0]}</div>
            </th>)}
            <th style={{padding:"10px 8px",textAlign:"center",color:B.pl,fontSize:10,fontWeight:700,minWidth:52}}>Done</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t,ri)=>{
            const row=raci[t.id]||{};
            const isDone=t.status==="Complete";
            const isRecent=t.updatedAt&&Date.now()-t.updatedAt<60000;
            const bg=isRecent?"#FFFBEA":ri%2===0?B.wh:B.st;
            const hasR=Object.values(row).includes("R");const hasA=Object.values(row).includes("A");
            return<tr key={t.id} style={{background:bg,outline:isRecent?"2px solid #F0C040":"none"}}>
              <td style={{padding:"8px 8px",fontSize:10,color:B.tg,fontWeight:600,position:"sticky",left:0,background:isDone?"#C6EFCE":bg,zIndex:1}}>{t.id}</td>
              <td style={{padding:"8px 10px",position:"sticky",left:28,background:isDone?"#C6EFCE":bg,zIndex:1,cursor:"pointer"}} onClick={()=>setModal(t)}>
                {isRecent&&<div style={{fontSize:8,color:"#7A5000",fontWeight:700,marginBottom:2}}>✦ UPDATED</div>}
                <div style={{fontSize:11,color:isDone?"#1A5C2A":B.tx,lineHeight:1.3,fontWeight:isDone?700:400,textDecoration:isDone?"none":"none"}}>
                  {isDone&&<span style={{marginRight:4}}>✅</span>}{t.id===17?"⭐ ":""}{t.desc}
                </div>
                {(!hasR||!hasA)&&<div style={{fontSize:9,color:"#7A5000"}}>⚠ Missing {!hasR?"R":""}{!hasA&&!hasR?" & ":""}{!hasA?"A":""}</div>}
              </td>
              <td style={{padding:"5px 6px",textAlign:"center",background:isDone?"#C6EFCE":undefined}}>
                <Badge label={t.status} small/><div style={{fontSize:9,color:B.tg,marginTop:3}}>{t.pct}%</div>
              </td>
              <td style={{padding:"5px 8px",background:isDone?"#C6EFCE":undefined}}>
                <div style={{height:6,borderRadius:99,background:B.st,overflow:"hidden",position:"relative",minWidth:isMobile?60:90}}>
                  <div style={{position:"absolute",left:`${Math.min(85,Math.round((ganttOffset(t.start)/GANTT_DAYS)*100))}%`,width:`${Math.max(2,Math.round((ganttWidth(t.start,t.end)/GANTT_DAYS)*100))}%`,height:"100%",background:t.status==="Complete"?B.dk:t.status==="In Progress"?B.ac:B.md,borderRadius:99}}/>
                </div>
                <div style={{fontSize:8,color:B.tg,marginTop:2,textAlign:"center"}}>{fmtDate(t.start)}</div>
              </td>
              {TEAM.map(m=>{
                const v=row[m.id]||"";const rs=RACI_STYLE[v]||RACI_STYLE[""];
                return<td key={m.id} style={{padding:"5px 5px",textAlign:"center",background:isDone?"rgba(198,239,206,.3)":undefined}}>
                  <div onClick={()=>cycleCell(t.id,m.id)} title={`${m.name}: ${v||"unassigned"}`}
                    style={{width:34,height:34,borderRadius:7,margin:"0 auto",background:rs.bg,color:rs.fg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,cursor:"pointer",border:v?"none":"1.5px dashed #ddd",userSelect:"none",WebkitTapHighlightColor:"transparent",transition:"transform .1s"}}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                    {v||"+"}
                  </div>
                </td>;
              })}
              {/* ── TICK / DONE BUTTON ── */}
              <td style={{padding:"5px 6px",textAlign:"center"}}>
                <div onClick={()=>toggleTaskDone(t.id)} title={isDone?"Click to mark Not Started":"Click to mark Complete"}
                  style={{width:36,height:36,borderRadius:8,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",userSelect:"none",WebkitTapHighlightColor:"transparent",transition:"all .2s",
                    background:isDone?"#1A5C2A":"transparent",
                    border:isDone?"2px solid #1A5C2A":"2px dashed #74C69D",
                    boxShadow:isDone?"0 2px 8px rgba(26,92,42,.3)":"none",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.12)";if(!isDone)e.currentTarget.style.background="#D8F3DC";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";if(!isDone)e.currentTarget.style.background="transparent";}}>
                  <span style={{fontSize:16,color:isDone?"#fff":"#74C69D",fontWeight:700,lineHeight:1}}>{isDone?"✓":"✓"}</span>
                </div>
              </td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
    <p style={{fontSize:11,color:B.tg,marginTop:8}}>Tap <b>✓</b> to toggle task complete · updates Gantt, Dashboard & Final Report instantly · scroll right for all columns</p>
    {modal&&<TaskModal task={modal} onSave={handleSave} onDelete={handleDelete} onClose={()=>setModal(null)}/>}
  </div>;
}

// ════════════════════════════════════════════════════════════
// FINAL REPORT — auto-generated from task completion state
// ════════════════════════════════════════════════════════════
function FinalReport({tasks,raci,isMobile}){
  const done=tasks.filter(t=>t.status==="Complete");
  const inp=tasks.filter(t=>t.status==="In Progress");
  const ns=tasks.filter(t=>t.status==="Not Started");
  const pct=calcPct(tasks);
  const allDone=tasks.length>0&&done.length===tasks.length;

  const memberSummary=TEAM.map(m=>{
    const myTasks=tasks.filter(t=>t.owner===m.id);
    const myDone=myTasks.filter(t=>t.status==="Complete");
    const myRaci=tasks.map(t=>{const r=(raci[t.id]||{})[m.id];return r?{task:t,role:r}:null;}).filter(Boolean);
    const accountable=myRaci.filter(x=>x.role==="A"||x.role==="R");
    return{...m,myTasks,myDone,accountable,completion:myTasks.length?Math.round(myDone.length/myTasks.length*100):0};
  });

  const postEventTasks=[18,19];
  const criticalOutstanding=tasks.filter(t=>t.status!=="Complete"&&t.pri==="Critical");

  return<div>
    <SecHead title="Final Report" sub="Auto-generated from task completion — updates live as RACI ticks are applied"/>

    {/* Status banner */}
    <div style={{background:allDone?B.dk:pct>60?"#FFF3CD":"#FFE0E0",borderRadius:14,padding:"18px 22px",marginBottom:16,border:`1px solid ${allDone?B.lt:pct>60?"#F0C040":"#E08080"}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:allDone?"#fff":pct>60?"#7A5000":"#8B1A1A",marginBottom:4}}>
            {allDone?"🎉 Event Fully Complete":"📋 Report in Progress — "+pct+"% of tasks complete"}
          </div>
          <div style={{fontSize:12,color:allDone?B.lt:pct>60?"#7A5000":"#8B1A1A"}}>
            {allDone?"All 19 tasks marked complete. Report is finalised.":`${done.length} of ${tasks.length} tasks complete · ${ns.length} outstanding · tick ✓ on RACI to update`}
          </div>
        </div>
        <div style={{fontSize:32,fontWeight:800,color:allDone?"#fff":pct>60?"#7A5000":"#8B1A1A"}}>{pct}%</div>
      </div>
      {!allDone&&<div style={{marginTop:12}}>
        <div style={{height:8,borderRadius:99,background:"rgba(0,0,0,.1)",overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:pct>60?"#7A5000":B.dk,borderRadius:99,transition:"width .5s"}}/>
        </div>
      </div>}
    </div>

    {/* Event headline facts */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:13}}>📋 Event Summary</div>
      {[["Event","Oxford-Style Debate — Northumbria Construct"],["Date","Monday 28 April 2026"],["Time","3:00pm – 5:00pm"],["Venue","NSU Building – Reds Hall, Northumbria University"],["Organiser","Northumbria Construct Student Society"],["Tasks Total",tasks.length],["Tasks Complete",done.length],["Tasks Remaining",ns.length+inp.length],["Overall Progress",`${pct}%`]].map(([l,v])=>
        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${B.st}`}}>
          <span style={{fontSize:12,color:B.tg}}>{l}</span>
          <span style={{fontSize:12,fontWeight:600,color:typeof v==="number"&&v===done.length&&done.length>0?"#1A5C2A":B.tx}}>{v}</span>
        </div>
      )}
    </Card>

    {/* Completed tasks */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>✅ Completed Tasks ({done.length}/{tasks.length})</div>
      {done.length===0
        ?<div style={{fontSize:12,color:B.tg,textAlign:"center",padding:16}}>No tasks marked complete yet. Tick ✓ on the RACI tab to mark tasks done.</div>
        :done.map(t=>{
          const m=memberObj(t.owner);
          return<div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${B.st}`}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"#C6EFCE",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:12,color:"#1A5C2A",fontWeight:700}}>✓</span>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,color:"#1A5C2A",fontWeight:600}}>{t.desc}</div>
              <div style={{fontSize:10,color:B.tg,marginTop:1}}>{t.notes}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
              <Avatar name={m.name} area={m.area} size={20}/>
              <span style={{fontSize:10,color:B.tg}}>{m.name.split(" ")[0]}</span>
            </div>
          </div>;
        })
      }
    </Card>

    {/* Outstanding tasks */}
    {(inp.length>0||ns.length>0)&&<Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>⏳ Outstanding Tasks ({inp.length+ns.length})</div>
      {[...inp,...ns].map(t=>{
        const m=memberObj(t.owner);
        return<div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${B.st}`}}>
          <Badge label={t.status} small/>
          <div style={{flex:1}}><div style={{fontSize:12,color:B.tx,fontWeight:500}}>{t.desc}</div><div style={{fontSize:10,color:B.tg,marginTop:1}}>{fmtDate(t.end)}</div></div>
          <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}><Avatar name={m.name} area={m.area} size={20}/><span style={{fontSize:10,color:B.tg}}>{m.name.split(" ")[0]}</span></div>
        </div>;
      })}
    </Card>}

    {/* Team completion summary */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:14}}>👥 Team Completion Summary</div>
      {memberSummary.map(m=>(
        <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${B.st}`}}>
          <Avatar name={m.name} area={m.area} size={36}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:12,fontWeight:600,color:B.dk}}>{m.name.split(" ")[0]}</span>
              <span style={{fontSize:11,color:m.completion===100?"#1A5C2A":B.tg,fontWeight:600}}>{m.myDone.length}/{m.myTasks.length} tasks · {m.completion}%</span>
            </div>
            <Pbar pct={m.completion} h={5} done={m.completion===100}/>
          </div>
        </div>
      ))}
    </Card>

    {/* Post-event actions */}
    <Card>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>📣 Post-Event Actions</div>
      <div style={{fontSize:12,color:B.tg,marginBottom:12}}>These tasks activate after the event on 28 April:</div>
      {tasks.filter(t=>postEventTasks.includes(t.id)).map(t=>{
        const isDone=t.status==="Complete";
        return<div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${B.st}`}}>
          <div style={{width:22,height:22,borderRadius:"50%",background:isDone?"#C6EFCE":"#FFE0E0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:12,fontWeight:700,color:isDone?"#1A5C2A":"#8B1A1A"}}>{isDone?"✓":"○"}</span>
          </div>
          <div style={{flex:1}}><div style={{fontSize:12,color:isDone?"#1A5C2A":B.tx,fontWeight:isDone?600:400}}>{t.desc}</div><div style={{fontSize:10,color:B.tg}}>Due: {fmtDate(t.end)} · Owner: {memberObj(t.owner).name.split(" ")[0]}</div></div>
          <Badge label={t.status} small/>
        </div>;
      })}
      <div style={{marginTop:14,padding:"12px 16px",background:B.st,borderRadius:10,fontSize:12,color:B.tm}}>
        <b style={{color:B.dk,display:"block",marginBottom:6}}>Remaining post-event actions:</b>
        {["Publish LinkedIn event recap article (Kufre Antia — by 1 May)","Share photos and speaker quotes on Northumbria Construct LinkedIn","Collate and analyse feedback form responses (Tolulope Idowu — by 30 Apr)","Send thank-you messages to all speakers and the Debate Chair","Document lessons learned for future events (Tolulope — by 3 May)"].map((a,i)=>
          <div key={i} style={{display:"flex",gap:8,padding:"4px 0"}}>
            <span style={{color:B.ac,flexShrink:0}}>·</span><span>{a}</span>
          </div>
        )}
      </div>
    </Card>
  </div>;
}

// ════════════════════════════════════════════════════════════
// TEAM
// ════════════════════════════════════════════════════════════
function Team({tasks,isMobile}){
  const coreRoles=[
    {role:"Project Manager",         resp:"Overall coordination; liaison with NSU",                                       who:"Tolulope Idowu",          status:"Assigned"},
    {role:"Debate Chair / Moderator",resp:"Neutral facilitation; Oxford rules; timekeeping",                              who:"Shortlist: Kelechi Ayanso · Barry Gledson · Michelle Littlemore · Pablo Martinez",status:"Shortlisted"},
    {role:"Proposition Team (2–3)",  resp:"Argue in favour of the motion",                                               who:"Kufre Antia (lead) · Kufre, Lucas, Ikechukwu, Vemula, Judith, Adiyita, Maria",status:"In Selection"},
    {role:"Opposition Team (2–3)",   resp:"Argue against the motion",                                                    who:"Kufre Antia (lead) · TBC",status:"Open"},
    {role:"Logistics Lead",          resp:"Reds Hall, AV, seating, signage",                                             who:"Uchechukwu Maduwuba",     status:"Assigned"},
    {role:"Comms & Engagement",      resp:"Promotion, registration, attendance",                                         who:"All team",                status:"Active"},
  ];
  const stBadge=s=>s==="Assigned"||s==="Active"?{bg:"#C6EFCE",fg:"#1A5C2A"}:s==="Shortlisted"||s==="In Selection"?{bg:"#FFF3CD",fg:"#7A5000"}:{bg:"#FFE0E0",fg:"#8B1A1A"};
  return<div>
    <SecHead title="Team" sub="Northumbria Construct Event Planning Committee"/>
    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
      {TEAM.map(m=>{
        const mt=tasks.filter(t=>t.owner===m.id);const mp=calcPct(mt);const mc=mt.filter(t=>t.status==="Complete").length;
        return<Card key={m.id} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
          <Avatar name={m.name} area={m.area} size={46}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:14,color:B.dk}}>{m.name}</div>
            <div style={{fontSize:11,color:B.ac,fontWeight:600,marginBottom:5}}>{m.role}</div>
            <div style={{fontSize:11,color:B.tg,lineHeight:1.55}}>{m.resp}</div>
            <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:9,padding:"2px 9px",borderRadius:20,background:B.pl,color:B.md,fontWeight:700}}>{m.area}</span><span style={{fontSize:9,color:B.tg}}>{mc}/{mt.length} tasks complete</span></div>
            <div style={{marginTop:7,display:"flex",alignItems:"center",gap:6}}><Pbar pct={mp} h={5}/><span style={{fontSize:10,color:B.md,fontWeight:600,minWidth:30}}>{mp}%</span></div>
          </div>
        </Card>;
      })}
    </div>
    <Card style={{padding:"0",overflow:"hidden",marginBottom:14}}>
      <div style={{background:B.md,padding:"12px 18px",fontWeight:700,fontSize:14,color:"#fff"}}>Core Delivery Roles</div>
      {coreRoles.map((r,i)=>{const sc=stBadge(r.status);return<div key={i} style={{padding:"12px 18px",background:i%2===0?B.wh:B.st,borderBottom:`1px solid ${B.pl}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><span style={{fontSize:13,fontWeight:700,color:B.dk}}>{r.role}</span><span style={{fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:600,background:sc.bg,color:sc.fg}}>{r.status}</span></div>
        <div style={{fontSize:11,color:B.tm,marginBottom:3}}>{r.resp}</div><div style={{fontSize:11,color:B.tg}}>{r.who}</div>
      </div>;})}
    </Card>
  </div>;
}

// ════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════
export default function App(){
  const isMobile=useIsMobile();
  const[tab,setTab]=useState("home");
  const[tasks,setTasks]=useState(()=>loadState("nc_tasks_v2",DEFAULT_TASKS));
  const[raci,setRaci]=useState(()=>loadState("nc_raci_v2",DEFAULT_RACI));
  const[toast,setToast]=useState("");

  useEffect(()=>{try{localStorage.setItem("nc_tasks_v2",JSON.stringify(tasks));}catch{}},[tasks]);
  useEffect(()=>{try{localStorage.setItem("nc_raci_v2",JSON.stringify(raci));}catch{}},[raci]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(""),3000);return()=>clearTimeout(t);},[toast]);

  function exportCSV(){
    const hdr=["ID","Task","Owner","Start","End","Status","Priority","% Done","Notes"];
    const rows=tasks.map(t=>[t.id,`"${t.desc}"`,memberObj(t.owner).name,t.start,t.end,t.status,t.pri,t.pct,`"${t.notes}"`]);
    const csv=[hdr,...rows].map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="NC_Oxford_Debate.csv";a.click();
    setToast("⬇ CSV exported");
  }

  const TABS=[
    {id:"home",     label:"Home",   icon:"🏠"},
    {id:"dashboard",label:"Dash",   icon:"📊"},
    {id:"tasks",    label:"Tasks",  icon:"✅"},
    {id:"gantt",    label:"Gantt",  icon:"📅"},
    {id:"raci",     label:"RACI",   icon:"🔗"},
    {id:"team",     label:"Team",   icon:"👥"},
    {id:"report",   label:"Report", icon:"📋"},
  ];

  return<div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:B.st,minHeight:"100vh",color:B.tx,paddingBottom:isMobile?80:0}}>
    <div style={{background:B.dk,padding:`0 ${isMobile?14:20}px`,display:"flex",alignItems:"center",gap:12,height:54,position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 8px rgba(0,0,0,.2)"}}>
      <div style={{width:34,height:34,borderRadius:"50%",background:B.lt,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:12,fontWeight:700,color:B.dk}}>NC</span>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{color:"#fff",fontWeight:700,fontSize:14,lineHeight:1.1}}>Northumbria Construct</div>
        {!isMobile&&<div style={{color:B.lt,fontSize:10}}>Oxford Debate · 28 April 2026</div>}
      </div>
      {!isMobile&&<div style={{display:"flex",gap:2}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"5px 11px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,transition:"all .15s",background:tab===t.id?B.lt:"transparent",color:tab===t.id?B.dk:B.pl}}>{t.icon} {t.label}</button>)}
      </div>}
      <div style={{display:"flex",gap:6,flexShrink:0}}>
        <button onClick={exportCSV} style={{padding:"5px 11px",borderRadius:20,fontSize:11,fontWeight:600,background:"rgba(116,198,157,.2)",color:B.lt,border:"1px solid rgba(116,198,157,.3)",cursor:"pointer"}}>⬇ CSV</button>
      </div>
    </div>

    <div style={{maxWidth:1280,margin:"0 auto",padding:isMobile?"16px 14px":"22px 18px"}}>
      {tab==="home"     &&<Home isMobile={isMobile} onNav={setTab} tasks={tasks}/>}
      {tab==="dashboard"&&<Dashboard tasks={tasks} onNav={setTab} isMobile={isMobile}/>}
      {tab==="tasks"    &&<TaskTracker tasks={tasks} setTasks={setTasks} setToast={setToast} isMobile={isMobile}/>}
      {tab==="gantt"    &&<GanttChart tasks={tasks} setTasks={setTasks} setToast={setToast} isMobile={isMobile}/>}
      {tab==="raci"     &&<RaciMatrix tasks={tasks} setTasks={setTasks} raci={raci} setRaci={setRaci} setToast={setToast} isMobile={isMobile}/>}
      {tab==="team"     &&<Team tasks={tasks} isMobile={isMobile}/>}
      {tab==="report"   &&<FinalReport tasks={tasks} raci={raci} isMobile={isMobile}/>}
    </div>

    {isMobile&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:B.wh,borderTop:`1px solid ${B.pl}`,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom)"}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,border:"none",background:"transparent",padding:"8px 2px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:0}}>
        <span style={{fontSize:16}}>{t.icon}</span>
        <span style={{fontSize:8,fontWeight:700,color:tab===t.id?B.ac:B.tg,lineHeight:1}}>{t.label}</span>
        {tab===t.id&&<div style={{width:16,height:3,borderRadius:99,background:B.ac}}/>}
      </button>)}
    </div>}

    <Toast msg={toast}/>
  </div>;
}
