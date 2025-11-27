import React, { useState, useEffect, useRef } from 'react';
import { ViewState, DailyLog, UserSettings, ShoppingItem } from './types';
import { GUIDE_CONTENT, RECIPES, SUBSTITUTIONS, DAILY_PLAN } from './constants';
import { 
  LayoutDashboard, 
  BookOpen, 
  Utensils, 
  Activity, 
  Menu, 
  X, 
  CheckCircle2, 
  Scale, 
  TrendingUp, 
  Moon,
  ChevronRight,
  Info,
  ArrowRight,
  BrainCircuit,
  Dna,
  Check,
  Calendar,
  ChevronDown,
  Lock,
  Flame,
  Sun,
  ShieldAlert,
  History,
  Trash2,
  ShoppingBasket,
  Plus,
  BarChart2,
  PartyPopper,
  Trash,
  LogOut,
  HelpCircle,
  FileText,
  RotateCcw
} from 'lucide-react';

// --- CONSTANTS FOR STORAGE ---
const STORAGE_KEYS = {
  THEME: 'keto_theme',
  SETTINGS: 'keto_settings',
  COMPLETED_DAYS: 'keto_completed_days',
  LOGS: 'keto_daily_logs',
  SHOPPING_LIST: 'keto_shopping_list'
};

// --- HELPER COMPONENT: TOAST NOTIFICATION ---
const Toast = ({ message, show, onClose }: { message: string, show: boolean, onClose: () => void }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-keto-dark dark:bg-keto-primary text-white px-6 py-3 rounded-full shadow-xl z-50 animate-bounce flex items-center gap-2">
      <CheckCircle2 className="w-5 h-5" />
      <span className="font-bold text-sm">{message}</span>
    </div>
  );
};

// --- HELPER COMPONENT: CONFETTI ---
const Confetti = ({ active }: { active: boolean }) => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        if (active) {
            const colors = ['#D97706', '#F59E0B', '#FEF3C7', '#ffffff', '#FFD700'];
            const newParticles = Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                left: Math.random() * 100 + 'vw',
                bg: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 2 + 's',
                duration: Math.random() * 2 + 3 + 's'
            }));
            setParticles(newParticles);
        } else {
            setParticles([]);
        }
    }, [active]);

    if (!active) return null;

    return (
        <>
            {particles.map(p => (
                <div 
                    key={p.id}
                    className="confetti"
                    style={{
                        left: p.left,
                        backgroundColor: p.bg,
                        animationDelay: p.delay,
                        animationDuration: p.duration
                    }}
                />
            ))}
        </>
    );
};

