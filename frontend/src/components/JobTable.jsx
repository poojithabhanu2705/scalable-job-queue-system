import React, { useState } from 'react';
import { Search, Filter, Clock, AlertCircle, CheckCircle2, Zap, Timer } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const configs = {
    completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 },
    failed: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: AlertCircle },
    active: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Zap },
    waiting: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Timer },
  };

  const { color, bg, border, icon: Icon } = configs[status] || configs.waiting;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold border ${color} ${bg} ${border} whitespace-nowrap`}>
      <Icon size={12} />
      <span className="uppercase tracking-tight">{status}</span>
    </div>
  );
};

export default function JobTable({ jobs, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = jobs.filter(job => 
    job.jobId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-full animate-fade-in w-full">
      <div className="p-4 sm:p-5 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-sm font-semibold text-zinc-100">Operation Log</h2>
           <p className="text-xs text-zinc-500 mt-0.5">Real-time status of backend tasks.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative group flex-1 md:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-zinc-950/50 border border-zinc-800 rounded-lg text-xs focus:outline-none focus:border-zinc-700 transition-all text-zinc-200 placeholder:text-zinc-600 w-full md:w-56"
            />
          </div>
          <button className="p-2 border border-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 transition-all shrink-0">
            <Filter size={14} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-zinc-900/50 text-zinc-500 text-[10px] uppercase font-semibold tracking-wider border-b border-zinc-900">
            <tr>
              <th className="px-5 sm:px-6 py-3">Identifier</th>
              <th className="px-5 sm:px-6 py-3">Job Type</th>
              <th className="px-5 sm:px-6 py-3">Status</th>
              <th className="px-5 sm:px-6 py-3">Priority</th>
              <th className="px-5 sm:px-6 py-3">Attempts</th>
              <th className="px-5 sm:px-6 py-3 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredJobs.map((job) => (
              <tr key={job.jobId} className="hover:bg-zinc-900/40 transition-colors group">
                <td className="px-5 sm:px-6 py-4 font-mono text-[11px] text-zinc-400">
                  <span className="text-zinc-600 select-none">#</span>{job.jobId.slice(0, 12)}
                </td>
                <td className="px-5 sm:px-6 py-4">
                  <span className="text-xs font-medium text-zinc-200 truncate max-w-[100px] block">{job.type}</span>
                </td>
                <td className="px-5 sm:px-6 py-4">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-5 sm:px-6 py-4">
                  <span className="text-xs text-zinc-500">{job.priority}</span>
                </td>
                <td className="px-5 sm:px-6 py-4">
                  <span className="text-xs text-zinc-500">{job.attempts}</span>
                </td>
                <td className="px-5 sm:px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-zinc-600">
                    <Clock size={12} className="shrink-0" />
                    <span className="text-[11px] font-medium whitespace-nowrap">{job.createdAt ? new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                  </div>
                </td>
              </tr>
            ))}
            {filteredJobs.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="py-12 text-center text-xs text-zinc-600">No matching jobs found in queue.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
