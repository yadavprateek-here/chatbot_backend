
// General Puropse ChatBot Code down 

// import { OpenRouter } from '@openrouter/sdk';

// /**
//  * Initialize OpenRouter client
//  * Make sure OPENROUTER_API_KEY is set in environment variables
//  */
// const openRouter = new OpenRouter({
//   apiKey: process.env.OPENROUTER_API_KEY!,
// });

// /**
//  * System prompt for a general-purpose chatbot
//  * This is VERY IMPORTANT – never keep system prompt empty
//  */
// const SYSTEM_PROMPT = `
// You are a friendly, helpful, and intelligent AI assistant.
// - Answer clearly and concisely
// - Provide correct and practical information
// - If the user asks for code, give clean and correct code
// - If you are unsure, say so honestly
// `;

// /**
//  * General chat function
//  *
//  * @param message - User's latest message
//  * @param history - Conversation history (per user/session)
//  * @returns AI response as string
//  */
// export async function chat(
//   message: string,
//   history: { role: 'user' | 'assistant' | 'system'; content: string }[]
// ): Promise<string> {

//   // Safety check for API key
//   if (!process.env.OPENROUTER_API_KEY) {
//     throw new Error('OPENROUTER_API_KEY is not set');
//   }

//   /**
//    * Optional: Limit conversation history
//    * This avoids huge token usage and improves performance
//    */
//   const MAX_HISTORY_MESSAGES = 20;
//   const trimmedHistory =
//     history.length > MAX_HISTORY_MESSAGES
//       ? history.slice(-MAX_HISTORY_MESSAGES)
//       : history;

//   try {
//     /**
//      * Send chat request to OpenRouter
//      */
//     const completion = await openRouter.chat.send({
//       model: 'meta-llama/llama-3.3-70b-instruct', // Recommended for general chat
//       messages: [
//         { role: 'system', content: SYSTEM_PROMPT },
//         ...trimmedHistory,
//         { role: 'user', content: message },
//       ],
//       stream: false,
//     });

//     /**
//      * Extract model response safely
//      */
//     const content = completion.choices[0]?.message?.content;

//     if (!content) {
//       return "I couldn’t think of an answer right now 😄";
//     }

//     // If content is a plain string
//     if (typeof content === 'string') {
//       return content;
//     }

//     /**
//      * Handle array-based responses (some models return structured output)
//      */
//     const output = content
//       .map(item => (item.type === 'text' ? item.text : ''))
//       .join('');

//     return output;

//   } catch (error) {
//     console.error('OpenRouter error:', error);
//     return "I'm having trouble right now. Please try again later.";
//   }
// }




// Company Based ChatBot 

import { OpenRouter } from '@openrouter/sdk';
import { TenantService } from './tenant.service';

/**
 * Initialize services
 */
const tenantService = new TenantService();

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

/**
 * Tenant chatbot function (STRICT RAG MODE)
 *
 * @param companyId - Tenant / company identifier
 * @param message - User's question
 * @param history - Conversation history (tenant + session scoped)
 */
export async function chat(
  companyId: string,
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {

  // Ensure API key exists
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }

  /**
   * 1️⃣ Validate tenant
   * If tenant does not exist, fail fast
   */
  const tenant = await tenantService.getTenant(companyId);
  if (!tenant) {
    throw new Error('Invalid tenant');
  }

  /**
   * 2️⃣ Load tenant documents (RAG context)
   * These MUST be tenant-scoped
   */
  const documents = await tenantService.getDocuments(companyId);

  /**
   * Combine documents into a single context string
   */
  const context = documents.join('\n\n---\n\n');

  /**
   * 3️⃣ Build STRICT system prompt
   * This is the core of tenant isolation
   */
  const SYSTEM_PROMPT = `
${tenant.systemInstruction ?? 'You are a professional company assistant.'}

STRICT RULES (MUST FOLLOW):
- Answer ONLY using the CONTEXT below
- Do NOT use outside knowledge
- Do NOT guess or assume
- If the answer is NOT present in the context, reply EXACTLY with:
  "I’m sorry, I don’t have information on that."
- Keep responses professional and concise

CONTEXT:
${context}
`;

  /**
   * 4️⃣ Limit history size (prevents token explosion)
   */
  const MAX_HISTORY_MESSAGES = 15;
  const trimmedHistory =
    history.length > MAX_HISTORY_MESSAGES
      ? history.slice(-MAX_HISTORY_MESSAGES)
      : history;

  try {
    /**
     * 5️⃣ Send request to OpenRouter
     * Use a strong instruction-following model
     */
    const completion = await openRouter.chat.send({
      model: 'meta-llama/llama-3.3-70b-instruct',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...trimmedHistory,
        { role: 'user', content: message },
      ],
      stream: false,
    });

    /**
     * 6️⃣ Extract response safely
     */
    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return "I’m sorry, I don’t have information on that.";
    }

    // If response is a string
    if (typeof content === 'string') {
      return content;
    }

    /**
     * Handle structured content responses
     */
    const output = content
      .map(item => (item.type === 'text' ? item.text : ''))
      .join('');

    return output || "I’m sorry, I don’t have information on that.";

  } catch (error) {
    console.error('Tenant chatbot error:', error);
    return "I'm having trouble right now. Please try again later.";
  }
}
