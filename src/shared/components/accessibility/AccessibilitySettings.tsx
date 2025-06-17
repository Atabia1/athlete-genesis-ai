
/**
 * Accessibility Settings Component
 * 
 * This component provides a comprehensive set of accessibility settings
 * that users can customize to improve their experience.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { useTranslation } from '@/shared/hooks/use-translation';
import { Eye, Volume2, Keyboard, Monitor, Type, Contrast } from 'lucide-react';
import { LiveRegion } from './LiveRegion';

interface AccessibilitySettingsProps {
  onSave?: () => void;
}

export function AccessibilitySettings({ onSave }: AccessibilitySettingsProps) {
  const {
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    fontSize,
    setFontSize,
    screenReaderOptimized,
    setScreenReaderOptimized,
    keyboardNavigation,
    setKeyboardNavigation,
    announcements,
    setAnnouncements,
  } = useAccessibility();

  const { t } = useTranslation();

  const fontSizeOptions = [
    { value: 'small', label: 'Small (14px)', size: '14px' },
    { value: 'medium', label: 'Medium (16px)', size: '16px' },
    { value: 'large', label: 'Large (18px)', size: '18px' },
    { value: 'extra-large', label: 'Extra Large (20px)', size: '20px' },
  ];

  const handleSave = () => {
    // Save settings to localStorage or user preferences
    const settings = {
      highContrast,
      reducedMotion,
      fontSize,
      screenReaderOptimized,
      keyboardNavigation,
      announcements,
    };
    
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    onSave?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Accessibility Settings</h2>
        <p className="text-gray-600">
          Customize your experience to make the application more accessible and comfortable to use.
        </p>
      </div>

      {/* Visual Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visual Settings
          </CardTitle>
          <CardDescription>
            Adjust visual elements for better visibility and readability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast" className="text-base">
                High Contrast Mode
              </Label>
              <p className="text-sm text-gray-600">
                Increases contrast between text and background for better visibility.
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          <Separator />

          {/* Font Size */}
          <div className="space-y-3">
            <Label className="text-base">Font Size</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span style={{ fontSize: option.size }}>{option.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion" className="text-base">
                Reduced Motion
              </Label>
              <p className="text-sm text-gray-600">
                Minimizes animations and transitions that might cause discomfort.
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Navigation Settings
          </CardTitle>
          <CardDescription>
            Configure keyboard navigation and focus behavior.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="keyboard-navigation" className="text-base">
                Enhanced Keyboard Navigation
              </Label>
              <p className="text-sm text-gray-600">
                Adds visual focus indicators and keyboard shortcuts.
              </p>
            </div>
            <Switch
              id="keyboard-navigation"
              checked={keyboardNavigation}
              onCheckedChange={setKeyboardNavigation}
            />
          </div>
        </CardContent>
      </Card>

      {/* Screen Reader Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Screen Reader Settings
          </CardTitle>
          <CardDescription>
            Optimize the experience for screen reader users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="screen-reader-optimized" className="text-base">
                Screen Reader Optimization
              </Label>
              <p className="text-sm text-gray-600">
                Enhances compatibility with screen reading software.
              </p>
            </div>
            <Switch
              id="screen-reader-optimized"
              checked={screenReaderOptimized}
              onCheckedChange={setScreenReaderOptimized}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="announcements" className="text-base">
                Live Announcements
              </Label>
              <p className="text-sm text-gray-600">
                Announces important changes and updates automatically.
              </p>
            </div>
            <Switch
              id="announcements"
              checked={announcements}
              onCheckedChange={setAnnouncements}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="min-w-[100px]">
          Save Settings
        </Button>
      </div>

      {/* Live Region for announcements */}
      <LiveRegion className="sr-only" />
    </div>
  );
}

export default AccessibilitySettings;
