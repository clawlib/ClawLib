import { Kernel, Gateway, weatherTool, timeTool, AgentConfig } from '../src';
import chalk from 'chalk';
import dotenv from 'dotenv';
import readlineSync from 'readline-sync';

// .env から環境変数を読み込む
dotenv.config();

/**
 * 利用可能なAPIキーを自動検出し、最適なプロバイダーを選択します。
 * 優先順位: Anthropic > OpenAI > Google > Groq > Mistral > Ollama
 */
function autoDetectConfig(): AgentConfig {
    const name = 'ClawAutoAgent';
    const systemPrompt = "あなたはClawエコシステムのプロフェッショナルなアシスタントです。常に丁寧に答え、必要に応じてツールを使いこなします。";

    const isSet = (key: string | undefined) => key && key !== '' && !key.startsWith('your_');

    if (isSet(process.env.ANTHROPIC_API_KEY)) {
        return { name, provider: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY, model: 'claude-3-5-sonnet-20240620', systemPrompt };
    }
    if (isSet(process.env.OPENAI_API_KEY)) {
        return { name, provider: 'openai', apiKey: process.env.OPENAI_API_KEY, model: 'gpt-4o', systemPrompt };
    }
    if (isSet(process.env.GOOGLE_API_KEY)) {
        return { name, provider: 'google', apiKey: process.env.GOOGLE_API_KEY, model: 'gemini-2.0-flash', systemPrompt };
    }
    if (isSet(process.env.GROQ_API_KEY)) {
        return { name, provider: 'groq', apiKey: process.env.GROQ_API_KEY, model: 'llama3-70b-8192', systemPrompt };
    }
    if (isSet(process.env.MISTRAL_API_KEY)) {
        return { name, provider: 'mistral', apiKey: process.env.MISTRAL_API_KEY, model: 'mistral-large-latest', systemPrompt };
    }

    // キーが見つからない場合は Ollama にフォールバック
    console.log(chalk.yellow('⚠️  APIキーが見つかりませんでした。ローカルAI (Ollama) を使用します。'));
    return { name, provider: 'ollama', baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434', model: 'llama3', systemPrompt };
}

async function main() {
    console.log(chalk.bold.green('\n--- 🦞 ClawLib 対話型インテリジェンス・デモ ---\n'));

    // 1. 環境に基づいて設定を自動検出
    const config = autoDetectConfig();
    console.log(chalk.blue(`📡 使用中のプロバイダー: ${chalk.bold(config.provider.toUpperCase())}\n`));

    // 2. カーネルの初期化
    const kernel = new Kernel(config);

    // 3. スキル（ツール）の登録
    kernel.registerTool(weatherTool);
    kernel.registerTool(timeTool);

    // 4. ゲートウェイの初期化
    const gateway = new Gateway();

    // 5. インテリジェンスとチャネルの接続
    gateway.on('message', async (msg) => {
        const response = await kernel.processMessage(msg);
        await gateway.deliver(response, msg.sender, msg.channel);

        // 返信後に次の入力を促す（対話ループ用）
        promptUser();
    });

    console.log(chalk.yellow('\nエージェントがオンラインになりました。'));
    console.log(chalk.gray('終了するには Ctrl + C を押してください。\n'));

    /**
     * ユーザー入力を受け付けるループ関数
     */
    function promptUser() {
        const input = readlineSync.question(chalk.green('あなた: '));

        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
            console.log(chalk.red('\nプログラムを終了します。さようなら！🦞'));
            process.exit(0);
        }

        if (input.trim() !== '') {
            gateway.receive({ text: input, from: 'User' }, 'cli');
        } else {
            promptUser();
        }
    }

    // 初回の入力を開始
    promptUser();
}

// 予期せぬエラーのキャッチ
main().catch((err) => {
    console.error(chalk.red('重大なエラーが発生しました:'), err);
    process.exit(1);
});
