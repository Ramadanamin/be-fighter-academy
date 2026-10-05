"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, ClipboardList, LogOut, MessageCircle, Pencil, Plus, RefreshCw, Save, Search, Trash2, UserCheck, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import styles from "./dashboard.module.css";

type Lead = {
  id: number; name: string; phone: string; traineeType: string; childAge: string | null;
  trainingType: string; participants: string | null; goal: string; area: string;
  preferredTime: string | null; packageChoice: string | null; notes: string; language: string;
  status: string; followUpAt: string | null; crmNotes: string; lastContactedAt: string | null;
  createdAt: string; updatedAt: string;
};

type LeadDraft = Omit<Lead, "id" | "createdAt" | "updatedAt" | "lastContactedAt"> & { id?: number };

const statusLabels: Record<string, string> = { new: "جديد", qualified: "مؤهل", package_sent: "الباقة اتبعتت", follow_up: "متابعة", booked: "اشترك", not_interested: "غير مهتم" };
const traineeLabels: Record<string, string> = { kids: "طفل", adults: "بالغ", group: "مجموعة خاصة", recommend: "محتاج ترشيح" };
const trainingLabels: Record<string, string> = { boxing: "Boxing", kickboxing: "Kickboxing", mma: "MMA", self_defense: "دفاع عن النفس", fitness: "Fitness", not_sure: "محتاج ترشيح" };
const packageLabels: Record<string, string> = { starter_private: "Starter Private", private_coaching: "Private Coaching", signature_coaching: "Signature Coaching", private_circle: "Private Circle" };
const areaLabels: Record<string, string> = { madinaty: "مدينتي", rehab: "الرحاب", shorouk: "الشروق", golf: "كمباوند الجولف", diar: "الديار", other: "منطقة أخرى" };

const emptyDraft: LeadDraft = {
  name: "", phone: "", traineeType: "recommend", childAge: null, trainingType: "not_sure",
  participants: null, goal: "", area: "other", preferredTime: null, packageChoice: null,
  notes: "", language: "ar", status: "new", followUpAt: null, crmNotes: "",
};

