import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Button, Dropdown, Avatar, Spinner } from 'flowbite-react';
import SimpleBar from 'simplebar-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'src/context/AuthContext';
import { supabase } from 'src/lib/supabaseClient';
import { StartupProfile, InvestorProfile } from 'src/types/database';
import userImg from '/src/assets/images/profile/user-1.jpg';

const Profile = () => {
  const { user, userRole, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profileName, setProfileName] = useState('User');
  const [profileRoleDisplay, setProfileRoleDisplay] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      const metaName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      const roleDisplay = userRole ? (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : null;
      setProfileName(metaName);
      setProfileRoleDisplay(roleDisplay);

      const fetchRoleSpecificName = async () => {
        setProfileLoading(true);
        let nameToDisplay = metaName;
        if (userRole === 'startup') {
          const { data } = await supabase.from('startups').select('name').eq('user_id', user.id).single();
          if (data?.name) nameToDisplay = data.name;
        } else if (userRole === 'investor') {
          const { data } = await supabase.from('investors').select('company_name').eq('user_id', user.id).single();
          if (data?.company_name) nameToDisplay = data.company_name;
        }
        setProfileName(nameToDisplay);
        setProfileLoading(false);
      };
      fetchRoleSpecificName();
    } else {
      setProfileName('Guest');
      setProfileRoleDisplay(null);
    }
  }, [user, userRole, authLoading]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/auth1/login');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="h-10 w-10 flex justify-center items-center">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="w-screen sm:w-[300px] py-4 rounded-sm shadow-lg"
        dismissOnClick={true}
        renderTrigger={() => (
          <button className="h-10 w-10 hover:opacity-80 rounded-full flex justify-center items-center cursor-pointer group-hover/menu:ring-2 group-hover/menu:ring-lightprimary dark:group-hover/menu:ring-darkprimary focus:outline-none">
            <Avatar
              img={user?.user_metadata?.avatar_url || userImg}
              alt={profileName}
              rounded
              size="sm"
            />
          </button>
        )}
      >
        <div className="px-5 pb-3 border-b dark:border-gray-700">
          <h3 className="text-base font-semibold text-ld dark:text-white">User Profile</h3>
        </div>

        <div className="flex items-center gap-4 px-5 py-3">
          <Avatar
            img={user?.user_metadata?.avatar_url || userImg}
            alt={profileName}
            rounded
            size="md"
          />
          <div className="min-w-0 flex-1">
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {profileName}
            </h5>
            {profileRoleDisplay && (
              <span className="text-xs text-gray-500 dark:text-gray-400 block">
                {profileRoleDisplay}
              </span>
            )}
            {user?.email && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5 flex items-center">
                <Icon icon="solar:mailbox-line-duotone" className="text-sm me-1 flex-shrink-0" />
                {user.email}
              </p>
            )}
          </div>
        </div>

        <SimpleBar className="max-h-[150px]">
          <Dropdown.Item
            as={Link}
            to="/profile/view"
            className="px-5 py-2.5 flex items-center gap-3 hover:bg-lightprimary/50 dark:hover:bg-darkprimary/50 w-full text-sm"
          >
            <Icon icon="solar:user-circle-line-duotone" height={18} />
            <span>My Profile</span>
          </Dropdown.Item>
          <Dropdown.Item
            as={Link}
            to="/settings/account"
            className="px-5 py-2.5 flex items-center gap-3 hover:bg-lightprimary/50 dark:hover:bg-darkprimary/50 w-full text-sm"
          >
            <Icon icon="solar:settings-minimalistic-line-duotone" height={18} />
            <span>Settings</span>
          </Dropdown.Item>
          {userRole === 'startup' && (
            <Dropdown.Item
              as={Link}
              to="/profile/documents"
              className="px-5 py-2.5 flex items-center gap-3 hover:bg-lightprimary/50 dark:hover:bg-darkprimary/50 w-full text-sm"
            >
              <Icon icon="solar:folder-with-files-line-duotone" height={18} />
              <span>Manage Documents</span>
            </Dropdown.Item>
          )}
        </SimpleBar>

        <div className="pt-3 mt-2 px-5 border-t dark:border-gray-700">
          <Button
            color={'primary'}
            onClick={handleSignOut}
            className="w-full text-sm"
            size="sm"
          >
            Logout
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

export default Profile;
