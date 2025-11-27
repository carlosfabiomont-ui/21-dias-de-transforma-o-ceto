import React from 'react';
import { Recipe, GuideSection, DailyGuidance } from './types';
import { 
  Beaker, 
  ShieldAlert, 
  Droplet, 
  Flame, 
  Zap, 
  ArrowRight, 
  Activity,
  ListChecks,
  ThermometerSun,
  TrendingUp,
  Award,
  HelpCircle,
  CalendarCheck,
  BrainCircuit,
  Battery,
  Utensils,
  Moon,
  Scale,
  Beef,
  Wheat
} from 'lucide-react';

// Helper component for content
const UtensilsIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
);

export const DAILY_PLAN: DailyGuidance[] = [
  // FASE 1: ADAPTAÇÃO (Dias 1-7)
  {
    day: 1,
    phase: "Adaptação",
    title: "O Grande Começo",
    action: "Corte os carboidratos drásticamente (abaixo de 25g). Foque em ovos, carnes e folhas verdes.",
    why: "Hoje seu corpo começa a esgotar o estoque de glicogênio (açúcar) no fígado. É o primeiro passo para forçar a mudança de combustível.",
    icon: Flame
  },
  {
    day: 2,
    phase: "Adaptação",
    title: "Combate à Fome",
    action: "Aumente a gordura saudável. Adicione azeite na salada e coma abacate.",
    why: "Seu corpo vai pedir açúcar. Engane a fome com gordura e água. A gordura traz saciedade e sinaliza que há energia disponível.",
    icon: Utensils
  },
  {
    day: 3,
    phase: "Adaptação",
    title: "Hidratação Crítica",
    action: "Beba 3 litros de água e adicione um pouco mais de sal nas refeições.",
    why: "CRUCIAL: Seus rins estão excretando sódio rapidamente. A falta de sal hoje causa dor de cabeça amanhã. Previna-se.",
    icon: Droplet
  },
  {
    day: 4,
    phase: "Adaptação",
    title: "Barreira da Keto Flu",
    action: "Dia de baixo esforço físico. Se sentir cansaço, use a receita da Água Eletrolítica.",
    why: "Este é frequentemente o dia mais difícil. Seu cérebro está sentindo falta da glicose, mas ainda não tem cetonas suficientes. Vai passar em breve.",
    icon: ThermometerSun
  },
  {
    day: 5,
    phase: "Adaptação",
    title: "Virada Metabólica",
    action: "Observe sua energia à tarde. Se não houver queda brusca, comemore.",
    why: "Seu fígado começou a produzir corpos cetônicos em maior quantidade. A 'névoa mental' começa a se dissipar.",
    icon: Zap
  },
  {
    day: 6,
    phase: "Adaptação",
    title: "Controle do Apetite",
    action: "Tente não lanchar entre as refeições principais. Coma apenas se tiver fome real.",
    why: "Seus hormônios da fome (grelina) estão se estabilizando. Você deve notar que não precisa comer a cada 3 horas.",
    icon: Activity
  },
  {
    day: 7,
    phase: "Adaptação",
    title: "Primeira Vitória",
    action: "Pese-se (opcional) e revise sua semana. Planeje as compras da próxima.",
    why: "Você sobreviveu à semana mais difícil! A perda de peso inicial é principalmente água (desinchaço), o que é ótimo para inflamação.",
    icon: Award
  },

  // FASE 2: CONSOLIDAÇÃO (Dias 8-14)
  {
    day: 8,
    phase: "Consolidação",
    title: "Clareza Mental",
    action: "Aproveite o foco extra para tarefas difíceis no trabalho ou estudo.",
    why: "Seu cérebro adora cetonas! Diferente do açúcar que oscila, as cetonas fornecem energia constante e limpa para os neurônios.",
    icon: BrainCircuit
  },
  {
    day: 9,
    phase: "Consolidação",
    title: "Sono Reparador",
    action: "Evite comer muito tarde. Observe a qualidade do seu sono.",
    why: "O sono profundo ajuda a regular o cortisol (estresse). Cortisol alto atrapalha a queima de gordura. Dormir bem = Emagrecer.",
    icon: Moon
  },
  {
    day: 10,
    phase: "Consolidação",
    title: "Mudança de Paladar",
    action: "Coma um pedaço de chocolate 85% ou morangos. Note como parecem mais doces.",
    why: "Sem a sobrecarga de açúcar, suas papilas gustativas se recuperaram. Você começa a sentir o sabor real dos alimentos.",
    icon: UtensilsIcon
  },
  {
    day: 11,
    phase: "Consolidação",
    title: "Energia Constante",
    action: "Monitore sua energia pós-almoço. O sono da tarde sumiu?",
    why: "Sem picos de insulina, não há hipoglicemia reativa (o 'crash' pós-almoço). Sua energia se torna uma linha reta.",
    icon: Battery
  },
  {
    day: 12,
    phase: "Consolidação",
    title: "Movimento",
    action: "Faça uma caminhada longa ou treino moderado.",
    why: "Seus músculos agora estão mais eficientes em usar gordura corporal como combustível durante o exercício.",
    icon: Activity
  },
  {
    day: 13,
    phase: "Consolidação",
    title: "Roupas e Medidas",
    action: "Esqueça a balança. Prove aquela roupa que estava apertada.",
    why: "Muitas vezes perdemos volume (gordura visceral) antes de perder peso na balança. A composição corporal está mudando.",
    icon: Scale
  },
  {
    day: 14,
    phase: "Consolidação",
    title: "Teste Social",
    action: "Se for sair, planeje antes: Olhe o cardápio ou coma algo antes.",
    why: "A preparação vence a tentação. Manter-se fiel em eventos sociais fortalece sua autoconfiança no novo estilo de vida.",
    icon: ShieldAlert
  },

  // FASE 3: OTIMIZAÇÃO (Dias 15-21)
  {
    day: 15,
    phase: "Otimização",
    title: "Máquina de Queimar Gordura",
    action: "Experimente atrasar o café da manhã em 2 horas (Jejum Intermitente leve).",
    why: "Seu corpo está 'keto-adaptado'. O jejum agora é fácil e potencializa a autofagia (renovação celular) e queima de gordura.",
    icon: Flame
  },
  {
    day: 16,
    phase: "Otimização",
    title: "Foco Produtivo",
    action: "Use sua energia mental para organizar sua rotina futura.",
    why: "Neste estágio, muitos relatam o pico de performance mental. É o estado de fluxo facilitado pela cetose.",
    icon: Zap
  },
  {
    day: 17,
    phase: "Otimização",
    title: "Autoestima",
    action: "Tire uma foto de progresso ou compare com a do Dia 1.",
    why: "A redução da inflamação sistêmica melhora a pele e diminui a retenção de líquidos no rosto.",
    icon: TrendingUp
  },
  {
    day: 18,
    phase: "Otimização",
    title: "Hábito Formado",
    action: "Perceba como escolher alimentos low-carb ficou automático.",
    why: "A neurociência diz que a repetição cria caminhos neurais. O que era sacrifício no Dia 1, hoje é sua nova normalidade.",
    icon: BrainCircuit
  },
  {
    day: 19,
    phase: "Otimização",
    title: "Quebra de Platô",
    action: "Se o peso estagnou, corte laticínios ou castanhas hoje.",
    why: "Pequenos ajustes finos agora trazem grandes resultados. Alimentos densos em calorias às vezes impedem a queima final.",
    icon: ListChecks
  },
  {
    day: 20,
    phase: "Otimização",
    title: "Confiança Total",
    action: "Reflita: Você controlou sua alimentação, e não o contrário.",
    why: "O maior ganho da cetogênica não é só físico, é o controle emocional sobre a comida e a libertação da dependência do açúcar.",
    icon: Award
  },
  {
    day: 21,
    phase: "Otimização",
    title: "Transformação Completa",
    action: "Celebre! Leia a seção 'Pós-21 Dias' no Guia para decidir seu futuro.",
    why: "Você completou o ciclo de adaptação metabólica. Seu corpo agora é flexível. Você tem as ferramentas para a vida toda.",
    icon: CalendarCheck
  }
];

