import { authHandlers } from './auth';
import { startupHandlers } from './startup';
import { investorHandlers } from './investor';
import { aiInsightsHandlers } from './ai_insights';
import { investorInteractionHandlers } from './investor_interactions';

export const mockHandlers = [
  ...authHandlers,
  ...startupHandlers,
  ...investorHandlers,
  ...aiInsightsHandlers,
  ...investorInteractionHandlers,
];
