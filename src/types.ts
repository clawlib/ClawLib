import { z } from 'zod';

/** 
 * メッセージチャネルの定義 
 * (LINE, Discord, Telegramなどが含まれます)
 */
export type ChannelType = 'whatsapp' | 'telegram' | 'discord' | 'slack' | 'cli' | 'web';

/** 
 * 統一メッセージフォーマット 
 * すべての入力ソースはこの形式に変換されます
 */
export interface Message {
    id: string;
    content: string;
    sender: string;
    channel: ChannelType;
    timestamp: Date;
    metadata?: Record<string, any>;
}

/** 
 * エージェントの基本設定 
 */
export interface AgentConfig {
    name: string;
    provider: 'anthropic' | 'openai' | 'google' | 'mistral' | 'groq' | 'ollama' | 'local';
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    systemPrompt?: string;
}

/** 
 * ツールの定義インターフェース 
 * Zodを使用してパラメータを厳密に検証します
 */
export interface ToolDefinition<T extends z.ZodObject<any>> {
    id: string;
    description: string;
    parameters: T;
    execute: (args: z.infer<T>) => Promise<any>;
}

/** 
 * ツール実行結果の構造 
 */
export interface ActionResult {
    toolId: string;
    args: any;
    result: any;
    error?: string;
}

/** 
 * エージェントからの最終レスポンス 
 */
export interface AgentResponse {
    text: string;
    actions?: ActionResult[];
}

/** 
 * LLMプロバイダーからの生のレスポンス 
 */
export interface ProviderResponse {
    content: string;
    toolCalls?: Array<{
        id: string;
        name: string;
        arguments: any;
    }>;
}
