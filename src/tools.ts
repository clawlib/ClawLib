import { z } from 'zod';
import { ToolDefinition } from './types';

/**
 * ツールの作成を支援するユーティリティ関数
 */
export function createTool<T extends z.ZodObject<any>>(
    definition: ToolDefinition<T>
): ToolDefinition<T> {
    return definition;
}

// 専門モジュールからすべてのツールをエクスポート
export * from './tools/system';
export * from './tools/email';
export * from './tools/web';
export * from './tools/instagram';

/**
 * お天気ツール (デモ用)
 * 指定された都市の現在の天気を取得します。
 */
export const weatherTool = createTool({
    id: 'get_weather',
    description: '都市の現在の天気を検索します',
    parameters: z.object({
        city: z.string().describe('都市の名前（例：東京）'),
        units: z.enum(['celsius', 'fahrenheit']).default('celsius')
    }),
    execute: async ({ city, units }) => {
        // 実際にはAPIを叩くところですが、ここではデモ用の固定値を返します
        return `${city}は晴れです。気温は24${units === 'celsius' ? '°C' : '°F'}です。`;
    }
});

/**
 * 時刻ツール
 * システムの現在時刻を日本語形式で返します。
 */
export const timeTool = createTool({
    id: 'get_time',
    description: '現在のシステム時刻を取得します',
    parameters: z.object({}),
    execute: async () => {
        return new Date().toLocaleString('ja-JP');
    }
});
