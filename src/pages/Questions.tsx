import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Questions() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1e293b] mb-1">Questões</h1>
        <p className="text-sm text-gray-500 mt-2">
          Escolha uma categoria e comece a responder.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-[#1e293b] rounded-2xl shadow-xl relative overflow-hidden group p-8">
        {/* Background pattern decorativo */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="p-5 bg-white/10 rounded-2xl mb-6 relative z-10 flex items-center justify-center">
          <BookOpen size={56} className="text-[#eab308]" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3 relative z-10">Tela de Questões</h2>
        <p className="text-gray-300 text-center max-w-md relative z-10 leading-relaxed">
          A lista de disciplinas aparecerá aqui em breve. Você poderá escolher uma e testar seus conhecimentos.
        </p>
      </div>
    </div>
  );
}
