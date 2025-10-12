import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type JobPost } from "@/data/jd";
import { useNavigate } from "react-router-dom";

interface JobDetailModalProps {
    job: JobPost | null;
    open: boolean;
    onClose: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, open, onClose }) => {
    const navigate = useNavigate();
    if (!job) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">{job.title}</DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Posted {job.postedTime} • {job.location}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                    <p className="text-gray-700">{job.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4">
                        <div>
                            <p className="font-semibold">${job.estimatedBudget}</p>
                            <p className="text-sm text-gray-500">Fixed-price</p>
                        </div>
                        <div>
                            <p className="font-semibold">{job.experienceLevel}</p>
                            <p className="text-sm text-gray-500">Experience Level</p>
                        </div>
                        {/* <div>
                            <p className="font-semibold">{job.projectType}</p>
                            <p className="text-sm text-gray-500">Project Type</p>
                        </div> */}
                    </div>

                    {/* {job.contractToHire && (
                        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                            <h3 className="font-semibold text-green-700">
                                Contract-to-hire opportunity
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                                This lets talent know that this job could become full-time.
                            </p>
                        </div>
                    )} */}

                    <div>
                        <h4 className="font-semibold mb-2">Skills and Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, i) => (
                                <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">About the client</h4>
                        <p className="text-gray-800">{job.client.location}</p>
                        <p className="text-sm text-gray-600">
                            Payment verified:{" "}
                            <span
                                className={`font-semibold ${job.payment.verified ? "text-green-600" : "text-red-500"
                                    }`}
                            >
                                {job.payment.verified ? "Yes" : "No"}
                            </span>
                        </p>
                        <p className="text-sm text-gray-600">Phone verified: ✅</p>
                    </div>
                </div>

                <DialogFooter className="flex justify-between mt-6">
<Button onClick={() => navigate(`/apply/${job.id}`)}>Apply</Button>                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default JobDetailModal;
