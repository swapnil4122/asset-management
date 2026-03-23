import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Loader2,
  CheckCircle2,
  MapPin,
  DollarSign,
  Type,
  X,
  FileText,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';

const AssetRegistration: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assetType, setAssetType] = useState('REAL_ESTATE');
  const [valuation, setValuation] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const assetResponse = await axios.post('http://localhost:3000/api/assets', {
        name,
        description,
        assetType,
        valuationUSD: parseFloat(valuation),
        location,
      });

      const assetId = assetResponse.data.id;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        await axios.post(
          `http://localhost:3000/api/blockchain/upload/${assetId}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );
      }

      setSuccess(true);
      setTimeout(() => navigate('/assets'), 2000);
    } catch (err) {
      const message = axios.isAxiosError(err) 
        ? err.response?.data?.message 
        : 'Failed to register asset.';
      setError(message || 'Failed to register asset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-accent-green w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-text-primary tracking-tight">Success!</h2>
        <p className="text-text-secondary mt-2 text-lg">
          Your asset has been registered and sent for verification.
        </p>
        <div className="mt-8 flex justify-center">
           <div className="flex items-center space-x-2 text-accent-blue font-bold text-sm">
              <Loader2 className="animate-spin" size={18} />
              <span>Redirecting to portfolio...</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight">Register Asset</h1>
          <p className="text-text-secondary mt-1">Start the tokenization process for your real-world property.</p>
        </div>
        <Badge color="blue" className="mt-2 uppercase tracking-widest px-3 py-1">Step 1 of 2</Badge>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm rounded-2xl font-bold flex items-center shadow-lg shadow-accent-red/5">
            <AlertCircle size={20} className="mr-3 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Asset Information" subtitle="Basic details about your property">
              <div className="space-y-6">
                <Input
                  label="Asset Name"
                  placeholder="e.g. Sunset Heights Apartment"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<Type size={18} />}
                />
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of the asset, its unique features, and history..."
                    className="w-full bg-background-secondary border border-background-card rounded-xl py-3 px-4 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue/50 transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Asset Type"
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value)}
                    options={[
                      { value: 'REAL_ESTATE', label: 'Real Estate' },
                      { value: 'COMMODITY', label: 'Commodity' },
                      { value: 'FINE_ART', label: 'Fine Art' },
                      { value: 'VEHICLE', label: 'Vehicle' },
                    ]}
                  />
                  <Input
                    label="Valuation (USD)"
                    type="number"
                    placeholder="500,000"
                    required
                    value={valuation}
                    onChange={(e) => setValuation(e.target.value)}
                    icon={<DollarSign size={18} />}
                  />
                </div>

                <Input
                  label="Location / Address"
                  placeholder="123 Luxury Way, Beverly Hills, CA"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  icon={<MapPin size={18} />}
                />
              </div>
            </Card>
          </div>

          {/* Verification Side */}
          <div className="lg:col-span-1 space-y-6">
            <Card title="Verification Documents" subtitle="Legal proofs and images">
              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="file"
                    className="sr-only"
                    id="file-upload"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                  {!file ? (
                    <label 
                      htmlFor="file-upload" 
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-background-card hover:border-accent-blue/50 bg-background-primary/50 hover:bg-accent-blue/5 rounded-3xl transition-all cursor-pointer group-hover:scale-[1.02]"
                    >
                      <div className="w-12 h-12 bg-background-card rounded-2xl flex items-center justify-center mb-4 group-hover:bg-accent-blue/10 group-hover:text-accent-blue transition-colors">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm font-bold text-text-primary">Click to upload</p>
                      <p className="text-[10px] text-text-secondary mt-1 uppercase tracking-wider font-bold">PNG, JPG or PDF</p>
                    </label>
                  ) : (
                    <div className="relative p-4 border border-accent-blue/20 bg-accent-blue/5 rounded-3xl animate-in zoom-in-95 duration-200">
                      <button 
                        type="button"
                        onClick={() => setFile(null)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-background-secondary border border-background-card rounded-full flex items-center justify-center text-text-secondary hover:text-accent-red transition-all shadow-lg"
                      >
                        <X size={16} />
                      </button>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-accent-blue text-white rounded-xl flex items-center justify-center mr-4">
                           <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-bold text-text-primary truncate">{file.name}</p>
                           <p className="text-[10px] text-text-secondary mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-background-card/30 rounded-2xl p-4 border border-background-card">
                   <div className="flex space-x-3">
                      <AlertCircle size={18} className="text-accent-blue shrink-0" />
                      <p className="text-[11px] leading-relaxed text-text-secondary">
                        Documents will be stored securely on IPFS and used by verifiers to validate the asset.
                      </p>
                   </div>
                </div>
              </div>
            </Card>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-accent-blue text-white rounded-2xl font-black text-lg hover:bg-accent-blue/90 shadow-2xl shadow-accent-blue/20 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center group"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin mr-2" size={24} />
              ) : (
                <>
                  Submit Asset
                  <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AssetRegistration;