function whatsappLink(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `20${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

function displayDate(value: string) {
  const parsed = new Date(value.includes("Z") || value.includes("+") ? value : `${value.replace(" ", "T")}Z`);
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", timeStyle: "short" }).format(parsed);
}

export default function DashboardClient({ displayName }: { displayName: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [editor, setEditor] = useState<LeadDraft | null>(null);
  const [editorSaving, setEditorSaving] = useState(false);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);

  async function loadLeads() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/leads", { cache: "no-store" });
      if (response.status === 401) { window.location.replace("/admin/login"); return; }
      const data = await response.json() as { leads?: Lead[]; error?: string };
      if (!response.ok) throw new Error(data.error || "تعذر تحميل الطلبات");
      setLeads(data.leads || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "تعذر تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadLeads(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const visibleLeads = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return leads.filter(lead => (statusFilter === "all" || lead.status === statusFilter) && (!needle || [lead.name, lead.phone, areaLabels[lead.area], packageLabels[lead.packageChoice || ""], lead.goal].join(" ").toLowerCase().includes(needle)));
  }, [leads, search, statusFilter]);

  const now = useMemo(() => new Date().getTime(), [leads]);
  const dueCount = leads.filter(lead => lead.followUpAt && new Date(lead.followUpAt).getTime() <= now && !["booked", "not_interested"].includes(lead.status)).length;
  const metrics = [
    { label: "إجمالي الطلبات", value: leads.length, icon: ClipboardList },
    { label: "طلبات جديدة", value: leads.filter(lead => lead.status === "new").length, icon: UsersRound },
    { label: "متابعة مستحقة", value: dueCount, icon: CalendarClock },
    { label: "تم الاشتراك", value: leads.filter(lead => lead.status === "booked").length, icon: UserCheck },
  ];

  function updateLocal(id: number, values: Partial<Lead>) {
    setLeads(current => current.map(lead => lead.id === id ? { ...lead, ...values } : lead));
  }

  async function saveLead(lead: Lead, markContacted = false) {
    setSavingId(lead.id); setSavedId(null); setError("");
    try {
      const response = await fetch("/api/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: lead.id, status: lead.status, followUpAt: lead.followUpAt, crmNotes: lead.crmNotes, markContacted }) });
      if (response.status === 401) { window.location.replace("/admin/login"); return; }
      const data = await response.json() as { lead?: Lead; error?: string };
      if (!response.ok || !data.lead) throw new Error(data.error || "تعذر حفظ التعديل");
      updateLocal(lead.id, data.lead); setSavedId(lead.id);
      window.setTimeout(() => setSavedId(current => current === lead.id ? null : current), 1800);
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "تعذر حفظ التعديل"); }
    finally { setSavingId(null); }
  }

  async function saveEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor) return;
    setEditorSaving(true); setError("");
    try {
      const response = await fetch("/api/leads", { method: editor.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editor) });
      if (response.status === 401) { window.location.replace("/admin/login"); return; }
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "تعذر حفظ بيانات العميل");
      setEditor(null); await loadLeads();
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "تعذر حفظ بيانات العميل"); }
    finally { setEditorSaving(false); }
  }

  async function confirmDelete() {
    if (!deleteLead) return;
    setError("");
    try {
      const response = await fetch(`/api/leads?id=${deleteLead.id}`, { method: "DELETE" });
      if (response.status === 401) { window.location.replace("/admin/login"); return; }
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "تعذر حذف العميل");
      setLeads(current => current.filter(lead => lead.id !== deleteLead.id)); setDeleteLead(null);
    } catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : "تعذر حذف العميل"); }
  }

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); window.location.replace("/admin/login"); }
  function openWhatsApp(lead: Lead) { window.open(whatsappLink(lead.phone), "_blank", "noopener,noreferrer"); void saveLead(lead, true); }

  return <main className={styles.shell} dir="rtl">
    <header className={styles.header}><div className={styles.headerInner}><Link href="/" className={styles.brand}><img src="/media/be-fighter-logo.png" alt="Be Fighter" /><span><b>Be Fighter CRM</b><small>لوحة متابعة العملاء</small></span></Link><div className={styles.owner}><span>مرحبًا، {displayName}</span><Button asChild variant="outline"><Link href="/"><ArrowRight />الموقع الرئيسي</Link></Button><Button variant="outline" onClick={() => void logout()}><LogOut />خروج</Button></div></div></header>
    <div className={styles.dashboard}>
      <section className={styles.titleRow}><div><p>PRIVATE COACHING OPERATIONS</p><h1>كل طلب. وخطوة المتابعة الجاية.</h1><span>طلبات الموقع بتظهر هنا تلقائيًا، وتقدر تضيف أو تعدّل أو تحذف أي عميل.</span></div><div className={styles.titleActions}><Button onClick={() => setEditor({ ...emptyDraft })}><Plus />إضافة عميل</Button><Button onClick={() => void loadLeads()} variant="outline" disabled={loading}><RefreshCw className={loading ? styles.spin : ""} />تحديث</Button></div></section>
      <section className={styles.metrics}>{metrics.map(item => { const Icon = item.icon; return <article key={item.label}><span><Icon /></span><div><small>{item.label}</small><b>{item.value}</b></div></article>; })}</section>
      <section className={styles.crmPanel}>
        <div className={styles.toolbar}><div className={styles.search}><Search /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="ابحث بالاسم أو الرقم أو المنطقة…" aria-label="بحث في العملاء" /></div><Select dir="rtl" value={statusFilter} onValueChange={value => setStatusFilter(value ?? "all")}><SelectTrigger aria-label="فلترة بالحالة"><SelectValue /></SelectTrigger><SelectContent dir="rtl"><SelectItem value="all">كل الحالات</SelectItem>{Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select><span className={styles.resultCount}>{visibleLeads.length} طلب</span></div>
        {error && <div className={styles.error} role="alert">{error}</div>}
        {loading ? <div className={styles.state}>جاري تحميل الطلبات…</div> : !visibleLeads.length ? <div className={styles.state}><ClipboardList /><b>مفيش طلبات مطابقة</b><span>{leads.length ? "غيّر البحث أو الفلتر." : "أول طلب من فورم الموقع هيظهر هنا تلقائيًا."}</span></div> : <Table className={styles.table}><TableHeader><TableRow><TableHead>العميل</TableHead><TableHead>الطلب</TableHead><TableHead>الباقة والمكان</TableHead><TableHead>الحالة</TableHead><TableHead>المتابعة</TableHead><TableHead>ملاحظات CRM</TableHead><TableHead>إجراء</TableHead></TableRow></TableHeader><TableBody>{visibleLeads.map(lead => <TableRow key={lead.id} className={styles.leadRow}><TableCell><div className={styles.client}><b>{lead.name}</b><a href={`tel:${lead.phone}`}>{lead.phone}</a><small>طلب #{lead.id} · {displayDate(lead.createdAt)}</small></div></TableCell><TableCell><div className={styles.details}><b>{traineeLabels[lead.traineeType] || lead.traineeType}{lead.childAge ? ` · ${lead.childAge} سنة` : ""}</b><span>{trainingLabels[lead.trainingType] || lead.trainingType}</span><p>{lead.goal || "الهدف غير محدد"}</p>{lead.preferredTime && <small>الموعد: {lead.preferredTime}</small>}{lead.notes && <small>تفاصيل: {lead.notes}</small>}</div></TableCell><TableCell><div className={styles.details}><b>{lead.packageChoice ? packageLabels[lead.packageChoice] : "محتاج ترشيح باقة"}</b><span>{areaLabels[lead.area] || lead.area}</span>{lead.participants && <small>{lead.participants} متدربين</small>}</div></TableCell><TableCell><Select dir="rtl" value={lead.status} onValueChange={value => updateLocal(lead.id, { status: value ?? "new" })}><SelectTrigger className={`${styles.statusSelect} ${styles[`status_${lead.status}`] || ""}`} aria-label={`حالة ${lead.name}`}><SelectValue /></SelectTrigger><SelectContent dir="rtl">{Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></TableCell><TableCell><Input className={styles.dateInput} type="datetime-local" value={lead.followUpAt || ""} onChange={event => updateLocal(lead.id, { followUpAt: event.target.value || null })} aria-label={`ميعاد متابعة ${lead.name}`} />{lead.lastContactedAt && <small className={styles.lastContact}>آخر تواصل: {displayDate(lead.lastContactedAt)}</small>}</TableCell><TableCell><Textarea className={styles.notes} value={lead.crmNotes} onChange={event => updateLocal(lead.id, { crmNotes: event.target.value })} placeholder="اعتراض العميل، أنسب موعد، ملاحظات المكالمة…" aria-label={`ملاحظات ${lead.name}`} /></TableCell><TableCell><div className={styles.actions}><Button onClick={() => void saveLead(lead)} disabled={savingId === lead.id} size="sm"><Save />{savedId === lead.id ? "اتحفظ" : savingId === lead.id ? "بيتحفظ" : "حفظ"}</Button><Button onClick={() => openWhatsApp(lead)} variant="outline" size="sm"><MessageCircle />واتساب</Button><Button onClick={() => setEditor({ ...lead })} variant="outline" size="sm"><Pencil />تعديل</Button><Button onClick={() => setDeleteLead(lead)} variant="outline" size="sm" className={styles.deleteButton}><Trash2 />حذف</Button></div></TableCell></TableRow>)}</TableBody></Table>}
      </section>
    </div>

    <Dialog open={Boolean(editor)} onOpenChange={open => { if (!open) setEditor(null); }}><DialogContent className={styles.editorDialog} dir="rtl"><DialogHeader><DialogTitle>{editor?.id ? "تعديل بيانات العميل" : "إضافة عميل جديد"}</DialogTitle><DialogDescription>سجّل بيانات العميل والبرنامج المناسب عشان يظهر في المتابعة.</DialogDescription></DialogHeader>{editor && <form className={styles.editorForm} onSubmit={saveEditor}>
      <div className={styles.editorGrid}><label>الاسم<Input value={editor.name} onChange={event => setEditor({ ...editor, name: event.target.value })} required /></label><label>رقم الموبايل<Input value={editor.phone} onChange={event => setEditor({ ...editor, phone: event.target.value })} required dir="ltr" /></label></div>
      <div className={styles.editorGrid}><label>المتدرّب<Select dir="rtl" value={editor.traineeType} onValueChange={value => setEditor({ ...editor, traineeType: value || "recommend" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent dir="rtl">{Object.entries(traineeLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></label><label>نوع التدريب<Select dir="rtl" value={editor.trainingType} onValueChange={value => setEditor({ ...editor, trainingType: value || "not_sure" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent dir="rtl">{Object.entries(trainingLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></label></div>
      <div className={styles.editorGrid}><label>المنطقة<Select dir="rtl" value={editor.area} onValueChange={value => setEditor({ ...editor, area: value || "other" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent dir="rtl">{Object.entries(areaLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></label><label>الباقة<Select dir="rtl" value={editor.packageChoice || "none"} onValueChange={value => setEditor({ ...editor, packageChoice: value === "none" ? null : value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent dir="rtl"><SelectItem value="none">محتاج ترشيح</SelectItem>{Object.entries(packageLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></label></div>
      <div className={styles.editorGrid}><label>سن الطفل<Input value={editor.childAge || ""} onChange={event => setEditor({ ...editor, childAge: event.target.value || null })} /></label><label>عدد المتدربين<Input value={editor.participants || ""} onChange={event => setEditor({ ...editor, participants: event.target.value || null })} /></label></div>
      <label>الهدف<Input value={editor.goal} onChange={event => setEditor({ ...editor, goal: event.target.value })} /></label><label>الوقت المناسب<Input value={editor.preferredTime || ""} onChange={event => setEditor({ ...editor, preferredTime: event.target.value || null })} /></label><label>تفاصيل الطلب<Textarea value={editor.notes} onChange={event => setEditor({ ...editor, notes: event.target.value })} /></label>
      {editor.id && <><div className={styles.editorGrid}><label>الحالة<Select dir="rtl" value={editor.status} onValueChange={value => setEditor({ ...editor, status: value || "new" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent dir="rtl">{Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></label><label>موعد المتابعة<Input type="datetime-local" value={editor.followUpAt || ""} onChange={event => setEditor({ ...editor, followUpAt: event.target.value || null })} /></label></div><label>ملاحظات CRM<Textarea value={editor.crmNotes} onChange={event => setEditor({ ...editor, crmNotes: event.target.value })} /></label></>}
      <DialogFooter><Button type="button" variant="outline" onClick={() => setEditor(null)}>إلغاء</Button><Button type="submit" disabled={editorSaving}><Save />{editorSaving ? "جاري الحفظ…" : "حفظ البيانات"}</Button></DialogFooter>
    </form>}</DialogContent></Dialog>

    <AlertDialog open={Boolean(deleteLead)} onOpenChange={open => { if (!open) setDeleteLead(null); }}><AlertDialogContent dir="rtl" className={styles.confirmDialog}><AlertDialogHeader><AlertDialogTitle>حذف العميل؟</AlertDialogTitle><AlertDialogDescription>هيتم حذف طلب {deleteLead?.name} نهائيًا من الـCRM. الخطوة دي مينفعش تتراجع.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>إلغاء</AlertDialogCancel><AlertDialogAction onClick={() => void confirmDelete()} className={styles.confirmDelete}>حذف نهائي</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </main>;
}
