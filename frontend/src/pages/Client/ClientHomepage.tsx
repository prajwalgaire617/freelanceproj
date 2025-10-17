import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Briefcase, Users, MessageSquare, FileText, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FreelancerSearch } from "@/components/client/FreelancerSearch";
import { JobPostForm } from "@/components/client/JobPostForm";
import { JobApplications } from "@/components/client/JobApplication";
import { MessagingInterface } from "@/components/client/MessagingInterface";
import { ContractForm } from "@/components/client/ContractForm";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
// import { useNotifications } from "@/context/NotificationContext";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";

export default function ClientDashboard() {
  const { user } = useAuth();
  // const { addNotification } = useNotifications();
  
  const [showJobPostForm, setShowJobPostForm] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showMessaging, setShowMessaging] = useState(false);
  
  // Dynamic state
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    activeContracts: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch client data
  const fetchClientData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch client's jobs
      const jobsResponse = await axiosInstance.get("/jobs/my-jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyJobs(jobsResponse.data.jobs || []);
      
      // Calculate stats from jobs
      const activeJobs = (jobsResponse.data.jobs || []).filter((job: any) => job.status === 'active').length;
      const totalApplications = (jobsResponse.data.jobs || []).reduce((sum: number, job: any) => sum + (job.applicationCount || 0), 0);
      
      // Fetch contracts
      const contractsResponse = await axiosInstance.get("/contracts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const activeContracts = (contractsResponse.data.contracts || []).filter((contract: any) => contract.contractStatus === 'active').length;
      
      // Fetch unread messages count
      const messagesResponse = await axiosInstance.get("/messages/conversations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const unreadMessages = (messagesResponse.data.conversations || []).reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
      
      setStats({
        activeJobs,
        totalApplications,
        activeContracts,
        unreadMessages
      });
      
    } catch (err: any) {
      console.error("Error fetching client data:", err);
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  // Dynamic stats array
  const statsArray = [
    { label: "Active Jobs", value: stats.activeJobs.toString(), icon: Briefcase },
    { label: "Total Applications", value: stats.totalApplications.toString(), icon: Users },
    { label: "Active Contracts", value: stats.activeContracts.toString(), icon: FileText },
    { label: "Unread Messages", value: stats.unreadMessages.toString(), icon: MessageSquare },
  ];

    const ClientNav = [
    { label: "Freelancer Search", href: "/freelancers" },
    { label: "Applications", href: "/applications" },
    { label: "Messages", href: "/clientmessages" },
    { label: "Contracts", href: "/contracts" },
  ];

  return (
    <div className="min-h-screen bg-background">
        {/* Header */}
      <div className=" flex justify-between">
      <Header navItems={ClientNav} />
       <Button onClick={() => setShowJobPostForm(true)} className=" mt-2 mr-2">
            <Plus className="w-4 h-4 mr-1" />
            Post a Job
          </Button>
          </div>

      {/* Hero Section */}
      <section className="py-16 text-center bg-gradient-to-br from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find the Perfect Freelancer</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with thousands of talented professionals ready to bring your projects to life
          </p>
          <div className="flex justify-center">
            <div className="flex w-full max-w-md items-center space-x-2">
              <Input 
                placeholder="Search for skills, designers, developers..." 
                className="bg-card border-input"
              />
              <Button>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            // Loading state
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-3xl font-bold text-foreground">-</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            // Error state
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <p className="text-red-500">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="mt-2"
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Dynamic stats
            statsArray.map((stat) => (
              <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="w-8 h-8 text-primary" />
                    <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted">
            <TabsTrigger value="browse" className="data-[state=active]:bg-card">
              <Users className="w-4 h-4 mr-2" />
              Top Freelancers
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-card">
              <Briefcase className="w-4 h-4 mr-2" />
              My Jobs
            </TabsTrigger>
            {/* <TabsTrigger value="messages" className="data-[state=active]:bg-card">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="contracts" className="data-[state=active]:bg-card">
              <FileText className="w-4 h-4 mr-2" />
              Contracts
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="browse" className="mt-0">
            <FreelancerSearch
              onHireFreelancer={(freelancer) => {
                setSelectedFreelancer(freelancer);
                setShowContractForm(true);
              }}
            />
          </TabsContent>

          <TabsContent value="jobs" className="mt-0">
            <div className="space-y-6">
              {loading ? (
                // Loading state for jobs
                <div className="grid gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="h-6 bg-muted animate-pulse rounded w-48"></div>
                          <div className="h-6 bg-muted animate-pulse rounded w-16"></div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
                          </div>
                          <div className="h-8 bg-muted animate-pulse rounded w-32"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                // Error state for jobs
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              ) : myJobs.length === 0 ? (
                // Empty state
                <Card>
                  <CardContent className="p-12 text-center">
                    <Briefcase className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start by posting your first job to find talented freelancers
                    </p>
                    <Button onClick={() => setShowJobPostForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                // Dynamic jobs list
                <div className="grid gap-4">
                  {myJobs.map((job) => (
                    <Card key={job.id} className="group cursor-pointer hover:shadow-lg transition-all">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg">{job.title}</span>
                          <span className={`text-sm font-normal px-4 py-1.5 rounded-full ${
                            job.status === "active" 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {job.applicationCount || 0} applications received
                            </span>
                          </div>
                          <Button 
                            onClick={() => window.location.href = `/job-applications/${job.id}`}
                            variant="outline"
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition"
                          >
                            View Applications
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {selectedJob && (
                <JobApplications
                  job={selectedJob}
                  onMessage={(freelancer) => {
                    setSelectedFreelancer(freelancer);
                    setShowMessaging(true);
                  }}
                  onSendContract={(freelancer) => {
                    setSelectedFreelancer(freelancer);
                    setShowContractForm(true);
                  }}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="mt-0">
            <MessagingInterface  />
          </TabsContent>

          <TabsContent value="contracts" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Active Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg mb-2">No active contracts yet</p>
                  <p className="text-muted-foreground text-sm mb-6">
                    Send your first contract to a freelancer to get started
                  </p>
                  <Button variant="outline">Browse Freelancers</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} FreelancePro. Built for businesses.
      </footer>

      <JobPostForm
        open={showJobPostForm}
        onClose={() => setShowJobPostForm(false)}
      />

      <ContractForm
        open={showContractForm}
        freelancer={selectedFreelancer}
        onClose={() => {
          setShowContractForm(false);
          setSelectedFreelancer(null);
        }}
      />
    </div>
  );
}
