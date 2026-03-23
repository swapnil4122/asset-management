import React from 'react';
import Card from '../components/ui/Card';
import StatsCard from '../components/ui/StatsCard';
import { 
  TrendingUp,
  Activity, 
  PieChart, 
  Briefcase,
  DollarSign
} from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Container */}
      <Card className="!p-4 bg-transparent border-none shadow-none">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-[#F9FAFB] tracking-tight">System Overview</h1>
            <p className="text-[#9CA3AF] mt-1 text-sm font-medium">Internal Asset Management & Tokenization Console</p>
          </div>
          <div className="flex space-x-3">
             <button className="px-5 py-2.5 bg-[#1F2937] border border-[#1F2937] hover:border-[#3B82F6]/30 rounded-xl text-xs font-black text-[#F9FAFB] uppercase tracking-widest transition-all">
                Registry
             </button>
             <button className="px-5 py-2.5 bg-[#3B82F6] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#3B82F6]/90 shadow-lg shadow-[#3B82F6]/20 transition-all">
                New Asset
             </button>
          </div>
        </div>
      </Card>

      {/* DASHBOARD GRID - STRICT 3 COLUMNS */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* ROW 1: STATS CARDS */}
        <StatsCard 
          title="Total Assets"
          value="1,284"
          icon={Briefcase}
          color="blue"
          trend={{ value: "+24%", type: 'up' }}
          description="Total assets currently managed on-chain."
        />

        <StatsCard 
          title="Market Value"
          value="$452.8M"
          icon={DollarSign}
          color="green"
          trend={{ value: "+$12M", type: 'up' }}
          description="Aggregated valuation of all verified properties."
        />

        <StatsCard 
          title="Active Listings"
          value="89"
          icon={PieChart}
          color="purple"
          trend={{ value: "-4%", type: 'down' }}
          description="Assets participating in the secondary market."
        />

        {/* ROW 2: WIDE SECTION */}
        
        {/* Left: Portfolio Summary (2 cols) */}
        <div className="col-span-2 space-y-6">
          <Card 
            title="Portfolio Performance" 
            subtitle="Valuation growth over the last 12 months"
            className="h-full bg-[#1F2937] p-6 rounded-xl shadow-lg"
          >
            <div className="mt-8 flex items-end justify-between h-48 space-x-2">
              {[40, 70, 45, 90, 65, 80, 50, 95, 100, 85, 75, 90].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div 
                    className="w-full bg-[#3B82F6]/20 group-hover:bg-[#3B82F6]/40 rounded-t-md transition-all duration-500"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-[10px] text-[#9CA3AF] mt-2 font-bold uppercase tracking-tighter opacity-50">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[#0B0F19]/20 pt-6">
               <div>
                  <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Growth</p>
                  <p className="text-xl font-black text-[#10B981] mt-1">+18.4%</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Volume</p>
                  <p className="text-xl font-black text-[#F9FAFB] mt-1">$42.1M</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Yield</p>
                  <p className="text-xl font-black text-[#8B5CF6] mt-1">6.2%</p>
               </div>
            </div>
          </Card>
        </div>

        {/* Right: Recent Activity (1 col) */}
        <div className="col-span-1">
          <Card 
            title="Recent Activity" 
            subtitle="Live ledger updates"
            className="bg-[#1F2937] p-6 rounded-xl shadow-lg h-full"
          >
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start space-x-3 group cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    i % 2 === 0 ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#3B82F6]/10 text-[#3B82F6]'
                  }`}>
                    {i % 2 === 0 ? <Activity size={16} /> : <TrendingUp size={16} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#F9FAFB] truncate group-hover:text-[#3B82F6] transition-colors leading-none">
                      {i % 2 === 0 ? 'Transaction Verified' : 'Listing Created'}
                    </p>
                    <p className="text-[10px] text-[#9CA3AF] mt-1 font-medium italic">
                      ID: 0x4f2...{742 + i}
                    </p>
                  </div>
                  <span className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest opacity-40">
                    {i}m ago
                  </span>
                </div>
              ))}
              <button className="w-full py-3 border-2 border-dashed border-[#0B0F19]/20 rounded-xl text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest hover:border-[#3B82F6]/40 hover:text-[#3B82F6] transition-all">
                 View Full Ledger
              </button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
