
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type ProfileData } from "../../../type/job/profiledata";



interface ProfileHeaderProps {
  profileData: ProfileData;
  onSave: () => void;
  photoUrl?: string;
}

export default function ProfileHeader({ profileData, onSave, photoUrl }: ProfileHeaderProps) {
  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={photoUrl || "/placeholder.svg"} />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9 (127 reviews)</span>
                </div>
                <Badge
                  variant={profileData.availability === "available" ? "default" : "secondary"}
                >
                  {profileData.availability === "available"
                    ? "Available"
                    : profileData.availability === "busy"
                    ? "Busy"
                    : "Not Taking Work"}
                </Badge>
              </div>
            </div>
          </div>
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
