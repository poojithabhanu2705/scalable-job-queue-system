import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import StatsGrid from '../components/StatsGrid';
import JobTable from '../components/JobTable';
import CampaignForm from '../components/CampaignForm';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import { jobApi } from '../api/jobApi';
import { LayoutDashboard, RefreshCw, Menu, AlertTriangle, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    sent: 0,
    failed: 0,
    pending: 0,
    retryQueue: 0,
    total: 0
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const fetchJobs = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const [logsRes, statsRes] = await Promise.all([
        jobApi.getDeliveryLogs(),
        jobApi.getStats()
      ]);

      setJobs(logsRes.data);
      setStats(statsRes.data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Connection lost');
      if (!silent) toast.error(err.message || 'Failed to sync with cluster');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      setIsDeleting(true);
      await jobApi.deleteJob(jobId);
      toast.success('Log entry removed');
      setJobs(prev => prev.filter(j => j.jobId !== jobId));
      setJobToDelete(null);
      fetchJobs(true);
    } catch (err) {
      toast.error('Failed to delete log entry');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRetryJob = async (jobId) => {
    try {
      const retryPromise = jobApi.retryJob(jobId);
      toast.promise(retryPromise, {
        loading: 'Scheduling retry...',
        success: 'Retry initiated',
        error: 'Failed to schedule retry'
      });
      await retryPromise;
      fetchJobs(true);
    } catch (err) {
      console.error('Retry error:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
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
              <Send size={18} className="text-blue-500 hidden sm:block" />
              <h1 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest truncate">
                {activeTab === 'dashboard' ? 'Infrastructure Overview' : activeTab === 'jobs' ? 'Delivery Logs' : 'Failure Review'}
              </h1>
           </div>
           
           <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className={`flex items-center gap-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-zinc-900 border border-zinc-800 ${error ? 'border-rose-500/30' : ''}`}>
                 <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full animate-pulse ${error ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                 <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter ${error ? 'text-rose-400' : 'text-zinc-300'}`}>
                   {error ? 'Offline' : 'Real-time Pipe'}
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
                      <JobTable 
                        jobs={jobs} 
                        loading={loading} 
                        onDeleteClick={(job) => setJobToDelete(job)} 
                        onRetryClick={handleRetryJob}
                      />
                    </div>
                    <div className="space-y-8 w-full min-w-0">
                       <CampaignForm onCampaignAdded={() => fetchJobs(true)} />
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
                   <JobTable 
                     jobs={jobs} 
                     loading={loading} 
                     onDeleteClick={(job) => setJobToDelete(job)}
                     onRetryClick={handleRetryJob}
                   />
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
                   <JobTable 
                     jobs={jobs.filter(j => j.status === 'failed')} 
                     onDeleteClick={(job) => setJobToDelete(job)}
                     onRetryClick={handleRetryJob}
                   />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {jobToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setJobToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-2xl overflow-hidden"
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-4 border border-rose-500/20">
                  <AlertTriangle className="text-rose-500" size={24} />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 uppercase tracking-widest text-center">
                  Confirm Removal
                </h3>
                <p className="text-sm text-zinc-500 mt-2 text-center">
                  Remove record for <span className="font-medium text-zinc-300">{jobToDelete.recipientEmail}</span>? This won't affect sent emails but will remove traces from current log.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  disabled={isDeleting}
                  onClick={() => setJobToDelete(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-all disabled:opacity-50"
                >
                  Keep
                </button>
                <button
                  disabled={isDeleting}
                  onClick={() => handleDeleteJob(jobToDelete.jobId)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <RefreshCw className="animate-spin" size={14} /> : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
