import SiteNav from '@/components/landing/site-nav';
import Hero from '@/components/landing/hero';
import TrustBar from '@/components/landing/trust-bar';
import Features from '@/components/landing/features';
import HowItWorks from '@/components/landing/how-it-works';
import DemoFlow from '@/components/landing/demo-flow';
import TrustControls from '@/components/landing/trust-controls';
import Testimonials from '@/components/landing/testimonials';
import Pricing from '@/components/landing/pricing';
import Faq from '@/components/landing/faq';
import FinalCta from '@/components/landing/final-cta';
import Footer from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <div className="relative z-10 -mt-10 overflow-hidden rounded-t-[40px] bg-cream">
          <TrustBar />
          <Features />
          <HowItWorks />
          <DemoFlow />
        </div>
        <TrustControls />
        <Testimonials />
        <div className="relative z-10 -mt-10 overflow-hidden rounded-t-[40px] bg-cream">
          <Pricing />
          <Faq />
          <FinalCta />
          <Footer />
        </div>
      </main>
    </>
  );
}