// --- HELPER COMPONENT: SIMPLE CHART ---
const SimpleChart = ({ data, dataKey, color, label }: { data: DailyLog[], dataKey: keyof DailyLog, color: string, label: string }) => {
    if (data.length < 2) return (
        <div className="h-40 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-white/10 text-gray-400 text-sm p-4 text-center">
            Adicione pelo menos 2 registros para ver o gráfico de {label}.
        </div>
    );

    const values = data.map(d => Number(d[dataKey]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1; // Avoid division by zero
    
    // SVG Dimensions
    const width = 100;
    const height = 50;
    const padding = 5;

    // Generate Points
    const points = values.map((val, i) => {
        const x = (i / (values.length - 1)) * (width - padding * 2) + padding;
        // Invert Y because SVG coordinates start from top
        const normalizedVal = (val - min) / range;
        const y = height - padding - (normalizedVal * (height - padding * 2)); 
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="bg-white dark:bg-keto-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
            <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2 text-sm">{label}</h4>
            <div className="relative w-full aspect-[2/1]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    {/* Grid lines */}
                    <line x1="0" y1={padding} x2={width} y2={padding} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                    <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                    <line x1="0" y1={height-padding} x2={width} y2={height-padding} stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
                    
                    {/* The Line */}
                    <polyline 
                        fill="none" 
                        stroke={color} 
                        strokeWidth="2" 
                        points={points} 
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    
                    {/* Dots */}
                    {values.map((val, i) => {
                        const x = (i / (values.length - 1)) * (width - padding * 2) + padding;
                        const normalizedVal = (val - min) / range;
                        const y = height - padding - (normalizedVal * (height - padding * 2));
                        return (
                            <circle key={i} cx={x} cy={y} r="1.5" fill={color} />
                        );
                    })}
                </svg>
                {/* Labels */}
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-bold">
                    <span>{data[0].displayDate.split(',')[0]}</span>
                    <span>{data[data.length-1].displayDate.split(',')[0]}</span>
                </div>
            </div>
        </div>
    );
};

// --- LEGAL MODAL ---
const LegalModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: 'terms' | 'privacy' }) => {
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-keto-dark w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-keto-cream">
                        {type === 'terms' ? 'Termos de Uso' : 'Política de Privacidade'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                        <X className="w-5 h-5 text-gray-500"/>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto text-sm text-gray-600 dark:text-gray-300 space-y-4">
                    {type === 'terms' ? (
                        <>
                            <p><strong>1. Isenção de Responsabilidade Médica:</strong> Este aplicativo e todo o seu conteúdo são fornecidos apenas para fins informativos e educacionais. Eles não substituem o aconselhamento, diagnóstico ou tratamento médico profissional. Nunca ignore o conselho médico profissional nem demore em procurá-lo por causa de algo que você leu neste aplicativo.</p>
                            <p><strong>2. Uso Pessoal:</strong> O acesso a este aplicativo é estritamente pessoal. O compartilhamento do link de acesso não é permitido.</p>
                            <p><strong>3. Resultados:</strong> Os resultados apresentados ou sugeridos podem variar de pessoa para pessoa, dependendo de fatores como idade, histórico de saúde, dedicação e genética. Não garantimos perda de peso específica.</p>
                        </>
                    ) : (
                        <>
                            <p><strong>1. Coleta de Dados:</strong> Coletamos apenas os dados fornecidos voluntariamente por você (peso, altura, registros diários) para o funcionamento das ferramentas do aplicativo. Esses dados são armazenados localmente no seu dispositivo e não são enviados para servidores externos.</p>
                            <p><strong>2. Segurança:</strong> Comprometemo-nos a proteger sua privacidade. Não vendemos, trocamos ou transferimos suas informações pessoais.</p>
                            <p><strong>3. Cookies:</strong> Utilizamos armazenamento local do navegador (LocalStorage) para salvar seu progresso e preferências de tema.</p>
                        </>
                    )}
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 rounded-b-2xl">
                    <button onClick={onClose} className="w-full py-3 bg-keto-primary text-white rounded-xl font-bold">Entendido</button>
                </div>
            </div>
        </div>
    );
};


// --- ONBOARDING COMPONENTS ---
const OnboardingQuiz = ({ onComplete }: { onComplete: (data: Partial<UserSettings>) => void }) => {
  const [step, setStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState("Iniciando protocolo...");

  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    dietType: 'mixed'
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      startAnalysis();
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    // Simulation
    const stages = [
      { p: 10, t: "Processando dados biométricos..." },
      { p: 30, t: "Calculando Taxa Metabólica Basal..." },
      { p: 50, t: "Ajustando macros para cetose..." },
      { p: 75, t: "Estruturando cronograma de 21 dias..." },
      { p: 90, t: "Otimizando plano de eletrólitos..." },
      { p: 100, t: "Protocolo pronto!" }
    ];

    let currentStage = 0;
    
    const interval = setInterval(() => {
      if (currentStage >= stages.length) {
        clearInterval(interval);
        setTimeout(() => {
           onComplete({
             name: formData.name,
             startingWeight: formData.weight,
             height: formData.height,
             activityLevel: formData.activityLevel,
             previousDiet: formData.dietType
           });
        }, 800);
        return;
      }
      
      setAnalysisProgress(stages[currentStage].p);
      setAnalysisText(stages[currentStage].t);
      currentStage++;
    }, 800);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-keto-cream dark:bg-keto-darker flex flex-col items-center justify-center p-6 text-center animate-fade-in transition-colors duration-500">
        <div className="w-24 h-24 bg-keto-light dark:bg-keto-primary/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
           <Flame className="w-12 h-12 text-keto-primary" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-keto-dark dark:text-keto-cream mb-2">Analisando Perfil</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 h-6">{analysisText}</p>
        
        <div className="w-full max-w-md bg-gray-200 dark:bg-stone-800 rounded-full h-4 mb-4 overflow-hidden">
           <div 
             className="bg-keto-primary h-4 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(217,119,6,0.5)]"
             style={{ width: `${analysisProgress}%` }}
           ></div>
        </div>
        <p className="text-xs text-gray-400">Baseado no Protocolo Científico de 21 Dias</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-keto-cream dark:bg-keto-darker flex flex-col items-center justify-center p-6 relative transition-colors duration-500">
      <div className="w-full max-w-lg bg-white dark:bg-keto-dark p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100 dark:bg-stone-800">
           <div className="h-full bg-keto-primary transition-all duration-300" style={{ width: `${((step + 1) / 4) * 100}%` }}></div>
        </div>

        <div className="mt-4 mb-8">
           <h1 className="text-2xl font-serif font-bold text-keto-dark dark:text-keto-cream mb-2">
             {step === 0 && "Vamos começar sua transformação"}
             {step === 1 && "Seus dados corporais"}
             {step === 2 && "Nível de atividade"}
             {step === 3 && "Hábitos alimentares"}
           </h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm">
             Passo {step + 1} de 4
           </p>
        </div>

        {step === 0 && (
          <div className="space-y-4 animate-fade-in">
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Como podemos te chamar?</label>
             <input 
               type="text" 
               value={formData.name} 
               onChange={(e) => setFormData({...formData, name: e.target.value})}
               placeholder="Seu nome"
               className="w-full p-4 border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-keto-primary outline-none text-lg bg-white dark:bg-stone-900 text-gray-800 dark:text-white placeholder-gray-400 transition-colors"
               autoFocus
             />
             <p className="text-xs text-gray-400">Isso será usado para personalizar seu plano.</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
             <div>
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Peso Atual (kg)</label>
               <input 
                 type="number" 
                 value={formData.weight} 
                 onChange={(e) => setFormData({...formData, weight: e.target.value})}
                 placeholder="Ex: 75"
                 className="w-full p-4 border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-keto-primary outline-none text-lg bg-white dark:bg-stone-900 text-gray-800 dark:text-white placeholder-gray-400 transition-colors"
               />
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Altura (cm)</label>
               <input 
                 type="number" 
                 value={formData.height} 
                 onChange={(e) => setFormData({...formData, height: e.target.value})}
                 placeholder="Ex: 170"
                 className="w-full p-4 border border-gray-300 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-keto-primary outline-none text-lg bg-white dark:bg-stone-900 text-gray-800 dark:text-white placeholder-gray-400 transition-colors"
               />
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 animate-fade-in">
             <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Como é sua rotina de exercícios?</p>
             {[
               { id: 'sedentary', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
               { id: 'light', label: 'Leve', desc: '1-3 dias por semana' },
               { id: 'moderate', label: 'Moderado', desc: '3-5 dias por semana' },
               { id: 'heavy', label: 'Intenso', desc: '6-7 dias por semana' }
             ].map((opt) => (
               <button 
                 key={opt.id}
                 onClick={() => setFormData({...formData, activityLevel: opt.id})}
                 className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${
                    formData.activityLevel === opt.id 
                    ? 'border-keto-primary bg-keto-light dark:bg-keto-primary/20 text-keto-dark dark:text-keto-cream' 
                    : 'border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 text-gray-700 dark:text-gray-300 bg-transparent'
                 }`}
               >
                 <div>
                   <div className="font-bold">{opt.label}</div>
                   <div className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</div>
                 </div>
                 {formData.activityLevel === opt.id && <Check className="w-5 h-5 text-keto-primary"/>}
               </button>
             ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 animate-fade-in">
             <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Como é sua alimentação atual?</p>
             {[
               { id: 'carbs', label: 'Rica em Carboidratos', desc: 'Pães, massas, doces frequentes' },
               { id: 'balanced', label: 'Balanceada', desc: 'Arroz, feijão, proteína e salada' },
               { id: 'lowcarb', label: 'Já tento Low Carb', desc: 'Evito açúcar, mas sem consistência' },
               { id: 'processed', label: 'Muitos Processados', desc: 'Fast food, congelados, snacks' }
             ].map((opt) => (
               <button 
                 key={opt.id}
                 onClick={() => setFormData({...formData, dietType: opt.id})}
                 className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${
                    formData.dietType === opt.id 
                    ? 'border-keto-primary bg-keto-light dark:bg-keto-primary/20 text-keto-dark dark:text-keto-cream' 
                    : 'border-gray-100 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30 text-gray-700 dark:text-gray-300 bg-transparent'
                 }`}
               >
                 <div>
                   <div className="font-bold">{opt.label}</div>
                   <div className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</div>
                 </div>
                 {formData.dietType === opt.id && <Check className="w-5 h-5 text-keto-primary"/>}
               </button>
             ))}
          </div>
        )}

        <button 
          onClick={handleNext}
          disabled={step === 0 && !formData.name || step === 1 && (!formData.weight || !formData.height)}
          className="mt-8 w-full bg-keto-primary text-white py-4 rounded-xl font-bold hover:bg-keto-accent dark:hover:bg-amber-600 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-keto-primary/20"
        >
          {step === 3 ? 'Gerar Meu Plano' : 'Próximo'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


// 1. Navigation Sidebar/Drawer
const Sidebar = ({ 
  currentView, 
  setView, 
  isOpen, 
  setIsOpen,
  isDarkMode,
  toggleTheme,
  resetApp,
  openLegal
}: { 
  currentView: ViewState; 
  setView: (v: ViewState) => void; 
  isOpen: boolean; 
  setIsOpen: (v: boolean) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  resetApp: () => void;
  openLegal: (type: 'terms' | 'privacy') => void;
}) => {
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => { setView(view); setIsOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg transition-all ${
        currentView === view 
          ? 'bg-keto-primary text-white shadow-md shadow-keto-primary/20' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-keto-light dark:hover:bg-keto-dark/50 hover:text-keto-dark dark:hover:text-keto-cream'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Content */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-keto-cream dark:bg-[#1a100a] border-r border-gray-200 dark:border-white/10 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-keto-primary to-keto-accent p-2 rounded-lg shadow-lg shadow-keto-primary/30">
                <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-serif text-lg font-bold text-keto-dark dark:text-keto-cream leading-tight">Keto<br/>Carnívora</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="px-4 py-6 space-y-2 flex-1">
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Meu Progresso" />
          <NavItem view={ViewState.GUIDE} icon={BookOpen} label="Guia & Ciência" />
          <NavItem view={ViewState.RECIPES} icon={Utensils} label="Receitas & Plano" />
          <NavItem view={ViewState.TRACKER} icon={Activity} label="Ferramentas" />
        </nav>

        <div className="px-4 space-y-2 mb-4">
             {/* Support Button (Hotmart requirement) */}
             <button 
                onClick={() => window.open('mailto:suporte@ketocarnivora.com')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
             >
                <HelpCircle className="w-5 h-5 text-keto-primary"/>
                <span className="font-semibold text-sm">Suporte</span>
             </button>

             <button 
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
             >
                {isDarkMode ? <Sun className="w-5 h-5 text-keto-primary"/> : <Moon className="w-5 h-5"/>}
                <span className="font-semibold text-sm">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
             </button>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 space-y-3">
             <div className="flex justify-between">
                <button onClick={() => openLegal('terms')} className="hover:text-keto-primary">Termos</button>
                <button onClick={() => openLegal('privacy')} className="hover:text-keto-primary">Privacidade</button>
             </div>
             <button 
                onClick={resetApp}
                className="flex items-center gap-2 text-red-400 hover:text-red-500"
             >
                <RotateCcw className="w-3 h-3"/> Reiniciar App
             </button>
        </div>
      </div>
    </>
  );
};

const Dashboard = ({ settings, completedDays, toggleDay }: { settings: UserSettings, completedDays: number[], toggleDay: (day: number) => void }) => {
    const totalDays = 21;
    const daysDoneCount = completedDays.length;
    const progress = Math.min(100, (daysDoneCount / totalDays) * 100);
    const currentFocusDayNum = DAILY_PLAN.find(d => !completedDays.includes(d.day))?.day || (daysDoneCount === 21 ? 21 : 1);
    const todayGuidance = DAILY_PLAN.find(d => d.day === currentFocusDayNum)!;
    const TodayIcon = todayGuidance.icon;
    const isTodayDone = completedDays.includes(currentFocusDayNum);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);
    const toggleExpand = (day: number) => { if (expandedDay === day) { setExpandedDay(null); } else { setExpandedDay(day); } }

    return (
        <div className="space-y-8 animate-fade-in">
           <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
            <h2 className="text-3xl font-serif font-bold text-keto-dark dark:text-keto-cream">Olá, {settings.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                <Calendar className="w-4 h-4 text-keto-primary"/>
                <span>{daysDoneCount} de {totalDays} dias concluídos</span>
            </div>
            </div>
           </header>
           {/* Progress Bar */}
           <div>
                <div className="w-full bg-gray-200 dark:bg-stone-800 rounded-full h-3">
                    <div className="bg-gradient-to-r from-keto-primary to-keto-accent h-3 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
           </div>

           {!completedDays.includes(21) && (
             <div className="bg-white dark:bg-keto-dark rounded-3xl shadow-xl overflow-hidden ring-4 ring-keto-light/30 dark:ring-keto-primary/10">
                <div className="bg-keto-dark dark:bg-black text-white p-6 relative">
                     <div className="flex items-start gap-4 relative z-10">
                        <TodayIcon className="w-8 h-8 text-keto-primary" />
                        <div>
                            <span className="bg-keto-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{todayGuidance.phase}</span>
                            <h3 className="text-2xl font-serif font-bold text-white mt-1">{todayGuidance.title}</h3>
                        </div>
                     </div>
                </div>
                <div className="p-6">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{todayGuidance.action}</p>
                    <button 
                        onClick={() => toggleDay(todayGuidance.day)}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${isTodayDone ? 'bg-green-100 text-green-800' : 'bg-keto-primary text-white'}`}
                    >
                        {isTodayDone ? 'Concluído' : 'Marcar como Feito'}
                    </button>
                </div>
             </div>
           )}

           {/* Full List Logic */}
           <div className="bg-white dark:bg-keto-dark rounded-2xl border border-gray-200 dark:border-white/5 divide-y divide-gray-100 dark:divide-white/5">
                {DAILY_PLAN.map((day) => (
                    <div key={day.day} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer" onClick={() => toggleExpand(day.day)}>
                         <button onClick={(e) => { e.stopPropagation(); toggleDay(day.day); }} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${completedDays.includes(day.day) ? 'bg-keto-primary border-keto-primary text-white' : 'border-gray-300'}`}>
                            <Check className="w-3 h-3" />
                         </button>
                         <div className="flex-1">
                             <div className="text-xs font-bold text-keto-primary">DIA {day.day}</div>
                             <div className="font-bold text-gray-900 dark:text-gray-100">{day.title}</div>
                         </div>
                         <ChevronDown className={`w-4 h-4 text-gray-400 ${expandedDay === day.day ? 'rotate-180' : ''}`} />
                    </div>
                ))}
           </div>
        </div>
    );
};

const RecipesView = ({ shoppingList, addToShoppingList, toggleShoppingItem, clearShoppingList }: any) => {
    const [filter, setFilter] = useState('Todos');
    const filtered = filter === 'Todos' ? RECIPES : RECIPES.filter(r => r.category === filter);
    return (
        <div className="space-y-6">
             {shoppingList.length > 0 && (
                 <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                    <div className="flex justify-between mb-2">
                        <h3 className="font-bold text-amber-900 dark:text-amber-200 flex gap-2"><ShoppingBasket className="w-4 h-4"/> Lista ({shoppingList.length})</h3>
                        <button onClick={clearShoppingList} className="text-xs text-red-500"><Trash2 className="w-3 h-3"/></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {shoppingList.map((i: any) => (
                            <div key={i.id} onClick={() => toggleShoppingItem(i.id)} className={`text-sm cursor-pointer ${i.checked ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{i.name}</div>
                        ))}
                    </div>
                 </div>
             )}
             <div className="flex gap-2 overflow-x-auto pb-2">
                 {['Todos', 'Café da Manhã', 'Almoço', 'Jantar'].map(f => (
                     <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-bold ${filter === f ? 'bg-keto-primary text-white' : 'bg-gray-100 dark:bg-white/10'}`}>{f}</button>
                 ))}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {filtered.map(r => (
                     <div key={r.id} className="bg-white dark:bg-keto-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                         <h3 className="font-bold text-lg dark:text-white">{r.title}</h3>
                         <div className="text-xs text-gray-500 uppercase font-bold mb-2">{r.category}</div>
                         <ul className="text-sm list-disc pl-4 text-gray-600 dark:text-gray-300 mb-4">
                             {r.ingredients.slice(0, 3).map((ing, idx) => <li key={idx}>{ing}</li>)}
                         </ul>
                         <button onClick={() => addToShoppingList(r.ingredients)} className="w-full py-2 bg-gray-50 dark:bg-white/5 text-xs font-bold rounded flex items-center justify-center gap-2"><Plus className="w-3 h-3"/> Add à Lista</button>
                     </div>
                 ))}
             </div>
        </div>
    )
};

const GuideView = () => {
    const [active, setActive] = useState(GUIDE_CONTENT[0].id);
    const content = GUIDE_CONTENT.find(c => c.id === active);
    return (
        <div className="flex flex-col md:flex-row gap-6 h-full">
            <div className="w-full md:w-1/3 flex flex-col gap-2">
                {GUIDE_CONTENT.map(c => (
                    <button key={c.id} onClick={() => setActive(c.id)} className={`p-4 rounded-xl text-left border ${active === c.id ? 'border-keto-primary bg-white dark:bg-keto-dark' : 'border-transparent'}`}>{c.title}</button>
                ))}
            </div>
            <div className="w-full md:w-2/3 bg-white dark:bg-keto-dark p-6 rounded-2xl border border-gray-100 dark:border-white/5 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 dark:text-white">{content?.title}</h2>
                <div className="prose dark:prose-invert">{content?.content}</div>
            </div>
        </div>
    )
};

const TrackerView = ({ dayLogs, addLog, deleteLog, userSettings }: any) => {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-keto-dark p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                <h3 className="font-bold mb-4 dark:text-white">Registrar Dia</h3>
                <button onClick={() => addLog({id: Date.now().toString(), date: new Date().toISOString(), displayDate: new Date().toLocaleDateString(), energy: 8, weight: userSettings.startingWeight || '75', sleep: '8'})} className="bg-keto-primary text-white px-4 py-2 rounded-lg">Simular Registro (Hoje)</button>
            </div>
            <div className="space-y-4">
                <SimpleChart data={dayLogs} dataKey="energy" color="#D97706" label="Energia" />
                <SimpleChart data={dayLogs} dataKey="weight" color="#78716c" label="Peso" />
            </div>
            <div className="space-y-2">
                <h4 className="font-bold text-gray-500 text-sm uppercase">Histórico</h4>
                {dayLogs.length === 0 && <p className="text-gray-400 text-sm">Nenhum registro ainda.</p>}
                {dayLogs.map((log: DailyLog) => (
                    <div key={log.id} className="flex justify-between items-center bg-white dark:bg-keto-dark p-3 rounded-lg border border-gray-100 dark:border-white/5">
                        <span className="text-sm font-bold dark:text-gray-300">{log.displayDate}</span>
                        <div className="flex gap-4 text-xs text-gray-500">
                             <span>⚡ {log.energy}/10</span>
                             <span>⚖️ {log.weight}kg</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

// --- MAIN APP ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, show: boolean}>({message: '', show: false});
  const [showConfetti, setShowConfetti] = useState(false);
  
  // -- STATE INITIALIZATION WITH LOCAL STORAGE --
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (saved) return JSON.parse(saved);
    }
    return { name: "", startDate: new Date().toISOString(), currentDay: 1 };
  });

  const [completedDays, setCompletedDays] = useState<number[]>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem(STORAGE_KEYS.COMPLETED_DAYS);
          if (saved) return JSON.parse(saved);
      }
      return [];
  });

  const [dayLogs, setDayLogs] = useState<DailyLog[]>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
          if (saved) return JSON.parse(saved);
      }
      return [];
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
        if (saved) return JSON.parse(saved);
    }
    return [];
  });

  const [legalModal, setLegalModal] = useState<{isOpen: boolean, type: 'terms' | 'privacy'}>({isOpen: false, type: 'terms'});

  // -- EFFECTS --

  useEffect(() => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_DAYS, JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(dayLogs));
  }, [dayLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
      if (showConfetti) {
          const timer = setTimeout(() => setShowConfetti(false), 4000);
          return () => clearTimeout(timer);
      }
  }, [showConfetti]);

  // -- HANDLERS --

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const showToast = (message: string) => setToast({ message, show: true });

  const handleOnboardingComplete = (data: Partial<UserSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...data,
      name: data.name || "Visitante"
    }));
    setShowConfetti(true);
    showToast("Perfil criado com sucesso!");
    setView(ViewState.DASHBOARD);
  };

  const toggleDayCompletion = (day: number) => {
      setCompletedDays(prev => {
          if (prev.includes(day)) {
              return prev.filter(d => d !== day);
          } else {
              showToast(`Dia ${day} concluído!`);
              setShowConfetti(true);
              return [...prev, day];
          }
      });
  };

  const handleAddLog = (log: DailyLog) => {
      setDayLogs(prev => [...prev, log]);
      showToast("Registro salvo!");
  };

  const handleDeleteLog = (id: string) => {
      if(confirm("Deseja apagar este registro?")) {
        setDayLogs(prev => prev.filter(l => l.id !== id));
      }
  };

  const handleResetApp = () => {
      if(confirm("ATENÇÃO: Isso apagará todo o seu progresso, nome e configurações. Deseja recomeçar do zero?")) {
        localStorage.clear();
        window.location.reload();
      }
  };

  const addToShoppingList = (items: string[]) => {
      const newItems = items.map(i => ({
          id: Date.now() + Math.random().toString(),
          name: i,
          checked: false
      }));
      setShoppingList(prev => [...prev, ...newItems]);
      showToast(`${items.length} itens adicionados à lista!`);
  };

  const toggleShoppingItem = (id: string) => {
      setShoppingList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const clearShoppingList = () => {
      if(confirm("Limpar toda a lista de compras?")) {
          setShoppingList([]);
      }
  };

  // -- RENDER --

  // Onboarding Guard (If no name set, force onboarding)
  if (!settings.name) {
    return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-keto-cream dark:bg-keto-darker transition-colors duration-300 flex text-gray-800 dark:text-gray-200 font-sans overflow-x-hidden">
      <Toast message={toast.message} show={toast.show} onClose={() => setToast(prev => ({...prev, show: false}))} />
      <Confetti active={showConfetti} />
      <LegalModal isOpen={legalModal.isOpen} onClose={() => setLegalModal({...legalModal, isOpen: false})} type={legalModal.type} />
      
      <Sidebar 
        currentView={view} 
        setView={setView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        resetApp={handleResetApp}
        openLegal={(type) => setLegalModal({isOpen: true, type})}
      />

      <main className="flex-1 lg:ml-64 relative flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 bg-white dark:bg-keto-dark shadow-sm flex items-center justify-between sticky top-0 z-30 transition-colors border-b border-gray-100 dark:border-white/5">
          <h1 className="font-serif font-bold text-xl text-keto-dark dark:text-keto-cream flex items-center gap-2">
            <Flame className="w-5 h-5 text-keto-primary"/> Keto 21
          </h1>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg">
                 {isDarkMode ? <Sun className="w-6 h-6"/> : <Moon className="w-6 h-6"/>}
            </button>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg">
                <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full flex-1">
          {view === ViewState.DASHBOARD && <Dashboard settings={settings} completedDays={completedDays} toggleDay={toggleDayCompletion} />}
          {view === ViewState.GUIDE && <GuideView />}
          {view === ViewState.RECIPES && <RecipesView shoppingList={shoppingList} addToShoppingList={addToShoppingList} toggleShoppingItem={toggleShoppingItem} clearShoppingList={clearShoppingList} />}
          {view === ViewState.TRACKER && <TrackerView dayLogs={dayLogs} addLog={handleAddLog} deleteLog={handleDeleteLog} userSettings={settings} />}
        </div>

        <footer className="p-6 bg-white dark:bg-keto-dark border-t border-gray-200 dark:border-white/5 mt-auto transition-colors">
          <div className="max-w-5xl mx-auto text-xs text-gray-500 dark:text-gray-400">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                 <p className="font-bold flex items-center gap-1 text-keto-primary"><ShieldAlert className="w-3 h-3"/> AVISO LEGAL:</p>
                 <div className="flex gap-4">
                     <button onClick={() => setLegalModal({isOpen: true, type: 'terms'})} className="hover:text-keto-primary underline">Termos de Uso</button>
                     <button onClick={() => setLegalModal({isOpen: true, type: 'privacy'})} className="hover:text-keto-primary underline">Privacidade</button>
                 </div>
             </div>
             <p className="text-center md:text-left">Este guia é apenas informativo e não substitui orientação médica profissional. Consulte um médico antes de iniciar. Produto comercializado com apoio da Hotmart. A Hotmart não faz controle editorial prévio dos produtos comercializados.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;