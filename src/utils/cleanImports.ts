
/**
 * Import Cleaning Utility
 * 
 * This file is a utility to help log and remove unused imports.
 * It's not meant to be used in production, just for development cleanup.
 */

const logUnusedImports = () => {
  console.log("This is a utility function to remind you to clean up unused imports");
  console.log("Files with numerous unused imports that need cleanup:");
  console.log("- src/components/dashboard/BodyCompositionChart.tsx");
  console.log("- src/components/dashboard/CoachDashboard.tsx"); 
  console.log("- src/components/dashboard/EliteDashboard.tsx");
  console.log("- src/components/dashboard/ExportHealthDataCard.tsx");
  console.log("- src/components/dashboard/GoalTrackingCard.tsx");
  console.log("- src/components/dashboard/HealthDataDisplay.tsx");
  console.log("- src/components/dashboard/HealthDataVisualization.tsx");
  console.log("- src/components/dashboard/HealthInsights.tsx");
  console.log("- src/components/dashboard/HealthTrends.tsx");
  console.log("- src/components/dashboard/NutritionAnalysisChart.tsx");
};

// Helper function to assist with fixing unused imports
const getUnusedImportInfo = (fileName: string) => {
  const fileImportMap: Record<string, string[]> = {
    "BodyCompositionChart": [
      "Badge", "Activity", "ArrowRight", "TrendingUp", "Minus", "BarChart3", "LineChart", "PieChart",
      "RechartsBarChart", "Bar", "ComposedChart", "Area"
    ],
    "CoachDashboard": [
      "BarChart2", "Progress", "AvatarImage", "BarChart", "Bar"
    ],
    "EliteDashboard": [
      "React", "AreaChart", "Area", "PieChart", "Pie", "Cell"
    ],
    "ExportHealthDataCard": [
      "Mail", "Users", "Shield", "Clock"
    ],
    "GoalTrackingCard": [
      "CardFooter", "TrendingUp", "Clock", "Award", "ArrowUpRight", "ArrowDownRight", "Minus", "Info"
    ],
    "HealthDataDisplay": [
      "React", "Clock", "Calendar", "HealthWorkout"
    ],
    "HealthInsights": [
      "CardFooter", "TrendingUp", "Activity", "HealthWorkout"
    ],
    "HealthTrends": [
      "TabsContent", "LineChart", "BarChart", "RechartsBarChart", "Bar", "Legend", "healthSyncService"
    ],
    "NutritionAnalysisChart": [
      "Badge", "Apple", "Coffee", "Droplets", "TrendingUp", "Calendar", "Clock", "LineChart", 
      "Line", "PieChart", "Pie", "Cell", "RadarChart", "PolarGrid", "PolarAngleAxis"
    ]
  };

  return fileImportMap[fileName] || [];
};

export default logUnusedImports;
export { getUnusedImportInfo };
