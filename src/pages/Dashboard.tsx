import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardService } from '../services/DashboardService';
import Totalizer from '../components/Totalizer';
import PremiumBanner from '../components/PremiumBanner';
import PremiumActionCard from '../components/PremiumActionCard';
import { Activity, BookOpen, CheckCircle, Target, Crown, Target as TargetIcon, Heart, RotateCcw } from 'lucide-react';

interface Metrics {
  planType: string;
  totalQuestionsSolved: number;
  totalQuestionsCorrect: number;
  totalQuestionsReviewed: number;
  totalMockExamsCompleted: number;
  consecutiveLoginDays: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  const isFree = user?.planType === 'FREE';
  const remainingLives = isFree ? Math.max(0, 5 - (user?.dailyErrors || 0)) : null;

  useEffect(() => {
    async function loadMetrics() {
      try {
        const { data } = await DashboardService.getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Erro ao carregar métricas", error);
      }
    }
    loadMetrics();
  }, []);

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b] mb-1">Visão Geral</h1>
          <p className="text-gray-500 text-sm">
            Bem-vindo de volta, {user?.name.split(' ')[0]}! Acompanhe o seu progresso de estudos.
          </p>
        </div>

        {/* Vidas (Topo Direito) */}
        {isFree && remainingLives !== null && (
          <div className="relative group cursor-pointer z-50">
            <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 font-bold shadow-sm hover:bg-red-100 transition-colors">
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-lg">{remainingLives}</span>
            </div>

            {/* Custom Tooltip */}
            <div className="absolute right-0 top-full mt-2 w-max bg-gray-800 text-white text-xs font-medium px-3 py-2 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
              Vidas diárias (Plano Free)
              {/* Seta do tooltip */}
              <div className="absolute bottom-full right-6 transform translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
            </div>
          </div>
        )}
      </div>

      {/* Totalizers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <Totalizer
          title="Frequência"
          value={`${metrics?.consecutiveLoginDays || 0} Dia`}
          icon={Activity}
          iconColorClass="text-orange-500"
          iconBgClass="bg-orange-50"
          chartType="line"
        />
        <Totalizer
          title="Resolvidas"
          value={metrics?.totalQuestionsSolved || 0}
          icon={BookOpen}
          iconColorClass="text-blue-500"
          iconBgClass="bg-blue-50"
          chartType="bar"
        />
        <Totalizer
          title="Acertos"
          value={metrics?.totalQuestionsCorrect || 0}
          icon={CheckCircle}
          iconColorClass="text-emerald-500"
          iconBgClass="bg-emerald-50"
          chartType="line"
        />
        <Totalizer
          title="Revisadas"
          value={metrics?.totalQuestionsReviewed || 0}
          icon={RotateCcw}
          iconColorClass="text-indigo-500"
          iconBgClass="bg-indigo-50"
          chartType="bar"
        />
        <Totalizer
          title="Simulados"
          value={metrics?.totalMockExamsCompleted || 0}
          icon={Target}
          iconColorClass="text-purple-500"
          iconBgClass="bg-purple-50"
          chartType="line"
        />
      </div>

      {/* Ações Premium */}
      <div>
        <h2 className="text-xl font-bold text-[#1e293b] mb-4">Ações Premium</h2>
        <p className="text-sm text-gray-500 mb-4">Evolua seus estudos com ferramentas exclusivas.</p>

        {isFree && <PremiumBanner />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PremiumActionCard
            title="Simulados Completos"
            description="Simulados Completos com Ranking em Tempo Real"
            icon={<Crown className="w-6 h-6 text-[#eab308]" />}
            isLocked={isFree}
          />
          <PremiumActionCard
            title="Revisão Direcionada Inteligente"
            description="Desbloqueie simulados completos e revisão direcionada para focar nas suas fraquezas e gabaritar na prova."
            icon={<TargetIcon className="w-6 h-6 text-indigo-400" />}
            isLocked={isFree}
          />
        </div>
      </div>
    </div>
  );
}
