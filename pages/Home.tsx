
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Course, UserProfile, LandingPageConfig } from '../types';
import { CheckCircle, ArrowRight, ShieldCheck, Zap, Database, Layout, Target, Cpu, Layers, Users, Lock, Quote, Star, Award, Smartphone, MessageCircle, CheckCircle2, X, PlayCircle, BookOpen, MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, CreditCard, Check, XCircle, Banknote, Rocket, TrendingUp, UserCheck, AlertTriangle, ChevronDown, ChevronUp, HelpCircle, Clock, Video, Image, Upload, Sparkles, Monitor, Loader2, ExternalLink, MoveHorizontal, Laptop } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  courses: Course[];
  onCourseSelect: (courseId: string) => void;
  user?: UserProfile | null;
  // Riceviamo l'intera configurazione
  landingConfig?: LandingPageConfig;
}

// --- COMPONENTI INTERNI OTTIMIZZATI ---

const WebsiteCard: React.FC<{ url: string; index: number; isMobileView: boolean }> = ({ url, index, isMobileView }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [scale, setScale] = useState(1);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);
    
    // CONFIGURAZIONE RESPONSIVE
    // Desktop: Simula un Laptop (1280px)
    // Mobile: Simula uno Smartphone (375px)
    const TARGET_WIDTH = isMobileView ? 375 : 1280; 
    const VIRTUAL_HEIGHT = 5000;       
    const BASE_SPEED = 0.6;            

    // Configurazione Direzione Verticale: index pari = GIÙ, dispari = SU
    const directionRef = useRef<number>(index % 2 === 0 ? 1 : -1);

    // 1. Calcolo Scala Dinamico
    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.clientWidth;
            // Calcola la scala basandosi sulla larghezza del contenitore (che è la "schermo" del device simulato)
            const newScale = containerWidth / TARGET_WIDTH;
            setScale(newScale);
        };

        handleResize();
        // Un piccolo delay per assicurarsi che il DOM sia pronto
        setTimeout(handleResize, 100);
        
        window.addEventListener('resize', handleResize);
        
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, [TARGET_WIDTH, isMobileView]);

    // 2. Posizionamento Iniziale Scroll Verticale
    useEffect(() => {
        if (!isLoading && scrollRef.current && directionRef.current === -1) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
        }
    }, [isLoading]);

    // 3. Animation Loop Verticale (Interno al sito)
    useEffect(() => {
        const animate = () => {
            if (isVisible && !isInteracting && !isLoading && scrollRef.current) {
                const el = scrollRef.current;
                const maxScroll = el.scrollHeight - el.clientHeight;
                
                let newScrollTop = el.scrollTop + (BASE_SPEED * directionRef.current);

                if (newScrollTop >= maxScroll) {
                    newScrollTop = maxScroll;
                    directionRef.current = -1; 
                } else if (newScrollTop <= 0) {
                    newScrollTop = 0;
                    directionRef.current = 1; 
                }

                el.scrollTop = newScrollTop;
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current!);
    }, [isVisible, isInteracting, isLoading]);

    // Render Laptop Frame (Desktop)
    if (!isMobileView) {
        return (
            <div 
                className="w-[500px] h-[330px] relative group flex-shrink-0 mx-6 perspective-1000"
                onMouseEnter={() => setIsInteracting(true)}
                onMouseLeave={() => setIsInteracting(false)}
                onTouchStart={() => setIsInteracting(true)}
                onTouchEnd={() => setIsInteracting(false)}
            >
                {/* Laptop Top (Screen) */}
                <div className="absolute inset-x-0 top-0 bottom-4 bg-gray-800 rounded-t-xl rounded-b-md border-[3px] border-gray-700 shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
                    
                    {/* Webcam & Bezel */}
                    <div className="h-6 bg-gray-900 flex justify-center items-center relative z-20 shrink-0">
                        <div className="w-1.5 h-1.5 bg-black rounded-full ring-1 ring-gray-700"></div>
                        <div className="absolute left-3 top-1.5 flex gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                    </div>

                    {/* Screen Container */}
                    <div ref={containerRef} className="relative flex-1 bg-white w-full overflow-hidden">
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-30">
                                <Loader2 className="h-8 w-8 text-brand-600 animate-spin mb-2" />
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Caricamento Desktop...</span>
                            </div>
                        )}
                        
                        {/* Scaled Content */}
                        <div 
                            style={{
                                width: TARGET_WIDTH,
                                height: `calc(100% / ${scale})`,
                                transform: `scale(${scale})`,
                                transformOrigin: 'top left',
                            }}
                            className="absolute top-0 left-0 bg-white"
                        >
                            <div 
                                ref={scrollRef}
                                className="w-full h-full overflow-y-auto scrollbar-hide"
                                style={{ scrollBehavior: 'auto', overscrollBehavior: 'contain' }} 
                            >
                                <div style={{ height: VIRTUAL_HEIGHT }} className="w-full relative">
                                    <iframe 
                                        src={url} 
                                        className="w-full h-full border-none pointer-events-none block" 
                                        loading="lazy"
                                        scrolling="no"
                                        onLoad={() => setIsLoading(false)}
                                        title="Desktop Preview"
                                        sandbox="allow-scripts allow-same-origin"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Laptop Base (Bottom) */}
                <div className="absolute bottom-0 inset-x-[-20px] h-4 bg-gray-300 rounded-b-xl rounded-t-sm shadow-xl flex items-center justify-center border-t border-gray-400/50 gradient-to-b from-gray-200 to-gray-400">
                    <div className="w-20 h-1.5 bg-gray-400/30 rounded-full"></div>
                </div>
                
                <a href={url} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3 z-30 text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 p-2 bg-black/50 rounded-full backdrop-blur-sm">
                    <ExternalLink className="h-4 w-4" />
                </a>
            </div>
        );
    }

    // Render Phone Frame (Mobile)
    return (
        <div 
            ref={containerRef}
            className="w-[260px] h-[480px] relative group flex-shrink-0 rounded-[2.5rem] border-[6px] border-slate-800 bg-slate-900 shadow-2xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.01] mx-4"
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => setIsInteracting(false)}
            onTouchStart={() => setIsInteracting(true)}
            onTouchEnd={() => setIsInteracting(false)}
        >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-slate-800 rounded-b-xl z-20 flex justify-center items-center">
                <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
            </div>

            <div className="w-full h-full bg-white relative overflow-hidden rounded-[2rem]">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-30">
                        <Loader2 className="h-8 w-8 text-brand-600 animate-spin mb-2" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Caricamento Mobile...</span>
                    </div>
                )}

                <div 
                    style={{
                        width: TARGET_WIDTH,
                        height: `calc(100% / ${scale})`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                    }}
                    className="absolute top-0 left-0 bg-white"
                >
                    <div 
                        ref={scrollRef}
                        className="w-full h-full overflow-y-auto scrollbar-hide"
                        style={{ scrollBehavior: 'auto', overscrollBehavior: 'contain' }} 
                    >
                        <div style={{ height: VIRTUAL_HEIGHT }} className="w-full relative">
                            <iframe 
                                src={url} 
                                className="w-full h-full border-none pointer-events-none block" 
                                loading="lazy"
                                scrolling="no"
                                onLoad={() => setIsLoading(false)}
                                title="Mobile Preview"
                                sandbox="allow-scripts allow-same-origin"
                            ></iframe>
                        </div>
                    </div>
                </div>

                <a href={url} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 z-20 bg-black/80 text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
};

