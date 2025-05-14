/**
 * DashboardCustomizer
 *
 * A component that allows users to customize their dashboard layout and preferences.
 * It provides options for:
 * - Changing the layout arrangement
 * - Showing/hiding specific widgets
 * - Setting data refresh preferences
 * - Customizing chart types
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Settings,
  Layout,
  Eye,
  RefreshCw,
  Lock,
  Zap,
  Sparkles,
  Brain
} from 'lucide-react';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { UpgradePrompt } from '@/components/ui/feature-gate';
import { useNavigate } from 'react-router-dom';

// Dashboard layout options
export type DashboardLayout = 'default' | 'compact' | 'expanded' | 'focus';

// Widget visibility options
export interface WidgetVisibility {
  performanceMetrics: boolean;
  workoutDistribution: boolean;
  weeklyGoals: boolean;
  upcomingWorkouts: boolean;
  achievements: boolean;
  quickStats: boolean;
}

// Dashboard customization props
interface DashboardCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layout: DashboardLayout;
  onLayoutChange: (layout: DashboardLayout) => void;
  widgetVisibility: WidgetVisibility;
  onWidgetVisibilityChange: (visibility: WidgetVisibility) => void;
  onReset: () => void;
}

/**
 * DashboardCustomizer component
 */
export function DashboardCustomizer({
  open,
  onOpenChange,
  layout,
  onLayoutChange,
  widgetVisibility,
  onWidgetVisibilityChange,
  onReset,
}: DashboardCustomizerProps) {
  const { canAccess, nextRecommendedTier } = useFeatureAccess();
  const navigate = useNavigate();

  // Check if user has access to advanced customization
  const hasAdvancedCustomization = canAccess('customization_advanced');
  const hasDashboardCustomization = canAccess('customization_dashboard');

  // Handle layout change
  const handleLayoutChange = (value: string) => {
    // If user doesn't have advanced customization and trying to use a premium layout
    if (!hasAdvancedCustomization && value !== 'default') {
      return;
    }
    onLayoutChange(value as DashboardLayout);
  };

  // Handle widget visibility change
  const handleWidgetVisibilityChange = (widget: keyof WidgetVisibility, checked: boolean) => {
    // If user doesn't have dashboard customization and trying to hide a widget
    if (!hasDashboardCustomization && !checked) {
      return;
    }
    onWidgetVisibilityChange({
      ...widgetVisibility,
      [widget]: checked,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Dashboard Customization
          </DialogTitle>
          <DialogDescription>
            Personalize your dashboard layout and widget visibility
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="layout" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="layout" className="flex items-center">
              <Layout className="mr-2 h-4 w-4" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="widgets" className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              Widgets
            </TabsTrigger>
            <TabsTrigger value="refresh" className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Dashboard Layout</h3>
                {!hasAdvancedCustomization && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Lock className="h-3 w-3 mr-1" />
                    Pro Feature
                  </Badge>
                )}
              </div>

              <RadioGroup
                value={layout}
                onValueChange={handleLayoutChange}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="default" id="layout-default" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="layout-default" className="font-medium">Default</Label>
                    <p className="text-sm text-muted-foreground">
                      Standard dashboard layout with balanced widget sizes
                    </p>
                  </div>
                </div>
                <div className={`flex items-start space-x-3 ${!hasAdvancedCustomization ? 'opacity-60' : ''}`}>
                  <RadioGroupItem
                    value="compact"
                    id="layout-compact"
                    disabled={!hasAdvancedCustomization}
                  />
                  <div className="grid gap-1.5">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="layout-compact" className="font-medium">Compact</Label>
                      {!hasAdvancedCustomization && <Lock className="h-3 w-3 text-blue-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Condensed layout with smaller widgets to see more at once
                    </p>
                  </div>
                </div>
                <div className={`flex items-start space-x-3 ${!hasAdvancedCustomization ? 'opacity-60' : ''}`}>
                  <RadioGroupItem
                    value="expanded"
                    id="layout-expanded"
                    disabled={!hasAdvancedCustomization}
                  />
                  <div className="grid gap-1.5">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="layout-expanded" className="font-medium">Expanded</Label>
                      {!hasAdvancedCustomization && <Lock className="h-3 w-3 text-blue-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Larger widgets with more detailed information
                    </p>
                  </div>
                </div>
                <div className={`flex items-start space-x-3 ${!hasAdvancedCustomization ? 'opacity-60' : ''}`}>
                  <RadioGroupItem
                    value="focus"
                    id="layout-focus"
                    disabled={!hasAdvancedCustomization}
                  />
                  <div className="grid gap-1.5">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="layout-focus" className="font-medium">Focus Mode</Label>
                      {!hasAdvancedCustomization && <Lock className="h-3 w-3 text-blue-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Simplified layout showing only your most important metrics
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {!hasAdvancedCustomization && (
                <Alert className="bg-blue-50 border-blue-200 mt-4">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Upgrade to Pro or higher</AlertTitle>
                  <AlertDescription>
                    Unlock advanced layout options by upgrading your subscription.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          {/* Widgets Tab */}
          <TabsContent value="widgets" className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Widget Visibility</h3>
                {!hasDashboardCustomization && (
                  <Badge className="bg-purple-100 text-purple-800">
                    <Lock className="h-3 w-3 mr-1" />
                    Elite Feature
                  </Badge>
                )}
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="widget-performance"
                  checked={widgetVisibility.performanceMetrics}
                  onCheckedChange={(checked) =>
                    handleWidgetVisibilityChange('performanceMetrics', checked as boolean)
                  }
                  disabled={!hasDashboardCustomization && !widgetVisibility.performanceMetrics}
                />
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="widget-performance" className="font-medium">Performance Metrics</Label>
                    {!hasDashboardCustomization && !widgetVisibility.performanceMetrics &&
                      <Lock className="h-3 w-3 text-purple-500" />
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Charts showing your performance trends
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="widget-distribution"
                  checked={widgetVisibility.workoutDistribution}
                  onCheckedChange={(checked) =>
                    handleWidgetVisibilityChange('workoutDistribution', checked as boolean)
                  }
                  disabled={!hasDashboardCustomization && !widgetVisibility.workoutDistribution}
                />
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="widget-distribution" className="font-medium">Workout Distribution</Label>
                    {!hasDashboardCustomization && !widgetVisibility.workoutDistribution &&
                      <Lock className="h-3 w-3 text-purple-500" />
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Breakdown of your training focus areas
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="widget-goals"
                  checked={widgetVisibility.weeklyGoals}
                  onCheckedChange={(checked) =>
                    handleWidgetVisibilityChange('weeklyGoals', checked as boolean)
                  }
                  disabled={!hasDashboardCustomization && !widgetVisibility.weeklyGoals}
                />
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="widget-goals" className="font-medium">Weekly Goals</Label>
                    {!hasDashboardCustomization && !widgetVisibility.weeklyGoals &&
                      <Lock className="h-3 w-3 text-purple-500" />
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Progress toward your weekly targets
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="widget-upcoming"
                  checked={widgetVisibility.upcomingWorkouts}
                  onCheckedChange={(checked) =>
                    handleWidgetVisibilityChange('upcomingWorkouts', checked as boolean)
                  }
                  disabled={!hasDashboardCustomization && !widgetVisibility.upcomingWorkouts}
                />
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="widget-upcoming" className="font-medium">Upcoming Workouts</Label>
                    {!hasDashboardCustomization && !widgetVisibility.upcomingWorkouts &&
                      <Lock className="h-3 w-3 text-purple-500" />
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Schedule of your upcoming training sessions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="widget-achievements"
                  checked={widgetVisibility.achievements}
                  onCheckedChange={(checked) =>
                    handleWidgetVisibilityChange('achievements', checked as boolean)
                  }
                  disabled={!hasDashboardCustomization && !widgetVisibility.achievements}
                />
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="widget-achievements" className="font-medium">Achievements</Label>
                    {!hasDashboardCustomization && !widgetVisibility.achievements &&
                      <Lock className="h-3 w-3 text-purple-500" />
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recent accomplishments and milestones
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="widget-stats"
                  checked={widgetVisibility.quickStats}
                  onCheckedChange={(checked) =>
                    handleWidgetVisibilityChange('quickStats', checked as boolean)
                  }
                  disabled={!hasDashboardCustomization && !widgetVisibility.quickStats}
                />
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="widget-stats" className="font-medium">Quick Stats</Label>
                    {!hasDashboardCustomization && !widgetVisibility.quickStats &&
                      <Lock className="h-3 w-3 text-purple-500" />
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Summary of key performance indicators
                  </p>
                </div>
              </div>

              {!hasDashboardCustomization && (
                <Alert className="bg-purple-50 border-purple-200 mt-4">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <AlertTitle>Upgrade to Elite AI</AlertTitle>
                  <AlertDescription>
                    Fully customize your dashboard widgets by upgrading to our Elite AI plan.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="refresh" className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Data refresh settings will be available in a future update.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={onReset}>
            Reset to Default
          </Button>

          {(!hasAdvancedCustomization || !hasDashboardCustomization) && nextRecommendedTier && (
            <UpgradePrompt
              targetTier={nextRecommendedTier}
              trigger={
                <Button
                  variant="outline"
                  className="flex items-center"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Upgrade for More Options
                </Button>
              }
              features={['customization_advanced', 'customization_dashboard']}
              title={`Unlock Premium Customization`}
              description="Get more control over your dashboard with a premium subscription."
            />
          )}

          <Button onClick={() => onOpenChange(false)}>
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DashboardCustomizer;
