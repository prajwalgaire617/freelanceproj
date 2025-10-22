import CategoriesSection from "@/components/categories/CategoriesCarousel";
import JobsSection from "@/components/jobsdetails/JobsSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/layout/HeroSection";
import HowItWorksSection from "@/components/layout/HowItWorksSection";
import { FREELANCER_NAV_ITEMS } from "@/constants/navigation";

// Main App Component
function Homepage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Header navItems={FREELANCER_NAV_ITEMS} showLogout />
      <HeroSection />
      <CategoriesSection />
      <JobsSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}

export default Homepage;