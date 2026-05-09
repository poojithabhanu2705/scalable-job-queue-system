import React, { useState } from 'react';
import { Send, Hash, Mail, List, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { jobApi } from '../api/jobApi';

export default function CampaignForm({ onCampaignAdded }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    recipients: '',
    priority: '2',
    retryAttempts: '3'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate recipients
    const recipientList = formData.recipients
      .split(/[\n,]/)
      .map(r => r.trim())
      .filter(r => r.length > 0 && r.includes('@'));

    if (recipientList.length === 0) {
      toast.error('Please provide at least one valid email address');
      return;
    }

    setLoading(true);
    try {
      await jobApi.addCampaign({
        ...formData,
        recipients: recipientList
      });
      toast.success('Campaign created and queued for processing');
      setFormData({
        name: '',
        subject: '',
        content: '',
        recipients: '',
        priority: '2',
        retryAttempts: '3'
      });
      if (onCampaignAdded) onCampaignAdded();
    } catch (error) {
      toast.error(error.message || 'Failed to dispatch campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-5 sm:p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
          <Send className="text-blue-400" size={16} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest">New Campaign</h2>
          <p className="text-[10px] text-zinc-500 mt-0.5 uppercase font-medium">Asynchronous Delivery Dispatcher</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-1.5 ml-1">
              Campaign Name
            </label>
            <div className="relative group">
              <input
                required
                type="text"
                placeholder="Marketing Q3..."
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-all focus:ring-1 focus:ring-zinc-700/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-1.5 ml-1">
              Subject Line
            </label>
            <input
              required
              type="text"
              placeholder="Important update inside..."
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-all focus:ring-1 focus:ring-zinc-700/50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-1.5 ml-1">
            Template Content
          </label>
          <textarea
            required
            rows="3"
            placeholder="Hi {{name}}, your request is..."
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-all focus:ring-1 focus:ring-zinc-700/50 resize-none font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-1.5 ml-1">
            Recipient List (CSV or Newline)
          </label>
          <textarea
            required
            rows="3"
            placeholder="user@example.com, alice@company.net..."
            value={formData.recipients}
            onChange={e => setFormData({ ...formData, recipients: e.target.value })}
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-all focus:ring-1 focus:ring-zinc-700/50 resize-none font-mono text-[11px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter ml-1">Priority</label>
            <select
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value })}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 transition-all appearance-none"
            >
              <option value="1">Critical (Highest)</option>
              <option value="2">Default (Medium)</option>
              <option value="3">Bulk (Lowest)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter ml-1">Retries</label>
            <select
              value={formData.retryAttempts}
              onChange={e => setFormData({ ...formData, retryAttempts: e.target.value })}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 transition-all appearance-none"
            >
              <option value="0">No Retries</option>
              <option value="3">3 Attempts</option>
              <option value="5">5 Attempts</option>
              <option value="10">Aggressive (10)</option>
            </select>
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 shadow-lg shadow-white/5 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          {loading ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              Dispatching...
            </>
          ) : (
            <>
              <Send size={14} />
              Launch Campaign
            </>
          )}
        </button>
      </form>
    </div>
  );
}
