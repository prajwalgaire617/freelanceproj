import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { type PortfolioItem } from "../../../type/job/profiledata";

interface PortfolioTabProps {
  portfolioItems: PortfolioItem[];
  setPortfolioItems: (items: PortfolioItem[]) => void;
}

const PortfolioTab: React.FC<PortfolioTabProps> = ({ portfolioItems, setPortfolioItems }) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const filePreviews = files.map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

   setPortfolioItems([...portfolioItems, ...filePreviews]);
  };

const removeItem = (index: number) => {
  const updated = portfolioItems.filter((_, i) => i !== index);
  setPortfolioItems(updated);
};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Portfolio & Samples
        </CardTitle>
        <CardDescription>Showcase your best work to attract clients</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Upload Portfolio Items</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add images, PDFs, or links to your work
          </p>
          <input
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleUpload}
            className="hidden"
            id="portfolio-upload"
          />
          <Button asChild>
            <label htmlFor="portfolio-upload" className="cursor-pointer">
              Choose Files
            </label>
          </Button>
        </div>

        {/* Portfolio Grid */}
        {portfolioItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioItems.map((item, index) => (
              <Card key={index} className="relative group overflow-hidden">
                <CardContent className="pt-4">
                  {item.type.includes("image") ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  ) : item.type.includes("pdf") ? (
                    <div className="aspect-video bg-muted flex items-center justify-center rounded-lg mb-3">
                      <p className="text-sm text-muted-foreground">{item.name}</p>
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Preview Not Available</p>
                    </div>
                  )}

                  <h4 className="font-semibold truncate">{item.name}</h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No portfolio items uploaded yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioTab;
