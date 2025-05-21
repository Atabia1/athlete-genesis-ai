
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProviders } from './app/providers/AppProviders';
// Removed the ThemeProvider import since we're now using UserPreferencesProvider
import { Toaster } from './components/ui/sonner';

// Render the app with full providers
createRoot(document.getElementById("root")!).render(
  <AppProviders>
    <App />
    <Toaster position="top-right" />
  </AppProviders>
);
