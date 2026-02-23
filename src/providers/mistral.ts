import MistralClient from '@mistralai/mistralai';
import { BaseProvider } from './base';
import { Message, ProviderResponse } from '../types';

export class MistralProvider extends BaseProvider {
    private client: MistralClient;
    private model: string;

    constructor(apiKey: string, model: string = 'mistral-large-latest') {
        super();
        this.client = new MistralClient(apiKey);
        this.model = model;
    }

    async chat(messages: Message[], systemPrompt: string, tools: any[]): Promise<ProviderResponse> {
        const mistralTools = tools.length > 0 ? tools.map(t => ({
            type: 'function',
            function: {
                name: t.id,
                description: t.description,
                parameters: t.parameters
            }
        })) : undefined;

        const response = await this.client.chat({
            model: this.model,
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({
                    role: (m as any).role || (m.sender === 'assistant' ? 'assistant' : 'user'),
                    content: m.content
                })) as any
            ],
            tools: mistralTools as any
        });

        const choice = response.choices[0].message;
        const toolCalls = (choice as any).tool_calls?.map((c: any) => ({
            id: c.id,
            name: c.function.name,
            arguments: typeof c.function.arguments === 'string' ? JSON.parse(c.function.arguments) : c.function.arguments
        }));

        return {
            content: choice.content || "",
            toolCalls: toolCalls && toolCalls.length > 0 ? toolCalls : undefined
        };
    }
}
