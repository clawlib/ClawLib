import { BaseProvider } from './base';
import { Message, ProviderResponse } from '../types';

export class OllamaProvider extends BaseProvider {
    private baseUrl: string;
    private model: string;

    constructor(baseUrl: string = 'http://localhost:11434', model: string = 'llama3') {
        super();
        this.baseUrl = baseUrl;
        this.model = model;
    }

    async chat(messages: Message[], systemPrompt: string, tools: any[]): Promise<ProviderResponse> {
        // use global fetch (available in Node 18+)
        const response = await fetch(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages.map(m => ({
                        role: (m as any).role || (m.sender === 'assistant' ? 'assistant' : 'user'),
                        content: m.content
                    })) as any
                ],
                stream: false,
                tools: tools.map(t => ({
                    type: 'function',
                    function: {
                        name: t.id,
                        description: t.description,
                        parameters: t.parameters
                    }
                }))
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama Error: ${response.statusText}`);
        }

        const data: any = await response.json();
        const choice = data.message;

        const toolCalls = choice.tool_calls?.map((c: any) => ({
            id: Math.random().toString(36).substring(7),
            name: c.function.name,
            arguments: c.function.arguments
        }));

        return {
            content: choice.content || "",
            toolCalls: toolCalls && toolCalls.length > 0 ? toolCalls : undefined
        };
    }
}
