-- Create the notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    new_match_email boolean NOT NULL DEFAULT true,
    new_match_push boolean NOT NULL DEFAULT false,
    message_email boolean NOT NULL DEFAULT true,
    message_push boolean NOT NULL DEFAULT true,
    funding_milestone_email boolean NOT NULL DEFAULT true,
    funding_milestone_push boolean NOT NULL DEFAULT false,
    platform_updates_email boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own preferences" ON public.notification_preferences;
CREATE POLICY "Users can view own preferences"
ON public.notification_preferences
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.notification_preferences;
CREATE POLICY "Users can insert own preferences"
ON public.notification_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON public.notification_preferences;
CREATE POLICY "Users can update own preferences"
ON public.notification_preferences
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Grant access
GRANT SELECT, INSERT, UPDATE ON public.notification_preferences TO authenticated;

-- Index for performance
CREATE INDEX IF NOT EXISTS notification_preferences_user_id_idx ON public.notification_preferences (user_id);

-- Function to create default preferences for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS before_notification_preferences_update ON public.notification_preferences;
CREATE TRIGGER before_notification_preferences_update
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comments
COMMENT ON TABLE public.notification_preferences IS 'Stores user notification preferences';
COMMENT ON COLUMN public.notification_preferences.new_match_email IS 'Receive email for new matches';
COMMENT ON COLUMN public.notification_preferences.new_match_push IS 'Receive push notification for new matches';
-- Add other comments as needed 