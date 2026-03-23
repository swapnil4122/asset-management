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
  LayoutGrid,
  List as ListIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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
        return <Badge color="orange" className="bg-orange-500/10 text-orange-400 border-orange-500/20" icon={<Clock size={12} />}>Pending</Badge>;
      case 'VERIFIED':
        return <Badge color="green" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20" icon={<CheckCircle size={12} />}>Verified</Badge>;
      case 'REJECTED':
        return <Badge color="red" className="bg-red-500/10 text-red-400 border-red-500/20" icon={<XCircle size={12} />}>Rejected</Badge>;
      case 'IN_REVIEW':
        return <Badge color="blue" className="bg-blue-500/10 text-blue-400 border-blue-500/20" icon={<ShieldCheck size={12} />}>In Review</Badge>;
      case 'TOKENIZED':
        return <Badge color="purple" className="bg-purple-500/10 text-purple-400 border-purple-500/20" icon={<Coins size={12} />}>Tokenized</Badge>;
      default:
        return <Badge color="slate">Unknown</Badge>;
    }
  };

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.assetType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-[1600px] mx-auto pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-black text-text-primary tracking-tight">Your Portfolio</h1>
          <p className="text-text-secondary mt-1 text-lg">Manage and track your tokenized real-world holdings.</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <div className="flex bg-background-secondary p-1 rounded-xl border border-background-card">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-background-card text-accent-blue shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <ListIcon size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-background-card text-accent-blue shadow-lg' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          
          <Link
            to="/assets/new"
            className="flex items-center justify-center px-6 py-3 bg-accent-blue text-white rounded-xl font-bold hover:bg-accent-blue/90 shadow-2xl shadow-accent-blue/20 transition-all group scale-100 hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
            Register Asset
          </Link>
        </motion.div>
      </div>

      {/* Search & Filters */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-blue transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name, type or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background-secondary border border-background-card rounded-2xl py-3.5 pl-12 pr-4 text-sm text-text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 focus:border-accent-blue/40 transition-all placeholder:text-text-secondary/50"
          />
        </div>
        <button className="flex items-center px-6 py-3.5 bg-background-secondary border border-background-card rounded-2xl text-sm font-bold text-text-primary hover:bg-background-card hover:border-text-secondary/20 transition-all shadow-sm">
          <Filter size={18} className="mr-2 text-text-secondary" /> Filter
        </button>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-background-secondary/50 backdrop-blur-sm border border-background-card rounded-[2.5rem] p-32 flex flex-col items-center justify-center"
            >
              <div className="relative w-16 h-16">
                 <div className="absolute inset-0 border-4 border-accent-blue/10 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-8 text-text-secondary font-black tracking-widest uppercase text-[10px]">Syncing Decentralized Ledger...</p>
            </motion.div>
          ) : filteredAssets.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background-secondary/30 border-2 border-dashed border-background-card rounded-[2.5rem] p-24 text-center"
            >
               <div className="w-24 h-24 bg-background-card rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Search size={40} className="text-text-secondary/40" />
               </div>
               <h3 className="text-3xl font-black text-text-primary tracking-tight">No assets found</h3>
               <p className="text-text-secondary mt-3 max-w-sm mx-auto text-lg leading-relaxed">
                 We couldn't find any assets matching your criteria. Start by registering a new property to build your portfolio.
               </p>
               <Link
                 to="/assets/new"
                 className="mt-10 inline-flex items-center px-10 py-4 bg-accent-blue text-white rounded-2xl font-black hover:bg-accent-blue/90 shadow-2xl shadow-accent-blue/20 transition-all scale-100 hover:scale-105 active:scale-95"
               >
                 Get Started <ChevronRight size={20} className="ml-2" />
               </Link>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`bg-background-secondary border border-background-card rounded-[2.5rem] shadow-2xl shadow-black/20 overflow-hidden ${viewMode === 'grid' ? 'p-8 bg-transparent border-none shadow-none' : ''}`}
            >
              {viewMode === 'list' ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-background-card/50 px-4">
                        <th className="px-8 py-6 text-left text-[11px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-60">Asset Overview</th>
                        <th className="px-8 py-6 text-left text-[11px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-60">Category</th>
                        <th className="px-8 py-6 text-left text-[11px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-60">Est. Valuation</th>
                        <th className="px-8 py-6 text-left text-[11px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-60">Compliance</th>
                        <th className="px-8 py-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-background-card/30">
                      {filteredAssets.map((asset, index) => (
                        <motion.tr
                          key={asset.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-background-primary/40 transition-all duration-300 cursor-pointer"
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center">
                              <div className="h-14 w-14 shrink-0 bg-background-card border border-white/5 rounded-2xl flex items-center justify-center text-accent-blue font-black group-hover:scale-110 group-hover:bg-accent-blue/10 transition-all duration-300 shadow-xl group-hover:shadow-accent-blue/10">
                                {asset.name.charAt(0)}
                              </div>
                              <div className="ml-5">
                                <div className="text-base font-black text-text-primary group-hover:text-accent-blue transition-colors tracking-tight">
                                  {asset.name}
                                </div>
                                <div className="text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest mt-1 font-mono">
                                  REF-#{asset.id.slice(0, 8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-sm font-bold text-text-secondary/80 bg-background-card/40 px-3 py-1.5 rounded-lg border border-white/5">
                              {asset.assetType.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="text-base font-black text-text-primary">
                              ${asset.valuationUSD.toLocaleString()}
                            </div>
                            <div className="flex items-center text-[10px] font-bold text-accent-green mt-1">
                              <span className="bg-accent-green/10 px-1.5 py-0.5 rounded-md">+4.2%</span>
                              <span className="ml-2 opacity-60 uppercase tracking-widest">Growth</span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            {getStatusBadge(asset.status)}
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end space-x-3">
                               <button className="p-2.5 text-text-secondary hover:text-text-primary hover:bg-background-card rounded-xl transition-all opacity-0 group-hover:opacity-100 hover:scale-110">
                                 <MoreVertical size={20} />
                               </button>
                               <Link 
                                 to={`/assets/${asset.id}`} 
                                 className="p-2.5 bg-background-card text-accent-blue hover:bg-accent-blue hover:text-white rounded-xl transition-all shadow-lg scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100"
                               >
                                 <ChevronRight size={20} />
                               </Link>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAssets.map((asset, index) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Card className="p-6 bg-background-secondary border-background-card hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-black/40 transition-all duration-300 rounded-[2rem] overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                           <div className="h-14 w-14 bg-background-card rounded-2xl flex items-center justify-center text-accent-blue text-2xl font-black shadow-xl group-hover:scale-110 group-hover:bg-accent-blue group-hover:text-white transition-all duration-300">
                             {asset.name.charAt(0)}
                           </div>
                           {getStatusBadge(asset.status)}
                        </div>
                        
                        <div className="mb-6">
                           <h3 className="text-xl font-black text-text-primary mb-1 tracking-tight group-hover:text-accent-blue transition-colors">{asset.name}</h3>
                           <p className="text-xs font-bold text-text-secondary/60 uppercase tracking-widest font-mono">ID: {asset.id.slice(0, 8)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-background-card/50">
                           <div>
                              <p className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest mb-1">Asset Type</p>
                              <p className="text-sm font-bold text-text-primary">{asset.assetType.replace('_', ' ')}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-text-secondary/60 uppercase tracking-widest mb-1">Valuation</p>
                              <p className="text-sm font-black text-accent-blue">${asset.valuationUSD.toLocaleString()}</p>
                           </div>
                        </div>

                        <Link 
                          to={`/assets/${asset.id}`}
                          className="mt-6 w-full flex items-center justify-center py-3.5 bg-background-card hover:bg-accent-blue text-text-primary hover:text-white rounded-xl font-bold transition-all gap-2"
                        >
                          View Details <ChevronRight size={16} />
                        </Link>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {viewMode === 'list' && (
                <div className="px-8 py-6 border-t border-background-card/50 bg-background-card/10 flex items-center justify-between">
                  <p className="text-xs font-bold text-text-secondary tracking-widest uppercase">
                    Syncing <span className="text-text-primary">{filteredAssets.length}</span> verified units
                  </p>
                  <div className="flex space-x-2">
                     <button className="px-4 py-2 bg-background-card border border-background-card rounded-xl text-xs font-black text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-background-primary transition-all" disabled>Previous</button>
                     <button className="px-4 py-2 bg-background-card border border-background-card rounded-xl text-xs font-black text-text-primary hover:border-accent-blue/50 hover:bg-background-primary transition-all">Next</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Assets;
