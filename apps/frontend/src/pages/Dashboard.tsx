import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Card from '../components/ui/Card';
import StatsCard from '../components/ui/StatsCard';
import { 
  TrendingUp,
  Activity, 
  PieChart, 
  Briefcase,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-[1600px] mx-auto pb-12"
    >
      {/* Header Container */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent-blue/10 text-accent-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-accent-blue/20">
              <ShieldCheck size={12} /> SECURE PROTOCOL ACTIVE
            </div>
            <h1 className="text-5xl font-black text-text-primary tracking-tighter">System <span className="text-accent-blue">Overview</span></h1>
            <p className="text-text-secondary mt-2 text-lg">Decentralized asset management & tokenization console.</p>
          </div>
          <div className="flex space-x-3 items-center">
             <div className="p-2 bg-background-secondary rounded-2xl border border-background-card flex items-center gap-2 mr-4">
                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Network Sync: 100%</span>
             </div>
             <button className="px-6 py-3 bg-accent-blue text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-accent-blue/90 shadow-2xl shadow-accent-blue/20 transition-all scale-100 hover:scale-105 active:scale-95 flex items-center gap-2">
                New Asset <ArrowUpRight size={18} />
             </button>
          </div>
        </div>
      </motion.div>

      {/* DASHBOARD GRID - STATS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatsCard 
          title="Total Assets"
          value="1,284"
          icon={Briefcase}
          color="blue"
          trend={{ value: "+24%", type: 'up' }}
          description="Assets managed on-chain."
        />

        <StatsCard 
          title="Market Value"
          value="$452.8M"
          icon={DollarSign}
          color="green"
          trend={{ value: "+$12M", type: 'up' }}
          description="Aggregated property valuation."
        />

        <StatsCard 
          title="Active Listings"
          value="89"
          icon={PieChart}
          color="purple"
          trend={{ value: "-4%", type: 'down' }}
          description="Secondary market listings."
        />
      </motion.div>

      {/* ROW 2: ANALYSIS & RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Portfolio Summary (2 cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          <Card 
            className="h-full bg-background-secondary p-10 rounded-[2.5rem] border-background-card shadow-2xl shadow-black/30 overflow-hidden relative"
          >
            <div className="relative z-10 flex justify-between items-start mb-12">
               <div>
                  <h3 className="text-2xl font-black text-text-primary tracking-tight">Portfolio Performance</h3>
                  <p className="text-text-secondary mt-1 font-bold text-sm">Valuation growth over 12 months</p>
               </div>
               <div className="bg-background-card/50 p-2 rounded-xl flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-blue rounded-full"></span>
                  <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Live Feed</span>
               </div>
            </div>

            <div className="mt-8 flex items-end justify-between h-48 space-x-3 mb-12">
              {[40, 70, 45, 90, 65, 80, 50, 95, 100, 85, 75, 90].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 1, ease: "easeOut" }}
                    className="w-full bg-gradient-to-t from-accent-blue/40 to-accent-blue/10 group-hover:from-accent-blue group-hover:to-accent-blue/20 rounded-t-lg transition-all duration-500 relative"
                  >
                     <div className="absolute top-0 left-0 right-0 h-1 bg-accent-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.div>
                  <span className="text-[10px] text-text-secondary mt-4 font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-8 pt-10 border-t border-background-card/50">
               <div className="p-4 bg-background-card/20 rounded-2xl border border-background-card">
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 opacity-60">Analytics Growth</p>
                  <p className="text-3xl font-black text-accent-green tracking-tighter">+18.4%</p>
               </div>
               <div className="p-4 bg-background-card/20 rounded-2xl border border-background-card">
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 opacity-60">Trade Volume</p>
                  <p className="text-3xl font-black text-text-primary tracking-tighter">$42.1M</p>
               </div>
               <div className="p-4 bg-background-card/20 rounded-2xl border border-background-card">
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2 opacity-60">Estimated Yield</p>
                  <p className="text-3xl font-black text-accent-purple tracking-tighter">6.2%</p>
               </div>
            </div>
            
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-accent-blue/5 blur-[100px] rounded-full"></div>
          </Card>
        </motion.div>

        {/* Right: Recent Activity (1 col) */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card 
            className="bg-background-secondary p-8 rounded-[2.5rem] border-background-card shadow-2xl shadow-black/30 h-full flex flex-col"
          >
            <div className="mb-10">
               <h3 className="text-xl font-black text-text-primary tracking-tight">Recent Activity</h3>
               <p className="text-text-secondary mt-1 font-bold text-xs">Real-time ledger audit trail</p>
            </div>

            <div className="space-y-8 flex-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start space-x-4 group cursor-pointer p-2 rounded-2xl hover:bg-background-card/30 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 ${
                    i % 2 === 0 ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                  }`}>
                    {i % 2 === 0 ? <Activity size={18} /> : <TrendingUp size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-text-primary group-hover:text-accent-blue transition-colors tracking-tight">
                      {i % 2 === 0 ? 'Verification Confirmed' : 'New Listing Created'}
                    </p>
                    <p className="text-[10px] text-text-secondary mt-1 font-black opacity-60 uppercase tracking-widest font-mono">
                      REF: 0x4f2...{742 + i}
                    </p>
                  </div>
                  <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-30 mt-1">
                    {i}m ago
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 bg-background-card border-2 border-dashed border-text-secondary/10 rounded-2xl text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] hover:border-accent-blue/40 hover:text-accent-blue hover:bg-accent-blue/5 transition-all">
               Inspect Full Ledger System
            </button>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
