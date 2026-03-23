import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  BadgeCheck,
  ChevronRight,
} from 'lucide-react';
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight">Marketplace</h1>
          <p className="text-text-secondary mt-2 text-lg">
            Invest in fractionalized real-world assets secured by blockchain.
          </p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-secondary border border-background-card rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 transition-all"
            />
          </div>
          <button className="flex items-center px-5 py-2.5 bg-background-secondary border border-background-card rounded-xl text-sm font-bold text-text-primary hover:bg-background-card transition-all">
            <Filter size={18} className="mr-2" /> Filter
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-background-secondary rounded-3xl p-4 border border-background-card animate-pulse"
            >
              <div className="bg-background-card h-56 rounded-2xl mb-6"></div>
              <div className="h-6 bg-background-card rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-background-card rounded w-1/2 mb-6"></div>
              <div className="h-12 bg-background-card rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-background-secondary p-20 rounded-3xl border border-background-card text-center">
          <div className="w-20 h-20 bg-background-card rounded-full flex items-center justify-center mx-auto mb-6">
             <Search size={32} className="text-text-secondary" />
          </div>
          <h3 className="text-2xl font-black text-text-primary">No active listings</h3>
          <p className="text-text-secondary mt-2 max-w-sm mx-auto">
            Check back later for new investment opportunities in fractionalized real estate and commodities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              className="group p-0 border-none bg-background-secondary hover:translate-y-[-4px] transition-all duration-300 shadow-xl shadow-transparent hover:shadow-black/20"
            >
              <div 
                className="cursor-pointer"
                onClick={() => navigate(`/marketplace/${listing.id}`)}
              >
                <div className="relative h-64 bg-background-card overflow-hidden rounded-t-3xl">
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  
                  <div className="absolute top-5 left-5 z-20">
                    <Badge color="blue" className="bg-background-primary/80 backdrop-blur shadow-lg border-white/10 uppercase tracking-widest text-[10px]">
                      {listing.asset.assetType.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  {/* Decorative Asset Symbol */}
                  <div className="w-full h-full flex items-center justify-center text-text-secondary/10 group-hover:scale-110 transition-transform duration-700 select-none">
                    <div className="text-7xl font-black italic tracking-tighter">
                      RWA
                    </div>
                  </div>

                  <div className="absolute bottom-5 right-5 z-20 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                     <div className="w-10 h-10 bg-accent-blue rounded-full flex items-center justify-center text-white shadow-xl shadow-accent-blue/30">
                        <ChevronRight size={20} />
                     </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-blue transition-colors">
                      {listing.asset.name}
                    </h3>
                    <BadgeCheck className="text-accent-blue shrink-0 ml-2" size={20} />
                  </div>

                  <div className="flex items-center text-text-secondary text-xs font-medium mb-6">
                    <MapPin size={14} className="mr-1 text-accent-red/60" />
                    {listing.asset.location}
                  </div>

                  <div className="flex items-end justify-between pt-5 border-t border-background-card/50">
                    <div>
                      <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-1">
                        Investment Price
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-text-primary">
                          {listing.priceETH} ETH
                        </span>
                        <span className="text-xs font-bold text-accent-green">
                          ${listing.priceUSD.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button className="flex items-center px-4 py-2 bg-accent-blue/10 hover:bg-accent-blue text-accent-blue hover:text-white rounded-xl text-xs font-bold transition-all border border-accent-blue/20 hover:border-accent-blue">
                       Buy Fractional
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
