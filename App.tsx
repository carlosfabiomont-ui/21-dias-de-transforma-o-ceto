import React, { useState, useEffect, useRef } from 'react';
import { ViewState, DailyLog, UserSettings, ShoppingItem, DailyGuidance } from './types';
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
  RotateCcw,
  Coffee,
  Dumbbell,
  MousePointerClick
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
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-keto-dark dark:bg-keto-primary text-white px-6 py-3 rounded-full shadow-xl z-[60] animate-bounce flex items-center gap-2">
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
        <div className="h-40 flex flex-col items-center justify-center bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-white/10 text-gray-400 text-sm p-4 text-center">
            <BarChart2 className="w-8 h-8 mb-2 opacity-50"/>
            <p>Registre pelo menos 2 dias para ver o gráfico de {label}.</p>
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


// --- DAY DETAIL MODAL ---
const DayDetailModal = ({ dayData, isOpen, onClose, isCompleted, onToggle }: { dayData: DailyGuidance, isOpen: boolean, onClose: () => void, isCompleted: boolean, onToggle: (day: number) => void }) => {
  if (!isOpen) return null;
  const Icon = dayData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
        <div className="bg-white dark:bg-[#1a100a] w-full max-w-lg h-[95vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-keto-primary p-6 text-white relative shrink-0">
                 <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
                     <X className="w-6 h-6"/>
                 </button>
                 <div className="flex items-center gap-3 mb-2 opacity-90">
                     <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-2 py-1 rounded">Dia {dayData.day}</span>
                     <span className="text-xs font-bold uppercase tracking-wider">{dayData.phase}</span>
                 </div>
                 <h2 className="text-2xl font-serif font-bold flex items-center gap-2 pr-8 leading-tight">
                    <Icon className="w-6 h-6 shrink-0"/> {dayData.title}
                 </h2>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {/* Main Action */}
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2 text-lg">
                        <CheckCircle2 className="w-6 h-6 text-keto-primary"/> Missão de Hoje
                    </h3>
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border-l-4 border-keto-primary">
                        <p className="text-gray-800 dark:text-gray-200 font-medium text-lg leading-relaxed">
                            {dayData.action}
                        </p>
                    </div>
                </div>

                {/* The "Why" Section */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                     <h4 className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-200 mb-2 text-sm uppercase tracking-wide">
                        <Info className="w-4 h-4"/> Por que isso funciona?
                     </h4>
                     <p className="text-sm text-blue-800 dark:text-blue-100 leading-relaxed">
                        {dayData.why}
                     </p>
                </div>

                {/* Meal Plan */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-keto-primary"/> Cardápio Sugerido
                    </h3>
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl space-y-4 border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><Coffee className="w-3 h-3"/> Café da Manhã</span>
                            <span className="text-base text-gray-800 dark:text-gray-200 font-medium">{dayData.mealPlan.breakfast}</span>
                        </div>
                        <div className="h-px bg-gray-200 dark:bg-white/10 w-full"/>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><Utensils className="w-3 h-3"/> Almoço</span>
                            <span className="text-base text-gray-800 dark:text-gray-200 font-medium">{dayData.mealPlan.lunch}</span>
                        </div>
                        <div className="h-px bg-gray-200 dark:bg-white/10 w-full"/>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1"><Moon className="w-3 h-3"/> Jantar</span>
                            <span className="text-base text-gray-800 dark:text-gray-200 font-medium">{dayData.mealPlan.dinner}</span>
                        </div>
                    </div>
                </div>

                {/* Exercise */}
                <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10">
                     <h4 className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300 mb-1 text-sm uppercase">
                        <Dumbbell className="w-4 h-4"/> Movimento
                     </h4>
                     <p className="font-medium text-gray-900 dark:text-white">
                        {dayData.exercise}
                     </p>
                </div>

            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 shrink-0 pb-safe">
                <button 
                    onClick={() => { onToggle(dayData.day); onClose(); }}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${isCompleted ? 'bg-green-500 text-white' : 'bg-keto-primary text-white hover:bg-keto-accent'}`}
                >
                    {isCompleted ? (
                        <>
                            <Check className="w-6 h-6"/> Dia Concluído!
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-6 h-6"/> Concluir Missão de Hoje
                        </>
                    )}
                </button>
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
             {step === 0 && "Vamos começar"}
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


// 1. Navigation Sidebar (Desktop) & Bottom Nav (Mobile)

const MobileBottomNav = ({ currentView, setView }: { currentView: ViewState, setView: (v: ViewState) => void }) => {
    const NavButton = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
        <button 
            onClick={() => setView(view)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all w-full ${currentView === view ? 'text-keto-primary bg-keto-primary/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
        >
            <Icon className={`w-6 h-6 mb-1 ${currentView === view ? 'fill-current' : ''}`} strokeWidth={currentView === view ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wide">{label}</span>
        </button>
    );

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-keto-darker border-t border-gray-200 dark:border-white/10 px-4 py-2 pb-safe flex justify-between items-center z-40 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <NavButton view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Hoje" />
            <NavButton view={ViewState.RECIPES} icon={Utensils} label="Comer" />
            <NavButton view={ViewState.TRACKER} icon={Activity} label="Diário" />
            <NavButton view={ViewState.GUIDE} icon={BookOpen} label="Guia" />
        </div>
    );
};

const Sidebar = ({ 
  currentView, 
  setView, 
  isDarkMode, 
  toggleTheme, 
  resetApp,
  openLegal
}: { 
  currentView: ViewState; 
  setView: (v: ViewState) => void; 
  isDarkMode: boolean;
  toggleTheme: () => void;
  resetApp: () => void;
  openLegal: (type: 'terms' | 'privacy') => void;
}) => {
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => setView(view)}
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
      <div className={`
        hidden lg:flex fixed top-0 left-0 h-full w-64 bg-keto-cream dark:bg-[#1a100a] border-r border-gray-200 dark:border-white/10 z-50 flex-col shadow-2xl
      `}>
        <div className="p-8 flex items-center gap-3">
            <div className="bg-gradient-to-br from-keto-primary to-keto-accent p-2 rounded-lg shadow-lg shadow-keto-primary/30">
                <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-serif text-xl font-bold text-keto-dark dark:text-keto-cream leading-tight">Keto<br/>Carnívora</h1>
        </div>
        
        <nav className="px-4 py-4 space-y-2 flex-1">
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Hoje" />
          <NavItem view={ViewState.RECIPES} icon={Utensils} label="Receitas" />
          <NavItem view={ViewState.TRACKER} icon={Activity} label="Meu Diário" />
          <NavItem view={ViewState.GUIDE} icon={BookOpen} label="Manual Keto" />
        </nav>

        <div className="px-4 space-y-2 mb-4">
             <button 
                onClick={() => window.open('mailto:contato@ketocarnivoro.com')}
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
    
    // Modal State
    const [selectedDay, setSelectedDay] = useState<DailyGuidance | null>(null);

    return (
        <div className="space-y-8 animate-fade-in pb-24 lg:pb-10">
           {selectedDay && (
             <DayDetailModal 
                dayData={selectedDay} 
                isOpen={!!selectedDay} 
                onClose={() => setSelectedDay(null)} 
                isCompleted={completedDays.includes(selectedDay.day)}
                onToggle={toggleDay}
             />
           )}

           <header className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <h2 className="text-3xl font-serif font-bold text-keto-dark dark:text-keto-cream">Olá, {settings.name}</h2>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-keto-primary">{daysDoneCount}</span>
                        <span className="text-sm text-gray-400 font-bold uppercase">/21 dias</span>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-stone-800 rounded-full h-3">
                    <div className="bg-gradient-to-r from-keto-primary to-keto-accent h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
                {daysDoneCount === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        💪 Toque no card abaixo para começar sua primeira missão!
                    </p>
                )}
           </header>

           {/* TODAY'S MISSION CARD */}
           {!completedDays.includes(21) && (
             <div className="relative group">
                 {/* Pulsing effect behind the card if it's not done */}
                {!isTodayDone && <div className="absolute -inset-1 bg-keto-primary/20 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>}
                
                <div className="bg-white dark:bg-keto-dark rounded-3xl shadow-xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 cursor-pointer transition-transform hover:scale-[1.01] relative" onClick={() => setSelectedDay(todayGuidance)}>
                    <div className="bg-keto-dark dark:bg-black text-white p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                            <TodayIcon className="w-32 h-32" />
                        </div>
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="bg-keto-primary/20 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                <TodayIcon className="w-8 h-8 text-keto-primary" />
                            </div>
                            <div>
                                <span className="bg-keto-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Fase: {todayGuidance.phase}</span>
                                <h3 className="text-2xl font-serif font-bold text-white mt-1 leading-tight">Dia {todayGuidance.day}: {todayGuidance.title}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="mb-6">
                            <h4 className="font-bold text-gray-400 text-xs uppercase mb-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Sua Missão Hoje</h4>
                            <p className="text-lg text-gray-800 dark:text-gray-200 leading-snug font-medium">{todayGuidance.action}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Almoço</div>
                                <div className="text-sm font-semibold dark:text-gray-200 line-clamp-2 leading-tight">{todayGuidance.mealPlan.lunch}</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Treino</div>
                                <div className="text-sm font-semibold dark:text-gray-200 line-clamp-2 leading-tight">{todayGuidance.exercise}</div>
                            </div>
                        </div>

                        <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedDay(todayGuidance); }}
                            className="w-full py-4 bg-keto-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-keto-accent transition-colors shadow-lg shadow-keto-primary/20 animate-bounce-short"
                        >
                            <MousePointerClick className="w-5 h-5"/> Toque para Ver a Missão
                        </button>
                    </div>
                </div>
             </div>
           )}

           {/* Full Journey List */}
           <div>
               <h3 className="font-serif font-bold text-xl text-keto-dark dark:text-keto-cream mb-4 flex items-center gap-2">
                   <BookOpen className="w-5 h-5"/> Sua Jornada
               </h3>
               <div className="bg-white dark:bg-keto-dark rounded-2xl border border-gray-200 dark:border-white/5 divide-y divide-gray-100 dark:divide-white/5 shadow-sm">
                    {DAILY_PLAN.map((day) => {
                        const isDone = completedDays.includes(day.day);
                        const isLocked = day.day > currentFocusDayNum && !isDone;
                        const isCurrent = day.day === currentFocusDayNum;
                        
                        return (
                            <div 
                                key={day.day} 
                                className={`p-4 flex items-center gap-4 transition-colors ${isLocked ? 'opacity-50 grayscale bg-gray-50 dark:bg-white/5' : isCurrent ? 'bg-keto-light/30 dark:bg-keto-primary/10 ring-1 ring-inset ring-keto-primary/20' : 'hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer bg-white dark:bg-transparent'}`} 
                                onClick={() => !isLocked && setSelectedDay(day)}
                            >
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-keto-primary border-keto-primary text-white' : isCurrent ? 'border-keto-primary text-keto-primary animate-pulse' : 'border-gray-300 dark:border-white/20 text-gray-400'}`}>
                                    {isDone ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{day.day}</span>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <div className={`text-[10px] font-bold uppercase ${isCurrent ? 'text-keto-primary' : 'text-gray-400'}`}>{day.phase}</div>
                                        {isLocked && <Lock className="w-3 h-3 text-gray-400"/>}
                                    </div>
                                    <div className={`font-bold ${isCurrent ? 'text-keto-primary dark:text-keto-accent' : 'text-gray-900 dark:text-gray-100'}`}>{day.title}</div>
                                </div>
                                {!isLocked && <ChevronRight className="w-4 h-4 text-gray-400" />}
                            </div>
                        );
                    })}
               </div>
           </div>
        </div>
    );
};

