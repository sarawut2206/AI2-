/* ข้อมูลด่านทั้ง 30 ด่าน — แผนเรียนภาษาอังกฤษ 30 วัน
   ชนิดคำถาม: mc = เลือกคำตอบ, ord = เรียงคำ, ty = พิมพ์คำตอบ
   chain:true = "ประโยคเชื่อมด่าน" (The teacher checks the homework.) */

const mc = (q, o, a, e) => ({ t: "mc", q, o, a, e });
const ord = (q, s, e) => ({ t: "ord", q, s, e });
const ty = (q, a, e) => ({ t: "ty", q, a: [].concat(a), e });
const chain = (x) => Object.assign(x, { chain: true });

const BASE_SENTENCE = "The teacher checks the homework.";

const DAILY_QUESTIONS = [
  "What do you do every day?",
  "What did you do yesterday?",
  "What will you do tomorrow?",
  "What do you like and dislike?",
  "What would you do if you had more time?"
];

const WORLDS = [
  { id: 1, name: "เกาะประโยคพื้นฐาน", en: "Sentence Island", emoji: "🏝️", color: "#16a34a", desc: "สร้างประโยคพื้นฐาน" },
  { id: 2, name: "เมืองแห่งการสื่อสาร", en: "Talk Town", emoji: "🏙️", color: "#2563eb", desc: "ใช้ภาษาเพื่อสื่อสาร" },
  { id: 3, name: "ป่าประโยคซับซ้อน", en: "Complex Forest", emoji: "🌳", color: "#9333ea", desc: "ขยายประโยคให้ละเอียดขึ้น" },
  { id: 4, name: "ปราสาทใช้งานจริง", en: "Real-Life Castle", emoji: "🏰", color: "#ea580c", desc: "นำไปใช้จริง" }
];

const ARTICLE_SCHOOL = {
  title: "A Day at Ban Suan School",
  text: "Every morning, students at Ban Suan School arrive at 7:30. The school, which was built in 1985, has about 600 students. The teachers who work there are friendly and hard-working. Last year, a new library was opened. It is filled with books donated by local families. Mr. Somchai, the English teacher, says that reading is the key to success. “If students read for twenty minutes a day, their English will improve quickly,” he explains. Next month, the school will welcome a group of volunteers from Canada. They are going to teach music and sports. The students are excited because they want to practise speaking English with native speakers. The principal suggested that every class prepare a short welcome song."
};

const ARTICLE_PHONE = {
  title: "Learning a Language with Your Phone",
  text: "Many people want to learn a new language, but they say they do not have time. Today, a smartphone can help. Language apps give short lessons that take only ten minutes. You can study on the bus, during lunch, or before you go to bed. However, apps are not enough. Experts say that learners should also speak with real people. If you practise speaking every day, you will become more confident. Another good idea is to record your voice. When you listen to the recording, you can find your own mistakes. Reading short articles is also useful because it teaches you new words in context. The most important thing is to study a little every day. Ten minutes a day is better than two hours once a week."
};

