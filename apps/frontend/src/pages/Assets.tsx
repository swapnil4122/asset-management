import React from 'react';

const Assets: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">My Assets</h2>
        <p className="text-slate-500">Manage your tokenized assets and verification requests.</p>
      </header>
      
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
        <p className="text-slate-400">You don't have any assets yet.</p>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
          Create New Asset
        </button>
      </div>
    </div>
  );
};

export default Assets;
