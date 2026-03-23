import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Info,
  DollarSign,
  MapPin,
  Building,
  CheckCircle2,
  FileText,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  ArrowRight,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import axios from 'axios';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const CreateAsset: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    assetType: 'REAL_ESTATE',
    valuationUSD: '',
    location: '',
    metadata: {
      description: '',
      area: '',
      yearBuilt: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/api/assets', {
        ...formData,
        valuationUSD: Number(formData.valuationUSD),
      });
      navigate('/assets');
    } catch (error) {
      console.error('Failed to create asset', error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Identity', icon: <Building size={18} /> },
    { id: 2, title: 'Economics', icon: <DollarSign size={18} /> },
    { id: 3, title: 'Context', icon: <FileText size={18} /> },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      {/* Header & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
           <div className="inline-flex items-center gap-2 bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-accent-blue/20">
             <ShieldCheck size={12} /> SECURE REGISTRATION
           </div>
           <h1 className="text-5xl font-black text-text-primary tracking-tighter">Register <span className="text-accent-blue">Asset</span></h1>
           <p className="text-text-secondary mt-2 text-lg">Initialize a new RWA on the decentralized ledger.</p>
        </div>

        <div className="flex items-center gap-4 bg-background-secondary p-2 rounded-[2rem] border border-background-card">
          {steps.map((s) => (
            <div 
              key={s.id}
              className={`flex items-center gap-3 px-6 py-3 rounded-[1.5rem] transition-all duration-500 ${step === s.id ? 'bg-background-card text-accent-blue shadow-xl border border-white/5 pr-8' : 'text-text-secondary opacity-40'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${step === s.id ? 'bg-accent-blue/10' : ''}`}>
                {s.icon}
              </div>
              {step === s.id && <span className="text-sm font-black tracking-tight">{s.title}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <Card className="p-10 bg-background-secondary border-background-card rounded-[2.5rem] shadow-2xl shadow-black/40 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.form
                key={step}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Asset Prime Name"
                        placeholder="e.g. Skyline Plaza - Tower A"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-background-card/50 border-background-card focus:border-accent-blue/50"
                      />
                      <Select
                        label="Asset Classification"
                        options={[
                          { label: 'Real Estate', value: 'REAL_ESTATE' },
                          { label: 'Commodity', value: 'COMMODITY' },
                          { label: 'Fixed Income', value: 'FIXED_INCOME' },
                          { label: 'Private Equity', value: 'EQUITY' },
                        ]}
                        value={formData.assetType}
                        onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                        className="bg-background-card/50 border-background-card focus:border-accent-blue/50"
                      />
                    </div>
                    <Input
                      label="Geographic Location / Jurisdiction"
                      placeholder="e.g. Zurich, Switzerland"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className="bg-background-card/50 border-background-card focus:border-accent-blue/50"
                      icon={<MapPin size={18} className="text-text-secondary" />}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Total Valuation (USD)"
                        type="number"
                        placeholder="0.00"
                        value={formData.valuationUSD}
                        onChange={(e) => setFormData({ ...formData, valuationUSD: e.target.value })}
                        required
                        className="bg-background-card/50 border-background-card focus:border-accent-blue/50"
                        icon={<DollarSign size={18} className="text-text-secondary" />}
                      />
                      <Input
                        label="Internal Area (Sq Ft)"
                        type="number"
                        placeholder="2,500"
                        value={formData.metadata.area}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, area: e.target.value } })}
                        className="bg-background-card/50 border-background-card focus:border-accent-blue/50"
                      />
                    </div>
                    <Input
                      label="Year of Inception"
                      type="number"
                      placeholder="2024"
                      value={formData.metadata.yearBuilt}
                      onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, yearBuilt: e.target.value } })}
                      className="bg-background-card/50 border-background-card focus:border-accent-blue/50"
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <label className="block">
                      <span className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-4 block opacity-60">Asset Narrative</span>
                      <textarea
                        className="w-full bg-background-card/50 border border-background-card rounded-[2rem] p-6 text-text-primary focus:outline-none focus:ring-4 focus:ring-accent-blue/10 focus:border-accent-blue/40 transition-all min-h-[160px] placeholder:text-text-secondary/30"
                        placeholder="Provide deep context on project viability and historical performance..."
                        value={formData.metadata.description}
                        onChange={(e) => setFormData({ ...formData, metadata: { ...formData.metadata, description: e.target.value } })}
                      />
                    </label>
                    <div className="p-8 border-2 border-dashed border-background-card rounded-[2.5rem] bg-background-card/20 group hover:border-accent-blue/50 transition-all cursor-pointer text-center">
                       <div className="w-16 h-16 bg-background-card rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:bg-accent-blue group-hover:text-white transition-all">
                          <Upload size={24} />
                       </div>
                       <p className="text-sm font-black text-text-primary mb-1">Verify Ownership Documentation</p>
                       <p className="text-xs font-bold text-text-secondary opacity-60">PDF, JPG or PNG up to 25MB</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-10 border-t border-background-card/50 mt-10">
                  <button
                    type="button"
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    className={`flex items-center gap-2 px-8 py-3 bg-background-card text-text-primary rounded-xl font-bold transition-all hover:bg-background-primary ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  >
                    <ChevronLeft size={18} /> Previous
                  </button>
                  
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={() => setStep(s => Math.min(3, s + 1))}
                      className="flex items-center gap-2 px-10 py-3 bg-accent-blue text-white rounded-xl font-black shadow-2xl shadow-accent-blue/20 transition-all hover:bg-accent-blue/90 scale-100 hover:scale-[1.05] active:scale-95"
                    >
                      Next Step <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-12 py-4 bg-accent-blue text-white rounded-2xl font-black shadow-2xl shadow-accent-blue/30 transition-all hover:bg-accent-blue/90 disabled:opacity-50 scale-100 hover:scale-[1.05] active:scale-95"
                    >
                      {isLoading ? 'Finalizing Genesis...' : 'Initialize Asset'} <Plus size={20} className="ml-1" />
                    </button>
                  )}
                </div>
              </motion.form>
            </AnimatePresence>
          </Card>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <Card className="p-8 bg-background-secondary border-background-card rounded-[2.5rem]">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2 mb-6">
                 <Info size={18} className="text-accent-blue" />
                 Platform Synergy
              </h3>
              <ul className="space-y-6">
                 <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center shrink-0">
                       <CheckCircle2 size={16} className="text-accent-green" />
                    </div>
                    <p className="text-xs font-bold text-text-secondary leading-relaxed">Verification protocol ensures institutional-grade liquidity.</p>
                 </li>
                 <li className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center shrink-0">
                       <TrendingUp size={16} className="text-accent-blue" />
                    </div>
                    <p className="text-xs font-bold text-text-secondary leading-relaxed">Automated market analysis provides real-time fair value estimates.</p>
                 </li>
              </ul>

              <div className="mt-10 p-6 bg-background-card/30 rounded-2xl border border-background-card">
                 <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-3 opacity-60">Estimated Yield</p>
                 <div className="text-3xl font-black text-accent-green tracking-tighter">8.4% <span className="text-xs font-bold text-text-secondary/40 italic tracking-normal ml-1">APY</span></div>
              </div>
           </Card>

           <div className="bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent-blue/40 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
              <p className="text-base font-black text-white relative z-10 mb-2">Need institutional assistance?</p>
              <p className="text-xs font-bold text-text-secondary relative z-10 mb-6 group-hover:text-text-primary transition-colors">Our verification agents are ready to assist with complex documentation.</p>
              <button className="flex items-center gap-2 text-xs font-black text-accent-blue relative z-10 group-hover:underline">
                 Talk to an Agent <ArrowRight size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAsset;
