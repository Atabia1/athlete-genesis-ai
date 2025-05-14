
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AccessibilitySettingsButton } from '@/shared/components/accessibility';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useText } from '@/utils/text';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useText();

  return (
    <nav className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-athleteBlue-600">{t('app.title')}</span>
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center p-2 ml-3 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-4 items-center">
          <Link to="/" className="text-gray-600 hover:text-athleteBlue-600">{t('nav.home')}</Link>
          <Link to="/pricing" className="text-gray-600 hover:text-athleteBlue-600">{t('nav.pricing')}</Link>
          <Link to="/features" className="text-gray-600 hover:text-athleteBlue-600">{t('nav.features')}</Link>
          <Link to="/demos" className="text-gray-600 hover:text-athleteBlue-600">Try Premium</Link>
          <Link to="/interactive-demos" className="text-gray-600 hover:text-athleteBlue-600">
            <span className="flex items-center">
              Interactive Demos
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">New</span>
            </span>
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-athleteBlue-600">{t('nav.about')}</Link>
          <ThemeToggle variant="ghost" size="sm" className="text-gray-600 hover:text-athleteBlue-600" />
          <AccessibilitySettingsButton className="text-gray-600 hover:text-athleteBlue-600" />
          <Link to="/login">
            <Button variant="outline" className="border-athleteBlue-600 text-athleteBlue-600 hover:bg-athleteBlue-50">
              Login
            </Button>
          </Link>
          <Link to="/onboarding">
            <Button variant="default" className="bg-athleteBlue-600 hover:bg-athleteBlue-700">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-lg md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">{t('nav.home')}</Link>
              <Link to="/pricing" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">{t('nav.pricing')}</Link>
              <Link to="/features" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">{t('nav.features')}</Link>
              <Link to="/demos" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">Try Premium</Link>
              <Link to="/interactive-demos" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
                <span className="flex items-center">
                  Interactive Demos
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">New</span>
                </span>
              </Link>
              <Link to="/about" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">{t('nav.about')}</Link>
              <div className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">
                <AccessibilitySettingsButton />
                <span className="ml-2">{t('accessibility.settings')}</span>
              </div>
              <div className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded flex items-center">
                <ThemeToggle variant="ghost" size="sm" />
                <span className="ml-2">Theme</span>
              </div>
              <Link to="/login" className="block px-3 py-2 border border-athleteBlue-600 text-athleteBlue-600 rounded mb-2">
                Login
              </Link>
              <Link to="/onboarding" className="block px-3 py-2 bg-athleteBlue-600 text-white rounded">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
