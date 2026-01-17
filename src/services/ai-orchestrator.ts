import { OpenRouter } from '@openrouter/sdk';
import { TenantService } from './tenant.service';

const tenantService = new TenantService();



const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function chat(
  companyId: string,
  message: string,
  history: any[]
): Promise<string> {

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }

  // 1️⃣ Validate tenant
  const tenant = await tenantService.getTenant(companyId);

  // 2️⃣ Load tenant documents
  const documents = await tenantService.getDocuments(companyId);
  const context = documents.join('\n\n---\n\n');

  //const memoryMessages = tenantService.buildConversationMemory(history);
  // 3️⃣ Decide mode
  const isGeneralMode = !context.trim() ||
    message.toLowerCase().startsWith('general:') ||
    message.toLowerCase().startsWith('just for fun');

  // 4️⃣ Build system prompt
  const systemPrompt = isGeneralMode
    ? `
You are a friendly, helpful AI assistant.
You may answer general knowledge questions freely.
Keep answers clear and concise.
`
    : `
${tenant.systemInstruction}

STRICT RULES:
- Answer ONLY using the CONTEXT below
- Do NOT guess or use outside knowledge
- If the answer is not present, reply exactly:
  "I’m sorry, I don’t have information on that."
- Be professional and concise

CONTEXT:
${context}
`;

  try {
    // const completion = await openRouter.chat.send({
    //   model: 'meta-llama/llama-3.3-70b-instruct:free',
    //   messages: [
    //     { role: 'system', content: systemPrompt },
    //     ...history,
    //     { role: 'user', content: message }
    //   ],
    //   stream: false,
    // });
    const completion = await openRouter.chat.send({
      model: 'arcee-ai/trinity-mini:free'//'meta-llama/llama-3.3-70b-instruct:free'
      ,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message }
      ],
      stream: false,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return isGeneralMode
        ? "I couldn’t think of an answer 😄"
        : "I’m sorry, I don’t have information on that.";
    }

    if (typeof content === 'string') {
      return content;
    }

    const output = content
      .map(item => item.type === 'text' ? item.text : '')
      .join('');
    // tenantService.buildConversationMemory(history).push({ role: 'user', content: message });
    // tenantService.buildConversationMemory(history).push({ role: 'system', content: output });
    // console.log('Updated history:', tenantService.buildConversationMemory(history));

    // Handle array-based responses safely
  return output ;

  } catch (error) {
    console.error('OpenRouter error:', error);
    return "I'm having trouble right now. Please try again later.";
  }
}
