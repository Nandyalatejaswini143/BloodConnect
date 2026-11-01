import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import BloodCompatibilitySection from '../components/home/BloodCompatibilitySection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import EmergencyRequestsSection from '../components/home/EmergencyRequestsSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 2, 3, 4: Hero Section with Heading, Subtitle, 2 CTA buttons, and Quick Search */}
      <HeroSection />

      {/* 5: Statistics Section */}
      <StatsSection />

      {/* 6: Blood Group Compatibility Section */}
      <BloodCompatibilitySection />

      {/* 7: How It Works Section */}
      <HowItWorksSection />

      {/* 8: Emergency Blood Request Section */}
      <EmergencyRequestsSection />
    </div>
  );
}
