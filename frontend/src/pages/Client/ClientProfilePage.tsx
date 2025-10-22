import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/api/axios";
import Header from "@/components/layout/Header";
import ProfileHeader from "@/components/freelancer/profile/ProfileHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { ProfileData } from "@/type/job/profiledata";

const ClientProfilePage: React.FC = () => {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  // Keep shared profileData for header compatibility
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    bio: "",
    location: "",
    hourlyRate: "",
    availability: "available",
    skills: [],
    experience: [],
    certifications: [],
    portfolioItems: [],
  });
  // Separate client-specific fields
  const [clientInfo, setClientInfo] = useState<{ companyName: string; companyWebsite: string; timezone: string }>({
    companyName: "",
    companyWebsite: "",
    timezone: "",
  });

  const clientNav = useMemo(() => ([
    { label: "Freelancer Search", href: "/freelancers" },
    { label: "Applications", href: "/applications" },
    { label: "Messages", href: "/clientmessages" },
    { label: "Contracts", href: "/contracts" },
  ]), []);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axiosInstance.get("/auth/me");
        const u = res.data?.user || res.data;
        if (u) {
          const apiBase = axiosInstance.defaults.baseURL || "";
          const serverOrigin = apiBase.replace(/\/?api\/?$/, "");
          setProfileData((prev: ProfileData) => ({
            ...prev,
            name: [u.firstName, u.lastName].filter(Boolean).join(" ") || prev.name,
            bio: u.bio || prev.bio,
            location: u.location || prev.location,
          }));
          setClientInfo((prev) => ({
            ...prev,
            companyName: u.companyName || prev.companyName,
            companyWebsite: u.companyWebsite || prev.companyWebsite,
            timezone: u.timezone || prev.timezone,
          }));
          if (u.profileImage) setPhotoUrl(`${serverOrigin}${u.profileImage}`);
        }
      } catch {}
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      const [firstName, ...rest] = (profileData.name || "").trim().split(" ");
      const lastName = rest.join(" ");
      await axiosInstance.put("/auth/profile", {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        bio: profileData.bio || undefined,
        location: profileData.location || undefined,
        companyName: clientInfo.companyName || undefined,
        companyWebsite: clientInfo.companyWebsite || undefined,
        timezone: clientInfo.timezone || undefined,
      });
    } catch (e) { console.error(e); }
  };

  // Photo upload handled elsewhere; not needed in simplified client profile

  // no skills/portfolio/experience/earnings tabs for client profile

  return (
    <div className="min-h-screen bg-background">
      <Header navItems={clientNav} showLogout />
      <ProfileHeader profileData={profileData} onSave={handleSave} photoUrl={photoUrl} />

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Company Name</label>
              <Input
                value={clientInfo.companyName}
                onChange={(e) => setClientInfo({ ...clientInfo, companyName: e.target.value })}
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Company Website</label>
              <Input
                value={clientInfo.companyWebsite}
                onChange={(e) => setClientInfo({ ...clientInfo, companyWebsite: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={profileData.location || ""}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <Input
                value={clientInfo.timezone}
                onChange={(e) => setClientInfo({ ...clientInfo, timezone: e.target.value })}
                placeholder="e.g. UTC, EST, GMT+5:45"
              />
            </div>
            <div>
              <label className="text-sm font-medium">About</label>
              <div className="border rounded">
                <CKEditor
                  editor={ClassicEditor as any}
                  data={profileData.bio || ""}
                  onReady={(editor: any) => {
                    const el = editor?.ui?.view?.editable?.element as HTMLElement | undefined;
                    if (el) {
                      el.style.minHeight = '320px';
                    }
                  }}
                  onChange={(_, editor) => {
                    const data = editor.getData();
                    setProfileData({ ...profileData, bio: data });
                  }}
                />
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientProfilePage;
