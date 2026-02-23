import { Kernel, Gateway, WhatsAppChannel, TelegramChannel, weatherTool, timeTool, AgentConfig } from '../src';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load variables from .env
dotenv.config();

/**
 * Automagically detect available API keys and select the best provider.
 */
function autoDetectConfig(): AgentConfig {
    const name = 'ClawSocialAgent';
    const systemPrompt = "You are a professional AI assistant connected to multiple social channels. Help users with system tasks, email, and social media.";

    const isSet = (key: string | undefined) => key && key !== '' && !key.startsWith('your_');

    if (isSet(process.env.ANTHROPIC_API_KEY)) {
        return { name, provider: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY, model: 'claude-3-5-sonnet-20240620', systemPrompt };
    }
    if (isSet(process.env.OPENAI_API_KEY)) {
        return { name, provider: 'openai', apiKey: process.env.OPENAI_API_KEY, model: 'gpt-4o', systemPrompt };
    }
    if (isSet(process.env.GOOGLE_API_KEY)) {
        return { name, provider: 'google', apiKey: process.env.GOOGLE_API_KEY, model: 'gemini-1.5-flash', systemPrompt };
    }
    if (isSet(process.env.GROQ_API_KEY)) {
        return { name, provider: 'groq', apiKey: process.env.GROQ_API_KEY, model: 'llama3-70b-8192', systemPrompt };
    }

    // Fallback to Ollama
    return { name, provider: 'ollama', baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434', model: 'llama3', systemPrompt };
}

async function main() {
    console.log(chalk.bold.green('\n--- 🦞 ClawLib Multi-Channel AI Agent ---\n'));

    // 1. Auto-detect config
    const config = autoDetectConfig();
    console.log(chalk.blue(`📡 Intelligence Powered by: ${chalk.bold(config.provider)}`));

    // 2. Initialize Kernel
    const kernel = new Kernel(config);

    // 3. Initialize Gateway
    const gateway = new Gateway();

    // 4. Register Channels based on available environment variables
    // Telegram Integration
    if (process.env.TELEGRAM_TOKEN && process.env.TELEGRAM_TOKEN !== 'your_telegram_bot_token_here') {
        gateway.registerChannel(new TelegramChannel(process.env.TELEGRAM_TOKEN));
    } else {
        console.log(chalk.gray('ℹ️ Telegram token not found or placeholder. Skipping Telegram channel.'));
    }

    // WhatsApp Integration (Always available as it uses QR scanning)
    console.log(chalk.gray('ℹ️ Initializing WhatsApp channel...'));
    gateway.registerChannel(new WhatsAppChannel());

    // 5. Connect Intelligence to Channels
    gateway.on('message', async (msg) => {
        console.log(chalk.cyan(`\n[Input][${msg.channel}] ${msg.sender}: ${msg.content}`));

        const response = await kernel.processMessage(msg);

        await gateway.deliver(response, msg.sender, msg.channel);
    });

    // 6. Start all services
    console.log(chalk.yellow('\n🚀 Starting Gateway Services...'));
    await gateway.init();

    console.log(chalk.green('\n✅ All channels are active. Listening for messages...'));
}

main().catch(console.error);
