import { HealthData } from '@/integrations/health-apps/types';

/**
 * Export options interface
 */
interface ExportOptions {
  /** Health data to export */
  healthData: HealthData;
  /** Data types to include in the export */
  dataTypes: string[];
  /** Date range for the export */
  dateRange: '7days' | '30days' | '90days' | '1year' | 'all';
  /** Export format */
  format: 'pdf' | 'csv' | 'json';
  /** Optional notes to include */
  notes?: string;
}

/**
 * Export health data in the specified format
 * @param options Export options
 * @returns Promise that resolves when the export is complete
 */
export const exportHealthData = async (options: ExportOptions): Promise<void> => {
  const { healthData, dataTypes, dateRange, format, notes } = options;
  
  // Filter data based on selected data types
  const filteredData = filterHealthData(healthData, dataTypes);
  
  // Filter data based on date range
  const dateFilteredData = filterByDateRange(filteredData, dateRange);
  
  // Export data in the specified format
  switch (format) {
    case 'pdf':
      return exportAsPdf(dateFilteredData, notes);
    case 'csv':
      return exportAsCsv(dateFilteredData, notes);
    case 'json':
      return exportAsJson(dateFilteredData, notes);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

/**
 * Filter health data based on selected data types
 * @param healthData Health data to filter
 * @param dataTypes Data types to include
 * @returns Filtered health data
 */
const filterHealthData = (healthData: HealthData, dataTypes: string[]): Partial<HealthData> => {
  const filteredData: Partial<HealthData> = {};
  
  // Include only selected data types
  if (dataTypes.includes('activity')) {
    filteredData.steps = healthData.steps;
    filteredData.distance = healthData.distance;
    filteredData.calories = healthData.calories;
  }
  
  if (dataTypes.includes('heartRate')) {
    filteredData.heartRate = healthData.heartRate;
    filteredData.bloodPressure = healthData.bloodPressure;
  }
  
  if (dataTypes.includes('sleep')) {
    filteredData.sleep = healthData.sleep;
  }
  
  if (dataTypes.includes('weight')) {
    filteredData.weight = healthData.weight;
    filteredData.height = healthData.height;
    filteredData.bodyFat = healthData.bodyFat;
  }
  
  if (dataTypes.includes('workouts')) {
    filteredData.workouts = healthData.workouts;
  }
  
  if (dataTypes.includes('nutrition')) {
    filteredData.nutrition = healthData.nutrition;
  }
  
  return filteredData;
};

/**
 * Filter health data based on date range
 * @param healthData Health data to filter
 * @param dateRange Date range to filter by
 * @returns Filtered health data
 */
const filterByDateRange = (healthData: Partial<HealthData>, dateRange: string): Partial<HealthData> => {
  // If 'all' is selected, return all data
  if (dateRange === 'all') {
    return healthData;
  }
  
  // Calculate cutoff date
  const now = new Date();
  let cutoffDate = new Date();
  
  switch (dateRange) {
    case '7days':
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case '30days':
      cutoffDate.setDate(now.getDate() - 30);
      break;
    case '90days':
      cutoffDate.setDate(now.getDate() - 90);
      break;
    case '1year':
      cutoffDate.setFullYear(now.getFullYear() - 1);
      break;
  }
  
  // Clone the health data
  const filteredData: Partial<HealthData> = { ...healthData };
  
  // Filter workouts by date
  if (filteredData.workouts) {
    filteredData.workouts = filteredData.workouts.filter(workout => {
      const workoutDate = new Date(workout.startDate);
      return workoutDate >= cutoffDate;
    });
  }
  
  // For other data types, we would need to have date information
  // In a real app, each data point would have a timestamp
  // For this demo, we'll just return the filtered workouts and all other data
  
  return filteredData;
};

/**
 * Export health data as PDF
 * @param healthData Health data to export
 * @param notes Optional notes to include
 * @returns Promise that resolves when the export is complete
 */
const exportAsPdf = async (healthData: Partial<HealthData>, notes?: string): Promise<void> => {
  // In a real app, this would use a PDF generation library
  console.log('Exporting as PDF:', healthData);
  
  // For demo purposes, we'll just create a simple blob and download it
  const jsonString = JSON.stringify(healthData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create a link and click it to download the file
  const a = document.createElement('a');
  a.href = url;
  a.download = `health-data-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Clean up
  URL.revokeObjectURL(url);
  
  return Promise.resolve();
};

/**
 * Export health data as CSV
 * @param healthData Health data to export
 * @param notes Optional notes to include
 * @returns Promise that resolves when the export is complete
 */
const exportAsCsv = async (healthData: Partial<HealthData>, notes?: string): Promise<void> => {
  // In a real app, this would convert the data to CSV format
  console.log('Exporting as CSV:', healthData);
  
  // For demo purposes, we'll just create a simple CSV for workouts
  let csv = 'Type,Date,Duration,Calories,Distance\n';
  
  if (healthData.workouts) {
    healthData.workouts.forEach(workout => {
      const date = new Date(workout.startDate).toLocaleDateString();
      const duration = workout.duration;
      const calories = workout.calories;
      const distance = workout.distance ? (workout.distance / 1000).toFixed(2) : 'N/A';
      
      csv += `${workout.type},${date},${duration},${calories},${distance}\n`;
    });
  }
  
  // Create a blob and download it
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  // Create a link and click it to download the file
  const a = document.createElement('a');
  a.href = url;
  a.download = `health-data-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Clean up
  URL.revokeObjectURL(url);
  
  return Promise.resolve();
};

/**
 * Export health data as JSON
 * @param healthData Health data to export
 * @param notes Optional notes to include
 * @returns Promise that resolves when the export is complete
 */
const exportAsJson = async (healthData: Partial<HealthData>, notes?: string): Promise<void> => {
  // Add notes if provided
  const dataToExport = notes ? { ...healthData, notes } : healthData;
  
  // Convert to JSON string
  const jsonString = JSON.stringify(dataToExport, null, 2);
  
  // Create a blob and download it
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create a link and click it to download the file
  const a = document.createElement('a');
  a.href = url;
  a.download = `health-data-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Clean up
  URL.revokeObjectURL(url);
  
  return Promise.resolve();
};

/**
 * Share health data with a recipient
 * @param options Export options
 * @param recipientEmail Recipient email address
 * @param recipientType Type of recipient (healthcare, coach, other)
 * @returns Promise that resolves when the share is complete
 */
export const shareHealthData = async (
  options: ExportOptions,
  recipientEmail: string,
  recipientType: 'healthcare' | 'coach' | 'other'
): Promise<void> => {
  // In a real app, this would call an API to share the data
  console.log('Sharing health data with:', recipientEmail);
  console.log('Recipient type:', recipientType);
  console.log('Export options:', options);
  
  // For demo purposes, we'll just resolve the promise
  return Promise.resolve();
};

/**
 * Generate a health data report
 * @param healthData Health data to include in the report
 * @returns HTML string containing the report
 */
export const generateHealthReport = (healthData: Partial<HealthData>): string => {
  // In a real app, this would generate a formatted HTML report
  // For demo purposes, we'll just return a simple HTML string
  
  let html = `
    <html>
      <head>
        <title>Health Data Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #3b82f6; }
          h2 { color: #4b5563; margin-top: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 10px; }
          th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>Health Data Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
  `;
  
  // Add activity data
  if (healthData.steps || healthData.distance || healthData.calories) {
    html += `
      <h2>Activity</h2>
      <table>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
        ${healthData.steps ? `<tr><td>Steps</td><td>${healthData.steps}</td></tr>` : ''}
        ${healthData.distance ? `<tr><td>Distance</td><td>${(healthData.distance / 1000).toFixed(2)} km</td></tr>` : ''}
        ${healthData.calories ? `<tr><td>Calories</td><td>${healthData.calories}</td></tr>` : ''}
      </table>
    `;
  }
  
  // Add heart rate data
  if (healthData.heartRate) {
    html += `
      <h2>Heart Rate</h2>
      <table>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
        ${healthData.heartRate.resting ? `<tr><td>Resting Heart Rate</td><td>${healthData.heartRate.resting} bpm</td></tr>` : ''}
        ${healthData.heartRate.average ? `<tr><td>Average Heart Rate</td><td>${healthData.heartRate.average} bpm</td></tr>` : ''}
        ${healthData.heartRate.max ? `<tr><td>Maximum Heart Rate</td><td>${healthData.heartRate.max} bpm</td></tr>` : ''}
      </table>
    `;
  }
  
  // Add sleep data
  if (healthData.sleep) {
    html += `
      <h2>Sleep</h2>
      <table>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
        ${healthData.sleep.duration ? `<tr><td>Duration</td><td>${(healthData.sleep.duration / 60).toFixed(1)} hours</td></tr>` : ''}
        ${healthData.sleep.quality ? `<tr><td>Quality</td><td>${healthData.sleep.quality}</td></tr>` : ''}
      </table>
    `;
  }
  
  // Add workouts data
  if (healthData.workouts && healthData.workouts.length > 0) {
    html += `
      <h2>Workouts</h2>
      <table>
        <tr>
          <th>Type</th>
          <th>Date</th>
          <th>Duration</th>
          <th>Calories</th>
          <th>Distance</th>
        </tr>
    `;
    
    healthData.workouts.forEach(workout => {
      const date = new Date(workout.startDate).toLocaleDateString();
      const duration = workout.duration;
      const calories = workout.calories;
      const distance = workout.distance ? (workout.distance / 1000).toFixed(2) + ' km' : 'N/A';
      
      html += `
        <tr>
          <td>${workout.type}</td>
          <td>${date}</td>
          <td>${duration} min</td>
          <td>${calories}</td>
          <td>${distance}</td>
        </tr>
      `;
    });
    
    html += `</table>`;
  }
  
  html += `
      </body>
    </html>
  `;
  
  return html;
};
