import React from 'react';

interface TotalizerProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColorClass?: string;
  iconBgClass?: string;
  chartType?: 'line' | 'bar';
}

export default function Totalizer({ 
  title, 
  value, 
  icon: Icon, 
  iconColorClass = 'text-indigo-600',
  iconBgClass = 'bg-indigo-50',
  chartType = 'bar'
}: TotalizerProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-between h-36">
      <div className="relative z-10 flex flex-col gap-1">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgClass}`}>
            <Icon className={`w-5 h-5 ${iconColorClass}`} strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold text-gray-600">{title}</span>
        </div>
        <div className="text-3xl font-extrabold text-gray-900 ml-1">
          {value}
        </div>
      </div>

      {/* Decorative Charts via SVG */}
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
        {chartType === 'line' ? (
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full text-indigo-400 fill-current">
            <path d="M0 40 L0 30 Q 15 15, 30 25 T 60 20 T 100 5 L100 40 Z" opacity="0.3" />
            <path d="M0 30 Q 15 15, 30 25 T 60 20 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : (
          <div className="flex items-end justify-between px-2 h-full gap-1 pb-2">
            {[40, 20, 60, 30, 80, 50, 90, 70].map((height, i) => (
              <div 
                key={i} 
                className={`w-full rounded-t-sm ${iconColorClass.replace('text-', 'bg-')}`}
                style={{ height: `${height}%`, opacity: 0.2 + (i * 0.1) }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
