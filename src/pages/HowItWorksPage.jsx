import React from 'react';
import {
  HeartHandshake,
  HelpCircle,
  FileCheck,
  Coffee
} from 'lucide-react';
import HowItWorksSection from '../components/home/HowItWorksSection';
import Card from '../components/common/Card';

export default function HowItWorksPage() {
  const faqs = [
    {
      q: 'Does donating blood hurt?',
      a: 'Most donors feel only a quick pinch for a split second when the needle is inserted. The actual donation process is virtually painless and takes about 8 to 10 minutes.'
    },
    {
      q: 'How long does the whole appointment take?',
      a: 'While blood drawing takes under 10 minutes, plan for about 45 minutes total for registration, brief health screening, and light refreshments afterward.'
    },
    {
      q: 'How often can I donate whole blood?',
      a: 'Healthy donors can safely donate whole blood every 56 days (8 weeks). Platelet donors can donate more frequently, up to 24 times a year.'
    },
    {
      q: 'Is it completely safe to donate blood?',
      a: 'Yes, donating blood is completely safe. Sterile, disposable needles and supplies are used once and immediately discarded. You cannot contract any disease by giving blood.'
    }
  ];

  return (
    <div className="py-12 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Walkthrough Section */}
        <HowItWorksSection />

        {/* What to Expect on Donation Day */}
        <div className="my-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight text-center mb-8">
            What to Expect on Donation Day
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#DC2626] flex items-center justify-center font-bold">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">1. Quick Health Check</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A brief private check of your temperature, pulse, blood pressure, and hemoglobin levels ensures it is 100% safe for you to donate today.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">2. The Donation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You relax comfortably in a donor chair while approximately 450ml of blood is collected using sterile, single-use medical equipment.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">3. Rest & Refresh</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enjoy complimentary juice, cookies, and fruit for 10-15 minutes before carrying on with your day knowing you helped save lives!
              </p>
            </Card>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto my-16 bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="text-center mb-8">
            <HelpCircle className="w-10 h-10 text-[#DC2626] mx-auto mb-2" />
            <h2 className="text-2xl font-black text-[#0F172A]">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 mt-1">Everything you need to know about voluntary blood donation.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-100 pb-4">
                <h4 className="font-bold text-sm text-[#0F172A] mb-1.5">{faq.q}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
