# ClawLib Architecture: The OpenClaw Standard 🦞
# ClawLib アーキテクチャ: OpenClaw 標準

[English](#english) | [日本語](#japanese)

---

<a name="english"></a>
## English

This documentation outlines the architectural blueprints of ClawLib, heavily inspired by the **OpenClaw** design philosophy.

### 1. The Gateway (The Control Plane)
The Gateway is the single source of truth and the central hub of communication.
- **Hub-and-Spoke Model**: Separates high-level reasoning (Kernel) from local execution (Tools/Skills).
- **Lane Queues**: Messages for a specific user session are queued and executed serially to prevent race conditions and ensure traceability.
- **Protocol Aggregator**: Translates WhatsApp, Telegram, and Slack events into a unified packet format.

### 2. The Kernel (The Reasoning Engine)
The Kernel is the "brain" responsible for making decisions.
- **Provider Agnostic**: Can swap Claude 3.5 Sonnet, GPT-4o, or Local Llama 3 models instantly.
- **Thinking Loop**: Supports multi-step reasoning cycles (Plan -> Execute -> Observe -> Refine).
- **Session Persistence**: Maintains conversation state across restarts and different channels.

### 3. Skills (The Execution Layer)
Skills are modular units of capability (similar to plugins).
- **Zod-Validated**: Strictly typed parameters for total safety during AI execution.
- **Permission Tiers**: Skills are categorized by risk level (Read-Only vs System-Write).

### 4. Security & Privacy
In line with OpenClaw, ClawLib prioritizes user sovereignty:
- **Local Sovereignty**: All data and keys stay on your infrastructure.
- **Internal Binding**: The Gateway binds to `127.0.0.1` by default to prevent external exposure.

---

<a name="japanese"></a>
## 日本語

このドキュメントでは、**OpenClaw** の設計思想に強く影響を受けた ClawLib のアーキテクチャ設計図について説明します。

### 1. ゲートウェイ（コントロールプレーン）
ゲートウェイは、唯一の真実のソースであり、通信の中心的なハブです。
- **ハブ・アンド・スポーク・モデル**: 高レベルの推論（カーネル）をローカル環境での実行（ツール/スキル）から分離します。
- **レーンキュー**: 特定のユーザーセッションのメッセージはキューに入れられ、競合状態を防ぎ、追跡可能性を確保するために順次実行されます。
- **プロトコル・アグリゲーター**: WhatsApp、Telegram、Slack などのイベントを統一された形式に変換します。

### 2. カーネル（推論エンジン）
カーネルは、意思決定を担当する「脳」です。
- **プロバイダーに依存しない**: Claude 3.5 Sonnet、GPT-4o、またはローカルの Llama 3 モデルを即座に切り替えることができます。
- **思考ループ**: 多段階の推論サイクル（計画 -> 実行 -> 観察 -> 改善）をサポートします。
- **セッションの永続化**: 再起動後や異なるチャネル間でも会話の状態を維持します。

### 3. スキル（実行レイヤー）
スキルは、機能のモジュール型ユニットです（プラグインに似ています）。
- **Zod 検証済**: AI 実行中の安全性を確保するため、厳格に型定義されたパラメータを使用します。
- **権限階層**: スキルはリスクレベル（読み取り専用かシステム書き込みか）によって分類されます。

### 4. セキュリティとプライバシー
OpenClaw と同様に、ClawLib はユーザーの主権を優先します。
- **ローカル主権**: すべてのデータとキーはあなたのインフラ内に留まります。
- **内部バインディング**: 外部への露出を防ぐため、ゲートウェイはデフォルトで `127.0.0.1` にバインドされます。

---

[Back to Index / インデックスに戻る](../README.md)
