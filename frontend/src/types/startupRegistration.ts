import * as z from 'zod';

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// LinkedIn URL validation helper
const linkedInUrlValidator = (val: string) => !val || val.includes('linkedin.com');

// Zod schema definition for the startup registration form
export const startupRegistrationSchema = z.object({
  // Authentication (Required for signUp, not stored in startups table directly)
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
    .regex(passwordRegex, { 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
    }),
  confirmPassword: z.string(),
  
  // ADDED BACK: Founder Background fields
  founderName: z.string().min(2, { message: 'Your name must be at least 2 characters.' }).optional().or(z.literal('')),
  founderTitle: z.string().optional().or(z.literal('')),
  founderEducation: z.string().optional().or(z.literal('')),
  previousStartupExperience: z.string().optional().or(z.literal('')), // Changed name?
  founderBio: z.string().max(500, { message: 'Bio cannot exceed 500 characters.' }).optional().or(z.literal('')),
  techSkills: z.record(z.boolean()).optional().nullable(), // Allow null
  
  // Basic Info (Matches DB columns after mapping in onSubmit)
  startupName: z.string().min(2, { message: 'Startup name must be at least 2 characters.' }), // Maps to 'name'
  industry: z.string().min(1, { message: 'Industry is required.' }),
  sector: z.string().min(1, { message: 'Sector is required.' }).optional().or(z.literal('')), // Optional in DB, handle empty string
  locationCity: z.string().min(1, { message: 'Location city is required.' }), // Maps to 'location_city'
  countryOfOperation: z.string().min(1, { message: 'Country is required.' }), // Maps to 'country_of_operation'

  // Company Details (Matches DB columns after mapping in onSubmit)
  companyDescription: z.string().min(20, { message: 'Description must be at least 20 characters.' }).max(500, { message: 'Description cannot exceed 500 characters.' }).optional().or(z.literal('')), // Maps to 'description', optional
  operationalStage: z.string().min(1, { message: 'Operational stage is required.' }).optional().or(z.literal('')), // Maps to 'operational_stage', optional
  numEmployees: z.coerce.number().int().min(0, { message: 'Number of employees must be positive.' }).optional().or(z.literal('')),
  numCustomers: z.coerce.number().int().min(0, { message: 'Number of customers must be positive.' }).optional().or(z.literal('')),
  annualRevenue: z.coerce.number().min(0, { message: 'Annual revenue must be positive.' }).optional().or(z.literal('')),
  annualExpenses: z.coerce.number().min(0, { message: 'Annual expenses must be positive.' }).optional().or(z.literal('')),
  foundingDate: z.string().optional().or(z.literal('')), // Maps to 'founding_date', optional string (parsed later if needed)
  
  // Key Metrics (Matches DB columns)
  kpi_cac: z.coerce.number().min(0).optional().or(z.literal('')),
  kpi_clv: z.coerce.number().min(0).optional().or(z.literal('')),
  kpi_retention_rate: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  kpi_conversion_rate: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  kpi_monthly_growth: z.coerce.number().min(0).max(1000).optional().or(z.literal('')),
  kpi_payback_period: z.coerce.number().min(0).optional().or(z.literal('')),
  kpi_churn_rate: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  kpi_nps: z.coerce.number().min(-100).max(100).optional().or(z.literal('')),
  kpi_tam_size: z.string().optional().or(z.literal('')), // Stored as text
  kpi_avg_order_value: z.coerce.number().min(0).optional().or(z.literal('')),
  kpi_market_share: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  kpi_yoy_growth: z.coerce.number().min(0).optional().or(z.literal('')),
  
  // Team Information (Matches DB columns after mapping in onSubmit)
  teamSize: z.coerce.number().int().min(1).optional().or(z.literal('')), // Maps to 'team_size'
  hasCoFounder: z.boolean().optional(), // Maps to 'has_co_founder'
  
  // Market Analysis (Matches DB columns after mapping in onSubmit)
  marketGrowthRate: z.string().optional().or(z.literal('')), // Maps to 'market_growth_rate'
  marketKeyTrends: z.string().optional().or(z.literal('')), // Maps to 'market_key_trends'
  targetCustomerProfile: z.string().optional().or(z.literal('')), // Maps to 'target_customer_profile'
  customerPainPoints: z.string().optional().or(z.literal('')), // Maps to 'customer_pain_points'
  marketBarriers: z.string().optional().or(z.literal('')), // Maps to 'market_barriers'
  competitiveAdvantage: z.string().optional().or(z.literal('')), // Maps to 'competitive_advantage'
  competitor1Name: z.string().optional().or(z.literal('')), // Maps to 'competitor1_name'
  competitor1Size: z.string().optional().or(z.literal('')), // Maps to 'competitor1_size'
  competitor1Threat: z.string().optional().or(z.literal('')), // Maps to 'competitor1_threat'
  competitor1Differentiator: z.string().optional().or(z.literal('')), // Maps to 'competitor1_differentiator'
  competitor2Name: z.string().optional().or(z.literal('')), // Maps to 'competitor2_name'
  competitor2Size: z.string().optional().or(z.literal('')), // Maps to 'competitor2_size'
  competitor2Threat: z.string().optional().or(z.literal('')), // Maps to 'competitor2_threat'
  competitor2Differentiator: z.string().optional().or(z.literal('')), // Maps to 'competitor2_differentiator'
  competitor3Name: z.string().optional().or(z.literal('')), // Maps to 'competitor3_name'
  competitor3Size: z.string().optional().or(z.literal('')), // Maps to 'competitor3_size'
  competitor3Threat: z.string().optional().or(z.literal('')), // Maps to 'competitor3_threat'
  competitor3Differentiator: z.string().optional().or(z.literal('')), // Maps to 'competitor3_differentiator'
  
  // Documents & Links (Matches DB columns after mapping in onSubmit)
  website: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  linkedinProfile: z.string().url({ message: 'Please enter a valid LinkedIn URL.' })
    .refine(linkedInUrlValidator, { 
      message: 'Please enter a valid LinkedIn URL.' 
    }).optional().or(z.literal('')), // Maps to 'linkedin_profile'
  twitterProfile: z.string().url({ message: 'Please enter a valid Twitter URL.' }).optional().or(z.literal('')), // Maps to 'twitter_profile'
  logo_url: z.string().url({ message: "Invalid URL format" }).nullable().optional(),
  pitch_deck_url: z.string().url({ message: "Invalid URL format" }).nullable().optional(),
  
  // Funding Status (Matches DB columns after mapping in onSubmit)
  currentFunding: z.string().optional().or(z.literal('')), // Maps to 'current_funding'
  seekingInvestment: z.boolean().optional(), // Maps to 'seeking_investment'
  targetRaiseAmount: z.coerce.number().min(0).optional().or(z.literal('')), // Maps to 'target_raise_amount'
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// TypeScript type inferred from the Zod schema
export type StartupRegistrationData = z.infer<typeof startupRegistrationSchema>; 