import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from 'src/context/AuthContext';
import { Card, Avatar, Spinner, Alert, Button, Label, TextInput, FileInput, Textarea, Checkbox, Select } from 'flowbite-react';
import { IconAlertCircle, IconUserCircle, IconDeviceFloppy, IconInfoCircle } from '@tabler/icons-react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import OutlineCard from 'src/components/shared/OutlineCard';
import { toast } from 'react-hot-toast';
import { supabase } from 'src/lib/supabaseClient';
import userImg from "/src/assets/images/profile/user-1.jpg"; // Default fallback avatar
import { StartupProfile, InvestorProfile } from 'src/types/database'; // Import types

// Assuming these constants exist and are imported or defined here
// Example:
const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Education", "E-commerce", "Entertainment"];
const GEOGRAPHIES = ["MENA", "Europe", "North America", "Asia", "Global"];
const STAGES = ["Idea", "Pre-Seed", "Seed", "Series A", "Series B+", "Growth"];
const OPERATIONAL_STAGES = ["Concept Only", "Development", "Early Revenue", "Scaling", "Established"];

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    to: '/profile/view', // Link back to view profile
    title: 'My Profile',
  },
   {
    title: 'Edit Profile',
  },
];

const EditProfilePage: React.FC = () => {
  const { user, loading: authLoading, userRole } = useAuth();

  // State for auth/metadata fields
  const [email, setEmail] = useState(''); // Email is not editable
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // State for role-specific fields (initialized with defaults)
  const [roleProfileData, setRoleProfileData] = useState<Partial<StartupProfile & InvestorProfile>>({}); // Use partial combined type

  // --- Specific field states derived from roleProfileData for controlled inputs ---
  // Startup
  const [startupName, setStartupName] = useState('');
  const [industry, setIndustry] = useState('');
  const [sector, setSector] = useState('');
  const [operationalStage, setOperationalStage] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [numEmployees, setNumEmployees] = useState<number | ''>('');
  const [annualRevenue, setAnnualRevenue] = useState<number | ''>('');
  const [annualExpenses, setAnnualExpenses] = useState<number | ''>('');
  const [kpiClv, setKpiClv] = useState<number | ''>('');
  const [kpiCac, setKpiCac] = useState<number | ''>('');
  const [kpiRetentionRate, setKpiRetentionRate] = useState<number | ''>('');
  const [kpiConversionRate, setKpiConversionRate] = useState<number | ''>('');
  const [pitchDeckUrl, setPitchDeckUrl] = useState('');
  // Investor
  const [investorCompanyName, setInvestorCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>([]);
  const [preferredGeography, setPreferredGeography] = useState<string[]>([]);
  const [preferredStage, setPreferredStage] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');

  // State for UI feedback
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [roleDataError, setRoleDataError] = useState<string | null>(null);

  // Fetch initial data (Auth + Role)
   useEffect(() => {
    const fetchData = async () => {
        if (authLoading) return;
        if (!user) { 
            setInitialLoading(false); 
            return;
        }
        
        setInitialLoading(true);
        setRoleDataError(null);

        // Set Auth data first
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setFullName(user.user_metadata?.full_name || '');
        setProfileBio(user.user_metadata?.profile_bio || '');
        setAvatarUrl(user.user_metadata?.avatar_url || null);

        // Fetch Role data
        if (!userRole || (userRole !== 'startup' && userRole !== 'investor')) { 
            setInitialLoading(false);
            return; // No valid role data to fetch
        }
        
        const tableName = userRole === 'startup' ? 'startups' : 'investors';
        try {
            const { data, error, status } = await supabase
                .from(tableName)
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && status !== 406) throw error;

            const fetchedData = data || {}; // Use empty object if no record exists yet
            setRoleProfileData(fetchedData);

            // --- Update specific field states based on fetched role data --- 
            if (userRole === 'startup') {
                setStartupName(fetchedData.name || '');
                setIndustry(fetchedData.industry || '');
                setSector(fetchedData.sector || '');
                setOperationalStage(fetchedData.operational_stage || '');
                setLocationCity(fetchedData.location_city || '');
                setNumEmployees(fetchedData.num_employees ?? '');
                setAnnualRevenue(fetchedData.annual_revenue ?? '');
                setAnnualExpenses(fetchedData.annual_expenses ?? '');
                setKpiClv(fetchedData.kpi_clv ?? '');
                setKpiCac(fetchedData.kpi_cac ?? '');
                setKpiRetentionRate(fetchedData.kpi_retention_rate ?? '');
                setKpiConversionRate(fetchedData.kpi_conversion_rate ?? '');
                setPitchDeckUrl(fetchedData.pitch_deck_url || '');
            } else if (userRole === 'investor') {
                setInvestorCompanyName(fetchedData.company_name || '');
                setJobTitle(fetchedData.job_title || '');
                setPreferredIndustries(fetchedData.preferred_industries || []);
                setPreferredGeography(fetchedData.preferred_geography || []);
                setPreferredStage(fetchedData.preferred_stage || '');
                setWebsite(fetchedData.website || '');
                setLinkedinProfile(fetchedData.linkedin_profile || '');
            }

        } catch (err: any) {
            console.error(`Error fetching ${tableName} data:`, err);
            setRoleDataError(`Failed to load profile details. Some fields may be unavailable.`);
            // Don't clear fields, allow user to potentially create profile
        } finally {
            setInitialLoading(false);
        }
    };

    fetchData();
  }, [user, authLoading, userRole]);

  // Handler for saving ALL details (Auth + Role)
  const handleUpdateDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !userRole || (userRole !== 'startup' && userRole !== 'investor')) return;
    setDetailsLoading(true);
    setRoleDataError(null); // Clear previous errors

    let roleDataUpdateError = null;
    let authDataUpdateError = null;

    // --- 1. Prepare and Upsert Role-Specific Data --- 
    const tableName = userRole === 'startup' ? 'startups' : 'investors';
    let profilePayload: any = { user_id: user.id, id: roleProfileData?.id }; // Include ID for upsert 

    if (userRole === 'startup') {
         profilePayload = {
            ...profilePayload,
            name: startupName,
            industry: industry,
            sector: sector,
            operational_stage: operationalStage,
            location_city: locationCity,
            num_employees: numEmployees === '' ? null : Number(numEmployees),
            annual_revenue: annualRevenue === '' ? null : Number(annualRevenue),
            annual_expenses: annualExpenses === '' ? null : Number(annualExpenses),
            kpi_clv: kpiClv === '' ? null : Number(kpiClv),
            kpi_cac: kpiCac === '' ? null : Number(kpiCac),
            kpi_retention_rate: kpiRetentionRate === '' ? null : Number(kpiRetentionRate),
            kpi_conversion_rate: kpiConversionRate === '' ? null : Number(kpiConversionRate),
            pitch_deck_url: pitchDeckUrl,
        };
    } else if (userRole === 'investor') {
        profilePayload = {
             ...profilePayload,
            company_name: investorCompanyName,
            job_title: jobTitle,
            preferred_industries: preferredIndustries,
            preferred_geography: preferredGeography,
            preferred_stage: preferredStage,
            website: website,
            linkedin_profile: linkedinProfile,
        };
    }
    
    try {
         // Use upsert to handle both creation and update
         const { error } = await supabase
            .from(tableName)
            .upsert(profilePayload, { onConflict: 'user_id' })
            .select() // Select to potentially get back the updated/inserted row with ID
            .single(); 
        if (error) throw error;
        // Optionally update local roleProfileData state if needed, esp. with new ID on first save
         
    } catch (err: any) {
        console.error(`Error upserting ${tableName} data:`, err);
        roleDataUpdateError = `Failed to save ${userRole} profile details: ${err.message}`;
    }

    // --- 2. Update Auth User Data (Phone + Metadata) --- 
    try {
        const { error } = await supabase.auth.updateUser({
            phone: phone,
            data: { 
                full_name: fullName,
                profile_bio: profileBio,
            },
        });
         if (error) throw error;
    } catch (err: any) {
        console.error("Error updating auth user data:", err);
        authDataUpdateError = `Failed to save basic details: ${err.message}`;
    }

    setDetailsLoading(false);

    // --- 3. Show Feedback --- 
    if (roleDataUpdateError || authDataUpdateError) {
        toast.error(roleDataUpdateError || authDataUpdateError || 'An error occurred during save.');
    } else {
        toast.success('Profile details updated successfully!');
    }
  };

  // Handler for avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setAvatarUploading(true);
    toast.loading('Uploading avatar...');

    // Size check
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        toast.dismiss();
        toast.error('File size exceeds 5MB limit.');
        setAvatarUploading(false);
        if (event.target) event.target.value = '';
        return;
    }

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      toast.dismiss();
      toast.error(`Error uploading avatar: ${uploadError.message}`);
      setAvatarUploading(false);
      if (event.target) event.target.value = '';
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const newAvatarUrl = urlData.publicUrl;

    // Update user metadata
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: newAvatarUrl }, 
    });

    toast.dismiss();
    if (updateError) {
      toast.error(`Error updating profile: ${updateError.message}`);
    } else {
      setAvatarUrl(newAvatarUrl); // Update local state to show new avatar
      toast.success('Avatar updated!');
      // AuthContext should update the user object automatically
    }
    setAvatarUploading(false);
    if (event.target) event.target.value = ''; 
  };
  
  // --- Input Change Handlers for Arrays (Checkboxes) ---
  const handleIndustryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setPreferredIndustries(prev => 
            checked ? [...prev, value] : prev.filter(industry => industry !== value)
        );
    };

   const handleGeographyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        setPreferredGeography(prev => 
            checked ? [...prev, value] : prev.filter(geo => geo !== value)
        );
    };

  // Loading state for initial data fetch
  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  // Handle case where user data is missing after loading
  if (!user) {
    return (
        <>
         <BreadcrumbComp title="Edit Profile" items={BCrumb} />
         <Alert color="failure" icon={IconAlertCircle}>
            User data not available. Please log in again.
         </Alert>
       </>
    );
  }

  return (
    <>
      <BreadcrumbComp title="Edit Profile" items={BCrumb} />
      
       {roleDataError && (
         <Alert color="warning" icon={IconAlertCircle} className="mb-6">
            {roleDataError}
         </Alert>
       )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Column 1: Avatar Upload */}
        <div className="xl:col-span-1">
          <OutlineCard>
            <h5 className="card-title">Profile Picture</h5>
            <p className="card-subtitle -mt-1">
              Update your avatar.
            </p>
            <div className="flex flex-col items-center text-center mt-5">
              <Avatar 
                img={avatarUrl || userImg} 
                alt={`${fullName} avatar`} 
                rounded 
                size="xl" 
                bordered
                color="gray"
                className="mb-4"
              />
              <FileInput 
                  id="avatar-upload" 
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleAvatarUpload}
                  disabled={avatarUploading}
                  helperText="Max 5MB (JPG, PNG, GIF)"
                  className="w-full max-w-xs"
                />
            </div>
          </OutlineCard>
        </div>

        {/* Column 2: Profile Details Form */}
        <div className="xl:col-span-2">
           <OutlineCard>
            <h5 className="card-title">Edit Profile Details</h5>
            
            <form onSubmit={handleUpdateDetails} className="mt-4 space-y-6">
               {/* --- Section: Basic Info --- */}
                 <div>
                    <h6 className="text-md font-semibold mb-3 border-b pb-2">Basic Information</h6>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                         <div className="md:col-span-1">
                             <Label htmlFor="fullName" value="Full Name" className="mb-2 block" />
                             <TextInput id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                         </div>
                         <div className="md:col-span-1">
                             <Label htmlFor="em" value="Email" className="mb-2 block" />
                             <TextInput id="em" type="email" value={email} disabled />
                         </div>
                          <div className="md:col-span-1">
                             <Label htmlFor="ph" value="Phone" className="mb-2 block"/>
                             <TextInput id="ph" type="tel" placeholder="+1 123 456 7890" value={phone} onChange={(e) => setPhone(e.target.value)} />
                         </div>
                          <div className="col-span-1 md:col-span-2">
                            <Label htmlFor="profileBio" value="Profile Bio" className="mb-2 block"/>
                            <Textarea id="profileBio" placeholder="Tell us a bit about yourself..." value={profileBio} onChange={(e) => setProfileBio(e.target.value)} rows={3} />
                         </div>
                    </div>
                 </div>
                 
                {/* --- Section: Startup Details --- */}
                 {userRole === 'startup' && (
                    <div>
                        <h6 className="text-md font-semibold mb-3 border-b pb-2">Startup Details</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <Label htmlFor="startupName" value="Startup Name" className="mb-2 block"/>
                                <TextInput id="startupName" value={startupName} onChange={(e) => setStartupName(e.target.value)} required />
                            </div>
                            <div>
                               <Label htmlFor="industry" value="Industry" className="mb-2 block"/>
                               <Select id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} required>
                                   <option value="">Select Industry...</option>
                                   {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                               </Select>
                            </div>
                             <div>
                                <Label htmlFor="sector" value="Sector" className="mb-2 block"/>
                                <TextInput id="sector" placeholder="e.g., SaaS, FinTech, EdTech" value={sector} onChange={(e) => setSector(e.target.value)} />
                            </div>
                            <div>
                               <Label htmlFor="operationalStage" value="Operational Stage" className="mb-2 block"/>
                               <Select id="operationalStage" value={operationalStage} onChange={(e) => setOperationalStage(e.target.value)} required>
                                   <option value="">Select Stage...</option>
                                   {OPERATIONAL_STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                               </Select>
                            </div>
                             <div>
                                <Label htmlFor="locationCity" value="City / Location" className="mb-2 block"/>
                                <TextInput id="locationCity" placeholder="e.g., Riyadh, KSA" value={locationCity} onChange={(e) => setLocationCity(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="numEmployees" value="Number of Employees" className="mb-2 block"/>
                                <TextInput id="numEmployees" type="number" min="0" value={numEmployees} onChange={(e) => setNumEmployees(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                             <div>
                                <Label htmlFor="pitchDeckUrl" value="Pitch Deck URL" className="mb-2 block"/>
                                <TextInput id="pitchDeckUrl" type="url" placeholder="https://..." value={pitchDeckUrl} onChange={(e) => setPitchDeckUrl(e.target.value)} />
                            </div>
                        </div>
                         {/* KPIs Sub-section */}
                         <div className="mt-6">
                            <h6 className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400">Financials & KPIs</h6>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                    <Label htmlFor="annualRevenue" value="Annual Revenue (USD)" className="mb-2 block"/>
                                    <TextInput id="annualRevenue" type="number" min="0" placeholder="e.g., 100000" value={annualRevenue} onChange={(e) => setAnnualRevenue(e.target.value === '' ? '' : Number(e.target.value))} />
                                </div>
                                <div>
                                    <Label htmlFor="annualExpenses" value="Annual Expenses (USD)" className="mb-2 block"/>
                                    <TextInput id="annualExpenses" type="number" min="0" placeholder="e.g., 50000" value={annualExpenses} onChange={(e) => setAnnualExpenses(e.target.value === '' ? '' : Number(e.target.value))} />
                                </div>
                                <div>
                                    <Label htmlFor="kpiCac" value="Customer Acquisition Cost (CAC - USD)" className="mb-2 block"/>
                                    <TextInput id="kpiCac" type="number" min="0" placeholder="e.g., 100" value={kpiCac} onChange={(e) => setKpiCac(e.target.value === '' ? '' : Number(e.target.value))} />
                                </div>
                                <div>
                                    <Label htmlFor="kpiClv" value="Customer Lifetime Value (CLV - USD)" className="mb-2 block"/>
                                    <TextInput id="kpiClv" type="number" min="0" placeholder="e.g., 500" value={kpiClv} onChange={(e) => setKpiClv(e.target.value === '' ? '' : Number(e.target.value))} />
                                </div>
                                <div>
                                    <Label htmlFor="kpiRetentionRate" value="Customer Retention Rate (%)" className="mb-2 block"/>
                                    <TextInput id="kpiRetentionRate" type="number" min="0" max="100" step="0.1" placeholder="e.g., 85.5" value={kpiRetentionRate} onChange={(e) => setKpiRetentionRate(e.target.value === '' ? '' : Number(e.target.value))} />
                                </div>
                                <div>
                                    <Label htmlFor="kpiConversionRate" value="Conversion Rate (%)" className="mb-2 block"/>
                                    <TextInput id="kpiConversionRate" type="number" min="0" max="100" step="0.1" placeholder="e.g., 3.2" value={kpiConversionRate} onChange={(e) => setKpiConversionRate(e.target.value === '' ? '' : Number(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    </div>
                 )}
                 
                {/* --- Section: Investor Details --- */}
                 {userRole === 'investor' && (
                     <div>
                        <h6 className="text-md font-semibold mb-3 border-b pb-2">Investor Details</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                               <Label htmlFor="investorCompanyName" value="Company Name" className="mb-2 block"/>
                               <TextInput id="investorCompanyName" value={investorCompanyName} onChange={(e) => setInvestorCompanyName(e.target.value)} />
                            </div>
                            <div>
                               <Label htmlFor="jobTitle" value="Job Title" className="mb-2 block"/>
                               <TextInput id="jobTitle" placeholder="e.g., Partner, Analyst" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="website" value="Website URL" className="mb-2 block"/>
                                <TextInput id="website" type="url" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} />
                             </div>
                             <div>
                                <Label htmlFor="linkedinProfile" value="LinkedIn Profile URL" className="mb-2 block"/>
                                <TextInput id="linkedinProfile" type="url" placeholder="https://linkedin.com/in/..." value={linkedinProfile} onChange={(e) => setLinkedinProfile(e.target.value)} />
                             </div>
                            <div className="md:col-span-2">
                                <Label value="Preferred Industries" className="mb-2 block"/>
                                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                                     {INDUSTRIES.map(ind => (
                                         <div key={ind} className="flex items-center">
                                             <Checkbox 
                                                 id={`industry-${ind}`} 
                                                 value={ind} 
                                                 checked={preferredIndustries.includes(ind)}
                                                 onChange={handleIndustryChange}
                                             />
                                             <Label htmlFor={`industry-${ind}`} className="ml-2 text-sm">{ind}</Label>
                                         </div>
                                     ))}
                                </div>
                             </div>
                             <div className="md:col-span-2">
                                <Label value="Preferred Geography" className="mb-2 block"/>
                                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                                     {GEOGRAPHIES.map(geo => (
                                         <div key={geo} className="flex items-center">
                                             <Checkbox 
                                                 id={`geo-${geo}`} 
                                                 value={geo} 
                                                 checked={preferredGeography.includes(geo)}
                                                 onChange={handleGeographyChange}
                                              />
                                             <Label htmlFor={`geo-${geo}`} className="ml-2 text-sm">{geo}</Label>
                                         </div>
                                     ))}
                                </div>
                             </div>
                              <div>
                                <Label htmlFor="preferredStage" value="Preferred Investment Stage" className="mb-2 block"/>
                                 <Select id="preferredStage" value={preferredStage} onChange={(e) => setPreferredStage(e.target.value)}>
                                    <option value="">Select Stage...</option>
                                    {STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                                </Select>
                             </div>
                         </div>
                    </div>
                 )}

              {/* --- Save Button --- */}
              <div className="flex justify-end mt-8 border-t pt-6">
                <Button type="submit" color={"primary"} isProcessing={detailsLoading} disabled={detailsLoading || avatarUploading}>
                   <IconDeviceFloppy size={18} className="mr-2"/>
                   Save All Profile Details
                </Button>
              </div>
            </form>
          </OutlineCard>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage; 