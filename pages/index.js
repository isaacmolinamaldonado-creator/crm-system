import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Edit2, Trash2, X, Plus, Save, Copy, Check } from 'lucide-react';

const initialLeads = [
  { id: 1, nombre: "Brenda Romero", telefono: "+34 612 345 678", email: "brenda@email.com", estado: "CALIENTE", capital: 986, perfil: "Agresivo", ultimoContacto: "2024-11-24", proximoSeguimiento: "2024-11-25", touchpoint: 8, canal: "WhatsApp", respuestas: 3, objecion: "", notas: "Muy interesada, preguntó por rentabilidades", fuente: "Instagram", fechaEntrada: "2024-11-15", historial: [] },
  { id: 2, nombre: "Ignacio Med", telefono: "+34 623 456 789", email: "ignacio.m@email.com", estado: "INTERESADO", capital: 1200, perfil: "Normal", ultimoContacto: "2024-11-23", proximoSeguimiento: "2024-11-26", touchpoint: 7, canal: "WhatsApp", respuestas: 2, objecion: "¿Qué rentabilidad garantizan?", notas: "Preguntó por garantías", fuente: "Meta Ads", fechaEntrada: "2024-11-18", historial: [] },
  { id: 3, nombre: "Santiago Carr", telefono: "+34 634 567 890", email: "santi.c@email.com", estado: "TIBIO", capital: 300, perfil: "Conservador", ultimoContacto: "2024-11-23", proximoSeguimiento: "2024-11-25", touchpoint: 5, canal: "Email", respuestas: 1, objecion: "Déjame pensarlo", notas: "Necesita más info sobre seguridad", fuente: "Meta Ads", fechaEntrada: "2024-11-20", historial: [] },
  { id: 4, nombre: "Victor Medina", telefono: "+34 645 678 901", email: "victor@email.com", estado: "TIBIO", capital: 1500, perfil: "Normal", ultimoContacto: "2024-11-22", proximoSeguimiento: "2024-11-24", touchpoint: 3, canal: "WhatsApp", respuestas: 0, objecion: "No entiendo de trading", notas: "Vio el video explicativo", fuente: "TikTok", fechaEntrada: "2024-11-19", historial: [] },
  { id: 5, nombre: "Lead Marco", telefono: "+34 656 789 012", email: "marco@email.com", estado: "POR_CERRAR", capital: 2000, perfil: "Normal", ultimoContacto: "2024-11-25", proximoSeguimiento: "2024-11-26", touchpoint: 12, canal: "Llamada", respuestas: 5, objecion: "", notas: "Demo agendada viernes 17:00", fuente: "Referido", fechaEntrada: "2024-11-10", historial: [] },
  { id: 6, nombre: "Lead Seba", telefono: "+34 667 890 123", email: "seba@email.com", estado: "FRIO", capital: 500, perfil: "Conservador", ultimoContacto: "2024-11-26", proximoSeguimiento: "2024-11-27", touchpoint: 1, canal: "WhatsApp", respuestas: 0, objecion: "", notas: "Recién captado", fuente: "Meta Ads", fechaEntrada: "2024-11-26", historial: [] },
  { id: 7, nombre: "Alberto Cifo", telefono: "+34 678 901 234", email: "alberto.c@email.com", estado: "FRIO", capital: 400, perfil: "Conservador", ultimoContacto: "2024-11-21", proximoSeguimiento: "2024-11-27", touchpoint: 1, canal: "WhatsApp", respuestas: 0, objecion: "", notas: "Lead nuevo de campaña", fuente: "Meta Ads", fechaEntrada: "2024-11-21", historial: [] },
  { id: 8, nombre: "Marina López", telefono: "+34 689 012 345", email: "marina.l@email.com", estado: "CALIENTE", capital: 2500, perfil: "Normal", ultimoContacto: "2024-11-24", proximoSeguimiento: "2024-11-25", touchpoint: 6, canal: "Llamada", respuestas: 4, objecion: "", notas: "Cobra el viernes, quiere empezar", fuente: "Instagram", fechaEntrada: "2024-11-12", historial: [] },
];

const initialClientes = [
  { id: 101, nombre: "David Lorenz", telefono: "+34 611 111 111", email: "david.l@email.com", capitalInicial: 3603, capitalActual: 4359, perfil: "Agresivo", fechaAlta: "2024-10-15", comisionEntrada: 500, estado: "ACTIVO", clientesReferidos: 1, dineroReferidos: 70 },
  { id: 102, nombre: "Judith B", telefono: "+34 622 222 222", email: "judith.b@email.com", capitalInicial: 1200, capitalActual: 1490, perfil: "Normal", fechaAlta: "2024-09-20", comisionEntrada: 500, estado: "ACTIVO", clientesReferidos: 0, dineroReferidos: 0 },
  { id: 103, nombre: "Close Nico", telefono: "+34 633 333 333", email: "nico@email.com", capitalInicial: 2500, capitalActual: 2780, perfil: "Agresivo", fechaAlta: "2024-11-01", comisionEntrada: 500, estado: "ACTIVO", clientesReferidos: 2, dineroReferidos: 140 },
  { id: 104, nombre: "Carlos García", telefono: "+34 644 444 444", email: "carlos.g@email.com", capitalInicial: 2000, capitalActual: 2640, perfil: "Normal", fechaAlta: "2024-05-15", comisionEntrada: 500, estado: "ACTIVO", clientesReferidos: 1, dineroReferidos: 70 },
  { id: 105, nombre: "Josep Reig", telefono: "+34 655 555 555", email: "josep.r@email.com", capitalInicial: 5000, capitalActual: 5850, perfil: "Normal", fechaAlta: "2024-06-01", comisionEntrada: 500, estado: "ACTIVO", clientesReferidos: 0, dineroReferidos: 0 },
];

const secuenciaWhatsApp = [
  { dia: 0, mensaje: "Hola [NOMBRE] 👋 Soy Isaac. Vi que te interesa lo del copy trading. Antes de mandarte info al azar, dime: ¿Dónde tienes tu dinero ahorita?" },
  { dia: 1, mensaje: "[NOMBRE], quick check. ¿Viste mi msj de ayer? Tengo hueco esta tarde para una demo rápida (10 min). ¿Te interesa o paso?" },
  { dia: 2, mensaje: "[NOMBRE] 👋 Pregunta sincera: ¿Cuánto tiempo llevas queriendo hacer algo con tu dinero pero nunca te decides? No es crítica, a mi me pasa con el gym 😅 Demo de 10 min sin compromiso. ¿Hoy o mañana?" },
  { dia: 4, mensaje: "[NOMBRE], última vez 😅 3 preguntas rápidas: 1. ¿Qué te frena exactamente? 2. ¿Es tema de confianza o dinero? 3. ¿Prefieres audio o llamada de 5 min? Porque si es confianza → te conecto con clientes. Si es dinero → desde 500€. Si no entiendes → te explico en 5 min. ¿Me ayudas?" },
  { dia: 6, mensaje: "[NOMBRE] 🔥 Ok voy a ser honesto: Llevo 5 días intentando ayudarte y siento que hablo solo jaja. Te propongo: 8 minutos por teléfono, te explico todo, si no te gusta nos despedimos bien. ¿Los tienes AHORA? Si no, dime que NO y te dejo tranquilo" },
  { dia: 10, mensaje: "[NOMBRE] 👋 Última cosa, lo juro. Te grabé un video de 90 seg explicando: - Por qué creo que es para ti - Qué pierdes cada día - Cómo empezar hoy [VIDEO LINK] 90 segundos. Menos que un TikTok. Después si no te interesa no te escribo más. ¿Trato?" },
  { dia: 15, mensaje: "[NOMBRE] 👋 2 semanas desde tu solicitud. Supongo que: a) No viste mis msj b) No era el momento c) No te convenció. Hoy tengo caso nuevo: Javier, 34 años, empezó con 800€ hace 45 días. Hoy tiene 986€. ¿La diferencia contigo? Él respondió. Si quieres ser el próximo solo escribe INFO. Si no, te dejo tranquilo ya" },
  { dia: 21, mensaje: "[NOMBRE] 21 días. 15 mensajes. 0 respuestas. Message received 📩 Te saco de mi lista oficialmente. Pero guardo tu contacto por si algún día ME escribes TÚ. Éxitos 🚀 Isaac" },
];

