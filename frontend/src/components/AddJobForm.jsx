import React, { useState } from 'react';
import { Plus, Loader2, Database, Sliders, Timer, Command } from 'lucide-react';
import { jobApi } from '../api/jobApi';
import { toast } from 'react-hot-toast';

export default function AddJobForm({ onJobAdded }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'email-service',
    data: '{\n  "to": "user@example.com",\n  "subject": "System Alert"\n}',
    priority: 5,
    delay: 0,
    attempts: 3,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validation: Try parsing JSON first
      let parsedData;
      try {
        parsedData = JSON.parse(formData.data);
      } catch (err) {
        toast.error('Invalid JSON syntax: please check your payload structure');
        setLoading(false);
        return;
      }

      // API Call
      await jobApi.addJob({ 
        ...formData, 
        data: parsedData,
        // Ensure numbers are truly numbers
        priority: Number(formData.priority),
        delay: Number(formData.delay),
        attempts: Number(formData.attempts)
      });
      
      toast.success('Job dispatched successfully');
      onJobAdded?.();
      
    } catch (error) {
      // Use the message formatted by our axios interceptor
      const errorMessage = error.message || 'Failed to dispatch job';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 sm:p-6 animate-fade-in shadow-xl shadow-black/20 w-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1.5 bg-zinc-100 text-zinc-950 rounded">
          <Database size={14} />
        </div>
        <h2 className="text-sm font-semibold text-zinc-100">Add New Job</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
          <div className="space-y-1.5 xs:col-span-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Job Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-700 transition-all text-zinc-200"
            >
              <option value="email-service">Email Service</option>
              <option value="image-processing">Image Processing</option>
              <option value="data-cleanup">Data Cleanup</option>
              <option value="report">Generate Report</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <Sliders size={10} /> Priority (1-10)
            </label>
            <input
              type="number"
              min="1" max="10"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-700 transition-all text-zinc-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <Plus size={10} /> Attempts
            </label>
            <input
              type="number"
              value={formData.attempts}
              onChange={(e) => setFormData({ ...formData, attempts: e.target.value })}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-700 transition-all text-zinc-200"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Payload (JSON)</label>
          <textarea
            rows="4"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-[11px] font-mono focus:outline-none focus:border-zinc-700 transition-all text-zinc-300 placeholder:text-zinc-700 leading-relaxed resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
          ) : (
            <>
              <Command size={14} /> Submit Job
            </>
          )}
        </button>
      </form>
    </div>
  );
}
