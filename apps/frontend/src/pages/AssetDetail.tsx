import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Coins,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';
import { useWallet } from '../hooks/useWallet';

interface Listing {
  id: string;
  asset: {
    id: string;
    name: string;
    description: string;
    assetType: string;
    location: string;
    valuationUSD: number;
    ipfsHash?: string;
  };
  priceETH: string;
  priceUSD: number;
  sellerId: string;
}

const AssetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { connect, isConnected, address } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/marketplace/listings/${id}`,
        );
        setListing(response.data);
      } catch (error) {
        console.error('Failed to fetch listing', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  const handlePurchase = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    setIsPurchasing(true);
    try {
      // Simulating backend-assisted purchase for this demo
      await axios.post(`http://localhost:3000/api/marketplace/purchase/${id}`);
      setTxHash('0x' + Math.random().toString(16).slice(2, 10) + '...');

      setTimeout(() => navigate('/assets'), 3000);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Purchase failed');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-indigo-600" size={40} />
      </div>
    );
  if (!listing)
    return (
      <div className="p-20 text-center text-slate-500">Listing not found</div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-colors group"
      >
        <ArrowLeft
          size={20}
          className="mr-2 group-hover:-translate-x-1 transition-transform"
        />{' '}
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Image & Meta */}
        <div className="space-y-6">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden flex items-center justify-center border border-slate-200 shadow-inner group">
            <div className="text-center opacity-10 group-hover:scale-110 transition-transform duration-700">
              <h1 className="text-[12rem] font-black leading-none">
                {listing.asset.assetType[0]}
              </h1>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center">
              <ShieldCheck className="text-blue-500 mr-2" size={20} />{' '}
              Verification Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-medium text-xs mb-1">
                  On-chain Status
                </p>
                <p className="text-slate-900 font-bold">TOKENIZED</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-medium text-xs mb-1">
                  Verified By
                </p>
                <p className="text-slate-900 font-bold">Consensus Node #42</p>
              </div>
            </div>
            {listing.asset.ipfsHash && (
              <a
                href={`https://ipfs.io/ipfs/${listing.asset.ipfsHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-full py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 hover:border-indigo-200 transition"
              >
                View Legal Documents <ExternalLink size={16} className="ml-2" />
              </a>
            )}
          </div>
        </div>

        {/* Right: Info & Purchase */}
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg border border-indigo-100 uppercase tracking-wider">
              {listing.asset.assetType.replace('_', ' ')}
            </span>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight capitalize">
              {listing.asset.name}
            </h1>
            <div className="flex items-center text-slate-500 text-lg">
              <MapPin size={20} className="mr-2 text-rose-500" />{' '}
              {listing.asset.location}
            </div>
          </div>

          <div className="prose prose-slate">
            <p className="text-slate-600 leading-relaxed text-lg">
              {listing.asset.description}
            </p>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-indigo-200 font-bold uppercase tracking-widest text-[0.65rem] mb-2">
                    Current List Price
                  </p>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-5xl font-black tracking-tighter">
                      {listing.priceETH} ETH
                    </span>
                    <span className="text-indigo-200 font-medium text-lg">
                      (${listing.priceUSD.toLocaleString()})
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white/10 rounded-3xl border border-white/10">
                  <Coins size={40} className="text-indigo-300" />
                </div>
              </div>

              {txHash ? (
                <div className="bg-emerald-500/20 p-6 rounded-3xl border border-emerald-400/30 flex items-center backdrop-blur-sm animate-in fade-in zoom-in duration-500">
                  <div className="p-2 bg-emerald-500 rounded-full mr-4">
                    <CheckCircle2 className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-extrabold text-lg">Order Confirmed</p>
                    <p className="text-xs text-indigo-100 opacity-80 break-all">
                      Transaction: {txHash}
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                  className="w-full py-5 bg-white text-indigo-600 rounded-[1.25rem] font-black text-xl hover:bg-indigo-50 transition transform active:scale-[0.98] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isPurchasing ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : isConnected ? (
                    'Complete Purchase'
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              )}

              <div className="mt-6 flex flex-col items-center space-y-2">
                {!isConnected ? (
                  <p className="text-indigo-200 text-xs flex items-center font-medium">
                    <AlertCircle size={14} className="mr-1.5" /> Web3 Browser
                    Extension Required
                  </p>
                ) : (
                  <div className="px-4 py-1.5 bg-indigo-700/50 rounded-full border border-indigo-500/30">
                    <p className="text-indigo-200 text-xs font-bold">
                      Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
