import * as z from 'zod';

// Custom type for File fields
const FileSchema = z.any().optional().nullable();

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// LinkedIn URL validation helper
const linkedInUrlValidator = (val: string) => !val || val.includes('linkedin.com');

// Zod schema definition for the startup registration form
export const startupRegistrationSchema = z.object({
  // Authentication
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
    .regex(passwordRegex, { 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' 
    }),
  confirmPassword: z.string(),
  
  // Founder Background
  founderName: z.string().min(2, { message: 'Your name must be at least 2 characters.' }).optional(),
  founderTitle: z.string().optional(),
  founderEducation: z.string().optional(),
  previousStartupExperience: z.string().optional(),
  founderBio: z.string().max(500, { message: 'Bio cannot exceed 500 characters.' }).optional(),
  techSkills: z.record(z.boolean()).optional(),
  
  // Basic Info
  startupName: z.string().min(2, { message: 'Startup name must be at least 2 characters.' }),
  industry: z.string().min(1, { message: 'Industry is required.' }),
  sector: z.string().min(1, { message: 'Sector is required.' }),
  locationCity: z.string().min(1, { message: 'Location city is required.' }),
  countryOfOperation: z.string().min(1, { message: 'Country is required.' }),

  // Company Details
  companyDescription: z.string().min(20, { message: 'Description must be at least 20 characters.' }).max(500, { message: 'Description cannot exceed 500 characters.' }),
  operationalStage: z.string().min(1, { message: 'Operational stage is required.' }),
  numEmployees: z.coerce.number().int().min(0, { message: 'Number of employees must be positive.' }).optional().or(z.literal('')),
  numCustomers: z.coerce.number().int().min(0, { message: 'Number of customers must be positive.' }).optional().or(z.literal('')),
  annualRevenue: z.coerce.number().min(0, { message: 'Annual revenue must be positive.' }).optional().or(z.literal('')),
  annualExpenses: z.coerce.number().min(0, { message: 'Annual expenses must be positive.' }).optional().or(z.literal('')),
  foundingDate: z.string().optional(),
  
  // Key Metrics
  kpi_cac: z.coerce.number().min(0).optional().or(z.literal('')),
  kpi_clv: z.coerce.number().min(0).optional().or(z.literal('')),
  kpi_retention_rate: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  kpi_conversion_rate: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  // Additional Growth Metrics
  kpi_monthly_growth: z.coerce.number().min(0).max(1000).optional().or(z.literal('')),
  kpi_payback_period: z.coerce.number().min(0).optional().or(z.literal('')),
  kpi_churn_rate: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  kpi_nps: z.coerce.number().min(-100).max(100).optional().or(z.literal('')),
  // Market Metrics
  kpi_tam_size: z.string().optional().or(z.literal('')),
  kpi_avg_order_value: z.coerce.number().min(0).optional().or(z.literal('')),
  kpi_market_share: z.coerce.number().min(0).max(100).optional().or(z.literal('')),
  kpi_yoy_growth: z.coerce.number().min(0).optional().or(z.literal('')),
  
  // Team Information
  teamSize: z.coerce.number().int().min(1).optional().or(z.literal('')),
  hasCoFounder: z.boolean().optional(),
  
  // Market Analysis
  marketGrowthRate: z.string().optional(),
  marketKeyTrends: z.string().optional(),
  targetCustomerProfile: z.string().optional(),
  customerPainPoints: z.string().optional(),
  marketBarriers: z.string().optional(),
  competitiveAdvantage: z.string().optional(),
  competitor1Name: z.string().optional(),
  competitor1Size: z.string().optional(),
  competitor1Threat: z.string().optional(),
  competitor1Differentiator: z.string().optional(),
  competitor2Name: z.string().optional(),
  competitor2Size: z.string().optional(),
  competitor2Threat: z.string().optional(),
  competitor2Differentiator: z.string().optional(),
  competitor3Name: z.string().optional(),
  competitor3Size: z.string().optional(),
  competitor3Threat: z.string().optional(),
  competitor3Differentiator: z.string().optional(),
  
  // Documents & Links
  website: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  linkedinProfile: z.string().url({ message: 'Please enter a valid LinkedIn URL.' })
    .refine(linkedInUrlValidator, { 
      message: 'Please enter a valid LinkedIn URL.' 
    }).optional().or(z.literal('')),
  twitterProfile: z.string().url({ message: 'Please enter a valid Twitter URL.' }).optional().or(z.literal('')),
  companyLogo: FileSchema,
  pitchDeck: FileSchema,
  
  // Funding Status
  currentFunding: z.string().optional(),
  seekingInvestment: z.boolean().optional(),
  targetRaiseAmount: z.coerce.number().min(0).optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// TypeScript type inferred from the Zod schema
export type StartupRegistrationData = z.infer<typeof startupRegistrationSchema>; 