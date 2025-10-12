import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

const JobsSearch: React.FC = () => {
    return (
        <div className="flex w-full max-w-md items-center space-x-2">
            <Input placeholder="Search for jobs (e.g. React, Design, Writing)" className="bg-background border-muted" />
            <Button>
                <Search className="w-4 h-4" />
            </Button>
        </div>
    );
}

export default JobsSearch;

