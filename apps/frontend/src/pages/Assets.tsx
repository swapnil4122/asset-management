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
  ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/assets');
        setAssets(response.data);
      } catch (error) {
        console.error('Failed to fetch assets', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge color="orange" icon={<Clock size={12} />}>Pending</Badge>;
      case 'VERIFIED':
        return <Badge color="green" icon={<CheckCircle size={12} />}>Verified</Badge>;
      case 'REJECTED':
        return <Badge color="red" icon={<XCircle size={12} />}>Rejected</Badge>;
      case 'IN_REVIEW':
        return <Badge color="blue" icon={<ShieldCheck size={12} />}>In Review</Badge>;
      case 'TOKENIZED':
        return <Badge color="purple" icon={<Coins size={12} />}>Tokenized</Badge>;
      default:
        return <Badge color="slate">Unknown</Badge>;
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.assetType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Your Assets</h1>
          <p className="text-text-secondary mt-1">Manage and track your tokenized real-world holdings.</p>
        </div>
        <Link
          to="/assets/new"
          className="flex items-center justify-center px-6 py-3 bg-accent-blue text-white rounded-xl font-bold hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/20 transition-all group"
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
          Register New Asset
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background-secondary border border-background-card rounded-xl py-3 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 transition-all"
          />
        </div>
        <button className="flex items-center px-6 py-3 bg-background-secondary border border-background-card rounded-xl text-sm font-bold text-text-primary hover:bg-background-card transition-all">
          <Filter size={18} className="mr-2" /> Filter
        </button>
      </div>

      {/* Main Content */}
      <Card className="p-0 border-none bg-transparent shadow-none overflow-visible">
        {isLoading ? (
          <div className="bg-background-secondary border border-background-card rounded-3xl p-20 flex flex-col items-center">
            <div className="relative w-12 h-12">
               <div className="absolute inset-0 border-4 border-accent-blue/20 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-text-secondary font-bold tracking-wide uppercase text-xs">Syncing with Ledger...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="bg-background-secondary border border-background-card rounded-3xl p-16 text-center">
             <div className="w-20 h-20 bg-background-card rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-text-secondary" />
             </div>
             <h3 className="text-xl font-black text-text-primary">No assets found</h3>
             <p className="text-text-secondary mt-2 max-w-sm mx-auto">
               We couldn't find any assets matching your criteria. Start by registering a new property.
             </p>
             <Link
               to="/assets/new"
               className="mt-8 inline-block px-8 py-3 bg-accent-blue text-white rounded-xl font-bold hover:bg-accent-blue/90 shadow-xl shadow-accent-blue/20 transition-all"
             >
               Get Started
             </Link>
          </div>
        ) : (
          <div className="bg-background-secondary border border-background-card rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-background-card">
                    <th className="px-6 py-5 text-left text-[11px] font-black text-text-secondary uppercase tracking-[0.1em]">Asset Details</th>
                    <th className="px-6 py-5 text-left text-[11px] font-black text-text-secondary uppercase tracking-[0.1em]">Type</th>
                    <th className="px-6 py-5 text-left text-[11px] font-black text-text-secondary uppercase tracking-[0.1em]">Market Value</th>
                    <th className="px-6 py-5 text-left text-[11px] font-black text-text-secondary uppercase tracking-[0.1em]">Status</th>
                    <th className="px-6 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background-card">
                  {filteredAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="group hover:bg-background-card/40 transition-all duration-200 cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="h-12 w-12 shrink-0 bg-background-card border border-white/5 rounded-2xl flex items-center justify-center text-accent-blue font-black group-hover:scale-110 transition-transform shadow-inner">
                            {asset.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-black text-text-primary group-hover:text-accent-blue transition-colors">
                              {asset.name}
                            </div>
                            <div className="text-[11px] font-medium text-text-secondary uppercase tracking-wider mt-0.5">
                              ID: {asset.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-bold text-text-secondary">
                          {asset.assetType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-black text-text-primary">
                          ${asset.valuationUSD.toLocaleString()}
                        </div>
                        <div className="text-[10px] font-bold text-accent-green mt-0.5">
                          +4.2% Est.
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(asset.status)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                           <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-card rounded-xl transition-all opacity-0 group-hover:opacity-100">
                             <MoreVertical size={18} />
                           </button>
                           <Link to={`/assets/${asset.id}`} className="p-2 text-accent-blue hover:bg-accent-blue/10 rounded-xl transition-all">
                             <ChevronRight size={18} />
                           </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Placeholder */}
            <div className="px-6 py-4 border-t border-background-card bg-background-card/20 flex items-center justify-between">
              <p className="text-xs font-medium text-text-secondary">
                Showing <span className="text-text-primary font-bold">{filteredAssets.length}</span> results
              </p>
              <div className="flex space-x-2">
                 <button className="px-3 py-1.5 bg-background-card border border-background-card rounded-lg text-xs font-bold text-text-secondary disabled:opacity-50" disabled>Previous</button>
                 <button className="px-3 py-1.5 bg-background-card border border-background-card rounded-lg text-xs font-bold text-text-primary hover:border-accent-blue/50">Next</button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Assets;
