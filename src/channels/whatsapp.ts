import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { BaseChannel } from './index';
import { ChannelType, Message } from '../types';
import chalk from 'chalk';

export class WhatsAppChannel extends BaseChannel {
    type: ChannelType = 'whatsapp';
    private client: Client;

    constructor() {
        super();
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox']
            }
        });
    }

    async init(): Promise<void> {
        this.client.on('qr', (qr) => {
            console.log(chalk.yellow('📱 [WhatsApp] Scan this QR code with your phone:'));
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log(chalk.green('✅ WhatsApp Channel is ready!'));
        });

        this.client.on('message', (msg) => {
            const message: Message = {
                id: msg.id.id,
                content: msg.body,
                sender: msg.from,
                channel: 'whatsapp',
                timestamp: new Date(),
                metadata: { pushname: (msg as any)._data?.notifyName }
            };
            this.emit('message', message);
        });

        await this.client.initialize();
    }

    async sendMessage(to: string, content: string): Promise<void> {
        await this.client.sendMessage(to, content);
    }
}
