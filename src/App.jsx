import React, { useState, useEffect, useRef } from "react";
import {
  Home, LayoutGrid, RotateCcw, TrendingUp, ChevronLeft, Play, Pause,
  RotateCw, Check, Mic, Volume2, Square, Flame, ArrowRight, BookOpen,
  Headphones, PenLine, MessageSquare, Sparkles, ChevronDown, ChevronUp,
  Settings as SettingsIcon, X,
} from "lucide-react";

/* ============================================================
   CELPIP Trainer 2.0 — sesión de entrenamiento nocturna.
   Identidad: fondo tinta profunda, cada habilidad con el color
   de resaltador del cuaderno, templates como recortes de papel,
   y el anillo de tiempo como pieza central.
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
:root{
  --bg:#0D1320; --surface:#161E2E; --surface2:#1E2839; --line:rgba(255,255,255,.07);
  --text:#EDF1F8; --dim:#8C97AC; --paper:#FBF7EC; --ink:#1E2A45;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.app{min-height:100vh;background:var(--bg);color:var(--text);
  font-family:Inter,system-ui,-apple-system,sans-serif;font-size:15px;line-height:24px}
.frame{max-width:520px;margin:0 auto;padding:20px 18px 108px}
.disp{font-family:'Space Grotesk',Inter,system-ui,sans-serif;text-transform:capitalize}
h1,h2,h3,p{margin:0}

.kicker{font-size:12px;font-weight:600;letter-spacing:.4px;color:var(--dim);text-transform:capitalize}
.h1{font-size:27px;line-height:34px;font-weight:700;letter-spacing:-.5px}
.h2{font-size:19px;line-height:26px;font-weight:600;letter-spacing:-.2px}
.dimtx{color:var(--dim);font-size:13.5px;line-height:21px}

.screen{animation:rise .3s ease both}
@keyframes rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

.card{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:16px;margin-top:14px}
.card--flat{background:transparent;border:1px dashed var(--line)}

.topbar{display:flex;align-items:center;gap:12px;margin-bottom:14px;min-height:44px}
.iconbtn{width:44px;height:44px;border-radius:14px;border:1px solid var(--line);background:var(--surface);
  color:var(--text);display:flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto}
.iconbtn:active{transform:scale(.96)}
.iconbtn--acc{background:var(--acc,#fff);color:#0D1320;border:none}

.btn{width:100%;min-height:52px;border:none;border-radius:15px;cursor:pointer;text-transform:capitalize;
  font:600 15px/1 Inter,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;gap:8px;
  background:var(--acc,#EDF1F8);color:#0D1320;margin-top:14px}
.btn:active{transform:scale(.985)}
.btn:disabled{opacity:.35;cursor:not-allowed}
.btn--ghost{background:transparent;border:1px solid var(--line);color:var(--text)}
.btn--sm{width:auto;min-height:40px;padding:0 14px;font-size:13px;margin-top:0;border-radius:12px}

.chiprow{display:flex;gap:8px;overflow-x:auto;padding:2px;margin-top:12px;scrollbar-width:none}
.chiprow::-webkit-scrollbar{display:none}
.chip{flex:0 0 auto;min-height:40px;padding:0 15px;border-radius:12px;border:1px solid var(--line);
  background:var(--surface);color:var(--dim);font:600 13px Inter,sans-serif;cursor:pointer;
  display:flex;align-items:center;gap:6px;text-transform:capitalize}
.chip[data-on="1"]{background:var(--acc);color:#0D1320;border-color:transparent}

.skill{display:flex;align-items:center;gap:14px;background:var(--surface);border:1px solid var(--line);
  border-radius:18px;padding:16px;margin-top:12px;cursor:pointer;width:100%;text-align:left;color:var(--text)}
.skill:active{transform:scale(.985)}
.skill .ic{width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;
  color:#0D1320;flex:0 0 auto}

.paper{background:var(--paper);color:var(--ink);border-radius:12px;padding:14px 16px;margin-top:12px;
  font-size:13.5px;line-height:24px;white-space:pre-wrap;
  background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 23px,rgba(30,42,69,.08) 23px,rgba(30,42,69,.08) 24px);
  box-shadow:0 6px 18px rgba(0,0,0,.35)}
.hlmark{background:var(--acc,#FFD666);padding:0 4px;border-radius:2px;color:#0D1320;font-weight:600}

textarea,input{width:100%;background:var(--surface2);border:1px solid var(--line);border-radius:14px;
  padding:13px 14px;color:var(--text);font:400 15px/24px Inter,sans-serif;margin-top:10px}
textarea:focus,input:focus,.chip:focus-visible,.btn:focus-visible,.iconbtn:focus-visible,.skill:focus-visible,.opt:focus-visible{
  outline:2px solid var(--acc,#EDF1F8);outline-offset:2px}

.opt{display:flex;gap:10px;width:100%;text-align:left;font:500 14px/22px Inter,sans-serif;
  padding:13px 14px;margin-top:8px;border:1px solid var(--line);border-radius:14px;
  background:var(--surface2);color:var(--text);cursor:pointer;align-items:flex-start}
.opt b{color:var(--dim);font-weight:600}
.opt[data-pick="1"]{border-color:var(--acc);background:var(--surface)}
.opt[data-state="ok"]{border-color:#5FD3A2;background:rgba(95,211,162,.12)}
.opt[data-state="bad"]{border-color:#FF9E9E;background:rgba(255,158,158,.1)}
.opt:disabled{cursor:default}

.pill{font:600 12px Inter,sans-serif;padding:5px 11px;border-radius:99px;background:var(--surface2);color:var(--dim);text-transform:capitalize}
.pill--acc{background:var(--acc);color:#0D1320}
.meter{height:6px;border-radius:4px;background:var(--surface2);overflow:hidden;margin-top:6px}
.meter>i{display:block;height:100%;background:var(--acc,#EDF1F8);border-radius:4px}

.steprow{display:flex;align-items:center;gap:10px;padding:12px 0;border-top:1px solid var(--line)}
.steprow:first-of-type{border-top:none}
.dot{width:30px;height:30px;border-radius:10px;border:1.5px solid var(--line);flex:0 0 auto;cursor:pointer;
  display:flex;align-items:center;justify-content:center;background:transparent;color:transparent}
.dot[data-on="1"]{background:var(--acc);border-color:var(--acc);color:#0D1320}
.stepbtn{flex:1;min-width:0;display:flex;align-items:center;gap:10px;background:none;border:none;color:var(--text);
  text-align:left;cursor:pointer;padding:0;font:inherit}
.stepic{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex:0 0 auto}

.hero{border:1px solid color-mix(in srgb, var(--acc,#fff) 35%, transparent)}
.hero .btn{margin-top:14px}

.center{display:flex;flex-direction:column;align-items:center;text-align:center}
.timeval{font-size:44px;line-height:1;font-weight:700;letter-spacing:1px;font-variant-numeric:tabular-nums}

.skel{height:14px;border-radius:7px;margin-top:10px;
  background:linear-gradient(90deg,var(--surface2) 25%,var(--surface) 50%,var(--surface2) 75%);
  background-size:200% 100%;animation:shine 1.2s linear infinite}
@keyframes shine{to{background-position:-200% 0}}

.navbar{position:fixed;bottom:0;left:0;right:0;background:rgba(13,19,32,.92);backdrop-filter:blur(14px);
  border-top:1px solid var(--line);z-index:40}
.navin{max-width:520px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);padding:8px 8px calc(10px + env(safe-area-inset-bottom))}
.navit{border:none;background:none;color:var(--dim);font:600 11px Inter,sans-serif;cursor:pointer;text-transform:capitalize;
  display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 4px;border-radius:12px}
.navit[data-on="1"]{color:var(--text)}
.navit[data-on="1"] .navdot{opacity:1}
.navdot{width:4px;height:4px;border-radius:2px;background:var(--text);opacity:0;margin-top:1px}

.cols{display:grid;gap:8px;margin-top:10px}
.cols--2{grid-template-columns:1fr 1fr}
.cols--3{grid-template-columns:repeat(3,1fr)}
.cols textarea{font-size:13px;line-height:20px;margin-top:6px}
.cols input{font-size:12.5px;font-weight:600;padding:9px 10px;margin-top:0}

.errrow{display:flex;gap:10px;align-items:flex-start;padding:12px 0;border-top:1px solid var(--line);font-size:13.5px;line-height:21px}
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px;align-items:start}
.mcol{display:grid;gap:8px}
.mbtn{min-height:56px;padding:8px 10px;border-radius:14px;border:1px solid var(--line);background:var(--surface2);
  color:var(--text);font:500 13px/18px Inter,sans-serif;cursor:pointer;text-align:center}
.mbtn[data-sel="1"]{border-color:var(--acc);background:var(--surface)}
.mbtn[data-done="1"]{opacity:.3;border-color:#5FD3A2;cursor:default}
.mbtn[data-bad="1"]{animation:shake .4s;border-color:#FF9E9E}
@keyframes shake{20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}
.exam{background:#F5F7FA;color:#17233B;border-radius:16px;padding:16px;margin-top:14px;box-shadow:0 10px 26px rgba(0,0,0,.45)}
.exam,.exam *{text-transform:none}
.exam-top{display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:2px solid #2C5FA8;padding-bottom:10px}
.exam-brand{font:700 13px 'Space Grotesk',Inter,sans-serif;color:#2C5FA8;letter-spacing:.4px}
.exam-count{font:600 12px Inter,sans-serif;color:#5A6784;font-variant-numeric:tabular-nums;white-space:nowrap}
.exam-q{font:600 15px/24px Inter,sans-serif;margin:14px 0 4px;color:#17233B}
.exam-hint{font:400 13px/21px Inter,sans-serif;color:#5A6784;margin-top:10px}
.radio{display:flex;gap:10px;align-items:flex-start;padding:12px 13px;border:1px solid #C9D3E0;border-radius:10px;background:#fff;margin-top:8px;cursor:pointer;width:100%;text-align:left;font:500 14px/22px Inter,sans-serif;color:#17233B}
.radio[data-on="1"]{border-color:#2C5FA8;background:#EAF1FA}
.rdot{width:16px;height:16px;border-radius:50%;border:2px solid #9AA9BE;flex:0 0 auto;margin-top:2px;position:relative}
.radio[data-on="1"] .rdot{border-color:#2C5FA8}
.radio[data-on="1"] .rdot:after{content:"";position:absolute;inset:3px;border-radius:50%;background:#2C5FA8}
.exam-next{background:#2C5FA8;color:#fff;border:none;border-radius:8px;min-height:44px;padding:0 24px;font:700 13px Inter,sans-serif;letter-spacing:.6px;cursor:pointer}
.exam-next:active{transform:scale(.97)}
.exam-next:disabled{opacity:.5;cursor:not-allowed}
.exam-bar{height:6px;background:#DDE5EF;border-radius:3px;overflow:hidden;margin-top:12px}
.exam-bar>i{display:block;height:100%;background:#2C5FA8;border-radius:3px;transition:width 1s linear}
.exam-pulse{width:40%;animation:slidebar 1.2s ease-in-out infinite alternate}
@keyframes slidebar{from{margin-left:0}to{margin-left:60%}}

.exam2{background:#F5F7FA;color:#17233B;border-radius:16px;overflow:hidden;margin-top:14px;box-shadow:0 10px 26px rgba(0,0,0,.45)}
.exam2,.exam2 *{text-transform:none}
.exam2-top{display:flex;justify-content:space-between;align-items:center;gap:10px;background:#2C5FA8;color:#fff;padding:12px 16px}
.exam2-brand{font:700 13px 'Space Grotesk',Inter,sans-serif;letter-spacing:.4px}
.exam2-count{font:600 12px Inter,sans-serif;font-variant-numeric:tabular-nums;white-space:nowrap;opacity:.92}
.exam2-bar{height:4px;background:#DDE5EF}
.exam2-bar>i{display:block;height:100%;background:#FFD666;transition:width 1s linear}
.exam2-toggle{width:100%;text-align:left;background:#EAF1FA;border:none;border-bottom:1px solid #C9D3E0;color:#2C5FA8;
  font:700 12px Inter,sans-serif;letter-spacing:.3px;padding:9px 16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center}
.exam2-passage{max-height:240px;overflow-y:auto;padding:14px 16px;border-bottom:1px solid #C9D3E0;background:#fff}
.exam2-passage-title{font:700 13.5px 'Space Grotesk',sans-serif;color:#2C5FA8;margin-bottom:8px;display:block}
.exam2-passage p{font:400 13.5px/23px Inter,sans-serif;color:#26324A;white-space:pre-wrap;margin:0 0 12px}
.exam2-passage p:last-child{margin-bottom:0}
.exam2-body{padding:16px}
.exam2-nav{display:flex;gap:6px;flex-wrap:wrap;margin-top:16px}
.exam2-navdot{width:30px;height:30px;border-radius:8px;border:1px solid #C9D3E0;background:#fff;color:#5A6784;
  font:700 12px Inter,sans-serif;cursor:pointer}
.exam2-navdot[data-cur="1"]{border-color:#2C5FA8;background:#2C5FA8;color:#fff}
.exam2-navdot[data-answered="1"]:not([data-cur="1"]){border-color:#7FB8E0;background:#EAF1FA;color:#2C5FA8}
.exam2-footer{display:flex;justify-content:space-between;gap:10px;margin-top:16px}
.exam2-prev{background:transparent;border:1px solid #C9D3E0;color:#5A6784;border-radius:8px;min-height:44px;
  padding:0 22px;font:700 13px Inter,sans-serif;cursor:pointer}
.exam2-prev:disabled{opacity:.4;cursor:not-allowed}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

/* ---------------------- Datos del cuaderno ---------------------- */

const SKILLS = {
  reading:  { label: "Reading",  color: "#FFD666", icon: BookOpen,      time: "55–60 min", meta: "4 partes · 38 preguntas" },
  listening:{ label: "Listening",color: "#FF9E9E", icon: Headphones,    time: "45–55 min", meta: "6 partes · 38 preguntas" },
  writing:  { label: "Writing",  color: "#C9A8F5", icon: PenLine,       time: "53–60 min", meta: "Email + Survey" },
  speaking: { label: "Speaking", color: "#7FE0B2", icon: MessageSquare, time: "15–20 min", meta: "8 tasks cronometrados" },
};

const READING_PARTS = [
  { n: 1, name: "Correspondence", q: 11, min: 11,
    tips: ["Lectura activa (1-3 min): lee todo el correo primero, no saltes directo a las preguntas — las opciones tienen trampas",
      "Etiqueta cada párrafo con 1-3 palabras (ej. 'Contexto', 'Costos', 'Solución') para ubicarte rápido cuando una pregunta pregunte por eso",
      "Vistazo inicial (5s): identifica el tono (formal/informal) y el tema general",
      "Preguntas específicas (1-6): busca la palabra o frase clave en el texto",
      "La pregunta general (motivo principal / intención) déjala para el final: ya habrás leído todo el correo",
      "Carta de respuesta (7-11): el receptor responde — no es textual, requiere empatía. Parafrasea las opciones a tus propias palabras simples",
      "Prefiere opciones específicas y concretas (ej. 'sweet birthday greetings') sobre abstracciones generales (ej. 'encouragement')",
      "Ojo con sinónimos: 'the store is closed' → 'no longer operating'"] },
  { n: 2, name: "Apply a Diagram", q: 8, min: 9,
    tips: ["Única parte donde analizas la imagen/diagrama PRIMERO (1-2 min), antes que las preguntas",
      "Observa títulos, columnas, precios, fechas, restricciones y diferencias entre niveles/opciones",
      "Ojo con palabras trampa: EXCEPT, HOWEVER, INCREASES, NOT",
      "Usa el método de eliminación: descarta opciones que violen las condiciones del diagrama",
      "Para relaciones entre personas (ej. 'best friends' vs 'acquaintances'), evalúa el tono general del texto"] },
  { n: 3, name: "For Information", q: 9, min: 10,
    tips: ["No leas solo la primera y última oración de cada párrafo, y no busques la afirmación 1 por todo el texto",
      "Lee el párrafo A completo, resúmelo mentalmente en 2-3 puntos",
      "Revisa las afirmaciones (1-9) y marca cuáles calzan conceptualmente con el párrafo A",
      "Repite con el párrafo B, C y D",
      "Opción E (Not Mentioned): no la busques activamente — las afirmaciones que no calzaron con ningún párrafo se marcan E al final"] },
  { n: 4, name: "For Viewpoints", q: 10, min: 13,
    tips: ["Primer párrafo: identifica al proponente (a favor), el opositor (en contra) y la postura del autor",
      "Adjetivos delatan el tono: 'alarming', 'disastrous', 'cloud chaser' → negativo; 'promising', 'beneficial', 'vital' → positivo",
      "Desconfiar de extreme words: always, never, all, completely. La respuesta correcta suele ser más moderada: likely, suggests, often, potentially",
      "En los gaps: la primera oración del comentario marca el tono. Lee la frase completa y adivina si falta algo bueno o malo (tone check) antes de ver las opciones",
      "El punto de vista del autor suele estar en la última frase: si termina en pregunta o advertencia es cauteloso, si termina en recomendación es partidario",
      "Tarea: leer editoriales y la sección de 'opinions' (no 'news') de CBC News o London Free Press",
      "Tarea: aprenderse los verbos de opinión (advocates, argues, claims, questions, dismisses) — están en Repaso → Conectores"] },
];