export const RECIPES: Recipe[] = [
  {
    id: 1,
    title: "Omelete Nutritiva",
    category: "Café da Manhã",
    prepTime: "5 min",
    ingredients: ["2 ovos", "Espinafre fresco", "Queijo cheddar", "½ abacate", "Sal e pimenta a gosto"],
    variations: [
      "Substituir espinafre por rúcula ou brócolis cozido",
      "Trocar queijo cheddar por queijo feta",
      "Adicionar tomate cereja",
      "Trocar ovo por 100g de tofu (versão vegana)"
    ],
    tags: ["Rápido", "Alta Proteína"]
  },
  {
    id: 2,
    title: "Smoothie Cetogênico",
    category: "Café da Manhã",
    prepTime: "5 min",
    ingredients: ["200ml leite de coco", "50g morangos", "1 colher de sopa de manteiga de amêndoas", "Gelo a gosto"],
    variations: [
      "Trocar morangos por mirtilos ou framboesas",
      "Trocar manteiga de amêndoas por pasta de coco",
      "Adicionar proteína em pó low-carb",
      "Substituir leite de coco por leite de amêndoas"
    ],
    tags: ["Sem Cozimento", "Refrescante"]
  },
  {
    id: 3,
    title: "Salada de Frango Grelhado",
    category: "Almoço",
    prepTime: "15 min",
    ingredients: ["150g peito de frango grelhado", "Folhas verdes variadas", "Azeite extra-virgem", "Castanhas ou sementes de abóbora"],
    variations: [
      "Trocar frango por salmão grelhado",
      "Trocar folhas verdes por mix de repolhos",
      "Substituir azeite por molho de tahine",
      "Trocar castanhas por queijo em cubos"
    ],
    tags: ["Leve", "Almoço"]
  },
  {
    id: 4,
    title: "Couve-flor 'Arroz' com Carne",
    category: "Almoço",
    prepTime: "20 min",
    ingredients: ["150g carne moída magra", "200g couve-flor processada", "Alho, cebola, ervas a gosto"],
    variations: [
      "Trocar carne moída por frango desfiado",
      "Trocar couve-flor por abobrinha ralada (zoodles)",
      "Adicionar cogumelos ou pimentões",
      "Usar temperos como curry ou páprica"
    ],
    tags: ["Jantar", "Conforto"]
  },
  {
    id: 5,
    title: "Ovos Cozidos com Abacate",
    category: "Lanche",
    prepTime: "10 min",
    ingredients: ["2 ovos cozidos", "½ abacate amassado", "Sal e pimenta"],
    variations: [
      "Acrescentar semente de chia ou linhaça",
      "Temperar com páprica defumada",
      "Trocar abacate por pasta de amêndoas"
    ],
    tags: ["Snack", "Prático"]
  },
  {
    id: 6,
    title: "Mix de Castanhas e Coco",
    category: "Lanche",
    prepTime: "2 min",
    ingredients: ["30g castanhas", "10g coco ralado sem açúcar", "Pitada de sal"],
    variations: [
      "Adicionar pedaços de chocolate ≥85% cacau",
      "Trocar castanhas por amêndoas",
      "Adicionar sementes de abóbora ou girassol"
    ],
    tags: ["Snack", "On-the-go"]
  }
];

