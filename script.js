/* ============================================================
   script.js : สคริปต์ควบคุมการทำงานทั้งหมดของเว็บไซต์
   ------------------------------------------------------------
   แบ่งการทำงานเป็น 4 ส่วนใหญ่
     1) quizData   : คลังโจทย์แบบฝึกหัดทั้งหมด
     2) ระบบแท็บ    : สลับหน้า "เนื้อหา" / "แบบฝึกหัด"
     3) ระบบข้อสอบ  : แสดงข้อ -> ตรวจคำตอบ -> คำอธิบาย -> สรุปคะแนน
     4) กระดานวาดรูป : Canvas สำหรับคิดเลข/วาดภาพประกอบ
   ============================================================ */

/* ============================================================
   1) คลังโจทย์ (แก้ไข / เพิ่ม-ลบ ข้อสอบได้ที่นี่)
   ------------------------------------------------------------
   ฟิลด์ของโจทย์แต่ละข้อ
     question    : คำถาม (แทรกแท็ก HTML อื่น ๆ ไม่ได้นอกจากตัวหนา)
     image       : รูปประกอบแบบ SVG ในรูป string  (ถ้าไม่มีภาพใส่ null)
     choices     : ตัวเลือก 4 ข้อ
     correct     : ลำดับคำตอบที่ถูกต้อง (0 = A, 1 = B, 2 = C, 3 = D)
     explanation : คำอธิบายวิธีคิด ที่จะแสดงหลังผู้เรียนตอบ
   ============================================================ */
const quizData = [

  /* ---- ข้อ 1 : ความหนาแน่นสัมพัทธ์ของปรอท (หน้า 1) ---- */
  {
    question: "ปรอทมีความหนาแน่น 13.6×10³ kg/m³ ความหนาแน่นสัมพัทธ์ (S.G.) ของปรอทเป็นเท่าใด (ρน้ำ = 1×10³ kg/m³)",
    image: null,
    choices: ["0.136", "1.36", "13.6", "136"],
    correct: 2,
    explanation: "S.G. = ρปรอท/ρน้ำ = (13.6×10³)/(1×10³) = 13.6 แปลว่าปรอทหนาแน่นเป็น 13.6 เท่าของน้ำ",
  },

  /* ---- ข้อ 2 : บอลลูนฮีเลียม (หน้า 2) ---- */
  {
    question: "บอลลูนบรรจุแก๊สฮีเลียมมีปริมาตร 400 m³ และมวล 65 kg ฮีเลียมในบอลลูนมีความหนาแน่นเท่าใด",
    image: null,
    choices: ["0.16 kg/m³", "1.6 kg/m³", "16 kg/m³", "0.016 kg/m³"],
    correct: 0,
    explanation: "ρ = m/V = 65/400 = 0.1625 ≈ 0.16 kg/m³",
  },

  /* ---- ข้อ 3 : น้ำหนักไม้จาก S.G. (หน้า 2) ---- */
  {
    question: "ไม้ท่อนหนึ่งมีปริมาตร 1 m³ และมีความหนาแน่นสัมพัทธ์ 0.15 จะมีน้ำหนักเท่าใด (g = 10 m/s²)",
    image: null,
    choices: ["15 N", "150 N", "1.5×10³ N", "1.5×10⁴ N"],
    correct: 2,
    explanation: "ρไม้ = 0.15 × 10³ = 150 kg/m³ ⇒ m = ρV = 150×1 = 150 kg ⇒ W = mg = 150×10 = 1.5×10³ N",
  },

  /* ---- ข้อ 4 : ส่งน้ำขึ้นเนิน (หน้า 4) ---- */
  {
    question: "ต้องการส่งน้ำขึ้นไปยังบ้านบนเนินสูงจากระดับปกติ 40 เมตร จะต้องใช้ความดันอย่างน้อยเท่าใด (ρน้ำ = 10³ kg/m³, g = 10 m/s²)",
    image: null,
    choices: ["4×10³ Pa", "4×10⁴ Pa", "4×10⁵ Pa", "4×10⁶ Pa"],
    correct: 2,
    explanation: "Pg = ρgh = (1×10³)(10)(40) = 4×10⁵ Pa",
  },

  /* ---- ข้อ 5 : เรือดำน้ำ (หน้า 4) ---- */
  {
    question: "เรือดำน้ำอยู่ที่ความลึก 100 เมตร น้ำทะเล ρ = 1.024×10³ kg/m³ ความดันเกจที่ตัวเรือเป็นเท่าใด (g = 10 m/s²)",
    image: null,
    choices: ["1.024×10⁵ Pa", "1.024×10⁶ Pa", "1.125×10⁶ Pa", "1.013×10⁵ Pa"],
    correct: 1,
    explanation: "Pg = ρgh = (1.024×10³)(10)(100) = 1.024×10⁶ Pa (ถ้าถามความดันสัมบูรณ์ บวก Patm = 1.013×10⁵ ได้ ≈ 1.125×10⁶ Pa)",
  },

  /* ---- ข้อ 6 : หลอดยูสองของเหลว + ภาพ (หน้า 7) ---- */
  {
    question: "จากรูป ใส่ของเหลว 2 ชนิดที่ไม่ผสมกันในหลอดยู ของเหลวที่หนาแน่นกว่า (ρ₁) มีความสูงเป็นครึ่งหนึ่งของอีกชนิด (h₁ = ½h₂) ความหนาแน่นของชนิดที่หนาแน่นกว่าเป็นกี่เท่าของชนิดที่น้อยกว่า",
    image: `
<svg viewBox="0 0 300 190" role="img" aria-label="หลอดยูใส่ของเหลวสองชนิด">
  <!-- หลอดยู -->
  <path d="M70 15 H130 V140 Q130 165 155 165 Q180 165 180 140 V15 H230 V140 Q230 190 155 190 Q80 190 80 140 Z"
        fill="none" stroke="#20507a" stroke-width="3"/>
  <!-- ของเหลวชนิดที่ 1 (ซ้าย หนาแน่น สูงครึ่งหนึ่ง) -->
  <rect x="73" y="75" width="54" height="85" fill="#2563eb" opacity="0.55"/>
  <!-- ของเหลวชนิดที่ 2 (ขวา สูงกว่า) -->
  <rect x="183" y="35" width="44" height="125" fill="#f59e0b" opacity="0.55"/>
  <!-- ตัวหนังสือ -->
  <text x="88" y="60" font-size="15" fill="#14406b" font-weight="600">ρ₁ h₁</text>
  <text x="196" y="28" font-size="15" fill="#92600a" font-weight="600">ρ₂</text>
  <text x="196" y="120" font-size="15" fill="#92600a" font-weight="600">h₂</text>
</svg>`,
    choices: ["เท่ากัน", "1.5 เท่า", "2 เท่า", "4 เท่า"],
    correct: 2,
    explanation: "ที่ระดับรอยต่อ ρ₁gh₁ = ρ₂gh₂ ⇒ ρ₁/ρ₂ = h₂/h₁ = 2 เท่า (หนาแน่นมากต้องสูงน้อยกว่าจึงสมดุล)",
  },

  /* ---- ข้อ 7 : หลอดยูปรอท + ของเหลว (หน้า 7) ---- */
  {
    question: "หลอดยูข้างล่างบรรจุปรอท เทของเหลวชนิดหนึ่งลงข้างหนึ่งสูง 10 cm ทำให้ระดับปรอทฝั่งนั้นลดลง 2 cm ความหนาแน่นของเหลวเป็นเท่าใด (ρปรอท = 13.6×10³ kg/m³)",
    image: null,
    choices: ["2.72×10³ kg/m³", "5.44×10³ kg/m³", "6.8×10³ kg/m³", "1.36×10⁴ kg/m³"],
    correct: 1,
    explanation: "ปรอทลด 2 cm ฝั่งเดียว อีกฝั่งสูงขึ้น 2 cm ⇒ hHg = 2+2 = 4 cm ที่ระดับรอยต่อ ρAgHA = ρHghHg ⇒ ρA = 13.6×10³ × 4/10 = 5.44×10³ kg/m³",
  },

  /* ---- ข้อ 8 : ระดับน้ำเขื่อนเป็น 2 เท่า (หน้า 9) ---- */
  {
    question: "ถ้าระดับน้ำในแท็งก์สี่เหลี่ยมเพิ่มขึ้นเป็น 2 เท่า แรงดันน้ำทั้งหมดที่กระทำต่อด้านข้างจะเพิ่มขึ้นเป็นกี่เท่า",
    image: null,
    choices: ["2 เท่า", "3 เท่า", "4 เท่า", "8 เท่า"],
    correct: 2,
    explanation: "F = ½ρgLH² แรงแปรผันกับ H² ⇒ F₂/F₁ = (2H₁/H₁)² = 4 เท่า",
  },

  /* ---- ข้อ 9 : ประตูกั้นน้ำสองฝั่ง (หน้า 10) ---- */
  {
    question: "ประตูกั้นน้ำยาว 100 m ฝั่งหนึ่งน้ำเค็มสูง 4 m (ρ=1.4×10³) อีกฝั่งน้ำจืดสูง 6 m (ρ=10³) แรงดันลัพธ์ที่ประตูเป็นเท่าใด (g = 10 m/s²)",
    image: null,
    choices: ["6.8×10⁶ N", "1.12×10⁷ N", "1.8×10⁷ N", "2.92×10⁷ N"],
    correct: 0,
    explanation: "F₁(เค็ม) = ½(1.4×10³)(10)(100)(4²) = 1.12×10⁷ N , F₂(จืด) = ½(10³)(10)(100)(6²) = 1.8×10⁷ N ⇒ ΣF = 1.8×10⁷ − 1.12×10⁷ = 6.8×10⁶ N (ดันไปทางฝั่งน้ำเค็ม)",
  },

  /* ---- ข้อ 10 : ไฮดรอลิก A = 10a (หน้า 13) ---- */
  {
    question: "เครื่องอัดไฮดรอลิกมีพื้นที่หน้าตัดลูกสูบใหญ่เป็น 10 เท่าของลูกสูบเล็ก ถ้าออกแรงกดที่ลูกสูบเล็ก 50 N จะยกน้ำหนักได้เท่าใด",
    image: null,
    choices: ["50 N", "250 N", "500 N", "5000 N"],
    correct: 2,
    explanation: "F/a = W/A ⇒ 50/a = W/(10a) ⇒ W = 50×10 = 500 N (M.A. = 10 เท่า)",
  },

  /* ---- ข้อ 11 : ไฮดรอลิกเส้นผ่านศูนย์กลาง 5:1 (หน้า 14) ---- */
  {
    question: "เครื่องอัดไฮดรอลิกมีเส้นผ่านศูนย์กลางกระบอกใหญ่ต่อเล็กเป็น 5 : 1 จะยกวัตถุหนักได้เป็นกี่เท่าของแรงที่ใช้",
    image: null,
    choices: ["5 เท่า", "10 เท่า", "25 เท่า", "50 เท่า"],
    correct: 2,
    explanation: "W/F = A/a = πR²/πr² = (R/r)² เส้นผ่านศูนย์กลาง 5:1 รัศมีก็ 5:1 ⇒ (5/1)² = 25 เท่า",
  },

  /* ---- ข้อ 12 : ลูกกลมผูกเชือก (หน้า 20) ---- */
  {
    question: "ลูกกลมปริมาตร 0.2 m³ ความหนาแน่น 4.5×10³ kg/m³ ผูกเชือกจุ่มจมมิดในของเหลว ρ = 1.2×10³ kg/m³ แรงตึงเชือกเป็นเท่าใด (g = 10 m/s²)",
    image: null,
    choices: ["2.4×10³ N", "6.6×10³ N", "9.0×10³ N", "1.14×10⁴ N"],
    correct: 1,
    explanation: "mg = ρVg = 4.5×10³×0.2×10 = 9×10³ N , FB = ρfVจมg = 1.2×10³×0.2×10 = 2.4×10³ N ⇒ T = mg − FB = 9×10³ − 2.4×10³ = 6.6×10³ N",
  },

  /* ---- ข้อ 13 : ลูกบาศก์ลอยน้ำ (หน้า 20) ---- */
  {
    question: "วัตถุทรงลูกบาศก์ยาวด้านละ 0.1 m ความหนาแน่น 800 kg/m³ ลอยในน้ำ ผิวบนของวัตถุจะอยู่สูงกว่าผิวน้ำเท่าใด",
    image: null,
    choices: ["1 cm", "2 cm", "5 cm", "8 cm"],
    correct: 1,
    explanation: "ลอย ⇒ ρน้ำ·hจม = ρวัตถุ·H ⇒ 10³·hจม = 800×0.1 ⇒ hจม = 0.08 m ⇒ พ้นน้ำ = 10−8 = 2 cm",
  },

  /* ---- ข้อ 14 : ท่อดับเพลิง + ภาพ (หน้า 23) ---- */
  {
    question: "จากรูปท่อน้ำดับเพลิง น้ำที่ A เร็ว 5 m/s เส้นผ่านศูนย์กลาง A = 8 cm และ B = 4 cm น้ำพุ่งที่ B เร็วเท่าใด",
    image: `
<svg viewBox="0 0 460 150" role="img" aria-label="ท่อดับเพลิงหน้าตัด 8 ซม. ไป 4 ซม.">
  <defs>
    <marker id="arrF" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="#1d6fb8"/>
    </marker>
  </defs>
  <!-- ท่อหดจาก 8 cm เป็น 4 cm -->
  <path d="M15 40 H250 L330 60 H445 V90 H330 L250 110 H15 Z" fill="#cfe8ff" stroke="#20507a" stroke-width="2"/>
  <line x1="40" y1="75" x2="160" y2="75" stroke="#1d6fb8" stroke-width="4" marker-end="url(#arrF)"/>
  <line x1="345" y1="75" x2="443" y2="75" stroke="#1d6fb8" stroke-width="5" marker-end="url(#arrF)"/>
  <text x="45" y="62" font-size="15" fill="#14406b" font-weight="600">d_A = 8 cm , v_A = 5 m/s</text>
  <text x="350" y="52" font-size="15" fill="#14406b" font-weight="600">d_B = 4 cm</text>
  <text x="372" y="112" font-size="15" fill="#14406b" font-weight="600">v_B = ?</text>
</svg>`,
    choices: ["10 m/s", "15 m/s", "20 m/s", "25 m/s"],
    correct: 2,
    explanation: "πr_A²v_A = πr_B²v_B ⇒ (4×10⁻²)²×5 = (2×10⁻²)²×v_B ⇒ 16×5 = 4×v_B ⇒ v_B = 20 m/s (รัศมีเหลือครึ่ง พื้นที่เหลือ 1/4 ความเร็ว 4 เท่า)",
  },

  /* ---- ข้อ 15 : ปีกเครื่องบิน (หน้า 26) ---- */
  {
    question: "เครื่องบินต้องการแรงยก ΔP = 1000 N/m² อากาศใต้ปีกเร็ว 100 m/s ความเร็วอากาศเหนือปีกเท่าใด (ρอากาศ = 1.2 kg/m³)",
    image: null,
    choices: ["≈ 96 m/s", "≈ 104 m/s", "≈ 108 m/s", "≈ 116 m/s"],
    correct: 2,
    explanation: "ΔP = ½ρ(v₁² − v₂²) โดย v₁ เหนือปีก ⇒ 1000 = ½(1.2)(v₁²−10000) ⇒ v₁² ≈ 11667 ⇒ v₁ ≈ 108 m/s (เหนือปีกต้องเร็วกว่า ความดันจึงต่ำกว่า)",
  },
];

