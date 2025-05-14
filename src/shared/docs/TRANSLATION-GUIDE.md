# Translation Guide

This guide explains how to use the translation system in the Athlete Genesis AI application. The application supports multiple languages, with a focus on Ghanaian languages.

## Table of Contents

1. [Supported Languages](#supported-languages)
2. [Translation System Overview](#translation-system-overview)
3. [Using Translations in Components](#using-translations-in-components)
4. [Adding New Translations](#adding-new-translations)
5. [Translation Best Practices](#translation-best-practices)
6. [Working with Ghanaian Languages](#working-with-ghanaian-languages)
7. [Testing Translations](#testing-translations)
8. [Resources](#resources)

## Supported Languages

The application currently supports the following languages:

| Code | Language | Native Name | Region | Population % |
|------|----------|-------------|--------|--------------|
| en   | English  | English     | Official language | 100% |
| tw   | Twi (Akan) | Twi      | Ashanti, Eastern, Central Regions | 44% |
| ee   | Ewe      | Eʋegbe     | Volta Region | 13% |
| ga   | Ga       | Gã         | Greater Accra Region | 8% |
| dag  | Dagbani  | Dagbani    | Northern Region | 4% |
| dga  | Dagaare  | Dagaare    | Upper West Region | 3% |
| ha   | Hausa    | Hausa      | Northern Ghana (trade language) | 5% |

## Translation System Overview

The application uses [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/) for translations. The system consists of:

1. **Translation Files**: JSON files in the `public/locales` directory, organized by language and namespace.
2. **i18n Configuration**: Set up in `src/i18n.ts`.
3. **Translation Hook**: A custom hook in `src/shared/hooks/use-translation.ts` that extends the react-i18next hook.
4. **Language Selector**: A component in `src/shared/components/language/LanguageSelector.tsx` for changing the language.

## Using Translations in Components

### Basic Usage

```tsx
import { useTranslation } from '@/shared/hooks';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('app.description')}</p>
    </div>
  );
}
```

### With Parameters

```tsx
import { useTranslation } from '@/shared/hooks';

function WorkoutCard({ workout }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2>{workout.name}</h2>
      <p>{t('workout.duration', { minutes: workout.duration })}</p>
      <p>{t('workout.difficulty', { context: workout.difficulty })}</p>
    </div>
  );
}
```

### Formatting Dates and Numbers

```tsx
import { useTranslation } from '@/shared/hooks';

function WorkoutSummary({ date, calories }) {
  const { t, formatDate, formatNumber } = useTranslation();
  
  return (
    <div>
      <h2>{t('workout.summary')}</h2>
      <p>{t('workout.completed_on', { date: formatDate(date) })}</p>
      <p>{t('workout.calories_burned', { calories: formatNumber(calories) })}</p>
    </div>
  );
}
```

### Handling Pluralization

```tsx
import { useTranslation } from '@/shared/hooks';

function ExerciseSet({ sets, reps }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <p>{t('workout.sets', { count: sets })}</p>
      <p>{t('workout.reps', { count: reps })}</p>
    </div>
  );
}
```

### Handling RTL Languages

```tsx
import { useTranslation } from '@/shared/hooks';

function Layout({ children }) {
  const { getDirection, isRtl } = useTranslation();
  
  return (
    <div dir={getDirection()} className={isRtl() ? 'rtl-layout' : 'ltr-layout'}>
      {children}
    </div>
  );
}
```

### Using the Language Selector

```tsx
import { LanguageSelector } from '@/shared/components/language';

function Header() {
  return (
    <header>
      <nav>
        {/* ... */}
        <LanguageSelector />
      </nav>
    </header>
  );
}
```

## Adding New Translations

### 1. Add Translation Keys

Add new translation keys to the translation files in `public/locales/{language}/common.json` or other namespaces.

```json
// public/locales/en/common.json
{
  "feature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

### 2. Add Translations for All Supported Languages

Make sure to add translations for all supported languages, especially English and Twi.

```json
// public/locales/tw/common.json
{
  "feature": {
    "title": "Dwumadie Foforɔ",
    "description": "Yei yɛ dwumadie foforɔ"
  }
}
```

### 3. Use the Translations in Components

```tsx
import { useTranslation } from '@/shared/hooks';

function NewFeature() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2>{t('feature.title')}</h2>
      <p>{t('feature.description')}</p>
    </div>
  );
}
```

## Translation Best Practices

1. **Use Namespaces**: Organize translations by feature or section.
2. **Use Nested Keys**: Group related translations under a common prefix.
3. **Use Parameters**: Use parameters for dynamic content instead of string concatenation.
4. **Provide Context**: Add comments or context for translators.
5. **Handle Pluralization**: Use the count parameter for pluralization.
6. **Test with Different Languages**: Test your components with different languages, especially RTL languages.
7. **Keep Translations Simple**: Avoid complex grammar or idioms that might be difficult to translate.
8. **Use Consistent Terminology**: Use the same terms for the same concepts across the application.

## Working with Ghanaian Languages

### Challenges

1. **Limited Digital Resources**: Fewer translation tools and resources exist for Ghanaian languages.
2. **Standardization**: Some Ghanaian languages have multiple dialects and varying standardization levels.
3. **Technical Terminology**: Finding appropriate translations for technical fitness and technology terms.
4. **Font Support**: Ensuring proper font support for characters specific to Ghanaian languages.

### Recommendations

1. **Work with Native Speakers**: Collaborate with native speakers for accurate translations.
2. **Create a Glossary**: Develop a consistent glossary of fitness and technical terms.
3. **Start with Twi**: Begin with Twi (the most widely spoken local language) and English, then expand.
4. **Test with Users**: Test translations with native speakers to ensure they are clear and culturally appropriate.
5. **Consider Cultural Context**: Adapt content to be relevant to Ghanaian culture and lifestyles.

## Testing Translations

### Manual Testing

1. **Change the Language**: Use the LanguageSelector to change the language.
2. **Check All Pages**: Navigate through the application and check that all text is translated.
3. **Test Dynamic Content**: Test dynamic content like dates, numbers, and pluralization.
4. **Test RTL Support**: Test with RTL languages to ensure the layout works correctly.

### Automated Testing

1. **Missing Translations**: Check for missing translations using the i18next tools.
2. **Translation Coverage**: Ensure all components use the translation system.
3. **Accessibility**: Test that translations don't break accessibility features.

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Internationalization (i18n) in React](https://react.dev/learn/i18n)
- [Unicode CLDR](http://cldr.unicode.org/) - Common Locale Data Repository
- [Ghana Languages](https://en.wikipedia.org/wiki/Languages_of_Ghana) - Wikipedia article on languages of Ghana
