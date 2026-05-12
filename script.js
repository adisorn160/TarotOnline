/* ═══════════════════════════════════════════════════
   PJOracles — Tarot App
   Vanilla React (no build needed) for GitHub Pages
   ═══════════════════════════════════════════════════ */
const { useState, useEffect, useRef, createElement: h } = React;

/* ── Card meaning data ── */
const CARDS = [
  { name:"The Fool",         emoji:"🌀", element:"Air",   planet:"♅ Uranus",   meaning:"พลังแห่งการเริ่มต้นครั้งใหม่ กระโดดออกจาก comfort zone ด้วยความศรัทธาในจักรวาล", keywords:["การเริ่มต้น","อิสระ","ความกล้า"] },
  { name:"The Magician",     emoji:"✨", element:"Air",   planet:"☿ Mercury",  meaning:"สร้างความเป็นจริงด้วยพลังจิต คำพูด และการลงมือทำ มือหนึ่งกับใจหนึ่งเดียวกัน", keywords:["การสื่อสาร","คาริสมา","ลงมือทำ"] },
  { name:"High Priestess",   emoji:"🌙", element:"Water", planet:"☽ Moon",     meaning:"ฟังเสียงกระซิบจากข้างในมากกว่าเสียงรบกวนภายนอก ความลับกำลังจะถูกเปิดเผย", keywords:["ญาณ","สัญชาตญาณ","ความลับ"] },
  { name:"The Empress",      emoji:"🌸", element:"Earth", planet:"♀ Venus",    meaning:"พลังแห่งความอุดมสมบูรณ์ เปิดรับความสุข ดูแลตัวเองทั้งกายและใจ", keywords:["ความอุดมสมบูรณ์","ความรัก","สร้างสรรค์"] },
  { name:"The Emperor",      emoji:"👑", element:"Fire",  planet:"♂ Mars",     meaning:"สร้างโครงสร้างและจัดระบบชีวิตให้แข็งแรง ความมั่นคงมาจากวินัยของตัวเอง", keywords:["ผู้นำ","อำนาจ","ความมั่นคง"] },
  { name:"The Lovers",       emoji:"💕", element:"Air",   planet:"☿ Mercury",  meaning:"การเลือกด้วยหัวใจ ซื่อสัตย์ต่อความต้องการแท้จริงของตัวเอง", keywords:["ความรัก","การเลือก","คู่สัมพันธ์"] },
  { name:"The Chariot",      emoji:"⚡", element:"Water", planet:"☽ Moon",     meaning:"ชัยชนะมาจากการควบคุมอารมณ์ ความมุ่งมั่น + วินัย = การก้าวหน้า", keywords:["ชัยชนะ","ความมุ่งมั่น","เดินหน้า"] },
  { name:"Strength",         emoji:"🦁", element:"Fire",  planet:"☉ Sun",      meaning:"ความเข้มแข็งแท้จริงคือการยืนหยัดกับความกลัวโดยไม่หนี ใจนำกว่ากำลัง", keywords:["ความอดทน","พลังใจ","อ่อนโยน"] },
  { name:"The Star",         emoji:"⭐", element:"Air",   planet:"♒ Aquarius", meaning:"ความหวังและการรักษาหลังพายุ จักรวาลกำลังส่งแสงนำทางมาให้คุณ", keywords:["ความหวัง","การรักษา","แสงสว่าง"] },
  { name:"The Moon",         emoji:"🌕", element:"Water", planet:"♓ Pisces",   meaning:"บางอย่างยังซ่อนอยู่ในความมืด รอความชัดเจนก่อนตัดสินใจใหญ่", keywords:["ภาพลวงตา","ความกลัว","จิตใต้สำนึก"] },
  { name:"The Sun",          emoji:"☀️", element:"Fire",  planet:"☉ Sun",      meaning:"พลังงานสดใส ความสุข และชัยชนะ แสดงออกตัวตนอย่างเต็มที่ได้เลย", keywords:["ความสุข","ชัยชนะ","พลังงาน"] },
  { name:"Wheel of Fortune", emoji:"🎡", element:"Fire",  planet:"♃ Jupiter",  meaning:"วงล้อแห่งโชคชะตากำลังหมุน โอกาสใหม่กำลังมา ยอมรับการเปลี่ยนแปลง", keywords:["โชคชะตา","วัฏจักร","โอกาส"] },
  { name:"Justice",          emoji:"⚖️", element:"Air",   planet:"♀ Venus",    meaning:"กรรมและสมดุล ผลลัพธ์สะท้อนสิ่งที่ทำ ตัดสินด้วยใจเที่ยงธรรม", keywords:["ยุติธรรม","กรรม","ความจริง"] },
  { name:"The Tower",        emoji:"🗼", element:"Fire",  planet:"♂ Mars",     meaning:"สายฟ้าฟาดพังโครงสร้างเก่าเพื่อเปิดทางให้ความจริงปรากฏ แม้สั่นคลอนแต่จำเป็น", keywords:["เปลี่ยนฉับพลัน","พังทลาย","ตื่นรู้"] },
  { name:"The World",        emoji:"🌍", element:"Earth", planet:"♄ Saturn",   meaning:"บรรลุเป้าหมายและความสมบูรณ์ จุดสิ้นสุดหนึ่งคือจุดเริ่มต้นใหม่ที่ยิ่งใหญ่กว่า", keywords:["สำเร็จ","สมบูรณ์","บรรลุ"] },
];

