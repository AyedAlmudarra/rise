import { useState, useEffect } from "react";
import {
  Button,
  ToggleSwitch,
  Spinner
} from "flowbite-react";
import {
  IconAlertCircle,
  IconMessage2,
  IconReceiptDollar,
  IconSpeakerphone,
  IconUserSearch,
  IconBriefcase,
} from "@tabler/icons-react";
import OutlineCard from "@/components/shared/OutlineCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

// Define the shape of preferences data
interface NotificationPreferences {
  id?: string;
  user_id?: string;
  new_match_email: boolean;
  message_email: boolean;
  funding_milestone_email: boolean;
  platform_updates_email: boolean;
}

const defaultPreferences: Omit<NotificationPreferences, 'id' | 'user_id'> = {
  new_match_email: true,
  message_email: true,
  funding_milestone_email: true,
  platform_updates_email: true,
};

const NotificationTab = () => {
  const { user, userRole } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences as NotificationPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) {
        setLoading(false);
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
          // Apply defaults if no record found
          setPreferences({ ...defaultPreferences, user_id: user.id } as NotificationPreferences);
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
    if (typeof preferences[field] === 'boolean') {
      setPreferences(prev => ({
        ...prev,
        [field]: checked,
      }));
    }
  };

  // Handle saving preferences
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const payloadToSave: Partial<NotificationPreferences> & { user_id: string } = {
        ...preferences,
        user_id: user.id,
      };
      delete payloadToSave.id;

      const { error: saveError } = await supabase
        .from('notification_preferences')
        .upsert(payloadToSave, { onConflict: 'user_id' });

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

  // --- Define Role-Specific Notification Options --- 
  const getNotificationOptions = () => {
    const commonOptions = [
        {
          title: "New Messages",
          subtitle: "Notify me when I receive a new message",
          icon: <IconMessage2 />,
          emailField: 'message_email',
        },
         {
          title: "Platform Updates",
          subtitle: "Receive news and updates about the RISE platform",
          icon: <IconSpeakerphone />,
          emailField: 'platform_updates_email',
        },
    ];

    if (userRole === 'startup') {
        return [
            {
              title: "Investor Matches",
              subtitle: "Notify me about potential investor matches",
              icon: <IconUserSearch />,
              emailField: 'new_match_email',
            },
            {
              title: "Engagement & Funding Updates",
              subtitle: "Investor profile views, interest, or funding process updates",
              icon: <IconBriefcase />,
              emailField: 'funding_milestone_email',
            },
             ...commonOptions,
        ];
    } else if (userRole === 'investor') {
         return [
            {
              title: "Startup Matches",
              subtitle: "Notify me about recommended startups or matches",
              icon: <IconUserSearch />,
              emailField: 'new_match_email',
            },
            {
              title: "Portfolio & Watchlist Updates",
              subtitle: "Updates from startups in your portfolio or watchlist",
              icon: <IconReceiptDollar />,
              emailField: 'funding_milestone_email',
            },
             ...commonOptions,
        ];
    } else {
        return commonOptions;
    }
  }

  const notificationOptions = getNotificationOptions();

  if (loading) {
    return <div className="flex justify-center p-10"><Spinner /></div>;
  }

  if (error && !loading) {
    return <div className="p-4 text-red-600"><IconAlertCircle className="inline mr-2"/> {error}</div>;
  }

  if (!userRole && !loading) {
     return <div className="p-4 text-gray-600">Determining user role...</div>;
  }

  return (
    <>
      <OutlineCard className="shadow-none">
        <h5 className="card-title">Notification Preferences</h5>
        <p className="card-subtitle -mt-1">
          Select the email notifications you would like to receive.
          Service messages (security, legal) cannot be opted out of.
        </p>
        
        <div className="mt-6 space-y-6">
          {notificationOptions.map((item) => (
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
              </div>
            </div>
          ))}
        </div>
      </OutlineCard>
      
      <div className="flex justify-end gap-3 pt-7">
        <Button color={"primary"} onClick={handleSave} isProcessing={saving} disabled={saving || loading}>
          Save Preferences
        </Button>
      </div>
    </>
  );
};

export default NotificationTab;
