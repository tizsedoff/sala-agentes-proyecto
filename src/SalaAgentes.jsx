import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, Users, MessageSquare, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import apsLogo from "./assets/aps-logo.png";

// ---------- Definición de agentes ----------
const FLOORS = [
  {
    id: "negocio",
    label: "Piso de Negocio",
    accent: "#f5a623",
    glow: "rgba(245,166,35,0.35)",
  },
  {
    id: "tecnico",
    label: "Piso Técnico",
    accent: "#3ecbe0",
    glow: "rgba(62,203,224,0.35)",
  },
  {
    id: "mentores",
    label: "Piso de Mentores",
    accent: "#b388ff",
    glow: "rgba(179,136,255,0.35)",
  },
];

const AGENTS = [
  // Negocio
  {
    id: "venta",
    floor: "negocio",
    name: "Marco",
    role: "Ventas",
    desk: { x: 12, y: 50 },
    avatar: "💼",
    system:
      "Sos Marco, agente de Ventas. Hablás en español argentino, directo y persuasivo, orientado a cerrar tratos y a pensar en objeciones de clientes. Das consejos prácticos de pitch, pricing y negociación. Respuestas breves y concretas, máximo 4-5 oraciones salvo que te pidan más detalle.",
  },
  {
    id: "marketing",
    floor: "negocio",
    name: "Sofía",
    role: "Marketing",
    desk: { x: 38, y: 50 },
    avatar: "📣",
    system:
      "Sos Sofía, agente de Marketing. Hablás en español argentino, creativa y enfocada en growth, contenido y posicionamiento de marca. Pensás en términos de audiencia, hooks y storytelling. Respuestas breves y con ejemplos concretos, máximo 4-5 oraciones salvo que te pidan más detalle.",
  },
  {
    id: "soporte",
    floor: "negocio",
    name: "Iris",
    role: "Soporte",
    desk: { x: 64, y: 50 },
    avatar: "🎧",
    system:
      "Sos Iris, agente de Soporte/Atención al cliente. Hablás en español argentino, calma, empática y resolutiva. Te enfocás en cómo estructurar respuestas a clientes, manejar quejas y mejorar la experiencia. Respuestas breves y prácticas, máximo 4-5 oraciones salvo que te pidan más detalle.",
  },
  {
    id: "finanzas",
    floor: "negocio",
    name: "Renzo",
    role: "Finanzas",
    desk: { x: 88, y: 50 },
    avatar: "📊",
    system:
      "Sos Renzo, agente de Finanzas. Hablás en español argentino, analítico y prudente. Ayudás a pensar precios, costos, márgenes y viabilidad de proyectos chicos/freelance. Aclarás que no sos asesor financiero certificado cuando haga falta. Respuestas breves, máximo 4-5 oraciones salvo que te pidan más detalle.",
  },
  // Técnico
  {
    id: "frontend",
    floor: "tecnico",
    name: "Vale",
    role: "Frontend",
    desk: { x: 12, y: 50 },
    avatar: "🎨",
    system:
      "Sos Vale, agente de Frontend. Hablás en español argentino, con onda y técnica. Dominás React, HTML/CSS, UX y diseño de interfaces. Das consejos prácticos y código corto cuando ayuda. Respuestas breves, máximo 4-5 oraciones salvo que te pidan más detalle o código.",
  },
  {
    id: "backend",
    floor: "tecnico",
    name: "Tomi",
    role: "Backend",
    desk: { x: 38, y: 50 },
    avatar: "🗄️",
    system:
      "Sos Tomi, agente de Backend. Hablás en español argentino, metódico y claro. Dominás APIs, bases de datos (Supabase/Postgres), arquitectura de servidores y autenticación. Das consejos prácticos y ejemplos de código cuando ayuda. Respuestas breves, máximo 4-5 oraciones salvo que te pidan más detalle.",
  },
  {
    id: "diseno",
    floor: "tecnico",
    name: "Luna",
    role: "Diseño UI/UX",
    desk: { x: 64, y: 50 },
    avatar: "✏️",
    system:
      "Sos Luna, agente de Diseño UI/UX. Hablás en español argentino, con buen ojo estético. Hablás de paletas, tipografía, jerarquía visual y experiencia de usuario. Das feedback honesto y específico. Respuestas breves, máximo 4-5 oraciones salvo que te pidan más detalle.",
  },
  {
    id: "devops",
    floor: "tecnico",
    name: "Bauti",
    role: "DevOps",
    desk: { x: 88, y: 50 },
    avatar: "🚀",
    system:
      "Sos Bauti, agente de DevOps. Hablás en español argentino, pragmático. Dominás deploys (Vercel), CI/CD, variables de entorno y debugging de builds. Das pasos concretos para resolver problemas de infraestructura. Respuestas breves, máximo 4-5 oraciones salvo que te pidan más detalle.",
  },
  // Mentores
  {
    id: "coach",
    floor: "mentores",
    name: "Helena",
    role: "Coach",
    desk: { x: 12, y: 50 },
    avatar: "🧭",
    system:
      "Sos Helena, agente Coach. Hablás en español argentino, cálida pero firme. Ayudás a pensar metas, hábitos y organización del trabajo, sin sonar genérica ni new age. Hacés preguntas puntuales cuando hace falta. Respuestas breves, máximo 4-5 oraciones salvo que te pidan más detalle.",
  },
  {
    id: "carrera",
    floor: "mentores",
    name: "Diego",
    role: "Mentor de Carrera",
    desk: { x: 38, y: 50 },
    avatar: "🎓",
    system:
      "Sos Diego, agente Mentor de Carrera. Hablás en español argentino, con experiencia real en la industria tech. Ayudás a pensar portfolio, pricing de freelance, cómo conseguir clientes y crecer como desarrollador. Respuestas breves y honestas, máximo 4-5 oraciones salvo que te pidan más detalle.",
  },
  {
    id: "critico",
    floor: "mentores",
    name: "Nora",
    role: "Crítica",
    desk: { x: 64, y: 50 },
    avatar: "🔍",
    system:
      "Sos Nora, agente Crítica. Hablás en español argentino, directa y sin vueltas. Tu trabajo es señalar puntos débiles, riesgos y huecos en ideas o proyectos, de forma constructiva pero sin endulzar. Respuestas breves, máximo 4-5 oraciones salvo que te pidan más detalle.",
  },
  {
    id: "motivador",
    floor: "mentores",
    name: "Bruno",
    role: "Motivador",
    desk: { x: 88, y: 50 },
    avatar: "🔥",
    system:
      "Sos Bruno, agente Motivador. Hablás en español argentino, con energía pero sin ser exagerado ni vacío. Ayudás a mantener el envión cuando alguien está trabado o desmotivado, con consejos accionables, no solo frases lindas. Respuestas breves, máximo 4-5 oraciones salvo que te pidan más detalle.",
  },
];

