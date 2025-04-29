import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';

const ObsoleteTwoStepsRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main login page as 2FA is not implemented
    navigate('/auth/auth1/login', { replace: true });
  }, [navigate]);

  // Show a brief loading/redirecting message
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 dark:bg-darkgray">
      <div className="text-center">
        <Spinner size="xl" color="purple" className="mb-4" />
        <p className="text-gray-600 dark:text-gray-300">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default ObsoleteTwoStepsRedirect;
