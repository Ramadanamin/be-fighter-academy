"use client";
import {FormEvent,useState} from "react";
import styles from "./kids.module.css";
const WA="201001110897";
const VODAFONE_CASH="01001110897";
const INSTAPAY_LINK="https://ipn.eg/S/ramadan.morgan/instapay/8lgrvJ";
const COACH="/assets/coach-ramadan.webp";
const wa=(t:string)=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const benefits=[["ثقة بالنفس","وقفة أوضح وتصرف أهدى تحت الضغط."],["دفاع عن النفس","حركة ومسافة وحماية بشكل آمن."],["انضباط أعلى","تدريب تدريجي وروتين واضح."],["تركيز أفضل","تمارين حركة ورد فعل مناسبة للسن."],["جسم أقوى","لياقة وحركة أفضل بشكل تدريجي."]];
const steps=[["01","التقييم","نفهم مستوى الطفل وهدف ولي الأمر."],["02","بناء الأساس","وقفة، حركة، حراسة وثقة."],["03","التطبيق","Drills ومواقف بسيطة تناسب السن."],["04","المتابعة","نراجع التقدم ونعدّل الخطة."]];
const packs=[["6 حصص","6,000","1,000 جنيه / الحصة"],["8 حصص","7,000","875 جنيه / الحصة"],["12 حصة","10,000","833 جنيه / الحصة"]];
export default function KidsLandingPage(){
 const [name,setName]=useState(""),[age,setAge]=useState(""),[area,setArea]=useState(""),[goal,setGoal]=useState(""),[copied,setCopied]=useState(false);
 async function copyVodafone(){try{await navigator.clipboard.writeText(VODAFONE_CASH);setCopied(true);setTimeout(()=>setCopied(false),1800)}catch{setCopied(false)}}
 function submit(e:FormEvent){e.preventDefault();window.open(wa(`أهلاً Be Fighter، عايز أعرف البرنامج المناسب لطفلي.\nالاسم: ${name||"-"}\nالعمر: ${age||"-"}\nالمنطقة: ${area||"-"}\nالهدف: ${goal||"-"}`),"_blank","noopener,noreferrer")}
 return <main className={styles.page} dir="rtl">
  <header className={styles.header}>
   <a href="#top" className={styles.brand}><img src="/media/be-fighter-logo.png" alt="Be Fighter Academy"/></a>
   <nav className={styles.nav}><a href="#why">ليه برايفت؟</a><a href="#method">طريقة التدريب</a><a href="#evaluation">جلسة التقييم</a><a href="#packages">الباقات</a><a href="#faq">الأسئلة</a></nav>
   <a className={styles.headerCta} href="#evaluation">احجز جلسة تقييم — 800 جنيه</a>
  </header>
  <section id="top" className={styles.hero}>
   <img className={styles.heroBg} src="/media/ramadan-garden-kids.png" alt="تدريب أطفال في الجاردن"/><div className={styles.heroShade}/>
   <div className={styles.heroInner}><div className={styles.heroCopy}>
    <span className={styles.eyebrow}>BE FIGHTER KIDS • PRIVATE COACHING</span>
    <h1>ابدأ <em>بتقييم واضح</em><br/>قبل ما تختار الباقة</h1>
    <p>جلسة تقييم فردية لطفلك تساعدنا نفهم مستواه وهدفه وطريقة التدريب الأنسب — ثم نرشح لك البرنامج المناسب، بتكلفة واضحة، وفي <strong>مكانك</strong>.</p>
    <div className={styles.chips}><span>مناسب للمبتدئين</span><span>في البيت أو الجاردن</span><span>متابعة تدريجية</span></div>
    <div className={styles.actions}><a className={styles.primary} href={wa("أهلاً Be Fighter، عايز أعرف البرنامج المناسب لطفلي.")}>احجز جلسة تقييم — 800 جنيه</a><a className={styles.secondary} href="#packages">شوف الباقات بعد التقييم</a></div>
    
   </div></div>
  </section>
  <section className={styles.strip}><span>ثقة بالنفس</span><span>تركيز أفضل</span><span>انضباط أعلى</span><span>دفاع عن النفس</span><span>لياقة أقوى</span></section>
  <section id="why" className={styles.section}>
   <div className={styles.head}><span>أكتر من مجرد تمرين</span><h2>ليه <em>بي فايتر؟</em></h2><p>بنبني مع الطفل الثقة والانضباط والتركيز واللياقة، مع أساس دفاع عن النفس مناسب لسنه ومستواه.</p></div>
   <div className={styles.cards}>{benefits.map(([t,d])=><article key={t}><b>✦</b><h3>{t}</h3><p>{d}</p></article>)}</div>
  </section>
  <section className={styles.split}>
   <div><span className={styles.kicker}>ليه التدريب البرايفت؟</span><h2>لأن كل طفل <em>له نقطة بداية مختلفة</em></h2><ul><li>اهتمام مباشر من الكابتن.</li><li>التمرين يتدرج حسب مستوى الطفل.</li><li>بيئة مألوفة في مكانك تساعده يتعامل براحة.</li><li>تواصل أوضح مع ولي الأمر.</li></ul><a className={styles.primary} href={wa("عايز أعرف هل التدريب البرايفت مناسب لطفلي.")}>اسأل عن حالة طفلك</a></div>
   <figure><img src="/media/ramadan-garden-balance.png" alt="تدريب طفل في الجاردن"/><figcaption>في مكانك • تدريب فردي • خطة حسب المستوى</figcaption></figure>
  </section>
  <section id="method" className={styles.section}><div className={styles.head}><span>طريقة Be Fighter</span><h2>من أول حصة.. <em>نمشي بخطوات واضحة</em></h2></div><div className={styles.steps}>{steps.map(([n,t,d])=><article key={n}><i>{n}</i><h3>{t}</h3><p>{d}</p></article>)}</div></section>
  <section className={styles.coach}><div className={styles.coachPic}><img src={COACH} alt="كابتن رمضان أمين"/></div><div><span className={styles.kicker}>المؤسس والمدرب</span><h2>كابتن <em>رمضان أمين</em></h2><p>مؤسس Be Fighter Academy ومدرب ملاكمة وكيك بوكسينج وMMA ودفاع عن النفس ولياقة. تدريب الأطفال بيركز على التدرج، الأمان، بناء الثقة والأساس الحركي الصح.</p><div className={styles.tags}><span>Physical Education</span><span>Kids Coaching</span><span>Combat Sports</span><span>Private Training</span></div></div></section>
  <section id="evaluation" className={styles.evaluation}>
   <div className={styles.evalIntro}><span className={styles.kicker}>الخطوة الأولى</span><h2>احجز <em>جلسة تقييم</em> لطفلك — 800 جنيه</h2><p>جلسة مخصصة نفهم فيها مستوى الطفل، الهدف، وطريقة استجابته للتدريب؛ وبعدها نرشحلك البداية الأنسب بدل ما تختار باقة عشوائيًا.</p><ul><li>تقييم مبدئي للحركة واللياقة.</li><li>ملاحظة الوقفة، التركيز، والاستجابة للتعليمات.</li><li>تحديد أولويات التدريب المناسبة للطفل.</li><li>ترشيح الباقة المناسبة بعد التقييم.</li></ul></div>
   <div className={styles.paymentCard}><div className={styles.evalPrice}><span>جلسة تقييم فردية</span><strong>800 <small>EGP</small></strong></div><p>اختار طريقة الدفع، وبعد التحويل ابعت صورة الإيصال على واتساب لتأكيد الحجز والموعد.</p><div className={styles.paymentMethods}><a className={styles.primary} href={INSTAPAY_LINK} target="_blank" rel="noopener noreferrer">ادفع عبر InstaPay</a><button type="button" className={styles.cashButton} onClick={copyVodafone}>{copied?"تم نسخ الرقم ✓":"Vodafone Cash — 01001110897"}</button></div><a className={styles.confirmButton} href={wa("أهلاً Be Fighter، حولت 800 جنيه لحجز جلسة تقييم لطفلي وعايز أأكد الموعد.")}>أرسل الإيصال وأكد الحجز على واتساب</a><small>InstaPay: ramadan.morgan@instapay</small></div>
  </section>
  <section id="packages" className={styles.section}><div className={styles.head}><span>الباقات</span><h2>بعد التقييم نرشح <em>البداية المناسبة</em></h2><p>باقات مرنة تناسب احتياج طفلك بعد جلسة التقييم.</p></div><div className={styles.pricing}>{packs.map((p,i)=><article key={p[0]} className={i===1?styles.popular:""}>{i===1&&<strong>الأكثر اختيارًا</strong>}<h3>{p[0]}</h3><div>{p[1]} <small>EGP</small></div><p>{p[2]}</p><a className={styles.primary} href={wa(`عايز أعرف تفاصيل باقة ${p[0]} للأطفال.`)}>اسأل عن الباقة</a></article>)}</div></section>
  <section className={styles.lead}><div><span className={styles.kicker}>مش عارف تبدأ بأي باقة؟</span><h2>ابعتلنا بيانات بسيطة ونرشحلك <em>البداية الأنسب</em></h2><p>الفورم هيفتح رسالة واتساب جاهزة بالبيانات.</p></div><form onSubmit={submit}><label>اسم ولي الأمر<input value={name} onChange={e=>setName(e.target.value)} /></label><div className={styles.two}><label>عمر الطفل<input value={age} onChange={e=>setAge(e.target.value)}/></label><label>المنطقة<input value={area} onChange={e=>setArea(e.target.value)}/></label></div><label>أهم هدف<textarea value={goal} onChange={e=>setGoal(e.target.value)} /></label><button className={styles.primary}>ابعت على واتساب</button></form></section>
  <section id="faq" className={styles.section}><div className={styles.head}><span>الأسئلة الشائعة</span><h2>قبل ما <em>تبدأ</em></h2></div><div className={styles.faq}><details><summary>هل التدريب مناسب لطفل مبتدئ؟</summary><p>أيوه، بنبدأ من مستواه الحالي ونتدرج معاه.</p></details><details><summary>التدريب بيكون فين؟</summary><p>في مكانك: البيت، الجاردن، الروف أو Private Gym.</p></details><details><summary>هل الهدف إن الطفل يبقى عنيف؟</summary><p>لا، التركيز على الثقة والانضباط والحركة والدفاع عن النفس بشكل مسؤول.</p></details><details><summary>أختار 6 ولا 8 ولا 12 حصة؟</summary><p>بنحدد ده حسب العمر والهدف والمستوى والانتظام، وتقدر تبدأ بجلسة تقييم بـ800 جنيه لو محتاج ترشيح أدق.</p></details><details><summary>إزاي أحجز جلسة التقييم؟</summary><p>حوّل 800 جنيه عبر InstaPay أو Vodafone Cash، وبعدها ابعت صورة الإيصال على واتساب علشان نأكد معاك الموعد.</p></details></div></section>
  <section className={styles.final}><img src="/media/ramadan-garden-kids.png" alt=""/><div><span>الخطوة الأولى</span><h2>ابدأ بجلسة تقييم<br/>ثم <em>اختر بثقة</em></h2><a className={styles.primary} href="#evaluation">احجز جلسة تقييم — 800 جنيه</a></div></section>
  <a className={styles.mobile} href="#evaluation">احجز جلسة تقييم — 800 جنيه</a>
 </main>
}