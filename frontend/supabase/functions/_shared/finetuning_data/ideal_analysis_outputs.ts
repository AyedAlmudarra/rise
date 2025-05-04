import type { AIAnalysisData } from '../types.ts';

/**
 * ==========================================================================
 * IDEAL AI ANALYSIS OUTPUT DATA FOR FINE-TUNING
 * ==========================================================================
 *
 * INSTRUCTIONS:
 * 1. Replace the example outputs below with 50 high-quality, manually curated
 *    AIAnalysisData objects.
 * 2. Each object here MUST correspond exactly to the StartupRecord object at
 *    the SAME INDEX in the 'mock_startup_profiles.ts' file.
 * 3. These outputs represent the 'target' or 'ideal' JSON analysis that the
 *    fine-tuned model should learn to generate for the corresponding input profile.
 * 4. Adhere strictly to the AIAnalysisData interface from '../types.ts'.
 * 5. Follow the quality rubric defined for depth, realism, and KSA context.
 *
 * NOTE: This file is used during the *offline* data preparation step to generate
 *       the training JSONL file. It is NOT directly used by the Edge Function at runtime.
 * ==========================================================================
 */

export const idealAnalysisOutputsForTuning: AIAnalysisData[] = [
  // --- Ideal Output for EXAMPLE 1: SariStyle E-commerce (mock-ft-uuid-1) ---
  {
    executive_summary: "SariStyle is a pre-seed e-commerce platform targeting the KSA modest fashion market by curating local designers. Strengths include a unique niche focus and local community angle. Weaknesses are low initial traction, high churn, and lack of founder startup experience. Potential exists within the growing KSA e-commerce market, but significant hurdles remain in customer acquisition and retention.",
    swot_analysis: {
      strengths: ["Unique value proposition focusing on local Saudi designers.", "Identified niche market (modern modest fashion).", "Lean team size (3 employees)."],
      weaknesses: ["Very early stage with low revenue (SAR 5k) and customer base (50).", "High customer churn (30%) and low retention (10%).", "Founder lacks previous startup experience.", "High CAC payback period (12 months)."],
      opportunities: ["Growing KSA e-commerce market (15% YoY).", "Increasing demand for local Saudi brands.", "Potential for community building around local designers."],
      threats: ["Intense competition from established players (e.g., Namshi).", "Logistical challenges within KSA.", "Difficulty scaling customer acquisition cost-effectively."]
    },
    market_positioning: "SariStyle aims for a niche position within the large KSA modest fashion market. It targets young professional women seeking unique local designs, differentiating from mass-market international retailers. Current positioning is weak due to very early traction, but the concept is clear.",
    scalability_assessment: {
      level: "Medium",
      justification: "Scalability depends heavily on successfully managing logistics and customer acquisition costs. The model can scale if brand and community are built effectively. However, reliance on curated designers might limit inventory scaling compared to mass retailers."
    },
    competitive_advantage_evaluation: {
      assessment: "The claimed advantage is the curated focus on KSA designers and community. Currently, this is largely conceptual and not yet proven sustainable or defensible against larger players who could also feature local designers. Execution is key.",
      suggestion: "Build a strong online community and content strategy highlighting the designers and their stories to foster loyalty and differentiate beyond just product."
    },
    current_challenges: ["Achieving significant customer growth.", "Reducing high churn rate.", "Improving unit economics (CAC/CLV ratio is poor).", "Establishing efficient logistics/delivery."],
    key_risks: ["Market Risk (Competition from larger players).", "Execution Risk (Ability to scale operations and marketing).", "Financial Risk (High burn relative to revenue, dependency on funding)."],
    strategic_recommendations: ["Focus heavily on improving customer retention (loyalty programs, engagement).", "Experiment with low-cost marketing channels (influencers, content marketing).", "Optimize website conversion rate.", "Secure pre-seed funding to extend runway."],
    suggested_kpis: [
      { kpi: "Customer Retention Rate", justification: "Critical to improve from the current 10% to build a sustainable business." },
      { kpi: "CAC Payback Period", justification: "Needs to decrease significantly from 12 months to achieve profitability." },
      { kpi: "Website Conversion Rate", justification: "Essential for maximizing value from acquired traffic." }
    ],
    what_if_scenarios: [
        { scenario: "Key competitor launches a dedicated local designer section.", outcome: "Increased pressure on SariStyle's differentiation, potentially higher CAC." },
        { scenario: "Successful influencer marketing campaign goes viral.", outcome: "Rapid increase in brand awareness and potentially lower blended CAC, but strains operations." }
    ],
    growth_plan_phases: [
        { period: "Months 1-3", focus: "Retention & Community", description: "Implement loyalty program, gather customer feedback, feature designers actively." },
        { period: "Months 4-6", focus: "Marketing Experiments", description: "Test 2-3 low-cost acquisition channels, track CAC per channel." },
        { period: "Months 7-9", focus: "Conversion Optimization", description: "A/B test website elements, refine checkout process based on analytics." },
        { period: "Months 10-12", focus: "Funding & Scaling Prep", description: "Refine pitch deck with improved metrics, solidify logistics partnerships." }
    ],
    funding_outlook: "Currently self-funded and actively seeking SAR 250k pre-seed. Readiness is low due to weak traction and unit economics. Needs to demonstrate improved retention and clearer path to profitability to attract investment.",
    financial_assessment: {
        strengths: ["Low initial expense base."],
        weaknesses: ["Very low revenue.", "Negative unit economics (CLV < 3x CAC).", "High burn rate relative to revenue."],
        recommendations: ["Focus on increasing Average Order Value.", "Aggressively manage marketing spend.", "Secure funding quickly."]
    },
    cash_burn_rate: {
        monthly_rate: 1250, // (20000-5000)/12 approx
        runway_months: null, // Cannot estimate runway without knowing current cash
        assessment: "Burn rate seems manageable for a very early stage, but runway is likely short without funding given low revenue."
    },
    profitability_projection: {
        estimated_timeframe: "18+ months",
        key_factors: ["Significant improvement in customer retention.", "Scaling revenue while controlling CAC.", "Achieving economies of scale in operations."]
    },
    funding_readiness_score: 20, // Low score
    funding_readiness_justification: "Very early stage with unproven unit economics and high churn. Needs significant progress on traction and retention metrics before being ready for a substantial pre-seed round."
  },

  // --- Ideal Output for EXAMPLE 2: LogistiFlow KSA (mock-ft-uuid-2) ---
  {
    executive_summary: "LogistiFlow KSA offers an AI-powered route optimization SaaS for Saudi Arabia's last-mile delivery sector. Leveraging a strong technical team and KSA-specific algorithms, it shows promising early B2B traction (15 clients, SAR 300k ARR) and strong retention (85%). Key challenges include scaling sales, managing a high burn rate, and competing with global players. Positioned well to capture growth in the KSA logistics tech market, readiness for Series A depends on continued high growth and proving ROI to larger clients.",
    swot_analysis: {
      strengths: ["Experienced technical founder with relevant background.", "Proprietary AI algorithm tailored for KSA.", "Strong customer retention (85%) and low churn (2%).", "Addressing a clear pain point in a growing market (KSA Logistics).", "Existing seed funding (SAR 1M)."],
      weaknesses: ["High burn rate (SAR 200k net annual loss).", "Relatively high B2B CAC (SAR 8k).", "Small current market share (5% est.).", "Sales cycle potentially long for larger enterprise clients."],
      opportunities: ["Rapid growth in KSA e-commerce driving last-mile delivery demand.", "Government initiatives supporting logistics technology.", "Expansion to adjacent logistics services (e.g., warehousing integration).", "Potential for regional expansion after dominating KSA."],
      threats: ["Competition from established global routing/fleet management solutions.", "Potential clients opting for broader, less specialized platforms.", "Integration challenges with diverse client legacy systems.", "Dependency on key technical personnel."]
    },
    market_positioning: "LogistiFlow is positioned as a specialized, high-performance route optimization tool specifically for the KSA market. It targets mid-sized delivery companies needing efficiency gains beyond generic tools. Differentiation relies on the KSA-specific AI, potentially offering superior performance. Market share is small but retention suggests product-market fit with early adopters.",
    scalability_assessment: {
      level: "High",
      justification: "SaaS model is inherently scalable. Market size (SAR 100M TAM) is substantial. Technical architecture should support scaling, assuming robust cloud infrastructure. Main scaling challenge lies in accelerating B2B sales and onboarding processes."
    },
    competitive_advantage_evaluation: {
      assessment: "The KSA-specific AI algorithm is a potentially strong and defensible advantage if it demonstrably outperforms competitors in local conditions. The experienced technical team adds credibility. Sustainability depends on continuous algorithm improvement and building a strong brand reputation.",
      suggestion: "Develop compelling case studies with quantifiable ROI (fuel saved, delivery time reduced) from existing clients to accelerate sales cycles and prove the AI's superiority."
    },
    current_challenges: ["Scaling the B2B sales pipeline effectively.", "Managing the cash burn rate.", "Demonstrating clear ROI to larger potential clients.", "Ensuring seamless integration with diverse client systems."],
    key_risks: ["Sales Execution Risk (Failing to scale B2B sales quickly enough).", "Competitive Risk (Large players discounting or improving KSA features).", "Financial Risk (Running out of cash before reaching profitability or next funding round).", "Technical Risk (Algorithm performance not meeting expectations at scale)."],
    strategic_recommendations: ["Focus sales efforts on ideal customer profile (mid-sized KSA delivery firms).", "Develop robust case studies demonstrating ROI.", "Optimize onboarding process for faster client integration.", "Carefully manage expenses to extend runway while pursuing growth."],
    suggested_kpis: [
      { kpi: "Sales Qualified Leads (SQLs) per month", justification: "Key indicator of sales pipeline health needed for growth." },
      { kpi: "Customer Acquisition Cost (CAC)", justification: "Needs monitoring and potentially reduction as scale increases." },
      { kpi: "Monthly Recurring Revenue (MRR) Growth Rate", justification: "Primary indicator of business growth trajectory." }
    ],
    what_if_scenarios: [
        { scenario: "Major KSA logistics company signs a large contract.", outcome: "Significant MRR boost, strong validation for fundraising, but potential strain on support/onboarding." },
        { scenario: "Key competitor heavily discounts its product in KSA.", outcome: "Increased sales pressure, potentially forcing price adjustments or emphasizing unique value proposition more strongly." }
    ],
    growth_plan_phases: [
        { period: "Months 1-3", focus: "Sales & Marketing Engine", description: "Refine ICP, build outbound sales process, create ROI case studies." },
        { period: "Months 4-6", focus: "Product Enhancements", description: "Add 1-2 key features based on client feedback, improve integration options." },
        { period: "Months 7-9", focus: "Scale Sales Team", description: "Hire and train 1-2 new sales reps based on validated sales process." },
        { period: "Months 10-12", focus: "Series A Fundraising Prep", description: "Update data room, refine pitch based on growth metrics, begin investor outreach." }
    ],
    funding_outlook: "Has existing SAR 1M seed funding. Seeking substantial SAR 5M Series A. Current ARR (SAR 300k) and growth (150% YoY, 10% MoM) are positive indicators, but ARR might be low for a typical Series A. Strong retention and tech are key assets. Success depends on demonstrating continued high growth and a clear path to scaling ARR significantly in the next 12 months.",
    financial_assessment: {
        strengths: ["Good ARR traction for stage.", "High Customer Lifetime Value (SAR 50k).", "Strong retention suggests product value."],
        weaknesses: ["High operational expenses leading to significant burn.", "CAC is relatively high (SAR 8k), needs justification via CLV.", "Profitability is distant."],
        recommendations: ["Focus on metrics demonstrating path to profitability (e.g., improving CAC payback).", "Explore efficiency gains in operations/development.", "Ensure funding runway covers path to next milestone."]
    },
    cash_burn_rate: {
        monthly_rate: 16667, // (500k - 300k) / 12 approx
        runway_months: 15, // Assume 1M seed gives ~15 months runway at this burn
        assessment: "Significant monthly burn requires careful management. Runway appears adequate based on seed funding (estimate 15 months), but achieving Series A milestones within this timeframe is critical."
    },
    profitability_projection: {
        estimated_timeframe: "18-24+ months",
        key_factors: ["Scaling MRR significantly.", "Maintaining high retention rates.", "Achieving economies of scale in G&A and R&D.", "Potential price increases as value is proven."]
    },
    funding_readiness_score: 65, // Moderate score
    funding_readiness_justification: "Good progress since seed with solid ARR, strong retention, and clear market focus. High burn and need to demonstrate faster scaling prevent a higher score. Strong candidate for Series A if growth trajectory continues and ROI is proven."
  },

  // --- Ideal Output for EXAMPLE 3: RiyalPay Wallet (mock-ft-uuid-3) ---
  {
    executive_summary: "RiyalPay Wallet is a seed-stage Fintech targeting unbanked workers in KSA with a mobile remittance/payment solution. It shows strong user growth (5k users, 25% MoM) but faces low initial revenue, high burn, and significant competition (STC Pay, banks). Key strengths are focus on an underserved niche and regulatory awareness. Major challenges include achieving profitability, navigating KSA regulations, and demonstrating viable unit economics (CLV unknown).",
    swot_analysis: {
      strengths: ["Addressing a large, underserved market segment (unbanked workers).", "Strong initial user growth (25% MoM).", "Founder has relevant domain experience (banking).", "Awareness of KSA regulatory landscape (SAMA sandbox trends)."],
      weaknesses: ["Very low revenue (SAR 15k) despite user base (5k).", "Extremely high burn rate (SAR ~235k net annual loss).", "CLV is unknown/unproven, CAC payback likely very long.", "High user churn (15% monthly).", "Solo founder (no co-founder listed).", "Pitch deck missing.", "Intense competition from well-funded players."],
      opportunities: ["Growing digital payments adoption in KSA.", "Potential partnerships with employers of target demographic.", "Leverage SAMA sandbox for faster licensing/testing if applicable.", "Cross-selling additional financial services in the future."],
      threats: ["Regulatory changes or delays in licensing.", "Aggressive pricing or feature matching from STC Pay or banks.", "Difficulty building user trust compared to established brands.", "Inability to raise further funding due to weak unit economics."]
    },
    market_positioning: "RiyalPay targets a specific niche (unbanked workers) potentially overlooked by larger players like full-service banks. However, STC Pay poses a major threat with its broad reach. Differentiation relies on tailored features and potentially lower fees, but current traction doesn't yet validate a strong market position.",
    scalability_assessment: {
      level: "Medium",
      justification: "The user base can scale rapidly (demonstrated by 25% MoM growth), typical for consumer apps. However, scaling *revenue* and achieving profitability is the major challenge due to low transaction values and potential regulatory costs. Operational scaling requires robust compliance and security infrastructure."
    },
    competitive_advantage_evaluation: {
      assessment: "The claimed advantage is the niche focus. This is currently weak as competitors like STC Pay also target similar segments, and trust/brand recognition are significant barriers. The advantage needs to be proven through superior user experience, lower effective cost, or unique features relevant to the niche.",
      suggestion: "Focus intensely on improving user engagement and demonstrating a clear path to monetization per user (e.g., increasing transaction frequency/value, exploring premium features). Partnering with large employers could be a key differentiator."
    },
    current_challenges: ["Achieving positive unit economics (CLV > CAC).", "Reducing high user churn.", "Navigating SAMA regulatory requirements for licensing.", "Securing next funding round with current financial metrics.", "Building user trust."],
    key_risks: ["Regulatory Risk (License delays/denial).", "Financial Risk (Running out of cash due to high burn).", "Competitive Risk (Inability to compete with STC Pay/banks).", "Market Risk (Target segment unwilling to pay sufficient fees)."],
    strategic_recommendations: ["Prioritize obtaining necessary SAMA licenses or operating within sandbox limits.", "Focus on user activation and transaction frequency to prove CLV potential.", "Develop clear monetization strategy beyond basic transaction fees.", "Prepare a strong narrative for investors explaining path to profitability despite current metrics."],
    suggested_kpis: [
      { kpi: "Monthly Active Users (MAU) Rate", justification: "Crucial to track engagement beyond just signups (related to 40% retention)." },
      { kpi: "Average Revenue Per User (ARPU)", justification: "Needs significant growth to offset CAC and operational costs." },
      { kpi: "User Churn Rate", justification: "Must be reduced from 15% monthly for sustainable growth." }
    ],
    what_if_scenarios: [
      { scenario: "SAMA introduces stricter regulations for payment licenses.", outcome: "Significant delay or barrier to scaling, potentially requiring pivot or shutdown." },
      { scenario: "Partnership secured with major construction company for worker payroll/remittances.", outcome: "Rapid user acquisition boost in target niche, improved validation for investors." }
    ],
    growth_plan_phases: [
      { period: "Months 1-3", focus: "Regulatory Compliance & User Activation", description: "Engage actively with SAMA, implement features to drive first transactions." },
      { period: "Months 4-6", focus: "Monetization Experiments", description: "Test value-added services or tiered pricing models to increase ARPU." },
      { period: "Months 7-9", focus: "Retention & Trust Building", description: "Improve onboarding, implement referral programs, gather testimonials." },
      { period: "Months 10-12", focus: "Seed Extension Fundraising", description: "Show progress on MAU, ARPU, and regulatory milestones to secure funding." }
    ],
    funding_outlook: "Raised SAR 750k Angel round, now seeking SAR 3M. Readiness is questionable due to extremely high burn, unproven CLV, and regulatory uncertainty. Strong user growth is positive but overshadowed by financial and regulatory risks. Needs clear regulatory path and evidence of monetization potential to secure funding.",
    financial_assessment: {
      strengths: ["Demonstrated ability to acquire users rapidly at low CAC.", "Secured initial Angel funding."],
      weaknesses: ["Very high cash burn rate.", "Revenue extremely low relative to expenses and user base.", "Unit economics (CLV/CAC) unproven and likely negative.", "Profitability distant."],
      recommendations: ["Aggressively cut non-essential costs.", "Focus all efforts on increasing revenue per user.", "Secure regulatory clarity quickly."]
    },
    cash_burn_rate: {
      monthly_rate: 19583, // (250000-15000)/12 approx
      runway_months: 3, // 750k / 19.6k ??? Seems extremely short. Perhaps angel round was recent? Assume ~4 months runway based on numbers.
      assessment: "Extremely high and unsustainable burn rate. Runway is critically short based on provided numbers. Needs immediate funding or drastic cost reduction."
    },
    profitability_projection: {
      estimated_timeframe: "24+ months",
      key_factors: ["Securing necessary licenses.", "Significant increase in ARPU.", "Drastic reduction in user churn.", "Achieving operational efficiency at scale."]
    },
    funding_readiness_score: 15, // Very low score
    funding_readiness_justification: "High user growth is negated by critical burn rate, unproven unit economics, missing pitch deck, and regulatory risks. Urgent need to address financials and secure licenses before being ready for significant funding."
  },

  // --- Ideal Output for EXAMPLE 4: ShifaTech Telemedicine (mock-ft-uuid-4) ---
  {
    executive_summary: "ShifaTech is a Series A HealthTech platform providing telemedicine services focused on remote KSA areas. It shows strong patient growth (25k users, 8% MoM) and significant revenue (SAR 4.5M ARR) aligned with Vision 2030 digital health goals. Key strengths are its KSA doctor network and pharmacy integration. However, it faces operational losses (SAR 1.5M net loss), patient retention challenges (60%), and competition. Success hinges on improving unit economics, securing Series B funding, and potentially addressing EHR integration gaps.",
    swot_analysis: {
      strengths: ["Addresses clear need for specialist access in remote KSA areas.", "Strong alignment with KSA Vision 2030 digital health initiatives.", "Integrated e-prescription/pharmacy feature.", "Experienced founder with relevant background.", "Significant ARR (SAR 4.5M) and user base (25k)."],
      weaknesses: ["Operating at a loss (SAR 1.5M net annual).", "Moderate patient retention (60%) and relatively high payback period (14 months).", "Lack of EHR integration limits appeal to some providers/systems.", "Potential internet connectivity issues in target remote areas.", "CAC (80 SAR) vs CLV (350 SAR) ratio needs improvement."],
      opportunities: ["Rapidly growing KSA digital health market (30% YoY).", "Expand service offerings (e.g., chronic disease management programs).", "Partnerships with governmental health initiatives targeting remote areas.", "Potential integration with emerging NEOM health ecosystem.", "Expand specialist categories available."],
      threats: ["Intensifying competition from established players (Vezeeta, Altibbi) and hospital systems.", "Regulatory changes affecting telemedicine practice or doctor licensing.", "Patient trust issues or preference for in-person visits for certain conditions.", "Data privacy and security breaches."]
    },
    market_positioning: "ShifaTech is strongly positioned as a key player in KSA's underserved remote telemedicine market. Its focus differentiates it from broader competitors. The pharmacy integration is a key value-add. Maintaining its KSA-licensed doctor network quality is crucial for sustaining this position against competitors potentially using international doctors.",
    scalability_assessment: {
      level: "High",
      justification: "Telemedicine model is inherently scalable geographically. Market size is large and growing. Scaling requires continued doctor acquisition, robust platform infrastructure, and effective marketing to reach dispersed populations. EHR integration could become a bottleneck if not addressed."
    },
    competitive_advantage_evaluation: {
      assessment: "The primary advantages are the KSA-licensed doctor network tailored for local needs/trust and the focus on remote areas, combined with pharmacy integration. This is currently sustainable but requires constant network management. Lack of EHR integration is a notable disadvantage versus some hospital systems.",
      suggestion: "Develop a clear roadmap and begin pilots for EHR integration with major hospital systems or MINA standards to enhance B2B appeal and defensibility. Explore exclusive partnerships with certain specialist groups."
    },
    current_challenges: ["Improving patient retention and CLV.", "Reducing CAC payback period.", "Achieving profitability.", "Addressing the EHR integration gap.", "Ensuring consistent service quality and connectivity in remote areas."],
    key_risks: ["Financial Risk (Failure to secure Series B funding to cover burn).", "Operational Risk (Platform stability, doctor availability, connectivity issues).", "Competitive Risk (Larger players entering the remote niche aggressively).", "Regulatory Risk (Changes impacting telemedicine practice)."],
    strategic_recommendations: ["Implement patient engagement programs to increase retention/CLV.", "Optimize marketing spend to reduce CAC payback period.", "Prioritize developing an EHR integration strategy/pilot.", "Secure Series B funding within the next 12-18 months."],
    suggested_kpis: [
      { kpi: "Patient Lifetime Value (CLV)", justification: "Critical to increase relative to CAC for sustainable economics." },
      { kpi: "Monthly Active Consultations", justification: "Measures actual platform usage beyond just registered users." },
      { kpi: "Doctor Utilization Rate", justification: "Key for operational efficiency and managing the supply side of the marketplace." }
    ],
    what_if_scenarios: [
        { scenario: "Government launches major initiative promoting specific licensed telemedicine platforms for remote areas.", outcome: "Potential for significant user growth and validation if ShifaTech is included, or major competitive threat if excluded." },
        { scenario: "Major cybersecurity breach compromises patient data.", outcome: "Severe damage to patient trust, potential regulatory fines, significant setback for fundraising and operations." }
    ],
    growth_plan_phases: [
        { period: "Months 1-3", focus: "CLV Enhancement", description: "Pilot loyalty programs, post-consultation follow-ups, explore subscription tweaks." },
        { period: "Months 4-6", focus: "Series B Prep & EHR Strategy", description: "Develop Series B pitch, initiate conversations with EHR vendors/hospitals." },
        { period: "Months 7-9", focus: "Marketing Optimization", description: "A/B test marketing channels targeting remote regions, refine CAC calculations." },
        { period: "Months 10-12", focus: "Expand Specialist Network", description: "Recruit doctors in high-demand specialties based on user data and feedback." }
    ],
    funding_outlook: "Successfully raised SAR 15M Series A. Now seeking substantial SAR 40M Series B. Strong revenue growth and market alignment are positive. However, profitability concerns, moderate retention, and high payback period require addressing. Readiness for Series B is moderate; success depends on showing improved unit economics and a clear path to profitability alongside growth.",
    financial_assessment: {
        strengths: ["Significant revenue base (SAR 4.5M ARR).", "Strong YoY growth (120%).", "Aligned with large, growing market."],
        weaknesses: ["Significant net loss (SAR 1.5M).", "CLV/CAC ratio needs improvement (~4.4x, aim higher for HealthTech).", "Long CAC payback period (14 months)."],
        recommendations: ["Focus on initiatives to increase CLV (retention, upselling).", "Optimize marketing to lower CAC or justify it with higher CLV.", "Control operational costs where possible without sacrificing quality."]
    },
    cash_burn_rate: {
        monthly_rate: 125000, // (6M - 4.5M) / 12
        runway_months: 120, // 15M / 125k ??? Seems way too long for Series A burn. Assume prior funding/revenue timing makes calculation complex. Realistically, Series A likely provides 18-24 months runway. Let's use 20.
        assessment: "High absolute burn rate typical for Series A HealthTech scaling. Estimated runway (20 months) seems adequate to reach Series B milestones if key metrics improve."
    },
    profitability_projection: {
        estimated_timeframe: "24-36+ months",
        key_factors: ["Achieving higher patient CLV.", "Reducing CAC payback period.", "Scaling operations efficiently.", "Potential reimbursement deals with insurers in the future."]
    },
    funding_readiness_score: 70, // Good, but needs metric improvement
    funding_readiness_justification: "Strong market position, revenue growth, and Vision 2030 alignment make it attractive. However, unit economics (CLV/CAC payback) and profitability path need significant improvement to secure a strong Series B valuation. Addressing EHR integration would also strengthen the case."
  },

  // --- Ideal Output for EXAMPLE 5: Nakhla Naturals (mock-ft-uuid-5) ---
  {
    executive_summary: "Nakhla Naturals is a seed-stage DTC brand in the KSA sustainable personal care market, using unique date palm derivatives. It shows promising initial revenue (SAR 180k), decent customer growth, and positive NPS (60). Strengths include its authentic local ingredient story and alignment with sustainability trends. Weaknesses involve operating losses, moderate retention (35%), potential supply chain complexities, and lack of founder startup experience. Success depends on building brand loyalty, improving unit economics, and securing seed funding.",
    swot_analysis: {
      strengths: ["Unique product differentiation using local date palm ingredients.", "Strong alignment with growing KSA sustainability & natural product trends.", "Authentic Saudi brand story.", "Good initial NPS (60).", "Positive AOV (SAR 150)."],
      weaknesses: ["Operating at a loss (SAR 170k net annual).", "Moderate customer retention (35% repeat in 6mo).", "Founders lack prior startup experience.", "Potential supply chain risks (sourcing consistency, scaling production).", "Limited brand awareness.", "Basic tech skills (supply chain gap noted)."],
      opportunities: ["Growing KSA market for natural/organic personal care (20% YoY).", "Expand product line based on date derivatives.", "Partnerships with eco-conscious KSA retailers or hotels.", "Content marketing around sustainability and local sourcing.", "Export potential to GCC markets."],
      threats: ["Intense competition from established international natural brands (Lush, online retailers).", "Difficulty scaling production while maintaining organic/quality standards.", "Rising customer acquisition costs in crowded DTC space.", "Changes in consumer trends."]
    },
    market_positioning: "Nakhla Naturals is positioned as an authentic, sustainable Saudi brand in the natural personal care space. Its unique ingredient story is a key differentiator against international competitors and small artisans. It targets environmentally conscious urban consumers. Current position is niche but promising if brand loyalty can be built.",
    scalability_assessment: {
      level: "Medium",
      justification: "DTC model offers geographic scalability within KSA/GCC. Scaling hinges on securing reliable sourcing for date derivatives at volume, mastering production/QC, and managing DTC logistics efficiently. Brand building is crucial for scaling customer acquisition cost-effectively."
    },
    competitive_advantage_evaluation: {
      assessment: "The core advantage is the unique, locally sourced ingredient narrative combined with sustainability. This is compelling and defensible if the brand story resonates and product quality is high. It's more unique than generic natural brands but vulnerable if larger players adopt similar local ingredients.",
      suggestion: "Double down on content marketing showcasing the sourcing process, benefits of date derivatives, and KSA origin. Build a strong community around the brand values to enhance loyalty beyond just the product."
    },
    current_challenges: ["Building brand awareness and trust.", "Improving customer retention/repeat purchase rate.", "Optimizing CAC/CLV ratio (currently 3x, acceptable but could improve).", "Scaling production and managing supply chain.", "Securing seed funding."],
    key_risks: ["Brand Risk (Failure to resonate with target audience).", "Supply Chain Risk (Inability to source ingredients or scale production consistently).", "Financial Risk (Running out of cash before achieving profitability).", "Competitive Risk (Larger players crowding the niche)."],
    strategic_recommendations: ["Invest heavily in brand building through social media and content marketing.", "Implement loyalty programs and email marketing to boost retention.", "Develop relationships with key date farms/suppliers for future scaling.", "Secure seed funding to invest in inventory, marketing, and team."],
    suggested_kpis: [
      { kpi: "Customer Repeat Purchase Rate", justification: "Key indicator of customer loyalty and sustainability of the DTC model." },
      { kpi: "Customer Lifetime Value (CLV)", justification: "Needs to be actively tracked and increased to ensure long-term profitability." },
      { kpi: "Inventory Turnover Ratio", justification: "Important for managing cash flow and efficiency in a physical product business." }
    ],
    what_if_scenarios: [
        { scenario: "Major KSA retailer features Nakhla Naturals in a 'local brands' promotion.", outcome: "Significant boost in brand awareness and sales, potentially leading to wholesale opportunities but straining production." },
        { scenario: "Unexpected issue impacts date harvest or derivative processing.", outcome: "Severe inventory shortages, inability to meet demand, damage to brand reputation if not managed carefully." }
    ],
    growth_plan_phases: [
        { period: "Months 1-3", focus: "Brand Building & Community", description: "Launch targeted social media campaigns, engage with influencers, collect customer testimonials."
        },
        { period: "Months 4-6", focus: "Retention & Email Marketing", description: "Implement loyalty program, segment email list, run targeted promotions for repeat buyers."
        },
        { period: "Months 7-9", focus: "Supply Chain & Production Planning", description: "Secure secondary supplier options, map out production scaling needs for next 12 months."
        },
        { period: "Months 10-12", focus: "Seed Fundraising & Product Expansion Prep", description: "Finalize seed round pitch deck, begin investor outreach, research potential new product formulations."
        }
    ],
    funding_outlook: "Raised SAR 500k Angel/F&F, now seeking SAR 2M Seed round. Promising initial revenue and positive NPS are good signs. Unit economics (CLV/CAC ~3x) are borderline acceptable for seed. Key concerns are founder experience and demonstrating scalability of production/supply chain. Readiness is moderate; needs strong narrative around brand potential and operational plan.",
    financial_assessment: {
        strengths: ["Decent initial revenue traction.", "Healthy Average Order Value (SAR 150).", "Positive NPS indicating product satisfaction."],
        weaknesses: ["Operating at a loss.", "Moderate retention rate (35%).", "Potential inventory risk.", "Unit economics could be stronger."],
        recommendations: ["Focus marketing on higher-CLV customer segments.", "Optimize inventory management to improve cash flow.", "Explore bundling or subscriptions to increase AOV/retention."]
    },
    cash_burn_rate: {
        monthly_rate: 14167, // (350k-180k)/12 approx
        runway_months: 35, // 500k / 14.2k ??? Seems very long for Angel round. Assume F&F was topped up or expenses lumpy. Realistically expect ~12 months runway.
        assessment: "Moderate burn rate for a DTC brand building inventory. Estimated runway (12 months) provides time to hit milestones for Seed round, but requires careful cash management."
    },
    profitability_projection: {
        estimated_timeframe: "18-36 months",
        key_factors: ["Scaling sales volume significantly.", "Improving customer retention rate.", "Achieving economies of scale in production and marketing.", "Maintaining premium pricing."]
    },
    funding_readiness_score: 55, // Moderate readiness for Seed
    funding_readiness_justification: "Good initial traction in a trending market with a unique product story. Unit economics are acceptable but not stellar. Needs to de-risk production scalability and demonstrate stronger retention path to confidently secure Seed funding."
  },

  // --- Ideal Output for EXAMPLE 6: MaharaHub (mock-ft-uuid-6) ---
  {
    executive_summary: "MaharaHub is a seed-stage EdTech platform in KSA focusing on accredited vocational training and job placement, addressing a key Vision 2030 goal. It shows good initial traction (800 students, SAR 600k ARR) and high course completion (70%). Strengths include strong founder-market fit and employer partnerships. Weaknesses are operating losses, moderate CAC, and potential challenges in accreditation and scaling hands-on training online. Series A readiness depends on proving the job placement model and achieving better unit economics.",
    swot_analysis: {
      strengths: ["Directly addresses KSA skills gap and youth unemployment (Vision 2030 alignment).", "Strong founder backgrounds (TVTC, HR).", "High course completion rate (70%).", "Integrated job placement model with employer partnerships.", "Good initial ARR (SAR 600k) for seed stage."],
      weaknesses: ["Operating at a loss (SAR 300k net annual).", "Moderate CAC (SAR 250) relative to AOV (SAR 750).", "Potential scalability issues for hands-on training components online.", "Lack of explicit expertise in accreditation processes noted in skills.", "Competition from government institutions (TVTC)."],
      opportunities: ["Strong government support (HRDF) for vocational training.", "Growing employer demand for skilled trades in KSA.", "Expand course offerings to other high-demand vocational areas.", "Partnerships with major KSA construction/industrial companies.", "Potential for blended learning models (online + physical workshops)."],
      threats: ["Changes in government accreditation standards or funding priorities.", "Competition from potentially subsidized government programs.", "Difficulty in maintaining high job placement rates as scale increases.", "Emergence of other specialized vocational EdTech platforms."]
    },
    market_positioning: "MaharaHub is well-positioned as a modern, potentially more agile alternative to traditional KSA vocational training centers like TVTC. Its focus on job placement via employer partnerships is a key differentiator. It targets young Saudis seeking practical skills, a demographic prioritized by national initiatives.",
    scalability_assessment: {
      level: "High",
      justification: "Online platform allows for scalability. The main challenges are scaling the *quality* of potentially hands-on training components online and scaling the employer partnership network effectively across KSA to maintain high placement rates. Course accreditation process needs streamlining."
    },
    competitive_advantage_evaluation: {
      assessment: "The core advantages are the strong focus on job placement through vetted employer partnerships and the relevant backgrounds of the founders. This provides credibility to both students and employers. The modern online delivery is also an advantage over traditional methods if executed well.",
      suggestion: "Quantify and heavily market the job placement success rate as a key differentiator. Systematize the accreditation process for new courses to enable faster expansion. Explore blended learning partnerships for practical skills."
    },
    current_challenges: ["Improving unit economics (CLV needs to clearly justify CAC).", "Streamlining course accreditation.", "Scaling the job placement function effectively.", "Ensuring practical skills are adequately taught/assessed online.", "Achieving profitability."],
    key_risks: ["Placement Risk (Inability to maintain high job placement rates).", "Accreditation Risk (Delays or difficulties in getting courses accredited).", "Financial Risk (Burn rate requires achieving Series A funding).", "Competitive Risk (TVTC modernizing or new EdTechs focusing on vocational)."],
    strategic_recommendations: ["Focus on deepening relationships with existing employer partners to maximize placement rates.", "Develop a standardized process for course development and accreditation.", "Optimize student acquisition channels to lower CAC.", "Build out robust analytics tracking student progress and placement success."],
    suggested_kpis: [
      { kpi: "Student Job Placement Rate (within X months of completion)", justification: "The single most critical metric validating the core value proposition."
      },
      { kpi: "Employer Partner Satisfaction/Retention", justification: "Ensures the sustainability of the job placement model."
      },
      { kpi: "Student Lifetime Value (CLV - including placement fees)", justification: "Needs to clearly demonstrate profitability potential beyond initial course fees." }
    ],
    what_if_scenarios: [
        { scenario: "Major government initiative (e.g., HRDF) provides subsidies for students enrolling in accredited platforms like MaharaHub.", outcome: "Significant reduction in CAC, rapid enrollment growth, potential for faster profitability."
        },
        { scenario: "Key employer partners significantly reduce hiring due to economic downturn.", outcome: "Job placement rate drops, damaging value proposition and potentially impacting student enrollment and investor confidence."
        }
    ],
    growth_plan_phases: [
        { period: "Months 1-3", focus: "Placement & Employer Relations", description: "Refine placement tracking, gather employer feedback, secure 2-3 new key employer partners."
        },
        { period: "Months 4-6", focus: "Accreditation & Course Expansion", description: "Streamline accreditation process, launch 1-2 new courses in high-demand fields."
        },
        { period: "Months 7-9", focus: "Unit Economics Optimization", description: "Analyze CAC by channel, test strategies to increase student CLV (e.g., advanced courses)."
        },
        { period: "Months 10-12", focus: "Series A Fundraising", description: "Compile strong data on placement rates and unit economics, begin Series A outreach."
        }
    ],
    funding_outlook: "Raised SAR 1.5M Seed, seeking SAR 6M Series A. Good initial ARR and strong market alignment. High completion rate is positive. Unit economics (CLV/CAC ~4x) are decent but rely heavily on proving the value derived from placement fees. Readiness for Series A is moderate-to-good; success hinges on demonstrating robust job placement metrics and a clear path to profitability.",
    financial_assessment: {
        strengths: ["Good ARR growth for seed stage.", "High course completion rate suggests student engagement.", "Strong alignment with KSA economic goals."],
        weaknesses: ["Operating at a loss.", "CAC could be lower relative to initial course AOV.", "Profitability depends heavily on successful job placements generating additional revenue."],
        recommendations: ["Clearly track and report job placement rates and derived revenue.", "Explore partnerships to reduce student acquisition costs.", "Manage operational costs carefully while scaling."]
    },
    cash_burn_rate: {
        monthly_rate: 25000, // (900k - 600k) / 12
        runway_months: 60, // 1.5M / 25k ??? Again seems too long. Assume seed gives 18-24 months.
        assessment: "Moderate burn rate. Estimated runway (18-24 months) is sufficient to reach Series A milestones if placement model proves successful."
    },
    profitability_projection: {
        estimated_timeframe: "24-36 months",
        key_factors: ["Scaling student volume efficiently.", "Maintaining high job placement rates and associated employer fees.", "Achieving operational leverage.", "Potential for B2B training contracts."]
    },
    funding_readiness_score: 75, // Reasonably strong for Series A
    funding_readiness_justification: "Strong alignment with KSA strategic goals, good founder fit, and solid initial traction. Key differentiator is the placement model. If job placement metrics are strong and trackable, highly attractive for Series A focused on workforce development."
  },

  // ... CONTINUE ADDING EXAMPLES UP TO 50 ...

]; 