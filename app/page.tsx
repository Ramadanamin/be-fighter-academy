"use client";

import { FormEvent, useEffect, useState, MouseEvent } from "react";
import { ArrowLeft, Award, BarChart3, Check, ChevronDown, Clock3, Dumbbell, HeartHandshake, LockKeyhole, MapPin, Menu, MessageCircle, Phone, ShieldCheck, Sparkles, Target, TimerReset, UserRound, UsersRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Language = "ar" | "en";
const waNumber = "201001110897";
const wa = (message: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
const areas = [
  { id: "madinaty", ar: "مدينتي", en: "Madinaty" },
  { id: "rehab", ar: "الرحاب", en: "Al Rehab" },
  { id: "shorouk", ar: "الشروق", en: "El Shorouk" },
  { id: "golf", ar: "كمباوند الجولف", en: "Golf Compound" },
  { id: "diar", ar: "الديار", en: "Al Diar" },
];

function BrandMark({ language }: { language: Language }) {
  return <a className="brand-mark" href="#top" aria-label={language === "ar" ? "بي فايتر أكاديمي — الرئيسية" : "Be Fighter Academy — home"}><img src="/media/be-fighter-logo.png" width="130" height="110" alt="Be Fighter — Ramadan Amin" /></a>;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "ar";
    try { return localStorage.getItem("be-fighter-language") === "en" ? "en" : "ar"; } catch { return "ar"; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [program, setProgram] = useState("");
  const [area, setArea] = useState("");
  const [trainingType, setTrainingType] = useState("");
  const [packageChoice, setPackageChoice] = useState("");
  const [formStatus, setFormStatus] = useState<"" | "saving" | "saved" | "failed">("");
  const t = (ar: string, en: string) => language === "ar" ? ar : en;
  const direction = language === "ar" ? "rtl" : "ltr";


  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = language === "ar" ? "Be Fighter Academy | تدريب قتالي برايفت في بيتك" : "Be Fighter Academy | Private Combat Training at Home";
    document.querySelector('meta[name="description"]')?.setAttribute("content", language === "ar" ? "مدرب ملاكمة وكيك بوكسينج وMMA ودفاع عن النفس في بيتك للأطفال والكبار. تدريب برايفت في مدينتي والرحاب والشروق والجولف والديار. اطلب تفاصيل برنامجك." : "Private boxing, kickboxing, MMA and self-defense training for kids and adults at your home. Serving Madinaty, Al Rehab, El Shorouk, Golf Compound and Al Diar.");
  }, [language]);

  useEffect(() => {
    const elements = document.querySelectorAll("main > section:not(.hero)");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } });
    }, { threshold: 0.08 });
    elements.forEach(element => { element.classList.add("reveal-section"); observer.observe(element); });
    return () => { observer.disconnect(); elements.forEach(element => element.classList.remove("reveal-section")); };
  }, []);

  function tiltScene(event: MouseEvent<HTMLDivElement>) {
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--tilt-x", ((event.clientY - box.top) / box.height * -8 + 4) + "deg");
    event.currentTarget.style.setProperty("--tilt-y", ((event.clientX - box.left) / box.width * 10 - 5) + "deg");
  }

  function switchLanguage() {
    const next = language === "ar" ? "en" : "ar";
    setLanguage(next);
    setMenuOpen(false);
    try { localStorage.setItem("be-fighter-language", next); } catch { /* Optional device preference. */ }
  }

  const programOptions = [
    { id: "kids", label: t("طفل 6–14 سنة", "Child aged 6–14") },
    { id: "adults", label: t("شخص بالغ", "Adult") },
    { id: "group", label: t("مجموعة خاصة", "Private group") },
    { id: "recommend", label: t("ساعدني أختار", "Help me choose") },
  ];
  const trainingOptions = [
    { id: "boxing", label: "Boxing" },
    { id: "kickboxing", label: "Kickboxing" },
    { id: "mma", label: "MMA" },
    { id: "self_defense", label: t("دفاع عن النفس", "Self-defense") },
    { id: "fitness", label: "Fitness" },
    { id: "not_sure", label: t("محتاج ترشيح", "Help me choose") },
  ];
  const packageOptions = [
    {
      id: "starter_private",
      name: t("بداية", "STARTER"),
      price: "6,000",
      sessions: t("6 حصص برايفت — 1,000 جنيه للحصة تقريبًا", "6 private sessions — approx. 1,000 EGP/session"),
      description: t("بداية مناسبة لتجربة التدريب البرايفت وبناء روتين واضح.", "A focused introduction to private coaching and a consistent routine."),
      features: [t("تقييم مبدئي", "Initial assessment"), t("خطة تدريب أساسية", "Basic training plan"), t("تدريب في مكانك", "Training at your location"), t("مرونة في المواعيد", "Flexible scheduling"), t("متابعة أساسية للتقدم", "Basic progress monitoring")],
      cta: t("ابدأ تجربتك", "Start your experience"),
    },
    {
      id: "private_coaching",
      name: t("انتظام", "CONSISTENCY"),
      price: "7,000",
      sessions: t("8 حصص برايفت — 875 جنيه للحصة تقريبًا", "8 private sessions — approx. 875 EGP/session"),
      description: t("للي عايز التدريب يبقى جزء ثابت من روتينه بمتابعة منتظمة.", "For anyone ready to make private coaching a consistent part of their routine."),
      features: [t("تقييم مبدئي", "Initial assessment"), t("خطة تدريب مخصصة", "Personalized training plan"), t("متابعة للتقدم وتصحيح للتكنيك", "Progress monitoring & technique correction"), t("مرونة في المواعيد", "Flexible scheduling"), t("تدريب في مكانك", "Training at your location"), t("متابعة دورية", "Regular progress follow-up")],
      cta: t("اسأل عن باقة الانتظام", "Start private coaching"),
      popular: true,
    },
    {
      id: "signature_coaching",
      name: t("متابعة موسّعة", "EXTENDED FOLLOW-UP"),
      price: "10,000",
      sessions: t("12 حصة برايفت — 833 جنيه للحصة تقريبًا", "12 private sessions — approx. 833 EGP/session"),
      description: t("تجربة Premium بمتابعة أعمق ودعم مباشر من المدرب.", "A premium coaching experience with deeper monitoring and direct support."),
      features: [t("تقييم شامل وبرنامج مخصص", "Full assessment & personalized programme"), t("متابعة متقدمة ولقاء أسبوعي", "Advanced monitoring & weekly check-ins"), t("تقرير للتقدم", "Progress report"), t("إرشادات نشاط بسيطة بين الحصص", "Simple activity guidance between sessions"), t("مكالمة متابعة أسبوعية 15 دقيقة", "Weekly 15-minute follow-up call"), t("دعم مباشر من المدرب", "Direct coach support"), t("تقرير مكتوب في نهاية الباقة", "Written end-of-package progress report")],
      cta: t("اعرف تفاصيل المتابعة الموسعة", "Start signature coaching"),
      signature: true,
    },
  ];
  const packageLabels: Record<string, string> = {
    starter_private: "6 حصص — 6,000 EGP",
    private_coaching: "8 حصص — 7,000 EGP",
    signature_coaching: "12 حصة — 10,000 EGP",
    private_circle: t("العيلة والمجموعة — 16,000–24,000 جنيه", "Family & groups — 16,000–24,000 EGP"),
  };
  const programs = [
    { id: "kids", icon: ShieldCheck, label: t("للأطفال 6–14 سنة", "FOR KIDS AGED 6–14"), title: t("طفلك مش محتاج يبقى عدواني. محتاج يبقى واثق.", "Confidence for your child. Not aggression."), description: t("حصص برايفت يتعلّم فيها يقف بثبات، يستخدم صوته، ويتصرّف بهدوء. نبدأ بمستواه ونبني مهارته خطوة بخطوة، في مكان مألوف ليه.", "One-to-one sessions to practise a confident stance, a clear voice and calm responses. We start at your child’s level, in a space where they feel comfortable."), points: [t("ملاكمة وكيك بوكسينج بأساسيات متدرّجة", "Progressive boxing & kickboxing fundamentals"), t("دفاع عن النفس مع التركيز على الأمان", "Self-defense with safety first"), t("متابعة للتقدّم يقدر ولي الأمر يفهمها", "Clear progress updates for parents")], cta: t("اعرف البرنامج المناسب لطفلك", "Find your child’s programme") },
    { id: "adults", icon: Clock3, label: t("للكبار وأصحاب اليوم المشغول", "FOR BUSY ADULTS"), title: t("وقت أقل في الطريق. طاقة أكتر ليومك.", "Less travel. More energy for your day."), description: t("وفّر مشوار الجيم وانتظار الأجهزة. مدربك بيجيلك بحصة فيها حركة ومهارة وتحدّي، حسب لياقتك ومواعيدك؛ مش حسب برنامج حد تاني.", "Skip the gym commute and waiting for equipment. Your coach comes to you with movement, skill and a challenge matched to your fitness and schedule."), points: [t("ملاكمة، كيك بوكسينج وMMA", "Boxing, kickboxing & MMA"), t("قوة ولياقة بتدرّج يناسبك", "Strength & conditioning at your pace"), t("مواعيد نتفق عليها حسب يومك", "Sessions planned around your day")], cta: t("اعرف تفاصيل تدريبك البرايفت", "Explore your private training") },
    { id: "group", icon: UserRound, label: t("فردي أو مجموعة خاصة", "ONE-TO-ONE OR PRIVATE GROUP"), title: t("الناس اللي تختارهم. في المكان اللي يريحك.", "Your people. Your space. Your training."), description: t("اتدرّب لوحدك أو مع أولادك أو أصحابك. حصص في البيت أو الروف أو الجاردن، باهتمام مباشر من المدرب من غير زحمة جيم أو مجموعة عشوائية.", "Train on your own, with your children or with friends. Get your coach’s direct attention at home, on your rooftop or in your garden—without a crowded gym."), points: [t("تدريب في مكانك الخاص", "Training in your own space"), t("خطة حسب مستوى المتدربين", "A plan matched to the participants"), t("تفاصيل الباقة حسب عددكم ومنطقتكم", "A quote based on your group and location")], cta: t("اطلب تفاصيل المجموعة الخاصة", "Ask about a private group") },
  ];
  const results = [
    [t("ثقة في التصرف", "Confidence in action"), t("نتدرّب على الوقفة والصوت ورد الفعل، مش الضرب بس.", "Practise posture, voice and reactions—not just punches.")],
    [t("لياقة تخدم يومك", "Fitness for everyday life"), t("نشتغل على القوة والتحمّل والتوازن حسب مستواك.", "Build strength, stamina and balance from your starting level.")],
    [t("مهارة مش عشوائية", "Skills, not guesswork"), t("تكنيك بيتشرح ويتصحّح في كل حصة.", "Technique explained and corrected throughout each session.")],
    [t("استمرارية أسهل", "Consistency made easier"), t("مواعيد متفق عليها ومدرب بيوصلك؛ مشوار أقل وحركة أكتر.", "Agreed session times and a coach who comes to you. Less travelling, more training.")],
  ];
  const faqs = [
    [t("طفلي خجول ومش متعوّد على التدريب؛ ينفع يبدأ؟", "Can my shy child start without any training experience?"), t("أيوه. بنبدأ بالتعارف وحركات بسيطة حسب السن والمستوى، من غير ضغط أو مقارنة بطفل تاني. الهدف إنه يرتاح للتدريب ويتعلّم بالتدريج.", "Yes. We start with getting comfortable and simple age-appropriate movements, without pressure or comparisons. Your child can learn gradually at their own level.")],
    [t("أنا مبتدئ ولياقتي قليلة؛ البرنامج مناسب؟", "Is the training suitable if I’m a beginner?"), t("مش مطلوب تكون جاهز قبل ما تبدأ. بنعرف هدفك ومستواك، ونحدد شدّة الحصة والتكنيك المناسبين ليك. لو عندك إصابة أو قيد صحي، عرّفنا قبل البداية.", "You don’t need to get fit before starting. We discuss your goal and current level, then match the session intensity and skills to you. Tell us about any injury or health limitations before you begin.")],
    [t("محتاج مساحة أو معدات إيه في البيت؟", "What space or equipment do I need at home?"), t("مكان آمن يسمح بالحركة، زي صالة أو روف أو جاردن. قبل الاتفاق، بنراجع المساحة والمعدات المطلوبة حسب نوع التدريب؛ مش لازم يكون عندك جيم كامل.", "A safe space to move, such as a room, rooftop or garden. Before you commit, we review the space and equipment needed for your programme. You don’t need a full home gym.")],
    [t("التدريب متاح فين؟", "Which areas do you cover?"), t("مدينتي، الرحاب، الشروق، كمباوند الجولف والديار. لو في منطقة قريبة مش مذكورة، ابعت موقعك وهنأكد لك إمكانية الخدمة والمواعيد.", "Madinaty, Al Rehab, El Shorouk, Golf Compound and Al Diar. For another nearby area, send your location and we’ll confirm availability and session times.")],
    [t("أختار أنهي باقة؟", "Which package should I choose?"), t("باقة بداية فيها 8 حصص بـ5,600 جنيه. انتظام فيها 12 حصة بـ7,800 جنيه. متابعة موسعة فيها 12 حصة بـ10,000 جنيه مع تقرير ومكالمة متابعة أسبوعية. وللأسرة أو المجموعة الخاصة فيه باقات لـ2 أو 3 أو 4 أفراد.", "Starter includes 8 sessions for 5,600 EGP. Consistency includes 12 for 7,800 EGP. Extended follow-up includes 12 for 10,000 EGP with a report and weekly check-in. Family packages are available for groups of two, three or four.")],
  ];
  const navItems = [[t("البرامج", "Programmes"), "#programs"], [t("طريقتنا", "How it works"), "#method"], [t("الباقات", "Packages"), "#packages"], [t("المدربين", "Coaches"), "#coaches"], [t("الجاردن", "Garden training"), "#garden"], [t("الأسئلة", "FAQ"), "#faq"]];
  const inquiry = t("أهلًا Be Fighter Academy، عايز أعرف البرنامج المناسب وتكلفة التدريب البرايفت في منطقتي.", "Hi Be Fighter Academy, I’d like a suitable private training programme and a quote for my area.");

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const selectedArea = areas.find(item => item.id === area);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const goal = String(data.get("goal") || "").trim();
    const childAge = String(data.get("childAge") || "").trim();
    const participants = String(data.get("participants") || "").trim();
    const preferredTime = String(data.get("preferredTime") || "").trim();
    const notes = String(data.get("notes") || "").trim();
    const message = [
      inquiry,
      `${t("الاسم", "Name")}: ${name}`,
      `${t("رقم التواصل", "Phone")}: ${phone}`,
      `${t("المتدرّب", "Participant")}: ${programOptions.find(item => item.id === program)?.label || t("ساعدني أختار", "Help me choose")}`,
      `${t("نوع التدريب", "Training")}: ${trainingOptions.find(item => item.id === trainingType)?.label || t("محتاج ترشيح", "Help me choose")}`,
      `${t("الباقة", "Package")}: ${packageChoice ? packageLabels[packageChoice] : t("محتاج ترشيح", "Please recommend")}`,
      `${t("المنطقة", "Area")}: ${selectedArea?.[language] || t("منطقة أخرى / هحددها في المحادثة", "Other area / I’ll share it in the chat")}`,
      childAge ? `${t("سن الطفل", "Child age")}: ${childAge}` : "",
      participants ? `${t("عدد المتدربين", "Participants")}: ${participants}` : "",
      preferredTime ? `${t("الوقت المناسب", "Preferred time")}: ${preferredTime}` : "",
      `${t("الهدف", "Goal")}: ${goal || t("هشرحه في المحادثة", "I’ll explain in the chat")}`,
      notes ? `${t("تفاصيل إضافية", "Additional details")}: ${notes}` : "",
    ].filter(Boolean).join("\n");
    const chatWindow = window.open("", "_blank");
    setFormStatus("saving");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, traineeType: program, childAge, trainingType, participants, goal, area, preferredTime, packageChoice, notes, language }),
      });
      if (!response.ok) throw new Error("save failed");
      setFormStatus("saved");
    } catch {
      setFormStatus("failed");
    } finally {
      const target = wa(message);
      if (chatWindow) chatWindow.location.href = target;
      else window.location.href = target;
    }
  }

  return (
    <main id="top" dir={direction} lang={language}>
      <header className="site-header"><div className="container header-inner">
        <BrandMark language={language} />
        <nav className="desktop-nav" aria-label={t("التنقل الرئيسي", "Main navigation")}>{navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
        <Button asChild className="header-cta"><a href="#book">{t("اطلب تفاصيل برنامجك", "Get your quote")} <ArrowLeft aria-hidden="true" /></a></Button>
        <Button className="language-toggle" variant="outline" type="button" onClick={switchLanguage} aria-label={t("Switch to English", "التبديل للعربية")}><span lang={language === "ar" ? "en" : "ar"}>{t("English", "العربية")}</span></Button>
        <button className="mobile-menu-button" type="button" aria-label={menuOpen ? t("إغلاق القائمة", "Close menu") : t("فتح القائمة", "Open menu")} aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>{menuOpen && <nav className="mobile-nav" aria-label={t("التنقل على الموبايل", "Mobile navigation")}>{[...navItems, [t("اطلب تفاصيل برنامجك", "Get your quote"), "#book"]].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>}</header>

      <section className="hero section-dark" aria-labelledby="hero-title">
        <div className="hero-word" aria-hidden="true">FIGHTER</div>
        <div className="hero-grid container">
          <div className="hero-copy">
            <div className="eyebrow"><span /> BE FIGHTER ACADEMY</div>
            <h1 id="hero-title">{t("تدريب قتالي برايفت.", "Private coaching.")}<br /><em>{t("لحد باب بيتك.", "At your doorstep.")}</em></h1>
            <div className="hero-offer">{t("ثقة لطفلك.", "Confidence for your child.")} <b>{t("لياقة وقوّة ليك.", "Fitness and strength for you.")}</b></div>
            <p>{t("ملاكمة، كيك بوكسينج، MMA ودفاع عن النفس في بيتك أو الروف أو الجاردن. اهتمام مباشر من المدرب، خطة حسب مستواك، ومواعيد تناسب يومك. في مدينتي والرحاب والشروق والمناطق القريبة.", "Boxing, kickboxing, MMA and self-defense at home, on your rooftop or in your garden. Your coach’s direct attention, a plan matched to your level and sessions that fit your day. In Madinaty, Al Rehab, El Shorouk and nearby areas.")}</p>
            <div className="hero-actions"><Button asChild size="lg" className="gold-button"><a href="#book">{t("اعرف برنامجك وتكلفته", "Get your programme & quote")} <ArrowLeft aria-hidden="true" /></a></Button><Button asChild size="lg" variant="outline" className="ghost-button"><a href={wa(inquiry)} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> {t("كلّم فريق Be Fighter", "Talk to Be Fighter")}</a></Button></div>
            <div className="hero-proof" aria-label={t("مميزات التدريب", "Training benefits")}><span><ShieldCheck aria-hidden="true" /> {t("مناسب للمبتدئين", "Beginners welcome")}</span><span><MapPin aria-hidden="true" /> {t("في مكانك الخاص", "In your own space")}</span><span><Target aria-hidden="true" /> {t("فردي أو مجموعة خاصة", "One-to-one or private group")}</span></div>
          </div>
          <div className="hero-visual depth-scene" onMouseMove={tiltScene} onMouseLeave={event => { event.currentTarget.style.setProperty("--tilt-x", "0deg"); event.currentTarget.style.setProperty("--tilt-y", "0deg"); }}><div className="portrait-backdrop" aria-hidden="true" /><div className="portrait-stroke" aria-hidden="true" /><img className="hero-coach" src="/media/ramadan-fighting-stance.png" alt={t("كابتن رمضان أمين في وقفة ملاكمة", "Coach Ramadan Amin in a boxing guard")} width="1024" height="1536" fetchPriority="high" /><div className="portrait-label"><span>{t("مؤسس ومدرب", "FOUNDER & COACH")}</span><b>{t("كابتن رمضان أمين", "Coach Ramadan Amin")}</b><small>Be Fighter Academy</small></div><span className="visual-caption">{t("ملاكمة · كيك بوكسينج · MMA", "BOXING · KICKBOXING · MMA")}</span></div>
        </div>
        <div className="hero-strip" aria-label={t("الألعاب المتاحة", "Available training")}><div className="strip-track">{[0, 1].map(copy => <div className="strip-group" aria-hidden={copy === 1} key={copy}>{[t("ملاكمة", "BOXING"), t("كيك بوكسينج", "KICKBOXING"), "MMA", t("دفاع عن النفس", "SELF-DEFENSE"), t("لياقة بدنية", "FITNESS")].map(sport => <span className="strip-item" key={`${copy}-${sport}`}><i aria-hidden="true" />{sport}</span>)}</div>)}</div></div>
      </section>

      <section id="why-private" className="private-value-section section-light"><div className="container"><div className="private-value-head"><div><div className="eyebrow dark"><span /> {t("ليه Be Fighter Private Coaching؟", "WHY BE FIGHTER PRIVATE COACHING?")}</div><h2>{t("مش مجرد مدرب واقف جنبك.", "More than a coach standing beside you.")}<br /><em>{t("دي تجربة معمولة لحياتك.", "An experience built around your life.")}</em></h2><p>{t("في Be Fighter بنبني تدريب يناسب وقتك، مكانك، هدفك وتطورك—من أول تقييم لحد متابعة النتيجة.", "At Be Fighter, coaching is shaped around your time, your place, your goal and your progress—from assessment to follow-up.")}</p></div><div className="gear-art"><div className="turquoise-orbit" aria-hidden="true" /><img src="/media/be-fighter-3d-training-gear.png" alt={t("جلافز ملاكمة وأدوات تدريب ثلاثية الأبعاد", "3D boxing gloves and training equipment")} width="1536" height="1024" loading="lazy" /></div></div><div className="private-value-grid">{[
        { icon: TimerReset, title: t("وقتك ليك", "Your time is yours"), text: t("المدرب هو اللي بيجيلك في البيت أو الجاردن أو الـPrivate Gym. إنت بتحدد الوقت المناسب، وإحنا بنوصل لك.", "Your coach comes to your home, garden or private gym. You choose the time that works, and we come to you.") },
        { icon: LockKeyhole, title: t("خصوصية كاملة", "Complete privacy"), text: t("التدريب في مساحتك الخاصة بعيد عن المجموعات الكبيرة. كل تركيز المدرب عليك أنت أو أفراد أسرتك فقط.", "Train in your private space, away from large groups. Your coach’s full attention stays on you or your family.") },
        { icon: Dumbbell, title: t("برنامج معمول ليك", "A programme built for you"), text: t("مش Workout محفوظ لكل الناس. التدريب بيتحدد حسب مستواك، هدفك، قدراتك وتطورك.", "Not a recycled workout for everyone. Your training follows your level, goals, ability and development.") },
        { icon: BarChart3, title: t("متابعة واضحة لتقدمك", "Monitoring & progress tracking"), text: t("بنتابع الأداء والمستوى والالتزام، ونعدّل التدريب بناءً على تقدمك؛ عشان تعرف بدأت منين ووصلت لفين.", "We monitor performance, level and consistency, then adjust training around your progress—so you can see where you started and how far you’ve come.") },
      ].map(item => { const Icon = item.icon; return <article key={item.title}><span><Icon aria-hidden="true" /></span><h3>{item.title}</h3><p>{item.text}</p></article>; })}</div><div className="private-signature"><span>Your Coach.</span><span>Your Place.</span><span>Your Progress.</span><b>{t("مدربك. مكانك. تقدمك.", "Built around you.")}</b></div></div></section>

      <section id="garden" className="garden-section section-dark"><div className="container">
        <div className="garden-heading"><div><div className="eyebrow"><span /> {t("تدريب في مساحتكم", "TRAIN IN YOUR OWN SPACE")}</div><h2>{t("الجاردن يبقى", "Your garden.")}<br /><em>{t("مساحة للتقدم.", "Room to grow.")}</em></h2></div><p>{t("في جاردن البيت أو الكمباوند، حصة تجمع الحركة والمهارة واهتمام المدرب. بنراجع الأرضية والمساحة والجو قبل الاتفاق على المكان.", "Movement, skills and focused coaching in your home or compound garden. We review the surface, space and weather before agreeing on your training location.")}</p></div>
        <div className="garden-gallery"><figure className="garden-photo garden-photo-wide"><img src="/media/ramadan-garden-kids.png" width="1536" height="1024" loading="lazy" alt={t("مشهد توضيحي مولّد لكابتن رمضان أمين يدرب أطفالًا على أدوات الملاكمة في جاردن كمباوند", "AI illustration of Ramadan Amin coaching children with boxing mitts in a compound garden")} /><figcaption><span>01 / {t("الحركة والتكنيك", "MOVEMENT & TECHNIQUE")}</span><b>{t("كل خطوة، باهتمام مدربك.", "Every step, with your coach.")}</b></figcaption></figure><figure className="garden-photo"><img src="/media/ramadan-garden-balance.png" width="1536" height="1024" loading="lazy" alt={t("مشهد توضيحي مولّد لتدريب الأطفال على التوازن والحركة في الجاردن", "AI illustration of children practising balance and movement in a garden")} /><figcaption><span>02 / {t("التوازن والثقة", "BALANCE & CONFIDENCE")}</span><b>{t("نتعلم ونستمتع بالحركة.", "Learn. Move. Enjoy.")}</b></figcaption></figure></div>
        <div className="garden-bottom"><p>{t("صور توضيحية مولّدة بالذكاء الاصطناعي؛ لا توثّق حصصًا فعلية.", "AI-generated illustrative images; these do not document real sessions.")}</p><a href="#book" onClick={() => setProgram("kids")}>{t("اعرف البرنامج المناسب لطفلك", "Find your child’s programme")} <ArrowLeft /></a></div>
      </div></section>

      <section id="programs" className="programs-section section-light"><div className="container"><div className="section-heading"><div><div className="eyebrow dark"><span /> {t("مين هيتمرّن؟", "WHO’S TRAINING?")}</div><h2>{t("اختار هدفك.", "Choose your goal.")}<br />{t("وسيّب الخطة علينا.", "We’ll build the plan.")}</h2></div><p>{t("برنامج طفلك غير برنامجك. بنعرف السن والخبرة والهدف عشان الحصص تناسب المتدرّب، مش العكس.", "Your child’s programme shouldn’t look like yours. We consider age, experience and goals to make the sessions fit the person.")}</p></div><div className="program-grid">{programs.map((item, index) => { const Icon = item.icon; return <article className={`program-card ${index === 0 ? "featured" : ""}`} key={item.id}><div className="card-topline"><span>0{index + 1}</span><Icon aria-hidden="true" /></div><small>{item.label}</small><h3>{item.title}</h3><p>{item.description}</p><ul>{item.points.map(point => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul><a href="#book" onClick={() => setProgram(item.id)}>{item.cta}<ArrowLeft aria-hidden="true" /></a></article>; })}</div></div></section>

      <section className="kids-safety-section section-dark"><div className="container kids-safety-grid"><div className="kids-safety-copy"><div className="eyebrow"><span /> BE FIGHTER KIDS</div><h2>{t("لأطفالك…", "For your child…")}<br /><em>{t("الأمان قبل أي مهارة.", "Safety before any skill.")}</em></h2><p>{t("هدفنا مش إن الطفل يتعلم يضرب. الأولوية إنه يعرف يتحرك صح، يتحكم في جسمه، يثق في نفسه، ويفهم إمتى يدافع عن نفسه وإمتى يبعد ويطلب المساعدة.", "Our goal isn’t to teach a child to hit. We first teach safe movement, body control and confidence—when to protect themselves, and when to move away and ask for help.")}</p><div className="safety-path" aria-label={t("ترتيب أولويات تدريب الأطفال", "Kids training priorities")}><span>Safety</span><i /><span>Confidence</span><i /><span>Discipline</span><i /><span>Skills</span></div><p>{t("التدريب بيتم في مكان الطفل وتحت إشراف الأسرة، مع مدرب مركز عليه بشكل مباشر. ومع الـMonitoring، ولي الأمر يقدر يعرف تطور الطفل بدل ما التدريب يبقى مجرد حصة وخلاص.", "Training happens in the child’s own environment, with family oversight and the coach’s direct attention. Monitoring gives parents a clear view of progress—not just another completed session.")}</p><Button asChild className="gold-button" size="lg"><a href="#book" onClick={() => setProgram("kids")}>{t("اعرف برنامج طفلك", "Explore your child’s programme")}<ArrowLeft aria-hidden="true" /></a></Button></div><div className="kids-focus-card"><div className="focus-number">06</div><b>{t("حاجات بنبنيها مع الطفل", "What we build with your child")}</b><ul>{[t("الحركة الصحيحة", "Safe movement"), t("التحكم في الجسم", "Body control"), t("التوازن", "Balance"), t("الثقة بالنفس", "Self-confidence"), t("التصرف وقت الخطر", "Knowing how to respond"), t("الابتعاد وطلب المساعدة", "Moving away and asking for help")].map(item => <li key={item}><Check />{item}</li>)}</ul></div></div></section>

      <section id="method" className="method-section section-dark"><div className="container method-grid"><div className="method-intro"><div className="eyebrow"><span /> {t("ابدأ من غير حيرة", "A CLEAR WAY TO START")}</div><h2>{t("هدفك واضح.", "Your goal.")}<br />{t("والخطوة الجاية سهلة.", "A clear next step.")}</h2><p>{t("اعرف البرنامج والتكلفة والمواعيد قبل ما تقرر. لا خبرة سابقة مطلوبة، ولا التزام قبل معرفة التفاصيل.", "Know the programme, price and schedule before deciding. No previous experience needed, and no commitment before you have the details.")}</p><Button asChild className="gold-button" size="lg"><a href="#book">{t("اطلب ترشيح المدرب", "Ask for a recommendation")}<ArrowLeft aria-hidden="true" /></a></Button></div><ol className="steps-list">{[
        [t("ابعت هدفك ومنطقتك", "Share your goal and area"), t("قولنا مين هيتمرّن، عايز يحقق إيه، والتدريب هيكون فين.", "Tell us who’s training, their goal and where the sessions will take place.")],
        [t("اعرف برنامجك وتكلفته", "Get your plan and quote"), t("نرشح نوع التدريب والباقة، ونوضح السعر والمواعيد المتاحة.", "We recommend a programme and package, with pricing and available session times.")],
        [t("ابدأ بخطة ومتابعة", "Start with a plan and feedback"), t("مدربك يوصلك في الموعد المتفق عليه، ويصحّح التكنيك ويتابع التقدّم.", "Your coach arrives at the agreed time, corrects technique and follows your progress.")],
      ].map(([title, text], index) => <li key={title}><span>0{index + 1}</span><div><b>{title}</b><p>{text}</p></div></li>)}</ol></div></section>

      <section className="results-section section-light"><div className="container"><div className="section-heading compact-heading"><div><div className="eyebrow dark"><span /> {t("إيه اللي بنشتغل عليه؟", "WHAT WE WORK ON")}</div><h2>{t("مش تعرّق وخلاص.", "More than a workout.")}<br />{t("مهارة تبني عليها.", "Skills you can build on.")}</h2></div><HeartHandshake className="heading-icon" aria-hidden="true" /></div><div className="results-grid">{results.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section id="packages" className="packages-section section-light"><div className="container"><div className="packages-heading"><div className="eyebrow dark"><span /> {t("اختار وتيرة التدريب", "CHOOSE YOUR COACHING LEVEL")}</div><h2>{t("اختار وتيرة التدريب.", "A coaching level for every commitment.")}<br /><em>{t("وسيّب تنظيم الخطة علينا.", "Every level built around your progress.")}</em></h2><p>{t("كل الباقات تشمل التدريب في مكانك، الخصوصية، المرونة في المواعيد وبرنامج مناسب لمستواك.", "Every package includes training at your location, privacy, flexible scheduling and a programme matched to your level.")}</p></div><div className="premium-package-grid">{packageOptions.map(item => <article className={`premium-package ${item.popular ? "is-popular" : ""} ${item.signature ? "is-signature" : ""}`} key={item.id}>{item.popular && <div className="popular-badge"><Sparkles aria-hidden="true" />{t("روتين منتظم", "CONSISTENT TRAINING")}</div>}<div className="package-label">{item.name}</div><div className="price-line"><b>{item.price}</b><span>EGP</span></div><strong>{item.sessions}</strong><p>{item.description}</p><ul>{item.features.map(feature => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul><Button asChild className={item.popular || item.signature ? "gold-button package-button" : "package-button"} variant={item.popular || item.signature ? "default" : "outline"}><a href="#book" onClick={() => setPackageChoice(item.id)}>{item.cta}<ArrowLeft aria-hidden="true" /></a></Button></article>)}</div><p className="package-terms">{t("قبل الدفع، هنوضح كتابةً مدة الحصة، المعدات، السعر النهائي، صلاحية الباقة وسياسة التأجيل. الحجز يتأكد بعد الاتفاق على التفاصيل.", "Before payment, we confirm session length, equipment, final price, package validity and rescheduling terms in writing. Booking is confirmed after agreement.")}</p><article className="private-circle-card"><div className="circle-copy"><div className="package-label">FAMILY & PRIVATE GROUPS</div><h3>{t("اتمرّنوا مع بعض. وكل واحد يتقدم من مستواه.", "Train together. Progress at your own level.")}</h3><p>{t("وقت ليكم كأسرة، أو ميعاد ثابت يجمعك بأصحابك على تمرين تحبوه. مدرب Be Fighter بيجيلكم في مكانكم، بحصة تراعي مستوى كل فرد وهدفه.", "Quality time as a family, or a fixed training session with friends. A Be Fighter coach comes to your location with a session adapted to each participant’s level and goal.")}</p><strong>{t("باقة العيلة والمجموعة الخاصة — 12 حصة", "Family & private group package — 12 sessions")}</strong><div className="circle-prices">{[[t("شخصين", "2 PEOPLE"), "16,000", "8,000"], [t("3 أشخاص", "3 PEOPLE"), "21,000", "7,000"], [t("4 أشخاص", "4 PEOPLE"), "24,000", "6,000"]].map(([count, total, individual]) => <span key={count}><small>{count}</small><b>{total} {t("جنيه إجمالي الباقة", "EGP total")}</b><small>{individual} {t("جنيه نصيب الفرد", "EGP per person")}</small></span>)}</div><strong>{t("3 أيام أسبوعيًا لمدة 4 أسابيع، في مكان وميعاد واحد.", "3 days per week for 4 weeks, at one shared location and time.")}</strong></div><div className="circle-features"><p><strong>{t("تشمل الباقة:", "Package includes:")}</strong></p><ul>{[t("تقييم مبدئي لكل مشارك.", "Initial assessment for each participant."), t("تدريب يناسب مستويات المجموعة.", "Training adapted to the group’s levels."), t("تصحيح التكنيك ومتابعة تقدم كل فرد.", "Technique correction and individual progress tracking."), t("التدريب في بيتكم أو الجاردن أو المكان الخاص المتفق عليه.", "Training at your home, garden or agreed private location.")].map(feature => <li key={feature}><Check />{feature}</li>)}</ul><p>{t("بنراجع الأعمار والمستويات قبل البداية، عشان نأكد إن التدريب مع بعض مناسب ليكم. الأطفال والكبار ممكن يحتاجوا مجموعات منفصلة حسب احتياجهم.", "We review ages and levels before starting to make sure training together is suitable. Children and adults may need separate groups depending on their needs.")}</p><Button asChild className="gold-button package-button"><a href="#book" onClick={() => { setPackageChoice("private_circle"); setProgram("group"); }}>{t("اعرف الباقة المناسبة لعيلتك", "Find the right package for your family")}<ArrowLeft /></a></Button><p>{t("الأسعار إجمالي المجموعة، والحصص مشتركة بين المشاركين. مدة الحصة وتفاصيل المعدات وسياسة التأجيل بتتوضح قبل الاشتراك.", "Prices are for the whole group and sessions are shared between participants. Session duration, equipment details and rescheduling policy are confirmed before subscription.")}</p></div></article></div></section>

      <section id="areas" className="areas-section section-dark"><div className="container areas-grid"><div><div className="eyebrow"><span /> {t("مدربك أقرب مما تتخيّل", "YOUR COACH COMES TO YOU")}</div><h2>{t("في بيتك أو الكمباوند.", "At home or in your compound.")}<br />{t("من غير مشوار الجيم.", "No gym commute.")}</h2></div><div className="areas-list">{areas.map(item => <span key={item.id}><MapPin aria-hidden="true" />{item[language]}</span>)}<a href={wa(t("أهلًا Be Fighter Academy، عايز أتأكد إن التدريب متاح في منطقتي. هبعتلكم الموقع.", "Hi Be Fighter Academy, I’d like to check training availability in my area. I’ll send my location."))} target="_blank" rel="noreferrer">{t("منطقتك مش هنا؟ ابعت موقعك", "Another area? Send your location")}<ArrowLeft aria-hidden="true" /></a></div></div></section>

      <section id="coaches" className="coach-section section-light"><div className="container coach-grid"><div className="coach-portrait"><img src="/media/ramadan-fighting-stance.png" alt={t("كابتن رمضان أمين في وضع قتالي", "Coach Ramadan Amin in a fighting stance")} width="1024" height="1536" loading="lazy" /><div className="coach-portrait-caption"><span>BE FIGHTER</span><b>{t("رمضان أمين", "Ramadan Amin")}</b></div></div><div className="coach-copy"><div className="eyebrow dark"><span /> {t("فريق Be Fighter", "THE BE FIGHTER TEAM")}</div><h2>{t("اعرف مين هيدرّبك", "Meet your coach")}<br /><em>{t("قبل ما تبدأ.", "Before you begin.")}</em></h2><p className="coach-lead">{t("كابتن رمضان أمين — مؤسس ومدرب Be Fighter Academy. بنحدد المدرب المتاح حسب نوع التدريب والسن والمنطقة والمواعيد، ونوضح لك خبرته المرتبطة ببرنامجك قبل تأكيد الحجز.", "Coach Ramadan Amin — founder and coach at Be Fighter Academy. We confirm the available coach and their relevant experience for your programme before booking.")}</p><p>{t("بنرشح المدرب المناسب حسب نوع التدريب، سن المتدرّب، مستواه، منطقته والمواعيد المتاحة. وكل المدربين بيشتغلوا بنفس معايير الأمان، التدرّج، الخصوصية والمتابعة اللي مبنية عليها تجربة Be Fighter.", "We match the right coach to the training type, age, level, area and schedule. Every coach follows the same Be Fighter standards for safety, progression, privacy and progress tracking.")}</p><div className="coach-tags"><span><Award />{t("رمضان أمين · مؤسس ومدرب", "Ramadan Amin · Founder & coach")}</span><span><UsersRound />{t("اختيار المدرب حسب احتياجك", "Coach matching for your needs")}</span><span><ShieldCheck />{t("معايير تدريب موحّدة", "Consistent coaching standards")}</span></div></div></div></section>



      <section id="faq" className="faq-section section-light"><div className="container faq-grid"><div className="faq-intro"><div className="eyebrow dark"><span /> {t("اعرف التفاصيل الأول", "BEFORE YOU DECIDE")}</div><h2>{t("أسئلتك ليها إجابة.", "Your questions, answered.")}</h2><p>{t("ابدأ وإنت عارف البرنامج هيكون إزاي. ولو محتاج توضيح، كلّم فريق Be Fighter مباشرة.", "Understand what the programme involves before starting. For anything else, speak directly with the Be Fighter team.")}</p></div><div className="faq-list">{faqs.map(([q, a], index) => <details key={index} open={index === 0}><summary>{q}<ChevronDown aria-hidden="true" /></summary><p>{a}</p></details>)}</div></div></section>

      <section id="book" className="booking-section section-dark"><div className="container booking-shell"><div className="booking-copy"><div className="eyebrow"><span /> {t("خد الخطوة الأولى", "TAKE THE FIRST STEP")}</div><h2>{t("قولنا هدفك.", "Tell us your goal.")}<em>{t("وابدأ التقدم.", "Start your progress.")}</em></h2><p>{t("املأ التفاصيل وكمّل المحادثة على واتساب. طلبك هيتسجل عندنا للمتابعة، وهنوضح لك أنسب باقة والمواعيد المتاحة قبل ما تقرر. الطلب مش حجز نهائي ولا دفع.", "Fill in your details and continue on WhatsApp. Your enquiry is saved for follow-up, and we’ll explain the best package and available times before you decide. This is not a confirmed booking or payment.")}</p><div className="direct-contact"><a href="tel:+201001110897"><Phone aria-hidden="true" /><span><small>{t("كلّمنا بالتليفون", "Call us")}</small><b>0100 111 0897</b></span></a><a href={wa(inquiry)} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /><span><small>{t("تفضّل رسالة؟", "Prefer a message?")}</small><b>{t("واتساب", "WhatsApp")}</b></span></a></div></div><form className="booking-form" onSubmit={submitBooking}><div className="form-heading"><span>{t("برنامجك يبدأ من هنا.", "Your programme starts here.")}</span><small>{t("طلب تقييم وتفاصيل", "Assessment enquiry")}</small></div>{packageChoice && <div className="selected-package"><Check aria-hidden="true" />{t("الباقة المختارة:", "Selected package:")} {packageLabels[packageChoice]}<button type="button" onClick={() => setPackageChoice("")}>{t("تغيير", "Change")}</button></div>}<div className="form-row"><label>{t("الاسم", "Name")}<Input name="name" placeholder={t("اسمك أو اسم ولي الأمر", "Your name or the parent’s name")} required autoComplete="name" /></label><label>{t("رقم الموبايل", "Mobile number")}<Input name="phone" type="tel" inputMode="tel" dir="ltr" placeholder="01xxxxxxxxx" required autoComplete="tel" /></label></div><div className="form-row"><label>{t("مين هيتمرّن؟", "Who’s training?")}<Select dir={direction} value={program} onValueChange={value => setProgram(value ?? "")}><SelectTrigger aria-label={t("اختار المتدرّب", "Choose the participant")}><SelectValue placeholder={t("اختار", "Select")} /></SelectTrigger><SelectContent dir={direction}>{programOptions.map(item => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectContent></Select></label><label>{t("نوع التدريب", "Training type")}<Select dir={direction} value={trainingType} onValueChange={value => setTrainingType(value ?? "")}><SelectTrigger aria-label={t("اختار نوع التدريب", "Choose training type")}><SelectValue placeholder={t("اختار", "Select")} /></SelectTrigger><SelectContent dir={direction}>{trainingOptions.map(item => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectContent></Select></label></div><div className="form-row"><label>{t("المنطقة", "Area")}<Select dir={direction} value={area} onValueChange={value => setArea(value ?? "")}><SelectTrigger aria-label={t("اختار المنطقة", "Choose your area")}><SelectValue placeholder={t("اختار", "Select")} /></SelectTrigger><SelectContent dir={direction}>{areas.map(item => <SelectItem key={item.id} value={item.id}>{item[language]}</SelectItem>)}<SelectItem value="other">{t("منطقة أخرى", "Other area")}</SelectItem></SelectContent></Select></label><label>{t("الوقت المناسب للتدريب", "Preferred training time")}<Input name="preferredTime" placeholder={t("مثال: بعد 7 مساءً", "For example: after 7 PM")} /></label></div>{program === "kids" && <label>{t("سن الطفل", "Child’s age")}<Input name="childAge" inputMode="numeric" placeholder={t("من 6 إلى 14 سنة", "Aged 6 to 14")} /></label>}{program === "group" && <label>{t("عدد المتدربين", "Number of participants")}<Input name="participants" inputMode="numeric" placeholder={t("2 أو 3 أو 4 أفراد", "2, 3 or 4 people")} /></label>}<label><span>{t("عايز تحقق إيه؟", "What’s your goal?")} <span className="optional">{t("اختياري", "Optional")}</span></span><Input name="goal" placeholder={t("ثقة طفلك، لياقتك، تعلّم الملاكمة…", "Your child’s confidence, fitness, learning boxing…")} /></label><label><span>{t("تفاصيل إضافية", "Additional details")} <span className="optional">{t("اختياري", "Optional")}</span></span><Textarea name="notes" placeholder={t("خبرتك السابقة، مواعيدك، أو أي حاجة مهمة تحب فريق Be Fighter يعرفها…", "Experience, schedule or anything useful for the Be Fighter team to know…")} /></label><Button type="submit" size="lg" className="gold-button submit-button" disabled={formStatus === "saving"}>{formStatus === "saving" ? t("بنسجل طلبك…", "Saving your enquiry…") : t("سجّل طلبي وكمّل على واتساب", "Save my enquiry & continue on WhatsApp")}<ArrowLeft aria-hidden="true" /></Button><p className="form-note"><ShieldCheck aria-hidden="true" />{t("بياناتك بتتسجل للمتابعة مع Be Fighter فقط.", "Your details are saved only for Be Fighter follow-up.")}</p><output className={`form-status ${formStatus === "failed" ? "form-status-error" : ""}`} aria-live="polite">{formStatus === "saved" ? t("تم تسجيل طلبك. كمّل الرسالة على واتساب.", "Your enquiry is saved. Continue on WhatsApp.") : formStatus === "failed" ? t("واتساب هيفتح عادي، لكن تعذر تسجيل الطلب؛ ابعت الرسالة وإحنا هنتابع معاك.", "WhatsApp will still open, but the enquiry could not be saved. Send the message and we’ll follow up.") : ""}</output></form></div></section>

      <footer className="site-footer section-dark"><div className="container footer-main"><BrandMark language={language} /><p>{t("تدريب ألعاب قتالية ولياقة بدنية برايفت للأطفال والكبار. المدرب بيوصلك في بيتك أو مكانك الخاص.", "Private combat sports and fitness training for kids and adults. Your coach comes to your home or private space.")}</p><div className="footer-links"><a href="https://www.facebook.com/RamadanAmin.fighter" target="_blank" rel="noreferrer">{t("فيسبوك", "Facebook")}</a><a href={wa(inquiry)} target="_blank" rel="noreferrer">{t("واتساب", "WhatsApp")}</a><a href="tel:+201001110897">{t("اتصل بينا", "Call us")}</a></div></div><div className="container footer-bottom"><span>© 2026 Be Fighter Academy</span><span>{t("تدريبك. مكانك. هدفك.", "Your training. Your space. Your goal.")}</span></div></footer>
      <a className="sticky-whatsapp" href={wa(inquiry)} target="_blank" rel="noreferrer" aria-label={t("كلّم فريق Be Fighter على واتساب", "Contact Be Fighter on WhatsApp")}><MessageCircle aria-hidden="true" /><span>{t("كلّم الفريق", "Talk to the team")}</span></a>
    </main>
  );
}
