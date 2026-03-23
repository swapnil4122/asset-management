import React from 'react';

const Marketplace: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Marketplace</h2>
        <p className="text-slate-500">Explore and purchase tokenized real-world assets.</p>
      </header>
      
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
        <p className="text-slate-400">Loading marketplace listings...</p>
      </div>
    </div>
  );
};

export default Marketplace;
