/**
 * LanguageSelector Component
 *
 * This component provides a dropdown menu for selecting the application language.
 * It displays languages with their native names and flags, and handles language switching.
 * It also supports dialects for Ghanaian languages.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { languages, Language } from '@/shared/utils/i18n';
import { useLanguagePreferenceContext } from '@/shared/context/LanguagePreferenceContext';

export interface LanguageSelectorProps {
  /** Whether to show the language name */
  showName?: boolean;
  /** Whether to show the language region */
  showRegion?: boolean;
  /** The size of the button */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** The variant of the button */
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  /** Additional CSS classes */
  className?: string;
}

/**
 * A component for selecting the application language
 */
export function LanguageSelector({
  showName = true,
  showRegion = false,
  size = 'default',
  variant = 'outline',
  className = '',
}: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const { updateLanguagePreference } = useLanguagePreferenceContext();
  const currentLanguage = i18n.language as Language;

  // Get the current language info
  const currentLanguageInfo = languages[currentLanguage] || languages.en;

  // Handle language change
  const handleLanguageChange = (language: Language) => {
    // Update language preference using our custom hook
    updateLanguagePreference(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          aria-label="Select language"
        >
          <Globe className="h-4 w-4 mr-2" />
          {showName && (
            <span>{currentLanguageInfo.nativeName}</span>
          )}
          {showRegion && currentLanguageInfo.region && (
            <span className="ml-1 text-xs text-muted-foreground">
              ({currentLanguageInfo.region})
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(languages).map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-2 ${
              currentLanguage === lang.code ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <span className="font-medium">{lang.nativeName}</span>
            <span className="text-xs text-muted-foreground">
              {lang.name !== lang.nativeName && `(${lang.name})`}
            </span>
            {lang.region && (
              <span className="text-xs text-muted-foreground ml-1">
                - {lang.region}
              </span>
            )}
            {lang.populationPercentage && (
              <span className="ml-auto text-xs text-muted-foreground">
                {lang.populationPercentage}%
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Example usage:
 *
 * ```tsx
 * // Basic usage
 * <LanguageSelector />
 *
 * // With region
 * <LanguageSelector showRegion />
 *
 * // Icon only
 * <LanguageSelector showName={false} size="icon" />
 * ```
 */
