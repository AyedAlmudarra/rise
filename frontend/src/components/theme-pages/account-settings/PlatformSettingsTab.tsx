import { useContext } from 'react';
import { Label, Radio } from 'flowbite-react';
import OutlineCard from "@/components/shared/OutlineCard";
import { CustomizerContext } from '@/context/CustomizerContext';

const PlatformSettingsTab = () => {
  const { activeMode, setActiveMode } = useContext(CustomizerContext);

  return (
    <OutlineCard className="shadow-none">
      <h5 className="card-title">Platform Settings</h5>
      <p className="card-subtitle -mt-1">
        Adjust the look and feel of the platform.
      </p>

      <fieldset className="flex max-w-md flex-col gap-4 mt-6">
        <legend className="mb-4 font-semibold">Theme Preference</legend>
        <div className="flex items-center gap-2">
          <Radio
            id="theme-light"
            name="theme"
            value="light"
            checked={activeMode === 'light'}
            onChange={() => setActiveMode('light')}
          />
          <Label htmlFor="theme-light">Light Mode</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio
            id="theme-dark"
            name="theme"
            value="dark"
            checked={activeMode === 'dark'}
            onChange={() => setActiveMode('dark')}
          />
          <Label htmlFor="theme-dark">Dark Mode</Label>
        </div>
      </fieldset>

      {/* Add other platform settings here later, e.g., language selection */}
       {/* <fieldset className="flex max-w-md flex-col gap-4 mt-10">
        <legend className="mb-4 font-semibold">Language</legend>
           <p className="text-sm text-gray-500">Language selection coming soon.</p>
       </fieldset> */}

      {/* No save button needed as context updates immediately */}
    </OutlineCard>
  );
};

export default PlatformSettingsTab;