import  { createContext, useState, ReactNode, useEffect } from 'react';
import config from './config'

// Define the shape of the context state
interface CustomizerContextState {
  selectedIconId: string | null;
  setSelectedIconId: (id: string | null) => void;
  activeDir: string;
  setActiveDir: (dir: string) => void;
  activeMode: string;
  setActiveMode: (mode: string) => void;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
  activeLayout: string;
  setActiveLayout: (layout: string) => void;
  isCardShadow: boolean;
  setIsCardShadow: (shadow: boolean) => void;
  isLayout: string;
  setIsLayout: (layout: string) => void;
  isBorderRadius: number;
  setIsBorderRadius: (radius: number) => void;
  isCollapse: string;
  setIsCollapse: (collapse: string) => void;
}

// Create the context with a proper default value matching the interface
export const CustomizerContext = createContext<CustomizerContextState>({
    selectedIconId: null,
    setSelectedIconId: () => {},
    activeDir: config.activeDir,
    setActiveDir: () => {},
    activeMode: config.activeMode,
    setActiveMode: () => {},
    activeTheme: config.activeTheme,
    setActiveTheme: () => {},
    activeLayout: config.activeLayout,
    setActiveLayout: () => {},
    isCardShadow: config.isCardShadow,
    setIsCardShadow: () => {},
    isLayout: config.isLayout,
    setIsLayout: () => {},
    isBorderRadius: config.isBorderRadius,
    setIsBorderRadius: () => {},
    isCollapse: config.isCollapse,
    setIsCollapse: () => {},
});

// Define the type for the children prop
interface CustomizerContextProps {
  children: ReactNode;
}
// Create the provider component
export const CustomizerContextProvider = ({ children }: CustomizerContextProps) => {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [activeDir, setActiveDir] = useState<string>(config.activeDir);
  const [activeMode, setActiveMode] = useState<string>(config.activeMode);
  const [activeTheme, setActiveTheme] = useState<string>(config.activeTheme);
  const [activeLayout, setActiveLayout] = useState<string>(config.activeLayout);
  const [isCardShadow, setIsCardShadow] = useState<boolean>(config.isCardShadow);
  const [isLayout, setIsLayout] = useState<string>(config.isLayout);
  const [isBorderRadius, setIsBorderRadius] = useState<number>(config.isBorderRadius);
  const [isCollapse, setIsCollapse] = useState<string>(config.isCollapse);


  // Set attributes immediately
  useEffect(() => {
    document.documentElement.setAttribute("class", activeMode);
    document.documentElement.setAttribute("dir", activeDir);
    document.documentElement.setAttribute('data-color-theme', activeTheme);
    document.documentElement.setAttribute("data-layout", activeLayout);
    document.documentElement.setAttribute("data-boxed-layout", isLayout);
    document.documentElement.setAttribute("data-sidebar-type", isCollapse);

  }, [activeMode, activeDir, activeTheme, activeLayout, isLayout, isCollapse]);

  return (
    <CustomizerContext.Provider
      value={{
        selectedIconId,
        setSelectedIconId,
        activeDir,
        setActiveDir,
        activeMode,
        setActiveMode,
        activeTheme,
        setActiveTheme,
        activeLayout,
        setActiveLayout,
        isCardShadow,
        setIsCardShadow,
        isLayout,
        setIsLayout,
        isBorderRadius,
        setIsBorderRadius,
        isCollapse,
        setIsCollapse,
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
};