const TOPICS     = ["💕 ความรัก","💼 การงาน","💰 การเงิน","🌿 สุขภาพ","🌟 ภาพรวมชีวิต","🃏 คำถามทั่วไป"];
const CUSTOM_KEY = "🃏 คำถามทั่วไป";
const POS_3      = ["อดีต","ปัจจุบัน","อนาคต"];
const POS_11     = ["ไพ่ประจำหกเดือน","การงาน","การเงิน","ความรัก","สุขภาพ","เดือนที่ 1","เดือนที่ 2","เดือนที่ 3","เดือนที่ 4","เดือนที่ 5","เดือนที่ 6"];

/* ── Full 78-card deck ── */
function buildDeck() {
  const major = [
    {name:"The Fool",no:"0",suit:"Major"},{name:"The Magician",no:"I",suit:"Major"},
    {name:"The High Priestess",no:"II",suit:"Major"},{name:"The Empress",no:"III",suit:"Major"},
    {name:"The Emperor",no:"IV",suit:"Major"},{name:"The Hierophant",no:"V",suit:"Major"},
    {name:"The Lovers",no:"VI",suit:"Major"},{name:"The Chariot",no:"VII",suit:"Major"},
    {name:"Strength",no:"VIII",suit:"Major"},{name:"The Hermit",no:"IX",suit:"Major"},
    {name:"Wheel of Fortune",no:"X",suit:"Major"},{name:"Justice",no:"XI",suit:"Major"},
    {name:"The Hanged Man",no:"XII",suit:"Major"},{name:"Death",no:"XIII",suit:"Major"},
    {name:"Temperance",no:"XIV",suit:"Major"},{name:"The Devil",no:"XV",suit:"Major"},
    {name:"The Tower",no:"XVI",suit:"Major"},{name:"The Star",no:"XVII",suit:"Major"},
    {name:"The Moon",no:"XVIII",suit:"Major"},{name:"The Sun",no:"XIX",suit:"Major"},
    {name:"Judgement",no:"XX",suit:"Major"},{name:"The World",no:"XXI",suit:"Major"},
  ];
  const suits = ["Wands","Cups","Swords","Pentacles"];
  const pips  = ["Ace","2","3","4","5","6","7","8","9","10","Page","Knight","Queen","King"];
  const minor = suits.flatMap(s => pips.map(p => ({name:`${p} of ${s}`,no:p,suit:s})));
  return shuffle([...major,...minor]);
}

function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]; } return a; }

