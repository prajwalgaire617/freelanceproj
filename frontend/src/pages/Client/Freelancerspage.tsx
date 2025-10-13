import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Star, MapPin, DollarSign } from "lucide-react";

const mockFreelancers = [
  {
    id: 1,
    name: "Anita Sharma",
    title: "UI/UX Designer",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 45,
    location: "India",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita",
    skills: ["Figma", "UI/UX", "Prototyping", "Design Systems"],
    description: "Award-winning designer with 8+ years of experience creating beautiful, user-centered digital products.",
  },
  {
    id: 2,
    name: "Ramesh Karki",
    title: "Full Stack Developer",
    rating: 5.0,
    reviews: 89,
    hourlyRate: 65,
    location: "Nepal",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    description: "Senior developer specializing in scalable web applications and cloud infrastructure.",
  },
  {
    id: 3,
    name: "Sita Lama",
    title: "Content Writer & SEO Specialist",
    rating: 4.8,
    reviews: 203,
    hourlyRate: 35,
    location: "Remote",
    img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sita",
    skills: ["Content Writing", "SEO", "Copywriting", "Blog Writing"],
    description: "Creative writer with expertise in technical content and SEO optimization.",
  },
];

interface FreelancerSearchProps {
  onHireFreelancer: (freelancer: any) => void;
}

export default function FreelancerSearch({ onHireFreelancer }: FreelancerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search freelancers by skills, title, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>Search</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mockFreelancers.map((freelancer) => (
          <Card key={freelancer.id} className="hover:shadow-lg transition">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={freelancer.img} />
                  <AvatarFallback>{freelancer.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{freelancer.name}</h3>
                  <p className="text-sm text-muted-foreground">{freelancer.title}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{freelancer.rating}</span>
                      <span className="text-muted-foreground">({freelancer.reviews})</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{freelancer.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-semibold">
                    <DollarSign className="w-5 h-5" />
                    {freelancer.hourlyRate}/hr
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                {freelancer.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {freelancer.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button className="flex-1" variant="outline">View Profile</Button>
                <Button 
                  className="flex-1"
                  onClick={() => onHireFreelancer(freelancer)}
                >
                  Hire Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
