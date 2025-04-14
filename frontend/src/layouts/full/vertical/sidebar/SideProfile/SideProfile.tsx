import { Icon } from "@iconify/react";
import { Button, Dropdown, Avatar } from "flowbite-react";
import * as profileData from "../../header/Data";
import SimpleBar from "simplebar-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "src/lib/supabaseClient";
import { StartupProfile, InvestorProfile } from "src/types/database";

const SideProfile = () => {
  const { user, userRole, signOut } = useAuth();
  const [profileName, setProfileName] = useState("User");
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        let name = user.email?.split('@')[0] ?? "User";
        let roleDisplay = userRole ? (userRole.charAt(0).toUpperCase() + userRole.slice(1)) : "User";
        
        if (userRole === 'startup') {
          const { data, error } = await supabase
            .from('startups')
            .select('name')
            .eq('user_id', user.id)
            .single();
          if (data) name = data.name;
        } else if (userRole === 'investor') {
          const { data, error } = await supabase
            .from('investors')
            .select('company_name')
            .eq('user_id', user.id)
            .single();
          if (data) name = data.company_name;
        }
        setProfileName(name);
        setProfileRole(roleDisplay);
      };
      fetchProfile();
    } else {
      setProfileName("Guest");
      setProfileRole(null);
    }
  }, [user, userRole]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/auth1/login');
  };

  return (
    <>
      <div className="relative group/menu mt-auto mb-4">
        <Dropdown
          label=""
          className="w-screen sm:w-[360px] py-6 !shadow-lg rounded-sm"
          dismissOnClick={true}
          renderTrigger={() => (
            <span className="h-10 w-10 mx-auto hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
              <Avatar rounded size="sm" />
            </span>
          )}
        >
          <div className="px-6">
            <h3 className="text-lg font-semibold text-ld">User Profile</h3>
            <div className="flex items-center gap-6 pb-5 border-b dark:border-darkborder mt-5 mb-3">
              <Avatar rounded size="md" />
              <div>
                <h5 className="card-title">{profileName}</h5>
                {profileRole && <span className="card-subtitle text-xs text-gray-500 dark:text-gray-400">{profileRole}</span>}
                {user?.email && 
                  <p className="card-subtitle text-xs text-gray-500 dark:text-gray-400 mb-0 mt-1 flex items-center">
                    <Icon
                      icon="solar:mailbox-line-duotone"
                      className="text-base me-1"
                    />
                    {user.email}
                  </p>
                }
              </div>
            </div>
          </div>
          <SimpleBar className="max-h-[150px]">
            <Dropdown.Item
              as={Link}
              to="/profile/view"
              className="px-6 py-3 flex items-center gap-3 bg-hover group/link w-full"
            >
              <Icon icon="solar:user-circle-line-duotone" height={20} />
              <span>My Profile</span>
            </Dropdown.Item>
            <Dropdown.Item
              as={Link}
              to="/settings/account"
              className="px-6 py-3 flex items-center gap-3 bg-hover group/link w-full"
            >
              <Icon icon="solar:settings-minimalistic-line-duotone" height={20} />
              <span>Settings</span>
            </Dropdown.Item>
          </SimpleBar>

          <div className="pt-6 px-6">
            <Button
              color={"primary"}
              onClick={handleSignOut}
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </Dropdown>
      </div>
    </>
  );
};

export default SideProfile;
