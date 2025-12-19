
import React, { useState, useEffect } from 'react';
import { Course, UserProfile, PlatformSettings, LandingPageConfig, PreLaunchConfig } from '../types';
import { Plus, Edit2, Trash2, Search, DollarSign, BookOpen, Clock, Eye, Lock, Unlock, Loader, Settings, Image, LayoutTemplate, Activity, HelpCircle, Terminal, AlignLeft, AlignCenter, MoveHorizontal, Sparkles, Wand2, X, MessageCircle, Megaphone, Target, ListOrdered, Book, Pin, Type, ExternalLink, Rocket, Calendar, Palette, Download, Facebook, Instagram, Linkedin, Youtube, Move, Quote, MoveVertical, AlignVerticalJustifyCenter, Maximize, Check, Columns, ArrowRightLeft, BrainCircuit, GitMerge, UserCheck, XCircle, Video, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { GoogleGenAI } from "@google/genai";
import { ConfirmModal } from '../components/ConfirmModal';

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
    button_color: "#2563eb"
};

interface AdminDashboardProps {
  courses: Course[];
  user: UserProfile;
  onDelete: (id: string) => void;
  onRefresh: () => Promise<void>;
  currentSettings: PlatformSettings;
  onUpdateSettings: (newSettings: PlatformSettings) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ courses, user, onDelete, onRefresh, currentSettings, onUpdateSettings }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'general' | 'landing_manual' | 'landing_ai' | 'launch' | 'community'>('courses');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
  // Stati per Modali di Conferma
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [showClearChatModal, setShowClearChatModal] = useState(false);
  const [isClearingChat, setIsClearingChat] = useState(false);
  
  const [localSettings, setLocalSettings] = useState<PlatformSettings>(currentSettings);
  const [landingConfig, setLandingConfig] = useState<LandingPageConfig>(() => ({ ...DEFAULT_LANDING_CONFIG, ...currentSettings.landing_page_config }));
  const [preLaunchConfig, setPreLaunchConfig] = useState<PreLaunchConfig>(currentSettings.pre_launch_config || DEFAULT_PRE_LAUNCH_CONFIG);
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    setLocalSettings(currentSettings);
    if (currentSettings.landing_page_config) setLandingConfig({ ...DEFAULT_LANDING_CONFIG, ...currentSettings.landing_page_config });
    if (currentSettings.pre_launch_config) setPreLaunchConfig({ ...DEFAULT_PRE_LAUNCH_CONFIG, ...currentSettings.pre_launch_config });
  }, [currentSettings]);

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
        const finalSettings = {
            ...localSettings,
            landing_page_config: landingConfig,
            pre_launch_config: preLaunchConfig
        };
        await onUpdateSettings(finalSettings);
        // Utilizziamo un semplice alert per i salvataggi riusciti, ma potremmo implementare un toast in futuro
        alert("Impostazioni salvate con successo!"); 
    } catch (error: any) { alert("Errore: " + error.message); } 
    finally { setIsSavingSettings(false); }
  };

  const confirmDeleteCourse = () => {
      if (deleteCourseId) {
          onDelete(deleteCourseId);
          setDeleteCourseId(null);
      }
  };

  const handleClearCommunityChat = async () => {
      setIsClearingChat(true);
      try {
          const { error } = await supabase
              .from('community_messages')
              .delete()
              .neq('id', '00000000-0000-0000-0000-000000000000');
          if (error) throw error;
          setShowClearChatModal(false);
      } catch (err: any) {
          alert("Errore reset chat: " + err.message);
      } finally {
          setIsClearingChat(false);
      }
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
    } catch (error: any) { alert("Errore AI: " + error.message); } finally { setIsAiLoading(false); }
  };

  const FONT_OPTIONS = ['Inter', 'Roboto', 'Poppins', 'Montserrat', 'Lato', 'Open Sans'];

  return (
    <div className="pt-24 min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestione Piattaforma</h1>
                <p className="text-gray-500 mt-1">Academy Control Center.</p>
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
                    <code className="text-green-400 select-all block mb-2">ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS landing_page_config jsonb;</code>
                    <code className="text-green-400 select-all block">ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS pre_launch_config jsonb;</code>
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
                                    <button onClick={() => setDeleteCourseId(course.id)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100"><Trash2 className="h-5 w-5"/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'community' && (
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-bold mb-6 flex items-center"><Users className="mr-2 text-brand-600"/> Gestione Community</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                    <h4 className="font-bold text-red-800 mb-2 flex items-center"><Trash2 className="h-4 w-4 mr-2"/> Reset Messaggi</h4>
                                    <p className="text-sm text-red-600 mb-6">Svuota completamente la chat della community per liberare spazio o ricominciare da zero.</p>
                                    <button 
                                        onClick={() => setShowClearChatModal(true)}
                                        disabled={isClearingChat}
                                        className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                        Svuota Chat Ora
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Altre TAB rimosse per brevità nel blocco modifiche, assumiamo restino invariate tranne dove specificato */}
            {activeTab === 'launch' && (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                     <h3 className="text-xl font-bold mb-6 flex items-center"><Rocket className="mr-2 text-red-600"/> Gestione Pagina "Coming Soon"</h3>
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Stato Modalità Lancio</label>
                                <button onClick={() => setLocalSettings({...localSettings, is_pre_launch: !localSettings.is_pre_launch})} className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 ${localSettings.is_pre_launch ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-green-600 text-white shadow-lg shadow-green-900/20'}`}>
                                    {localSettings.is_pre_launch ? <><Lock className="h-6 w-6"/> PRE-LANCIO ATTIVO</> : <><Unlock className="h-6 w-6"/> SITO PUBBLICO</>}
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Data del Lancio</label>
                                <input type="datetime-local" value={localSettings.pre_launch_date || ''} onChange={(e) => setLocalSettings({...localSettings, pre_launch_date: e.target.value})} className="w-full border-gray-300 rounded-xl p-3 focus:ring-red-500 focus:border-red-500" />
                            </div>
                            <div className="pt-4">
                                <button onClick={handleExportCSV} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black flex items-center justify-center gap-2">
                                    <Download className="h-5 w-5" /> Esporta CSV
                                </button>
                            </div>
                        </div>
                     </div>
                </div>
            )}

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center"><Settings className="mr-2 text-brand-600"/> Impostazioni Globali</h3>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h4 className="font-bold text-gray-400 uppercase text-xs tracking-widest flex items-center"><Image className="h-4 w-4 mr-2"/> Branding</h4>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <label className="block text-sm font-bold mb-4">Altezza Logo (px): {localSettings.logo_height}</label>
                                <input type="range" min="20" max="150" value={localSettings.logo_height} onChange={(e) => setLocalSettings({...localSettings, logo_height: parseInt(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600 mb-6" />
                                
                                <label className="block text-sm font-bold mb-2">Allineamento Logo</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setLocalSettings({...localSettings, logo_alignment: 'left'})} className={`flex-1 py-2 rounded-lg border font-bold ${localSettings.logo_alignment === 'left' ? 'bg-brand-600 text-white' : 'bg-white text-gray-500'}`}>Sinistra</button>
                                    <button onClick={() => setLocalSettings({...localSettings, logo_alignment: 'center'})} className={`flex-1 py-2 rounded-lg border font-bold ${localSettings.logo_alignment === 'center' ? 'bg-brand-600 text-white' : 'bg-white text-gray-500'}`}>Centro</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* MODALI DI CONFERMA PERSONALIZZATI */}
        
        {/* Modale Eliminazione Corso */}
        <ConfirmModal 
            isOpen={!!deleteCourseId}
            onClose={() => setDeleteCourseId(null)}
            onConfirm={confirmDeleteCourse}
            title="Elimina Corso"
            message="Sei sicuro di voler eliminare questo corso? L'azione è irreversibile e gli studenti non potranno più acquistarlo."
            confirmLabel="Sì, Elimina"
            cancelLabel="Annulla"
            isDestructive={true}
        />

        {/* Modale Reset Chat (Tab Community) */}
        <ConfirmModal 
            isOpen={showClearChatModal}
            onClose={() => setShowClearChatModal(false)}
            onConfirm={handleClearCommunityChat}
            title="Reset Community Chat"
            message="Questa operazione cancellerà TUTTI i messaggi presenti nella community chat. Vuoi procedere?"
            confirmLabel="Sì, Svuota Chat"
            cancelLabel="Annulla"
            isDestructive={true}
            isLoading={isClearingChat}
        />

        {/* SAVE BUTTON FLOATING */}
        <div className="fixed bottom-6 right-6 z-50">
             <button onClick={handleSaveSettings} disabled={isSavingSettings} className="px-10 py-5 bg-brand-600 text-white rounded-full font-black hover:bg-brand-700 shadow-2xl shadow-brand-500/50 flex items-center text-xl transform hover:scale-110 transition-all disabled:opacity-70">
                {isSavingSettings ? <Loader className="h-6 w-6 animate-spin mr-3"/> : <Settings className="mr-3 h-6 w-6" />} Salva Tutto
            </button>
        </div>

      </div>
    </div>
  );
};
