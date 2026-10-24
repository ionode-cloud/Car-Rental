import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles } from 'lucide-react';

const ThemeSwitcher = ({ compact = false, className = '' }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme Switcher"
      className={`inline-flex items-center p-1 rounded-full bg-[#F3F0FF]/60 dark:bg-white/10 border border-[#EAEAEA] backdrop-blur-sm transition-all duration-300 ${className}`}
      style={{
        backgroundColor: 'var(--primary-light)',
        borderColor: 'var(--primary-border)',
      }}
    >
      {/* Orange Option */}
      <button
        type="button"
        onClick={() => setTheme('orange')}
        aria-pressed={theme === 'orange'}
        title="Switch to Orange Theme"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
          theme === 'orange'
            ? 'bg-[#FF6600] text-white shadow-md shadow-[#FF6600]/30 scale-100'
            : 'text-[#777777] hover:text-[#FF6600] hover:bg-white/60'
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF6600] border border-white/60 shrink-0 inline-block" />
        <span className={compact ? 'hidden sm:inline text-[11px]' : 'text-xs'}>Orange</span>
      </button>

      {/* Purple Option */}
      <button
        type="button"
        onClick={() => setTheme('purple')}
        aria-pressed={theme === 'purple'}
        title="Switch to Purple Theme"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
          theme === 'purple'
            ? 'bg-[#5935E8] text-white shadow-md shadow-[#5935E8]/30 scale-100'
            : 'text-[#777777] hover:text-[#5935E8] hover:bg-white/60'
        }`}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#5935E8] border border-white/60 shrink-0 inline-block" />
        <span className={compact ? 'hidden sm:inline text-[11px]' : 'text-xs'}>Purple</span>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
