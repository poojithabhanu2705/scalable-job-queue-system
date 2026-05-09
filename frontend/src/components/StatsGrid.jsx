import React from 'react';
import { Mail, AlertCircle, Clock, RefreshCcw } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-5 hover:border-zinc-800 transition-all group animate-fade-in">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-zinc-100 mt-1 tabular-nums">{value}</h3>
      </div>
      <div className={`p-2.5 rounded-lg ${color} bg-opacity-10 border border-current border-opacity-10 group-hover:scale-110 transition-transform`}>
        <Icon size={18} />
      </div>
    </div>
  </div>
);

export default function StatsGrid({ stats }) {
  const cards = [
    { title: 'Emails Sent', value: stats.sent || 0, icon: Mail, color: 'text-emerald-400' },
    { title: 'Failed Deliveries', value: stats.failed || 0, icon: AlertCircle, color: 'text-rose-400' },
    { title: 'Pending Emails', value: stats.pending || 0, icon: Clock, color: 'text-amber-400' },
    { title: 'Retry Queue', value: stats.retryQueue || 0, icon: RefreshCcw, color: 'text-blue-400' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </div>
  );
}
