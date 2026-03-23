import React from 'react';
import Card from '../components/ui/Card';
import StatsCard from '../components/ui/StatsCard';
import { TrendingUp, Activity, PieChart, ArrowUpRight, Briefcase } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Overview</h1>
          <p className="text-text-secondary mt-1">Monitor your portfolio and market stats in real-time.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-background-card border border-background-card rounded-xl text-sm font-bold text-text-primary hover:bg-background-secondary transition-all">
            Export Data
          </button>
          <button className="px-4 py-2 bg-accent-blue text-white rounded-xl text-sm font-bold hover:bg-accent-blue/90 shadow-lg shadow-accent-blue/20 transition-all">
            Generate Report
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Portfolio Value"
          value="$1.28M"
          icon={TrendingUp}
          color="blue"
          trend={{ value: "+12.5%", type: 'up' }}
          description="Total value of tokenized assets in your wallet."
        />

        <StatsCard 
          title="Active Listings"
          value="45"
          icon={PieChart}
          color="purple"
          trend={{ value: "+2 new", type: 'up' }}
          description="Assets currently listed on the marketplace."
        />

        <StatsCard 
          title="On-Chain Transactions"
          value="1,204"
          icon={Activity}
          color="green"
          trend={{ value: "Stable", type: 'neutral' }}
          description="Total verified transactions on the blockchain."
        />

        {/* Recent Activity Section */}
        <Card title="Recent Activity" subtitle="Your latest transactions and updates" className="md:col-span-2">
           <div className="space-y-6">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-background-card/50 p-2 -m-2 rounded-xl transition-all">
                 <div className="flex items-center">
                   <div className="w-10 h-10 bg-background-card rounded-xl flex items-center justify-center mr-4 group-hover:bg-accent-blue/10 group-hover:text-accent-blue transition-all">
                      <ArrowUpRight size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-text-primary">Asset Tokenization #{4230 + i}</p>
                     <p className="text-xs text-text-secondary">Blockchain verification successful</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-bold text-text-primary">+$12,400</p>
                   <p className="text-[10px] text-text-secondary uppercase">2 hours ago</p>
                 </div>
               </div>
             ))}
           </div>
        </Card>

        {/* Quick Actions / Asset Summary Placeholder */}
        <Card title="Quick Actions" className="col-span-1">
           <div className="grid grid-cols-2 gap-3">
             <button className="p-4 bg-background-card border border-background-card hover:border-accent-blue/30 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all group">
                <TrendingUp size={24} className="text-accent-blue group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">List Asset</span>
             </button>
             <button className="p-4 bg-background-card border border-background-card hover:border-accent-purple/30 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all group">
                <Briefcase size={24} className="text-accent-purple group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Portfolio</span>
             </button>
             <button className="p-4 bg-background-card border border-background-card hover:border-accent-green/30 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all group">
                <Activity size={24} className="text-accent-green group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">History</span>
             </button>
             <button className="p-4 bg-background-card border border-background-card hover:border-accent-red/30 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all group">
                <ArrowUpRight size={24} className="text-accent-red group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Withdraw</span>
             </button>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
