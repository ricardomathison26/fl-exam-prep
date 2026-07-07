import React, { useState, useEffect, useMemo } from "react";
import { BANK } from "./questions";
import { BANK_ES } from "./questionsEs";

// Florida Sales Associate (FREC/Pearson VUE) exam blueprint:
// 100 questions, 3.5 hours (210 min), 75 correct to pass.
// ~45 law, ~45 principles & practices, ~10 math.
const EXAM_SECONDS = 210 * 60;
const PASS_SCORE = 75;
const BLUEPRINT = { law: 45, pri: 45, math: 10 };

const SEC_TAG = {
  law: "bg-sky-100 text-sky-900",
  pri: "bg-emerald-100 text-emerald-900",
  math: "bg-amber-100 text-amber-900",
};

const UI = {
  en: {
    docTitle: "FL Sales Associate Exam Prep",
    kicker: "Pearson VUE format · FREC blueprint",
    title1: "Florida Sales Associate",
    title2: "State Exam Prep",
    intro: (n, law, pri, math) => `Original question bank of ${n} items modeled on the official exam outline: 100 questions, 3 hours 30 minutes, 75 correct to pass. Each simulation draws ${law} law, ${pri} principles, and ${math} math questions at random, so every attempt is different.`,
    inBank: "in bank",
    timed: "Timed · 3:30:00",
    examSim: "Exam simulation",
    examCard: "100 questions, balanced like the real test. No answers shown until you submit. Auto-submits when time runs out.",
    untimed: "Untimed",
    study: "Study mode",
    studyCard: "Browse the full bank by section. Tap any question to reveal the answer and explanation.",
    rulesTitle: "Exam rules to know",
    rules: "Passing requires 75 of 100. The state exam is closed book; a basic calculator is allowed. Roughly 45 questions cover Florida license law and federal law, 45 cover principles and practices, and 10 are math. If you fail, you may retake after 24 hours by paying the exam fee again.",
    home: "Home",
    back: "← Home",
    all: (n) => `All (${n})`,
    reveal: "Tap to reveal answer",
    results: "Results",
    pass: "PASS",
    fail: "FAIL",
    needed: "· 75 needed",
    review: "Review",
    filters: { missed: "Missed", flagged: "Flagged", all: "All" },
    retake: "Retake exam",
    nothing: "Nothing to show under this filter.",
    flagged: "Flagged",
    notAnswered: "Not answered",
    answered: (n) => `${n}/100 answered`,
    pause: "Pause",
    submit: "Submit",
    qOf: (i) => `Question ${i} of 100`,
    flagFor: "Flag for review",
    prev: "Previous",
    next: "Next",
    sheet: "Answer sheet",
    legend: "Dark: answered · Amber: flagged · White: blank",
    quitTitle: "Quit exam?",
    quitBody: (n) => `All progress will be lost. Your ${n} answered question${n === 1 ? "" : "s"} will not be scored or saved. Are you sure you want to quit?`,
    keep: "Keep working",
    quit: "Quit exam",
    pauseTitle: "Pause the timer?",
    pauseBody: "The clock will stop and questions will be hidden until you resume. The real exam has no pause, so use this sparingly. Are you sure?",
    cancel: "Cancel",
    pauseBtn: "Pause timer",
    pausedLabel: "Paused",
    pausedBody: (n) => `${n}/100 answered. Questions are hidden while paused.`,
    resume: "Resume exam",
    submitTitle: "Submit exam?",
    submitBody: (n) => (n === 0 ? "All 100 questions answered." : `${n} question${n === 1 ? " is" : "s are"} unanswered and will be scored as incorrect.`),
    submitNow: "Submit now",
    qLabel: (i) => `Q${i}`,
    sec: { law: "FL & Federal Law", pri: "Principles & Practices", math: "Real Estate Math" },
  },
  es: {
    docTitle: "Preparación Examen Asociado de Ventas FL",
    kicker: "Formato Pearson VUE · Temario FREC",
    title1: "Asociado de Ventas de la Florida",
    title2: "Preparación para el Examen Estatal",
    intro: (n, law, pri, math) => `Banco original de ${n} preguntas modelado según el temario oficial del examen: 100 preguntas, 3 horas 30 minutos, 75 correctas para aprobar. Cada simulación selecciona al azar ${law} de ley, ${pri} de principios y ${math} de matemáticas, así que cada intento es diferente.`,
    inBank: "en el banco",
    timed: "Cronometrado · 3:30:00",
    examSim: "Simulación de examen",
    examCard: "100 preguntas, balanceadas como el examen real. Las respuestas no se muestran hasta entregar. Se entrega automáticamente al agotarse el tiempo.",
    untimed: "Sin límite de tiempo",
    study: "Modo de estudio",
    studyCard: "Explore el banco completo por sección. Toque cualquier pregunta para revelar la respuesta y la explicación.",
    rulesTitle: "Reglas del examen que debe conocer",
    rules: "Para aprobar se necesitan 75 de 100. El examen estatal es a libro cerrado; se permite una calculadora básica. Aproximadamente 45 preguntas cubren la ley de licencias de la Florida y la ley federal, 45 cubren principios y prácticas, y 10 son de matemáticas. Si reprueba, puede repetirlo después de 24 horas pagando de nuevo la tarifa del examen.",
    home: "Inicio",
    back: "← Inicio",
    all: (n) => `Todas (${n})`,
    reveal: "Toque para revelar la respuesta",
    results: "Resultados",
    pass: "APROBADO",
    fail: "REPROBADO",
    needed: "· se necesitan 75",
    review: "Repaso",
    filters: { missed: "Falladas", flagged: "Marcadas", all: "Todas" },
    retake: "Repetir examen",
    nothing: "Nada que mostrar con este filtro.",
    flagged: "Marcada",
    notAnswered: "Sin responder",
    answered: (n) => `${n}/100 respondidas`,
    pause: "Pausa",
    submit: "Entregar",
    qOf: (i) => `Pregunta ${i} de 100`,
    flagFor: "Marcar para repaso",
    prev: "Anterior",
    next: "Siguiente",
    sheet: "Hoja de respuestas",
    legend: "Oscuro: respondida · Ámbar: marcada · Blanco: en blanco",
    quitTitle: "¿Salir del examen?",
    quitBody: (n) => `Se perderá todo el progreso. ${n === 1 ? "Su 1 pregunta respondida no será calificada ni guardada" : `Sus ${n} preguntas respondidas no serán calificadas ni guardadas`}. ¿Está seguro de que desea salir?`,
    keep: "Seguir trabajando",
    quit: "Salir del examen",
    pauseTitle: "¿Pausar el cronómetro?",
    pauseBody: "El reloj se detendrá y las preguntas quedarán ocultas hasta reanudar. El examen real no tiene pausa, así que úsela con moderación. ¿Está seguro?",
    cancel: "Cancelar",
    pauseBtn: "Pausar cronómetro",
    pausedLabel: "En pausa",
    pausedBody: (n) => `${n}/100 respondidas. Las preguntas están ocultas durante la pausa.`,
    resume: "Reanudar examen",
    submitTitle: "¿Entregar el examen?",
    submitBody: (n) => (n === 0 ? "Las 100 preguntas fueron respondidas." : n === 1 ? "1 pregunta sin responder se calificará como incorrecta." : `${n} preguntas sin responder se calificarán como incorrectas.`),
    submitNow: "Entregar ahora",
    qLabel: (i) => `P${i}`,
    sec: { law: "Ley de FL y Federal", pri: "Principios y Prácticas", math: "Matemáticas de Bienes Raíces" },
  },
};

