import { useEffect, useState } from 'react';
import { themeChange } from 'theme-change';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'cupcake');

  useEffect(() => {
    themeChange(false);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = theme === 'cupcake' ? 'dark' : 'cupcake';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <button
      className="flex items-center tooltip tooltip-bottom btn btn-ghost"
      data-tip={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={handleThemeToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;
