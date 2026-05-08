import React from 'react';
import { 
  BarChart2, 
  CheckCircle2, 
  AlertCircle, 
  Clock 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-xl flex items-center justify-between transition-all hover:border-zinc-700/50">
    <div>
      <p className="text-zinc-500 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">{value}</h3>
    </div>
    <div className={`p-2 rounded-md bg-zinc-950 border border-zinc-800 shrink-0 ${color}`}>
      <Icon size={18} />
    </div>
  </div>
);

export default function StatsGrid({ stats }) {
  const items = [
    { title: 'Total Jobs', value: stats.total || 0, icon: BarChart2, color: 'text-zinc-400' },
    { title: 'Completed', value: stats.completed || 0, icon: CheckCircle2, color: 'text-emerald-500' },
    { title: 'Failed', value: stats.failed || 0, icon: AlertCircle, color: 'text-rose-500' },
    { title: 'Waiting', value: stats.waiting || 0, icon: Clock, color: 'text-amber-500' },
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <StatCard key={i} {...item} />
      ))}
    </div>
  );
}
