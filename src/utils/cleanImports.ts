
/**
 * Import Cleaning Utility
 * 
 * This utility helps identify and fix unused imports and variables in TypeScript files.
 * It provides tools to clean up the codebase and improve type safety.
 */

// Track unused imports by component
interface ComponentImportMap {
  [fileName: string]: string[];
}

// Track unused variables by component
interface ComponentVariableMap {
  [fileName: string]: string[];
}

// Maps of components with their unused imports and variables
const unusedImportsMap: ComponentImportMap = {
  "BodyCompositionChart": [
    "Badge", "Activity", "ArrowRight", "TrendingUp", "Minus", "BarChart3",
    "LineChart", "PieChart", "RechartsBarChart", "Bar", "ComposedChart", "Area"
  ],
  "CoachDashboard": [
    "BarChart2", "Progress", "AvatarImage", "BarChart", "Bar"
  ],
  "DashboardCustomizationPanel": ["EyeOff"],
  "EliteDashboard": ["React"],
  "ExportHealthDataCard": [
    "Mail", "Users", "Shield", "Clock"
  ],
  "GoalTrackingCard": [
    "CardFooter", "TrendingUp", "Clock", "Award", "ArrowUpRight", 
    "ArrowDownRight", "Minus", "Info"
  ],
  "HealthDataVisualization": [
    "useEffect", "Clock", "Calendar", "BarChart3", "LineChart", "PieChart", "HealthWorkout"
  ],
  "HealthInsights": [
    "CardFooter", "TrendingUp", "Activity", "HealthWorkout"
  ],
  "HealthTrends": [
    "TabsContent", "LineChart", "BarChart", "RechartsBarChart", "Bar", "Legend", "healthSyncService"
  ],
  "NutritionAnalysisChart": [
    "Badge", "Apple", "Coffee", "Droplets", "TrendingUp", "Calendar", "Clock",
    "LineChart", "Line", "PieChart", "Pie", "Cell", "RadarChart", "PolarGrid",
    "PolarAngleAxis", "PolarRadiusAxis", "Radar", "ComposedChart", "Area",
    "ReferenceLine", "Scatter", "ChevronRight"
  ],
  "MealPlanDisplay": ["Button", "Badge"],
  "OfflineWorkoutsDisplay": ["RefreshCw"]
};

// Maps of unused variables by component
const unusedVariablesMap: ComponentVariableMap = {
  "BodyCompositionChart": ["bodyCompositionData", "COLORS"],
  "EliteDashboard": ["user", "index", "entry"],
  "GoalTrackingCard": ["progressData", "categoryData", "formatDate"],
  "HealthDataVisualization": ["formatTime", "entry"],
  "HealthInsights": [],
  "NutritionAnalysisChart": [
    "calorieData", "setCalorieData", "macroDistribution", "mealPatternData", "nutrientQualityData", "hydrationData"
  ],
  "OfflineWorkoutsDisplay": ["saveMultipleWorkouts"]
};

// Missing variables to add (for fixing type errors)
const missingVariablesMap: Record<string, Record<string, string>> = {
  "NutritionAnalysisChart": {
    // Define missing variables and their default values
    "proteinPercentage": "30",
    "carbsPercentage": "45",
    "fatPercentage": "25",
    "handleExport": "() => console.log('Export feature not implemented yet')",
    "handleShare": "() => console.log('Share feature not implemented yet')",
    "setCalorieData": "() => {}" // This will need to be implemented in useState
  },
  "OfflineWorkoutsDisplay": {
    // ConnectionQuality type definition
    "ConnectionQuality": "type ConnectionQuality = 'offline' | 'poor' | 'good' | 'excellent' | 'captive-portal' | 'unknown';"
  }
};

// Get unused imports for a specific component
const getUnusedImportInfo = (fileName: string): string[] => {
  return unusedImportsMap[fileName] || [];
};

// Get unused variables for a specific component
const getUnusedVariables = (fileName: string): string[] => {
  return unusedVariablesMap[fileName] || [];
};

// Get missing variables to add for a component
const getMissingVariables = (fileName: string): Record<string, string> => {
  return missingVariablesMap[fileName] || {};
};

// Is an import statement line
const isImportStatement = (line: string): boolean => {
  return line.trim().startsWith('import ') && line.includes(' from ');
};

// Extract import names from a line
const extractImportNames = (line: string): string[] => {
  // Extract everything between braces in an import statement
  const braceMatch = line.match(/{([^}]*)}/);
  if (!braceMatch) return [];
  
  return braceMatch[1].split(',').map(name => name.trim());
};

