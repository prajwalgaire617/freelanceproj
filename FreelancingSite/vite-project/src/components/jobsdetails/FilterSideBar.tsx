import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const FilterSidebar = () => {
  return (
    <Card className="p-6 border border-border bg-card sticky top-4">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Filter by</h2>

      <div className="space-y-6">
        {/* Job Type */}
        <div>
          <h3 className="font-medium mb-3 text-foreground">Job Type</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="hourly" />
              <Label htmlFor="hourly" className="text-sm cursor-pointer text-foreground">
                Hourly
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="fixed" />
              <Label htmlFor="fixed" className="text-sm cursor-pointer text-foreground">
                Fixed-Price
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Experience Level */}
        <div>
          <h3 className="font-medium mb-3 text-foreground">Experience Level</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="entry" />
              <Label htmlFor="entry" className="text-sm cursor-pointer text-foreground">
                Entry Level
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="intermediate" />
              <Label htmlFor="intermediate" className="text-sm cursor-pointer text-foreground">
                Intermediate
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="expert" />
              <Label htmlFor="expert" className="text-sm cursor-pointer text-foreground">
                Expert
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Project Length */}
        <div>
          <h3 className="font-medium mb-3 text-foreground">Project Length</h3>
          <RadioGroup defaultValue="any">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="any" id="any" />
              <Label htmlFor="any" className="text-sm cursor-pointer text-foreground">
                Any duration
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="short" id="short" />
              <Label htmlFor="short" className="text-sm cursor-pointer text-foreground">
                Less than 1 month
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="text-sm cursor-pointer text-foreground">
                1 to 3 months
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="long" id="long" />
              <Label htmlFor="long" className="text-sm cursor-pointer text-foreground">
                3+ months
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Budget Range */}
        <div>
          <h3 className="font-medium mb-3 text-foreground">Budget Range</h3>
          <div className="space-y-4">
            <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>$0</span>
              <span>$10,000+</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Client Info */}
        <div>
          <h3 className="font-medium mb-3 text-foreground">Client Info</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="verified" />
              <Label htmlFor="verified" className="text-sm cursor-pointer text-foreground">
                Payment verified
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="history" />
              <Label htmlFor="history" className="text-sm cursor-pointer text-foreground">
                10+ hires
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rating" />
              <Label htmlFor="rating" className="text-sm cursor-pointer text-foreground">
                4.5+ rating
              </Label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Number of Proposals */}
        <div>
          <h3 className="font-medium mb-3 text-foreground">Number of Proposals</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="less5" />
              <Label htmlFor="less5" className="text-sm cursor-pointer text-foreground">
                Less than 5
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="5to10" />
              <Label htmlFor="5to10" className="text-sm cursor-pointer text-foreground">
                5 to 10
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="10to15" />
              <Label htmlFor="10to15" className="text-sm cursor-pointer text-foreground">
                10 to 15
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="more15" />
              <Label htmlFor="more15" className="text-sm cursor-pointer text-foreground">
                15+
              </Label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
