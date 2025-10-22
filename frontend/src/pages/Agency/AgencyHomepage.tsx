import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Briefcase, Users, FileText, Loader2, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AGENCY_NAV_ITEMS } from "@/constants/navigation";

export default function AgencyHomepage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [agencyProfile, setAgencyProfile] = useState<any>(null);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    activeContracts: 0,
    unreadMessages: 0,
    teamSize: 0
  });

  // Fetch agency data
  const fetchAgencyData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch agency profile
      try {
        const profileResponse = await axiosInstance.get("/agencies/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAgencyProfile(profileResponse.data.agency);
      } catch (err) {
        console.log("Agency profile not found");
      }
      
      // Fetch agency's jobs
      const jobsResponse = await axiosInstance.get("/jobs/my-jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyJobs(jobsResponse.data.jobs || []);
      
      // Calculate stats
      const activeJobs = (jobsResponse.data.jobs || []).filter((job: any) => job.status === 'active').length;
      const totalApplications = (jobsResponse.data.jobs || []).reduce((sum: number, job: any) => sum + (job.applicationCount || 0), 0);
      
      // Fetch contracts
      const contractsResponse = await axiosInstance.get("/contracts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeContracts = (contractsResponse.data.contracts || []).filter((contract: any) => contract.contractStatus === 'active').length;
      
      setStats({
        activeJobs,
        totalApplications,
        activeContracts,
        unreadMessages: 0,
        teamSize: agencyProfile?.teamSize || 0
      });
      
    } catch (err: any) {
      console.error("Error fetching agency data:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user, agencyProfile?.teamSize]);

  useEffect(() => {
    fetchAgencyData();
  }, [fetchAgencyData]);

  const statsArray = [
    { label: "Active Jobs", value: stats.activeJobs.toString(), icon: Briefcase, color: "text-blue-600" },
    { label: "Applications", value: stats.totalApplications.toString(), icon: Users, color: "text-green-600" },
    { label: "Active Contracts", value: stats.activeContracts.toString(), icon: FileText, color: "text-purple-600" },
    { label: "Team Size", value: stats.teamSize.toString(), icon: Users, color: "text-orange-600" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header navItems={AGENCY_NAV_ITEMS} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header navItems={AGENCY_NAV_ITEMS} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {agencyProfile?.agencyName || `${user?.firstName} ${user?.lastName}`}!
          </h1>
          <p className="text-muted-foreground">
            Manage your agency, post jobs, and hire talented freelancers.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsArray.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button 
            size="lg" 
            className="h-24 text-lg"
            onClick={() => navigate("/agency/jobs/new")}
          >
            <Plus className="mr-2 h-5 w-5" />
            Post a New Job
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-24 text-lg"
            onClick={() => navigate("/agency/freelancers")}
          >
            <Search className="mr-2 h-5 w-5" />
            Find Freelancers
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-24 text-lg"
            onClick={() => navigate("/agency/profile")}
          >
            <Users className="mr-2 h-5 w-5" />
            Edit Profile
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="jobs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="profile">Agency Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Posted Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {myJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No jobs posted yet</p>
                    <Button onClick={() => navigate("/agency/jobs/new")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Post Your First Job
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myJobs.slice(0, 5).map((job) => (
                      <div 
                        key={job.id} 
                        className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => navigate(`/agency/jobs/${job.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            job.status === 'active' ? 'bg-green-100 text-green-700' :
                            job.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {job.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{job.applicationCount || 0} applications</span>
                          <span>${job.budget} {job.budgetType}</span>
                          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active contracts</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agency Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {agencyProfile ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-1">Agency Name</h3>
                      <p className="text-muted-foreground">{agencyProfile.agencyName}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Description</h3>
                      <p className="text-muted-foreground">{agencyProfile.description || 'No description'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-1">Team Size</h3>
                        <p className="text-muted-foreground">{agencyProfile.teamSize || 'Not specified'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Years in Business</h3>
                        <p className="text-muted-foreground">{agencyProfile.yearsInBusiness || 'Not specified'}</p>
                      </div>
                    </div>
                    <Button onClick={() => navigate("/agency/profile")}>
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Complete your agency profile</p>
                    <Button onClick={() => navigate("/agency/profile")}>
                      Create Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
