import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@/css/globals.css'
import App from '@/App.tsx'
import Spinner from '@/views/spinner/Spinner.tsx'
import { CustomizerContextProvider } from '@/context/CustomizerContext.tsx'
import '@/utils/i18n';
import { DashboardContextProvider } from '@/context/DashboardContext/DashboardContext.tsx'
import { AuthProvider } from '@/context/AuthContext';

async function deferRender(){
  // Check environment variable
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') { 
    console.log("Mocking enabled, starting MSW worker...");
    const { worker } = await import("./api/mocks/browser.ts");
    // Start the worker and return its promise
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  } else {
    // If mocks are not enabled, return a resolved promise immediately
    console.log("Mocking disabled.");
    return Promise.resolve(); 
  }
}

deferRender().then(() => {
  createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <DashboardContextProvider>
      <CustomizerContextProvider>
    <Suspense fallback={<Spinner />}>
            <App />
        </Suspense>
        </CustomizerContextProvider>
        </DashboardContextProvider>
      </AuthProvider>
      ,
  )
})

