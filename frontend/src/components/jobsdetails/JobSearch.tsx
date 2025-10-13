// import React, { useState } from "react";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Search } from "lucide-react";

// interface JobsSearchProps {
//   onSearch: (term: string) => void;
//   onSubmit?: () => void; // ✅ optional prop for "submit" action
//   initialTerm?: string;
// }

// const JobsSearch: React.FC<JobsSearchProps> = ({
//   onSearch,
//   onSubmit,
//   initialTerm = "",
// }) => {
//   const [searchTerm, setSearchTerm] = useState(initialTerm);

//   const handleSearch = () => {
//     onSearch(searchTerm); // update parent state
//     if (onSubmit) onSubmit(); // ✅ trigger navigation if provided
//   };

//   return (
//     <div className="flex w-full max-w-md items-center space-x-2">
//       <Input
//         placeholder="Search for jobs (e.g. React, Design, Writing)"
//         className="bg-background border-muted"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && handleSearch()} // ✅ press Enter support
//       />
//       <Button onClick={handleSearch}>
//         <Search className="w-4 h-4" />
//       </Button>
//     </div>
//   );
// };

// export default JobsSearch;

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

interface JobsSearchProps {
  onSearch: (term: string) => void;
  onSubmit?: (term: string) => void; // ✅ optional but supports parent navigation
  initialTerm?: string;
}

const JobsSearch: React.FC<JobsSearchProps> = ({
  onSearch,
  onSubmit,
  initialTerm = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialTerm);

  const handleSearch = () => {
    onSearch(searchTerm);
    if (onSubmit) onSubmit(searchTerm); // ✅ pass latest value up
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(); // ✅ also trigger on Enter key
    }
  };

  return (
    <div className="flex w-full max-w-md items-center space-x-2">
      <Input
        placeholder="Search for jobs (e.g. React, Design, Writing)"
        className="bg-background border-muted"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <Button onClick={handleSearch}>
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default JobsSearch;

