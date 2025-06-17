
/**
 * Accessibility Settings Button
 *
 * This component provides a button that opens a dialog with accessibility settings.
 * It allows users to toggle high contrast mode, large text, and reduced motion.
 */

import { useState } from 'react';
import { Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import { cn } from '@/lib/utils';

interface AccessibilitySettingsButtonProps {
  className?: string;
}

export function AccessibilitySettingsButton({ className }: AccessibilitySettingsButtonProps) {
  const [open, setOpen] = useState(false);
  const { 
    preferences: { highContrast, reducedMotion, fontSize },
    setHighContrast,
    setReducedMotion,
    setFontSize
  } = useUserPreferences();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("text-gray-600 hover:text-athleteBlue-600", className)}
          aria-label="Accessibility settings"
        >
          <Accessibility className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accessibility Settings</DialogTitle>
          <DialogDescription>
            Customize your experience to make the application more accessible.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <p className="text-sm text-muted-foreground">
                Increases contrast for better visibility
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimizes animations and transitions
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
          <div className="space-y-2">
            <Label>Font Size</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant={fontSize === 'small' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontSize('small')}
                className="flex-1"
              >
                Small
              </Button>
              <Button
                variant={fontSize === 'medium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontSize('medium')}
                className="flex-1"
              >
                Medium
              </Button>
              <Button
                variant={fontSize === 'large' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontSize('large')}
                className="flex-1"
              >
                Large
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AccessibilitySettingsButton;
