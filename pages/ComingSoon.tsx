
import React, { useState, useEffect } from 'react';
import { Timer, Mail, Zap, CheckCircle, Lock, Key, User, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { PreLaunchConfig } from '../types';

interface ComingSoonProps {
    launchDate?: string;
    config?: PreLaunchConfig;
}

// Configurazione di Default
const DEFAULT_CONFIG: PreLaunchConfig = {
    headline_solid: "CREA SITI E APP",
    headline_gradient: "CON L'INTELLIGENZA ARTIFICIALE",
    subheadline: "Dimentica HTML e CSS. Il futuro è qui.",
    description: "La prima accademia che ti insegna a costruire piattaforme digitali reali, e-commerce e SaaS sfruttando la potenza dell'AI. Non serve essere programmatori per realizzare la tua idea.",
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

const MAX_SPOTS = 25; // Numero massimo posti prioritari

export const ComingSoon: React.FC<ComingSoonProps> = ({ launchDate, config }) => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Stati per la gestione dei posti
    const [spotsTaken, setSpotsTaken] = useState<number>(0);
    const [userPosition, setUserPosition] = useState<number | null>(null);

    const text = { ...DEFAULT_CONFIG, ...config };
    const displaySolid = text.headline_solid || "CREA SITI E APP";
    const displayGradient = text.headline_gradient || "CON L'INTELLIGENZA ARTIFICIALE";

    // 1. Fetch iniziale dei posti occupati
    useEffect(() => {
        const fetchCount = async () => {
            const { count } = await supabase
                .from('waiting_list')
                .select('*', { count: 'exact', head: true });
            
            // Per simulare urgenza se il DB è vuoto, partiamo visivamente da 3 se count è 0, 
            // altrimenti usiamo il vero count. (Opzionale: rimuovi "|| 3" per usare solo dati reali)
            setSpotsTaken(count || 0);
        };
        
        fetchCount();
        
        // Polling ogni 30 secondi per aggiornare i posti
        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // 2. Countdown Timer
    useEffect(() => {
        const target = launchDate ? new Date(launchDate).getTime() : new Date().getTime() + 86400000 * 5; 

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = target - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [launchDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || !email.trim()) {
            alert("Inserisci tutti i campi.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Inseriamo e contiamo in che posizione siamo
            const { error } = await supabase.from('waiting_list').insert([{ email, full_name: fullName }]);
            
            if (error) {
                if (error.code === '23505') { // Unique violation (email già presente)
                     alert("Questa email è già in lista d'attesa!");
                     setIsSuccess(true);
                } else {
                    throw error;
                }
            } else {
                // Calcoliamo la posizione approssimativa (spotsTaken + 1)
                setUserPosition(spotsTaken + 1);
                setSpotsTaken(prev => prev + 1);
                setIsSuccess(true);
            }
        } catch (error: any) {
            alert("Errore: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calcolo Percentuale Barra
    const progressPercent = Math.min((spotsTaken / MAX_SPOTS) * 100, 100);
    const spotsRemaining = Math.max(0, MAX_SPOTS - spotsTaken);
    const isSoldOut = spotsTaken >= MAX_SPOTS;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden font-sans p-4">
            
            {/* Background Effects */}
            <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20"
                style={{ backgroundColor: text.gradient_start }}
            ></div>
            <div 
                className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-10"
                style={{ backgroundColor: text.gradient_end }}
            ></div>

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl w-full text-center">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-white/10 text-white/70 font-bold text-xs uppercase tracking-[0.2em] mb-8 animate-pulse shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <Lock className="h-3 w-3" /> Area Riservata
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 tracking-tight leading-tight uppercase">
                    <span style={{ color: text.title_color }}>
                        {displaySolid}
                    </span>
                    <br/>
                    <span 
                        className="text-transparent bg-clip-text"
                        style={{ backgroundImage: `linear-gradient(to right, ${text.gradient_start}, ${text.gradient_end})` }}
                    >
                        {displayGradient}
                    </span>
                </h1>

                <p className="text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed">
                    {text.description} <br/>
                    <span className="text-white font-bold">{text.subheadline}</span>
                </p>

                {/* Countdown */}
                <div className="flex flex-row justify-center gap-2 md:gap-8 max-w-3xl mx-auto mb-12 md:mb-16">
                    {[
                        { label: 'Giorni', value: timeLeft.days },
                        { label: 'Ore', value: timeLeft.hours },
                        { label: 'Minuti', value: timeLeft.minutes },
                        { label: 'Secondi', value: timeLeft.seconds }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-2 md:p-6 rounded-xl md:rounded-2xl flex flex-col items-center shadow-2xl min-w-[70px] md:min-w-[120px]">
                            <span className="text-2xl md:text-6xl font-black text-white font-mono">{String(item.value).padStart(2, '0')}</span>
                            <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mt-1 md:mt-2">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Offer Box */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:p-8 rounded-3xl border border-slate-700 shadow-2xl max-w-xl mx-auto relative overflow-hidden group text-left md:text-center">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl group-hover:bg-yellow-400/30 transition-all"></div>
                    
                    {!isSuccess ? (
                        <>
                            <div className="flex items-center justify-start md:justify-center gap-2 text-yellow-400 font-bold text-sm uppercase tracking-widest mb-2">
                                <Zap className="h-4 w-4 fill-current" /> {text.offer_badge}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{text.offer_title}</h3>
                            
                            {/* LIVE SPOTS COUNTER BAR */}
                            <div className="mb-6">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                    <span className={isSoldOut ? "text-red-400" : "text-green-400"}>
                                        {isSoldOut ? "Posti Prioritari Esauriti" : `${spotsRemaining} Posti Rimanenti`}
                                    </span>
                                    <span className="text-slate-500">{spotsTaken} / {MAX_SPOTS} Iscritti</span>
                                </div>
                                <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-white/10 relative">
                                    <div 
                                        className={`h-full transition-all duration-1000 ease-out ${isSoldOut ? 'bg-red-500' : 'bg-yellow-400 shadow-[0_0_15px_#facc15]'}`}
                                        style={{ width: `${progressPercent}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 text-left md:text-center">
                                    {isSoldOut 
                                        ? "Iscriviti comunque per ricevere l'avviso di lancio." 
                                        : "Iscriviti ora per assicurarti l'accesso prioritario."}
                                </p>
                            </div>

                            <p className="text-slate-300 mb-6 text-sm">
                                {text.offer_text}
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Nome e Cognome"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-10 pr-4 text-white placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="La tua email migliore"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-4 pl-10 pr-4 text-white placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    style={{ backgroundColor: text.button_color }}
                                    className="w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-wide mt-2"
                                >
                                    {isSubmitting ? 'Prenotazione in corso...' : text.cta_text}
                                </button>
                            </form>
                            <p className="text-[10px] text-slate-600 mt-4 text-center">Nessuno spam. Solo l'avviso di lancio.</p>
                        </>
                    ) : (
                        <div className="py-8 text-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{text.success_title}</h3>
                            
                            {/* Feedback Posizione */}
                            {userPosition && userPosition <= MAX_SPOTS ? (
                                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl mb-4 inline-block">
                                    <p className="text-yellow-300 font-bold flex items-center justify-center gap-2">
                                        <TrendingUp className="h-5 w-5" />
                                        Sei il numero #{userPosition} in lista!
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Hai bloccato ufficialmente il tuo posto prioritario.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-slate-700/30 p-4 rounded-xl mb-4 inline-block">
                                    <p className="text-slate-300 font-bold flex items-center justify-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-slate-400" />
                                        Sei in lista d'attesa standard.
                                    </p>
                                    <p className="text-slate-500 text-sm mt-1">
                                        I posti promozionali sono finiti, ma ti avviseremo appena apriamo!
                                    </p>
                                </div>
                            )}

                            <p className="text-slate-400 max-w-sm mx-auto">
                                {text.success_text}
                            </p>
                        </div>
                    )}
                </div>

            </div>

            {/* Footer Admin Link */}
            <div className="absolute bottom-4 right-4 z-50">
                <button 
                    onClick={() => navigate('/login')} 
                    className="flex items-center gap-2 p-2 text-xs font-bold uppercase tracking-widest text-slate-500 opacity-10 hover:opacity-100 hover:text-white transition-all duration-300"
                    title="Area Staff"
                >
                    <Key className="h-3 w-3" /> Area Riservata Staff
                </button>
            </div>
            
            <div className="absolute bottom-4 w-full text-center pointer-events-none opacity-30">
                 <div className="text-slate-600 text-[10px]">
                    &copy; {new Date().getFullYear()} Moise Web Academy
                </div>
            </div>
        </div>
    );
};
