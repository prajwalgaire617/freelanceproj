import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobCard from "./JobCard";
import JobDetailModal from "./JobDetailModal";
import { jobPosts,type JobPost } from "@/data/jd";

const JobsSection: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  return (
    <section id="topjobs" className="max-w-6xl mx-auto flex justify-center">
      <div className="flex w-full max-w-4xl flex-col gap-6 justify-center">
        <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight">
          Jobs You Might Like
        </h2>

        <Tabs defaultValue="best-matching">
          <TabsList>
            <TabsTrigger value="best-matching">Best Matching</TabsTrigger>
            <TabsTrigger value="most-recent">Most Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="best-matching">
            {jobPosts.map((job) => (
              <div key={job.id}>
                <JobCard job={job} onViewDetails={() => setSelectedJob(job)} />
                {selectedJob?.id === job.id && (
                  <JobDetailModal
                    job={job}
                    open={selectedJob?.id === job.id}
                    onClose={() => setSelectedJob(null)}
                  />
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="most-recent">
            <p>Coming soon - View the latest job postings</p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default JobsSection;
