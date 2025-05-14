# Ghanaian Languages Support in Athlete Genesis AI

This document provides an overview of the Ghanaian language support implemented in the Athlete Genesis AI application.

## Implemented Features

1. **Language Selection**: Users can select from multiple Ghanaian languages in the application settings.
2. **Translation System**: The application uses i18next for translations, with support for Ghanaian languages.
3. **User Preferences**: User language preferences are saved to their profile and loaded when they log in.
4. **Accessibility Integration**: Language selection is integrated with the accessibility settings panel.
5. **Population Information**: Language selection includes information about the percentage of the Ghanaian population that speaks each language.

## Supported Languages

| Code | Language | Native Name | Region | Population % |
|------|----------|-------------|--------|--------------|
| tw   | Twi (Akan) | Twi      | Ashanti, Eastern, Central Regions | 44% |
| ee   | Ewe      | Eʋegbe     | Volta Region | 13% |
| ga   | Ga       | Gã         | Greater Accra Region | 8% |
| dag  | Dagbani  | Dagbani    | Northern Region | 4% |
| dga  | Dagaare  | Dagaare    | Upper West Region | 3% |
| ha   | Hausa    | Hausa      | Northern Ghana (trade language) | 5% |

## Implementation Details

### Translation Files

Translation files are stored in the `public/locales` directory, organized by language code:

```
public/locales/
├── en/
│   └── common.json
├── tw/
│   └── common.json
├── ee/
│   └── common.json
└── ga/
    └── common.json
```

### Language Configuration

Languages are configured in `src/shared/utils/i18n.ts` with information about each language:

```typescript
export const languages: Record<Language, LanguageInfo> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isRtl: false,
    region: 'Official language',
    populationPercentage: 100
  },
  tw: {
    code: 'tw',
    name: 'Twi',
    nativeName: 'Twi',
    isRtl: false,
    region: 'Ashanti, Eastern, Central Regions',
    populationPercentage: 44
  },
  // ...other languages
};
```

### User Preferences

User language preferences are saved to their profile using the `UserService`:

```typescript
async updatePreferredLanguage(userId: string, language: string): Promise<void> {
  try {
    // Get the user profile
    const profiles = await this.supabase.getData(this.PROFILES_TABLE, {
      filters: { user_id: userId },
    });
    
    if (profiles.length === 0) {
      throw new Error(`Profile for user ${userId} not found`);
    }
    
    // Update the preferred language
    await this.supabase.updateData(
      this.PROFILES_TABLE,
      profiles[0].id,
      {
        preferred_language: language,
        updated_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error(`Error updating preferred language for user ${userId}:`, error);
    throw error;
  }
}
```

### Language Selection Component

The `LanguageSelector` component allows users to select their preferred language:

```tsx
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
  
  // ...component JSX
}
```

## Future Work

1. **Complete Translations**: Add complete translations for all supported Ghanaian languages.
2. **Voice Input/Output**: Add support for voice input and output in Ghanaian languages.
3. **Localized Content**: Create fitness and nutrition content specific to Ghanaian culture and cuisine.
4. **Community Contributions**: Enable community contributions to translations.
5. **Dialect Support**: Add support for different dialects of Ghanaian languages.

## Resources

- [Ghana Languages](https://en.wikipedia.org/wiki/Languages_of_Ghana) - Wikipedia article on languages of Ghana
- [Kasahorow](https://kasahorow.org/) - Resources for African languages
- [Ghana Institute of Languages](https://gil.edu.gh/) - Academic institution for language studies
