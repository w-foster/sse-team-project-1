import { Switch } from '@headlessui/react';

const ThemeSwitch = ({ onThemeChange, darkMode }) => {
  const toggleTheme = () => {
    onThemeChange(!darkMode);
  };

  return (
    <div className="fixed top-0 right-0 m-[2vh]">
      <button
        onClick={toggleTheme}
        className="w-[4vh] h-[4vh] flex items-center justify-center rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-[6vh] h-[6vh] text-gray-300 dark:text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      </button>
    </div>
  );
};

export default ThemeSwitch;