const RecipesView = ({ shoppingList, addToShoppingList, toggleShoppingItem, clearShoppingList }: any) => {
    const [filter, setFilter] = useState('Todos');
    const filtered = filter === 'Todos' ? RECIPES : RECIPES.filter(r => r.category === filter);
    return (
        <div className="space-y-6 pb-24 lg:pb-10">
             <div className="bg-white dark:bg-keto-dark p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <ShoppingBasket className="w-5 h-5 text-keto-primary"/> Lista de Compras
                    </h3>
                    {shoppingList.length > 0 && (
                        <button onClick={clearShoppingList} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded">
                            <Trash2 className="w-3 h-3"/> Limpar
                        </button>
                    )}
                </div>
                
                {shoppingList.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                        <ShoppingBasket className="w-8 h-8 text-gray-300 mx-auto mb-2"/>
                        <p className="text-sm text-gray-500">Sua lista está vazia.</p>
                        <p className="text-xs text-gray-400">Adicione ingredientes das receitas abaixo.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {shoppingList.map((i: any) => (
                            <div key={i.id} onClick={() => toggleShoppingItem(i.id)} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/10">
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${i.checked ? 'bg-keto-primary border-keto-primary text-white' : 'border-gray-300 dark:border-gray-600'}`}>
                                    {i.checked && <Check className="w-3 h-3"/>}
                                </div>
                                <span className={`text-sm font-medium ${i.checked ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{i.name}</span>
                            </div>
                        ))}
                    </div>
                )}
             </div>

             <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mt-8 mb-4">Receitas Fáceis</h3>
             <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                 {['Todos', 'Café da Manhã', 'Almoço', 'Jantar', 'Lanche'].map(f => (
                     <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-keto-primary text-white shadow-lg shadow-keto-primary/20' : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-transparent'}`}>{f}</button>
                 ))}
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {filtered.map(r => (
                     <div key={r.id} className="bg-white dark:bg-keto-dark p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex justify-between items-start mb-2">
                             <h3 className="font-bold text-lg dark:text-white leading-tight">{r.title}</h3>
                             <span className="text-[10px] font-bold uppercase bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-500">{r.category}</span>
                         </div>
                         <div className="text-xs text-gray-400 font-bold mb-3 flex gap-2">
                             <span className="flex items-center gap-1"><Coffee className="w-3 h-3"/> {r.prepTime}</span>
                         </div>
                         <ul className="text-sm list-disc pl-4 text-gray-600 dark:text-gray-300 mb-4 space-y-1">
                             {r.ingredients.slice(0, 3).map((ing, idx) => <li key={idx}>{ing}</li>)}
                             {r.ingredients.length > 3 && <li className="text-gray-400 text-xs list-none">+ {r.ingredients.length - 3} outros ingredientes</li>}
                         </ul>
                         <button onClick={() => addToShoppingList(r.ingredients)} className="w-full py-3 bg-gray-50 dark:bg-white/5 hover:bg-keto-light dark:hover:bg-keto-primary/20 text-keto-dark dark:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-200 dark:border-white/10">
                            <Plus className="w-4 h-4 text-keto-primary"/> Adicionar à Lista
                         </button>
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
        <div className="flex flex-col md:flex-row gap-6 h-full pb-24 lg:pb-10">
            <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {GUIDE_CONTENT.map(c => (
                    <button key={c.id} onClick={() => setActive(c.id)} className={`p-4 rounded-xl text-left border flex-shrink-0 whitespace-nowrap md:whitespace-normal transition-colors ${active === c.id ? 'border-keto-primary bg-white dark:bg-keto-dark shadow-md' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}>{c.title}</button>
                ))}
            </div>
            <div className="w-full md:w-2/3 bg-white dark:bg-keto-dark p-6 rounded-2xl border border-gray-100 dark:border-white/5 overflow-y-auto shadow-sm min-h-[50vh]">
                <h2 className="text-2xl font-bold mb-4 dark:text-white flex items-center gap-2">
                    {content?.title}
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                    {content?.content}
                </div>
            </div>
        </div>
    )
};

