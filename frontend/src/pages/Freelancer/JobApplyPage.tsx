import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Coins, AlertCircle } from "lucide-react";
import { type JobPost } from "@/type/job/jobpost";

const JobApplyPage: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobPost | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingConnects, setLoadingConnects] = useState(true);
  const [bid, setBid] = useState<number | "">("");
  const [coverLetter, setCoverLetter] = useState("");
  const [timeline, setTimeline] = useState("");
  const [userConnects, setUserConnects] = useState(0);
  const [connectError, setConnectError] = useState<string | null>(null);
    const freelancerNav = [
    { label: "Freelancer Search", href: "/freelancers" },
    { label: "Post Job", href: "/post-job" },
    { label: "Applications", href: "/applications" },
    { label: "Messages", href: "/messages" },
    { label: "Contracts", href: "/contracts" },
  ];

  // Fetch user's connect balance
  const fetchUserConnects = async () => {
    try {
      setLoadingConnects(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setConnectError("Please log in to view your connects");
        return;
      }

      const response = await axiosInstance.get("/connects/statistics", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setUserConnects(response.data.currentBalance || 0);
        setConnectError(null);
      } else {
        setConnectError("Failed to fetch connect balance");
      }
    } catch (err: any) {
      console.error("Error fetching connects:", err);
      setConnectError(err.response?.data?.message || "Failed to fetch connect balance");
    } finally {
      setLoadingConnects(false);
    }
  };

  // ✅ Fetch single job from API
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoadingJob(true);
        const res = await axiosInstance.get<{ success: boolean; job: JobPost }>(
          `/jobs/${jobId}`
        );
        if (res.data.success) setJob(res.data.job);
        else toast.error("Job not found");
      } catch (err) {
        toast.error("Failed to fetch job");
        console.log(err);
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
    fetchUserConnects();
  }, [jobId]);

  if (loadingJob) return <p className="text-center mt-12">Loading job...</p>;
  if (!job) return null;

  const handleSubmit = async () => {
    if (bid === "" || !coverLetter.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }
    if (userConnects < (job.connectRequired || 0)) {
      toast.error("You don't have enough connects!");
      return;
    }

    try {
      setLoadingSubmit(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post(
        `/job-applications`,
        { 
          jobPostId: job.id,
          proposedRate: bid,
          coverLetter,
          proposedTimeline: timeline || "To be discussed"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.message) {
        setUserConnects((prev) => prev - (job.connectRequired || 0));
        
        toast.success("Proposal submitted successfully!");
        navigate("/jobs");
      } else {
        toast.error(res.data.error || "Failed to submit proposal");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error submitting proposal");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header navItems={freelancerNav} />
      <main className="max-w-3xl mx-auto py-12 px-6 w-full">
        <Card className="shadow-lg rounded-2xl border border-border/60">
          <CardHeader className="pb-4 border-b border-border/40">
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Submit Your Proposal
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              You are applying for <span className="font-medium">{job.title}</span>
            </p>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border border-border/30">
              <div>
                <p className="text-sm text-muted-foreground">
                  Required Connects:{" "}
                  <Badge variant="secondary" className="ml-1">
                    {job.connectRequired || 0}
                  </Badge>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your Connects:{" "}
                  <Badge
                    variant={
                      userConnects >= (job.connectRequired || 0)
                        ? "default"
                        : "destructive"
                    }
                    className="ml-1"
                  >
                    {userConnects}
                  </Badge>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Budget Range: ${job.minBudget || 0} - ${job.maxBudget || 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {job.projectDuration || "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bid" className="text-sm font-medium">
                Your Bid ($)
              </Label>
              <Input
                id="bid"
                type="number"
                placeholder="Enter your proposed amount"
                value={bid}
                onChange={(e) =>
                  setBid(e.target.value ? Number(e.target.value) : "")
                }
                className="focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="text-sm font-medium">
                Cover Letter
              </Label>
              <Textarea
                id="coverLetter"
                rows={6}
                placeholder="Introduce yourself..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button
                onClick={handleSubmit}
                disabled={loadingSubmit || userConnects < (job.connectRequired || 0)}
                className="min-w-[160px] transition-all"
              >
                {loadingSubmit ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Proposal"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default JobApplyPage;
