import React, { useState, useEffect, useCallback } from 'react';
import { FilterPanel } from './components/FilterPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { SavedLeadsPanel } from './components/SavedLeadsPanel';
import type { FilterOptions, Lead } from './types';
import { findLeads as findLeadsService } from './services/geminiService';

const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [savedLeads, setSavedLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFilters, setLastFilters] = useState<FilterOptions | null>(null);

  useEffect(() => {
    try {
      const storedLeads = localStorage.getItem('savedLeads');
      if (storedLeads) {
        setSavedLeads(JSON.parse(storedLeads));
      }
    } catch (e) {
      console.error("Failed to parse saved leads from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('savedLeads', JSON.stringify(savedLeads));
      if (selectedLead) {
          const updatedSelectedLead = savedLeads.find(l => l.id === selectedLead.id);
          setSelectedLead(updatedSelectedLead || null);
      }
    } catch (e) {
      console.error("Failed to save leads to localStorage", e);
    }
  }, [savedLeads, selectedLead]);

  const handleNewSearch = useCallback(async (filters: FilterOptions) => {
    setIsLoading(true);
    setError(null);
    setLeads([]);
    setLastFilters(filters);
    try {
      const newLeads = await findLeadsService(filters);
      setLeads(newLeads);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleLoadMore = useCallback(async () => {
    if (!lastFilters || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
        const newLeads = await findLeadsService(lastFilters, leads);
        setLeads(prev => [...prev, ...newLeads]);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  }, [lastFilters, leads, isLoading]);

  const handleSaveLead = useCallback((lead: Lead) => {
    setSavedLeads(prev => {
      if (prev.some(saved => saved.id === lead.id)) {
        return prev.filter(saved => saved.id !== lead.id);
      }
      return [{ ...lead, notes: '', status: 'Not Contacted' }, ...prev];
    });
  }, []);

  const handleSelectLead = useCallback((lead: Lead) => {
    setSelectedLead(lead);
  }, []);

  const handleUpdateLead = useCallback((updatedLead: Lead) => {
    setSavedLeads(prev => prev.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
  }, []);

  const handleExportCsv = useCallback(() => {
    if (savedLeads.length === 0) {
      alert("No saved leads to export.");
      return;
    }
    const headers = ['name', 'industry', 'address', 'website', 'email', 'phone', 'reason', 'status', 'notes'];
    const csvContent = [
      headers.join(','),
      ...savedLeads.map(lead => headers.map(header => `"${(lead[header as keyof Lead] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'leads.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [savedLeads]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <header className="bg-slate-900/70 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <h1 className="text-2xl font-bold text-sky-400">Lead Finder AI</h1>
                <p className="text-slate-400">Your AI-powered client acquisition tool</p>
            </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <FilterPanel onFindLeads={handleNewSearch} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-5">
            <ResultsPanel
              leads={leads}
              savedLeads={savedLeads}
              onSaveLead={handleSaveLead}
              isLoading={isLoading}
              error={error}
              onLoadMore={handleLoadMore}
            />
          </div>
          <div className="lg:col-span-4">
            <SavedLeadsPanel
              savedLeads={savedLeads}
              selectedLead={selectedLead}
              onSelectLead={handleSelectLead}
              onUpdateLead={handleUpdateLead}
              onExportCsv={handleExportCsv}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;