const LEVELS = [
  /* ================= WORLD 1 ================= */
  {
    id: 1, world: 1, topic: "Parts of Speech + Sentence Structure", title: "ชนิดของคำ + โครงสร้างประโยค",
    goal: "แต่งประโยคเกี่ยวกับตัวเอง 10 ประโยค",
    bridge: "ด่านเริ่มต้น — ทุกด่านต่อจากนี้สร้างบนโครงสร้าง ประธาน + กริยา + กรรม",
    rule: `<p>คำภาษาอังกฤษที่ใช้บ่อยมี 4 ชนิดหลัก</p>
<ul><li><b>Noun</b> คำนาม — teacher, school, book</li>
<li><b>Verb</b> คำกริยา — teach, read, go</li>
<li><b>Adjective</b> คุณศัพท์ ขยายนาม — kind, big, new</li>
<li><b>Adverb</b> คำวิเศษณ์ ขยายกริยา — slowly, well, often</li></ul>
<div class="formula">Subject + Verb + Object (+ สถานที่ + เวลา)</div>
<p>⚠️ ต่างจากภาษาไทย: <b>คุณศัพท์อยู่หน้านาม</b> → <i>a kind teacher</i> (ไม่ใช่ a teacher kind) และทุกประโยคต้องมี <b>กริยา</b> เสมอ → <i>I <b>am</b> a teacher.</i></p>`,
    ex: ["I teach English at school.", "My students read books every day.", "She speaks slowly."],
    qs: [
      mc("ในประโยค “The teacher speaks slowly.” คำว่า slowly เป็นคำชนิดใด", ["Adverb", "Noun", "Verb", "Adjective"], 0, "slowly ขยายกริยา speaks บอกว่าพูดอย่างไร จึงเป็น Adverb"),
      mc("ใน “a beautiful school” คำว่า beautiful เป็นคำชนิดใด", ["Adjective", "Adverb", "Noun", "Verb"], 0, "beautiful ขยายคำนาม school → Adjective"),
      mc("ข้อใดเป็นคำกริยา (Verb)", ["teach", "teacher", "happy", "quickly"], 0, "teach = สอน เป็นการกระทำ"),
      mc("ประโยคใดถูกต้อง", ["I am a teacher.", "I a teacher.", "I teacher am.", "Am I teacher."], 0, "ต้องมีกริยา am และเรียง S + V + ส่วนเติมเต็ม"),
      mc("“ครูใจดี” (คำนามวลี) ภาษาอังกฤษคือ", ["a kind teacher", "a teacher kind", "kind a teacher", "a teacher is kind a"], 0, "คุณศัพท์วางหน้านาม"),
      ord("ฉันสอนภาษาอังกฤษที่โรงเรียน", "I teach English at school.", "S (I) + V (teach) + O (English) + สถานที่"),
      ord("นักเรียนของฉันอ่านหนังสือทุกวัน", "My students read books every day.", "เวลา (every day) มักอยู่ท้ายประโยค"),
      chain(ord("🔗 ประโยคเชื่อมด่าน: “ครูตรวจการบ้าน”", BASE_SENTENCE, "นี่คือประโยคตั้งต้นที่จะติดตัวคุณไปทุกด่าน: The teacher (S) checks (V) the homework (O)"))
    ],
    speak: { prompt: "แนะนำตัวเองสั้น ๆ 5 ประโยค (ใครคุณ ทำอะไร ที่ไหน ชอบอะไร)", qs: ["Who are you?", "What do you do?", "Where do you work?"], model: "My name is Sam. I am a teacher. I teach English at a school in Thailand. I like reading books. My students are very kind.", secs: 60 },
    write: { prompt: "เขียนประโยคเกี่ยวกับตัวเอง (เป้าหมายจริง 10 ประโยค — ในแอปอย่างน้อย 5)", min: 5 }
  },
  {
    id: 2, world: 1, topic: "Determiner", title: "คำนำหน้านาม",
    goal: "เขียนสิ่งของในห้องเรียน 15 รายการ เช่น a book, the door, my pen",
    bridge: "ต่อจากด่าน 1: คำนามที่เรียนแล้ว ต้องมีคำนำหน้าให้ถูก",
    rule: `<ul><li><b>a</b> + เสียงพยัญชนะ → a book, a <u>u</u>niversity (อ่าน ยู)</li>
<li><b>an</b> + เสียงสระ → an apple, an <u>h</u>our (h ไม่ออกเสียง)</li>
<li><b>the</b> = สิ่งที่รู้กันแล้ว / มีหนึ่งเดียว → the door, the sun</li>
<li><b>this / these</b> (ใกล้) — <b>that / those</b> (ไกล)</li>
<li><b>my, your, his, her, our, their</b> = ของ...</li>
<li><b>some</b> (บอกเล่า) — <b>any</b> (ปฏิเสธ/คำถาม)</li>
<li><b>many</b> + นามนับได้ — <b>much</b> + นามนับไม่ได้</li></ul>`,
    ex: ["There is a book on the table.", "This is my pen.", "Do you have any questions?"],
    qs: [
      mc("___ apple", ["an", "a", "the a", "—"], 0, "apple ขึ้นต้นด้วยเสียงสระ"),
      mc("___ hour", ["an", "a", "many", "these"], 0, "hour ไม่ออกเสียง h จึงขึ้นต้นด้วยเสียงสระ"),
      mc("___ university", ["a", "an", "much", "any"], 0, "university ออกเสียง ยู (เสียงพยัญชนะ y)"),
      mc("Please close ___ door. (ประตูห้องนี้ที่รู้กัน)", ["the", "a", "an", "some"], 0, "รู้กันว่าประตูไหน ใช้ the"),
      mc("___ books on my desk are new. (หลายเล่ม อยู่ใกล้)", ["These", "This", "That", "An"], 0, "หลายเล่ม + ใกล้ = These"),
      mc("Do you have ___ questions?", ["any", "some", "a", "much"], 0, "คำถามใช้ any"),
      mc("How ___ water do you drink?", ["much", "many", "a", "an"], 0, "water นับไม่ได้ ใช้ much"),
      chain(ty("🔗 เปลี่ยน the homework เป็น “การบ้านของพวกเขา” — พิมพ์ทั้งประโยค", ["The teacher checks their homework."], "their = ของพวกเขา"))
    ],
    speak: { prompt: "บรรยายห้องเรียนของคุณ ใช้ a / an / the / some / my", qs: ["What is in your classroom?"], model: "In my classroom, there is a big whiteboard. There are some old desks. This is my table, and that is the door.", secs: 60 },
    write: { prompt: "เขียนประโยคเกี่ยวกับสิ่งของในห้องเรียน เช่น There is a clock on the wall.", min: 5, kw: "\\b(a|an|the|this|that|these|those|my|some|any)\\b", kwLabel: "มี determiner" }
  },
  {
    id: 3, world: 1, topic: "Subject–Verb Agreement", title: "ประธานกับกริยาต้องสอดคล้อง",
    goal: "แต่งประโยคเกี่ยวกับนักเรียนและครู 10 ประโยค",
    bridge: "ต่อจากด่าน 1–2: ประธาน (the teacher) กำหนดรูปกริยา (checks)",
    rule: `<div class="formula">He / She / It / คนเดียว + V-s/es<br>I / You / We / They / หลายคน + V</div>
<ul><li>เติม <b>-es</b> หลัง s, sh, ch, x, o → teaches, goes</li>
<li>พยัญชนะ + y → <b>-ies</b> → study → studies</li>
<li>is/are, was/were, has/have, does/do</li>
<li>Everyone / Each student → เอกพจน์ (<i>Everyone <b>is</b> here.</i>)</li>
<li>The students in my class → ดูที่ students (<i><b>are</b></i>)</li></ul>`,
    ex: ["She teaches English.", "My students work hard.", "Each student has a book."],
    qs: [
      mc("She ___ English every day.", ["teaches", "teach", "teaching", "are teach"], 0, "She เอกพจน์ → teaches"),
      mc("My students ___ hard.", ["work", "works", "is work", "working"], 0, "students พหูพจน์ → work"),
      mc("The teacher ___ a car.", ["has", "have", "haves", "are"], 0, "เอกพจน์ใช้ has"),
      mc("Everyone ___ here.", ["is", "are", "be", "am"], 0, "Everyone เป็นเอกพจน์"),
      mc("He ___ (study) every night.", ["studies", "studys", "study", "studyes"], 0, "พยัญชนะ + y → ies"),
      mc("The students in my class ___ friendly.", ["are", "is", "am", "be"], 0, "ประธานจริงคือ students"),
      mc("___ she like coffee?", ["Does", "Do", "Is", "Are"], 0, "she → Does"),
      chain(ty("🔗 เปลี่ยนประธานเป็น The teachers (ครูหลายคน)", ["The teachers check the homework."], "ประธานพหูพจน์ → check (ไม่เติม s)"))
    ],
    speak: { prompt: "พูดเกี่ยวกับนักเรียน 1 คนและครู 1 คนที่คุณรู้จัก", qs: ["Who is your best student?", "What does he or she do every day?"], model: "My best student is Nok. She comes to school early. She reads a lot. Her teacher is Mr. Tom. He teaches science.", secs: 60 },
    write: { prompt: "เขียนประโยคเกี่ยวกับนักเรียนและครู (ระวัง s/es)", min: 5 }
  },
  {
    id: 4, world: 1, topic: "Present Tense", title: "ปัจจุบันกาล",
    goal: "พูดกิจวัตรประจำวัน 1 นาที",
    bridge: "ต่อจากด่าน 3: checks (Present Simple) — ด่านนี้เพิ่ม is checking (กำลังทำ)",
    rule: `<p><b>Present Simple</b> — นิสัย กิจวัตร ความจริง</p>
<div class="formula">S + V1 (s/es)  · always, usually, often, every day</div>
<p><b>Present Continuous</b> — กำลังทำอยู่ตอนนี้</p>
<div class="formula">S + am/is/are + V-ing  · now, right now, at the moment</div>
<p>⚠️ กริยาแสดงความรู้สึก/สภาพ เช่น <i>like, know, want, need</i> ไม่ใช้ -ing</p>`,
    ex: ["I usually get up at 5 a.m.", "Look! The students are playing football.", "Water boils at 100 degrees."],
    qs: [
      mc("I usually ___ up at 5 a.m.", ["get", "am getting", "gets", "got"], 0, "usually = กิจวัตร → Present Simple"),
      mc("Look! The students ___ football.", ["are playing", "play", "plays", "is playing"], 0, "Look! = กำลังเกิด"),
      mc("Water ___ at 100°C.", ["boils", "boil", "is boiling", "boiled"], 0, "ความจริงทางวิทยาศาสตร์"),
      mc("I ___ the answer now.", ["know", "am knowing", "knows", "knowing"], 0, "know เป็น stative verb ไม่ใช้ -ing"),
      mc("What ___ you doing right now?", ["are", "do", "is", "does"], 0, "Continuous ใช้ are + V-ing"),
      mc("คำใดบอกว่าเป็น Present Simple", ["every day", "right now", "at the moment", "Look!"], 0, "every day = ทำเป็นประจำ"),
      ord("ครูกำลังสอนอยู่ตอนนี้", "The teacher is teaching now.", "is + V-ing"),
      chain(ty("🔗 เปลี่ยนเป็น “กำลังตรวจ” (Present Continuous)", ["The teacher is checking the homework."], "is + checking"))
    ],
    speak: { prompt: "เล่ากิจวัตรประจำวันของคุณ 1 นาที (ตื่น → ทำงาน → กลับบ้าน)", qs: ["What do you do every morning?", "What are you doing now?"], model: "I wake up at five thirty. I usually drink coffee and read the news. I go to school at seven. I teach three classes every day. Right now, I am practising English.", secs: 60 },
    write: { prompt: "เขียนกิจวัตรประจำวันของคุณ", min: 5 }
  },
  {
    id: 5, world: 1, topic: "Past & Future Tense", title: "อดีตและอนาคต",
    goal: "พูดเรื่องเมื่อวานและแผนวันพรุ่งนี้",
    bridge: "ต่อจากด่าน 4: ย้ายประโยคไปอดีต (checked) และอนาคต (will check)",
    rule: `<p><b>Past Simple</b> — จบแล้วในอดีต (yesterday, last week, ago)</p>
<div class="formula">S + V2 · ปฏิเสธ/คำถาม: did + V1</div>
<p>กริยาผันไม่ปกติที่ใช้บ่อย: go→went, eat→ate, teach→taught, buy→bought, see→saw, have→had</p>
<p><b>Future</b></p>
<div class="formula">will + V1 (ตัดสินใจทันที/คาดเดา)<br>be going to + V1 (มีแผนแล้ว)</div>`,
    ex: ["I watched a movie yesterday.", "I will call you later.", "We are going to visit Chiang Mai next week."],
    qs: [
      mc("Yesterday I ___ to the market.", ["went", "go", "will go", "goes"], 0, "yesterday → V2"),
      mc("She ___ English last year.", ["taught", "teached", "teach", "teaches"], 0, "teach → taught (ผันไม่ปกติ)"),
      mc("Did you ___ breakfast?", ["eat", "ate", "eaten", "eats"], 0, "did + V1"),
      mc("Tomorrow we ___ a test.", ["will have", "had", "have had", "has"], 0, "tomorrow → will"),
      mc("I’m ___ visit my parents next week. (มีแผนแล้ว)", ["going to", "will", "go to", "going"], 0, "แผนที่ตั้งใจไว้ → be going to"),
      mc("ช่องที่ 2 ของ buy คือ", ["bought", "buyed", "brought", "buy"], 0, "buy → bought (brought มาจาก bring)"),
      ord("เมื่อวานฉันดูหนัง", "I watched a movie yesterday.", "watch → watched"),
      chain(ty("🔗 เปลี่ยนเป็นอดีต (เมื่อวาน)", ["The teacher checked the homework.", "The teacher checked the homework yesterday."], "check → checked")),
      ty("🔗 เปลี่ยนเป็นอนาคต (ใช้ will)", ["The teacher will check the homework.", "The teacher will check the homework tomorrow."], "will + V1")
    ],
    speak: { prompt: "เล่าว่าเมื่อวานทำอะไร และพรุ่งนี้จะทำอะไร", qs: ["What did you do yesterday?", "What will you do tomorrow?"], model: "Yesterday I taught four classes and I checked a lot of homework. In the evening, I cooked dinner. Tomorrow I will go to the market. I am going to buy some fruit.", secs: 60 },
    write: { prompt: "เขียน 3 ประโยคอดีต + 2 ประโยคอนาคต", min: 5, kw: "\\b(will|going to|yesterday|\\w+ed)\\b", kwLabel: "มีอดีตหรืออนาคต" }
  },
  {
    id: 6, world: 1, topic: "Tenses รวม", title: "รวม 3 ช่วงเวลา",
    goal: "เขียนเรื่องสั้น 8 ประโยคที่มี 3 ช่วงเวลา",
    bridge: "รวมด่าน 4–5 และเพิ่ม has checked (ทำเสร็จแล้ว)",
    rule: `<table class="tl"><tr><th></th><th>Simple</th><th>Continuous</th><th>Perfect</th></tr>
<tr><td>อดีต</td><td>checked</td><td>was checking</td><td>had checked</td></tr>
<tr><td>ปัจจุบัน</td><td>checks</td><td>is checking</td><td>has checked</td></tr>
<tr><td>อนาคต</td><td>will check</td><td>will be checking</td><td>will have checked</td></tr></table>
<p><b>Present Perfect</b> = has/have + V3 — ประสบการณ์ / ทำเสร็จแล้ว / ต่อเนื่องถึงปัจจุบัน (already, ever, since, for)</p>
<p>💡 เลือก tense จาก <b>คำบอกเวลา</b> ในประโยค</p>`,
    ex: ["I have worked here since 2015.", "She was watching TV when I called.", "I have already eaten lunch."],
    qs: [
      mc("I ___ in this school since 2015.", ["have worked", "work", "worked", "will work"], 0, "since + ต่อเนื่องถึงปัจจุบัน → Present Perfect"),
      mc("Last night she ___ TV when I called.", ["was watching", "watches", "has watched", "is watching"], 0, "กำลังทำในอดีตแล้วมีเหตุการณ์แทรก"),
      mc("Next year I ___ 40 years old.", ["will be", "am", "was", "have been"], 0, "Next year → will"),
      mc("I have already ___ lunch.", ["eaten", "ate", "eat", "eating"], 0, "have + V3"),
      mc("They ___ to Japan two years ago.", ["went", "have gone", "go", "have went"], 0, "ago → Past Simple"),
      mc("“Every Sunday” ใช้คู่กับ tense ใด", ["Present Simple", "Past Continuous", "Future Perfect", "Present Continuous"], 0, "ทำเป็นประจำ"),
      ord("ฉันจะไปเชียงใหม่พรุ่งนี้", "I will go to Chiang Mai tomorrow.", "tomorrow → will"),
      chain(ty("🔗 เปลี่ยนเป็น “ตรวจเสร็จแล้ว” (Present Perfect)", ["The teacher has checked the homework.", "The teacher has already checked the homework."], "has + V3"))
    ],
    speak: { prompt: "เล่าเรื่องสั้น: เมื่อวาน – วันนี้ – พรุ่งนี้", qs: ["What did you do yesterday?", "What are you doing today?", "What will you do tomorrow?"], model: "Yesterday I visited my mother. Today I am working at school, and I have already taught two classes. Tomorrow I will rest at home.", secs: 60 },
    write: { prompt: "เขียนเรื่องสั้นที่มีทั้งอดีต ปัจจุบัน และอนาคต (เป้าหมาย 8 ประโยค)", min: 6 }
  },
  {
    id: 7, world: 1, boss: true, topic: "BOSS: แนะนำตัวเอง", title: "บอสเกาะ: แนะนำตัวเอง",
    goal: "พูดแนะนำตัวเองโดยไม่ดูโน้ต",
    bridge: "บอสรวมด่าน 1–6 — ใช้ทุกอย่างที่เก็บมาแนะนำตัวเอง",
    pool: [1, 6], poolCount: 7,
    rule: `<p>บอสด่านนี้ทดสอบทุกหัวข้อในเกาะ แล้วให้คุณ <b>แนะนำตัวเองโดยไม่ดูโน้ต</b></p>
<div class="formula">ชื่อ → อาชีพ (Present) → ประสบการณ์ (Present Perfect) → เมื่อวาน (Past) → แผน (Future)</div>`,
    ex: ["Hello, my name is Sam.", "I have been a teacher for ten years.", "Next month I will start a new project."],
    qs: [
      mc("คนต่างชาติพูดว่า “Nice to meet you.” ควรตอบว่า", ["Nice to meet you too.", "Yes, I meet.", "Thank you, bye.", "I am fine, and you?"], 0, "ตอบกลับด้วย too"),
      ord("ฉันเป็นครูมาสิบปีแล้ว", "I have been a teacher for ten years.", "for + ระยะเวลา → Present Perfect"),
      mc("ข้อใดผิด", ["She teach English.", "She teaches English.", "They teach English.", "I teach English."], 0, "She ต้อง teaches")
    ],
    speak: { prompt: "แนะนำตัวเอง 1 นาที โดยไม่ดูโน้ต", qs: ["Could you introduce yourself?"], model: "Hello, my name is Sam. I am an English teacher at a school in Nakhon. I have taught for ten years. Every day I teach young students. Yesterday I prepared a new lesson. Next month I will talk with teachers from other countries.", secs: 60, hideModel: true },
    write: { prompt: "เขียนย่อหน้าแนะนำตัวเอง", min: 5 }
  },

  /* ================= WORLD 2 ================= */
  {
    id: 8, world: 2, topic: "Negative Sentences", title: "ประโยคปฏิเสธ",
    goal: "พูดสิ่งที่ทำและไม่ทำในชีวิตประจำวัน",
    bridge: "ใช้ tense จากเกาะแรก แล้วเติม not ให้ถูกตำแหน่ง",
    rule: `<ul><li>be + not → isn't, aren't, wasn't, weren't</li>
<li>do/does/did + not + <b>V1</b> → don't, doesn't, didn't</li>
<li>will not → won't · have/has not + V3 → haven't/hasn't</li>
<li>never, no, nothing ก็เป็นปฏิเสธ — <b>ห้ามปฏิเสธซ้อน</b> (I don't never ❌)</li></ul>
<div class="formula">She doesn't like coffee. (ไม่ใช่ doesn't likes)</div>`,
    ex: ["I don't eat meat.", "He didn't come yesterday.", "We won't be late."],
    qs: [
      mc("She ___ like coffee.", ["doesn't", "don't", "isn't", "not"], 0, "She → does + not"),
      mc("I ___ go to school yesterday.", ["didn't", "don't", "wasn't", "not"], 0, "อดีต → did not + V1"),
      mc("They ___ happy.", ["aren't", "don't", "doesn't", "isn't"], 0, "happy เป็นคุณศัพท์ ใช้ be"),
      mc("He didn't ___ the book.", ["read", "reads", "readed", "reading"], 0, "หลัง did ใช้ V1"),
      mc("ข้อใดถูกต้อง", ["I never eat meat.", "I don't never eat meat.", "I not eat meat.", "I no eat meat."], 0, "ห้ามปฏิเสธซ้อน"),
      ty("เปลี่ยนเป็นปฏิเสธ: We will travel tomorrow.", ["We will not travel tomorrow.", "We won't travel tomorrow."], "will not / won't"),
      ty("เปลี่ยนเป็นปฏิเสธ: He has finished.", ["He has not finished.", "He hasn't finished."], "has not + V3"),
      chain(ty("🔗 เปลี่ยนเป็นปฏิเสธ", ["The teacher does not check the homework.", "The teacher doesn't check the homework."], "does not + check (ตัด s ออก)"))
    ],
    speak: { prompt: "พูดสิ่งที่คุณทำ และไม่ทำ ในชีวิตประจำวัน", qs: ["What do you do and not do every day?"], model: "I drink coffee every morning, but I don't drink tea. I walk to school. I don't drive. I never eat dinner late.", secs: 60 },
    write: { prompt: "เขียนประโยค ทำ/ไม่ทำ อย่างน้อย 5 ประโยค", min: 5, kw: "(n't|\\bnot\\b|\\bnever\\b|\\bno\\b)", kwLabel: "มีประโยคปฏิเสธ" }
  },
  {
    id: 9, world: 2, topic: "Questions", title: "ประโยคคำถาม",
    goal: "เขียนคำถาม 15 ข้อเพื่อถามชาวต่างชาติ",
    bridge: "ต่อจากด่าน 8: ใช้ do/does/did ตัวเดิม แต่ย้ายไปไว้หน้าประโยค",
    rule: `<div class="formula">Yes/No: Aux + S + V? → Do you…? Is she…? Did he…? Can you…?</div>
<div class="formula">Wh-: Wh + Aux + S + V? → Where do you live?</div>
<p>What (อะไร) Where (ที่ไหน) When (เมื่อไร) Who (ใคร) Why (ทำไม) How (อย่างไร) How long (นานเท่าไร) How much (ราคา/ปริมาณ)</p>
<p>⚠️ ถ้า Who เป็นประธาน ไม่ต้องใช้ do → <i>Who <b>teaches</b> you?</i></p>`,
    ex: ["Where are you from?", "How long have you been in Thailand?", "Do you like Thai food?"],
    qs: [
      mc("___ you like Thai food?", ["Do", "Does", "Are", "Is"], 0, "you → Do"),
      mc("Where ___ she live?", ["does", "do", "is", "did she"], 0, "she → does"),
      mc("___ did you arrive? (ถามเวลา)", ["When", "Where", "Who", "What"], 0, "ถามเวลา → When"),
      ty("เปลี่ยนเป็นคำถาม: She is a nurse.", ["Is she a nurse?"], "ย้าย is ไปหน้าประธาน"),
      ty("เปลี่ยนเป็นคำถาม: They went to Phuket.", ["Did they go to Phuket?"], "did + V1 (went → go)"),
      mc("Who ___ English at your school?", ["teaches", "does teach", "do teaches", "teach does"], 0, "Who เป็นประธาน ไม่ใช้ does"),
      ord("คุณอยู่ที่ประเทศไทยมานานแค่ไหนแล้ว", "How long have you been in Thailand?", "How long + have + S + been"),
      chain(ty("🔗 เปลี่ยนเป็นคำถาม Yes/No", ["Does the teacher check the homework?"], "Does + S + V1"))
    ],
    speak: { prompt: "ถามคำถามชาวต่างชาติ 5 ข้อ (ออกเสียงให้ขึ้นเสียงท้ายคำถาม Yes/No)", qs: ["Where are you from?", "What do you do?", "How long have you been here?", "Do you like Thai food?", "What do you like about Thailand?"], model: "Where are you from? What do you do? How long have you been in Thailand? Do you like Thai food? What do you like about Thailand?", secs: 60 },
    write: { prompt: "เขียนคำถามถามชาวต่างชาติ (เป้าหมาย 15 ข้อ)", min: 5, kw: "\\?", kwLabel: "ลงท้ายด้วย ?" }
  },
  {
    id: 10, world: 2, topic: "Imperative Sentences", title: "ประโยคคำสั่ง ขอร้อง แนะนำ",
    goal: "ฝึกแนะนำเส้นทางและสั่งงานนักเรียน",
    bridge: "ตัดประธานออกจากประโยคด่าน 1 → เหลือกริยาขึ้นต้น = คำสั่ง",
    rule: `<div class="formula">V1 + … → Open your books.<br>Don't + V1 → Don't run.<br>Please + V1 / Could you + V1…? → สุภาพ<br>Let's + V1 → ชวน</div>
<p><b>บอกทาง:</b> Go straight. · Turn left/right. · It's on your left. · next to · opposite · between</p>`,
    ex: ["Open your books to page 10.", "Don't run in the corridor.", "Could you close the window, please?"],
    qs: [
      mc("___ your books to page 10.", ["Open", "Opens", "Opening", "To open"], 0, "ประโยคคำสั่งขึ้นต้นด้วย V1"),
      mc("___ run in the corridor.", ["Don't", "Not", "No", "Doesn't"], 0, "ห้าม = Don't + V1"),
      mc("ประโยคขอร้องแบบสุภาพที่สุด", ["Could you close the window, please?", "Close the window!", "You close window.", "Window close."], 0, "Could you … please?"),
      mc("Let's ___ a break.", ["take", "to take", "taking", "takes"], 0, "Let's + V1"),
      mc("“เดินตรงไป” คือ", ["Go straight.", "Turn back.", "Go left.", "Stop here."], 0, "straight = ตรง"),
      ord("เลี้ยวซ้ายที่ไฟแดง", "Turn left at the traffic light.", "Turn + ทิศ + at + จุด"),
      ord("กรุณาเงียบในห้องเรียน", "Please be quiet in class.", "Please + be + คุณศัพท์"),
      chain(ty("🔗 สั่งนักเรียน “กรุณาตรวจการบ้าน” (ขึ้นต้นด้วย Please)", ["Please check the homework.", "Please check your homework."], "ตัดประธาน ใช้ V1 ขึ้นต้น"))
    ],
    speak: { prompt: "บอกทางจากประตูโรงเรียนไปห้องเรียนของคุณ + สั่งงานนักเรียน 3 คำสั่ง", qs: ["How do I get to your classroom?"], model: "Go straight from the gate. Turn left at the big tree. My classroom is on your right, next to the library. Students, please sit down. Open your books. Don't talk, please.", secs: 60 },
    write: { prompt: "เขียนคำสั่ง/คำขอร้องที่ใช้ในห้องเรียน", min: 5 }
  },
  {
    id: 11, world: 2, topic: "Comparison", title: "การเปรียบเทียบ",
    goal: "เปรียบเทียบโรงเรียน เมือง อาหาร หรือวิธีเดินทาง",
    bridge: "ใช้ Adjective/Adverb จากด่าน 1 มาเปรียบเทียบ",
    rule: `<div class="formula">as + adj + as · adj-er + than · more + adj + than · the + adj-est / the most + adj</div>
<ul><li>1 พยางค์ → -er/-est (big → bigger → biggest)</li>
<li>ลงท้าย y → -ier (easy → easier)</li>
<li>2 พยางค์ขึ้นไป → more/most (more comfortable)</li>
<li>ไม่ปกติ: good → better → best · bad → worse → worst · far → farther</li></ul>`,
    ex: ["Bangkok is bigger than Nan.", "Thai food is spicier than Japanese food.", "This is the best school in the province."],
    qs: [
      mc("Bangkok is ___ than Nan.", ["bigger", "big", "biggest", "more big"], 0, "big → bigger (ซ้ำ g)"),
      mc("This is the ___ school in the province.", ["best", "good", "better", "most good"], 0, "good → best"),
      mc("English is ___ than maths for me.", ["easier", "more easy", "easyer", "easiest"], 0, "y → ier"),
      mc("Trains are ___ than buses.", ["more comfortable", "comfortabler", "most comfortable", "comfortable"], 0, "คำยาวใช้ more"),
      mc("My school is as ___ as yours.", ["big", "bigger", "biggest", "more big"], 0, "as + รูปปกติ + as"),
      mc("Traffic today is ___ than yesterday.", ["worse", "badder", "worst", "more bad"], 0, "bad → worse"),
      ord("อาหารไทยเผ็ดกว่าอาหารญี่ปุ่น", "Thai food is spicier than Japanese food.", "spicy → spicier"),
      chain(ord("🔗 “ครูตรวจการบ้านละเอียดกว่านักเรียน”", "The teacher checks the homework more carefully than the students.", "Adverb ยาว → more carefully"))
    ],
    speak: { prompt: "เปรียบเทียบ 2 สิ่ง เช่น เมืองของคุณกับกรุงเทพฯ", qs: ["Which do you prefer, your hometown or Bangkok? Why?"], model: "Bangkok is bigger and busier than my hometown. My hometown is quieter and cheaper. The food in my hometown is the best. I think life there is more relaxing.", secs: 60 },
    write: { prompt: "เขียนประโยคเปรียบเทียบ", min: 5, kw: "\\b(than|more|most|as \\w+ as|\\w+est)\\b", kwLabel: "มีการเปรียบเทียบ" }
  },
  {
    id: 12, world: 2, topic: "Active–Passive Voice", title: "ประโยคผู้กระทำ ↔ ผู้ถูกกระทำ",
    goal: "เขียนขั้นตอนการทำงาน 5 ขั้นตอน",
    bridge: "ใช้กริยาช่อง 3 จากด่าน 6 (has checked) มาสร้าง is checked",
    rule: `<div class="formula">Passive = S (ผู้ถูกกระทำ) + be + V3 (+ by ผู้ทำ)</div>
<ul><li>ปัจจุบัน: is/are + V3 → The homework <b>is checked</b>.</li>
<li>อดีต: was/were + V3 → The school <b>was built</b> in 1990.</li>
<li>อนาคต: will be + V3 · Perfect: has/have been + V3</li></ul>
<p>ใช้เมื่อ <b>เน้นสิ่งที่ถูกกระทำ</b> หรือไม่รู้ว่าใครทำ — เหมาะกับการเขียนขั้นตอน: <i>First, the rice is washed.</i></p>`,
    ex: ["English is spoken in many countries.", "The school was built in 1990.", "The results will be announced tomorrow."],
    qs: [
      mc("English ___ in many countries.", ["is spoken", "speaks", "is speak", "spoke"], 0, "ภาษาถูกพูด → is + V3"),
      mc("The school ___ in 1990.", ["was built", "built", "is built", "was build"], 0, "อดีต → was + V3"),
      mc("The results ___ tomorrow.", ["will be announced", "will announce", "are announce", "announced"], 0, "อนาคต → will be + V3"),
      mc("ช่องที่ 3 ของ write คือ", ["written", "wrote", "writed", "writing"], 0, "write – wrote – written"),
      ty("เปลี่ยนเป็น Passive: Students clean the classroom.", ["The classroom is cleaned by students.", "The classroom is cleaned by the students."], "กรรม → ประธาน + is + V3 + by"),
      mc("The letter ___ already ___ sent.", ["has / been", "is / be", "have / being", "was / been"], 0, "has been + V3"),
      ord("ขั้นแรก ข้าวถูกล้าง", "First, the rice is washed.", "ขั้นตอนมักใช้ Passive"),
      chain(ty("🔗 เปลี่ยนเป็น Passive", ["The homework is checked by the teacher."], "The homework + is checked + by the teacher"))
    ],
    speak: { prompt: "อธิบายขั้นตอนหนึ่งอย่าง (เช่น หุงข้าว / สมัครเรียน) ด้วย Passive", qs: ["How is rice cooked?"], model: "First, the rice is washed. Then, water is added. Next, the rice cooker is switched on. After twenty minutes, the rice is cooked. Finally, it is served with curry.", secs: 60 },
    write: { prompt: "เขียนขั้นตอนการทำงาน 5 ขั้นตอน (First, Then, Next, After that, Finally)", min: 5, kw: "\\b(is|are|was|were|be|been)\\s+\\w+(ed|en|t)\\b", kwLabel: "มี Passive" }
  },
  {
    id: 13, world: 2, topic: "Reported Speech", title: "เล่าต่อว่าใครพูดอะไร",
    goal: "ฟังบทสนทนาสั้น ๆ แล้วเล่าเนื้อหาใหม่",
    bridge: "ใช้ tense จากเกาะแรก แต่ถอยหลัง 1 ขั้น (checks → checked)",
    rule: `<div class="formula">S + said (that) + ประโยคที่ถอย tense</div>
<ul><li>am/is → was · are → were · V1 → V2 · V2 → had V3</li>
<li>will → would · can → could</li>
<li>I → he/she · today → that day · tomorrow → the next day · yesterday → the day before</li>
<li>คำถาม: asked if/whether + S + V → She asked if I liked tea.</li>
<li>Wh: asked where I lived (ไม่กลับประธาน-กริยา)</li>
<li>คำสั่ง: told me to + V1</li></ul>`,
    ex: ["She said that she was tired.", "He asked if I liked tea.", "The teacher told us to open our books."],
    qs: [
      mc("“I am tired,” she said. → She said that she ___ tired.", ["was", "is", "were", "has"], 0, "am → was"),
      mc("“I will call you.” → He said he ___ call me.", ["would", "will", "can", "is"], 0, "will → would"),
      mc("“I can swim.” → She said she ___ swim.", ["could", "can", "would", "is"], 0, "can → could"),
      mc("“Do you like tea?” → He asked if I ___ tea.", ["liked", "like", "do like", "likes"], 0, "like → liked"),
      mc("“Where do you live?” → She asked me ___.", ["where I lived", "where did I live", "where do I live", "where I live?"], 0, "Reported question เรียง S + V ปกติ"),
      mc("“Open the door.” → He told me ___ the door.", ["to open", "open", "opened", "opening"], 0, "told + O + to V1"),
      mc("คำว่า tomorrow ใน Reported Speech เปลี่ยนเป็น", ["the next day", "yesterday", "that tomorrow", "today"], 0, "tomorrow → the next day"),
      chain(ty("🔗 He said, “The teacher checks the homework.” → เปลี่ยนเป็น Reported Speech", ["He said that the teacher checked the homework.", "He said the teacher checked the homework."], "checks → checked"))
    ],
    speak: { prompt: "กดฟังสิ่งที่ Tom พูด แล้วเล่าต่อด้วย Tom said that...", listen: "I am going to Chiang Mai tomorrow. I will visit my grandmother. She is ninety years old, and she can still cook very well.", qs: ["What did Tom say?"], model: "Tom said that he was going to Chiang Mai the next day. He said he would visit his grandmother. He said that she was ninety years old and she could still cook very well.", secs: 60 },
    write: { prompt: "เล่า 5 สิ่งที่มีคนพูดกับคุณวันนี้ (He said… / She asked… / They told me…)", min: 5, kw: "\\b(said|asked|told)\\b", kwLabel: "มี said/asked/told" }
  },
  {
    id: 14, world: 2, boss: true, topic: "BOSS: สถานการณ์จริง", title: "บอสเมือง: โรงเรียน ร้านอาหาร สนามบิน",
    goal: "จำลองบทสนทนาในโรงเรียน ร้านอาหาร และสนามบิน",
    bridge: "บอสรวมด่าน 8–13 ในสถานการณ์จริง",
    pool: [8, 13], poolCount: 6,
    rule: `<p>ใช้คำถาม (ด่าน 9) คำขอร้อง (ด่าน 10) ปฏิเสธ (ด่าน 8) ในสถานการณ์จริง</p>
<div class="formula">I'd like… · Could I have…? · Excuse me, where is…? · Sorry, I don't understand.</div>`,
    ex: ["I'd like the green curry, please.", "Could I have the bill, please?", "I'm here on holiday."],
    qs: [
      mc("🍽️ Waiter: “Are you ready to order?”", ["Yes, I'd like the green curry, please.", "Yes, I order.", "No, I not ready.", "I am menu."], 0, "I'd like = I would like (สุภาพ)"),
      mc("🛂 Officer: “What is the purpose of your visit?”", ["I'm here on holiday.", "I am purpose.", "Yes, I visit.", "Two weeks ago."], 0, "purpose = จุดประสงค์"),
      mc("🏫 Parent: “How is my son doing in class?”", ["He is doing well, but he should practise speaking more.", "He do well.", "Your son is class.", "Yes, he is."], 0, "ตอบสถานะ + ข้อแนะนำ"),
      mc("“Could I have the bill, please?” หมายถึง", ["ขอเช็คบิล", "ขอเมนู", "ขอน้ำเปล่า", "ขอโต๊ะ"], 0, "bill = ใบเสร็จ/บิล"),
      mc("✈️ “Window or aisle seat?”", ["Window, please.", "Yes, seat.", "I like airplane.", "No window."], 0, "เลือกที่นั่งริมหน้าต่าง"),
      ord("ขอโทษครับ ห้องน้ำอยู่ที่ไหน", "Excuse me, where is the toilet?", "Excuse me + คำถาม")
    ],
    speak: { prompt: "เล่นบทบาทสมมติ 3 สถานการณ์: สั่งอาหาร / ตอบเจ้าหน้าที่สนามบิน / คุยกับผู้ปกครอง", qs: ["Are you ready to order?", "What is the purpose of your visit?", "How is my daughter doing?"], model: "Yes, I'd like fried rice and an iced tea, please. I'm here on holiday for two weeks. Your daughter is doing very well. She is active in class, but she should read more at home.", secs: 90 },
    write: { prompt: "เขียนบทสนทนาสั้น ๆ 5 บรรทัดในสถานการณ์ที่เลือก", min: 5 }
  },

  /* ================= WORLD 3 ================= */
  {
    id: 15, world: 3, topic: "Relative Clause", title: "ประโยคขยายด้วย who / which / that",
    goal: "บรรยายคนหรือสิ่งของด้วย who, which, that",
    bridge: "รวม 2 ประโยคจากด่าน 1 ให้เป็นประโยคเดียว",
    rule: `<ul><li><b>who</b> = คน · <b>which</b> = สิ่งของ/สัตว์ · <b>that</b> = ได้ทั้งคนและสิ่ง</li>
<li><b>whose</b> = ของ… · <b>where</b> = สถานที่</li></ul>
<div class="formula">I have a friend. She lives in London.<br>→ I have a friend <b>who</b> lives in London.</div>
<p>⚠️ ถ้ามีจุลภาค (, … ,) ห้ามใช้ that → <i>My car, <b>which</b> is old, still works.</i></p>`,
    ex: ["The man who lives next door is a doctor.", "This is the book which I bought yesterday.", "That's the school where I studied."],
    qs: [
      mc("The man ___ lives next door is a doctor.", ["who", "which", "where", "whose"], 0, "คน → who"),
      mc("This is the book ___ I bought yesterday.", ["which", "who", "where", "whose"], 0, "สิ่งของ → which"),
      mc("That's the school ___ I studied.", ["where", "which", "who", "whose"], 0, "สถานที่ → where"),
      mc("The student ___ bag is red is Nok.", ["whose", "who", "which", "that"], 0, "กระเป๋า “ของ” นักเรียน → whose"),
      mc("My car, ___ is very old, still works.", ["which", "that", "who", "where"], 0, "มีจุลภาค ห้ามใช้ that"),
      ty("รวมประโยค: I know a teacher. She speaks five languages.", ["I know a teacher who speaks five languages.", "I know a teacher that speaks five languages."], "She → who"),
      ord("นี่คือร้านอาหารที่ฉันชอบที่สุด", "This is the restaurant that I like best.", "สิ่ง/สถานที่เป็นกรรม → that/which"),
      chain(ty("🔗 “ครูที่ตรวจการบ้านเข้มงวดมาก” (ใช้ who + is very strict)", ["The teacher who checks the homework is very strict.", "The teacher that checks the homework is very strict."], "The teacher + who checks the homework + is very strict"))
    ],
    speak: { prompt: "บรรยายคน 1 คน สิ่งของ 1 อย่าง และสถานที่ 1 แห่ง ด้วย who / which / where", qs: ["Who is someone that you admire?"], model: "My mother is a woman who works very hard. I have a bicycle which is twenty years old. My hometown is a place where people are very kind.", secs: 60 },
    write: { prompt: "เขียนประโยคที่มี who / which / that / where / whose", min: 5, kw: "\\b(who|which|that|where|whose)\\b", kwLabel: "มี relative pronoun" }
  },
  {
    id: 16, world: 3, topic: "Participles", title: "V-ing และ V3 ขยายคำนาม",
    goal: "เขียนคำบรรยาย เช่น a sleeping child, a broken chair",
    bridge: "ย่อ Relative Clause (ด่าน 15) + ใช้ V3 จาก Passive (ด่าน 12)",
    rule: `<ul><li><b>V-ing</b> = กำลังทำ / เป็นผู้ทำ → a <b>sleeping</b> child, a <b>boring</b> lesson (บทเรียนที่ทำให้เบื่อ)</li>
<li><b>V3</b> = ถูกกระทำ / เสร็จแล้ว → a <b>broken</b> chair, <b>bored</b> students (นักเรียนที่รู้สึกเบื่อ)</li></ul>
<div class="formula">-ing = ทำให้รู้สึก · -ed = รู้สึก<br>interesting / interested · exciting / excited · tiring / tired</div>
<p>ย่อประโยค: The girl <s>who is</s> sitting by the window… · The book <s>which was</s> written in 1950…</p>`,
    ex: ["a sleeping child", "a broken chair", "The girl sitting by the window is my student."],
    qs: [
      mc("The lesson was ___. I almost fell asleep.", ["boring", "bored", "bore", "boredom"], 0, "บทเรียนทำให้เบื่อ → boring"),
      mc("The students were ___ in the story.", ["interested", "interesting", "interest", "interests"], 0, "คนรู้สึกสนใจ → interested"),
      mc("a ___ chair (เก้าอี้ที่หัก)", ["broken", "breaking", "broke", "break"], 0, "ถูกทำให้หัก → V3"),
      mc("a ___ baby (เด็กที่กำลังร้อง)", ["crying", "cried", "cry", "cries"], 0, "กำลังร้อง → V-ing"),
      mc("The girl ___ by the window is my student.", ["sitting", "sat", "sits", "is sit"], 0, "ย่อจาก who is sitting"),
      mc("This is a book ___ in 1950.", ["written", "writing", "wrote", "writes"], 0, "ย่อจาก which was written"),
      mc("I'm very ___ after work.", ["tired", "tiring", "tire", "tires"], 0, "รู้สึกเหนื่อย → tired"),
      chain(ord("🔗 “การบ้านที่ถูกตรวจโดยครูอยู่บนโต๊ะ”", "The homework checked by the teacher is on the desk.", "checked by the teacher ขยาย The homework"))
    ],
    speak: { prompt: "บรรยายภาพในโรงเรียนตอนนี้ ใช้ V-ing และ V3", qs: ["What can you see around you?"], model: "I can see a sleeping cat near the door. There is a broken window in the old building. The students playing football look excited. The homework checked yesterday is on my desk.", secs: 60 },
    write: { prompt: "เขียนประโยคที่มี V-ing / V3 ขยายคำนาม", min: 5, kw: "\\b\\w+(ing|ed|en)\\s+\\w+", kwLabel: "มี participle" }
  },
  {
    id: 17, world: 3, topic: "If-Clause Type 0–1", title: "ประโยคเงื่อนไขที่เกิดขึ้นจริง",
    goal: "พูดข้อเท็จจริงและเงื่อนไขที่มีโอกาสเกิดจริง",
    bridge: "จับ Present (ด่าน 4) + Future (ด่าน 5) มาเป็นคู่เงื่อนไข",
    rule: `<div class="formula">Type 0: If + Present, Present → ความจริงเสมอ<br>If you heat ice, it melts.</div>
<div class="formula">Type 1: If + Present, will + V1 → มีโอกาสเกิด<br>If it rains, we will stay home.</div>
<p><b>unless</b> = if … not · ⚠️ <b>ห้ามใช้ will ในส่วน If</b></p>`,
    ex: ["If you heat ice, it melts.", "If it rains tomorrow, we will stay at home.", "Unless you hurry, you will miss the bus."],
    qs: [
      mc("If you heat ice, it ___.", ["melts", "will melt", "melted", "would melt"], 0, "ความจริง → Type 0"),
      mc("If it rains tomorrow, we ___ at home.", ["will stay", "stay", "stayed", "would stay"], 0, "Type 1 → will + V1"),
      mc("If she ___ hard, she will pass.", ["studies", "will study", "studied", "study"], 0, "ส่วน If ใช้ Present"),
      mc("Unless you hurry, you ___ the bus.", ["will miss", "miss", "missed", "would miss"], 0, "unless = if not"),
      mc("If you mix red and blue, you ___ purple.", ["get", "will got", "got", "would get"], 0, "ข้อเท็จจริง → Type 0"),
      mc("ข้อใดผิด", ["If I will see him, I will tell him.", "If I see him, I will tell him.", "If it's sunny, we will go out.", "If you heat water, it boils."], 0, "ห้ามใช้ will หลัง If"),
      ord("ถ้าคุณมีเวลา ฉันจะพาคุณไปวัด", "If you have time, I will take you to the temple.", "Type 1"),
      chain(ty("🔗 “ถ้าครูตรวจการบ้าน นักเรียนจะพัฒนาขึ้น” (the students will improve)", ["If the teacher checks the homework, the students will improve.", "The students will improve if the teacher checks the homework."], "If + Present, will + V1"))
    ],
    speak: { prompt: "พูดแผนของคุณพร้อมเงื่อนไข (If … , I will …)", qs: ["What will you do if it rains this weekend?"], model: "If it rains this weekend, I will stay at home and read. If it is sunny, I will go to the park. If my friends are free, we will have dinner together.", secs: 60 },
    write: { prompt: "เขียนประโยค If Type 0 และ Type 1", min: 5, kw: "\\b(if|unless)\\b", kwLabel: "มี If/Unless" }
  },
  {
    id: 18, world: 3, topic: "If-Clause Type 2–3", title: "เรื่องสมมติและสิ่งที่เสียดาย",
    goal: "พูดเรื่องสมมติและสิ่งที่เสียดายในอดีต",
    bridge: "ต่อจากด่าน 17: ถอย tense 1 ขั้น = ไม่จริง (checks → checked → had checked)",
    rule: `<div class="formula">Type 2: If + V2 (were), would + V1 → สมมติ ไม่จริงตอนนี้<br>If I were you, I would practise every day.</div>
<div class="formula">Type 3: If + had V3, would have V3 → เสียดายอดีต<br>If I had studied, I would have passed.</div>
<p><b>I wish</b> + V2 (ตอนนี้) / had V3 (อดีต)</p>`,
    ex: ["If I were rich, I would travel the world.", "If I had left earlier, I wouldn't have missed the train.", "I wish I could speak French."],
    qs: [
      mc("If I ___ rich, I would travel the world.", ["were", "am", "will be", "had"], 0, "Type 2 ใช้ were กับทุกประธาน"),
      mc("If I were you, I ___ see a doctor.", ["would", "will", "am", "had"], 0, "Type 2 → would + V1"),
      mc("If she had studied, she ___ passed.", ["would have", "will have", "would", "had"], 0, "Type 3 → would have + V3"),
      mc("If I ___ earlier, I wouldn't have missed the train.", ["had left", "left", "leave", "would leave"], 0, "Type 3 → had + V3"),
      mc("I wish I ___ speak French.", ["could", "can", "will", "would have"], 0, "wish + รูปอดีต"),
      mc("ข้อใดเป็นการ “เสียดายอดีต”", ["If I had known, I would have helped you.", "If I know, I will help you.", "If I knew, I would help you.", "If you heat ice, it melts."], 0, "had known + would have = Type 3"),
      ord("ถ้าฉันมีเวลามากกว่านี้ ฉันจะเรียนภาษาอังกฤษทุกวัน", "If I had more time, I would study English every day.", "Type 2"),
      chain(ord("🔗 “ถ้าครูตรวจการบ้าน (ในอดีต) นักเรียนคงพัฒนาไปแล้ว”", "If the teacher had checked the homework, the students would have improved.", "Type 3 = เสียดายอดีต"))
    ],
    speak: { prompt: "ตอบ: ถ้ามีเวลามากขึ้น/ถูกหวย 1 ล้าน จะทำอะไร + เล่า 1 เรื่องที่เสียดาย", qs: ["What would you do if you had more time?", "What do you regret?"], model: "If I had more time, I would learn to play the guitar. If I won a million baht, I would build a library for my students. If I had practised English earlier, I would have spoken better now.", secs: 60 },
    write: { prompt: "เขียนประโยค If Type 2 และ Type 3 / I wish", min: 5, kw: "\\b(would|wish)\\b", kwLabel: "มี would / wish" }
  },
  {
    id: 19, world: 3, topic: "Subjunctive", title: "ประโยคเสนอแนะและความจำเป็น",
    goal: "ฝึกเสนอแนะ ขอร้อง และพูดถึงสิ่งจำเป็น",
    bridge: "ต่อจากด่าน 18 (If I were…) — กริยารูปพิเศษที่ไม่ผันตามประธาน",
    rule: `<div class="formula">suggest / recommend / insist / request + that + S + <b>V1</b> (ไม่เติม s, be ไม่ผัน)</div>
<p><i>I suggest that he <b>be</b> careful.</i> · <i>The doctor recommended that she <b>drink</b> more water.</i></p>
<div class="formula">It is important / essential / necessary + that + S + V1</div>
<p>อื่น ๆ: <i>I wish I <b>were</b>…</i> · <i>It's time we <b>went</b> home.</i></p>
<p>💡 แบบง่ายในบทสนทนา: <i>I suggest you… / You should…</i></p>`,
    ex: ["I suggest that he be careful.", "It is essential that every student arrive on time.", "It's time we went home."],
    qs: [
      mc("I suggest that he ___ careful.", ["be", "is", "was", "being"], 0, "Subjunctive ใช้ be"),
      mc("The doctor recommended that she ___ more water.", ["drink", "drinks", "drank", "drinking"], 0, "ไม่เติม s"),
      mc("It is essential that every student ___ on time.", ["arrive", "arrives", "arrived", "arriving"], 0, "It is essential that + V1"),
      mc("I wish I ___ taller.", ["were", "am", "be", "been"], 0, "wish + were"),
      mc("The principal insisted that the meeting ___ postponed.", ["be", "is", "was", "been"], 0, "insist that + be + V3"),
      mc("It's time we ___ home.", ["went", "go", "going", "gone"], 0, "It's time + V2"),
      ord("ฉันแนะนำให้คุณฝึกพูดทุกวัน", "I suggest that you practise speaking every day.", "suggest that + S + V1"),
      chain(ty("🔗 “ฉันแนะนำว่าครูควรตรวจการบ้าน” (I suggest that …)", ["I suggest that the teacher check the homework.", "I suggest the teacher check the homework."], "the teacher + check (ไม่เติม s!)"))
    ],
    speak: { prompt: "ให้คำแนะนำนักเรียน/ผู้ปกครอง 3 ข้อ", qs: ["What do you suggest for students who want to improve their English?"], model: "I suggest that students read English every day. It is important that they not be afraid of mistakes. I recommend that parents talk with their children about school.", secs: 60 },
    write: { prompt: "เขียนคำแนะนำด้วย suggest / recommend / It is important that", min: 5, kw: "\\b(suggest|recommend|insist|important|essential|necessary)\\b", kwLabel: "มีคำเสนอแนะ" }
  },
  {
    id: 20, world: 3, topic: "รวมประโยคซับซ้อน", title: "เชื่อมทุกอย่างเป็นย่อหน้า",
    goal: "เขียนย่อหน้า 10 ประโยค",
    bridge: "รวมด่าน 13 + 15 + 17 ในประโยคเดียว",
    rule: `<p><b>คำเชื่อม:</b> and, but, so, because, although, when, while, before, after, so that</p>
<div class="formula">ย่อหน้า = Topic sentence → 3–5 supporting sentences → Conclusion</div>
<p>ตัวอย่างรวมหลายหัวข้อ: <i>The teacher <u>who checks the homework</u> <u>said that</u> the students would improve <u>if they practised every day</u>.</i></p>`,
    ex: ["Although it was raining, we played football.", "I read a book while I was waiting.", "She studies hard because she wants to pass."],
    qs: [
      mc("I was tired, ___ I finished my work.", ["but", "because", "so that", "while"], 0, "ขัดแย้ง → but"),
      mc("___ it was raining, we played football.", ["Although", "Because", "So", "If"], 0, "แม้ว่า → Although"),
      mc("She studies hard ___ she wants to pass.", ["because", "although", "but", "unless"], 0, "เหตุผล → because"),
      mc("I read a book ___ I was waiting.", ["while", "so", "but", "unless"], 0, "ขณะที่ → while"),
      mc("ประโยคใดเหมาะเป็น Topic sentence", ["Reading every day has many benefits.", "For example, I read at night.", "So, that is why.", "Also, it is fun."], 0, "Topic sentence บอกใจความหลัก"),
      mc("I speak slowly ___ my students can understand.", ["so that", "although", "but", "while"], 0, "เพื่อที่จะ → so that"),
      mc("ประโยคใดใช้ 3 หัวข้อ (Relative + Passive + Past)", ["The book which was written by my friend won a prize.", "I like books.", "Books are good.", "Read a book."], 0, "which (Relative) + was written (Passive) + won (Past)"),
      chain(ord("🔗 ประโยคเชื่อมทุกด่าน", "The teacher who checks the homework said that the students would improve if they practised every day.", "Relative Clause + Reported Speech + If-Clause ในประโยคเดียว"))
    ],
    speak: { prompt: "พูดเรื่อง “My School” 1 นาที ใช้ประโยคซับซ้อนอย่างน้อย 3 ประโยค", qs: ["Tell me about your school."], model: "My school, which was built forty years ago, is in a quiet area. Although it is small, the students are very active. The teachers who work there are kind. If you visit, you will love the garden.", secs: 60 },
    write: { prompt: "เขียนย่อหน้าเกี่ยวกับโรงเรียนหรืองานของคุณ (เป้าหมาย 10 ประโยค)", min: 8, kw: "\\b(because|although|when|while|but|so|who|which|if)\\b", kwLabel: "มีคำเชื่อม" }
  },
  {
    id: 21, world: 3, boss: true, topic: "BOSS: อ่านบทความ", title: "บอสป่า: อ่านบทความสั้น",
    goal: "ขีดเส้นใต้ประธาน กริยา เวลา และประโยคเงื่อนไข",
    bridge: "บอสรวมด่าน 15–20 — หาไวยากรณ์ทุกหัวข้อในบทความจริง",
    pool: [15, 20], poolCount: 4,
    read: ARTICLE_SCHOOL,
    rule: `<p><b>วิธีอ่าน 5 ขั้น</b></p>
<ol><li>อ่านรอบแรกเพื่อจับใจความ</li><li>หาประธานและกริยา</li><li>ระบุ อดีต / ปัจจุบัน / อนาคต</li><li>หา คำถาม ปฏิเสธ Passive If-Clause</li><li>สรุปเป็นภาษาอังกฤษ 3–5 ประโยค</li></ol>`,
    ex: [],
    qs: [
      mc("ใจความสำคัญของบทความ", ["ชีวิตในโรงเรียนบ้านสวนและการเตรียมต้อนรับอาสาสมัคร", "วิธีสร้างห้องสมุด", "ประวัติประเทศแคนาดา", "การทำอาหาร"], 0, "บทความเล่าเรื่องโรงเรียนและกิจกรรมที่จะมาถึง"),
      mc("When was the school built?", ["In 1985", "Last year", "Next month", "At 7:30"], 0, "“which was built in 1985”"),
      mc("Who will visit the school next month?", ["Volunteers from Canada", "Local families", "Mr. Somchai", "The principal"], 0, "a group of volunteers from Canada"),
      mc("“a new library was opened” เป็นไวยากรณ์ใด", ["Passive Voice", "If-Clause", "Question", "Imperative"], 0, "was + V3"),
      mc("“If students read…, their English will improve” เป็น", ["If-Clause Type 1", "If-Clause Type 2", "If-Clause Type 3", "Subjunctive"], 0, "If + Present, will + V1"),
      mc("“The teachers who work there” เป็น", ["Relative Clause", "Participle", "Comparison", "Reported Speech"], 0, "who ขยาย teachers"),
      mc("“books donated by local families” — donated คือ", ["Past Participle ขยายนาม", "Past Simple", "Present Continuous", "Imperative"], 0, "ย่อจาก books which were donated"),
      mc("“suggested that every class prepare” เป็น", ["Subjunctive", "Past Perfect", "Negative", "Comparison"], 0, "prepare ไม่เติม s"),
      mc("“Mr. Somchai says that reading is the key…” เป็น", ["Reported Speech", "Passive", "If-Clause", "Question"], 0, "says that…")
    ],
    speak: { prompt: "อ่านบทความออกเสียง แล้วสรุปเป็นภาษาอังกฤษ 3–5 ประโยค", readAloud: true, qs: [], model: "Ban Suan School was built in 1985. It has a new library. The English teacher believes reading is important. Volunteers from Canada will visit next month.", secs: 90 },
    write: { prompt: "สรุปบทความเป็นภาษาอังกฤษ 3–5 ประโยค", min: 3 }
  },

  /* ================= WORLD 4 ================= */
  {
    id: 22, world: 4, topic: "แนะนำตัวเอง อาชีพ โรงเรียน ครอบครัว", title: "ภารกิจ: แนะนำตัวแบบมืออาชีพ",
    goal: "แนะนำตัวเอง อาชีพ โรงเรียน และครอบครัว",
    bridge: "อัปเกรดบอสด่าน 7 ด้วยประโยคซับซ้อนจากป่า",
    rule: `<div class="formula">Name → Job → Workplace → Experience → Family → Hobby → Question back</div>
<p>วลีเด็ด: <i>I work as… · I've been teaching for… · There are … people in my family. · In my free time, I… · How about you?</i></p>`,
    ex: ["I work as an English teacher at a secondary school.", "There are four people in my family.", "How about you?"],
    qs: [
      mc("“What do you do?” ถามเกี่ยวกับ", ["อาชีพ", "งานอดิเรก", "สิ่งที่ทำตอนนี้", "ที่อยู่"], 0, "What do you do? = ทำงานอะไร"),
      mc("ตอบ “What do you do?”", ["I'm a teacher at a secondary school.", "I'm doing homework.", "I do it.", "Yes, I do."], 0, "บอกอาชีพ"),
      mc("“How long have you been teaching?”", ["For fifteen years.", "At eight o'clock.", "Very long.", "Yesterday."], 0, "How long → for + ระยะเวลา"),
      mc("“Do you have any brothers or sisters?”", ["Yes, I have one older sister.", "Yes, I am.", "I have brother.", "No, I don't brother."], 0, "Yes, I have…"),
      mc("ข้อใดถูกต้อง", ["I am a teacher.", "I am teacher.", "I teacher.", "I am the teacher of English at school a."], 0, "อาชีพต้องมี a/an"),
      ord("ฉันสอนภาษาอังกฤษให้นักเรียนอายุ 12 ถึง 15 ปี", "I teach English to students aged 12 to 15.", "aged = อายุ (Participle!)"),
      ord("ครอบครัวฉันมีสี่คน", "There are four people in my family.", "There are + จำนวน + people"),
      mc("“How about you?” ใช้เพื่อ", ["ถามกลับคู่สนทนา", "บอกลา", "ขอโทษ", "ขอบคุณ"], 0, "ช่วยให้บทสนทนาไหลต่อ")
    ],
    speak: { prompt: "แนะนำตัว 2 นาที: ชื่อ อาชีพ โรงเรียน ประสบการณ์ ครอบครัว งานอดิเรก", qs: ["Could you tell me about yourself, your job and your family?"], model: "Hi, I'm Sam. I work as an English teacher at a secondary school which has about a thousand students. I've been teaching for fifteen years. There are four people in my family. In my free time, I like gardening. How about you?", secs: 120 },
    write: { prompt: "เขียนย่อหน้าแนะนำตัวแบบมืออาชีพ", min: 6 }
  },
  {
    id: 23, world: 4, topic: "สนทนากับผู้ปกครอง/นักเรียนต่างชาติ", title: "ภารกิจ: คุยกับผู้ปกครองต่างชาติ",
    goal: "สนทนากับผู้ปกครองหรือนักเรียนต่างชาติ",
    bridge: "ใช้คำถาม (9) คำแนะนำ (19) และเปรียบเทียบ (11)",
    rule: `<ul><li>เปิด: <i>Good afternoon. Thank you for coming.</i></li>
<li>ชม: <i>Your son is very active / helpful in class.</i></li>
<li>แนะนำ: <i>He needs to… · I suggest that he… · You could…</i></li>
<li>ขอทวน: <i>Sorry, could you say that again? · Could you speak more slowly, please?</i></li>
<li>ปิด: <i>It was nice talking to you.</i></li></ul>`,
    ex: ["Thank you for coming.", "She is doing better than last term.", "Could you speak more slowly, please?"],
    qs: [
      mc("ทักทายผู้ปกครองแบบสุภาพ", ["Good afternoon. Thank you for coming.", "Hey! What's up?", "Sit.", "You are late."], 0, "สุภาพและขอบคุณ"),
      mc("Your daughter is very ___ in class. (กระตือรือร้น)", ["active", "actively", "action", "act"], 0, "หลัง very + คุณศัพท์"),
      mc("Parent: “Is there anything I can do at home?”", ["You could read English stories with her every evening.", "No, nothing.", "Yes, you can do.", "Home is good."], 0, "ให้คำแนะนำด้วย You could…"),
      mc("Student: “I don't understand.”", ["No problem. Let me explain it again.", "Why not?", "You are wrong.", "Go home."], 0, "Let me + V1"),
      mc("ใช้ “Could you speak more slowly, please?” เมื่อ", ["ฟังไม่ทัน", "อยากให้พูดดังขึ้น", "จะบอกลา", "จะขอบคุณ"], 0, "ขอให้พูดช้าลง"),
      ord("เขาต้องฝึกพูดให้มากขึ้น", "He needs to practise his speaking more.", "needs to + V1"),
      mc("ขอให้พูดซ้ำอย่างสุภาพ", ["Sorry, could you say that again?", "What?", "Again!", "Say."], 0, "Sorry + could you…"),
      mc("ปิดการสนทนา", ["It was nice talking to you.", "Finish.", "Bye bye now go.", "You can leave."], 0, "สุภาพและเป็นมิตร")
    ],
    speak: { prompt: "จำลองคุยกับผู้ปกครองต่างชาติ: ทักทาย → ชม → แนะนำ → ปิด", qs: ["How is my son doing?", "What can I do at home?"], model: "Good afternoon, and thank you for coming. Your son is doing better than last term. He is very helpful in class. I suggest that he read English books at home. It was nice talking to you.", secs: 90 },
    write: { prompt: "เขียนบทสนทนากับผู้ปกครอง 5 บรรทัด", min: 5 }
  },
  {
    id: 24, world: 4, topic: "ตารางเรียนและกิจวัตร", title: "ภารกิจ: อธิบายตารางเรียน",
    goal: "อธิบายตารางเรียนและกิจวัตรประจำวัน",
    bridge: "Present Simple (4) + คำบอกเวลา + Passive (12)",
    rule: `<ul><li><b>at</b> + เวลา → at 8:30 · <b>on</b> + วัน → on Monday · <b>in</b> + ช่วง → in the morning</li>
<li>ความถี่: once / twice / three times a week · every day</li>
<li>ลำดับ: First, … Then, … After lunch, … Finally, …</li></ul>`,
    ex: ["The first class starts at 8:30.", "I have English on Mondays and Wednesdays.", "After lunch, I usually check homework."],
    qs: [
      mc("“What time does the first class start?”", ["It starts at 8:30.", "It starts on 8:30.", "It start in 8:30.", "Yes, it starts."], 0, "at + เวลา, start → starts"),
      mc("I have English ___ Monday.", ["on", "in", "at", "by"], 0, "on + วัน"),
      mc("The meeting is ___ 3 p.m.", ["at", "on", "in", "for"], 0, "at + เวลา"),
      mc("I check emails ___ the morning.", ["in", "on", "at", "by"], 0, "in the morning"),
      mc("“How often do you teach this class?”", ["Twice a week.", "At 9 a.m.", "In room 5.", "For one hour."], 0, "How often → ความถี่"),
      ord("ฉันมีวิชาภาษาอังกฤษวันจันทร์และวันพุธ", "I have English on Mondays and Wednesdays.", "Mondays = ทุกวันจันทร์"),
      ord("หลังอาหารกลางวัน ฉันมักจะตรวจการบ้าน", "After lunch, I usually check homework.", "usually อยู่หน้ากริยาแท้"),
      mc("My school ___ at 4 p.m.", ["finishes", "finish", "finishing", "is finish"], 0, "school เอกพจน์ → finishes")
    ],
    speak: { prompt: "อธิบายตารางสอน/ตารางเรียนของคุณ 1 วัน", qs: ["What is your timetable like on Monday?"], model: "On Monday, my first class starts at eight thirty. I teach English to grade seven. Then I have a free period. After lunch, I usually check homework. My last class finishes at three.", secs: 60 },
    write: { prompt: "เขียนกิจวัตร/ตารางเรียน 1 วัน", min: 5, kw: "\\b(at|on|in)\\b", kwLabel: "มี at/on/in" }
  },
  {
    id: 25, world: 4, topic: "อ่านบทความ + สรุปภาษาไทย", title: "ภารกิจ: อ่านแล้วสรุปเป็นไทย",
    goal: "อ่านบทความ 100–150 คำ แล้วสรุปเป็นภาษาไทย",
    bridge: "ใช้วิธีอ่าน 5 ขั้นจากบอสด่าน 21",
    read: ARTICLE_PHONE,
    rule: `<p>อ่าน 2 รอบ: รอบแรกจับใจความ รอบสองหาข้อมูลสำคัญ</p>
<div class="formula">ใคร? ทำอะไร? ทำไม? อย่างไร? สรุปว่าอะไร?</div>`,
    ex: [],
    qs: [
      mc("ใจความสำคัญของบทความ", ["ใช้มือถือช่วยเรียนภาษาได้ แต่ต้องฝึกพูดและเรียนทุกวัน", "มือถือไม่ดีต่อการเรียน", "ควรเรียนวันละ 2 ชั่วโมง", "ต้องเรียนในห้องเรียนเท่านั้น"], 0, "ประโยคแรก + ประโยคสุดท้ายบอกใจความ"),
      mc("บทเรียนในแอปใช้เวลาประมาณเท่าไร", ["10 นาที", "2 ชั่วโมง", "20 นาที", "1 ชั่วโมง"], 0, "“take only ten minutes”"),
      mc("ผู้เชี่ยวชาญแนะนำให้ทำอะไรเพิ่ม", ["พูดกับคนจริง ๆ", "ซื้อมือถือใหม่", "ดูหนัง", "นอนเร็ว"], 0, "“speak with real people”"),
      mc("confident แปลว่า", ["มั่นใจ", "สับสน", "เหนื่อย", "สนใจ"], 0, "become more confident = มั่นใจขึ้น"),
      mc("การอัดเสียงตัวเองช่วยอย่างไร", ["ช่วยหาข้อผิดพลาดของตัวเอง", "ช่วยให้นอนหลับ", "ช่วยจำเบอร์โทร", "ไม่ช่วยอะไร"], 0, "“find your own mistakes”"),
      mc("“Ten minutes a day is better than two hours once a week.” หมายความว่า", ["เรียนน้อยแต่สม่ำเสมอดีกว่า", "เรียนนานดีกว่า", "เรียนสัปดาห์ละครั้งพอ", "ไม่ต้องเรียน"], 0, "ความสม่ำเสมอสำคัญที่สุด"),
      mc("“If you practise speaking every day, you will become more confident.” เป็น", ["If Type 1", "If Type 2", "Passive", "Reported Speech"], 0, "If + Present, will"),
      mc("สรุปภาษาไทยที่ดีที่สุด", ["แอปมือถือช่วยให้เรียนภาษาได้ทุกที่ แต่ควรฝึกพูดกับคนจริง อัดเสียงตัวเอง อ่านบทความ และเรียนน้อยๆ ทุกวัน", "มือถือทำให้เสียเวลา", "ควรอ่านบทความยาวๆ วันละ 2 ชั่วโมง", "ผู้เชี่ยวชาญไม่แนะนำให้ใช้แอป"], 0, "ครอบคลุมทุกประเด็นหลัก")
    ],
    speak: { prompt: "อ่านบทความออกเสียงทั้งหมด (ระบบจะนับคำที่อ่านถูก)", readAloud: true, qs: [], model: "", secs: 120 },
    write: { prompt: "สรุปบทความเป็นภาษาไทย 3–5 ประโยค", min: 3, lang: "th" }
  },
  {
    id: 26, world: 4, topic: "สรุปบทความเป็นภาษาอังกฤษ", title: "ภารกิจ: สรุปเป็นอังกฤษ",
    goal: "อ่านบทความเดิม แล้วสรุปเป็นภาษาอังกฤษ 5 ประโยค",
    bridge: "บทความเดียวกับด่าน 25 — เปลี่ยนสรุปไทยเป็นอังกฤษ",
    read: ARTICLE_PHONE,
    rule: `<p><b>สรุปอย่างไร</b></p>
<ul><li>ใช้คำของตัวเอง (paraphrase) ไม่ลอกทั้งประโยค</li><li>ประโยคแรก = ใจความหลัก</li><li>ตัดตัวอย่างและรายละเอียดเล็ก ๆ</li><li>ใช้ Present Simple</li></ul>
<div class="formula">The article is about… · The writer says that… · It also suggests that… · In conclusion,…</div>`,
    ex: ["The article is about learning a language with a phone.", "The writer says that apps are useful but not enough."],
    qs: [
      mc("ประโยคเปิดสรุปที่ดีที่สุด", ["The article is about learning a language with a smartphone.", "Many people want to learn a new language, but they say they do not have time.", "Phones are expensive.", "I like my phone."], 0, "บอกหัวเรื่องด้วยคำของตัวเอง"),
      mc("Paraphrase ของ “apps are not enough”", ["Apps alone cannot make you fluent.", "Apps are enough.", "Apps are not.", "Enough apps."], 0, "ความหมายเดิม คำใหม่"),
      mc("ข้อใด “ไม่ควร” อยู่ในบทสรุป", ["You can study on the bus.", "Learners should also speak with real people.", "Studying a little every day is important.", "Recording your voice helps you find mistakes."], 0, "เป็นรายละเอียดตัวอย่าง"),
      mc("“The writer says that…” เป็นไวยากรณ์ใด", ["Reported Speech", "Passive", "Imperative", "Comparison"], 0, "เล่าต่อว่าผู้เขียนพูดอะไร"),
      ord("บทความแนะนำว่าเราควรเรียนทุกวัน", "The article suggests that we should study every day.", "suggests that…"),
      ord("การอัดเสียงช่วยให้ผู้เรียนหาข้อผิดพลาด", "Recording your voice helps you find mistakes.", "V-ing เป็นประธาน → helps"),
      mc("ประโยคปิดที่ดี", ["In conclusion, a little practice every day is the key.", "The end.", "Bye.", "That's all I know."], 0, "In conclusion + ใจความ")
    ],
    speak: { prompt: "พูดสรุปบทความเป็นภาษาอังกฤษ 5 ประโยค", qs: ["What is the article about?"], model: "The article is about learning a language with a smartphone. The writer says that apps are useful because the lessons are short. However, learners should also speak with real people. Recording your voice and reading short articles also help. In conclusion, studying a little every day is the key.", secs: 90 },
    write: { prompt: "สรุปบทความเป็นภาษาอังกฤษ 5 ประโยค", min: 5 }
  },
  {
    id: 27, world: 4, topic: "อีเมล / ข้อความ", title: "ภารกิจ: เขียนอีเมล",
    goal: "เขียนอีเมลหรือข้อความภาษาอังกฤษสั้น ๆ",
    bridge: "ใช้ Imperative สุภาพ (10) + Future (5) + Questions (9)",
    rule: `<div class="formula">Subject → Greeting → Purpose → Details → Request → Closing</div>
<ul><li>ทางการ: <i>Dear Mr. Smith,</i> … <i>Kind regards,</i></li>
<li>ไม่ทางการ: <i>Hi Anna,</i> … <i>Best,</i></li>
<li>จุดประสงค์: <i>I am writing to…</i></li>
<li>ขอร้อง: <i>Could you…? · Please let me know if…</i></li>
<li>ปิด: <i>I look forward to hearing from you.</i></li></ul>`,
    ex: ["Dear Mr. Smith,", "I am writing to invite you to our English Day.", "I look forward to hearing from you."],
    qs: [
      mc("คำขึ้นต้นอีเมลทางการถึงผู้ชายชื่อ John Smith", ["Dear Mr. Smith,", "Hey John!", "Yo Smith,", "Dear Mr. John,"], 0, "Mr. + นามสกุล"),
      mc("บอกจุดประสงค์อีเมล", ["I am writing to ask about the timetable.", "I write you.", "This is email.", "Email for you."], 0, "I am writing to + V1"),
      mc("ปิดอีเมลทางการ", ["Kind regards,", "Love,", "See ya,", "Bye!!!"], 0, "Kind regards / Best regards"),
      mc("ขอให้ตอบกลับอย่างสุภาพ", ["Please let me know if you have any questions.", "Answer me now.", "You must reply.", "Tell me."], 0, "Please let me know…"),
      ord("ฉันเขียนมาเพื่อเชิญคุณมางานวันภาษาอังกฤษของโรงเรียน", "I am writing to invite you to our school's English Day.", "invite + คน + to + งาน"),
      ord("ฉันหวังว่าจะได้รับการตอบกลับจากคุณ", "I look forward to hearing from you.", "look forward to + V-ing"),
      mc("Subject ที่ดี", ["Invitation: English Day on 15 March", "Hello", "Important!!!", "Read this"], 0, "ชัดเจน บอกเรื่อง + วัน")
    ],
    speak: { prompt: "อ่านอีเมลที่คุณจะเขียนออกเสียง", qs: ["What is your email about?"], model: "Dear Ms. Brown, I am writing to invite you to our school's English Day on the fifteenth of March. The event will start at nine a.m. Could you give a short talk to our students? Please let me know if you are available. Kind regards, Sam.", secs: 60 },
    write: { prompt: "เขียนอีเมลสั้น ๆ (เชิญ / ถามข้อมูล / นัดหมาย) — Greeting ถึง Closing", min: 5, kw: "\\b(Dear|Hi|Hello)\\b", kwLabel: "มีคำขึ้นต้น" }
  },
  {
    id: 28, world: 4, topic: "สนทนา 5 นาที", title: "ภารกิจ: สนทนา 5 นาที",
    goal: "สนทนา 5 นาทีโดยเตรียมหัวข้อไว้ล่วงหน้า",
    bridge: "ใช้คำถามประจำวันทั้ง 5 ข้อ ที่ครอบคลุม Present, Past, Future, Like และ If",
    rule: `<p><b>เทคนิคให้คุยได้นาน</b></p>
<ul><li>ซื้อเวลา: <i>Well, let me think… · That's a good question.</i></li>
<li>ถามต่อ: <i>Really? Why? · What about you? · How was it?</i></li>
<li>ขยายคำตอบ: ตอบ + เหตุผล (because) + ตัวอย่าง (for example)</li>
<li>แสดงความสนใจ: <i>That sounds interesting! · I see.</i></li></ul>`,
    ex: ["Well, let me think.", "That sounds interesting! Why did you choose it?", "What about you?"],
    qs: [
      mc("คู่สนทนา: “I went to Japan last month.” ควรตอบ", ["Really? How was it?", "OK.", "Japan.", "I don't know."], 0, "แสดงความสนใจ + ถามต่อ"),
      mc("เมื่อยังคิดคำตอบไม่ออก", ["Well, let me think…", "…(เงียบ)", "No.", "Next question."], 0, "ซื้อเวลาอย่างเป็นธรรมชาติ"),
      mc("ขยายคำตอบ “Do you like your job?” ให้ดีที่สุด", ["Yes, I do, because I love working with kids. For example, …", "Yes.", "Yes, I like.", "Job is good."], 0, "ตอบ + because + ตัวอย่าง"),
      mc("“That sounds interesting!” ใช้เพื่อ", ["แสดงความสนใจ", "ปฏิเสธ", "ขอโทษ", "บอกลา"], 0, ""),
      mc("คำถามต่อที่ดีหลัง “I love cooking.”", ["What do you like to cook?", "Cooking.", "Why not?", "I don't."], 0, "ถามต่อจากเรื่องเดิม"),
      mc("“What would you do if you had more time?” ตอบว่า", ["I would travel more.", "I will travel more.", "I travel more.", "I traveled more."], 0, "If Type 2 → would"),
      mc("“What did you do yesterday?” ตอบว่า", ["I visited my parents.", "I visit my parents.", "I will visit my parents.", "I am visiting my parents."], 0, "yesterday → Past")
    ],
    speak: { prompt: "ตอบคำถามประจำวันทั้ง 5 ข้อต่อเนื่อง — เป้าหมาย 5 นาที", qs: DAILY_QUESTIONS, model: "Every day I teach English and check homework. Yesterday I visited my parents. Tomorrow I will prepare a new lesson. I like reading, but I don't like crowded places. If I had more time, I would travel around Asia.", secs: 300 },
    write: { prompt: "เตรียมหัวข้อสนทนา: เขียนคำตอบสำหรับคำถาม 5 ข้อ", min: 5 }
  },
  {
    id: 29, world: 4, topic: "ตรวจข้อผิดพลาด", title: "ภารกิจ: ล่าข้อผิดพลาด",
    goal: "ตรวจข้อผิดพลาดจากเสียงและงานเขียนของตัวเอง",
    bridge: "ทบทวนทั้ง 15 หัวข้อ + ย้อนดูงานเขียนของคุณเองจากทุกด่าน",
    showJournal: true,
    rule: `<p><b>เช็กลิสต์ 5 จุดที่คนไทยผิดบ่อย</b></p>
<ol><li>ลืม s/es (She teach ❌)</li><li>ลืมกริยา (I happy ❌ → I am happy)</li><li>tense ไม่ตรงคำบอกเวลา (Yesterday I go ❌)</li><li>ลืม a/an/the (I am teacher ❌)</li><li>did/does + V1 (Did you went ❌)</li></ol>`,
    ex: [],
    qs: [
      mc("แก้ประโยค: “She don't like coffee.”", ["She doesn't like coffee.", "She don't likes coffee.", "She not like coffee.", "She isn't like coffee."], 0, "SVA + Negative"),
      mc("แก้ประโยค: “I am teacher.”", ["I am a teacher.", "I teacher.", "I am the teachers.", "I is a teacher."], 0, "Determiner"),
      mc("แก้ประโยค: “Yesterday I go to the market.”", ["Yesterday I went to the market.", "Yesterday I going to the market.", "Yesterday I will go to the market.", "Yesterday I goes to the market."], 0, "Past Tense"),
      mc("แก้ประโยค: “Did you went home?”", ["Did you go home?", "Did you gone home?", "Do you went home?", "Did you goes home?"], 0, "did + V1"),
      mc("แก้ประโยค: “If I will see him, I tell him.”", ["If I see him, I will tell him.", "If I will see him, I will tell him.", "If I saw him, I will tell him.", "If I see him, I told him."], 0, "If Type 1"),
      mc("แก้ประโยค: “This book is more better.”", ["This book is better.", "This book is more good.", "This book is best than.", "This book is gooder."], 0, "Comparison"),
      mc("แก้ประโยค: “The school built in 1990.”", ["The school was built in 1990.", "The school is build in 1990.", "The school building in 1990.", "The school builds in 1990."], 0, "Passive"),
      mc("แก้ประโยค: “The lesson was very bored.”", ["The lesson was very boring.", "The lesson was very bore.", "The lesson very boring.", "The lesson were boring."], 0, "Participle"),
      mc("แก้ประโยค: “She said that she is tired yesterday.”", ["She said that she was tired the day before.", "She said she is tired yesterday.", "She says she was tired tomorrow.", "She said that she tired."], 0, "Reported Speech"),
      mc("แก้ประโยค: “The man which lives here is kind.”", ["The man who lives here is kind.", "The man where lives here is kind.", "The man whose lives here is kind.", "The man lives who here is kind."], 0, "Relative Clause")
    ],
    speak: { prompt: "อ่านงานเขียนเก่าของคุณออกเสียง แล้วฟังเสียงตัวเอง จด 3 จุดที่ต้องแก้", qs: ["What are your three most common mistakes?"], model: "My three common mistakes are: I forget the s after he and she, I use the wrong tense with yesterday, and I forget a or an before jobs.", secs: 60 },
    write: { prompt: "คัดประโยคจากงานเขียนเก่าที่ผิด 5 ประโยค แล้วเขียนฉบับแก้ไข", min: 5 }
  },
  {
    id: 30, world: 4, boss: true, final: true, topic: "FINAL BOSS: สอบตัวเอง", title: "บอสใหญ่: สอบตัวเอง",
    goal: "สอบตัวเอง: พูด 10 นาที เขียน 1 ย่อหน้า และสรุปบทความ",
    bridge: "บอสสุดท้าย — รวมคำถามจากทั้ง 29 ด่านที่ผ่านมา",
    pool: [1, 29], poolCount: 12,
    rule: `<p>🏆 บอสสุดท้ายรวมคำถามสุ่มจากทุกด่าน + พูดยาว + เขียนย่อหน้า</p>
<div class="formula">พูด: ตอบคำถาม 5 ข้อ ต่อเนื่องให้นานที่สุด (เป้า 10 นาที)<br>เขียน: 1 ย่อหน้าเกี่ยวกับการเดินทางเรียนภาษาอังกฤษ 30 วันของคุณ</div>
<p>ระลึกถึงประโยคตั้งต้น: <i>${BASE_SENTENCE}</i> — วันนี้คุณเปลี่ยนมันได้ทุกรูปแบบแล้ว!</p>`,
    ex: [],
    qs: [
      chain(ord("🔗 ประโยคเชื่อมสุดท้าย: “ถ้าครูไม่ได้ตรวจการบ้าน นักเรียนคงไม่ได้พัฒนา” (Type 3 ปฏิเสธ)", "If the teacher had not checked the homework, the students would not have improved.", "รวม If Type 3 + Negative"))
    ],
    speak: { prompt: "สอบพูด: ตอบคำถาม 5 ข้อต่อเนื่องให้นานที่สุด", qs: DAILY_QUESTIONS, model: "", secs: 600 },
    write: { prompt: "เขียนย่อหน้า: “My 30-Day English Journey” (สิ่งที่เรียน สิ่งที่ยังยาก แผนต่อไป)", min: 8 }
  }
];

// ใส่ id ให้คำถามทุกข้อ
LEVELS.forEach((l) => l.qs.forEach((q, i) => { q.id = l.id + "-" + i; q.lvl = l.id; }));