export const GUIDE_CONTENT: GuideSection[] = [
  {
    id: 'intro',
    title: 'Por que 21 dias?',
    icon: CalendarCheck,
    content: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <p>
          Estudos mostram que <strong>21 dias</strong> é o tempo necessário para criar novos hábitos alimentares, 
          iniciar a adaptação metabólica e reduzir os sintomas da "keto flu".
        </p>
        <div className="bg-keto-light dark:bg-amber-900/30 p-4 rounded-lg border-l-4 border-keto-primary">
          <h4 className="font-bold text-keto-dark dark:text-keto-cream mb-2">Linha do Tempo:</h4>
          <ul className="list-none space-y-3 text-sm">
            <li className="flex items-start gap-2">
                <span className="font-bold text-keto-primary whitespace-nowrap">Dias 1-3:</span> 
                <span>Transição Inicial. O corpo esgota reservas de glicogênio. Pode haver "névoa mental".</span>
            </li>
            <li className="flex items-start gap-2">
                <span className="font-bold text-keto-primary whitespace-nowrap">Dias 4-7:</span> 
                <span>Adaptação Metabólica. Início da produção de cetonas. Apetite reduz naturalmente.</span>
            </li>
            <li className="flex items-start gap-2">
                <span className="font-bold text-keto-primary whitespace-nowrap">Dias 8-14:</span> 
                <span>Consolidação. Níveis de energia estáveis e foco aprimorado.</span>
            </li>
            <li className="flex items-start gap-2">
                <span className="font-bold text-keto-primary whitespace-nowrap">Dias 15-21:</span> 
                <span>Otimização. Metabolismo otimizado e queima de gordura eficiente.</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'checklist',
    title: 'Checklist de Preparação',
    icon: ListChecks,
    content: (
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <p>Antes de iniciar, garanta que você está preparado. A organização é a chave do sucesso.</p>
        
        <div className="grid grid-cols-1 gap-4">
            <div className="border border-stone-200 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-keto-dark">
                <h4 className="font-bold text-keto-dark dark:text-keto-cream flex items-center gap-2 mb-2"><UtensilsIcon className="w-4 h-4 text-keto-primary"/> 1. Preparação Alimentar</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Planejar refeições da primeira semana.</li>
                    <li>Comprar essenciais (ovos, abacate, óleo de coco).</li>
                    <li>Preparar água eletrolítica caseira.</li>
                    <li>Fazer "Meal Prep" (deixar vegetais e proteínas pré-preparados).</li>
                </ul>
            </div>
            
            <div className="border border-stone-200 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-keto-dark">
                <h4 className="font-bold text-keto-dark dark:text-keto-cream flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-keto-primary"/> 2. Ferramentas</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Baixar aplicativos de tracking.</li>
                    <li>Definir metas pessoais além da balança.</li>
                    <li>Separar garrafa de água de 1L ou mais.</li>
                </ul>
            </div>

            <div className="border border-stone-200 dark:border-white/10 rounded-lg p-4 bg-white dark:bg-keto-dark">
                <h4 className="font-bold text-keto-dark dark:text-keto-cream flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-keto-primary"/> 3. Social & Segurança</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Avisar familiares para obter apoio.</li>
                    <li>Consultar médico se tiver condições pré-existentes.</li>
                    <li>Planejar estratégias para eventos sociais.</li>
                </ul>
            </div>
        </div>
      </div>
    )
  },
  {
    id: 'science',
    title: 'A Ciência da Cetose',
    icon: Beaker,
    content: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <p>
          A cetogênica é como trocar o combustível do seu carro de gasolina (carboidratos) para uma energia limpa e eficiente: <strong>gordura (corpos cetônicos)</strong>.
        </p>
        
        <h3 className="text-xl font-serif text-keto-dark dark:text-keto-light mt-6 mb-2">Seus Macros Ideais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-amber-100 dark:bg-amber-900/40 p-4 rounded-lg border border-amber-200 dark:border-amber-700/50">
            <div className="p-2 bg-white dark:bg-amber-950 rounded-full w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                <Flame className="w-6 h-6 text-amber-600"/>
            </div>
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-500 mb-1">70-75%</div>
            <div className="font-bold text-gray-800 dark:text-gray-200">Gorduras</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Combustível principal</div>
          </div>
          <div className="bg-rose-100 dark:bg-rose-900/40 p-4 rounded-lg border border-rose-200 dark:border-rose-700/50">
            <div className="p-2 bg-white dark:bg-rose-950 rounded-full w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                <Beef className="w-6 h-6 text-rose-600"/>
            </div>
            <div className="text-3xl font-bold text-rose-700 dark:text-rose-500 mb-1">20-25%</div>
            <div className="font-bold text-gray-800 dark:text-gray-200">Proteínas</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Manutenção muscular</div>
          </div>
          <div className="bg-stone-100 dark:bg-stone-800 p-4 rounded-lg border border-stone-200 dark:border-stone-700">
            <div className="p-2 bg-white dark:bg-stone-900 rounded-full w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                <Wheat className="w-6 h-6 text-stone-600 dark:text-stone-400"/>
            </div>
            <div className="text-3xl font-bold text-stone-600 dark:text-stone-400 mb-1">5-10%</div>
            <div className="font-bold text-gray-800 dark:text-gray-200">Carboidratos</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Máximo 25-50g</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'ketoflu',
    title: 'SOS Keto Flu',
    icon: ThermometerSun,
    content: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 mb-4">
            <h4 className="font-bold text-orange-900 dark:text-orange-200 mb-1">Não desista!</h4>
            <p className="text-sm text-orange-800 dark:text-orange-100">Sintomas como dor de cabeça, fadiga e irritabilidade são comuns nos dias 3-7. É apenas seu corpo pedindo <strong>eletrólitos</strong>, não açúcar.</p>
        </div>

        <h4 className="font-bold text-keto-dark dark:text-keto-cream text-lg">Checklist Anti-Keto Flu:</h4>
        <ul className="space-y-3">
            <li className="flex items-start gap-2">
                <Droplet className="w-5 h-5 text-sky-500 mt-1 flex-shrink-0"/>
                <div>
                    <strong>Hidratação Constante:</strong> Beba 2,5L a 3L de água por dia. A cetose tem efeito diurético natural.
                </div>
            </li>
            <li className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-keto-primary mt-1 flex-shrink-0"/>
                <div>
                    <strong>Sal é seu amigo:</strong> Adicione 1/2 colher de chá extra de sal na comida ou na água. Isso repõe o sódio perdido.
                </div>
            </li>
            <li className="flex items-start gap-2">
                <Flame className="w-5 h-5 text-red-500 mt-1 flex-shrink-0"/>
                <div>
                    <strong>Gordura = Energia:</strong> Se sentir fome ou fraqueza, coma gorduras boas (abacate, castanhas, azeite).
                </div>
            </li>
        </ul>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-4 border border-yellow-200 dark:border-yellow-700/50">
            <h4 className="font-bold text-yellow-900 dark:text-yellow-200 mb-1">Receita: Água Eletrolítica Caseira</h4>
            <ul className="list-disc pl-5 text-sm text-yellow-900 dark:text-yellow-100">
                <li>1 litro de água filtrada</li>
                <li>1/2 colher de chá de sal marinho</li>
                <li>Suco de 1/2 limão</li>
                <li>Pitada de sal light (opcional para potássio)</li>
            </ul>
        </div>
      </div>
    )
  },
  {
    id: 'plateau',
    title: 'Estagnação (Platô)',
    icon: TrendingUp,
    content: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <p>O peso parou de cair? Isso é normal e não significa fracasso. Use este checklist para voltar aos trilhos:</p>
        
        <div className="space-y-4 mt-4">
             <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-keto-light flex items-center justify-center text-keto-primary font-bold text-xs">1</div>
                <div>
                    <h5 className="font-bold dark:text-gray-100">Carboidratos Ocultos</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pequenas variações podem afetar a cetose. Verifique molhos e industrializados.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-keto-light flex items-center justify-center text-keto-primary font-bold text-xs">2</div>
                <div>
                    <h5 className="font-bold dark:text-gray-100">Ajuste os Macros</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Talvez você esteja comendo muita proteína ou gordura em excesso. Use a calculadora do app.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-keto-light flex items-center justify-center text-keto-primary font-bold text-xs">3</div>
                <div>
                    <h5 className="font-bold dark:text-gray-100">Jejum Intermitente</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tente pular o café da manhã ou jantar mais cedo para aumentar a janela de queima de gordura.</p>
                </div>
             </div>
        </div>
      </div>
    )
  },
  {
    id: 'maintenance',
    title: 'Pós-21 Dias',
    icon: Award,
    content: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <p>Parabéns! Mas e agora? O objetivo não é o "efeito sanfona". Escolha seu caminho:</p>
        
        <div className="grid grid-cols-1 gap-3">
            <div className="p-4 border dark:border-white/10 rounded-lg hover:border-keto-primary dark:hover:border-keto-primary transition-colors cursor-pointer bg-white dark:bg-keto-dark">
                <h4 className="font-bold text-keto-dark dark:text-keto-cream">1. Manutenção (Low-Carb)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aumente carboidratos para 50-100g/dia. Mantenha foco em comida de verdade. Ideal para longo prazo.</p>
            </div>
            <div className="p-4 border dark:border-white/10 rounded-lg hover:border-keto-primary dark:hover:border-keto-primary transition-colors cursor-pointer bg-white dark:bg-keto-dark">
                <h4 className="font-bold text-keto-dark dark:text-keto-cream">2. Carb Cycling (Ciclos)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dias Low-Carb alternados com dias de carbo moderado. Ótimo para quem treina pesado.</p>
            </div>
            <div className="p-4 border dark:border-white/10 rounded-lg hover:border-keto-primary dark:hover:border-keto-primary transition-colors cursor-pointer bg-white dark:bg-keto-dark">
                <h4 className="font-bold text-keto-dark dark:text-keto-cream">3. Cetogênica Contínua</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mantenha o estilo de vida atual. Sinta os benefícios cognitivos e de energia de forma permanente.</p>
            </div>
        </div>

        <div className="bg-keto-dark dark:bg-black text-white p-4 rounded-lg mt-4 border border-keto-accent/30">
            <h4 className="font-bold mb-2 text-center text-keto-accent">Regra de Ouro</h4>
            <p className="text-center text-sm italic">"Nunca volte 100% aos hábitos antigos. Se o peso subir 2kg, volte ao protocolo estrito por 1 semana."</p>
        </div>
      </div>
    )
  },
  {
    id: 'safety',
    title: 'Segurança',
    icon: ShieldAlert,
    content: (
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <h4 className="font-bold text-red-800 dark:text-red-200 flex items-center gap-2 mb-2"><ShieldAlert className="w-5 h-5"/> Contraindicações:</h4>
            <ul className="list-disc pl-5 text-sm text-red-900 dark:text-red-100 space-y-1">
                <li>Diabetes tipo 1 (insulina).</li>
                <li>Insuficiência renal ou hepática grave.</li>
                <li>Gravidez ou amamentação (consulte médico).</li>
                <li>Uso de medicação para pressão arterial (pode precisar de ajuste).</li>
            </ul>
        </div>
      </div>
    )
  }
];

export const SUBSTITUTIONS = [
    { original: "Pão", sub: "Omelete ou panqueca low-carb" },
    { original: "Arroz", sub: "Couve-flor ralada" },
    { original: "Massa", sub: "Zoodles (abobrinha em tiras)" },
    { original: "Batata", sub: "Purê de couve-flor" },
    { original: "Chocolate ao Leite", sub: "Chocolate ≥85% ou frutas low-carb" },
];