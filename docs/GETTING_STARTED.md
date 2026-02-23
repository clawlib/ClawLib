# Getting Started with ClawLib 🦞
# ClawLib を始める

[English](#english) | [日本語](#japanese)

---

<a name="english"></a>
## English

Welcome to the **ClawLib** ecosystem! This guide will help you understand the core philosophy of ClawLib and get your first agent up and running in minutes.

### What is ClawLib?

ClawLib is a high-performance framework designed for building **Personal AI Assistants**. Unlike general-purpose LLM wrappers, ClawLib is built with a focus on:
1. **Connectivity**: Talking to real-world apps (WhatsApp, Telegram, etc.).
2. **Agency**: The ability to perform actions via a robust "Tool" system.
3. **Privacy**: Keeping your data on your own infrastructure.

### Core Workflow

The typical lifecycle of a ClawLib agent involves:
1. **The Kernel** receives a message from a **Channel**.
2. **Context** is retrieved from the **Memory Store**.
3. **The Orchestrator** decides if a **Tool** needs to be called.
4. **The LLM** generates a response based on the tool output and context.
5. **The Gateway** delivers the response back to the user.

### Prerequisites

- **Node.js**: Version 20 or higher (LTS recommended).
- **Package Manager**: `npm`, `pnpm`, or `yarn`.
- **API Keys**: You will need an API key from a provider like Anthropic (Claude) or OpenAI (GPT-4).

---

<a name="japanese"></a>
## 日本語

**ClawLib** エコシステムへようこそ！このガイドでは、ClawLib の核心となる理念を理解し、数分で最初のエージェントを稼働させるための手助けをします。

### ClawLib とは？

ClawLib は、**パーソナル AI アシスタント**を構築するために設計された高性能フレームワークです。一般的な LLM ラッパーとは異なり、ClawLib は以下の点に重点を置いて構築されています。
1. **接続性**: 現実世界のアプリ（WhatsApp、Telegram など）との対話。
2. **エージェンシー**: 堅牢な「ツール」システムを介してアクションを実行する能力。
3. **プライバシー**: データを自身のインフラ内に保管。

### コアワークフロー

ClawLib エージェントの一般的なライフサイクルは以下の通りです。
1. **カーネル**が**チャネル**からメッセージを受信する。
2. **メモリストア**から**コンテキスト**が取得される。
3. **オーケストレーター**が**ツール**を呼び出す必要があるか判断する。
4. **LLM** がツールの出力とコンテキストに基づいて回答を生成する。
5. **ゲートウェイ**が回答をユーザーに届ける。

### 前提条件

- **Node.js**: バージョン 20 以上（LTS 推奨）。
- **パッケージマネージャー**: `npm`、`pnpm`、または `yarn`。
- **API キー**: Anthropic (Claude) や OpenAI (GPT-4) などのプロバイダーの API キーが必要です。

---

[Back to Index / インデックスに戻る](../README.md)
