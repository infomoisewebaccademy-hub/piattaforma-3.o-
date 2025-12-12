
export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration?: string;
  isFree?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  discounted_price?: number; // Prezzo per chi ha già acquistato
  image: string;
  features: string[];
  lessons: number;
  duration: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzato';
  videoUrl?: string; // Preview video
  lessons_content?: Lesson[]; // Nuova struttura dati
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  purchased_courses: string[]; // Array of Course IDs
}

// Configurazione Pre-Lancio Modificabile
export interface PreLaunchConfig {
  headline?: string; // Deprecato, mantenuto per compatibilità
  headline_solid: string; // Parte del titolo con colore fisso
  headline_gradient: string; // Parte del titolo con gradiente
  subheadline: string;
  description: string;
  offer_badge: string;
  offer_title: string;
  offer_text: string;
  cta_text: string;
  success_title: string;
  success_text: string;
  // Personalizzazione Colori
  title_color?: string;
  gradient_start?: string;
  gradient_end?: string;
  button_color?: string;
}

// Configurazione completa della Landing Page modificabile
export interface LandingPageConfig {
  announcement_bar: {
    text: string;
    is_visible: boolean;
    is_sticky?: boolean; // Nuova opzione per rendere l'avviso fisso allo scroll
    type: 'static' | 'marquee';
    bg_color: string;
    text_color: string;
  };
  hero: {
    title: string;
    subtitle: string;
    text?: string; // Added optional text field
    benefits?: string[]; // NUOVO: Lista vantaggi con spunta
    cta_primary: string;
    cta_secondary: string;
    image_url?: string; // Background o Side Image
    show_badges: boolean;
  };
  // NUOVA SEZIONE: La Nuova Era (AI)
  ai_era_section?: {
      title: string;
      subtitle: string;
      text: string;
      is_visible: boolean;
  };
  about_section: {
    title: string;
    subtitle: string;
    text: string;
    mission_points?: string[]; // NUOVO: Lista dei "Contro" (X rosse)
    image_url: string;
    quote: string;
    quote_author: string;
    quote_author_image?: string; // NUOVO: Immagine profilo autore
    quote_author_image_size?: number; // NUOVO: Dimensione immagine autore
    quote_author_image_offset_x?: number; // NUOVO: Spostamento X in px
    quote_author_image_offset_y?: number; // NUOVO: Spostamento Y in px
    quote_author_image_alignment?: 'flex-start' | 'center' | 'flex-end'; // NUOVO: Allineamento verticale flex
    quote_author_image_scale?: number; // NUOVO: Zoom immagine (1 = 100%)
    is_visible: boolean;
  };
  features_section: {
    title: string;
    subtitle: string;
    cards: Array<{ icon: string; title: string; desc: string }>;
    is_visible: boolean;
  };
  // NUOVA SEZIONE: Come Funziona (3 Step)
  how_it_works_section?: {
      title: string;
      subtitle: string;
      steps: Array<{ title: string; desc: string; icon: string }>;
      is_visible: boolean;
  };
  // NUOVA SEZIONE: AI Showcase (Siti Esempio)
  ai_showcase_section?: {
      title: string;
      subtitle: string;
      text: string;
      urls: string[];
      is_visible: boolean;
  };
  // NUOVA SEZIONE 7: Per Chi È (Target)
  for_whom_section?: {
      title: string;
      items: Array<{ title: string; desc: string }>;
      cta: string;
      is_visible: boolean;
  };
  target_section?: { // Added optional target section
    title: string;
    items: string[];
    is_visible: boolean;
  };
  process_section?: { // Added optional process section
    title: string;
    steps: Array<{ title: string; desc: string }>;
    is_visible: boolean;
  };
  // NUOVA SEZIONE: Comparison (Prima / Dopo)
  comparison_section?: {
      title: string;
      subtitle: string;
      before_title: string;
      after_title: string;
      before_items: string[];
      after_items: string[];
      is_visible: boolean;
  };
  // NUOVA SEZIONE 8: Per Chi NON È (Filtro)
  for_whom_not_section?: {
      title: string;
      items: Array<{ title: string; desc: string }>;
      conclusion?: string;
      is_visible: boolean;
  };
  testimonials_section: {
    title: string;
    subtitle: string;
    is_visible: boolean;
    reviews: Array<{ 
        name: string; 
        role: string; 
        text: string; 
        avatar?: string;
        attachmentUrl?: string; // NUOVO: URL Immagine o Video allegato alla recensione
    }>;
  };
  usp_section: {
    title: string;
    items: Array<{ title: string; desc: string }>;
    is_visible: boolean;
  };
  cta_section: {
    title: string;
    subtitle: string;
    button_text: string;
    is_visible: boolean;
  };
  footer: {
      text: string;
      copyright: string;
      is_visible: boolean;
      logo_height?: number; // Altezza logo footer
      logo_margin_top?: number;
      logo_margin_bottom?: number;
      logo_margin_left?: number;
      logo_margin_right?: number;
      social_links?: {      // Link Social opzionali
          facebook?: string;
          instagram?: string;
          linkedin?: string;
          youtube?: string;
      };
  }
}

export interface PlatformSettings {
  id: number;
  logo_height: number;
  logo_alignment?: 'left' | 'center';
  logo_margin_left?: number;
  meta_pixel_id?: string;
  font_family?: string; // Nuovo campo per il Font
  
  // Campi Pre-Launch
  is_pre_launch?: boolean;
  pre_launch_date?: string;
  pre_launch_config?: PreLaunchConfig; // NUOVO CAMPO JSON

  // Campi Legacy (mantenuti per retrocompatibilità, ma la logica si sposta su landing_page_config)
  home_hero_title?: string;
  home_hero_subtitle?: string;
  
  // Nuovo campo JSONB per la configurazione completa
  landing_page_config?: LandingPageConfig;
}

export enum AuthState {
  LOADING,
  AUTHENTICATED,
  UNAUTHENTICATED
}
