# The Claw Kernel 🧠
# Claw カーネル

[English](#english) | [日本語](#japanese)

---

<a name="english"></a>
## English

The **Kernel** is the heart of ClawLib. It is responsible for message processing, agent state management, and LLM orchestration.

### Key Responsibilities

1. **Session Management**: Keeping track of multiple users and their respective conversation contexts.
2. **Memory Orchestration**: Utilizing Short-Term (recent messages) and Long-Term memory.
3. **Intent Extraction**: Pre-processing messages to determine if actions are requested.
4. **Tool Execution**: Calling library functions and feeding results back to the LLM.

### Kernel Components

#### The Orchestrator
The Orchestrator defines the main loop of the agent. It manages the "Thinking" process:
- **Thinking State**: Processing or waiting for LLM output.
- **Action State**: Executing a tool.
- **Delivery State**: Formatting the final response for a channel.

---

<a name="japanese"></a>
## 日本語

**カーネル**は ClawLib の心臓部です。メッセージ処理、エージェントの状態管理、および LLM のオーケストレーションを担当します。

### 主な責務

1. **セッション管理**: 複数のユーザーとそれぞれの会話コンテキストを追跡します。
2. **メモリ・オーケストレーション**: 短期メモリ（最近のメッセージ）と長期メモリを活用します。
3. **意図抽出**: メッセージを前処理し、アクションが要求されているか判断します。
4. **ツール実行**: ライブラリ関数を呼び出し、その結果を LLM にフィードバックします。

### カーネルのコンポーネント

#### オーケストレーター
オーケストレーターはエージェントのメインループを定義し、「思考」プロセスを管理します。
- **思考状態**: 処理中、または LLM の出力を待機している状態。
- **アクション状態**: ツールを実行している状態。
- **配信状態**: 最終的な回答をチャネル向けにフォーマットしている状態。

---

[Back to Index / インデックスに戻る](../README.md)
