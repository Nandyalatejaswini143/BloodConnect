import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Droplet,
  Heart,
  CheckCircle2,
  Search
} from 'lucide-react';
import { BLOOD_GROUPS, BLOOD_COMPATIBILITY_DATA } from '../data/bloodCompatibility';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';

export default function CompatibilityPage() {
  const [searchParams] = useSearchParams();
  const initialGroup = searchParams.get('group') || 'O-';
  const [selectedGroup, setSelectedGroup] = useState(initialGroup);

  const groupInfo = BLOOD_COMPATIBILITY_DATA[selectedGroup] || BLOOD_COMPATIBILITY_DATA['O-'];

  return (
    <div className="py-12 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <Badge variant="red" size="md" className="mb-2">
            Clinical Reference
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Blood Group Compatibility Guide
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Every blood type contains specific antigens and antibodies. Transfusing incompatible red blood cells can cause severe immune reactions. Learn how blood matching saves lives every day.
          </p>
        </div>

        {/* Group Selector */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-10 shadow-sm">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Choose Blood Group to Analyze:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {BLOOD_GROUPS.map((group) => {
              const isSelected = group === selectedGroup;
              return (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`py-3 rounded-2xl font-black text-lg transition-all cursor-pointer flex flex-col items-center justify-center border ${
                    isSelected
                      ? 'bg-[#DC2626] text-white border-[#DC2626] shadow-md shadow-red-500/20 scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-red-300 hover:bg-[#FEF2F2]'
                  }`}
                >
                  <Droplet className={`w-4 h-4 mb-1 ${isSelected ? 'fill-white text-white' : 'text-[#DC2626]'}`} />
                  <span>{group}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlighted Profile */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Overview */}
            <div className="lg:col-span-4 space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">Group Profile</span>
                  <h2 className="text-3xl font-black text-[#0F172A] mt-1">{groupInfo.group}</h2>
                  <p className="text-xs text-slate-500 font-medium">{groupInfo.name}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#DC2626] text-white font-black text-2xl flex items-center justify-center shadow-md">
                  {groupInfo.group}
                </div>
              </div>

              <div className="pt-2">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${groupInfo.badgeColor}`}>
                  {groupInfo.type}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-400 block uppercase">Distribution</span>
                  <span className="text-slate-800 font-medium">{groupInfo.rarity}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block uppercase">Clinical Utility</span>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{groupInfo.description}</p>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to={`/find-donors?group=${encodeURIComponent(groupInfo.group)}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Find {groupInfo.group} Donors</span>
                </Link>
              </div>
            </div>

            {/* Donation & Reception Breakdown */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Can Donate To */}
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Can Donate Red Blood Cells To:</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BLOOD_GROUPS.map((grp) => {
                    const match = groupInfo.canDonateTo.includes(grp);
                    return (
                      <div
                        key={grp}
                        className={`p-4 rounded-2xl border text-center ${
                          match
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-300'
                        }`}
                      >
                        <span className="text-2xl block mb-1 font-black">{grp}</span>
                        <span className="text-xs">{match ? 'Compatible ✓' : 'Incompatible'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Can Receive From */}
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-blue-600" />
                  <span>Can Safely Receive Red Blood Cells From:</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BLOOD_GROUPS.map((grp) => {
                    const match = groupInfo.canReceiveFrom.includes(grp);
                    return (
                      <div
                        key={grp}
                        className={`p-4 rounded-2xl border text-center ${
                          match
                            ? 'bg-blue-50 border-blue-200 text-blue-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-300'
                        }`}
                      >
                        <span className="text-2xl block mb-1 font-black">{grp}</span>
                        <span className="text-xs">{match ? 'Safe Donor ✓' : 'Incompatible'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Educational Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h4 className="font-bold text-base text-[#0F172A] mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
              The Rh Factor (Positive vs Negative)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rh positive individuals carry the Rh protein antigen on red blood cells, whereas Rh negative individuals do not. Rh negative blood can safely be given to Rh positive patients, but not vice versa.
            </p>
          </Card>

          <Card className="p-6">
            <h4 className="font-bold text-base text-[#0F172A] mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Universal Donor: Type O-
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Because O- negative red cells lack A, B, and Rh antigens, they can be transfused in emergency trauma cases before patient cross-matching is completed. O- donors are constantly in high demand.
            </p>
          </Card>

          <Card className="p-6">
            <h4 className="font-bold text-base text-[#0F172A] mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Universal Recipient: Type AB+
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              AB positive individuals have both A and B antigens and Rh protein. They can safely accept red blood cells from all eight major blood groups during clinical transfusions.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}