// ---------------- FLAGS & LANGUAGE TOGGLE ----------------
const FlagVE = () => (
  <svg viewBox="0 0 19 10" className="w-5 h-3 rounded-[1px] shrink-0" aria-hidden="true">
    <rect width="19" height="10" fill="#CF142B" />
    <rect width="19" height="6.67" fill="#00247D" />
    <rect width="19" height="3.33" fill="#FFCC00" />
    <g fill="#fff">
      <circle cx="12.3" cy="5.6" r="0.34" /><circle cx="11.8" cy="5.0" r="0.34" />
      <circle cx="11.0" cy="4.6" r="0.34" /><circle cx="10.0" cy="4.35" r="0.34" />
      <circle cx="9.0" cy="4.35" r="0.34" /><circle cx="8.0" cy="4.6" r="0.34" />
      <circle cx="7.2" cy="5.0" r="0.34" /><circle cx="6.7" cy="5.6" r="0.34" />
    </g>
  </svg>
);

const FlagUS = () => (
  <svg viewBox="0 0 19 10" className="w-5 h-3 rounded-[1px] shrink-0" aria-hidden="true">
    <rect width="19" height="10" fill="#B22234" />
    <g fill="#fff">
      <rect y="0.77" width="19" height="0.77" /><rect y="2.31" width="19" height="0.77" />
      <rect y="3.85" width="19" height="0.77" /><rect y="5.38" width="19" height="0.77" />
      <rect y="6.92" width="19" height="0.77" /><rect y="8.46" width="19" height="0.77" />
    </g>
    <rect width="7.6" height="5.38" fill="#3C3B6E" />
    <g fill="#fff">
      <circle cx="1.3" cy="1.1" r="0.3" /><circle cx="3.1" cy="1.1" r="0.3" /><circle cx="4.9" cy="1.1" r="0.3" /><circle cx="6.7" cy="1.1" r="0.3" />
      <circle cx="2.2" cy="2.7" r="0.3" /><circle cx="4.0" cy="2.7" r="0.3" /><circle cx="5.8" cy="2.7" r="0.3" />
      <circle cx="1.3" cy="4.3" r="0.3" /><circle cx="3.1" cy="4.3" r="0.3" /><circle cx="4.9" cy="4.3" r="0.3" /><circle cx="6.7" cy="4.3" r="0.3" />
    </g>
  </svg>
);

