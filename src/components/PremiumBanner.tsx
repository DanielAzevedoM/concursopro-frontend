
export default function PremiumBanner() {
  return (
    <div className="w-full rounded-2xl overflow-hidden relative shadow-lg mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#ca8a04]"></div>
      <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2">Faça o upgrade para PRO</h2>
          <p className="text-white/80 text-sm max-w-xl">
            Desbloqueie simulados completos e revisão direcionada para focar na prova.
          </p>
        </div>
        <button className="whitespace-nowrap px-6 py-3 bg-white text-[#ca8a04] font-bold rounded-xl shadow-md hover:bg-gray-50 transition-colors">
          Conhecer Planos
        </button>
      </div>
    </div>
  );
}
