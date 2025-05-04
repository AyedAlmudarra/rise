-- Migration: Create investor_outreach table
-- Description: Stores records of interactions between startups and investors.

-- Create the table
CREATE TABLE public.investor_outreach (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL PRIMARY KEY,
    startup_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to the startup user
    investor_profile_id uuid NOT NULL REFERENCES public.investors(id) ON DELETE CASCADE, -- Link to the investor profile
    interaction_date date DEFAULT now() NOT NULL,
    interaction_type text CHECK (interaction_type IN ('Email', 'Meeting', 'Call', 'Introduction', 'Other')) NOT NULL,
    status text CHECK (status IN ('Contacted', 'Responded', 'Meeting Scheduled', 'Due Diligence', 'Declined', 'Invested', 'On Hold')) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add comments to the table and columns
COMMENT ON TABLE public.investor_outreach IS 'Tracks outreach activities and status between startups and investors.';
COMMENT ON COLUMN public.investor_outreach.startup_user_id IS 'The user ID of the startup who initiated the outreach.';
COMMENT ON COLUMN public.investor_outreach.investor_profile_id IS 'The profile ID of the investor being contacted.';
COMMENT ON COLUMN public.investor_outreach.interaction_date IS 'Date of the interaction.';
COMMENT ON COLUMN public.investor_outreach.interaction_type IS 'Type of interaction (e.g., Email, Meeting).';
COMMENT ON COLUMN public.investor_outreach.status IS 'Current status of the outreach (e.g., Contacted, Responded).';
COMMENT ON COLUMN public.investor_outreach.notes IS 'Additional notes about the interaction.';

-- Enable Row Level Security
ALTER TABLE public.investor_outreach ENABLE ROW LEVEL SECURITY;

-- Create indexes for frequent lookups
CREATE INDEX idx_investor_outreach_startup_user_id ON public.investor_outreach(startup_user_id);
CREATE INDEX idx_investor_outreach_investor_profile_id ON public.investor_outreach(investor_profile_id);

-- RLS Policy: Startups can manage (select, insert, update, delete) their own outreach records.
CREATE POLICY "Allow startup full access to own outreach records" 
ON public.investor_outreach
FOR ALL
USING (auth.uid() = startup_user_id)
WITH CHECK (auth.uid() = startup_user_id);

-- Trigger to automatically update 'updated_at' timestamp
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON public.investor_outreach
FOR EACH ROW
EXECUTE PROCEDURE extensions.moddatetime (updated_at); 