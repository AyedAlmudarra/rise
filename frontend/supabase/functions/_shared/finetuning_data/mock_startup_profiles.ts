import type { StartupRecord } from '../types.ts';

/**
 * ==========================================================================
 * MOCK STARTUP PROFILE INPUT DATA FOR FINE-TUNING
 * ==========================================================================
 *
 * INSTRUCTIONS:
 * 1. Replace the example profiles below with 50 diverse mock StartupRecord objects.
 * 2. Ensure variety in industry, stage, location (KSA focus), data completeness, etc.
 * 3. This data represents the 'input' side of your fine-tuning examples.
 * 4. Each profile here MUST have a corresponding 'ideal output' defined in
 *    'ideal_analysis_outputs.ts' at the same index.
 *
 * NOTE: This file is used during the *offline* data preparation step to generate
 *       the training JSONL file. It is NOT directly used by the Edge Function at runtime.
 * ==========================================================================
 */

export const mockStartupProfilesForTuning: StartupRecord[] = [
  // --- EXAMPLE 1: Early-Stage E-commerce (Needs full data) ---
  {
    id: 'mock-ft-uuid-1', // Use unique IDs for mocks
    user_id: 'mock-user-1',
    name: 'SariStyle E-commerce',
    description: 'Online platform specializing in modern modest fashion sourced from local Saudi designers.',
    industry: 'E-commerce',
    sector: 'Fashion Retail',
    location_city: 'Riyadh',
    country_of_operation: 'Saudi Arabia',
    operational_stage: 'Pre-seed',
    founding_date: '2023-10-01',
    num_employees: 3,
    num_customers: 50,
    annual_revenue: 5000,
    annual_expenses: 20000,
    team_size: 3,
    has_co_founder: true,
    website: 'saristyle.sa',
    pitch_deck_url: 'https://link.to/deck1',
    kpi_cac: 15,
    kpi_clv: 45,
    kpi_retention_rate: 10,
    kpi_monthly_growth: 5,
    kpi_conversion_rate: 1.5,
    kpi_payback_period: 12,
    kpi_churn_rate: 30,
    kpi_nps: null,
    kpi_tam_size: 'SAR 50M (Estimated KSA Modest Fashion)',
    kpi_avg_order_value: 100,
    kpi_market_share: null,
    kpi_yoy_growth: null,
    founder_name: 'Fatima Al-Harbi',
    founder_title: 'CEO & Co-founder',
    founder_education: "Bachelor's in Business Administration",
    previous_startup_experience: 'None',
    founder_bio: 'Passionate about fashion and empowering local designers.',
    tech_skills: { 'E-commerce Platforms': true, 'Digital Marketing': true },
    market_growth_rate: '15% YoY (KSA E-commerce)',
    market_key_trends: 'Growing demand for local brands, online modest fashion.',
    target_customer_profile: 'Young professional women (25-40) in major KSA cities seeking unique, modern modest wear.',
    customer_pain_points: 'Limited online access to curated local designer modest fashion.',
    market_barriers: 'Logistics in KSA, competition from established international brands.',
    competitive_advantage: 'Exclusive focus on curated KSA designers, strong local community angle.',
    competitor1_name: 'Namshi',
    competitor1_differentiator: 'Large scale, international brands, broad category focus.',
    competitor2_name: 'Local Boutiques (Offline)',
    competitor2_differentiator: 'Limited reach, traditional marketing.',
    competitor3_name: null,
    competitor3_differentiator: null,
    current_funding: 'Self-funded',
    seeking_investment: true,
    target_raise_amount: 250000, // SAR
  },

  // --- EXAMPLE 2: B2B SaaS (Needs full data) ---
  {
    id: 'mock-ft-uuid-2',
    user_id: 'mock-user-2',
    name: 'LogistiFlow KSA',
    description: 'AI-powered route optimization SaaS for last-mile delivery companies operating within Saudi Arabia.',
    industry: 'Software as a Service (SaaS)',
    sector: 'Logistics Tech',
    location_city: 'Jeddah',
    country_of_operation: 'Saudi Arabia',
    operational_stage: 'Seed',
    founding_date: '2022-05-15',
    num_employees: 12,
    num_customers: 15,
    annual_revenue: 300000,
    annual_expenses: 500000,
    team_size: 12,
    has_co_founder: true,
    website: 'logistiflow.sa',
    pitch_deck_url: 'https://link.to/deck2',
    kpi_cac: 8000,
    kpi_clv: 50000,
    kpi_retention_rate: 85,
    kpi_monthly_growth: 10,
    kpi_conversion_rate: 20,
    kpi_payback_period: 10,
    kpi_churn_rate: 2,
    kpi_nps: 40,
    kpi_tam_size: 'SAR 100M (KSA Last-Mile Logistics Tech)',
    kpi_avg_order_value: 20000,
    kpi_market_share: 5,
    kpi_yoy_growth: 150,
    founder_name: 'Ahmed Khan',
    founder_title: 'CTO & Co-founder',
    founder_education: "Master's in Computer Science (AI specialization)",
    previous_startup_experience: 'Lead Engineer at previous logistics startup (acquired)',
    founder_bio: 'Experienced tech lead passionate about solving KSA logistics challenges with AI.',
    tech_skills: { 'AI/ML': true, 'Cloud Infrastructure': true, 'SaaS Architecture': true },
    market_growth_rate: '25% YoY (KSA Logistics Tech)',
    market_key_trends: 'Demand for efficiency, real-time tracking, government investment in logistics.',
    target_customer_profile: 'Mid-sized last-mile delivery providers (50-500 vehicles) in KSA.',
    customer_pain_points: 'High fuel costs, inefficient routing, delivery delays, lack of real-time visibility.',
    market_barriers: 'Integration complexity with existing systems, building trust with established players.',
    competitive_advantage: 'Proprietary AI routing algorithm tailored for KSA addresses & traffic patterns, strong technical team.',
    competitor1_name: 'Global Routing Solutions Inc.',
    competitor1_differentiator: 'Generic algorithms, less KSA-specific optimization, higher cost.',
    competitor2_name: 'Manual Planning / Basic Tools',
    competitor2_differentiator: 'Inefficient, lacks real-time adaptation, high operational overhead.',
    competitor3_name: 'FleetMatics (Verizon Connect)',
    competitor3_differentiator: 'Broad fleet management, less specialized in pure route optimization AI.',
    current_funding: 'SAR 1M (Seed Round)',
    seeking_investment: true,
    target_raise_amount: 5000000, // SAR (Series A target)
  },

  // --- EXAMPLE 3: Fintech with Missing Data ---
  {
    id: 'mock-ft-uuid-3',
    user_id: 'mock-user-3',
    name: 'RiyalPay Wallet',
    description: 'Mobile wallet targeting unbanked workers in KSA for remittances and local payments.',
    industry: 'Fintech',
    sector: 'Payments & Remittances',
    location_city: 'Dammam',
    country_of_operation: 'Saudi Arabia',
    operational_stage: 'Seed',
    founding_date: '2023-01-10',
    num_employees: 8,
    num_customers: 5000, // User signups
    annual_revenue: 15000, // Transaction fees (low value)
    annual_expenses: 250000, // Compliance, tech, marketing
    team_size: 8,
    has_co_founder: false,
    website: 'riyalpay.sa',
    pitch_deck_url: null, // Deck not provided
    kpi_cac: 5, // SAR per user
    kpi_clv: null, // Too early to calculate accurately
    kpi_retention_rate: 40, // Monthly active users
    kpi_monthly_growth: 25, // User growth
    kpi_conversion_rate: null,
    kpi_payback_period: null,
    kpi_churn_rate: 15, // Monthly user churn
    kpi_nps: 20,
    kpi_tam_size: 'SAR 2B (KSA Remittance Market Segment)',
    kpi_avg_order_value: null, // N/A for this model
    kpi_market_share: null,
    kpi_yoy_growth: null,
    founder_name: 'Khalid Al-Salem',
    founder_title: 'Founder & CEO',
    founder_education: "Bachelor's in Finance",
    previous_startup_experience: 'Product Manager at local bank',
    founder_bio: 'Driven to improve financial inclusion in the Kingdom.',
    tech_skills: { 'Mobile App Development': true, 'API Integration': true },
    market_growth_rate: '10% YoY (Digital Remittances)',
    market_key_trends: 'Shift to digital channels, regulatory changes (SAMA sandbox).',
    target_customer_profile: 'Expatriate workers sending money home, gig economy workers.',
    customer_pain_points: 'High fees at traditional exchanges, inconvenient access.',
    market_barriers: 'Regulatory hurdles (SAMA licenses), building trust, competition from established banks and STC Pay.',
    competitive_advantage: 'Focus on specific unbanked niche, potentially lower fees via optimized ops.',
    competitor1_name: 'STC Pay',
    competitor1_differentiator: 'Large existing user base, broad financial services, telco integration.',
    competitor2_name: 'Traditional Money Exchanges',
    competitor2_differentiator: 'Established physical presence, brand trust (older demographic).',
    competitor3_name: 'Bank Apps (Al Rajhi, etc)',
    competitor3_differentiator: 'Full banking services, high trust, but may not target unbanked specifically.',
    current_funding: 'SAR 750k (Angel Round)',
    seeking_investment: true,
    target_raise_amount: 3000000, // SAR (Seed Extension / Pre-Series A)
  },

  // --- EXAMPLE 4: Series A HealthTech ---
  {
    id: 'mock-ft-uuid-4',
    user_id: 'mock-user-4',
    name: 'ShifaTech Telemedicine',
    description: 'Platform connecting patients in remote KSA areas with specialized doctors via video consultations and integrating with local pharmacies for e-prescriptions.',
    industry: 'HealthTech',
    sector: 'Telemedicine & Digital Health',
    location_city: 'NEOM', // Example future-focused location
    country_of_operation: 'Saudi Arabia',
    operational_stage: 'Series A',
    founding_date: '2021-03-10',
    num_employees: 45,
    num_customers: 25000, // Active registered patients
    annual_revenue: 4500000, // SAR (Mix of subscription & per-consult fees)
    annual_expenses: 6000000,
    team_size: 45,
    has_co_founder: true,
    website: 'shifatech.sa',
    pitch_deck_url: 'https://link.to/deck4',
    kpi_cac: 80, // SAR per acquired patient
    kpi_clv: 350, // Estimated lifetime value
    kpi_retention_rate: 60, // Annual patient retention
    kpi_monthly_growth: 8, // Patient base growth
    kpi_conversion_rate: 15, // Website visitor to signup
    kpi_payback_period: 14, // Months
    kpi_churn_rate: 4, // Monthly patient churn
    kpi_nps: 55,
    kpi_tam_size: 'SAR 500M (KSA Telemedicine Market Est.)',
    kpi_avg_order_value: 150, // Average revenue per consultation/period
    kpi_market_share: 8, // Estimated
    kpi_yoy_growth: 120,
    founder_name: 'Dr. Aisha Al-Fahad',
    founder_title: 'CEO & Co-founder',
    founder_education: 'MD, Healthcare Management Cert.',
    previous_startup_experience: 'Launched a smaller health clinic booking app',
    founder_bio: 'Physician dedicated to improving healthcare access across the Kingdom using technology.',
    tech_skills: { 'HIPAA/Compliance': true, 'Video Streaming Tech': true, 'EHR Integration': false }, // EHR Integration is a gap
    market_growth_rate: '30% YoY (KSA Digital Health)',
    market_key_trends: 'Government push for digital health (Vision 2030), increasing patient acceptance, focus on remote care.',
    target_customer_profile: 'Individuals and families in Tier 2/3 KSA cities and remote areas lacking easy access to specialist doctors.',
    customer_pain_points: 'Travel time/cost to specialists, long appointment waits, limited local specialist availability.',
    market_barriers: 'Patient trust in remote diagnosis, doctor licensing/credentialing across regions, reliable internet connectivity in some areas, integration with hospital EHRs.',
    competitive_advantage: 'Strong network of KSA-licensed doctors, integration with local pharmacies, first-mover focus on underserved remote areas.',
    competitor1_name: 'Vezeeta',
    competitor1_differentiator: 'Broader focus (booking, pharmacy, telemed), larger regional presence, may lack deep remote area focus.',
    competitor2_name: 'Altibbi',
    competitor2_differentiator: 'Content-heavy platform, strong brand recognition, potentially less focus on live consultation depth.',
    competitor3_name: 'Hospital-Specific Telemed Services',
    competitor3_differentiator: 'Tied to specific hospital network, may not offer broad choice of specialists.',
    current_funding: 'SAR 15M (Series A)',
    seeking_investment: true,
    target_raise_amount: 40000000, // SAR (Series B Target)
  },

  // --- EXAMPLE 5: Seed Stage DTC Sustainable Goods ---
  {
    id: 'mock-ft-uuid-5',
    user_id: 'mock-user-5',
    name: 'Nakhla Naturals',
    description: 'Direct-to-consumer brand offering organic, locally sourced personal care products (soaps, lotions) made from date palm derivatives.',
    industry: 'Consumer Goods',
    sector: 'Personal Care & Cosmetics (Sustainable)',
    location_city: 'Al Hofuf', // Location relevant to source material
    country_of_operation: 'Saudi Arabia',
    operational_stage: 'Seed',
    founding_date: '2023-05-01',
    num_employees: 6,
    num_customers: 1200, // Unique customers
    annual_revenue: 180000, // SAR
    annual_expenses: 350000, // Includes inventory, marketing, R&D
    team_size: 6,
    has_co_founder: true,
    website: 'nakhlanaturals.sa',
    pitch_deck_url: 'https://link.to/deck5',
    kpi_cac: 40, // SAR per customer
    kpi_clv: 120, // Estimated based on repeat purchase rate
    kpi_retention_rate: 35, // % Customers making >1 purchase in 6 months
    kpi_monthly_growth: 15, // Revenue growth
    kpi_conversion_rate: 2.5, // Website traffic to purchase
    kpi_payback_period: 10, // Months
    kpi_churn_rate: null, // Not typically tracked monthly this way for DTC
    kpi_nps: 60,
    kpi_tam_size: 'SAR 1B (KSA Natural Personal Care Est.)',
    kpi_avg_order_value: 150, // SAR
    kpi_market_share: null, // Negligible
    kpi_yoy_growth: null, // Too early
    founder_name: 'Reem Al-Abdullah & Omar Bakr',
    founder_title: 'Co-founders',
    founder_education: 'Chemistry (Reem), Marketing (Omar)',
    previous_startup_experience: 'None',
    founder_bio: 'Combining scientific knowledge with marketing expertise to promote sustainable Saudi products.',
    tech_skills: { 'Shopify/E-commerce Mgmt': true, 'Social Media Marketing': true, 'Supply Chain Basics': false }, // Supply chain weakness
    market_growth_rate: '20% YoY (KSA Natural/Organic Segment)',
    market_key_trends: 'Increased consumer awareness of sustainability, preference for local ingredients, growth of wellness trends.',
    target_customer_profile: 'Environmentally conscious consumers (25-50), primarily women, in urban KSA centers, interested in natural/local products.',
    customer_pain_points: 'Lack of trusted local brands for natural personal care, concerns about ingredients in mass-market products.',
    market_barriers: 'Building brand trust and awareness, scaling production while maintaining quality/sourcing, competition from international natural brands, managing logistics for perishable/sensitive goods.',
    competitive_advantage: 'Unique use of local date palm derivatives, strong sustainability story, authentic KSA brand identity.',
    competitor1_name: 'Lush (International)',
    competitor1_differentiator: 'Global brand recognition, wide product range, physical retail presence, higher price point.',
    competitor2_name: 'iHerb/Online Retailers (selling intl. brands)',
    competitor2_differentiator: 'Massive selection, convenience, price competition, lacks local connection.',
    competitor3_name: 'Small Local Artisan Soap Makers',
    competitor3_differentiator: 'Authentic, very small scale, limited marketing reach, variable quality.',
    current_funding: 'SAR 500k (Friends & Family / Angel)',
    seeking_investment: true,
    target_raise_amount: 2000000, // SAR (Seed Round)
  },

  // --- EXAMPLE 6: EdTech Vocational Training Platform ---
  {
      id: 'mock-ft-uuid-6',
      user_id: 'mock-user-6',
      name: 'MaharaHub',
      description: 'Online platform offering accredited vocational training courses (e.g., HVAC repair, electrical wiring, plumbing) targeting young Saudis, with employer partnerships for job placement.',
      industry: 'EdTech',
      sector: 'Vocational Training & Skilling',
      location_city: 'Riyadh',
      country_of_operation: 'Saudi Arabia',
      operational_stage: 'Seed',
      founding_date: '2022-11-01',
      num_employees: 15,
      num_customers: 800, // Enrolled students
      annual_revenue: 600000, // SAR (Course fees, employer fees)
      annual_expenses: 900000,
      team_size: 15,
      has_co_founder: true,
      website: 'maharahub.sa',
      pitch_deck_url: 'https://link.to/deck6',
      kpi_cac: 250, // SAR per student enrollment
      kpi_clv: 1000, // Estimated (includes potential employer placement fees)
      kpi_retention_rate: 70, // Course completion rate
      kpi_monthly_growth: 12, // New student enrollment growth
      kpi_conversion_rate: 8, // Lead to enrollment
      kpi_payback_period: 9, // Months
      kpi_churn_rate: 5, // Student dropout rate (monthly)
      kpi_nps: 50,
      kpi_tam_size: 'SAR 800M (KSA Vocational Training Market Est.)',
      kpi_avg_order_value: 750, // Average course fee revenue per student
      kpi_market_share: null, // Negligible
      kpi_yoy_growth: null, // Too early
      founder_name: 'Faisal Al-Mohaimeed & Sara Al-Zamil',
      founder_title: 'CEO & Head of Partnerships',
      founder_education: 'Engineering (Faisal), HR/Business (Sara)',
      previous_startup_experience: 'Faisal worked at TVTC, Sara in corporate HR',
      founder_bio: 'Passionate about addressing youth unemployment and skills gap in KSA through practical, accessible training.',
      tech_skills: { 'LMS Platforms': true, 'Video Production': true, 'Job Board Integration': true, 'Accreditation Processes': false }, // Accreditation process knowledge gap?
      market_growth_rate: '18% YoY (KSA EdTech - Skilling Focus)',
      market_key_trends: 'Vision 2030 focus on vocational skills, government initiatives (HRDF), employer demand for skilled trades, digitalization of training.',
      target_customer_profile: 'Young Saudi nationals (18-30) seeking practical job skills, high school graduates, career changers.',
      customer_pain_points: 'Lack of accessible, high-quality vocational training; mismatch between traditional education and job market needs; difficulty finding entry-level skilled trade jobs.',
      market_barriers: 'Ensuring course accreditation and quality, building trust with students and employers, competition from government training centers (TVTC) and potentially other EdTechs, scaling hands-on components online.',
      competitive_advantage: 'Strong employer partnership model for job placement, focus on high-demand trades, potentially more modern/flexible online delivery than traditional centers.',
      competitor1_name: 'TVTC (Technical and Vocational Training Corporation)',
      competitor1_differentiator: 'Government-backed, large scale, physical centers, established accreditation, potentially less flexible/modern.',
      competitor2_name: 'Coursera/Udemy/International Platforms',
      competitor2_differentiator: 'Broad course catalog, global brand, less focus on local accreditation/job placement, content may not be KSA-specific.',
      competitor3_name: 'In-House Training by Large Companies',
      competitor3_differentiator: 'Highly specific to company needs, limited accessibility, variable quality.',
      current_funding: 'SAR 1.5M (Seed Round)',
      seeking_investment: true,
      target_raise_amount: 6000000, // SAR (Series A Target)
  },

  // ... CONTINUE ADDING EXAMPLES UP TO 50 ...

]; 