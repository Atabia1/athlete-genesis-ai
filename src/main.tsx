
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProviders } from './app/providers/AppProviders';
import { ThemeProvider } from './components/theme-provider';

// Render the app with full providers
createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <AppProviders>
      <App />
    </AppProviders>
  </ThemeProvider>
);
