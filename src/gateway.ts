import { EventEmitter } from 'events';
import { Message, AgentResponse, ChannelType } from './types';
import { BaseChannel } from './channels';
import chalk from 'chalk';

/**
 * レーン・キュー: メッセージの順次実行を管理します
 * OpenClawの設計思想に基づき、競合状態を防ぐためにシリアル実行を強制します。
 */
export class LaneQueue {
    private queue: Promise<any> = Promise.resolve();

    enqueue<T>(task: () => Promise<T>): Promise<T> {
        const next = this.queue.then(task);
        this.queue = next.catch(() => { });
        return next;
    }
}

/**
 * ClawLib ゲートウェイ: 通信のハブ
 * さまざまなチャネルからの入出力を一元管理します。
 */
export class Gateway extends EventEmitter {
    private channels: Map<string, BaseChannel> = new Map();
    private sessionQueues: Map<string, LaneQueue> = new Map();

    constructor() {
        super();
        this.log(chalk.blue('🌐 ClawLib ゲートウェイが起動しました。'));
    }

    private log(msg: string) {
        console.log(`${chalk.gray(`[Gateway]`)} ${msg}`);
    }

    /** 
     * 通信チャネル（Telegram, WhatsAppなど）を登録します 
     */
    public registerChannel(channel: BaseChannel) {
        this.channels.set(channel.type, channel);
        channel.on('message', (msg: Message) => {
            this.routeMessage(msg);
        });
        this.log(chalk.green(`📡 チャネルがアクティブになりました: ${channel.type}`));
    }

    /** 
     * 初期化プロセス 
     */
    public async init() {
        for (const channel of this.channels.values()) {
            await channel.init();
        }
    }

    /** 
     * メッセージを適切なセッションキューにルーティングします 
     */
    private async routeMessage(msg: Message) {
        let queue = this.sessionQueues.get(msg.sender);
        if (!queue) {
            queue = new LaneQueue();
            this.sessionQueues.set(msg.sender, queue);
        }

        queue.enqueue(async () => {
            this.log(`📥 ${msg.sender} [${msg.channel}] からのメッセージを処理中`);
            this.emit('message', msg);
        });
    }

    /** 
     * 外部ソースからゲートウェイに手動でメッセージを流し込みます 
     */
    public receive(raw: any, channel: ChannelType) {
        const message: Message = {
            id: Math.random().toString(36).substring(7),
            content: raw.text || raw.body || '',
            sender: raw.from || 'anonymous',
            channel: channel,
            timestamp: new Date(),
            metadata: raw.metadata
        };

        this.routeMessage(message);
    }

    /** 
     * エージェントの回答を対象のチャネルに届けます 
     */
    public async deliver(response: AgentResponse, destination: string, channel: ChannelType) {
        this.log(chalk.gray(`📤 ${destination} (@${channel}) へ配信中...`));

        const registeredChannel = this.channels.get(channel);
        if (registeredChannel) {
            await registeredChannel.sendMessage(destination, response.text);
        } else {
            console.log(chalk.white(`\n🤖 エージェント: "${chalk.bold(response.text)}"\n`));
        }

        this.emit('response', response, channel);
    }
}