// Clean import statement by removing unused imports
const cleanImportStatement = (line: string, unusedImports: string[]): string => {
  if (!isImportStatement(line)) return line;
  
  let cleanedLine = line;
  
  // Check for imports in braces: import { X, Y } from 'z'
  if (line.includes('{')) {
    const importNames = extractImportNames(line);
    const filteredImports = importNames.filter(name => !unusedImports.includes(name.trim()));
    
    if (filteredImports.length === 0) {
      // All imports in this line are unused, remove the whole line
      return '';
    }
    
    // Replace the import list with the filtered list
    const importListStr = `{ ${filteredImports.join(', ')} }`;
    cleanedLine = line.replace(/{[^}]*}/, importListStr);
  } 
  // Handle default imports: import React from 'react'
  else {
    for (const unusedImport of unusedImports) {
      const importRegex = new RegExp(`\\bimport\\s+${unusedImport}\\b\\s+from\\s+['"].*['"]`);
      if (importRegex.test(line)) {
        return ''; // Remove the whole line for default imports
      }
    }
  }
  
  return cleanedLine;
};

// Fix imports and variables in component content
const cleanComponentContent = (content: string, componentName: string): string => {
  const unusedImports = getUnusedImportInfo(componentName);
  const unusedVariables = getUnusedVariables(componentName);
  const missingVariables = getMissingVariables(componentName);
  
  if (unusedImports.length === 0 && unusedVariables.length === 0 && Object.keys(missingVariables).length === 0) {
    return content; // No changes needed
  }
  
  let cleanedContent = content;
  const lines = content.split('\n');
  const cleanedLines: string[] = [];
  
  // First pass: clean imports
  for (let line of lines) {
    if (isImportStatement(line)) {
      const cleanedLine = cleanImportStatement(line, unusedImports);
      if (cleanedLine) {
        cleanedLines.push(cleanedLine);
      }
    } else {
      cleanedLines.push(line);
    }
  }
  cleanedContent = cleanedLines.join('\n');
  
  // Second pass: clean unused variables
  for (const varName of unusedVariables) {
    // Match variable declarations
    const varRegex = new RegExp(`(\\bconst\\s+${varName}\\s*=.*?;)`, 'g');
    cleanedContent = cleanedContent.replace(varRegex, '');
    
    // Match destructured variables
    const destructureRegex = new RegExp(`(\\b${varName}\\b\\s*,)|(,\\s*\\b${varName}\\b)`, 'g');
    cleanedContent = cleanedContent.replace(destructureRegex, '');
  }
  
  // Clean up artifacts (double commas, etc.)
  cleanedContent = cleanedContent
    .replace(/,\s*,/g, ',')
    .replace(/,\s*\}/g, ' }')
    .replace(/{\s*,/g, '{ ')
    .replace(/,\s*from/g, ' from')
    .replace(/\(\s*,/g, '(')
    .replace(/,\s*\)/g, ')')
    .replace(/import\s*{\s*}\s*from\s*['"].*['"]/g, ''); // Remove empty imports
  
  // Special fixes for NutritionAnalysisChart.tsx
  if (componentName === 'NutritionAnalysisChart') {
    // Add missing variables
    const stateVarsToAdd = `
  // Define state and other necessary variables
  const [calorieData, setCalorieData] = useState([]); 
  const proteinPercentage = 30;
  const carbsPercentage = 45;
  const fatPercentage = 25;
  
  const handleExport = () => {
    console.log('Export feature not implemented yet');
  };
  
  const handleShare = () => {
    console.log('Share feature not implemented yet');
  };`;
    
    // Find a good insertion point (after useState import or after the component function start)
    if (cleanedContent.includes('useState')) {
      const componentStartPos = cleanedContent.indexOf('const NutritionAnalysisChart');
      if (componentStartPos > -1) {
        const bracketPos = cleanedContent.indexOf('{', componentStartPos);
        if (bracketPos > -1) {
          const insertPos = cleanedContent.indexOf('\n', bracketPos) + 1;
          cleanedContent = cleanedContent.slice(0, insertPos) + stateVarsToAdd + cleanedContent.slice(insertPos);
        }
      }
    }
  }
  
  // Special fixes for OfflineWorkoutsDisplay.tsx
  if (componentName === 'OfflineWorkoutsDisplay') {
    // Define ConnectionQuality type
    const typeToAdd = `
// Define ConnectionQuality type
type ConnectionQuality = 'offline' | 'poor' | 'good' | 'excellent' | 'captive-portal' | 'unknown';
`;
    
    // Insert it before imports or at the beginning
    cleanedContent = typeToAdd + cleanedContent;
    
    // Update the hook usage to match the actual hook interface (without connectionQuality and checkConnection)
    cleanedContent = cleanedContent.replace(
      /const \{ isOnline, connectionQuality, checkConnection \} = useNetworkStatus\(\);/g, 
      'const { isOnline, checkNetworkReachability } = useNetworkStatus();'
    );
    
    // Fix type issues with goal and index parameters
    cleanedContent = cleanedContent.replace(
      /(goal, index) =>/g, 
      '(goal: any, index: number) =>'
    );
  }
  
  return cleanedContent;
};

// Export utility functions
export { 
  getUnusedImportInfo,
  getUnusedVariables,
  cleanComponentContent,
  getMissingVariables
};
