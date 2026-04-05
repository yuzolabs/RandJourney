# RandJourney 🎯

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

RandJourney は、地図上にランダムな地点を生成する「ダーツ投げ」メタファーを採用した Web アプリケーションです。
どこに行くか迷ったときや、新しい場所を発見したいときに、指定した半径内からランダムに目的地を提案します。

## 主な機能

- **ランダム地点生成** - 地図上の中心点から指定した半径（km）内でランダムな地点を選択します。
- **半径コントロール** - 探索範囲をスライダーで簡単に調整可能です。
- **現在地取得** - ブラウザの Geolocation API を使用して、現在地を素早く中心に設定できます。
- **履歴管理** - 投げたダーツの結果を履歴として保存し、いつでも再確認できます。
- **URL共有** - 生成された地点を URL 経由で簡単に共有できます。
- **レスポンス設計** - PC とスマートフォンの両方に最適化されたインターフェースを提供します。

## 技術スタック

- Frontend: React 19, TypeScript, Vite
- Map: Leaflet, React Leaflet
- Styling: CSS Modules
- Testing: Vitest, React Testing Library
- Package Manager: Bun v1.3.6

## クイックスタート

### 前提条件

- [Bun](https://bun.sh/) v1.3.6 以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/RandJourney.git
cd RandJourney

# 依存関係のインストール
bun install --frozen-lockfile
```

### 開発コマンド

```bash
# 開発サーバーの起動
bun run dev

# ビルド（型チェック込み）
bun run build

# テストの実行
bun run test
```

## 使い方

1. 地図をドラッグして、中心地点（赤い円の中心）を決めます。
2. 下部のスライダーで、ダーツを投げる範囲（半径）を設定します。
3. ボタンをクリックすると、アニメーションと共にランダムな地点が選ばれます。
4. 結果カードに住所が表示されます。
5. 履歴パネルから過去の地点を振り返ることができます。

---

## 開発者向け情報

### Dev Containerでの開発

このプロジェクトは、VS Code の Dev Container（Remote Containers）をサポートしています。

#### 初期設定

このリポジトリを使用する前に、以下のコマンドを実行してください。

```bash
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
sed -i "s/RandJourney/$REPO_NAME/g" \
  .devcontainer/devcontainer.json

bun install --frozen-lockfile
prek install
```

#### 前提条件

##### Windowsの場合

Docker Desktop と WSL2 が必要です。
OpenCode の設定ファイルを WSL2側にコピーしておく必要があります。

##### macOS, Linuxの場合

Docker が必要です。

詳細な設定やトラブルシューティングについては、`.devcontainer`ディレクトリ内の設定ファイルを確認してください。

### ライセンス

opencode の設定ファイルについては、ホスト側の設定をそのまま使用できます。

### OpenCodeの設定

このリポジトリでは OpenCode を使うことを前提としているので、`$HOME/.local/share/opencode/auth.json`が存在しないと DevContainer の作成に失敗します。
Windows は WSL2 上、Mac の場合は通常の環境にて`opencode auth login`による認証を1回以上行ってください。

もし OpenCode にて認証をしなくても使えるモデルのみを使用する場合は、空ファイルとして作成してください。

### MCPサーバーのセットアップ

環境変数`CONTEXT7_API_KEY`に Context7の API キーを設定してください。

### Dev Containerについて

このリポジトリをデフォルトの名前で clone することを想定しています。
名前を変えると動作しなくなる可能性があります。

Dev Container 起動時には、`initializeCommand` で host 側の Git worktree メタデータを検証し、コンテナ専用の `.git` / `gitdir` オーバーレイファイルを `.devcontainer/` 配下に生成します。
host 側の実際の `.git` 管理ファイルは書き換えないため、worktree は先に host 側で正しく作成してから VS Code で開いてください。

具体的には以下の条件を満たしている必要があります。

- host 側で `bash` が利用できること
- worktree を `../<repo>.worktrees/<branch-name>` に配置すること
- worktree 管理ディレクトリ名と workspace ディレクトリ名が一致していること

#### git worktreeについて

このリポジトリは`git worktree`を使用して Dev Container 環境を構築できます。

但し、VSCode 仕様の worktree ディレクトリ構造を作成してください。構造は以下の通りです。

```txt
..
├── RandJourney
└── RandJourney.worktrees
    ├── feat-branch1
    └── fix-branch2
```

`fix-branch2/.git` は Git worktree の管理ファイルです。Dev Container ではこの実ファイルを直接書き換えず、コンテナ内だけで使うオーバーレイファイルを mount して current worktree を参照させます。

過去バージョンの設定で `/workspace` を指す壊れた worktree メタデータが残っている場合は、main リポジトリ側で以下を実行して掃除してください。

```bash
git -C ../RandJourney worktree prune --expire now
```

#### worktrunkを使用する場合

以下の設定を`~/.config/worktrunk`に追加します。

```txt
worktree-path = "{{ repo_path }}/../{{ repo }}.worktrees/{{ branch | sanitize }}"
```

```bash
wt switch --create feat-branch1
```

### DevContainer CLIの使い方

DevContainer CLI を使用することで、VSCode 経由の Dev Container よりも軽量かつ高速にコンテナの準備ができます。
Vibe Coding にはこちらがおすすめです。

#### Windowsの場合

Docker Desktop を起動し、以下のコマンドで Dev Container 環境を作成します。
コンテナがない場合は自動で作成します。

```batch
.\.devcontainer\scripts\devcontainer-exec.bat
```

#### macOS, Linuxの場合

```bash
.devcontainer/scripts/devcontainer-exec.sh
```

[MIT License](LICENSE)
