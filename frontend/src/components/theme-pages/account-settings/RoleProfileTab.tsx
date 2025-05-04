import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Spinner, Alert, Button, Label, TextInput, Textarea, Checkbox, Select } from 'flowbite-react';
import { IconAlertCircle, IconDeviceFloppy } from '@tabler/icons-react';
import OutlineCard from '@/components/shared/OutlineCard';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { StartupProfile, InvestorProfile } from '@/types/database';

// --- Constants (Copied from EditProfilePage) ---
const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Education", "E-commerce", "Entertainment"];
const GEOGRAPHIES = ["MENA", "Europe", "North America", "Asia", "Global"];
const STAGES = ["Idea", "Pre-Seed", "Seed", "Series A", "Series B+", "Growth"];
const OPERATIONAL_STAGES = ["Concept Only", "Development", "Early Revenue", "Scaling", "Established"];

const RoleProfileTab: React.FC = () => {
    const { user, userRole, loading: authLoading } = useAuth();

    // --- State (Moved from EditProfilePage & Added New Fields) ---
    const [roleProfileData, setRoleProfileData] = useState<Partial<StartupProfile & InvestorProfile>>({});
    
    // --- Startup Fields --- 
    const [startupName, setStartupName] = useState('');
    const [industry, setIndustry] = useState('');
    const [sector, setSector] = useState('');
    const [locationCity, setLocationCity] = useState('');
    const [countryOfOperation, setCountryOfOperation] = useState(''); // New
    const [foundingDate, setFoundingDate] = useState<string | null>(null);
    const [description, setDescription] = useState(''); // New (was commented out)
    const [operationalStage, setOperationalStage] = useState('');
    const [numEmployees, setNumEmployees] = useState<number | '' >('');
    const [numCustomers, setNumCustomers] = useState<number | '' >(''); // New
    const [annualRevenue, setAnnualRevenue] = useState<number | '' >('');
    const [annualExpenses, setAnnualExpenses] = useState<number | '' >('');
    const [website, setWebsite] = useState(''); // New (moved)
    const [linkedinProfile, setLinkedinProfile] = useState(''); // New (moved)
    const [twitterProfile, setTwitterProfile] = useState(''); // New
    const [logoUrl, setLogoUrl] = useState(''); // New
    const [pitchDeckUrl, setPitchDeckUrl] = useState('');
    // KPIs
    const [kpiCac, setKpiCac] = useState<number | '' >('');
    const [kpiClv, setKpiClv] = useState<number | '' >('');
    const [kpiRetentionRate, setKpiRetentionRate] = useState<number | '' >('');
    const [kpiConversionRate, setKpiConversionRate] = useState<number | '' >('');
    const [kpiMonthlyGrowth, setKpiMonthlyGrowth] = useState<number | '' >(''); // New
    const [kpiPaybackPeriod, setKpiPaybackPeriod] = useState<number | '' >(''); // New
    const [kpiChurnRate, setKpiChurnRate] = useState<number | '' >(''); // New
    const [kpiNps, setKpiNps] = useState<number | '' >(''); // New
    const [kpiTamSize, setKpiTamSize] = useState(''); // New (string)
    const [kpiAvgOrderValue, setKpiAvgOrderValue] = useState<number | '' >(''); // New
    const [kpiMarketShare, setKpiMarketShare] = useState<number | '' >(''); // New
    const [kpiYoyGrowth, setKpiYoyGrowth] = useState<number | '' >(''); // New
    // Team
    const [teamSize, setTeamSize] = useState<number | '' >(''); // New
    const [hasCoFounder, setHasCoFounder] = useState<boolean | null>(null); // New
    const [founderName, setFounderName] = useState(''); // New
    const [founderTitle, setFounderTitle] = useState(''); // New
    const [founderEducation, setFounderEducation] = useState(''); // New
    const [previousStartupExperience, setPreviousStartupExperience] = useState(''); // New
    const [founderBio, setFounderBio] = useState(''); // New
    // Market Analysis
    const [marketGrowthRate, setMarketGrowthRate] = useState(''); // New
    const [marketKeyTrends, setMarketKeyTrends] = useState(''); // New
    const [targetCustomerProfile, setTargetCustomerProfile] = useState(''); // New
    const [customerPainPoints, setCustomerPainPoints] = useState(''); // New
    const [marketBarriers, setMarketBarriers] = useState(''); // New
    const [competitiveAdvantage, setCompetitiveAdvantage] = useState(''); // New
    // Competition
    const [competitor1Name, setCompetitor1Name] = useState(''); // New
    const [competitor1Size, setCompetitor1Size] = useState(''); // New
    const [competitor1Threat, setCompetitor1Threat] = useState(''); // New
    const [competitor1Differentiator, setCompetitor1Differentiator] = useState(''); // New
    const [competitor2Name, setCompetitor2Name] = useState(''); // New
    const [competitor2Size, setCompetitor2Size] = useState(''); // New
    const [competitor2Threat, setCompetitor2Threat] = useState(''); // New
    const [competitor2Differentiator, setCompetitor2Differentiator] = useState(''); // New
    const [competitor3Name, setCompetitor3Name] = useState(''); // New
    const [competitor3Size, setCompetitor3Size] = useState(''); // New
    const [competitor3Threat, setCompetitor3Threat] = useState(''); // New
    const [competitor3Differentiator, setCompetitor3Differentiator] = useState(''); // New
    // Funding
    const [currentFunding, setCurrentFunding] = useState(''); // New
    const [seekingInvestment, setSeekingInvestment] = useState<boolean | null>(null); // New
    const [targetRaiseAmount, setTargetRaiseAmount] = useState<number | '' >(''); // New

    // --- Investor Fields --- (Keep existing)
    const [investorCompanyName, setInvestorCompanyName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [preferredIndustries, setPreferredIndustries] = useState<string[]>([]);
    const [preferredGeography, setPreferredGeography] = useState<string[]>([]);
    const [preferredStage, setPreferredStage] = useState<string[] | string>(''); // Allow string or array for consistency
    const [investorWebsite, setInvestorWebsite] = useState(''); // Renamed from `website` to avoid conflict
    const [investorLinkedinProfile, setInvestorLinkedinProfile] = useState(''); // Renamed from `linkedinProfile`
    const [companyDescription, setCompanyDescription] = useState(''); // Added investor company description
    const [investorType, setInvestorType] = useState<'Personal' | 'Angel' | 'VC' | null>(null); // Added investor type

    // UI State
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [roleDataError, setRoleDataError] = useState<string | null>(null);

    // --- Data Fetching (Updated for new fields) ---
    useEffect(() => {
        const fetchRoleData = async () => {
            if (authLoading || !user || !userRole || (userRole !== 'startup' && userRole !== 'investor')) {
                setInitialLoading(false);
                return;
            }

            setInitialLoading(true);
            setRoleDataError(null);
            const tableName = userRole === 'startup' ? 'startups' : 'investors';

            try {
                const { data, error, status } = await supabase
                    .from(tableName)
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error && status !== 406) throw error; 

                const fetchedData = data || {}; 
                setRoleProfileData(fetchedData);

                if (userRole === 'startup') {
                    // Basic Info
                    setStartupName(fetchedData.name || '');
                    setIndustry(fetchedData.industry || '');
                    setSector(fetchedData.sector || '');
                    setLocationCity(fetchedData.location_city || '');
                    setCountryOfOperation(fetchedData.country_of_operation || '');
                    setFoundingDate(fetchedData.founding_date || null);
                    // Company Details
                    setDescription(fetchedData.description || '');
                    setOperationalStage(fetchedData.operational_stage || '');
                    setNumEmployees(fetchedData.num_employees ?? '');
                    setNumCustomers(fetchedData.num_customers ?? ''); 
                    setAnnualRevenue(fetchedData.annual_revenue ?? '');
                    setAnnualExpenses(fetchedData.annual_expenses ?? '');
                    setWebsite(fetchedData.website || '');
                    setLinkedinProfile(fetchedData.linkedin_profile || '');
                    setTwitterProfile(fetchedData.twitter_profile || '');
                    setLogoUrl(fetchedData.logo_url || '');
                    setPitchDeckUrl(fetchedData.pitch_deck_url || '');
                    // KPIs
                    setKpiCac(fetchedData.kpi_cac ?? '');
                    setKpiClv(fetchedData.kpi_clv ?? '');
                    setKpiRetentionRate(fetchedData.kpi_retention_rate ?? '');
                    setKpiConversionRate(fetchedData.kpi_conversion_rate ?? '');
                    setKpiMonthlyGrowth(fetchedData.kpi_monthly_growth ?? '');
                    setKpiPaybackPeriod(fetchedData.kpi_payback_period ?? '');
                    setKpiChurnRate(fetchedData.kpi_churn_rate ?? '');
                    setKpiNps(fetchedData.kpi_nps ?? '');
                    setKpiTamSize(fetchedData.kpi_tam_size || '');
                    setKpiAvgOrderValue(fetchedData.kpi_avg_order_value ?? '');
                    setKpiMarketShare(fetchedData.kpi_market_share ?? '');
                    setKpiYoyGrowth(fetchedData.kpi_yoy_growth ?? '');
                    // Team
                    setTeamSize(fetchedData.team_size ?? '');
                    setHasCoFounder(fetchedData.has_co_founder ?? null);
                    setFounderName(fetchedData.founder_name || '');
                    setFounderTitle(fetchedData.founder_title || '');
                    setFounderEducation(fetchedData.founder_education || '');
                    setPreviousStartupExperience(fetchedData.previous_startup_experience || '');
                    setFounderBio(fetchedData.founder_bio || '');
                    // Market Analysis
                    setMarketGrowthRate(fetchedData.market_growth_rate || '');
                    setMarketKeyTrends(fetchedData.market_key_trends || '');
                    setTargetCustomerProfile(fetchedData.target_customer_profile || '');
                    setCustomerPainPoints(fetchedData.customer_pain_points || '');
                    setMarketBarriers(fetchedData.market_barriers || '');
                    setCompetitiveAdvantage(fetchedData.competitive_advantage || '');
                    // Competition
                    setCompetitor1Name(fetchedData.competitor1_name || '');
                    setCompetitor1Size(fetchedData.competitor1_size || '');
                    setCompetitor1Threat(fetchedData.competitor1_threat || '');
                    setCompetitor1Differentiator(fetchedData.competitor1_differentiator || '');
                    setCompetitor2Name(fetchedData.competitor2_name || '');
                    setCompetitor2Size(fetchedData.competitor2_size || '');
                    setCompetitor2Threat(fetchedData.competitor2_threat || '');
                    setCompetitor2Differentiator(fetchedData.competitor2_differentiator || '');
                    setCompetitor3Name(fetchedData.competitor3_name || '');
                    setCompetitor3Size(fetchedData.competitor3_size || '');
                    setCompetitor3Threat(fetchedData.competitor3_threat || '');
                    setCompetitor3Differentiator(fetchedData.competitor3_differentiator || '');
                    // Funding
                    setCurrentFunding(fetchedData.current_funding || '');
                    setSeekingInvestment(fetchedData.seeking_investment ?? null);
                    setTargetRaiseAmount(fetchedData.target_raise_amount ?? '');

                } else if (userRole === 'investor') {
                    // Update investor fields (use renamed state vars)
                    setInvestorCompanyName(fetchedData.company_name || '');
                    setJobTitle(fetchedData.job_title || '');
                    setPreferredIndustries(fetchedData.preferred_industries || []);
                    setPreferredGeography(fetchedData.preferred_geography || []);
                    // Ensure preferred_stage is handled correctly (might be array or string)
                    const stagePref = fetchedData.preferred_stage;
                    setPreferredStage(Array.isArray(stagePref) ? stagePref : (stagePref ? [stagePref] : [])); 
                    setInvestorWebsite(fetchedData.website || '');
                    setInvestorLinkedinProfile(fetchedData.linkedin_profile || '');
                    setCompanyDescription(fetchedData.company_description || ''); // Add new field
                    setInvestorType(fetchedData.investor_type || null); // Add new field
                }

            } catch (err: any) {
                console.error(`Error fetching ${tableName} data:`, err);
                setRoleDataError(`Failed to load ${userRole} profile details. You might need to create it.`);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchRoleData();
    }, [user, userRole, authLoading]);

    // --- Save Logic (Updated for new fields) ---
    const handleSaveRoleProfile = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user || !userRole || (userRole !== 'startup' && userRole !== 'investor')) return;
        setDetailsLoading(true);
        setRoleDataError(null);

        const tableName = userRole === 'startup' ? 'startups' : 'investors';
        let profilePayload: any = { user_id: user.id, id: roleProfileData?.id }; 

        if (userRole === 'startup') {
            profilePayload = {
                ...profilePayload,
                // Basic Info
                name: startupName,
                industry: industry,
                sector: sector,
                location_city: locationCity,
                country_of_operation: countryOfOperation || null,
                founding_date: foundingDate || null,
                // Company Details
                description: description || null,
                operational_stage: operationalStage || null,
                num_employees: numEmployees === '' ? null : Number(numEmployees),
                num_customers: numCustomers === '' ? null : Number(numCustomers),
                annual_revenue: annualRevenue === '' ? null : Number(annualRevenue),
                annual_expenses: annualExpenses === '' ? null : Number(annualExpenses),
                website: website || null,
                linkedin_profile: linkedinProfile || null,
                twitter_profile: twitterProfile || null,
                logo_url: logoUrl || null,
                pitch_deck_url: pitchDeckUrl || null,
                // KPIs
                kpi_cac: kpiCac === '' ? null : Number(kpiCac),
                kpi_clv: kpiClv === '' ? null : Number(kpiClv),
                kpi_retention_rate: kpiRetentionRate === '' ? null : Number(kpiRetentionRate),
                kpi_conversion_rate: kpiConversionRate === '' ? null : Number(kpiConversionRate),
                kpi_monthly_growth: kpiMonthlyGrowth === '' ? null : Number(kpiMonthlyGrowth),
                kpi_payback_period: kpiPaybackPeriod === '' ? null : Number(kpiPaybackPeriod),
                kpi_churn_rate: kpiChurnRate === '' ? null : Number(kpiChurnRate),
                kpi_nps: kpiNps === '' ? null : Number(kpiNps),
                kpi_tam_size: kpiTamSize || null,
                kpi_avg_order_value: kpiAvgOrderValue === '' ? null : Number(kpiAvgOrderValue),
                kpi_market_share: kpiMarketShare === '' ? null : Number(kpiMarketShare),
                kpi_yoy_growth: kpiYoyGrowth === '' ? null : Number(kpiYoyGrowth),
                // Team
                team_size: teamSize === '' ? null : Number(teamSize),
                has_co_founder: hasCoFounder,
                founder_name: founderName || null,
                founder_title: founderTitle || null,
                founder_education: founderEducation || null,
                previous_startup_experience: previousStartupExperience || null,
                founder_bio: founderBio || null,
                // Market Analysis
                market_growth_rate: marketGrowthRate || null,
                market_key_trends: marketKeyTrends || null,
                target_customer_profile: targetCustomerProfile || null,
                customer_pain_points: customerPainPoints || null,
                market_barriers: marketBarriers || null,
                competitive_advantage: competitiveAdvantage || null,
                // Competition
                competitor1_name: competitor1Name || null,
                competitor1_size: competitor1Size || null,
                competitor1_threat: competitor1Threat || null,
                competitor1_differentiator: competitor1Differentiator || null,
                competitor2_name: competitor2Name || null,
                competitor2_size: competitor2Size || null,
                competitor2_threat: competitor2Threat || null,
                competitor2_differentiator: competitor2Differentiator || null,
                competitor3_name: competitor3Name || null,
                competitor3_size: competitor3Size || null,
                competitor3_threat: competitor3Threat || null,
                competitor3_differentiator: competitor3Differentiator || null,
                // Funding
                current_funding: currentFunding || null,
                seeking_investment: seekingInvestment,
                target_raise_amount: targetRaiseAmount === '' ? null : Number(targetRaiseAmount),
                // Ensure timestamps are handled correctly by Supabase
                updated_at: new Date().toISOString(),
            };
        } else if (userRole === 'investor') {
            profilePayload = {
                ...profilePayload,
                company_name: investorCompanyName || null,
                job_title: jobTitle || null,
                preferred_industries: preferredIndustries.length > 0 ? preferredIndustries : null,
                preferred_geography: preferredGeography.length > 0 ? preferredGeography : null,
                preferred_stage: Array.isArray(preferredStage) && preferredStage.length > 0 ? preferredStage : null, // Save as array or null
                website: investorWebsite || null, // Use renamed state var
                linkedin_profile: investorLinkedinProfile || null, // Use renamed state var
                company_description: companyDescription || null,
                investor_type: investorType || null,
                // Ensure timestamps are handled correctly by Supabase
                updated_at: new Date().toISOString(),
            };
        }

        try {
            // Use upsert to handle both creation and update
            const { data: upsertedData, error } = await supabase
                .from(tableName)
                .upsert(profilePayload, { onConflict: 'user_id' })
                .select() // Select to get back the updated/inserted row
                .single();
            if (error) throw error;

            // Update local state with the potentially new ID from the upserted data
            setRoleProfileData(upsertedData || {}); 
            toast.success(`${userRole.charAt(0).toUpperCase() + userRole.slice(1)} profile updated successfully!`);
        } catch (err: any) {
            console.error(`Error upserting ${tableName} data:`, err);
            setRoleDataError(`Failed to save ${userRole} profile details: ${err.message}`);
            toast.error(`Failed to save ${userRole} profile details.`);
        } finally {
            setDetailsLoading(false);
        }
    };

    // --- Checkbox Handlers (Moved from EditProfilePage) ---
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

    // --- Render Logic (Restructured UI) ---
    if (initialLoading) {
        return (
            <div className="flex justify-center items-center p-10">
                <Spinner size="lg" />
                <span className="ml-3">Loading profile details...</span>
            </div>
        );
    }

    if (!userRole || (userRole !== 'startup' && userRole !== 'investor')) {
        return (
             <Alert color="info">No specific profile details section for your user role.</Alert>
        );
    }

    return (
        <form onSubmit={handleSaveRoleProfile} className="space-y-6">
            {roleDataError && (
                <Alert color="warning" icon={IconAlertCircle} className="mb-6">
                    {roleDataError}
                </Alert>
            )}

            {/* --- Section: Startup Profile --- */}
            {userRole === 'startup' && (
                <div className="space-y-6">
                    {/* --- Card: Basic Info --- */}
                    <OutlineCard>
                        <h5 className="card-title mb-4">Basic Information</h5>
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
                                <TextInput id="sector" placeholder="e.g., SaaS, FinTech" value={sector} onChange={(e) => setSector(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="locationCity" value="City" className="mb-2 block"/>
                                <TextInput id="locationCity" placeholder="e.g., Riyadh" value={locationCity} onChange={(e) => setLocationCity(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="countryOfOperation" value="Country of Operation" className="mb-2 block"/>
                                <TextInput id="countryOfOperation" placeholder="e.g., Saudi Arabia" value={countryOfOperation} onChange={(e) => setCountryOfOperation(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="foundingDate" value="Founding Date" className="mb-2 block"/>
                                <TextInput 
                                    id="foundingDate"
                                    type="date"
                                    value={foundingDate || ''}
                                    onChange={(e) => setFoundingDate(e.target.value || null)}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                    </OutlineCard>

                    {/* --- Card: Company Details --- */}
                    <OutlineCard>
                        <h5 className="card-title mb-4">Company Details</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                             <div className="md:col-span-2">
                                <Label htmlFor="description" value="Company Description" className="mb-2 block"/>
                                <Textarea id="description" placeholder="Describe your company..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                            </div>
                            <div>
                               <Label htmlFor="operationalStage" value="Operational Stage" className="mb-2 block"/>
                               <Select id="operationalStage" value={operationalStage} onChange={(e) => setOperationalStage(e.target.value)} required>
                                   <option value="">Select Stage...</option>
                                   {OPERATIONAL_STAGES.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                               </Select>
                            </div>
                            <div>
                                <Label htmlFor="numEmployees" value="Number of Employees" className="mb-2 block"/>
                                <TextInput id="numEmployees" type="number" min="0" value={numEmployees} onChange={(e) => setNumEmployees(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                            <div>
                                <Label htmlFor="numCustomers" value="Number of Customers" className="mb-2 block"/>
                                <TextInput id="numCustomers" type="number" min="0" value={numCustomers} onChange={(e) => setNumCustomers(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                            <div>
                                <Label htmlFor="website" value="Website URL" className="mb-2 block"/>
                                <TextInput id="website" type="url" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="linkedinProfile" value="LinkedIn Profile URL" className="mb-2 block"/>
                                <TextInput id="linkedinProfile" type="url" placeholder="https://linkedin.com/company/..." value={linkedinProfile} onChange={(e) => setLinkedinProfile(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="twitterProfile" value="Twitter Profile URL" className="mb-2 block"/>
                                <TextInput id="twitterProfile" type="url" placeholder="https://twitter.com/..." value={twitterProfile} onChange={(e) => setTwitterProfile(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="logoUrl" value="Logo URL" className="mb-2 block"/>
                                <TextInput id="logoUrl" type="url" placeholder="https://.../logo.png" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="pitchDeckUrl" value="Pitch Deck URL" className="mb-2 block"/>
                                <TextInput id="pitchDeckUrl" type="url" placeholder="Link to deck (Google Drive, DocSend, etc.)" value={pitchDeckUrl} onChange={(e) => setPitchDeckUrl(e.target.value)} />
                            </div>
                        </div>
                    </OutlineCard>

                    {/* --- Card: Financials & KPIs --- */}
                     <OutlineCard>
                         <h5 className="card-title mb-4">Financials & KPIs</h5>
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
                             <div>
                                <Label htmlFor="kpiMonthlyGrowth" value="Monthly Growth Rate (%)" className="mb-2 block"/>
                                <TextInput id="kpiMonthlyGrowth" type="number" step="0.1" placeholder="e.g., 15.0" value={kpiMonthlyGrowth} onChange={(e) => setKpiMonthlyGrowth(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                             <div>
                                <Label htmlFor="kpiPaybackPeriod" value="CAC Payback Period (Months)" className="mb-2 block"/>
                                <TextInput id="kpiPaybackPeriod" type="number" min="0" step="0.1" placeholder="e.g., 6.5" value={kpiPaybackPeriod} onChange={(e) => setKpiPaybackPeriod(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                             <div>
                                <Label htmlFor="kpiChurnRate" value="Churn Rate (%)" className="mb-2 block"/>
                                <TextInput id="kpiChurnRate" type="number" min="0" max="100" step="0.1" placeholder="e.g., 2.5" value={kpiChurnRate} onChange={(e) => setKpiChurnRate(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                             <div>
                                <Label htmlFor="kpiNps" value="Net Promoter Score (NPS)" className="mb-2 block"/>
                                <TextInput id="kpiNps" type="number" min="-100" max="100" placeholder="e.g., 55" value={kpiNps} onChange={(e) => setKpiNps(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                             <div>
                                <Label htmlFor="kpiTamSize" value="Total Addressable Market (TAM)" className="mb-2 block"/>
                                <TextInput id="kpiTamSize" placeholder="e.g., $1 Billion, 10M Users" value={kpiTamSize} onChange={(e) => setKpiTamSize(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="kpiAvgOrderValue" value="Average Order Value (AOV - USD)" className="mb-2 block"/>
                                <TextInput id="kpiAvgOrderValue" type="number" min="0" placeholder="e.g., 50" value={kpiAvgOrderValue} onChange={(e) => setKpiAvgOrderValue(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                             <div>
                                <Label htmlFor="kpiMarketShare" value="Estimated Market Share (%)" className="mb-2 block"/>
                                <TextInput id="kpiMarketShare" type="number" min="0" max="100" step="0.1" placeholder="e.g., 1.5" value={kpiMarketShare} onChange={(e) => setKpiMarketShare(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                             <div>
                                <Label htmlFor="kpiYoyGrowth" value="Year-over-Year Growth (%)" className="mb-2 block"/>
                                <TextInput id="kpiYoyGrowth" type="number" step="0.1" placeholder="e.g., 150" value={kpiYoyGrowth} onChange={(e) => setKpiYoyGrowth(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                         </div>
                    </OutlineCard>

                    {/* --- Card: Team Information --- */}
                    <OutlineCard>
                        <h5 className="card-title mb-4">Team Information</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                             <div>
                                <Label htmlFor="teamSize" value="Team Size" className="mb-2 block"/>
                                <TextInput id="teamSize" type="number" min="1" value={teamSize} onChange={(e) => setTeamSize(e.target.value === '' ? '' : Number(e.target.value))} />
                            </div>
                            <div>
                                <Label htmlFor="hasCoFounder" value="Co-founder Status" className="mb-2 block"/>
                                <Select id="hasCoFounder" value={hasCoFounder === null ? '' : String(hasCoFounder)} onChange={(e) => setHasCoFounder(e.target.value === '' ? null : e.target.value === 'true')}>
                                    <option value="">Select...</option>
                                    <option value="true">Has Co-founder(s)</option>
                                    <option value="false">Solo Founder</option>
                                </Select>
                            </div>
                             <div>
                                <Label htmlFor="founderName" value="Founder Name" className="mb-2 block"/>
                                <TextInput id="founderName" placeholder="Primary Founder's Name" value={founderName} onChange={(e) => setFounderName(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="founderTitle" value="Founder Title" className="mb-2 block"/>
                                <TextInput id="founderTitle" placeholder="e.g., CEO, CTO" value={founderTitle} onChange={(e) => setFounderTitle(e.target.value)} />
                            </div>
                             <div className="md:col-span-2">
                                <Label htmlFor="founderEducation" value="Founder Education" className="mb-2 block"/>
                                <TextInput id="founderEducation" placeholder="e.g., Stanford University, BS Computer Science" value={founderEducation} onChange={(e) => setFounderEducation(e.target.value)} />
                            </div>
                             <div className="md:col-span-2">
                                <Label htmlFor="previousStartupExperience" value="Previous Startup Experience" className="mb-2 block"/>
                                <Textarea id="previousStartupExperience" placeholder="Describe previous startup roles or founding experience (if any)" value={previousStartupExperience} onChange={(e) => setPreviousStartupExperience(e.target.value)} rows={3} />
                            </div>
                             <div className="md:col-span-2">
                                <Label htmlFor="founderBio" value="Founder Bio" className="mb-2 block"/>
                                <Textarea id="founderBio" placeholder="Brief bio of the primary founder" value={founderBio} onChange={(e) => setFounderBio(e.target.value)} rows={4} />
                            </div>
                        </div>
                    </OutlineCard>

                    {/* --- Card: Market & Competition --- */}
                    <OutlineCard>
                        <h5 className="card-title mb-4">Market & Competition</h5>
                         <div className="space-y-6">
                            {/* Market Analysis Sub-section */}
                            <div>
                                <h6 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Market Analysis</h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="targetCustomerProfile" value="Target Customer Profile" className="mb-2 block"/>
                                        <Textarea id="targetCustomerProfile" placeholder="Describe your ideal customer segment(s)" value={targetCustomerProfile} onChange={(e) => setTargetCustomerProfile(e.target.value)} rows={3} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="customerPainPoints" value="Customer Pain Points Addressed" className="mb-2 block"/>
                                        <Textarea id="customerPainPoints" placeholder="What specific problems does your product/service solve?" value={customerPainPoints} onChange={(e) => setCustomerPainPoints(e.target.value)} rows={3} />
                                    </div>
                                     <div>
                                        <Label htmlFor="marketGrowthRate" value="Market Growth Rate" className="mb-2 block"/>
                                        <TextInput id="marketGrowthRate" placeholder="e.g., 15% CAGR, Stable" value={marketGrowthRate} onChange={(e) => setMarketGrowthRate(e.target.value)} />
                                    </div>
                                     <div>
                                        <Label htmlFor="marketBarriers" value="Key Market Barriers" className="mb-2 block"/>
                                        <TextInput id="marketBarriers" placeholder="e.g., Regulation, High Capital Costs" value={marketBarriers} onChange={(e) => setMarketBarriers(e.target.value)} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="marketKeyTrends" value="Market Key Trends" className="mb-2 block"/>
                                        <Textarea id="marketKeyTrends" placeholder="Describe important trends affecting your market" value={marketKeyTrends} onChange={(e) => setMarketKeyTrends(e.target.value)} rows={3} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="competitiveAdvantage" value="Competitive Advantage" className="mb-2 block"/>
                                        <Textarea id="competitiveAdvantage" placeholder="What makes your startup unique and defensible?" value={competitiveAdvantage} onChange={(e) => setCompetitiveAdvantage(e.target.value)} rows={3} />
                                    </div>
                                </div>
                            </div>
                            {/* Competition Sub-section */}
                            <div>
                                <h6 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Competitor Analysis (Top 3)</h6>
                                {/* Competitor 1 */} 
                                <div className="border rounded-lg p-4 mb-4 border-gray-200 dark:border-gray-700">
                                    <p className="font-medium mb-3 text-gray-600 dark:text-gray-400">Competitor 1</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <TextInput id="competitor1Name" placeholder="Competitor Name" value={competitor1Name} onChange={(e) => setCompetitor1Name(e.target.value)} />
                                        <TextInput id="competitor1Size" placeholder="Size (e.g., Revenue, Users)" value={competitor1Size} onChange={(e) => setCompetitor1Size(e.target.value)} />
                                        <TextInput id="competitor1Threat" placeholder="Threat Level (High, Med, Low)" value={competitor1Threat} onChange={(e) => setCompetitor1Threat(e.target.value)} />
                                        <TextInput id="competitor1Differentiator" placeholder="Key Differentiator / Weakness" value={competitor1Differentiator} onChange={(e) => setCompetitor1Differentiator(e.target.value)} />
                                    </div>
                                </div>
                                {/* Competitor 2 */} 
                                <div className="border rounded-lg p-4 mb-4 border-gray-200 dark:border-gray-700">
                                     <p className="font-medium mb-3 text-gray-600 dark:text-gray-400">Competitor 2</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <TextInput id="competitor2Name" placeholder="Competitor Name" value={competitor2Name} onChange={(e) => setCompetitor2Name(e.target.value)} />
                                        <TextInput id="competitor2Size" placeholder="Size (e.g., Revenue, Users)" value={competitor2Size} onChange={(e) => setCompetitor2Size(e.target.value)} />
                                        <TextInput id="competitor2Threat" placeholder="Threat Level (High, Med, Low)" value={competitor2Threat} onChange={(e) => setCompetitor2Threat(e.target.value)} />
                                        <TextInput id="competitor2Differentiator" placeholder="Key Differentiator / Weakness" value={competitor2Differentiator} onChange={(e) => setCompetitor2Differentiator(e.target.value)} />
                                    </div>
                                </div>
                                {/* Competitor 3 */} 
                                <div className="border rounded-lg p-4 border-gray-200 dark:border-gray-700">
                                     <p className="font-medium mb-3 text-gray-600 dark:text-gray-400">Competitor 3</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        <TextInput id="competitor3Name" placeholder="Competitor Name" value={competitor3Name} onChange={(e) => setCompetitor3Name(e.target.value)} />
                                        <TextInput id="competitor3Size" placeholder="Size (e.g., Revenue, Users)" value={competitor3Size} onChange={(e) => setCompetitor3Size(e.target.value)} />
                                        <TextInput id="competitor3Threat" placeholder="Threat Level (High, Med, Low)" value={competitor3Threat} onChange={(e) => setCompetitor3Threat(e.target.value)} />
                                        <TextInput id="competitor3Differentiator" placeholder="Key Differentiator / Weakness" value={competitor3Differentiator} onChange={(e) => setCompetitor3Differentiator(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </OutlineCard>

                     {/* --- Card: Funding Status --- */}
                    <OutlineCard>
                        <h5 className="card-title mb-4">Funding Status</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                             <div>
                                <Label htmlFor="currentFunding" value="Current Funding Situation" className="mb-2 block"/>
                                <TextInput id="currentFunding" placeholder="e.g., Bootstrapped, Pre-seed $100k" value={currentFunding} onChange={(e) => setCurrentFunding(e.target.value)} />
                            </div>
                             <div>
                                <Label htmlFor="seekingInvestment" value="Currently Seeking Investment?" className="mb-2 block"/>
                                <Select id="seekingInvestment" value={seekingInvestment === null ? '' : String(seekingInvestment)} onChange={(e) => setSeekingInvestment(e.target.value === '' ? null : e.target.value === 'true')}>
                                    <option value="">Select...</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </Select>
                            </div>
                            {seekingInvestment && (
                                <div>
                                    <Label htmlFor="targetRaiseAmount" value="Target Raise Amount (USD)" className="mb-2 block"/>
                                    <TextInput id="targetRaiseAmount" type="number" min="0" placeholder="e.g., 500000" value={targetRaiseAmount} onChange={(e) => setTargetRaiseAmount(e.target.value === '' ? '' : Number(e.target.value))} />
                                </div>
                            )}
                        </div>
                    </OutlineCard>
                </div>
            )}

            {/* --- Section: Investor Profile --- */}
            {userRole === 'investor' && (
                 <OutlineCard>
                    <h5 className="card-title mb-4">Investor Profile</h5>
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
                            <Label htmlFor="investorType" value="Investor Type" className="mb-2 block"/>
                            <Select id="investorType" value={investorType ?? ''} onChange={(e) => setInvestorType(e.target.value as any || null)}>
                                <option value="">Select Type...</option>
                                <option value="Personal">Personal</option>
                                <option value="Angel">Angel Investor</option>
                                <option value="VC">Venture Capital Firm</option>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                             <Label htmlFor="companyDescription" value="Company Description / Investment Thesis" className="mb-2 block"/>
                             <Textarea id="companyDescription" placeholder="Briefly describe your firm or investment focus..." value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} rows={4} />
                        </div>
                         <div>
                            <Label htmlFor="website" value="Website URL" className="mb-2 block"/>
                            <TextInput id="website" type="url" placeholder="https://..." value={investorWebsite} onChange={(e) => setInvestorWebsite(e.target.value)} />
                         </div>
                         <div>
                            <Label htmlFor="linkedinProfile" value="LinkedIn Profile URL" className="mb-2 block"/>
                            <TextInput id="linkedinProfile" type="url" placeholder="https://linkedin.com/in/..." value={investorLinkedinProfile} onChange={(e) => setInvestorLinkedinProfile(e.target.value)} />
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
                          <div className="md:col-span-2">
                             <Label htmlFor="preferredStage" value="Preferred Investment Stages" className="mb-2 block"/>
                              {/* Using Checkboxes for multi-select stage preference */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                                  {STAGES.map(stage => (
                                      <div key={stage} className="flex items-center">
                                          <Checkbox
                                              id={`stage-${stage}`}
                                              value={stage}
                                              checked={Array.isArray(preferredStage) && preferredStage.includes(stage)}
                                              onChange={(e) => {
                                                  const { value, checked } = e.target;
                                                  setPreferredStage(prev => {
                                                      const currentStages = Array.isArray(prev) ? prev : (prev ? [prev] : []);
                                                      return checked ? [...currentStages, value] : currentStages.filter(s => s !== value);
                                                  });
                                              }}
                                          />
                                          <Label htmlFor={`stage-${stage}`} className="ml-2 text-sm">{stage}</Label>
                                      </div>
                                  ))}
                              </div>
                         </div>
                     </div>
                </OutlineCard>
             )}

            {/* --- Save Button --- */}
            <div className="flex justify-end mt-8 border-t pt-6">
                <Button type="submit" color={"primary"} isProcessing={detailsLoading} disabled={detailsLoading}>
                    <IconDeviceFloppy size={18} className="mr-2" />
                    Save {userRole === 'startup' ? 'Startup' : 'Investor'} Profile Details
                </Button>
            </div>
        </form>
    );
};

export default RoleProfileTab; 