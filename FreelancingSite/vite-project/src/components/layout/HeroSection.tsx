import React from "react";
import JobsSearch from "../jobsdetails/JobSearch";

const HeroSection: React.FC = () => {
    return (
        <section className="py-24 text-center bg-gradient-to-br from-indigo-500/10 to-transparent">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Next Freelance Opportunity
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of professionals using FreelancePro to land projects that match your skills and passion.
            </p>
            <div className="flex justify-center">
                <div className="flex w-full max-w-md items-center space-x-2">
                    <JobsSearch/>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
