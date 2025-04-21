# AI Assistant Edge Function

This Supabase Edge Function powers the RISE AI Assistant, providing real-time AI responses to user queries with contextual awareness of user profiles.

## Features

- Integrates with OpenAI's GPT models for intelligent responses
- Includes user context (startup or investor profile) when available
- Logs interactions for future analysis and improvement
- Error handling and validation
- Role-based contextual responses
- Built with Deno and TypeScript

## Deployment Steps

### Prerequisites

1. Supabase CLI installed: `npm install -g supabase`
2. Logged in to Supabase: `supabase login`
3. An OpenAI API key

### Local Testing

1. Set environment variables locally:
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-your-key-here
   ```

2. Start the function locally:
   ```bash
   supabase start
   supabase functions serve ai-assistant --no-verify-jwt
   ```

3. Test the function:
   ```bash
   curl -X POST http://localhost:54321/functions/v1/ai-assistant \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"What is RISE platform?"}]}'
   ```

### Deploying to Production

1. Create database tables first by running the migration:
   ```bash
   supabase db push
   ```

2. Set environment variables for production:
   ```bash
   supabase secrets set --env prod OPENAI_API_KEY=sk-your-key-here
   ```

3. Deploy the function:
   ```bash
   supabase functions deploy ai-assistant --no-verify-jwt
   ```

4. Enable JWT verification for production (optional but recommended):
   ```bash
   supabase functions deploy ai-assistant
   ```

## Usage from Frontend

From the AIAssistantContext:

```typescript
const { data, error } = await supabase.functions.invoke('ai-assistant', {
  body: { messages: conversationHistory }
});

if (error) {
  console.error('Error calling AI assistant:', error);
} else if (data && data.message) {
  // Handle the response
  console.log(data.message);
}
```

## Logging and Debugging

View logs for the function:
```bash
supabase functions logs ai-assistant --tail
```

## Customization

To modify the system prompt or AI parameters, edit the following in `index.ts`:

- `SYSTEM_PROMPT` constant - Update to change the AI's behavior and instructions
- OpenAI parameters in `createChatCompletion` - Adjust temperature, max_tokens, etc.
- Response formatting - Customize the structure of the response payload 