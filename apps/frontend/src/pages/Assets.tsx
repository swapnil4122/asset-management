import React from 'react';
import { Link } from 'react-router-dom';

const Assets: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">My Assets</h2>
        <p className="text-slate-500">
          Manage your tokenized assets and verification requests.
        </p>
      </header>

      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
        <p className="text-slate-400">You don't have any assets yet.</p>
        <Link
          to="/assets/new"
          className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
        >
          Create New Asset
        </Link>
      </div>
    </div>
  );
};

export default Assets;