const LISTENING_GENERAL_TIPS = [
  "El audio se reproduce una sola vez: no confíes solo en la memoria, toma notas todo el tiempo",
  "Puedes pedir de 3 a 5 hojas de borrador extra al evaluador apenas ingreses tu PIN — usa símbolos para ir rápido: ↑ aumentar, ↓ disminuir, w/ with, b/c because, A/B para marcar de quién es el turno",
  "Truco maestro: antes de que empiece el audio, lee bien el título de la sección (ej. 'A conversation about a local park') — así el cerebro se activa y no te quedas en blanco",
];

const LISTENING_PARTS = [
  { n: 1, name: "Problem Solving", q: 8, min: 8, tips: ["Notas en T: columna izquierda = quién plantea el problema, columna derecha = quién ofrece la solución",
      "Anota en orden cronológico problema → solución, e identifica el tono emocional"] },
  { n: 2, name: "Daily Life", q: 5, min: 5, tips: ["Mismo formato de T: una columna por hablante, en orden cronológico",
      "Identificar el tono de la conversación"] },
  { n: 3, name: "Information", q: 6, min: 6, tips: ["Mismo formato de T: quién pregunta a la izquierda, quién informa a la derecha",
      "Tomar notas en orden, seguir la secuencia"] },
  { n: 4, name: "News Items", q: 5, min: 5, tips: ["Divide la hoja verticalmente y responde las 6 W's: Who, What, When, Where, Why, How",
      "Main idea primero, luego detalles"] },
  { n: 5, name: "Discussion", q: 8, min: 9, tips: ["3 columnas, una por persona — identifica de inmediato nombre, color/tipo de ropa y posición en pantalla (izq/centro/der)",
      "Alinea tus columnas con la posición física de los hablantes para no confundir quién dice qué",
      "Quién está de acuerdo y quién no; fíjate en expresiones y gestos faciales para intuir el tono"] },
  { n: 6, name: "Viewpoints", q: 6, min: 8, tips: ["Quién es mencionado, dónde trabaja, qué opina", "Suelen nombrarlos por apellido o cargo (Dr. Smith, City Planner) — anota nombre y postura exacta",
      "Traza una línea vertical: de un lado los argumentos a favor, del otro los en contra",
      "Tarea: escuchar podcasts como 'The Dose' o 'Cross Country Checkup', y practicar a 1.25x — si entiendes a esa velocidad, el examen real se sentirá más lento"] },
];

// Temas generales del cuaderno para "adaptar el template a temas generales" (días 6-12).
const CELPIP_TOPICS = [
  "public parks and green spaces", "garbage, recycling and waste collection", "noise complaints in apartment buildings",
  "public transport and commuting", "online shopping and deliveries", "neighbourhood safety",
  "small local businesses", "housing, rent and utilities", "weather and seasonal changes",
  "community events and volunteering", "workplace policies and remote work", "school and continuing education",
  "healthcare access and wait times", "environment and sustainability", "technology and social media use",
];

const READING_SPECS = {
  1: "una carta o correo PERSONAL informal (de un amigo, familiar o vecino) sobre un problema, invitación o favor cotidiano",
  2: "un aviso, volante o cronograma (horarios, precios, reglas) seguido de un párrafo breve que lo interpreta, con datos concretos (números, fechas, etiquetas) que las preguntas deben usar",
  3: "un artículo informativo tipo noticia local, factual y neutral, sin opiniones fuertes, con varios datos concretos",
  4: "un artículo de OPINIÓN/editorial, al estilo de la sección 'Opinion' de CBC News o London Free Press: una postura clara (proponente, opositor o neutral/escéptico), con adjetivos que delatan el tono del autor (ej. 'alarming' es negativo, 'promising' es positivo) y una última frase que resuma su posición (una recomendación si es partidario, o una pregunta/advertencia si es cauteloso)",
};

const LISTEN_SPECS = {
  1: "una conversación telefónica de DOS personas (un hombre y una mujer) resolviendo un problema práctico: una reserva, una entrega, un servicio",
  2: "una conversación casual de DOS personas en la vida diaria: vecinos, compañeros de trabajo, una tienda",
  3: "una conversación de DOS personas donde una da información detallada y la otra hace preguntas de seguimiento",
  4: "un MONÓLOGO de un locutor de noticias locales, estilo boletín de radio, con dos noticias breves",
  5: "una DISCUSIÓN de TRES personas con nombres propios y opiniones distintas sobre una decisión que deben tomar",
  6: "un MONÓLOGO tipo reporte donde se citan los puntos de vista de varias personas, nombradas por su apellido o su cargo",
};

const WRITING_TASKS = [
  { id: "w1", name: "Email", min: 27, brief: "Correo de 150–200 palabras respondiendo a la situación.",
    templates: ["email-formal", "email-informal", "email-semi"],
    tips: ["Memoriza un template y adáptalo a la situación: no lo reinventes cada vez",
      "Usa la mayor cantidad de conectores posibles (Repaso → Conectores) y cambia palabras simples por sofisticadas",
      "Días 1–5: escribe el template a mano en la mañana, en el computador en la tarde, y repasa los conectores en voz alta de noche",
      "Días 6–12: adapta el template a temas generales (parques, basura, ruido, transporte, compras online), usando al menos 3 palabras de alto nivel",
      "Días 13–17: simulacro completo — si te faltan palabras agrega una frase de cortesía o un ejemplo, si te sobran corta adjetivos innecesarios"] },
  { id: "w2", name: "Survey", min: 26, brief: "Elige la opción A o B y defiéndela en 150–200 palabras.",
    templates: ["survey"],
    tips: ["Elige un lado (A o B) rápido y no cambies de opinión a mitad de texto",
      "Da 2 razones: una a favor de tu opción y otra reconociendo (y descartando) un contra de la otra",
      "Cierra dejando claro que apoyarás la decisión final, sea cual sea"] },
];

const SPEAKING_GENERAL_TIPS = [
  "El examen no se trata de perfección sino de fluidez: es mejor hablar constante que parar buscando una palabra sofisticada",
  "Si te pierdes: di 'What I mean is…' y repite la idea — le muestra al examinador que sabes corregirte",
];

const SPEAKING_TASKS = [
  { n: 1, name: "Giving advice", prep: 30, talk: 90, tense: "Presente", tpl: "sp-advice",
    tips: ["Ten 2 ideas claras que se complementen, no repitas la misma idea con otras palabras"] },
  { n: 2, name: "Personal experience", prep: 30, talk: 60, tense: "Pasado", tpl: "sp-experience",
    tips: ["Contexto (15-20s): usa pasado simple y menciona con quién estabas",
      "La acción (20s): marca el momento especial con conectores de secuencia — 'Suddenly', 'To my surprise'",
      "El cierre es lo que más puntos da: cuenta cómo te sentiste (10s). Ej: 'Looking back, I felt delighted to spend that quality time with my loved ones.'",
      "Si la experiencia fue triste o difícil, no te quedes en la dificultad — cuenta cómo la resolviste: 'Despite the difficulty, I decided to take action… and eventually, I managed to find a solution.'"] },
  { n: 3, name: "Describing a scene", prep: 30, talk: 60, tense: "Presente continuo", tpl: "sp-scene",
    tips: ["Recorre la imagen por zonas para no quedarte sin qué decir: centro, primer plano, izquierda/derecha, fondo, arriba y abajo",
      "Usa vocabulario alto: gorgeous, stunning, illuminating, spectacular",
      "Cierre alternativo si sobra tiempo: 'Overall, it seems like a very lively atmosphere.'"] },
  { n: 4, name: "Making predictions", prep: 30, talk: 60, tense: "Futuro", tpl: "sp-predict",
    tips: ["Todo el task en tiempo futuro (will / going to)",
      "Si te queda poco tiempo (5-10s), cierra rápido: 'In short, I believe the scene will become even more active in the next few minutes.'",
      "Cierre sentimental si sobra tiempo: 'Overall, it seems like everyone will have a wonderful time and create great memories by the end of the day.'",
      "Cierre de calma si la actividad ya terminó: 'Ultimately, once the activity is over, the park will probably become quiet and peaceful again.'"] },
  { n: 5, name: "Comparing & persuading", prep: 60, talk: 60, tense: "Comparativos", tpl: "sp-compare",
    tips: ["Usa comparison words (even though, more suitable, better quality) para contrastar A y B",
      "Si te queda poco tiempo, cierra con: 'In the end, I think this is our best bet.'"] },
  { n: 6, name: "Difficult situation", prep: 60, talk: 60, tense: "Presente y futuro", tpl: "sp-difficult",
    tips: ["Sé educada pero firme, y siempre ofrece una solución, no solo la disculpa",
      "Cierra dejando la puerta abierta: 'Let me know if on Sunday we can do something and I will be there for you. Bye!'"] },
  { n: 7, name: "Expressing opinions", prep: 30, talk: 90, tense: "Presente", tpl: "sp-opinion",
    tips: ["Habla despacio y pronuncia bien; cuenta tus razones con los dedos (1, 2, además…) para no perder el hilo",
      "Si te sobra tiempo, extiende con: 'Another point to consider is (otro beneficio)' e inventa un estudio o experiencia: 'A recent study showed…' / 'In my experience at work…'"] },
  { n: 8, name: "Unusual situation", prep: 30, talk: 60, tense: "Presente", tpl: "sp-unusual",
    tips: ["Empieza con un saludo de sorpresa genuina: 'You won't believe what I'm seeing right now!'",
      "Usa formas, colores y comparaciones para describir el objeto",
      "Si no sabes cómo se dice algo, usa: 'It reminds me of a (something similar)' en vez de trabarte"] },
];

const TEMPLATES = {
  "email-formal": { title: "Email Formal", group: "Writing",
    body: `Dear (name),
I am writing to express my concern / interest / dissatisfaction regarding the recent issue that took place at...
First and foremost, it is important to highlight that (qué pasó).
Furthermore, this situation has caused inconvenience / delays because (por qué me afecta).
In light of this, I would like to suggest that (la solución).
I sincerely appreciate your time and attention to this matter. I look forward to your prompt response.
Best regards,` },
  "email-informal": { title: "Email Informal", group: "Writing",
    body: `Hi / Hey (name),
I hope you are doing great. It has been a while since we last caught up.
The reason I am reaching out is that (el plan o el problema).
I was thinking that maybe (sugerir algo relajado).
Let me know what you think / I cannot wait to see you soon. Looking forward to hearing from you soon.
Take care, Cheers, Best,` },
  "email-semi": { title: "Email Semi-Formal", group: "Writing",
    body: `Hello (store name) Team, / Hi there,
I am writing to ask about a recent order I placed. / I was wondering if you could help me with...
To be honest, I was a bit disappointed because... (queja suave)
Is there any way you could (send me a replacement / give me a refund)?
Thanks in advance for your help.
Regards / Sincerely,` },
  survey: { title: "Survey A/B", group: "Writing",
    body: `Thank you for considering my opinion regarding the upcoming decision. From my perspective, I strongly believe that Option A/B is the most favourable and practical choice for everyone involved.
One compelling reason is that it would significantly enhance (el beneficio).
While I acknowledge that option A/B has some potential benefits, it might also lead to (aspecto negativo). Therefore, option A/B remains a more sustainable solution.
All things considered, I am convinced that choosing option A/B will result in a more positive outcome for the community in the long run.
Ultimately, I am happy to support whichever decision is made and I will be ready to help in any way possible.` },
  "sp-advice": { title: "Task 1 · Giving Advice", group: "Speaking",
    body: `Hi (name)! I heard you're thinking about (tema).
If I were in your shoes, I would definitely go for it.
First of all... You will probably...
On top of that... My advice is...
I hope this helps! Let me know what you decide.` },
  "sp-experience": { title: "Task 2 · Personal Experience", group: "Speaking",
    body: `I would like to tell you about a memorable experience I had (a few years ago / last summer) when I (visited a new city / started a new project).
At that time, I was with (my family / my son / my coworkers). We decided to (go to the beach / organize an event) because...
Suddenly, we realized that... / To my surprise, everything went better than expected, because...
In the end, I felt (extremely happy / relieved / proud). It was truly an unforgettable day and I learned that (patience / planning) is very important.` },
  "sp-scene": { title: "Task 3 · Describing A Scene", group: "Speaking",
    body: `What I can see here is a vibrant scene of a (park / street / office). There are several people engaging in different activities.
Right in the middle, I can see a (man / woman) who is (sitting / talking). He/She looks quite (happy / busy).
To the left there is a group of people (eating / walking / talking). Meanwhile, on the right side, I notice a...
In the background, there are some (trees / buildings / clouds) that make the place look pleasant.
At the top of the image, I can see a couple of birds flying across the clear sky.
Overall, it seems like a very peaceful and enjoyable day at the park.` },
  "sp-predict": { title: "Task 4 · Making Predictions", group: "Speaking",
    body: `Looking at what is happening in the picture, I think several things are going to change in the next few minutes.
First of all, the (man / girl) who is (action) will probably finish (his / her) task and leave the area.
Furthermore, I imagine that the kids playing in the corner are going to move towards the...
I wouldn't be surprised if a rainstorm starts, causing everyone to look for shelter.
In short, I believe the scene will become even more active in the next few minutes.` },
  "sp-compare": { title: "Task 5 · Comparing & Persuading", group: "Speaking",
    body: `Hi (name), I've been looking at both options, and while I understand why you like your choice, I strongly believe that option (A/B) is more suitable for us.
One of the main reasons is the (price / location). Even though your option is (cheaper / larger / closer), my choice offers (better quality / more activities), which is crucial because...
Also, choosing this option will definitely bring us better results. In the long run, it is a smarter investment for everyone.
All things considered, I am convinced that option (A/B) is the way to go; at the end of the day we need to save some money. Don't you agree?` },
  "sp-difficult": { title: "Task 6 · Difficult Situation", group: "Speaking",
    body: `Hi (name), I'm calling because I have some bad news. I am afraid I won't be able to (make it to your party / finish the report on time).
The reason is that something unexpected just came up. (My son has a fever / my car broke down). Because of this, it's impossible for me to be there.
To make it up to you, I was wondering if we could (reschedule for next weekend / I can send the file by email tonight). Is that ok?
I sincerely apologize. Please let me know if there's anything else I can do.` },
  "sp-opinion": { title: "Task 7 · Expressing Opinions", group: "Speaking",
    body: `This is a controversial topic, but from my perspective, I am a firm believer that (mi opinión).
First of all, one of the primary benefits of this is (health / economy / safety). For instance, in many cities like London, we have seen that (example), which is beneficial for (everybody / the environment).
In addition, while some people argue that (opposite view), I strongly disagree because (reason). Furthermore, it is crucial to consider that (another benefit).
In conclusion, I truly believe this is the best option for everyone. All things considered, it just makes sense.` },
  "sp-unusual": { title: "Task 8 · Unusual Situation", group: "Speaking",
    body: `Hi (name)! You won't believe what I'm seeing right now! I am at (a store / the park) and I just found the most unusual (object / animal) I've ever seen.
It is shaped like a (circle / triangle) and it has a vivid (color) finish. On top of that, it seems to be made of (metal / wood / plastic). It's about the size of a (watermelon / laptop).
The most interesting part is that it has (stripes / buttons / long legs) and it's located right next to the...
I think it's fascinating! Should I take a picture or buy it for you? Let me know what you think!` },
};

