import React from 'react';
import { Users, Activity, Building2, Clock, Info } from 'lucide-react';
import { PLATFORM_STATS, DEMO_NOTICE } from '../../data/statistics';
import Card from '../common/Card';

export default function StatsSection() {
  const iconMap = {
    Users: Users,
    Activity: Activity,
    Building2: Building2,
    Clock: Clock
  };

  return (
    <section className="py-16 bg-[#F8FAFC] border-y border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Clear Demonstration Disclaimer */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Info className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>{DEMO_NOTICE.badge}</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Impact & Network Reach
          </h2>
          
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            {DEMO_NOTICE.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORM_STATS.map((stat) => {
            const IconComponent = iconMap[stat.icon] || Activity;
            return (
              <Card
                key={stat.id}
                className="p-6 relative overflow-hidden group hover:border-red-200"
              >
                {/* Decorative Top Accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.accent}`} />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] border border-red-100 flex items-center justify-center text-[#DC2626] group-hover:scale-110 transition-transform duration-200">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Simulated
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-base font-bold text-slate-800">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {stat.subtext}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Prototype Transparency Notice Box */}
        <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>
              <strong>Clinical Data Protocol:</strong> Real-world patient health data and production donor records will undergo certified medical encryption upon Phase 2 rollout.
            </span>
          </div>
          <span className="text-slate-400 font-mono text-[11px] shrink-0">
            System ID: BC-DEMO-V1.0
          </span>
        </div>

      </div>
    </section>
  );
}
