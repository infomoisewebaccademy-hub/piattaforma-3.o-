
import React, { useState, useEffect, useRef } from 'react';
import { Course, UserProfile, PlatformSettings, LandingPageConfig, PreLaunchConfig } from '../types';
import { Plus, Edit2, Trash2, Search, DollarSign, BookOpen, Clock, Eye, Lock, Unlock, Loader, Settings, Image, LayoutTemplate, Activity, HelpCircle, Terminal, AlignLeft, AlignCenter, MoveHorizontal, Sparkles, Wand2, X, MessageCircle, Megaphone, Target, ListOrdered, Book, Pin, Type, ExternalLink, Rocket, Calendar, Palette, Download, Facebook, Instagram, Linkedin, Youtube, Move, Quote, MoveVertical, AlignVerticalJustifyCenter, Maximize, Check, Columns, ArrowRightLeft, BrainCircuit, GitMerge, UserCheck, XCircle, Video, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { GoogleGenAI } from "@google/genai";

// Fix: Added missing usp_section and cta_section to satisfy LandingPageConfig interface
const DEFAULT_LANDING_CONFIG: LandingPageConfig = {
  announcement_bar: {
    text: '🚀 Novità: Accedi subito ai corsi e inizia a creare progetti reali.',
    is_visible: true,
    is_sticky: false,
    type: 'static',
    bg_color: '#fbbf24',
    text_color: '#1e3a8a'
  },
  hero: {
    title: "Crea Siti Web Professionali o Piattaforme con l'AI in Poche Ore",
    subtitle: 'Senza Scrivere Una Riga di Codice.',
    text: "MWA vi insegna le stesse competenze che usiamo ogni giorno...\n\nImpara a costruire siti web, e-commerce e CRM personalizzati usando l'intelligenza artificiale. Trasforma la tua idea in un business online o offri servizi da €1.000+ ai tuoi clienti.",
    benefits: [
        "Accesso a vita ai contenuti",
        "Assistenza 7 giorni su 7",
        "Nessuna esperienza richiesta",
        "Accesso alla community",
        "Supporto PERSONALE diretto su whatsapp",
        "Soddisfatto o rimborsato in 30 giorni"
    ],
    cta_primary: 'Scopri i corsi disponibili',
    cta_secondary: '', 
    image_url: '', 
    show_badges: true
  },
  ai_era_section: {
      title: 'La Nuova Era del Web',
      subtitle: "Benvenuto Nell'Era dell'Intelligenza Artificiale",
      text: "Fino a ieri, creare un sito web significava: imparare a programmare per anni, spendere migliaia di euro per agenzie, o accontentarsi di template limitati.\n\nOggi tutto è cambiato.\nL'intelligenza artificiale ha reso la creazione web accessibile a chiunque. In poche ore puoi ottenere risultati che prima richiedevano settimane di lavoro e competenze avanzate.\n\nIl risultato?\n• Imprenditori che diventano autonomi e risparmiano migliaia di euro\n• Persone comuni che si creano un'entrata extra da €1.000-5.000 al mese\n• Idee che diventano realtà senza barriere tecniche\n\nE tu? Sei pronto a far parte di questa rivoluzione?",
      is_visible: true
  },
  about_section: {
    title: 'Chi Siamo',
    subtitle: 'Perché nasce Moise Web Academy',
    text: "Moise Web Academy nasce per rendere semplice ciò che sembra complesso.\nIn un mondo in cui creare siti e piattaforme digitali è sempre più fondamentale, vogliamo dimostrare che non serve essere programmatori per costruire progetti professionali.\nCon un metodo pratico e guidato, ti mostriamo come usare Google AppSheet e gli strumenti Google per dare vita alle tue idee, anche se parti da zero.\nSiamo Moise Web Academy. Negli ultimi anni abbiamo costruito piattaforme AI, siti web dinamici e automazioni per decine di progetti reali. Ma nel mercato della formazione c'è una cosa che ci ha sempre dato fastidio:",
    mission_points: [
        "I corsi che promettono soldi veloci",
        "I “guru” che non hanno mai creato nulla",
        "Le lezioni che obbligano a comprare tool da 30–100€/mese"
    ],
    image_url: 'https://res.cloudinary.com/dhj0ztos6/video/upload/v1765452611/Home_page_rnk0zw.webm',
    quote: '"Non vi promettiamo guadagni facili, vi diamo competenze reali."',
    quote_author: 'DANIEL MOISE',
    quote_author_image: '', 
    quote_author_image_size: 48,
    quote_author_image_offset_x: 0,
    quote_author_image_offset_y: 0,
    quote_author_image_alignment: 'center',
    quote_author_image_scale: 1,
    is_visible: true
  },
  features_section: {
    title: 'Cosa imparerete con noi',
    subtitle: 'Competenze tecniche verticali, divise per obiettivi.',
    is_visible: true,
    cards: [
      { icon: 'Cpu', title: 'AI & Sviluppo Low-Code', desc: 'Google AI Studio (Zero Costi)\nDatabase Supabase\nDeploy su Vercel\nGestione Domini & DNS' },
      { icon: 'Layout', title: 'Landing Page & Siti Web', desc: 'Elementor (versione base)\nStruttura & Copy\nTemplate pronti all\'uso\nOttimizzazione Mobile' },
      { icon: 'Zap', title: 'Automazioni a Costo Zero', desc: 'Notifiche intelligenti\nEmail automatiche\nWebhook Make/N8N\nAPI Integration' },
      { icon: 'Target', title: 'Pubblicità & Ads', desc: 'Meta Ads (FB/IG)\nTikTok Ads\nStrategie E-commerce\nLead Generation' }
    ]
  },
  how_it_works_section: {
      title: 'Come Funziona Moise Web Academy',
      subtitle: 'Tre semplici passi per diventare un Web Creator professionista',
      is_visible: true,
      steps: [
          { title: 'Impara', desc: "Segui i video passo-passo. Daniel ti guida dalla A alla Z, senza dare nulla per scontato.", icon: 'BookOpen' },
          { title: 'Crea', desc: "Applichi subito quello che impari. In poche ore avrai il tuo primo sito web professionale online.", icon: 'Rocket' },
          { title: 'Monetizza', desc: "Offri i tuoi servizi ad aziende locali oppure lancia i tuoi progetti digitali.", icon: 'Banknote' }
      ]
  },
  ai_showcase_section: {
      title: 'Cosa Può Creare l’Intelligenza Artificiale per Te',
      subtitle: 'Potenza Creativa Senza Limiti',
      text: "L'AI non è solo uno strumento di scrittura. Oggi puoi generare interfacce complete, backend scalabili e design mozzafiato in tempo reale.",
      is_visible: true,
      urls: []
  },
  testimonials_section: {
    title: 'Cosa Dicono i Nostri Studenti',
    subtitle: 'Testimonianze',
    is_visible: true,
    reviews: []
  },
  // Fix: Added missing usp_section to default config
  usp_section: {
    title: 'Perché siamo diversi dagli altri corsi',
    is_visible: true,
    items: [
      { title: 'TUTTO SENZA SPESE EXTRA', desc: 'Ogni corso è pensato per lavorare con AI a costo zero.' },
      { title: 'Lezioni pratiche, non teoria', desc: 'Ogni modulo contiene schermate reali e processi passo-passo.' },
      { title: 'Nessuna fuffa', desc: 'Non vi promettiamo guadagni, vi diamo competenze tecniche solide.' },
      { title: 'Prezzi onesti', desc: 'Ogni corso lo pagate singolarmente. Niente abbonamenti.' }
    ]
  },
  // Fix: Added missing cta_section to default config
  cta_section: {
    title: 'Iniziate a costruire qualcosa di reale.',
    subtitle: 'Usate l’AI a costo zero, create progetti veri e portate le vostre competenze al livello successivo.',
    button_text: 'Guarda tutti i corsi',
    is_visible: true
  },
  footer: {
      text: 'Moise Web Academy',
      copyright: 'Tutti i diritti riservati.',
      is_visible: true,
      logo_height: 40,
      social_links: { facebook: '', instagram: '', linkedin: '', youtube: '' }
  }
};

const DEFAULT_PRE_LAUNCH_CONFIG: PreLaunchConfig = {
    headline_solid: "CREA SITI E APP",
    headline_gradient: "CON L'INTELLIGENZA ARTIFICIALE",
    subheadline: "Dimentica HTML e CSS. Il futuro è qui.",
    description: "La prima accademia che ti insegna a costruire piattaforme digitali reali, e-commerce e SaaS sfruttando la potenza dell'AI.",
    offer_badge: "AI Revolution",
    offer_title: "Lista d'Attesa Prioritaria",
    offer_text: "Iscriviti per ottenere l'accesso prioritario. I posti per il lancio sono limitati.",
    cta_text: "VOGLIO IMPARARE A CREARE",
    success_title: "Sei dentro!",
    success_text: "Preparati a rivoluzionare il tuo modo di lavorare. Tieni d'occhio la mail.",
    title_color: "#ffffff",
    gradient_start: "#60a5fa",
    gradient_end: "#c084fc",
    button_color: "#2563eb",
    admin_login_badge_text: "Area Riservata",
    spots_remaining_text: "{spots} Posti Rimanenti",
    spots_soldout_text: "Posti Prioritari Esauriti",
    spots_taken_text: "{taken} / {max} Iscritti",
    soldout_cta_text: "Iscriviti comunque per ricevere l'avviso di lancio.",
    available_cta_text: "Iscriviti ora per assicurarti l'accesso prioritario.",
    form_disclaimer_text: "Nessuno spam. Solo l'avviso di lancio.",
    admin_login_text: "Area Riservata Staff",
    form_name_placeholder: "Nome e Cognome",
    form_email_placeholder: "La tua email migliore",
    submitting_button_text: "Prenotazione in corso...",
    success_priority_title: "Sei il numero #{position} in lista!",
    success_priority_subtitle: "Hai bloccato ufficialmente il tuo posto prioritario.",
    success_standard_title: "Sei in lista d'attesa standard.",
    success_standard_subtitle: "I posti promozionali sono finiti, ma ti avviseremo appena apriamo!",
    bg_color_main: '#020617',
    text_color_body: '#94a3b8',
    accent_color: '#facc15',
    error_color: '#ef4444',
    success_color: '#22c55e',
    container_bg_color: '#1e293b',
    container_border_color: '#334155',
    input_bg_color: '#020617'
};

interface AdminDashboardProps {
  courses: Course[];
  user: UserProfile;
  onDelete: (id: string) => void;
  onRefresh: () => Promise<void>;
  currentSettings: PlatformSettings;
  onUpdateSettings: (newSettings: PlatformSettings) => Promise<void>;
}

const ColorInput: React.FC<{label: string, value: string, name: string, onChange: (name: string, value: string) => void}> = ({label, value, name, onChange}) => (
    <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-600">{label}</label>
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1">
            <input type="color" value={value} onChange={e => onChange(name, e.target.value)} className="w-8 h-8 rounded border-none cursor-pointer" />
            <input type="text" value={value} onChange={e => onChange(name, e.target.value)} className="w-24 border-none p-1 text-xs font-mono" />
        </div>
    </div>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ courses, user, onDelete, onRefresh, currentSettings, onUpdateSettings }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'general' | 'landing_manual' | 'landing_ai' | 'launch' | 'community'>('courses');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isClearingChat, setIsClearingChat] = useState(false);
  
  const [localSettings, setLocalSettings] = useState<PlatformSettings>(currentSettings);
  const [landingConfig, setLandingConfig] = useState<LandingPageConfig>(() => ({ ...DEFAULT_LANDING_CONFIG, ...currentSettings.landing_page_config }));
  const [preLaunchConfig, setPreLaunchConfig] = useState<PreLaunchConfig>(currentSettings.pre_launch_config || DEFAULT_PRE_LAUNCH_CONFIG);
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setLocalSettings(currentSettings);
    if (currentSettings.landing_page_config) setLandingConfig({ ...DEFAULT_LANDING_CONFIG, ...currentSettings.landing_page_config });
    if (currentSettings.pre_launch_config) setPreLaunchConfig({ ...DEFAULT_PRE_LAUNCH_CONFIG, ...currentSettings.pre_launch_config });
  }, [currentSettings]);

  // Invia le modifiche all'iframe di anteprima
  useEffect(() => {
      if (activeTab === 'launch' && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(preLaunchConfig, '*');
      }
  }, [preLaunchConfig, activeTab]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
        const finalSettings = {
            ...localSettings,
            landing_page_config: landingConfig,
            pre_launch_config: preLaunchConfig
        };
        await onUpdateSettings(finalSettings);
        alert("Impostazioni salvate con successo!"); 
    } catch (error: any) { alert("Errore: " + error.message); } 
    finally { setIsSavingSettings(false); }
  };

  const handleReviewUpdate = (idx: number, field: string, value: string) => {
    const newReviews = [...(landingConfig.testimonials_section.reviews || [])];
    newReviews[idx] = { ...newReviews[idx], [field]: value };
    setLandingConfig({ ...landingConfig, testimonials_section: { ...landingConfig.testimonials_section, reviews: newReviews } });
  };

  const handleExportCSV = async () => {
      try {
          const { data, error } = await supabase.from('waiting_list').select('*').order('created_at', { ascending: true });
          if (error) throw error;
          if (!data || data.length === 0) { alert("Nessun iscritto da esportare."); return; }
          let csvContent = "data:text/csv;charset=utf-8,Posizione,Email,Nome,Data Iscrizione\n";
          data.forEach((row, index) => {
              const date = new Date(row.created_at).toLocaleDateString();
              csvContent += `${index + 1},${row.email},${row.full_name || 'N/A'},${date}\n`;
          });
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "mwa_lista_attesa.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } catch (err: any) { alert("Errore: " + err.message); }
  };

  const handleClearCommunityChat = async () => {
      if (!confirm("⚠️ ATTENZIONE: Questa azione eliminerà TUTTI i messaggi della community chat per sempre. Confermi?")) return;
      setIsClearingChat(true);
      try {
          const { error } = await supabase
              .from('community_messages')
              .delete()
              .neq('id', '00000000-0000-0000-0000-000000000000');
          if (error) throw error;
          alert("Chat ripulita correttamente!");
      } catch (err: any) {
          alert("Errore reset chat: " + err.message);
      } finally {
          setIsClearingChat(false);
      }
  };

  const handleAiGeneration = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const result = await ai.models.generateContent({ 
            model: "gemini-3-flash-preview",
            contents: `Modifica questo JSON CMS: ${JSON.stringify(landingConfig)}. Richiesta utente: "${aiPrompt}". Ritorna SOLO il JSON valido.`
        });
        const jsonStr = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
        setLandingConfig(JSON.parse(jsonStr));
        alert("✨ Configurazione generata!");
    } catch (error: any) { alert("Errore AI: " + error.message); } finally { setIsAiLoading(false); }
  };

  const FONT_OPTIONS = ['Inter', 'Roboto', 'Poppins', 'Montserrat', 'Lato', 'Open Sans'];

  const handlePreLaunchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPreLaunchConfig(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePreLaunchColorChange = (name: string, value: string) => {
    setPreLaunchConfig(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestione Piattaforma</h1>
                <p className="text-gray-500 mt-1">Controlla ogni aspetto della tua Academy.</p>
            </div>
            <div className="flex gap-3">
                <button onClick={() => setShowHelp(!showHelp)} className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-bold hover:bg-gray-300 transition-all flex items-center">
                    <Terminal className="h-5 w-5 mr-2" /> SQL Help
                </button>
                <button onClick={() => navigate('/admin/course/new')} className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-brand-500/30 hover:bg-brand-700 transition-all flex items-center">
                    <Plus className="h-5 w-5 mr-2" /> Nuovo Corso
                </button>
            </div>
        </div>

        {showHelp && (
            <div className="bg-slate-900 text-slate-200 p-6 rounded-xl mb-8 shadow-xl border border-slate-700 font-mono text-sm relative">
                <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X className="h-5 w-5"/></button>
                <h3 className="text-white font-bold text-lg mb-4 flex items-center"><Terminal className="mr-2 h-5 w-5"/> Comandi Database</h3>
                <div className="bg-black p-4 rounded border border-slate-700 mb-4">
                    <code className="text-green-400 select-all block mb-2">ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS landing_page_config jsonb;</code>
                    <code className="text-green-400 select-all block">ALTER TABLE public.platform_settings ADD COLUMN IF NOT EXISTS pre_launch_config jsonb;</code>
                </div>
            </div>
        )}

        {/* TABS */}
        <div className="flex border-b border-gray-200 mb-8 space-x-8 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab('courses')} className={`pb-4 font-bold text-sm border-b-2 transition-all flex items-center whitespace-nowrap ${activeTab === 'courses' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <Book className="h-4 w-4 mr-2" /> Corsi
            </button>
            <button onClick={() => setActiveTab('launch')} className={`pb-4 font-bold text-sm border-b-2 transition-all flex items-center whitespace-nowrap ${activeTab === 'launch' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <Rocket className="h-4 w-4 mr-2" /> Pre-Lancio
            </button>
            <button onClick={() => setActiveTab('community')} className={`pb-4 font-bold text-sm border-b-2 transition-all flex items-center whitespace-nowrap ${activeTab === 'community' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <Users className="h-4 w-4 mr-2" /> Community
            </button>
            <button onClick={() => setActiveTab('landing_manual')} className={`pb-4 font-bold text-sm border-b-2 transition-all flex items-center whitespace-nowrap ${activeTab === 'landing_manual' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <LayoutTemplate className="h-4 w-4 mr-2" /> Editor Home
            </button>
            <button onClick={() => setActiveTab('general')} className={`pb-4 font-bold text-sm border-b-2 transition-all flex items-center whitespace-nowrap ${activeTab === 'general' ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <Settings className="h-4 w-4 mr-2" /> Impostazioni
            </button>
            <button onClick={() => setActiveTab('landing_ai')} className={`pb-4 font-bold text-sm border-b-2 transition-all flex items-center whitespace-nowrap ${activeTab === 'landing_ai' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <Sparkles className="h-4 w-4 mr-2" /> AI Magic
            </button>
        </div>

        {/* CONTENT */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* COURSES TAB */}
            {activeTab === 'courses' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group hover:shadow-lg transition-all">
                            <div className="relative h-48">
                                <img src={course.image} className="w-full h-full object-cover" alt="" />
                                <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold">{course.level}</div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg mb-4 line-clamp-1">{course.title}</h3>
                                <div className="mt-auto flex gap-2">
                                    <button onClick={() => navigate(`/admin/course/${course.id}`)} className="flex-1 bg-brand-50 text-brand-700 py-2 rounded-lg font-bold hover:bg-brand-100 flex items-center justify-center"><Edit2 className="h-4 w-4 mr-2"/> Edit</button>
                                    <button onClick={() => onDelete(course.id)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100"><Trash2 className="h-5 w-5"/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* COMMUNITY TAB */}
            {activeTab === 'community' && (
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center"><Users className="mr-2 text-brand-600"/> Gestione Community</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                    <h4 className="font-bold text-red-800 mb-2 flex items-center"><Trash2 className="h-4 w-4 mr-2"/> Reset Messaggi</h4>
                                    <p className="text-sm text-red-600 mb-6">Questa funzione permette di svuotare completamente la chat della community per liberare spazio o ricominciare da zero.</p>
                                    <button 
                                        onClick={handleClearCommunityChat}
                                        disabled={isClearingChat}
                                        className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                                    >
                                        {isClearingChat ? <Loader className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                        Svuota Chat Ora
                                    </button>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h4 className="font-bold text-gray-700 mb-2 flex items-center"><AlertTriangle className="h-4 w-4 mr-2"/> Moderazione</h4>
                                    <p className="text-sm text-gray-500">Puoi monitorare i messaggi in tempo reale direttamente dalla pagina <button onClick={() => navigate('/community')} className="text-brand-600 font-bold hover:underline">Community Chat</button>.</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-10 border border-gray-100">
                                <Users className="h-20 w-20 text-gray-200 mb-4" />
                                <p className="text-center text-gray-400 text-sm italic">Gestisci qui la tua community di studenti.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PRE-LANCIO TAB */}
            {activeTab === 'launch' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Colonna Editor */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm max-h-[85vh] overflow-y-auto scrollbar-thin">
                        <h3 className="text-xl font-bold mb-6 flex items-center"><Rocket className="mr-2 text-red-600"/> Editor Pagina "Coming Soon"</h3>
                        
                        <div className="space-y-6">
                            {/* Sezione Attivazione */}
                            <details open className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <summary className="font-bold cursor-pointer">Attivazione & Timer</summary>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Stato Modalità Lancio</label>
                                        <button onClick={() => setLocalSettings({...localSettings, is_pre_launch: !localSettings.is_pre_launch})} className={`w-full py-3 rounded-xl font-black text-md transition-all flex items-center justify-center gap-3 ${localSettings.is_pre_launch ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-green-600 text-white shadow-lg shadow-green-900/20'}`}>
                                            {localSettings.is_pre_launch ? <><Lock className="h-5 w-5"/> PRE-LANCIO ATTIVO</> : <><Unlock className="h-5 w-5"/> SITO PUBBLICO</>}
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Data del Lancio (Countdown)</label>
                                        <input type="datetime-local" value={localSettings.pre_launch_date || ''} onChange={(e) => setLocalSettings({...localSettings, pre_launch_date: e.target.value})} className="w-full border-gray-300 rounded-lg p-2 focus:ring-red-500 focus:border-red-500 shadow-sm" />
                                    </div>
                                    <div className="pt-2">
                                        <button onClick={handleExportCSV} className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-bold hover:bg-black flex items-center justify-center gap-2 text-sm transition-all">
                                            <Download className="h-4 w-4" /> Esporta Lista d'Attesa (CSV)
                                        </button>
                                    </div>
                                </div>
                            </details>

                            {/* Sezione Stile e Colori */}
                            <details className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <summary className="font-bold cursor-pointer flex items-center gap-2"><Palette/> Stile & Colori</summary>
                                <div className="mt-4 space-y-3">
                                    <ColorInput label="Sfondo Pagina" name="bg_color_main" value={preLaunchConfig.bg_color_main} onChange={handlePreLaunchColorChange} />
                                    <hr/>
                                    <ColorInput label="Testo Principale" name="title_color" value={preLaunchConfig.title_color} onChange={handlePreLaunchColorChange} />
                                    <ColorInput label="Testo Secondario" name="text_color_body" value={preLaunchConfig.text_color_body} onChange={handlePreLaunchColorChange} />
                                    <ColorInput label="Gradiente Inizio" name="gradient_start" value={preLaunchConfig.gradient_start} onChange={handlePreLaunchColorChange} />
                                    <ColorInput label="Gradiente Fine" name="gradient_end" value={preLaunchConfig.gradient_end} onChange={handlePreLaunchColorChange} />
                                    <hr/>
                                    <ColorInput label="Bottone Principale" name="button_color" value={preLaunchConfig.button_color} onChange={handlePreLaunchColorChange} />
                                    <ColorInput label="Colore Accento" name="accent_color" value={preLaunchConfig.accent_color} onChange={handlePreLaunchColorChange} />
                                    <ColorInput label="Colore Successo" name="success_color" value={preLaunchConfig.success_color} onChange={handlePreLaunchColorChange} />
                                    <ColorInput label="Colore Errore" name="error_color" value={preLaunchConfig.error_color} onChange={handlePreLaunchColorChange} />
                                    <hr/>
                                    <ColorInput label="Sfondo Box" name="container_bg_color" value={preLaunchConfig.container_bg_color} onChange={handlePreLaunchColorChange} />
                                    <ColorInput label="Bordo Box" name="container_border_color" value={preLaunchConfig.container_border_color} onChange={handlePreLaunchColorChange} />
                                    <ColorInput label="Sfondo Input" name="input_bg_color" value={preLaunchConfig.input_bg_color} onChange={handlePreLaunchColorChange} />
                                </div>
                            </details>

                            {/* Sezione Contenuti Principali */}
                            <details className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <summary className="font-bold cursor-pointer">Contenuti Principali</summary>
                                <div className="mt-4 space-y-3">
                                    <input name="headline_solid" value={preLaunchConfig.headline_solid} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Titolo Fisso" />
                                    <input name="headline_gradient" value={preLaunchConfig.headline_gradient} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Titolo Gradiente" />
                                    <textarea name="description" rows={3} value={preLaunchConfig.description} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Descrizione"></textarea>
                                    <input name="subheadline" value={preLaunchConfig.subheadline} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Sottotitolo secondario" />
                                </div>
                            </details>

                            {/* Sezione Form Iscrizione */}
                            <details className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <summary className="font-bold cursor-pointer">Box Iscrizione</summary>
                                <div className="mt-4 space-y-3">
                                    <input name="offer_badge" value={preLaunchConfig.offer_badge} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Badge Offerta (es. AI Revolution)" />
                                    <input name="offer_title" value={preLaunchConfig.offer_title} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Titolo Box" />
                                    <textarea name="offer_text" rows={2} value={preLaunchConfig.offer_text} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Testo Offerta"></textarea>
                                    <input name="form_name_placeholder" value={preLaunchConfig.form_name_placeholder} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Placeholder Nome" />
                                    <input name="form_email_placeholder" value={preLaunchConfig.form_email_placeholder} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Placeholder Email" />
                                    <input name="cta_text" value={preLaunchConfig.cta_text} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Testo Bottone" />
                                    <input name="submitting_button_text" value={preLaunchConfig.submitting_button_text} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Testo Bottone (invio...)" />
                                    <input name="form_disclaimer_text" value={preLaunchConfig.form_disclaimer_text} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Disclaimer Sotto il Form" />
                                </div>
                            </details>
                            
                            {/* Sezione Barra Posti */}
                            <details className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <summary className="font-bold cursor-pointer">Barra Posti Rimanenti</summary>
                                <div className="mt-4 space-y-3">
                                    <p className="text-xs text-gray-500">Usa `{'{spots}'}`, `{'{taken}'}`, `{'{max}'}` come variabili.</p>
                                    <input name="spots_remaining_text" value={preLaunchConfig.spots_remaining_text} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" />
                                    <input name="spots_soldout_text" value={preLaunchConfig.spots_soldout_text} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" />
                                    <input name="spots_taken_text" value={preLaunchConfig.spots_taken_text} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" />
                                    <input name="available_cta_text" value={preLaunchConfig.available_cta_text} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" />
                                    <input name="soldout_cta_text" value={preLaunchConfig.soldout_cta_text} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" />
                                </div>
                            </details>

                            {/* Sezione Messaggi Successo */}
                            <details className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                                <summary className="font-bold cursor-pointer">Messaggi di Successo</summary>
                                <div className="mt-4 space-y-3">
                                     <p className="text-xs text-gray-500">Usa `{'({position})'}` per la posizione in lista.</p>
                                     <input name="success_title" value={preLaunchConfig.success_title} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Titolo Successo Generico" />
                                     <textarea name="success_text" rows={2} value={preLaunchConfig.success_text} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Testo Successo Generico"></textarea>
                                     <hr/>
                                     <input name="success_priority_title" value={preLaunchConfig.success_priority_title} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Titolo Successo Prioritario" />
                                     <input name="success_priority_subtitle" value={preLaunchConfig.success_priority_subtitle} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Sottotitolo Successo Prioritario" />
                                     <hr/>
                                     <input name="success_standard_title" value={preLaunchConfig.success_standard_title} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Titolo Successo Standard" />
                                     <input name="success_standard_subtitle" value={preLaunchConfig.success_standard_subtitle} onChange={handlePreLaunchChange} className="w-full border p-2 rounded text-sm" placeholder="Sottotitolo Successo Standard" />
                                </div>
                            </details>
                        </div>
                    </div>
                    
                    {/* Colonna Anteprima */}
                    <div className="relative">
                        <div className="sticky top-20">
                           <h3 className="text-lg font-bold mb-2">Anteprima Live</h3>
                           <iframe ref={iframeRef} src="/#/coming-soon?preview=true" className="w-full h-[75vh] border-4 border-gray-300 rounded-lg shadow-lg" title="Anteprima Pre-lancio"></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* GENERAL SETTINGS TAB */}
            {activeTab === 'general' && (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center"><Settings className="mr-2 text-brand-600"/> Impostazioni Globali</h3>
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Logo & Branding */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest flex items-center"><Image className="h-4 w-4 mr-2"/> Branding & Logo</h4>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2 text-gray-700">URL Logo</label>
                                    <input 
                                        type="text" 
                                        value={localSettings.logo_url || ''} 
                                        onChange={(e) => setLocalSettings({...localSettings, logo_url: e.target.value})}
                                        className="w-full border-gray-300 rounded-xl py-3 px-4 focus:ring-brand-500 focus:border-brand-500 shadow-sm font-mono text-sm"
                                        placeholder="https://.../logo.png"
                                    />
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold mb-2 text-gray-500">Anteprima</label>
                                    <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-inner flex items-center justify-center min-h-[200px] overflow-hidden">
                                        <img 
                                            src={localSettings.logo_url || 'https://res.cloudinary.com/dhj0ztos6/image/upload/v1764867375/mwa_trasparente_thl6fk.png'} 
                                            alt="Anteprima Logo" 
                                            style={{ 
                                                height: `${localSettings.logo_height}px`,
                                                transform: `translateX(${localSettings.logo_offset_x || 0}px) translateY(${localSettings.logo_offset_y || 0}px)`
                                            }}
                                            className="transition-all duration-300 max-w-[200px] object-contain"
                                            key={localSettings.logo_url} // Forza il re-render se l'URL cambia
                                            onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/dhj0ztos6/image/upload/v1764867375/mwa_trasparente_thl6fk.png'; }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Altezza (px): {localSettings.logo_height}</label>
                                        <input 
                                            type="range" 
                                            min="20" max="150" 
                                            value={localSettings.logo_height || 20} 
                                            onChange={(e) => setLocalSettings({...localSettings, logo_height: parseInt(e.target.value, 10) || 20})} 
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Spostamento X (px)</label>
                                            <input 
                                                type="number" 
                                                min="-1000" max="1000"
                                                value={localSettings.logo_offset_x || 0} 
                                                onChange={(e) => setLocalSettings({...localSettings, logo_offset_x: parseInt(e.target.value) || 0})}
                                                className="w-full border-gray-300 rounded-lg py-2 px-3 focus:ring-brand-500 focus:border-brand-500 shadow-sm font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-1">Spostamento Y (px)</label>
                                            <input 
                                                type="number" 
                                                min="-1000" max="1000"
                                                value={localSettings.logo_offset_y || 0} 
                                                onChange={(e) => setLocalSettings({...localSettings, logo_offset_y: parseInt(e.target.value) || 0})}
                                                className="w-full border-gray-300 rounded-lg py-2 px-3 focus:ring-brand-500 focus:border-brand-500 shadow-sm font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-bold mb-2">Font di Sistema</label>
                                    <select value={localSettings.font_family} onChange={(e) => setLocalSettings({...localSettings, font_family: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 focus:ring-brand-500 shadow-sm bg-white font-medium">
                                        {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Marketing & Scripts */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest flex items-center"><Activity className="h-4 w-4 mr-2"/> Marketing & Tracking</h4>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <label className="block text-sm font-bold mb-2">Meta Pixel ID</label>
                                <div className="relative">
                                    <Activity className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input type="text" value={localSettings.meta_pixel_id || ''} onChange={(e) => setLocalSettings({...localSettings, meta_pixel_id: e.target.value})} className="w-full border-gray-300 rounded-xl py-3 pl-10 pr-4 focus:ring-brand-500 shadow-sm font-mono text-sm" placeholder="Es: 123456789012345" />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 italic leading-tight">Inserisci solo l'ID numerico. Il pixel traccia automaticamente PageView, AddToCart e Purchase.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MANUAL LANDING EDITOR */}
            {activeTab === 'landing_manual' && (
                <div className="space-y-8 pb-20">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center"><Megaphone className="mr-2 text-brand-600"/> Barra Annuncio</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <input type="text" value={landingConfig.announcement_bar.text} onChange={(e) => setLandingConfig({...landingConfig, announcement_bar: {...landingConfig.announcement_bar, text: e.target.value}})} className="w-full border p-3 rounded-xl" placeholder="Testo avviso..." />
                            <div className="flex gap-4 items-center">
                                <input type="color" value={landingConfig.announcement_bar.bg_color} onChange={(e) => setLandingConfig({...landingConfig, announcement_bar: {...landingConfig.announcement_bar, bg_color: e.target.value}})} className="h-10 w-20 rounded" />
                                <label className="text-sm font-bold">Colore Sfondo</label>
                                <input type="checkbox" checked={landingConfig.announcement_bar.is_visible} onChange={(e) => setLandingConfig({...landingConfig, announcement_bar: {...landingConfig.announcement_bar, is_visible: e.target.checked}})} className="h-6 w-6 accent-brand-600" />
                                <label className="text-sm font-bold">Visibile</label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center"><Target className="mr-2 text-brand-600"/> Hero Section</h3>
                        <div className="space-y-4">
                            <input type="text" value={landingConfig.hero.title} onChange={(e) => setLandingConfig({...landingConfig, hero: {...landingConfig.hero, title: e.target.value}})} className="w-full border p-3 rounded-xl font-bold text-lg" placeholder="Titolo Principale" />
                            <input type="text" value={landingConfig.hero.subtitle} onChange={(e) => setLandingConfig({...landingConfig, hero: {...landingConfig.hero, subtitle: e.target.value}})} className="w-full border p-3 rounded-xl" placeholder="Sottotitolo" />
                            <textarea rows={4} value={landingConfig.hero.text} onChange={(e) => setLandingConfig({...landingConfig, hero: {...landingConfig.hero, text: e.target.value}})} className="w-full border p-3 rounded-xl" placeholder="Testo descrittivo"></textarea>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center"><MessageCircle className="mr-2 text-brand-600"/> Testimonianze</h3>
                        <div className="space-y-4">
                            {(landingConfig.testimonials_section.reviews || []).map((review, idx) => (
                                <div key={idx} className="flex flex-col gap-3 border p-6 rounded-2xl bg-gray-50 relative group">
                                    <button onClick={() => {
                                        const newReviews = landingConfig.testimonials_section.reviews.filter((_, i) => i !== idx);
                                        setLandingConfig({...landingConfig, testimonials_section: {...landingConfig.testimonials_section, reviews: newReviews}});
                                    }} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="h-5 w-5"/></button>
                                    <div className="flex gap-4">
                                        <input type="text" value={review.name} onChange={(e) => handleReviewUpdate(idx, 'name', e.target.value)} className="w-1/2 border p-2 rounded-lg font-bold" placeholder="Nome" />
                                        <input type="text" value={review.role} onChange={(e) => handleReviewUpdate(idx, 'role', e.target.value)} className="w-1/2 border p-2 rounded-lg" placeholder="Ruolo" />
                                    </div>
                                    <textarea rows={2} value={review.text} onChange={(e) => handleReviewUpdate(idx, 'text', e.target.value)} className="w-full border p-2 rounded-lg" placeholder="Recensione"></textarea>
                                </div>
                            ))}
                            <button onClick={() => {
                                const newReviews = [...(landingConfig.testimonials_section.reviews || []), { name: 'Nuovo Studente', role: 'Studente MWA', text: 'Esperienza fantastica!' }];
                                setLandingConfig({...landingConfig, testimonials_section: {...landingConfig.testimonials_section, reviews: newReviews}});
                            }} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:bg-gray-100 transition-all">+ Aggiungi Recensione</button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI MAGIC EDITOR */}
            {activeTab === 'landing_ai' && (
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                    <div className="relative z-10 text-center max-w-2xl mx-auto py-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/30">
                            <Sparkles className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">MWA Magic AI Editor</h2>
                        <p className="text-gray-500 mb-10 text-lg">Descrivi come vuoi che sia la tua Home Page. L'AI riscriverà testi, benefici e recensioni per te.</p>
                        
                        <div className="relative group">
                            <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 text-lg focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all shadow-inner min-h-[200px]" placeholder="Es: Voglio una landing page per un corso di cucina che promette di farti diventare chef in 10 giorni..."></textarea>
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button onClick={handleAiGeneration} disabled={isAiLoading || !aiPrompt} className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-purple-700 shadow-xl shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all transform hover:scale-105">
                                    {isAiLoading ? <Loader className="h-6 w-6 animate-spin mr-3"/> : <Wand2 className="h-6 w-6 mr-3"/>} Genera Ora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* SAVE BUTTON FLOATING */}
        <div className="fixed bottom-6 right-6 z-50 flex gap-4">
             <button onClick={handleSaveSettings} disabled={isSavingSettings} className="px-10 py-5 bg-brand-600 text-white rounded-full font-black hover:bg-brand-700 shadow-2xl shadow-brand-500/50 flex items-center text-xl transform hover:scale-110 transition-all disabled:opacity-70">
                {isSavingSettings ? <Loader className="h-6 w-6 animate-spin mr-3"/> : <Settings className="mr-3 h-6 w-6" />} Salva Tutto
            </button>
        </div>

      </div>
    </div>
  );
};
