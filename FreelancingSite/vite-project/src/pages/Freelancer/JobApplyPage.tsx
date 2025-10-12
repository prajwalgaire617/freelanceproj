import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobPosts } from "@/data/jd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const JobApplyPage: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [bid, setBid] = useState<number | "">("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [userConnects, setUserConnects] = useState(50);

  const job = jobPosts.find((j) => j.id === jobId);

  useEffect(() => {
    if (!job) navigate("/jobs");
  }, [job, navigate]);

  if (!job) return null;

  const handleSubmit = async () => {
    if (bid === "" || !coverLetter.trim()) {
      toast.error("Please fill in all fields!");
      return;
    }
    if (userConnects < job.requiredConnects) {
      toast.error("You don’t have enough connects!");
      return;
    }

    setLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    setUserConnects((prev) => prev - job.requiredConnects);
    setLoading(false);
    toast.success("Proposal submitted successfully!");
    navigate("/jobs");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto py-12 px-6 w-full">
        <Card className="shadow-lg rounded-2xl border border-border/60">
          <CardHeader className="pb-4 border-b border-border/40">
            <CardTitle className="text-3xl font-semibold tracking-tight">
              Submit Your Proposal
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              You are applying for{" "}
              <span className="font-medium text-foreground">{job.title}</span>
            </p>
          </CardHeader>

          <CardContent className="space-y-8 pt-6">
            {/* Job Info */}
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border border-border/30">
              <div>
                <p className="text-sm text-muted-foreground">
                  Required Connects:{" "}
                  <Badge variant="secondary" className="ml-1">
                    {job.requiredConnects}
                  </Badge>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your Connects:{" "}
                  <Badge
                    variant={
                      userConnects >= job.requiredConnects
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
                  Budget Range: ${job.budget?.min ?? 0} - ${job.budget?.max ?? 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {job.category}
                </p>
              </div>
            </div>

            {/* Bid Field */}
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
              <p className="text-xs text-muted-foreground">
                Tip: Competitive bids improve your chances of selection.
              </p>
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="text-sm font-medium">
                Cover Letter
              </Label>
              <Textarea
                id="coverLetter"
                rows={6}
                placeholder="Introduce yourself, explain why you’re a great fit, and highlight relevant experience..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button
                onClick={handleSubmit}
                disabled={loading || userConnects < job.requiredConnects}
                className="min-w-[160px] transition-all"
              >
                {loading ? (
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