// ... (DEFAULT_CONFIG, IconMap, FAQ_ITEMS restano invariati) ...
const DEFAULT_CONFIG: LandingPageConfig = {
  announcement_bar: {
    text: '🎉 Offerta lancio: Tutti i corsi al 50% di sconto per i primi 100 iscritti!',
    is_visible: false,
    is_sticky: false,
    type: 'static',
    bg_color: '#fbbf24', // Amber 400
    text_color: '#1e3a8a' // Blue 900
  },
  hero: {
    title: "Crea Siti Web Professionali o Piattaforme con l'AI in Poche Ore",
    subtitle: 'Senza Scrivere Una Riga di Codice.',
    cta_primary: 'Scopri i corsi disponibili',
    cta_secondary: '', // Rimosso default
    image_url: '', 
    benefits: [
        "Accesso a vita ai contenuti",
        "Assistenza 7 giorni su 7",
        "Nessuna esperienza richiesta",
        "Accesso alla community",
        "Supporto PERSONALE diretto su whatsapp",
        "Soddisfatto o rimborsato in 30 giorni"
    ],
    show_badges: true
  },
  ai_era_section: {
      title: 'La Nuova Era del Web',
      subtitle: "Benvenuto Nell'Era dell'Intelligenza Artificiale",
      text: "Fino a ieri, creare un sito web significava: imparare a programmare per anni, spendere migliaia di euro per agenzie, o accontentarsi di template limitati.\nOggi tutto è cambiato.\nL'intelligenza artificiale ha reso la creazione web accessibile a chiunque. In poche ore puoi ottenere risultati che prima richiedevano settimane di lavoro e competenze avanzate.\nIl risultato?\nImprenditori che diventano autonomi e risparmiano migliaia di euro\nPersone comuni che si creano un'entrata extra da €1.000-5.000 al mese\nIdee che diventano realtà senza barriere tecniche\nE tu? Sei pronto a far parte di questa rivoluzione?",
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
      { 
          icon: 'Cpu', 
          title: 'AI & Sviluppo Low-Code', 
          desc: 'Google AI Studio (Zero Costi)\nDatabase Supabase\nDeploy su Vercel\nGestione Domini & DNS' 
      },
      { 
          icon: 'Layout', 
          title: 'Landing Page & Siti Web', 
          desc: 'Elementor (versione base)\nStruttura & Copy\nTemplate pronti all\'uso\nOttimizzazione Mobile' 
      },
      { 
          icon: 'Zap', 
          title: 'Automazioni a Costo Zero', 
          desc: 'Notifiche intelligenti\nEmail automatiche\nWebhook Make/N8N\nAPI Integration' 
      },
      { 
          icon: 'Target', 
          title: 'Pubblicità & Ads', 
          desc: 'Meta Ads (FB/IG)\nTikTok Ads\nStrategie E-commerce\nLead Generation' 
      }
    ]
  },
  how_it_works_section: {
      title: 'Come Funziona Moise Web Academy',
      subtitle: 'Tre semplici passi per diventare un Web Creator professionista',
      is_visible: true,
      steps: [
          {
              title: 'Impara',
              desc: "Segui i video passo-passo. Daniel ti guida dalla A alla Z, senza dare nulla per scontato. Ogni concetto è spiegato in modo semplice, chiaro e pratico. Anche se oggi non sai cosa sia l'HTML.",
              icon: 'BookOpen'
          },
          {
              title: 'Crea',
              desc: "Applichi subito quello che impari. In poche ore avrai il tuo primo sito web professionale online, con dominio personalizzato e hosting gratuito. Zero costi nascosti, zero sorprese.",
              icon: 'Rocket'
          },
          {
              title: 'Monetizza (Scelta Tua)',
              desc: "Offri i tuoi servizi ad aziende locali (1 sito = €1.000-5.000) oppure lancia i tuoi progetti digitali. Nel 2025 ogni business ha bisogno di presenza online, e tu sai esattamente come dargliela.",
              icon: 'Banknote'
          }
      ]
  },
  ai_showcase_section: {
      title: 'Cosa Può Creare l’Intelligenza Artificiale per Te',
      subtitle: 'Potenza Creativa Senza Limiti',
      text: "L'AI non è solo uno strumento di scrittura. Oggi, con le competenze che ti insegniamo, puoi generare interfacce complete, backend scalabili e design mozzafiato in tempo reale.\n\nDal semplice sito vetrina a piattaforme complesse con login e database, passando per e-commerce e landing page ad alta conversione. Tutto questo ottimizzato tecnicamente e pronto per il mercato, senza scrivere codice manualmente e senza spendere mesi di sviluppo.",
      is_visible: true,
      urls: [
          "https://studioskinlounge.aura.build/",
          "https://flowfund-fintech-10.aura.build/",
          "https://glowmist-skincare-9.aura.build/",
          "https://conscious-dance-68.aura.build/",
          "https://gym-fitness-club-47.aura.build/",
          "https://newbox-designer.aura.build/",
          "https://architectu-interior-38.aura.build/"
      ]
  },
  comparison_section: {
    title: 'La Tua Vita Prima e Dopo Moise Web Academy',
    subtitle: 'Non è solo un corso. È un cambio di prospettiva sulla tua autonomia e sulle tue possibilità.',
    is_visible: true,
    before_title: 'PRIMA (Senza il corso)',
    after_title: 'DOPO (Con il corso)',
    before_items: [
        'Dipendi da sviluppatori costosi per ogni singola modifica',
        'Spendi 2.000-10.000€ per un sito base (e altre centinaia per ogni aggiornamento)',
        'Aspetti settimane o mesi per vedere il tuo progetto online',
        'Le tue idee restano solo idee perché "costa troppo realizzarle"',
        'Perdi opportunità di business e clienti per mancanza di presenza online',
        'Lavori con orari fissi, stipendio fisso, dipendenza da un datore di lavoro',
        'Guardi altri che guadagnano online e pensi "vorrei saperlo fare anch\'io"'
    ],
    after_items: [
        'Sei completamente autonomo, modifichi e crei quando e come vuoi',
        'Crei siti professionali in poche ore con costi quasi zero',
        'Pubblichi online in giornata, senza aspettare nessuno',
        'Trasformi ogni idea in un progetto reale: siti, e-commerce, piattaforme',
        'Offri servizi da €1.000-5.000 per progetto e ti crei un\'entrata extra (o principale)',
        'Lavori da dove vuoi, quando vuoi, con orari flessibili',
        'Hai una competenza ad alto valore che ti rende indipendente e ricercato'
    ]
  },
  testimonials_section: {
    title: 'Cosa Dicono i Nostri Studenti',
    subtitle: 'Testimonianze',
    is_visible: true,
    reviews: [
        { 
            name: 'Marco R.', 
            role: 'Web Development', 
            text: 'Corso eccezionale! Ho trovato lavoro come sviluppatore dopo soli 3 mesi. Il docente spiega in modo chiaro e i progetti pratici sono utilissimi.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
        },
        { 
            name: 'Giulia S.', 
            role: 'Digital Marketing', 
            text: 'Contenuti aggiornati e pratici. Ora gestisco campagne per grandi brand grazie a quello che ho imparato.',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
        },
        { 
            name: 'Luca M.', 
            role: 'UI/UX Design', 
            text: 'Il miglior investimento per la mia carriera. Docenti preparatissimi e community attiva.',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
        }
    ]
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
      logo_margin_top: 0,
      logo_margin_bottom: 0,
      logo_margin_left: 0,
      logo_margin_right: 0
  }
};

const IconMap: Record<string, React.ElementType> = {
  Cpu, Layout, Zap, Target, ShieldCheck, Database, Layers, Users, Lock, Star, Award, Smartphone, 
  BookOpen, Rocket, Banknote, TrendingUp
};