const TrackerView = ({ dayLogs, addLog, deleteLog, userSettings }: any) => {
    return (
        <div className="space-y-6 pb-24 lg:pb-10">
            <div className="bg-white dark:bg-keto-dark p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <h3 className="font-bold mb-4 dark:text-white text-xl">Como você está hoje?</h3>
                <button onClick={() => addLog({id: Date.now().toString(), date: new Date().toISOString(), displayDate: new Date().toLocaleDateString(), energy: 8, weight: userSettings.startingWeight || '75', sleep: '8'})} className="w-full bg-keto-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-keto-primary/20 hover:bg-keto-accent transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5"/> Registrar Progresso
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">Clique para simular um registro rápido</p>
            </div>
            
            <div className="space-y-4">
                <SimpleChart data={dayLogs} dataKey="energy" color="#D97706" label="Nível de Energia (1-10)" />
                <SimpleChart data={dayLogs} dataKey="weight" color="#78716c" label="Peso (kg)" />
            </div>

            <div className="space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-white text-lg mt-4">Histórico</h4>
                {dayLogs.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
                        <History className="w-8 h-8 text-gray-300 mx-auto mb-2"/>
                        <p className="text-gray-500">Nenhum registro ainda.</p>
                    </div>
                )}
                {dayLogs.map((log: DailyLog) => (
                    <div key={log.id} className="flex justify-between items-center bg-white dark:bg-keto-dark p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-100 dark:bg-white/10 p-2 rounded-lg">
                                <Calendar className="w-4 h-4 text-gray-500"/>
                            </div>
                            <span className="text-sm font-bold dark:text-gray-300">{log.displayDate}</span>
                        </div>
                        <div className="flex gap-4 text-xs font-bold text-gray-600 dark:text-gray-400">
                             <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500"/> {log.energy}/10</span>
                             <span className="flex items-center gap-1"><Scale className="w-3 h-3 text-stone-500"/> {log.weight}kg</span>
                             <button onClick={() => deleteLog(log.id)} className="text-red-400 hover:text-red-600 ml-2"><Trash2 className="w-4 h-4"/></button>
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
      
      <MobileBottomNav currentView={view} setView={setView} />
      <Sidebar 
        currentView={view} 
        setView={setView} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        resetApp={handleResetApp}
        openLegal={(type) => setLegalModal({isOpen: true, type})}
      />

      <main className="flex-1 lg:ml-64 relative flex flex-col min-h-screen">
        {/* Mobile Top Header (Logo Only) */}
        <div className="lg:hidden p-4 bg-white dark:bg-keto-dark shadow-sm flex items-center justify-between sticky top-0 z-30 transition-colors border-b border-gray-100 dark:border-white/5">
          <h1 className="font-serif font-bold text-xl text-keto-dark dark:text-keto-cream flex items-center gap-2">
            <Flame className="w-5 h-5 text-keto-primary"/> Keto 21
          </h1>
          <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg">
                 {isDarkMode ? <Sun className="w-6 h-6"/> : <Moon className="w-6 h-6"/>}
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full flex-1">
          {view === ViewState.DASHBOARD && <Dashboard settings={settings} completedDays={completedDays} toggleDay={toggleDayCompletion} />}
          {view === ViewState.GUIDE && <GuideView />}
          {view === ViewState.RECIPES && <RecipesView shoppingList={shoppingList} addToShoppingList={addToShoppingList} toggleShoppingItem={toggleShoppingItem} clearShoppingList={clearShoppingList} />}
          {view === ViewState.TRACKER && <TrackerView dayLogs={dayLogs} addLog={handleAddLog} deleteLog={handleDeleteLog} userSettings={settings} />}
        </div>
      </main>
    </div>
  );
};

export default App;