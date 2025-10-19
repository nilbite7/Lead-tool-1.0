
import React from 'react';
import type { Lead } from '../types';
import { BookmarkIcon, BuildingIcon, GlobeIcon, MailIcon, PhoneIcon, LightbulbIcon } from './icons/Icons';

interface LeadCardProps {
  lead: Lead;
  isSaved: boolean;
  onSave: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, isSaved, onSave }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 transition-all duration-300 hover:border-sky-500 hover:shadow-2xl hover:shadow-sky-900/50">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-100">{lead.name}</h3>
          <p className="text-sm text-sky-400 flex items-center gap-2"><BuildingIcon className="w-4 h-4" /> {lead.industry}</p>
        </div>
        <button
          onClick={() => onSave(lead)}
          className={`p-2 rounded-full transition-colors ${isSaved ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'}`}
          aria-label={isSaved ? 'Unsave Lead' : 'Save Lead'}
        >
          <BookmarkIcon className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-300">
        <p className="text-xs text-slate-400 bg-slate-700/50 p-2 rounded flex items-start gap-2">
            <LightbulbIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-400"/>
            <span><strong>Reason:</strong> {lead.reason}</span>
        </p>
        
        {lead.website && lead.website !== 'N/A' && (
          <p className="flex items-center gap-2">
            <GlobeIcon className="w-4 h-4 text-slate-500" />
            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">{lead.website}</a>
          </p>
        )}
        {lead.email && (
          <p className="flex items-center gap-2">
            <MailIcon className="w-4 h-4 text-slate-500" />
            <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
          </p>
        )}
        {lead.phone && (
          <p className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 text-slate-500" />
            <span>{lead.phone}</span>
          </p>
        )}
        <p className="text-xs text-slate-400 pt-1">{lead.address}</p>
      </div>
    </div>
  );
};