/* ============================================================
   0) หน้าแรก : เลือกวิชา
   ------------------------------------------------------------
   เพิ่มวิชาใหม่ = เพิ่ม object ใน array "subjects" ที่เดียว
   - available: true  → กดเข้าเรียนได้ (เนื้อหาอยู่ใน index.html)
   - available: false → การ์ด "เร็วๆ นี้" กดไม่ได้
   ============================================================ */

const subjects = [
  {
    id: "fluid",
    title: "ฟิสิกส์ — พลศาสตร์ของไหล",
    desc: "ความหนาแน่น ความดัน หลอดยู เขื่อน พาสคัล อาร์คิมีดีส สมการต่อเนื่อง และเบอร์นูลลี",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M2 6c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>
      <path d="M2 12c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>
      <path d="M2 18c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"/>
    </svg>`,
    chips: ["11 หัวข้อ", "15 โจทย์", "สรุปสูตร"],
    available: true,
  },
  {
    id: "english",
    title: "ภาษาอังกฤษ — ไวยากรณ์ระดับสูง",
    desc: "Preparatory there, Gerunds (Perfect, Passive, Negative) และ Preparatory it (Subject & Object)",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
      <path d="M6 6h10M6 10h10"/>
    </svg>`,
    chips: ["4 หัวข้อหลัก", "Advanced Grammar"],
    available: true,
  },
  {
    id: "chem",
    title: "เคมี — อัตราการเกิดปฏิกิริยา",
    desc: "อันดับปฏิกิริยา ปัจจัยที่มีผลต่ออัตรา และกำลังกึ่งชีวิต",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 3h6M10 3v6l-5.2 8.7A2 2 0 0 0 6.5 21h11a2 2 0 0 0 1.7-3.3L14 9V3"/>
      <path d="M7.5 15h9"/>
    </svg>`,
    chips: ["เร็วๆ นี้"],
    available: false,
  },
];

const subjectGrid = document.getElementById("subject-grid");
const navTabs = document.getElementById("main-tabs");
const homeSection = document.getElementById("home-section");

/* สร้างการ์ดวิชาทั้งหมดลง grid */
function renderSubjectGrid() {
  if (!subjectGrid) return;
  subjectGrid.innerHTML = subjects.map((s) => `
    <article class="subject-card ${s.available ? "" : "locked"}" data-id="${s.id}"
             role="${s.available ? "button" : "listitem"}"
             aria-disabled="${!s.available}">
      ${s.available ? "" : `<span class="soon-badge">เร็วๆ นี้</span>`}
      <div class="subject-icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
      <div class="subject-meta">
        ${s.chips.map((c) => `<span>${c}</span>`).join("")}
      </div>
      ${s.available ? `<span class="subject-enter">เข้าเรียน →</span>` : ""}
    </article>`).join("");
}

renderSubjectGrid();

/* กดการ์ด = เข้าวิชา (delegate ที่ grid เพราะการ์ดสร้างจาก JS) */
if (subjectGrid) {
  subjectGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".subject-card");
    if (!card || card.classList.contains("locked")) return;
    openSubject(card.dataset.id);
  });
}

/* ============================================================
   1) ระบบสลับหน้า (หน้าแรก <-> เนื้อหาบทเรียน <-> แบบฝึกหัด)
   ------------------------------------------------------------
   หลักการ : มี section สามอัน แสดงเฉพาะอันที่มี class "active"
   - อยู่หน้าแรก   : ซ่อนแถบแท็บ + โลโก้บ้าน (nav/homeLogo.hidden)
   - เข้าวิชาแล้ว  : โชว์โลโก้บ้านมุมซ้าย + แถบแท็บเนื้อหา/แบบฝึกหัด
   ============================================================ */
const homeLogo = document.getElementById("home-logo");
const tabLesson = document.getElementById("tab-lesson");
const tabQuiz = document.getElementById("tab-quiz");
const lessonSection = document.getElementById("lesson-section");
const quizSection = document.getElementById("quiz-section");
/* subjectGrid / navTabs / homeSection ประกาศไว้ในหัวไฟล์ (section 0) แล้ว */

/* กลับหน้าแรก : ซ่อนโลโก้ + แท็บ แล้วโชว์ grid วิชา */
function showHomePage() {
  if (homeLogo && homeLogo.tagName === "BUTTON") {
    homeLogo.hidden = true;
    navTabs.hidden = true;
    homeSection.classList.add("active");
    lessonSection.classList.remove("active");
    quizSection.classList.remove("active");
    window.scrollTo({ top: 0 });
  }
}

/* เข้าวิชา : โชว์โลโก้ + แท็บ แล้วเปิดหน้าเนื้อหาเป็นหน้าแรกของวิชา */
function openSubject(id) {
  const s = subjects.find((x) => x.id === id);
  if (!s || !s.available) return;
  if (id === "fluid") {
    window.location.href = "physics.html";
    return;
  }
  if (id === "english") {
    window.location.href = "english.html";
    return;
  }
  homeLogo.hidden = false;
  navTabs.hidden = false;
  showLessonPage();
}

function showLessonPage() {
  homeSection.classList.remove("active");   // กันค้างจากหน้าแรก
  navTabs.hidden = false;                   // กันแท็บหายถ้าเรียกข้ามลำดับ
  tabLesson.classList.add("active");   tabQuiz.classList.remove("active");
  lessonSection.classList.add("active"); quizSection.classList.remove("active");
  window.scrollTo({ top: 0 });         // เลื่อนกลับขึ้นบนสุดให้ผู้ใช้
}

function showQuizPage() {
  homeSection.classList.remove("active");
  navTabs.hidden = false;
  tabQuiz.classList.add("active");     tabLesson.classList.remove("active");
  quizSection.classList.add("active"); lessonSection.classList.remove("active");
  window.scrollTo({ top: 0 });
  /* ถ้าตอนเปลี่ยนข้อ section ยังซ่อนอยู่ (วัดขนาดไม่ได้)
     ให้ติดตั้งชั้นวาดบนโจทย์ใหม่ตอนที่มาถึงหน้านี้ */
  if (typeof annoPendingSetup !== "undefined" && annoPendingSetup) setupAnnotateLayer();
}

if (homeLogo && homeLogo.tagName === "BUTTON") {
  homeLogo.addEventListener("click", showHomePage);
}
if (tabLesson) tabLesson.addEventListener("click", showLessonPage);
if (tabQuiz) tabQuiz.addEventListener("click", showQuizPage);

/* ============================================================
   2.1) Dark Mode : สวิตช์ลอยมุมขวาบน (จำค่าไว้ใน localStorage)
   ------------------------------------------------------------
   - โหลดค่าที่เคยเลือกจาก localStorage ก่อน
   - ถ้าไม่เคยเลือก ใช้ค่าที่ผู้ใช้ตั้งไว้กับ OS (prefers-color-scheme)
   - การสลับ = เติม/ถอด class "dark" ที่ <html> (CSS แปลงทั้งเว็บ)
   - ยิง event "themechange" ให้ส่วนอื่น (กระดาษวาด/สีปากกา) ปรับตาม
   ============================================================ */
const rootEl = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(mode) {
  const dark = mode === "dark";
  rootEl.classList.toggle("dark", dark);
  try { localStorage.setItem("theme", mode); } catch (e) { /* เงียบไว้ */ }
  if (themeToggle) themeToggle.checked = dark;      // ซิงก์สวิตช์
  /* แจ้งผู้ฟังอื่น เพื่อเปลี่ยนสีกระดาษ/หมึกตามธีม */
  document.dispatchEvent(new CustomEvent("themechange", { detail: { dark } }));
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) { /* เงียบไว้ */ }
applyTheme(savedTheme ||
  (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark" : "light"));

if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    applyTheme(themeToggle.checked ? "dark" : "light");
  });
}

/* ============================================================
   3) ระบบแบบฝึกหัด
   ------------------------------------------------------------
   แนวคิดการทำงาน
   - เก็บ "สถานะ" ปัจจุบันไว้ในตัวแปร currentIndex / score / answered
   - renderQuestion()  วาดโจทย์ข้อปัจจุบันลง #quiz-box
   - selectAnswer()    ตรวจคำตอบทันที + แสดงคำอธิบาย
   - nextQuestion()    ไปข้อถัดไป หรือเรียก showResult()
   - showResult()      สรุปคะแนน + ปุ่มทำใหม่
   ============================================================ */

/* ---- ตัวแปรสถานะของการทำข้อสอบ ---- */
let currentIndex = 0;   // ข้อที่กำลังแสดงอยู่ (เริ่มที่ 0 = ข้อแรก)
let score = 0;          // จำนวนข้อที่ตอบถูก
let answered = false;   // true เมื่อตอบข้อนี้ไว้แล้ว (ป้องกันกดซ้ำ)

/* ---- อ้างอิง element ในหน้าเว็บที่ต้องใช้ ---- */
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const scoreRing = document.getElementById("score-ring");
const scorePercent = document.getElementById("score-percent");
const scoreText = document.getElementById("score-text");
const resultMessage = document.getElementById("result-message");
const retryBtn = document.getElementById("retry-btn");

/* ---- ฟังก์ชัน : วาดโจทย์ข้อปัจจุบันออกทางจอ ---- */
function renderQuestion() {
  const q = quizData[currentIndex];
  answered = false; // เปิดสิทธิ์ให้ตอบข้อนี้ได้อีกครั้ง

  /* ใช้ template string ประกอบ HTML :
     แถบความคืบหน้า / เลขข้อ+คะแนน / โจทย์ / ภาพ(ถ้ามี) / ตัวเลือก / กล่องคำอธิบาย / ปุ่มถัดไป */
  quizBox.innerHTML = `
    <div class="progress-bar">
      <div class="progress-fill" style="width:${(currentIndex / quizData.length) * 100}%"></div>
    </div>
    <div class="quiz-meta">
      <span>ข้อที่ ${currentIndex + 1} / ${quizData.length}</span>
      <span>คะแนน : ${score}</span>
    </div>
    <!-- โซนที่วาด/ขีดเส้นได้ : ครอบคำถาม + ภาพประกอบ (มีทุกข้อ) -->
    <div class="annotate-zone">
      <h2 class="question-text">${q.question}</h2>
      ${q.image ? `<div class="question-image">${q.image}</div>` : ""}
      <!-- ชั้น canvas โปร่งใสวางทับโจทย์ (เปิดโหมดวาดก่อนจึงวาดได้) -->
      <canvas class="annotate-canvas"></canvas>
    </div>
    <div class="annotate-bar">
      <button id="anno-toggle" class="tool-btn">เปิดโหมดวาดบนโจทย์</button>
      <button id="anno-undo" class="tool-btn" hidden>ย้อนกลับ</button>
      <button id="anno-clear" class="tool-btn danger" hidden>ล้าง</button>
      <small class="annotate-hint">ขีดเส้นใต้ / เขียนชื่อตัวแปรบนโจทย์ได้ • ปิดโหมดวาดก่อนเลือกคำตอบ</small>
    </div>
    <div class="choices">
      ${q.choices.map((choice, i) => `
        <button class="choice-btn" data-index="${i}">
          <span class="choice-key">${String.fromCharCode(65 + i)}</span>
          <span>${choice}</span>
        </button>`).join("")}
    </div>
    <div id="feedback" class="feedback" hidden></div>
    <button id="next-btn" class="btn-primary" hidden>
      ${currentIndex === quizData.length - 1 ? "ดูสรุปคะแนน" : "ไปข้อถัดไป"}
    </button>`;

  /* ผูก event click ให้ปุ่มตัวเลือกทุกปุ่ม (dataset.index คือเลข 0-3) */
  quizBox.querySelectorAll(".choice-btn").forEach((btn) =>
    btn.addEventListener("click", () => selectAnswer(Number(btn.dataset.index)))
  );
  /* ปุ่ม "ไปข้อถัดไป" */
  quizBox.querySelector("#next-btn").addEventListener("click", nextQuestion);

  /* ติดตั้งชั้นวาดบนภาพโจทย์ (ถ้าข้อนี้มีภาพ) */
  setupAnnotateLayer();
}

/* ---- ฟังก์ชัน : รับคำตอบ -> ตรวจทันที -> แสดงคำอธิบาย ---- */
function selectAnswer(index) {
  if (answered) return;        // ตอบไปแล้วไม่รับซ้ำ
  answered = true;
  const q = quizData[currentIndex];
  const buttons = quizBox.querySelectorAll(".choice-btn");

  /* ล็อกปุ่มทุกปุ่ม แล้วระบายสี : ข้อที่ถูก=เขียว, ที่ผู้เรียนเลือกผิด=แดง */
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    else if (i === index) btn.classList.add("wrong");
  });

  const isCorrect = index === q.correct;
  if (isCorrect) score++;      // นับคะแนนถ้าตอบถูก

  /* อัปเดตเลขคะแนนบนจอทันที (children[1] = <span>คะแนน</span>) */
  quizBox.querySelector(".quiz-meta").children[1].textContent = `คะแนน : ${score}`;

  /* แสดงกล่องคำอธิบายพร้อมสีตามผล */
  const fb = quizBox.querySelector("#feedback");
  fb.hidden = false;
  fb.classList.add(isCorrect ? "good" : "bad");
  fb.innerHTML = `<strong>${isCorrect ? "ถูกต้อง!" : "ยังไม่ถูกนะ"}</strong><br>${q.explanation}`;

  /* ให้ปุ่มไปต่อปรากฏขึ้น */
  quizBox.querySelector("#next-btn").hidden = false;
}

/* ---- ฟังก์ชัน : ไปข้อถัดไป หรือจบเกม ---- */
function nextQuestion() {
  currentIndex++;
  if (currentIndex < quizData.length) {
    renderQuestion();          // ยังมีข้อต่อไป
  } else {
    showResult();              // ทำครบทุกข้อแล้ว ไปหน้าสรุป
  }
}

/* ---- ฟังก์ชัน : แสดงหน้าสรุปคะแนน ---- */
function showResult() {
  quizBox.hidden = true;       // ซ่อนกล่องคำถาม
  resultBox.hidden = false;    // โชว์กล่องสรุป

  /* คำนวณเปอร์เซ็นต์ และวาดวงกลมด้วย conic-gradient
     (พื้นวงใช้ var(--ring-track) → dark mode สลับสีตามธีมอัตโนมัติ) */
  const pct = Math.round((score / quizData.length) * 100);
  scorePercent.textContent = pct + "%";
  scoreText.textContent = `ได้ ${score} จาก ${quizData.length} ข้อ`;
  scoreRing.style.background =
    `conic-gradient(var(--accent) ${pct}%, var(--ring-track) 0%)`;

  /* เลือกข้อความให้กำลังใจตามระดับคะแนน */
  let msg;
  if (pct === 100)     msg = "เยี่ยมมาก! เข้าใจพลศาสตร์ของไหลอย่างแน่นอน";
  else if (pct >= 70)  msg = "ทำได้ดีมาก เก็บรายละเอียดข้อที่พลาดอีกนิดเดียว";
  else if (pct >= 50)  msg = "พอใช้ได้ ลองทบทวนเนื้อหาแล้วกลับมาลุ้นคะแนนเต็ม";
  else                 msg = "ไม่เป็นไร กลับไปอ่านเนื้อหาอีกรอบ แล้วลองใหม่นะ";
  resultMessage.textContent = msg;

  resultBox.scrollIntoView({ behavior: "smooth" });
}

/* ---- ฟังก์ชัน : เริ่มทำข้อสอบใหม่จากศูนย์ ---- */
function resetQuiz() {
  currentIndex = 0;
  score = 0;
  resultBox.hidden = true;     // ซ่อนหน้าสรุป
  quizBox.hidden = false;      // กลับไปโชว์คำถาม
  renderQuestion();
}
retryBtn.addEventListener("click", resetQuiz);

/* ============================================================
   4) กระดานวาดรูปและคิดเลข (Canvas)
   ------------------------------------------------------------
   หลักการสำคัญ
   - Canvas ตั้งความละเอียดภายในไว้คงที่ 900x480
     แต่ยืด/ย่อด้วย CSS ให้พอดีจอ (มือถือก็ใช้ได้)
   - เวลาวาด ต้อง "แปลงพิกัด" จากขนาดที่เห็นบนจอ
     กลับไปเป็นพิกัดจริงของ canvas ทุกครั้ง (ฟังก์ชัน getPos)
   - รองรับทั้งเมาส์และนิ้วด้วย Pointer Events ไฟล์เดียวจบ
   - ปุ่มย้อนกลับ ทำงานโดย "ถ่ายรูป" canvas เก็บไว้ก่อนวาด
     ทุกครั้ง (getImageData) แล้วค่อยย้อนคืนทีละภาพ
   ============================================================ */
const canvas = document.getElementById("sketch-canvas");
const ctx = canvas.getContext("2d");
const CANVAS_W = 900;                 // ความละเอียดจริงด้านกว้าง
const CANVAS_H = 480;                 // ความละเอียดจริงด้านสูง

/* ผืนผ้าใบเก็บ "เฉพาะเส้น" (พื้นโปร่งใสตลอด)
   สีกระดาษอยู่ที่ CSS background ของ <canvas> แทน
   → เปลี่ยนธีมแล้วภาพที่วาดไว้ไม่หาย + ยางลบเจาะกลับไปเห็นกระดาษ */
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

/* ============================================================
   ระบบวาดภาพใช้ร่วมกัน 2 ผืนผ้าใบ
   ------------------------------------------------------------
   1) กระดาษทด (#sketch-canvas)         : พื้นทึบสีกระดาษ
   2) ชั้นวาดบนโจทย์ (.annotate-canvas) : พื้นโปร่งใสทับภาพโจทย์
   ทั้งสองใช้เครื่องมือชุดเดียวกัน (ปากกา / ยางลบ / สี / ขนาด)
   ============================================================ */

/* ---- สถานะของการวาด (ใช้ร่วมกันทั้งสอง canvas) ---- */
let tool = "pen";                     // เครื่องมือปัจจุบัน : pen / eraser
let penColor = "#1e293b";             // สีปากกา (เริ่มต้น = ดำ)
let brushSize = 3;                    // ขนาดหัวปากกา (ปรับได้ด้วยแถบเลื่อน)
const ERASER_SCALE = 5;               // ยางลบใหญ่กว่าปากกากี่เท่า (ทำให้ลบง่าย)

/* ฟังก์ชันช่วย : คืน "ขนาดจริง" ของหัวปากกา/ยางลบที่กำลังใช้อยู่ */
function currentBrushLogical() {
  return tool === "eraser" ? brushSize * ERASER_SCALE : brushSize;
}

/* ---- ฟังก์ชันช่วย : แปลงพิกัดเมาส์/นิ้ว -> พิกัดบน canvas ที่ระบุ ----
   canvas ถูกย่อขยายด้วย CSS จึงต้องคูณ scale กลับสู่พิกัด bitmap จริง */
function getPosOn(cv, e) {
  const r = cv.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (cv.width / r.width),
    y: (e.clientY - r.top) * (cv.height / r.height),
  };
}

/* ---- ฟังก์ชันช่วย : ต่อเส้นหนึ่งท่อนบน context ที่ระบุ ----
   ยางลบ "ทุกผืน" ใช้ destination-out = เจาะ pixel ให้โปร่งใส
   (กระดาษทดเป็นพื้นโปร่งใส + สีกระดาษอยู่ที่ CSS background
    → ลบแล้วเห็นสีกระดาษปัจจุบันขึ้นมาแทน และ "สลับธีมได้
      โดยภาพที่วาดไว้ไม่หาย" เพราะ bitmap เก็บแต่เส้น) */
function drawSegment(c, p) {

  c.lineCap = "round";
  c.lineJoin = "round";
  if (tool === "eraser") {
    c.globalCompositeOperation = "destination-out";  // เจาะให้โปร่งใส
    c.lineWidth = currentBrushLogical();
  } else {
    c.globalCompositeOperation = "source-over";
    c.strokeStyle = penColor;
    c.lineWidth = currentBrushLogical();
  }
  c.lineTo(p.x, p.y);
  c.stroke();
}

/* ---- ฟังก์ชันช่วย : ติดตั้ง event การวาดให้ canvas หนึ่งอัน ----
   cfg = { canvas, transparent, onStrokeStart() }
   onStrokeStart ถูกเรียกก่อนเริ่มวาดทุกครั้ง (ไว้เก็บ snapshot undo) */
function attachDraw(cfg) {
  let drawing = false;                 // สถานะ "กำลังลากวาด" ของ canvas นี้

  /* แตะ/คลิกลง = เริ่มเส้นใหม่ */
  cfg.canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    cfg.canvas.setPointerCapture(e.pointerId);  // ลากออกนอก canvas ก็วาดต่อ
    cfg.onStrokeStart();
    drawing = true;
    const p = getPosOn(cfg.canvas, e);
    const c = cfg.canvas.getContext("2d");
    c.beginPath();
    c.moveTo(p.x, p.y);
  });

  /* ลาก = ต่อเส้นจากจุดก่อนหน้า */
  cfg.canvas.addEventListener("pointermove", (e) => {
    if (!drawing) return;
    drawSegment(cfg.canvas.getContext("2d"), getPosOn(cfg.canvas, e));
  });

  /* ปล่อยมือ/เมาส์ = จบเส้น */
  ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
    cfg.canvas.addEventListener(ev, () => { drawing = false; })
  );
}

/* ---- วงกลมพรีวิวขนาดปากกา/ยางลบ (เฉพาะเมาส์ ไม่โชว์บนจอสัมผัส) ----
   div วงกลมโปร่งตัวลอยตามเมาส์ ขนาด = หัวแปรงจริง × สเกลบนจอ */
const brushCursor = document.getElementById("brush-cursor");

function updateBrushCursor(cv, e) {
  const r = cv.getBoundingClientRect();
  const scale = r.width / cv.width;                // ขนาดบนจอ ÷ ขนาด bitmap
  const d = Math.max(currentBrushLogical() * scale, 4);  // อย่าให้เล็กกว่า 4px
  brushCursor.style.width = `${d}px`;
  brushCursor.style.height = `${d}px`;
  brushCursor.style.left = `${e.clientX}px`;
  brushCursor.style.top = `${e.clientY}px`;
}

/* ผูก event วงกลมพรีวิวให้ canvas ที่ระบุ (ใช้ได้ทั้งกระดาษทด/ชั้นโจทย์) */
function attachBrushCursor(cv) {
  cv.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "touch") brushCursor.hidden = false;
  });
  cv.addEventListener("pointermove", (e) => {
    if (!brushCursor.hidden && e.pointerType !== "touch") updateBrushCursor(cv, e);
  });
  cv.addEventListener("pointerleave", () => { brushCursor.hidden = true; });
}
window.addEventListener("scroll", () => { brushCursor.hidden = true; });

/* ---------- ติดตั้งระบบวาดให้กระดาษทด ---------- */
const padUndoStack = [];    // snapshot ของกระดาษทด (ใช้กับปุ่มย้อนกลับ/ล้าง)

attachDraw({
  canvas,
  onStrokeStart: () => {
    padUndoStack.push(ctx.getImageData(0, 0, CANVAS_W, CANVAS_H));
    if (padUndoStack.length > 25) padUndoStack.shift();   // เก็บสูงสุด 25 สเต็ป
  },
});
attachBrushCursor(canvas);

/* ---- ผูกปุ่มเครื่องมือทั้งหมด ---- */
const penBtn = document.getElementById("pen-btn");
const eraserBtn = document.getElementById("eraser-btn");
const undoBtn = document.getElementById("undo-btn");
const clearBtn = document.getElementById("clear-btn");
const swatches = document.querySelectorAll(".swatch");

/* เลือกปากกา : เน้นปุ่ม + ใช้สีล่าสุดที่เลือกไว้ */
penBtn.addEventListener("click", () => {
  tool = "pen";
  penBtn.classList.add("active");
  eraserBtn.classList.remove("active");
});

/* เลือกยางลบ : ยางลบคือการวาดทับด้วยสีกระดาษนั่นเอง */
eraserBtn.addEventListener("click", () => {
  tool = "eraser";
  eraserBtn.classList.add("active");
  penBtn.classList.remove("active");
});

/* เลือกสี : เปลี่ยนสีปากกา + สลับไปเป็นโหมดปากกาให้อัตโนมัติ */
swatches.forEach((sw) =>
  sw.addEventListener("click", () => {
    penColor = sw.dataset.color;
    swatches.forEach((s) => s.classList.remove("active"));
    sw.classList.add("active");
    if (tool !== "pen") penBtn.click();       // กดปุ่มปากกาให้เองเลย
  })
);

/* ย้อมสี "เฉพาะเส้นหมึกธีมเดิม" (ดำ↔ขาว) ให้เป็นหมึกธีมใหม่
   ใช้ได้กับทุกผืนผ้าใบ (กระดาษทด + ชั้นวาดบนโจทย์)
    สีอื่น (แดง/น้ำเงิน/เขียว) ที่ผู้เรียนเลือกเอง → เก็บสีเดิมไว้ไม่แตะ
   เปลี่ยนแค่ RGB คง alpha เดิม → ขอบเส้นหนืดยังเนียน
   fromHex = หมึกธีมก่อนสลับ (track ด้วย lastInk)
   tol     = ความคลาดสีที่ยอมรับ (กัน pixel เกือบเป๊ะหลุด) */

/* ---------- หมึกธีม + สีปากกาค่าเริ่มต้นตามธีม ----------
   โหมดสว่าง → ดำ (#1e293b) , โหมดมืด → ขาว (#f8fafc) */
const INK_LIGHT = "#1e293b";
const INK_DARK  = "#f8fafc";

function currentInk() {
  return rootEl.classList.contains("dark") ? INK_DARK : INK_LIGHT;
}

function syncPenWithTheme() {
  const c = currentInk();
  const first = swatches[0];
  if (!first) return;
  first.dataset.color = c;
  first.style.background = c;
  if (first.classList.contains("active")) penColor = c;
}

let lastInk = null;               // หมึกที่เส้นทั้งสองผืน "ล่าสุด" ใช้

function recolorCanvasStrokes(c, w, h, fromHex, toHex, tol = 14) {
  const img = c.getImageData(0, 0, w, h);
  const d = img.data;
  const fr = parseInt(fromHex.slice(1, 3), 16);
  const fg = parseInt(fromHex.slice(3, 5), 16);
  const fb = parseInt(fromHex.slice(5, 7), 16);
  const tr = parseInt(toHex.slice(1, 3), 16);
  const tg = parseInt(toHex.slice(3, 5), 16);
  const tb = parseInt(toHex.slice(5, 7), 16);
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;                 // ไม่มีเส้น → ข้าม
    if (Math.abs(d[i] - fr) <= tol &&
        Math.abs(d[i + 1] - fg) <= tol &&
        Math.abs(d[i + 2] - fb) <= tol) {
      d[i] = tr; d[i + 1] = tg; d[i + 2] = tb;    // เป็นหมึกเดิม → ย้อมใหม่
    }
  }
  c.putImageData(img, 0, 0);
}

/* เวอร์ชันสั้นสำหรับกระดาษทด */
function recolorStrokes(fromHex, toHex) {
  recolorCanvasStrokes(ctx, CANVAS_W, CANVAS_H, fromHex, toHex);
}

syncPenWithTheme();          // จัดครั้งแรกตามธีมที่โหลดมา
lastInk = currentInk();      // เส้นยังไม่มี แต่ตั้งจุดอ้างอิงไว้ก่อน

/* ตาม event ธีม : สลับสีปากกาค่าเริ่มต้น + ย้อมเส้น "หมึกธีมเดิม"
   ดำ↔ขาวตามธีม ทั้งกระดาษทด "และ" ชั้นวาดบนโจทย์ (ถ้ากำลังแสดงอยู่)
   (สีอื่นคงเดิม / ภาพไม่หาย / snapshot เก่าใน undo ยังสีเดิมตอนวาด) */
document.addEventListener("themechange", () => {
  const prev = lastInk;
  syncPenWithTheme();
  const next = currentInk();
  if (prev && prev !== next) {
    recolorStrokes(prev, next);
    /* ชั้นวาดบนโจทย์ข้อปัจจุบัน (ถ้ามี canvas อยู่บนจอ) */
    if (annoCanvasEl) {
      recolorCanvasStrokes(
        annoCanvasEl.getContext("2d"),
        annoCanvasEl.width, annoCanvasEl.height,
        prev, next
      );
    }
  }
  lastInk = next;
});

/* ย้อนกลับ : ดึง snapshot ล่าสุดของกระดาษทดออกมาวางคืน */
undoBtn.addEventListener("click", () => {
  if (padUndoStack.length > 0) ctx.putImageData(padUndoStack.pop(), 0, 0);
});

/* ล้างทั้งหมด : เก็บภาพไว้ก่อน (กดย้อนกลับได้) แล้วเคลียร์เส้นทั้งหมด
   (พื้นกระดาษเป็น CSS จึงแค่ clearRect) */
clearBtn.addEventListener("click", () => {
  padUndoStack.push(ctx.getImageData(0, 0, CANVAS_W, CANVAS_H));
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
});

/* ---- แถบเลื่อนปรับขนาดหัวปากกา/ยางลบ ---- */
const sizeSlider = document.getElementById("brush-size");
const sizeValue = document.getElementById("size-value");
sizeSlider.addEventListener("input", () => {
  brushSize = Number(sizeSlider.value);           // เก็บค่าใหม่
  sizeValue.textContent = sizeSlider.value;       // โชว์ตัวเลขข้างแถบ
});

/* ---- เปิด/ปิดแผงพื้นที่คิดเลข (แผงขวา) ---- */
const scratchpad = document.getElementById("scratchpad");
const padToggle = document.getElementById("pad-toggle");
const padCloseBtn = document.getElementById("pad-close");

function setPadOpen(open) {
  /* class "open" ทำให้แผงเลื่อนเข้ามาในจอ (ดู transition ใน style.css) */
  scratchpad.classList.toggle("open", open);
  padToggle.classList.toggle("hidden", open);     // ซ่อนปุ่มลอยตอนแผงเปิด
  scratchpad.setAttribute("aria-hidden", String(!open));
}
padToggle.addEventListener("click", () => setPadOpen(true));
padCloseBtn.addEventListener("click", () => setPadOpen(false));

/* ปิดแบบสะดวก ๆ อีกทาง : กด/แตะ "นอก" แผงก็ปิดเอง
   (ยกเว้น : สิ่งที่อยู่ในแผง และปุ่มเปิดแผงเอง)
   วิธีปิดทั้งหมด = ปุ่ม × มุมขวาบนของแผง / กด Esc / กดนอกแผง */
document.addEventListener("pointerdown", (e) => {
  if (!scratchpad.classList.contains("open")) return;
  if (scratchpad.contains(e.target) || padToggle.contains(e.target)) return;
  setPadOpen(false);
});

/* กดปุ่ม Esc เพื่อปิดแผงได้เช่นกัน */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setPadOpen(false);
});

/* ============================================================
   5) ชั้นวาดบนภาพโจทย์ (Annotation layer)
   ------------------------------------------------------------
   หลักการ : ใส่ canvas โปร่งใส "ทับ" ภาพ SVG ของโจทย์
   - ปกติปิดโหมดวาด (pointer-events:none) เพื่อไม่รบกวนการ scroll
     กดปุ่ม "เปิดโหมดวาด" แล้วจึงลากวาด/ลบบนภาพได้
   - ยางลบแบบ destination-out = เจาะให้โปร่งใส ภาพโจทย์ใต้ผืน canvas
     จะโผล่กลับมาเหมือนการลบจริง
   - ขนาด bitmap = ขนาดจริงที่ภาพแสดง × devicePixelRatio (คมชัด)
     เปลี่ยนข้อใหม่ = สร้างชั้นวาดใหม่เริ่มจากศูนย์
   ============================================================ */
let annoActive = false;        // โหมดวาดบนโจทย์เปิดอยู่หรือไม่
let annoUndoStack = [];        // snapshot ชั้นวาดของข้อปัจจุบัน
let annoCanvasEl = null;       // canvas ชั้นวาดของข้อปัจจุบัน
let annoPendingSetup = false;  // รอติดตั้งใหม่เมื่อ section มองเห็น?

/* เรียกหลัง renderQuestion() : สร้างชั้นวาดให้โจทย์ข้อปัจจุบัน */
function setupAnnotateLayer() {
  annoCanvasEl = quizBox.querySelector(".annotate-canvas");
  if (!annoCanvasEl) {                 // กันเหนียว : ถ้าไม่พบ canvas ให้จบ
    annoPendingSetup = false;
    return;
  }

  /* ถ้า section ถูกซ่อนอยู่ การวัดขนาดจะได้ 0 → ตั้งธงไว้
     แล้วค่อยติดตั้งตอนผู้ใช้กดแท็บ "แบบฝึกหัด" */
  const wrap = annoCanvasEl.parentElement;
  const dpr = window.devicePixelRatio || 1;
  if (wrap.clientWidth === 0) {
    annoPendingSetup = true;
    return;
  }
  annoPendingSetup = false;

  annoCanvasEl.width = Math.round(wrap.clientWidth * dpr);
  annoCanvasEl.height = Math.round(wrap.clientHeight * dpr);
  annoActive = false;
  annoUndoStack = [];
  updateAnnoButtons();

  /* ติดตั้ง event วาด + วงกลมพรีวิว (element ใหม่ทุกข้อ ต้องผูกใหม่) */
  attachDraw({
    canvas: annoCanvasEl,
    onStrokeStart: () => {
      const c = annoCanvasEl.getContext("2d");
      annoUndoStack.push(c.getImageData(0, 0, annoCanvasEl.width, annoCanvasEl.height));
      if (annoUndoStack.length > 25) annoUndoStack.shift();
    },
  });
  attachBrushCursor(annoCanvasEl);
}

/* เปิด/ปิดโหมดวาด : class .active คือสวิตช์ (คุม pointer-events ใน CSS) */
function toggleAnnoMode() {
  if (!annoCanvasEl) return;
  annoActive = !annoActive;
  annoCanvasEl.classList.toggle("active", annoActive);
  updateAnnoButtons();
}

/* อัปเดตข้อความ/การซ่อนของปุ่มในแถบวาดบนโจทย์ */
function updateAnnoButtons() {
  const t = quizBox.querySelector("#anno-toggle");
  if (!t) return;
  t.textContent = annoActive ? "ปิดโหมดวาด" : "เปิดโหมดวาดบนโจทย์";
  t.classList.toggle("active", annoActive);
  quizBox.querySelector("#anno-undo").hidden = !annoActive;
  quizBox.querySelector("#anno-clear").hidden = !annoActive;
}

/* ผูกปุ่มแถบวาดแบบ delegate ที่ quizBox เพราะปุ่มถูกสร้างใหม่ทุกข้อ */
quizBox.addEventListener("click", (e) => {
  if (e.target.id === "anno-toggle") toggleAnnoMode();

  /* ย้อนกลับ : คืน snapshot ชั้นวาดล่าสุด */
  if (e.target.id === "anno-undo" && annoCanvasEl && annoUndoStack.length > 0) {
    annoCanvasEl.getContext("2d").putImageData(annoUndoStack.pop(), 0, 0);
  }

  /* ล้าง : เคลียร์ทั้งชั้น + ล้างกอง undo */
  if (e.target.id === "anno-clear" && annoCanvasEl) {
    annoCanvasEl.getContext("2d").clearRect(0, 0, annoCanvasEl.width, annoCanvasEl.height);
    annoUndoStack = [];
  }
});

/* ============================================================
   6) พื้นที่คำนวณแบบรวม : contenteditable div เดียว
   ------------------------------------------------------------
   ผู้เรียนพิมพ์แบบง่าย ๆ ใน #calc-editor
     ^  = ยกกำลัง        เช่น v^2 , ^{n+1}
     _  = ตัวห้อย        เช่น v_1 , P_{atm}
     a/b , (a)/(b) = เศษส่วน
   ------------------------------------------------------------
   เทคนิคกันบั๊ก cursor (สำคัญ!)
   - เก็บ "ข้อความดิบ" ของแต่ละชิ้นส่วนไว้ใน rawMap (WeakMap)
   - ทุกครั้งที่พิมพ์ : ถอดข้อความดิบจาก DOM + หาตำแหน่ง caret
     ในหน่วย "ดัชนีข้อความดิบ" -> เรนเดอร์ HTML ใหม่ -> วาง caret
     กลับตำแหน่งเดิม ทำให้พิมพ์ต่อได้เรื่อย ๆ โดย cursor ไม่กระโดด
   ============================================================ */
const calcEditor = document.getElementById("calc-editor");

/* ฟังก์ชันช่วย : escape อักษรพิเศษ HTML */
function escHTML(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ---------- ตัวเรนเดอร์ : 2 ผ่าน (mask เศษส่วนก่อน แล้วเดิน token) ----------
   ผ่าน 1 : หาเศษส่วนทั้งหมด [(a)/(b) และ a/b] เก็บเป็น "mask"
            พร้อมกันชนซ้อน/ซ้ำ (occupied[])
   ผ่าน 2 : เดินข้อความที่ถูก mask แล้ว (placeholder \u0001)
            แปลง ^ _ เป็น sup/sub, \n เป็น <br>
            และผลัก anchor (text/br + ช่วงดัชนีข้อความดิบ) ตามลำดับ DOM
   กติกา : เนื้อในเศษส่วน "ไม่แปลงซ้อนอีกชั้น" เพื่อให้
            จำนวน text node = จำนวน anchor เสมอ → mapping caret แม่น */
const TOK_RE = /[\w.\u0E00-\u0E7F]/;   // ตัวอักษร/เลข/จุด/ขีด/ไทย สำหรับ token

function buildEditorHTML(raw, anchors) {
  const n = raw.length;
  const occupied = new Array(n).fill(false);
  const masks = [];                    // {start, end, html, parts:[{at,len}]}
  const openers = /[\s=+\-×÷*·,(]/;    // อักษรที่อนุญาตให้อยู่ "หน้า" a/b
  const closers = /[\s=+×÷*·,)\]%]/;   // อักษรที่อนุญาตให้อยู่ "หลัง" a/b

  /* ผ่าน 1a : เศษส่วนวงเล็บ (a)/(b) */
  const reP = /\(([^()\n]+)\)\/\(([^()\n]+)\)/g;
  let m;
  while ((m = reP.exec(raw))) {
    const st = m.index, en = st + m[0].length;
    const a = m[1], b = m[2];
    const dAt = st + 1 + a.length + 3;             // ข้าม ( ) / (
    let free = true;
    for (let t = st; t < en && free; t++) if (occupied[t]) free = false;
    if (!free) continue;
    for (let t = st; t < en; t++) occupied[t] = true;
    masks.push({
      start: st, end: en,
      html: '<span class="frac"><span class="num">' + escHTML(a) +
            '</span><span class="den">' + escHTML(b) + "</span></span>",
      /* chunk แบ่งสองท่อน : "(a)" กับ "/(b)" → ต่อกันได้ข้อความเดิม
         suf = marker "ท้าย" ที่ต้องเก็บคืน (วงเล็บปิด) เวลา node ถูกพิมพ์ต่อ */
      parts: [
        { at: st + 1, len: a.length, chunk: "(" + a + ")", shift: 1, suf: 1 },
        { at: dAt, len: b.length, chunk: "/(" + b + ")", shift: 2, suf: 1 },
      ],
    });
  }

  /* ผ่าน 1b : เศษส่วนสั้น a/b (ต้องมี token เต็มหน้า-หลัง + ตัวคั่นรอบนอก) */
  for (let i = 0; i < n; i++) {
    if (raw[i] !== "/" || occupied[i]) continue;

    let s = i - 1;                                  // หาเศษ (token ย้อนหลัง)
    while (s >= 0 && !occupied[s] && TOK_RE.test(raw[s])) s--;
    const num = raw.slice(s + 1, i);
    if (!num) continue;

    let e = i + 1;                                  // หาตัวส่วน (token เดินหน้า)
    while (e < n && !occupied[e] && TOK_RE.test(raw[e])) e++;
    const den = raw.slice(i + 1, e);
    if (!den) continue;

    const okPrev = s < 0 || occupied[s] || openers.test(raw[s]);
    const okNext = e >= n || occupied[e] || closers.test(raw[e]);
    if (!okPrev || !okNext) continue;

    let free = true;
    for (let t = s + 1; t < e && free; t++) if (occupied[t]) free = false;
    if (!free) continue;
    for (let t = s + 1; t < e; t++) occupied[t] = true;
    masks.push({
      start: s + 1, end: e,
      html: '<span class="frac"><span class="num">' + escHTML(num) +
            '</span><span class="den">' + escHTML(den) + "</span></span>",
      /* chunk ต้อง "ต่อกันได้ข้อความเดิมพอดี" : num ไม่มี marker,
         ส่วน den แบก "/" ไว้หน้า → รวมกันได้ num+"/"+den ครบ */
      parts: [
        { at: s + 1, len: num.length, chunk: num, shift: 0, suf: 0 },
        { at: i + 1, len: den.length, chunk: "/" + den, shift: 1, suf: 0 },
      ],
    });
  }

  /* สร้างข้อความฉบับ mask แล้ว (\u0001 แทนเศษส่วนแต่ละอัน) */
  masks.sort((x, y) => x.start - y.start);
  let masked = "";
  let pos = 0;
  for (const mk of masks) {
    masked += raw.slice(pos, mk.start) + "\u0001";
    pos = mk.end;
  }
  masked += raw.slice(pos);

  /* ผ่าน 2 : เดิน token บนข้อความที่ mask แล้ว */
  let html = "";
  let i = 0, rawIdx = 0, mkPtr = 0;

  while (i < masked.length) {
    const ch = masked[i];

    /* placeholder เศษส่วน : ต้องคัดลอก chunk/shift ของ part มาด้วย
       (chunk = ข้อความดิบรวม marker เช่น "(a)" , "/(b)") */
    if (ch === "\u0001") {
      const mk = masks[mkPtr++];
      html += mk.html;
      for (const p of mk.parts) {
        anchors.push({
          type: "t", start: p.at, len: p.len,
          chunk: p.chunk, shift: p.shift || 0, suf: p.suf || 0,
        });
      }
      rawIdx = mk.end;
      i++; continue;
    }

    /* ขึ้นบรรทัดใหม่ */
    if (ch === "\n") {
      html += "<br>";
      anchors.push({ type: "br", start: rawIdx, len: 1, chunk: "\n", shift: 0, suf: 0 });
      i++; rawIdx++; continue;
    }

    /* ^{..} หรือ ^x → ยกกำลัง
       chunk = ทั้งก้อนรวม marker (^ { }) , shift = marker หน้า ,
       suf = marker ท้าย ( "}" เฉพาะแบบปีกกา) — ใช้ประกอบคืนตอน node
       ถูกพิมพ์ต่อภายใน (ไม่งั้น ^ _ / จะหาย format สลาย) */
    if (ch === "^") {
      const braceM = /^\^\{([^}\u0001\n]+)\}/.exec(masked.slice(i));
      const oneM = !braceM && /^\^([+-]?\w+)/.exec(masked.slice(i));
      const mm = braceM || oneM;
      if (mm) {
        const inner = mm[1];
        const at = rawIdx + mm[0].length - inner.length - (braceM ? 1 : 0);
        html += "<sup>" + escHTML(inner) + "</sup>";
        anchors.push({
          type: "t", start: at, len: inner.length,
          chunk: mm[0],
          shift: mm[0].length - inner.length - (braceM ? 1 : 0),
          suf: braceM ? 1 : 0,
        });
        i += mm[0].length; rawIdx += mm[0].length; continue;
      }
    }

    /* _{..} หรือ _x → ตัวห้อย (เช่นเดียวกับ ^) */
    if (ch === "_") {
      const braceM = /^_\{([^}\u0001\n]+)\}/.exec(masked.slice(i));
      const oneM = !braceM && /^_([+-]?\w+)/.exec(masked.slice(i));
      const mm = braceM || oneM;
      if (mm) {
        const inner = mm[1];
        const at = rawIdx + mm[0].length - inner.length - (braceM ? 1 : 0);
        html += "<sub>" + escHTML(inner) + "</sub>";
        anchors.push({
          type: "t", start: at, len: inner.length,
          chunk: mm[0],
          shift: mm[0].length - inner.length - (braceM ? 1 : 0),
          suf: braceM ? 1 : 0,
        });
        i += mm[0].length; rawIdx += mm[0].length; continue;
      }
    }

    /* อักษรธรรมดา : รวมติดกันจนถึงอักษรพิเศษ/placeholder ถัดไป (เร็ว) */
    let j = i;
    while (j < masked.length && masked[j] !== "\n" && masked[j] !== "\u0001" &&
           masked[j] !== "^" && masked[j] !== "_") j++;
    if (j === i) j = i + 1;
    const seg = masked.slice(i, j);
    html += escHTML(seg);
    anchors.push({ type: "t", start: rawIdx, len: j - i, chunk: seg, shift: 0, suf: 0 });
    rawIdx += j - i;
    i = j;
  }
  return html;
}

/* ---------- แผนที่ข้อความดิบ ----------
   rawMap : Text node -> { chunk, shift, suf }
   - chunk = ข้อความดิบ "รวม marker" ของก้อนนั้น (เช่น "^2", "/A_2", "(a)")
   - shift = จำนวน marker "หน้า" เนื้อความ , suf = marker "ท้าย"
   ต่อ chunk ทุก node เรียงกัน = ได้ข้อความดิบเดิมครบทุกตัวอักษร */
const rawMap = new WeakMap();

/* ---------- ถอดข้อความดิบจาก DOM + หาตำแหน่ง caret ----------
   - node ยาวตรงเนื้อความ (ไม่ถูกแก้)      → ใช้ chunk เดิม
   - node ถูกพิมพ์ต่อ/ลบ "ภายใน"          → ประกอบ marker หน้า-หลัง
     คืนรอบข้อความใหม่ (เช่น "_2" + พิมพ์ x → "_2x") ← จุดที่กัน
     A_2 สลายเป็น A2 !
   - node ใหม่โดยสิ้นเชิง (merge/paste)    → ใช้ข้อความจริง */
function domToRaw(caret) {
  let raw = "";
  let caretRaw = -1;

  function visit(node) {
    if (node.nodeType === 3) {                       // text node
      const info = rawMap.get(node);
      let piece, shift;
      if (info) {
        const contentLen = info.chunk.length - info.shift - info.suf;
        if (node.data.length === contentLen) {
          piece = info.chunk;                        // ไม่ถูกแก้ → ของเดิม
        } else {
          /* ถูกแก้ภายใน : คง marker หน้า-หลัง ครอบข้อความใหม่ */
          piece = info.chunk.slice(0, info.shift) +
                  node.data +
                  info.chunk.slice(info.chunk.length - info.suf);
        }
        shift = info.shift;
      } else {
        piece = node.data; shift = 0;                // node แปลกปลอม
      }
      if (caret && caret.container === node) {
        caretRaw = raw.length +
          Math.min(Math.max(caret.offset + shift, 0), piece.length);
      }
      raw += piece;
      return;
    }
    if (node.nodeType !== 1) return;

    if (node.nodeName === "BR") {
      if (caret && caret.container === node) caretRaw = raw.length;
      raw += "\n";
      return;
    }

    /* element : เดิน children โดยแทรก \n "เฉพาะระหว่างบล็อกจริง" (DIV/P)
       ห้ามใช้แบบ "ทุก tag ที่ไม่ใช่ BR/SPAN" เพราะ <sub>/<sup> จะโดนนับ
       เป็นบล็อก → แทรก \n กลายเป็น <br> → ตัวเลขตกบรรทัดลงไปเรื่อย ๆ ! */
    const kids = Array.from(node.childNodes);
    let sawBlock = false;
    for (let idx = 0; idx < kids.length; idx++) {
      const c = kids[idx];
      const isBlock = c.nodeType === 1 &&
                      (c.nodeName === "DIV" || c.nodeName === "P");
      if (isBlock && sawBlock) raw += "\n";
      if (caret && caret.container === node && caret.offset === idx) {
        caretRaw = raw.length;                       // caret หน้า child นี้
      }
      if (isBlock) sawBlock = true;
      visit(c);
    }
    /* caret อยู่ท้าย element (offset เกินจำนวน children) */
    if (caret && caret.container === node && caret.offset >= kids.length) {
      caretRaw = raw.length;
    }
  }

  visit(calcEditor);
  return { raw, caretRaw };
}

function setCaretFromRawOffset(root, anchors, target) {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();

  /* ไม่รู้ตำแหน่ง / ไม่มีชิ้นข้อความ → วางท้ายสุด */
  if (target < 0 || anchors.length === 0) {
    range.selectNodeContents(root);
    range.collapse(false);
    sel.removeAllRanges(); sel.addRange(range);
    return;
  }

  for (let k = 0; k < anchors.length; k++) {
    const a = anchors[k];
    if (!a.node) break;
    const end = a.start + a.len;
    if (target <= end) {                    // target อยู่ใน/ก่อนถึงปลาย anchor นี้
      if (a.type === "br") {
        if (target <= a.start) range.setStartBefore(a.node);
        else range.setStartAfter(a.node);
      } else {
        const off = Math.min(Math.max(target - a.start, 0), a.len);
        range.setStart(a.node, off);
      }
      range.collapse(true);
      sel.removeAllRanges(); sel.addRange(range);
      return;
    }
    /* target อยู่ "ช่องว่าง" (ตำแหน่งของ ^ _ / ฯลฯ) :
       วางต่อท้าย anchor ก่อนหน้า = cursor อยู่หลังตัวอักษรสุดท้ายที่เห็น */
  }

  /* เลยชิ้นสุดท้าย → วางท้ายสุด */
  range.selectNodeContents(root);
  range.collapse(false);
  sel.removeAllRanges(); sel.addRange(range);
}

/* ---------- ประสานงานทั้งหมด : input -> เรนเดอร์ -> คืน caret ---------- */
let lastRenderedRaw = "";        // ข้อความดิบที่เรนเดอร์ครั้งล่าสุด
let anchorsCurrent = [];         // anchors คู่กับ DOM ปัจจุบัน
let pendingRefresh = false;
const historyStack = [];         // ประวัติข้อความดิบ (Ctrl+Z ทำเอง)

function historyPush(rawStr) {
  if (!rawStr) return;
  historyStack.push(rawStr);
  if (historyStack.length > 100) historyStack.shift();
}

/* เรนเดอร์ข้อความดิบลง editor : สร้าง HTML + ผูก node เข้า anchors
   + ฝังข้อความดิบของแต่ละ text node ไว้ใช้รอบถัดไป */
function renderRaw(rawStr) {
  const anchors = [];
  calcEditor.innerHTML = rawStr === "" ? "" : buildEditorHTML(rawStr, anchors);

  /* เดินเก็บ text/br node "ตามลำดับ" แล้วจับคู่กับ anchor ตามลำดับเดียวกัน */
  const w = document.createTreeWalker(
    calcEditor,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (n) =>
        n.nodeType === 3 || n.nodeName === "BR"
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP,
    }
  );
  let k = 0, n;
  while ((n = w.nextNode()) && k < anchors.length) {
    const a = anchors[k++];
    a.node = n;
    if (a.type === "t") {
      rawMap.set(n, { chunk: a.chunk, shift: a.shift || 0, suf: a.suf || 0 });
    }
  }
  anchorsCurrent = anchors;
  return anchors;
}

function refreshEditor() {
  pendingRefresh = false;

  /* 1) จำตำแหน่ง caret ปัจจุบัน (ถ้าอยู่ใน editor) */
  let caret = null;
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0 &&
      calcEditor.contains(sel.getRangeAt(0).startContainer)) {
    const r = sel.getRangeAt(0);
    caret = { container: r.endContainer, offset: r.endOffset };
  }

  /* 2) ถอดข้อความดิบ + ตำแหน่ง caret แบบดิบ */
  const { raw, caretRaw } = domToRaw(caret);

  /* 3) ว่างทั้งหมด : เคลียร์โล่ง (placeholder แสดงผ่าน CSS :empty) */
  if (raw.trim() === "") {
    if (lastRenderedRaw !== "") historyPush(lastRenderedRaw);
    lastRenderedRaw = "";
    renderRaw("");
    return;
  }

  /* 4) ไม่เปลี่ยน → ไม่ต้อง rebuild (caret คงอยู่ที่เดิมเอง) */
  if (raw === lastRenderedRaw) return;

  /* 5) เรนเดอร์ใหม่ แล้ววาง caret กลับ "ข้างหลัง" จุดที่พิมพ์เสมอ */
  historyPush(lastRenderedRaw);
  const anchors = renderRaw(raw);
  lastRenderedRaw = raw;
  setCaretFromRawOffset(calcEditor, anchors, caretRaw);
}

calcEditor.addEventListener("input", () => {
  if (pendingRefresh) return;
  pendingRefresh = true;
  requestAnimationFrame(refreshEditor);   // รวมการพิมพ์หลาย ๆ ตัวต่อเฟรม
});

/* Ctrl+Z : ใช้ประวัติของเราเอง (native undo พังเพราะ innerHTML ถูกแทนที่)
   วาด caret ไว้ท้ายสุดของข้อความหลังย้อน */
calcEditor.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    e.preventDefault();
    const prev = historyStack.pop();
    if (prev === undefined) return;
    const anchors = renderRaw(prev);
    lastRenderedRaw = prev;
    setCaretFromRawOffset(calcEditor, anchors, prev.length);
  }
});

/* วางข้อความ : บังคับเป็น plain text เสมอ */
calcEditor.addEventListener("paste", (e) => {
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData("text/plain");
  document.execCommand("insertText", false, text);
});

/* ============================================================
    เริ่มต้นระบบครั้งแรก : สร้างข้อสอบข้อที่ 1 รอไว้เลย (เฉพาะเมื่อมี quizBox)
    ============================================================ */
if (quizBox) {
  renderQuestion();
}