const secuenciaEmailCompleta = [
  { dia: 0, subject: "El email que querías borrar (no lo hagas todavía)", body: `Hola [NOMBRE],\n\nTe escribí por WhatsApp hace unas horas.\n\nProbablemente pensaste: "Otro vendedor de humo" 🙄\n\nY te entiendo.\n\nPero dame 47 segundos:\n\n→ No vendemos productos financieros\n→ No cobramos membresías\n→ No pedimos que nos transfieras dinero\n\nGanamos SOLO si tú ganas.\nComisión sobre rentabilidad.\n\nSi tu cuenta crece 0%, ganamos 0€.\n\n¿Eso cambia algo?\n\nResponde por WhatsApp o este email.\n\nIsaac` },
  { dia: 1, subject: "3 preguntas que todos tienen (respondidas)", body: `Hola [NOMBRE],\n\nOk, entiendo el silencio.\n\nCuando hablo de copy trading, todos tienen las mismas 3 preguntas:\n\n1. "¿Cómo sé que es real?"\n→ Te damos acceso demo ANTES de poner 1€\n→ Ves operaciones en tiempo real\n→ Contrato legal transparente\n\n2. "¿Cuánto necesito?"\n→ Mínimo: 500€ (menos que un iPhone)\n→ Promedio clientes: 2.000€\n→ Recomendado: 3.000€+ para mejores resultados\n\n3. "¿Y si pierdo dinero?"\n→ Nosotros tampoco ganamos nada\n→ Stop-loss automático protege capital\n→ TÚ decides cuánto arriesgar\n\n¿Tienes una 4ª pregunta?\n\nResponde este email o WhatsApp.\n\nIsaac` },
  { dia: 2, subject: "La historia del 'Algún Día' vs 'Hoy'", body: `Hola [NOMBRE],\n\nDos personas me contactaron el mismo día en marzo:\n\nJUAN:\n"Me interesa, déjame pensarlo"\n"La próxima semana te escribo"\nNunca escribió\n\nMARÍA:\n"Vamos con 1.500€"\nEmpezó el 12 marzo\nHoy tiene 1.890€ (+26%)\n\nLa diferencia no fue el dinero.\nFue la DECISIÓN.\n\nJuan sigue "pensándolo" 8 meses después.\nMaría ya sacó 300€ para vacaciones y el resto sigue creciendo.\n\n¿Cuál quieres ser?\n\nIsaac` },
  { dia: 4, subject: "[PDF] Por qué el 87% pierde dinero invirtiendo", body: `Hola [NOMBRE],\n\nNada de venta hoy.\n\nTe mando algo que hice para mi familia cuando preguntaron "cómo invertir":\n\n📄 PDF: "7 Razones Por las Que Pierdes Dinero Sin Saberlo"\n\nIncluye:\n- El mito de la "cuenta de ahorro segura"\n- Por qué fondos de pensiones son trampa\n- Inflación invisible que mata patrimonio\n- Inversiones que parecen buenas pero roban\n- Cómo protegerte sin ser experto\n\n15 minutos de lectura. Café incluido ☕\n\nY si después quieres saber cómo copy trading encaja, sabes dónde estoy.\n\nIsaac` },
  { dia: 6, subject: "Cierro tu registro [IMPORTANTE]", body: `Hola [NOMBRE],\n\nNo me gusta ser pesado, pero:\n\nLlevo una semana intentando mostrarte cómo funciona.\n\nY nada.\n\nVoy a cerrar tu registro temporalmente para:\n1. No seguir molestándote\n2. Dar ese espacio a quien SÍ quiere avanzar\n3. Mantener tu opción si cambias opinión\n\nSI QUIERES RETOMAR:\nResponde "RETOMAR" por WhatsApp o email en 24h.\n\nSI NO:\nTodo bien. Éxito con tus finanzas de corazón.\n\nIsaac` },
  { dia: 10, subject: "Me rindo 🏳", body: `Hola [NOMBRE],\n\n10 días. 6 WhatsApps. 5 emails.\n\nEs oficial: me rindo 😅\n\nClaramente esto no es para ti AHORA.\n\nY está bien. De verdad.\n\nTal vez no es el momento.\nTal vez no confías suficiente.\nTal vez no te interesa.\n\nTodo válido.\n\nPero antes de irme:\n\nMI WHATSAPP: [NÚMERO]\nMI EMAIL: [EMAIL]\n\nSi en 1 mes, 3 meses, 1 año piensas:\n"Qué pasó con ese Isaac pesado"\n\nEscríbeme.\n\nTe responderé como primer día.\nSin juicios. Sin "te lo dije".\n\nSuerte con tus inversiones.\n\nIsaac` },
];

const respuestasObjeciones = [
  { obj: "No tengo dinero", whatsapp: "Entiendo. ¿Cuánto tienes guardado? Con 500€ puedes empezar. Menos que 2 findes de fiesta 😅", email: "Lo entiendo perfectamente.\n\nPor eso el mínimo es 500€, no 5.000€.\n\nPiénsalo así: gastas eso en salir 2 fines de semana.\n\nAquí lo inviertes una vez y empieza a trabajar para ti.\n\n¿Tiene sentido?" },
  { obj: "No confío / Estafa", whatsapp: "Te entiendo 100%. Por eso no cobramos adelantado. Solo ganamos si TÚ ganas. ¿Qué estafa funciona así? 🤔", email: "La desconfianza es normal en finanzas.\n\nPor eso nuestro modelo es simple:\n\nComisión SOLO sobre rentabilidad.\n\nSi ganas 0€ → Ganamos 0€\nSi pierdes → Perdemos\n\nNuestro éxito = Tu éxito" },
  { obj: "No entiendo trading", whatsapp: "Por eso existe COPY trading. Tú copias a los que sí saben. Como un GPS: no necesitas ser mecánico para manejar 🚗", email: "Esa es precisamente la ventaja.\n\nNO necesitas saber trading.\n\nEl sistema copia automáticamente las operaciones de traders profesionales.\n\nTú solo:\n1. Activas el sistema\n2. Decides cuánto invertir\n3. El resto es automático" },
  { obj: "Déjame pensarlo", whatsapp: "Claro. Pero ayúdame: ¿Qué específicamente necesitas pensar? Porque si es [X] eso lo resolvemos ya.", email: "Perfecto, tómate tu tiempo.\n\nPero para ayudarte mejor:\n\n¿Qué parte específicamente necesitas pensar?\n\n- ¿Es confianza? → Testimonios verificables\n- ¿Es dinero? → Desde 500€\n- ¿Es comprensión? → Demo gratuita\n- ¿Es momento? → Cuánto pierdes esperando" },
  { obj: "No es buen momento", whatsapp: "¿Cuándo SÍ será buen momento? Tu dinero pierde valor CADA día que esperas. Inflación no espera.", email: "Respeto tu timing.\n\nPero déjame mostrarte algo:\n\nHoy tienes 5.000€\nCon inflación 4%:\n- En 1 año valen 4.800€\n- En 5 años valen 4.083€\n\nEl 'momento perfecto' no existe.\n\nCada mes que esperas es dinero que se evapora." },
  { obj: "Consultar con pareja", whatsapp: "Esa persona: ¿Tiene experiencia en inversiones? ¿Ha generado +15% anual? Si la respuesta es NO, básicamente vas a pedir consejo a alguien que tampoco sabe.", email: "Totalmente válido consultar con tu pareja.\n\nEs una decisión financiera importante.\n\nPero déjame hacerte una pregunta:\n\n¿Esa persona tiene experiencia exitosa en inversiones?\n\nMi sugerencia:\n\nVen JUNTOS a una demo de 10 minutos.\nQue ambos vean cómo funciona.\n\nY DESPUÉS decidan juntos con información real." },
];

