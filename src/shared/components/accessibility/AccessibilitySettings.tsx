/**
 * AccessibilitySettings Component
 *
 * This component provides a panel for users to adjust accessibility settings.
 * It includes options for:
 * - High contrast mode
 * - Font size adjustments
 * - Motion preferences
 *
 * The panel can be opened from a button in the application header or footer.
 */

import React, { useState } from 'react';
import { useAccessibility } from '@/shared/context/AccessibilityContext';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';
import { Slider } from '@/shared/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/shared/components/ui/dialog';
import {
  Accessibility,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '@/shared/hooks';
import { LanguageSelector } from '@/shared/components/language';

export interface AccessibilitySettingsProps {
  /** Whether the settings panel is open */
  open?: boolean;
  /** Callback when the panel is opened or closed */
  onOpenChange?: (open: boolean) => void;
  /** Additional CSS classes */
  className?: string;
}

export function AccessibilitySettings({
  open,
  onOpenChange,
  className,
}: AccessibilitySettingsProps) {
  // Get accessibility settings from context
  const {
    highContrast,
    toggleHighContrast,
    prefersReducedMotion,
    fontSizeAdjustment,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    announce
  } = useAccessibility();

  // Get translation utilities
  const { t, i18n, getDirection } = useTranslation();

  // Convert font size adjustment to percentage for display
  const fontSizePercentage = Math.round(fontSizeAdjustment * 100);

  // Handle high contrast toggle
  const handleHighContrastToggle = () => {
    toggleHighContrast();
    announce(
      t(!highContrast ? 'accessibility.highContrastEnabled' : 'accessibility.highContrastDisabled'),
      { politeness: 'polite' }
    );
  };

  // Handle font size increase
  const handleIncreaseFontSize = () => {
    increaseFontSize();
    announce(
      t('accessibility.fontSizeIncreased', { size: Math.round((fontSizeAdjustment + 0.1) * 100) }),
      { politeness: 'polite' }
    );
  };

  // Handle font size decrease
  const handleDecreaseFontSize = () => {
    decreaseFontSize();
    announce(
      t('accessibility.fontSizeDecreased', { size: Math.round((fontSizeAdjustment - 0.1) * 100) }),
      { politeness: 'polite' }
    );
  };

  // Handle font size reset
  const handleResetFontSize = () => {
    resetFontSize();
    announce(
      t('accessibility.fontSizeReset'),
      { politeness: 'polite' }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir={getDirection()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            {t('accessibility.settings')}
          </DialogTitle>
          <DialogDescription>
            {t('accessibility.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Language Selection */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">
              {t('accessibility.language')}
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <LanguageSelector showRegion className="col-span-2" />
            </div>
          </div>

          {/* High Contrast Mode */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">
              {t('accessibility.display')}
            </h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">
                  {t('accessibility.highContrast')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('accessibility.highContrastDescription')}
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={handleHighContrastToggle}
              />
            </div>
          </div>

          {/* Font Size */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">
              {t('accessibility.fontSize')}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>
                  {t('accessibility.fontSizeLabel', { size: fontSizePercentage })}
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDecreaseFontSize}
                    disabled={fontSizeAdjustment <= 0.8}
                    aria-label={t('accessibility.decreaseFontSize')}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleResetFontSize}
                    disabled={fontSizeAdjustment === 1}
                    aria-label={t('accessibility.resetFontSize')}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleIncreaseFontSize}
                    disabled={fontSizeAdjustment >= 1.5}
                    aria-label={t('accessibility.increaseFontSize')}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Slider
                value={[fontSizePercentage]}
                min={80}
                max={150}
                step={10}
                onValueChange={(value) => {
                  const newAdjustment = value[0] / 100;
                  if (newAdjustment !== fontSizeAdjustment) {
                    if (newAdjustment > fontSizeAdjustment) {
                      increaseFontSize();
                    } else {
                      decreaseFontSize();
                    }
                    announce(
                      t('accessibility.fontSizeSet', { size: value[0] }),
                      { politeness: 'polite' }
                    );
                  }
                }}
                aria-label={t('accessibility.adjustFontSize')}
              />
            </div>
          </div>

          {/* Motion */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">
              {t('accessibility.motion')}
            </h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>
                  {t('accessibility.reducedMotion')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {prefersReducedMotion
                    ? t('accessibility.reducedMotionEnabled')
                    : t('accessibility.reducedMotionDisabled')}
                </p>
              </div>
              <Switch
                checked={prefersReducedMotion}
                disabled
                aria-label={t('accessibility.reducedMotionSystemSetting')}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('accessibility.reducedMotionDescription')}
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">
              {t('accessibility.close')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * AccessibilitySettingsDialogButton Component
 *
 * This component provides a button to open the accessibility settings panel.
 */
export function AccessibilitySettingsDialogButton({
  className,
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className={className}
        aria-label="Accessibility settings"
      >
        <Accessibility className="h-5 w-5" />
      </Button>
      <AccessibilitySettings
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

/**
 * Example usage:
 *
 * function Header() {
 *   return (
 *     <header className="flex items-center justify-between p-4">
 *       <Logo />
 *       <nav>...</nav>
 *       <AccessibilitySettingsButton />
 *     </header>
 *   );
 * }
 */
