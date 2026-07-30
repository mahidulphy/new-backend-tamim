import React from 'react';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { HowItWorks } from './HowItWorks';
import { TemplateShowcase } from './TemplateShowcase';
import { FeaturesSection } from './FeaturesSection';
import { TestimonialSection } from './TestimonialSection';
import { PricingSection } from './PricingSection';
import { FAQSection } from './FAQSection';
import { ContactSection } from './ContactSection';
import { LandingFooter } from './LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-rose-500 selection:text-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-rose-600 focus:text-white focus:rounded-xl focus:text-sm focus:font-semibold">
        Skip to main content
      </a>
      <LandingHeader />
      <main id="main-content">
        <ErrorBoundary><HeroSection /></ErrorBoundary>
        <ErrorBoundary><HowItWorks /></ErrorBoundary>
        <ErrorBoundary><TemplateShowcase /></ErrorBoundary>
        <ErrorBoundary><FeaturesSection /></ErrorBoundary>
        <ErrorBoundary><TestimonialSection /></ErrorBoundary>
        <ErrorBoundary><PricingSection /></ErrorBoundary>
        <ErrorBoundary><FAQSection /></ErrorBoundary>
        <ErrorBoundary><ContactSection /></ErrorBoundary>
      </main>
      <LandingFooter />
    </div>
  );
};
