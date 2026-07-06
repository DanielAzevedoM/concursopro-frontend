import { Crown, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PremiumBanner from '../components/PremiumBanner';
import PremiumActionCard from '../components/PremiumActionCard';

export default function Premium() {
  const { user } = useAuth();
  const isPro = user?.planType === 'PRO';

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1e293b] mb-1">Ações Premium</h1>
        <p className="text-sm text-gray-500 mt-2">
          Evolua seus estudos com ferramentas exclusivas.
        </p>
      </div>

      {!isPro && (
        <PremiumBanner />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PremiumActionCard
          title="Simulados Completos"
          description="Teste seus conhecimentos com tempo cronometrado e provas reais de concursos anteriores."
          icon={<Crown className="w-6 h-6 text-[#eab308]" />}
          isLocked={!isPro}
        />
        <PremiumActionCard
          title="Revisão Direcionada"
          description="Refaça apenas as questões que você errou ou teve dúvidas e reforce o seu aprendizado."
          icon={<Target className="w-6 h-6 text-indigo-400" />}
          isLocked={!isPro}
        />
      </div>
    </div>
  );
}
