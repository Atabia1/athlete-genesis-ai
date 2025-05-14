import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Settings,
  LayoutGrid,
  Eye,
  EyeOff,
  SunMoon,
  RotateCcw,
  MoveVertical,
  Check
} from 'lucide-react';
import {
  useDashboardCustomization,
  DashboardLayout,
  WidgetType,
  DashboardTheme
} from '@/context/DashboardCustomizationContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

// Widget display names
const widgetNames: Record<WidgetType, string> = {
  healthScore: 'Health Score',
  goals: 'Goal Tracking',
  activity: 'Activity Overview',
  workouts: 'Recent Workouts',
  workoutPerformance: 'Workout Performance',
  sleep: 'Sleep Analysis',
  bodyComposition: 'Body Composition',
  nutrition: 'Nutrition Analysis',
  comparative: 'Comparative Analytics',
  insights: 'Health Insights',
  trends: 'Health Trends',
  export: 'Export & Share',
  recommendations: 'Personalized Recommendations',
  achievements: 'Achievements',
  community: 'Community Leaderboard',
  coachSharing: 'Coach Sharing'
};

// Widget icons
const widgetIcons: Record<WidgetType, React.ReactNode> = {
  healthScore: <div className="w-4 h-4 bg-blue-500 rounded-full" />,
  goals: <div className="w-4 h-4 bg-purple-500 rounded-full" />,
  activity: <div className="w-4 h-4 bg-green-500 rounded-full" />,
  workouts: <div className="w-4 h-4 bg-orange-500 rounded-full" />,
  workoutPerformance: <div className="w-4 h-4 bg-blue-500 rounded-full" />,
  sleep: <div className="w-4 h-4 bg-indigo-500 rounded-full" />,
  bodyComposition: <div className="w-4 h-4 bg-teal-500 rounded-full" />,
  nutrition: <div className="w-4 h-4 bg-green-500 rounded-full" />,
  comparative: <div className="w-4 h-4 bg-purple-500 rounded-full" />,
  insights: <div className="w-4 h-4 bg-yellow-500 rounded-full" />,
  trends: <div className="w-4 h-4 bg-red-500 rounded-full" />,
  export: <div className="w-4 h-4 bg-gray-500 rounded-full" />,
  recommendations: <div className="w-4 h-4 bg-amber-500 rounded-full" />,
  achievements: <div className="w-4 h-4 bg-yellow-500 rounded-full" />,
  community: <div className="w-4 h-4 bg-blue-400 rounded-full" />,
  coachSharing: <div className="w-4 h-4 bg-green-400 rounded-full" />
};

// Sortable widget item component
const SortableWidget = ({ id, widget }: { id: WidgetType, widget: WidgetType }) => {
  const { customization, updateWidgetVisibility } = useDashboardCustomization();
  const isVisible = customization.widgetVisibility[widget] ?? true;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 mb-2 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-move"
    >
      <div className="flex items-center" {...attributes} {...listeners}>
        <MoveVertical className="h-4 w-4 mr-2 text-gray-400" />
        <div className="mr-2">
          {widgetIcons[widget]}
        </div>
        <span>{widgetNames[widget]}</span>
      </div>
      <Switch
        checked={isVisible}
        onCheckedChange={(checked) => updateWidgetVisibility(widget, checked)}
      />
    </div>
  );
};

/**
 * Dashboard Customization Panel
 *
 * A panel that allows users to customize their dashboard experience.
 */
const DashboardCustomizationPanel = () => {
  const {
    customization,
    updateLayout,
    updateTheme,
    updateWidgetOrder,
    resetCustomization
  } = useDashboardCustomization();

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('layout');

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle DnD end
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = customization.widgetOrder.indexOf(active.id);
      const newIndex = customization.widgetOrder.indexOf(over.id);

      const newOrder = [...customization.widgetOrder];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, active.id);

      updateWidgetOrder(newOrder);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Dashboard Customization</SheetTitle>
          <SheetDescription>
            Customize your dashboard experience
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="layout">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="widgets">
              <Eye className="h-4 w-4 mr-2" />
              Widgets
            </TabsTrigger>
            <TabsTrigger value="theme">
              <SunMoon className="h-4 w-4 mr-2" />
              Theme
            </TabsTrigger>
          </TabsList>

          {/* Layout Tab */}
          <TabsContent value="layout" className="py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Dashboard Layout</h3>
              <RadioGroup
                value={customization.layout}
                onValueChange={(value) => updateLayout(value as DashboardLayout)}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="default" id="layout-default" />
                  <Label htmlFor="layout-default">Default</Label>
                  <span className="text-xs text-gray-500 ml-2">
                    Standard layout with all widgets
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="compact" id="layout-compact" />
                  <Label htmlFor="layout-compact">Compact</Label>
                  <span className="text-xs text-gray-500 ml-2">
                    Condensed layout with smaller widgets
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="expanded" id="layout-expanded" />
                  <Label htmlFor="layout-expanded">Expanded</Label>
                  <span className="text-xs text-gray-500 ml-2">
                    Larger widgets with more detail
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="focus" id="layout-focus" />
                  <Label htmlFor="layout-focus">Focus</Label>
                  <span className="text-xs text-gray-500 ml-2">
                    Minimal layout with only essential widgets
                  </span>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          {/* Widgets Tab */}
          <TabsContent value="widgets" className="py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Widget Visibility & Order</h3>
              <p className="text-xs text-gray-500">
                Drag to reorder widgets or toggle visibility
              </p>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={customization.widgetOrder}
                  strategy={verticalListSortingStrategy}
                >
                  {customization.widgetOrder.map((widget) => (
                    <SortableWidget key={widget} id={widget} widget={widget} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme" className="py-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Dashboard Theme</h3>
              <RadioGroup
                value={customization.theme}
                onValueChange={(value) => updateTheme(value as DashboardTheme)}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light">Light</Label>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="theme-system" />
                  <Label htmlFor="theme-system">System</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={resetCustomization}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={() => setOpen(false)}>
            <Check className="h-4 w-4 mr-2" />
            Apply Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default DashboardCustomizationPanel;
