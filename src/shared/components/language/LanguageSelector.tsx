
/**
 * Language Selector Component
 * 
 * This component provides a dropdown selector for changing the application language.
 * It supports multiple languages and persists the selection in localStorage.
 */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useLanguagePreference } from '@/shared/hooks/use-language-preference';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'tw', name: 'Twi', nativeName: 'Twi' },
  { code: 'ga', name: 'Ga', nativeName: 'Ga' },
  { code: 'ewe', name: 'Ewe', nativeName: 'Eʋegbe' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguagePreference();

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[180px]">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue>
            {currentLanguage?.nativeName || 'Select Language'}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex flex-col items-start">
              <span>{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
