import { useEffect, useState } from "react";
import axiosInstance from "@/api/axios";
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
    const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
        emailVerified: true,
        phoneVerified: false,
        kycCompleted: false,
        paymentMethodAdded: false,
        email: "john.doe@example.com",
    });
    const [profileData, setProfileData] = useState<ProfileData>({
        name: "",
        bio: "",
        location: "",
        hourlyRate: "",
        availability: "available",
        skills: [],
        experience: [],
        certifications: [],
        portfolioItems: []
    });



    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const res = await axiosInstance.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
                const u = res.data?.user;
                if (u) {
                    const apiBase = axiosInstance.defaults.baseURL || "";
                    const serverOrigin = apiBase.replace(/\/?api\/?$/, "");
                    setProfileData((prev) => ({
                        ...prev,
                        name: [u.firstName, u.lastName].filter(Boolean).join(" ") || prev.name,
                        bio: u.bio || prev.bio,
                        location: u.location || prev.location,
                        hourlyRate: (u.hourlyRate != null ? String(u.hourlyRate) : prev.hourlyRate),
                        availability: u.availability || prev.availability,
                        skills: Array.isArray(u.skills) ? u.skills : prev.skills,
                        experience: Array.isArray(u.experiences) ? u.experiences : prev.experience,
                        portfolioItems: Array.isArray(u.portfolioItems)
                          ? u.portfolioItems.map((it: any) => ({
                              ...it,
                              url: typeof it.url === 'string' && it.url.startsWith('/') ? `${serverOrigin}${it.url}` : it.url,
                            }))
                          : prev.portfolioItems,
                    }));
                    if (u.profileImage) {
                        setPhotoUrl(`${serverOrigin}${u.profileImage}`);
                    }
                }
            } catch {}
        };
        load();
    }, []);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const [firstName, ...rest] = (profileData.name || "").trim().split(" ");
            const lastName = rest.join(" ");
            await axiosInstance.put(
                "/auth/profile",
                {
                    firstName: firstName || undefined,
                    lastName: lastName || undefined,
                    bio: profileData.bio || undefined,
                },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
        } catch (e) {
            console.error(e);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optimistic preview
        const localUrl = URL.createObjectURL(file);
        setPhotoUrl(localUrl);

        try {
            const formData = new FormData();
            formData.append("profileImage", file);

            const token = localStorage.getItem("token");
            const response = await axiosInstance.put("/auth/profile", formData, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    // Override default JSON content-type for multipart upload
                    "Content-Type": "multipart/form-data",
                },
            });

            const updatedUser = response.data?.user;
            if (updatedUser?.profileImage) {
                const apiBase = axiosInstance.defaults.baseURL || "";
                // Remove trailing /api if present to get server origin
                const serverOrigin = apiBase.replace(/\/?api\/?$/, "");
                setPhotoUrl(`${serverOrigin}${updatedUser.profileImage}`);
            }
        } catch (err) {
            console.error("Failed to upload profile image", err);
            // Revert optimistic preview on error if desired
        }
    };

    const transactions: Transaction[] = [
        { id: 1, title: "Website Redesign Project", date: "Jan 15, 2024", amount: 1500 },
        { id: 2, title: "Mobile App Design", date: "Jan 10, 2024", amount: 750 },
        { id: 3, title: "Bug Fixing", date: "Jan 5, 2024", amount: 300 },
    ];

    const addSkill = async (skill: string) => {
        if (!skill || profileData.skills.includes(skill)) return;
        const newSkills = [...profileData.skills, skill];
        setProfileData({ ...profileData, skills: newSkills });
        try {
            const token = localStorage.getItem("token");
            await axiosInstance.put(
                "/auth/profile/skills",
                { skills: newSkills },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
        } catch (e) { console.error(e); }
    };

    const removeSkill = async (skill: string) => {
        const newSkills = profileData.skills.filter(s => s !== skill);
        setProfileData({ ...profileData, skills: newSkills });
        try {
            const token = localStorage.getItem("token");
            await axiosInstance.put(
                "/auth/profile/skills",
                { skills: newSkills },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
            );
        } catch (e) { console.error(e); }
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
            <Header navItems={freelancerNav} showLogout />
            {/* Header */}

            <ProfileHeader profileData={profileData} onSave={handleSave} photoUrl={photoUrl} />

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
                            photoUrl={photoUrl}
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
                            setPortfolioItems={async (items) => {
                                setProfileData((prev) => ({ ...prev, portfolioItems: items }));
                                try {
                                    const token = localStorage.getItem("token");
                                    const apiBase = axiosInstance.defaults.baseURL || "";
                                    const serverOrigin = apiBase.replace(/\/?api\/?$/, "");
                                    const normalized = items.map((it: any) => ({
                                        ...it,
                                        url: typeof it.url === 'string' && it.url.startsWith(serverOrigin)
                                          ? it.url.slice(serverOrigin.length)
                                          : it.url,
                                    }));
                                    await axiosInstance.put(
                                        "/auth/profile/portfolio",
                                        { portfolioItems: normalized },
                                        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
                                    );
                                } catch (e) { console.error(e); }
                            }}
                        />
                    </TabsContent>


                    {/* Experience Tab */}
                    <TabsContent value="experience">
                        <ExperienceTab
                            experiences={profileData.experience}
                            setExperiences={async (items) => {
                                setProfileData((prev) => ({ ...prev, experience: items }));
                                try {
                                    const token = localStorage.getItem("token");
                                    await axiosInstance.put(
                                        "/auth/profile/experiences",
                                        { experiences: items },
                                        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
                                    );
                                } catch (e) { console.error(e); }
                            }}
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