import Header from "@/components/layout/Header";
import { FilterSidebar } from "@/components/jobsdetails/FilterSideBar";
import JobsSearch from "@/components/jobsdetails/JobSearch";
import JobsSection from "@/components/jobsdetails/JobsSection";
import { JobPagination } from "@/components/pagination/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

function JobsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Hero Search Section */}
      <div className="bg-gradient-to-b from-muted/30 to-background border-b">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Find Your Next Opportunity
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Discover projects that match your skills and expertise
              </p>
            </div>
            <JobsSearch />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-10">
        <div className="flex flex-1 flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:w-80 lg:flex-shrink-0 w-full">
            <div className="lg:sticky lg:top-6">
              <div className="border rounded-lg p-5 bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Filters</h3>
                </div>
                <FilterSidebar />
              </div>
            </div>
          </aside>

          {/* Jobs and Sorting */}
          <section className="flex-1 min-w-0 flex flex-col">
            {/* Header with Results Count and Sort */}
            <div className="bg-card border rounded-lg p-4 md:p-5 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl md:text-2xl font-bold">Search Results</h2>
                  <p className="text-sm text-muted-foreground">
                    Showing available opportunities
                  </p>
                </div>
                
                <Select>
                  <SelectTrigger className="w-full sm:w-[200px] border-2 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort Options</SelectLabel>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="budgetHigh">Highest Budget</SelectItem>
                      <SelectItem value="budgetLow">Lowest Budget</SelectItem>
                      <SelectItem value="experience">Experience Level</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              <JobsSection />
            </div>

            {/* Pagination */}
            <div className="mt-8 mb-4 flex justify-center">
              <JobPagination />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default JobsPage;