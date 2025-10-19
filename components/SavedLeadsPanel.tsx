
import React from 'react';
import type { Lead, LeadStatus } from '../types';
import { EditIcon, ExportIcon } from './icons/Icons';

interface SavedLeadsPanelProps {
  savedLeads: Lead[];
  selectedLead: Lead | null;
  onSelectLead: (lead: Lead) => void;
  onUpdateLead: (lead: Lead) => void;
  onExportCsv: () => void;
}

const statusColors: Record<LeadStatus, string> = {
  'Not Contacted': 'bg-slate-600 text-slate-200',
  'Contacted': 'bg-yellow-600 text-yellow-100',
  'Converted': 'bg-green-600 text-green-100',
};

export const SavedLeadsPanel: React.FC<SavedLeadsPanelProps> = ({
  savedLeads,
  selectedLead,
  onSelectLead,
  onUpdateLead,
  onExportCsv
}) => {
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedLead) {
      onUpdateLead({ ...selectedLead, notes: e.target.value });
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedLead) {
      onUpdateLead({ ...selectedLead, status: e.target.value as LeadStatus });
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-full sticky top-24">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-sky-400">Saved Leads ({savedLeads.length})</h2>
        <button
          onClick={onExportCsv}
          disabled={savedLeads.length === 0}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-3 rounded-md text-sm transition duration-300 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          <ExportIcon className="w-4 h-4"/> Export CSV
        </button>
      </div>
      
      <div className="h-[calc(100vh-220px)] flex flex-col">
        {selectedLead ? (
          <div className="flex-grow flex flex-col">
            <div className="border-b border-slate-700 pb-4 mb-4">
              <button onClick={() => onSelectLead(null)} className="text-sm text-sky-400 hover:underline mb-2">&larr; Back to list</button>
              <h3 className="text-lg font-bold">{selectedLead.name}</h3>
              <p className="text-sm text-slate-400">{selectedLead.industry}</p>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
               <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select
                  id="status"
                  value={selectedLead.status}
                  onChange={handleStatusChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {Object.keys(statusColors).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                <textarea
                  id="notes"
                  rows={8}
                  value={selectedLead.notes}
                  onChange={handleNotesChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Add your notes, pitch ideas, contact attempts..."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto pr-2">
            {savedLeads.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <p>Saved leads will appear here.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {savedLeads.map(lead => (
                  <li key={lead.id} onClick={() => onSelectLead(lead)} className="bg-slate-700/50 p-3 rounded-md cursor-pointer hover:bg-slate-700 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-200">{lead.name}</p>
                        <p className="text-xs text-slate-400">{lead.industry}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status]}`}>
                          {lead.status}
                        </span>
                        <EditIcon className="w-4 h-4 text-slate-400"/>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
