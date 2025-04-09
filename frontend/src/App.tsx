import { RouterProvider } from "react-router";

import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from "./routes/Router";
import { Toaster } from "./components/shadcn-ui/Default-Ui/toaster";

function App() {

  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
      <RouterProvider router={router} />
      </Flowbite>
      <Toaster />
    </>
  );
}

export default App;
