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

[MIT License](LICENSE)