/* ── Style tokens ── */
const C = {
  gold:"#e8c97a", goldDim:"#c9a84c", moon:"#b8c9e8", teal:"#5fb3a8", pink:"#d4748c",
  muted:"rgba(240,238,234,.55)", dim:"rgba(240,238,234,.35)", border:"rgba(232,201,122,.18)",
  bg:"#0a0d14", bgCard:"#111827", bgSurf:"#1a2235", bgElev:"#1f2d42",
};
const cardBox = { background:"linear-gradient(160deg,#131d2e,#0d1520)", border:`1px solid ${C.border}`, borderRadius:22, padding:"32px 24px 24px", maxWidth:420, width:"100%", textAlign:"center", position:"relative", overflow:"hidden", boxShadow:"0 0 60px rgba(232,201,122,.06),0 24px 80px rgba(0,0,0,.6)" };
const btnGold = { background:"linear-gradient(135deg,#c9a84c,#a07832)", color:"#0a0d14", border:"none", borderRadius:14, padding:"13px 20px", fontFamily:"'Cinzel',serif", fontSize:15, fontWeight:700, letterSpacing:1, cursor:"pointer", width:"100%" };
const btnGhost = { background:"rgba(255,255,255,.04)", border:`1px solid ${C.border}`, borderRadius:10, padding:"9px 20px", color:"rgba(240,238,234,.6)", fontFamily:"inherit", fontSize:13, cursor:"pointer" };

