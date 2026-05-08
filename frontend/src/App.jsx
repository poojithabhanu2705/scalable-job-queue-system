import React from 'react';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <div className="bg-slate-950 min-h-screen overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      <Dashboard />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid #1e293b',
            fontSize: '12px',
            borderRadius: '12px',
          }
        }} 
      />
    </div>
  );
}
