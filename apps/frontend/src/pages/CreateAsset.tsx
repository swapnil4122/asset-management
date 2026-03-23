import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Loader2,
  CheckCircle2,
  MapPin,
  DollarSign,
  Tag,
  Type,
} from 'lucide-react';
import axios from 'axios';

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
      // 1. Create Asset
      const assetResponse = await axios.post('http://localhost:3000/api/assets', {
        name,
        description,
        assetType,
        valuationUSD: parseFloat(valuation),
        location,
      });

      const assetId = assetResponse.data.id;

      // 2. Upload Document/Image to IPFS
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
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="text-green-500 w-20 h-20" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Registration Submitted!</h2>
        <p className="text-slate-500">
          Your asset has been registered and is pending verification. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Register New Asset
        </h2>
        <p className="text-slate-500 mt-2">
          Provide detailed information to begin the tokenization process.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6"
      >
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <Type size={16} className="mr-2 text-indigo-500" /> Asset Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="e.g. Sunset Heights Apartment"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Provide a comprehensive description of the asset..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <Tag size={16} className="mr-2 text-indigo-500" /> Asset Type
            </label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="REAL_ESTATE">Real Estate</option>
              <option value="COMMODITY">Commodity</option>
              <option value="FINE_ART">Fine Art</option>
              <option value="VEHICLE">Vehicle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <DollarSign size={16} className="mr-2 text-indigo-500" /> Valuation (USD)
            </label>
            <input
              type="number"
              required
              value={valuation}
              onChange={(e) => setValuation(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="500000"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
              <MapPin size={16} className="mr-2 text-indigo-500" /> Location / Address
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="123 Luxury Way, Beverly Hills, CA"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Authentication Documents / Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="space-y-1 text-center">
                <Upload
                  className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors"
                  strokeWidth={1.5}
                />
                <div className="flex text-sm text-slate-600">
                  <label className="relative cursor-pointer font-bold text-indigo-600 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">
                  PNG, JPG, PDF up to 10MB
                </p>
                {file && (
                  <p className="text-sm font-bold text-indigo-600 mt-2">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-extrabold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-xl shadow-indigo-100 disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2" size={24} />
            ) : (
              'Submit for Verification'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssetRegistration;