const estadoColors = {
  "FRIO": { bg: "#1e3a5f", text: "#60a5fa", border: "#3b82f6", emoji: "🥶" },
  "TIBIO": { bg: "#3d2f0a", text: "#fbbf24", border: "#f59e0b", emoji: "🌡️" },
  "INTERESADO": { bg: "#1a3d2e", text: "#34d399", border: "#10b981", emoji: "👀" },
  "CALIENTE": { bg: "#3d1f1f", text: "#f87171", border: "#ef4444", emoji: "🔥" },
  "POR_CERRAR": { bg: "#2d1f3d", text: "#a78bfa", border: "#8b5cf6", emoji: "💎" },
};

const perfilesRiesgo = {
  "Conservador": { color: "#10b981" },
  "Normal": { color: "#f59e0b" },
  "Agresivo": { color: "#ef4444" }
};

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: '#e2e8f0',
  fontSize: '14px',
  width: '100%',
  boxSizing: 'border-box',
};

export default function StartGrowsCRM() {
const [leads, setLeads] = useState([]);
const [clientes, setClientes] = useState([]);
const [loading, setLoading] = useState(true);
const [filtroClientes, setFiltroClientes] = useState('ACTIVO'); // ACTIVO, INACTIVO, DESCARTADO, TODOS
const [mostrarDescartados, setMostrarDescartados] = useState(false);
const [mesSeleccionado, setMesSeleccionado] = useState('');

// 🔥 CARGAR DATOS AL INICIAR
useEffect(() => {
  loadAllData();
}, []);

const loadAllData = async () => {
  try {
    setLoading(true);
    
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (leadsError) throw leadsError;

    const { data: clientesData, error: clientesError } = await supabase
      .from('clientes')
      .select('*')
      .order('fecha_alta', { ascending: false});
    
    if (clientesError) throw clientesError;

    if (!leadsData || leadsData.length === 0) {
      console.log('No hay leads, cargando iniciales');
      for (const lead of initialLeads) {
        await saveLead(lead);
      }
      setLeads(initialLeads);
} else {
      // Filtrar leads null o inválidos ANTES de setear
      const leadsValidos = leadsData.filter(l => l && l.id && l.nombre);
      setLeads(leadsValidos);
    }

    if (!clientesData || clientesData.length === 0) {
      console.log('No hay clientes, cargando iniciales');
      for (const cliente of initialClientes) {
        await saveCliente(cliente);
      }
      setClientes(initialClientes);
} else {
      // Filtrar clientes null o inválidos
      const clientesValidos = clientesData.filter(c => c && c.id && c.nombre);
      setClientes(clientesValidos);
    }
  } catch (error) {
    console.error('Error:', error);
    setLeads(initialLeads);
    setClientes(initialClientes);
  } finally {
    setLoading(false);
  }
};

// 🔥 GUARDAR LEAD
const saveLead = async (lead) => {
  try {
    const leadData = {
      nombre: lead.nombre,
      telefono: lead.telefono,
      email: lead.email,
      estado: lead.estado,
      capital: lead.capital,
      fecha_ingreso: lead.fechaIngreso || lead.fecha_ingreso,
      perfil: lead.perfil,
      ultimo_contacto: lead.ultimoContacto,
      proximo_seguimiento: lead.proximoSeguimiento,
      touchpoint: lead.touchpoint,
      canal: lead.canal,
      respuestas: lead.respuestas,
      objecion: lead.objecion,
      notas: lead.notas,
      fuente: lead.fuente,
      fecha_entrada: lead.fechaEntrada,
      historial: lead.historial || []
    };

    if (lead.id && typeof lead.id === 'string') {
      const { error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', lead.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select();
      if (error) throw error;
      if (data && data[0]) {
        setLeads(leads.map(l => l.id === lead.id ? { ...lead, id: data[0].id } : l));
      }
    }
  } catch (error) {
    console.error('Error guardando lead:', error);
    alert('Error al guardar: ' + error.message);
  }
};

// 🔥 GUARDAR CLIENTE
const saveCliente = async (cliente) => {
  try {
const clienteData = {
  nombre: cliente.nombre,
  telefono: cliente.telefono,
  email: cliente.email,
  capital_inicial: parseFloat(cliente.capitalInicial) || 0,
  capital_actual: parseFloat(cliente.capitalActual) || 0,
  perfil: cliente.perfil,
  fecha_alta: cliente.fechaAlta || new Date().toISOString().split('T')[0],
  comision_entrada: parseFloat(cliente.comisionEntrada) || 0,
  estado: cliente.estado,
  clientes_referidos: parseInt(cliente.clientesReferidos) || 0,
  dinero_referidos: parseFloat(cliente.dineroReferidos) || 0,
  deuda: parseFloat(cliente.deuda) || 0,
  historial: cliente.historial || [],
};

    if (cliente.id && typeof cliente.id === 'string') {
      const { error } = await supabase
        .from('clientes')
        .update(clienteData)
        .eq('id', cliente.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteData])
        .select();
      if (error) throw error;
      if (data && data[0]) {
        setClientes(clientes.map(c => c.id === cliente.id ? { ...c, id: data[0].id } : c));
      }
    }
  } catch (error) {
    console.error('Error guardando cliente:', error);
    alert('Error al guardar cliente: ' + error.message);
  }
};

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showAddLead, setShowAddLead] = useState(false);
  const [showAddCliente, setShowAddCliente] = useState(false);
  const [showEditLead, setShowEditLead] = useState(false);
  const [showEditCliente, setShowEditCliente] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newNote, setNewNote] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  // GUARDAR automáticamente cuando cambian leads o clientes
  useEffect(() => {
    localStorage.setItem('startgrows_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('startgrows_clientes', JSON.stringify(clientes));
  }, [clientes]);

  const hoy = new Date().toISOString().split('T')[0];
  const ahora = new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  // Filtrar por mes si está seleccionado
// Filtrar leads nulos
const leadsValidos = leads.filter(l => l !== null && l !== undefined);

const leadsFiltrados = mesSeleccionado 
  ? leadsValidos.filter(l => {
      const fecha = l?.fechaIngreso || l?.fechaEntrada || '';
      return fecha && fecha.startsWith(mesSeleccionado);
    })
  : leadsValidos;

const clientesFiltrados = mesSeleccionado
  ? clientes.filter(c => c.fechaAlta?.startsWith(mesSeleccionado))
  : clientes;
 const totalLeads = leadsFiltrados.length;
  const leadsCalientes = leadsFiltrados.filter(l => l.estado === 'CALIENTE' || l.estado === 'POR_CERRAR').length;
  const tasaConversion = totalLeads > 0 ? ((clientesFiltrados.length / totalLeads) * 100).toFixed(1) : 0;
  const capitalPipeline = leadsFiltrados.reduce((acc, l) => acc + l.capital, 0);
  const totalComisiones = clientesFiltrados.length * 500;
  const totalReferidos = clientesFiltrados.reduce((acc, c) => acc + c.dineroReferidos, 0);
  const capitalGestionado = clientesFiltrados.reduce((acc, c) => acc + c.capitalActual, 0);
  const seguimientosHoy = leadsFiltrados.filter(l => l.proximoSeguimiento <= hoy);

  const comisionesPorMes = [
    { mes: 'Jun', cierres: 2, comisiones: 1000 },
    { mes: 'Jul', cierres: 3, comisiones: 1500 },
    { mes: 'Ago', cierres: 2, comisiones: 1000 },
    { mes: 'Sep', cierres: 3, comisiones: 1500 },
    { mes: 'Oct', cierres: 4, comisiones: 2000 },
    { mes: 'Nov', cierres: 5, comisiones: 2500 },
  ];

const pipelineData = [
  { name: 'Fríos', value: leadsValidos.filter(l => l.estado === 'FRIO').length, color: '#3b82f6' },
  { name: 'Tibios', value: leadsValidos.filter(l => l.estado === 'TIBIO').length, color: '#f59e0b' },
  { name: 'Interesados', value: leadsValidos.filter(l => l.estado === 'INTERESADO').length, color: '#10b981' },
  { name: 'Calientes', value: leadsValidos.filter(l => l.estado === 'CALIENTE').length, color: '#ef4444' },
  { name: 'Por cerrar', value: leadsValidos.filter(l => l.estado === 'POR_CERRAR').length, color: '#8b5cf6' },
];

 const updateLead = async (leadId, updates) => {
  const updatedLeads = leads.map(l => l.id === leadId ? { ...l, ...updates } : l);
  setLeads(updatedLeads);
  
  const lead = updatedLeads.find(l => l.id === leadId);
  if (lead) {
    await saveLead(lead);
  }
  
  if (selectedLead?.id === leadId) {
    setSelectedLead({ ...selectedLead, ...updates });
  }
};

  const deleteLead = async (leadId) => {
  if (window.confirm('¿Seguro que quieres eliminar este lead?')) {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      setLeads(leads.filter(l => l.id !== leadId));
      setSelectedLead(null);
    } catch (error) {
      console.error('Error eliminando lead:', error);
      alert('Error al eliminar');
    }
  }
};

