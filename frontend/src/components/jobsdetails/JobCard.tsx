import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { JobPost } from "@/type/job/jobpost";

// ✅ Define JobPost type inline or import it from src/types/job.ts


interface JobCardProps {
  job: JobPost;
  onViewDetails: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  const clientName = job.client
    ? `${job.client.firstName} ${job.client.lastName}`
    : "Unknown Client";

  const budget =
    job.budgetType === "fixed"
      ? job.budget
        ? `$${job.budget.toLocaleString()}`
        : job.minBudget && job.maxBudget
        ? `$${job.minBudget} - $${job.maxBudget}`
        : "Not specified"
      : job.minBudget && job.maxBudget
      ? `$${job.minBudget} - $${job.maxBudget}/hr`
      : "Not specified";

  return (
    <Card className="bg-transparent border border-border shadow-none hover:shadow-md hover:bg-accent/50 transition cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {job.experienceLevel
            ? `${job.experienceLevel} • ${job.projectDuration || "Duration N/A"}`
            : "Experience not specified"}{" "}
          • Budget: {budget}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>

        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="bg-accent/50 text-accent-foreground px-2 py-1 rounded-md text-xs"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <div>
          <div>Client: {clientName}</div>
          <div>Timezone: {job.timezone || "N/A"}</div>
        </div>
        <Button onClick={onViewDetails}>View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
