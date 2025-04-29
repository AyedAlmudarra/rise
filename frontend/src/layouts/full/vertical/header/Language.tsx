import { useState } from 'react';
import { Dropdown } from 'flowbite-react';
import englishFlag from "@/assets/images/flag/icon-flag-en.svg"
import southAfricaFlag from "@/assets/images/flag/icon-flag-sa.svg" // Assuming SA flag for Arabic

// Define language options directly
const languages = [
  {
    flag: englishFlag,
    name: 'English (US)',
    value: 'en',
  },
  {
    flag: southAfricaFlag,
    name: 'العربية', // Arabic
    value: 'ar',
  },
];

export const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]); // Default to English

  const handleLanguageChange = (lang: typeof languages[0]) => {
    setSelectedLanguage(lang);
    // TODO: Implement actual i18n language change logic here
    // e.g., using i18next.changeLanguage(lang.value);
    console.log('Language selected:', lang.value);
  };

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        dismissOnClick={true} // Close dropdown on item click
        renderTrigger={() => (
          <button className="h-10 w-10 hover:bg-lightprimary dark:hover:bg-darkprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary focus:outline-none">
            <img
              src={selectedLanguage.flag}
              alt={selectedLanguage.name}
              className="h-5 w-5 rounded-full object-cover"
            />
          </button>
        )}
        className="min-w-[150px]" // Adjust width if needed
      >
        {languages.map((lang) => (
          <Dropdown.Item
            key={lang.value}
            onClick={() => handleLanguageChange(lang)}
            className={`px-4 py-2 flex items-center gap-3 ${
              selectedLanguage.value === lang.value
                ? 'bg-lightprimary dark:bg-darkprimary text-primary dark:text-white font-semibold'
                : 'hover:bg-lightprimary/50 dark:hover:bg-darkprimary/50'
            }`}
          >
            <img
              src={lang.flag}
              alt={lang.name}
              className="h-5 w-5 rounded-full object-cover flex-shrink-0"
            />
            <span className="text-sm truncate">{lang.name}</span>
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};