const LangToggle = ({ lang, setLang, compact }) => {
  const btn = (code, Flag, label) => (
    <button
      onClick={() => setLang(code)}
      aria-label={label}
      className={`flex items-center gap-1.5 rounded-full text-xs font-medium transition-colors ${compact ? "px-1.5 py-1" : "px-2.5 py-1"} ${lang === code ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}
    >
      <Flag />
      {!compact && code.toUpperCase()}
    </button>
  );
  return (
    <div className="flex items-center rounded-full border border-slate-300 bg-white p-0.5">
      {btn("es", FlagVE, "Español")}
      {btn("en", FlagUS, "English")}
    </div>
  );
};

// ---------------- HELPERS ----------------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Store bank index + option order per exam question so the rendered text
// can be resolved in either language, even when switching mid-exam.
function buildExam() {
  const pick = (sec, n) => shuffle(BANK.map((q, i) => ({ s: q.s, i })).filter((x) => x.s === sec)).slice(0, n).map((x) => x.i);
  const ids = shuffle([...pick("law", BLUEPRINT.law), ...pick("pri", BLUEPRINT.pri), ...pick("math", BLUEPRINT.math)]);
  return ids.map((id) => {
    const order = shuffle([0, 1, 2, 3]);
    return { id, order, correct: order.indexOf(BANK[id].a) };
  });
}

function fmt(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const Bubble = ({ children, state, onClick }) => {
  const base = "h-8 w-8 rounded-full border text-xs font-mono flex items-center justify-center transition-colors";
  const styles = {
    current: "border-slate-900 bg-slate-900 text-white ring-2 ring-slate-400",
    answered: "border-slate-700 bg-slate-700 text-white",
    flagged: "border-amber-500 bg-amber-100 text-amber-900",
    blank: "border-slate-300 bg-white text-slate-500 hover:border-slate-500",
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[state]}`}>{children}</button>
  );
};

