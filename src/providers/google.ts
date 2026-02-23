import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from './base';
import { Message, ProviderResponse } from '../types';

/**
 * Google Gemini プロバイダーの提供クラス
 * Gemini 2.0 Flash などの最新モデルに対応しています。
 */
export class GoogleProvider extends BaseProvider {
    private genAI: GoogleGenerativeAI;
    private model: string;

    constructor(apiKey: string, model: string = 'gemini-2.0-flash-exp') {
        super();
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = model;
    }

    /**
     * Gemini の API が要求する厳格な JSON スキーマに変換します。
     * 未対応のフィールド ($schema, additionalProperties など) を再帰的に削除します。
     */
    private cleanSchema(schema: any): any {
        if (!schema || typeof schema !== 'object') return schema;

        const cleaned: any = {};
        const allowedFields = ['type', 'properties', 'required', 'items', 'description', 'enum', 'format'];

        for (const field of allowedFields) {
            if (schema[field] !== undefined) {
                if (field === 'properties') {
                    cleaned.properties = {};
                    for (const key in schema.properties) {
                        cleaned.properties[key] = this.cleanSchema(schema.properties[key]);
                    }
                } else if (field === 'items') {
                    cleaned.items = this.cleanSchema(schema.items);
                } else {
                    cleaned[field] = schema[field];
                }
            }
        }

        return cleaned;
    }

    /**
     * Gemini とのチャットセッションを実行します
     */
    async chat(messages: Message[], systemPrompt: string, tools: any[]): Promise<ProviderResponse> {
        const model = this.genAI.getGenerativeModel({
            model: this.model,
            systemInstruction: systemPrompt
        });

        // ツール定義を Google 独自の Function Call 形式に変換
        const googleTools = tools.length > 0 ? [{
            functionDeclarations: tools.map(t => {
                const cleanedParams = this.cleanSchema(t.parameters);
                if (!cleanedParams.type) cleanedParams.type = 'object';

                return {
                    name: t.id,
                    description: t.description,
                    parameters: cleanedParams
                };
            })
        }] : undefined;

        // 過去の対話履歴を Gemini 形式に変換
        const history = messages.length > 1 ? messages.slice(0, -1).map(m => ({
            role: (m as any).role === 'assistant' || m.sender === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        })) : [];

        const chat = model.startChat({
            history: history,
            tools: googleTools as any,
        });

        const lastMessage = messages[messages.length - 1];
        const result = await chat.sendMessage(lastMessage.content);
        const response = await result.response;

        // ツール呼び出し（Function Calls）のパース
        const toolCalls = response.functionCalls()?.map((c: any) => ({
            id: Math.random().toString(36).substring(7),
            name: c.name,
            arguments: c.args
        }));

        return {
            content: response.text(),
            toolCalls: toolCalls && toolCalls.length > 0 ? toolCalls : undefined
        };
    }
}
