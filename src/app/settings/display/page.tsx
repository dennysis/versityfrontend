'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext'; // You'll need to create this

export default function DisplaySettings() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user preferences from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    
    setFontSize(savedFontSize);
    setReducedMotion(savedReducedMotion);
    setHighContrast(savedHighContrast);
  }, []);

  // Save preferences to localStorage and apply them
  const savePreferences = () => {
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('reducedMotion', String(reducedMotion));
    localStorage.setItem('highContrast', String(highContrast));
    
    // Apply preferences to document
    document.documentElement.setAttribute('data-font-size', fontSize);
    document.documentElement.setAttribute('data-reduced-motion', String(reducedMotion));
    document.documentElement.setAttribute('data-high-contrast', String(highContrast));
    
    setMessage({ type: 'success', text: 'Display preferences saved successfully' });
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Theme</h3>
          <div className="grid grid-cols-3 gap-4">
            <div 
              className={`border rounded-lg p-4 cursor-pointer ${theme === 'light' ? 'ring-2 ring-indigo-500' : ''}`}
              onClick={() => setTheme('light')}
            >
              <div className="h-20 bg-white border border-gray-200 rounded mb-2"></div>
              <div className="text-center">Light</div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer ${theme === 'dark' ? 'ring-2 ring-indigo-500' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <div className="h-20 bg-gray-800 border border-gray-700 rounded mb-2"></div>
              <div className="text-center">Dark</div>
            </div>
            
            <div 
              className={`border rounded-lg p-4 cursor-pointer ${theme === 'system' ? 'ring-2 ring-indigo-500' : ''}`}
              onClick={() => setTheme('system')}
            >
              <div className="h-20 bg-gradient-to-r from-white to-gray-800 border border-gray-300 rounded mb-2"></div>
              <div className="text-center">System</div>
            </div>
          </div>
        </div>
        
        {/* Font Size */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Font Size</h3>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="fontSize"
                value="small"
                checked={fontSize === 'small'}
                onChange={() => setFontSize('small')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm">Small</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="fontSize"
                value="medium"
                checked={fontSize === 'medium'}
                onChange={() => setFontSize('medium')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-base">Medium</span>
                          </label>
            
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="fontSize"
                value="large"
                checked={fontSize === 'large'}
                onChange={() => setFontSize('large')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-lg">Large</span>
            </label>
          </div>
        </div>
        
        {/* Accessibility Options */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Accessibility</h3>
          <div className="space-y-3">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={() => setReducedMotion(!reducedMotion)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2">Reduce motion</span>
            </label>
            
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={() => setHighContrast(!highContrast)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2">High contrast mode</span>
            </label>
          </div>
        </div>
        
        {/* Preview */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Preview</h3>
          <div 
            className={`p-4 border rounded-lg ${
              highContrast ? 'bg-black text-white border-white' : 'bg-white text-gray-800 border-gray-200'
            }`}
          >
            <p className={`${
              fontSize === 'small' ? 'text-sm' : 
              fontSize === 'large' ? 'text-lg' : 'text-base'
            }`}>
              This is how your content will appear with the selected settings.
            </p>
            <div className={`mt-2 ${reducedMotion ? '' : 'transition-transform hover:scale-105'}`}>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Sample Button
              </button>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={savePreferences}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
