import React from 'react';
import { Monitor, Server, Database, Layers, ChevronRight, ChevronDown, HardDrive } from 'lucide-react';

const Node = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center gap-2 group flex-1 md:flex-initial">
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-zinc-100 group-hover:border-zinc-700 transition-all shadow-lg">
      <Icon size={20} className="sm:size-24" />
    </div>
    <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-tight whitespace-nowrap">{label}</span>
  </div>
);

export default function ArchitectureDiagram() {
  return (
    <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-6 sm:p-8 flex flex-col items-center animate-fade-in w-full overflow-hidden">
      <div className="w-full mb-8 text-center sm:text-left">
        <h3 className="text-xs font-semibold text-zinc-100 uppercase tracking-widest">System Pipeline</h3>
        <p className="text-[10px] text-zinc-600 mt-1">Responsive infrastructure topology.</p>
      </div>
      
      {/* Horizontal Flow (Desktop) / Vertical Flow (Mobile) */}
      <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 w-full justify-between max-w-2xl">
        <Node icon={Monitor} label="Inbound" />
        <div className="md:rotate-0 rotate-90 text-zinc-800 md:block">
           <ChevronRight className="hidden md:block" size={14} />
           <ChevronDown className="md:hidden" size={14} />
        </div>
        
        <Node icon={Server} label="Core API" />
        <div className="md:rotate-0 rotate-90 text-zinc-800 md:block">
           <ChevronRight className="hidden md:block" size={14} />
           <ChevronDown className="md:hidden" size={14} />
        </div>
        
        <Node icon={Layers} label="Redis" />
        <div className="md:rotate-0 rotate-90 text-zinc-800 md:block">
           <ChevronRight className="hidden md:block" size={14} />
           <ChevronDown className="md:hidden" size={14} />
        </div>
        
        <Node icon={HardDrive} label="Compute" />
        <div className="md:rotate-0 rotate-90 text-zinc-800 md:block">
           <ChevronRight className="hidden md:block" size={14} />
           <ChevronDown className="md:hidden" size={14} />
        </div>
        
        <Node icon={Database} label="Atlas" />
      </div>

      <div className="mt-10 pt-6 border-t border-zinc-900/50 w-full grid grid-cols-3 gap-4">
        {[
          { label: 'Network', value: '14ms' },
          { label: 'DB Type', value: 'NoSQL' },
          { label: 'Engine', value: 'BullMQ' }
        ].map((item, i) => (
          <div key={i} className="text-center">
            <p className="text-[8px] sm:text-[9px] font-bold text-zinc-600 uppercase tracking-tighter sm:tracking-tight">{item.label}</p>
            <p className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 truncate">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
