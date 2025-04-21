import * as z from 'zod';

// Password validation regex (same as startup)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// LinkedIn URL validation helper (same as startup)
const linkedInUrlValidator = (val: string) => !val || val.includes('linkedin.com');

// Investor Type Enum
const InvestorTypeEnum = z.enum(['Personal', 'Angel', 'VC']);

// Predefined options for preferences (can be expanded later)
const Industries = ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'SaaS', 'Deep Tech', 'Other'];
const Geographies = ['Riyadh', 'Jeddah', 'Dammam/Khobar', 'Other KSA', 'GCC', 'MENA', 'Global'];
const Stages = ['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B+', 'Growth'];

// Zod schema definition for the investor registration form
export const investorRegistrationSchema = z.object({
  // ---- Authentication ----
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
    .regex(passwordRegex, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
    }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, { message: 'Your name must be at least 2 characters.' }), // Combined first/last name for simplicity

  // ---- Profile Details ----
  jobTitle: z.string().min(1, { message: 'Job title is required.' }),
  companyName: z.string().min(1, { message: 'Company name is required.' }),
  investor_type: InvestorTypeEnum,
  website: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  linkedinProfile: z.string().url({ message: 'Please enter a valid LinkedIn URL.' })
    .refine(linkedInUrlValidator, {
      message: 'Please enter a valid LinkedIn URL.'
    }).optional().or(z.literal('')),
  companyDescription: z.string().max(500, { message: 'Description cannot exceed 500 characters.' }).optional().or(z.literal('')),

  // ---- Preferences ----
  preferred_industries: z.array(z.string())
    .min(1, { message: 'Please select at least one preferred industry.' })
    .optional(), // Optional overall, but must have items if provided
  preferred_geography: z.array(z.string())
    .min(1, { message: 'Please select at least one preferred geography.' })
    .optional(), // Optional overall, but must have items if provided
  preferred_stage: z.array(z.string())
     .min(1, { message: 'Please select at least one preferred stage.' })
     .optional(), // Optional overall, but must have items if provided

}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Attach error to confirmPassword field
});

// TypeScript type inferred from the Zod schema
export type InvestorRegistrationData = z.infer<typeof investorRegistrationSchema>;

// Export options for use in the form UI
export { Industries, Geographies, Stages, InvestorTypeEnum }; 