const CONNECTORS = [
  { id: "ff", en: "First and foremost", es: "Antes que nada", g: "Ordenar Y Agregar", cz: "___, it is important to highlight that the noise starts before 7 am." },
  { id: "fu", en: "Furthermore", es: "Además", g: "Ordenar Y Agregar", cz: "The bus is always late. ___, the schedule changes without notice." },
  { id: "ot", en: "On top of that", es: "Además de eso", g: "Ordenar Y Agregar", cz: "The car broke down, and ___, I lost my keys." },
  { id: "ia", en: "In addition", es: "Adicionalmente", g: "Ordenar Y Agregar", cz: "___, the city will plant new trees along the avenue." },
  { id: "al", en: "Also", es: "También", g: "Ordenar Y Agregar", cz: "___, choosing this option will bring us better results." },
  { id: "et", en: "Even though", es: "Aunque", g: "Contrastar", cz: "___ your option is cheaper, mine offers better quality." },
  { id: "wp", en: "While some people argue", es: "Aunque algunos argumentan", g: "Contrastar", cz: "___ that parks are noisy, I strongly disagree." },
  { id: "th", en: "Therefore", es: "Por lo tanto", g: "Concluir", cz: "___, option B remains a more sustainable solution." },
  { id: "il", en: "In light of this", es: "En vista de esto", g: "Concluir", cz: "___, I would like to suggest a full refund." },
  { id: "ac", en: "All things considered", es: "Considerándolo todo", g: "Concluir", cz: "___, I am convinced this is the best choice." },
  { id: "ul", en: "Ultimately", es: "En última instancia", g: "Concluir", cz: "___, I am happy to support whichever decision is made." },
  { id: "ic", en: "In conclusion", es: "En conclusión", g: "Concluir", cz: "___, I truly believe this is the best option for everyone." },
  { id: "lr", en: "In the long run", es: "A la larga", g: "Concluir", cz: "It costs more now, but ___ it is a smarter investment." },
  { id: "ed", en: "At the end of the day", es: "Al fin y al cabo", g: "Concluir", cz: "___, we need to save some money." },
  { id: "is", en: "In short", es: "En resumen", g: "Concluir", cz: "___, I believe the scene will become even more active." },
  { id: "aw", en: "Anyway", es: "En fin", g: "Relajados", cz: "___, let me know what you think about Saturday." },
  { id: "at", en: "Actually", es: "De hecho", g: "Relajados", cz: "___, the store closes earlier on Sundays." },
  { id: "bw", en: "By the way", es: "Por cierto", g: "Relajados", cz: "___, did you get my last email?" },
  { id: "tf", en: "To be fair", es: "Para ser justos", g: "Relajados", cz: "___, the staff tried their best to help us." },
  { id: "tb", en: "To be honest", es: "Para ser honesto", g: "Relajados", cz: "___, I was a bit disappointed with the service." },
  { id: "gb", en: "Get back to me when you can", es: "Respóndeme cuando puedas", g: "Frases Útiles", cz: "I know you are busy, so ___." },
  { id: "jl", en: "I just want to let you know", es: "Solo quiero contarte", g: "Frases Útiles", cz: "___ that the meeting moved to Friday." },
  { id: "sh", en: "It is a shame that", es: "Es una pena que", g: "Frases Útiles", cz: "___ we cannot see each other this weekend." },
  { id: "sb", en: "I am sorry to bring this up", es: "Lamento sacar este tema", g: "Frases Útiles", cz: "Hey! ___, but the invoice is still unpaid." },
  { id: "wm", en: "What I mean is", es: "Lo que quiero decir es", g: "Frases Útiles", cz: "___ that we should wait until prices drop." },
  { id: "ms", en: "To my surprise", es: "Para mi sorpresa", g: "Frases Útiles", cz: "___, everything went better than expected." },
  { id: "su", en: "Suddenly", es: "De repente", g: "Frases Útiles", cz: "___, we realized that the tickets were sold out." },
  { id: "ws", en: "I wouldn't be surprised if", es: "No me sorprendería que", g: "Frases Útiles", cz: "___ a rainstorm starts in a few minutes." },
  { id: "ad", en: "Advocates", es: "Defiende", g: "Verbos De Opinión", cz: "The author ___ stricter recycling rules." },
  { id: "ar", en: "Argues", es: "Argumenta", g: "Verbos De Opinión", cz: "The professor ___ that remote work boosts productivity." },
  { id: "cl", en: "Claims", es: "Afirma", g: "Verbos De Opinión", cz: "The company ___ that delays were caused by weather." },
  { id: "qu", en: "Questions", es: "Cuestiona", g: "Verbos De Opinión", cz: "The journalist ___ whether the data is accurate." },
  { id: "di", en: "Dismisses", es: "Descarta", g: "Verbos De Opinión", cz: "The mayor ___ the idea as too expensive." },

  { id: "fo", en: "First of all", es: "En primer lugar", g: "Iniciar", cz: "___, we need to outline our goals." },
  { id: "ini", en: "Initially", es: "Inicialmente", g: "Iniciar", cz: "___, the project faced several delays." },
  { id: "af", en: "At first", es: "Al principio", g: "Iniciar", cz: "___, I did not understand the instructions." },

  { id: "mo", en: "Moreover", es: "Además", g: "Agregar", cz: "He is experienced; ___, he is highly motivated." },
  { id: "adt", en: "Additionally", es: "Adicionalmente", g: "Agregar", cz: "___, candidates must submit two references." },
  { id: "bs", en: "Besides", es: "Además", g: "Agregar", cz: "___ being fast, the service is very reliable." },
  { id: "lk", en: "Likewise", es: "Así mismo", g: "Agregar", cz: "The manager supported the initiative, and the team did ___." },
  { id: "asw", en: "As with", es: "Al igual que con", g: "Agregar", cz: "___ any new software, training is required." },

  { id: "fi", en: "For instance", es: "Por ejemplo", g: "Ejemplos", cz: "Many cities, ___ Vancouver, invest in green energy." },
  { id: "sc", en: "Such as", es: "Tal como", g: "Ejemplos", cz: "We prefer eco-friendly materials, ___ bamboo and glass." },

  { id: "hv", en: "However", es: "Sin embargo", g: "Contrastar", cz: "The budget was tight; ___, we delivered on time." },
  { id: "bt", en: "But", es: "Pero", g: "Contrastar", cz: "The plan was risky, ___ it yielded great results." },
  { id: "yt", en: "Yet", es: "Aún así", g: "Contrastar", cz: "It was a simple design, ___ it was extremely effective." },
  { id: "nv", en: "Nevertheless", es: "No obstante", g: "Contrastar", cz: "The climate was harsh; ___, they completed the trek." },
  { id: "alt", en: "Although", es: "Aunque", g: "Contrastar", cz: "___ it was late, they continued working." },
  { id: "wh", en: "While", es: "Mientras que", g: "Contrastar", cz: "___ Option A is cheaper, Option B is higher quality." },
  { id: "whr", en: "Whereas", es: "Mientras que", g: "Contrastar", cz: "Electric cars produce zero emissions, ___ gas cars pollute." },
  { id: "isp", en: "In spite of", es: "A pesar de", g: "Contrastar", cz: "___ the storm, the flight landed safely." },
  { id: "dsp", en: "Despite", es: "A pesar de", g: "Contrastar", cz: "___ his lack of experience, he got the position." },
  { id: "dfc", en: "Despite the difficulty", es: "A pesar de la dificultad", g: "Contrastar", cz: "___, the team achieved its quota." },
  { id: "iso", en: "Instead of", es: "En vez de", g: "Contrastar", cz: "We chose to renovate ___ rebuilding." },
  { id: "ist", en: "Instead", es: "En su lugar", g: "Contrastar", cz: "He did not complain; ___, he offered a solution." },
  { id: "unl", en: "Unlike", es: "A diferencia de", g: "Contrastar", cz: "___ traditional methods, this approach is automated." },
  { id: "cv", en: "Conversely", es: "Por el contrario", g: "Contrastar", cz: "High prices reduce demand; ___, discounts boost sales." },
  { id: "wia", en: "While I acknowledge that", es: "Aunque reconozco que", g: "Contrastar", cz: "___ option A is faster, option B is safer." },

  { id: "ths", en: "Thus", es: "De este modo", g: "Causa Y Efecto", cz: "The system was automated, ___ reducing human error." },
  { id: "hn", en: "Hence", es: "Por eso", g: "Causa Y Efecto", cz: "The deadline passed; ___ the delay in delivery." },
  { id: "so1", en: "So", es: "Así que", g: "Causa Y Efecto", cz: "The weather improved, ___ we resumed the outdoor event." },
  { id: "bc", en: "Because", es: "Porque", g: "Causa Y Efecto", cz: "We rescheduled the meeting ___ the client was ill." },
  { id: "sn", en: "Since", es: "Ya que", g: "Causa Y Efecto", cz: "___ you are already here, let's review the contract." },
  { id: "dt", en: "Due to", es: "Debido a", g: "Causa Y Efecto", cz: "The outdoor event was canceled ___ severe weather." },
  { id: "bco", en: "Because of", es: "Debido a", g: "Causa Y Efecto", cz: "Traffic was slow ___ road construction." },

  { id: "mw", en: "Meanwhile", es: "Mientras tanto", g: "Tiempo Y Secuencia", cz: "The engineers fixed the server; ___, support assisted users." },
  { id: "aft", en: "Afterward", es: "Después", g: "Tiempo Y Secuencia", cz: "We attended the briefing and met the client ___." },
  { id: "asn", en: "As soon as", es: "Tan pronto como", g: "Tiempo Y Secuencia", cz: "We will dispatch the order ___ payment is confirmed." },
  { id: "asl", en: "As long as", es: "Siempre que", g: "Tiempo Y Secuencia", cz: "You may use the equipment ___ you follow safety guidelines." },
  { id: "lb", en: "Looking back", es: "Mirando hacia atrás", g: "Tiempo Y Secuencia", cz: "___, taking that risk was the best decision." },

  { id: "ind", en: "Indeed", es: "Así es", g: "Enfatizar", cz: "The results were ___ impressive." },
  { id: "ift", en: "In fact", es: "De hecho", g: "Enfatizar", cz: "The project is not failing; ___, it is ahead of schedule." },

  { id: "unls", en: "Unless", es: "A menos que", g: "Condicionales", cz: "We will not proceed ___ approval is granted." },
  { id: "oth", en: "Otherwise", es: "De lo contrario", g: "Condicionales", cz: "Please confirm your reservation; ___, it will be canceled." },
  { id: "wht", en: "Whether", es: "Si (entre alternativas)", g: "Condicionales", cz: "We must decide ___ to expand now or wait." },
  { id: "iuty", en: "It is up to you", es: "Tú decides", g: "Condicionales", cz: "You can choose the morning or afternoon shift; ___." },

  { id: "tsu", en: "To sum up", es: "Para resumir", g: "Concluir", cz: "___, we achieved our quarterly targets." },
  { id: "tsz", en: "To summarize", es: "Para resumir", g: "Concluir", cz: "___, three key factors contributed to our success." },
  { id: "ov", en: "Overall", es: "En general", g: "Concluir", cz: "___, the campaign exceeded our expectations." },
  { id: "ite", en: "In the end", es: "Al final", g: "Concluir", cz: "___, all parties reached a fair agreement." },
  { id: "ev", en: "Eventually", es: "Con el tiempo", g: "Concluir", cz: "He persisted, and ___, he secured the grant." },
  { id: "ab", en: "Above all", es: "Sobre todo", g: "Concluir", cz: "___, maintain clarity in your writing." },

  { id: "vc1", en: "Expenditure", es: "Sinónimo alto de 'cost'", g: "Vocabulario Alto Nivel", cz: "The renovation caused a significant ___ that exceeded our budget." },
  { id: "vc2", en: "Assist", es: "Sinónimo alto de 'help'", g: "Vocabulario Alto Nivel", cz: "The new software will ___ employees with daily reporting." },
  { id: "vc3", en: "Issue", es: "Sinónimo alto de 'problem'", g: "Vocabulario Alto Nivel", cz: "We need to address this ___ before it affects other departments." },
  { id: "vc4", en: "Beneficial", es: "Sinónimo alto de 'good'", g: "Vocabulario Alto Nivel", cz: "Regular exercise is highly ___ for mental health." },
  { id: "vc5", en: "Detrimental", es: "Sinónimo alto de 'bad'", g: "Vocabulario Alto Nivel", cz: "Excessive screen time can be ___ to children's sleep." },
  { id: "vc6", en: "Demonstrate", es: "Sinónimo alto de 'show'", g: "Vocabulario Alto Nivel", cz: "These results clearly ___ the value of the new policy." },
  { id: "vc7", en: "Substantial", es: "Sinónimo alto de 'big'", g: "Vocabulario Alto Nivel", cz: "The city made a ___ investment in public transit." },
  { id: "vc8", en: "Minor", es: "Sinónimo alto de 'small'", g: "Vocabulario Alto Nivel", cz: "Aside from a few ___ delays, the project went smoothly." },
];
const CONN_GROUPS = [
  "Iniciar", "Ordenar Y Agregar", "Agregar", "Ejemplos", "Contrastar", "Causa Y Efecto",
  "Tiempo Y Secuencia", "Enfatizar", "Condicionales", "Concluir", "Relajados",
  "Frases Útiles", "Verbos De Opinión", "Vocabulario Alto Nivel",
];

const shuffle = (a) => a.map((x) => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map((p) => p[1]);

function weightedPick(pool, stats, n) {
  const items = [...pool];
  const ws = items.map((c) => {
    const s = stats[c.id] || { h: 0, m: 0 };
    return Math.max(1, 2 + s.m * 2 - s.h);
  });
  const out = [];
  while (out.length < n && items.length) {
    const total = ws.reduce((a, b) => a + b, 0);
    let r = Math.random() * total, i = 0;
    while (r > ws[i]) { r -= ws[i]; i++; }
    out.push(items[i]); items.splice(i, 1); ws.splice(i, 1);
  }
  return out;
}

const PLAN = [
  { from: 1, to: 5, title: "Memorizar los templates" },
  { from: 6, to: 12, title: "Adaptar templates a temas generales" },
  { from: 13, to: 17, title: "Simulacros completos" },
];

function sessionSteps(day) {
  const spk = ((day - 1) % 8) + 1;
  if (day <= 5) return [
    { label: "3·2·1 con dos templates de writing", go: { tab: "review", preset: { view: "ritual", group: "Writing" } } },
    { label: "3·2·1 con un template de speaking", go: { tab: "review", preset: { view: "ritual", group: "Speaking" } } },
    { label: `Speaking Task ${spk} con cronómetro`, go: { tab: "train", skill: "speaking", preset: { task: spk } } },
    { label: "Listening: una práctica a 1.25x", go: { tab: "train", skill: "listening", preset: { part: ((day - 1) % 6) + 1 } } },
    { label: "Reading: una práctica cronometrada", go: { tab: "train", skill: "reading", preset: { part: ((day - 1) % 4) + 1 } } },
    { label: "Conectores: una ronda de parejas y una en contexto", go: { tab: "review", preset: { view: "conn" } } },
  ];
  if (day <= 12) return [
    { label: "Writing: adaptar un template a un tema general", go: { tab: "train", skill: "writing", preset: { task: "w1" } } },
    { label: `Speaking Tasks ${spk} y ${(spk % 8) + 1}`, go: { tab: "train", skill: "speaking", preset: { task: spk } } },
    { label: "Listening: una práctica a 1.25x", go: { tab: "train", skill: "listening", preset: { part: ((day - 1) % 6) + 1 } } },
    { label: "Reading: una práctica cronometrada", go: { tab: "train", skill: "reading", preset: { part: ((day - 1) % 4) + 1 } } },
  ];
  return [
    { label: "Reading completo, 4 partes", go: { tab: "train", skill: "reading", preset: { part: 1 } } },
    { label: "Listening completo, 6 partes", go: { tab: "train", skill: "listening", preset: { part: 1 } } },
    { label: "Writing: email y survey", go: { tab: "train", skill: "writing", preset: { task: "w1" } } },
    { label: "Speaking: los 8 tasks seguidos", go: { tab: "train", skill: "speaking", preset: { task: 1 } } },
  ];
}

// Marca automáticamente como hecho el paso del plan de hoy que corresponda
// a la actividad que el usuario acaba de completar (si aún no estaba marcado).
function completeTodayStep(state, matchFn) {
  const steps = sessionSteps(state.day);
  const idx = steps.findIndex((st) => matchFn(st.go));
  if (idx === -1) return state;
  const prevDone = state.session && state.session.date === todayKey() ? state.session.done : [];
  if (prevDone.includes(idx)) return state;
  return { ...state, session: { date: todayKey(), done: [...prevDone, idx] } };
}

/* ---------------------- Estado y servicios ---------------------- */

const STORE_KEY = "celpip:v1";
const KEYS_KEY = "celpip:keys";
const todayKey = () => new Date().toISOString().slice(0, 10);
const blankState = () => ({ day: 1, streak: 0, lastDone: null, ritual: {}, history: [], errors: [], session: null });

// Fuera del artifact de Claude no existe window.storage: usamos localStorage.
const store = {
  async get(k) { const v = localStorage.getItem(k); return v == null ? null : { key: k, value: v }; },
  async set(k, v) { localStorage.setItem(k, v); return { key: k, value: v }; },
};
const getKeys = () => { try { return JSON.parse(localStorage.getItem(KEYS_KEY) || "{}"); } catch (e) { return {}; } };
const saveKeys = (k) => localStorage.setItem(KEYS_KEY, JSON.stringify(k));

function usePersistentState() {
  const [state, setState] = useState(blankState());
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await store.get(STORE_KEY);
        if (alive && r && r.value) setState({ ...blankState(), ...JSON.parse(r.value) });
      } catch (e) { /* primer uso */ }
      finally { if (alive) setLoaded(true); }
    })();
    return () => { alive = false; };
  }, []);
  const update = (fn) => setState((prev) => {
    const next = typeof fn === "function" ? fn(prev) : fn;
    store.set(STORE_KEY, JSON.stringify(next)).catch(() => {});
    return next;
  });
  return [state, update, loaded];
}