const addNote = async (leadId, nota, tipo, resultado) => {
  const updatedLeads = leads.map(l => {
    if (l.id === leadId) {
      const newHistorial = [...(l.historial || []), { fecha: ahora, tipo, mensaje: nota, resultado }];
      return { ...l, historial: newHistorial, ultimoContacto: hoy };
    }
    return l;
  });
  setLeads(updatedLeads);
  
  const lead = updatedLeads.find(l => l.id === leadId);
  if (lead) {
    await saveLead(lead);
  }
  
  setSelectedLead(lead);
  setNewNote('');
};

const cerrarLead = async (lead) => {
  try {
    const nuevoCliente = {
      id: Date.now(),
      nombre: lead.nombre,
      telefono: lead.telefono,
      email: lead.email,
      capitalInicial: lead.capital,
      capitalActual: lead.capital,
      perfil: lead.perfil,
      fechaAlta: hoy,
      comisionEntrada: 500,
      estado: "ACTIVO",
      clientesReferidos: 0,
      dineroReferidos: 0,
      deuda: 0,
      notas: ''
    };

    // Guardar cliente en Supabase
    setClientes([...clientes, nuevoCliente]);
    await saveCliente(nuevoCliente);

    // Eliminar lead de Supabase
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', lead.id);

    if (error) throw error;

    setLeads(leads.filter(l => l.id !== lead.id));
    setSelectedLead(null);
    alert('🎉 ¡Cliente cerrado! Comisión: $500');
  } catch (error) {
    console.error('Error cerrando lead:', error);
    alert('Error al cerrar lead');
  }
};

 const updateCliente = async (clienteId, updates) => {
  const updatedClientes = clientes.map(c => c.id === clienteId ? { ...c, ...updates } : c);
  setClientes(updatedClientes);
  
  const cliente = updatedClientes.find(c => c.id === clienteId);
  if (cliente) {
    await saveCliente(cliente);
  }
};

  const getMensaje = (tp) => {
    const dias = [0, 1, 2, 4, 6, 10, 15, 21];
    const diaActual = dias.find(d => d >= tp) || dias[0];
    return secuenciaWhatsApp.find(s => s.dia === diaActual) || secuenciaWhatsApp[0];
  };

  const getEmail = (tp) => {
    const dias = [0, 1, 2, 4, 6, 10];
    const diaActual = dias.find(d => d >= tp) || dias[0];
    return secuenciaEmailCompleta.find(e => e.dia === diaActual) || secuenciaEmailCompleta[0];
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getCapitalDisplay = (capital) => {
    if (capital < 500) {
      return `${capital}€ (Falta ${500 - capital}€)`;
    }
    return `${capital}€`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1421 50%, #0a1628 100%)', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER */}
      <header style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.1), rgba(245,158,11,0.1))', borderBottom: '1px solid rgba(16,185,129,0.2)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #10b981, #f59e0b)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: '#0a0f1a' }}>SG</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', background: 'linear-gradient(90deg, #10b981, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>StartGrows CRM</h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Copy Trading Sales Pipeline</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.5)', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', color: '#10b981', fontWeight: '600' }}>
            ✅ Guardado automático
          </div>
          <div style={{ background: seguimientosHoy.length > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', border: `1px solid ${seguimientosHoy.length > 0 ? '#ef4444' : '#10b981'}`, borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>{seguimientosHoy.length > 0 ? '🔥' : '✅'}</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: seguimientosHoy.length > 0 ? '#ef4444' : '#10b981' }}>{seguimientosHoy.length}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>SEGUIMIENTOS HOY</div>
            </div>
          </div>
        </div>
      </header>

      {/* NAV */}
      <nav style={{ display: 'flex', gap: '4px', padding: '16px 32px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'crm', label: '🎯 CRM' },
          { id: 'clientes', label: '💥 Clientes' },
          { id: 'mensajes', label: '💬 Mensajes' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(245,158,11,0.3))' : 'transparent', color: activeTab === tab.id ? '#10b981' : '#64748b', cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === tab.id ? '600' : '400', borderBottom: activeTab === tab.id ? '2px solid #10b981' : '2px solid transparent' }}>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* MAIN */}
      <main style={{ padding: '24px 32px' }}>
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* FILTRO DE MES */}
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <select 
        value={mesSeleccionado} 
        onChange={(e) => setMesSeleccionado(e.target.value)}
        style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer' }}
      >
        <option value="">📊 Todos los períodos</option>
        <option value="2024-12">Diciembre 2024</option>
        <option value="2024-11">Noviembre 2024</option>
        <option value="2024-10">Octubre 2024</option>
        <option value="2024-09">Septiembre 2024</option>
      </select>
      {mesSeleccionado && (
        <button onClick={() => setMesSeleccionado('')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer' }}>✕ Limpiar</button>
      )}
    </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px' }}>
              {[
{ label: 'Total Leads', value: leads.filter(l => l.estado !== 'DESCARTADO').length, icon: '👤', color: '#3b82f6' },                { label: 'Calientes', value: leadsCalientes, icon: '🔥', color: '#ef4444' },
                { label: 'Conversión', value: `${tasaConversion}%`, icon: '📈', color: '#10b981' },
                { label: 'Pipeline €', value: `${capitalPipeline.toLocaleString()}€`, icon: '💰', color: '#f59e0b' },
                { label: 'Clientes', value: clientes.length, icon: '✅', color: '#8b5cf6' },
                { label: 'Comisiones', value: `$${totalComisiones}`, icon: '💎', color: '#ec4899' },
                { label: '💰 Deudas', value: `${clientes.reduce((sum, c) => sum + (c.deuda || 0), 0).toLocaleString()}€`, icon: '💸', color: '#ef4444' },
              ].map((kpi, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.05 }}>{kpi.icon}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{kpi.label}</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: kpi.color }}>{kpi.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#94a3b8' }}>📊 CRM</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pipelineData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {pipelineData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#94a3b8' }}>💰 Comisiones Mensuales ($500/cierre)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={comisionesPorMes}>
                    <defs><linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/><stop offset="100%" stopColor="#059669" stopOpacity={0.3}/></linearGradient></defs>
                    <XAxis dataKey="mes" stroke="#475569" fontSize={12} />
                    <YAxis stroke="#475569" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #10b981', borderRadius: '8px' }} formatter={(value, name, props) => [`$${value} (${props.payload.cierres} cierres)`, 'Comisiones']} />
                    <Bar dataKey="comisiones" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {seguimientosHoy.length > 0 && (
              <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(245,158,11,0.1))', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: '#ef4444' }}>🔥 SEGUIMIENTOS URGENTES HOY</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {seguimientosHoy.map(lead => (
                    <div key={lead.id} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '16px' }}>{lead.nombre}</div>
                        <div style={{ color: '#64748b', fontSize: '13px' }}>{lead.telefono} • TP{lead.touchpoint} • {getCapitalDisplay(lead.capital)} • {lead.estado}</div>
                      </div>
                      <button onClick={() => { setSelectedLead(lead); setActiveTab('crm'); }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer', fontWeight: '600' }}>📱 Atender</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CRM - VISTA KANBAN */}
        {activeTab === 'crm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <input type="text" placeholder="🔍 Buscar lead..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <button onClick={() => setShowAddLead(true)} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={18} /> Nuevo Lead</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              {['FRIO', 'TIBIO', 'INTERESADO', 'CALIENTE', 'POR_CERRAR'].map(estado => {
                const estadoLeads = leads.filter(l => l.estado === estado && l.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
                const colors = estadoColors[estado];
                return (
                  <div key={estado} style={{ background: colors.bg, borderRadius: '16px', border: `1px solid ${colors.border}30`, minHeight: '500px' }}>
                    <div style={{ background: `${colors.border}20`, padding: '16px', borderBottom: `1px solid ${colors.border}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700', color: colors.text, fontSize: '14px' }}>{colors.emoji} {estado.replace('_', ' ')}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{estadoLeads.reduce((a, l) => a + l.capital, 0).toLocaleString()}€</div>
                      </div>
                      <div style={{ background: colors.border, color: '#0a0f1a', borderRadius: '999px', padding: '4px 12px', fontSize: '14px', fontWeight: '700' }}>{estadoLeads.length}</div>
                    </div>
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
                      {estadoLeads.map(lead => (
                        <div key={lead.id} onClick={() => setSelectedLead(lead)} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '14px', cursor: 'pointer', border: selectedLead?.id === lead.id ? `2px solid ${colors.border}` : '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{lead.nombre}</div>
                            <div style={{ fontSize: '11px', background: perfilesRiesgo[lead.perfil]?.color + '30', color: perfilesRiesgo[lead.perfil]?.color, padding: '2px 8px', borderRadius: '4px' }}>{lead.perfil}</div>
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: '700', color: lead.capital < 500 ? '#f59e0b' : '#10b981', marginBottom: '8px' }}>{getCapitalDisplay(lead.capital)}</div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>📱 TP{lead.touchpoint}</span>
                            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>💬 {lead.respuestas}</span>
                            {lead.objecion && <span style={{ fontSize: '11px', background: 'rgba(239,68,68,0.2)', padding: '2px 6px', borderRadius: '4px', color: '#f87171' }}>⚠️</span>}
                          </div>
{lead && (lead.fechaIngreso || lead.fechaEntrada) && (
  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px' }}>

  </div>
)}                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PANEL DETALLE LEAD */}
            {selectedLead && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', marginTop: '24px' }}>
                <div style={{ background: `linear-gradient(90deg, ${estadoColors[selectedLead.estado]?.bg || '#1e293b'}, transparent)`, padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '24px' }}>{selectedLead.nombre}</h3>
                      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '13px' }}>{selectedLead.telefono} • {selectedLead.email}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setShowEditLead(true)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#10b981', cursor: 'pointer' }}><Edit2 size={18} /></button>
                      <button onClick={() => deleteLead(selectedLead.id)} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                      <button onClick={() => cerrarLead(selectedLead)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>✅ Cerrar ($500)</button>
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Capital</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: selectedLead.capital < 500 ? '#f59e0b' : '#10b981' }}>{getCapitalDisplay(selectedLead.capital)}</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>Perfil</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: perfilesRiesgo[selectedLead.perfil]?.color }}>{selectedLead.perfil}</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>TP / Resp</div>
                        <div style={{ fontSize: '18px', fontWeight: '700' }}>{selectedLead.touchpoint} / {selectedLead.respuestas}</div>
                      </div>
                    </div>

                    {selectedLead.objecion && (
                      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '11px', color: '#f87171', fontWeight: '600', marginBottom: '8px' }}>⚠️ OBJECIÓN: {selectedLead.objecion}</div>
                        {(() => {
                          const objecionData = respuestasObjeciones.find(r => r.obj === selectedLead.objecion);
                          return objecionData ? (
                            <>
                              <div style={{ fontSize: '13px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px', marginBottom: '8px', lineHeight: '1.4' }}>{objecionData.whatsapp}</div>
                              <button onClick={() => copyToClipboard(objecionData.whatsapp, 'objecion')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#f59e0b', color: 'white', cursor: 'pointer', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {copiedIndex === 'objecion' ? <Check size={14} /> : <Copy size={14} />} {copiedIndex === 'objecion' ? 'Copiado' : 'Copiar'}
                              </button>
                            </>
                          ) : null;
                        })()}
                      </div>
                    )}

                    {/* MENSAJE WHATSAPP */}
                    {(() => {
                      const msgData = getMensaje(selectedLead.touchpoint);
                      const mensaje = msgData.mensaje.replace(/\[NOMBRE\]/g, selectedLead.nombre);
                      return (
                        <div style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.1), rgba(16,185,129,0.1))', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                          <div style={{ fontSize: '11px', color: '#25D366', fontWeight: '700', marginBottom: '8px' }}>📱 WHATSAPP - DÍA {msgData.dia} (TP{selectedLead.touchpoint})</div>
                          <div style={{ fontSize: '13px', lineHeight: '1.4', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', fontFamily: 'monospace', marginBottom: '10px' }}>{mensaje}</div>
                          <button onClick={() => copyToClipboard(mensaje, 'whatsapp')} style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#25D366', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {copiedIndex === 'whatsapp' ? <Check size={16} /> : <Copy size={16} />} {copiedIndex === 'whatsapp' ? 'Copiado' : 'Copiar WhatsApp'}
                          </button>
                        </div>
                      );
                    })()}

                    {/* EMAIL */}
                    {(() => {
                      const emailData = getEmail(selectedLead.touchpoint);
                      const emailBody = emailData.body.replace(/\[NOMBRE\]/g, selectedLead.nombre);
                      return (
                        <div style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(96,165,250,0.1))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '10px', padding: '14px' }}>
                          <div style={{ fontSize: '11px', color: '#60a5fa', fontWeight: '700', marginBottom: '8px' }}>📧 EMAIL - DÍA {emailData.dia}</div>
                          <div style={{ fontSize: '13px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
                            <strong style={{ color: '#60a5fa' }}>Asunto:</strong> {emailData.subject}
                          </div>
                          <div style={{ fontSize: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', fontFamily: 'monospace', whiteSpace: 'pre-line', lineHeight: '1.5', maxHeight: '120px', overflowY: 'auto', marginBottom: '10px' }}>{emailBody}</div>
                          <button onClick={() => copyToClipboard(emailBody, 'email')} style={{ padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {copiedIndex === 'email' ? <Check size={16} /> : <Copy size={16} />} {copiedIndex === 'email' ? 'Copiado' : 'Copiar Email'}
                          </button>
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    {/* AÑADIR NOTA */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginBottom: '8px' }}>📝 Añadir Nota</div>
                      <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Ej: Llamé 10min, muy interesado, enviar propuesta..." style={{ ...inputStyle, height: '60px', marginBottom: '8px', fontSize: '13px' }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <select id="tipoContacto" style={{ ...inputStyle, width: 'auto', fontSize: '12px', padding: '6px 10px' }}>
                          <option>WhatsApp</option>
                          <option>Email</option>
                          <option>Llamada</option>
                        </select>
                        <select id="resultado" style={{ ...inputStyle, width: 'auto', fontSize: '12px', padding: '6px 10px' }}>
                          <option>Muy positivo</option>
                          <option>Positivo</option>
                          <option>Neutral</option>
                          <option>Negativo</option>
                        </select>
                        <button onClick={() => {
                          if (newNote.trim()) {
                            addNote(selectedLead.id, newNote, document.getElementById('tipoContacto').value, document.getElementById('resultado').value);
                          }
                        }} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Save size={16} /> Guardar</button>
                      </div>
                    </div>

                    {/* HISTORIAL */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', marginBottom: '10px' }}>📜 Historial ({selectedLead.historial?.length || 0})</div>
                      {selectedLead.historial && selectedLead.historial.length > 0 ? (
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                          {selectedLead.historial.map((h, idx) => (
                            <div key={idx} style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', marginBottom: '8px', fontSize: '12px', borderLeft: `3px solid ${h.tipo === 'WhatsApp' ? '#25D366' : h.tipo === 'Email' ? '#60a5fa' : '#f59e0b'}` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontWeight: '600', color: h.tipo === 'WhatsApp' ? '#25D366' : h.tipo === 'Email' ? '#60a5fa' : '#f59e0b' }}>{h.tipo}</span>
                                <span style={{ fontSize: '10px', color: '#64748b' }}>{h.fecha}</span>
                              </div>
                              <div style={{ color: '#e2e8f0', lineHeight: '1.4', marginBottom: '4px' }}>{h.mensaje}</div>
                              <div style={{ fontSize: '10px', color: h.resultado.includes('positivo') ? '#10b981' : h.resultado === 'Negativo' ? '#ef4444' : '#64748b' }}>→ {h.resultado}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '20px' }}>Sin interacciones registradas</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CLIENTES */}
        {activeTab === 'clientes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={() => setFiltroClientes('ACTIVO')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: filtroClientes === 'ACTIVO' ? '#10b981' : 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}>✅ Activos</button>
              <button onClick={() => setFiltroClientes('INACTIVO')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: filtroClientes === 'INACTIVO' ? '#f59e0b' : 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}>⏸️ Inactivos</button>
              <button onClick={() => setFiltroClientes('TODOS')} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: filtroClientes === 'TODOS' ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer' }}>📊 Todos</button>
              <button onClick={() => setMostrarDescartados(!mostrarDescartados)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: mostrarDescartados ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)', color: mostrarDescartados ? '#ef4444' : '#64748b', cursor: 'pointer', marginLeft: 'auto' }}>
                {mostrarDescartados ? '🗑️ Ocultar descartados' : '👁️‍🗨️ Ver descartados'}
              </button> 
              </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flex: 1 }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Capital Gestionado</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{capitalGestionado.toLocaleString()}€</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Comisiones</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>${totalComisiones}</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Clientes Activos</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#8b5cf6' }}>{clientes.length}</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(236,72,153,0.05))', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Referidos Pagados</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#ec4899' }}>{totalReferidos}€</div>
                </div>
              </div>
              <button onClick={() => setShowAddCliente(true)} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', cursor: 'pointer', fontWeight: '600', marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={18} /> Nuevo Cliente</button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>CLIENTE</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>PERFIL</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#64748b' }}>FECHA CIERRE</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#64748b' }}>CAPITAL</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#64748b' }}>COMISIÓN</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#64748b' }}>REFERIDOS</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#64748b' }}>$ REF</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#64748b' }}>💰 DEUDA</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                    {clientes
.filter(c => {
  // NUNCA mostrar descartados en la tabla principal
  if (c.estado === 'DESCARTADO') return false;
  
  // Filtrar por estado
  if (filtroClientes === 'TODOS') return true;
  return c.estado === filtroClientes;
})
.sort((a, b) => {
  const fechaA = new Date(a.fechaAlta || a.created_at || '2000-01-01');
  const fechaB = new Date(b.fechaAlta || b.created_at || '2000-01-01');
  return fechaB - fechaA; // Más recientes primero
})
                     .map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600' }}>{c.nombre}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{c.email}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ background: perfilesRiesgo[c.perfil]?.color + '20', color: perfilesRiesgo[c.perfil]?.color, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{c.perfil}</span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', fontSize: '13px' }}>{c.fechaAlta}</td>
<td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', fontWeight: '700', color: '#10b981' }}>{(c.capitalActual || 0).toLocaleString()}€</td>
<td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', fontWeight: '700', color: '#f59e0b' }}>${c.comisionEntrada || 0}</td>
<td style={{ padding: '16px', textAlign: 'right', fontWeight: '600' }}>{c.clientesReferidos || 0}</td>
<td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', fontWeight: '700', color: '#ec4899' }}>{(c.dineroReferidos || 0)}€</td>
<td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', fontWeight: '700', color: '#ef4444' }}>{(c.deuda || 0).toLocaleString()}€</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button onClick={() => { setSelectedCliente(c); setShowEditCliente(true); }} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#10b981', cursor: 'pointer' }}><Edit2 size={16} /></button>
                        <button onClick={async () => {
                          if (window.confirm(`¿Eliminar ${c.nombre}?`)) {
                            try {
                              await supabase.from('clientes').delete().eq('id', c.id);
                              setClientes(clientes.filter(cl => cl.id !== c.id));
                            } catch (error) {
                              alert('Error al eliminar');
                            }
                          }
                        }} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#ef4444', cursor: 'pointer', marginLeft: '8px' }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>

            {/* SECCIÓN LEADS DESCARTADOS */}
            {mostrarDescartados && (
              <div style={{ marginTop: '24px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid rgba(239,68,68,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: '#ef4444', fontSize: '16px', fontWeight: '600' }}>
                    🗑️ LEADS DESCARTADOS ({leads.filter(l => l.estado === 'DESCARTADO').length})
                  </h3>
                </div>
                <div style={{ padding: '16px', display: 'grid', gap: '12px' }}>
                  {leads.filter(l => l.estado === 'DESCARTADO').map(lead => (
                    <div key={lead.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '16px' }}>{lead.nombre}</div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                          {lead.telefono} • {lead.email || 'Sin email'} • {lead.capital}€
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          Descartado: {lead.fechaEntrada || 'Sin fecha'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => { setSelectedLead(lead); setShowEditLead(true); }} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#10b981', cursor: 'pointer', fontSize: '14px' }}>Ver</button>
                        <button onClick={async () => {
                          if (window.confirm(`¿Eliminar ${lead.nombre}?`)) {
                            try {
                              await supabase.from('leads').delete().eq('id', lead.id);
                              setLeads(leads.filter(l => l.id !== lead.id));
                            } catch (error) {
                              alert('Error al eliminar');
                            }
                          }
                        }} style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.2)', color: '#ef4444', cursor: 'pointer' }}>🗑️</button>
                      </div>
                    </div>
                  ))}
                  {leads.filter(l => l.estado === 'DESCARTADO').length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                      No hay leads descartados
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MENSAJES */}
        {activeTab === 'mensajes' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            {/* WHATSAPP */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg, #25D366, #128C7E)', padding: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>📱 WhatsApp (8)</h3>
              </div>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {secuenciaWhatsApp.map((msg, idx) => (
                  <div key={idx} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ background: '#25D366', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', display: 'inline-block', marginBottom: '8px' }}>DÍA {msg.dia}</div>
                    <div style={{ background: '#075E54', padding: '12px', borderRadius: '12px', borderTopLeftRadius: '0', fontSize: '13px', lineHeight: '1.5', marginBottom: '8px' }}>{msg.mensaje}</div>
                    <button onClick={() => copyToClipboard(msg.mensaje, `wa-${idx}`)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#10b981', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {copiedIndex === `wa-${idx}` ? <Check size={14} /> : <Copy size={14} />} {copiedIndex === `wa-${idx}` ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* EMAIL */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', padding: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>📧 Email (6)</h3>
              </div>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {secuenciaEmailCompleta.map((email, idx) => (
                  <div key={idx} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ background: '#3b82f6', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', display: 'inline-block', marginBottom: '8px' }}>DÍA {email.dia}</div>
                    <div style={{ background: 'rgba(59,130,246,0.2)', padding: '10px', borderRadius: '8px', marginBottom: '8px', fontSize: '13px' }}>
                      <strong>Asunto:</strong> {email.subject}
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '11px', lineHeight: '1.5', fontFamily: 'monospace', whiteSpace: 'pre-line', maxHeight: '150px', overflowY: 'auto', marginBottom: '8px' }}>{email.body}</div>
                    <button onClick={() => copyToClipboard(email.body, `email-${idx}`)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#60a5fa', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {copiedIndex === `email-${idx}` ? <Check size={14} /> : <Copy size={14} />} {copiedIndex === `email-${idx}` ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* OBJECIONES */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.3), rgba(245,158,11,0.3))', padding: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>⚡ Objeciones (6)</h3>
              </div>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {respuestasObjeciones.map((item, idx) => (
                  <div key={idx} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'inline-block', marginBottom: '10px' }}>"{item.obj}"</div>
                    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '10px', borderRadius: '8px', fontSize: '13px', lineHeight: '1.4', marginBottom: '8px' }}>{item.whatsapp}</div>
                    <button onClick={() => copyToClipboard(item.whatsapp, `obj-${idx}`)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#f59e0b', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {copiedIndex === `obj-${idx}` ? <Check size={14} /> : <Copy size={14} />} {copiedIndex === `obj-${idx}` ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {/* MODAL NUEVO LEAD */}
      {showAddLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e293b', borderRadius: '16px', width: '500px', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>➕ Nuevo Lead</h3>
              <button onClick={() => setShowAddLead(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const notaInicial = fd.get('notas') || '';
              const newLead = { 
                id: Date.now(), 
                nombre: fd.get('nombre'), 
                telefono: fd.get('telefono'), 
                email: fd.get('email') || '', 
                capital: parseInt(fd.get('capital')) || 700, 
                perfil: fd.get('perfil'), 
                estado: 'FRIO', 
                ultimoContacto: hoy, 
                proximoSeguimiento: hoy, 
                touchpoint: 0, 
                canal: 'WhatsApp', 
                respuestas: 0, 
                objecion: '', 
                notas: notaInicial, 
                fuente: fd.get('fuente'), 
                fechaEntrada: hoy, 
                fechaIngreso: hoy,
                historial: notaInicial ? [{ fecha: ahora, tipo: 'Nota inicial', mensaje: notaInicial, resultado: 'Info' }] : []
              };
              setLeads([...leads, newLead]);
              await saveLead(newLead);
              setShowAddLead(false);
            }} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input name="nombre" placeholder="Nombre *" required style={inputStyle} />
              <input name="telefono" placeholder="Teléfono *" required style={inputStyle} />
              <input name="email" type="email" placeholder="Email" style={inputStyle} />
              <input name="fechaIngreso" type="date" defaultValue={selectedLead.fechaIngreso || selectedLead.fechaEntrada} style={inputStyle} />
              <input name="capital" type="number" placeholder="Capital (€)" defaultValue="700" style={inputStyle} />
              <select name="perfil" style={inputStyle}>
                <option value="Conservador">Conservador</option>
                <option value="Normal">Normal</option>
                <option value="Agresivo">Agresivo</option>
              </select>
              <select name="fuente" style={inputStyle}>
                <option value="Meta Ads">Meta Ads</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="Referido">Referido</option>
                <option value="Otro">Otro</option>
              </select>
              <textarea name="notas" placeholder="Notas iniciales..." rows="3" style={inputStyle} />
              <button type="submit" style={{ padding: '14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}>✅ Guardar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR LEAD */}
      {showEditLead && selectedLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e293b', borderRadius: '16px', width: '500px', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>✏️ Editar Lead</h3>
              <button onClick={() => setShowEditLead(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              updateLead(selectedLead.id, { nombre: fd.get('nombre'), telefono: fd.get('telefono'), email: fd.get('email'), fechaIngreso: fd.get('fechaIngreso'), capital: parseInt(fd.get('capital')), perfil: fd.get('perfil'), estado: fd.get('estado'), objecion: fd.get('objecion'), notas: fd.get('notas') });
              setShowEditLead(false);
            }} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input name="nombre" placeholder="Nombre" defaultValue={selectedLead.nombre} required style={inputStyle} />
              <input name="telefono" placeholder="Teléfono" defaultValue={selectedLead.telefono} required style={inputStyle} />
              <input name="email" type="email" placeholder="Email" defaultValue={selectedLead.email} style={inputStyle} />
              <input name="capital" type="number" placeholder="Capital" defaultValue={selectedLead.capital} style={inputStyle} />
              <select name="perfil" defaultValue={selectedLead.perfil} style={inputStyle}>
                <option value="Conservador">Conservador</option>
                <option value="Normal">Normal</option>
                <option value="Agresivo">Agresivo</option>
              </select>
              <select name="estado" defaultValue={selectedLead.estado} style={inputStyle}>
                <option value="FRIO">Frío</option>
                <option value="TIBIO">Tibio</option>
                <option value="INTERESADO">Interesado</option>
                <option value="CALIENTE">Caliente</option>
                <option value="POR_CERRAR">Por Cerrar</option>
                <option value="DESCARTADO">🗑️ Descartado</option>
              </select>
              <select name="objecion" defaultValue={selectedLead.objecion} style={inputStyle}>
                <option value="">Sin objeción</option>
                {respuestasObjeciones.map(r => <option key={r.obj} value={r.obj}>{r.obj}</option>)}
              </select>
              <textarea name="notas" placeholder="Notas..." rows="3" defaultValue={selectedLead.notas} style={inputStyle} />
              <button type="submit" style={{ padding: '14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}>💾 Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NUEVO CLIENTE */}
      {showAddCliente && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e293b', borderRadius: '16px', width: '500px', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>➕ Nuevo Cliente</h3>
              <button onClick={() => setShowAddCliente(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const newCliente = { 
  id: Date.now(), 
  nombre: fd.get('nombre'), 
  telefono: fd.get('telefono'), 
  email: fd.get('email'),
  fechaAlta: fd.get('fechaAlta') || selectedCliente.fechaAlta, 
  capitalInicial: parseInt(fd.get('capital')), 
  capitalActual: parseInt(fd.get('capital')), 
  perfil: fd.get('perfil'), 
  comisionEntrada: 500, 
  estado: fd.get('estado'),
  clientesReferidos: parseInt(fd.get('clientesReferidos')) || 0,
  dineroReferidos: parseInt(fd.get('dineroReferidos')) || 0,
  deuda: parseInt(fd.get('deuda')) || 0,
  historial: []
};
              setClientes([...clientes, newCliente]);
              await saveCliente(newCliente);
              setShowAddCliente(false);
            }} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input name="nombre" placeholder="Nombre *" required style={inputStyle} />
              <input name="telefono" placeholder="Teléfono *" required style={inputStyle} />
              <input name="email" type="email" placeholder="Email" style={inputStyle} />
              <input name="fechaAlta" type="date" defaultValue={hoy} style={inputStyle} />
              <input name="capital" type="number" placeholder="Capital inicial (€)" defaultValue="1000" style={inputStyle} />
              <select name="perfil" style={inputStyle}>
                <option value="Conservador">Conservador</option>
                <option value="Normal">Normal</option>
                <option value="Agresivo">Agresivo</option>
              </select>
              <select name="estado" defaultValue="ACTIVO" style={inputStyle}>
                <option value="ACTIVO">✅ Activo</option>
                <option value="INACTIVO">⏸️ Inactivo</option>
                <option value="DESCARTADO">🗑️ Descartado</option>
              </select>
              <input name="clientesReferidos" type="number" placeholder="Clientes referidos" defaultValue="0" style={inputStyle} />
              <input name="dineroReferidos" type="number" placeholder="Dinero referidos (€)" defaultValue="0" style={inputStyle} />
              <button type="submit" style={{ padding: '14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}>✅ Guardar Cliente</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR CLIENTE */}
      {showEditCliente && selectedCliente && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e293b', borderRadius: '16px', width: '500px', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>✏️ Editar Cliente</h3>
              <button onClick={() => { setShowEditCliente(false); setSelectedCliente(null); }} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
 <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const nuevaNota = fd.get('nuevaNota');
              const updates = { 
                nombre: fd.get('nombre'),
                telefono: fd.get('telefono'),
                email: fd.get('email'),
                fechaAlta: fd.get('fechaAlta'),
                estado: fd.get('estado'),
                capitalActual: parseInt(fd.get('capitalActual')),
                clientesReferidos: parseInt(fd.get('clientesReferidos')),
                dineroReferidos: parseInt(fd.get('dineroReferidos')),
                deuda: parseInt(fd.get('deuda')),
                fechaAlta: fd.get('fechaAlta') || null,
              };
              
              if (nuevaNota && nuevaNota.trim()) {
                updates.historial = [
                  ...(selectedCliente.historial || []),
                  { fecha: new Date().toISOString(), accion: 'Nota', notas: nuevaNota }
                ];
              }
              
              await updateCliente(selectedCliente.id, updates);
              setShowEditCliente(false);
              setSelectedCliente(null);
            }} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>              <input name="nombre" placeholder="Nombre" defaultValue={selectedCliente.nombre} required style={inputStyle} />
              <input name="telefono" placeholder="Teléfono" defaultValue={selectedCliente.telefono} required style={inputStyle} />
              <input name="email" type="email" placeholder="Email" defaultValue={selectedCliente.email} style={inputStyle} />
              <input name="fechaAlta" type="date" defaultValue={selectedCliente.fechaAlta} style={inputStyle} />
              <input name="capitalActual" type="number" placeholder="Capital actual (€)" defaultValue={selectedCliente.capitalActual} style={inputStyle} />
              <input name="clientesReferidos" type="number" placeholder="Clientes referidos" defaultValue={selectedCliente.clientesReferidos} style={inputStyle} />
              <input name="dineroReferidos" type="number" placeholder="Dinero pagado en referidos (€)" defaultValue={selectedCliente.dineroReferidos} style={inputStyle} />
              <select name="estado" defaultValue={selectedCliente.estado || 'ACTIVO'} style={inputStyle}>
                <option value="ACTIVO">✅ Activo</option>
                <option value="INACTIVO">⏸️ Inactivo</option>
                <option value="DESCARTADO">🗑️ Descartado</option>
              </select>
              <input name="deuda" type="number" placeholder="💰 Deuda (€)" defaultValue={selectedCliente.deuda || 0} style={inputStyle} />
              <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>📋 Historial</div>
                {(selectedCliente.historial || []).map((h, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '6px', marginBottom: '8px', fontSize: '13px' }}>
                    <div style={{ color: '#64748b', fontSize: '11px' }}>{h.fecha}</div>
                    <div style={{ fontWeight: '600' }}>{h.accion}</div>
                    <div>{h.notas}</div>
                  </div>
                ))}
              </div>
              <textarea name="nuevaNota" placeholder="➕ Agregar nota" rows="2" style={inputStyle}></textarea>
              <button type="submit" style={{ padding: '14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}>💾 Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
