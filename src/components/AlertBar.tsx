import { Info } from 'lucide-react';

interface AlertBarProps {
  message: string;
}

export default function AlertBar({ message }: AlertBarProps) {
  return (
    <div className="bg-[#e2e8f0] border border-[#cbd5e1] rounded-lg p-3 flex items-center gap-3 text-sm text-[#334155] mb-6 shadow-sm">
      <Info className="w-5 h-5 text-[#475569]" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