/* ── TopBar ── */
function TopBar({ topic }) {
  return h("div", { style:{ position:"sticky", top:0, zIndex:100, background:"rgba(10,13,20,.92)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.border}`, padding:"12px 20px" } },
    h("div", { style:{ maxWidth:680, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" } },
      h("span", { style:{ fontFamily:"'Cinzel',serif", fontSize:17, color:C.gold, letterSpacing:2 } }, "🌙 PJOracles"),
      topic && h("span", { style:{ fontSize:12, color:C.pink, background:"rgba(212,116,140,.1)", border:"1px solid rgba(212,116,140,.3)", borderRadius:20, padding:"3px 10px" } }, topic)
    )
  );
}

/* ══ SCREEN 1: INTRO ══ */
function ScreenIntro({ onNext }) {
  const [topic, setTopic]   = useState("");
  const [customQ, setCustomQ] = useState("");
  const isCustom   = topic === CUSTOM_KEY;
  const finalTopic = isCustom ? customQ.trim() : topic;
  const canGo      = topic && (!isCustom || customQ.trim().length > 0);

  return h("div", { style:{ position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:20 } },
    h("div", { style:cardBox },
      h("div", { style:{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:200, height:2, background:"linear-gradient(90deg,transparent,#e8c97a,transparent)" } }),
      h("div", { style:{ color:C.goldDim, letterSpacing:6, fontSize:13, marginBottom:14, opacity:.7 } }, "✦ ✧ ✦"),
      h("div", { className:"moon-float", style:{ fontSize:52, marginBottom:10, filter:"drop-shadow(0 0 18px rgba(232,201,122,.5))" } }, "🌙"),
      h("h2", { style:{ fontFamily:"'Cinzel',serif", fontSize:26, color:C.gold, letterSpacing:3, marginBottom:4 } }, "PJOracles"),
      h("p",  { style:{ fontSize:13, color:C.muted, marginBottom:20, letterSpacing:1 } }, "หมอดูชุดนอน"),
      h("p",  { style:{ fontSize:15, lineHeight:1.7, marginBottom:22 } },
        "วันนี้จักรวาลมีอะไรจะบอกคุณ?", h("br"),
        h("span", { style:{ color:C.goldDim, fontSize:14 } }, "ตั้งคำถามในใจแล้วเริ่มได้เลย 🔮")
      ),
      h("p", { style:{ fontSize:12, color:C.muted, textTransform:"uppercase", letterSpacing:1.5, marginBottom:10 } }, "เลือกหัวข้อที่อยากถาม"),
      h("div", { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom: isCustom ? 12 : 20 } },
        ...TOPICS.map(t => h("button", {
          key:t, onClick:() => { setTopic(t); if(t !== CUSTOM_KEY) setCustomQ(""); },
          style:{ background: topic===t ? "linear-gradient(135deg,#2a1f08,#1a1408)" : C.bgElev, border: topic===t ? `1px solid ${C.gold}` : `1px solid ${C.border}`, borderRadius:8, color: topic===t ? C.gold : C.muted, padding:"10px 8px", fontFamily:"inherit", fontSize:13, cursor:"pointer", boxShadow: topic===t ? "0 0 12px rgba(232,201,122,.18)" : "none", transition:"all .2s" }
        }, t))
      ),
      isCustom && h("div", { style:{ marginBottom:20, textAlign:"left" } },
        h("p", { style:{ fontSize:12, color:C.goldDim, marginBottom:6 } }, "✏️ พิมพ์คำถามของคุณ"),
        h("textarea", {
          value:customQ,
          onChange: e => setCustomQ(e.target.value),
          placeholder:"เช่น ช่วงนี้ควรเปลี่ยนงานไหม? หรือ ความสัมพันธ์นี้จะไปต่อได้ไหม?",
          maxLength:120, rows:3,
          style:{ width:"100%", background:"#0d1520", border:`1px solid rgba(232,201,122,.35)`, borderRadius:10, padding:"10px 12px", color:"#f0eeea", fontFamily:"inherit", fontSize:13, lineHeight:1.7, resize:"none" }
        }),
        h("p", { style:{ fontSize:11, color:C.dim, textAlign:"right", marginTop:3 } }, `${customQ.length}/120`)
      ),
      h("button", {
        onClick:() => canGo && onNext(finalTopic),
        style:{ ...btnGold, opacity: canGo ? 1 : .35, cursor: canGo ? "pointer" : "not-allowed", marginBottom:12 }
      }, "เริ่มดูดวง →"),
      h("p", { style:{ fontSize:11, color:C.dim, lineHeight:1.5 } }, "* ไพ่ทาโรต์เพื่อการพัฒนาตัวเอง ไม่ใช่การพยากรณ์แทนวิจารณญาณ")
    )
  );
}

/* ══ SCREEN 2: PRAYER ══ */
function ScreenPrayer({ onNext }) {
  return h("div", { style:{ position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:20 } },
    h("div", { style:{ ...cardBox, maxWidth:420 } },
      h("div", { style:{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:200, height:2, background:"linear-gradient(90deg,transparent,#e8c97a,transparent)" } }),
      h("div", { style:{ fontSize:48, marginBottom:14 } }, "🙏"),
      h("h3", { style:{ fontFamily:"'Cinzel',serif", color:C.gold, fontSize:16, letterSpacing:2, marginBottom:14 } }, "ตั้งจิตอธิษฐาน"),
      h("p",  { style:{ fontSize:13, lineHeight:1.9, color:"rgba(240,238,234,.8)", background:"rgba(255,255,255,.03)", border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", marginBottom:16, textAlign:"left" } },
        '"ข้าพเจ้า ชื่อ…นามสกุล…เกิดวันที่… ขออนุญาตสิ่งศักดิ์สิทธิ์ ผู้รักษากายสังขารของข้าพเจ้า ขออนุญาตเทพ เทวดา ครูบาอาจารย์ทั้งหลาย ตลอดจนเจ้ากรรมนายเวร เจ้าเกณฑ์ชะตา ในการเปิดดวงชะตาครั้งนี้"'
      ),
      h("p", { style:{ fontSize:13, color:"rgba(232,201,122,.7)", marginBottom:22 } }, "หลังจากนั้น ตั้งคำถามให้แน่วแน่ ชัดเจน ก่อนเลือกไพ่น้า 🌙"),
      h("button", { onClick:onNext, style:btnGold }, "พร้อมแล้ว เลือกไพ่ →")
    )
  );
}

/* ══ FAN SPREAD ══ */
function FanSpread({ deck, picked, size, onPick, onReveal }) {
  const [hovered, setHovered] = useState(null);
  const total  = deck.length;
  const done   = picked.length >= size;
  const FAN    = 160, R = 260, CW = 44, CH = 70;

  return h("div", { style:{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center" } },

    /* status row */
    h("div", { style:{ display:"flex", alignItems:"center", gap:12, margin:"18px 0 6px" } },
      h("div", { style:{ display:"flex", gap:5 } },
        ...Array.from({length:size}).map((_,i) =>
          h("div", { key:i, style:{ width:28, height:40, borderRadius:5, border: i<picked.length ? `1.5px solid ${C.gold}` : "1.5px dashed rgba(232,201,122,.25)", background: i<picked.length ? "rgba(232,201,122,.1)" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, transition:"all .3s" } },
            i < picked.length ? "🃏" : h("span", { style:{ opacity:.2, fontSize:11 } }, "✦")
          )
        )
      ),
      h("p", { style:{ fontSize:13, color: done ? C.gold : C.goldDim, margin:0, fontWeight:600 } },
        done ? "เลือกครบแล้ว! 🎉" : `เหลืออีก ${size - picked.length} ใบ`
      )
    ),

    !done && h("p", { style:{ fontSize:11, color:C.dim, marginBottom:4 } }, "แตะที่ไพ่เพื่อเลือก"),

    /* fan area */
    h("div", { style:{ position:"relative", width:"100%", height: R + CH + 20, overflow:"visible" } },
      ...deck.map((card, i) => {
        const isPicked  = picked.includes(i);
        const pickOrder = picked.indexOf(i);
        const isHov     = hovered === i && !isPicked && !done;
        const deg       = -FAN/2 + (i/(total-1))*FAN;
        const rad       = (deg-90)*Math.PI/180;
        const cx        = Math.cos(rad)*R;
        const cy        = Math.sin(rad)*R;
        const liftY     = isPicked ? -24 : isHov ? -16 : 0;
        const scale     = isPicked ? 1.08 : isHov ? 1.1 : 1;
        const opacity   = isPicked ? 0.3 : done ? 0.5 : 1;

        return h("div", {
          key:i,
          onClick:   () => !isPicked && !done && onPick(i),
          onMouseEnter: () => setHovered(i),
          onMouseLeave: () => setHovered(null),
          style:{
            position:"absolute",
            width:CW, height:CH,
            left:`calc(50% + ${cx}px - ${CW/2}px)`,
            top:`${R + CH/2 + cy - CH/2}px`,
            transform:`rotate(${deg}deg) translateY(${liftY}px) scale(${scale})`,
            transformOrigin:"bottom center",
            transition:"transform .2s ease, opacity .2s",
            cursor: isPicked||done ? "default" : "pointer",
            opacity, borderRadius:6,
            background: isPicked ? "rgba(232,201,122,.06)" : "linear-gradient(170deg,#1e3050,#0d1520)",
            border: isPicked ? `1.5px solid rgba(232,201,122,.4)` : isHov ? `1.5px solid ${C.gold}` : "1.5px solid rgba(232,201,122,.22)",
            boxShadow: isHov ? "0 0 14px rgba(232,201,122,.35),0 6px 20px rgba(0,0,0,.6)" : "0 2px 8px rgba(0,0,0,.5)",
            display:"flex", alignItems:"center", justifyContent:"center",
            zIndex: isHov ? 50 : i, overflow:"hidden",
          }
        },
          !isPicked && h("div", { style:{ position:"absolute", inset:0, background:"repeating-linear-gradient(45deg,rgba(232,201,122,.04) 0px,rgba(232,201,122,.04) 1px,transparent 1px,transparent 6px)" } }),
          h("span", { style:{ fontSize:16, opacity: isPicked ? .06 : .22, pointerEvents:"none" } }, "🌙"),
          isPicked && pickOrder >= 0 && h("div", { style:{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" } },
            h("span", { style:{ background:C.gold, color:"#0a0d14", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800 } }, pickOrder+1)
          )
        );
      })
    ),

    done && h("div", { style:{ textAlign:"center", marginTop:16, marginBottom:8 } },
      h("button", { onClick:onReveal, style:{ ...btnGold, width:"auto", padding:"12px 44px", fontSize:14 } }, "🔮 เปิดไพ่ทั้งหมด")
    )
  );
}

/* ══ SCREEN 3: PICK ══ */
function ScreenPick({ topic, onReveal }) {
  const [size, setSize]       = useState(3);
  const [deck]                = useState(() => buildDeck());
  const [picked, setPicked]   = useState([]);
  const [started, setStarted] = useState(false);

  const startDeal = () => { setPicked([]); setStarted(true); };
  const pickCard  = (idx) => { if(picked.includes(idx) || picked.length >= size) return; setPicked(p => [...p, idx]); };

  const spreadBtn = (n) => h("button", {
    key:n, onClick:() => { setSize(n); setPicked([]); setStarted(false); },
    style:{ background: size===n ? "linear-gradient(135deg,#2a1f08,#1a1408)" : C.bgSurf, border: size===n ? `1px solid ${C.gold}` : `1px solid ${C.border}`, borderRadius:8, color: size===n ? C.gold : C.muted, padding:"8px 22px", fontFamily:"inherit", fontSize:14, cursor:"pointer", transition:"all .2s" }
  }, `${n} ใบ`);

  return h("div", { style:{ position:"relative", zIndex:1 } },
    h(TopBar, { topic }),
    h("div", { style:{ maxWidth:480, margin:"16px auto 0", padding:"0 16px", textAlign:"center" } },
      h("p", { style:{ fontSize:12, color:C.muted, textTransform:"uppercase", letterSpacing:1.5, marginBottom:10 } }, "เลือกจำนวนไพ่"),
      h("div", { style:{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:12 } }, ...[1,3,5].map(spreadBtn)),
      h("button", { onClick:startDeal, style:{ ...btnGold, width:"auto", padding:"11px 36px", fontSize:14 } }, "✨ เริ่มวางไพ่"),
      started && h(FanSpread, { deck, picked, size, onPick:pickCard, onReveal:() => onReveal(deck, picked, size) })
    )
  );
}

/* ══ SCREEN 4: REVEAL + AI ══ */
function ScreenReveal({ topic, deck, picked, size, onRestart }) {
  const [open, setOpen]         = useState({});
  const [aiText, setAiText]     = useState(null);
  const [aiLoading, setAiLoad]  = useState(true);
  const aiRef = useRef(null);

  const enrich = (card) => {
    const f = CARDS.find(c => c.name.toLowerCase() === card.name.toLowerCase());
    return f || { ...card, emoji:"🃏", element:card.suit, planet:"—", meaning:`ไพ่ ${card.name} — ${card.suit}`, keywords:[card.suit] };
  };
  const cards  = picked.map(i => enrich(deck[i]));
  const getPos = (i) => size===3 ? POS_3[i] : size===1 ? "ไพ่ประจำวัน" : size===11 ? POS_11[i] : `ใบที่ ${i+1}`;

  useEffect(() => {
    if(aiRef.current) aiRef.current.scrollIntoView({ behavior:"smooth", block:"nearest" });
    loadAI();
  }, []);

  const loadAI = async () => {
    const cardList = cards.map((c,i) => `- ตำแหน่ง "${getPos(i)}": ${c.name} (${c.element}) — ${c.meaning}`).join("\n");
    const prompt = `คุณคือ PJOracles หมอดูชุดนอน โทนเป็นกันเองแต่น่าเชื่อถือ พูดเหมือนเพื่อนที่รู้ดวง ใช้ภาษาไทยทั้งหมด\n\nคนนี้มาถามเรื่อง "${topic}" โดยเฉพาะ ขอให้ทุกส่วนเน้นตอบในมุมของ ${topic}\n\nไพ่ที่เปิดได้:\n${cardList}\n\nสรุปภาพรวมเป็น 3 ส่วน ขึ้นต้นด้วย emoji + ชื่อหัวข้อ แล้วขึ้นบรรทัดใหม่เขียนเนื้อหา:\n\n✨ ภาพรวมพลังงาน\n(2-3 ประโยค)\n\n⚠️ สิ่งที่ควรระวัง\n(1-2 ประโยค)\n\n🌙 ข้อความจากจักรวาล\n(1-2 ประโยค ให้กำลังใจ)\n\nห้ามใช้ ** markdown ห้ามใช้ #`;
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800, messages:[{role:"user",content:prompt}] }) });
      const data = await res.json();
      setAiText((data.content||[]).map(b=>b.text||"").join("") || null);
    } catch { setAiText(null); }
    setAiLoad(false);
  };

  const parseAI = (text) => text.split(/\n(?=[✨⚠️🌙])/).map(b => { const lines=b.trim().split("\n"); return { title:lines[0], body:lines.slice(1).join("\n").trim() }; }).filter(b=>b.body);
  const blockColor = (t) => t?.includes("⚠️") ? "#e8a45a" : t?.includes("🌙") ? C.moon : C.teal;

  return h("div", { style:{ position:"relative", zIndex:1 } },
    h(TopBar, { topic }),

    /* cards row */
    h("p", { style:{ fontFamily:"'Cinzel',serif", color:C.gold, fontSize:15, letterSpacing:2, textAlign:"center", margin:"20px 0 14px", textTransform:"uppercase" } }, "ไพ่ที่เปิดได้"),
    h("div", { style:{ display:"flex", gap:12, overflowX:"auto", padding:"10px 16px 16px", WebkitOverflowScrolling:"touch" } },
      ...cards.map((card, i) =>
        h("div", { key:i, style:{ background:"linear-gradient(160deg,#1a2235,#111827)", border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 12px", width:155, flexShrink:0, textAlign:"center" } },
          h("p",  { style:{ fontSize:11, color:C.goldDim, letterSpacing:1, textTransform:"uppercase", marginBottom:8 } }, getPos(i)),
          h("div", {
            onClick:() => setOpen(o => ({...o,[i]:!o[i]})),
            style:{ width:110, height:150, margin:"0 auto 10px", borderRadius:10, border: open[i] ? `2px solid ${C.gold}` : "2px solid rgba(232,201,122,.4)", background:"linear-gradient(160deg,#1e3050,#0d1a2e)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow: open[i] ? "0 0 16px rgba(232,201,122,.18)" : "0 4px 14px rgba(0,0,0,.4)", transition:"all .2s" }
          },
            h("span", { style:{ fontSize:32 } }, card.emoji),
            h("span", { style:{ fontFamily:"'Cinzel',serif", fontSize:10, color:C.goldDim, letterSpacing:.5, textAlign:"center", padding:"4px 4px 0" } }, card.name)
          ),
          h("p", { style:{ fontSize:11, color:C.moon, marginBottom:4 } }, `${card.planet} · ${card.element}`),
          h("p", { style:{ fontSize:10, color:C.dim } }, "👉 แตะที่ไพ่"),
          open[i] && h("div", { style:{ marginTop:8, padding:"10px", background:"rgba(10,13,20,.8)", borderRadius:8, border:"1px solid rgba(232,201,122,.1)", fontSize:12, lineHeight:1.75, textAlign:"left" } },
            h("p", { style:{ color:C.goldDim, fontSize:11, marginBottom:4 } }, "ความหมาย:"),
            h("p", { style:{ color:"#f0eeea", marginBottom:6 } }, card.meaning),
            h("p", { style:{ color:C.goldDim, fontSize:11, marginBottom:3 } }, "Keywords:"),
            h("p", { style:{ color:C.moon, fontSize:11 } }, card.keywords.map(k=>"• "+k).join("  "))
          )
        )
      )
    ),

    /* AI Summary */
    h("div", { ref:aiRef, style:{ maxWidth:640, margin:"20px auto", padding:"0 16px" } },
      h("div", { style:{ background:"linear-gradient(160deg,#131d30,#0d1520)", border:"1px solid rgba(95,179,168,.3)", borderRadius:22, padding:"24px 20px", position:"relative", overflow:"hidden" } },
        h("div", { style:{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:160, height:"1.5px", background:"linear-gradient(90deg,transparent,#5fb3a8,transparent)" } }),
        h("div", { style:{ display:"flex", alignItems:"center", gap:10, marginBottom:8 } },
          h("span", { style:{ fontSize:22 } }, "🔮"),
          h("h3",  { style:{ fontFamily:"'Cinzel',serif", fontSize:14, color:C.teal, letterSpacing:1.5 } }, "สรุปภาพรวมจากไพ่ทั้งหมด")
        ),
        h("div", { style:{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(212,116,140,.12)", border:"1px solid rgba(212,116,140,.3)", borderRadius:20, padding:"4px 12px", marginBottom:16 } },
          h("span", { style:{ fontSize:12 } }, "หัวข้อ:"),
          h("span", { style:{ fontSize:13, color:C.pink, fontWeight:600 } }, topic)
        ),
        aiLoading
          ? h("div", { style:{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:24, color:C.muted } },
              h("div", { style:{ width:28, height:28, border:"2px solid rgba(95,179,168,.2)", borderTopColor:C.teal, borderRadius:"50%", animation:"spin .8s linear infinite" } }),
              h("p", null, "กำลังอ่านพลังงานของไพ่...")
            )
          : aiText
            ? parseAI(aiText).map((block,i) =>
                h("div", { key:i, style:{ marginBottom:12, padding:"12px 14px", background:"rgba(255,255,255,.03)", borderRadius:8, borderLeft:`2px solid ${blockColor(block.title)}` } },
                  h("p", { style:{ fontSize:11, color:blockColor(block.title), textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 } }, block.title),
                  h("p", { style:{ fontSize:13, lineHeight:1.85, color:"#f0eeea" } }, block.body)
                )
              )
            : h("div", { style:{ padding:"12px 14px", background:"rgba(255,255,255,.03)", borderRadius:8, borderLeft:`2px solid ${C.teal}` } },
                h("p", { style:{ fontSize:13, color:C.muted } }, "ไม่สามารถโหลด AI Reading ได้ในขณะนี้ ลองดูความหมายของแต่ละใบด้านบนได้เลยน้า 🌙")
              ),
        h("p", { style:{ marginTop:14, fontSize:11, color:C.dim, textAlign:"center" } }, "✦ วิเคราะห์โดย หมอดูชุดนอน AI — ใช้เป็นแนวทางสำหรับการตีความเพิ่มเติม")
      )
    ),

    /* restart */
    h("div", { style:{ textAlign:"center", margin:"8px 0 32px" } },
      h("button", { onClick:onRestart, style:btnGhost }, "🔄 เริ่มใหม่อีกครั้ง")
    ),

    /* CTA footer */
    h("div", { style:{ marginTop:8, padding:"28px 20px 40px", background:"linear-gradient(180deg,transparent,rgba(232,201,122,.04))", borderTop:`1px solid ${C.border}`, textAlign:"center" } },
      h("p", { style:{ fontSize:14, color:C.muted, marginBottom:6 } }, "อยากดูดวงลึกขึ้น?"),
      h("p", { style:{ fontSize:14, color:"#f0eeea", marginBottom:16 } }, "มาคุยกับหมอดูชุดนอนได้ที่"),
      h("div", { style:{ display:"flex", justifyContent:"center", gap:8, marginBottom:14, flexWrap:"wrap" } },
        h("a", { href:"https://www.tiktok.com/@pjoracles", target:"_blank", rel:"noreferrer", style:{ display:"inline-flex", alignItems:"center", gap:6, padding:"9px 18px", borderRadius:12, fontSize:13, fontWeight:600, textDecoration:"none", background:"rgba(255,255,255,.07)", color:"#f0eeea", border:"1px solid rgba(255,255,255,.15)" } }, "▶ TikTok"),
        h("a", { href:"https://www.facebook.com/pjoracles", target:"_blank", rel:"noreferrer", style:{ display:"inline-flex", alignItems:"center", gap:6, padding:"9px 18px", borderRadius:12, fontSize:13, fontWeight:600, textDecoration:"none", background:"rgba(24,119,242,.15)", color:"#6aaeff", border:"1px solid rgba(24,119,242,.3)" } }, "f Facebook"),
        h("a", { href:"https://line.me/R/ti/p/@pjoracles", target:"_blank", rel:"noreferrer", style:{ display:"inline-flex", alignItems:"center", gap:6, padding:"9px 18px", borderRadius:12, fontSize:13, fontWeight:600, textDecoration:"none", background:"rgba(0,185,0,.12)", color:"#4cd964", border:"1px solid rgba(0,185,0,.3)" } }, "LINE @pjoracles")
      ),
      h("p", { style:{ fontFamily:"'Cinzel',serif", fontSize:13, color:C.goldDim, letterSpacing:2, opacity:.7 } }, "🌙 PJOracles — หมอดูชุดนอน")
    ),

    h("style", null, "@keyframes spin{to{transform:rotate(360deg);}}")
  );
}

/* ══ ROOT APP ══ */
function App() {
  const [step, setStep]           = useState("intro");
  const [topic, setTopic]         = useState("");
  const [revealData, setReveal]   = useState(null);

  return h("div", { style:{ fontFamily:"'Sarabun','Prompt',sans-serif", background:"#0a0d14", color:"#f0eeea", minHeight:"100vh", overflowX:"hidden" } },
    step === "intro"  && h(ScreenIntro,  { onNext: t  => { setTopic(t); setStep("prayer"); } }),
    step === "prayer" && h(ScreenPrayer, { onNext: () => setStep("pick") }),
    step === "pick"   && h(ScreenPick,   { topic, onReveal: (d,p,s) => { setReveal({deck:d,picked:p,size:s}); setStep("reveal"); } }),
    step === "reveal" && revealData && h(ScreenReveal, { topic, ...revealData, onRestart: () => { setStep("intro"); setReveal(null); } })
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App));
