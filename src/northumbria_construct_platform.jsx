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

const LOGO_B64="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4dgE37u2nxPxH4vHREREfJ8G8YKbLbqJIiK+JSDFxcWRmRUR8V0CMnny5HM6dw4WOkZERERERGww6p133nFGjx4dvRIRERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERH/Bv4Prq9S1sNG1H0AAAAASUVORK5CYII=";
const LOGO_SRC=`data:image/png;base64,${LOGO_B64}`;
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
    <div style={{background:B.dk,borderRadius:16,padding:isMobile?"22px 20px":"32px 36px",marginBottom:16,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-80,right:-80,width:280,height:280,borderRadius:"50%",border:"1.5px solid rgba(116,198,157,.1)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:-30,right:-30,width:150,height:150,borderRadius:"50%",border:"1px solid rgba(116,198,157,.07)",pointerEvents:"none"}}/>
      <div style={{position:"relative",display:"flex",alignItems:"flex-start",gap:16}}>
        {/* Logo */}
        <div style={{width:isMobile?52:68,height:isMobile?52:68,borderRadius:"50%",background:"#fff",flexShrink:0,overflow:"hidden",border:"2px solid rgba(116,198,157,.3)",marginTop:2}}>
          <img src={LOGO_SRC} alt="NC" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:10,fontWeight:700,color:B.lt,textTransform:"uppercase",letterSpacing:2,marginBottom:6}}>Northumbria Construct · APM Challenge</div>
          <h1 style={{fontSize:isMobile?20:28,fontWeight:800,color:"#fff",margin:"0 0 6px",lineHeight:1.15}}>Oxford-Style Debate Event</h1>
          <div style={{fontSize:13,color:"rgba(255,255,255,.7)",marginBottom:16,lineHeight:1.5}}>A high-impact, student-led academic event hosted by Northumbria Construct — Built Environment Student Society, Northumbria University</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[["📅","28 April 2026"],["🕒","3pm – 5pm"],["📍","NSU – Reds Hall"],["🎓","~30 Students"],["✅","Free Entry"]].map(([ic,lbl])=>
              <div key={lbl} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,.1)",borderRadius:8,padding:"5px 10px",border:"1px solid rgba(255,255,255,.12)"}}>
                <span style={{fontSize:11}}>{ic}</span><span style={{fontSize:11,color:"#fff",fontWeight:600}}>{lbl}</span>
              </div>
            )}
          </div>
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
          <div key={lbl} style={{padding:"14px 16px",background:B.st,borderRadius:12,border:`1px solid ${B.pl}`,borderLeft:`4px solid ${B.ac}`}}>
            <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
              <span style={{fontSize:22,fontWeight:800,color:B.dk,lineHeight:1}}>{val}</span>
              <span style={{fontSize:18}}>{icon}</span>
            </div>
            <div style={{fontSize:12,color:B.tg,lineHeight:1.3}}>{lbl}</div>
          </div>
        )}
      </div>
      <div style={{fontSize:12,color:B.tg,lineHeight:1.6}}>Additional criteria: balanced debate with active audience Q&A · clear follow-on engagement with Northumbria Construct · post-event LinkedIn coverage published within 48 hours.</div>
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
  const [view,setView]=useState("register"); // "register" | "matrix" | "method"

  // ── Scoring: 1–5 scale, weighted formula ─────────────────────────────────
  // Weighted Score = (Power×0.30) + (Interest×0.25) + (Influence×0.30) + (Ease×0.15)
  const W={power:0.30,interest:0.25,influence:0.30,ease:0.15};
  function wScore(s){return Math.round(((s.power*W.power)+(s.interest*W.interest)+(s.influence*W.influence)+(s.ease*W.ease))*100)/100;}
  function wBand(sc){return sc>=4?"Critical":sc>=3?"High":sc>=2?"Medium":"Low";}
  function wBandStyle(sc){return sc>=4?{bg:"#1A3C2E",fg:B.lt}:sc>=3?{bg:"#40916C",fg:"#fff"}:sc>=2?{bg:"#D8F3DC",fg:"#2D6A4F"}:{bg:"#f0f0f0",fg:"#555"};}
  function autoCategory(p,i){
    if(p>=4&&i>=4)return"Key Player";
    if(p>=4)return"Keep Satisfied";
    if(i>=4)return"Keep Informed";
    return"Monitor";
  }
  function catColor(c){return c==="Key Player"?B.dk:c==="Keep Satisfied"?B.md:c==="Keep Informed"?B.ac:"#888";}

  const rawStakeholders=[
    // {id, name, type, power, interest, influence, ease, strategy, engagement, owner, frequency}
    {id:1,name:"NSU / Student Union",      type:"Internal",  power:5,interest:5,influence:4,ease:4,
      strategy:"Keep fully informed at every stage. NSU approved venue access — this relationship is critical. Regular updates on attendance numbers, logistics and any changes to the event plan. Involve in Go/No-Go gate decision on 27 April.",
      engagement:"Direct — weekly meetings",frequency:"Weekly",owner:"Callum O'Connor",
      icon:"🏛"},
    {id:2,name:"Built Environment Students",type:"Beneficiary",power:2,interest:5,influence:3,ease:5,
      strategy:"Primary audience and core beneficiaries. Reach via WhatsApp course groups, course reps and LinkedIn. Over-invite to 60–70 registrants to secure 25+ attendance on the day. Gather feedback post-event.",
      engagement:"Broadcast — social & WhatsApp",frequency:"Bi-weekly",owner:"Tolulope Idowu",
      icon:"🎓"},
    {id:3,name:"Academic Staff / Lecturers",type:"External", power:3,interest:4,influence:4,ease:3,
      strategy:"Leverage for promotional amplification. Request forwarding of event emails to student cohorts. Share concise one-page brief and registration link. Invite to observe — their presence increases perceived prestige.",
      engagement:"Periodic — email & liaison",frequency:"Monthly",owner:"Tolulope Idowu",
      icon:"📚"},
    {id:4,name:"Debate Chair (External)",   type:"External", power:4,interest:4,influence:4,ease:3,
      strategy:"Critical to event quality and perceived professionalism. Shortlist: Kelechi Ayanso, Barry Gledson, Michelle Littlemore, Pablo Martinez. Confirm early, brief thoroughly on Oxford rules, running order and timing expectations.",
      engagement:"Direct — brief & rehearsal",frequency:"Weekly from confirmation",owner:"Callum O'Connor",
      icon:"⚖️"},
    {id:5,name:"Student Speakers (Prop/Opp)",type:"Internal",power:2,interest:5,influence:3,ease:4,
      strategy:"Kufre Antia leads recruitment and briefing. Speaker pool: Kufre, Lucas, Ikechukwu, Vemula, Judith, Adiyita, Maria. Issue briefing pack by 11 April. Reconfirm availability by 24 April. Identify reserves for each side.",
      engagement:"Direct — briefing sessions",frequency:"Bi-weekly",owner:"Kufre Antia",
      icon:"🎙"},
    {id:6,name:"Northumbria University Faculty",type:"External",power:4,interest:3,influence:4,ease:3,
      strategy:"Keep satisfied with concise updates. Event must reflect positively on the Built Environment Faculty. Avoid overloading with detail. Share a clean executive summary and the approved event brief. Escalate only if venue or scope issues arise.",
      engagement:"Minimal — summary updates",frequency:"Monthly / milestone",owner:"Callum O'Connor",
      icon:"🎓"},
    {id:7,name:"Professional Bodies (APM, CIOB)",type:"External",power:2,interest:3,influence:5,ease:2,
      strategy:"Long-term relationship asset with high influence in industry. Share post-event LinkedIn article and key outcomes. Event aligns with APM/CIOB professional development goals. Tag in social posts. Difficult to engage directly but influential amplifiers.",
      engagement:"Post-event — LinkedIn only",frequency:"Post-event",owner:"Kufre Antia",
      icon:"🏆"},
    {id:8,name:"Society Alumni / LinkedIn Network",type:"External",power:1,interest:3,influence:3,ease:4,
      strategy:"Engage post-event through LinkedIn article and event recap. Use to grow the society's professional network and demonstrate ongoing student-led activity. Easy to reach but limited influence for this specific event.",
      engagement:"Post-event — social media",frequency:"Post-event",owner:"Kufre Antia",
      icon:"🔗"},
  ];

  // Compute derived fields
  const stakeholders=rawStakeholders.map(s=>{
    const score=wScore(s);
    const band=wBand(score);
    const category=autoCategory(s.power,s.interest);
    return{...s,score,band,category,color:catColor(category)};
  }).sort((a,b)=>b.score-a.score); // sorted by priority

  const bands=[
    {label:"Critical",range:"4.0–5.0",desc:"Immediate executive attention",bg:"#1A3C2E",fg:B.lt},
    {label:"High",    range:"3.0–3.9",desc:"Active management",          bg:B.ac,    fg:"#fff"},
    {label:"Medium",  range:"2.0–2.9",desc:"Routine engagement",         bg:"#D8F3DC",fg:B.md},
    {label:"Low",     range:"1.0–1.9",desc:"Minimal effort",             bg:"#f0f0f0",fg:"#555"},
  ];
  const categories=[
    {label:"Key Player",     cond:"Power ≥ 4 AND Interest ≥ 4",action:"Manage closely — direct involvement"},
    {label:"Keep Satisfied", cond:"Power ≥ 4, Interest < 4",   action:"Regular updates — avoid surprises"},
    {label:"Keep Informed",  cond:"Power < 4, Interest ≥ 4",   action:"Share progress — gather feedback"},
    {label:"Monitor",        cond:"Power < 4 AND Interest < 4", action:"Basic updates — reassess periodically"},
  ];

  const viewTabs=[{id:"register",l:"Register"},{id:"matrix",l:"Matrix"},{id:"method",l:"Methodology"}];

  return<div>
    <SecHead title="Stakeholder Identification & Analysis" sub="Weighted scoring model · Power 0.30 · Interest 0.25 · Influence 0.30 · Ease 0.15"/>

    {/* View tabs */}
    <div style={{display:"flex",gap:0,marginBottom:18,borderBottom:`2px solid ${B.pl}`}}>
      {viewTabs.map(t=><button key={t.id} onClick={()=>setView(t.id)} style={{
        padding:"9px 18px",border:"none",borderBottom:`3px solid ${view===t.id?B.ac:"transparent"}`,
        marginBottom:"-2px",background:"transparent",
        color:view===t.id?B.dk:B.tg,fontSize:12,fontWeight:view===t.id?800:600,
        cursor:"pointer",flexShrink:0,transition:"color .15s",
      }}>{t.l}</button>)}
    </div>

    {/* ── REGISTER VIEW ── */}
    {view==="register"&&<div>
      {/* Priority summary strip */}
      <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:2}}>
        {bands.map(({label,range,desc,bg,fg})=>{
          const count=stakeholders.filter(s=>s.band===label).length;
          if(count===0)return null;
          return<div key={label} style={{flexShrink:0,padding:"10px 14px",borderRadius:10,background:bg,minWidth:110}}>
            <div style={{fontSize:18,fontWeight:800,color:fg,lineHeight:1}}>{count}</div>
            <div style={{fontSize:11,fontWeight:700,color:fg,marginTop:2}}>{label}</div>
            <div style={{fontSize:9,color:fg,opacity:.75,marginTop:1}}>{range} · {desc}</div>
          </div>;
        })}
      </div>

      {/* Stakeholder cards */}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {stakeholders.map(s=>{
          const isSel=selected===s.id;
          const bs=wBandStyle(s.score);
          return<div key={s.id} style={{background:B.wh,borderRadius:12,border:`1.5px solid ${isSel?B.ac:B.pl}`,overflow:"hidden",transition:"border-color .15s",borderLeft:`4px solid ${s.color}`}}>
            {/* Header row */}
            <div onClick={()=>setSelected(isSel?null:s.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer"}}>
              <div style={{width:40,height:40,borderRadius:10,background:s.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>
                {s.icon}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,color:B.dk}}>{s.name}</div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginTop:2,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:B.tg}}>{s.type}</span>
                  <span style={{fontSize:10,color:B.tg}}>·</span>
                  <span style={{fontSize:10,color:B.tg}}>Owner: {s.owner.split(" ")[0]}</span>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:700,background:bs.bg,color:bs.fg}}>{s.band}</span>
                  <span style={{fontSize:13,fontWeight:800,color:B.dk}}>{s.score.toFixed(2)}</span>
                </div>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:99,background:`${s.color}20`,color:s.color,fontWeight:700}}>{s.category}</span>
              </div>
            </div>

            {/* Score bars — always visible */}
            <div style={{padding:"0 16px 10px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 16px"}}>
              {[["Power",s.power,W.power],["Interest",s.interest,W.interest],["Influence",s.influence,W.influence],["Ease",s.ease,W.ease]].map(([lbl,val,wt])=>
                <div key={lbl} style={{display:"flex",alignItems:"center",gap:7}}>
                  <span style={{fontSize:10,fontWeight:600,color:B.tg,width:60,flexShrink:0}}>{lbl} <span style={{fontSize:9,opacity:.6}}>×{(wt*100).toFixed(0)}%</span></span>
                  <div style={{flex:1,height:5,borderRadius:99,background:B.pl,overflow:"hidden"}}>
                    <div style={{width:`${(val/5)*100}%`,height:"100%",background:s.color,borderRadius:99}}/>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,color:s.color,width:20,textAlign:"right",flexShrink:0}}>{val}</span>
                </div>
              )}
            </div>

            {/* Expanded detail */}
            {isSel&&<div style={{padding:"12px 16px 14px",borderTop:`1px solid ${B.pl}`,background:B.st}}>
              <div style={{fontSize:11,fontWeight:700,color:B.tg,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Engagement Strategy</div>
              <div style={{fontSize:12,color:B.tm,lineHeight:1.65,marginBottom:10}}>{s.strategy}</div>
              <div style={{display:"flex",gap:16,flexWrap:"wrap",padding:"10px 12px",background:B.wh,borderRadius:8,border:`1px solid ${B.pl}`}}>
                <div><span style={{fontSize:10,color:B.tg}}>Engagement: </span><span style={{fontSize:11,fontWeight:700,color:B.dk}}>{s.engagement}</span></div>
                <div><span style={{fontSize:10,color:B.tg}}>Frequency: </span><span style={{fontSize:11,fontWeight:700,color:B.dk}}>{s.frequency}</span></div>
                <div><span style={{fontSize:10,color:B.tg}}>Owner: </span><span style={{fontSize:11,fontWeight:700,color:B.dk}}>{s.owner}</span></div>
                <div><span style={{fontSize:10,color:B.tg}}>Weighted Score: </span><span style={{fontSize:11,fontWeight:800,color:s.color}}>{s.score.toFixed(2)}</span></div>
              </div>
            </div>}
          </div>;
        })}
      </div>

      {/* Category key */}
      <Card>
        <div style={{fontWeight:700,fontSize:13,color:B.dk,marginBottom:12}}>📌 Category Classification</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {categories.map(({label,cond,action})=>{
            const col=catColor(label);
            return<div key={label} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"9px 12px",borderRadius:8,background:B.st,borderLeft:`4px solid ${col}`}}>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:B.dk,marginBottom:2}}>{label}</div>
                <div style={{fontSize:11,color:B.tg,marginBottom:2}}><b>Condition:</b> {cond}</div>
                <div style={{fontSize:11,color:B.tm}}><b>Action:</b> {action}</div>
              </div>
              <div style={{width:12,height:12,borderRadius:"50%",background:col,flexShrink:0,marginTop:3}}/>
            </div>;
          })}
        </div>
      </Card>
    </div>}

    {/* ── MATRIX VIEW ── */}
    {view==="matrix"&&<div>
      <Card style={{marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:4}}>📊 Power–Interest Matrix</div>
        <div style={{fontSize:11,color:B.tg,marginBottom:14}}>Stakeholders plotted by Power (Y) and Interest (X) on a 1–5 scale. Dot size reflects Influence score. Tap any dot for detail.</div>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          <svg viewBox="0 0 560 370" style={{width:"100%",maxWidth:560,display:"block"}} xmlns="http://www.w3.org/2000/svg">
            {/* Quadrant fills */}
            <rect x="70" y="20"  width="220" height="155" fill="#EBF7EE" rx="4" opacity=".8"/>
            <rect x="300" y="20" width="240" height="155" fill="#C6EFCE" rx="4" opacity=".8"/>
            <rect x="70" y="185" width="220" height="155" fill="#f8f8f8" rx="4" opacity=".8"/>
            <rect x="300" y="185" width="240" height="155" fill="#EBF7EE" rx="4" opacity=".8"/>
            {/* Quadrant labels */}
            <text x="180" y="40" textAnchor="middle" fontSize="9" fontWeight="700" fill="#607466" letterSpacing=".5">KEEP SATISFIED</text>
            <text x="420" y="40" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1A3C2E" letterSpacing=".5">KEY PLAYERS</text>
            <text x="180" y="203" textAnchor="middle" fontSize="9" fontWeight="700" fill="#aaa" letterSpacing=".5">MONITOR</text>
            <text x="420" y="203" textAnchor="middle" fontSize="9" fontWeight="700" fill="#2D6A4F" letterSpacing=".5">KEEP INFORMED</text>
            {/* Dividers */}
            <line x1="290" y1="20" x2="290" y2="340" stroke="#74C69D" strokeWidth="1" strokeDasharray="5,3" opacity=".6"/>
            <line x1="70"  y1="175" x2="540" y2="175" stroke="#74C69D" strokeWidth="1" strokeDasharray="5,3" opacity=".6"/>
            {/* Axes */}
            <line x1="60" y1="350" x2="545" y2="350" stroke="#B7DDBC" strokeWidth="1.5"/>
            <polygon points="545,347 545,353 551,350" fill="#B7DDBC"/>
            <line x1="60" y1="355" x2="60" y2="15" stroke="#B7DDBC" strokeWidth="1.5"/>
            <polygon points="57,15 63,15 60,9" fill="#B7DDBC"/>
            {/* Axis labels */}
            <text x="305" y="365" textAnchor="middle" fontSize="10" fill="#607466" fontWeight="600">Interest →</text>
            <text x="20" y="185" textAnchor="middle" fontSize="10" fill="#607466" fontWeight="600" transform="rotate(-90,20,185)">Power →</text>
            {/* Tick marks & grid */}
            {[1,2,3,4,5].map(v=>{
              const x=70+((v-1)/4)*470;const y=340-((v-1)/4)*320;
              return<g key={v}>
                <text x={x} y="362" textAnchor="middle" fontSize="9" fill="#aaa">{v}</text>
                <text x="58" y={y+4} textAnchor="end" fontSize="9" fill="#aaa">{v}</text>
                <line x1={x} y1="20" x2={x} y2="345" stroke="#e8e8e8" strokeWidth=".5"/>
                <line x1="65" y1={y} x2="540" y2={y} stroke="#e8e8e8" strokeWidth=".5"/>
              </g>;
            })}
            {/* Stakeholder dots — radius proportional to influence (r = influence*3+6) */}
            {stakeholders.map(s=>{
              const cx=70+((s.interest-1)/4)*470;
              const cy=340-((s.power-1)/4)*320;
              const r=s.influence*3+6;
              const isSel=selected===s.id;
              return<g key={s.id} onClick={()=>setSelected(selected===s.id?null:s.id)} style={{cursor:"pointer"}}>
                {isSel&&<circle cx={cx} cy={cy} r={r+10} fill={s.color} opacity=".15"/>}
                <circle cx={cx} cy={cy} r={r} fill={s.color} stroke="#fff" strokeWidth="2" style={{filter:isSel?"drop-shadow(0 2px 6px rgba(0,0,0,.3))":"none"}}/>
                <text x={cx} y={cy+4} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">{s.id}</text>
                {isSel&&<text x={cx} y={cy-r-8} textAnchor="middle" fontSize="9" fontWeight="700" fill={s.color}>{s.name.split(" ")[0]}</text>}
              </g>;
            })}
          </svg>
        </div>
        <div style={{fontSize:10,color:B.tg,marginTop:8}}>Dot size = Influence score (1–5). Tap any dot for stakeholder detail.</div>
      </Card>

      {/* Selected detail card */}
      {selected&&(()=>{const s=stakeholders.find(x=>x.id===selected);if(!s)return null;const bs=wBandStyle(s.score);
        return<Card style={{borderLeft:`4px solid ${s.color}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:36,height:36,borderRadius:8,background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{s.icon}</div>
              <div><div style={{fontWeight:700,fontSize:14,color:B.dk}}>{s.name}</div><div style={{fontSize:11,color:B.tg}}>{s.type} · {s.category}</div></div>
            </div>
            <div style={{padding:"6px 14px",borderRadius:10,background:bs.bg}}>
              <div style={{fontSize:10,color:bs.fg,fontWeight:700}}>Weighted Score</div>
              <div style={{fontSize:22,fontWeight:800,color:bs.fg,lineHeight:1}}>{s.score.toFixed(2)}</div>
              <div style={{fontSize:9,color:bs.fg,opacity:.75}}>{s.band} Priority</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 16px",marginBottom:12}}>
            {[["Power",s.power,W.power],["Interest",s.interest,W.interest],["Influence",s.influence,W.influence],["Ease",s.ease,W.ease]].map(([l,v,w])=>
              <div key={l} style={{display:"flex",alignItems:"center",gap:7}}>
                <span style={{fontSize:10,color:B.tg,width:66,flexShrink:0}}>{l} <span style={{opacity:.6}}>×{(w*100).toFixed(0)}%</span></span>
                <div style={{flex:1,height:6,borderRadius:99,background:B.pl,overflow:"hidden"}}>
                  <div style={{width:`${(v/5)*100}%`,height:"100%",background:s.color,borderRadius:99}}/>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:s.color,width:20,flexShrink:0}}>{v}</span>
              </div>
            )}
          </div>
          <div style={{fontSize:12,color:B.tm,lineHeight:1.65,marginBottom:8}}>{s.strategy}</div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",padding:"8px 12px",background:B.st,borderRadius:8}}>
            <span style={{fontSize:11,color:B.tg}}>Engagement: <b style={{color:B.dk}}>{s.engagement}</b></span>
            <span style={{fontSize:11,color:B.tg}}>Frequency: <b style={{color:B.dk}}>{s.frequency}</b></span>
            <span style={{fontSize:11,color:B.tg}}>Owner: <b style={{color:B.dk}}>{s.owner}</b></span>
          </div>
        </Card>;
      })()}

      {/* Legend */}
      <div style={{marginTop:14,display:"flex",gap:8,flexWrap:"wrap"}}>
        {stakeholders.map(s=><div key={s.id} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 8px",background:B.wh,borderRadius:8,border:`1px solid ${B.pl}`}}>
          <div style={{width:12,height:12,borderRadius:"50%",background:s.color}}/>
          <span style={{fontSize:10,color:B.tg}}><b style={{color:B.dk}}>{s.id}</b> {s.name.split(" ")[0]}</span>
        </div>)}
      </div>
    </div>}

    {/* ── METHODOLOGY VIEW ── */}
    {view==="method"&&<div>
      <Card style={{marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:10}}>📐 The Weighted Scoring Formula</div>
        <div style={{fontSize:13,color:B.tm,lineHeight:1.7,marginBottom:14}}>
          Stakeholders are scored across four dimensions using a <strong style={{color:B.dk}}>1–5 scale</strong>. The scores are combined using a weighted formula where Power and Influence carry greater weight because they drive project outcomes most decisively:
        </div>
        {/* Formula block */}
        <div style={{background:B.dk,borderRadius:12,padding:"18px 20px",marginBottom:16}}>
          <div style={{fontSize:11,color:B.lt,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Weighted Score Formula</div>
          <div style={{fontFamily:"monospace",fontSize:isMobile?12:14,color:"#fff",lineHeight:1.8}}>
            Score = (Power × <span style={{color:B.lt}}>0.30</span>) + (Interest × <span style={{color:B.lt}}>0.25</span>) +<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Influence × <span style={{color:B.lt}}>0.30</span>) + (Ease × <span style={{color:B.lt}}>0.15</span>)
          </div>
        </div>
        {/* Weight rationale */}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {dim:"Power",wt:"30%",icon:"⚡",color:"#1A3C2E",reason:"Formal authority to approve, block, or redirect the project. High-power stakeholders control access, funding and key decisions."},
            {dim:"Influence",wt:"30%",icon:"🔊",color:"#40916C",reason:"Ability to shape opinions and mobilise others without formal authority. An influential stakeholder can change project momentum quickly."},
            {dim:"Interest",wt:"25%",icon:"🎯",color:"#2D6A4F",reason:"How strongly the stakeholder cares about the project outcome. High interest drives engagement but also scrutiny."},
            {dim:"Ease",wt:"15%",icon:"🤝",color:"#74C69D",reason:"How accessible, responsive, and cooperative the stakeholder is. Even high-priority stakeholders may be difficult to engage."},
          ].map(({dim,wt,icon,color,reason})=>
            <div key={dim} style={{display:"flex",gap:12,padding:"12px 14px",background:B.st,borderRadius:10,border:`1px solid ${B.pl}`,borderLeft:`4px solid ${color}`,alignItems:"flex-start"}}>
              <div style={{width:36,height:36,borderRadius:8,background:color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>{icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                  <span style={{fontWeight:700,fontSize:13,color:B.dk}}>{dim}</span>
                  <span style={{fontWeight:800,fontSize:15,color}}>{wt}</span>
                </div>
                <div style={{fontSize:12,color:B.tg,lineHeight:1.5}}>{reason}</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Priority bands */}
      <Card style={{marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:14}}>📊 Priority Bands</div>
        {[
          {band:"Critical",range:"4.0 – 5.0",bg:"#1A3C2E",fg:B.lt,action:"Immediate executive attention — direct, frequent engagement required"},
          {band:"High",    range:"3.0 – 3.9",bg:"#40916C",fg:"#fff",action:"Active management — regular contact, involve in key decisions"},
          {band:"Medium",  range:"2.0 – 2.9",bg:"#D8F3DC",fg:B.md, action:"Routine engagement — scheduled updates, gather feedback"},
          {band:"Low",     range:"1.0 – 1.9",bg:"#f0f0f0",fg:"#555",action:"Minimal effort — passive monitoring, reassess periodically"},
        ].map(({band,range,bg,fg,action})=>
          <div key={band} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${B.st}`}}>
            <div style={{flexShrink:0,width:90,padding:"6px 8px",borderRadius:8,background:bg,textAlign:"left"}}>
              <div style={{fontSize:12,fontWeight:800,color:fg}}>{band}</div>
              <div style={{fontSize:10,color:fg,opacity:.75}}>{range}</div>
            </div>
            <div style={{flex:1,fontSize:12,color:B.tm,lineHeight:1.45}}>{action}</div>
          </div>
        )}
        <div style={{marginTop:12,padding:"10px 12px",background:"#FFFBEA",borderRadius:8,fontSize:11,color:"#7A5000",border:"1px solid #F0C040"}}>
          ⚡ Two stakeholders may share the same category but have different scores — use the weighted score to prioritise within each band. A Community Leader scoring 3.8 demands more effort than a General Group scoring 2.4, even if both are "Keep Informed".
        </div>
      </Card>

      {/* Scoring scale */}
      <Card style={{marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>🔢 Scoring Scale (1–5)</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:B.dk}}>{["Score","Meaning","Example"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",color:B.lt,fontWeight:700,fontSize:11}}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {[[1,"Very Low","General public — no direct stake"],[2,"Low","Peripheral department — minimal impact"],[3,"Moderate","Faculty — supportive but not critical"],[4,"High","NSU — approval authority over venue"],[5,"Very High","Project Sponsor — strategic decision-maker"]].map(([s,m,e],i)=>
                <tr key={s} style={{background:i%2===0?B.wh:B.st}}>
                  <td style={{padding:"8px 12px",fontWeight:800,color:B.dk}}>{s}</td>
                  <td style={{padding:"8px 12px",fontWeight:600,color:B.tm}}>{m}</td>
                  <td style={{padding:"8px 12px",color:B.tg,fontSize:11,fontStyle:"italic"}}>{e}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* When to reassess */}
      <Card>
        <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>🔄 When to Reassess</div>
        <div style={{fontSize:12,color:B.tg,marginBottom:12}}>Stakeholder positions change as the project progresses. Re-score at each of these points:</div>
        {["Project initiation — before planning begins","Gate 2 (15 Apr) — after Debate Chair and speakers confirmed","Gate 3 (21 Apr) — after registration hits 25+ target","Gate 4 (27 Apr) — Go/No-Go check","Post-event — to reflect any relationship changes for future events"].map((pt,i)=>
          <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<4?`1px solid ${B.st}`:"none",alignItems:"flex-start"}}>
            <div style={{width:22,height:22,borderRadius:6,background:B.ac,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,fontWeight:800,color:"#fff"}}>{i+1}</span>
            </div>
            <span style={{fontSize:12,color:B.tm,lineHeight:1.5}}>{pt}</span>
          </div>
        )}
      </Card>
    </div>}
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
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {TEAM.map(m=>{
          const mt=tasks.filter(t=>t.owner===m.id);const mp=calcPct(mt);const mc=mt.filter(t=>t.status==="Complete").length;
          return<div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:B.st,borderRadius:10,border:`1px solid ${B.pl}`}}>
            <Avatar name={m.name} area={m.area} size={36}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:5}}>
                <span style={{fontSize:12,fontWeight:700,color:B.dk}}>{m.name.split(" ")[0]}</span>
                <span style={{fontSize:10,color:B.tg}}>{mc}/{mt.length} tasks · {mp}%</span>
              </div>
              <Pbar pct={mp} h={5} done={mp===100}/>
            </div>
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
      <div style={{fontSize:13,color:B.tm,lineHeight:1.7,marginBottom:14}}>
        This event is governed using a <strong style={{color:B.dk}}>hybrid governance model</strong> — combining structured phase gates for oversight with agile flexibility to respond to change. Consistent with APMBoK §1.3.1 and the model developed during Northumbria Construct's Bridge the Gap project.
      </div>
      {/* Org chart */}
      <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",marginBottom:14}}>
        <svg viewBox="0 0 560 260" style={{width:"100%",maxWidth:560,display:"block",margin:"0 auto"}} xmlns="http://www.w3.org/2000/svg">
          {/* Connector lines */}
          <line x1="280" y1="60" x2="280" y2="90" stroke="#B7DDBC" strokeWidth="1.5"/>
          <line x1="280" y1="130" x2="280" y2="150" stroke="#B7DDBC" strokeWidth="1.5"/>
          <line x1="90" y1="150" x2="470" y2="150" stroke="#B7DDBC" strokeWidth="1.5"/>
          {[90,197,304,411,470].map(x=><line key={x} x1={x} y1="150" x2={x} y2="170" stroke="#B7DDBC" strokeWidth="1.5"/>)}

          {/* Sponsor box */}
          <rect x="190" y="10" width="180" height="48" rx="8" fill="#EBF7EE" stroke="#74C69D" strokeWidth="1.5"/>
          <text x="280" y="30" textAnchor="middle" fontSize="10" fontWeight="700" fill="#607466">PROJECT SPONSOR</text>
          <text x="280" y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1A3C2E">Dr. Rashid Maqbool</text>

          {/* President box */}
          <rect x="190" y="90" width="180" height="48" rx="8" fill="#1A3C2E" stroke="#40916C" strokeWidth="1.5"/>
          <text x="280" y="110" textAnchor="middle" fontSize="9" fontWeight="700" fill="#74C69D">PRESIDENT / EVENT LEAD</text>
          <text x="280" y="128" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">Callum O'Connor</text>

          {/* 5 committee boxes */}
          {[
            {x:50, name:"Sandhya\nChimata", role:"VP / COO", col:"#2D6A4F"},
            {x:157,name:"Kufre\nAntia",    role:"Training/CTO",col:"#40916C"},
            {x:264,name:"Tolulope\nIdowu",  role:"Proj. Mgr",  col:"#40916C"},
            {x:371,name:"Uchechukwu\nMaduwuba",role:"Events/Media",col:"#52B788"},
            {x:430,name:"All\nCommittee",  role:"Comms",      col:"#74C69D"},
          ].map(({x,name,role,col},i)=><g key={i}>
            <rect x={x} y="170" width="100" height="72" rx="8" fill={col} stroke="#fff" strokeWidth="1.5"/>
            <text x={x+50} y="189" textAnchor="middle" fontSize="8" fontWeight="600" fill="rgba(255,255,255,.75)">{role.toUpperCase()}</text>
            {name.split("\n").map((ln,li)=><text key={li} x={x+50} y={205+li*14} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{ln}</text>)}
          </g>)}
        </svg>
      </div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr",gap:10}}>
        {[
          ["📋","Structured Gates","Defined checkpoints at each phase. Gate must be passed before the next phase begins."],
          ["⚡","Agile Responses","Rapid adaptation to speaker changes, attendance data or venue issues without formal gate review."],
          ["👁","Tiered Oversight","Decisions escalate based on impact — PM (minor), President (major), Sponsor (critical)."],
        ].map(([ic,t,d])=>
          <div key={t} style={{background:B.st,borderRadius:10,padding:"13px 14px",border:`1px solid ${B.pl}`,borderLeft:`3px solid ${B.ac}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:18}}>{ic}</span>
              <span style={{fontWeight:700,fontSize:12,color:B.dk}}>{t}</span>
            </div>
            <div style={{fontSize:11,color:B.tg,lineHeight:1.5}}>{d}</div>
          </div>
        )}
      </div>
    </Card>

    {/* Decision authority */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:14}}>⚖️ Decision Authority Matrix</div>
      {decisions.map((d,i)=>{
        const lvl=["Critical","High","Medium","Low"][i];
        const lc=i===0?{bg:"#1A3C2E",fg:"#74C69D"}:i===1?{bg:"#40916C",fg:"#fff"}:i===2?{bg:"#D8F3DC",fg:"#2D6A4F"}:{bg:"#f0f0f0",fg:"#555"};
        return<div key={i} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:i<decisions.length-1?`1px solid ${B.st}`:"none",alignItems:"flex-start"}}>
          <div style={{flexShrink:0,padding:"3px 10px",borderRadius:99,background:lc.bg,fontSize:10,fontWeight:700,color:lc.fg,whiteSpace:"nowrap"}}>{lvl}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:B.dk,marginBottom:2}}>{d.type}</div>
            <div style={{fontSize:11,color:B.ac,fontWeight:600,marginBottom:2}}>Approved by: {d.approval}</div>
            <div style={{fontSize:11,color:B.tg,fontStyle:"italic"}}>{d.examples}</div>
          </div>
        </div>;
      })}
    </Card>

    {/* Change control */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>🔄 Change Control Process</div>
      <div style={{display:"flex",overflowX:"auto",gap:0,paddingBottom:4,WebkitOverflowScrolling:"touch"}}>
        {[
          {step:"1",title:"Identify",desc:"Committee member documents change with reason & impact",icon:"🔍"},
          {step:"2",title:"Assess",desc:"PM evaluates impact on programme, budget & risk",icon:"📊"},
          {step:"3",title:"Approve",desc:"Minor → PM · Major → President · Critical → Sponsor",icon:"✅"},
          {step:"4",title:"Implement",desc:"Change actioned; all documents updated",icon:"⚡"},
          {step:"5",title:"Review",desc:"Reviewed at next check-in; lessons captured",icon:"📝"},
        ].map(({step,title,desc,icon},i,arr)=>(
          <div key={step} style={{display:"flex",alignItems:"stretch",flexShrink:0}}>
            <div style={{width:isMobile?130:150,background:i%2===0?B.dk:B.md,borderRadius:i===0?"10px 0 0 10px":i===arr.length-1?"0 10px 10px 0":"0",padding:"14px 14px",display:"flex",flexDirection:"column",gap:6}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,.5)",fontWeight:700,letterSpacing:.5}}>{step}</div>
              <div style={{fontSize:16}}>{icon}</div>
              <div style={{fontSize:12,fontWeight:800,color:"#fff"}}>{title}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.65)",lineHeight:1.4}}>{desc}</div>
            </div>
            {i<arr.length-1&&<div style={{width:16,display:"flex",alignItems:"center",justifyContent:"center",background:i%2===0?B.dk:B.md,position:"relative"}}>
              <div style={{width:0,height:0,borderTop:"8px solid transparent",borderBottom:"8px solid transparent",borderLeft:`12px solid ${i%2===0?B.dk:B.md}`,position:"absolute",right:-12,zIndex:1}}/>
              <div style={{width:0,height:0,borderTop:"8px solid transparent",borderBottom:"8px solid transparent",borderLeft:`13px solid ${i%2===0?"#1A3C2E":"#2D6A4F"}`}}/>
            </div>}
          </div>
        ))}
      </div>
    </Card>

    {/* Gate reviews */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:14}}>🚦 Phase Gate Reviews</div>
      {gates.map(({phase,date,check,status},i)=>{
        const sc=stBadge(status);const isLast=i===gates.length-1;
        const dotCol=status==="Complete"?B.dk:status==="In Progress"?B.ac:"#ccc";
        return<div key={phase} style={{display:"flex",gap:0,position:"relative"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:40,flexShrink:0}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:dotCol,border:`3px solid ${status==="Complete"?B.ac:status==="In Progress"?"#F0C040":"#ddd"}`,zIndex:1,marginTop:4,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {status==="Complete"&&<span style={{fontSize:9,color:"#fff",fontWeight:800}}>✓</span>}
              {status==="In Progress"&&<span style={{fontSize:8,color:"#fff",fontWeight:800}}>▶</span>}
            </div>
            {!isLast&&<div style={{width:2,flex:1,background:status==="Complete"?B.ac:"#e0e0e0",margin:"3px 0"}}/>}
          </div>
          <div style={{padding:"2px 0 20px 12px",flex:1,borderLeft:"none"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,flexWrap:"wrap",gap:6}}>
              <span style={{fontSize:13,fontWeight:700,color:status==="Complete"?B.ac:B.dk}}>{phase}</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:10,color:B.tg,fontWeight:600}}>{date}</span>
                <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700,background:sc.bg,color:sc.fg}}>{status}</span>
              </div>
            </div>
            <div style={{fontSize:11,color:B.tg,lineHeight:1.55}}>{check}</div>
          </div>
        </div>;
      })}
    </Card>

    {/* Escalation path */}
    <Card>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>📞 Escalation & Communication Paths</div>
      {[
        {level:"Day-of issue",contact:"Callum O'Connor (Event Lead)",action:"Immediate decision authority — no escalation needed on event day",heat:4},
        {level:"Overdue task / risk",contact:"Callum O'Connor → Committee",action:"Escalate at next WhatsApp check-in or direct message",heat:3},
        {level:"Budget overrun",contact:"Tolulope Idowu → Callum O'Connor",action:"PM flags, President approves any additional spend",heat:3},
        {level:"Venue / NSU issue",contact:"Uchechukwu Maduwuba → Callum O'Connor",action:"Media Manager holds NSU building contact",heat:2},
        {level:"Critical scope change",contact:"Callum O'Connor → Project Sponsor",action:"Requires sponsor sign-off before action is taken",heat:4},
      ].map(({level,contact,action,heat},i)=>{
        const ht=heat===4?{bg:"#FFE0E0",fg:"#8B1A1A",bd:"#F0C0C0"}:heat===3?{bg:"#FFF3CD",fg:"#7A5000",bd:"#F0C040"}:{bg:B.st,fg:B.tg,bd:B.pl};
        return<div key={level} style={{display:"flex",gap:12,padding:"11px 12px",marginBottom:8,borderRadius:10,background:ht.bg,border:`1px solid ${ht.bd}`,alignItems:"flex-start"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:B.dk,marginBottom:2}}>{level}</div>
            <div style={{fontSize:11,color:B.ac,fontWeight:600,marginBottom:2}}>→ {contact}</div>
            <div style={{fontSize:11,color:B.tg}}>{action}</div>
          </div>
        </div>;
      })}
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
    {/* Sub-nav — underline tab style */}
    <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:`2px solid ${B.pl}`,overflowX:"auto"}}>
      {subPages.map(p=>(
        <button key={p.id} onClick={()=>setSubPage(p.id)} style={{
          display:"flex",alignItems:"center",gap:7,
          padding:isMobile?"10px 14px":"11px 20px",
          border:"none",borderBottom:`3px solid ${subPage===p.id?B.ac:"transparent"}`,
          marginBottom:"-2px",
          background:"transparent",
          color:subPage===p.id?B.dk:B.tg,
          fontSize:isMobile?11:12,fontWeight:subPage===p.id?800:600,
          cursor:"pointer",flexShrink:0,whiteSpace:"nowrap",
          transition:"color .15s",letterSpacing:.1,
        }}>
          <span style={{fontSize:isMobile?14:15}}>{p.icon}</span>
          <span>{p.label}</span>
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
      {[{l:"Overall Progress",v:`${pct}%`,s:`across ${tasks.length} tasks`,c:B.md,bg:"#EBF7EE"},{l:"Complete",v:done,s:"tasks finished",c:"#1A5C2A",bg:"#C6EFCE"},{l:"In Progress",v:inp,s:"tasks active",c:"#7A5000",bg:"#FFF3CD"},{l:"Not Started",v:ns,s:"tasks pending",c:"#8B1A1A",bg:"#FFE0E0"}].map((k,i)=>
        <div key={i} style={{background:k.bg,borderRadius:14,padding:"16px 18px",border:`1px solid ${k.bg}`}}>
          <div style={{fontSize:10,color:k.c,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,marginBottom:6,opacity:.75}}>{k.l}</div>
          <div style={{fontSize:30,fontWeight:800,color:k.c,lineHeight:1,marginBottom:3}}>{k.v}</div>
          <div style={{fontSize:11,color:k.c,opacity:.7}}>{k.s}</div>
        </div>
      )}
    </div>
    <Card style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontWeight:700,fontSize:13,color:B.dk}}>Overall Completion</span>
        <span style={{fontWeight:800,color:B.md,fontSize:15}}>{pct}%</span>
      </div>
      <Pbar pct={pct} h={10} done={pct===100}/>
      <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap"}}>
        {[["Complete",done,"#C6EFCE","#1A5C2A"],["In Progress",inp,"#FFF3CD","#7A5000"],["Not Started",ns,"#FFE0E0","#8B1A1A"]].map(([l,n,bg,fg])=>
          <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:10,height:10,borderRadius:3,background:bg,border:`1px solid ${fg}`}}/><span style={{fontSize:11,color:B.tg}}>{l}: <b style={{color:fg}}>{n}</b></span>
          </div>
        )}
      </div>
    </Card>
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>🔴 High Priority Outstanding</div>
      {urgent.length===0?<div style={{fontSize:13,color:"#1A5C2A",padding:"12px 0"}}>🎉 All high priority tasks are complete.</div>
        :urgent.map(t=><div key={t.id} onClick={()=>onNav("tasks")} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 0",borderBottom:`1px solid ${B.st}`,cursor:"pointer"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:t.pri==="Critical"?B.dk:B.ac,flexShrink:0,marginTop:4}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,fontWeight:600,color:B.tx,lineHeight:1.3}}>{t.desc}</div>
            <div style={{fontSize:10,color:B.tg,marginTop:2}}>Due {fmtDate(t.end)} · {memberObj(t.owner).name.split(" ")[0]}</div>
          </div>
          <Badge label={t.status} small/>
        </div>)
      }
    </Card>
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:14}}>👥 Team Workload</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {TEAM.map(m=>{
          const mt=tasks.filter(t=>t.owner===m.id);const mp=calcPct(mt);const mc=mt.filter(t=>t.status==="Complete").length;
          return<div key={m.id} onClick={()=>onNav("team")} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:B.st,borderRadius:10,cursor:"pointer",border:`1px solid ${B.pl}`}}>
            <Avatar name={m.name} area={m.area} size={34}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:5}}>
                <span style={{fontSize:12,fontWeight:700,color:B.dk}}>{m.name.split(" ")[0]}</span>
                <span style={{fontSize:10,color:B.tg}}>{mc}/{mt.length} · {mp}%</span>
              </div>
              <Pbar pct={mp} h={5} done={mp===100}/>
            </div>
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
    <SecHead title="Final Report" sub="Auto-generated · updates instantly when RACI ✓ is ticked"/>

    {/* Status banner + donut chart side by side */}
    <div style={{background:allDone?B.dk:B.wh,borderRadius:16,padding:"20px 22px",marginBottom:16,border:`1px solid ${allDone?B.lt:B.pl}`,display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
      {/* Donut SVG */}
      <div style={{flexShrink:0}}>
        {(()=>{
          const r=44,cx=52,cy=52,circ=2*Math.PI*r;
          const donePct=done.length/tasks.length;
          const inpPct=inp.length/tasks.length;
          const doneArc=donePct*circ;
          const inpArc=inpPct*circ;
          return<svg width="104" height="104" viewBox="0 0 104 104">
            {/* Track */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={allDone?"rgba(255,255,255,.15)":B.pl} strokeWidth="12"/>
            {/* Not started — subtle */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={allDone?"rgba(255,255,255,.08)":"#FFE0E0"} strokeWidth="12" strokeDasharray={`${(ns.length/tasks.length)*circ} ${circ}`} strokeDashoffset={-doneArc-inpArc} style={{transform:"rotate(-90deg)",transformOrigin:`${cx}px ${cy}px`}}/>
            {/* In progress */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={allDone?"rgba(255,255,255,.3)":"#F0C040"} strokeWidth="12" strokeDasharray={`${inpArc} ${circ}`} strokeDashoffset={-doneArc} style={{transform:"rotate(-90deg)",transformOrigin:`${cx}px ${cy}px`}}/>
            {/* Complete */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={allDone?"#74C69D":"#1A5C2A"} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${doneArc} ${circ}`} style={{transform:"rotate(-90deg)",transformOrigin:`${cx}px ${cy}px`,transition:"stroke-dasharray .5s ease"}}/>
            {/* Centre text */}
            <text x={cx} y={cy-7} textAnchor="middle" fontSize="18" fontWeight="800" fill={allDone?"#fff":B.dk}>{pct}%</text>
            <text x={cx} y={cy+10} textAnchor="middle" fontSize="9" fill={allDone?"rgba(255,255,255,.6)":B.tg}>complete</text>
          </svg>;
        })()}
      </div>
      <div style={{flex:1,minWidth:160}}>
        <div style={{fontSize:16,fontWeight:800,color:allDone?"#fff":B.dk,marginBottom:6,lineHeight:1.2}}>
          {allDone?"🎉 All tasks complete!":pct===0?"Getting started...":pct<50?"Early stages — keep going":"Good progress — keep ticking!"}
        </div>
        <div style={{fontSize:12,color:allDone?B.lt:B.tg,marginBottom:12,lineHeight:1.5}}>
          {allDone?"All 19 tasks marked complete. Report is finalised.":`${done.length} done · ${inp.length} in progress · ${ns.length} not started`}
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[["#C6EFCE","#1A5C2A",done.length,"Complete"],["#FFF3CD","#7A5000",inp.length,"In Progress"],["#FFE0E0","#8B1A1A",ns.length,"Not Started"]].map(([bg,fg,n,lbl])=>
            <div key={lbl} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:bg,border:`1.5px solid ${fg}`,flexShrink:0}}/>
              <span style={{fontSize:11,color:allDone?"rgba(255,255,255,.6)":B.tg}}><b style={{color:allDone?"#fff":fg}}>{n}</b> {lbl}</span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Event summary */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:13}}>📋 Event Summary</div>
      {[["Event","Oxford-Style Debate — Northumbria Construct"],["Date","Monday 28 April 2026"],["Venue","NSU Building – Reds Hall"],["Organiser","Northumbria Construct Student Society"],["Tasks Total",`${tasks.length} tasks`],["Completed",`${done.length} / ${tasks.length}`],["Outstanding",`${ns.length+inp.length} remaining`],["Progress",`${pct}%`]].map(([l,v],i)=>{
        const isGood=l==="Completed"&&done.length>0;
        return<div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${B.st}`}}>
          <span style={{fontSize:12,color:B.tg}}>{l}</span>
          <span style={{fontSize:12,fontWeight:700,color:isGood?"#1A5C2A":l==="Progress"?B.md:B.tx}}>{v}</span>
        </div>;
      })}
    </Card>

    {/* Completed tasks */}
    <Card style={{marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:14,color:B.dk}}>✅ Completed Tasks</div>
        <span style={{fontSize:12,fontWeight:800,color:"#1A5C2A",background:"#C6EFCE",padding:"3px 10px",borderRadius:99}}>{done.length}/{tasks.length}</span>
      </div>
      {done.length===0
        ?<div style={{fontSize:12,color:B.tg,padding:"16px 0",borderTop:`1px solid ${B.st}`}}>No tasks marked complete yet. Go to the <b>RACI</b> tab and tap ✓ to mark tasks done.</div>
        :done.map(t=>{
          const m=memberObj(t.owner);
          return<div key={t.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:`1px solid ${B.st}`}}>
            <div style={{width:22,height:22,borderRadius:6,background:B.dk,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
              <span style={{fontSize:11,color:B.lt,fontWeight:800}}>✓</span>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:B.dk}}>{t.desc}</div>
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

    {/* Outstanding */}
    {(inp.length>0||ns.length>0)&&<Card style={{marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:14,color:B.dk}}>⏳ Outstanding</div>
        <span style={{fontSize:12,fontWeight:800,color:"#8B1A1A",background:"#FFE0E0",padding:"3px 10px",borderRadius:99}}>{inp.length+ns.length} remaining</span>
      </div>
      {[...inp,...ns].map(t=>{
        const m=memberObj(t.owner);
        const ss=STATUS_STYLE[t.status];
        return<div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${B.st}`}}>
          <div style={{width:22,height:22,borderRadius:6,background:ss.bg,border:`1px solid ${ss.bd}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:9,color:ss.fg,fontWeight:700}}>{t.id}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,color:B.tx,fontWeight:600}}>{t.desc}</div>
            <div style={{fontSize:10,color:B.tg,marginTop:1}}>Due {fmtDate(t.end)}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
            <Avatar name={m.name} area={m.area} size={20}/>
          </div>
        </div>;
      })}
    </Card>}

    {/* Team summary */}
    <Card style={{marginBottom:14}}>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:14}}>👥 Team Completion</div>
      {memberSummary.map(m=>(
        <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${B.st}`}}>
          <Avatar name={m.name} area={m.area} size={38}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
              <div>
                <span style={{fontSize:13,fontWeight:700,color:B.dk}}>{m.name.split(" ")[0]}</span>
                <span style={{fontSize:10,color:B.tg,marginLeft:6}}>{m.role.split(" /")[0]}</span>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:m.completion===100?"#1A5C2A":B.tg}}>{m.myDone.length}/{m.myTasks.length}</span>
            </div>
            <Pbar pct={m.completion} h={6} done={m.completion===100}/>
          </div>
          <div style={{fontSize:13,fontWeight:800,color:m.completion===100?"#1A5C2A":B.tg,minWidth:36,textAlign:"right"}}>{m.completion}%</div>
        </div>
      ))}
    </Card>

    {/* Post-event */}
    <Card>
      <div style={{fontWeight:700,fontSize:14,color:B.dk,marginBottom:12}}>📣 Post-Event Checklist</div>
      {tasks.filter(t=>postEventTasks.includes(t.id)).map(t=>{
        const isDone=t.status==="Complete";
        return<div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${B.st}`}}>
          <div style={{width:24,height:24,borderRadius:6,background:isDone?B.dk:"#FFE0E0",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:12,fontWeight:800,color:isDone?B.lt:"#8B1A1A"}}>{isDone?"✓":"○"}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:600,color:isDone?"#1A5C2A":B.tx}}>{t.desc}</div>
            <div style={{fontSize:10,color:B.tg,marginTop:1}}>Due {fmtDate(t.end)} · {memberObj(t.owner).name.split(" ")[0]}</div>
          </div>
          <Badge label={t.status} small/>
        </div>;
      })}
      <div style={{marginTop:14,background:B.st,borderRadius:10,padding:"12px 14px",borderLeft:`3px solid ${B.ac}`}}>
        <div style={{fontWeight:700,fontSize:12,color:B.dk,marginBottom:8}}>Additional post-event actions:</div>
        {["LinkedIn event recap article — Kufre Antia by 1 May","Event photos & speaker quotes on NC LinkedIn","Feedback form responses analysed — Tolulope Idowu by 30 Apr","Thank-you messages to all speakers & Debate Chair","Lessons learned documented for future events — by 3 May"].map((a,i)=>
          <div key={i} style={{display:"flex",gap:8,padding:"4px 0",fontSize:11,color:B.tm}}>
            <span style={{color:B.ac,flexShrink:0,fontWeight:700}}>·</span><span>{a}</span>
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

  return<div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:B.st,minHeight:"100vh",color:B.tx,paddingBottom:isMobile?76:0}}>
    {/* ── HEADER ── */}
    <div style={{background:B.dk,padding:`0 ${isMobile?14:24}px`,display:"flex",alignItems:"center",gap:14,height:58,position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 12px rgba(0,0,0,.25)",borderBottom:`1px solid rgba(116,198,157,.15)`}}>
      {/* Logo */}
      <div style={{width:40,height:40,borderRadius:"50%",background:"#fff",flexShrink:0,overflow:"hidden",border:`2px solid rgba(116,198,157,.4)`}}>
        <img src={LOGO_SRC} alt="Northumbria Construct" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
      </div>
      {/* Title */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{color:"#fff",fontWeight:800,fontSize:isMobile?13:15,lineHeight:1.1,letterSpacing:"-0.2px"}}>Northumbria Construct</div>
        <div style={{color:B.lt,fontSize:10,marginTop:1,opacity:.85}}>{isMobile?"Oxford Debate · 28 Apr":"Oxford-Style Debate Event · 28 April 2026 · NSU Reds Hall"}</div>
      </div>
      {/* Desktop nav */}
      {!isMobile&&<nav style={{display:"flex",gap:2,background:"rgba(255,255,255,.06)",borderRadius:12,padding:3}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"6px 13px",borderRadius:9,border:"none",cursor:"pointer",
            fontSize:11,fontWeight:700,letterSpacing:.2,
            background:tab===t.id?"rgba(255,255,255,.18)":"transparent",
            color:tab===t.id?"#fff":B.lt,
            transition:"all .15s",
          }}>{t.icon} {t.label}</button>
        ))}
      </nav>}
      {/* Export */}
      <button onClick={exportCSV} style={{padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:700,background:"rgba(116,198,157,.15)",color:B.lt,border:"1px solid rgba(116,198,157,.25)",cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>⬇ CSV</button>
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

    {isMobile&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:B.wh,borderTop:`1px solid ${B.pl}`,display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom)",boxShadow:"0 -2px 12px rgba(0,0,0,.08)"}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,border:"none",background:"transparent",padding:"9px 2px 7px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:0,position:"relative"}}>
        {tab===t.id&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:2.5,borderRadius:"0 0 3px 3px",background:B.ac}}/>}
        <span style={{fontSize:17,lineHeight:1}}>{t.icon}</span>
        <span style={{fontSize:9,fontWeight:700,color:tab===t.id?B.ac:B.tg,letterSpacing:.3}}>{t.label}</span>
      </button>)}
    </div>}

    <Toast msg={toast}/>
  </div>;
}
