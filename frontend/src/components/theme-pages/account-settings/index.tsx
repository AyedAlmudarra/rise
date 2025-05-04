import { Tabs } from "flowbite-react";
import {
  IconBell,
  IconBuilding,
  IconLock,
  IconUserCircle,
} from "@tabler/icons-react";
import CardBox from "src/components/shared/CardBox";
import AccountTab from "./GeneralSettingsTab";
import NotificationTab from "./NotificationTab";
import SecurityTab from "./SecurityTab";
import RoleProfileTab from "./RoleProfileTab";
import { useAuth } from "@/context/AuthContext";


const AccountSettingIndex = () => {
  const { userRole } = useAuth();

  return (
    <>
      <CardBox className="px-0 py-0 ">
        <Tabs aria-label="Tabs with underline" variant="underline">
          <Tabs.Item
            active
            title="Account"
            icon={() => <IconUserCircle size={20} />}
          >
            <div className="p-6">
              <AccountTab />
            </div>
          </Tabs.Item>
          {userRole && (userRole === 'startup' || userRole === 'investor') && (
            <Tabs.Item
              title={userRole === 'startup' ? "Startup Profile" : "Investor Profile"}
              icon={() => <IconBuilding size={20} />}
            >
              <div className="p-6">
                <RoleProfileTab />
              </div>
            </Tabs.Item>
          )}
          <Tabs.Item title="Notification" icon={() => <IconBell size={20} />}>
            <div className="p-6">
              <NotificationTab />
            </div>
          </Tabs.Item>
          <Tabs.Item title="Security" icon={() => <IconLock size={20} />}>
            <div className="p-6">
              <SecurityTab />
            </div>
          </Tabs.Item>
        </Tabs>
      </CardBox>
    </>
  );
};

export default AccountSettingIndex;