const FAQ_ITEMS = [
    {
        q: "Devo avere competenze tecniche o di programmazione?",
        a: "Assolutamente NO. Il corso è pensato per chi parte da zero assoluto. Se sai usare WhatsApp, Google e guardare un video su YouTube, sei già pronto. Non serve sapere nulla di codice, HTML, CSS o programmazione."
    },
    {
        q: "Quanto tempo serve per completare il corso?",
        a: "Il corso base si completa in 3-5 ore. Il premium in 8-10 ore totali. Ma puoi andare completamente al tuo ritmo: hai accesso illimitato a vita, quindi puoi seguirlo in una settimana o in due mesi. Tu decidi."
    },
    {
        q: "Quanto tempo ci vuole per creare un sito dopo il corso?",
        a: "Dopo aver seguito il corso base, puoi creare un sito professionale in 3-5 ore. Con la pratica e l'esperienza, scendi a 1-2 ore per sito. I nostri studenti più veloci creano landing page in 30-45 minuti."
    },
    {
        q: "Quali strumenti servono? Ci sono costi aggiuntivi?",
        a: "Ti serve solo un computer (Windows, Mac o Linux) e una connessione internet. Gli strumenti AI che usiamo (AI Studio Gemini) sono gratuiti o hanno piani free molto generosi. L'unico costo ricorrente è il dominio personalizzato (circa €10-15 all'anno), che è completamente opzionale."
    },
    {
        q: "L'hosting è davvero gratuito?",
        a: "Sì! Ti insegniamo a usare soluzioni di hosting gratuite professionali con performance eccellenti. Zero costi mensili, zero sorprese. Ovviamente se in futuro vorrai passare a hosting premium potrai farlo, ma non è necessario per iniziare."
    },
    {
        q: "Posso davvero guadagnare creando siti per clienti?",
        a: "Assolutamente sì. Un sito vetrina base si vende da €800 a €3.000. Un e-commerce completo da €2.000 a €10.000. Un gestionale personalizzato anche oltre. La domanda è altissima (ogni attività ha bisogno di presenza online) e chi sa creare siti professionali velocemente è molto ricercato."
    },
    {
        q: "Come trovo i clienti?",
        a: "Nel corso Premium ti diamo script pronti per contattare attività locali (ristoranti, hotel, professionisti, negozi, palestre). Puoi iniziare anche da conoscenti e passaparola. Molti nostri studenti trovano i primi clienti semplicemente guardandosi intorno nella propria città: quante attività hanno siti vecchi o inesistenti?"
    },
    {
        q: "Per quanto tempo ho accesso al corso?",
        a: "Per sempre. Accesso illimitato a vita. Anche se tra 5 anni vuoi rivedere una lezione, sarà ancora lì. E riceverai GRATIS tutti gli aggiornamenti futuri quando aggiungiamo nuovi contenuti o funzionalità."
    },
    {
        q: "C'è supporto se ho problemi o domande?",
        a: "Sì! Assistenza 7 giorni su 7 via chat per qualsiasi dubbio tecnico o domanda. Nel corso Premium hai anche assistenza PRIORITARIA (rispondiamo entro 2 ore) + sessioni 1-a-1 con Daniel per analizzare i tuoi progetti."
    },
    {
        q: "Cosa succede se l'AI cambia o viene aggiornata?",
        a: "Aggiorniamo costantemente il corso con le ultime novità e strumenti AI. Quando escono nuove funzionalità o miglioramenti, aggiungiamo lezioni gratuite. Il tuo accesso include TUTTI gli aggiornamenti futuri senza costi extra."
    },
    {
        q: "Il corso va bene anche per creare il sito della MIA attività?",
        a: "Assolutamente sì! Anzi, è uno dei casi d'uso principali. Risparmi migliaia di euro (che avresti dato a un'agenzia) e resti autonomo per sempre. Ogni volta che vuoi modificare qualcosa, lo fai tu in pochi minuti. Zero dipendenze."
    },
    {
        q: "E se non ho tempo ora? Posso iniziare dopo?",
        a: "Certamente! Una volta iscritto hai accesso a vita. Puoi iniziare domani, tra una settimana o tra un mese. Il corso sarà sempre lì ad aspettarti. Ma ricorda: i bonus per i primi 50 iscritti scadono, quindi iscriviti ora per non perderli."
    },
    {
        q: "Il corso è registrato o sono lezioni live?",
        a: "Tutto registrato e sempre disponibile. Massima flessibilità: segui quando vuoi, metti in pausa, rivedi le parti che ti servono 10 volte se necessario. Nessun vincolo di orario o giorno."
    },
    {
        q: "Funziona anche per creare app mobile?",
        a: "Il corso si concentra su siti web professionali (che comunque sono responsive e funzionano perfettamente su mobile). Per app native iOS/Android servirebbero competenze diverse. Ma i siti web moderni sono così potenti che spesso sostituiscono benissimo le app."
    },
    {
        q: "Che differenza c'è tra Base e Premium?",
        a: "Base (€50): Perfetto per siti vetrina, landing page, siti aziendali. Ideale se vuoi iniziare o creare il tuo sito personale/aziendale. Premium (€100): Include TUTTO del Base + e-commerce, CRM, gestionali, area membri, automazioni avanzate. Per chi vuole offrire servizi premium e guadagnare di più."
    },
    {
        q: "Posso passare da Base a Premium dopo?",
        a: "Sì, puoi fare upgrade in qualsiasi momento pagando la differenza. Ma i bonus esclusivi (sessioni 1-a-1, template, script) sono solo per chi si iscrive ora nei primi 50 posti."
    },
    {
        q: "C'è una garanzia?",
        a: "Sì! Garanzia Soddisfatti o Rimborsati di 30 giorni. Se non sei soddisfatto per qualsiasi motivo, ti rimborsiamo il 100%. Nessuna domanda, nessuna giustificazione. Zero rischi per te."
    },
    {
        q: "Il corso è adatto anche a persone over 50?",
        a: "Assolutamente sì! Abbiamo studenti di tutte le età. L'unico requisito è saper usare un computer base. Se riesci a guardare video su YouTube e scrivere su WhatsApp, sei già pronto. Daniel spiega tutto passo-passo, senza dare nulla per scontato."
    }
];

