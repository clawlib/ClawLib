# Extending with Tools 🔧
# ツールによる拡張

[English](#english) | [日本語](#japanese)

---

<a name="english"></a>
## English

Tools are the "hands" of your agent. ClawLib makes it easy to create and register custom tools to extend your agent's capabilities.

### Defining a Tool

A tool consists of a **Schema** (telling the LLM how to use it) and an **Implementation** (the code that runs).

### Built-in Modules

ClawLib comes with several pre-built toolkits:
- **FileSystem**: Read, write, and search local directories.
- **WebBrowser**: Scrape text from URLs and perform searches.
- **TimeUtils**: Handle timezone conversions and reminders.
- **System**: Monitor CPU usage, memory, and processes.

### Registering Tools

Add your tools to the Kernel during initialization:

```typescript
kernel.registerTool(weatherTool);
```

---

<a name="japanese"></a>
## 日本語

ツールはエージェントの「手」となります。ClawLib を使用すると、カスタムツールを簡単に作成および登録して、エージェントの機能を拡張できます。

### ツールの定義

ツールは、**スキーマ**（LLM に使い方を教えるもの）と**実装**（実行されるコード）で構成されます。

### 組み込みモジュール

ClawLib には、いくつかのビルド済みツールキットが付属しています。
- **ファイルシステム**: ローカルディレクトリの読み取り、書き込み、検索。
- **ウェブブラウザ**: URL からテキストをスクレイピングし、検索を実行。
- **タイムユーティリティ**: タイムゾーンの変換やリマインダーの処理。
- **システム**: CPU 使用率、メモリ、プロセスの監視。

### ツールの登録

初期化中にツールをカーネルに追加します。

```typescript
kernel.registerTool(weatherTool);
```

---

[Back to Index / インデックスに戻る](../README.md)
