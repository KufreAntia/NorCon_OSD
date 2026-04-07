import { useState, useEffect, useCallback } from "react";

// ── Brand ─────────────────────────────────────────────────────────────────────
const B = {
  dk:"#1A3C2E", md:"#2D6A4F", ac:"#40916C", lt:"#74C69D",
  pl:"#D8F3DC", st:"#EBF7EE", tx:"#1C2B22", tm:"#3A5242",
  tg:"#607466", wh:"#FFFFFF",
};
const AREA_COLOR = {
  Strategy:"#1A3C2E", Operations:"#2D6A4F",
  Training:"#52B788", Comms:"#40916C", Media:"#74C69D",
};
const STATUS_STYLE = {
  "Complete":    { bg:"#C6EFCE", fg:"#1A5C2A", bd:"#74C69D" },
  "In Progress": { bg:"#FFF3CD", fg:"#7A5000", bd:"#F0C040" },
  "Not Started": { bg:"#FFE0E0", fg:"#8B1A1A", bd:"#E08080" },
};
const PRI_STYLE = {
  Critical:{ bg:"#1A3C2E", fg:"#fff" },
  High:    { bg:"#40916C", fg:"#fff" },
  Medium:  { bg:"#D8F3DC", fg:"#2D6A4F" },
  Low:     { bg:"#f0f0f0", fg:"#555" },
};
const RACI_CYCLE = ["","R","A","C","I"];
const RACI_STYLE = {
  R:{ bg:"#1A3C2E", fg:"#fff" }, A:{ bg:"#40916C", fg:"#fff" },
  C:{ bg:"#D8F3DC", fg:"#1A3C2E" }, I:{ bg:"#e4e4e4", fg:"#555" },
  "":{ bg:"transparent", fg:"#bbb" },
};

// ── Data ──────────────────────────────────────────────────────────────────────
const TEAM = [
  { id:"callum",     name:"Callum O'Connor",    role:"President / CEO",              area:"Strategy",   resp:"Strategic oversight, institutional alignment, internal coordination" },
  { id:"sandhya",    name:"Sandhya Chimata",     role:"Vice President / COO",         area:"Operations", resp:"Operational coordination and delivery assurance" },
  { id:"kufre",      name:"Kufre Antia",         role:"Training & Dev Manager / CTO", area:"Training",   resp:"Debate structure, speaker briefing, academic rigour, LinkedIn content capture, Documentation" },
  { id:"tolulope",   name:"Tolulope Idowu",      role:"Project Manager",              area:"Comms",      resp:"Promotion, NSU approvals, Budget oversight, partnerships with depts & societies" },
  { id:"uchechukwu", name:"Uchechukwu Maduwuba", role:"Event / Media Manager",        area:"Media",      resp:"Audio Visuals, Media, Venue and NSU Logistics" },
];

const DEFAULT_TASKS = [
  { id:1,  desc:"Confirm event date & format",        owner:"callum",     start:"2026-04-06", end:"2026-04-06", status:"Complete",    pri:"Critical", deps:"",    notes:"Event fixed for 28 April",                                                               pct:100 },
  { id:2,  desc:"Finalise debate motion",             owner:"kufre",      start:"2026-04-06", end:"2026-04-06", status:"Not Started", pri:"High",     deps:"1",   notes:"Single motion only",                                                                     pct:0   },
  { id:3,  desc:"Submit Reds Hall booking",           owner:"tolulope",   start:"2026-04-06", end:"2026-04-07", status:"Not Started", pri:"High",     deps:"1",   notes:"NSU approval required",                                                                  pct:0   },
  { id:4,  desc:"Confirm Debate Chair",               owner:"callum",     start:"2026-04-07", end:"2026-04-08", status:"Not Started", pri:"High",     deps:"3",   notes:"Kelechi Ayanso, Barry Gledson, Michelle Littlemore, Pablo Martinez",                    pct:0   },
  { id:5,  desc:"Open call for speakers",             owner:"tolulope",   start:"2026-04-08", end:"2026-04-09", status:"Not Started", pri:"High",     deps:"2,4", notes:"Prop & Opp",                                                                             pct:0   },
  { id:6,  desc:"Confirm speakers + reserves",        owner:"kufre",      start:"2026-04-09", end:"2026-04-11", status:"Not Started", pri:"High",     deps:"5",   notes:"Laye, Kufre, Lucas, Ikechukwu, Vemula, Maria",                                          pct:0   },
  { id:7,  desc:"Issue speaker briefing pack",        owner:"kufre",      start:"2026-04-11", end:"2026-04-11", status:"Not Started", pri:"Medium",   deps:"6",   notes:"Oxford rules",                                                                           pct:0   },
  { id:8,  desc:"Launch promotion",                   owner:"tolulope",   start:"2026-04-12", end:"2026-04-23", status:"Not Started", pri:"High",     deps:"2,3", notes:"LinkedIn + reps",                                                                        pct:0   },
  { id:9,  desc:"Open registration form",             owner:"tolulope",   start:"2026-04-12", end:"2026-04-27", status:"Not Started", pri:"Medium",   deps:"8",   notes:"MS Forms",                                                                               pct:0   },
  { id:10, desc:"Engage academic reps & societies",   owner:"tolulope",   start:"2026-04-14", end:"2026-04-17", status:"Not Started", pri:"Medium",   deps:"8",   notes:"Dept amplification",                                                                     pct:0   },
  { id:11, desc:"Prepare debate run-of-show",         owner:"callum",     start:"2026-04-14", end:"2026-04-15", status:"Not Started", pri:"Medium",   deps:"4,6", notes:"Chair script",                                                                           pct:0   },
  { id:12, desc:"Prepare voting forms (QR)",          owner:"kufre",      start:"2026-04-16", end:"2026-04-18", status:"Not Started", pri:"Medium",   deps:"2",   notes:"Pre & post vote",                                                                        pct:0   },
  { id:13, desc:"Confirm AV & room setup",            owner:"uchechukwu", start:"2026-04-18", end:"2026-04-21", status:"Not Started", pri:"High",     deps:"3",   notes:"Mics, projector",                                                                        pct:0   },
  { id:14, desc:"Promotion reminder push",            owner:"tolulope",   start:"2026-04-21", end:"2026-04-22", status:"Not Started", pri:"Medium",   deps:"8,9", notes:"Attendance boost",                                                                       pct:0   },
  { id:15, desc:"Speaker reconfirmation",             owner:"kufre",      start:"2026-04-23", end:"2026-04-24", status:"Not Started", pri:"High",     deps:"6",   notes:"No-shows risk",                                                                          pct:0   },
  { id:16, desc:"Final logistics walkthrough",        owner:"uchechukwu", start:"2026-04-27", end:"2026-04-27", status:"Not Started", pri:"High",     deps:"13",  notes:"Go / No-go check",                                                                       pct:0   },
  { id:17, desc:"DELIVER EVENT",                      owner:"callum",     start:"2026-04-28", end:"2026-04-28", status:"Not Started", pri:"Critical", deps:"16",  notes:"Event day — Reds Hall",                                                                  pct:0   },
  { id:18, desc:"Publish LinkedIn article",           owner:"kufre",      start:"2026-04-29", end:"2026-05-01", status:"Not Started", pri:"Medium",   deps:"17",  notes:"Post-event output",                                                                      pct:0   },
  { id:19, desc:"Capture feedback & lessons learned", owner:"tolulope",   start:"2026-04-29", end:"2026-05-03", status:"Not Started", pri:"Medium",   deps:"17",  notes:"Repeatability",                                                                          pct:0   },
];

