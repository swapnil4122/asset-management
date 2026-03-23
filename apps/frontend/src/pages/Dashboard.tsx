import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-slate-500">Overview of your asset portfolio and market activity.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Total Assets</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900">12</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Market Value</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900">$1.2M</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Active Listings</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900">4</h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
