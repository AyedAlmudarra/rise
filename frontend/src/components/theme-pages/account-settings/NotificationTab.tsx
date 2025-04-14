import React, { useState, useEffect } from "react";
import {
  Button,
  Label,
  TextInput,
  ToggleSwitch,
  Tooltip,
  Spinner
} from "flowbite-react";
import {
  IconArticle,
  IconCheckbox,
  IconClock,
  IconDownload,
  IconMail,
  IconPlayerPause,
  IconTruckDelivery,
  IconAlertCircle,
  IconMessage2,
  IconReceiptDollar,
  IconSpeakerphone
} from "@tabler/icons-react";
import OutlineCard from "src/components/shared/OutlineCard";
import { useAuth } from "src/context/AuthContext";
import { supabase } from "src/lib/supabaseClient";
import { toast } from "react-hot-toast";

// Define the shape of preferences data
interface NotificationPreferences {
  id?: string;
  user_id?: string;
  new_match_email: boolean;
  new_match_push: boolean;
  message_email: boolean;
  message_push: boolean;
  funding_milestone_email: boolean;
  funding_milestone_push: boolean;
  platform_updates_email: boolean;
}

const defaultPreferences: NotificationPreferences = {
  new_match_email: true,
  new_match_push: false,
  message_email: true,
  message_push: true,
  funding_milestone_email: true,
  funding_milestone_push: false,
  platform_updates_email: true,
};

const NotificationTab = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) {
        setLoading(false);
        setError("User not found.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // Ignore 'Not Found' error
          throw fetchError;
        }
        if (data) {
          setPreferences(data);
        } else {
          // Prefs might not exist if trigger failed, use defaults
          setPreferences({ ...defaultPreferences, user_id: user.id });
        }
      } catch (err: any) {
        console.error("Error fetching preferences:", err);
        setError("Failed to load notification preferences.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  // Handle toggle switch change
  const handleToggleChange = (field: keyof NotificationPreferences, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [field]: checked,
    }));
  };

  // Handle saving preferences
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const { error: saveError } = await supabase
        .from('notification_preferences')
        .upsert({ ...preferences, user_id: user.id }, { onConflict: 'user_id' }); // Use upsert

      if (saveError) {
        throw saveError;
      }
      toast.success("Notification preferences saved!");
    } catch (err: any) {
      console.error("Error saving preferences:", err);
      toast.error("Failed to save preferences.");
      setError("Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-10"><Spinner /></div>;
  }

  if (error) {
    return <div className="p-4 text-red-600"><IconAlertCircle className="inline mr-2"/> {error}</div>;
  }

  // Define notification options structure
  const notificationOptions = [
    {
      title: "New Matches",
      subtitle: "Notify me about potential startup/investor matches",
      icon: <IconCheckbox />,
      emailField: 'new_match_email',
      pushField: 'new_match_push', // Assuming you might add push later
    },
    {
      title: "New Messages",
      subtitle: "Notify me when I receive a new message",
      icon: <IconMessage2 />,
      emailField: 'message_email',
      pushField: 'message_push',
    },
    {
      title: "Funding Milestones",
      subtitle: "Notify me about funding round updates or milestones",
      icon: <IconReceiptDollar />,
      emailField: 'funding_milestone_email',
      pushField: 'funding_milestone_push',
    },
    {
      title: "Platform Updates",
      subtitle: "Receive news and updates about the RISE platform",
      icon: <IconSpeakerphone />,
      emailField: 'platform_updates_email',
      // No push field for this example
    },
  ];

  return (
    <>
      <OutlineCard className="shadow-none">
        <h5 className="card-title">Notification Preferences</h5>
        <p className="card-subtitle -mt-1">
          Select the notifications you would like to receive. 
          Service messages (security, legal) cannot be opted out of.
        </p>
        
        <div className="mt-6 space-y-6">
          {notificationOptions.map((item, i) => (
            <div className="flex items-center justify-between" key={item.title}>
              <div className="flex gap-3.5 items-center">
                <div className="flex-shrink-0 flex justify-center items-center h-10 w-10 rounded-md bg-muted dark:bg-darkmuted text-dark dark:text-white">
                  {item.icon}
                </div>
                <div>
                  <h6 className="text-sm font-medium">{item.title}</h6>
                  <p className="text-xs text-bodytext">{item.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto pl-4">
                {/* Email Toggle */}
                {item.emailField && (
                  <div className="flex flex-col items-center">
                     <ToggleSwitch
                      checked={!!preferences[item.emailField as keyof NotificationPreferences]}
                      onChange={(checked) => handleToggleChange(item.emailField as keyof NotificationPreferences, checked)}
                      label="Email"
                      className="text-xs"
                    />
                  </div>
                )}
                 {/* Push Toggle (Placeholder/Future) */}
                 {item.pushField && (
                  <div className="flex flex-col items-center">
                     <ToggleSwitch
                      checked={!!preferences[item.pushField as keyof NotificationPreferences]}
                      onChange={(checked) => handleToggleChange(item.pushField as keyof NotificationPreferences, checked)}
                      label="Push" // Consider changing label if only using email for now
                      disabled // Disable if push not implemented
                      className="text-xs opacity-50"
                    />
                  </div>
                )} 
              </div>
            </div>
          ))}
        </div>
      </OutlineCard>
      
      {/* Removed Date/Time and Ignore Tracking sections as they might not be relevant */}

      <div className="flex justify-end gap-3 pt-7">
        <Button color={"primary"} onClick={handleSave} isProcessing={saving} disabled={saving}>
          Save Preferences
        </Button>
        {/* <Button color={"lighterror"}>Cancel</Button> // Optional cancel */}
      </div>
    </>
  );
};

export default NotificationTab;
