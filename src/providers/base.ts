import { Message, ProviderResponse } from '../types';

export abstract class BaseProvider {
    abstract chat(
        messages: Message[],
        systemPrompt: string,
        tools: any[]
    ): Promise<ProviderResponse>;
}