async function askAnthropic(key, system, user) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6", max_tokens: 1000, system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    throw new Error(res.status === 401 ? "API key de Anthropic inválida. Revísala en Ajustes."
      : "La generación no respondió. Intenta otra vez.");
  }
  const data = await res.json();
  return data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-2.5-flash"];

async function askGemini(key, system, user) {
  for (const model of GEMINI_MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` + encodeURIComponent(key),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { maxOutputTokens: 4096 },
        }),
      }
    );
    if (res.status === 404) continue; // modelo retirado: probar el siguiente
    if (!res.ok) {
      throw new Error(res.status === 429 ? "Se alcanzó el límite gratuito de hoy en Gemini. Intenta de nuevo más tarde."
        : res.status === 400 || res.status === 403 ? "API key de Gemini inválida. Revísala en Ajustes."
        : "La generación no respondió. Intenta otra vez.");
    }
    const data = await res.json();
    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const text = parts.map((p) => p.text || "").join("\n");
    if (!text) throw new Error("La generación llegó vacía. Intenta otra vez.");
    return text;
  }
  throw new Error("Ningún modelo de Gemini respondió. Puede que hayan cambiado de nombre; avísame para actualizarlos.");
}

// Adaptador: si configuraste la key de Anthropic, se usa Claude;
// si no, la key gratuita de Gemini.
async function askClaude(system, user) {
  const k = getKeys();
  if (k.anthropic) return askAnthropic(k.anthropic, system, user);
  if (k.gemini) return askGemini(k.gemini, system, user);
  throw new Error("Configura una API key en Ajustes (engranaje en Inicio): Gemini gratuita o Anthropic.");
}
async function askClaudeJSON(system, user) {
  const raw = await askClaude(system + "\nResponde SOLO con JSON válido, sin markdown ni texto extra.", user);
  return JSON.parse(raw.replace(/```json/g, "").replace(/```/g, "").trim());
}

function ping() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.18, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    o.start(); o.stop(ctx.currentTime + 0.7);
  } catch (e) { /* sin audio */ }
  if (navigator.vibrate) navigator.vibrate([180, 90, 180]);
}

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const countWords = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0);

function parseScript(script) {
  const lines = script.split("\n").map((l) => l.trim()).filter(Boolean);
  const turns = []; const speakers = [];
  for (const l of lines) {
    const m = l.match(/^([A-Za-z .'-]{1,28}):\s*(.+)$/);
    if (m) {
      if (!speakers.includes(m[1])) speakers.push(m[1]);
      turns.push({ sp: m[1], text: m[2] });
    } else if (turns.length) turns[turns.length - 1].text += " " + l;
    else turns.push({ sp: null, text: l });
  }
  return { turns, speakers };
}

function bestEnglishVoices() {
  const vs = (window.speechSynthesis ? window.speechSynthesis.getVoices() : [])
    .filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
  const score = (v) =>
    (/natural|neural|premium|enhanced/i.test(v.name) ? 8 : 0) +
    (/google|microsoft/i.test(v.name) ? 3 : 0) +
    (v.lang === "en-CA" ? 2 : /en-(US|GB)/i.test(v.lang) ? 1 : 0);
  return [...vs].sort((a, b) => score(b) - score(a));
}

function withVoices(cb) {
  const synth = window.speechSynthesis;
  if (!synth) return;
  if (synth.getVoices().length) return cb();
  let ran = false;
  const run = () => { if (!ran) { ran = true; cb(); } };
  synth.onvoiceschanged = run;
  setTimeout(run, 400);
}

// Audio real con OpenAI TTS: una voz distinta por hablante del diálogo.
const OPENAI_VOICES = ["nova", "onyx", "shimmer", "echo", "alloy", "fable"];
const ttsSessionCache = new Map(); // guion → urls de audio ya pagadas en esta sesión

async function ttsOpenAI(key, text, voice) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts", voice, input: text, response_format: "mp3",
      instructions: "Natural, human, conversational Canadian English — like a real person on a phone call or radio segment, not a narrator reading a script. Vary pitch and pace naturally, use realistic micro-pauses at commas, slight breath before new sentences, and let filler words (well, you know, actually) land casually and unhurried. Avoid a flat or robotic monotone; sound relaxed and spontaneous, as if thinking while speaking.",
    }),
  });
  if (!res.ok) throw new Error("tts");
  return URL.createObjectURL(await res.blob());
}

// Audios de voz humana real con transcripción oficial, vía la API pública
// del visor de datasets de Hugging Face (gratis, sin key).
const HUMAN_SOURCES = [
  { id: "openslr/librispeech_asr", config: "clean", split: "validation", label: "Lectura · LibriSpeech" },
  { id: "librispeech_asr", config: "clean", split: "validation", label: "Lectura · LibriSpeech" },
  { id: "facebook/voxpopuli", config: "en", split: "validation", label: "Discurso real · VoxPopuli" },
];

async function fetchHumanClip() {
  for (const s of HUMAN_SOURCES) {
    try {
      const base = `https://datasets-server.huggingface.co/rows?dataset=${encodeURIComponent(s.id)}&config=${s.config}&split=${s.split}`;
      const meta = await fetch(`${base}&offset=0&length=1`);
      if (!meta.ok) continue;
      const mj = await meta.json();
      const total = Math.min(mj.num_rows_total || 500, 2000);
      const offset = Math.floor(Math.random() * Math.max(1, total - 1));
      const r = await fetch(`${base}&offset=${offset}&length=1`);
      if (!r.ok) continue;
      const j = await r.json();
      const row = j.rows && j.rows[0] && j.rows[0].row;
      if (!row) continue;
      const audio = Array.isArray(row.audio) ? row.audio[0] : row.audio;
      const src = audio && (audio.src || audio.url);
      const text = row.text || row.sentence || row.normalized_text || row.raw_text || row.transcription || "";
      if (!src || !String(text).trim()) continue;
      return { src, text: String(text).trim(), source: s.label };
    } catch (e) { /* probar la siguiente fuente */ }
  }
  throw new Error("No se pudo obtener un audio real en este momento. Intenta de nuevo en unos segundos.");
}