export const Home: React.FC<HomeProps> = ({ courses, onCourseSelect, user, landingConfig }) => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showFounderStory, setShowFounderStory] = useState(false);
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', text: '', rating: 5 });

  // Showcase Slider Ref
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Helper per rilevare se l'allegato è un video (più robusto)
  const isVideo = (url?: string) => {
      if (!url) return false;
      const lowerUrl = url.toLowerCase();
      return lowerUrl.includes('youtube') || 
             lowerUrl.includes('youtu.be') || 
             lowerUrl.includes('vimeo') || 
             lowerUrl.includes('.mp4') || 
             lowerUrl.includes('.webm') || 
             lowerUrl.includes('.mov');
  };

  // Detect Mobile/Desktop
  useEffect(() => {
      const checkMobile = () => {
          setIsMobileView(window.innerWidth < 1024); // Consider tablets/desktop as "Desktop view" for showcase
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Merge config with defaults
  const config = useMemo(() => {
    if (!landingConfig) return DEFAULT_CONFIG;
    
    let featuresToUse = landingConfig.features_section;
    if (!featuresToUse || !featuresToUse.cards || featuresToUse.cards.length < 4) {
        featuresToUse = DEFAULT_CONFIG.features_section;
    }

    let aboutToUse = landingConfig.about_section;
    if (!aboutToUse || !aboutToUse.mission_points || aboutToUse.mission_points.length === 0) {
        aboutToUse = { ...aboutToUse, mission_points: DEFAULT_CONFIG.about_section.mission_points };
    }

    // FIX VIDEO: Se l'URL nel DB è un'immagine (vecchio default) ma noi vogliamo il video (nuovo default), forziamo l'aggiornamento in memoria
    if (aboutToUse && aboutToUse.image_url && !isVideo(aboutToUse.image_url) && isVideo(DEFAULT_CONFIG.about_section.image_url)) {
         aboutToUse = { ...aboutToUse, image_url: DEFAULT_CONFIG.about_section.image_url };
    }

    if (aboutToUse && !aboutToUse.quote_author_image_size) {
        aboutToUse.quote_author_image_size = 48; 
    }

    const merged = {
        ...DEFAULT_CONFIG,
        ...landingConfig,
        announcement_bar: { ...DEFAULT_CONFIG.announcement_bar, ...(landingConfig.announcement_bar || {}) },
        hero: { 
            ...DEFAULT_CONFIG.hero, 
            ...(landingConfig.hero || {}),
            benefits: landingConfig.hero?.benefits || DEFAULT_CONFIG.hero.benefits 
        },
        ai_era_section: {
            ...DEFAULT_CONFIG.ai_era_section,
            ...(landingConfig.ai_era_section || {})
        },
        about_section: { ...DEFAULT_CONFIG.about_section, ...aboutToUse },
        features_section: { ...DEFAULT_CONFIG.features_section, ...featuresToUse },
        how_it_works_section: {
            ...DEFAULT_CONFIG.how_it_works_section,
            ...(landingConfig.how_it_works_section || {})
        },
        ai_showcase_section: {
            ...DEFAULT_CONFIG.ai_showcase_section,
            ...(landingConfig.ai_showcase_section || {})
        },
        comparison_section: {
            ...DEFAULT_CONFIG.comparison_section,
            ...(landingConfig.comparison_section || {}),
            before_items: landingConfig.comparison_section?.before_items || DEFAULT_CONFIG.comparison_section?.before_items,
            after_items: landingConfig.comparison_section?.after_items || DEFAULT_CONFIG.comparison_section?.after_items,
        },
        testimonials_section: { ...DEFAULT_CONFIG.testimonials_section, ...(landingConfig.testimonials_section || {}) },
        usp_section: { ...DEFAULT_CONFIG.usp_section, ...(landingConfig.usp_section || {}) },
        cta_section: { ...DEFAULT_CONFIG.cta_section, ...(landingConfig.cta_section || {}) },
        footer: { 
            ...DEFAULT_CONFIG.footer, 
            ...(landingConfig.footer || {}),
            social_links: {
                ...DEFAULT_CONFIG.footer.social_links,
                ...(landingConfig.footer?.social_links || {})
            }
        }
    };

    if (merged.hero.title && merged.hero.title.includes("Costruiamo piattaforme")) {
        merged.hero.title = "Crea Siti Web Professionali o Piattaforme con l'AI in Poche Ore";
        merged.hero.subtitle = "Senza Scrivere Una Riga di Codice.";
    }

    return merged;
  }, [landingConfig]);

  const handleNavigateToCourses = () => {
    navigate('/courses');
  };

  const submitReview = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Grazie! La tua recensione è stata inviata ed è in fase di approvazione.");
      setIsReviewModalOpen(false);
      setReviewForm({ name: '', text: '', rating: 5 });
  };

  const isSticky = config.announcement_bar.is_visible && config.announcement_bar.is_sticky;
  const heroPaddingClass = (config.announcement_bar.is_visible && !isSticky) 
    ? 'pt-32 lg:pt-40' 
    : 'pt-36 lg:pt-48';

  const titleParts = config.about_section.title.split("Moise Web Academy");
  const preTitle = titleParts[0] || "Perché nasce ";
  const brandTitle = "Moise Web Academy";

  // Auto-scroll orizzontale
  useEffect(() => {
      let animationId: number;
      const scrollSpeed = 0.5; // Velocità ridotta per leggibilità

      const scroll = () => {
          if (sliderRef.current && !isPaused) {
              sliderRef.current.scrollLeft += scrollSpeed;
              
              // Infinite Loop Logic: Resetta la posizione quando arriva a metà contenuto (grazie alla duplicazione)
              if (sliderRef.current.scrollLeft >= (sliderRef.current.scrollWidth / 2)) {
                  sliderRef.current.scrollLeft = 0;
              }
          }
          animationId = requestAnimationFrame(scroll);
      };

      animationId = requestAnimationFrame(scroll);
      return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-slate-100 bg-slate-950 selection:bg-brand-500/30">
      
      {/* Background Glows Globali */}
      <div className="fixed top-0 w-full h-screen -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-brand-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px]"></div>
      </div>

      {/* ANNOUNCEMENT BAR */}
      {config.announcement_bar.is_visible && (
        <div 
            className={`w-full z-40 overflow-hidden backdrop-blur-md border-b border-white/5 ${isSticky ? 'fixed top-20 shadow-md' : 'relative mt-20'}`}
            style={{ backgroundColor: 'rgba(23, 37, 84, 0.8)', color: config.announcement_bar.text_color }} // Custom dark glass for bar
        >
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .animate-marquee {
                    display: inline-block;
                    white-space: nowrap;
                    animation: marquee 20s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className={`py-3 px-4 font-medium text-center text-sm md:text-base text-brand-200 ${config.announcement_bar.type === 'marquee' ? 'whitespace-nowrap overflow-hidden' : ''}`}>
                {config.announcement_bar.type === 'marquee' ? (
                     <div className="animate-marquee w-full">
                         <span className="mx-8">{config.announcement_bar.text}</span>
                         <span className="mx-8">{config.announcement_bar.text}</span>
                         <span className="mx-8">{config.announcement_bar.text}</span>
                     </div>
                ) : (
                    <p>{config.announcement_bar.text}</p>
                )}
            </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden">
          {/* Hero Video Background */}
          <div className="absolute inset-0 z-0">
             <video 
                src="https://res.cloudinary.com/dhj0ztos6/video/upload/v1765326450/home_2_bbhedx.webm"
                autoPlay loop muted playsInline 
                className="w-full h-full object-cover opacity-30"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950"></div>
          </div>

          <section className={`relative z-10 pb-6 lg:pb-10 ${heroPaddingClass}`}>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                {config.hero.show_badges && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-brand-300 bg-brand-500/10 ring-1 ring-brand-500/20 rounded-full mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="h-3 w-3" />
                        <span className="flex h-1.5 w-1.5 bg-brand-400 rounded-full animate-pulse mx-1"></span>
                        Zero Abbonamenti • Zero Crediti AI • Zero Tool a Pagamento
                    </div>
                )}
                
                <h1 className="text-5xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.05] mb-6 animate-in fade-in zoom-in-95 duration-700 delay-100">
                  {config.hero.title}
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
                    {config.hero.subtitle}
                  </span>
                </h1>

                {config.hero.text && (
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-300 leading-relaxed mb-8 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {config.hero.text}
                    </p>
                )}

                {/* Benefits List */}
                {config.hero.benefits && config.hero.benefits.length > 0 && (
                    <ul className="mt-8 mb-12 text-left max-w-lg mx-auto space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                        {config.hero.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start text-lg text-slate-300">
                                <div className="mt-1 mr-3 flex-shrink-0 bg-brand-500/20 p-1 rounded-full ring-1 ring-brand-500/30">
                                    <Check className="h-3 w-3 text-brand-400 stroke-[3]" />
                                </div>
                                {benefit}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
                  <button 
                    onClick={handleNavigateToCourses}
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] group"
                  >
                    {config.hero.cta_primary} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {config.hero.show_badges && (
                    <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-slate-400 border-t border-white/5 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                        <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-brand-500" /> Zero fuffa</div>
                        <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-brand-500" /> Acquisto Singolo</div>
                        <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-brand-500" /> Accesso a Vita</div>
                    </div>
                )}
              </div>
            </div>
          </section>
      </div>

      {/* --- AI ERA SECTION (Video Integration) --- */}
      {config.ai_era_section?.is_visible !== false && (
          <section className="relative z-10 py-24">
             <div className="max-w-7xl mx-auto px-6">
                  {/* Container Glassmorphic */}
                  <div className="bg-white/5 backdrop-blur-xl ring-1 ring-white/10 rounded-3xl p-8 md:p-12 overflow-hidden relative shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-30 pointer-events-none"></div>
                      
                      <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                          {/* Left Content */}
                          <div>
                              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-brand-300 bg-brand-500/10 ring-1 ring-brand-500/20 rounded-full mb-6">
                                  <Sparkles className="h-3 w-3" />
                                  {config.ai_era_section?.subtitle}
                              </div>
                              <h2 className="text-4xl md:text-5xl font-semibold text-white mb-8 tracking-tight leading-tight">
                                  {config.ai_era_section?.title}
                              </h2>
                              <div className="text-lg text-slate-300 leading-relaxed space-y-6">
                                  {config.ai_era_section?.text.split('\n').map((line, i) => {
                                      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
                                          return (
                                              <div key={i} className="flex items-start gap-3 ml-2 my-2">
                                                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 shadow-[0_0_10px_#60a5fa]"></div>
                                                  <span className="text-slate-200 font-medium">{line.replace(/^[-•]\s*/, '')}</span>
                                              </div>
                                          );
                                      }
                                      if (line.trim().endsWith('?')) {
                                          return <p key={i} className="text-white font-bold text-xl mt-4 border-l-4 border-brand-500 pl-4">{line}</p>;
                                      }
                                      if (line.trim() === '') return <br key={i} />;
                                      return <p key={i}>{line}</p>;
                                  })}
                              </div>
                          </div>

                          {/* Right Video Visual */}
                          <div className="relative rounded-3xl overflow-hidden h-[500px] w-full shadow-2xl ring-1 ring-white/10 group">
                               <video 
                                  src="https://res.cloudinary.com/dhj0ztos6/video/upload/v1765328025/home_page_3_tnvnqm.webm"
                                  autoPlay loop muted playsInline 
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                               />
                               {/* Gradient Overlay on Video */}
                               <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                               <div className="absolute bottom-6 left-6 right-6">
                                   <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                       <div className="flex items-center gap-3 mb-2">
                                           <div className="h-2 w-2 rounded-full bg-brand-400 animate-pulse"></div>
                                           <span className="text-xs text-brand-400 font-mono uppercase">IL TUO SUCCESSO</span>
                                       </div>
                                       <p className="text-sm text-slate-200">
                                           Diventa un professionista ricercato.
                                       </p>
                                   </div>
                               </div>
                          </div>
                      </div>
                  </div>
             </div>
          </section>
      )}

      {/* SECTION 2 - Features Grid MOVED HERE */}
      {config.features_section.is_visible && (
          <section className="py-24 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-brand-300 bg-brand-500/10 ring-1 ring-brand-500/20 rounded-full mb-6">
                        <Cpu className="h-3 w-3" />
                        Skills
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tight">{config.features_section.title}</h2>
                    <p className="text-xl text-slate-400">{config.features_section.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {config.features_section.cards.map((card, idx) => {
                        const IconComponent = IconMap[card.icon] || Star;
                        const featuresList = card.desc.split('\n').filter(s => s.trim() !== '');

                        return (
                            <div key={idx} className="group hover:ring-brand-500/30 transition-all duration-300 bg-white/5 ring-1 ring-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden flex flex-col h-full">
                                {/* Gradient Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br from-brand-500/20 to-brand-500/5 ring-1 ring-brand-500/20 relative z-10 group-hover:scale-110 transition-transform">
                                    <IconComponent className="h-7 w-7 text-brand-400" />
                                </div>
                                
                                <h3 className="text-xl font-semibold text-white mb-6 relative z-10">{card.title}</h3>
                                
                                <div className="space-y-3 mt-auto relative z-10">
                                    {featuresList.map((item, i) => (
                                        <div key={i} className="flex items-start">
                                            <div className="mt-1.5 mr-3 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-brand-500"></div>
                                            <span className="text-slate-400 text-sm leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Courses Preview CTA */}
                <div className="mt-20 pt-12 border-t border-white/5 text-center">
                    <h2 className="text-3xl font-semibold text-white mb-4">I Nostri Corsi Più Popolari</h2>
                    <p className="text-slate-400 mb-10 max-w-2xl mx-auto">Scelti da migliaia di studenti per qualità e completezza.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {courses.slice(0,3).map(course => {
                             const displayPrice = course.price;
                             const fakeOriginalPrice = Math.round(course.price * 1.4);
                             const discountPercent = Math.round(((fakeOriginalPrice - displayPrice) / fakeOriginalPrice) * 100);
                             return (
                                <div key={course.id} className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden group hover:border-brand-500/50 transition-all cursor-pointer text-left" onClick={() => onCourseSelect(course.id)}>
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"/>
                                        <div className="absolute top-4 right-4 bg-brand-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">-{discountPercent}%</div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">{course.level}</span>
                                            <div className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-current"/><span className="text-xs text-white">4.9</span></div>
                                        </div>
                                        <h3 className="font-bold text-white text-lg mb-2 line-clamp-1 group-hover:text-brand-400 transition-colors">{course.title}</h3>
                                        <div className="flex justify-between items-center mt-4">
                                            <div>
                                                <span className="text-xl font-bold text-white">€{displayPrice}</span>
                                                <span className="text-sm text-slate-500 line-through ml-2">€{fakeOriginalPrice}</span>
                                            </div>
                                            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Vedi</button>
                                        </div>
                                    </div>
                                </div>
                             )
                        })}
                    </div>
                </div>
            </div>
          </section>
      )}

      {/* SECTION 1 - About / Mission MOVED AFTER */}
      {config.about_section.is_visible && (
        <section className="py-24 bg-slate-900/50 border-t border-white/5 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    
                    {/* LEFT COLUMN: Image & Quote */}
                    <div className="relative">
                        <div className="relative rounded-3xl overflow-hidden h-[500px] w-full shadow-2xl ring-1 ring-white/10 group">
                            {/* VIDEO CHECK: Se è un video, renderizza il player, altrimenti l'immagine */}
                            {isVideo(config.about_section.image_url) ? (
                                <video 
                                    src={config.about_section.image_url}
                                    autoPlay loop muted playsInline 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                />
                             ) : (
                                <img 
                                    src={config.about_section.image_url} 
                                    alt="About Us" 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                />
                             )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                        </div>
                        
                        {/* Floating Quote Card */}
                        <div className="absolute -bottom-[84px] -right-6 w-[90%] md:w-[400px] bg-slate-900/90 backdrop-blur-xl p-8 rounded-2xl ring-1 ring-white/10 shadow-2xl">
                            <Quote className="h-8 w-8 text-brand-400 mb-4 opacity-50" />
                            <p className="font-medium text-white text-lg italic mb-6 leading-relaxed">
                                {config.about_section.quote}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-brand-500/20 flex items-center justify-center ring-1 ring-brand-500/30 overflow-hidden">
                                    {config.about_section.quote_author_image ? (
                                        <img src={config.about_section.quote_author_image} alt="Author" className="w-full h-full object-cover"/>
                                    ) : (
                                        <span className="text-brand-400 font-bold text-xs">DM</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-wider">{config.about_section.quote_author}</p>
                                    <p className="text-xs text-slate-400">Founder, MWA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Text */}
                    <div className="pt-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-slate-300 bg-white/5 ring-1 ring-white/10 rounded-full mb-6">
                            <div className="h-1.5 w-1.5 rounded-full bg-brand-500"></div>
                            {config.about_section.subtitle}
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-semibold text-white mb-8 tracking-tight leading-tight">
                            {config.about_section.title}
                        </h2>
                        
                        <div className="space-y-6 mb-8 text-slate-300 text-lg leading-relaxed">
                           {/* Rendering personalizzato per migliore leggibilità */}
                           {config.about_section.text.split("\n\n").map((paragraph, index) => {
                               if (index === 0) {
                                   return <p key={index} className="text-xl text-brand-100 font-medium leading-relaxed">{paragraph}</p>;
                               }
                               if (paragraph.includes("fastidio")) {
                                   return <p key={index} className="border-l-2 border-slate-700 pl-4 italic text-slate-400 mt-6">{paragraph}</p>;
                               }
                               return <p key={index}>{paragraph}</p>;
                           })}
                        </div>

                        {config.about_section.mission_points && config.about_section.mission_points.length > 0 && (
                            <div className="bg-red-500/5 ring-1 ring-red-500/10 rounded-2xl p-6 mb-8">
                                <ul className="space-y-4">
                                    {config.about_section.mission_points.map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                                                <X className="w-3.5 h-3.5 text-red-400" />
                                            </div>
                                            <span className="text-slate-300">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <div className="flex gap-4 items-start pl-4 border-l-2 border-brand-500">
                            <div>
                                <h4 className="text-xl font-semibold text-white mb-2">Noi facciamo l’opposto.</h4>
                                <p className="text-slate-400 leading-relaxed">
                                    Con un metodo pratico e guidato, ti mostriamo come usare <strong className="text-white">Google AppSheet</strong> e gli strumenti migliori per dare vita alle tue idee, anche se parti da zero.
                                    <br/><br/>
                                    <span className="text-brand-300 font-medium">La nostra missione è offrirti competenze concrete, immediate e accessibili a tutti.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* --- HOW IT WORKS --- */}
      {config.how_it_works_section?.is_visible !== false && (
          <section className="py-24 bg-slate-900/50 border-t border-white/5 relative">
              <div className="max-w-7xl mx-auto px-6">
                  <div className="grid lg:grid-cols-12 gap-16 items-center">
                      <div className="lg:col-span-5">
                          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-brand-300 bg-brand-500/10 ring-1 ring-brand-500/20 rounded-full mb-8">
                              <Layout className="h-3 w-3" />
                              Process
                          </div>
                          <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tight leading-tight">
                              {config.how_it_works_section?.title}
                          </h2>
                          <p className="text-xl text-slate-400 leading-relaxed mb-12">
                              {config.how_it_works_section?.subtitle}
                          </p>

                          <div className="space-y-8">
                              {(config.how_it_works_section?.steps || []).map((step, idx) => {
                                  const IconComponent = IconMap[step.icon] || BookOpen;
                                  return (
                                      <div key={idx} className="flex items-start gap-6 group">
                                          <div className="relative flex-shrink-0">
                                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5 ring-1 ring-brand-500/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                  <span className="text-brand-400 font-bold text-lg">{idx + 1}</span>
                                              </div>
                                              {idx < 2 && <div className="absolute left-1/2 -translate-x-0.5 top-12 w-px h-16 bg-gradient-to-b from-brand-500/30 to-transparent"></div>}
                                          </div>
                                          <div className="pt-1">
                                              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                                                  {step.title}
                                                  <IconComponent className="h-4 w-4 text-slate-500" />
                                              </h3>
                                              <p className="text-slate-400 leading-relaxed text-sm">
                                                  {step.desc}
                                              </p>
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                      {/* Right Video area - replaced Mockup with Video Component */}
                      <div className="lg:col-span-7">
                          <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                               <video 
                                  src="https://res.cloudinary.com/dhj0ztos6/video/upload/v1765456382/come-funziona-MWA_mpdave.webm"
                                  autoPlay loop muted playsInline 
                                  className="absolute inset-0 w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
                               />
                               {/* Gradient Overlay on Video */}
                               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                               <div className="absolute bottom-2 left-3 right-3">
                                   <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                       <div className="flex items-center gap-3 mb-2">
                                           <div className="h-2 w-2 rounded-full bg-brand-400 animate-pulse"></div>
                                           <span className="text-xs text-brand-400 font-mono uppercase">IL TUO SUCCESSO</span>
                                       </div>
                                       <p className="text-sm text-slate-200">
                                           Diventa un professionista ricercato.
                                       </p>
                                   </div>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      )}

      {/* --- AI SHOWCASE (Horizontal Slider Ibrido) --- */}
      {config.ai_showcase_section?.is_visible !== false && (
          <section className="py-24 bg-slate-950 border-t border-white/5 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 mb-16">
                  <div className="grid lg:grid-cols-12 gap-16 items-center">
                      <div className="lg:col-span-5">
                          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-brand-300 bg-brand-500/10 ring-1 ring-brand-500/20 rounded-full mb-8">
                              <Monitor className="h-3 w-3" />
                              Showcase
                          </div>
                          <h2 className="text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tight leading-tight">
                              {config.ai_showcase_section?.title}
                          </h2>
                          <p className="text-xl text-slate-400 leading-relaxed mb-12 whitespace-pre-wrap">
                              {config.ai_showcase_section?.text}
                          </p>
                          
                          <div className="flex items-center gap-2 text-brand-400 text-sm font-bold animate-pulse">
                              <MoveHorizontal className="h-5 w-5" /> Scorri per esplorare
                          </div>
                          {!isMobileView && (
                              <div className="mt-2 flex items-center gap-2 text-slate-500 text-xs font-mono">
                                  <Laptop className="h-4 w-4" /> Modalità Desktop Attiva
                              </div>
                          )}
                      </div>
                      
                      {/* Description Panel */}
                      <div className="lg:col-span-7">
                          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                  <Sparkles className="h-5 w-5 text-brand-400" />
                                  Potenziale Illimitato
                              </h3>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {[
                                      "Creazione siti web professionali", "Landing page personalizzate", 
                                      "Piattaforme complesse & Portali", "E-commerce & Membership",
                                      "Automazioni & Ottimizzazioni", "Design Responsivi Moderni"
                                  ].map((item, idx) => (
                                      <li key={idx} className="flex items-center text-slate-300 text-sm">
                                          <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mr-3 shadow-[0_0_5px_#3b82f6]"></div>
                                          {item}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Slider Orizzontale Ibrido (Auto + Manual) */}
              <div 
                  className="w-full relative group"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onTouchStart={() => setIsPaused(true)}
                  onTouchEnd={() => setIsPaused(false)}
              >
                  {/* Fade Edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>
                  
                  <div 
                      ref={sliderRef}
                      className="flex gap-6 sm:gap-10 overflow-x-auto px-6 sm:px-24 pb-12 scrollbar-hide cursor-grab active:cursor-grabbing"
                  >
                      {/* Tripla duplicazione per loop infinito fluido */}
                      {[
                          ...(config.ai_showcase_section?.urls || []), 
                          ...(config.ai_showcase_section?.urls || []), 
                          ...(config.ai_showcase_section?.urls || [])
                      ].map((url, idx) => (
                          <WebsiteCard key={`${url}-${idx}`} url={url} index={idx} isMobileView={isMobileView} />
                      ))}
                  </div>
              </div>
          </section>
      )}

      {/* --- TARGET SECTION (Video Integration: Uomo Affari) --- */}
      <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
              
              <div className="text-center mb-16 relative z-10">
                  <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">Moise Web Academy È Perfetto Per Te Se...</h2>
              </div>

              <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Left Grid */}
                  <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                          { title: 'Sei un imprenditore', desc: 'Vuoi il tuo sito professionale senza spendere migliaia di euro.' },
                          { title: 'Cerchi un lavoro extra', desc: 'Offri servizi di creazione siti web e guadagna €1.000-5.000 per progetto.' },
                          { title: 'Sei un freelancer', desc: 'Aggiungi una competenza ad alto valore al tuo portfolio.' },
                          { title: 'Vuoi lanciare un progetto', desc: 'Realizza la tua idea (e-commerce, piattaforma) in autonomia.' },
                          { title: 'Parti da zero', desc: 'Non serve esperienza. Partiamo dalle basi assolute.' },
                          { title: 'Vuoi libertà', desc: 'Lavora da dove vuoi, quando vuoi, senza capi.' }
                      ].map((item, idx) => (
                          <div key={idx} className="bg-white/5 ring-1 ring-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors cursor-default">
                              <CheckCircle className="h-8 w-8 text-green-400 mb-4" />
                              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                          </div>
                      ))}
                  </div>

                  {/* Right Video Visual */}
                  <div className="lg:col-span-5 h-full min-h-[500px] relative rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                        <video 
                            src="https://res.cloudinary.com/dhj0ztos6/video/upload/v1765392297/uomo-affari-consegna-carta_f3tj6t.webm"
                            autoPlay loop muted playsInline 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>
                        
                        <div className="absolute bottom-2 left-3 right-3">
                            <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-2 w-2 rounded-full bg-brand-400 animate-pulse"></div>
                                    <span className="text-xs text-brand-400 font-mono uppercase">IL TUO SUCCESSO</span>
                                </div>
                                <p className="text-sm text-slate-200">
                                    Diventa un professionista ricercato.
                                </p>
                            </div>
                        </div>
                  </div>
              </div>

              <div className="mt-16 text-center">
                  <button 
                      onClick={handleNavigateToCourses}
                      className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-slate-900 bg-white hover:bg-slate-200 rounded-xl transition-all shadow-lg hover:shadow-white/10 group"
                  >
                      Questo Sono Io - Voglio Iniziare <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
              </div>
          </div>
      </section>

      {/* --- FILTER SECTION (Per chi NON è) --- */}
      <section className="py-24 bg-slate-900 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
                      Questo Corso NON È Per Te Se...
                  </h2>
                  <div className="w-24 h-1 bg-red-500/50 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-4">
                  {[
                      { title: 'Cerchi la bacchetta magica', desc: 'L\'AI è potentissima, ma devi imparare a usarla. Se cerchi “soldi facili” senza impegno, questo corso non fa per te.' },
                      { title: 'Vuoi che qualcuno faccia tutto al posto tuo', desc: 'Ti insegniamo a creare, non creiamo noi per te. Ti diamo la canna da pesca, non il pesce.' },
                      { title: 'Pensi che l\'AI faccia tutto da sola', desc: 'L’intelligenza artificiale va guidata con i prompt giusti. È come una Ferrari: se non sai guidare, non serve a nulla.' },
                      { title: 'Vuoi diventare un programmatore "classico"', desc: 'Se il tuo sogno è scrivere migliaia di righe di codice, questo non è il percorso giusto. Noi usiamo il Low-Code/No-Code.' },
                      { title: 'Non sei disposto a investire su te stesso', desc: 'Se non sei pronto a investire per acquisire una competenza che può farti guadagnare migliaia di euro, non sei pronto.' }
                  ].map((item, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors">
                          <div className="shrink-0 pt-1">
                              <XCircle className="h-6 w-6 text-red-400" />
                          </div>
                          <div>
                              <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                              <p className="text-slate-400 leading-relaxed text-sm">
                                  {item.desc}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>
              
              <div className="mt-12 p-6 bg-brand-500/10 border border-brand-500/20 rounded-xl text-center">
                  <p className="text-lg text-brand-200 font-medium">
                      Se invece ti riconosci nella sezione “Per Chi È”, allora sei nel posto giusto. Benvenuto! 👊
                  </p>
              </div>
          </div>
      </section>

      {/* --- COMPARISON SECTION --- */}
      {config.comparison_section?.is_visible !== false && (
         <section className="py-24 bg-slate-950 border-t border-white/5">
             <div className="max-w-7xl mx-auto px-6">
                 <div className="text-center max-w-4xl mx-auto mb-16">
                     <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">{config.comparison_section?.title || "La Tua Vita Prima e Dopo"}</h2>
                     <p className="text-xl text-slate-400">{config.comparison_section?.subtitle}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* BEFORE COLUMN */}
                     <div className="bg-red-950/20 rounded-3xl p-8 md:p-10 border border-red-500/10 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                         <h3 className="text-2xl font-bold text-red-400 mb-8 flex items-center">
                             <XCircle className="h-6 w-6 mr-3" />
                             {config.comparison_section?.before_title}
                         </h3>
                         <ul className="space-y-6">
                             {(config.comparison_section?.before_items || []).map((item, idx) => (
                                 <li key={idx} className="flex items-start gap-4 text-slate-400">
                                     <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                     <span className="leading-snug">{item}</span>
                                 </li>
                             ))}
                         </ul>
                     </div>

                     {/* AFTER COLUMN */}
                     <div className="bg-brand-900/20 rounded-3xl p-8 md:p-10 border border-brand-500/20 relative overflow-hidden transform md:-translate-y-4 shadow-2xl shadow-brand-900/20">
                         <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
                         <h3 className="text-2xl font-bold text-brand-400 mb-8 flex items-center">
                             <CheckCircle2 className="h-6 w-6 mr-3" />
                             {config.comparison_section?.after_title}
                         </h3>
                         <ul className="space-y-6">
                             {(config.comparison_section?.after_items || []).map((item, idx) => (
                                 <li key={idx} className="flex items-start gap-4 text-white font-medium">
                                     <Check className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
                                     <span className="leading-snug">{item}</span>
                                 </li>
                             ))}
                         </ul>
                     </div>
                 </div>
             </div>
         </section>
      )}

      {/* SECTION 3 - Testimonials */}
      {config.testimonials_section.is_visible && (
        <section className="py-24 bg-slate-900/50 border-t border-white/5">
             <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-slate-300 bg-white/5 ring-1 ring-white/10 rounded-full mb-6">
                        <MessageCircle className="h-3 w-3" />
                        {config.testimonials_section.subtitle}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight">
                        {config.testimonials_section.title}
                    </h2>
                    
                    <button 
                        onClick={() => setIsReviewModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 px-6 py-2.5 rounded-full font-medium text-sm transition-all"
                    >
                        <MessageCircle className="h-4 w-4" /> Lascia la tua recensione
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {config.testimonials_section.reviews.map((review, idx) => (
                         <div key={idx} className="bg-white/5 p-8 rounded-3xl ring-1 ring-white/10 hover:bg-white/10 transition-all flex flex-col h-full">
                             <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 ring-1 ring-white/20 flex-shrink-0">
                                    {review.avatar ? (
                                        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-lg">{review.name.charAt(0)}</div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{review.name}</h4>
                                    <p className="text-sm text-slate-400">{review.role}</p>
                                </div>
                             </div>
                             
                             <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-4 h-4 text-brand-400 fill-current" />
                                ))}
                             </div>

                             <p className="text-slate-300 text-base leading-relaxed mb-4 flex-grow">
                                "{review.text}"
                             </p>

                             {review.attachmentUrl && (
                                <div className="mt-4 rounded-xl overflow-hidden ring-1 ring-white/10 w-full bg-black/20">
                                    {isVideo(review.attachmentUrl) ? (
                                        review.attachmentUrl.includes('youtube') || review.attachmentUrl.includes('youtu.be') ? (
                                            <div className="aspect-video">
                                                <iframe 
                                                    src={review.attachmentUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                                                    className="w-full h-full" 
                                                    allowFullScreen 
                                                    title="Video Review"
                                                ></iframe>
                                            </div>
                                        ) : (
                                            <video src={review.attachmentUrl} controls className="w-full max-h-48 object-cover" />
                                        )
                                    ) : (
                                        <img src={review.attachmentUrl} alt="Review attachment" className="w-full h-48 object-cover opacity-80 hover:opacity-100 transition-opacity" />
                                    )}
                                </div>
                             )}
                         </div>
                    ))}
                </div>
             </div>
        </section>
      )}

      {/* --- REVIEW MODAL (Dark Theme) --- */}
      {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
              <div className="bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-white/10 overflow-hidden">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">Scrivi una Recensione</h3>
                      <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-white">
                          <X className="h-6 w-6" />
                      </button>
                  </div>
                  <form onSubmit={submitReview} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Il tuo Nome</label>
                          <input 
                              type="text" 
                              required
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-500 outline-none"
                              placeholder="Mario Rossi"
                              value={reviewForm.name}
                              onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Valutazione</label>
                          <div className="flex gap-2">
                              {[1,2,3,4,5].map(star => (
                                  <button 
                                    key={star} 
                                    type="button"
                                    onClick={() => setReviewForm({...reviewForm, rating: star})}
                                    className="focus:outline-none"
                                  >
                                      <Star className={`h-8 w-8 ${star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-slate-700'}`} />
                                  </button>
                              ))}
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">La tua esperienza</label>
                          <textarea 
                              required
                              rows={4}
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:ring-1 focus:ring-brand-500 outline-none resize-none"
                              placeholder="Raccontaci cosa ti è piaciuto del corso..."
                              value={reviewForm.text}
                              onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                          ></textarea>
                      </div>
                      
                      <div className="bg-brand-900/30 p-4 rounded-xl border border-brand-500/20 text-sm text-brand-200 flex gap-3">
                          <Upload className="h-5 w-5 flex-shrink-0" />
                          <p>Per allegare foto o video, inviali al nostro supporto WhatsApp dopo aver inviato la recensione testuale.</p>
                      </div>

                      <button type="submit" className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-500 transition-colors shadow-lg shadow-brand-500/20">
                          Invia Recensione
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* SECTION 4 - USP */}
      {config.usp_section.is_visible && (
          <section className="py-24 bg-slate-950 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-white mb-12 text-center tracking-tight">{config.usp_section.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {config.usp_section.items.map((item, idx) => (
                        <div key={idx} className="flex gap-6 p-6 rounded-2xl bg-white/5 ring-1 ring-white/5 hover:bg-white/10 transition-colors">
                            <div className="shrink-0">
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center ring-1 ring-green-500/30">
                                    <CheckCircle className="h-6 w-6 text-green-400" />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </section>
      )}

      {/* SECTION - FOUNDER STORY */}
      <section className="py-12 bg-slate-900 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6">
              <div 
                  onClick={() => setShowFounderStory(!showFounderStory)}
                  className="cursor-pointer bg-white/5 hover:bg-white/10 ring-1 ring-white/10 rounded-2xl p-6 md:p-8 flex items-center justify-between transition-all group"
              >
                  <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-brand-500/20 flex items-center justify-center ring-1 ring-brand-500/30 overflow-hidden">
                          <span className="font-bold text-brand-400 text-xl">DM</span>
                      </div>
                      <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-brand-400 transition-colors">
                              CHI SONO
                          </h2>
                          <p className="text-slate-400 text-sm font-medium">Scopri la storia del tuo istruttore</p>
                      </div>
                  </div>
                  <div className={`transform transition-transform duration-300 ${showFounderStory ? 'rotate-180' : ''}`}>
                      <ChevronDown className="h-8 w-8 text-slate-500 group-hover:text-brand-400" />
                  </div>
              </div>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFounderStory ? 'max-h-[2000px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
                  <div className="prose prose-lg prose-invert text-slate-300 leading-relaxed">
                      <p className="font-bold text-white text-xl mb-6">
                          Ciao, sono Daniel Moise, fondatore di Moise Web Academy.
                      </p>
                      <p className="mb-4">
                          Da diversi anni aiuto persone e aziende a portare i loro progetti online. Ho creato decine di siti web per clienti in tutta Italia, dall'e-commerce per un brand di moda al gestionale personalizzato per un AUTOFFICINA
                      </p>
                      <p className="mb-4">
                          Quando ho scoperto il potenziale dell'intelligenza artificiale per la creazione di siti web, ho capito subito che era una rivoluzione totale.
                      </p>
                      <p className="mb-4 font-medium text-white">
                          Quello che prima mi richiedeva giorni o settimane di lavoro, ora lo faccio in poche ore. E soprattutto: senza scrivere codice.
                      </p>
                      <p className="mb-4">
                          Ma c'era un problema.
                      </p>
                      <p className="mb-4">
                          Tutte le risorse erano in inglese, frammentate su mille piattaforme diverse, troppo tecniche per chi partiva da zero.
                      </p>
                      <p className="mb-8">
                          Così ho deciso di creare Moise Web Academy: il primo corso in italiano completo, passo-passo, che insegna a chiunque - anche senza alcuna esperienza - a creare siti web professionali usando l'intelligenza artificiale.
                      </p>

                      <div className="bg-brand-500/10 border-l-4 border-brand-500 p-6 rounded-r-xl mb-8">
                          <h3 className="flex items-center text-xl font-bold text-brand-300 mb-2">
                              <span className="text-2xl mr-2">🎯</span> La mia missione?
                          </h3>
                          <p className="text-brand-100">
                              Democratizzare la creazione web. Renderti autonomo. Darti una competenza ad alto valore che può cambiare concretamente la tua vita, sia che tu voglia risparmiare migliaia di euro per la tua attività, sia che tu voglia creare un business online da zero.
                          </p>
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/10">
                          <p className="mb-4">
                              Se sei arrivato fin qui, significa che sei pronto per il prossimo passo.
                          </p>
                          <p className="mb-4">
                              Non serve esperienza. Non serve saper programmare.
                              <br/>Serve solo la voglia di imparare e mettersi in gioco.
                          </p>
                          <p className="font-bold text-white text-xl">
                              Ci vediamo dentro il corso! 👊
                          </p>
                          <p className="text-slate-500 italic mt-2">
                              — Daniel
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* SECTION - GUARANTEE */}
      <section className="py-24 bg-slate-950 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="inline-block p-4 rounded-full bg-yellow-500/10 ring-1 ring-yellow-500/20 mb-6">
                  <ShieldCheck className="h-12 w-12 text-yellow-500" />
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 tracking-tight">
                  Garanzia Soddisfatti o Rimborsati 30 Giorni
              </h2>
              
              <p className="text-xl text-brand-400 font-bold mb-8">
                  Zero rischi per te. Tutto il vantaggio dalla tua parte.
              </p>

              <div className="text-lg text-slate-300 leading-relaxed mb-10">
                  <p className="mb-6 font-medium">
                      Siamo così sicuri che Moise Web Academy cambierà il tuo modo di vedere la creazione di siti web che ti offriamo una garanzia totale di 30 giorni.
                      <br/>Hai un mese intero per:
                  </p>
                  
                  <ul className="text-left max-w-lg mx-auto space-y-3 mb-8">
                      {['Seguire tutto il corso al tuo ritmo', 'Creare i tuoi primi progetti e testare ogni lezione', 'Mettere in pratica tutto ciò che impari', 'Vedere con i tuoi occhi i risultati'].map((item, idx) => (
                          <li key={idx} className="flex items-start">
                              <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                              <span className="font-medium">{item}</span>
                          </li>
                      ))}
                  </ul>

                  <p className="mb-4">
                      Se per QUALSIASI motivo non sei soddisfatto, ti rimborsiamo ogni centesimo. Nessuna domanda, nessuna giustificazione, nessuna discussione.
                  </p>
                  <p className="mb-8 font-bold text-white">
                      Basta una semplice email e riavrai indietro il 100% di quello che hai pagato.
                  </p>
              </div>

              <div className="bg-slate-900 ring-1 ring-white/10 rounded-2xl p-8 mb-10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-brand-500"></div>
                  <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">La nostra promessa</h3>
                  <p className="text-xl md:text-2xl text-brand-400 font-black italic">
                      "O impari a creare siti web professionali con l'AI, o non paghi nulla."
                  </p>
              </div>

              <div className="text-lg text-slate-400 mb-12 font-medium space-y-2">
                  <p>Semplice. Chiaro. Onesto.</p>
                  <p className="font-bold text-white">Zero rischi. Solo opportunità.</p>
                  <p className="text-slate-500 text-base pt-4">
                      L'unica cosa che puoi perdere è il tempo che passi a rimandarla a domani.
                  </p>
              </div>

              <button 
                  onClick={handleNavigateToCourses}
                  className="bg-brand-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-brand-50 transition-all shadow-xl shadow-brand-500/20 inline-flex items-center group transform hover:scale-105"
              >
                  ACCEDI ORA <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
      </section>

      {/* --- SECTION FAQ --- */}
      <section className="py-24 bg-slate-900/50 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 tracking-tight">
                      Domande Frequenti
                  </h2>
                  <p className="text-xl text-slate-400">
                      Tutte le risposte che cerchi prima di iniziare
                  </p>
              </div>

              <div className="space-y-4">
                  {FAQ_ITEMS.map((item, idx) => (
                      <div 
                          key={idx} 
                          className="bg-white/5 ring-1 ring-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10"
                      >
                          <button 
                              onClick={() => toggleFaq(idx)}
                              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                          >
                              <div className="flex items-start gap-4">
                                  <span className="text-2xl flex-shrink-0 select-none opacity-80">❓</span>
                                  <span className={`text-lg font-bold ${openFaqIndex === idx ? 'text-brand-400' : 'text-slate-200'}`}>
                                      {item.q}
                                  </span>
                              </div>
                              {openFaqIndex === idx ? (
                                  <ChevronUp className="h-5 w-5 text-brand-400 flex-shrink-0 ml-4" />
                              ) : (
                                  <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0 ml-4" />
                              )}
                          </button>
                          
                          {openFaqIndex === idx && (
                              <div className="px-6 pb-6 pl-16">
                                  <div className="text-slate-300 text-lg leading-relaxed border-l-2 border-brand-500/30 pl-4">
                                      {item.a}
                                  </div>
                              </div>
                          )}
                      </div>
                  ))}
              </div>

              <div className="mt-16 text-center">
                  <button 
                      onClick={handleNavigateToCourses}
                      className="bg-white text-slate-900 px-10 py-5 rounded-xl font-bold text-xl hover:bg-slate-200 transition-all shadow-lg hover:shadow-white/20 inline-flex items-center group transform hover:scale-105"
                  >
                      Ho Capito, Voglio Iniziare Ora →
                  </button>
              </div>
          </div>
      </section>

      {/* SECTION 7 - CTA FINALE */}
      {config.cta_section.is_visible && (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-600/20 backdrop-blur-3xl"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/30 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/30 rounded-full blur-[100px]"></div>
            
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                    {config.cta_section.title}
                </h2>
                <p className="text-xl md:text-2xl text-brand-100 mb-10 font-medium">
                    {config.cta_section.subtitle}
                </p>
                <div className="flex justify-center">
                    <button 
                        onClick={handleNavigateToCourses}
                        className="bg-white text-brand-900 px-10 py-5 rounded-xl font-bold text-xl hover:bg-brand-50 transition-all shadow-xl shadow-brand-500/20"
                    >
                        {config.cta_section.button_text}
                    </button>
                </div>
            </div>
        </section>
      )}

      {/* FOOTER */}
      {config.footer.is_visible && (
        <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8 text-sm font-sans text-slate-400">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                             <img 
                                src="https://res.cloudinary.com/dhj0ztos6/image/upload/v1764867375/mwa_trasparente_thl6fk.png" 
                                alt="MWA Logo" 
                                style={{ 
                                    height: `${config.footer.logo_height || 40}px`,
                                    marginTop: `${config.footer.logo_margin_top || 0}px`,
                                    marginBottom: `${config.footer.logo_margin_bottom || 0}px`,
                                    marginLeft: `${config.footer.logo_margin_left || 0}px`,
                                    marginRight: `${config.footer.logo_margin_right || 0}px`,
                                }}
                                className="w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <div>
                            <p className="font-semibold text-white text-base">Piattaforma sviluppata da</p>
                            <p className="text-brand-400 font-bold text-lg">Moise Web Srl</p>
                        </div>
                        <p className="text-xs text-slate-500 font-mono bg-white/5 inline-block px-2 py-1 rounded">P.IVA: RO50469659</p>
                        
                        <div className="flex gap-4 mt-4">
                            {config.footer.social_links?.facebook && (
                                <a href={config.footer.social_links.facebook} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-brand-600 hover:text-white transition-all"><Facebook className="h-4 w-4" /></a>
                            )}
                            {config.footer.social_links?.instagram && (
                                <a href={config.footer.social_links.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-brand-600 hover:text-white transition-all"><Instagram className="h-4 w-4" /></a>
                            )}
                            {config.footer.social_links?.linkedin && (
                                <a href={config.footer.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-brand-600 hover:text-white transition-all"><Linkedin className="h-4 w-4" /></a>
                            )}
                            {config.footer.social_links?.youtube && (
                                <a href={config.footer.social_links.youtube} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-brand-600 hover:text-white transition-all"><Youtube className="h-4 w-4" /></a>
                            )}
                        </div>
                    </div>

                    {/* Sedi Operative */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-6">Sedi Operative</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-3 group">
                                <div className="bg-white/5 p-2 rounded-lg text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                    <MapPin className="w-5 h-5 shrink-0" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-200 mb-1">1. Sede Legale</span>
                                    <span className="text-slate-500">București (RO)</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <div className="bg-white/5 p-2 rounded-lg text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                    <MapPin className="w-5 h-5 shrink-0" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-200 mb-1">2. Sede Secondaria</span>
                                    <span className="text-slate-500">Bergamo (BG)</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Contatti */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-6">Contatti</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                                <a href="tel:+393473127082" className="hover:text-brand-400 transition-colors font-medium">+39 347 312 7082</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                                <a href="tel:+393772334192" className="hover:text-brand-400 transition-colors font-medium">+39 377 233 4192</a>
                            </li>
                            <li className="flex items-center gap-3 pt-2">
                                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                                <a href="mailto:info@mwacademy.eu" className="hover:text-brand-400 transition-colors break-all">info.moisewebaccademy@gmail.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Supporto */}
                    <div>
                        <h3 className="font-bold text-white text-lg mb-6">Link Utili</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Tutti i Corsi</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Chi Siamo</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Termini & Condizioni</a></li>
                            <li><a href="#" className="hover:text-brand-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-600 text-xs">
                        &copy; {new Date().getFullYear()} Moise Web Academy. Tutti i diritti riservati.
                    </p>
                    <div className="flex gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                        <svg className="h-8" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.3 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.7 0 35 0Z" fill="#2563EB"/><path d="M12.5 10.5H16.5" stroke="white" strokeWidth="2"/><path d="M21.5 10.5H25.5" stroke="white" strokeWidth="2"/><circle cx="8" cy="12" r="3" fill="white" opacity="0.5"/><text x="14" y="16" fill="white" fontSize="8" fontWeight="bold">VISA</text></svg>
                        <svg className="h-8" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.3 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.7 0 35 0Z" fill="#111"/><circle cx="13" cy="12" r="6" fill="#EB001B"/><circle cx="25" cy="12" r="6" fill="#F79E1B" fillOpacity="0.8"/></svg>
                        <svg className="h-8" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M35 0H3C1.3 0 0 1.3 0 3V21C0 22.7 1.3 24 3 24H35C36.7 24 38 22.7 38 21V3C38 1.3 36.7 0 35 0Z" fill="white" stroke="#E5E7EB"/><path d="M10 7.5L14 7.5L12 17.5" fill="#253B80"/><path d="M22 7.5H18L16 17.5H19L22 7.5Z" fill="#179BD7"/><text x="24" y="16" fill="#253B80" fontSize="8" fontWeight="bold">PayPal</text></svg>
                    </div>
                </div>
            </div>
        </footer>
      )}
    </div>
  );
};
