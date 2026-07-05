import React from 'react';
import { Lock } from 'lucide-react';

interface PremiumActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isLocked?: boolean;
}

export default function PremiumActionCard({ title, description, icon, isLocked = true }: PremiumActionCardProps) {
  return (
    <div className="bg-[#1e293b] rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between h-full group transition-transform hover:-translate-y-1">
      {/* Background pattern decorativo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      <div className="relative z-10 flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            {title}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <button className="w-full py-3 bg-[#334155] text-gray-300 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-[#475569] transition-colors">
          {isLocked && <Lock className="w-4 h-4 text-[#eab308]" />}
          {isLocked ? 'Bloqueado' : 'Acessar'}
        </button>
      </div>
    </div>
  );
}
