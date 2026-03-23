import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpRight,
  MapPin,
  BadgeCheck,
  CircleDollarSign,
} from 'lucide-react';
import axios from 'axios';

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

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Marketplace
          </h2>
          <p className="text-slate-500 mt-2 text-lg">
            Discover and invest in fractionalized real-world assets.
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search size={18} />
            </span>
            <input
              className="block w-64 pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
              placeholder="Search assets..."
            />
          </div>
          <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition shadow-sm">
            <Filter size={18} className="mr-2" /> Filter
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm animate-pulse"
            >
              <div className="bg-slate-200 h-48 rounded-2xl mb-4"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl shadow-sm border border-slate-100 text-center">
          <CircleDollarSign size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-2xl font-bold text-slate-900">
            No active listings
          </h3>
          <p className="text-slate-500 mt-2">
            Check back later for new investment opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="relative h-56 bg-slate-100">
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur text-xs font-bold rounded-lg text-indigo-600 shadow-sm border border-white/20">
                    {listing.asset.assetType.replace('_', ' ')}
                  </span>
                </div>
                {/* Image Placeholder */}
                <div className="w-full h-full flex items-center justify-center text-slate-300 group-hover:scale-105 transition-transform duration-500">
                  <div className="text-center">
                    <div className="text-5xl font-black opacity-10 uppercase tracking-tighter">
                      ASSET
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {listing.asset.name}
                  </h3>
                  <BadgeCheck className="text-blue-500 shrink-0" size={20} />
                </div>

                <div className="flex items-center text-slate-500 text-sm mb-4">
                  <MapPin size={14} className="mr-1" />
                  {listing.asset.location}
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Price
                    </p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-black text-slate-900">
                        {listing.priceETH} ETH
                      </span>
                      <span className="text-sm font-medium text-slate-500">
                        (${listing.priceUSD.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  <button className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <ArrowUpRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
