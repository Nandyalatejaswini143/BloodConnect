import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  BellRing,
  HeartHandshake,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function HowItWorksSection() {
  // Mini interactive eligibility checker state
  const [eligibility, setEligibility] = useState({
    age: true,
    weight: true,
    health: true,
    interval: true
  });

  const steps = [
    {
      number: '01',
      title: 'Register as Donor',
      description: 'Fill in your basic blood group, approximate locality, and donation schedule preferences in under 2 minutes.',
      icon: UserPlus,
      accent: 'text-red-600 bg-red-50 border-red-200'
    },
    {
      number: '02',
      title: 'Smart Geo-Matching',
      description: 'Our matching algorithm pairs emergency hospital requests with clinically compatible voluntary donors located nearby.',
      icon: Search,
      accent: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      number: '03',
      title: 'Instant Alert Dispatch',
      description: 'When an urgent request is triggered, donors receive notifications with validated hospital contact details.',
      icon: BellRing,
      accent: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      number: '04',
      title: 'Donate & Save Lives',
      description: 'Visit the accredited hospital or blood drive center, donate safely, and track your simulated life-saving impact.',
      icon: HeartHandshake,
      accent: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    }
  ];

  const allEligible = Object.values(eligibility).every(Boolean);

  const toggleEligibility = (key) => {
    setEligibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="how-it-works" className="py-20 bg-[#F8FAFC] border-t border-slate-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="red" size="md" className="mb-3">
            Streamlined Life-Saving Flow
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            How BloodConnect Works
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Every second counts when trauma patients and surgery teams need blood. Here is how our community-driven platform connects willingness with urgent medical necessity.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200 group-hover:text-red-400/50 transition-colors">
                      {step.number}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${step.accent} group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#DC2626] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-slate-400 group-hover:text-[#DC2626] transition-colors">
                  <span>Step {idx + 1} of 4</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Eligibility Quick Checker Component */}
        <div className="bg-white rounded-3xl border border-red-100 p-6 sm:p-10 shadow-lg shadow-red-950/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#DC2626] text-xs font-bold border border-red-200">
                <ShieldCheck className="w-4 h-4" />
                <span>Donor Readiness Check</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Are You Ready to Donate?
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Most healthy adults can safely donate blood every 8 to 12 weeks. Use this quick self-assessment check to confirm your basic readiness.
              </p>

              <div className="pt-2">
                <Button
                  to="/register"
                  variant="primary"
                  size="md"
                  icon={UserPlus}
                >
                  Join as Voluntary Donor
                </Button>
              </div>
            </div>

            {/* Checklist */}
            <div className="lg:col-span-7 bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Standard Clinical Criteria</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${allEligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {allEligible ? 'Criteria Met ✓' : 'Review Criteria'}
                </span>
              </h4>

              <div className="space-y-3">
                
                <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-red-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={eligibility.age}
                    onChange={() => toggleEligibility('age')}
                    className="w-4 h-4 accent-[#DC2626] rounded cursor-pointer"
                  />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-[#0F172A]">Age requirement:</span> I am between 18 and 65 years old.
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-red-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={eligibility.weight}
                    onChange={() => toggleEligibility('weight')}
                    className="w-4 h-4 accent-[#DC2626] rounded cursor-pointer"
                  />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-[#0F172A]">Weight threshold:</span> My body weight is at least 50 kg (110 lbs).
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-red-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={eligibility.health}
                    onChange={() => toggleEligibility('health')}
                    className="w-4 h-4 accent-[#DC2626] rounded cursor-pointer"
                  />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-[#0F172A]">Current health:</span> I am feeling well and free of cold or flu symptoms today.
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-red-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={eligibility.interval}
                    onChange={() => toggleEligibility('interval')}
                    className="w-4 h-4 accent-[#DC2626] rounded cursor-pointer"
                  />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-[#0F172A]">Donation interval:</span> At least 56 days (8 weeks) have passed since my last whole blood donation.
                  </div>
                </label>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
