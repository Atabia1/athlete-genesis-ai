
import React from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// DashboardCustomizer Props
export interface DashboardCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layout: string;
  onLayoutChange: (layout: string) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  widgets: string[];
  onWidgetsChange: (widgets: string[]) => void;
}

/**
 * Dashboard Customizer Component
 * 
 * This component allows users to customize their dashboard experience.
 */
const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  open,
  onOpenChange,
  layout,
  onLayoutChange,
  theme,
  onThemeChange,
  widgets,
  onWidgetsChange
}) => {
  const [activeTab, setActiveTab] = React.useState('layout');
  
  // Handle saving customizations
  const handleSave = () => {
    // Save customizations and close dialog
    onOpenChange(false);
  };
  
  // Reset customizations to defaults
  const handleReset = () => {
    onLayoutChange('default');
    onThemeChange('light');
    onWidgetsChange(['health', 'activity', 'goals', 'workouts']);
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
            {['health', 'activity', 'goals', 'workouts', 'performance', 'nutrition'].map(widget => (
              <div key={widget} className="flex items-center justify-between">
                <Label htmlFor={`widget-${widget}`} className="capitalize">{widget}</Label>
                <Switch 
                  id={`widget-${widget}`}
                  checked={widgets.includes(widget)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onWidgetsChange([...widgets, widget]);
                    } else {
                      onWidgetsChange(widgets.filter(w => w !== widget));
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="theme" className="space-y-4">
          <RadioGroup
            value={theme}
            onValueChange={onThemeChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system">System</Label>
            </div>
          </RadioGroup>
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
