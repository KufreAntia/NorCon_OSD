import { useState, useEffect } from "react";

const BRAND = {
  darkGreen:  "#1A3C2E",
  midGreen:   "#2D6A4F",
  accent:     "#40916C",
  light:      "#74C69D",
  pale:       "#D8F3DC",
  stripe:     "#EBF7EE",
  text:       "#1C2B22",
  textMid:    "#3A5242",
  textGrey:   "#607466",
  white:      "#FFFFFF",
};

const initialTasks = [
  { id:1,  desc:"Confirm event date & format",        owner:"Committee",         start:"06 Apr", due:"06 Apr", status:"Complete",    priority:"Critical", deps:"–",    notes:"Event fixed for 28 April",         pct:100, startD:6,  endD:6  },
  { id:2,  desc:"Finalise debate motion shortlist",   owner:"Training & Dev",    start:"06 Apr", due:"06 Apr", status:"Complete",    priority:"High",     deps:"1",    notes:"Lean vs BIM selected",             pct:100, startD:6,  endD:6  },
  { id:3,  desc:"Submit Reds Hall booking",           owner:"Event Lead",        start:"06 Apr", due:"07 Apr", status:"Not Started", priority:"High",     deps:"1",    notes:"NSU approval required",            pct:0,   startD:6,  endD:7  },
  { id:4,  desc:"Confirm Debate Chair shortlist",     owner:"President / COO",   start:"07 Apr", due:"08 Apr", status:"Complete",    priority:"High",     deps:"3",    notes:"Kelechi Ayanso, Barry Gledson",    pct:100, startD:7,  endD:8  },
  { id:5,  desc:"Open call for speakers",             owner:"Comms Lead",        start:"08 Apr", due:"09 Apr", status:"Not Started", priority:"High",     deps:"2,4",  notes:"Prop & Opp",                      pct:0,   startD:8,  endD:9  },
  { id:6,  desc:"Confirm speakers + reserves",        owner:"Event Lead",        start:"09 Apr", due:"11 Apr", status:"Not Started", priority:"High",     deps:"5",    notes:"Min 2 per side",                  pct:0,   startD:9,  endD:11 },
  { id:7,  desc:"Issue speaker briefing pack",        owner:"Training & Dev",    start:"11 Apr", due:"11 Apr", status:"Not Started", priority:"Medium",   deps:"6",    notes:"Oxford rules",                    pct:0,   startD:11, endD:11 },
  { id:8,  desc:"Launch promotion",                   owner:"Media / PRO",       start:"12 Apr", due:"12 Apr", status:"Not Started", priority:"High",     deps:"2,3",  notes:"LinkedIn + reps",                 pct:0,   startD:12, endD:23 },
  { id:9,  desc:"Open registration form",             owner:"Comms Lead",        start:"12 Apr", due:"14 Apr", status:"Not Started", priority:"Medium",   deps:"8",    notes:"MS Forms",                        pct:0,   startD:12, endD:27 },
  { id:10, desc:"Engage academic reps & societies",   owner:"PRO",               start:"14 Apr", due:"17 Apr", status:"Not Started", priority:"Medium",   deps:"8",    notes:"Dept amplification",              pct:0,   startD:14, endD:17 },
  { id:11, desc:"Prepare debate run-of-show",         owner:"Event Lead",        start:"14 Apr", due:"15 Apr", status:"Not Started", priority:"Medium",   deps:"4,6",  notes:"Chair script",                   pct:0,   startD:14, endD:15 },
  { id:12, desc:"Prepare voting forms (QR)",          owner:"CTO",               start:"16 Apr", due:"18 Apr", status:"Not Started", priority:"Medium",   deps:"2",    notes:"Pre & post vote",                 pct:0,   startD:16, endD:18 },
  { id:13, desc:"Confirm AV & room setup",            owner:"Logistics Lead",    start:"18 Apr", due:"21 Apr", status:"Not Started", priority:"High",     deps:"3",    notes:"Mics, projector",                 pct:0,   startD:18, endD:21 },
  { id:14, desc:"Promotion reminder push",            owner:"Media Manager",     start:"21 Apr", due:"22 Apr", status:"Not Started", priority:"Medium",   deps:"8,9",  notes:"Attendance boost",                pct:0,   startD:21, endD:22 },
  { id:15, desc:"Speaker reconfirmation",             owner:"Training & Dev",    start:"23 Apr", due:"24 Apr", status:"Not Started", priority:"High",     deps:"6",    notes:"No-shows risk",                   pct:0,   startD:23, endD:24 },
  { id:16, desc:"Final logistics walkthrough",        owner:"Event + Logistics", start:"27 Apr", due:"27 Apr", status:"Not Started", priority:"High",     deps:"13",   notes:"Go / No-go check",                pct:0,   startD:27, endD:27 },
  { id:17, desc:"★ DELIVER EVENT",                    owner:"All",               start:"28 Apr", due:"28 Apr", status:"Not Started", priority:"Critical", deps:"16",   notes:"Event day — Reds Hall",           pct:0,   startD:28, endD:28 },
  { id:18, desc:"Publish LinkedIn article",           owner:"Media Manager",     start:"29 Apr", due:"01 May", status:"Not Started", priority:"Medium",   deps:"17",   notes:"Post-event output",               pct:0,   startD:29, endD:31 },
  { id:19, desc:"Capture feedback & lessons learned", owner:"Secretary",         start:"29 Apr", due:"03 May", status:"Not Started", priority:"Medium",   deps:"17",   notes:"Repeatability",                   pct:0,   startD:29, endD:33 },
];

