import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Heart
} from 'lucide-react';
import { BLOOD_GROUPS, BLOOD_COMPATIBILITY_DATA } from '../../data/bloodCompatibility';
import Badge from '../common/Badge';

export default function BloodCompatibilitySection() {
  const [activeGroup, setActiveGroup] = useState('O-');
  const [activeView, setActiveView] = useState('interactive'); // 'interactive' or 'matrix'

  const currentInfo = BLOOD_COMPATIBILITY_DATA[activeGroup];

  return (
    <section id="compatibility" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="red" size="md" className="mb-3">
            Clinical Knowledge Base
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Blood Group Compatibility
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Understanding donor-recipient compatibility saves crucial seconds during emergency transfusions. Select your blood group below to inspect who you can donate to and receive from.
          </p>

          {/* View Mode Switcher */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setActiveView('interactive')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeView === 'interactive'
                  ? 'bg-white text-[#DC2626] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Interactive Inspector
            </button>
            <button
              onClick={() => setActiveView('matrix')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeView === 'matrix'
                  ? 'bg-white text-[#DC2626] shadow-sm'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Full Compatibility Matrix
            </button>
          </div>
        </div>

        {activeView === 'interactive' ? (
          <div>
            {/* Blood Type Selection Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
              {BLOOD_GROUPS.map((group) => {
                const isSelected = group === activeGroup;
                return (
                  <button
                    key={group}
                    onClick={() => setActiveGroup(group)}
                    className={`px-4 sm:px-6 py-3 rounded-2xl font-black text-base sm:text-lg transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-md shadow-red-500/25 scale-105'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-red-300 hover:bg-[#FEF2F2]'
                    }`}
                  >
                    <Droplet className={`w-4 h-4 ${isSelected ? 'fill-white text-white' : 'text-[#DC2626]'}`} />
                    <span>{group}</span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Compatibility Card */}
            <div className="bg-gradient-to-b from-[#FEF2F2]/60 via-white to-white rounded-3xl border border-red-100/80 p-6 sm:p-10 shadow-lg shadow-red-950/5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Card: Summary Profile of Selected Group */}
                <div className="lg:col-span-4 space-y-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">
                        Selected Group
                      </span>
                      <h3 className="text-3xl font-black text-[#0F172A] mt-1">
                        {currentInfo.group}
                      </h3>
                      <p className="text-sm font-medium text-slate-500">
                        {currentInfo.name}
                      </p>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center font-black text-2xl shadow-md shadow-red-500/20">
                      {currentInfo.group}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${currentInfo.badgeColor}`}>
                      {currentInfo.type}
                    </span>
                  </div>

                  <div className="space-y-3 pt-2 text-sm">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wide">
                        Population Frequency
                      </span>
                      <span className="font-semibold text-slate-800">
                        {currentInfo.rarity}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wide">
                        Clinical Role
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {currentInfo.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <Link
                      to={`/find-donors?group=${encodeURIComponent(currentInfo.group)}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#DC2626] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Find {currentInfo.group} Donors</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right Columns: Can Donate To & Can Receive From */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Can Donate To Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <h4 className="text-lg font-bold text-[#0F172A]">
                          Can Donate Red Cells To ({currentInfo.canDonateTo.length} Groups)
                        </h4>
                      </div>
                      <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                        Recipient must match compatibility
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {BLOOD_GROUPS.map((group) => {
                        const canDonate = currentInfo.canDonateTo.includes(group);
                        return (
                          <div
                            key={group}
                            className={`p-3.5 rounded-xl border text-center transition-all ${
                              canDonate
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 shadow-xs'
                                : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                              {canDonate ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="text-lg font-black">{group}</span>
                            </div>
                            <span className="text-[11px] font-semibold block">
                              {canDonate ? 'Compatible' : 'Incompatible'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Can Receive From Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Heart className="w-4 h-4" />
                        </div>
                        <h4 className="text-lg font-bold text-[#0F172A]">
                          Can Safely Receive From ({currentInfo.canReceiveFrom.length} Groups)
                        </h4>
                      </div>
                      <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                        Safe transfusions only
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {BLOOD_GROUPS.map((group) => {
                        const canReceive = currentInfo.canReceiveFrom.includes(group);
                        return (
                          <div
                            key={group}
                            className={`p-3.5 rounded-xl border text-center transition-all ${
                              canReceive
                                ? 'bg-blue-50/70 border-blue-200 text-blue-900 shadow-xs'
                                : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1.5 mb-1">
                              {canReceive ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="text-lg font-black">{group}</span>
                            </div>
                            <span className="text-[11px] font-semibold block">
                              {canReceive ? 'Safe Donor' : 'Not Allowed'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        ) : (
          /* Full Compatibility Matrix View */
          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6">
            <div className="mb-4 text-xs text-slate-500 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Compatible Match
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-200 inline-block" /> Incompatible
              </span>
            </div>

            <table className="w-full text-center border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-3 px-4 text-left font-bold text-xs uppercase tracking-wider text-slate-500">
                    Donor ↓ \ Recipient →
                  </th>
                  {BLOOD_GROUPS.map((recipient) => (
                    <th key={recipient} className="py-3 px-3 font-black text-sm text-[#0F172A]">
                      {recipient}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BLOOD_GROUPS.map((donor) => {
                  const donorInfo = BLOOD_COMPATIBILITY_DATA[donor];
                  return (
                    <tr key={donor} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-left font-black text-sm text-[#DC2626]">
                        {donor}
                      </td>
                      {BLOOD_GROUPS.map((recipient) => {
                        const isMatch = donorInfo.canDonateTo.includes(recipient);
                        return (
                          <td key={recipient} className="py-3 px-2">
                            {isMatch ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-400 text-xs">
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </section>
  );
}
