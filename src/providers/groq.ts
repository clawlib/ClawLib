import Groq from 'groq-sdk';
import { BaseProvider } from './base';
import { Message, ProviderResponse } from '../types';

export class GroqProvider extends BaseProvider {
    private client: Groq;
    private model: string;

    constructor(apiKey: string, model: string = 'llama3-70b-8192') {
        super();
        this.client = new Groq({ apiKey });
        this.model = model;
    }

    async chat(messages: Message[], systemPrompt: string, tools: any[]): Promise<ProviderResponse> {
        const groqTools = tools.length > 0 ? tools.map(t => ({
            type: 'function',
            function: {
                name: t.id,
                description: t.description,
                parameters: t.parameters
            }
        })) : undefined;

        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({
                    role: (m as any).role || (m.sender === 'assistant' ? 'assistant' : 'user'),
                    content: m.content
                })) as any
            ],
            tools: groqTools as any
        });

        const choice = response.choices[0].message;
        const toolCalls = choice.tool_calls?.map((c: any) => ({
            id: c.id,
            name: c.function.name,
            arguments: JSON.parse(c.function.arguments)
        }));

        return {
            content: choice.content || "",
            toolCalls: toolCalls && toolCalls.length > 0 ? toolCalls : undefined
        };
    }
}