const committee = [
  { role:"President / CEO",              name:"Callum O'Connor",     area:"Strategy",    resp:"Strategic oversight, institutional alignment" },
  { role:"Vice President / COO",         name:"Sandhya Chimata",     area:"Operations",  resp:"Operational coordination and delivery assurance" },
  { role:"Secretary / Admin Manager",    name:"Collins Tamunotoye",  area:"Admin",       resp:"Documentation, approvals, internal coordination" },
  { role:"Training & Dev Manager / CTO", name:"Kufre Antia",         area:"Training",    resp:"Debate structure, speaker briefing, academic rigour" },
  { role:"PRO / Industry Liaison",       name:"Mohamed Aborimia",    area:"Comms",       resp:"Promotion, partnerships with departments & societies" },
  { role:"Treasurer / Fin. Director",    name:"Tolulope Idowu",      area:"Finance",     resp:"Budget oversight, cost control" },
  { role:"Event / Media Manager",        name:"Uchechukwu Maduwuba", area:"Media",       resp:"Media, photography, LinkedIn content capture" },
];

const DAYS = Array.from({length:33}, (_,i) => i+6);
const DAY_LABELS = {6:"6",7:"7",8:"8",9:"9",10:"10",11:"11",12:"12",13:"13",14:"14",15:"15",16:"16",17:"17",18:"18",19:"19",20:"20",21:"21",22:"22",23:"23",24:"24",25:"25",26:"26",27:"27",28:"28★",29:"29",30:"30",31:"1M",32:"2M",33:"3M"};
const weekends = [7,8,13,14,19,20,25,26];

const statusColors = {
  "Complete":    { bg:"#C6EFCE", fg:"#1A5C2A", border:"#74C69D" },
  "In Progress": { bg:"#FFF3CD", fg:"#7A5000", border:"#F0C040" },
  "Not Started": { bg:"#FFE0E0", fg:"#8B1A1A", border:"#E08080" },
};
const priorityColors = {
  "Critical": { bg:BRAND.darkGreen,  fg:"#FFFFFF" },
  "High":     { bg:BRAND.accent,     fg:"#FFFFFF" },
  "Medium":   { bg:BRAND.pale,       fg:BRAND.midGreen },
};

function initials(name) {
  return name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
}

