import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Header from "@/components/layout/Header";
import ProfileHeader from "@/components/freelancer/profile/ProfileHeader";
import PersonalTab from "@/components/freelancer/profile/PersonalTab";
import SkillsTab from "@/components/freelancer/profile/SkillTab";
import PortfolioTab from "@/components/freelancer/profile/PortfolioTab";
import { ExperienceTab } from "@/components/freelancer/profile/ExperienceTab";
import { type PortfolioItem, type ProfileData, type Transaction, type VerificationStatus } from "@/type/job/profiledata";
import { EarningsTab } from "@/components/freelancer/profile/EarningTab";
import { VerificationTab } from "@/components/freelancer/profile/VerificationTab";
// import { useToast } from "@/hooks/use-toast";

export default function FreelancerProfile() {
    //   const { toast } = useToast();


    const [activeTab, setActiveTab] = useState("personal");
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
        emailVerified: true,
        phoneVerified: false,
        kycCompleted: false,
        paymentMethodAdded: false,
        email: "john.doe@example.com",
    });
    const [profileData, setProfileData] = useState<ProfileData>({
        name: "John Doe",
        bio: "Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies.",
        location: "San Francisco, CA",
        hourlyRate: "75",
        availability: "available",
        skills: ["React", "TypeScript", "Node.js", "AWS"],
        experience: [

        ],
        certifications: ["AWS Certified Developer", "Scrum Master"],
        portfolioItems: []
    });



    const handleSave = () => {
        alert({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
        });
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            alert({
                title: "Photo Uploaded",
                description: "Your profile photo has been updated.",
            });
        }
    };

    const transactions: Transaction[] = [
        { id: 1, title: "Website Redesign Project", date: "Jan 15, 2024", amount: 1500 },
        { id: 2, title: "Mobile App Design", date: "Jan 10, 2024", amount: 750 },
        { id: 3, title: "Bug Fixing", date: "Jan 5, 2024", amount: 300 },
    ];

    const addSkill = (skill: string) => {
        if (skill && !profileData.skills.includes(skill)) {
            setProfileData({ ...profileData, skills: [...profileData.skills, skill] });
        }
    };

    const removeSkill = (skill: string) => {
        setProfileData({
            ...profileData,
            skills: profileData.skills.filter(s => s !== skill)
        });
    };

    const freelancerNav = [
        { label: "Homepage", href: "/freelancerhomepage" },
        { label: "Find Jobs", href: "/jobs" },
        { label: "Applications", href: "/applications" },
        { label: "Messages", href: "/messages" },
        { label: "Profile", href: "/freelancerprofile" },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header navItems={freelancerNav} />
            {/* Header */}

            <ProfileHeader profileData={profileData} onSave={handleSave} />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-6 mb-8">
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="earnings">Earnings</TabsTrigger>
                        <TabsTrigger value="verification">Verification</TabsTrigger>
                    </TabsList>

                    {/* Personal Info Tab */}
                    <TabsContent value="personal">
                        <PersonalTab
                            profileData={profileData}
                            setProfileData={setProfileData}
                            onPhotoUpload={handlePhotoUpload}
                        />
                    </TabsContent>

                    {/* Skills Tab */}
                    <TabsContent value="skills">
                        <SkillsTab
                            profileData={profileData}
                            addSkill={addSkill}
                            removeSkill={removeSkill}
                        />
                    </TabsContent>

                    {/* Portfolio Tab */}
                    <TabsContent value="portfolio">
                        <PortfolioTab
                            portfolioItems={profileData.portfolioItems}
                            setPortfolioItems={(items) =>
                                setProfileData((prev) => ({ ...prev, portfolioItems: items }))
                            }
                        />
                    </TabsContent>


                    {/* Experience Tab */}
                    <TabsContent value="experience">
                        <ExperienceTab
                            experiences={profileData.experience}
                            setExperiences={(items) =>
                                setProfileData((prev) => ({ ...prev, experience: items }))
                            }
                        />
                    </TabsContent>

                    {/* Earnings Tab */}
                    <TabsContent value="earnings">
                        <EarningsTab
                            totalEarnings={45230}
                            monthlyEarnings={3450}
                            pendingEarnings={1200}
                            transactions={transactions}
                        />
                    </TabsContent>

                    {/* Verification Tab */}
                    <TabsContent value="verification">
                        <VerificationTab
                            status={verificationStatus}
                            onVerifyEmail={() => setVerificationStatus({ ...verificationStatus, emailVerified: true })}
                            onVerifyPhone={() => setVerificationStatus({ ...verificationStatus, phoneVerified: true })}
                            onStartKYC={() => setVerificationStatus({ ...verificationStatus, kycCompleted: true })}
                            onAddPaymentMethod={() => setVerificationStatus({ ...verificationStatus, paymentMethodAdded: true })}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}