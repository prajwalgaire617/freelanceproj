import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { type JobPost } from "@/data/jd";

interface JobCardProps {
  job: JobPost;
  onViewDetails: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  return (
    <Card className="bg-transparent border-none shadow-none hover:border hover:shadow-md transition hover:bg-accent/50 cursor-pointer relative">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>
          {job.postedTime} • {job.jobType} • {job.experienceLevel} • Budget:{" "}
          {job.jobType === "Fixed-price"
            ? `$${job.estimatedBudget}`
            : `$${job.hourlyRate?.min} - $${job.hourlyRate?.max}/hr`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>
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
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          <div>
            Client: {job.client.location} • {job.client.rating}★ (
            {job.client.reviewsCount} reviews)
          </div>
          <div>Proposals: {job.proposals.count}</div>
        </div>
        <Button onClick={onViewDetails}>View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
