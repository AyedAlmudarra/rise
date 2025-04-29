import { Suspense, ComponentType } from 'react';
import Spinner from '@/views/spinner/Spinner';

// project imports


// ===========================|| LOADABLE - LAZY LOADING ||=========================== //

// Use generics for better type safety
const Loadable = <P extends object>(Component: ComponentType<P>) => 
  (props: P) => (
    <Suspense fallback={<Spinner />}>
      <Component {...props} />
    </Suspense>
  );

export default Loadable;