function findAgent(id) {
  return AGENTS.find((a) => a.id === id);
}

async function callAgent(messages, systemPrompt) {
  // Llama a nuestro propio backend (api/agent.js), que a su vez llama a Groq
  // (gratis) con la API key guardada en el servidor. Nunca expongas la key en el frontend.
  const response = await fetch("/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system: systemPrompt }),
  });
  if (!response.ok) {
    throw new Error("Error en la API");
  }
  const data = await response.json();
  return data.reply || "(sin respuesta)";
}

// ---------- Voz: reconocimiento (escuchar) y síntesis (hablar) ----------
function useVoice(onResult) {
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "es-AR";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
  }, [onResult]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
  };

  return { listening, voiceSupported, startListening, stopListening };
}

function speak(text, enabled) {
  return new Promise((resolve) => {
    if (!enabled || !window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel(); // corta cualquier lectura anterior
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-AR";
    utterance.rate = 1.05;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.speechSynthesis.speak(utterance);
  });
}


export default function SalaAgentes() {
  const [activeAgent, setActiveAgent] = useState(null); // chat 1:1
  const [groupMode, setGroupMode] = useState(false);
  const [chats, setChats] = useState({}); // { agentId: [ {role, content} ] }
  const [groupChat, setGroupChat] = useState([]); // [{speaker: agentId|'user', content}]
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false); // lectura en voz alta de respuestas
  const scrollRef = useRef(null);

  const handleVoiceResult = useCallback((text) => {
    setInput((prev) => (prev ? prev + " " + text : text));
  }, []);

  const { listening, voiceSupported, startListening, stopListening } =
    useVoice(handleVoiceResult);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chats, groupChat, activeAgent, groupMode, loading]);

  function toggleMic() {
    if (listening) stopListening();
    else startListening();
  }

  function openAgent(agentId) {
    setGroupMode(false);
    setActiveAgent(agentId);
    if (!chats[agentId]) {
      setChats((c) => ({ ...c, [agentId]: [] }));
    }
  }

  function closePanel() {
    setActiveAgent(null);
    setGroupMode(false);
    setInput("");
  }

  async function sendDirectMessage() {
    if (!input.trim() || !activeAgent || loading) return;
    const agent = findAgent(activeAgent);
    const userMsg = { role: "user", content: input.trim() };
    const history = chats[activeAgent] || [];
    const newHistory = [...history, userMsg];
    setChats((c) => ({ ...c, [activeAgent]: newHistory }));
    setInput("");
    setLoading(true);
    try {
      const reply = await callAgent(newHistory, agent.system);
      setChats((c) => ({
        ...c,
        [activeAgent]: [...newHistory, { role: "assistant", content: reply }],
      }));
      speak(reply, voiceEnabled);
    } catch (e) {
      setChats((c) => ({
        ...c,
        [activeAgent]: [
          ...newHistory,
          { role: "assistant", content: "Uy, se me cortó la conexión. Probá de nuevo." },
        ],
      }));
    } finally {
      setLoading(false);
    }
  }

  // Reunión grupal: el usuario tira un tema, 3 agentes random opinan en cadena
  async function sendGroupMessage() {
    if (!input.trim() || loading) return;
    const topic = input.trim();
    setGroupChat((g) => [...g, { speaker: "user", content: topic }]);
    setInput("");
    setLoading(true);

    const panel = pickPanel();
    let runningTranscript = [{ role: "user", content: `Tema de la reunión: "${topic}"` }];

    for (const agentId of panel) {
      const agent = findAgent(agentId);
      const sys =
        agent.system +
        " Estás en una reunión grupal con otros agentes IA. Vas a ver lo que dijeron los compañeros antes que vos en la conversación; podés responderles o aportar tu visión del tema, pero sin repetir lo mismo que ya se dijo. Sé breve (2-4 oraciones).";
      try {
        const reply = await callAgent(runningTranscript, sys);
        setGroupChat((g) => [...g, { speaker: agentId, content: reply }]);
        await speak(`${agent.name} dice: ${reply}`, voiceEnabled);
        runningTranscript = [
          ...runningTranscript,
          { role: "assistant", content: `${agent.name} (${agent.role}): ${reply}` },
        ];
      } catch (e) {
        setGroupChat((g) => [
          ...g,
          { speaker: agentId, content: "(no pudo conectarse)" },
        ]);
      }
    }
    setLoading(false);
  }

  function pickPanel() {
    // Elegimos 3 agentes de distintos pisos para variedad
    const byFloor = FLOORS.map((f) =>
      AGENTS.filter((a) => a.floor === f.id)
    );
    return byFloor.map((list) => list[Math.floor(Math.random() * list.length)].id);
  }

  function openGroup() {
    setActiveAgent(null);
    setGroupMode(true);
  }

  const handleSend = () => {
    if (groupMode) sendGroupMessage();
    else sendDirectMessage();
  };

  return (
    <div className="w-full h-screen bg-[#0b0d14] text-[#e8e6f0] flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-[#1f2333] shrink-0">
        <div className="flex items-center gap-3">
          <img src={apsLogo} alt="APS Developer" className="h-9 w-auto rounded-md" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#f3f1fa]">
              Sala de Agentes
            </h1>
            <p className="text-xs text-[#8b8aa0]">Tu equipo de IA, siempre despierto</p>
          </div>
        </div>
        <button
          onClick={openGroup}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1d2e] border border-[#2a2e45] hover:border-[#b388ff] hover:text-[#b388ff] transition-colors text-sm"
        >
          <Users size={16} />
          Reunión grupal
        </button>
      </header>

      <div className="flex-1 relative overflow-hidden">
        {/* Oficina isométrica */}
        <div className="absolute inset-0 overflow-auto">
          <div className="relative w-full min-h-full py-10">
            {FLOORS.map((floor) => (
              <div key={floor.id} className="relative mb-2">
                <div className="sticky top-0 z-10 px-5 py-2 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: floor.accent }}>
                  {floor.label}
                </div>
                <div className="relative h-[260px] mx-4 rounded-2xl border"
                  style={{
                    borderColor: floor.accent + "33",
                    background:
                      `radial-gradient(120% 100% at 50% 0%, ${floor.glow}, transparent 60%), linear-gradient(180deg, #11131f, #0d0f18)`,
                  }}
                >
                  {AGENTS.filter((a) => a.floor === floor.id).map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => openAgent(agent.id)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group"
                      style={{ left: `${agent.desk.x}%`, top: `${agent.desk.y}%` }}
                    >
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-2 transition-transform group-hover:scale-110 group-active:scale-95"
                        style={{
                          borderColor: floor.accent,
                          background: "#0b0d14",
                          boxShadow: `0 0 16px ${floor.glow}`,
                        }}
                      >
                        {agent.avatar}
                      </div>
                      <span className="text-[11px] font-medium text-[#e8e6f0] bg-[#0b0d14]/80 px-1.5 py-0.5 rounded">
                        {agent.name}
                      </span>
                      <span className="text-[9px] text-[#8b8aa0]">{agent.role}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de chat (1:1 o grupal) */}
        {(activeAgent || groupMode) && (
          <div className="absolute inset-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[400px] bg-[#0d0f18] border-l border-[#1f2333] flex flex-col z-20">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f2333] shrink-0">
              {groupMode ? (
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-[#b388ff]" />
                  <div>
                    <p className="text-sm font-semibold">Reunión grupal</p>
                    <p className="text-[11px] text-[#8b8aa0]">3 agentes al azar debaten tu tema</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xl">{findAgent(activeAgent)?.avatar}</span>
                  <div>
                    <p className="text-sm font-semibold">{findAgent(activeAgent)?.name}</p>
                    <p className="text-[11px] text-[#8b8aa0]">{findAgent(activeAgent)?.role}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setVoiceEnabled((v) => !v)}
                  title={voiceEnabled ? "Apagar voz" : "Activar voz"}
                  className={`p-1.5 rounded-lg hover:bg-[#1a1d2e] ${
                    voiceEnabled ? "text-[#b388ff]" : "text-[#8b8aa0]"
                  }`}
                >
                  {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button onClick={closePanel} className="p-1.5 rounded-lg hover:bg-[#1a1d2e] text-[#8b8aa0]">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {groupMode ? (
                groupChat.length === 0 ? (
                  <p className="text-sm text-[#8b8aa0] text-center mt-8">
                    Escribí un tema y convocá a la sala. Tres agentes de pisos distintos van a opinar.
                  </p>
                ) : (
                  groupChat.map((m, i) =>
                    m.speaker === "user" ? (
                      <div key={i} className="bg-[#1a1d2e] rounded-xl px-3 py-2 text-sm self-end ml-8">
                        <span className="text-[11px] text-[#8b8aa0] block mb-0.5">Vos</span>
                        {m.content}
                      </div>
                    ) : (
                      <div key={i} className="bg-[#13151f] border border-[#1f2333] rounded-xl px-3 py-2 text-sm mr-4">
                        <span className="text-[11px] font-semibold block mb-0.5" style={{ color: FLOORS.find(f=>f.id===findAgent(m.speaker).floor).accent }}>
                          {findAgent(m.speaker).avatar} {findAgent(m.speaker).name} · {findAgent(m.speaker).role}
                        </span>
                        {m.content}
                      </div>
                    )
                  )
                )
              ) : (chats[activeAgent] || []).length === 0 ? (
                <p className="text-sm text-[#8b8aa0] text-center mt-8">
                  Decile algo a {findAgent(activeAgent)?.name} para arrancar.
                </p>
              ) : (
                (chats[activeAgent] || []).map((m, i) => (
                  <div
                    key={i}
                    className={`rounded-xl px-3 py-2 text-sm max-w-[90%] ${
                      m.role === "user"
                        ? "bg-[#1a1d2e] ml-auto"
                        : "bg-[#13151f] border border-[#1f2333]"
                    }`}
                  >
                    {m.content}
                  </div>
                ))
              )}
              {loading && (
                <div className="flex items-center gap-2 text-[#8b8aa0] text-sm">
                  <Loader2 size={14} className="animate-spin" /> escribiendo...
                </div>
              )}
            </div>

            <div className="p-3 border-t border-[#1f2333] flex gap-2 shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={
                  listening
                    ? "Escuchando..."
                    : groupMode
                    ? "Tema para debatir..."
                    : "Escribí tu mensaje..."
                }
                className="flex-1 bg-[#13151f] border border-[#1f2333] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#b388ff]"
              />
              {voiceSupported && (
                <button
                  onClick={toggleMic}
                  title={listening ? "Detener grabación" : "Hablar"}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    listening
                      ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                      : "bg-[#13151f] border-[#1f2333] text-[#8b8aa0] hover:border-[#b388ff] hover:text-[#b388ff]"
                  }`}
                >
                  {listening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              )}
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-3 py-2 rounded-lg bg-[#b388ff] text-[#0b0d14] disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
