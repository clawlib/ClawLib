import { EventEmitter } from 'events';
import { ChannelType, Message } from '../types';

export abstract class BaseChannel extends EventEmitter {
    abstract type: ChannelType;
    abstract init(): Promise<void>;
    abstract sendMessage(to: string, content: string): Promise<void>;
}