export default function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("lang") || "es"; } catch { return "es"; }
  });
  const [mode, setMode] = useState("home"); // home | exam | results | study
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [flags, setFlags] = useState(new Set());
  const [idx, setIdx] = useState(0);
  const [secs, setSecs] = useState(EXAM_SECONDS);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [quitConfirm, setQuitConfirm] = useState(false);
  const [pauseConfirm, setPauseConfirm] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("missed");
  const [studySec, setStudySec] = useState("all");
  const [open, setOpen] = useState(new Set());

  const L = UI[lang];
  // Localized view of a bank question: Spanish overlays t/q/o/e on the English entry.
  const loc = (id) => (lang === "es" ? { ...BANK[id], ...BANK_ES[id] } : BANK[id]);

  useEffect(() => {
    try { localStorage.setItem("lang", lang); } catch { /* private mode */ }
    document.title = L.docTitle;
    document.documentElement.lang = lang;
  }, [lang, L.docTitle]);

  useEffect(() => {
    if (mode !== "exam" || paused) return;
    const t = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          clearInterval(t);
          setMode("results");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [mode, paused]);

  const startExam = () => {
    const e = buildExam();
    setExam(e);
    setAnswers(new Array(e.length).fill(null));
    setFlags(new Set());
    setIdx(0);
    setSecs(EXAM_SECONDS);
    setConfirmOpen(false);
    setQuitConfirm(false);
    setPauseConfirm(false);
    setPaused(false);
    setMode("exam");
  };

  const score = useMemo(() => {
    if (!exam) return 0;
    return exam.reduce((n, q, i) => n + (answers[i] === q.correct ? 1 : 0), 0);
  }, [exam, answers]);

  const bySection = useMemo(() => {
    if (!exam) return {};
    const out = {};
    exam.forEach((q, i) => {
      const s = BANK[q.id].s;
      out[s] = out[s] || { right: 0, total: 0 };
      out[s].total++;
      if (answers[i] === q.correct) out[s].right++;
    });
    return out;
  }, [exam, answers]);

  const answeredCount = answers.filter((a) => a !== null).length;

  // ---------- HOME ----------
  if (mode === "home") {
    const counts = { law: 0, pri: 0, math: 0 };
    BANK.forEach((q) => counts[q.s]++);
    return (
      <div className="min-h-screen bg-stone-100 text-slate-900 font-sans">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-500">{L.kicker}</p>
            <div className="ml-auto"><LangToggle lang={lang} setLang={setLang} /></div>
          </div>
          <h1 className="font-serif text-4xl mt-2">{L.title1}<br />{L.title2}</h1>
          <p className="mt-3 text-slate-600 max-w-xl">{L.intro(BANK.length, BLUEPRINT.law, BLUEPRINT.pri, BLUEPRINT.math)}</p>
          <div className="mt-4 flex gap-2 flex-wrap text-xs">
            {Object.keys(counts).map((k) => (
              <span key={k} className={`px-2 py-1 rounded ${SEC_TAG[k]}`}>{L.sec[k]}: {counts[k]} {L.inBank}</span>
            ))}
          </div>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <button onClick={startExam} className="text-left bg-slate-900 text-white rounded-lg p-6 hover:bg-slate-800 transition-colors">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400">{L.timed}</p>
              <p className="font-serif text-2xl mt-1">{L.examSim}</p>
              <p className="mt-2 text-sm text-slate-300">{L.examCard}</p>
            </button>
            <button onClick={() => setMode("study")} className="text-left bg-white border border-slate-300 rounded-lg p-6 hover:border-slate-500 transition-colors">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400">{L.untimed}</p>
              <p className="font-serif text-2xl mt-1">{L.study}</p>
              <p className="mt-2 text-sm text-slate-600">{L.studyCard}</p>
            </button>
          </div>
          <div className="mt-8 bg-white border border-slate-200 rounded-lg p-5 text-sm text-slate-600">
            <p className="font-serif text-lg text-slate-900">{L.rulesTitle}</p>
            <p className="mt-2">{L.rules}</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- STUDY ----------
  if (mode === "study") {
    const list = BANK.map((q, i) => ({ s: q.s, id: i })).filter((q) => studySec === "all" || q.s === studySec);
    const toggle = (id) => {
      const s = new Set(open);
      s.has(id) ? s.delete(id) : s.add(id);
      setOpen(s);
    };
    return (
      <div className="min-h-screen bg-stone-100 text-slate-900 font-sans">
        <div className="sticky top-0 bg-stone-100 border-b border-slate-200 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
            <button onClick={() => setMode("home")} className="text-sm text-slate-500 hover:text-slate-900">{L.back}</button>
            <p className="font-serif text-lg">{L.study}</p>
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <div className="flex gap-1 flex-wrap">
                {["all", "law", "pri", "math"].map((k) => (
                  <button key={k} onClick={() => setStudySec(k)} className={`px-3 py-1 rounded-full text-xs border ${studySec === k ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300 hover:border-slate-500"}`}>
                    {k === "all" ? L.all(BANK.length) : L.sec[k]}
                  </button>
                ))}
              </div>
              <LangToggle lang={lang} setLang={setLang} compact />
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
          {list.map((item, n) => {
            const q = loc(item.id);
            const revealed = open.has(item.id);
            return (
              <button key={item.id} onClick={() => toggle(item.id)} className="block w-full text-left bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-400 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-slate-400 pt-1">{String(n + 1).padStart(3, "0")}</span>
                  <div className="flex-1">
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs ${SEC_TAG[q.s]}`}>{q.t}</span>
                    </div>
                    <p className="mt-2 font-medium">{q.q}</p>
                    <div className="mt-2 space-y-1">
                      {q.o.map((opt, i) => (
                        <p key={i} className={`text-sm px-2 py-1 rounded ${revealed && i === q.a ? "bg-emerald-100 text-emerald-900 font-medium" : "text-slate-600"}`}>
                          <span className="font-mono text-xs mr-1">{"ABCD"[i]}.</span>{opt}
                        </p>
                      ))}
                    </div>
                    {revealed ? (
                      q.e ? <p className="mt-2 text-sm text-slate-600 border-t border-slate-100 pt-2">{q.e}</p> : null
                    ) : (
                      <p className="mt-2 text-xs text-slate-400">{L.reveal}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- RESULTS ----------
  if (mode === "results" && exam) {
    const pass = score >= PASS_SCORE;
    const review = exam
      .map((q, i) => ({ ...q, i }))
      .filter((q) => {
        if (reviewFilter === "all") return true;
        if (reviewFilter === "missed") return answers[q.i] !== q.correct;
        if (reviewFilter === "flagged") return flags.has(q.i);
        return true;
      });
    return (
      <div className="min-h-screen bg-stone-100 text-slate-900 font-sans">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-500">{L.results}</p>
            <div className="ml-auto"><LangToggle lang={lang} setLang={setLang} /></div>
          </div>
          <div className="mt-2 flex items-end gap-4 flex-wrap">
            <p className="font-serif text-6xl">{score}<span className="text-2xl text-slate-400">/100</span></p>
            <p className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${pass ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>
              {pass ? L.pass : L.fail} {L.needed}
            </p>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {Object.keys(bySection).map((k) => (
              <div key={k} className="bg-white border border-slate-200 rounded-lg p-4">
                <p className={`inline-block px-2 py-0.5 rounded text-xs ${SEC_TAG[k]}`}>{L.sec[k]}</p>
                <p className="font-serif text-2xl mt-2">{bySection[k].right}<span className="text-sm text-slate-400">/{bySection[k].total}</span></p>
                <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-800" style={{ width: `${(bySection[k].right / bySection[k].total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-2 flex-wrap items-center">
            <p className="font-serif text-xl mr-2">{L.review}</p>
            {["missed", "flagged", "all"].map((f) => (
              <button key={f} onClick={() => setReviewFilter(f)} className={`px-3 py-1 rounded-full text-xs border ${reviewFilter === f ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300"}`}>{L.filters[f]}</button>
            ))}
            <div className="ml-auto flex gap-2">
              <button onClick={startExam} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800">{L.retake}</button>
              <button onClick={() => setMode("home")} className="px-4 py-2 rounded-lg border border-slate-300 text-sm bg-white hover:border-slate-500">{L.home}</button>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {review.length === 0 && <p className="text-sm text-slate-500">{L.nothing}</p>}
            {review.map((q) => {
              const user = answers[q.i];
              const lq = loc(q.id);
              return (
                <div key={q.i} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex gap-2 items-center flex-wrap">
                    <span className="font-mono text-xs text-slate-400">{L.qLabel(q.i + 1)}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${SEC_TAG[lq.s]}`}>{lq.t}</span>
                    {flags.has(q.i) && <span className="px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-900">{L.flagged}</span>}
                  </div>
                  <p className="mt-2 font-medium">{lq.q}</p>
                  <div className="mt-2 space-y-1">
                    {q.order.map((oi, i) => {
                      let cls = "text-slate-600";
                      if (i === q.correct) cls = "bg-emerald-100 text-emerald-900 font-medium";
                      else if (i === user) cls = "bg-rose-100 text-rose-900 line-through";
                      return (
                        <p key={i} className={`text-sm px-2 py-1 rounded ${cls}`}>
                          <span className="font-mono text-xs mr-1">{"ABCD"[i]}.</span>{lq.o[oi]}
                        </p>
                      );
                    })}
                  </div>
                  {user === null && <p className="mt-2 text-xs text-rose-700">{L.notAnswered}</p>}
                  {lq.e && <p className="mt-2 text-sm text-slate-600 border-t border-slate-100 pt-2">{lq.e}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ---------- EXAM ----------
  if (mode === "exam" && exam) {
    const q = exam[idx];
    const lq = loc(q.id);
    const low = secs < 15 * 60;
    const toggleFlag = () => {
      const s = new Set(flags);
      s.has(idx) ? s.delete(idx) : s.add(idx);
      setFlags(s);
    };
    const select = (i) => {
      const a = [...answers];
      a[idx] = i;
      setAnswers(a);
    };
    return (
      <div className="min-h-screen bg-stone-100 text-slate-900 font-sans pb-10">
        <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={() => setQuitConfirm(true)} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white hover:border-slate-500">{L.home}</button>
            <p className="font-serif hidden sm:block">{L.examSim}</p>
            <span className="text-xs text-slate-500">{L.answered(answeredCount)}</span>
            <div className="ml-auto flex items-center gap-3">
              <LangToggle lang={lang} setLang={setLang} compact />
              <span className={`font-mono text-lg tabular-nums ${low ? "text-rose-600" : "text-slate-900"}`}>{fmt(secs)}</span>
              <button onClick={() => setPauseConfirm(true)} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm bg-white hover:border-slate-500">{L.pause}</button>
              <button onClick={() => setConfirmOpen(true)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800">{L.submit}</button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm text-slate-500">{L.qOf(idx + 1)}</span>
              <span className={`px-2 py-0.5 rounded text-xs ${SEC_TAG[lq.s]}`}>{L.sec[lq.s]}</span>
              <button onClick={toggleFlag} className={`ml-auto px-3 py-1 rounded-full text-xs border ${flags.has(idx) ? "bg-amber-100 border-amber-400 text-amber-900" : "bg-white border-slate-300 text-slate-500 hover:border-amber-400"}`}>
                {flags.has(idx) ? L.flagged : L.flagFor}
              </button>
            </div>
            <p className="mt-4 text-lg">{lq.q}</p>
            <div className="mt-4 space-y-2">
              {q.order.map((oi, i) => (
                <button key={i} onClick={() => select(i)} className={`block w-full text-left px-4 py-3 rounded-lg border transition-colors ${answers[idx] === i ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white hover:border-slate-500"}`}>
                  <span className="font-mono text-xs mr-2">{"ABCD"[i]}.</span>{lq.o[oi]}
                </button>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <button disabled={idx === 0} onClick={() => setIdx(idx - 1)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm bg-white disabled:opacity-40">{L.prev}</button>
              <button disabled={idx === 99} onClick={() => setIdx(idx + 1)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm bg-white disabled:opacity-40 ml-auto">{L.next}</button>
            </div>
          </div>

          <div className="mt-6 bg-white border border-slate-200 rounded-lg p-4">
            <p className="font-mono text-xs tracking-widest uppercase text-slate-400 mb-3">{L.sheet}</p>
            <div className="flex flex-wrap gap-1.5">
              {exam.map((_, i) => {
                let state = "blank";
                if (flags.has(i)) state = "flagged";
                if (answers[i] !== null && !flags.has(i)) state = "answered";
                if (i === idx) state = "current";
                return <Bubble key={i} state={state} onClick={() => setIdx(i)}>{i + 1}</Bubble>;
              })}
            </div>
            <p className="mt-3 text-xs text-slate-400">{L.legend}</p>
          </div>
        </div>

        {quitConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <p className="font-serif text-xl">{L.quitTitle}</p>
              <p className="mt-2 text-sm text-slate-600">{L.quitBody(answeredCount)}</p>
              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={() => setQuitConfirm(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm">{L.keep}</button>
                <button onClick={() => { setQuitConfirm(false); setPaused(false); setMode("home"); }} className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm hover:bg-rose-700">{L.quit}</button>
              </div>
            </div>
          </div>
        )}

        {pauseConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <p className="font-serif text-xl">{L.pauseTitle}</p>
              <p className="mt-2 text-sm text-slate-600">{L.pauseBody}</p>
              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={() => setPauseConfirm(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm">{L.cancel}</button>
                <button onClick={() => { setPauseConfirm(false); setPaused(true); }} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm">{L.pauseBtn}</button>
              </div>
            </div>
          </div>
        )}

        {paused && !quitConfirm && (
          <div className="fixed inset-0 bg-stone-100 flex items-center justify-center p-4 z-30">
            <div className="text-center">
              <p className="font-mono text-xs tracking-widest uppercase text-slate-400">{L.pausedLabel}</p>
              <p className="mt-2 font-mono text-4xl tabular-nums">{fmt(secs)}</p>
              <p className="mt-2 text-sm text-slate-500">{L.pausedBody(answeredCount)}</p>
              <div className="mt-6 flex gap-2 justify-center">
                <button onClick={() => setPaused(false)} className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800">{L.resume}</button>
                <button onClick={() => setQuitConfirm(true)} className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white hover:border-slate-500">{L.home}</button>
              </div>
            </div>
          </div>
        )}

        {confirmOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <p className="font-serif text-xl">{L.submitTitle}</p>
              <p className="mt-2 text-sm text-slate-600">{L.submitBody(100 - answeredCount)}</p>
              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm">{L.keep}</button>
                <button onClick={() => { setConfirmOpen(false); setMode("results"); }} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm">{L.submitNow}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
