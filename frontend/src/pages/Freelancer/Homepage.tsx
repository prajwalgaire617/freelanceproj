import CategoriesSection from "@/components/categories/CategoriesCarousel";
import JobsSection from "@/components/jobsdetails/JobsSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/layout/HeroSection";
import HowItWorksSection from "@/components/layout/HowItWorksSection";

// Main App Component
function Homepage() {
  const freelancerNav = [
   
    { label: "Find Jobs", href: "/jobs" },
    { label: "Applications", href: "/applications" },
    { label: "Messages", href: "/messages" },
    { label: "Profile", href: "/freelancerprofile" },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Header navItems={freelancerNav} showLogout />
      <HeroSection />
      <CategoriesSection />
      <JobsSection />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}

export default Homepage;