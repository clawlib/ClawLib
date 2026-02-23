# Security Model 🛡️
# セキュリティモデル

[English](#english) | [日本語](#japanese)

---

<a name="english"></a>
## English

Security is the top priority in ClawLib. We implement a **Defense-in-Depth** strategy.

### 1. DM Pairing Policy
To prevent unauthorized access, ClawLib uses a pairing system.
- **Default State**: Unknown senders are ignored.
- **Pairing Code**: New senders must be approved via a unique 6-digit code shown in your terminal.

### 2. Tool Permissions
Tools are categorized by risk level:
- **READ-ONLY**: Public APIs, reading files (Low risk).
- **WRITE**: Creating files, sending emails (Medium risk).
- **SENSITIVE**: Shell commands, deleting data (High risk).

### 3. Data Protection
- **No Cloud Storage**: Data stays on your machine.
- **Sanitization**: Tool outputs are cleaned to prevent prompt injection.

---

<a name="japanese"></a>
## 日本語

ClawLib ではセキュリティが最優先事項です。私たちは**防御層（Defense-in-Depth）**戦略を導入しています。

### 1. DM ペアリングポリシー
不正アクセスを防ぐため、ClawLib はペアリングシステムを使用しています。
- **デフォルト状態**: 未知の送信者は無視されます。
- **ペアリングコード**: 新しい送信者は、ターミナルに表示される一意の 6 桁のコードを介して承認される必要があります。

### 2. ツールの権限
ツールはリスクレベルによって分類されます。
- **読み取り専用**: 公開 API、ファイルの読み取り（低リスク）。
- **書き込み**: ファイルの作成、メールの送信（中リスク）。
- **機密処理**: シェルコマンド、データの削除（高リスク）。

### 3. データ保護
- **クラウドストレージなし**: データはあなたのマシン内に留まります。
- **サニタイズ**: プロンプトインジェクションを防ぐため、ツールの出力はクリーンアップされます。

---

[Back to Index / インデックスに戻る](../README.md)
