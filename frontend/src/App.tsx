import { RouterProvider } from "react-router-dom";

import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from "./routes/Router";
import { Toaster as ShadcnToaster } from "./components/shadcn-ui/Default-Ui/toaster";
import { Toaster as HotToaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
        <RouterProvider router={router} />
      </Flowbite>
      <ShadcnToaster />
      <HotToaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            style: {
              background: 'linear-gradient(to right, #10b981, #059669)',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(to right, #ef4444, #dc2626)',
            },
          },
        }}
      />
    </>
  );
}

export default App;
