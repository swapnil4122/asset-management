import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

interface VerificationRequest {
  id: string;
  asset: {
    id: string;
    name: string;
    assetType: string;
    location: string;
    ipfsHash?: string;
  };
  status: string;
  createdAt: string;
}

const VerifierDashboard: React.FC = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      // Endpoint typically returns pending requests
      const response = await axios.get('http://localhost:3000/api/verification/pending');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch verification requests', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this asset?')) return;
    setProcessingId(id);
    try {
      await axios.post(`http://localhost:3000/api/verification/approve/${id}`);
      setRequests(requests.filter(r => r.id !== id));
    } catch (error) {
      const message = axios.isAxiosError(error) 
        ? error.response?.data?.message 
        : 'Approval failed';
      alert(message || 'Approval failed');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setProcessingId(id);
    try {
      await axios.post(`http://localhost:3000/api/verification/reject/${id}`, {
        rejectionReason: reason
      });
      setRequests(requests.filter(r => r.id !== id));
    } catch (error) {
      const message = axios.isAxiosError(error) 
        ? error.response?.data?.message 
        : 'Rejection failed';
      alert(message || 'Rejection failed');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
          <ShieldCheck className="mr-3 text-indigo-600" size={32} /> Verifier Dashboard
        </h2>
        <p className="text-slate-500 mt-2">
          Review and process pending asset verification requests.
        </p>
      </header>

      {isLoading ? (
        <div className="bg-white p-20 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="mt-4 text-slate-500 font-medium">Fetching pending requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl shadow-sm border border-slate-100 text-center">
           <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-500" size={32} />
           </div>
           <h3 className="text-2xl font-bold text-slate-900">All caught up!</h3>
           <p className="text-slate-500 mt-2">There are no pending verification requests at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                       <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{request.asset.name}</h4>
                      <p className="text-sm text-slate-500 flex items-center mt-1">
                        <Clock size={14} className="mr-1" /> Submitted {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      <span className="mt-2 inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[0.65rem] font-black rounded-lg border border-indigo-100 uppercase tracking-widest">
                        {request.asset.assetType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                     {request.asset.ipfsHash && (
                        <a 
                          href={`https://ipfs.io/ipfs/${request.asset.ipfsHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-bold hover:bg-slate-50 transition flex items-center"
                        >
                          Review Docs <ExternalLink size={14} className="ml-2" />
                        </a>
                     )}
                     
                     <button 
                        onClick={() => handleReject(request.id)}
                        disabled={!!processingId}
                        className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition flex items-center border border-rose-100"
                     >
                        <XCircle size={14} className="mr-2" /> Reject
                     </button>
                     
                     <button 
                        onClick={() => handleApprove(request.id)}
                        disabled={!!processingId}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition flex items-center shadow-lg shadow-emerald-100"
                     >
                        {processingId === request.id ? <Loader2 className="animate-spin" size={14} /> : (
                          <>
                            <CheckCircle size={14} className="mr-2" /> Approve Asset
                          </>
                        )}
                     </button>
                  </div>
               </div>
               
               <div className="mt-6 pt-6 border-t border-slate-50 flex items-center text-xs text-slate-400 italic">
                  <AlertCircle size={12} className="mr-1" /> 
                  Approval will trigger on-chain tokenization and notify the owner.
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifierDashboard;
