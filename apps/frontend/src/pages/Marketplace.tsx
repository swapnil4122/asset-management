import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  BadgeCheck,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

interface Listing {
  id: string;
  asset: {
    id: string;
    name: string;
    assetType: string;
    location: string;
  };
  priceETH: string;
  priceUSD: number;
  createdAt: string;
}

const Marketplace: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/marketplace/listings',
        );
        setListings(response.data);
      } catch (error) {
        console.error('Failed to fetch listings', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => 
    listing.asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.asset.assetType.toLowerCase().includes(searchQuery.toLowerCase())
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

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-12 max-w-[1600px] mx-auto pb-20"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div variants={itemVariants} className="max-w-2xl">
          <div className="flex items-center gap-2 text-accent-blue font-black uppercase tracking-[0.3em] text-[10px] mb-3">
             <div className="w-12 h-[2px] bg-accent-blue"></div>
             Direct Market
          </div>
          <h1 className="text-5xl font-black text-text-primary tracking-tighter leading-none mb-4">
            Global Asset <span className="text-accent-blue">Exchange</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            Acquire fractional ownership in premium real-world assets. High-yield, verified, and secured by decentralized infrastructure.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-blue transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name, location, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-secondary border border-background-card rounded-2xl py-4 pl-12 pr-4 text-sm text-text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 focus:border-accent-blue/40 transition-all placeholder:text-text-secondary/50 shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center px-6 py-4 bg-background-secondary border border-background-card rounded-2xl text-sm font-black text-text-primary hover:bg-background-card hover:border-text-secondary/20 transition-all shadow-sm">
            <Filter size={18} className="mr-3 text-text-secondary" /> Filter
          </button>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-background-secondary/50 rounded-[2.5rem] p-5 border border-background-card/50 overflow-hidden"
              >
                <div className="bg-background-card/50 h-72 rounded-[2rem] mb-6 animate-pulse"></div>
                <div className="px-2 space-y-4">
                  <div className="h-7 bg-background-card/50 rounded-xl w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-background-card/50 rounded-lg w-1/2 animate-pulse"></div>
                  <div className="pt-6 border-t border-background-card/30 flex justify-between items-center">
                    <div className="h-10 bg-background-card/50 rounded-xl w-32 animate-pulse"></div>
                    <div className="h-10 bg-background-card/50 rounded-xl w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : filteredListings.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background-secondary/20 p-32 rounded-[3rem] border-2 border-dashed border-background-card text-center"
          >
            <div className="w-24 h-24 bg-background-card rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
               <Search size={40} className="text-text-secondary/30" />
            </div>
            <h3 className="text-3xl font-black text-text-primary tracking-tight">No active listings</h3>
            <p className="text-text-secondary mt-3 max-w-sm mx-auto text-lg leading-relaxed">
              New institutional-grade assets are currently being verified and tokenized. Please check back shortly.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                variants={itemVariants}
                custom={index}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <Card
                  className="p-0 border-none bg-background-secondary rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/20 hover:shadow-black/60 transition-all duration-500"
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => navigate(`/marketplace/${listing.id}`)}
                  >
                    <div className="relative h-72 bg-background-card overflow-hidden">
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background-secondary via-transparent to-transparent opacity-60 z-10"></div>
                      
                      {/* Dynamic Background Element */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                         <div className="text-9xl font-black tracking-tighter italic">RWA</div>
                      </div>

                      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                        <Badge className="bg-background-primary/80 backdrop-blur-md shadow-2xl border-white/5 uppercase tracking-[0.2em] text-[9px] font-black px-3 py-1.5 text-text-primary">
                          {listing.asset.assetType.replace('_', ' ')}
                        </Badge>
                        <div className="flex bg-accent-green/10 backdrop-blur-md border border-accent-green/20 px-2 py-1 rounded-lg items-center gap-1.5 self-start">
                           <TrendingUp size={10} className="text-accent-green" />
                           <span className="text-[9px] font-black text-accent-green uppercase tracking-tighter">+5.4%</span>
                        </div>
                      </div>
                      
                      <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300">
                         <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-2xl">
                            <ArrowUpRight size={24} />
                         </div>
                      </div>

                      <div className="absolute bottom-6 left-6 z-20">
                         <div className="flex items-center text-white text-[10px] font-bold uppercase tracking-[0.2em] bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
                            <BadgeCheck size={14} className="mr-1.5 text-accent-blue" /> Verified Asset
                         </div>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-black text-text-primary group-hover:text-accent-blue transition-colors tracking-tight line-clamp-1">
                          {listing.asset.name}
                        </h3>
                      </div>

                      <div className="flex items-center text-text-secondary text-xs font-bold uppercase tracking-widest mb-8 opacity-60">
                        <MapPin size={14} className="mr-2 text-accent-red/80" />
                        {listing.asset.location}
                      </div>

                      <div className="flex items-end justify-between pt-8 border-t border-background-card/50">
                        <div>
                          <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-2 opacity-50">
                            Listing Price
                          </p>
                          <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-black text-text-primary tracking-tighter">
                              {listing.priceETH} <span className="text-sm font-bold text-text-secondary/50">ETH</span>
                            </span>
                            <span className="text-xs font-black text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-md border border-accent-green/20">
                              ~${listing.priceUSD.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button className="flex items-center px-6 py-3.5 bg-accent-blue text-white rounded-2xl text-xs font-black shadow-2xl shadow-accent-blue/20 hover:bg-accent-blue/90 group-hover:scale-105 transition-all active:scale-95 uppercase tracking-widest">
                           Invest
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Marketplace;