function dictationScore(target, attempt) {
  const norm = (t) => (t.toLowerCase().match(/[a-z']+/g) || []);
  const tw = norm(target);
  const aw = new Set(norm(attempt));
  if (!tw.length) return 0;
  return Math.round((tw.filter((w) => aw.has(w)).length / tw.length) * 100);
}

// Banco local de prácticas ya generadas: repetirlas no gasta tokens.
const cacheAdd = (key, item, cap = 20) => {
  try {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.push(item);
    while (arr.length > cap) arr.shift();
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) { /* sin espacio: se omite */ }
};
const cacheList = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { return []; }
};
const cacheRemoveAt = (key, idx) => {
  try {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.splice(idx, 1);
    localStorage.setItem(key, JSON.stringify(arr));
  } catch (e) { /* sin espacio: se omite */ }
};

// Los modelos suelen partir el pasaje en un salto de línea por frase: lo
// normalizamos a párrafos reales (línea en blanco = nuevo párrafo).
function cleanPassage(t) {
  if (!t) return "";
  return t
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").replace(/[ \t]{2,}/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

/* ---------------------- Primitivas de UI ---------------------- */

function Ring({ size = 210, stroke = 10, progress = 0, color = "#fff", children }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.08)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(1, progress)))}
          style={{ transition: "stroke-dashoffset .6s linear" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

function useCountdown(total, autoStart, onDone) {
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(!!autoStart);
  const doneRef = useRef(onDone); doneRef.current = onDone;
  useEffect(() => { setLeft(total); setRunning(!!autoStart); }, [total, autoStart]);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((v) => {
      if (v <= 1) { clearInterval(t); setRunning(false); ping(); doneRef.current && doneRef.current(); return 0; }
      return v - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [running]);
  return { left, running, setRunning, reset: () => { setRunning(false); setLeft(total); } };
}

function BigTimer({ total, color, label, autoStart = false, onDone }) {
  const { left, running, setRunning, reset } = useCountdown(total, autoStart, onDone);
  return (
    <div className="center" style={{ marginTop: 18 }}>
      <Ring progress={left / total} color={color}>
        <span className="disp timeval" style={{ color: left <= 15 ? "#FF9E9E" : "var(--text)" }}>{fmt(left)}</span>
        <span className="kicker" style={{ marginTop: 6 }}>{label}</span>
      </Ring>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button className="iconbtn iconbtn--acc" style={{ "--acc": color }}
          aria-label={running ? "Pausar" : "Iniciar"} onClick={() => setRunning(!running)}>
          {running ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button className="iconbtn" aria-label="Reiniciar" onClick={reset}><RotateCw size={18} /></button>
      </div>
    </div>
  );
}

function MiniTimer({ total, color }) {
  const { left, running, setRunning, reset } = useCountdown(total, false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span className="disp" style={{ fontSize: 22, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: left <= 60 ? "#FF9E9E" : "var(--text)" }}>
        {fmt(left)}
      </span>
      <button className="iconbtn" style={{ width: 38, height: 38, borderRadius: 11 }}
        aria-label={running ? "Pausar" : "Iniciar"} onClick={() => setRunning(!running)}>
        {running ? <Pause size={16} /> : <Play size={16} color={color} />}
      </button>
      <button className="iconbtn" style={{ width: 38, height: 38, borderRadius: 11 }} aria-label="Reiniciar" onClick={reset}>
        <RotateCw size={15} />
      </button>
    </div>
  );
}

function TopBar({ title, sub, onBack, right }) {
  return (
    <div className="topbar">
      {onBack && <button className="iconbtn" aria-label="Volver" onClick={onBack}><ChevronLeft size={20} /></button>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {sub && <div className="kicker">{sub}</div>}
        <h2 className="disp h2">{title}</h2>
      </div>
      {right}
    </div>
  );
}

function Strategy({ tips, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card card--flat" style={{ padding: "4px 16px" }}>
      <button className="steprow" style={{ width: "100%", background: "none", border: "none", color: "var(--text)", cursor: "pointer", font: "inherit", textAlign: "left" }}
        onClick={() => setOpen(!open)}>
        <Sparkles size={16} color={color} />
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>Estrategia del cuaderno</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && tips.map((t, i) => (
        <p key={i} className="dimtx" style={{ padding: "4px 0 8px 28px" }}>{t}</p>
      ))}
    </div>
  );
}

function Skeletons() {
  return <div className="card"><div className="skel" style={{ width: "55%" }} /><div className="skel" /><div className="skel" /><div className="skel" style={{ width: "80%" }} /></div>;
}

function QuizRunner({ quiz, color, onFinish }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const score = quiz.questions.filter((q, i) => answers[i] === q.correct).length;
  return (
    <div>
      {quiz.questions.map((q, i) => (
        <div key={i} style={{ marginTop: 18 }}>
          <p style={{ fontWeight: 600, fontSize: 14.5 }}>{i + 1}. {q.question}</p>
          {q.options.map((o, j) => {
            let st = "";
            if (checked) { if (j === q.correct) st = "ok"; else if (answers[i] === j) st = "bad"; }
            return (
              <button key={j} className="opt" data-state={st} data-pick={!checked && answers[i] === j ? "1" : "0"}
                style={{ "--acc": color }} disabled={checked}
                onClick={() => setAnswers((a) => ({ ...a, [i]: j }))}>
                <b>{String.fromCharCode(65 + j)}</b><span>{o}</span>
              </button>
            );
          })}
          {checked && <p className="dimtx" style={{ marginTop: 6 }}>{q.explanation}</p>}
        </div>
      ))}
      {!checked
        ? <button className="btn" style={{ "--acc": color }}
            disabled={Object.keys(answers).length < quiz.questions.length}
            onClick={() => { setChecked(true); onFinish && onFinish(score, quiz.questions.length); }}>
            Revisar respuestas
          </button>
        : <div className="card center" style={{ padding: 22 }}>
            <span className="disp" style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, color }}>{score}/{quiz.questions.length}</span>
            <span className="dimtx" style={{ marginTop: 6, display: "block" }}>Respuestas correctas</span>
          </div>}
    </div>
  );
}

// Replica la interfaz de la prueba real de Reading de CELPIP: pasaje fijo
// arriba, una pregunta a la vez abajo, navegación libre entre preguntas y
// un único cronómetro para toda la parte (como en el examen real).
function ReadingExamRunner({ quiz, part, onFinish, onNewPractice }) {
  const total = quiz.questions.length;
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [showPassage, setShowPassage] = useState(true);
  const [showPassageEnd, setShowPassageEnd] = useState(false);
  const answersRef = useRef({});
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    const score = quiz.questions.filter((q, i) => answersRef.current[i] === q.correct).length;
    setFinished(true);
    onFinish(score, total);
  };

  const totalSeconds = part.min * 60;
  const { left } = useCountdown(totalSeconds, true, finish);

  if (finished) {
    const score = quiz.questions.filter((q, i) => answersRef.current[i] === q.correct).length;
    return (
      <>
        <div className="card center" style={{ padding: 24 }}>
          <span className="disp" style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 700, color: "#FFD666" }}>{score}/{total}</span>
          <span className="dimtx" style={{ marginTop: 6, display: "block" }}>Respuestas correctas</span>
        </div>
        <div className="card">
          {quiz.questions.map((q, i) => {
            const mine = answersRef.current[i];
            const ok = mine === q.correct;
            return (
              <div key={i} style={{ marginTop: i ? 16 : 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{i + 1}. {q.question}</p>
                {mine != null && !ok && <p className="dimtx" style={{ color: "#FF9E9E" }}>✗ Tu respuesta: {q.options[mine]}</p>}
                {mine == null && <p className="dimtx" style={{ color: "#FF9E9E" }}>✗ Sin responder</p>}
                <p className="dimtx" style={{ color: "#7FE0B2" }}>✓ {q.options[q.correct]}</p>
                <p className="dimtx">{q.explanation}</p>
              </div>
            );
          })}
        </div>
        <button className="btn btn--ghost" onClick={() => setShowPassageEnd(!showPassageEnd)}>
          {showPassageEnd ? "Ocultar pasaje" : "Ver pasaje"}
        </button>
        {showPassageEnd && (
          <div className="paper">
            {cleanPassage(quiz.passage).split("\n\n").map((p, i) => <p key={i} style={{ margin: i ? "10px 0 0" : 0 }}>{p}</p>)}
          </div>
        )}
        <button className="btn" style={{ "--acc": "#FFD666" }} onClick={onNewPractice}>Nueva práctica</button>
      </>
    );
  }

  const q = quiz.questions[qIdx];
  const paragraphs = cleanPassage(quiz.passage).split("\n\n");
  return (
    <div className="exam2">
      <div className="exam2-top">
        <span className="exam2-brand">CELPIP · Reading Part {part.n}</span>
        <span className="exam2-count">{fmt(left)}</span>
      </div>
      <div className="exam2-bar"><i style={{ width: `${(left / totalSeconds) * 100}%` }} /></div>
      <button className="exam2-toggle" onClick={() => setShowPassage(!showPassage)}>
        <span>{quiz.title}</span>
        {showPassage ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {showPassage && (
        <div className="exam2-passage">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}
      <div className="exam2-body">
        <span className="exam-count" style={{ color: "#5A6784" }}>Question {qIdx + 1} of {total}</span>
        <p className="exam-q">{q.question}</p>
        {q.options.map((o, j) => (
          <button key={j} className="radio" data-on={answers[qIdx] === j ? "1" : "0"}
            onClick={() => {
              answersRef.current = { ...answersRef.current, [qIdx]: j };
              setAnswers((a) => ({ ...a, [qIdx]: j }));
            }}>
            <span className="rdot" /><span>{o}</span>
          </button>
        ))}
        <div className="exam2-nav">
          {quiz.questions.map((_, i) => (
            <button key={i} className="exam2-navdot" data-cur={i === qIdx ? "1" : "0"}
              data-answered={answers[i] != null ? "1" : "0"} onClick={() => setQIdx(i)}>
              {i + 1}
            </button>
          ))}
        </div>
        <div className="exam2-footer">
          <button className="exam2-prev" disabled={qIdx === 0} onClick={() => setQIdx((i) => Math.max(0, i - 1))}>BACK</button>
          <button className="exam-next" onClick={() => (qIdx + 1 >= total ? finish() : setQIdx((i) => i + 1))}>
            {qIdx + 1 === total ? "FINISH" : "NEXT"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScorePanel({ result, color }) {
  return (
    <div className="screen">
      <div className="card center" style={{ padding: 26 }}>
        <span className="kicker">Nivel Estimado</span>
        <span className="disp" style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, color }}>{result.level}</span>
      </div>
      <div className="card">
        {(result.criteria || []).map((c, k) => (
          <div key={k} style={{ marginTop: k ? 14 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
              <span className="pill">{c.score}/12</span>
            </div>
            <div className="meter" style={{ "--acc": color }}><i style={{ width: `${(c.score / 12) * 100}%` }} /></div>
            <p className="dimtx" style={{ marginTop: 6 }}>{c.comment}</p>
          </div>
        ))}
      </div>
      {result.fixes && result.fixes.length > 0 && (
        <div className="card">
          <span className="kicker">Correcciones · guardadas en tu banco de errores</span>
          {result.fixes.map((f, k) => <p key={k} style={{ fontSize: 13.5, lineHeight: 21, marginTop: 8 }}>{f}</p>)}
        </div>
      )}
      {result.upgrades && result.upgrades.length > 0 && (
        <div className="card">
          <span className="kicker">Para subir el score</span>
          {result.upgrades.map((f, k) => <p key={k} style={{ fontSize: 13.5, lineHeight: 21, marginTop: 8 }}>{f}</p>)}
        </div>
      )}
    </div>
  );
}

/* ---------------------- Inicio ---------------------- */

function HomeScreen({ state, update, launch }) {
  const block = PLAN.find((p) => state.day >= p.from && state.day <= p.to) || PLAN[0];
  const steps = sessionSteps(state.day);
  const sess = state.session && state.session.date === todayKey() ? state.session : { date: todayKey(), done: [] };
  const stepDone = (i) => sess.done.includes(i);
  const nextIdx = steps.findIndex((_, i) => !stepDone(i));
  const doneToday = state.lastDone === todayKey();

  const toggleStep = (i) => update((s) => {
    const prev = s.session && s.session.date === todayKey() ? s.session.done : [];
    const done = prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i];
    return { ...s, session: { date: todayKey(), done } };
  });
  const markDay = () => update((s) => ({
    ...s, day: s.day >= 17 ? 1 : s.day + 1, streak: s.streak + 1, lastDone: todayKey(),
  }));
  const goStep = (i) => { const g = steps[i].go; launch(g.tab, g.skill || null, g.preset || null); };

  const skillFor = (st) => (st.go.skill ? SKILLS[st.go.skill] : null);
  const nextSkill = nextIdx !== -1 ? skillFor(steps[nextIdx]) : null;
  const heroColor = nextSkill ? nextSkill.color : "#7FE0B2";
  const HeroIcon = nextSkill ? nextSkill.icon : Check;

  return (
    <div className="screen">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="kicker">Día {state.day} de 17 · {block.title}</div>
          <h1 className="disp h1">Hola, Mauricio</h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
          <span className="pill" style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Flame size={13} color="#FFD666" /> {state.streak}
          </span>
          <button className="iconbtn" style={{ width: 38, height: 38, borderRadius: 11 }}
            aria-label="Ajustes" onClick={() => launch("settings")}>
            <SettingsIcon size={16} />
          </button>
        </div>
      </div>

      <div className="card hero" style={{ "--acc": heroColor }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Ring size={58} stroke={5} progress={sess.done.length / steps.length} color={heroColor}>
            <HeroIcon size={22} color={heroColor} />
          </Ring>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="kicker">
              {nextIdx === -1 ? "Sesión de hoy" : `Paso ${nextIdx + 1} de ${steps.length} · Sigue con esto`}
            </span>
            <p style={{ fontWeight: 700, fontSize: 16, lineHeight: "22px", marginTop: 2 }}>
              {nextIdx === -1 ? "¡Completaste todo hoy! 🎉" : steps[nextIdx].label}
            </p>
          </div>
        </div>
        {nextIdx !== -1
          ? <button className="btn" style={{ "--acc": heroColor }} onClick={() => goStep(nextIdx)}>
              Empezar <ArrowRight size={17} />
            </button>
          : <button className="btn" style={{ "--acc": heroColor }} onClick={markDay} disabled={doneToday}>
              {doneToday ? "Día registrado" : "Marcar día completado"} <Check size={17} />
            </button>}
      </div>

      <RoadmapPreview currentDay={state.day} />

      <div className="card" style={{ paddingTop: 6, paddingBottom: 6 }}>
        <div className="kicker" style={{ padding: "10px 0 2px" }}>Plan de hoy · {sess.done.length}/{steps.length}</div>
        {steps.map((st, i) => {
          const sk = skillFor(st);
          const Ic = sk ? sk.icon : RotateCcw;
          const color = sk ? sk.color : "var(--dim)";
          const done = stepDone(i);
          return (
            <div className="steprow" key={i}>
              <button className="dot" data-on={done ? "1" : "0"} style={{ "--acc": "#7FE0B2" }}
                aria-label={`Marcar paso ${i + 1} como hecho`} onClick={() => toggleStep(i)}>
                <Check size={15} />
              </button>
              <button className="stepbtn" style={{ opacity: done ? 0.45 : 1 }}
                aria-label={`Ir al paso ${i + 1}`} onClick={() => goStep(i)}>
                <span className="stepic" style={{ background: `${color}22`, color }}><Ic size={15} /></span>
                <span style={{ flex: 1, fontSize: 14, lineHeight: "21px", textDecoration: done ? "line-through" : "none" }}>{st.label}</span>
                <ArrowRight size={16} color="var(--dim)" />
              </button>
            </div>
          );
        })}
      </div>

      <p className="dimtx" style={{ marginTop: 14 }}>
        Método del cuaderno: leer 3 veces, repetir en voz alta 2 veces, escribirlo 1 vez. Vive en la pestaña Repaso.
      </p>
    </div>
  );
}

const phaseColor = (day) => (day <= 5 ? "#7FE0B2" : day <= 12 ? "#FFD666" : "#FF9E9E");

function RoadmapPreview({ currentDay }) {
  const [open, setOpen] = useState(false);
  const [selDay, setSelDay] = useState(currentDay);
  const selSteps = sessionSteps(selDay);

  return (
    <div className="card">
      <button style={{ display: "flex", width: "100%", gap: 12, alignItems: "center", background: "none", border: "none", color: "var(--text)", cursor: "pointer", font: "inherit", textAlign: "left", padding: 0 }}
        onClick={() => setOpen(!open)}>
        <span className="stepic" style={{ background: "rgba(237,241,248,.12)", color: "var(--text)" }}><RotateCcw size={15} /></span>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>Ruta completa · 17 días</span>
        {open ? <ChevronUp size={16} color="var(--dim)" /> : <ChevronDown size={16} color="var(--dim)" />}
      </button>

      {open && <>
        {PLAN.map((phase) => (
          <div key={phase.title} style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: phaseColor(phase.from), flex: "0 0 auto" }} />
              <span className="dimtx" style={{ fontWeight: 600 }}>{phase.title}</span>
            </div>
            <div className="chiprow" style={{ marginTop: 8 }}>
              {Array.from({ length: phase.to - phase.from + 1 }, (_, i) => phase.from + i).map((day) => (
                <button key={day} className="chip" data-on={day === selDay ? "1" : "0"}
                  style={{ "--acc": phaseColor(day), opacity: day < currentDay ? 0.5 : 1 }}
                  onClick={() => setSelDay(day)}>
                  {day === currentDay && <Flame size={11} />} Día {day}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="card card--flat" style={{ marginTop: 18, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span className="pill pill--acc" style={{ "--acc": phaseColor(selDay) }}>Día {selDay}</span>
            {selDay === currentDay && <span className="kicker">Hoy</span>}
          </div>
          {selSteps.map((s, i) => (
            <p key={i} className="dimtx" style={{ marginTop: i ? 6 : 10 }}>· {s.label}</p>
          ))}
        </div>
      </>}
    </div>
  );
}

/* ---------------------- Entrenar ---------------------- */

function TrainGrid({ open }) {
  return (
    <div className="screen">
      <div className="kicker">Entrenamiento</div>
      <h1 className="disp h1">¿Qué practicamos?</h1>
      {Object.entries(SKILLS).map(([id, s]) => {
        const Ic = s.icon;
        return (
          <button key={id} className="skill" onClick={() => open(id)}>
            <span className="ic" style={{ background: s.color }}><Ic size={22} /></span>
            <span style={{ flex: 1 }}>
              <span className="disp" style={{ fontWeight: 600, fontSize: 16, display: "block" }}>{s.label}</span>
              <span className="dimtx">{s.meta} · {s.time}</span>
            </span>
            <ArrowRight size={18} color="var(--dim)" />
          </button>
        );
      })}
    </div>
  );
}

function ReadingScreen({ back, preset, update }) {
  const S = SKILLS.reading;
  const [part, setPart] = useState(READING_PARTS[(preset && preset.part ? preset.part : 1) - 1] || READING_PARTS[0]);
  const [quiz, setQuiz] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const generate = async () => {
    setBusy(true); setErr(""); setQuiz(null);
    try {
      const topic = CELPIP_TOPICS[Math.floor(Math.random() * CELPIP_TOPICS.length)];
      const data = await askClaudeJSON(
        "Eres un generador de práctica para el examen CELPIP General, sección Reading.",
        `Genera una práctica de CELPIP Reading Part ${part.n}: ${part.name}.
El texto debe ser ${READING_SPECS[part.n]}.
Tema: ${topic}, en un contexto canadiense.
El texto debe tener suficiente contenido para sostener ${part.q} preguntas distintas sin repetir la misma idea (aprox. ${part.q * 25}-${part.q * 32} palabras).
Devuelve JSON: {"title":"...","passage":"el texto en inglés canadiense","questions":[{"question":"...","options":["a","b","c","d"],"correct":0,"explanation":"breve, en español, qué sinónimo delata la respuesta"}]}
Exactamente ${part.q} preguntas, como en el examen real de esta parte. Usa sinónimos y paráfrasis como el examen real.`
      );
      data.passage = cleanPassage(data.passage);
      setQuiz(data);
      cacheAdd(`celpip:cache:read:${part.n}`, { date: todayKey(), quiz: data });
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const savedForPart = cacheList(`celpip:cache:read:${part.n}`);

  return (
    <div className="screen" style={{ "--acc": S.color }}>
      <TopBar title="Reading" sub={`Part ${part.n} · ${part.q} Preguntas · ${part.min} Min`} onBack={back} />
      {!quiz && <>
        <div className="chiprow">
          {READING_PARTS.map((p) => (
            <button key={p.n} className="chip" data-on={p.n === part.n ? "1" : "0"} style={{ "--acc": S.color }}
              onClick={() => setPart(p)}>Part {p.n} · {p.name}</button>
          ))}
        </div>
        <Strategy tips={part.tips} color={S.color} />
        {busy ? <Skeletons /> : (
          <button className="btn" style={{ "--acc": S.color }} onClick={generate}>
            Generar práctica <Sparkles size={16} />
          </button>
        )}
        {!busy && savedForPart.length > 0 && (
          <div className="card">
            <span className="kicker">Guardadas · Part {part.n} · {savedForPart.length}/20 · $0 al repetirlas</span>
            {savedForPart.slice().reverse().map((item, i) => {
              const realIdx = savedForPart.length - 1 - i;
              return (
                <div key={realIdx} className="steprow" style={{ gap: 8 }}>
                  <button style={{ flex: 1, textAlign: "left", background: "none", border: "none", cursor: "pointer", color: "var(--text)", padding: 0 }}
                    onClick={() => { setErr(""); setQuiz(item.quiz); }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, display: "block" }}>{item.quiz.title}</span>
                    <span className="dimtx">{item.date}</span>
                  </button>
                  <button className="iconbtn" aria-label="Borrar guardada" style={{ width: 36, height: 36, borderRadius: 10 }}
                    onClick={() => { cacheRemoveAt(`celpip:cache:read:${part.n}`, realIdx); setPart({ ...part }); }}>
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </>}
      {err && <p className="dimtx" style={{ color: "#FF9E9E", marginTop: 12 }}>{err}</p>}
      {quiz && (
        <>
          <ReadingExamRunner quiz={quiz} part={part} onFinish={(s, t) => update((st) => completeTodayStep({
            ...st, history: [...st.history, { date: todayKey(), section: "Reading", detail: `Part ${part.n}: ${s}/${t}` }],
          }, (g) => g.tab === "train" && g.skill === "reading"))} onNewPractice={() => setQuiz(null)} />
          <button className="btn btn--ghost" onClick={() => setQuiz(null)}>Salir sin terminar</button>
        </>
      )}
    </div>
  );
}

function HumanAudio({ color, rate, update }) {
  const [clip, setClip] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [attempt, setAttempt] = useState("");
  const [score, setScore] = useState(null);
  const [hquiz, setHquiz] = useState(null);
  const [qbusy, setQbusy] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = rate; }, [rate, clip]);

  const load = async () => {
    setBusy(true); setErr(""); setClip(null); setAttempt(""); setScore(null); setHquiz(null);
    try { setClip(await fetchHumanClip()); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const check = () => {
    const s = dictationScore(clip.text, attempt);
    setScore(s);
    update((st) => ({ ...st, history: [...st.history, { date: todayKey(), section: "Listening", detail: `Dictado con audio real: ${s}%` }] }));
  };

  const genQuestions = async () => {
    setQbusy(true); setErr("");
    try {
      const q = await askClaudeJSON(
        "Eres un generador de preguntas de comprensión auditiva estilo CELPIP.",
        `Transcripción de un audio real en inglés:\n"""${clip.text}"""\nDevuelve JSON: {"questions":[{"question":"...","options":["a","b","c","d"],"correct":0,"explanation":"breve, en español"}]}\nExactamente 3 preguntas de comprensión sobre el contenido del audio.`
      );
      setHquiz({ questions: q.questions });
    } catch (e) { setErr(e.message); }
    setQbusy(false);
  };

  const pretty = (t) => { const low = t.toLowerCase(); return low.charAt(0).toUpperCase() + low.slice(1); };

  return (
    <>
      <div className="card">
        <span className="kicker">Voz Humana Real · Transcripción Oficial</span>
        <p className="dimtx" style={{ marginTop: 6 }}>
          Escucha el clip, escribe lo que oíste y compara con la transcripción exacta. Entrena el oído con ritmo y acento reales.
        </p>
        <button className="btn" style={{ "--acc": color }} onClick={load} disabled={busy}>
          {busy ? "Buscando audio…" : clip ? "Otro audio aleatorio" : "Audio aleatorio"}
        </button>
      </div>
      {err && <p className="dimtx" style={{ color: "#FF9E9E", marginTop: 12 }}>{err}</p>}
      {clip && (
        <>
          <div className="card">
            <span className="pill">{clip.source}</span>
            <audio ref={audioRef} controls src={clip.src} style={{ width: "100%", marginTop: 12 }}
              onLoadedMetadata={() => { if (audioRef.current) audioRef.current.playbackRate = rate; }} />
            <p className="dimtx" style={{ marginTop: 8 }}>Puedes repetirlo las veces que necesites antes de escribir.</p>
          </div>
          <textarea rows={3} placeholder="Escribe exactamente lo que escuchaste…"
            value={attempt} onChange={(e) => setAttempt(e.target.value)} />
          {score == null ? (
            <button className="btn" style={{ "--acc": color }} onClick={check} disabled={countWords(attempt) < 3}>
              Comparar con la transcripción
            </button>
          ) : (
            <>
              <p style={{ marginTop: 12 }}>
                <span className="hlmark" style={{ "--acc": score >= 80 ? "#7FE0B2" : score >= 50 ? "#FFD666" : "#FF9E9E" }}>
                  Captaste el {score}% de las palabras
                </span>
              </p>
              <div className="paper">{pretty(clip.text)}</div>
              {!hquiz && (
                <button className="btn btn--ghost" onClick={genQuestions} disabled={qbusy}>
                  {qbusy ? "Generando…" : "Generar preguntas de comprensión"}
                </button>
              )}
            </>
          )}
          {hquiz && <QuizRunner quiz={hquiz} color={color} onFinish={(s, t) => update((st) => ({
            ...st, history: [...st.history, { date: todayKey(), section: "Listening", detail: `Audio real: ${s}/${t}` }],
          }))} />}
        </>
      )}
    </>
  );
}

const EXAM_Q_SECONDS = 30;

function ExamRunner({ quiz, part, color, onDone, onNewPractice }) {
  const total = quiz.questions.length;
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [qLeft, setQLeft] = useState(EXAM_Q_SECONDS);
  const [finished, setFinished] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const answersRef = useRef({});
  const idxRef = useRef(0);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFinished(true);
    const score = quiz.questions.filter((q, i) => answersRef.current[i] === q.correct).length;
    onDone(score, total);
  };

  const next = () => {
    if (idxRef.current + 1 >= total) { finish(); return; }
    idxRef.current += 1;
    setQIdx(idxRef.current);
  };

  useEffect(() => {
    if (finished) return;
    setQLeft(EXAM_Q_SECONDS);
    const t = setInterval(() => {
      setQLeft((v) => {
        if (v <= 1) { clearInterval(t); next(); return EXAM_Q_SECONDS; }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [qIdx, finished]);

  if (finished) {
    const score = quiz.questions.filter((q, i) => answersRef.current[i] === q.correct).length;
    return (
      <>
        <div className="card center" style={{ padding: 24 }}>
          <span className="disp" style={{ fontSize: 44, lineHeight: 1.1, fontWeight: 700, color }}>{score}/{total}</span>
          <span className="dimtx" style={{ marginTop: 6, display: "block" }}>Respuestas correctas</span>
        </div>
        <div className="card">
          {quiz.questions.map((q, i) => {
            const mine = answersRef.current[i];
            const ok = mine === q.correct;
            return (
              <div key={i} style={{ marginTop: i ? 16 : 0 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{i + 1}. {q.question}</p>
                {mine != null && !ok && <p className="dimtx" style={{ color: "#FF9E9E" }}>✗ Tu respuesta: {q.options[mine]}</p>}
                {mine == null && <p className="dimtx" style={{ color: "#FF9E9E" }}>✗ Sin responder: se acabó el tiempo</p>}
                <p className="dimtx" style={{ color: "#7FE0B2" }}>✓ {q.options[q.correct]}</p>
                <p className="dimtx">{q.explanation}</p>
              </div>
            );
          })}
        </div>
        <button className="btn btn--ghost" onClick={() => setShowScript(!showScript)}>
          {showScript ? "Ocultar transcripción" : "Ver transcripción"}
        </button>
        {showScript && <div className="paper">{quiz.script}</div>}
        <button className="btn" style={{ "--acc": color }} onClick={onNewPractice}>Nueva práctica</button>
      </>
    );
  }

  const q = quiz.questions[qIdx];
  return (
    <div className="exam">
      <div className="exam-top">
        <span className="exam-brand">CELPIP · Listening Part {part.n}</span>
        <span className="exam-count">Question {qIdx + 1} of {total} · {qLeft}s</span>
      </div>
      <div className="exam-bar"><i style={{ width: `${(qLeft / EXAM_Q_SECONDS) * 100}%` }} /></div>
      <p className="exam-q">{q.question}</p>
      {q.options.map((o, j) => (
        <button key={j} className="radio" data-on={answers[qIdx] === j ? "1" : "0"}
          onClick={() => {
            answersRef.current = { ...answersRef.current, [qIdx]: j };
            setAnswers((a) => ({ ...a, [qIdx]: j }));
          }}>
          <span className="rdot" /><span>{o}</span>
        </button>
      ))}
      <p className="exam-hint">You cannot return to this question after pressing NEXT.</p>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
        <button className="exam-next" onClick={next}>{qIdx + 1 === total ? "FINISH" : "NEXT"}</button>
      </div>
    </div>
  );
}

function ListeningScreen({ back, preset, update }) {
  const S = SKILLS.listening;
  const [part, setPart] = useState(LISTENING_PARTS[(preset && preset.part ? preset.part : 1) - 1] || LISTENING_PARTS[0]);
  const [quiz, setQuiz] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [rate, setRate] = useState(1.25);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const [notes, setNotes] = useState("");
  const [cols, setCols] = useState({ a: "", b: "", c: "", favor: "", contra: "" });
  const [names, setNames] = useState(["Persona 1", "Persona 2", "Persona 3"]);

  const [mode, setMode] = useState("sim");
  const [quizDone, setQuizDone] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [examPhase, setExamPhase] = useState("intro");

  useEffect(() => () => window.speechSynthesis && window.speechSynthesis.cancel(), []);
  useEffect(() => { if (played) setExamPhase("questions"); }, [played]);

  const generate = async () => {
    setBusy(true); setErr(""); setQuiz(null); setPlayed(false); setNotes("");
    setQuizDone(false); setShowScript(false); setExamPhase("intro");
    setCols({ a: "", b: "", c: "", favor: "", contra: "" });
    try {
      const topic = CELPIP_TOPICS[Math.floor(Math.random() * CELPIP_TOPICS.length)];
      const data = await askClaudeJSON(
        "Eres un guionista de audios de práctica para el examen CELPIP General, sección Listening. Escribes inglés canadiense HABLADO, no leído.",
        `Genera una práctica de CELPIP Listening Part ${part.n}: ${part.name}.
El audio debe ser ${LISTEN_SPECS[part.n]}.
Tema: ${topic}, en un contexto canadiense.
Reglas del guion para que suene natural en voz sintetizada:
- Contracciones siempre (I'm, don't, we've), frases cortas, alguna muletilla ligera (well, you know, actually).
- Cada intervención en su propia línea con el formato exacto "Nombre: texto". En monólogos, un solo hablante (por ejemplo "Announcer:").
- Sin acotaciones, sin paréntesis, sin emojis. Puntuación cuidada (comas y puntos) porque marca las pausas de la voz.
- Suficiente contenido para sostener ${part.q} preguntas sin repetir la misma idea (aprox. ${part.q * 30}-${part.q * 40} palabras). En diálogos, turnos cortos que se responden entre sí como una conversación real.
Devuelve JSON: {"title":"A conversation about ...","script":"...","questions":[{"question":"...","options":["a","b","c","d"],"correct":0,"explanation":"breve, en español"}]}
Exactamente ${part.q} preguntas, como en el examen real de esta parte, sobre who, what, when, where u opiniones de los hablantes.`
      );
      setQuiz(data);
      cacheAdd(`celpip:cache:listen:${part.n}`, { date: todayKey(), quiz: data });
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const stopRef = useRef(false);
  const audioRef = useRef(null);
  const [audioBusy, setAudioBusy] = useState(false);

  const playSystem = () => {
    if (!quiz || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    stopRef.current = false;
    const { turns, speakers } = parseScript(quiz.script);
    withVoices(() => {
      const voices = bestEnglishVoices();
      const map = {};
      speakers.forEach((sp, i) => { map[sp] = voices.length ? voices[i % voices.length] : null; });
      let idx = 0;
      setPlaying(true);
      const speakNext = () => {
        if (stopRef.current) return;
        if (idx >= turns.length) { setPlaying(false); setPlayed(true); return; }
        const t = turns[idx++];
        const u = new SpeechSynthesisUtterance(t.text);
        u.lang = "en-CA"; u.rate = rate;
        if (t.sp && map[t.sp]) u.voice = map[t.sp];
        if (t.sp && speakers.length > 1 && voices.length < speakers.length) {
          u.pitch = 1 + ((speakers.indexOf(t.sp) % 3) - 1) * 0.18;
        }
        u.onend = () => { if (!stopRef.current) setTimeout(speakNext, 320); };
        u.onerror = () => setPlaying(false);
        synth.speak(u);
      };
      speakNext();
    });
  };

  const playOpenAI = async (key) => {
    setAudioBusy(true); setErr("");
    try {
      let urls = ttsSessionCache.get(quiz.script);
      if (!urls) {
        const { turns, speakers } = parseScript(quiz.script);
        const map = {};
        speakers.forEach((sp, i) => { map[sp] = OPENAI_VOICES[i % OPENAI_VOICES.length]; });
        urls = await Promise.all(turns.map((t) => ttsOpenAI(key, t.text, t.sp ? map[t.sp] : "nova")));
        ttsSessionCache.set(quiz.script, urls);
      }
      setAudioBusy(false);
      stopRef.current = false;
      setPlaying(true);
      let i = 0;
      const playNext = () => {
        if (stopRef.current || i >= urls.length) {
          setPlaying(false);
          if (!stopRef.current) setPlayed(true);
          return;
        }
        const a = new Audio(urls[i++]);
        a.playbackRate = rate;
        audioRef.current = a;
        a.onended = () => setTimeout(playNext, 260);
        a.onerror = () => setPlaying(false);
        a.play();
      };
      playNext();
    } catch (e) {
      setAudioBusy(false);
      setErr("No se pudo generar el audio real. Revisa tu API key de OpenAI en Ajustes; mientras tanto puedes usar las voces del sistema.");
    }
  };

  const play = () => {
    const { openai } = getKeys();
    if (openai) playOpenAI(openai); else playSystem();
  };
  const stop = () => {
    stopRef.current = true;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const loadCached = () => {
    const saved = cacheList(`celpip:cache:listen:${part.n}`);
    if (!saved.length) return;
    const pick = saved[Math.floor(Math.random() * saved.length)].quiz;
    setErr(""); setPlayed(false); setNotes("");
    setQuizDone(false); setShowScript(false); setExamPhase("intro");
    setCols({ a: "", b: "", c: "", favor: "", contra: "" });
    setQuiz(pick);
  };

  return (
    <div className="screen" style={{ "--acc": S.color }}>
      <TopBar title="Listening" sub={`Part ${part.n} · ${part.q} Preguntas · ${part.min} Min`} onBack={back} />
      <div className="chiprow">
        <button className="chip" data-on={mode === "sim" ? "1" : "0"} style={{ "--acc": S.color }}
          onClick={() => setMode("sim")}>Práctica simulada</button>
        <button className="chip" data-on={mode === "human" ? "1" : "0"} style={{ "--acc": S.color }}
          onClick={() => setMode("human")}>Audio humano real</button>
      </div>
      {mode === "human" && (
        <>
          <div className="chiprow" role="group" aria-label="Velocidad">
            {[1, 1.25, 1.5].map((r) => (
              <button key={r} className="chip" data-on={r === rate ? "1" : "0"} style={{ "--acc": S.color }}
                onClick={() => setRate(r)}>{r}x</button>
            ))}
          </div>
          <HumanAudio color={S.color} rate={rate} update={update} />
        </>
      )}
      {mode === "sim" && !quiz && <>
        <div className="chiprow">
          {LISTENING_PARTS.map((p) => (
            <button key={p.n} className="chip" data-on={p.n === part.n ? "1" : "0"} style={{ "--acc": S.color }}
              onClick={() => setPart(p)}>Part {p.n} · {p.name}</button>
          ))}
        </div>
        <Strategy tips={[...LISTENING_GENERAL_TIPS, ...part.tips]} color={S.color} />
        <div className="chiprow" role="group" aria-label="Velocidad">
          {[1, 1.25, 1.5].map((r) => (
            <button key={r} className="chip" data-on={r === rate ? "1" : "0"} style={{ "--acc": S.color }}
              onClick={() => setRate(r)}>{r}x</button>
          ))}
        </div>
        {busy ? <Skeletons /> : (
          <>
            <button className="btn" style={{ "--acc": S.color }} onClick={generate}>
              Generar audio <Sparkles size={16} />
            </button>
            {cacheList(`celpip:cache:listen:${part.n}`).length > 0 && (
              <button className="btn btn--ghost" onClick={loadCached}>
                Repetir una guardada · {cacheList(`celpip:cache:listen:${part.n}`).length} en tu banco · $0
              </button>
            )}
          </>
        )}
      </>}
      {mode === "sim" && err && <p className="dimtx" style={{ color: "#FF9E9E", marginTop: 12 }}>{err}</p>}
      {mode === "sim" && quiz && (
        <>
          {examPhase === "intro" && (
            <div className="exam">
              <div className="exam-top">
                <span className="exam-brand">CELPIP · Listening Part {part.n}</span>
                <span className="exam-count">{quiz.questions.length} questions</span>
              </div>
              <p className="exam-q">{quiz.title}</p>
              <p className="exam-hint">
                You will hear the audio only once. You cannot pause or replay it. You may take notes while you listen. After the audio ends, answer each question before the timer runs out — you cannot go back.
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <button className="exam-next" onClick={() => { setExamPhase("audio"); play(); }} disabled={audioBusy}>
                  {audioBusy ? "LOADING…" : "START"}
                </button>
              </div>
            </div>
          )}

          {examPhase === "audio" && (
            <div className="exam">
              <div className="exam-top">
                <span className="exam-brand">CELPIP · Listening Part {part.n}</span>
                <span className="exam-count">{audioBusy ? "Loading audio…" : playing ? "Playing…" : "Starting…"}</span>
              </div>
              <p className="exam-q">{quiz.title}</p>
              <div className="exam-bar"><i className="exam-pulse" /></div>
              <p className="exam-hint">Take notes below. The questions will appear automatically when the audio ends.</p>
            </div>
          )}

          {(examPhase === "intro" || examPhase === "audio") && (
            part.n === 5 ? (
              <div className="cols cols--3">
                {[0, 1, 2].map((i) => (
                  <div key={i}>
                    <input value={names[i]} aria-label={`Nombre persona ${i + 1}`}
                      onChange={(e) => setNames(names.map((n, j) => (j === i ? e.target.value : n)))} />
                    <textarea rows={4} placeholder="Notas" value={cols["abc"[i]]}
                      onChange={(e) => setCols({ ...cols, ["abc"[i]]: e.target.value })} />
                  </div>
                ))}
              </div>
            ) : part.n === 6 ? (
              <div className="cols cols--2">
                <div><span className="kicker">A Favor</span>
                  <textarea rows={4} placeholder="Quiénes y por qué" value={cols.favor}
                    onChange={(e) => setCols({ ...cols, favor: e.target.value })} /></div>
                <div><span className="kicker">En Contra</span>
                  <textarea rows={4} placeholder="Quiénes y por qué" value={cols.contra}
                    onChange={(e) => setCols({ ...cols, contra: e.target.value })} /></div>
              </div>
            ) : (
              <textarea rows={3} placeholder="Notas: who · what · when · where"
                value={notes} onChange={(e) => setNotes(e.target.value)} />
            )
          )}

          {examPhase === "questions" && (
            <ExamRunner quiz={quiz} part={part} color={S.color}
              onDone={(s, t) => update((st) => completeTodayStep({
                ...st, history: [...st.history, { date: todayKey(), section: "Listening", detail: `Part ${part.n}: ${s}/${t}` }],
              }, (g) => g.tab === "train" && g.skill === "listening"))}
              onNewPractice={() => setQuiz(null)} />
          )}
        </>
      )}
    </div>
  );
}

function WritingScreen({ back, preset, update }) {
  const S = SKILLS.writing;
  const [task, setTask] = useState(WRITING_TASKS.find((t) => preset && t.id === preset.task) || WRITING_TASKS[0]);
  const [prompt, setPrompt] = useState("");
  const [text, setText] = useState("");
  const [showTpl, setShowTpl] = useState(false);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const words = countWords(text);
  const inRange = words >= 150 && words <= 200;

  const newPrompt = async () => {
    setBusy(true); setErr(""); setResult(null);
    try {
      const r = await askClaude("Eres examinador del CELPIP General.",
        `Escribe UNA consigna realista para la tarea "${task.name}" del CELPIP (${task.brief}). Solo la consigna en inglés, 60-90 palabras, sin encabezados.`);
      setPrompt(r.trim());
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const evaluate = async () => {
    setBusy(true); setErr("");
    try {
      const r = await askClaudeJSON(
        "Eres examinador certificado del CELPIP General. Evalúas Writing con la rúbrica oficial: Content/Coherence, Vocabulary, Readability, Task Fulfillment. Exigente y realista.",
        `Consigna: ${prompt || "(evalúa como " + task.name + ")"}
Respuesta del candidato (${words} palabras):
"""${text}"""
Devuelve JSON: {"level":"9-10","criteria":[{"name":"Content / Coherence","score":9,"comment":"en español, 2 frases"},{"name":"Vocabulary","score":8,"comment":"..."},{"name":"Readability","score":9,"comment":"..."},{"name":"Task Fulfillment","score":9,"comment":"..."}],"fixes":["error concreto → corrección"],"upgrades":["palabra simple → sofisticada"]}
Máximo 4 fixes y 4 upgrades. Comentarios en español, ejemplos en inglés.`
      );
      setResult(r);
      update((s) => completeTodayStep({
        ...s,
        history: [...s.history, { date: todayKey(), section: "Writing", detail: `${task.name}: nivel ${r.level}` }],
        errors: [...(s.errors || []), ...((r.fixes || []).map((f) => ({ date: todayKey(), section: "Writing", text: f })))],
      }, (g) => g.tab === "train" && g.skill === "writing"));
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  if (result) return (
    <div style={{ "--acc": S.color }}>
      <TopBar title="Resultado" sub={task.name} onBack={() => setResult(null)} />
      <ScorePanel result={result} color={S.color} />
      <button className="btn btn--ghost" onClick={() => { setResult(null); setText(""); setPrompt(""); }}>Nueva práctica</button>
    </div>
  );

  return (
    <div className="screen" style={{ "--acc": S.color }}>
      <TopBar title="Writing" sub={`${task.name} · ${task.min} Min · 150–200 Palabras`} onBack={back}
        right={<MiniTimer total={task.min * 60} color={S.color} />} />
      <div className="chiprow">
        {WRITING_TASKS.map((t) => (
          <button key={t.id} className="chip" data-on={t.id === task.id ? "1" : "0"} style={{ "--acc": S.color }}
            onClick={() => { setTask(t); setPrompt(""); }}>{t.name} · {t.min} min</button>
        ))}
      </div>

      <Strategy tips={task.tips} color={S.color} />

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span className="kicker">Consigna</span>
          <button className="btn btn--ghost btn--sm" onClick={newPrompt} disabled={busy}>
            {busy && !prompt ? "Generando…" : "Nueva"}
          </button>
        </div>
        {prompt
          ? <p style={{ marginTop: 8, fontSize: 14, lineHeight: 23 }}>{prompt}</p>
          : <p className="dimtx" style={{ marginTop: 8 }}>Genera una consigna para practicar en condiciones reales.</p>}
      </div>

      <button className="btn btn--ghost btn--sm" style={{ marginTop: 12 }} onClick={() => setShowTpl(!showTpl)}>
        {showTpl ? "Ocultar templates" : "Ver templates del cuaderno"}
      </button>
      {showTpl && task.templates.map((id) => (
        <div key={id} className="paper">
          <strong>{TEMPLATES[id].title}</strong>{"\n"}{TEMPLATES[id].body}
        </div>
      ))}

      <textarea rows={11} value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Escribe tu respuesta en inglés…" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, gap: 10 }}>
        <span className={inRange ? "pill pill--acc" : "pill"} style={{ "--acc": S.color }}>{words} palabras</span>
        <span className="dimtx" style={{ textAlign: "right" }}>
          {words === 0 ? "" : words < 150 ? "Agrega una frase de cortesía o un ejemplo" : words > 200 ? "Corta adjetivos innecesarios" : "En rango"}
        </span>
      </div>
      <button className="btn" style={{ "--acc": S.color }} onClick={evaluate} disabled={busy || words < 30}>
        {busy && text ? "Evaluando…" : "Evaluar con rúbrica CELPIP"}
      </button>
      {err && <p className="dimtx" style={{ color: "#FF9E9E", marginTop: 12 }}>{err}</p>}
    </div>
  );
}

function SpeakingScreen({ back, preset, update }) {
  const S = SKILLS.speaking;
  const [task, setTask] = useState(SPEAKING_TASKS.find((t) => preset && t.n === preset.task) || SPEAKING_TASKS[0]);
  const [phase, setPhase] = useState("setup"); // setup | prep | talk | review
  const [prompt, setPrompt] = useState("");
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const recRef = useRef(null);
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const pick = (t) => { setTask(t); setPhase("setup"); setPrompt(""); setTranscript(""); setResult(null); };

  const start = async () => {
    setBusy(true); setErr(""); setResult(null); setTranscript("");
    try {
      const r = await askClaude("Eres examinador del CELPIP General, sección Speaking.",
        `Escribe UNA consigna realista para Speaking Task ${task.n}: ${task.name}. Solo la consigna en inglés, 40-70 palabras, como en el examen.`);
      setPrompt(r.trim()); setPhase("prep");
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  const startDictation = () => {
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-CA"; rec.continuous = true; rec.interimResults = false;
    rec.onresult = (e) => {
      let add = "";
      for (let i = e.resultIndex; i < e.results.length; i++) add += e.results[i][0].transcript + " ";
      setTranscript((t) => t + add);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec; rec.start(); setListening(true);
  };
  const stopDictation = () => { recRef.current && recRef.current.stop(); setListening(false); };

  const evaluate = async () => {
    setBusy(true); setErr("");
    try {
      const r = await askClaudeJSON(
        "Eres examinador certificado del CELPIP General, sección Speaking. Rúbrica oficial: Content/Coherence, Vocabulary, Listenability, Task Fulfillment. Se evalúa fluidez, no perfección.",
        `Task ${task.n}: ${task.name} (${task.talk} segundos, tiempo ${task.tense}).
Consigna: ${prompt || "(genérica)"}
Transcripción:
"""${transcript}"""
Devuelve JSON: {"level":"9-10","criteria":[{"name":"Content / Coherence","score":9,"comment":"en español, 2 frases"},{"name":"Vocabulary","score":8,"comment":"..."},{"name":"Listenability","score":9,"comment":"..."},{"name":"Task Fulfillment","score":9,"comment":"..."}],"fixes":["error concreto → corrección"],"upgrades":["frase simple → frase de alto nivel"]}
Máximo 4 fixes y 4 upgrades. Comentarios en español. Verifica el tiempo verbal (${task.tense}).`
      );
      setResult(r);
      update((s) => completeTodayStep({
        ...s,
        history: [...s.history, { date: todayKey(), section: "Speaking", detail: `Task ${task.n}: nivel ${r.level}` }],
        errors: [...(s.errors || []), ...((r.fixes || []).map((f) => ({ date: todayKey(), section: "Speaking", text: f })))],
      }, (g) => g.tab === "train" && g.skill === "speaking"));
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  if (result) return (
    <div style={{ "--acc": S.color }}>
      <TopBar title="Resultado" sub={`Task ${task.n} · ${task.name}`} onBack={() => setResult(null)} />
      <ScorePanel result={result} color={S.color} />
      <button className="btn btn--ghost" onClick={() => pick(task)}>Repetir task</button>
    </div>
  );

  return (
    <div className="screen" style={{ "--acc": S.color }}>
      <TopBar title="Speaking" sub={`Task ${task.n} · Prep ${task.prep}s · Habla ${task.talk}s`} onBack={back} />

      {phase === "setup" && <>
        <div className="chiprow">
          {SPEAKING_TASKS.map((t) => (
            <button key={t.n} className="chip" data-on={t.n === task.n ? "1" : "0"} style={{ "--acc": S.color }}
              onClick={() => pick(t)}>{t.n}</button>
          ))}
        </div>
        <div className="card">
          <span className="kicker">{task.name} · Tiempo {task.tense}</span>
        </div>
        <div className="paper">{TEMPLATES[task.tpl].body}</div>
        <Strategy tips={[...SPEAKING_GENERAL_TIPS, ...task.tips]} color={S.color} />
        <button className="btn" style={{ "--acc": S.color }} onClick={start} disabled={busy}>
          {busy ? "Generando consigna…" : "Empezar task"} <Play size={16} />
        </button>
        {err && <p className="dimtx" style={{ color: "#FF9E9E", marginTop: 12 }}>{err}</p>}
      </>}

      {(phase === "prep" || phase === "talk") && (
        <>
          <div className="card"><span className="kicker">Consigna</span>
            <p style={{ marginTop: 8, fontSize: 14, lineHeight: 23 }}>{prompt}</p>
          </div>
          {phase === "prep" && <>
            <BigTimer total={task.prep} color={S.color} label="Preparación" autoStart onDone={() => setPhase("talk")} />
            <button className="btn btn--ghost" onClick={() => setPhase("talk")}>Saltar preparación</button>
          </>}
          {phase === "talk" && <>
            <BigTimer total={task.talk} color={S.color} label="Hablando" autoStart
              onDone={() => { stopDictation(); setPhase("review"); }} />
            {SR
              ? <button className="btn" style={{ "--acc": listening ? "#FF9E9E" : S.color }}
                  onClick={listening ? stopDictation : startDictation}>
                  <Mic size={16} /> {listening ? "Escuchando… toca para detener" : "Dictar mientras hablas"}
                </button>
              : <p className="dimtx" style={{ marginTop: 14 }}>Este navegador no transcribe voz: al terminar, escribe lo que dijiste.</p>}
          </>}
        </>
      )}

      {phase === "review" && <>
        <div className="card"><span className="kicker">Consigna</span>
          <p style={{ marginTop: 8, fontSize: 14, lineHeight: 23 }}>{prompt}</p>
        </div>
        <textarea rows={7} value={transcript} onChange={(e) => setTranscript(e.target.value)}
          placeholder="Transcripción de tu respuesta…" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <span className="pill">{countWords(transcript)} palabras</span>
          <button className="btn btn--ghost btn--sm" onClick={() => setPhase("talk")}>Repetir</button>
        </div>
        <button className="btn" style={{ "--acc": S.color }} onClick={evaluate}
          disabled={busy || countWords(transcript) < 20}>
          {busy ? "Evaluando…" : "Evaluar respuesta"}
        </button>
        {err && <p className="dimtx" style={{ color: "#FF9E9E", marginTop: 12 }}>{err}</p>}
      </>}
    </div>
  );
}

/* ---------------------- Conectores ---------------------- */

function MatchGame({ items, color, onResult, onNewRound }) {
  const [left] = useState(() => shuffle(items));
  const [right] = useState(() => shuffle([...items]));
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState({});
  const [bad, setBad] = useState(null);
  const [misses, setMisses] = useState(0);
  const finished = Object.keys(done).length === items.length;

  const tapRight = (id) => {
    if (done[id] || !sel) return;
    if (id === sel) {
      setDone((d) => ({ ...d, [id]: true })); onResult(id, true); setSel(null);
    } else {
      onResult(sel, false); setMisses((m) => m + 1);
      setBad(id); setTimeout(() => setBad(null), 420); setSel(null);
    }
  };

  if (finished) return (
    <div className="card center" style={{ padding: 24 }}>
      <span className="disp" style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, color }}>
        {misses === 0 ? "Perfecto" : `${misses} ${misses === 1 ? "fallo" : "fallos"}`}
      </span>
      <span className="dimtx">los que fallaste volverán más seguido</span>
      <button className="btn" style={{ "--acc": color }} onClick={onNewRound}>Otra ronda</button>
    </div>
  );

  return (
    <>
      <p className="dimtx" style={{ marginTop: 12 }}>Toca el conector en inglés y luego su pareja en español.</p>
      <div className="mgrid">
        <div className="mcol">
          {left.map((c) => (
            <button key={c.id} className="mbtn" data-sel={sel === c.id ? "1" : "0"} data-done={done[c.id] ? "1" : "0"}
              style={{ "--acc": color }} disabled={!!done[c.id]} onClick={() => setSel(c.id)}>{c.en}</button>
          ))}
        </div>
        <div className="mcol">
          {right.map((c) => (
            <button key={c.id} className="mbtn" data-done={done[c.id] ? "1" : "0"} data-bad={bad === c.id ? "1" : "0"}
              disabled={!!done[c.id]} onClick={() => tapRight(c.id)}>{c.es}</button>
          ))}
        </div>
      </div>
    </>
  );
}

function ClozeGame({ items, color, onResult, onNewRound }) {
  const makeOpts = (it) => {
    const others = shuffle(CONNECTORS.filter((c) => c.g !== it.g && c.id !== it.id)).slice(0, 2);
    return shuffle([it, ...others]);
  };
  const [i, setI] = useState(0);
  const [opts, setOpts] = useState(() => makeOpts(items[0]));
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const item = items[i];

  const pick = (c) => {
    if (picked) return;
    const ok = c.id === item.id;
    setPicked(c.id); onResult(item.id, ok);
    if (ok) setScore((s) => s + 1);
  };
  const next = () => {
    if (i + 1 === items.length) { setFinished(true); return; }
    setI(i + 1); setPicked(null); setOpts(makeOpts(items[i + 1]));
  };

  if (finished) return (
    <div className="card center" style={{ padding: 24 }}>
      <span className="disp" style={{ fontSize: 40, lineHeight: 1.1, fontWeight: 700, color }}>{score}/{items.length}</span>
      <span className="dimtx">frases correctas</span>
      <button className="btn" style={{ "--acc": color }} onClick={onNewRound}>Otra ronda</button>
    </div>
  );

  const parts = item.cz.split("___");
  return (
    <>
      <p className="dimtx" style={{ marginTop: 12 }}>Frase {i + 1} de {items.length} · elige el conector que encaja.</p>
      <div className="card">
        <p style={{ fontSize: 15, lineHeight: 26 }}>
          {parts[0]}<span className="hlmark" style={{ "--acc": color }}>______</span>{parts[1]}
        </p>
      </div>
      {opts.map((c) => {
        let st = "";
        if (picked) { if (c.id === item.id) st = "ok"; else if (picked === c.id) st = "bad"; }
        return (
          <button key={c.id} className="opt" data-state={st} disabled={!!picked} onClick={() => pick(c)}>
            <span>{c.en}</span>
          </button>
        );
      })}
      {picked && <>
        <p className="dimtx" style={{ marginTop: 10 }}>{item.en} = {item.es.toLowerCase()}</p>
        <button className="btn" style={{ "--acc": color }} onClick={next}>
          {i + 1 === items.length ? "Ver resultado" : "Siguiente"}
        </button>
      </>}
    </>
  );
}

function ConnectorsTrainer({ state, update }) {
  const color = "#FFD666";
  const stats = state.connectors || {};
  const [mode, setMode] = useState("match");
  const [roundKey, setRoundKey] = useState(0);
  const [round, setRound] = useState(() => weightedPick(CONNECTORS, state.connectors || {}, 5));

  const record = (id, ok) => update((s) => {
    const cs = { ...(s.connectors || {}) };
    const cur = cs[id] || { h: 0, m: 0 };
    cs[id] = ok ? { ...cur, h: cur.h + 1 } : { ...cur, m: cur.m + 1 };
    return { ...s, connectors: cs };
  });
  const newRound = () => { setRound(weightedPick(CONNECTORS, stats, 5)); setRoundKey((k) => k + 1); };
  const isMastered = (c) => { const s = stats[c.id]; return s && s.h - s.m >= 3; };
  const mastered = CONNECTORS.filter(isMastered).length;

  return (
    <>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="kicker">Dominados</span>
          <span className="pill pill--acc" style={{ "--acc": color }}>{mastered}/{CONNECTORS.length}</span>
        </div>
        <div className="meter" style={{ "--acc": color }}><i style={{ width: `${(mastered / CONNECTORS.length) * 100}%` }} /></div>
      </div>
      <div className="chiprow">
        <button className="chip" data-on={mode === "match" ? "1" : "0"} style={{ "--acc": color }}
          onClick={() => { setMode("match"); newRound(); }}>Parejas</button>
        <button className="chip" data-on={mode === "cloze" ? "1" : "0"} style={{ "--acc": color }}
          onClick={() => { setMode("cloze"); newRound(); }}>En contexto</button>
        <button className="chip" data-on={mode === "list" ? "1" : "0"} style={{ "--acc": color }}
          onClick={() => setMode("list")}>Lista</button>
      </div>

      {mode === "match" && <MatchGame key={roundKey} items={round} color={color} onResult={record} onNewRound={newRound} />}
      {mode === "cloze" && <ClozeGame key={roundKey} items={round} color={color} onResult={record} onNewRound={newRound} />}
      {mode === "list" && CONN_GROUPS.map((g) => (
        <div key={g}>
          <p className="kicker" style={{ marginTop: 18 }}>{g}</p>
          <div className="card" style={{ paddingTop: 4, paddingBottom: 4, marginTop: 8 }}>
            {CONNECTORS.filter((c) => c.g === g).map((c) => (
              <div className="errrow" key={c.id}>
                <span style={{ flex: 1 }}><strong>{c.en}</strong><br /><span className="dimtx">{c.es.toLowerCase()}</span></span>
                <span className="dot" data-on={isMastered(c) ? "1" : "0"} style={{ "--acc": color, cursor: "default" }}><Check size={15} /></span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ---------------------- Repaso: 3·2·1 y banco de errores ---------------------- */

function RitualCard({ id, tpl, data, update, color }) {
  const st = data || { read: 0, spoken: 0, written: null };
  const [open, setOpen] = useState(false);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState("");
  const [recording, setRecording] = useState(false);
  const [heard, setHeard] = useState("");
  const [spokenScore, setSpokenScore] = useState(null);
  const recRef = useRef(null);
  const isSpeaking = tpl.group === "Speaking";
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const set = (patch) => update((s) => ({ ...s, ritual: { ...s.ritual, [id]: { ...st, ...patch } } }));
  const complete = st.read >= 3 && st.spoken >= 2 && st.written != null;

  const matchWords = (text) => {
    const key = [...new Set(tpl.body.toLowerCase().match(/[a-z']{5,}/g) || [])];
    const mine = new Set(text.toLowerCase().match(/[a-z']{5,}/g) || []);
    return Math.round((key.filter((w) => mine.has(w)).length / Math.max(key.length, 1)) * 100);
  };

  const startSpeaking = () => {
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-CA"; rec.continuous = true; rec.interimResults = false;
    let full = "";
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) full += e.results[i][0].transcript + " ";
      setHeard(full);
    };
    rec.onerror = () => setRecording(false);
    rec.onend = () => setRecording(false);
    recRef.current = rec; rec.start();
    setHeard(""); setSpokenScore(null); setRecording(true);
  };
  const stopSpeaking = () => {
    recRef.current && recRef.current.stop();
    setRecording(false);
    const score = matchWords(heard);
    setSpokenScore(score);
    if (score >= 40) set({ spoken: Math.min(2, st.spoken + 1) });
  };

  return (
    <div className="card" style={{ "--acc": color }}>
      <button style={{ display: "flex", width: "100%", gap: 12, alignItems: "center", background: "none", border: "none", color: "var(--text)", cursor: "pointer", font: "inherit", textAlign: "left", padding: 0 }}
        onClick={() => setOpen(!open)}>
        <span className="dot" data-on={complete ? "1" : "0"} style={{ cursor: "default" }}><Check size={15} /></span>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{tpl.title}</span>
        <span className="pill">{st.read}·{st.spoken}·{st.written != null ? 1 : 0}</span>
        {open ? <ChevronUp size={16} color="var(--dim)" /> : <ChevronDown size={16} color="var(--dim)" />}
      </button>

      {open && <>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button className="btn btn--ghost btn--sm" style={{ flex: 1 }} onClick={() => set({ read: Math.min(3, st.read + 1) })}>
            Leer {st.read}/3
          </button>
          {isSpeaking && SR ? (
            <button className="btn btn--sm" style={{ flex: 1, "--acc": recording ? "#FF9E9E" : color }}
              onClick={recording ? stopSpeaking : startSpeaking}>
              {recording ? <><Square size={14} /> Grabando…</> : <><Mic size={14} /> Decirlo {st.spoken}/2</>}
            </button>
          ) : (
            <button className="btn btn--ghost btn--sm" style={{ flex: 1 }} onClick={() => set({ spoken: Math.min(2, st.spoken + 1) })}>
              Voz alta {st.spoken}/2
            </button>
          )}
          <button className="btn btn--ghost btn--sm" style={{ flex: 1 }} onClick={() => { setWriting(!writing); setDraft(""); }}>
            {writing ? "Cancelar" : "Escribir 1"}
          </button>
        </div>
        {isSpeaking && spokenScore != null && (
          <p style={{ marginTop: 10, fontSize: 13.5 }}>
            <span className="hlmark" style={{ "--acc": spokenScore >= 40 ? "#7FE0B2" : "#FF9E9E" }}>
              {spokenScore >= 40 ? `Dijiste el ${spokenScore}% del template` : `Solo captó el ${spokenScore}% — repítelo mirando el template`}
            </span>
          </p>
        )}
        {isSpeaking && !SR && (
          <p className="dimtx" style={{ marginTop: 10 }}>Tu navegador no soporta reconocimiento de voz — usa Chrome de escritorio para practicar con micrófono aquí.</p>
        )}
        {writing ? <>
          <p className="dimtx" style={{ marginTop: 10 }}>Template oculto: escríbelo de memoria.</p>
          <textarea rows={7} value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button className="btn btn--sm" style={{ "--acc": color, marginTop: 10 }}
            onClick={() => { set({ written: matchWords(draft) }); setWriting(false); }}>
            Comparar con el original
          </button>
        </> : <>
          {st.written != null && (
            <p style={{ marginTop: 10, fontSize: 13.5 }}>
              <span className="hlmark" style={{ "--acc": st.written >= 70 ? "#7FE0B2" : "#FFD666" }}>
                Recordaste el {st.written}% de las palabras clave
              </span>
            </p>
          )}
          <div className="paper">{tpl.body}</div>
        </>}
      </>}
    </div>
  );
}

function ReviewScreen({ state, update, preset }) {
  const [view, setView] = useState((preset && preset.view) || "ritual");
  const ids = Object.keys(TEMPLATES);
  const isRitualDone = (id) => { const r = state.ritual[id]; return r && r.read >= 3 && r.spoken >= 2 && r.written != null; };
  const done = ids.filter(isRitualDone).length;
  const groups = preset && preset.group ? [preset.group] : ["Writing", "Speaking"];

  // Auto-completar los pasos "3·2·1" del plan de hoy cuando ya se hicieron
  // suficientes templates (2 de Writing o 1 de Speaking, según el paso).
  useEffect(() => {
    const writingDone = ids.filter((id) => TEMPLATES[id].group === "Writing" && isRitualDone(id)).length;
    const speakingDone = ids.filter((id) => TEMPLATES[id].group === "Speaking" && isRitualDone(id)).length;
    if (writingDone >= 2) update((s) => completeTodayStep(s, (g) => g.tab === "review" && g.preset && g.preset.group === "Writing"));
    if (speakingDone >= 1) update((s) => completeTodayStep(s, (g) => g.tab === "review" && g.preset && g.preset.group === "Speaking"));
  }, [state.ritual]);

  return (
    <div className="screen">
      <div className="kicker">Repaso</div>
      <h1 className="disp h1">Memoria y errores</h1>
      <div className="chiprow">
        <button className="chip" data-on={view === "ritual" ? "1" : "0"} style={{ "--acc": "#EDF1F8" }}
          onClick={() => setView("ritual")}>3·2·1 · {done}/{ids.length}</button>
        <button className="chip" data-on={view === "conn" ? "1" : "0"} style={{ "--acc": "#EDF1F8" }}
          onClick={() => setView("conn")}>Conectores</button>
        <button className="chip" data-on={view === "errors" ? "1" : "0"} style={{ "--acc": "#EDF1F8" }}
          onClick={() => setView("errors")}>Errores · {(state.errors || []).length}</button>
      </div>

      {view === "conn" && <ConnectorsTrainer state={state} update={update} />}

      {view === "ritual" && <>
        <p className="dimtx" style={{ marginTop: 12 }}>Leer 3 veces · repetir en voz alta 2 veces · escribirlo 1 vez de memoria.</p>
        {groups.map((g) => (
          <div key={g}>
            <p className="kicker" style={{ marginTop: 18 }}>{g}</p>
            {ids.filter((id) => TEMPLATES[id].group === g).map((id) => (
              <RitualCard key={id} id={id} tpl={TEMPLATES[id]} data={state.ritual[id]} update={update}
                color={g === "Writing" ? SKILLS.writing.color : g === "Speaking" ? SKILLS.speaking.color : "#EDF1F8"} />
            ))}
          </div>
        ))}
      </>}

      {view === "errors" && (
        <div className="card" style={{ paddingTop: 4, paddingBottom: 4 }}>
          {(state.errors || []).length === 0
            ? <p className="dimtx" style={{ padding: "12px 0" }}>Cada evaluación de writing y speaking guarda aquí sus correcciones. Marca ✓ cuando ya no cometas el error.</p>
            : state.errors.slice().reverse().map((e, k) => {
                const idx = state.errors.length - 1 - k;
                return (
                  <div className="errrow" key={k}>
                    <span style={{ flex: 1 }}>{e.text}<br /><span className="pill" style={{ marginTop: 4, display: "inline-block" }}>{e.section} · {e.date}</span></span>
                    <button className="dot" aria-label="Dominado"
                      onClick={() => update((s) => ({ ...s, errors: s.errors.filter((_, j) => j !== idx) }))}>
                      <Check size={15} color="var(--dim)" />
                    </button>
                  </div>
                );
              })}
        </div>
      )}
    </div>
  );
}

/* ---------------------- Progreso ---------------------- */

function ProgressScreen({ state }) {
  const counts = {};
  state.history.forEach((h) => { counts[h.section] = (counts[h.section] || 0) + 1; });
  return (
    <div className="screen">
      <div className="kicker">Progreso</div>
      <h1 className="disp h1">Tu recorrido</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <div className="card center" style={{ margin: 0, padding: 18 }}>
          <Flame size={20} color="#FFD666" />
          <span className="disp" style={{ fontSize: 30, lineHeight: 1.1, fontWeight: 700, marginTop: 4 }}>{state.streak}</span>
          <span className="dimtx">días de racha</span>
        </div>
        <div className="card center" style={{ margin: 0, padding: 18 }}>
          <Ring size={62} stroke={6} progress={state.day / 17} color="#EDF1F8">
            <span className="disp" style={{ fontSize: 15, fontWeight: 700 }}>{state.day}</span>
          </Ring>
          <span className="dimtx" style={{ marginTop: 4 }}>de 17 días del ciclo</span>
        </div>
      </div>
      <div className="card">
        <span className="kicker">Prácticas Por Habilidad</span>
        {Object.entries(SKILLS).map(([id, s]) => (
          <div key={id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{s.label}</span>
            <span className="pill" style={{ background: s.color, color: "#0D1320" }}>{counts[s.label] || 0}</span>
          </div>
        ))}
      </div>
      <div className="card" style={{ paddingTop: 4, paddingBottom: 4 }}>
        {state.history.length === 0
          ? <p className="dimtx" style={{ padding: "12px 0" }}>Aquí queda cada práctica con su resultado.</p>
          : state.history.slice(-15).reverse().map((h, k) => (
              <div className="errrow" key={k}>
                <span style={{ flex: 1 }}>{h.detail}</span>
                <span className="pill">{h.section}</span>
              </div>
            ))}
      </div>
    </div>
  );
}

/* ---------------------- App ---------------------- */

function VoicePicker({ color }) {
  const [voices, setVoices] = useState([]);
  useEffect(() => { withVoices(() => setVoices(bestEnglishVoices())); }, []);
  const speak = (v) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance("Hi! I wanted to check if this voice sounds natural enough for your listening practice.");
    u.voice = v; u.lang = v.lang || "en-CA";
    window.speechSynthesis.speak(u);
  };
  return (
    <div className="card">
      <span className="kicker">Voces Del Sistema Detectadas · Gratis</span>
      {voices.length === 0 ? (
        <p className="dimtx" style={{ marginTop: 8 }}>
          No se detectaron voces en inglés en este navegador. Prueba con Chrome (trae voces "Google" gratis) o Edge de escritorio (voces neuronales), o descarga una voz Enhanced/Premium en Ajustes del Sistema → Accesibilidad.
        </p>
      ) : voices.slice(0, 6).map((v, i) => (
        <div className="errrow" key={v.name} style={{ alignItems: "center" }}>
          <span style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ fontSize: 13.5 }}>{v.name}</strong><br /><span className="dimtx">{v.lang}</span>
          </span>
          {i === 0 && <span className="pill pill--acc" style={{ "--acc": color, marginRight: 8 }}>Se usará esta</span>}
          <button className="iconbtn" style={{ width: 38, height: 38, borderRadius: 11 }}
            aria-label={`Probar voz ${v.name}`} onClick={() => speak(v)}>
            <Volume2 size={16} />
          </button>
        </div>
      ))}
      <p className="dimtx" style={{ marginTop: 10 }}>
        La app elige automáticamente la mejor voz en inglés disponible (prioriza nombres "Natural/Neural/Premium/Enhanced" o "Google/Microsoft"). Sin API key de OpenAI, esta es la que se usa en Listening.
      </p>
    </div>
  );
}

function SettingsScreen({ back }) {
  const [keys, setK] = useState(getKeys());
  const [saved, setSaved] = useState(false);
  const save = () => { saveKeys(keys); setSaved(true); setTimeout(() => setSaved(false), 1600); };
  return (
    <div className="screen">
      <TopBar title="Ajustes" sub="API Keys" onBack={back} />
      <div className="card" style={{ "--acc": "#7FE0B2" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="kicker">Google Gemini · Genera Y Evalúa</span>
          <span className="pill pill--acc">Gratis</span>
        </div>
        <input type="password" autoComplete="off" placeholder="AIza…" value={keys.gemini || ""}
          onChange={(e) => setK({ ...keys, gemini: e.target.value.trim() })} />
        <p className="dimtx" style={{ marginTop: 8 }}>
          Créala en aistudio.google.com/apikey con tu cuenta de Google: sin tarjeta y sin facturación. El plan gratuito da 250 solicitudes al día, de sobra para tu sesión diaria.
        </p>
      </div>
      <div className="card">
        <span className="kicker">Anthropic · Alternativa De Pago</span>
        <input type="password" autoComplete="off" placeholder="sk-ant-…" value={keys.anthropic || ""}
          onChange={(e) => setK({ ...keys, anthropic: e.target.value.trim() })} />
        <p className="dimtx" style={{ marginTop: 8 }}>
          Se crea en console.anthropic.com y requiere crédito (~$5). Mejor calidad de evaluación y sin tope diario. Si configuras ambas keys, la app usa esta.
        </p>
      </div>
      <div className="card">
        <span className="kicker">OpenAI · Audio Real De Listening</span>
        <input type="password" autoComplete="off" placeholder="sk-…" value={keys.openai || ""}
          onChange={(e) => setK({ ...keys, openai: e.target.value.trim() })} />
        <p className="dimtx" style={{ marginTop: 8 }}>
          Opcional y de pago (~2 centavos por audio). Sin ella, la app usa las voces del sistema: en Chrome de escritorio son voces "Google" gratis, y en Microsoft Edge son voces neuronales gratis.
        </p>
      </div>
      <VoicePicker color="#FF9E9E" />
      <button className="btn" onClick={save}>{saved ? "Guardado" : "Guardar"}</button>
      <p className="dimtx" style={{ marginTop: 12 }}>
        Las keys se guardan únicamente en este navegador. Nunca las escribas en el código ni las subas al repositorio.
      </p>
    </div>
  );
}

const NAV = [
  { id: "home", label: "Inicio", icon: Home },
  { id: "train", label: "Entrenar", icon: LayoutGrid },
  { id: "review", label: "Repaso", icon: RotateCcw },
  { id: "progress", label: "Progreso", icon: TrendingUp },
];

export default function CelpipTrainer() {
  const [tab, setTab] = useState("home");
  const [skill, setSkill] = useState(null);
  const [preset, setPreset] = useState(null);
  const [state, update, loaded] = usePersistentState();

  const launch = (t, sk = null, p = null) => {
    setTab(t); setSkill(sk); setPreset(p);
    window.scrollTo(0, 0);
  };

  const screens = { reading: ReadingScreen, listening: ListeningScreen, writing: WritingScreen, speaking: SpeakingScreen };
  const SkillScreen = skill ? screens[skill] : null;

  return (
    <div className="app">
      <style>{CSS}</style>
      <div className="frame">
        {!loaded ? <p className="dimtx">Cargando tu progreso…</p> : <>
          {tab === "home" && <HomeScreen state={state} update={update} launch={launch} />}
          {tab === "train" && !skill && <TrainGrid open={(id) => launch("train", id)} />}
          {tab === "train" && SkillScreen && (
            <SkillScreen key={skill + JSON.stringify(preset)} back={() => launch("train")} preset={preset} update={update} />
          )}
          {tab === "review" && <ReviewScreen key={JSON.stringify(preset)} state={state} update={update} preset={preset} />}
          {tab === "progress" && <ProgressScreen state={state} />}
          {tab === "settings" && <SettingsScreen back={() => launch("home")} />}
        </>}
      </div>
      <nav className="navbar" aria-label="Navegación principal">
        <div className="navin">
          {NAV.map((n) => {
            const Ic = n.icon;
            return (
              <button key={n.id} className="navit" data-on={tab === n.id ? "1" : "0"} onClick={() => launch(n.id)}>
                <Ic size={20} />
                {n.label}
                <span className="navdot" />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
