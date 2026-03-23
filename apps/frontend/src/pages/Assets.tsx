import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Coins,
} from 'lucide-react';
import axios from 'axios';

interface Asset {
  id: string;
  name: string;
  assetType: string;
  valuationUSD: number;
  status: string;
  createdAt: string;
}

const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/assets');
        // In a real app, we'd filter by owner or use a specific endpoint
        setAssets(response.data);
      } catch (error) {
        console.error('Failed to fetch assets', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="text-amber-500" size={16} />;
      case 'VERIFIED':
        return <CheckCircle className="text-emerald-500" size={16} />;
      case 'REJECTED':
        return <XCircle className="text-rose-500" size={16} />;
      case 'IN_REVIEW':
        return <ShieldCheck className="text-blue-500" size={16} />;
      case 'TOKENIZED':
        return <Coins className="text-indigo-600" size={16} />;
      default:
        return <Clock className="text-slate-400" size={16} />;
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Assets
          </h2>
          <p className="text-slate-500 mt-1">
            Manage your registered property and tokenization status.
          </p>
        </div>
        <Link
          to="/assets/new"
          className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
        >
          <Plus size={20} className="mr-2" /> New Asset
        </Link>
      </header>

      {isLoading ? (
        <div className="bg-white p-20 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-500 font-medium">Loading assets...</p>
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-slate-50 rounded-full text-slate-400">
              <Search size={40} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900">No assets found</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            You haven't registered any assets yet. Start by adding your first
            real-world property.
          </p>
          <Link
            to="/assets/new"
            className="mt-6 inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-xl shadow-indigo-100"
          >
            Get Started
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-4 mb-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search size={18} />
              </span>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search assets..."
              />
            </div>
            <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition">
              <Filter size={18} className="mr-2" /> Filter
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Valuation
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                          {asset.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900">
                            {asset.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            Added {new Date(asset.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600">
                        {asset.assetType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      ${asset.valuationUSD.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(asset.status)}
                        <span className="text-sm font-semibold capitalize text-slate-700">
                          {asset.status.toLowerCase().replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;
