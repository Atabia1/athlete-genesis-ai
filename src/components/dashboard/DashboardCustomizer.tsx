
import React from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type DashboardLayout = 'default' | 'compact' | 'expanded';

export interface WidgetVisibility {
  performanceMetrics: boolean;
  workoutDistribution: boolean;
  weeklyGoals: boolean;
  upcomingWorkouts: boolean;
  achievements: boolean;
  quickStats: boolean;
}

export interface DashboardCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layout: DashboardLayout;
  onLayoutChange: (layout: DashboardLayout) => void;
  widgetVisibility: WidgetVisibility;
  onWidgetVisibilityChange: (widgets: WidgetVisibility) => void;
  onReset: () => void;
}

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  open,
  onOpenChange,
  layout,
  onLayoutChange,
  widgetVisibility,
  onWidgetVisibilityChange,
  onReset
}) => {
  const [activeTab, setActiveTab] = React.useState('layout');
  
  const handleSave = () => {
    onOpenChange(false);
  };
  
  const handleReset = () => {
    onReset();
  };
  
  return (
    <div className={`dashboard-customizer ${open ? 'open' : 'closed'}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layout" className="space-y-4">
          <RadioGroup
            value={layout}
            onValueChange={onLayoutChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="layout-default" />
              <Label htmlFor="layout-default">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="layout-compact" />
              <Label htmlFor="layout-compact">Compact</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expanded" id="layout-expanded" />
              <Label htmlFor="layout-expanded">Expanded</Label>
            </div>
          </RadioGroup>
        </TabsContent>
        
        <TabsContent value="widgets" className="space-y-4">
          <div className="space-y-2">
            {Object.keys(widgetVisibility).map(widget => (
              <div key={widget} className="flex items-center justify-between">
                <Label htmlFor={`widget-${widget}`} className="capitalize">
                  {widget.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Switch 
                  id={`widget-${widget}`}
                  checked={widgetVisibility[widget as keyof WidgetVisibility]}
                  onCheckedChange={(checked) => {
                    onWidgetVisibilityChange({
                      ...widgetVisibility,
                      [widget]: checked
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="theme" className="space-y-4">
          <p className="text-sm text-gray-600">Theme customization coming soon</p>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleSave}>
          <Check className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export { DashboardCustomizer };
