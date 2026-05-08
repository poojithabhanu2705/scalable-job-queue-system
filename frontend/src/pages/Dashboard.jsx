import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import StatsGrid from '../components/StatsGrid';
import JobTable from '../components/JobTable';
import AddJobForm from '../components/AddJobForm';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import { jobApi } from '../api/jobApi';
import { LayoutDashboard, RefreshCw, Menu, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    active: 0,
    waiting: 0
  });

  const fetchJobs = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await jobApi.getAllJobs();
      const jobData = response.data;
      setJobs(jobData);
      setError(null);
      
      setStats({
        total: jobData.length,
        completed: jobData.filter(j => j.status === 'completed').length,
        failed: jobData.filter(j => j.status === 'failed').length,
        active: jobData.filter(j => j.status === 'active').length,
        waiting: jobData.filter(j => j.status === 'waiting').length,
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Connection lost');
      if (!silent) toast.error(err.message || 'Failed to sync with cluster');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Use interval for background updates, but keep it silent to avoid toast spam
    const interval = setInterval(() => fetchJobs(true), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-zinc-950 min-h-screen text-zinc-400 overflow-x-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full relative">
        <header className="px-4 sm:px-6 lg:px-10 py-6 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-40">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-1.5 -ml-1 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <Menu size={20} />
              </button>
              <LayoutDashboard size={18} className="text-zinc-500 hidden sm:block" />
              <h1 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest truncate">
                {activeTab === 'dashboard' ? 'Overview' : activeTab === 'jobs' ? 'All Jobs' : 'Review Failed'}
              </h1>
           </div>
           
           <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {error && (
                <div className="hidden md:flex items-center gap-1.5 text-rose-500 animate-pulse">
                   <AlertTriangle size={12} />
                   <span className="text-[9px] font-bold uppercase tracking-tighter">Sync Error</span>
                </div>
              )}
              <div className={`flex items-center gap-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-zinc-900 border border-zinc-800 ${error ? 'border-rose-500/30' : ''}`}>
                 <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full animate-pulse ${error ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                 <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter ${error ? 'text-rose-400' : 'text-zinc-300'}`}>
                   {error ? 'Offline' : 'Live Sync'}
                 </span>
              </div>
              <button 
                onClick={() => fetchJobs(false)} 
                className={`text-zinc-500 hover:text-zinc-300 transition-colors ${loading ? 'animate-spin' : ''}`}
              >
                 <RefreshCw size={16} />
              </button>
           </div>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="max-w-[1400px] mx-auto space-y-8">
            
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="space-y-8"
                >
                  <StatsGrid stats={stats} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 w-full min-w-0">
                      <JobTable jobs={jobs} loading={loading} />
                    </div>
                    <div className="space-y-8 w-full min-w-0">
                       <AddJobForm onJobAdded={() => fetchJobs(true)} />
                       <ArchitectureDiagram />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'jobs' && (
                <motion.div
                  key="jobs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                   <JobTable jobs={jobs} loading={loading} />
                </motion.div>
              )}

              {activeTab === 'failed' && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                   <JobTable jobs={jobs.filter(j => j.status === 'failed')} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
