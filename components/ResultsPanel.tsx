import React from 'react';
import type { Lead } from '../types';
import { LeadCard } from './LeadCard';
import { LoaderIcon, AlertTriangleIcon, PlusCircleIcon } from './icons/Icons';

interface ResultsPanelProps {
  leads: Lead[];
  savedLeads: Lead[];
  onSaveLead: (lead: Lead) => void;
  isLoading: boolean;
  error: string | null;
  onLoadMore: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ leads, savedLeads, onSaveLead, isLoading, error, onLoadMore }) => {
  const hasResults = leads.length > 0;

  const renderContent = () => {
    if (isLoading && !hasResults) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400">
          <LoaderIcon className="h-12 w-12 animate-spin text-sky-500 mb-4" />
          <p className="font-semibold text-lg">Searching for leads...</p>
          <p className="text-sm">Our AI is scanning the web for you.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-red-900/20 border border-red-500/30 rounded-lg">
          <AlertTriangleIcon className="h-10 w-10 text-red-400 mb-4" />
          <p className="font-semibold text-lg text-red-300">An Error Occurred</p>
          <p className="text-sm text-red-400 mb-4">{error}</p>
        </div>
      );
    }
    
    if (!hasResults) {
      return (
        <div className="text-center p-8 text-slate-500">
            <h3 className="text-lg font-semibold text-slate-300">Ready to find clients?</h3>
            <p>Use the filters on the left to start your search.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {leads.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            isSaved={savedLeads.some(saved => saved.id === lead.id)}
            onSave={onSaveLead}
          />
        ))}
      </div>
    );
  }
  
  const renderFooter = () => {
    if (isLoading && hasResults) {
        return (
            <div className="flex justify-center items-center p-4 text-slate-400">
                <LoaderIcon className="h-6 w-6 animate-spin mr-2 text-sky-500" />
                <span>Loading more leads...</span>
            </div>
        );
    }

    if (hasResults && !error) {
        return (
            <div className="pt-4">
                <button
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center bg-slate-700 hover:bg-slate-600 text-sky-400 font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-slate-800 disabled:cursor-not-allowed"
                >
                    <PlusCircleIcon className="mr-2 h-5 w-5" />
                    Load More Results
                </button>
            </div>
        )
    }

    return null;
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-bold text-sky-400 mb-4">Potential Leads</h2>
      <div className="h-[calc(100vh-220px)] overflow-y-auto pr-2">
        {renderContent()}
        {renderFooter()}
      </div>
    </div>
  );
};