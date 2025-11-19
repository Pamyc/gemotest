import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TimelineEvent } from '../types';
import { CheckCircle2, Clock, MapPin } from 'lucide-react';

export const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    api.timeline.getAll().then(setEvents);
  }, []);

  const stages = ['Lead', 'Visit', 'Booking', 'Contract', 'Payment', 'Handover'];

  // Simplified Visual Timeline for a single imaginary deal
  const DealProgress = () => (
    <div className="w-full py-6">
        <div className="relative flex justify-between items-center">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>
            {stages.map((stage, idx) => {
                const active = idx <= 3; // Mock active state
                return (
                    <div key={stage} className="flex flex-col items-center bg-slate-50 px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                            {active ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                        </div>
                        <span className={`mt-2 text-xs font-medium ${active ? 'text-blue-700' : 'text-slate-400'}`}>{stage}</span>
                    </div>
                )
            })}
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Deals Timeline</h1>
      
      {/* Active Deal Focus */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Deal #S-4921 (Client: John Doe)</h3>
                <p className="text-sm text-slate-500">Sunrise Towers, Block A, Apt 402</p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Contract Signed</span>
         </div>
         <DealProgress />
      </div>

      {/* Recent Activity List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-800">Recent Activity Log</h3>
        </div>
        <div className="divide-y divide-slate-100">
            {events.map((evt, idx) => (
                <div key={idx} className="p-4 flex gap-4 hover:bg-slate-50">
                    <div className="flex flex-col items-center">
                         <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                         <div className="w-px h-full bg-slate-200 my-1"></div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <span className="font-medium text-slate-800">{evt.stage}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> {new Date(evt.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600">{evt.comment}</p>
                        <p className="text-xs text-slate-400 mt-1">Ref: {evt.saleId}</p>
                    </div>
                </div>
            ))}
            {/* Filler Mock Data visual */}
            {[1,2,3].map(i => (
                 <div key={`fill-${i}`} className="p-4 flex gap-4 hover:bg-slate-50">
                    <div className="flex flex-col items-center">
                         <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                         <div className="w-px h-full bg-slate-200 my-1"></div>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between mb-1">
                            <span className="font-medium text-slate-700">Payment Received</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12}/> 2 days ago</span>
                        </div>
                        <p className="text-sm text-slate-600">Installment #2 processed via Wire Transfer.</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};