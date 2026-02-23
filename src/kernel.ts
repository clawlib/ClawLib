import { Message, AgentConfig, ToolDefinition, AgentResponse, ActionResult } from './types';
import {
    BaseProvider,
    AnthropicProvider,
    OpenAIProvider,
    GoogleProvider,
    MistralProvider,
    GroqProvider,
    OllamaProvider
} from './providers';
import { zodToJsonSchema } from 'zod-to-json-schema';
import chalk from 'chalk';
import ora from 'ora';

/**
 * ClawLib カーネル: エージェントの「脳」
 * 思考、ツール実行、記憶の管理を担当します。
 */
export class Kernel {
    private tools: Map<string, ToolDefinition<any>> = new Map();
    private config: AgentConfig;
    private history: Map<string, any[]> = new Map();
    private provider?: BaseProvider;

    constructor(config: AgentConfig) {
        this.config = config;
        this.initializeProvider(config);
        this.log(chalk.cyan(`🦞 ClawLib カーネル v1.2.5 初期化完了`));
    }

    /** 
     * 指定されたプロバイダーに基づいて思考エンジンを初期設定します 
     */
    private initializeProvider(config: AgentConfig) {
        const { provider, apiKey, model, baseUrl } = config;

        switch (provider) {
            case 'anthropic':
                if (apiKey) this.provider = new AnthropicProvider(apiKey, model);
                break;
            case 'openai':
                if (apiKey) this.provider = new OpenAIProvider(apiKey, model);
                break;
            case 'google':
                if (apiKey) this.provider = new GoogleProvider(apiKey, model);
                break;
            case 'mistral':
                if (apiKey) this.provider = new MistralProvider(apiKey, model);
                break;
            case 'groq':
                if (apiKey) this.provider = new GroqProvider(apiKey, model);
                break;
            case 'ollama':
                this.provider = new OllamaProvider(baseUrl, model);
                break;
            default:
                this.log(chalk.red(`⚠️ 未対応のプロバイダー: ${provider}`));
        }
    }

    private log(msg: string) {
        console.log(`${chalk.gray(`[Kernel]`)} ${msg}`);
    }

    /** 
     * エージェントに使用可能なスキル（ツール）を登録します 
     */
    public registerTool(tool: ToolDefinition<any>) {
        this.tools.set(tool.id, tool);
        this.log(chalk.green(`🧩 スキルを追加: ${chalk.yellow(tool.id)}`));
    }

    public registerSkill(skill: ToolDefinition<any>) {
        this.registerTool(skill);
    }

    /**
     * メッセージを処理し、思考ループ（Think-Act-Observe）を開始します
     */
    public async processMessage(message: Message): Promise<AgentResponse> {
        this.log(`${chalk.blue(message.sender)} からのメッセージを受信`);

        const userHistory = this.history.get(message.sender) || [];
        userHistory.push({ role: 'user', content: message.content });

        if (!this.provider) {
            return { text: "プロバイダーが正しく設定されていません。APIキーを確認してください。" };
        }

        let iterations = 0;
        const maxIterations = 5;
        const actions: ActionResult[] = [];
        let finalContent = "";

        // アニメーションローディングの開始
        const spinner = ora({
            text: chalk.yellow(`${this.config.provider} で思考中...`),
            color: 'cyan'
        }).start();

        try {
            while (iterations < maxIterations) {
                iterations++;
                spinner.text = chalk.yellow(`${this.config.provider} で思考中 (ステップ ${iterations})...`);

                const toolsJson = Array.from(this.tools.values()).map(t => ({
                    id: t.id,
                    description: t.description,
                    parameters: zodToJsonSchema(t.parameters)
                }));

                const response = await this.provider.chat(
                    userHistory as any,
                    this.config.systemPrompt || "あなたは親切な ClawLib エージェントです。",
                    toolsJson
                );

                if (response.content) {
                    finalContent += response.content;
                    userHistory.push({ role: 'assistant', content: response.content });
                }

                if (response.toolCalls && response.toolCalls.length > 0) {
                    spinner.stop(); // ツール実行時は一旦止めてログを見せる

                    for (const call of response.toolCalls) {
                        const tool = this.tools.get(call.name);
                        if (tool) {
                            this.log(chalk.magenta(`🛠️  実行中: ${tool.id}(${JSON.stringify(call.arguments)})`));
                            try {
                                const result = await tool.execute(call.arguments);
                                actions.push({ toolId: tool.id, args: call.arguments, result });

                                userHistory.push({
                                    role: 'user',
                                    content: `Observation from ${tool.id}: ${JSON.stringify(result)}`
                                });
                            } catch (e: any) {
                                userHistory.push({
                                    role: 'user',
                                    content: `Error from ${tool.id}: ${e.message}`
                                });
                            }
                        }
                    }
                    spinner.start(); // 次の思考ステップのために再開
                    continue;
                }
                break;
            }
            spinner.succeed(chalk.green('思考完了'));
        } catch (error: any) {
            spinner.fail(chalk.red(`プロバイダーエラー: ${error.message}`));
            return { text: `${this.config.provider} からのエラー: ${error.message}`, actions };
        }

        this.history.set(message.sender, userHistory);
        return { text: finalContent, actions };
    }

    public async execute(message: Message): Promise<AgentResponse> {
        return this.processMessage(message);
    }
}
