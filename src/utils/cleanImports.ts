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
    "useState", "Badge", "Apple", "Coffee", "Droplets", "TrendingUp", "Calendar", "Clock",
    "LineChart", "Line", "PieChart", "Pie", "Cell", "RadarChart", "PolarGrid",
    "PolarAngleAxis", "PolarRadiusAxis", "Radar", "ComposedChart", "Area",
    "ReferenceLine", "Scatter", "ChevronRight", "BarChart2"
  ],
  "MealPlanDisplay": ["Button", "Badge"],
  "OfflineWorkoutsDisplay": ["RefreshCw", "saveMultipleWorkouts"],
  "PersonalizedRecommendations": ["Dumbbell", "Brain"],
  "ProAthleteDashboard": ["Trophy", "LineChart", "RechartsLineChart", "Line"]
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
  "OfflineWorkoutsDisplay": ["checkNetworkReachability"],
  "PersonalizedRecommendations": ["anomalies", "healthData"]
};

// Specific fixes for each component
const componentFixes: Record<string, (content: string) => string> = {
  "NutritionAnalysisChart": (content: string): string => {
    // Fix recharts Bar property references
    let fixed = content;
    
    // Fix the Bar property on BarChart
    fixed = fixed.replace(
      /(<BarChart\.Bar|<BarChart\.bar|<BarChart.Bar|BarChart\.Bar)/g,
      '<Bar'
    );
    
    // Add missing state variables
    if (!fixed.includes('const [calorieData, setCalorieData]')) {
      const insertPoint = fixed.indexOf('const NutritionAnalysisChart') + 
                         fixed.substring(fixed.indexOf('const NutritionAnalysisChart')).indexOf('{') + 1;
      
      const stateDeclarations = `
  // Define state variables
  const proteinPercentage = 30;
  const carbsPercentage = 45;
  const fatPercentage = 25;
  
  const handleExport = () => {
    console.log('Export feature not implemented yet');
  };
  
  const handleShare = () => {
    console.log('Share feature not implemented yet');
  };`;
      
      fixed = fixed.substring(0, insertPoint) + stateDeclarations + fixed.substring(insertPoint);
    }
    
    // Fix toString method calls on name type
    fixed = fixed.replace(/(name\s*===\s*'string'\s*\?\s*name\s*:\s*String\(name\))/g, 
      'typeof name === "string" ? name : String(name)');
      
    // Convert any nameStr.charAt().toUpperCase() + nameStr.slice() to string handling with type guard
    fixed = fixed.replace(
      /(const nameStr = typeof name === 'string' \? name : String\(name\);)[\s\S]*?(return \[`\$\{value\}g`, nameStr\.charAt\(0\)\.toUpperCase\(\) \+ nameStr\.slice\(1\)\];)/g,
      'return [`${value}g`, typeof name === "string" ? name.charAt(0).toUpperCase() + name.slice(1) : String(name)];'
    );
    
    return fixed;
  },
  
  "OfflineWorkoutsDisplay": (content: string): string => {
    let fixed = content;
    
    // Add missing type definitions for Workout and WorkoutGoal
    if (!fixed.includes('interface Workout')) {
      const typeDefinitions = `
// Define necessary type interfaces
interface WorkoutGoal {
  name: string;
  progress: number;
}

interface Workout {
  id: string;
  title: string;
  date: string;
  duration: string;
  type: string;
  goals: WorkoutGoal[];
}
`;
      fixed = typeDefinitions + fixed;
    }
    
    // Fix connectionQuality references
    fixed = fixed.replace(/connectionQuality/g, 'displayConnectionQuality');
    
    // Fix parameter typing for goals map function
    fixed = fixed.replace(
      /(goal: any, index: number)/g,
      'goal: WorkoutGoal, index: number'
    );
    
    // Ensure we're using isOnline for display purposes
    fixed = fixed.replace(/displayConnectionQuality/g, 'displayConnectionQuality');
    
    // Fix type comparison for ConnectionQuality
    fixed = fixed.replace(
      /(case ['"]poor['"]):/g,
      'case "poor" as ConnectionQuality:'
    ).replace(
      /(case ['"]excellent['"]):/g, 
      'case "excellent" as ConnectionQuality:'
    ).replace(
      /(case ['"]captive-portal['"]):/g,
      'case "captive-portal" as ConnectionQuality:'
    );
    
    // Fix the destructuring to use the correct hook properties
    fixed = fixed.replace(
      /const \{ isOnline(?:, connectionQuality, checkConnection)? \} = useNetworkStatus\(\);/g,
      'const { isOnline } = useNetworkStatus();'
    );
    
    return fixed;
  },
  
  "BodyCompositionChart": (content: string): string => {
    // Fix array calls
    return content.replace(
      /(datasets\(\))/g,
      'datasets'
    );
  },
  
  "GoalTrackingCard": (content: string): string => {
    let fixed = content;
    
    // Add missing progressData declarations
    if (!fixed.includes('const progressData =')) {
      const dataDeclaration = `
  // Define progress data
  const progressData = [
    { date: '2023-05-01', progress: 25 },
    { date: '2023-05-08', progress: 35 },
    { date: '2023-05-15', progress: 45 },
    { date: '2023-05-22', progress: 60 },
    { date: '2023-05-29', progress: 75 },
    { date: '2023-06-05', progress: 90 }
  ];

  const categoryData = [
    { category: 'Strength', progress: 85 },
    { category: 'Endurance', progress: 70 },
    { category: 'Flexibility', progress: 60 },
    { category: 'Balance', progress: 75 }
  ];
  `;
      
      // Find a good insertion point
      const stateVarPos = fixed.indexOf('useState(');
      if (stateVarPos !== -1) {
        const nextSemicolon = fixed.indexOf(';', stateVarPos);
        if (nextSemicolon !== -1) {
          fixed = fixed.substring(0, nextSemicolon + 1) + dataDeclaration + fixed.substring(nextSemicolon + 1);
        }
      }
    }
    
    // Fix array calls
    fixed = fixed.replace(
      /(stages\(\))/g,
      'stages'
    ).replace(
      /(\.map\(progressData,)/g,
      '.map('
    );
    
    return fixed;
  },
  
  "PersonalizedRecommendations": (content: string): string => {
    let fixed = content;
    
    // Fix badge variant
    fixed = fixed.replace(/variant="success"/g, 'variant="outline" className="bg-green-100 text-green-700"');
    
    return fixed;
  },
  
  "HealthDataVisualization": (content: string): string => {
    let fixed = content;
    
    // Fix arithmetic operation on non-number type
    fixed = fixed.replace(
      /(sleepEfficiency \* 100)/g,
      'Number(sleepEfficiency) * 100'
    );
    
    return fixed;
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
    const filteredImports = importNames.filter(name => {
      // Keep imports that are not in the unused list
      return !unusedImports.some(unused => unused === name.trim());
    });
    
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
  
  if (unusedImports.length === 0 && unusedVariables.length === 0) {
    if (!componentFixes[componentName]) {
      return content; // No changes needed
    }
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
    
  // Apply component-specific fixes if available
  if (componentFixes[componentName]) {
    cleanedContent = componentFixes[componentName](cleanedContent);
  }
  
  return cleanedContent;
};

// Export utility functions
export { 
  getUnusedImportInfo,
  getUnusedVariables,
  cleanComponentContent
};
