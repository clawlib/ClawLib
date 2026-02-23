# Installation Guide 📦
# インストールガイド

[English](#english) | [日本語](#japanese)

---

<a name="english"></a>
## English

Installing ClawLib is straightforward. Depending on your use case, you might want to install the core library or the full suite of CLI tools.

### 1. Library Installation

If you are building a custom application and want to use ClawLib as a dependency:

```bash
npm install @claw/lib
```

### 2. Platform Specific Notes

#### Windows
- Ensure you have **PowerShell 7+** for the best terminal experience.
- Some tools may require `C++ Build Tools` for compiling native dependencies.

#### macOS
- Use `Homebrew` to install Node.js if you haven't already.

#### Linux
- Ensure `libvips` is installed if you plan on using image processing tools.
- Set up a `systemd` user service to keep your gateway running in the background.

### 3. Environment Configuration

Create a `.env` file in your project root:

```env
CLAW_MODEL_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxx
```

---

<a name="japanese"></a>
## 日本語

ClawLib のインストールは簡単です。ユースケースに応じて、コアライブラリまたは CLI ツール一式をインストールしてください。

### 1. ライブラリのインストール

カスタムアプリケーションを構築し、ClawLib を依存関係として使用する場合：

```bash
npm install @claw/lib
```

### 2. プラットフォーム別の注意事項

#### Windows
- 最適なターミナル体験のために、**PowerShell 7以上**を使用してください。
- 一部のツールでは、ネイティブ依存関係のコンパイルに `C++ Build Tools` が必要になる場合があります。

#### macOS
- まだインストールしていない場合は、`Homebrew` を使用して Node.js をインストールしてください。

#### Linux
- 画像処理ツールを使用する場合は、`libvips` がインストールされていることを確認してください。
- ゲートウェイをバックグラウンドで実行し続けるために、`systemd` ユーザーサービスを設定してください。

### 3. 環境設定

プロジェクトのルートに `.env` ファイルを作成してください。

```env
CLAW_MODEL_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxx
```

---

[Back to Index / インデックスに戻る](../README.md)
