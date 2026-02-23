import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from './base';
import { Message, ProviderResponse } from '../types';

export class AnthropicProvider extends BaseProvider {
    private client: Anthropic;
    private model: string;

    constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20240620') {
        super();
        this.client = new Anthropic({ apiKey });
        this.model = model;
    }

    async chat(messages: Message[], systemPrompt: string, tools: any[]): Promise<ProviderResponse> {
        const anthropicTools = tools.length > 0 ? tools.map(t => ({
            name: t.id,
            description: t.description,
            input_schema: t.parameters
        })) : undefined;

        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: 4096,
            system: systemPrompt,
            tools: anthropicTools as any,
            messages: messages.map(m => ({
                role: (m as any).role || (m.sender === 'assistant' ? 'assistant' : 'user'),
                content: m.content
            })) as any
        });

        const toolCalls = response.content
            .filter((c: any) => c.type === 'tool_use')
            .map((c: any) => ({
                id: c.id,
                name: c.name,
                arguments: c.input
            }));

        const textContent = response.content
            .filter((c: any) => c.type === 'text')
            .map((c: any) => c.text)
            .join('\n');

        return {
            content: textContent,
            toolCalls: toolCalls.length > 0 ? toolCalls : undefined
        };
    }
}
