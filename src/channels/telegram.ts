import { Telegraf } from 'telegraf';
import { BaseChannel } from './index';
import { ChannelType, Message } from '../types';
import chalk from 'chalk';

export class TelegramChannel extends BaseChannel {
    type: ChannelType = 'telegram';
    private bot: Telegraf;

    constructor(token: string) {
        super();
        this.bot = new Telegraf(token);
    }

    async init(): Promise<void> {
        this.bot.on('text', (ctx) => {
            const message: Message = {
                id: ctx.message.message_id.toString(),
                content: ctx.message.text,
                sender: ctx.from.id.toString(),
                channel: 'telegram',
                timestamp: new Date(),
                metadata: { username: ctx.from.username }
            };
            this.emit('message', message);
        });

        this.bot.launch();
        console.log(chalk.blue('🤖 Telegram Channel initialized and listening...'));
    }

    async sendMessage(to: string, content: string): Promise<void> {
        await this.bot.telegram.sendMessage(to, content);
    }
}