const DEFAULT_RACI = {
  1:{callum:"A",sandhya:"C",kufre:"I",tolulope:"R",uchechukwu:"I"},
  2:{callum:"A",sandhya:"C",kufre:"R",tolulope:"I",uchechukwu:"I"},
  3:{callum:"C",sandhya:"I",kufre:"I",tolulope:"R",uchechukwu:"A"},
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
const GANTT_START = new Date("2026-04-06T12:00:00");
const GANTT_DAYS  = 33;

function ganttOffset(d) { return Math.max(0, Math.round((new Date(d+"T12:00:00") - GANTT_START) / 86400000)); }
function ganttWidth(s,e) { return Math.max(1, ganttOffset(e) - ganttOffset(s) + 1); }
function fmtDate(d) { if(!d) return "—"; return new Date(d+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"}); }
function memberObj(id) { return TEAM.find(t=>t.id===id) || {name:id, area:"", role:""}; }
function initials(n) { return n.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase(); }
function calcPct(tasks) { return tasks.length ? Math.round(tasks.reduce((s,t)=>s+t.pct,0)/tasks.length) : 0; }
function loadState(key, def) {
  try { const s=localStorage.getItem(key); return s ? JSON.parse(s) : JSON.parse(JSON.stringify(def)); }
  catch { return JSON.parse(JSON.stringify(def)); }
}

// ── Responsive hook ───────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ── Shared primitives ─────────────────────────────────────────────────────────
function Avatar({ name, area, size=32 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:AREA_COLOR[area]||B.ac,
      flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ fontSize:size*.38, fontWeight:700, color:"#fff" }}>{initials(name)}</span>
    </div>
  );
}

function Badge({ label }) {
  const s = STATUS_STYLE[label] || { bg:B.pl, fg:B.md, bd:"transparent" };
  return (
    <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11,
      fontWeight:600, background:s.bg, color:s.fg, border:`1px solid ${s.bd}`, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

function PriBadge({ label }) {
  const s = PRI_STYLE[label] || PRI_STYLE.Low;
  return (
    <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11,
      fontWeight:700, background:s.bg, color:s.fg, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

function Pbar({ pct, h=6, done=false }) {
  return (
    <div style={{ height:h, borderRadius:99, background:B.pl, overflow:"hidden", flex:1 }}>
      <div style={{ height:"100%", width:`${pct}%`, borderRadius:99, transition:"width .4s",
        background: done ? "#1A5C2A" : B.ac }} />
    </div>
  );
}

function Card({ children, style:s }) {
  return (
    <div style={{ background:B.wh, borderRadius:14, border:`1px solid ${B.pl}`,
      padding:"16px 18px", ...s }}>
      {children}
    </div>
  );
}

function SectionHead({ title, sub }) {
  return (
    <div style={{ marginBottom:16 }}>
      <h2 style={{ fontSize:18, fontWeight:700, color:B.dk, margin:0 }}>{title}</h2>
      {sub && <p style={{ color:B.tg, fontSize:12, margin:"3px 0 0", lineHeight:1.4 }}>{sub}</p>}
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)",
      background:B.dk, color:"#fff", padding:"10px 20px", borderRadius:99,
      fontSize:13, fontWeight:600, zIndex:999, whiteSpace:"nowrap",
      boxShadow:"0 4px 20px rgba(0,0,0,.25)" }}>
      {msg}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ onClose, children }) {
  useEffect(() => {
    const h = e => { if (e.key==="Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(26,60,46,.55)",
        zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center",
        padding:"0" }}>
      <div style={{ background:B.wh, borderRadius:"18px 18px 0 0", padding:"24px 20px 32px",
        width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto" }}>
        {/* Drag handle */}
        <div style={{ width:40, height:4, borderRadius:99, background:"#ddd", margin:"0 auto 18px" }} />
        {children}
      </div>
    </div>
  );
}

// ── Task modal (sheet style) ──────────────────────────────────────────────────
function TaskModal({ task, onSave, onDelete, onClose }) {
  const isNew = !task.id;
  const [f, setF] = useState({
    desc:task.desc||"", start:task.start||"2026-04-06", end:task.end||"2026-04-07",
    status:task.status||"Not Started", pri:task.pri||"High",
    owner:task.owner||TEAM[0].id, pct:task.pct??0, deps:task.deps||"", notes:task.notes||"",
  });
  const upd = (k,v) => setF(x=>({...x,[k]:v}));

  function submit() {
    if (!f.desc.trim()) { alert("Please enter a task description."); return; }
    let pct = Math.min(100, Math.max(0, parseInt(f.pct)||0));
    if (f.status==="Complete") pct = 100;
    onSave({ ...task, ...f, pct });
  }

  const lbl = { display:"block", fontSize:11, fontWeight:700, color:B.tg,
    marginBottom:5, textTransform:"uppercase", letterSpacing:.5 };
  const inp = { width:"100%", padding:"10px 12px", border:`1.5px solid ${B.pl}`,
    borderRadius:10, color:B.tx, background:B.st, fontSize:14,
    WebkitAppearance:"none", boxSizing:"border-box" };

  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontSize:16, fontWeight:700, color:B.dk, margin:"0 0 18px" }}>
        {isNew ? "+ Add Task" : `Edit Task #${task.id}`}
      </h3>
      <div style={{ marginBottom:14 }}>
        <label style={lbl}>Task Description</label>
        <input style={inp} value={f.desc} onChange={e=>upd("desc",e.target.value)} placeholder="Describe the task…"/>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <div><label style={lbl}>Start</label><input style={inp} type="date" value={f.start} onChange={e=>upd("start",e.target.value)}/></div>
        <div><label style={lbl}>End</label><input style={inp} type="date" value={f.end} onChange={e=>upd("end",e.target.value)}/></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <div>
          <label style={lbl}>Status</label>
          <select style={inp} value={f.status} onChange={e=>upd("status",e.target.value)}>
            {["Not Started","In Progress","Complete"].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Priority</label>
          <select style={inp} value={f.pri} onChange={e=>upd("pri",e.target.value)}>
            {["Low","Medium","High","Critical"].map(p=><option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <div>
          <label style={lbl}>Owner</label>
          <select style={inp} value={f.owner} onChange={e=>upd("owner",e.target.value)}>
            {TEAM.map(m=><option key={m.id} value={m.id}>{m.name.split(" ")[0]}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>% Done</label>
          <input style={inp} type="number" min={0} max={100} value={f.pct} onChange={e=>upd("pct",e.target.value)}/>
        </div>
      </div>
      <div style={{ marginBottom:14 }}>
        <label style={lbl}>Notes</label>
        <textarea style={{...inp, height:70, resize:"vertical"}} value={f.notes} onChange={e=>upd("notes",e.target.value)}/>
      </div>
      <button onClick={submit} style={{ width:"100%", background:B.dk, color:"#fff",
        padding:"14px", borderRadius:12, fontSize:15, fontWeight:700, border:"none",
        cursor:"pointer", marginBottom:10 }}>
        {isNew ? "Add Task" : "Save Changes"}
      </button>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onClose} style={{ flex:1, background:B.pl, color:B.md,
          padding:"12px", borderRadius:12, fontSize:14, fontWeight:600, border:"none", cursor:"pointer" }}>
          Cancel
        </button>
        {!isNew && task.id > 1 && (
          <button onClick={()=>onDelete(task.id)} style={{ flex:1, background:"#FFE0E0", color:"#8B1A1A",
            padding:"12px", borderRadius:12, fontSize:14, fontWeight:600, border:"none", cursor:"pointer" }}>
            Delete
          </button>
        )}
      </div>
    </Modal>
  );
}

// ════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════
function Dashboard({ tasks, onNav, isMobile }) {
  const done  = tasks.filter(t=>t.status==="Complete").length;
  const inp   = tasks.filter(t=>t.status==="In Progress").length;
  const ns    = tasks.filter(t=>t.status==="Not Started").length;
  const pct   = calcPct(tasks);
  const dLeft = Math.max(0, Math.round((new Date("2026-04-28")-new Date())/86400000));
  const urgent = tasks.filter(t=>t.status!=="Complete"&&(t.pri==="Critical"||t.pri==="High")).slice(0,5);

  return (
    <div>
      {/* Title + countdown */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
        marginBottom:16, gap:12 }}>
        <div>
          <h2 style={{ fontSize:isMobile?17:20, fontWeight:700, color:B.dk, margin:0 }}>Project Dashboard</h2>
          <p style={{ color:B.tg, fontSize:12, margin:"3px 0 0", lineHeight:1.4 }}>
            Oxford Debate · NSU Reds Hall · 28 April 2026
          </p>
        </div>
        <div style={{ background:B.dk, color:B.lt, padding:"10px 16px", borderRadius:12,
          textAlign:"center", flexShrink:0 }}>
          <div style={{ fontSize:24, fontWeight:700, lineHeight:1 }}>{dLeft}</div>
          <div style={{ fontSize:10, marginTop:2 }}>days left</div>
        </div>
      </div>

      {/* KPI grid — 2×2 on mobile, 4×1 on desktop */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
        {[
          { l:"Progress",    v:`${pct}%`, s:`${tasks.length} tasks`, c:B.md },
          { l:"Complete",    v:done,      s:"finished",              c:"#1A5C2A" },
          { l:"In Progress", v:inp,       s:"active",                c:"#7A5000" },
          { l:"Not Started", v:ns,        s:"pending",               c:"#8B1A1A" },
        ].map((k,i) => (
          <Card key={i} style={{ padding:"14px 16px" }}>
            <div style={{ fontSize:10, color:B.tg, fontWeight:600, textTransform:"uppercase",
              letterSpacing:.5, marginBottom:5 }}>{k.l}</div>
            <div style={{ fontSize:26, fontWeight:700, color:k.c, lineHeight:1 }}>{k.v}</div>
            <div style={{ fontSize:10, color:B.tg, marginTop:3 }}>{k.s}</div>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <Card style={{ marginBottom:14 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
          <span style={{ fontWeight:700, fontSize:13, color:B.dk }}>Overall Completion</span>
          <span style={{ fontWeight:700, color:B.md }}>{pct}%</span>
        </div>
        <Pbar pct={pct} h={10} done={pct===100} />
        <div style={{ display:"flex", gap:14, marginTop:10, flexWrap:"wrap" }}>
          {[["Complete",done,"#C6EFCE","#1A5C2A"],["In Progress",inp,"#FFF3CD","#7A5000"],["Not Started",ns,"#FFE0E0","#8B1A1A"]].map(([l,n,bg,fg])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:10, height:10, borderRadius:3, background:bg, border:`1px solid ${fg}` }}/>
              <span style={{ fontSize:11, color:B.tg }}>{l}: <b style={{ color:fg }}>{n}</b></span>
            </div>
          ))}
        </div>
      </Card>

      {/* Urgent tasks */}
      <Card style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, fontSize:14, color:B.dk, marginBottom:12 }}>🔴 High Priority</div>
        {urgent.length === 0
          ? <div style={{ fontSize:13, color:"#1A5C2A", textAlign:"center", padding:16 }}>🎉 All high priority tasks done!</div>
          : urgent.map(t => (
            <div key={t.id} onClick={()=>onNav("tasks")}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0",
                borderBottom:`1px solid ${B.st}`, cursor:"pointer" }}>
              <div style={{ width:7, height:7, borderRadius:"50%",
                background:t.pri==="Critical"?B.dk:B.ac, flexShrink:0 }}/>
              <div style={{ flex:1, fontSize:13, lineHeight:1.3 }}>{t.desc}</div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3, flexShrink:0 }}>
                <Badge label={t.status}/>
                <span style={{ fontSize:10, color:B.tg }}>{fmtDate(t.end)}</span>
              </div>
            </div>
          ))
        }
      </Card>

      {/* Event info */}
      <Card style={{ marginBottom:14 }}>
        <div style={{ fontWeight:700, fontSize:14, color:B.dk, marginBottom:12 }}>📋 Event Details</div>
        {[["Date","28 April 2026"],["Venue","NSU Building – Reds Hall"],["Format","Oxford-Style Debate"],
          ["Duration","75–90 minutes"],["Audience","~30 students"],["Target","25+ attendance"],
          ["Voting","QR code – MS Forms"],["Motion","Lean vs BIM (TBC)"]].map(([l,v])=>(
          <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"6px 0", borderBottom:`1px solid ${B.st}` }}>
            <span style={{ fontSize:12, color:B.tg }}>{l}</span>
            <span style={{ fontSize:12, fontWeight:600, color:B.tx, textAlign:"right", maxWidth:"60%" }}>{v}</span>
          </div>
        ))}
      </Card>

      {/* Team workload — scrollable row on mobile */}
      <Card>
        <div style={{ fontWeight:700, fontSize:14, color:B.dk, marginBottom:12 }}>👥 Team Workload</div>
        <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:4 }}>
          {TEAM.map(m => {
            const mt = tasks.filter(t=>t.owner===m.id);
            const mp = calcPct(mt);
            return (
              <div key={m.id} style={{ textAlign:"center", padding:"12px 10px", background:B.st,
                borderRadius:12, minWidth:90, flexShrink:0 }} onClick={()=>onNav("team")}>
                <Avatar name={m.name} area={m.area} size={36}/>
                <div style={{ fontSize:11, fontWeight:600, color:B.dk, marginTop:7 }}>{m.name.split(" ")[0]}</div>
                <div style={{ fontSize:9, color:B.tg, marginTop:2 }}>{mt.length} tasks</div>
                <Pbar pct={mp} h={4} style={{ marginTop:6 }}/>
                <div style={{ fontSize:10, color:B.md, fontWeight:600, marginTop:3 }}>{mp}%</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// TASK TRACKER — card list on mobile
// ════════════════════════════════════════════════════════════
function TaskTracker({ tasks, setTasks, setToast, isMobile }) {
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("All");

  const visible = filter==="All" ? tasks : tasks.filter(t=>t.status===filter);

  function handleSave(saved) {
    if (!saved.id) {
      const nid = tasks.length ? Math.max(...tasks.map(t=>t.id))+1 : 1;
      setTasks(ts=>[...ts,{...saved,id:nid}]);
      setToast("✓ Task added");
    } else {
      setTasks(ts=>ts.map(t=>t.id===saved.id?saved:t));
      setToast(`✓ Task #${saved.id} updated`);
    }
    setModal(null);
  }
  function handleDelete(id) {
    if (!window.confirm(`Delete task #${id}?`)) return;
    setTasks(ts=>ts.filter(t=>t.id!==id));
    setModal(null);
    setToast("Task deleted");
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        marginBottom:14, gap:10 }}>
        <SectionHead title="Tasks" sub="Tap any card to edit" />
        <button onClick={()=>setModal({desc:"",start:"2026-04-06",end:"2026-04-07",
          status:"Not Started",pri:"High",owner:TEAM[0].id,pct:0,deps:"",notes:""})}
          style={{ background:B.dk, color:"#fff", padding:"10px 16px", borderRadius:10,
            fontSize:13, fontWeight:700, border:"none", cursor:"pointer", flexShrink:0 }}>
          + Add
        </button>
      </div>

      {/* Filter pills */}
      <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", paddingBottom:2 }}>
        {["All","Complete","In Progress","Not Started"].map(s => (
          <button key={s} onClick={()=>setFilter(s)} style={{
            padding:"7px 14px", borderRadius:99, border:`1.5px solid ${filter===s?B.ac:B.pl}`,
            background:filter===s?B.pl:"transparent", color:filter===s?B.md:B.tg,
            fontSize:12, fontWeight:600, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap"
          }}>{s}</button>
        ))}
      </div>

      {/* Task cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {visible.map(t => {
          const m = memberObj(t.owner);
          const isMile = t.id === 17;
          return (
            <div key={t.id} onClick={()=>setModal(t)}
              style={{ background:B.wh, borderRadius:14, border:`1px solid ${B.pl}`,
                padding:"14px 16px", cursor:"pointer",
                borderLeft:`4px solid ${t.pri==="Critical"?B.dk:t.pri==="High"?B.ac:"transparent"}` }}>
              {/* Row 1: ID + desc + edit icon */}
              <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:8 }}>
                <span style={{ fontSize:11, color:B.tg, fontWeight:600, minWidth:20, paddingTop:2 }}>#{t.id}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:isMile?700:600, color:isMile?B.dk:B.tx, lineHeight:1.3 }}>
                    {isMile ? "⭐ " : ""}{t.desc}
                  </div>
                  {t.notes && <div style={{ fontSize:11, color:B.tg, marginTop:3, lineHeight:1.4 }}>{t.notes}</div>}
                </div>
                <span style={{ color:B.ac, fontSize:16, flexShrink:0 }}>›</span>
              </div>
              {/* Row 2: owner + dates */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <Avatar name={m.name} area={m.area} size={22}/>
                <span style={{ fontSize:12, color:B.tm }}>{m.name.split(" ")[0]}</span>
                <span style={{ fontSize:11, color:B.tg, marginLeft:"auto" }}>
                  {fmtDate(t.start)} → {fmtDate(t.end)}
                </span>
              </div>
              {/* Row 3: badges + progress */}
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <Badge label={t.status}/>
                <PriBadge label={t.pri}/>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginLeft:"auto" }}>
                  <Pbar pct={t.pct} done={t.pct===100} />
                  <span style={{ fontSize:11, color:B.tg, minWidth:30 }}>{t.pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visible.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:B.tg, fontSize:14 }}>
          No tasks match this filter
        </div>
      )}

      {modal !== null && (
        <TaskModal task={modal} onSave={handleSave} onDelete={handleDelete} onClose={()=>setModal(null)}/>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// GANTT — visual on desktop, list on mobile
// ════════════════════════════════════════════════════════════
function GanttChart({ tasks, onEdit, isMobile }) {
  const barCol = t => t.id===17?"#FFD700":t.status==="Complete"?B.dk:t.status==="In Progress"?B.ac:B.md;

  // Mobile: timeline list view
  if (isMobile) {
    return (
      <div>
        <SectionHead title="Gantt / Timeline" sub="6 Apr – 3 May 2026 · Tap a task to edit"/>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {tasks.map(t => {
            const m = memberObj(t.owner);
            const bc = barCol(t);
            const isMile = t.id === 17;
            const gl = ganttOffset(t.start);
            const gw = ganttWidth(t.start, t.end);
            const barPct = Math.min(100, Math.round((gw / GANTT_DAYS) * 100));
            const barLeft = Math.min(85, Math.round((gl / GANTT_DAYS) * 100));
            return (
              <div key={t.id} onClick={()=>onEdit(t)}
                style={{ background:B.wh, borderRadius:12, border:`1px solid ${B.pl}`,
                  padding:"12px 14px", cursor:"pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:10, color:B.tg, minWidth:20 }}>#{t.id}</span>
                  <span style={{ flex:1, fontSize:13, fontWeight:isMile?700:500,
                    color:isMile?B.dk:B.tx }}>{isMile?"⭐ ":""}{t.desc}</span>
                  <Badge label={t.status}/>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                  <Avatar name={m.name} area={m.area} size={18}/>
                  <span style={{ fontSize:11, color:B.tg }}>{m.name.split(" ")[0]}</span>
                  <span style={{ fontSize:11, color:B.tg, marginLeft:"auto" }}>
                    {fmtDate(t.start)} → {fmtDate(t.end)}
                  </span>
                </div>
                {/* Mini bar */}
                <div style={{ height:8, borderRadius:99, background:B.st, overflow:"hidden", position:"relative" }}>
                  <div style={{ position:"absolute", left:`${barLeft}%`, width:`${Math.max(4, barPct)}%`,
                    height:"100%", background:bc, borderRadius:99 }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                  <span style={{ fontSize:9, color:B.tg }}>6 Apr</span>
                  <span style={{ fontSize:9, color:isMile?"#B8860B":B.tg, fontWeight:isMile?700:400 }}>28 Apr ⭐</span>
                  <span style={{ fontSize:9, color:B.tg }}>3 May</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop: full Gantt table
  const days = Array.from({length:GANTT_DAYS}, (_,i) => {
    const d = new Date("2026-04-06T12:00:00"); d.setDate(d.getDate()+i);
    const isW = d.getDay()===0||d.getDay()===6;
    const isMile = i===22;
    return { i, isW, isMile, lbl:isMile?"28⭐":d.getMonth()===4?`${d.getDate()}/5`:String(d.getDate()) };
  });

  return (
    <div>
      <SectionHead title="Gantt Chart" sub="6 April – 8 May 2026 · ⭐ = Event Day · Click task name to edit"/>
      <div style={{ overflowX:"auto", borderRadius:12, border:`1px solid ${B.pl}` }}>
        <table style={{ borderCollapse:"collapse", minWidth:900, width:"100%", tableLayout:"fixed" }}>
          <colgroup>
            <col style={{width:28}}/><col style={{width:200}}/><col style={{width:80}}/>
            {days.map((_,i)=><col key={i} style={{width:`${100/GANTT_DAYS}%`}}/>)}
          </colgroup>
          <thead>
            <tr>
              <th colSpan={3} style={{background:B.dk,padding:"8px 12px",textAlign:"left",color:B.pl,fontSize:10,fontWeight:700}}>Task</th>
              <th colSpan={GANTT_DAYS} style={{background:B.dk,padding:"8px 6px",textAlign:"center",color:B.lt,fontSize:10,fontWeight:700}}>April 2026 → May 2026</th>
            </tr>
            <tr style={{background:B.dk}}>
              {["#","Task","Owner"].map(h=><th key={h} style={{padding:"6px 10px",color:B.pl,fontSize:10,fontWeight:700,textAlign:"left"}}>{h}</th>)}
              {days.map(d=>(
                <th key={d.i} style={{padding:"4px 1px",textAlign:"center",fontSize:d.isMile?9:8,
                  fontWeight:d.isMile?700:600,color:d.isW?"rgba(116,198,157,.7)":d.isMile?"#FFD700":B.pl,
                  background:d.isW?"rgba(0,0,0,.18)":B.dk,
                  borderLeft:d.isMile?"2px solid rgba(255,215,0,.4)":undefined}}>{d.lbl}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((t,ri)=>{
              const m=memberObj(t.owner);
              const gl=ganttOffset(t.start);
              const gw=ganttWidth(t.start,t.end);
              const bc=barCol(t);
              const bg=ri%2===0?B.wh:B.st;
              return (
                <tr key={t.id} style={{background:bg}}>
                  <td style={{padding:"5px 10px",fontSize:10,color:B.tg,fontWeight:600}}>{t.id}</td>
                  <td style={{padding:"5px 10px",cursor:"pointer"}} onClick={()=>onEdit(t)}>
                    <div style={{fontSize:11,fontWeight:t.id===17?700:400,color:t.id===17?B.dk:B.tx,
                      whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                      {t.id===17?"⭐ ":""}{t.desc}
                    </div>
                    <div style={{fontSize:9,color:B.tg}}>{fmtDate(t.start)} → {fmtDate(t.end)}</div>
                  </td>
                  <td style={{padding:"5px 10px",fontSize:10,color:B.tm,whiteSpace:"nowrap"}}>{m.name.split(" ")[0]}</td>
                  {days.map(d=>{
                    const inBar=d.i>=gl&&d.i<gl+gw;
                    const isStart=inBar&&d.i===gl;
                    const isEnd=inBar&&d.i===gl+gw-1;
                    return (
                      <td key={d.i} style={{padding:"4px 1px",height:32,textAlign:"center",
                        background:inBar?bc:d.isW?"rgba(116,198,157,.08)":"transparent",
                        borderLeft:d.isMile?"1px dashed rgba(255,215,0,.35)":undefined,
                        borderRadius:isStart?"4px 0 0 4px":isEnd?"0 4px 4px 0":undefined}}>
                        {inBar&&t.id===17&&d.i===gl&&<span style={{fontSize:12}}>⭐</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",gap:16,marginTop:10,flexWrap:"wrap"}}>
        {[["Planned",B.md],["In Progress",B.ac],["Complete",B.dk],["Milestone","#FFD700"],["Weekend","rgba(116,198,157,.15)"]].map(([l,c])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:14,height:9,borderRadius:2,background:c,border:"1px solid rgba(0,0,0,.1)"}}/>
            <span style={{fontSize:10,color:B.tg}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// RACI — horizontally scrollable on mobile
// ════════════════════════════════════════════════════════════
function RaciMatrix({ tasks, raci, setRaci, isMobile }) {
  function cycle(taskId, memberId) {
    setRaci(prev => {
      const row = prev[taskId]||{};
      const cur = row[memberId]||"";
      const next = RACI_CYCLE[(RACI_CYCLE.indexOf(cur)+1)%RACI_CYCLE.length];
      return {...prev,[taskId]:{...row,[memberId]:next}};
    });
  }
  const warns = tasks.filter(t=>{const r=raci[t.id]||{};const v=Object.values(r);return !v.includes("R")||!v.includes("A");});

  return (
    <div>
      <SectionHead title="RACI Matrix" sub="Tap any cell to cycle R → A → C → I → empty"/>
      
      {/* Legend pills */}
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {[["R","Responsible","#1A3C2E","#fff"],["A","Accountable","#40916C","#fff"],
          ["C","Consulted","#D8F3DC","#1A3C2E"],["I","Informed","#e4e4e4","#555"]].map(([v,l,bg,fg])=>(
          <div key={v} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",
            background:B.wh,borderRadius:10,border:`1px solid ${B.pl}`}}>
            <div style={{width:24,height:24,borderRadius:6,background:bg,display:"flex",
              alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:fg,flexShrink:0}}>{v}</div>
            <div style={{fontSize:11,color:B.dk,fontWeight:600}}>{l}</div>
          </div>
        ))}
      </div>

      {warns.length>0&&(
        <div style={{background:"#FFF3CD",border:"1px solid #F0C040",borderRadius:10,
          padding:"10px 14px",marginBottom:12,fontSize:12,color:"#7A5000"}}>
          ⚠ {warns.length} task{warns.length>1?"s":""} missing R or A: {warns.map(t=>`#${t.id}`).join(", ")}
        </div>
      )}

      {/* Scrollable table */}
      <div style={{overflowX:"auto",background:B.wh,borderRadius:12,border:`1px solid ${B.pl}`,
        WebkitOverflowScrolling:"touch"}}>
        <table style={{borderCollapse:"collapse",minWidth:isMobile?560:700,width:"100%"}}>
          <thead>
            <tr style={{background:B.dk}}>
              <th style={{padding:"10px 10px",textAlign:"left",color:B.pl,fontSize:10,fontWeight:700,width:32,position:"sticky",left:0,background:B.dk,zIndex:1}}>#</th>
              <th style={{padding:"10px 10px",textAlign:"left",color:B.pl,fontSize:10,fontWeight:700,minWidth:isMobile?120:180,position:"sticky",left:32,background:B.dk,zIndex:1}}>Task</th>
              {TEAM.map(m=>(
                <th key={m.id} style={{padding:"10px 6px",textAlign:"center",color:B.pl,fontSize:10,fontWeight:700,minWidth:60}}>
                  <Avatar name={m.name} area={m.area} size={24}/>
                  <div style={{marginTop:3,fontSize:9}}>{m.name.split(" ")[0]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((t,ri)=>{
              const row=raci[t.id]||{};
              const hasR=Object.values(row).includes("R");
              const hasA=Object.values(row).includes("A");
              return (
                <tr key={t.id} style={{background:ri%2===0?B.wh:B.st}}>
                  <td style={{padding:"8px 10px",fontSize:10,color:B.tg,fontWeight:600,
                    position:"sticky",left:0,background:ri%2===0?B.wh:B.st,zIndex:1}}>{t.id}</td>
                  <td style={{padding:"8px 10px",position:"sticky",left:32,background:ri%2===0?B.wh:B.st,zIndex:1}}>
                    <div style={{fontSize:11,color:B.tx,lineHeight:1.3,maxWidth:isMobile?120:180,
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.desc}</div>
                    {(!hasR||!hasA)&&<div style={{fontSize:9,color:"#7A5000"}}>⚠ Missing {!hasR?"R":""}{!hasA&&!hasR?" & ":""}{!hasA?"A":""}</div>}
                  </td>
                  {TEAM.map(m=>{
                    const v=row[m.id]||"";
                    const rs=RACI_STYLE[v]||RACI_STYLE[""];
                    return (
                      <td key={m.id} style={{padding:"5px 6px",textAlign:"center"}}>
                        <div onClick={()=>cycle(t.id,m.id)}
                          style={{width:36,height:36,borderRadius:8,margin:"0 auto",
                            background:rs.bg,color:rs.fg,display:"flex",alignItems:"center",
                            justifyContent:"center",fontSize:12,fontWeight:700,cursor:"pointer",
                            border:v?"none":"1.5px dashed #ddd",userSelect:"none",
                            WebkitTapHighlightColor:"transparent"}}>
                          {v||"+"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{fontSize:11,color:B.tg,marginTop:8}}>
        Scroll right to see all team members · Tap cells to update
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// TEAM
// ════════════════════════════════════════════════════════════
function Team({ tasks, isMobile }) {
  const coreRoles = [
    {role:"Project Manager",         resp:"Overall coordination; liaison with NSU",                                       who:"Tolulope Idowu",          status:"Assigned"},
    {role:"Debate Chair",            resp:"Neutral facilitation; Oxford rules; timekeeping",                              who:"Shortlist: Kelechi Ayanso · Barry Gledson · Michelle Littlemore · Pablo Martinez", status:"Shortlisted"},
    {role:"Proposition Team (2–3)",  resp:"Argue in favour of the motion",                                               who:"Kufre Antia (lead) · Laye · Lucas · Ikechukwu · Vemula · Maria", status:"In Selection"},
    {role:"Opposition Team (2–3)",   resp:"Argue against the motion",                                                    who:"Kufre Antia (lead) · TBC", status:"Open"},
    {role:"Logistics Lead",          resp:"Reds Hall, AV, seating, signage",                                             who:"Uchechukwu Maduwuba",      status:"Assigned"},
    {role:"Comms & Engagement",      resp:"Promotion, registration, attendance",                                         who:"All team",                 status:"Active"},
  ];
  const stBadge = s => s==="Assigned"||s==="Active"?{bg:"#C6EFCE",fg:"#1A5C2A"}:s==="Shortlisted"||s==="In Selection"?{bg:"#FFF3CD",fg:"#7A5000"}:{bg:"#FFE0E0",fg:"#8B1A1A"};

  return (
    <div>
      <SectionHead title="Team" sub="Northumbria Construct Event Planning Committee"/>

      {/* Member cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        {TEAM.map(m => {
          const mt = tasks.filter(t=>t.owner===m.id);
          const mp = calcPct(mt);
          const mc = mt.filter(t=>t.status==="Complete").length;
          return (
            <Card key={m.id} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
              <Avatar name={m.name} area={m.area} size={46}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, color:B.dk }}>{m.name}</div>
                <div style={{ fontSize:11, color:B.ac, fontWeight:600, marginBottom:5 }}>{m.role}</div>
                <div style={{ fontSize:11, color:B.tg, lineHeight:1.5 }}>{m.resp}</div>
                <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:10, padding:"2px 9px", borderRadius:20,
                    background:B.pl, color:B.md, fontWeight:700 }}>{m.area}</span>
                  <span style={{ fontSize:10, color:B.tg }}>{mt.length} tasks · {mc} done</span>
                </div>
                <div style={{ marginTop:7, display:"flex", alignItems:"center", gap:6 }}>
                  <Pbar pct={mp} h={5}/>
                  <span style={{ fontSize:10, color:B.md, fontWeight:600, minWidth:30 }}>{mp}%</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Core roles */}
      <Card style={{ padding:"0", overflow:"hidden", marginBottom:14 }}>
        <div style={{ background:B.md, padding:"12px 18px", fontWeight:700, fontSize:14, color:"#fff" }}>
          Core Delivery Roles
        </div>
        {coreRoles.map((r,i) => {
          const sc = stBadge(r.status);
          return (
            <div key={i} style={{ padding:"12px 18px", background:i%2===0?B.wh:B.st,
              borderBottom:`1px solid ${B.pl}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <span style={{ fontSize:13, fontWeight:700, color:B.dk }}>{r.role}</span>
                <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, fontWeight:600,
                  background:sc.bg, color:sc.fg }}>{r.status}</span>
              </div>
              <div style={{ fontSize:11, color:B.tm, marginBottom:3 }}>{r.resp}</div>
              <div style={{ fontSize:11, color:B.tg }}>{r.who}</div>
            </div>
          );
        })}
      </Card>

      {/* Risk register */}
      <Card style={{ padding:"0", overflow:"hidden" }}>
        <div style={{ background:B.dk, padding:"12px 18px", fontWeight:700, fontSize:14, color:"#fff" }}>
          📋 Risk Register
        </div>
        {[["Low attendance","Medium","Over-invite 60–70, target specific programmes"],
          ["Speaker no-shows","Low–Medium","Identify reserve speakers in advance"],
          ["Debate overruns","Medium","Strong Chair, strict time enforcement"],
          ["Low audience participation","Medium","Pre-seeded questions and prompts"],
          ["Venue issues","Low","Confirm AV & room with Uchechukwu by 21 Apr"],
        ].map(([r,l,m],i) => {
          const c = l==="Low"?{bg:"#C6EFCE",fg:"#1A5C2A"}:l.includes("Low")?{bg:"#FFF3CD",fg:"#7A5000"}:{bg:"#FFE0E0",fg:"#8B1A1A"};
          return (
            <div key={i} style={{ padding:"11px 18px", background:i%2===0?B.wh:B.st,
              borderBottom:`1px solid ${B.pl}`, borderLeft:`4px solid ${c.fg}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ fontSize:13, fontWeight:600, color:B.tx }}>{r}</span>
                <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, fontWeight:600,
                  background:c.bg, color:c.fg, flexShrink:0, marginLeft:8 }}>{l}</span>
              </div>
              <div style={{ fontSize:11, color:B.tg }}>{m}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════
export default function App() {
  const isMobile = useIsMobile();
  const [tab,   setTab]   = useState("dashboard");
  const [tasks, setTasks] = useState(()=>loadState("nc_tasks", DEFAULT_TASKS));
  const [raci,  setRaci]  = useState(()=>loadState("nc_raci",  DEFAULT_RACI));
  const [toast, setToast] = useState("");
  const [ganttModal, setGanttModal] = useState(null);

  // Auto-save
  useEffect(()=>{ try{localStorage.setItem("nc_tasks",JSON.stringify(tasks));}catch{} },[tasks]);
  useEffect(()=>{ try{localStorage.setItem("nc_raci", JSON.stringify(raci)); }catch{} },[raci]);
  useEffect(()=>{ if(!toast)return; const t=setTimeout(()=>setToast(""),2500); return()=>clearTimeout(t); },[toast]);

  function exportCSV() {
    const hdr = ["ID","Task","Owner","Start","End","Status","Priority","% Done","Notes"];
    const rows = tasks.map(t=>[t.id,`"${t.desc}"`,memberObj(t.owner).name,t.start,t.end,t.status,t.pri,t.pct,`"${t.notes}"`]);
    const csv = [hdr,...rows].map(r=>r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(csv);
    a.download = "NC_Oxford_Debate.csv"; a.click();
    setToast("⬇ CSV exported");
  }

  function handleGanttSave(saved) { setTasks(ts=>ts.map(t=>t.id===saved.id?saved:t)); setGanttModal(null); setToast(`✓ Task #${saved.id} updated`); }
  function handleGanttDelete(id)   { setTasks(ts=>ts.filter(t=>t.id!==id)); setGanttModal(null); setToast("Task deleted"); }

  const TABS = [
    { id:"dashboard", label:"Home",  icon:"🏠" },
    { id:"tasks",     label:"Tasks", icon:"✅" },
    { id:"gantt",     label:"Gantt", icon:"📅" },
    { id:"raci",      label:"RACI",  icon:"👥" },
    { id:"team",      label:"Team",  icon:"🤝" },
  ];

  return (
    <div style={{ fontFamily:"'Segoe UI', system-ui, sans-serif", background:B.st,
      minHeight:"100vh", color:B.tx, paddingBottom: isMobile ? 80 : 0 }}>

      {/* ── TOP HEADER ── */}
      <div style={{ background:B.dk, padding:`0 ${isMobile?16:20}px`, display:"flex",
        alignItems:"center", gap:12, height:54, position:"sticky", top:0, zIndex:200,
        boxShadow:"0 2px 8px rgba(0,0,0,.2)" }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:B.lt, flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:12, fontWeight:700, color:B.dk }}>NC</span>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ color:"#fff", fontWeight:700, fontSize:14, lineHeight:1.1 }}>Northumbria Construct</div>
          <div style={{ color:B.lt, fontSize:10, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            Oxford Debate · 28 April 2026
          </div>
        </div>

        {/* Desktop tabs in header */}
        {!isMobile && (
          <div style={{ display:"flex", gap:3 }}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"5px 13px",
                borderRadius:20, border:"none", cursor:"pointer", fontSize:11, fontWeight:600,
                background:tab===t.id?B.lt:"transparent", color:tab===t.id?B.dk:B.pl }}>
                {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display:"flex", gap:6 }}>
          {!isMobile && (
            <button onClick={()=>setToast("✓ Auto-saved")} style={{ padding:"5px 12px", borderRadius:20,
              fontSize:11, fontWeight:600, background:"rgba(116,198,157,.2)", color:B.lt,
              border:"1px solid rgba(116,198,157,.3)", cursor:"pointer" }}>💾</button>
          )}
          <button onClick={exportCSV} style={{ padding:"5px 12px", borderRadius:20,
            fontSize:11, fontWeight:600, background:"rgba(116,198,157,.2)", color:B.lt,
            border:"1px solid rgba(116,198,157,.3)", cursor:"pointer" }}>⬇ CSV</button>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:isMobile?"16px 14px":"22px 18px" }}>
        {tab==="dashboard" && <Dashboard tasks={tasks} onNav={setTab} isMobile={isMobile}/>}
        {tab==="tasks"     && <TaskTracker tasks={tasks} setTasks={setTasks} setToast={setToast} isMobile={isMobile}/>}
        {tab==="gantt"     && <>
          <GanttChart tasks={tasks} onEdit={t=>setGanttModal(t)} isMobile={isMobile}/>
          {ganttModal && <TaskModal task={ganttModal} onSave={handleGanttSave} onDelete={handleGanttDelete} onClose={()=>setGanttModal(null)}/>}
        </>}
        {tab==="raci"      && <RaciMatrix tasks={tasks} raci={raci} setRaci={setRaci} isMobile={isMobile}/>}
        {tab==="team"      && <Team tasks={tasks} isMobile={isMobile}/>}
      </div>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      {isMobile && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background:B.wh,
          borderTop:`1px solid ${B.pl}`, display:"flex", zIndex:200,
          paddingBottom:"env(safe-area-inset-bottom)" }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, border:"none",
              background:"transparent", padding:"10px 4px 8px", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <span style={{ fontSize:20 }}>{t.icon}</span>
              <span style={{ fontSize:10, fontWeight:700,
                color:tab===t.id?B.ac:B.tg }}>{t.label}</span>
              {tab===t.id && (
                <div style={{ width:20, height:3, borderRadius:99, background:B.ac }}/>
              )}
            </button>
          ))}
        </div>
      )}

      <Toast msg={toast}/>
    </div>
  );
}
