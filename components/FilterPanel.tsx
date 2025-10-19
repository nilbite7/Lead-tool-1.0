
import React, { useState } from 'react';
import { INDUSTRIES, WEBSITE_STATUSES } from '../constants';
import type { FilterOptions } from '../types';
import { SearchIcon, LoaderIcon } from './icons/Icons';

interface FilterPanelProps {
  onFindLeads: (filters: FilterOptions) => void;
  isLoading: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onFindLeads, isLoading }) => {
  const [location, setLocation] = useState('San Francisco, USA');
  const [district, setDistrict] = useState('');
  const [industry, setIndustry] = useState('Restaurants');
  const [websiteStatus, setWebsiteStatus] = useState('Outdated Website');
  
  const lastFilters = React.useRef<FilterOptions | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = { location, district, industry, websiteStatus };
    lastFilters.current = filters;
    onFindLeads(filters);
  };
  
  const handleRetry = () => {
    if(lastFilters.current){
        onFindLeads(lastFilters.current);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg h-full sticky top-24">
      <h2 className="text-xl font-bold text-sky-400 mb-4">Discover Clients</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-1">City / State</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="e.g. San Francisco, USA"
          />
        </div>
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-slate-300 mb-1">District / Neighborhood (Optional)</label>
          <input
            id="district"
            type="text"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="e.g. Mission District"
          />
        </div>
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-1">Industry</label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="websiteStatus" className="block text-sm font-medium text-slate-300 mb-1">Website Status</label>
          <select
            id="websiteStatus"
            value={websiteStatus}
            onChange={(e) => setWebsiteStatus(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {WEBSITE_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-sky-800 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Searching...
            </>
          ) : (
            <>
              <SearchIcon className="-ml-1 mr-2 h-5 w-5" />
              Find Leads
            </>
          )}
        </button>
      </form>
    </div>
  );
};
