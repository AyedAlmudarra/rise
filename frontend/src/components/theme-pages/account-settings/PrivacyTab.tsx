import { useState, useEffect } from 'react';
import { Button, Label, Radio, Spinner } from 'flowbite-react';
import OutlineCard from "@/components/shared/OutlineCard";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { IconAlertCircle } from '@tabler/icons-react';

type ProfileVisibility = 'public' | 'private';

const PrivacyTab = () => {
  const { user } = useAuth();
  const [visibility, setVisibility] = useState<ProfileVisibility>('public'); // Default to public
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch visibility setting on mount
  useEffect(() => {
    if (user) {
      setLoading(true);
      setError(null);
      try {
        const currentVisibility = user.user_metadata?.profile_visibility;
        if (currentVisibility === 'public' || currentVisibility === 'private') {
          setVisibility(currentVisibility);
        } else {
          setVisibility('public'); // Default if not set or invalid
        }
      } catch (err: any) {
         console.error("Error reading profile visibility:", err);
         setError("Failed to load privacy settings."); // Generic error for user
      } finally {
        setLoading(false);
      }
    }
     else {
       setLoading(false);
       setError("User not found.");
     }
  }, [user]);

  // Handle saving visibility setting
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const { error: saveError } = await supabase.auth.updateUser({
        data: { profile_visibility: visibility },
      });

      if (saveError) {
        throw saveError;
      }
      toast.success("Privacy settings saved!");
    } catch (err: any) {
      console.error("Error saving privacy settings:", err);
      toast.error("Failed to save privacy settings.");
      setError("Failed to save privacy settings.");
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

  return (
    <OutlineCard className="shadow-none">
      <h5 className="card-title">Privacy Settings</h5>
      <p className="card-subtitle -mt-1">
        Control how your profile information is displayed to others.
      </p>

      <fieldset className="flex max-w-md flex-col gap-4 mt-6">
        <legend className="mb-4 font-semibold">Profile Visibility</legend>
        <div className="flex items-center gap-2">
          <Radio
            id="visibility-public"
            name="visibility"
            value="public"
            checked={visibility === 'public'}
            onChange={() => setVisibility('public')}
          />
          <Label htmlFor="visibility-public">
            Public: Your profile can be viewed by anyone on the platform.
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio
            id="visibility-private"
            name="visibility"
            value="private"
            checked={visibility === 'private'}
            onChange={() => setVisibility('private')}
          />
          <Label htmlFor="visibility-private">
            Private: Your profile is only visible to approved connections (feature coming soon).
          </Label>
        </div>
      </fieldset>

      <div className="flex justify-end gap-3 pt-7 mt-4">
        <Button color={"primary"} onClick={handleSave} isProcessing={saving} disabled={saving || loading}>
          Save Privacy Settings
        </Button>
      </div>
    </OutlineCard>
  );
};

export default PrivacyTab;