function areaColor(area) {
  const map = { Strategy:BRAND.darkGreen, Operations:BRAND.midGreen, Admin:BRAND.accent, Training:"#52B788", Comms:"#40916C", Finance:"#1A3C2E", Media:"#2D6A4F" };
  return map[area] || BRAND.accent;
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [tasks, setTasks] = useState(initialTasks);
  const [filterStatus, setFilterStatus] = useState("All");
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editPct, setEditPct] = useState(0);

  const today = 6;
  const done    = tasks.filter(t => t.status === "Complete").length;
  const inProg  = tasks.filter(t => t.status === "In Progress").length;
  const notStr  = tasks.filter(t => t.status === "Not Started").length;
  const overallPct = Math.round(tasks.reduce((s,t) => s+t.pct, 0) / tasks.length);

  function updateTask(id, newStatus, newPct) {
    setTasks(ts => ts.map(t => t.id === id ? {...t, status: newStatus, pct: newPct} : t));
    setEditId(null);
  }

  const tabs = [
    { id:"dashboard", label:"Dashboard" },
    { id:"tracker",   label:"Task Tracker" },
    { id:"gantt",     label:"Gantt Chart" },
    { id:"team",      label:"Committee" },
  ];

  const visibleTasks = filterStatus === "All" ? tasks : tasks.filter(t => t.status === filterStatus);

  return (
    <div style={{fontFamily:"'DM Sans', system-ui, sans-serif", background:BRAND.stripe, minHeight:"100vh", color:BRAND.text}}>
      {/* Header */}
      <div style={{background:BRAND.darkGreen, padding:"0 24px", display:"flex", alignItems:"center", gap:20, height:58, position:"sticky", top:0, zIndex:100}}>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{width:32, height:32, borderRadius:"50%", background:BRAND.light, display:"flex", alignItems:"center", justifyContent:"center"}}>
            <span style={{fontSize:14, fontWeight:700, color:BRAND.darkGreen}}>NC</span>
          </div>
          <div>
            <div style={{color:BRAND.white, fontWeight:700, fontSize:15, lineHeight:1.1}}>Northumbria Construct</div>
            <div style={{color:BRAND.light, fontSize:11}}>Oxford Debate Event · 28 April 2026</div>
          </div>
        </div>
        <div style={{flex:1}}/>
        <div style={{display:"flex", gap:4}}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
              background: tab===t.id ? BRAND.light : "transparent",
              color: tab===t.id ? BRAND.darkGreen : BRAND.pale,
              transition:"all .15s"
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1200, margin:"0 auto", padding:"24px 20px"}}>

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <h2 style={{fontSize:22, fontWeight:700, color:BRAND.darkGreen, margin:"0 0 4px"}}>Project Dashboard</h2>
            <p style={{color:BRAND.textGrey, fontSize:13, margin:"0 0 24px"}}>Live planning overview — Oxford Debate, NSU Building – Reds Hall</p>

            {/* KPI cards */}
            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24}}>
              {[
                { label:"Overall Progress", value:`${overallPct}%`, sub:"across 19 tasks", accent:BRAND.midGreen },
                { label:"Complete",         value:done,             sub:"tasks done",       accent:"#1A5C2A" },
                { label:"In Progress",      value:inProg,           sub:"tasks active",     accent:"#7A5000" },
                { label:"Not Started",      value:notStr,           sub:"tasks pending",    accent:"#8B1A1A" },
              ].map((k,i) => (
                <div key={i} style={{background:BRAND.white, borderRadius:12, padding:"16px 20px", border:`1px solid ${BRAND.pale}`}}>
                  <div style={{fontSize:12, color:BRAND.textGrey, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:.5}}>{k.label}</div>
                  <div style={{fontSize:32, fontWeight:700, color:k.accent, lineHeight:1}}>{k.value}</div>
                  <div style={{fontSize:11, color:BRAND.textGrey, marginTop:4}}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{background:BRAND.white, borderRadius:12, padding:"20px 24px", border:`1px solid ${BRAND.pale}`, marginBottom:20}}>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:10}}>
                <span style={{fontWeight:600, fontSize:14, color:BRAND.darkGreen}}>Overall Completion</span>
                <span style={{fontWeight:700, fontSize:14, color:BRAND.midGreen}}>{overallPct}%</span>
              </div>
              <div style={{height:10, borderRadius:99, background:BRAND.pale, overflow:"hidden"}}>
                <div style={{height:"100%", width:`${overallPct}%`, background:`linear-gradient(90deg, ${BRAND.darkGreen}, ${BRAND.light})`, borderRadius:99, transition:"width .5s"}}/>
              </div>
              <div style={{display:"flex", gap:16, marginTop:12}}>
                {[["Complete",done,"#C6EFCE","#1A5C2A"],["In Progress",inProg,"#FFF3CD","#7A5000"],["Not Started",notStr,"#FFE0E0","#8B1A1A"]].map(([l,n,bg,fg])=>(
                  <div key={l} style={{display:"flex", alignItems:"center", gap:6}}>
                    <div style={{width:10, height:10, borderRadius:3, background:bg, border:`1px solid ${fg}`}}/>
                    <span style={{fontSize:12, color:BRAND.textGrey}}>{l}: <b style={{color:fg}}>{n}</b></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event info + upcoming tasks */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
              <div style={{background:BRAND.white, borderRadius:12, padding:"20px 24px", border:`1px solid ${BRAND.pale}`}}>
                <div style={{fontWeight:700, fontSize:14, color:BRAND.darkGreen, marginBottom:14}}>Event Details</div>
                {[
                  ["Date","28 April 2026"],["Venue","NSU Building – Reds Hall"],["Format","Oxford-Style Debate"],
                  ["Duration","75–90 minutes"],["Target Audience","~40 students"],["Voting","QR code via Microsoft Forms"],
                ].map(([l,v])=>(
                  <div key={l} style={{display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${BRAND.stripe}`}}>
                    <span style={{fontSize:12, color:BRAND.textGrey}}>{l}</span>
                    <span style={{fontSize:12, fontWeight:600, color:BRAND.text}}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{background:BRAND.white, borderRadius:12, padding:"20px 24px", border:`1px solid ${BRAND.pale}`}}>
                <div style={{fontWeight:700, fontSize:14, color:BRAND.darkGreen, marginBottom:14}}>Upcoming Critical Tasks</div>
                {tasks.filter(t=>t.status!=="Complete" && t.priority==="Critical" || (t.status!=="Complete" && t.priority==="High")).slice(0,5).map(t=>(
                  <div key={t.id} style={{display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:`1px solid ${BRAND.stripe}`}}>
                    <div style={{width:6, height:6, borderRadius:"50%", background:t.priority==="Critical"?BRAND.darkGreen:BRAND.accent, flexShrink:0}}/>
                    <div style={{flex:1, fontSize:12, color:BRAND.text}}>{t.desc}</div>
                    <div style={{fontSize:11, color:BRAND.textGrey, flexShrink:0}}>{t.due}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Debate motions */}
            <div style={{background:BRAND.white, borderRadius:12, padding:"20px 24px", border:`1px solid ${BRAND.pale}`, marginTop:16}}>
              <div style={{fontWeight:700, fontSize:14, color:BRAND.darkGreen, marginBottom:14}}>Debate Motions (Select One)</div>
              {[
                [1,"This House Believes That Professional Body Membership Is No Longer Essential for Career Progression in Construction.","CIOB, ICE, APM relevance; employability; chartership value"],
                [2,"This House Believes That Sustainability Targets Are Undermining Project Delivery Efficiency.","ESG requirements, carbon targets, cost and programme pressures"],
                [3,"This House Believes That Universities Are Failing to Prepare Construction Graduates for Industry.","Curriculum relevance, employability gap, industry readiness"],
              ].map(([n,m,f])=>(
                <div key={n} style={{display:"flex", gap:14, padding:"10px 0", borderBottom:`1px solid ${BRAND.stripe}`}}>
                  <div style={{width:26, height:26, borderRadius:"50%", background:BRAND.pale, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12, color:BRAND.midGreen, flexShrink:0}}>{n}</div>
                  <div>
                    <div style={{fontSize:12, fontWeight:600, color:BRAND.darkGreen, marginBottom:3}}>"{m}"</div>
                    <div style={{fontSize:11, color:BRAND.textGrey}}>{f}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TASK TRACKER ── */}
        {tab === "tracker" && (
          <div>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
              <div>
                <h2 style={{fontSize:22, fontWeight:700, color:BRAND.darkGreen, margin:0}}>Task Tracker</h2>
                <p style={{color:BRAND.textGrey, fontSize:13, margin:"4px 0 0"}}>Click status to update — single source of truth</p>
              </div>
              <div style={{display:"flex", gap:6}}>
                {["All","Complete","In Progress","Not Started"].map(s=>(
                  <button key={s} onClick={()=>setFilterStatus(s)} style={{
                    padding:"6px 12px", borderRadius:20, border:`1px solid ${filterStatus===s?BRAND.accent:BRAND.pale}`,
                    background:filterStatus===s?BRAND.pale:"transparent", color:filterStatus===s?BRAND.midGreen:BRAND.textGrey,
                    fontSize:12, fontWeight:600, cursor:"pointer"
                  }}>{s}</button>
                ))}
              </div>
            </div>

            <div style={{background:BRAND.white, borderRadius:12, border:`1px solid ${BRAND.pale}`, overflow:"hidden"}}>
              {/* Table header */}
              <div style={{display:"grid", gridTemplateColumns:"40px 1fr 140px 80px 80px 130px 90px", gap:0, background:BRAND.darkGreen, padding:"10px 16px"}}>
                {["#","Task","Owner","Start","Due","Status","Done"].map((h,i)=>(
                  <div key={i} style={{fontSize:11, fontWeight:700, color:BRAND.pale, textTransform:"uppercase", letterSpacing:.5}}>{h}</div>
                ))}
              </div>
              {visibleTasks.map((t, ri) => {
                const sc = statusColors[t.status] || statusColors["Not Started"];
                const isEditing = editId === t.id;
                return (
                  <div key={t.id} style={{
                    display:"grid", gridTemplateColumns:"40px 1fr 140px 80px 80px 130px 90px",
                    gap:0, padding:"10px 16px", alignItems:"center",
                    background: ri%2===0 ? BRAND.white : BRAND.stripe,
                    borderBottom:`1px solid ${BRAND.pale}`,
                    borderLeft: t.priority==="Critical" ? `3px solid ${BRAND.darkGreen}` : t.priority==="High" ? `3px solid ${BRAND.accent}` : "3px solid transparent"
                  }}>
                    <div style={{fontSize:12, color:BRAND.textGrey, fontWeight:600}}>{t.id}</div>
                    <div>
                      <div style={{fontSize:13, fontWeight:t.id===17?700:500, color:t.id===17?BRAND.darkGreen:BRAND.text}}>{t.desc}</div>
                      <div style={{fontSize:11, color:BRAND.textGrey, marginTop:2}}>{t.notes}</div>
                    </div>
                    <div style={{fontSize:12, color:BRAND.textMid}}>{t.owner}</div>
                    <div style={{fontSize:11, color:BRAND.textGrey}}>{t.start}</div>
                    <div style={{fontSize:11, color:BRAND.textGrey}}>{t.due}</div>
                    <div>
                      {isEditing ? (
                        <select value={editStatus} onChange={e=>setEditStatus(e.target.value)}
                          style={{fontSize:11, padding:"3px 6px", borderRadius:6, border:`1px solid ${BRAND.accent}`, background:BRAND.pale, color:BRAND.darkGreen, width:"100%"}}>
                          {["Not Started","In Progress","Complete"].map(s=><option key={s}>{s}</option>)}
                        </select>
                      ) : (
                        <button onClick={()=>{setEditId(t.id);setEditStatus(t.status);setEditPct(t.pct);}} style={{
                          fontSize:11, padding:"3px 10px", borderRadius:20, border:`1px solid ${sc.border}`,
                          background:sc.bg, color:sc.fg, cursor:"pointer", fontWeight:600, width:"100%"
                        }}>{t.status}</button>
                      )}
                    </div>
                    <div>
                      {isEditing ? (
                        <div style={{display:"flex", gap:4, alignItems:"center"}}>
                          <input type="number" min={0} max={100} value={editPct} onChange={e=>setEditPct(Number(e.target.value))}
                            style={{width:44, fontSize:11, padding:"3px 4px", borderRadius:6, border:`1px solid ${BRAND.accent}`}}/>
                          <button onClick={()=>updateTask(t.id, editStatus, editPct)} style={{fontSize:11, padding:"3px 7px", borderRadius:6, background:BRAND.darkGreen, color:"white", border:"none", cursor:"pointer"}}>✓</button>
                          <button onClick={()=>setEditId(null)} style={{fontSize:11, padding:"3px 6px", borderRadius:6, background:BRAND.pale, color:BRAND.textGrey, border:"none", cursor:"pointer"}}>✕</button>
                        </div>
                      ) : (
                        <div style={{display:"flex", alignItems:"center", gap:6}}>
                          <div style={{flex:1, height:5, borderRadius:99, background:BRAND.pale, overflow:"hidden"}}>
                            <div style={{height:"100%", width:`${t.pct}%`, background:t.pct===100?BRAND.midGreen:BRAND.light, borderRadius:99}}/>
                          </div>
                          <span style={{fontSize:11, color:BRAND.textGrey, minWidth:28}}>{t.pct}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:10, fontSize:11, color:BRAND.textGrey}}>
              Left border: <span style={{color:BRAND.darkGreen, fontWeight:700}}>■</span> Critical &nbsp; <span style={{color:BRAND.accent, fontWeight:700}}>■</span> High &nbsp; Click any status badge to update.
            </div>
          </div>
        )}

        {/* ── GANTT ── */}
        {tab === "gantt" && (
          <div>
            <h2 style={{fontSize:22, fontWeight:700, color:BRAND.darkGreen, margin:"0 0 4px"}}>Gantt Chart</h2>
            <p style={{color:BRAND.textGrey, fontSize:13, margin:"0 0 16px"}}>6 April – 3 May 2026 · Shaded columns = weekends</p>
            <div style={{background:BRAND.white, borderRadius:12, border:`1px solid ${BRAND.pale}`, overflow:"auto"}}>
              <table style={{borderCollapse:"collapse", width:"100%", minWidth:900}}>
                <thead>
                  <tr style={{background:BRAND.darkGreen}}>
                    <th style={{padding:"8px 12px", textAlign:"left", color:BRAND.pale, fontSize:11, fontWeight:700, width:30}}>#</th>
                    <th style={{padding:"8px 12px", textAlign:"left", color:BRAND.pale, fontSize:11, fontWeight:700, width:200}}>Task</th>
                    <th style={{padding:"8px 12px", textAlign:"left", color:BRAND.pale, fontSize:11, fontWeight:700, width:110}}>Owner</th>
                    {DAYS.map(d => (
                      <th key={d} style={{
                        padding:"6px 2px", textAlign:"center",
                        color: weekends.includes(d) ? BRAND.textGrey : BRAND.pale,
                        fontSize:9, fontWeight:600, width:22,
                        background: weekends.includes(d) ? BRAND.midGreen : BRAND.darkGreen,
                      }}>{DAY_LABELS[d]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t, ri) => (
                    <tr key={t.id} style={{background: ri%2===0 ? BRAND.white : BRAND.stripe}}>
                      <td style={{padding:"6px 12px", fontSize:11, color:BRAND.textGrey, fontWeight:600}}>{t.id}</td>
                      <td style={{padding:"6px 12px", fontSize:11, color:t.id===17?BRAND.darkGreen:BRAND.text, fontWeight:t.id===17?700:400, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:200}}>{t.desc}</td>
                      <td style={{padding:"6px 12px", fontSize:11, color:BRAND.textMid, whiteSpace:"nowrap"}}>{t.owner.length>14?t.owner.slice(0,13)+"…":t.owner}</td>
                      {DAYS.map(d => {
                        const inBar = d >= t.startD && d <= t.endD;
                        const isMile = t.id === 17;
                        const isDone = t.status === "Complete";
                        const isWknd = weekends.includes(d);
                        return (
                          <td key={d} style={{
                            padding:2, textAlign:"center",
                            background: inBar
                              ? (isMile ? BRAND.light : isDone ? BRAND.midGreen : BRAND.accent)
                              : isWknd ? "#E8F0EB" : "transparent",
                            borderLeft: inBar && d===t.startD ? `2px solid ${BRAND.darkGreen}` : undefined,
                            borderRight: inBar && d===t.endD ? `2px solid ${BRAND.darkGreen}` : undefined,
                          }}>
                            {inBar && isMile && <span style={{fontSize:10, color:BRAND.darkGreen}}>★</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{display:"flex", gap:16, marginTop:10}}>
              {[["Planned",BRAND.accent],[`Complete`,BRAND.midGreen],["Milestone",BRAND.light],["Weekend","#E8F0EB"]].map(([l,c])=>(
                <div key={l} style={{display:"flex", alignItems:"center", gap:5}}>
                  <div style={{width:14, height:10, borderRadius:2, background:c, border:`1px solid ${BRAND.accent}44`}}/>
                  <span style={{fontSize:11, color:BRAND.textGrey}}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COMMITTEE ── */}
        {tab === "team" && (
          <div>
            <h2 style={{fontSize:22, fontWeight:700, color:BRAND.darkGreen, margin:"0 0 4px"}}>Committee & Roles</h2>
            <p style={{color:BRAND.textGrey, fontSize:13, margin:"0 0 20px"}}>Northumbria Construct Event Planning Committee</p>

            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px,1fr))", gap:14, marginBottom:28}}>
              {committee.map((m,i) => (
                <div key={i} style={{background:BRAND.white, borderRadius:12, padding:"16px 20px", border:`1px solid ${BRAND.pale}`, display:"flex", gap:14, alignItems:"flex-start"}}>
                  <div style={{width:44, height:44, borderRadius:"50%", background:areaColor(m.area), display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                    <span style={{fontSize:14, fontWeight:700, color:"#fff"}}>{initials(m.name)}</span>
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontWeight:700, fontSize:13, color:BRAND.darkGreen}}>{m.name}</div>
                    <div style={{fontSize:11, color:BRAND.accent, fontWeight:600, marginBottom:6}}>{m.role}</div>
                    <div style={{fontSize:11, color:BRAND.textGrey, lineHeight:1.5}}>{m.resp}</div>
                    <div style={{marginTop:8}}>
                      <span style={{fontSize:10, padding:"2px 8px", borderRadius:20, background:BRAND.pale, color:BRAND.midGreen, fontWeight:600}}>{m.area}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{background:BRAND.white, borderRadius:12, border:`1px solid ${BRAND.pale}`, overflow:"hidden"}}>
              <div style={{background:BRAND.midGreen, padding:"12px 20px"}}>
                <div style={{fontWeight:700, fontSize:14, color:BRAND.white}}>Core Delivery Roles</div>
              </div>
              {[
                ["Event Lead","Overall coordination; liaison with NSU and venue booking","TBC","Critical path owner"],
                ["Debate Chair / Moderator","Neutral facilitation; Oxford rules; strict timekeeping","TBC","Academic/senior student — drop-dead 9 Apr"],
                ["Proposition Team (2–3)","Argue in favour of the motion","TBC","Drop-dead: 15 April"],
                ["Opposition Team (2–3)","Argue against the motion","TBC","Drop-dead: 15 April"],
                ["Logistics Lead","Room setup, AV, seating, signage","TBC","Reds Hall access"],
                ["Comms & Engagement Lead","Promotion, registration, attendance tracking","TBC","LinkedIn + MS Forms"],
              ].map(([role,resp,who,note],i)=>(
                <div key={i} style={{
                  display:"grid", gridTemplateColumns:"200px 1fr 80px 200px",
                  padding:"10px 20px", alignItems:"center",
                  background:i%2===0?BRAND.white:BRAND.stripe,
                  borderBottom:`1px solid ${BRAND.pale}`
                }}>
                  <div style={{fontSize:12, fontWeight:600, color:BRAND.darkGreen}}>{role}</div>
                  <div style={{fontSize:11, color:BRAND.textMid}}>{resp}</div>
                  <div style={{fontSize:11, color:BRAND.textGrey, textAlign:"center"}}>{who}</div>
                  <div style={{fontSize:11, color:BRAND.textGrey, fontStyle:"italic"}}>{note}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
