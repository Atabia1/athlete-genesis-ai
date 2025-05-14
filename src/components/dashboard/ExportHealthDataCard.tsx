import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  Share2,
  FileText,
  Mail,
  Printer,
  Users,
  Shield,
  Calendar,
  Clock,
  FileSpreadsheet,
  File,
  FileJson,
  Smartphone
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HealthData } from '@/integrations/health-apps/types';
import { exportHealthData } from '@/utils/health-data-export';

interface ExportHealthDataCardProps {
  /** Health data to export */
  healthData: HealthData;
  /** Optional className for styling */
  className?: string;
}

/**
 * Export Health Data Card Component
 *
 * Provides functionality to export health data in various formats and share
 * with healthcare providers, coaches, or other stakeholders.
 */
const ExportHealthDataCard = ({
  healthData,
  className = ''
}: ExportHealthDataCardProps) => {
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([
    'activity',
    'heartRate',
    'sleep',
    'weight',
    'workouts'
  ]);
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days' | '1year' | 'all'>('30days');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientType, setRecipientType] = useState('healthcare');
  const [includeNotes, setIncludeNotes] = useState(true);
  const [notes, setNotes] = useState('');

  // Handle data type selection
  const handleDataTypeChange = (dataType: string) => {
    setSelectedDataTypes(prev => {
      if (prev.includes(dataType)) {
        return prev.filter(type => type !== dataType);
      } else {
        return [...prev, dataType];
      }
    });
  };

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);

    try {
      // In a real app, this would call an API to generate the export
      await exportHealthData({
        healthData,
        dataTypes: selectedDataTypes,
        dateRange,
        format: exportFormat
      });

      // Simulate export delay
      setTimeout(() => {
        setIsExporting(false);
        alert(`Health data exported successfully in ${exportFormat.toUpperCase()} format!`);
      }, 1500);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      alert('Export failed. Please try again.');
    }
  };

  // Handle share
  const handleShare = async () => {
    // In a real app, this would call an API to share the data
    console.log('Sharing health data with:', recipientEmail);
    console.log('Recipient type:', recipientType);
    console.log('Include notes:', includeNotes);
    console.log('Notes:', notes);

    // Close dialog
    setIsShareDialogOpen(false);

    // Show success message
    alert(`Health data shared successfully with ${recipientEmail}!`);
  };

  // Get date range label
  const getDateRangeLabel = () => {
    switch (dateRange) {
      case '7days':
        return 'Last 7 days';
      case '30days':
        return 'Last 30 days';
      case '90days':
        return 'Last 90 days';
      case '1year':
        return 'Last year';
      case 'all':
        return 'All time';
    }
  };

  // Get export format icon
  const getFormatIcon = () => {
    switch (exportFormat) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'csv':
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'json':
        return <FileJson className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader>
        <div className="flex items-center">
          <Download className="h-5 w-5 mr-2 text-purple-600" />
          <CardTitle>Export & Share Health Data</CardTitle>
        </div>
        <CardDescription>
          Export your health data or share it with healthcare providers and coaches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Data Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Select Data to Export</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activity"
                  checked={selectedDataTypes.includes('activity')}
                  onCheckedChange={() => handleDataTypeChange('activity')}
                />
                <label
                  htmlFor="activity"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Activity & Steps
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="heartRate"
                  checked={selectedDataTypes.includes('heartRate')}
                  onCheckedChange={() => handleDataTypeChange('heartRate')}
                />
                <label
                  htmlFor="heartRate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Heart Rate
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sleep"
                  checked={selectedDataTypes.includes('sleep')}
                  onCheckedChange={() => handleDataTypeChange('sleep')}
                />
                <label
                  htmlFor="sleep"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Sleep
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="weight"
                  checked={selectedDataTypes.includes('weight')}
                  onCheckedChange={() => handleDataTypeChange('weight')}
                />
                <label
                  htmlFor="weight"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Weight & Body Composition
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="workouts"
                  checked={selectedDataTypes.includes('workouts')}
                  onCheckedChange={() => handleDataTypeChange('workouts')}
                />
                <label
                  htmlFor="workouts"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Workouts
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nutrition"
                  checked={selectedDataTypes.includes('nutrition')}
                  onCheckedChange={() => handleDataTypeChange('nutrition')}
                />
                <label
                  htmlFor="nutrition"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nutrition
                </label>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateRange" className="text-sm">Date Range</Label>
              <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                <SelectTrigger id="dateRange" className="mt-1">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="exportFormat" className="text-sm">Export Format</Label>
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger id="exportFormat" className="mt-1">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Export Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date Range:</span>
                </div>
                <span className="text-sm font-medium">{getDateRangeLabel()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Data Types:</span>
                </div>
                <span className="text-sm font-medium">{selectedDataTypes.length} selected</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {getFormatIcon()}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">Format:</span>
                </div>
                <span className="text-sm font-medium">{exportFormat.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <Button
          className="w-full sm:w-auto"
          onClick={handleExport}
          disabled={isExporting || selectedDataTypes.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>

        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              disabled={selectedDataTypes.length === 0}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Share Health Data</DialogTitle>
              <DialogDescription>
                Share your health data with healthcare providers, coaches, or other stakeholders.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="recipient@example.com"
                  className="col-span-3"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Recipient
                </Label>
                <RadioGroup
                  className="col-span-3"
                  value={recipientType}
                  onValueChange={setRecipientType}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="healthcare" id="healthcare" />
                    <Label htmlFor="healthcare" className="font-normal">Healthcare Provider</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coach" id="coach" />
                    <Label htmlFor="coach" className="font-normal">Coach/Trainer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="font-normal">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-right pt-2">
                  <Checkbox
                    id="includeNotes"
                    checked={includeNotes}
                    onCheckedChange={(checked) => setIncludeNotes(!!checked)}
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor="includeNotes" className="font-normal">
                    Include notes with this export
                  </Label>
                  {includeNotes && (
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                      placeholder="Add any notes or context for the recipient..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleShare} disabled={!recipientEmail}>
                Share Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" className="w-full sm:w-auto">
          <Printer className="h-4 w-4 mr-2" />
          Print Report
        </Button>

        <Button variant="outline" className="w-full sm:w-auto">
          <Smartphone className="h-4 w-4 mr-2" />
          Send to App
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExportHealthDataCard;
