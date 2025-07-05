import React, { useState } from 'react';
import { Menu, X, User, Settings, Calendar, Package, Globe, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';

interface NavigationProps {
  onNavigate?: (section: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const navigationItems = [
    { id: 'packages', label: 'Holiday Packages', icon: Package },
    { id: 'schedule', label: 'Flight Schedule', icon: Calendar },
    { id: 'settings', label: 'Account Settings', icon: Settings },
    { id: 'booking', label: 'Manage Booking', icon: Calendar }
  ];

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'IT', name: 'Italiano' },
    { code: 'PT', name: 'Português' }
  ];

  const userMenuItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'trips', label: 'My Trips', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavigation = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsLanguageMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <Logo size="md" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TravelCraft</h1>
              <p className="text-sm text-gray-600 hidden sm:block">AI-Powered Journey Planning</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors group"
                >
                  <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{selectedLanguage}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLanguageMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[120px]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        selectedLanguage === lang.code ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Register Button */}
            <button
              onClick={() => handleNavigation('register')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Register
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px]">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">Welcome!</p>
                    <p className="text-xs text-gray-500">Sign in to access your account</p>
                  </div>
                  
                  <button
                    onClick={() => handleNavigation('signin')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </button>
                  
                  <button
                    onClick={() => handleNavigation('register')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Create Account
                  </button>
                  
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    {userMenuItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.id)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="space-y-2 pt-4">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className="w-full flex items-center space-x-3 text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <button
                  onClick={() => handleNavigation('register')}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Register
                </button>
                
                <button
                  onClick={() => handleNavigation('signin')}
                  className="w-full text-left px-4 py-3 bg-gray-800 text-white rounded-lg transition-colors font-medium mt-2"
                >
                  Sign In
                </button>
              </div>

              {/* Mobile Language Selector */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Language</p>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedLanguage === lang.code
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {lang.code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close menus */}
      {(isUserMenuOpen || isLanguageMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsLanguageMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};